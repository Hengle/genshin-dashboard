import React from "react";
import { InferGetStaticPropsType } from "next";
import { ModularColumns, ModularTable } from "@/components/table";
import { QuestionOutlined, StarFilled } from "@ant-design/icons";
import FallbackImage from "@/components/image";
import { fetchMaterials, MaterialData } from "@/api/database/material";

const getColumns = (
  materials: MaterialData[],
): ModularColumns<MaterialData> => [
  {
    title: "Image",
    width: 10,
    render: (_, record) =>
      record.icon?.length === 0 ? (
        ""
      ) : (
        <FallbackImage
          src={`https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/${encodeURIComponent(
            record.icon ?? "",
          )}.png`}
          attributes={{ width: "100%" }}
        >
          <QuestionOutlined style={{ textAlign: "center", width: "100%" }} />
        </FallbackImage>
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
    filters: [...new Set(materials.map((v) => v.type))]
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

const Materials = ({
  materials,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <h1>Database: Materials</h1>
      <p>
        <b>NOTE</b>: Some items may be unavailable in game.
      </p>
      <ModularTable
        columns={getColumns(materials)}
        dataSource={materials}
        size="middle"
        expandable={{
          expandedRowRender: (record) => (
            <div className="expanded-row">
              <b>Description</b>
              <p>{record.description}</p>

              {record.effectDescription.length > 0 && (
                <div>
                  <b>Effects</b>
                  <p>{record.effectDescription}</p>
                </div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export const getStaticProps = async () => ({
  props: {
    materials: Object.values(await fetchMaterials())
      .filter((v) => v.type.length > 0)
      .map((v) => ({
        ...v,
        key: v.id,
      })),
  },
});

export default Materials;
