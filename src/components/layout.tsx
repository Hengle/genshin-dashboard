import { Breadcrumb, Layout, Menu } from "antd";
import React from "react";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import _ from "lodash";

const links = {
  Home: "/",
  Database: {
    Achievements: "/database/achievements",
    Characters: "/database/characters",
    Materials: "/database/materials",
  },
};

const linkBreadcrumbs = _.fromPairs(
  _.flatMap(Object.entries(links), (link) => {
    const array = link[1];
    return typeof array === "string"
      ? [[[link[0]], link[1]]]
      : Object.entries(array).map(([key, value]) => [[link[0], key], value]);
  }).map(([key, value]) => [value, key]),
);

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const LayoutComponent = ({ children }: Props) => {
  const router = useRouter();

  return (
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
        <div className="main">
          {linkBreadcrumbs[router.pathname] && (
            <Breadcrumb style={{ marginBottom: 10 }}>
              {linkBreadcrumbs[router.pathname].map((v: string) => (
                <Breadcrumb.Item key={v}>{v}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}
          {children}
        </div>
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
};

export default LayoutComponent;
