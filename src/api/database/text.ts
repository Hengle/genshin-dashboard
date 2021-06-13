import { fetchData } from "@/api/database/api";
import { TextMap } from "@/types/database";
import _ from "lodash";

export const fetchTextMap = async (): Promise<TextMap> =>
  _.chain((await fetchData("TextMap/TextMapEN")) as TextMap)
    .mapValues((line) => line.replace(/\\n/g, "\n"))
    .value();
