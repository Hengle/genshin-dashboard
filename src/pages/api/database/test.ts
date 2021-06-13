import { NextApiRequest, NextApiResponse } from "next";
import { fetchCharacters } from "@/api/database/avatar/character";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res
    .status(200)
    .json(
      Object.values(await fetchCharacters()).filter((v) => v.name === "Amber"),
    );
}
