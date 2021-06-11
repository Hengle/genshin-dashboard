import { fetchData } from "@/api/database/api";
import {
  fetchMaterials,
  MaterialData,
  MaterialMap,
} from "@/api/database/material";

export type CharacterAscensionMap = Record<number, AvatarAscensions>;

type AvatarPromoteExcelConfigData = {
  AvatarPromoteId: number;
  PromoteLevel?: number;
  ScoinCost?: number;
  UnlockMaxLevel: number;
  RequiredPlayerLevel: number;
  AddProps: {
    PropType: string;
    Value?: number;
  }[];
  CostItems: {
    Id: number;
    Count: number;
  }[];
};

export type AvatarAscensions = {
  id: number;
  levels: {
    [level: number]: AvatarAscension;
  };
};

type AvatarAscension = {
  id: number;
  level: number;
  requiredLevel: number;
  cost: {
    coins: number;
    items: {
      item: MaterialData;
      amount: number;
    }[];
  };
  rewards: {
    unlockLevel: number;
    properties: {
      type: string;
      value?: number;
    }[];
  };
};

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
            level: item.PromoteLevel,
            requiredLevel: item.RequiredPlayerLevel,
            cost: {
              coins: item.ScoinCost ?? 0,
              items: item.CostItems.filter(
                (v) => Object.keys(v).length > 0,
              ).map((v) => ({
                item: materialMap[v.Id],
                amount: v.Count,
              })),
            },
            rewards: {
              unlockLevel: item.UnlockMaxLevel,
              properties: item.AddProps.map((v) => ({
                type: v.PropType,
                value: v.Value,
              })),
            },
          } as AvatarAscension,
        },
      },
    }),
    {} as CharacterAscensionMap,
  );
}
