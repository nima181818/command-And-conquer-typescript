import { Structure } from './structure'
import { transformimg } from '../assets/imgurltransform'
const image = require('../assets/base.png');

// import baseimg from './assets/base.jpg'

// alert(image);
export class BaseControl extends Structure {
    baseimg: HTMLImageElement
    constructor(bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(bl, owner, position, name, ctx,size)
        this.paint(position);
    }
    paint(position: { x: number, y: number }) {
       
        let img = transformimg(image.default);
        this.baseimg = img;
        this.baseimg.id="wocao"
        this.baseimg.onload = function () {
            
            this.ctx.drawImage(this.baseimg, position.x,position.y, this.size.x, this.size.y);
        }.bind(this)

    }
}