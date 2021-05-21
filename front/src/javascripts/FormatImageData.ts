//画像データを1行の文字列に変換する
const FormatImageData = (base64Images: string[]): string => {
  const images: string[] = base64Images.map((imageWithInfo) => {
    return imageWithInfo.split(",")[1] + ",";
  });

  const imageDataLine: string = images.reduce((str1, str2) => str1 + str2);
  return imageDataLine;
};

export default FormatImageData;
