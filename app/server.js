const express = require("express");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 8080;

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequests);

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequests.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    application: "argocd-gitops-demo",
    message: "Hello from Kubernetes GitOps!",
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.ENVIRONMENT || "dev"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/ready", (req, res) => {
  res.status(200).json({ status: "ready" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening on port ${port}`);
});