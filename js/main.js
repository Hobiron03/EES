//座標部分のCanvas
var CoordinateCanvas = document.getElementById('coordinate');
var cctx = CoordinateCanvas.getContext('2d');
//顔部分のCanvas
var FaceCanvas = document.getElementById('emotion-face');
var fctx = FaceCanvas.getContext('2d');
// ドラッグ可能な座標の背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (cctx != null) {
            cctx.drawImage(background, 0, 0, CoordinateCanvas.width, background.height * CoordinateCanvas.width / background.width);
        }
    };
};
// ドラッグで作成する顔の輪郭部分を表示
var DrowBaseFaceImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (fctx != null) {
            fctx.drawImage(background, 0, 0, FaceCanvas.width, background.height * FaceCanvas.width / background.width);
        }
    };
};
CoordinateCanvas.addEventListener('mousedown', function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    console.log("X座標は: " + x);
    console.log("Y座標は: " + y);
});
//初期設定
var Init = function () {
    DrowBaseFaceImage();
    DrawCoordinateImage();
};
var main = (function () {
    Init();
})();
window.onload = function () {
    console.log("Read page!!");
};
