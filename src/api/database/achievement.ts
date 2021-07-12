import { fetchRewards } from "@/api/database/reward";
import { fetchMaterials } from "@/api/database/material";
import { fetchTextMap } from "@/api/database/text";
import _ from "lodash";
import { MaterialMap } from "@/types/database/material";
import {
  Achievement,
  AchievementCategory,
  AchievementCategoryMap,
  AchievementExcelConfigData,
  AchievementGoalExcelConfigData,
  AchievementMap,
  AchievementTrigger,
} from "@/types/database/achievement";
import { TextMap } from "@/types/database/consts";
import { RewardMap } from "@/types/database/reward";

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
): Promise<AchievementMap> {
  const data = (
    await import("../../external/GenshinData/ExcelBinOutput/AchievementExcelConfigData.json")
  ).default as AchievementExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());
  const materialMap = materials ?? (await fetchMaterials(textMap));
  const categoryMap = categories ?? (await fetchAchievementCategories(textMap));
  const rewardMap = rewards ?? (await fetchRewards(materialMap));

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): Achievement => ({
        id: data.Id ?? 0,
        progress: data.Progress,
        name: textMap[data.TitleTextMapHash],
        description: textMap[data.DescTextMapHash],
        reward: rewardMap[data.FinishRewardId],
        category: categoryMap[data.GoalId] ?? { id: 0, name: "Unknown" },
        requirementId: data.PreStageAchievementId ?? null,
        trigger: achievementTriggerParser[data.TriggerConfig.TriggerType]?.(
          data.TriggerConfig.ParamList,
          materialMap,
        ) ?? {
          type: data.TriggerConfig.TriggerType,
          parameters: data.TriggerConfig.ParamList,
        },
      }),
    )
    .value();
}

export async function fetchAchievementCategories(text?: TextMap): Promise<AchievementCategoryMap> {
  const data = (
    await import("../../external/GenshinData/ExcelBinOutput/AchievementGoalExcelConfigData.json")
  ).default as AchievementGoalExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): AchievementCategory => ({
        id: data.Id ?? 0,
        name: textMap[data.NameTextMapHash],
      }),
    )
    .value();
}
