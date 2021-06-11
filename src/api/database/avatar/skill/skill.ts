import { fetchData } from "@/api/database/api";
import {
  AvatarSkillExcelConfigData,
  SkillMap,
  TextMap,
} from "@/types/database";
import { fetchTextMap } from "@/api/database/text";

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
