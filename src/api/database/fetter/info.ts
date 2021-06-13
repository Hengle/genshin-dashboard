import {
  FetterInfo,
  FetterInfoExcelConfigData,
  FetterInfoMap,
  TextMap,
} from "@/types/database";
import { fetchData } from "@/api/database/api";
import { fetchTextMap } from "@/api/database/text";
import _ from "lodash";

export async function fetchFetterInfo(text?: TextMap): Promise<FetterInfoMap> {
  const data: FetterInfoExcelConfigData[] = await fetchData(
    "ExcelBinOutput/FetterInfoExcelConfigData",
  );

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
        association: data.AvatarAssocType,
      }),
    )
    .value();
}
