// 現在の座標情報をもとにから顔アイコンの色を計算する関数

import {
  INITIAL_FACE_COLOR,
  ANGRY,
  HAPPY,
  SAD,
  PLEASURE,
} from "./emotionColor";

const CalculateColor = (
  x: number,
  y: number,
  zone: number
): { r: number; g: number; b: number } => {
  let r = 255;
  let g = 255;
  let b = 255;
  switch (zone) {
    case 1:
      //怒りx
      r =
        INITIAL_FACE_COLOR.r + (ANGRY.r - INITIAL_FACE_COLOR.r) * (1.0 - x / 1);
      g =
        INITIAL_FACE_COLOR.g +
        (ANGRY.g - INITIAL_FACE_COLOR.g) * (1.0 - x / 160);
      b =
        INITIAL_FACE_COLOR.b +
        (ANGRY.b - INITIAL_FACE_COLOR.b) * (1.0 - x / 160);
      break;

    case 2:
      //怒りy
      r =
        INITIAL_FACE_COLOR.r +
        (ANGRY.r - INITIAL_FACE_COLOR.r) * (1.0 - y / 160);
      g =
        INITIAL_FACE_COLOR.g +
        (ANGRY.g - INITIAL_FACE_COLOR.g) * (1.0 - y / 160);
      b =
        INITIAL_FACE_COLOR.b +
        (ANGRY.b - INITIAL_FACE_COLOR.b) * (1.0 - y / 160);
      break;

    case 3:
      //悲しみx
      r = INITIAL_FACE_COLOR.r + (SAD.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g = INITIAL_FACE_COLOR.g + (SAD.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b = INITIAL_FACE_COLOR.b + (SAD.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 4:
      //悲しみx
      r =
        INITIAL_FACE_COLOR.r + (SAD.r - INITIAL_FACE_COLOR.r) * (1.0 - x / 160);
      g =
        INITIAL_FACE_COLOR.g + (SAD.g - INITIAL_FACE_COLOR.g) * (1.0 - x / 160);
      b =
        INITIAL_FACE_COLOR.b + (SAD.b - INITIAL_FACE_COLOR.b) * (1.0 - x / 160);
      break;

    case 5:
      //楽しみ
      r =
        INITIAL_FACE_COLOR.r + (PLEASURE.r - INITIAL_FACE_COLOR.r) * (x / 160);
      g =
        INITIAL_FACE_COLOR.g + (PLEASURE.g - INITIAL_FACE_COLOR.g) * (x / 160);
      b =
        INITIAL_FACE_COLOR.b + (PLEASURE.b - INITIAL_FACE_COLOR.b) * (x / 160);
      break;

    case 6:
      //楽しみx>y:xが増加するほど色に近く
      r =
        INITIAL_FACE_COLOR.r + (PLEASURE.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g =
        INITIAL_FACE_COLOR.g + (PLEASURE.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b =
        INITIAL_FACE_COLOR.b + (PLEASURE.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 7:
      //happy x>y: yが減少するほど色に近く

      r = INITIAL_FACE_COLOR.r + (HAPPY.r - INITIAL_FACE_COLOR.r) * (y / 160);
      g = INITIAL_FACE_COLOR.g + (HAPPY.g - INITIAL_FACE_COLOR.g) * (y / 160);
      b = INITIAL_FACE_COLOR.b + (HAPPY.b - INITIAL_FACE_COLOR.b) * (y / 160);
      break;

    case 8:
      //happy x<y:x画像するほど色に近く
      r = INITIAL_FACE_COLOR.r + (HAPPY.r - INITIAL_FACE_COLOR.r) * (x / 160);
      g = INITIAL_FACE_COLOR.g + (HAPPY.g - INITIAL_FACE_COLOR.g) * (x / 160);
      b = INITIAL_FACE_COLOR.b + (HAPPY.b - INITIAL_FACE_COLOR.b) * (x / 160);
      break;
  }
  return { r, g, b };
};

export default CalculateColor;
