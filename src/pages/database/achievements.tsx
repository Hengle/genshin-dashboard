import React from "react";
import { InferGetStaticPropsType } from "next";
import { ModularColumns, ModularTable } from "@/components/table";
import { Achievement, fetchAchievements } from "@/api/database/achievement";

const getColumns = (
  achievements: Achievement[],
): ModularColumns<Achievement> => [
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
      .map((v) => {
        return {
          value: v,
          text: v,
        };
      }),
    onFilter: (value, record) =>
      typeof value === "string" ? record.category.name === value : false,
  },
];

const achievementStringifier: Record<
  string,
  (achievement: Achievement) => string
> = {
  OBTAIN_MATERIAL: (achievement) =>
    `Obtain ${achievement.progress} of the following materials:\n${(
      achievement.trigger.items?.map((v) => v.name) ?? []
    ).join(", ")}`,
  FORGE_WEAPON: (achievement) =>
    `Forge ${achievement.progress} weapons of ${
      achievement.trigger.stars ?? 0
    } stars.`,
  UNLOCK_RECIPES: (achievement) => `Unlock ${achievement.progress} recipes.`,
  MASTER_RECIPES: (achievement) =>
    `Unlock auto-cook on ${achievement.progress} recipes.`,
};

const Achievements = ({
  achievements,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div>
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
                {record.reward.items
                  .map((item) => `${item.amount}x ${item.item.name}`)
                  .join(", ")}
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
