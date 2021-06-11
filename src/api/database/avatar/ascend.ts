import { fetchData } from "@/api/database/api";
import { fetchMaterials } from "@/api/database/material";
import {
  AvatarAscension,
  AvatarPromoteExcelConfigData,
  CharacterAscensionMap,
  MaterialMap,
} from "@/types/database";

export async function fetchAvatarAscensions(material?: MaterialMap) {
  const data: AvatarPromoteExcelConfigData[] = await fetchData(
    "ExcelBinOutput/AvatarPromoteExcelConfigData",
  );

  const materialMap = material ?? (await fetchMaterials());

  return data.reduce(
    (obj, item) => ({
      ...obj,
      [item.AvatarPromoteId ?? 0]: {
        ...obj[item.AvatarPromoteId],
        id: item.AvatarPromoteId,
        levels: {
          ...(obj[item.AvatarPromoteId]?.levels ?? {}),
          [item.PromoteLevel ?? 0]: {
            id: item.AvatarPromoteId,
            level: item.PromoteLevel ?? 0,
            requiredLevel: item.RequiredPlayerLevel ?? 0,
            cost: {
              coins: item.ScoinCost ?? 0,
              items: item.CostItems.map((v) => ({
                item: materialMap[v.Id],
                amount: v.Count,
              })).filter((v) => v && v.item),
            },
            rewards: {
              unlockLevel: item.UnlockMaxLevel,
              properties: item.AddProps.map((v) => ({
                type: v.PropType,
                value: v.Value ?? null,
              })),
            },
          } as AvatarAscension,
        },
      },
    }),
    {} as CharacterAscensionMap,
  );
}
