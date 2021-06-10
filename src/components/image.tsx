import { useState } from "react";
import React from "react";

interface Props {
  src: string;
  children?: JSX.Element;
  attributes?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
}

const FallbackImage = ({ src, children, attributes }: Props) => {
  const [failed, setFailed] = useState(false);

  if (!failed)
    return (
      <img
        {...(attributes ?? {})}
        src={src}
        alt=""
        onError={() => setFailed(true)}
      />
    );

  if (children === undefined) return <span />;
  return children;
};

export default FallbackImage;
