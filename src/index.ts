import { Hono } from "hono";
import { NpmRegistry, PackageInfo } from "npm-registry-sdk";

// Use default registry URLs
const registry = new NpmRegistry();

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/:mins{[0-9]+}/:name/:version?", async (c) => {
  const params = c.req.param();

  const mins = parseInt(params.mins) * 60_000;
  const lockDate = new Date(Date.now() - mins);
  console.log(lockDate);

  const pkgInfo = await registry.getPackage(params.name);

  let latestVersion: string | undefined;
  let latestDate: Date | undefined;
  const excludeKeys = ["created", "modified"];
  for (let k in pkgInfo.time) {
    if (excludeKeys.includes(k)) {
      continue;
    }

    const pkgDate = new Date(pkgInfo.time[k]);
    if (pkgDate > lockDate) {
      delete pkgInfo.versions[k];
      delete pkgInfo.time[k];
      console.log("removed version:", k, pkgDate.toISOString());
    } else {
      if (!latestDate || pkgDate > latestDate) {
        latestDate = pkgDate;
        latestVersion = k;
      }
    }
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
