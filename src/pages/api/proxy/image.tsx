import { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "fs/promises";
import { join } from "path";
import getConfig from "next/config";
import fetch from "node-fetch";
import { sendBuffer, sendError } from "@/util/request";
import { promisify } from "util";
const { serverRuntimeConfig } = getConfig();

const sites: {
  match: RegExp;
  resource: string;
}[] = [
  {
    match:
      /^https:\/\/upload-os-bbs.mihoyo.com\/game_record\/genshin\/equip\/[A-Za-z0-9_]*\.png$/g.compile(),
    resource: "./src/assets/images/paimon/thinking.png",
  },
];

type Query = {
  url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query as Query;
  if (!url) return sendError(res, { message: "URL not present" });

  const site = sites.find((site) => site.match.test(url));
  if (!site) return sendError(res, { message: "Invalid site" });

  const response = await fetch(url);
  if (!response.ok) {
    const path = join(serverRuntimeConfig.PROJECT_ROOT, site.resource);
    const image = await readFile(path);
    res.writeHead(200, { "Content-Type": "image/png", "Content-Length": image.length });
    sendBuffer(res, image);
    return promisify(res.end);
  }

  const image = await response.buffer();
  res.writeHead(200, { "Content-Type": "image/png", "Content-Length": image.length });
  sendBuffer(res, image);
  return promisify(res.end);
}
