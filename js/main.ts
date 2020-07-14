// 座標の背景画像を描画
const DrawCoordinateImage = (ctx: CanvasRenderingContext2D | null):void => {
    let background: HTMLImageElement = new Image();
    const canvas_width: number = 400;
    const canvas_hegiht: number = 400;
    const imageURL: string = "/Users/kawakamiyuudai/研究プロジェクト/EmotionExpressionSystem/canvas-project/Images/Cordinate.png";

    background.src = imageURL;
    background.onload = () => {
        if (ctx != null){
            ctx.drawImage(background,0,0,canvas_width, background.height * canvas_width / background.width);
        }
    }
}

const main = (() => {
    const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('coordinate');
    const ctx:CanvasRenderingContext2D | null = canvas.getContext('2d');

    DrawCoordinateImage(ctx);
})();

// ページ読み込み後に走る
window.onload = () => {
    console.log("Read page!!");
}