interface Mouse {
    startPos: number
    //ベジエ曲線の制御点
    bezierControlPos: number,
    endPos: number,
};

interface EyeBrows{
    startPos: number
    endPos: number,
}


//座標部分のCanvas
const coordinateCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx: CanvasRenderingContext2D | null = coordinateCanvas.getContext('2d');

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


let mouseCurveDegree = 60;
let mouseInfo: Mouse = {
    startPos: 0,
    bezierControlPos: 0,
    endPos: 0,
};
//顔アイコンの口パーツを描画する。X座標の大きさによって口の傾き具合が変わる
const RenderMouth = (): void => {
    const emotionFaceDiv: HTMLElement | null = document.getElementById('emotion-face');
    if(!emotionFaceDiv){
        return;
    }
    const centerPosX: number = emotionFaceDiv.clientWidth / 2;
    const centerPosY: number = emotionFaceDiv.clientHeight / 2;

    const offsetMouseWidth: number = emotionFaceDiv.clientWidth / 4;
    const offsetMouseHeight: number = emotionFaceDiv.clientHeight / 5;

    console.log("offMouseis: " + offsetMouseWidth);
    //口の描画
    if (fpctx){
        ResetFacialParts();
        fpctx.beginPath();
        fpctx.strokeStyle = "black";
        fpctx.lineWidth = 4;
        //線端の形状セット
        fpctx.lineCap = "round";
        fpctx.globalCompositeOperation = 'source-over';
        fpctx.moveTo(centerPosX-offsetMouseWidth, centerPosY + offsetMouseHeight);
        fpctx.quadraticCurveTo(centerPosX, centerPosY+mouseCurveDegree, centerPosX+offsetMouseWidth, centerPosY + offsetMouseHeight);
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
            cctx.lineWidth = 4;
            cctx.lineCap = "round";
            cctx.globalCompositeOperation = 'source-over';
            cctx.moveTo(mousePosX, mousePosY);
            //前フレームの点と結ぶ
            cctx.lineTo(preMousePosX, preMousePosY);
            cctx.stroke();

            //////
            //口の描画（仮）
            mouseCurveDegree = e.offsetY;
            RenderMouth();
            //////
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

//初期設定
const Init = ():void => {
    DrawCoordinateImage();
    RenderMouth();
};


const main = (() => {
    Init();

})();


window.onload = () => {
    console.log("Read page!!");
};