// const baseFaceSelectButtonNormal = document.getElementById(
//   "mask-select-area-normal"
// );
// if (baseFaceSelectButtonNormal) {
//   baseFaceSelectButtonNormal.style.backgroundImage = "url(../images/Beard.png)";

//   baseFaceSelectButtonNormal.onclick = () => {
//     console.log(baseFaceSelectButtonNormal);
//     emotionFaceDiv.style.backgroundImage = "url(../images/BaseFace.png)";
//   };
// }

// const baseFaceSelectButtonCat = document.getElementById("mask-select-area-cat");
// baseFaceSelectButtonCat.style.backgroundImage = "url(../images/Glusses.png)";

// if (baseFaceSelectButtonCat) {
//   baseFaceSelectButtonCat.onclick = () => {
//     emotionFaceDiv.style.backgroundImage = "url(../images/cat.png)";
//   };
// }

// const baseFaceSelectButtonGlasses = document.getElementById(
//   "mask-select-area-glasses"
// );
// if (baseFaceSelectButtonGlasses) {
//   baseFaceSelectButtonGlasses.onclick = () => {
//     emotionFaceDiv.style.backgroundImage = "url(../images/Glusses.png)";
//   };
// }

// const baseFaceSelectButtonCheek = document.getElementById(
//   "mask-select-area-cheek"
// );
// if (baseFaceSelectButtonCheek) {
//   baseFaceSelectButtonCheek.onclick = () => {
//     emotionFaceDiv.style.backgroundImage = "url(../images/cheek.png)";
//   };
// }

// const baseFaceSelectButtonDanger = document.getElementById(
//   "mask-select-area-danger"
// );
// if (baseFaceSelectButtonDanger) {
//   baseFaceSelectButtonDanger.onclick = () => {
//     emotionFaceDiv.style.backgroundImage = "url(../images/dangerman.png)";
//   };
// }

// let preDom: HTMLDivElement = undefined;
// const setFaceSize = (size: number, dom: HTMLDivElement) => {
//   dom.style.backgroundColor = "red";
//   faceScale = size / 200;
// };

// const sizeSelectAreaDiv = document.getElementById("size-select-area");
// if (sizeSelectAreaDiv) {
//   console.log("hello, sizeSelectIDv");
//   const normalSize = document.createElement("div");
//   normalSize.style.height = "200px";
//   normalSize.style.width = "200px";
//   normalSize.style.cursor = "pointer";
//   normalSize.onclick = () => {
//     setFaceSize(200, normalSize);
//   };
//   normalSize.style.backgroundImage = "url(../images/face.png)";
//   normalSize.style.backgroundSize = "cover";

//   const size150 = document.createElement("div");
//   size150.style.height = "150px";
//   size150.style.width = "150px";
//   size150.style.cursor = "pointer";

//   size150.onclick = () => {
//     setFaceSize(150, size150);
//   };
//   size150.style.backgroundImage = "url(../images/face.png)";
//   size150.style.backgroundSize = "cover";

//   const size100 = document.createElement("div");
//   size100.style.height = "100px";
//   size100.style.width = "100px";
//   size100.style.cursor = "pointer";

//   size100.onclick = () => {
//     setFaceSize(100, size100);
//   };
//   size100.style.backgroundImage = "url(../images/face.png)";
//   size100.style.backgroundSize = "cover";

//   const size50 = document.createElement("div");
//   size50.style.height = "50px";
//   size50.style.width = "50px";
//   size50.style.cursor = "pointer";

//   size50.onclick = () => {
//     setFaceSize(50, size50);
//   };
//   size50.style.backgroundImage = "url(../images/face.png)";
//   size50.style.backgroundSize = "cover";

//   sizeSelectAreaDiv.appendChild(normalSize);
//   sizeSelectAreaDiv.appendChild(size150);
//   sizeSelectAreaDiv.appendChild(size100);
//   sizeSelectAreaDiv.appendChild(size50);
// }
