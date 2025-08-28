import {Structure} from './structure';
import {ptobj,imginits} from './structureimgsinits'
const powerstationobstacle = require('./powerstation.json');  //TODO--
export class Sentrycannon extends Structure{
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        this.imgUrllist = ptobj.ptimgUrllist
        this.circletime = 100;
        this.animationendstart = 6;
        this.animationend = 14
        this.size = {
            x:48,
            y:95
        }
        this.cost = 300
        imginits(ptobj.ptimgUrllist,ptobj.ptimgList).then(()=>{
            this.imginitsuccess = true;
            this.imgList = ptobj.ptimgList
            this.paint(position)
        })
        this.blood=20
        this.needanimation = true
        this.handleSelfobstacle(powerstationobstacle.obstacle)
       //
    }
}