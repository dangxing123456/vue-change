import {dataURItoBlob} from './dataURItoBlob'
export function compression(image, file) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let initSize = image.src.length;
    let { width } = image,
      { height } = image;
    canvas.width = width;
    canvas.height = height;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, width, height);

    // 进行最小压缩0.1
    let compressData = canvas.toDataURL(file.type || "image/jpeg", 0.1);

    // 压缩后调用方法进行base64转Blob，方法写在下边
    let blobImg = dataURItoBlob(compressData);
    return blobImg;
}