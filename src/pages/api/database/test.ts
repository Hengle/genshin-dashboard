import { NextApiRequest, NextApiResponse } from "next";
import { fetchAvatarAscensions } from "@/api/database/avatar/ascend";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await fetchAvatarAscensions());
  // res.status(200).json((await fetchAvatars())[10000021]);
}
