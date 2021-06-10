import { Layout, Menu } from "antd";
import React from "react";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Link from "next/link";

const links = {
  Home: "/",
  Database: {
    Achievements: "/database/achievements",
    Materials: "/database/materials",
  },
};

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const LayoutComponent = ({ children }: Props) => (
  <Layout className="layout">
    <Header>
      <b className="logo">Genshin Dashboard</b>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        {Object.entries(links).map(([name, destination]) =>
          typeof destination === "string" ? (
            <Menu.Item key={destination}>
              <Link href={destination}>{name}</Link>
            </Menu.Item>
          ) : (
            <Menu.SubMenu title={name} key={name}>
              {Object.entries(destination).map(([name, destination]) => (
                <Menu.Item key={destination}>
                  <Link href={destination}>{name}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ),
        )}
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
