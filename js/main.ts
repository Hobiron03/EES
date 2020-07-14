//座標部分のCanvas
const CoordinateCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx:CanvasRenderingContext2D | null = CoordinateCanvas.getContext('2d');

//顔部分のCanvas
const FaceCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('emotion-face');
const fctx:CanvasRenderingContext2D | null = FaceCanvas.getContext('2d');

// 顔アイコン作成Canvasの背景画像を描画
const DrawCoordinateImage = ():void => {
    let background: HTMLImageElement = new Image();
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;

    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = () => {
        if (cctx){
            cctx.drawImage(background,0,0,CoordinateCanvas.width, background.height * CoordinateCanvas.width / background.width);
        }
    }
};

// ドラッグで作成する顔の輪郭部分を表示
const DrawBaseFaceImage = ():void => {
    let background: HTMLImageElement = new Image();
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;

    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = () => {
        if (fctx){
            fctx.drawImage(background,0,0,FaceCanvas.width, background.height * FaceCanvas.width / background.width);
        }
    }
};

//ドラッグ開始
let isMouseDrag:boolean = false;
//前フレームの点を保持する
let preMousePosX: number;
let preMousePosY: number;
CoordinateCanvas.addEventListener('mousedown', (e: MouseEvent) => {
    isMouseDrag = true;

    //canvasの原点は左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;
});

//ドラッグ中
CoordinateCanvas.addEventListener('mousemove', (e: MouseEvent) => {
    if(isMouseDrag){
        //canvasの原点は左上
        const mousePosX: number = e.offsetX;
        const mousePosY: number = e.offsetY;

        if (cctx){
            //パスの開始
            cctx.beginPath();
            //線の色セット
            cctx.strokeStyle = "black";
            //線の太さセット
            cctx.lineWidth = 5;
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
CoordinateCanvas.addEventListener('mouseup', (e: MouseEvent) => {
    isMouseDrag = false;
});

//初期設定
const Init = ():void => {
    DrawBaseFaceImage();
    DrawCoordinateImage();
};


const main = (() => {
    Init();
})();


window.onload = () => {
    console.log("Read page!!");
};