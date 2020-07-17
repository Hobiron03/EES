;
var mouse = {
    startPosX: 0,
    startPosY: 0,
    bezierControlPosX: 0,
    bezierControlPosY: 0,
    endPosX: 0,
    endPosY: 0,
    maxUShapePos: 0
};
;
var eyebrows = {
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0
};
//座標部分のCanvas
var coordinateCanvas = document.getElementById('coordinate');
var cctx = coordinateCanvas.getContext('2d');
var coordinateWidth;
var coordinateHeight;
// 顔アイコンの口を描画のCanvas
var facialPartsCanvas = document.getElementById('facial-parts');
var fpctx = facialPartsCanvas.getContext('2d');
// 顔アイコン作成Canvasの背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (cctx) {
            cctx.drawImage(background, 0, 0, coordinateCanvas.width, background.height * coordinateCanvas.width / background.width);
        }
    };
};
//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
var RenderMouth = function (x) {
    //x座標から口の傾きを計算する width400で-66から66くらい
    //xの値を0 ~ mouse.maxUShapePos*2の範囲に正規化
    var curveDegree = (x * (mouse.maxUShapePos * 2)) / coordinateWidth;
    if (curveDegree > mouse.maxUShapePos) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else if (x < coordinateHeight / 2) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else {
        //x座標が0のとき
        curveDegree = 0;
    }
    //口の描画
    if (fpctx) {
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = 4;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(mouse.startPosX, mouse.endPosY);
        fpctx.quadraticCurveTo(mouse.bezierControlPosX, mouse.bezierControlPosY + curveDegree, mouse.endPosX, mouse.endPosY);
        fpctx.stroke();
    }
};
//顔アイコンの眉パーツを描画する。Y座標の大きさによって眉の傾き具合が変わる
var RenderEyebrows = function (y) {
    var endOfEyebrowsHeight;
    //眉の描画
    if (fpctx) {
        fpctx.beginPath();
        fpctx.strokeStyle = 'black';
        fpctx.lineWidth = 4;
        fpctx.lineCap = 'round';
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(mouse.startPosX, mouse.endPosY);
        fpctx.lineTo(100, 100);
        fpctx.stroke();
    }
};
var ResetCoordinate = function () {
    if (cctx) {
        cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
        DrawCoordinateImage();
    }
};
var ResetFacialParts = function () {
    if (fpctx) {
        fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
    }
};
var isMouseDrag = false;
//前フレームの点を保持する変数
var preMousePosX;
var preMousePosY;
//ドラッグ開始
coordinateCanvas.addEventListener('mousedown', function (e) {
    //前の軌跡を消去
    ResetCoordinate();
    RenderMouth(e.offsetX);
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
        cctx.globalCompositeOperation = 'source-over';
        //全フレームの点と結ぶ
        cctx.lineTo(preMousePosX, preMousePosY);
        cctx.stroke();
    }
});
//ドラッグ中
coordinateCanvas.addEventListener('mousemove', function (e) {
    if (isMouseDrag) {
        //canvasの原点は左上
        var mousePosX = e.offsetX;
        var mousePosY = e.offsetY;
        //軌跡の描画
        if (cctx) {
            cctx.beginPath();
            cctx.strokeStyle = "black";
            cctx.lineWidth = 2;
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(mousePosX, mousePosY);
            //前フレームの点と結ぶ
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();
            if (fpctx) {
                ResetFacialParts();
                RenderMouth(mousePosX);
                RenderEyebrows(mousePosY);
            }
        }
        preMousePosX = mousePosX;
        preMousePosY = mousePosY;
    }
});
//ドラッグ終わり！
coordinateCanvas.addEventListener('mouseup', function (e) {
    isMouseDrag = false;
    //終点の描画
    if (cctx) {
        cctx.beginPath();
        cctx.strokeStyle = "red";
        cctx.lineWidth = 20;
        //線端の形状セット
        cctx.lineCap = "round";
        cctx.globalCompositeOperation = 'source-over';
        //全フレームの点と結ぶ
        cctx.lineTo(e.offsetX, e.offsetY);
        cctx.stroke();
    }
});
var InitFacialParts = function () {
    var emotionFaceDiv = document.getElementById('emotion-face');
    var coordinateDiv = document.getElementById('coordinate');
    if (!emotionFaceDiv) {
        console.log("ERR! emotion-face div does not exit");
        return;
    }
    if (!coordinateDiv) {
        console.log("ERR! coordinate div does not exit");
        return;
    }
    coordinateWidth = coordinateDiv.clientWidth;
    coordinateHeight = coordinateDiv.clientHeight;
    var faceWidth = emotionFaceDiv.clientWidth;
    var faceHeight = emotionFaceDiv.clientWidth;
    //顔画像の中心座標
    var centerPosX = faceWidth / 2;
    var centerPosY = faceHeight / 2;
    //口の相対的な位置（中心からの距離）
    var offsetMouseWidth = faceWidth / 4;
    var offsetMouseHeight = faceHeight / 5;
    //顔アイコンにおける口の相対的な場所を求める
    //顔アイコンの大きさに変化があっても良いように
    mouse.startPosX = centerPosX - offsetMouseWidth;
    mouse.startPosY = centerPosY + offsetMouseHeight;
    mouse.bezierControlPosX = centerPosX;
    mouse.bezierControlPosY = centerPosY + offsetMouseHeight;
    mouse.endPosX = centerPosX + offsetMouseWidth;
    mouse.endPosY = centerPosY + offsetMouseHeight;
    mouse.maxUShapePos = faceWidth / 3;
    RenderMouth(coordinateHeight / 2);
    RenderEyebrows(0);
};
//初期設定
var Init = function () {
    DrawCoordinateImage();
    InitFacialParts();
};
var main = (function () {
    Init();
})();
window.onload = function () {
};
