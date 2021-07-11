import { Button, InputNumber, Space, Typography } from "antd";
import { getMaxAscension } from "@/util/avatar";
import React, { Dispatch, SetStateAction, useState } from "react";
import { AscensionList } from "@/types/database";
import _ from "lodash";

type StatsState = {
  level: number;
  ascension: number;
};

type Props = {
  ascensions: AscensionList;
  stats: [StatsState, Dispatch<SetStateAction<StatsState>>];
};

const LevelSelector = ({ ascensions, stats: state }: Props) => {
  const [stats, setStats] = state;
  const [ascended, setAscended] = useState(false);

  const data = Object.values(ascensions.ascensions);
  const maxLevel = _.last(data)?.rewards.unlockLevel ?? 1;
  const ascension = _.last(data.filter((value) => value.rewards.unlockLevel <= stats.level));

  const calculateStats = (level: number, ascended: boolean) => {
    const ascension = _.last(data.filter((value) => value.rewards.unlockLevel <= level));
    return {
      ascension:
        (ascension?.level ?? 0) +
        (ascended || (ascension && ascension?.rewards.unlockLevel !== level) ? 1 : 0),
      level,
    } as StatsState;
  };

  return (
    <Space>
      <Typography.Text>Level</Typography.Text>
      <InputNumber
        min={1}
        max={maxLevel}
        defaultValue={1}
        onChange={(level) => {
          console.log(level);
          setStats(calculateStats(level ?? 1, ascended));
        }}
      />
      <Button
        onClick={() => {
          setAscended(!ascended);
          setStats(calculateStats(stats.level, !ascended));
        }}
        type={ascended ? "primary" : "default"}
        disabled={
          ascension?.rewards.unlockLevel !== stats.level ||
          ascension?.level == getMaxAscension(ascensions)
        }
      >
        Ascended
      </Button>
    </Space>
  );
};

export default LevelSelector;
