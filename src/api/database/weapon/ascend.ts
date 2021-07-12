import { fetchMaterials } from "@/api/database/material";
import _ from "lodash";
import { MaterialMap } from "@/types/database/material";
import { AscensionData, AscensionList, AscensionMap } from "@/types/database/avatar/ascension";
import { WeaponPromoteExcelConfigData } from "@/types/database/weapon";

export async function fetchWeaponAscensions(material?: MaterialMap): Promise<AscensionMap> {
  const data = (
    await import("../../../external/GenshinData/ExcelBinOutput/WeaponPromoteExcelConfigData.json")
  ).default as WeaponPromoteExcelConfigData[];

  const materialMap = material ?? (await fetchMaterials());

  return _.chain(data)
    .groupBy((data) => data.WeaponPromoteId ?? 0)
    .map(
      (data, key): AscensionList => ({
        id: parseInt(key),
        ascensions: _.chain(data)
          .mapValues(
            (data): AscensionData => ({
              id: data.WeaponPromoteId ?? 0,
              level: data.PromoteLevel ?? 0,
              requiredLevel: data.RequiredPlayerLevel ?? 0,
              cost: {
                coins: data.CoinCost ?? 0,
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
