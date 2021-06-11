import { fetchData } from "@/api/database/api";
import {
  AvatarTalentExcelConfigData,
  MaterialMap,
  TalentMap,
  TextMap,
} from "@/types/database";
import { fetchTextMap } from "@/api/database/text";
import { fetchMaterials } from "@/api/database/material";

export async function fetchTalents(text?: TextMap, material?: MaterialMap) {
  const data: AvatarTalentExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarTalentExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const materialMap = material ?? (await fetchMaterials(textMap));

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.TalentId ?? 0]: {
        id: item.TalentId ?? 0,
        name: textMap[item.NameTextMapHash],
        description: textMap[item.DescTextMapHash],
        cost: {
          item: materialMap[item.MainCostItemId],
          amount: item.MainCostItemCount,
        },
      },
    }),
    {} as TalentMap,
  );
}
