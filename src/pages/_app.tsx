import React from "react";
import { AppProps } from "next/app";
import "antd/dist/antd.css";
import "../styles/global.css";
import LayoutComponent from "@/components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  );
}

export default MyApp;
