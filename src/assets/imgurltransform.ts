export function transformimg(url:string){
    let img:HTMLImageElement = new Image();
        img.src = url;
        document.body.appendChild(img);
        return img
}