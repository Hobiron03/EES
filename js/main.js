//座標部分のCanvas
var CoordinateCanvas = document.getElementById('coordinate');
var cctx = CoordinateCanvas.getContext('2d');
//顔部分のCanvas
var FaceCanvas = document.getElementById('emotion-face');
var fctx = FaceCanvas.getContext('2d');
// 顔アイコン作成Canvasの背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (cctx) {
            cctx.drawImage(background, 0, 0, CoordinateCanvas.width, background.height * CoordinateCanvas.width / background.width);
        }
    };
};
// ドラッグで作成する顔の輪郭部分を表示
var DrawBaseFaceImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (fctx) {
            fctx.drawImage(background, 0, 0, FaceCanvas.width, background.height * FaceCanvas.width / background.width);
        }
    };
    //顔パーツを描画
    InitFacialParts();
};
//顔アイコンのパーツ(眉, 目, 口)の初期設定
var InitFacialParts = function () {
    // if (fctx){
    //     //パスの開始
    //     fctx.beginPath();
    //     fctx.strokeStyle = "black";
    //     fctx.lineWidth = 5;
    //     //線端の形状セット
    //     fctx.lineCap = "round";
    //     fctx.globalCompositeOperation = 'source-over';
    //     //全フレームの点と結ぶ
    //     fctx.lineTo(preMousePosX, preMousePosY);
    //     fctx.stroke();
    // }
};
var isMouseDrag = false;
//前フレームの点を保持する
var preMousePosX;
var preMousePosY;
//ドラッグ開始
CoordinateCanvas.addEventListener('mousedown', function (e) {
    isMouseDrag = true;
    //canvasの原点は左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;
    if (cctx) {
        cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
        DrawCoordinateImage();
    }
});
//ドラッグ中
CoordinateCanvas.addEventListener('mousemove', function (e) {
    if (isMouseDrag) {
        //canvasの原点は左上
        var mousePosX = e.offsetX;
        var mousePosY = e.offsetY;
        if (cctx) {
            //パスの開始
            cctx.beginPath();
            cctx.strokeStyle = "black";
            cctx.lineWidth = 2;
            //線端の形状セット
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(mousePosX, mousePosY);
            //全フレームの点と結ぶ
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();
        }
        preMousePosX = mousePosX;
        preMousePosY = mousePosY;
    }
});
//ドラッグ終わり！
CoordinateCanvas.addEventListener('mouseup', function (e) {
    isMouseDrag = false;
});
//初期設定
var Init = function () {
    DrawBaseFaceImage();
    DrawCoordinateImage();
};
var main = (function () {
    Init();
})();
window.onload = function () {
    console.log("Read page!!");
};
