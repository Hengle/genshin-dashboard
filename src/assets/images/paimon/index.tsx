import thinking from "./thinking.png";
import React from "react";
import Image from "next/image";

type ImageProps = {
  width?: number;
  height?: number;
};

export const PaimonThinking = ({ width, height }: ImageProps) => (
  <Image src={thinking} width={width ?? 128} height={height ?? 128} />
);
