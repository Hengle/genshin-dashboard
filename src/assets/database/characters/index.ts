import amber from "./amber";
import { CharacterData } from "@/api/database/avatar/character";
import { CharacterKey } from "@/types/database";

export type CharacterCardBuilder = (data: CharacterData) => CharacterCard;

export type CharacterCard = {
  data: CharacterData;
  assets: {
    card: string;
  };
};

export const characters: Record<CharacterKey, CharacterCardBuilder> = {
  amber: amber.builder,
};
