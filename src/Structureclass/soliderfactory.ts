import { Structure } from "./structure";

 const structurepbstacle = require('./soliderfactoryobstacle.json');//注意这是相对位置，要转换为地图的绝对位置


import {soilderobj,imginits} from './structureimgsinits'
const image = require('../assets/solderfactory.png');
export class Soliderfactory extends Structure{
    baseimg: HTMLImageElement
   bornposition:pointerface
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        this.cost = 200
        this.powercost=150
        imginits(soilderobj.soilderimgUrllist,soilderobj.soilderimgList).then(res=>{
            this.imgList = soilderobj.soilderimgList;
            this.imginitsuccess = true;
            this.paint(position)
        })
         
        this.size = {
            x:528/6,
            y:972/6
        }
        this.bornposition = {
            x:705,
            y:372
        }
        this.blood=30
    
       this.handleSelfobstacle(structurepbstacle.obstacle);
    //  this.burn();
    this.powerCaluc('born')
    }
    
}