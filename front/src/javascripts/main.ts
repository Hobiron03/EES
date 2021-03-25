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

import { INITIAL_FACE_COLOR } from "./emotionColor";

import "../stylesheets/main.scss";

// -----------外部ツールの読み込み-----------------
// html2canvas(https://qiita.com/7shi/items/ba7089e864fefac69808)
import html2canvas from "html2canvas";
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

//顔アイコン作成時に色を付与するかどうか
let isApplyFaceColor: boolean = false;

// 顔アイコンの口を描画のCanvas
const facialPartsCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("facial-parts")
);
const fpctx: CanvasRenderingContext2D | null = facialPartsCanvas.getContext(
  "2d"
);

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

const RenderEye = (): void => {
  if (fpctx) {
    //左目
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = leftEye.size;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.lineTo(
      facialPartsCanvas.clientWidth / 2 - leftEye.pos,
      facialPartsCanvas.clientHeight / 2
    );
    fpctx.stroke();

    //右目
    fpctx.beginPath();
    fpctx.strokeStyle = "black";
    fpctx.lineWidth = rightEye.size;
    fpctx.lineCap = "round";
    fpctx.globalCompositeOperation = "source-over";
    fpctx.lineTo(
      facialPartsCanvas.clientWidth / 2 + rightEye.pos,
      facialPartsCanvas.clientHeight / 2
    );
    fpctx.stroke();
  }
};

const DrawFace = (x: number, y: number): void => {
  ResetFacialParts();
  RenderMouth(x);
  RenderEye();
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
  //顔アイコンの大きさに変化があっても良いように
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
const Init = (): void => {
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

const GCE_URL = "//34.84.133.169/returnGIF";
const GCE_2_URL = "http://35.200.88.160/returnGIF";
const GCE_3_URL = "//34.84.124.211/returnGIF";
const localURL = "http://127.0.0.1:5000/returnGIF";
const GCS_URL = "https://storage.googleapis.com/faceicons/";
const imgElement = document.getElementById("gif");
const gifDownload = <HTMLAnchorElement>imgElement;

const okButton = document.getElementById("decide-button");
if (okButton) {
  okButton.onclick = async () => {
    //大体30fps
    pullDataX = dataX.concat();
    pullDataY = dataY.concat();
    faceAnimation = requestAnimationFrame(faceAnimationStep);

    await PostImageData(FormatImageData(base64Images), localURL)
      .then((image_name) => {
        setGIF(image_name);
      })
      .catch((err) => {
        console.log("Hello");
        console.log(err);
      });

    InsertImageToWriteReviewArea();
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
      console.log("cheked");
      isApplyFaceColor = true;
    } else {
      isApplyFaceColor = false;
    }
  };
}

const appImgDom = document.getElementById("app-img");
const appImg = <HTMLImageElement>appImgDom;
if (appImg) {
  console.log("appimg");
}

/////////////////////////////////レビューシステム関連//////////////////////////////////////////

//感情を4つに分割してwrite-areaのimgに挿入する
const InsertImageToWriteReviewArea = () => {
  //4つのレビューを書くエリアの取得をする
  const reviewAreaWriteImages = <HTMLCollection>(
    document.getElementsByClassName("InsertedFaceIcon")
  );

  //それぞれのエリアに顔アイコンを挿入する
  let imageDOMs = [];
  for (let index = 0; index < 4; index++) {
    imageDOMs.push(<HTMLImageElement>reviewAreaWriteImages.item(index));
  }

  //base64Imagesの4つぐらい等間隔で分割する
  imageDOMs[0].src = base64Images[0];
  imageDOMs[1].src = base64Images[(base64Images.length * 0.25) | 0];
  imageDOMs[2].src = base64Images[(base64Images.length * 0.75) | 0];
  imageDOMs[3].src = base64Images[base64Images.length - 1];
};

//レビュー追加ボタンの制御
const addReiviewButtonDOM = document.getElementById("add-review");
const addReiviewButton = <HTMLButtonElement>addReiviewButtonDOM;
if (addReiviewButton) {
  addReiviewButton.onclick = () => {
    //レビューテーブルに顔を追加
    const reviewsTableDiv = <HTMLDivElement>(
      document.getElementById("reviews-table")
    );
    const a = document.createElement("a");
    const img = document.createElement("img");
    img.src = "https://wired.jp/app/uploads/2018/01/GettyImages-522585140.webp";
    a.appendChild(img);
    reviewsTableDiv.appendChild(a);
  };
}

// ウィンドウを開く
$(".js-modal-open").each(function () {
  $(this).on("click", function () {
    var target = $(this).data("target");
    var modal = document.getElementById(target);
    $(modal).fadeIn(300);
    return false;
  });
});

// ウィンドウを閉じる
$(".js-modal-close").on("click", function () {
  $(".js-modal").fadeOut(300);
  return false;
});
