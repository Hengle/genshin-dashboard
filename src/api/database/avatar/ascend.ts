import { fetchData } from "@/api/database/api";
import { fetchMaterials } from "@/api/database/material";
import {
  AvatarAscension,
  AvatarAscensionList,
  AvatarAscensionMap,
  AvatarPromoteExcelConfigData,
  MaterialMap,
} from "@/types/database";
import _ from "lodash";

export async function fetchAvatarAscensions(
  material?: MaterialMap,
): Promise<AvatarAscensionMap> {
  const data: AvatarPromoteExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarPromoteExcelConfigData",
  );

  const materialMap = material ?? (await fetchMaterials());

  return _.chain(data)
    .groupBy((data) => data.AvatarPromoteId ?? 0)
    .map(
      (data, key): AvatarAscensionList => ({
        id: parseInt(key),
        ascensions: _.chain(data)
          .mapValues(
            (data): AvatarAscension => ({
              id: data.AvatarPromoteId ?? 0,
              level: data.PromoteLevel ?? 0,
              requiredLevel: data.RequiredPlayerLevel ?? 0,
              cost: {
                coins: data.ScoinCost ?? 0,
                items: data.CostItems.map((item) => ({
                  item: materialMap[item.Id],
                  amount: item.Count,
                })).filter((v) => v && v.item),
              },
              rewards: {
                unlockLevel: data.UnlockMaxLevel,
                properties: _.chain(data.AddProps)
                  .keyBy("PropType")
                  .mapValues((data) => data.Value ?? 0)
                  .value(),
              },
            }),
          )
          .keyBy("level")
          .value(),
      }),
    )
    .keyBy("id")
    .value();
}
