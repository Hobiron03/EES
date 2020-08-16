enum Color {
  BLACK = "black",
  BLUE = "#629BEAa",
  RED = "#FF5823",
}
interface Mouse {
  startPosX: number;
  startPosY: number;
  //ベジエ曲線の制御点
  bezierControlPosX: number;
  bezierControlPosY: number;
  endPosX: number;
  endPosY: number;
  maxUShapePos: number;
  lineWidth: number;
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

interface Eyebrows {
  startPosX: number;
  startPosY: number;
  endPosX: number;
  endPosY: number;
  lineWidth: number;
  maxEndHeight: number;
}
let leftEyebrow: Eyebrows = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};
let rightEyebrow: Eyebrows = {
  startPosX: 0,
  startPosY: 0,
  endPosX: 0,
  endPosY: 0,
  lineWidth: 0,
  maxEndHeight: 0,
};

interface Eyes {
  pos: number;
  size: number;
}
let rightEye: Eyes = {
  pos: 0,
  size: 0,
};
let leftEye: Eyes = {
  pos: 0,
  size: 0,
};

//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("coordinate")
);
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext("2d");
interface coordinate {
  width: number;
  height: number;
}
let corrdinate: coordinate = {
  width: 0,
  height: 0,
};

//顔の変化のデータを格納しておく。大体60fpsくらいで入る
let dataX: number[] = [];
let dataY: number[] = [];

//顔画像のBase64のデータ
let base64Images: string[] = [];

// 顔アイコンの口を描画のCanvas
const facialPartsCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("facial-parts")
);
const fpctx: CanvasRenderingContext2D | null = facialPartsCanvas.getContext(
  "2d"
);

// 顔アイコン作成Canvasの背景画像を描画
const DrawCoordinateImage = (): void => {
  let background: HTMLImageElement = new Image();
  const imageURL: string =
    "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";

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

// const DrawBaseFaceImage = (): void => {
//   let background: HTMLImageElement = new Image();
//   const imageURL: string =
//     "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";

//   background.src = imageURL;
//   //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
//   background.onload = () => {
//     if (fpctx) {
//       fpctx.drawImage(
//         background,
//         0,
//         0,
//         facialPartsCanvas.width,
//         (background.height * facialPartsCanvas.width) / background.width
//       );
//     }
//   };
// };

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
    //left
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

    //right
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

//x座標とy座標から喜怒哀楽のいずれかを返す
const ReturnEmotion = (x: number, y: number): void => {
  // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
  // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ
  // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
  // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
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

//ドラッグ中
let pre: any = 0;
let cur: any = 0;
let elapsedTime: number = 0;
const fpsInterval: number = (1.0 / 50) * 1000; //60fps
coordinateCanvas.addEventListener("mousemove", (e: MouseEvent) => {
  //時刻の引き算をたす
  //60fpsにしたい
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
          base64Images.push(facialPartsCanvas.toDataURL());
          dataX.push(mousePosX);
          dataY.push(mousePosY);
        }
      }
      preMousePosX = mousePosX;
      preMousePosY = mousePosY;
      elapsedTime = 0;
    }
    pre = Date.now();
  }
});

//ドラッグ終わり！
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

const InitFacialParts = (): void => {
  const emotionFaceDiv: HTMLElement | null = document.getElementById(
    "emotion-face"
  );
  const coordinateDiv: HTMLElement | null = document.getElementById(
    "coordinate"
  );
  if (!emotionFaceDiv) {
    console.log("ERR! emotion-face div-element does not exit");
    return;
  }
  if (!coordinateDiv) {
    console.log("ERR! coordinate div-element does not exit");
    return;
  }

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
  mouse.lineWidth = 4;

  //眉の相対的な場所を求める
  leftEyebrow.lineWidth = 4;
  leftEyebrow.startPosX = centerPosX - 45;
  leftEyebrow.startPosY = centerPosY - 33;
  leftEyebrow.endPosX = centerPosX - 20;
  leftEyebrow.endPosY = centerPosY - 33;
  leftEyebrow.maxEndHeight = faceHeight / 13;
  //右眉
  rightEyebrow.lineWidth = 4;
  rightEyebrow.startPosX = centerPosX + 45;
  rightEyebrow.startPosY = centerPosY - 33;
  rightEyebrow.endPosX = centerPosX + 20;
  rightEyebrow.endPosY = centerPosY - 33;
  rightEyebrow.maxEndHeight = faceHeight / 13;

  //目の設定
  rightEye.size = 25;
  rightEye.pos = 35;
  leftEye.size = 25;
  leftEye.pos = 35;

  DrawFace(corrdinate.height / 2, corrdinate.height / 2);
};

//初期設定
const Init = (): void => {
  DrawCoordinateImage();
  InitFacialParts();
};

const main = (() => {
  Init();
})();

window.onload = () => {};

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

//画像データをpostように１行の文字列に変換する
const FormatImageData = (base64Images: string[]): string => {
  const images: string[] = base64Images.map((imageWithInfo) => {
    return imageWithInfo.split(",")[1] + ",";
  });

  const imageDataLine: string = images.reduce((str1, str2) => str1 + str2);
  return imageDataLine;
};

const devUrl = "https://8080-dot-13572060-dot-devshell.appspot.com/createGif";
const productionURL = "https://august-jigsaw-286205.df.r.appspot.com/createGif";
const PostImageData = (imageLine: string): void => {
  $.ajax({
    crossDomain: true,
    type: "POST",
    // url: "http://localhost:8080/returnGIF",
    // url: "http://localhost:5001/faceicon-db24d/us-central1/createGif",
    url: devUrl,
    data: { base64Images: imageLine },
    success: (data, dataType) => {
      console.log(data);
      console.log(dataType);
    },
    error: () => {
      console.log("Err");
    },
  });
};

const PostImageDataToFirebaseStorage = () => {
  $.ajax({
    crossDomain: true,
    // type: "POST",
    type: "GET",
    url:
      "https://8080-dot-13572060-dot-devshell.appspot.com/?authuser=0&environment_name=default",
    // data: { base64Images: imageLine },
    success: (data: any, dataType: any) => {
      console.log(data);
      console.log(dataType);
    },
    error: () => {
      console.log("Err");
    },
  });
};

const okButton = document.getElementById("decide-button");
if (okButton) {
  okButton.onclick = () => {
    //大体60fps
    pullDataX = dataX.concat();
    pullDataY = dataY.concat();
    faceAnimation = requestAnimationFrame(faceAnimationStep);

    PostImageData(FormatImageData(base64Images));
    // PostImageDataToFirebaseStorage();
  };
}
