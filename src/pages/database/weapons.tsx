import React, { useState } from "react";
import { InferGetStaticPropsType } from "next";
import { ModularColumns, ModularTable } from "@/components/table";
import { StarFilled } from "@ant-design/icons";
import { StatType, WeaponData } from "@/types/database";
import { fetchWeapons } from "@/api/database/weapon/weapon";
import { calculateWeaponStat } from "@/util/avatar";
import { InputNumber } from "antd";
import Seo from "@/components/seo";
import Image from "next/image";

const getColumns = (weapons: WeaponData[]): ModularColumns<WeaponData> => [
  {
    title: "Image",
    width: 10,
    render: (_, record) =>
      record.icon?.length === 0 ? (
        ""
      ) : (
        <Image
          src={`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${encodeURIComponent(
            record.icon ?? "",
          )}.png`}
          width={50}
          height={50}
        />
      ),
  },
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    searchable: true,
    onFilter: (value, record) =>
      typeof value === "string"
        ? record.name.toLowerCase().indexOf(value.toLowerCase()) === 0
        : false,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "stars",
    title: "Stars",
    dataIndex: "stars",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.stars - b.stars,
    render: (_, record) => (
      <>
        <StarFilled style={{ color: "gold" }} /> {record.stars}
      </>
    ),
  },
  {
    key: "type",
    title: "Type",
    dataIndex: "type",
    filters: [...new Set(weapons.map((v) => v.type))]
      .filter((v) => v.length > 0)
      .map((v) => {
        return {
          value: v,
          text: v,
        };
      }),
    onFilter: (value, record) =>
      typeof value === "string" ? record.type === value : false,
  },
  {
    key: "id",
    title: "ID",
    dataIndex: "id",
    searchable: true,
    onFilter: (value, record) =>
      typeof value === "number" ? record.id === value : false,
    sorter: (a, b) => a.stars - b.stars,
  },
];

const Weapons = ({
  weapons,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [level, setLevel] = useState(1);
  const [ascension, setAscension] = useState(1);

  return (
    <div>
      <Seo title="Weapons" />
      <h1>Database: Weapons</h1>
      <InputNumber min={1} max={90} onChange={(level) => setLevel(level)} />
      <InputNumber
        min={1}
        max={6}
        onChange={(ascension) => setAscension(ascension)}
      />
      <ModularTable
        columns={getColumns(weapons)}
        dataSource={weapons}
        size="middle"
        expandable={{
          expandedRowRender: (record) => (
            <div className="expanded-row">
              <b>Description</b>
              <p>{record.description}</p>

              {(
                [
                  "HP",
                  "ATTACK",
                  "DEFENCE",
                  "STAMINA",
                  "CRITICAL_RATE",
                  "CRITICAL_DAMAGE",
                  "CHARGE_EFFICIENCY",
                  "ELEMENTAL_MASTERY",
                ] as StatType[]
              ).map((element) => (
                <>
                  <b>{element}</b>
                  <p>
                    {calculateWeaponStat(record, element, level, ascension)}
                  </p>
                </>
              ))}
            </div>
          ),
        }}
      />
    </div>
  );
};

export const getStaticProps = async () => ({
  props: {
    weapons: Object.values(await fetchWeapons())
      .filter((v) => v.name)
      .map((v) => ({
        ...v,
        key: v.id,
      })),
  },
});

export default Weapons;
