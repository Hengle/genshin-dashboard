import { Layout, Menu } from "antd";
import React from "react";
import { Content, Footer, Header } from "antd/lib/layout/layout";

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const LayoutComponent = ({ children }: Props) => (
  <Layout className="layout">
    <Header>
      <b className="logo">Genshin Dashboard</b>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home">Home</Menu.Item>
      </Menu>
    </Header>
    <Content className="content">
      <div className="main">{children}</div>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Koding Dev © {new Date().getFullYear()}
      <br />
      <span style={{ color: "gray" }}>
        We are not affiliated with Genshin Impact or MiHoYo.
      </span>
    </Footer>
  </Layout>
);

export default LayoutComponent;
