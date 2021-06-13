import { NextApiRequest, NextApiResponse } from "next";
import { fetchFetterInfo } from "@/api/database/fetter/info";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await fetchFetterInfo());
  // res.status(200).json((await fetchAvatars())[10000021]);
}
