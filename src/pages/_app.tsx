import React from "react";
import { AppProps } from "next/app";
import "antd/dist/antd.css";
import "../styles/global.css";
import LayoutComponent from "@/components/layout";
import Router from "next/router";
import NProgress from "nprogress";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  );
}

export default MyApp;
