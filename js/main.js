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
};
//ドラッグ開始
var isMouseDrag = false;
var preMousePosX;
var preMousePosY;
CoordinateCanvas.addEventListener('mousedown', function (e) {
    isMouseDrag = true;
    //座標の原点は画像の左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;
});
//ドラッグ中
CoordinateCanvas.addEventListener('mousemove', function (e) {
    //座標の原点は画像の左上
    if (isMouseDrag) {
        var x = e.offsetX;
        var y = e.offsetY;
        if (cctx) {
            //パスの開始
            cctx.beginPath();
            //線の色セット
            cctx.strokeStyle = "black";
            //線の太さセット
            cctx.lineWidth = 5;
            //線端の形状セット
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(x, y);
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();
        }
        preMousePosX = x;
        preMousePosY = y;
    }
});
//ドラッグ終わり！
CoordinateCanvas.addEventListener('mouseup', function (e) {
    isMouseDrag = false;
    //座標の原点は画像の左上
    var x = e.offsetX;
    var y = e.offsetY;
    console.log("upX座標は: " + x);
    console.log("upY座標は: " + y);
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
