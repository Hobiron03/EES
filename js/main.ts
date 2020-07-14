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
let preMousePosX: number;
let preMousePosY: number;
CoordinateCanvas.addEventListener('mousedown', (e: MouseEvent) => {
    isMouseDrag = true;

    //座標の原点は画像の左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;
});

//ドラッグ中
CoordinateCanvas.addEventListener('mousemove', (e: MouseEvent) => {
    //座標の原点は画像の左上
    if(isMouseDrag){
        const x: number = e.offsetX;
        const y: number = e.offsetY;

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
            cctx.moveTo(x, y);
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();
        }

        preMousePosX = x;
        preMousePosY = y;
    }
});

//ドラッグ終わり！
CoordinateCanvas.addEventListener('mouseup', (e: MouseEvent) => {
    isMouseDrag = false;
    //座標の原点は画像の左上
    const x: number = e.offsetX;
    const y: number = e.offsetY;

    console.log("upX座標は: " + x);
    console.log("upY座標は: " + y);
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