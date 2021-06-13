import { fetchTextMap } from "@/api/database/text";
import { fetchData } from "@/api/database/api";
import {
  MaterialData,
  MaterialExcelConfigData,
  MaterialMap,
  TextMap,
} from "@/types/database";
import _ from "lodash";

export async function fetchMaterials(text?: TextMap): Promise<MaterialMap> {
  const data: MaterialExcelConfigData[] = await fetchData(
    "ExcelBinOutput/MaterialExcelConfigData",
  );
  const textMap = text ?? (await fetchTextMap());

  return _.chain(data)
    .keyBy((data) => data.Id ?? 0)
    .mapValues(
      (data): MaterialData => ({
        id: data.Id ?? 0,
        name: textMap[data.NameTextMapHash],
        description: textMap[data.DescTextMapHash],
        interactionTitle: textMap[data.InteractionTitleTextMapHash],
        effectDescription: textMap[data.EffectDescTextMapHash],
        specialDescription: textMap[data.SpecialDescTextMapHash],
        type: textMap[data.TypeDescTextMapHash],
        stars: data.RankLevel ?? 0,
        icon: data.Icon,
      }),
    )
    .value();
}
