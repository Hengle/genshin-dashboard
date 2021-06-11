import { CharacterCardBuilder } from "../index";
import Card from "./card.jpeg";

const builder: CharacterCardBuilder = (data) => ({
  data: data,
  assets: {
    card: Card,
  },
});

export default { builder };
