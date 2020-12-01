export default interface Mouse {
  startPosX: number;
  startPosY: number;
  //ベジエ曲線の制御点
  bezierControlPosX: number;
  bezierControlPosY: number;
  endPosX: number;
  endPosY: number;
  maxUShapePos: number;
  lineWidth: number;
}
