import { fetchMaterials } from "@/api/database/material";
import { fetchData } from "@/api/database/api";
import {
  MaterialMap,
  RewardExcelConfigData,
  RewardMap,
} from "@/types/database";

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
        items: item.RewardItemList.filter((v) => Object.keys(v).length > 0)
          .map((v) => ({
            item: materialMap[v.ItemId],
            amount: v.ItemCount,
          }))
          .filter((v) => v.item),
      },
    }),
    {} as RewardMap,
  );
}
