import { NextApiRequest, NextApiResponse } from "next";
import { fetchAchievements } from "@/api/database/achievement";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await fetchAchievements());
}
