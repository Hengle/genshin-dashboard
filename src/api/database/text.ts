import { fetchData } from "@/api/database/api";

export type TextMap = Record<string, string>;

export async function fetchTextMap(): Promise<TextMap> {
  const data: Record<string, string> = await fetchData("TextMap/TextMapEN");
  for (const key of Object.keys(data))
    data[key] = data[key].replace(/\\n/g, "\n");
  return data;
}
