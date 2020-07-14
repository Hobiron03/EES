//座標部分のCanvas
const CoordinateCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx:CanvasRenderingContext2D | null = CoordinateCanvas.getContext('2d');

//顔部分のCanvas
const FaceCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('emotion-face');
const fctx:CanvasRenderingContext2D | null = FaceCanvas.getContext('2d');

// ドラッグ可能な座標の背景画像を描画
const DrawCoordinateImage = ():void => {
    let background: HTMLImageElement = new Image();
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    background.src = imageURL;

    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = () => {
        if (cctx != null){
            cctx.drawImage(background,0,0,CoordinateCanvas.width, background.height * CoordinateCanvas.width / background.width);
        }
    }
};

// ドラッグで作成する顔の輪郭部分を表示
const DrowBaseFaceImage = ():void => {
    let background: HTMLImageElement = new Image();
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    background.src = imageURL;

    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = () => {
        if (fctx != null){
            fctx.drawImage(background,0,0,FaceCanvas.width, background.height * FaceCanvas.width / background.width);
        }
    }
};


let isMouseDrag:boolean = false;
CoordinateCanvas.addEventListener('mousedown', (e:MouseEvent) => {
    isMouseDrag = true;
    //座標の原点は画像の左上
    const x: number = e.offsetX;
    const y: number = e.offsetY;

    console.log("X座標は: " + x);
    console.log("Y座標は: " + y);
});


CoordinateCanvas.addEventListener('mousemove', (e) => {
    //座標の原点は画像の左上
    if(isMouseDrag){
        const x: number = e.offsetX;
        const y: number = e.offsetY;

        console.log("moveX座標は: " + x);
        console.log("moveY座標は: " + y);
    }
});


CoordinateCanvas.addEventListener('mouseup', e => {
    isMouseDrag = false;
    //座標の原点は画像の左上
    const x: number = e.offsetX;
    const y: number = e.offsetY;

    console.log("upX座標は: " + x);
    console.log("upY座標は: " + y);
});

//初期設定
const Init = ():void => {
    DrowBaseFaceImage();
    DrawCoordinateImage();
};


const main = (() => {
    Init();
})();


window.onload = () => {
    console.log("Read page!!");
};