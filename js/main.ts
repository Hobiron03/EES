//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext('2d');

//顔輪郭部分のCanvas
// const faceCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('emotion-face');
// const fctx: CanvasRenderingContext2D | null = faceCanvas.getContext('2d');

// facial-parts
const facialPartsCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('facial-parts');
const fpctx: CanvasRenderingContext2D | null = facialPartsCanvas.getContext('2d');

// 顔アイコン作成Canvasの背景画像を描画
const DrawCoordinateImage = (): void => {
    let background: HTMLImageElement = new Image();
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";
    
    background.src = imageURL;
    //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
    background.onload = () => {
        if (cctx){
            cctx.drawImage(background,0,0,coordinateCanvas.width, background.height * coordinateCanvas.width / background.width);
        }
    }
};

// // ドラッグで作成する顔の輪郭部分を表示
// const DrawBaseFaceImage = (): void => {
//     let background: HTMLImageElement = new Image();
//     const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";
    
//     background.src = imageURL;
//     //画像をCanvasのサイズに合わせて等倍して画像をcanvasに貼り付ける.
//     background.onload = () => {
//         if (fctx){
//             fctx.drawImage(background,0,0,faceCanvas.width, background.height * faceCanvas.width / background.width);
//         }
//     }
//     //顔パーツを描画
//     InitFacialParts();
// };

let mouseCurveDegree = 0;
//顔アイコンのパーツ(眉, 目, 口)の初期設定
const InitFacialParts = (): void => {
    //中心の座標
    const centerPosX: number = 100;
    const centerPosY: number = 100;
    
    //口の描画
    if (fpctx){
        ResetFacialParts();
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = 4;
        //線端の形状セット
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(centerPosX-100,centerPosY);
        fpctx.quadraticCurveTo(centerPosX,centerPosY+mouseCurveDegree,centerPosX+100,centerPosY);
        fpctx.stroke();
    }

};


const ResetCoordinate = (): void => {
    if(cctx){
        cctx.clearRect(0, 0, cctx.canvas.clientWidth, cctx.canvas.clientHeight);
        DrawCoordinateImage();
    }
};


const ResetFacialParts = (): void => {
    if(fpctx){
        fpctx.clearRect(0, 0, fpctx.canvas.clientWidth, fpctx.canvas.clientHeight);
    }
};


let isMouseDrag: boolean = false;
//前フレームの点を保持する変数
let preMousePosX: number;
let preMousePosY: number;
//ドラッグ開始
coordinateCanvas.addEventListener('mousedown', (e: MouseEvent) => {    
    //前の軌跡を消去する
    ResetCoordinate();

    isMouseDrag = true;
    //canvasの原点は左上
    preMousePosX = e.offsetX;
    preMousePosY = e.offsetY;

    //始点の描画
    if (cctx){
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

let count: number = 0;
//ドラッグ中
coordinateCanvas.addEventListener('mousemove', (e: MouseEvent) => {
    if(isMouseDrag){
        //canvasの原点は左上
        const mousePosX: number = e.offsetX;
        const mousePosY: number = e.offsetY;

        //軌跡の描画
        if (cctx){
            cctx.beginPath();
            cctx.strokeStyle = "black";
            cctx.lineWidth = 2;
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(mousePosX, mousePosY);
            //前フレームの点と結ぶ
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();

            mouseCurveDegree = e.offsetY;
            InitFacialParts();
        }
        console.log("count=" + count);
        count += 1;
        preMousePosX = mousePosX;
        preMousePosY = mousePosY;
    }
});

//ドラッグ終わり！
coordinateCanvas.addEventListener('mouseup', (e: MouseEvent) => {
    isMouseDrag = false;

    //終点の描画
    if (cctx){
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

//初期設定
const Init = ():void => {
    DrawCoordinateImage();
};


const main = (() => {
    Init();
})();


window.onload = () => {
    console.log("Read page!!");
};