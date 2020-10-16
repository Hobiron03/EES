import axios from "axios";

const PostImageData = async (imageLine: string, url: string) => {
  const formData = new FormData();
  formData.append("base64Images", imageLine);

  let image_name: string = "";
  await axios
    .post(url, formData)
    .then((res) => {
      image_name = res.data.image_name;
    })
    .catch((err) => {
      console.log(err.response.data);
      image_name = "Error";
    });

  return image_name;
};

export default PostImageData;
