;
var mouse = {
    startPosX: 0,
    startPosY: 0,
    bezierControlPos: 0,
    endPosX: 0,
    endPosY: 0
};
//座標部分のCanvas
var coordinateCanvas = document.getElementById('coordinate');
var cctx = coordinateCanvas.getContext('2d');
// facial-parts
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
    //x座標から口の傾きを計算する
    //口の描画
    if (fpctx) {
        ResetFacialParts();
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = 4;
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(mouse.startPosX, mouse.endPosY);
        fpctx.quadraticCurveTo(mouse.bezierControlPos, mouse.bezierControlPos + x, mouse.endPosX, mouse.endPosY);
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
    //前の軌跡を消去する
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
        //線端の形状セット
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
            cctx.lineWidth = 4;
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(mousePosX, mousePosY);
            //前フレームの点と結ぶ
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();
            //口の描画（仮）
            RenderMouth(0);
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
var InitMouse = function () {
    var emotionFaceDiv = document.getElementById('emotion-face');
    if (!emotionFaceDiv) {
        console.log("ERR! emotion-face div does not exit");
        return;
    }
    var centerPosX = emotionFaceDiv.clientWidth / 2;
    var centerPosY = emotionFaceDiv.clientHeight / 2;
    var offsetMouseWidth = emotionFaceDiv.clientWidth / 4;
    var offsetMouseHeight = emotionFaceDiv.clientHeight / 5;
    mouse.startPosX = centerPosX - offsetMouseWidth;
    mouse.startPosY = centerPosY + offsetMouseHeight;
    mouse.bezierControlPos = centerPosY;
    mouse.endPosX = centerPosX + offsetMouseWidth;
    mouse.endPosY = centerPosY + offsetMouseHeight;
    RenderMouth(0);
};
//初期設定
var Init = function () {
    DrawCoordinateImage();
    InitMouse();
};
var main = (function () {
    Init();
})();
window.onload = function () {
    console.log("Read page!!");
};
