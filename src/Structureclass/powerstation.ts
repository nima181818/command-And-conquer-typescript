import {Structure} from './structure';
import {powerstationobj,imginits} from './structureimgsinits'
import {enemy_powerstationobj,enemy_imginits} from './enemystructureimgs'
const powerstationobstacle = require('./powerstation.json');
export class Powerstation extends Structure{
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        this.imgUrllist = powerstationobj.powerstationimgUrllist
        this.circletime = 1/6;
        this.animationendstart = 6;
        this.animationend = 10
        this.size = {
            x:1211/12,
            y:1009/12
        }
        this.cost = 150
        this.powercost = -300
        this.occupyByengineer(true,position)
      
        this.blood=30
        this.needanimation = true
        this.handleSelfobstacle(powerstationobstacle.obstacle)
       //
       this.powerCaluc('born')
    }
     //被工程师占领
    occupyByengineer(paint:boolean=false,position:pointerface){
        if(this.unittype=='player1'){
            imginits(powerstationobj.powerstationimgUrllist,powerstationobj.powerstationimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList =powerstationobj.powerstationimgList
                if(paint){
                    this.paint(position)
                }
                
            })
        }else{
            enemy_imginits(enemy_powerstationobj.powerstationimgUrllist,enemy_powerstationobj.powerstationimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList = enemy_powerstationobj.powerstationimgList
                if(paint){
                    this.paint(position)
                }
            })
        }
    }
}