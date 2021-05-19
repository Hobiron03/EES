//----画像のインポート（このファイル内で画像を使用する際には、imagesフォルダに画像を入れて読み込む必要がある）---
import "../images/Cordinate.png";
import "../images/BaseFace.png";
import "../images/Beard.png";
import "../images/BaseFaceGlasses.png";
import "../images/face.png";
import "../images/dangerman.png";
import "../images/cat.png";
import "../images/cheek.png";
import "../images/Glusses.png";
//----------------------------------------

//----自分で定義した型をインポート---
import Mouse from "../javascripts/@types/mouse";
import Eyebrow from "../javascripts/@types/eyebrows";
import Eye from "../javascripts/@types/eye";
import coordinate from "../javascripts/@types/coordinate";
//----------------------------------------

//----自作した関数のインポート（srcのディレクトリに配置してある）---
import PostImageData from "./PostImageData";
import ConvertRgbFormat from "./ConvertRgbFormat";
import CalculateColor from "./CalculateColor";
import FormatImageData from "./FormatImageData";
//----------------------------------------

//firebase関連（レビューアプリに使用）
import db from "../../Firebase";
import firebase from "../../Firebase";
//----------------------------------------

import { INITIAL_FACE_COLOR } from "./emotionColor";
import "../stylesheets/main.scss";

// -----------外部ツールの読み込み-----------------
// html2canvas(https://qiita.com/7shi/items/ba7089e864fefac69808)
import html2canvas from "html2canvas";
import { IconButton } from "@material-ui/core";
// ----------------------------

enum Color {
  BLACK = "black",
  BLUE = "#629BEAa",
  RED = "#FF5823",
}

let mouse: Mouse = {
  startPosX: 0,
  startPosY: 0,
  bezierControlPosX: 0,
  bezierControlPosY: 0,
  endPosX: 0,
  endPosY: 0,
  maxUShapePos: 0,
  lineWidth: 0,
};

let leftEyebrow: Eyebrow = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};
let rightEyebrow: Eyebrow = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};

let rightEye: Eye = {
  pos: 0,
  size: 0,
};
let leftEye: Eye = {
  pos: 0,
  size: 0,
};

const emotionFaceDiv: HTMLElement | null = document.getElementById(
  "review-area__main__make-face-field__Top__emotion-face"
);
const coordinateDiv: HTMLElement | null = document.getElementById("coordinate");

//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("coordinate")
);
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext("2d");

let corrdinate: coordinate = {
  width: 0,
  height: 0,
};

//顔の変化のデータを格納しておく。大体30fpsくらいで入る
let dataX: number[] = [];
let dataY: number[] = [];
//顔画像のBase64のデータ
let base64Images: string[] = [];

//顔アイコン作成時に色を付与するかどうか。trueにすると色がつきます。
let isApplyFaceColor: boolean = false;

// 顔アイコンの口を描画のCanvas
const facialPartsCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("facial-parts")
);
const fpctx: CanvasRenderingContext2D | null =
  facialPartsCanvas.getContext("2d");

interface ReivewData {
  dynamicFaceIcon: string;
  title: string;
  canvasImage: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
  dataX: Array<number>;
  dataY: Array<number>;
  emotions: Array<string>;
}

// 顔アイコン作成Canvasの背景画像を描画する
const DrawCoordinateImage = (): void => {
  let background: HTMLImageElement = new Image();
  const imageURL: string = "../images/Cordinate.png";
  background.src = imageURL;
  //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
  background.onload = () => {
    if (cctx) {
      cctx.drawImage(
        background,
        0,
        0,
        coordinateCanvas.width,
        (background.height * coordinateCanvas.width) / background.width
      );
    }
  };
};

//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
const RenderMouth = (x: number): void => {
  //x座標から口の傾きを計算する width400で-66から66くらい
  //xの値を0 ~ mouse.maxUShapePos*2の範囲に正規化
  let curveDegree = (x * (mouse.maxUShapePos * 2)) / corrdinate.width;
  if (curveDegree > mouse.maxUShapePos) {
    curveDegree = curveDegree - mouse.maxUShapePos;
  } else if (x < corrdinate.height / 2) {
    curveDegree = curveDegree - mouse.maxUShapePos;
  } else {
    //x座標が0のとき
    curveDegree = 0;
  }
  //口の描画
  if (fpctx) {
    fpctx.beginPath();
    fpctx.strokeStyle = Color.BLACK;
    fpctx.lineWidth = mouse.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(mouse.startPosX, mouse.endPosY);
    fpctx.quadraticCurveTo(
      mouse.bezierControlPosX,
      mouse.bezierControlPosY + curveDegree,
      mouse.endPosX,
      mouse.endPosY
    );
    fpctx.stroke();
  }
};

//顔アイコンの眉パーツを描画する。Y座標の大きさによって眉の傾き具合が変わる
const RenderEyebrows = (y: number): void => {
  // y座標から眉尻の高さを計算する height:0~400で 眉:-15~15くらい
  let endOfEyebrowsHeight =
    (y * (rightEyebrow.maxEndHeight * 2)) / corrdinate.height;
  if (endOfEyebrowsHeight > rightEyebrow.maxEndHeight) {
    endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
  } else if (y < corrdinate.height / 2) {
    endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
  } else {
    //y座標が0のとき
    endOfEyebrowsHeight = 0;
  }

  //眉の描画
  if (fpctx) {
    //左側の眉の描画
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = leftEyebrow.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(
      leftEyebrow.startPosX,
      leftEyebrow.startPosY + endOfEyebrowsHeight
    ); //眉尻
    fpctx.lineTo(leftEyebrow.endPosX, leftEyebrow.endPosY);
    fpctx.stroke();

    //右側の眉の描画
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = rightEyebrow.lineWidth;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.moveTo(
      rightEyebrow.startPosX,
      rightEyebrow.startPosY + endOfEyebrowsHeight
    ); //眉尻
    fpctx.lineTo(rightEyebrow.endPosX, rightEyebrow.endPosY);
    fpctx.stroke();
  }
};

const RenderEye = (x: number): void => {
  if (fpctx) {
    // //左目
    // fpctx.beginPath();
    // fpctx.strokeStyle = "black";
    // fpctx.lineWidth = leftEye.size;
    // fpctx.lineCap = "round";
    // fpctx.globalCompositeOperation = "source-over";
    // fpctx.lineTo(
    //   facialPartsCanvas.clientWidth / 2 - leftEye.pos,
    //   facialPartsCanvas.clientHeight / 2
    // );
    // fpctx.stroke();

    // //右目
    // fpctx.beginPath();
    // fpctx.strokeStyle = "black";
    // fpctx.lineWidth = rightEye.size;
    // fpctx.lineCap = "round";
    // fpctx.globalCompositeOperation = "source-over";
    // fpctx.lineTo(
    //   facialPartsCanvas.clientWidth / 2 + rightEye.pos,
    //   facialPartsCanvas.clientHeight / 2
    // );
    // fpctx.stroke();

    ///////////////////////////////////////////////////////////////
    /* コンテキスト設定 */
    fpctx.strokeStyle = "#333"; // 塗りつぶしは暗めの色
    fpctx.fillStyle = "#000"; // 線は赤色
    // 線の幅は5px

    /* 円の描画 */
    fpctx.beginPath(); // パスの初期化
    fpctx.arc(
      facialPartsCanvas.clientWidth / 2 + rightEye.pos,
      facialPartsCanvas.clientHeight / 2,
      10,
      0,
      2 * Math.PI
    ); // (100, 50)の位置に半径30pxの円
    fpctx.closePath(); // パスを閉じる
    fpctx.fill(); // 軌跡の範囲を塗りつぶす

    /* 円の描画 */
    fpctx.beginPath(); // パスの初期化
    fpctx.arc(
      facialPartsCanvas.clientWidth / 2 - leftEye.pos,
      facialPartsCanvas.clientHeight / 2,
      10,
      0,
      2 * Math.PI
    ); // (100, 50)の位置に半径30pxの円
    fpctx.closePath(); // パスを閉じる
    fpctx.fill(); // 軌跡の範囲を塗りつぶす
    ///////////////////////////////////////////////////////////////
  }
};

const DrawFace = (x: number, y: number): void => {
  ResetFacialParts();
  RenderMouth(x);
  RenderEye(x);
  RenderEyebrows(y);
};

const ResetCoordinate = (): void => {
  if (cctx) {
    cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
    dataX.splice(0);
    dataY.splice(0);

    DrawCoordinateImage();
  }
};

const ResetFacialParts = (): void => {
  if (fpctx) {
    fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
  }
};

//x座標とy座標から対応する感情を返却する（喜怒哀楽）
const ReturnEmotion = (x: number, y: number): string => {
  if (x >= 0 && x < 200 && y >= 0 && y <= 200) {
    // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
    return "Angry";
  } else if (x >= 0 && x <= 200 && y > 200 && y <= 400) {
    // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ
    return "Sad";
  } else if (x >= 200 && x <= 400 && y > 200 && y <= 400) {
    // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
    return "Pleasure";
  } else if (x >= 200 && x <= 400 && y >= 0 && y <= 200) {
    // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
    return "Happy";
  } else {
    return "NONE";
  }
};

//x座標とy座標から感情に対応した色人変化させる
const SetEmotionColor = (x: number, y: number): void => {
  if (x >= 0 && x < 160 && y >= 0 && y <= 160) {
    // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x >= y) {
      faceColor = CalculateColor(x, y, 1);
    } else {
      faceColor = CalculateColor(x, y, 2);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 0 && x <= 160 && y > 240 && y <= 400) {
    // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ

    let faceColor = { r: 255, g: 0, b: 0 };
    if (160 - x >= y - 240) {
      faceColor = CalculateColor(160 - x, y - 240, 3);
    } else {
      faceColor = CalculateColor(x, y, 4);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 240 && x <= 400 && y > 240 && y <= 400) {
    // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x >= y) {
      faceColor = CalculateColor(x - 240, y - 240, 6);
    } else {
      faceColor = CalculateColor(x - 240, y - 240, 5);
    }

    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else if (x >= 240 && x <= 400 && y >= 0 && y <= 160) {
    // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
    let faceColor = { r: 255, g: 0, b: 0 };
    if (x - 240 > 160 - y) {
      faceColor = CalculateColor(x - 240, 160 - y, 7);
    } else if (x - 240 === 160 - y) {
      console.log("SAME");
    } else {
      faceColor = CalculateColor(x - 240, 160 - y, 8);
    }
    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        faceColor.r,
        faceColor.g,
        faceColor.b
      );
    }
  } else {
    if (emotionFaceDiv) {
      emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(
        INITIAL_FACE_COLOR.r,
        INITIAL_FACE_COLOR.g,
        INITIAL_FACE_COLOR.b
      );
    }
  }
};

let isMouseDrag: boolean = false;
//前フレームの点を保持する変数
let preMousePosX: number;
let preMousePosY: number;
//ドラッグ開始
coordinateCanvas.addEventListener("mousedown", (e: MouseEvent) => {
  //前の軌跡を消去
  ResetCoordinate();
  isMouseDrag = true;
  //canvasの原点は左上
  preMousePosX = e.offsetX;
  preMousePosY = e.offsetY;

  //始点の描画
  if (cctx) {
    cctx.beginPath();
    cctx.strokeStyle = "blue";
    cctx.lineWidth = 20;
    cctx.lineCap = "round";
    cctx.globalCompositeOperation = "source-over";
    //全フレームの点と結ぶ
    cctx.lineTo(preMousePosX, preMousePosY);
    cctx.stroke();

    if (fpctx) {
      DrawFace(e.offsetX, e.offsetY);
    }
  }
});

//スマートフォン用
coordinateCanvas.addEventListener(
  "touchstart",
  (e: TouchEvent) => {
    e.preventDefault();

    //前の軌跡を消去
    ResetCoordinate();
    isMouseDrag = true;

    const node = e.target as HTMLElement;
    const bounds = node.getBoundingClientRect();
    preMousePosX = e.changedTouches[0].clientX - bounds.left;
    preMousePosY = e.changedTouches[0].clientY - bounds.top;

    //始点の描画
    if (cctx) {
      cctx.beginPath();
      cctx.strokeStyle = "blue";
      cctx.lineWidth = 20;
      cctx.lineCap = "round";
      cctx.globalCompositeOperation = "source-over";
      //全フレームの点と結ぶ
      cctx.lineTo(preMousePosX, preMousePosY);
      cctx.stroke();

      if (fpctx) {
        DrawFace(preMousePosX, preMousePosY);
      }
    }
  },
  { passive: false }
);

//----------ドラッグ中----------------------
let pre: any = 0;
let cur: any = 0;
let elapsedTime: number = 0;
let faceScale: number = 1.0;
const fpsInterval: number = (1.0 / 30) * 1000; //60fps
coordinateCanvas.addEventListener("mousemove", (e: MouseEvent) => {
  if (isMouseDrag) {
    cur = Date.now();
    elapsedTime += cur - pre;
    if (elapsedTime > fpsInterval) {
      //canvasの原点は左上
      const mousePosX: number = e.offsetX;
      const mousePosY: number = e.offsetY;

      //軌跡の描画
      if (cctx) {
        cctx.beginPath();
        cctx.strokeStyle = Color.BLACK;
        cctx.lineWidth = 2;
        cctx.lineCap = "round";
        cctx.globalCompositeOperation = "source-over";
        cctx.moveTo(mousePosX, mousePosY);
        //前フレームの点と結ぶ
        cctx.lineTo(preMousePosX, preMousePosY);
        cctx.stroke();

        if (fpctx) {
          console.log("fpctx");
          console.log(e.offsetX);
          DrawFace(mousePosX, mousePosY);
          //画像の64進数のデータにする
          html2canvas(emotionFaceDiv, {
            scale: faceScale,
          }).then((canvas) => {
            base64Images.push(canvas.toDataURL());
          });
          dataX.push(mousePosX);
          dataY.push(mousePosY);
          //座標によって顔アイコンの顔を変化させる
          //SetEmotionColor(preMousePosX, preMousePosY);
        }
      }
      preMousePosX = mousePosX;
      preMousePosY = mousePosY;

      if (isApplyFaceColor) {
        SetEmotionColor(preMousePosX, preMousePosY);
      }
      elapsedTime = 0;
    }
    pre = Date.now();
  }
});

//----------ドラッグ中(スマートフォン用)----------------------
coordinateCanvas.addEventListener(
  "touchmove",
  (e: TouchEvent) => {
    e.preventDefault();
    if (isMouseDrag) {
      cur = Date.now();
      elapsedTime += cur - pre;
      if (elapsedTime > fpsInterval) {
        const node = e.target as HTMLElement;
        const bounds = node.getBoundingClientRect();
        //canvasの原点は左上
        const touchPosX: number = e.changedTouches[0].pageX - bounds.left;
        const touchPosY: number = e.changedTouches[0].pageY - bounds.top;

        //軌跡の描画
        if (cctx) {
          cctx.beginPath();
          cctx.strokeStyle = Color.BLACK;
          cctx.lineWidth = 2;
          cctx.lineCap = "round";
          cctx.globalCompositeOperation = "source-over";
          cctx.moveTo(touchPosX, touchPosY);
          //前フレームの点と結ぶ
          cctx.lineTo(preMousePosX, preMousePosY);
          cctx.stroke();

          if (fpctx) {
            DrawFace(touchPosX, touchPosY);
            //画像の64進数のデータにする
            html2canvas(emotionFaceDiv, {
              scale: faceScale,
            }).then((canvas) => {
              base64Images.push(canvas.toDataURL());
            });
            dataX.push(touchPosX);
            dataY.push(touchPosY);
            //座標によって顔アイコンの顔を変化させる
            //SetEmotionColor(preMousePosX, preMousePosY);
          }
        }
        preMousePosX = touchPosX;
        preMousePosY = touchPosY;

        if (isApplyFaceColor) {
          SetEmotionColor(preMousePosX, preMousePosY);
        }
        elapsedTime = 0;
      }
      pre = Date.now();
    }
  },
  { passive: false }
);

//----------クリックをやめた瞬間の処理----------
coordinateCanvas.addEventListener("mouseup", (e: MouseEvent) => {
  isMouseDrag = false;
  //終点の描画
  if (cctx) {
    cctx.beginPath();
    cctx.strokeStyle = "red";
    cctx.lineWidth = 20;
    cctx.lineCap = "round";
    cctx.globalCompositeOperation = "source-over";
    //全フレームの点と結ぶ
    cctx.lineTo(e.offsetX, e.offsetY);
    cctx.stroke();
  }
});

//----------クリックをやめた瞬間の処理(スマートフォン用)----------
coordinateCanvas.addEventListener(
  "touchend",
  (e: TouchEvent) => {
    e.preventDefault();

    const node = e.target as HTMLElement;
    const bounds = node.getBoundingClientRect();
    //canvasの原点は左上
    const touchPosX: number = e.changedTouches[0].pageX - bounds.left;
    const touchPosY: number = e.changedTouches[0].pageY - bounds.top;

    isMouseDrag = false;
    //終点の描画
    if (cctx) {
      cctx.beginPath();
      cctx.strokeStyle = "red";
      cctx.lineWidth = 20;
      cctx.lineCap = "round";
      cctx.globalCompositeOperation = "source-over";
      //全フレームの点と結ぶ
      cctx.lineTo(touchPosX, touchPosY);
      cctx.stroke();
    }
  },
  { passive: false }
);

const faceSizeRatio: number = 0.75;
const InitFacialParts = (): void => {
  if (!emotionFaceDiv) {
    console.log("ERR! emotion-face div-element does not exit");
    return;
  }

  if (!coordinateDiv) {
    console.log("ERR! coordinate div-element does not exit");
    return;
  }

  //顔アイコンの初期の色を設定
  emotionFaceDiv.style.backgroundColor = ConvertRgbFormat(255, 194, 0);

  corrdinate.width = coordinateDiv.clientWidth;
  corrdinate.height = coordinateDiv.clientHeight;

  const faceWidth = emotionFaceDiv.clientWidth;
  const faceHeight = emotionFaceDiv.clientWidth;

  //顔画像の中心座標
  const centerPosX: number = faceWidth / 2;
  const centerPosY: number = faceHeight / 2;

  //口の相対的な位置（中心からの距離）
  const offsetMouseWidth: number = faceWidth / 5;
  const offsetMouseHeight: number = faceHeight / 4;

  //顔アイコンにおける口の相対的な場所を求める
  //顔アイコンの大きさに変化があっても良いように...!
  mouse.startPosX = centerPosX - offsetMouseWidth;
  mouse.startPosY = centerPosY + offsetMouseHeight;
  mouse.bezierControlPosX = centerPosX;
  mouse.bezierControlPosY = centerPosY + offsetMouseHeight;
  mouse.endPosX = centerPosX + offsetMouseWidth;
  mouse.endPosY = centerPosY + offsetMouseHeight;
  mouse.maxUShapePos = faceWidth / 3;
  mouse.lineWidth = 4 * faceSizeRatio;

  //眉の相対的な場所を求める
  //左眉
  leftEyebrow.lineWidth = 4 * faceSizeRatio;
  leftEyebrow.startPosX = centerPosX - 45 * faceSizeRatio;
  leftEyebrow.startPosY = centerPosY - 33 * faceSizeRatio;
  leftEyebrow.endPosX = centerPosX - 20 * faceSizeRatio;
  leftEyebrow.endPosY = centerPosY - 33 * faceSizeRatio;
  leftEyebrow.maxEndHeight = (faceHeight / 13) * faceSizeRatio;
  //右眉
  rightEyebrow.lineWidth = 4 * faceSizeRatio;
  rightEyebrow.startPosX = centerPosX + 45 * faceSizeRatio;
  rightEyebrow.startPosY = centerPosY - 33 * faceSizeRatio;
  rightEyebrow.endPosX = centerPosX + 20 * faceSizeRatio;
  rightEyebrow.endPosY = centerPosY - 33 * faceSizeRatio;
  rightEyebrow.maxEndHeight = faceHeight / (13 * faceSizeRatio);

  //目の設定
  rightEye.size = 25 * faceSizeRatio;
  rightEye.pos = 35 * faceSizeRatio;
  leftEye.size = 25 * faceSizeRatio;
  leftEye.pos = 35 * faceSizeRatio;

  DrawFace(corrdinate.height / 2, corrdinate.height / 2);
};

//初期設定(顔変化に使用する座標の描画、顔アイコンの設定をここで行う)
const Init = async () => {
  DrawCoordinateImage();
  InitFacialParts();
};

const main = (() => {
  Init();
})();

//---------顔アイコンのアニメーション処理------------
let faceAnimation: any;
let pullDataX: number[] = [];
let pullDataY: number[] = [];
const faceAnimationStep = (): void => {
  let progress: any = pullDataX.shift();
  let progressY: any = pullDataY.shift();

  DrawFace(progress, progressY);

  if (pullDataX.length != 0 || pullDataY.length != 0) {
    faceAnimation = requestAnimationFrame(faceAnimationStep);
  } else {
    cancelAnimationFrame(faceAnimation);
  }
};
//----------------------------------------------

const GCS_URL = "https://storage.googleapis.com/faceicons/";
const imgElement = document.getElementById("gif");
const gifDownload = <HTMLAnchorElement>imgElement;
const herokuURL = "https://emoemoface.herokuapp.com/returnGIF";

const okButton = document.getElementById("decide-button");
if (okButton) {
  okButton.onclick = async () => {
    //大体30fps
    pullDataX = dataX.concat();
    pullDataY = dataY.concat();
    faceAnimation = requestAnimationFrame(faceAnimationStep);
    await PostImageData(FormatImageData(base64Images), herokuURL)
      .then((image_name) => {
        const name = `${GCS_URL}${image_name}`;
        data.dynamicFaceIcon = name;
        setGIF(image_name);
        setImageToresultImage(name);
      })
      .catch((err) => {
        console.log(err);
      });

    SplitImage();

    //reset
    base64Images = [];
  };
}

const gif: HTMLElement | null = document.getElementById("gif");
const gifImage = <HTMLImageElement>gif;
const setGIF = (name: string) => {
  if (gif) {
    gifImage.src = `${GCS_URL}${name}`;
  }
};

const settingFaceColorDom = document.getElementById("setting-face-color");
const settingColorButton = <HTMLInputElement>settingFaceColorDom;
if (settingColorButton) {
  settingColorButton.onclick = () => {
    if (settingColorButton.checked) {
      isApplyFaceColor = true;
    } else {
      isApplyFaceColor = false;
    }
  };
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////レビューシステム関連//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const resultImage = <HTMLImageElement>document.getElementById("result-image");
const setImageToresultImage = (name: string) => {
  if (resultImage) {
    resultImage.src = name;
  }
};

let title: string = "";
let dynamicFaceIcon: string = "";
let canvasImage = "";
let emotionalFaceIcons: Array<string> = [];
let emotions: Array<string> = [];
let reviews: Array<string> = [];
const data: ReivewData = {
  dynamicFaceIcon: "",
  title: "",
  canvasImage: "",
  EmotionalFaceIcon: [],
  comments: [],
  dataX: [],
  dataY: [],
  emotions: [],
};

const reviewTitle = <HTMLHeadingElement>document.getElementById("title");
const reviewComment = <HTMLTextAreaElement>(
  document.getElementById("review-comment")
);
const nextButton = <HTMLButtonElement>document.getElementById("next-button");
let count: number = 0;
if (nextButton) {
  nextButton.onclick = async () => {
    if (count < 4) {
      //TODO: レビュー内容を配列に保存しておく
      if (count === 0) {
        const comment = reviewComment.value;
        data.title = comment;

        //軌跡データの保存
        data.dataX = dataX;
        data.dataY = dataY;
        data.emotions = emotions;
      }
      const comment = reviewComment.value;
      reviews.push(comment);

      //TODO: タイトルを変更 -> 例：review 1, review 2
      reviewTitle.innerHTML = `レビュー ${count + 1} (${count + 1}/4)`;

      //TODO: 顔画像の変更
      setImageToresultImage(emotionalFaceIcons[count]);

      //TODO: データの初期化
      reviewComment.value = "";
      count += 1;

      //TODO: ４つ目のレビューになるとボタンのラベルを完了にする。
      if (count === 4) {
        console.log("完了");
        nextButton.textContent = "DONE";
      }
    } else {
      //TODO: firebaseにデータを送信する（gif, 4つの動く顔, textareaの内容）
      const comment = reviewComment.value;
      reviews.push(comment);

      data.comments = reviews;
      data.EmotionalFaceIcon = emotionalFaceIcons;
      data.canvasImage = coordinateCanvas.toDataURL();

      //firebaseにレビューデータを送信
      const reviewsCollectionReference = firebase
        .firestore()
        .collection("reviews");
      await reviewsCollectionReference.add(data);

      window.location.reload();
    }
  };
}

//感情を4つに分割してwrite-areaのimgに挿入する

const SplitImage = () => {
  //base64Imagesの4つぐらい等間隔で分割する（今は力こそパワーでやっています）
  emotionalFaceIcons[0] = base64Images[0 + 2];
  emotionalFaceIcons[1] = base64Images[(base64Images.length * 0.25) | 0];
  emotionalFaceIcons[2] = base64Images[(base64Images.length * 0.75) | 0];
  emotionalFaceIcons[3] = base64Images[base64Images.length - 1];

  //ここでそれぞれの感情を求める（座標入れたら感情を返してくれる）
  emotions[0] = ReturnEmotion(dataX[0 + 2], dataY[0 + 2]);
  emotions[1] = ReturnEmotion(
    dataX[(dataX.length * 0.25) | 0],
    dataY[(dataY.length * 0.25) | 0]
  );
  emotions[2] = ReturnEmotion(
    dataX[(dataX.length * 0.75) | 0],
    dataY[(dataY.length * 0.75) | 0]
  );
  emotions[3] = ReturnEmotion(dataX[dataX.length - 1], dataY[dataY.length - 1]);
};

const postReviewButtonDOM = <HTMLButtonElement>(
  document.getElementById("post-review")
);
if (postReviewButtonDOM) {
  postReviewButtonDOM.onclick = async () => {
    const data: ReivewData = {
      dynamicFaceIcon: "",
      title: "first title",
      canvasImage: "no url",
      EmotionalFaceIcon: [],
      comments: [],
      dataX: [],
      dataY: [],
      emotions: [],
    };

    //gifのセット
    const dynamicFaceIcon = <HTMLImageElement>document.getElementById("gif");
    data.dynamicFaceIcon = dynamicFaceIcon.src;

    //タイトルのセット
    const reviewTitle = <HTMLInputElement>(
      document.getElementById("review-title")
    );
    data.title = reviewTitle.value;

    //4つの顔画像を取得してデータに入れる
    const InsertedFaceicons = <HTMLCollection>(
      document.getElementsByClassName("InsertedFaceIcon")
    );
    for (let index = 0; index < 4; index++) {
      let insertedFaceicon: HTMLImageElement = <HTMLImageElement>(
        InsertedFaceicons.item(index)
      );
      data.EmotionalFaceIcon.push(insertedFaceicon.src);
    }

    //コメントも同様に
    const Comments = <HTMLCollection>(
      document.getElementsByClassName("comments")
    );
    for (let index = 0; index < 4; index++) {
      let comments: HTMLTextAreaElement = <HTMLTextAreaElement>(
        Comments.item(index)
      );
      data.comments.push(comments.value);
    }

    //firebaseにレビューデータを送信
    const reviewsCollectionReference = firebase
      .firestore()
      .collection("reviews");

    await reviewsCollectionReference.add(data);

    // window.location.reload();
  };
}

// ウィンドウを開く
//顔アイコンのURLにレビューデータが紐づいている方が良い？
$(".js-modal-open").each(function () {
  $(this).on("click", function (d) {
    let target = $(this).data("target");
    let modal = document.getElementById(target);
    $(modal).fadeIn(300);
    return false;
  });
});
