// 座標の背景画像を描画する
var DrawCoordinateImage = function (ctx) {
    var background = new Image();
    var canvas_width = 400;
    var canvas_hegiht = 400;
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    background.onload = function () {
        if (ctx != null) {
            ctx.drawImage(background, 0, 0, canvas_width, background.height * canvas_width / background.width);
        }
    };
};
var main = (function () {
    var canvas = document.getElementById('coordinate');
    var ctx = canvas.getContext('2d');
    DrawCoordinateImage(ctx);
})();
// ページ読み込み後に走る
window.onload = function () {
    console.log("Read page!!");
};
