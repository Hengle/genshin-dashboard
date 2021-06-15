import React from "react";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  render(): JSX.Element {
    // noinspection HtmlRequiredTitleElement,HtmlUnknownTarget
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(ctx: DocumentContext) {
    return await Document.getInitialProps(ctx);
  }
}

export default MyDocument;
