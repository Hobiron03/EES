const CoordinateCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
const cctx:CanvasRenderingContext2D | null = CoordinateCanvas.getContext('2d');

const FaceCanvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('emotion-face');
const fctx:CanvasRenderingContext2D | null = FaceCanvas.getContext('2d');

// ドラッグ可能な座標の背景画像を描画
const DrawCoordinateImage = ():void => {
    let background: HTMLImageElement = new Image();
    const canvas_width: number = 400;
    const canvas_hegiht: number = 400;
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";

    background.src = imageURL;
    background.onload = () => {
        if (cctx != null){
            cctx.drawImage(background,0,0,canvas_width, background.height * canvas_width / background.width);
        }
    }
};

// ドラッグで作成する顔の輪郭部分を表示
const DrowBaseFaceImage = ():void => {
    let background: HTMLImageElement = new Image();
    const canvas_width: number = 200;
    const canvas_hegiht: number = 200;
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/BaseFace.png";

    background.src = imageURL;
    background.onload = () => {
        if (fctx != null){
            fctx.drawImage(background,0,0,canvas_width, background.height * canvas_width / background.width);
        }
    }
};

const Init = ():void => {
    DrowBaseFaceImage();
    DrawCoordinateImage();
};

const main = (() => {
    Init();
})();

// ページ読み込み後に走る
window.onload = () => {
    console.log("Read page!!");
};