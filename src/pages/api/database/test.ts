import { NextApiRequest, NextApiResponse } from "next";
import { fetchAvatars } from "@/api/database/avatar/character";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  // res.status(200).json(await fetchWeapons());
  res.status(200).json((await fetchAvatars())[10000021]);
}
