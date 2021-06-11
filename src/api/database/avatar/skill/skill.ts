import { fetchData } from "@/api/database/api";
import { fetchTextMap, TextMap } from "@/api/database/text";

export type SkillMap = Record<number, AvatarSkill>;

type AvatarSkillExcelConfigData = {
  Id: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  CdTime?: number;
  MaxChargeNum: number;
  CostElemType?: string;
  CostElemVal?: number;
  TriggerID?: number;
};

export type AvatarSkill = {
  id: number;
  name: string;
  description: string;
  cooldown: {
    time: number;
    charges: number;
  };
  cost: {
    element: {
      type: string;
      value: number;
    } | null;
  };
};

export async function fetchSkills(text?: TextMap) {
  const data: AvatarSkillExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarSkillExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.Id ?? 0]: {
        id: item.Id ?? 0,
        name: textMap[item.NameTextMapHash],
        description: textMap[item.DescTextMapHash],
        cooldown: {
          time: item.CdTime ?? 0,
          charges: item.MaxChargeNum,
        },
        cost: {
          element: item.CostElemType
            ? {
                type: item.CostElemType,
                value: item.CostElemVal ?? 0,
              }
            : null,
        },
      },
    }),
    {} as SkillMap,
  );
}
