var Color;
(function (Color) {
    Color["BLACK"] = "black";
    Color["BLUE"] = "#629BEAa";
    Color["RED"] = "#FF5823";
})(Color || (Color = {}));
var mouse = {
    startPosX: 0,
    startPosY: 0,
    bezierControlPosX: 0,
    bezierControlPosY: 0,
    endPosX: 0,
    endPosY: 0,
    maxUShapePos: 0,
    lineWidth: 0
};
var leftEyebrow = {
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0,
    lineWidth: 0,
    maxEndHeight: 0
};
var rightEyebrow = {
    startPosX: 0,
    startPosY: 0,
    endPosX: 0,
    endPosY: 0,
    lineWidth: 0,
    maxEndHeight: 0
};
var rightEye = {
    pos: 0,
    size: 0
};
var leftEye = {
    pos: 0,
    size: 0
};
var emotionFaceDiv = document.getElementById("emotion-face");
var coordinateDiv = document.getElementById("coordinate");
//座標部分のCanvas
var coordinateCanvas = (document.getElementById("coordinate"));
var cctx = coordinateCanvas.getContext("2d");
var corrdinate = {
    width: 0,
    height: 0
};
//顔の変化のデータを格納しておく。大体60fpsくらいで入る
var dataX = [];
var dataY = [];
//顔画像のBase64のデータ
var base64Images = [];
// 顔アイコンの口を描画のCanvas
var facialPartsCanvas = (document.getElementById("facial-parts"));
var fpctx = facialPartsCanvas.getContext("2d");
// 顔アイコン作成Canvasの背景画像を描画
var DrawCoordinateImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (cctx) {
            cctx.drawImage(background, 0, 0, coordinateCanvas.width, (background.height * coordinateCanvas.width) / background.width);
        }
    };
};
var DrawBaseFaceImage = function () {
    var background = new Image();
    var imageURL = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = function () {
        if (fpctx) {
            fpctx.drawImage(background, 0, 0, facialPartsCanvas.width, (background.height * facialPartsCanvas.width) / background.width);
        }
    };
};
//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
var RenderMouth = function (x) {
    //x座標から口の傾きを計算する width400で-66から66くらい
    //xの値を0 ~ mouse.maxUShapePos*2の範囲に正規化
    var curveDegree = (x * (mouse.maxUShapePos * 2)) / corrdinate.width;
    if (curveDegree > mouse.maxUShapePos) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else if (x < corrdinate.height / 2) {
        curveDegree = curveDegree - mouse.maxUShapePos;
    }
    else {
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
        fpctx.quadraticCurveTo(mouse.bezierControlPosX, mouse.bezierControlPosY + curveDegree, mouse.endPosX, mouse.endPosY);
        fpctx.stroke();
    }
};
//顔アイコンの眉パーツを描画する。Y座標の大きさによって眉の傾き具合が変わる
var RenderEyebrows = function (y) {
    // y座標から眉尻の高さを計算する height:0~400で 眉:-15~15くらい
    var endOfEyebrowsHeight = (y * (rightEyebrow.maxEndHeight * 2)) / corrdinate.height;
    if (endOfEyebrowsHeight > rightEyebrow.maxEndHeight) {
        endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
    }
    else if (y < corrdinate.height / 2) {
        endOfEyebrowsHeight = endOfEyebrowsHeight - rightEyebrow.maxEndHeight;
    }
    else {
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
        fpctx.moveTo(leftEyebrow.startPosX, leftEyebrow.startPosY + endOfEyebrowsHeight); //眉尻
        fpctx.lineTo(leftEyebrow.endPosX, leftEyebrow.endPosY);
        fpctx.stroke();
        //right
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = rightEyebrow.lineWidth;
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = "source-over";
        fpctx.moveTo(rightEyebrow.startPosX, rightEyebrow.startPosY + endOfEyebrowsHeight); //眉尻
        fpctx.lineTo(rightEyebrow.endPosX, rightEyebrow.endPosY);
        fpctx.stroke();
    }
};
var RenderEye = function () {
    if (fpctx) {
        //左目
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = leftEye.size;
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = "source-over";
        fpctx.lineTo(facialPartsCanvas.clientWidth / 2 - leftEye.pos, facialPartsCanvas.clientHeight / 2);
        fpctx.stroke();
        //右目
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = rightEye.size;
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = "source-over";
        fpctx.lineTo(facialPartsCanvas.clientWidth / 2 + rightEye.pos, facialPartsCanvas.clientHeight / 2);
        fpctx.stroke();
    }
};
var DrawFace = function (x, y) {
    ResetFacialParts();
    RenderMouth(x);
    RenderEye();
    RenderEyebrows(y);
};
var ResetCoordinate = function () {
    if (cctx) {
        cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
        dataX.splice(0);
        dataY.splice(0);
        DrawCoordinateImage();
    }
};
var ResetFacialParts = function () {
    if (fpctx) {
        fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
    }
};
//x座標とy座標から喜怒哀楽のいずれかを返す
var ReturnEmotion = function (x, y) {
    // x: 0 ~ 200 && y: 0 ~ 200 -> 怒り
    // x: 0 ~ 200 && y: 200 ~ 400 -> 悲しみ
    // x: 200 ~ 400 && y: 0 ~ 200 -> 喜び
    // x: 200 ~ 400 && y: 200 ~ 400 -> 楽しみ
};
var isMouseDrag = false;
//前フレームの点を保持する変数
var preMousePosX;
var preMousePosY;
//ドラッグ開始
coordinateCanvas.addEventListener("mousedown", function (e) {
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
var pre = 0;
var cur = 0;
var elapsedTime = 0;
var fpsInterval = (1.0 / 60) * 1000; //60fps
coordinateCanvas.addEventListener("mousemove", function (e) {
    //時刻の引き算をたす
    //60fpsにしたい
    if (isMouseDrag) {
        cur = Date.now();
        elapsedTime += cur - pre;
        if (elapsedTime > fpsInterval) {
            //canvasの原点は左上
            var mousePosX = e.offsetX;
            var mousePosY = e.offsetY;
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
    if (emotionFaceDiv) {
        emotionFaceDiv.style.backgroundColor = rgb(255, 140, 0);
    }
});
function rgb(r, g, b) {
    return 'rgb(' + [(r || 0), (g || 0), (b || 0)].join(',') + ')';
}
//ドラッグ終わり！
coordinateCanvas.addEventListener("mouseup", function (e) {
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
var InitFacialParts = function () {
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
    var faceWidth = emotionFaceDiv.clientWidth;
    var faceHeight = emotionFaceDiv.clientWidth;
    //顔画像の中心座標
    var centerPosX = faceWidth / 2;
    var centerPosY = faceHeight / 2;
    //口の相対的な位置（中心からの距離）
    var offsetMouseWidth = faceWidth / 5;
    var offsetMouseHeight = faceHeight / 4;
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
var Init = function () {
    DrawCoordinateImage();
    InitFacialParts();
};
var main = (function () {
    Init();
})();
window.onload = function () { };
var faceAnimation;
var pullDataX = [];
var pullDataY = [];
var faceAnimationStep = function () {
    var progress = pullDataX.shift();
    var progressY = pullDataY.shift();
    DrawFace(progress, progressY);
    if (pullDataX.length != 0 || pullDataY.length != 0) {
        faceAnimation = requestAnimationFrame(faceAnimationStep);
    }
    else {
        cancelAnimationFrame(faceAnimation);
    }
};
//画像データをpostように１行の文字列に変換する
var FormatImageData = function (base64Images) {
    var images = base64Images.map(function (imageWithInfo) {
        return imageWithInfo.split(",")[1] + ",";
    });
    var imageDataLine = images.reduce(function (str1, str2) { return str1 + str2; });
    return imageDataLine;
};
var GCE_URL = "http://34.84.42.0/returnGIF";
var localURL = "http://0.0.0.0:80/returnGIF";
var imgElement = document.getElementById("gif");
var gifDownload = imgElement;
var PostImageData = function (imageLine) {
    $.ajax({
        crossDomain: true,
        type: "POST",
        // url: "http://localhost:8080/returnGIF",
        // url: "http://localhost:5001/faceicon-db24d/us-central1/createGif",
        url: GCE_URL,
        data: { base64Images: imageLine },
        success: function (data, dataType) {
            console.log(data);
            console.log(dataType);
        },
        error: function () {
            console.log("Err");
        }
    });
};
var PostImageDataToFirebaseStorage = function () {
    $.ajax({
        crossDomain: true,
        // type: "POST",
        type: "GET",
        url: "https://8080-dot-13572060-dot-devshell.appspot.com/?authuser=0&environment_name=default",
        // data: { base64Images: imageLine },
        success: function (data, dataType) {
            console.log(data);
            console.log(dataType);
        },
        error: function () {
            console.log("Err");
        }
    });
};
var okButton = document.getElementById("decide-button");
if (okButton) {
    okButton.onclick = function () {
        //大体60fps
        pullDataX = dataX.concat();
        pullDataY = dataY.concat();
        faceAnimation = requestAnimationFrame(faceAnimationStep);
        PostImageData(FormatImageData(base64Images));
        // PostImageDataToFirebaseStorage();
    };
}
