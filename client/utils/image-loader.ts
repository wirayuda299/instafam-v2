import { encode } from "blurhash";

export const shimmer = (w: number, h: number) => `
<svg style="min-width:400px;" width="${w || 400}" height="${h || 400}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w || 400}" height="${h || 400}" fill="#333" />
  <rect id="r" width="${w || 400}" height="${h || 400}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w || 400}" to="${w || 400}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const loadImage = async <T>(src: T) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src as string;
  });

export const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = image.width as number;
  canvas.height = image.height as number;
  const context = canvas.getContext("2d");
  context?.drawImage(image, 0, 0);
  return context?.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async <T>(imageUrl: T) => {
  const image = (await loadImage(imageUrl)) as HTMLImageElement;
  const imageData = getImageData(image);
  if (!imageData) return;
  return encode(imageData?.data, imageData?.width, imageData?.height, 4, 4);
};
