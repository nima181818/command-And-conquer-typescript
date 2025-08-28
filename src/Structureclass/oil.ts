import {Structure} from './structure';


import {oilobj,imginits} from './structureimgsinits'
import {enemy_oilobj,enemy_imginits} from './enemystructureimgs'
const oilobstacle = require('./oil.json');
export class Oil extends Structure{
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        //this.paint(position);
        this.imgUrllist = oilobj.oilimgUrllist
        this.circletime = 1/6;
        this.animationendstart = 1;
        this.needanimation = true
        this.animationend = this.imgUrllist.length-1;
        this.size = {
            x:1211/12,
            y:1009/12
        }
        this.cost = 200
        this.powercost=150
        this.needanimation = true
       this.occupyByengineer(true,position)
       
        this.blood=30
        this.handleSelfobstacle(oilobstacle.obstacle)
        this.powerCaluc('born')
    }
      //被工程师占领
    occupyByengineer(paint:boolean=false,position:pointerface){
        if(this.unittype=='player1'){
            imginits(oilobj.oilimgUrllist,oilobj.oilimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList = oilobj.oilimgList
                if(paint){
                    this.paint(position)
                }
               
            })
        }else{
            enemy_imginits(enemy_oilobj.oilimgUrllist,enemy_oilobj.oilimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList = enemy_oilobj.oilimgList
                if(paint){
                    this.paint(position)
                }
            })
        }
    }
}