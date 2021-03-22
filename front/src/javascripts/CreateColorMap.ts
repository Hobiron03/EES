//////////////////////////////////////////////////////////////
//color-map
// const colorMapCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
//   document.getElementById("color-map")
// );
// const cmctx: CanvasRenderingContext2D | null = colorMapCanvas.getContext("2d");

// if (cmctx) {
//   cmctx.clearRect(0, 0, cmctx.canvas.clientWidth, cmctx.canvas.clientHeight);
// }

//  キャンバス全体のピクセル情報を取得
// let imageData = cmctx.getImageData(
//   0,
//   0,
//   colorMapCanvas.width,
//   colorMapCanvas.height
// );
// let width = imageData.width;
// let height = imageData.height;

// let pixels = imageData.data; // ピクセル配列：RGBA4要素で1ピクセル

// ピクセル単位で操作できる
// for (let y = 0; y < height; ++y) {
//   for (let x = 0; x < width; ++x) {
//     let faceColor = { r: 255, g: 194, b: 0 };
//     if (x >= 0 && x <= 160 && y >= 0 && y <= 160) {
//       // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
//       if (x >= y) {
//         faceColor = CalculateColor(x, y, 1);
//       } else {
//         faceColor = CalculateColor(x, y, 2);
//       }
//     } else if (x >= 0 && x <= 160 && y >= 240 && y <= 400) {
//       // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ

//       if (160 - x >= y - 240) {
//         faceColor = CalculateColor(160 - x, y - 240, 3);
//       } else {
//         faceColor = CalculateColor(x, y, 4);
//       }
//     } else if (x >= 240 && x <= 400 && y >= 240 && y <= 400) {
//       // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
//       if (x >= y) {
//         faceColor = CalculateColor(x - 240, y - 240, 6);
//       } else {
//         faceColor = CalculateColor(x - 240, y - 240, 5);
//       }
//     } else if (x >= 240 && x <= 400 && y >= 0 && y <= 160) {
//       // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
//       if (x - 240 >= 160 - y) {
//         faceColor = CalculateColor(x - 240, 160 - y, 7);
//       } else {
//         faceColor = CalculateColor(x - 240, 160 - y, 8);
//       }
//     }

//     let base = (y * width + x) * 4;
//     // なんかピクセルに書き込む
//     pixels[base + 0] = faceColor.r; // Red
//     pixels[base + 1] = faceColor.g; // Green
//     pixels[base + 2] = faceColor.b; // Blue
//     pixels[base + 3] = 255; // Alpha
//   }
// }

// // 変更した内容をキャンバスに書き戻す
// cmctx.putImageData(imageData, 0, 0);
