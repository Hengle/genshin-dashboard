import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import fetch from "node-fetch";
import { sendBuffer, sendError } from "@/util/request";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { join } from "path";

const { serverRuntimeConfig } = getConfig();

const sites: {
  match: RegExp;
  resource: string;
}[] = [
  {
    match:
      /^https:\/\/upload-os-bbs.mihoyo.com\/game_record\/genshin\/equip\/[A-Za-z0-9_]*\.png$/g.compile(),
    resource: "public/images/paimon/thinking.png",
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
  const image = response.ok
    ? await response.buffer()
    : await readFile(join(serverRuntimeConfig.PROJECT_ROOT, site.resource));

  res.writeHead(200, { "Content-Type": "image/png", "Content-Length": image.length });
  sendBuffer(res, image);
  return promisify(res.end);
}
