import { Structure } from "./structure";

 const structurepbstacle = require('./soliderfactoryobstacle.json');//注意这是相对位置，要转换为地图的绝对位置


import {soilderobj,imginits} from './structureimgsinits'
import {enemy_soilderobj,enemy_imginits} from './enemystructureimgs'
const image = require('../assets/solderfactory.png');
export class Soliderfactory extends Structure{
    baseimg: HTMLImageElement
   bornposition:pointerface
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        this.cost = 200
        this.powercost=150
       
        this.occupyByengineer(true,position)
         
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
     //被工程师占领
     occupyByengineer(paint:boolean=false,position:pointerface){
        if(this.unittype=='player1'){
            imginits(soilderobj.soilderimgUrllist,soilderobj.soilderimgList).then(res=>{
                this.imgList = soilderobj.soilderimgList;
                this.imginitsuccess = true;
                if(paint){
                    this.paint(position)
                }
              
            })
        }else{
            enemy_imginits(enemy_soilderobj.soilderimgUrllist,enemy_soilderobj.soilderimgList).then(res=>{
                this.imgList =enemy_soilderobj.soilderimgList;
                this.imginitsuccess = true;
                if(paint){
                    this.paint(position)
                }
            })
        }
    }
}