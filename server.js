import "dotenv/config";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import mqtt from "mqtt"; // import namespace "mqtt"
import db from "./db/db.js";
import { eq } from "drizzle-orm";

import { tag_assignments } from "./db/schema.js";

let client = mqtt.connect(process.env.MQTT_SERVER, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
}); // create a client

const topic = "nfc-spot/#";

client.on("connect", () => {
  console.log("connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

client.on("message", async (topic, message) => {
  // message is Buffer
  const tagId = message.toString();
  console.log(`Received message on topic '${topic}': ${tagId}`);
  const existingTags = await db
    .select()
    .from(tag_assignments)
    .where(eq(tag_assignments.tag_id, tagId));

  if (existingTags.length === 0) {
    await db.insert(tag_assignments).values({ tag_id: tagId });
    console.log("Inserted new tag ", tagId);
  } else {
    console.log("Tag already exists, switching playback", tagId);
    client.publish(
      "nfc-player/spotify",
      JSON.stringify({
        spotifyId: existingTags[0].spotify_id,
        spotifyType: existingTags[0].spotify_type,
      }),
    );
  }
});

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3008;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);
