import { fetchData } from "@/api/database/api";
import { fetchTextMap, TextMap } from "@/api/database/text";
import {
  fetchMaterials,
  MaterialData,
  MaterialMap,
} from "@/api/database/material";

export type TalentMap = Record<number, AvatarTalent>;

type AvatarTalentExcelConfigData = {
  TalentId: number;
  NameTextMapHash: number;
  DescTextMapHash: number;
  MainCostItemId: number;
  MainCostItemCount: number;
};

export type AvatarTalent = {
  id: number;
  name: string;
  description: string;
  cost: {
    item: MaterialData;
    amount: number;
  };
};

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
