import { fetchData } from "@/api/database/api";
import {
  AvatarTalent,
  AvatarTalentExcelConfigData,
  AvatarTalentMap,
  MaterialMap,
  TextMap,
} from "@/types/database";
import { fetchTextMap } from "@/api/database/text";
import { fetchMaterials } from "@/api/database/material";
import _ from "lodash";

export async function fetchTalents(
  text?: TextMap,
  material?: MaterialMap,
): Promise<AvatarTalentMap> {
  const data: AvatarTalentExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarTalentExcelConfigData",
  );

  const textMap = text ?? (await fetchTextMap());
  const materialMap = material ?? (await fetchMaterials(textMap));

  return _.chain(data)
    .keyBy((data) => data.TalentId ?? 0)
    .mapValues(
      (data): AvatarTalent => ({
        id: data.TalentId ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        cost: {
          item: materialMap[data.MainCostItemId],
          amount: data.MainCostItemCount,
        },
      }),
    )
    .value();
}
