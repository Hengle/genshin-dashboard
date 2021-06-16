import { NextApiRequest, NextApiResponse } from "next";
import { fetchTextMap } from "@/api/database/text";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  // res
  //   .status(200)
  //   .json(
  //     (await import("../../../external/GenshinData/TextMap/TextMapEN.json"))
  //       .default,
  //   );
  res.status(200).json(await fetchTextMap());
  // res.status(200).json((await fetchAvatars())[10000021]);
}
