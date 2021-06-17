import { NextApiResponse } from "next";
import { PassThrough } from "stream";
import { WebError } from "@/types/next";

export const sendBuffer = (res: NextApiResponse, data: Buffer) => {
  const stream = new PassThrough();
  stream.end(data);
  return stream.pipe(res);
};

export const sendError = (res: NextApiResponse, error: WebError) => res.status(400).json(error);
