import {
  fetchMaterials,
  MaterialData,
  MaterialMap,
} from "@/api/database/material";
import { fetchData } from "@/api/database/api";

export type RewardMap = Record<number, RewardData>;

type RewardExcelConfigData = {
  RewardId: number;
  RewardItemList: {
    ItemId: number;
    ItemCount: number;
  }[];
};

export type RewardData = {
  id: number;
  items: {
    item: MaterialData;
    amount: number;
  }[];
};

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
        items: item.RewardItemList.filter((v) => Object.keys(v).length > 0).map(
          (v) => ({
            item: materialMap[v.ItemId],
            amount: v.ItemCount,
          }),
        ),
      },
    }),
    {} as RewardMap,
  );
}
