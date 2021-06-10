import { fetchRewards, RewardData, RewardMap } from "@/api/database/reward";
import {
  fetchMaterials,
  MaterialData,
  MaterialMap,
} from "@/api/database/material";
import { fetchTextMap, TextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";

type AchievementMap = Record<number, Achievement>;
type AchievementCategoryMap = Record<number, AchievementCategory>;

type AchievementExcelConfigData = {
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

interface AchievementTrigger {
  type: string;
  parameters?: string[];
  items?: MaterialData[];
  stars?: number;
}

const achievementTriggerParser: Record<
  string,
  (parameters: string[], materials: MaterialMap) => AchievementTrigger
> = {
  TRIGGER_OBTAIN_MATERIAL_NUM: (parameters, materials) => ({
    type: "OBTAIN_MATERIAL",
    items: parameters[0]
      .split(";")
      .map((id) => materials[parseInt(id)])
      .filter((v) => v),
  }),
  TRIGGER_FORGE_WEAPON: (parameters) => ({
    type: "FORGE_WEAPON",
    stars: parseInt(parameters[0]),
  }),
  TRIGGER_UNLOCK_RECIPE: () => ({ type: "UNLOCK_RECIPES" }),
  TRIGGER_SKILLED_AT_RECIPE: () => ({ type: "MASTER_RECIPES" }),
};

export async function fetchAchievements(
  text?: TextMap,
  rewards?: RewardMap,
  materials?: MaterialMap,
  categories?: AchievementCategoryMap,
) {
  const data: AchievementExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AchievementExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const rewardMap = rewards ?? (await fetchRewards());
  const materialMap = materials ?? (await fetchMaterials());
  const categoryMap = categories ?? (await fetchAchievementCategories(textMap));

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id]: {
        id: item.Id,
        progress: item.Progress,
        name: textMap[item.TitleTextMapHash],
        description: textMap[item.DescTextMapHash],
        reward: rewardMap[item.FinishRewardId],
        trigger: achievementTriggerParser[item.TriggerConfig.TriggerType]?.(
          item.TriggerConfig.ParamList,
          materialMap,
        ) ?? {
          type: item.TriggerConfig.TriggerType,
          parameters: item.TriggerConfig.ParamList,
        },
        category: categoryMap[item.GoalId] ?? { id: 0, name: "Unknown" },
        requirementId: item.PreStageAchievementId ?? null,
      },
    }),
    {} as AchievementMap,
  );
}

type AchievementGoalExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
};

type AchievementCategory = {
  id: number;
  name: string;
};

export async function fetchAchievementCategories(text?: TextMap) {
  const data: AchievementGoalExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AchievementGoalExcelConfigData",
  );
  const textMap = text ?? (await fetchTextMap());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        name: textMap[item.NameTextMapHash],
      },
    }),
    {} as AchievementCategoryMap,
  );
}
