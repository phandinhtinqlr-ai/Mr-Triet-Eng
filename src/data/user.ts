import { UserProfile } from "../types";

export const DEFAULT_USER: UserProfile = {
  id: "user_triet",
  fullName: "Mr. Triết",
  username: "triet",
  level: "B1",
  dailyGoal: 10,
  preferredTopics: ["Work", "Life", "Travel", "Emotions"],
  learningStreak: 5,
  lastLoginDate: new Date().toISOString(),
  totalPoints: 1250
};
