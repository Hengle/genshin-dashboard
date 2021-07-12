import { Achievement } from "@/types/database/achievement";

// TODO: Move this out of here
export const achievementStringifier: Record<string, (achievement: Achievement) => string> = {
  OBTAIN_MATERIAL: (achievement) =>
    `Obtain ${achievement.progress} of the following materials:\n${(
      achievement.trigger.items?.map((v) => v.name) ?? []
    ).join(", ")}`,
  FORGE_WEAPON: (achievement) =>
    `Forge ${achievement.progress} weapons of ${achievement.trigger.stars ?? 0} stars.`,
  UNLOCK_RECIPES: (achievement) => `Unlock ${achievement.progress} recipes.`,
  MASTER_RECIPES: (achievement) => `Unlock auto-cook on ${achievement.progress} recipes.`,
};
