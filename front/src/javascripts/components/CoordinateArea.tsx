import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../contexts/AppContext";
import {
  FILTER_BY_FACEICON,
  FILTER_BY_EMOTION,
  FILTER_BY_DTW,
} from "../actions";

//----自分で定義した型をインポート---
import Mouse from "../../javascripts/@types/mouse";
import Eyebrow from "../../javascripts/@types/eyebrows";
import Eye from "../../javascripts/@types/eye";
import coordinate from "../../javascripts/@types/coordinate";
//----------------------------------------

//----自作した関数のインポート（srcのディレクトリに配置してある）---
import PostImageData from "../PostImageData";
import ConvertRgbFormat from "../ConvertRgbFormat";
import CalculateColor from "../CalculateColor";
import FormatImageData from "../FormatImageData";
//----------------------------------------

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

let corrdinate: coordinate = {
  width: 0,
  height: 0,
};

let dataX: number[] = [];
let dataY: number[] = [];

const CoordinateArea = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(AppContext);

  // Coordinate
  const [cctx, setContext] = useState(null);
  const [coordinateCanvas, setCoordinateCanvas] = useState(null);

  // 顔アイコン
  const [fpctx, setFaceIconContext] = useState(null);
  const [facialPartsCanvas, setFacialPartsCanvas] = useState(null);

  const [emotionFaceDiv, setEmotionFaceDiv] = useState(null);
  const [coordinateDiv, setCoordinateDiv] = useState(null);
  // 画像読み込み完了トリガー
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const coordinateCanvas: HTMLCanvasElement = document.getElementById(
      "coordinate"
    ) as HTMLCanvasElement;
    setCoordinateCanvas(coordinateCanvas);

    const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext(
      "2d"
    );
    setContext(cctx);

    // 顔アイコンの口を描画のCanvas
    const facialPartsCanvas: HTMLCanvasElement = document.getElementById(
      "facial-parts"
    ) as HTMLCanvasElement;
    setFacialPartsCanvas(facialPartsCanvas);

    const fpctx: CanvasRenderingContext2D | null = facialPartsCanvas.getContext(
      "2d"
    );
    setFaceIconContext(fpctx);

    const emotionFaceDiv: HTMLElement | null = document.getElementById(
      "review-area__main__make-face-field__Top__emotion-face"
    );
    setEmotionFaceDiv(emotionFaceDiv);

    const coordinateDiv: HTMLElement | null = document.getElementById(
      "coordinate"
    );
    setCoordinateDiv(coordinateDiv);
  }, []);

  useEffect(() => {
    if (cctx !== null) {
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
    }
    setLoaded(true);
  }, [cctx]);

  useEffect(() => {
    if (loaded) {
      // それに続く処理
      DrawCoordinateImage();
      InitFacialParts();
    }
  }, [loaded]);

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

  const ResetCoordinate = (): void => {
    if (cctx) {
      cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
      // dataX.splice(0);
      // dataY.splice(0);
      DrawCoordinateImage();
    }
  };

  //---------HandleMouseDown----------------------
  //後にuseStateに置き換える必要あり？
  let isMouseDrag: boolean = false;
  //前フレームの点を保持する変数
  let preMousePosX: number;
  let preMousePosY: number;

  let startPosX: number;
  let startPosY: number;
  const HandleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    //前の軌跡を消去
    ResetCoordinate();
    isMouseDrag = true;
    //canvasの原点は左上
    preMousePosX = e.nativeEvent.offsetX;
    preMousePosY = e.nativeEvent.offsetY;

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
        DrawFace(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        startPosX = e.nativeEvent.offsetX;
        startPosY = e.nativeEvent.offsetY;
      }
    }
  };

  //----------ドラッグ中----------------------
  let pre: any = 0;
  let cur: any = 0;
  let elapsedTime: number = 0;
  let faceScale: number = 1.0;
  const fpsInterval: number = (1.0 / 30) * 1000; //60fps
  const HandleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isMouseDrag) {
      cur = Date.now();
      elapsedTime += cur - pre;
      if (elapsedTime > fpsInterval) {
        //canvasの原点は左上
        const mousePosX: number = e.nativeEvent.offsetX;
        const mousePosY: number = e.nativeEvent.offsetY;

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
            // html2canvas(emotionFaceDiv, {
            //   scale: faceScale,
            // }).then((canvas) => {
            //   base64Images.push(canvas.toDataURL());
            // });
            dataX.push(mousePosX);
            dataY.push(mousePosY);
            //座標によって顔アイコンの顔を変化させる
            //SetEmotionColor(preMousePosX, preMousePosY);
          }
        }
        preMousePosX = mousePosX;
        preMousePosY = mousePosY;

        // if (isApplyFaceColor) {
        //   SetEmotionColor(preMousePosX, preMousePosY);
        // }
        elapsedTime = 0;
      }
      pre = Date.now();
    }
  };

  let endPosX: number = 0;
  let endPosY: number = 0;
  const HandleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    isMouseDrag = false;
    //終点の描画
    if (cctx) {
      cctx.beginPath();
      cctx.strokeStyle = "red";
      cctx.lineWidth = 20;
      cctx.lineCap = "round";
      cctx.globalCompositeOperation = "source-over";
      //全フレームの点と結ぶ
      cctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      cctx.stroke();
    }

    //視点と終点のみを見る際に使用するフィルター
    // let startEmotion = ReturnEmotion(startPosX, startPosY);
    // let endEmotion = ReturnEmotion(
    //   e.nativeEvent.offsetX,
    //   e.nativeEvent.offsetY
    // );
    // dispatch({
    //   type: FILTER_BY_FACEICON,
    //   filterFaceIcon: [startEmotion, endEmotion],
    // });

    //DTWの計算で使用する、検索用の軌跡データを保存しておく。
    dispatch({
      type: FILTER_BY_DTW,
      timeSeriesData: { timeSeriesDataX: dataX, timeSeriesDataY: dataY },
    });
    dataX = [];
    dataY = [];
  };

  const ResetFacialParts = (): void => {
    if (fpctx) {
      fpctx.clearRect(
        0,
        0,
        fpctx.canvas.clientWidth,
        fpctx.canvas.clientHeight
      );
    }
  };

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

  return (
    <div className={classes.coordinate}>
      <div id="review-area__main__make-face-field__Top__emotion-face">
        <canvas id="facial-parts" width="150" height="150"></canvas>
      </div>

      <canvas
        width="400"
        height="400"
        id="coordinate"
        onMouseDown={(e) => HandleMouseDown(e)}
        onMouseUp={(e) => HandleMouseUp(e)}
        onMouseMove={(e) => HandleMouseMove(e)}
      ></canvas>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  coordinate: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
}));

export default CoordinateArea;
