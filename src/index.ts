import { Hono } from "hono";
import { NpmRegistry } from "npm-registry-sdk";

// Use default registry URLs
const registry = new NpmRegistry();

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/:mins{[0-9]+}/:name/:version?", async (c) => {
  const params = c.req.param();

  const mins = parseInt(params.mins) * 60_000;
  const lockDate = new Date(Date.now() - mins);

  const pkgInfo = await registry.getPackage(params.name);
  const distTags = pkgInfo["dist-tags"];

  let latestVersion: string | undefined;
  let latestDate: Date | undefined;
  const excludeKeys = ["created", "modified"];
  for (let pkgVersion in pkgInfo.time) {
    if (excludeKeys.includes(pkgVersion)) {
      continue;
    }

    const pkgDate = new Date(pkgInfo.time[pkgVersion]);
    if (pkgDate > lockDate) {
      delete pkgInfo.versions[pkgVersion];
      delete pkgInfo.time[pkgVersion];

      for (let tagName in distTags) {
        if (pkgVersion === distTags[tagName]) {
          delete distTags[tagName];
        }
      }
    } else {
      if (!latestDate || pkgDate > latestDate) {
        latestDate = pkgDate;
        latestVersion = pkgVersion;
      }
    }
  }
  if (latestVersion) {
    distTags.latest = latestVersion;
  }

  if (!params.version) {
    return c.json(pkgInfo);
  }

  const version = params.version === "latest" ? latestVersion : params.version;
  if (version && version in pkgInfo.versions) {
    const pkg = await registry.getPackageVersion(params.name, version);
    return c.json(pkg);
  }

  return c.json({}, 404);
});

export default app;
