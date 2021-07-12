import { fetchTextMap } from "@/api/database/text";
import _ from "lodash";
import { AssociationType, TextMap } from "@/types/database/consts";
import { FetterInfo, FetterInfoExcelConfigData, FetterInfoMap } from "@/types/database/fetters";

export async function fetchFetterInfo(text?: TextMap): Promise<FetterInfoMap> {
  const data = (
    await import("../../../external/GenshinData/ExcelBinOutput/FetterInfoExcelConfigData.json")
  ).default as FetterInfoExcelConfigData[];

  const textMap = text ?? (await fetchTextMap());

  return _.chain(data)
    .keyBy("AvatarId")
    .mapValues(
      (data): FetterInfo => ({
        title: textMap[data.AvatarTitleTextMapHash],
        description: textMap[data.AvatarDetailTextMapHash],
        region: textMap[data.AvatarNativeTextMapHash],
        constellation: textMap[data.AvatarConstellationBeforTextMapHash],
        element: textMap[data.AvatarVisionBeforTextMapHash],
        association: data.AvatarAssocType as AssociationType,
      }),
    )
    .value();
}
