import { get, IncomingMessage, ServerResponse } from "http";
import { getSongs, getSongById, addSong } from "../controllers/songs";
import { log } from "console";
// https://localhost:4000/songs
export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    const parts = req.url.split("/");
    const id = parts[2] ? parseInt(parts[2]) : undefined;
    if (req.method === "GET" && !id) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getSongs()));
      return;
    }
    if (req.method === "GET" && id) {
      //   const song = getSongById(id);
      //   res.writeHead(song ? 200 : 404, { "content-type": "application/json" });
      //   res.end(JSON.stringify(song || { message: "Song not found" }));
      //   return;
      if (isNaN(id)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid song ID" }));
        return;
      }
      const song = getSongById(id);
      if (!song) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Song not found" }));
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(song));
      return;
    }
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        //
        //
        try {
          const {title, artist, duration } = JSON.parse(body);
          if (!title || typeof title !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Title is required" }));
          }
          if (!artist || typeof artist !== "string") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Artist is required" }));
          }
          if (!duration || typeof duration !== "number") {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Duration is required" }));
          }
          const newSong = addSong(title, artist, duration);
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify(newSong));
        } catch (error) {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }
    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method Not Allowed on /songs" }));
    return;
  }
};





