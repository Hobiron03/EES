import { ANGRY, HAPPY, SAD, PLEASURE } from "./emotionColor";

const EmotionColorCenter = {
  ANGRY_HAPPY: {
    r: (ANGRY.r + HAPPY.r) / 2,
    g: (ANGRY.g + HAPPY.g) / 2,
    b: (ANGRY.b + HAPPY.b) / 2,
  },
  HAPPY_PLESSURE: {
    r: (PLEASURE.r + HAPPY.r) / 2,
    g: (PLEASURE.g + HAPPY.g) / 2,
    b: (PLEASURE.b + HAPPY.b) / 2,
  },
  PLESSURE_SAD: {
    r: (PLEASURE.r + SAD.r) / 2,
    g: (PLEASURE.g + SAD.g) / 2,
    b: (PLEASURE.b + SAD.b) / 2,
  },
  SAD_ANGRY: {
    r: (ANGRY.r + SAD.r) / 2,
    g: (ANGRY.g + SAD.g) / 2,
    b: (ANGRY.b + SAD.b) / 2,
  },
};

export const {
  ANGRY_HAPPY,
  HAPPY_PLESSURE,
  PLESSURE_SAD,
  SAD_ANGRY,
} = EmotionColorCenter;
