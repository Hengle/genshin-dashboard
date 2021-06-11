import { fetchTextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import {
  MaterialExcelConfigData,
  MaterialMap,
  TextMap,
} from "@/types/database";

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
