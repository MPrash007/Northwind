import "dotenv/config"
import express from 'express'
import cors from "cors"

import fs from "node:fs";
import path from "node:path";

import * as Sentry from "@sentry/node";

import { clerkMiddleware } from '@clerk/express';
import { clerkWebhookHandler } from './webhooks/clerk';
import { getEnv } from './lib/env';
import keepAliveCron from "./lib/cron";

import meRouter from "./routes/meRouter";
import productRouter from "./routes/productRouter";
import streamRouter from "./routes/streamRouter";
import checkoutRouter from "./routes/checkoutRouter";
import { polarWebhookHandler } from "./webhooks/polar";
import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser";

const env = getEnv()
const app = express();



const rawJson = express.raw({type: "application/json", limit: "1mb"});

// it's important that you don't parse the webhook event data, it should be in the raw format

app.post("/webhooks/clerk", rawJson, (req,res) =>{
    void clerkWebhookHandler(req,res);
});
app.post("/webhooks/polar", rawJson, (req,res) =>{
    void polarWebhookHandler(req,res);
});

// ── Serve static files BEFORE auth middleware ──
// This ensures index.html, JS, CSS, and images are served instantly
// without waiting for Clerk's middleware to verify tokens.
const publicDir = path.join(process.cwd(), "public");
const hasPublicDir = fs.existsSync(publicDir);

if (hasPublicDir) {
  app.use(express.static(publicDir));
}

// ── API middleware (only needed for API routes) ──
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware);
app.use(sentryClerkUserMiddleware)

// ── Health check (no middleware, responds immediately) ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok"});
});

// ── API routes would go here ──

app.use("/api/me", meRouter);
app.use("/api/products", productRouter);
app.use("/api/stream", streamRouter);
app.use("/api/checkout", checkoutRouter);

// ── SPA catch-all (serves index.html for client-side routing) ──
if (hasPublicDir) {
  app.get("/{*any}", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks") || req.path.startsWith("/health")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

// sentry will be attached to the response object
Sentry.setupExpressErrorHandler(app);

app.use(
  (_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const sentryId = (res as express.Response & { sentry?: string }).sentry;

    res.status(500).json({
      error: "Internal server error",
      ...(sentryId !== undefined && { sentryId }),
    });
  },
);


app.listen(env.PORT, () => {
  console.log("listening on port:", env.PORT)
  if(env.NODE_ENV === "production"){
    keepAliveCron.start();
  }
}) 