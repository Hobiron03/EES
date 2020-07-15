interface Mouse {
    startPosX: number
    startPosY: number
    //ベジエ曲線の制御点
    bezierControlPosX: number
    bezierControlPosY: number
    endPosX: number
    endPosY: number
    maxUShapePos: number
};
let mouse: Mouse = {
    startPosX: 0,
    startPosY: 0,
    bezierControlPosX: 0,
    bezierControlPosY: 0,
    endPosX: 0,
    endPosY: 0,
    maxUShapePos: 0,
};


interface EyeBrows{
    startPosX: number
    startPosY: number
    endPosX: number
    endPosY: number
};

//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext('2d');
let coordinateWidth: number;
let coordinateHeight: number;

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

//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
const RenderMouth = (x: number): void => {
    //x座標から口の傾きを計算する width400で-66から66くらい
    //xの値を最大mouse.maxUshapePosに正規化
    let curveDegree = (x * (mouse.maxUShapePos*2)) / coordinateWidth;
    if(curveDegree > mouse.maxUShapePos){
        curveDegree = curveDegree-mouse.maxUShapePos;
    }
    else if (x < coordinateHeight / 2){
        curveDegree = curveDegree-mouse.maxUShapePos;
    }
    //口の描画
    if (fpctx){
        ResetFacialParts();
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = 4;
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(mouse.startPosX, mouse.endPosY);
        fpctx.quadraticCurveTo(mouse.bezierControlPosX, mouse.bezierControlPosY + curveDegree, mouse.endPosX, mouse.endPosY);
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
    RenderMouth(e.offsetX);

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

            //口の描画（仮）
            RenderMouth(mousePosX);
        }
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


const InitMouse = (): void => {
    const emotionFaceDiv: HTMLElement | null = document.getElementById('emotion-face');
    const coordinateDiv: HTMLElement | null = document.getElementById('coordinate');
    if(!emotionFaceDiv){
        console.log("ERR! emotion-face div does not exit");
        return;
    }
    if(!coordinateDiv){
        console.log("ERR! emotion-face div does not exit");
        return;
    }

    coordinateWidth = coordinateDiv.clientWidth;
    coordinateHeight = coordinateDiv.clientHeight;

    console.log("coordinateWidth: " + coordinateWidth);

    const faceWidth = emotionFaceDiv.clientWidth;
    const faceHeight = emotionFaceDiv.clientWidth;

    const centerPosX: number = faceWidth / 2;
    const centerPosY: number = faceHeight / 2;
    const offsetMouseWidth: number = faceWidth / 4;
    const offsetMouseHeight: number = faceHeight / 5;

    mouse.startPosX = centerPosX - offsetMouseWidth;
    mouse.startPosY = centerPosY + offsetMouseHeight;
    mouse.bezierControlPosX = centerPosX;
    mouse.bezierControlPosY = centerPosY + offsetMouseHeight;
    mouse.endPosX = centerPosX + offsetMouseWidth;
    mouse.endPosY = centerPosY + offsetMouseHeight;
    mouse.maxUShapePos = faceWidth / 3;

    RenderMouth(0);
};

//初期設定
const Init = ():void => {
    DrawCoordinateImage();
    InitMouse();
};


const main = (() => {
    Init();
})();


window.onload = () => {
    console.log("Read page!!");
};