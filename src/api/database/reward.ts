import { fetchMaterials } from "@/api/database/material";
import _ from "lodash";
import { MaterialMap } from "@/types/database/material";
import { RewardData, RewardExcelConfigData, RewardMap } from "@/types/database/reward";

export async function fetchRewards(materials?: MaterialMap): Promise<RewardMap> {
  const data = (
    await import("../../external/GenshinData/ExcelBinOutput/RewardExcelConfigData.json")
  ).default as RewardExcelConfigData[];

  const materialMap = materials ?? (await fetchMaterials());

  return _.chain(data)
    .keyBy((data) => data.RewardId ?? 0)
    .mapValues(
      (data): RewardData => ({
        id: data.RewardId ?? 0,
        items: data.RewardItemList.map((data) => ({
          item: materialMap[data.ItemId],
          amount: data.ItemCount,
        })).filter((data) => data.item && data.amount),
      }),
    )
    .value();
}
