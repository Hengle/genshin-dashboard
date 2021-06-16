import React from "react";
import { AppProps } from "next/app";
import "antd/dist/antd.css";
import "../styles/global.css";
import LayoutComponent from "@/components/layout";
import Router from "next/router";
import NProgress from "nprogress";
import "../styles/nprogress.css";
import Seo from "@/components/seo";
import { QueryClient, QueryClientProvider } from "react-query";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutComponent>
        <Seo title="Home" />
        <Component {...pageProps} />
      </LayoutComponent>
    </QueryClientProvider>
  );
}

export default MyApp;
