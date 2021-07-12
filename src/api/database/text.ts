import _ from "lodash";
import { TextMap } from "@/types/database/consts";

export const fetchTextMap = async (): Promise<TextMap> =>
  _.chain((await import("../../external/GenshinData/TextMap/TextMapEN.json")).default as TextMap)
    .mapValues((line) => line.replace(/\\n/g, "\n"))
    .value();
