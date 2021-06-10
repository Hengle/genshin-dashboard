import { fetchTextMap, TextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";

export type MaterialMap = Record<number, MaterialData>;

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
