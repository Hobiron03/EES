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
        console.log(err);
      });

    InsertImageToWriteReviewArea();

    //reset
    dataX = [];
    dataY = [];
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

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////レビューシステム関連//////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

interface ReivewData {
  dynamicFaceIcon: string;
  title: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
}

const mockReivewData: ReivewData = {
  dynamicFaceIcon:
    "https://storage.googleapis.com/faceicons/face-efc6c1c5e7b78d4e753ed8d4c18bf2bf38d0b08c1701fbbd90c114bf.gif",
  title: "もう二度と買わへん！ウソ...また買います",
  EmotionalFaceIcon: [
    "data:image/png;base64,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",
    "data:image/png;base64,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",
    "data:image/png;base64,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",
    "data:image/png;base64,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",
  ],
  comments: [
    "スマホカバーの返品をお願いした所、メール便で届いたにも関わらず返品料こちら負担で何故か1,000円以上キャンセル料を取られました。腹が立ちました。",
    "箱に入れて、緩衝材が入れてあり壊れにくい包装でした。対応も良く予定日を決めて送っていただきました。丁寧な説明書も入っており直ぐに試すことが出来ました。ありがとうございました。",
    "どこは当時けっしてこの忠告心って事のところを出たない。とにかく時間が拡張者はさきほどそのお話しますたかもに充たすていでには努力打ち壊さなけれんて、どうにはなれるでないたある。",
    "嫌い！！！！",
  ],
};

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

  //base64Imagesの4つぐらい等間隔で分割する（今は力こそパワーでやっています）
  imageDOMs[0].src = base64Images[0 + 2];
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
//顔アイコンのURLにレビューデータが紐づいている方が良い？
$(".js-modal-open").each(function () {
  $(this).on("click", function (d) {
    let target = $(this).data("target");
    let modal = document.getElementById(target);

    $(modal).fadeIn(300);
    return false;
  });
});

// ウィンドウを閉じる
$(".js-modal-close").on("click", function () {
  $(".js-modal").fadeOut(300);
  return false;
});

const postReviewButtonDOM = <HTMLButtonElement>(
  document.getElementById("post-review")
);
if (postReviewButtonDOM) {
  postReviewButtonDOM.onclick = () => {
    const data: ReivewData = {
      dynamicFaceIcon: "",
      title: "first title",
      EmotionalFaceIcon: [],
      comments: [],
    };

    //gifのセット
    const dynamicFaceIcon = <HTMLImageElement>document.getElementById("gif");
    data.dynamicFaceIcon = dynamicFaceIcon.src;

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

    //DOMを作成してレビュー一覧に格納する
    //  <a class="js-modal-open" href="" data-target="modal01">
    //   <img
    //     src="https://storage.googleapis.com/faceicons/face-efc6c1c5e7b78d4e753ed8d4c18bf2bf38d0b08c1701fbbd90c114bf.gif"
    //     alt=""
    //     width="100"
    //   />
    // </a>
    let a = document.createElement("a");
    a.setAttribute("class", "js-modal-open");
    a.setAttribute("data-target", "modal01");
    $(a).fadeIn(300);

    let img = document.createElement("img");
    img.setAttribute("src", data.dynamicFaceIcon);
    img.setAttribute("width", "100");

    a.appendChild(img);

    const ReviewsTable = <HTMLDivElement>(
      document.getElementById("reviews-table")
    );
    ReviewsTable.appendChild(a);

    console.log(data);
  };
}
