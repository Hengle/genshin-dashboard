import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

const FallbackImage = (
  props: ImageProps & { fallback: React.ReactElement },
) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ width: props.width, height: props.height }}>
      <Image
        {...props}
        onLoad={() => {
          console.log("loaded");
          setLoaded(true);
        }}
      />
      {!loaded && props.fallback}
    </div>
  );
};

export default FallbackImage;
