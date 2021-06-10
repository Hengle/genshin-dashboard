async function fetchData(url: string) {
  return await (
    await fetch(
      `https://raw.githubusercontent.com/Dimbreath/GenshinData/master/${url}.json`,
    )
  ).json();
}

type TextMap = Record<string, string>;
type MaterialMap = Record<number, MaterialData>;
type RewardMap = Record<number, RewardData>;
type AchievementMap = Record<number, Achievement>;
type AchievementCategoryMap = Record<number, AchievementCategory>;

export async function fetchTextMap(): Promise<TextMap> {
  return await fetchData("TextMap/TextMapEN");
}

type MaterialExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  InteractionTitleTextMapHash: number;
  EffectDescTextMapHash: number;
  SpecialDescTextMapHash: number;
  TypeDescTextMapHash: number;
  RankLevel?: number;
  Icon?: string;
};

export type MaterialData = {
  id: number;
  name: string;
  description: string;
  interactionTitle: string;
  effectDescription: string;
  specialDescription: string;
  type: string;
  stars: number;
  icon?: string;
};

export async function fetchMaterials(text?: TextMap) {
  const data: MaterialExcelConfigData[] = await fetchData(
    "ExcelBinOutput/MaterialExcelConfigData",
  );
  const textMap = text ?? (await fetchTextMap());

  return data.reduce((obj, item) => {
    const name = textMap[item.NameTextMapHash];
    if (name.length === 0) return obj;

    return {
      ...obj,
      [item.Id]: {
        name,
        id: item.Id,
        description: textMap[item.DescTextMapHash],
        interactionTitle: textMap[item.InteractionTitleTextMapHash],
        effectDescription: textMap[item.EffectDescTextMapHash],
        specialDescription: textMap[item.SpecialDescTextMapHash],
        type: textMap[item.TypeDescTextMapHash],
        stars: item.RankLevel ?? 0,
        icon: item.Icon,
      },
    };
  }, {} as MaterialMap);
}

type RewardExcelConfigData = {
  RewardId: number;
  RewardItemList: {
    ItemId: number;
    ItemCount: number;
  }[];
};

type RewardData = {
  id: number;
  items: {
    item: MaterialData;
    amount: number;
  }[];
};

export async function fetchRewards(materials?: MaterialMap) {
  const data: RewardExcelConfigData[] = await fetchData(
    "ExcelBinOutput/RewardExcelConfigData",
  );
  const materialMap = materials ?? (await fetchMaterials());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.RewardId]: {
        id: item.RewardId,
        items: item.RewardItemList.filter((v) => Object.keys(v).length > 0).map(
          (v) => ({
            item: materialMap[v.ItemId],
            amount: v.ItemCount,
          }),
        ),
      },
    }),
    {} as RewardMap,
  );
}

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
