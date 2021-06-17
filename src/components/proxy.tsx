import Image, { ImageProps } from "next/image";
import React from "react";

const ProxiedImage = (prop: ImageProps) => (
  <Image {...prop} src={`/api/proxy/image?url=${encodeURIComponent(prop.src)}`} />
);

export default ProxiedImage;
