import { fetchTextMap } from "@/api/database/text";
import _ from "lodash";
import {
  AvatarSkill,
  AvatarSkillExcelConfigData,
  AvatarSkillMap,
} from "@/types/database/avatar/skill";
import { TextMap } from "@/types/database/consts";

export async function fetchSkills(text?: TextMap): Promise<AvatarSkillMap> {
  const data = (
    await import("../../../../external/GenshinData/ExcelBinOutput/AvatarSkillExcelConfigData.json")
  ).default as AvatarSkillExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());
  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): AvatarSkill => ({
        id: data.Id ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        cooldown: {
          time: data.CdTime ?? 0,
          charges: data.MaxChargeNum,
        },
        cost: {
          element: data.CostElemType
            ? {
                type: data.CostElemType,
                value: data.CostElemVal ?? 0,
              }
            : null,
        },
      }),
    )
    .value();
}
