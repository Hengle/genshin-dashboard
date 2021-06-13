import { NextApiRequest, NextApiResponse } from "next";
import { fetchWeapons } from "@/api/database/weapon/weapon";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await fetchWeapons());
  // res.status(200).json((await fetchAvatars())[10000021]);
}
