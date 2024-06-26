import { makeUrlRequest } from "../utils";

export type ImgurUploadResponse = {
  data: {
    link: string;
  };
};

export const uploadImage = async (
  image: string,
): Promise<ImgurUploadResponse> => {
  return await makeUrlRequest("https://imgur-apiv3.p.rapidapi.com/3/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Client-ID c2593243d3ea679",
      "X-RapidApi-Key": "H6XlGK0RRnmshCkkElumAWvWjiBLp1ItTOBjsncst1BaYKMS8H",
    },
    body: JSON.stringify({ image }),
  });
};
