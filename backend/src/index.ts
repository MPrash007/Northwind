import "dotenv/config"
import express from 'express'
import cors from "cors"

import fs from "node:fs";
import path from "node:path";

import { clerkMiddleware } from '@clerk/express';
import { clerkWebhookHandler } from './webhooks/clerk';
import { getEnv } from './lib/env';

const env = getEnv()
const app = express();

// ── Health check (no middleware, responds immediately) ──
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const rawJson = express.raw({type: "application/json", limit: "1mb"});

// it's important that you don't parse the webhook event data, it should be in the raw format

app.post("/webhooks/clerk", rawJson, (req,res) =>{
    void clerkWebhookHandler(req,res);
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

// ── API routes would go here ──

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

app.listen(env.PORT, () => console.log("listening on port:", env.PORT))