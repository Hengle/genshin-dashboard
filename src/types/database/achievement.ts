import { RewardData } from "@/types/database/reward";
import { MaterialData } from "@/types/database/material";

export type AchievementMap = Record<number, Achievement>;
export type AchievementCategoryMap = Record<number, AchievementCategory>;

export type AchievementExcelConfigData = {
  TitleTextMapHash: number;
  DescTextMapHash: number;
  FinishRewardId: number;
  Id: number;
  GoalId: number;
  Progress: number;
  PreStageAchievementId: number;
  TriggerConfig: {
    TriggerType: string;
    ParamList: string[];
  };
};

export type Achievement = {
  id: number;
  name: string;
  description: string;
  progress: number;
  reward: RewardData;
  trigger: AchievementTrigger;
  category: AchievementCategory;
  requirementId?: number;
};

export interface AchievementTrigger {
  type: string;
  parameters?: string[];
  items?: MaterialData[];
  stars?: number;
}

export type AchievementGoalExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
};

export type AchievementCategory = {
  id: number;
  name: string;
};
