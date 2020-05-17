import {Structure} from './structure';
import {wcfobj,imginits} from './structureimgsinits'
import {enemy_wcfobj,enemy_imginits} from './enemystructureimgs'
export class Wcf extends Structure{
    constructor(unittype:string,bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement,size:{x:number,y:number}) {
        super(unittype,bl, owner, position, name, ctx,size)
        //this.paint(position);
        this.imgUrllist =wcfobj.wcfimgUrllist
        this.circletime = 100;
        this.animationendstart = 6;
        this.animationend = 10
        this.size = {
            x:1970/12,  //TODO--
            y:1610/12
        }
        this.needanimation = false
        if(this.unittype=='player1'){
            imginits(wcfobj.wcfimgUrllist,wcfobj.wcfimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList = wcfobj.wcfimgList
                this.paint(position)
            })
        }else{
            enemy_imginits(enemy_wcfobj.wcfimgUrllist,enemy_wcfobj.wcfimgList).then(()=>{
                this.imginitsuccess = true;
                this.imgList = enemy_wcfobj.wcfimgList
                this.paint(position)
            })
        }
        
        this.cost = 250
        this.powercost=200
        this.blood=30
       //TODO--未添加发电厂的障碍
       this.powerCaluc('born')
    }
}