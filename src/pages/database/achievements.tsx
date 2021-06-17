import React from "react";
import { InferGetStaticPropsType } from "next";
import { ModularColumns, ModularTable } from "@/components/table";
import { fetchAchievements } from "@/api/database/achievement";
import { Achievement } from "@/types/database";
import Seo from "@/components/seo";
import { achievementStringifier } from "@/assets/localization/localization";

const getColumns = (achievements: Achievement[]): ModularColumns<Achievement> => [
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
    key: "category",
    title: "Category",
    dataIndex: "category",
    render: (_, record) => <>{record.category.name}</>,
    filters: [...new Set(achievements.map((v) => v.category.name))]
      .filter((v) => v.length > 0)
      .map((v) => ({
        value: v,
        text: v,
      })),
    onFilter: (value, record) =>
      typeof value === "string" ? record.category.name === value : false,
  },
];

const Achievements = ({ achievements }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
      <Seo title="Achievements" />
      <h1>Database: Achievement</h1>
      <ModularTable
        columns={getColumns(achievements)}
        dataSource={achievements}
        size="middle"
        expandable={{
          expandedRowRender: (record) => (
            <div className="expanded-row">
              <b>Description</b>
              <p>{record.description}</p>

              <b>Required</b>
              <p>{record.progress}</p>

              <b>Requirement</b>
              <p>
                {achievementStringifier[record.trigger.type]?.(record) ??
                  JSON.stringify(record.trigger)}
              </p>

              <b>Rewards</b>
              <p>
                {record.reward.items.map((item) => `${item.amount}x ${item.item.name}`).join(", ")}
              </p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export const getStaticProps = async () => ({
  props: {
    achievements: Object.values(await fetchAchievements())
      .filter((v) => v.name.length > 0)
      .map((v) => ({
        ...v,
        key: v.id,
      })),
  },
});

export default Achievements;
