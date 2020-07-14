var CoordinateCanvas = document.getElementById('coordinate');
var cctx = CoordinateCanvas.getContext('2d');
var FaceCanvas = document.getElementById('emotion-face');
var fctx = FaceCanvas.getContext('2d');
// ドラッグ可能な座標の背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var canvas_width = 400;
    var canvas_hegiht = 400;
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    background.onload = function () {
        if (cctx != null) {
            cctx.drawImage(background, 0, 0, canvas_width, background.height * canvas_width / background.width);
        }
    };
};
// ドラッグで作成する顔の輪郭部分を表示
var DrowBaseFaceImage = function () {
    var background = new Image();
    var canvas_width = 200;
    var canvas_hegiht = 200;
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;
    background.onload = function () {
        if (fctx != null) {
            fctx.drawImage(background, 0, 0, canvas_width, background.height * canvas_width / background.width);
        }
    };
};
var Init = function () {
    DrowBaseFaceImage();
    DrawCoordinateImage();
};
var main = (function () {
    Init();
})();
// ページ読み込み後に走る
window.onload = function () {
    console.log("Read page!!");
};
