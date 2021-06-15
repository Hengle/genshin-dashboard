import Favicon from "../../public/favicon.png";
import { NextSeo } from "next-seo";
import React from "react";

type Props = {
  title: string;
  description?: string;
};

const Seo = ({ title, description }: Props) => (
  <NextSeo
    title={`Genshin Dashboard | ${title}`}
    description={description ?? "Your #1 assistant for Genshin Impact."}
    openGraph={{
      type: "website",
      locale: "en_EN",
      title: `Genshin Dashboard | ${title}`,
      images: [
        {
          url: Favicon,
          width: 128,
          height: 128,
        },
      ],
    }}
  />
);

export default Seo;
