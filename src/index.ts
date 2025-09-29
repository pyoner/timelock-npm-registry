import { Hono } from "hono";
import { NpmRegistry, PackageInfo } from "npm-registry-sdk";

// Use default registry URLs
const registry = new NpmRegistry();

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/:mins{[0-9]+}/:name/:version?", async (c) => {
  const params = c.req.param();

  const mins = parseInt(params.mins) * 60_000;
  const date = new Date(Date.now() - mins);
  console.log(date);

  const pkgInfo = await registry.getPackage(params.name);

  const excludeKeys = ["created", "modified"];
  for (let k in pkgInfo.time) {
    if (excludeKeys.includes(k)) {
      continue;
    }

    const pkgDate = new Date(pkgInfo.time[k]);
    if (pkgDate > date) {
      delete pkgInfo.versions[k];
      delete pkgInfo.time[k];
      console.log("removed version:", k, pkgDate.toISOString());
    }
  }

  return c.json(pkgInfo);
});

export default app;
