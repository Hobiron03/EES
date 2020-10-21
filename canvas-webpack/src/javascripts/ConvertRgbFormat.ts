const ConvertRgbFormat = (r: number, g: number, b: number) => {
  return "rgb(" + [r || 0, g || 0, b || 0].join(",") + ")";
};

export default ConvertRgbFormat;
