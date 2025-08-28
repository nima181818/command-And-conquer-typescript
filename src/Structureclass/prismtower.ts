import { Structure } from './structure';
import { ptobj, imginits } from './structureimgsinits';
import { enemy_ptobj, enemy_imginits } from './enemystructureimgs';
import { world } from '../World'
import { ptattack_audio } from '../assets/audios/audio'

const prismtowerobstacle = require('./prismtower.json');  //TODO--
export class Prismtower extends Structure {
    firerange: number = 130
    firetimer: number = null
    attacktarget: any
    harm: number = 5
    constructor(unittype: string, bl: number, owner: string, position: { x: number, y: number }, name: string, ctx: HTMLCanvasElement, size: { x: number, y: number }) {
        super(unittype, bl, owner, position, name, ctx, size)
        this.imgUrllist = ptobj.ptimgUrllist
        this.circletime = 1/3;
        this.animationendstart = 6;
        this.animationend = 14

        this.size = {
            x: 48,
            y: 95
        }
        this.cost = 400
        this.powercost = 300
        this.occupyByengineer(true,position)
       
        this.blood = 20
        this.needanimation = true
        this.handleSelfobstacle(prismtowerobstacle.obstacle)
        //
        this.powerCaluc('born')
    }
    //被工程师占领
    occupyByengineer(paint:boolean=false,position:pointerface){
        if(this.unittype=='player1'){
            imginits(ptobj.ptimgUrllist, ptobj.ptimgList).then(() => {
                this.imginitsuccess = true;
                this.imgList = ptobj.ptimgList
                if(paint){
                    this.paint(position)
                }
               
            })
        }else{
            enemy_imginits(enemy_ptobj.ptimgUrllist, enemy_ptobj.ptimgList).then(() => {
                this.imginitsuccess = true;
                this.imgList =enemy_ptobj.ptimgList
                if(paint){
                    this.paint(position)
                }
            })
        }
    }
    //监听模式 TODO-- 
    watchMode() {
        let othereventlist = world.getEventlist('other', this.unittype),
            distance = 10 ** 9,
            index = 0,
            structureposition = {
                x: this.positions.x + this.size.x * 0.5,
                y: this.positions.y + this.size.y * 0.5
            }
        //这里处理了 tank  
        for (let j = 0; j < othereventlist.tanklist.length; j++) {
            if (distance >= this.pointDistance(othereventlist.tanklist[j].currentclickpoints, structureposition, true)) {
                distance = this.pointDistance(othereventlist.tanklist[j].currentclickpoints, structureposition, true);
                index = j
                this.attacktarget = othereventlist.tanklist[j]
            }

        }
        if (distance <= this.firerange) {
            this.fire()
            //
        } else {
            //console.log(distance, this.firerange)
            // clearTimeout(this.firetimer);
            //this.firetimer =  null
        }
    }
    //攻击
    fire() {
        if (!this.firetimer) {
            this.firetimer = window.setTimeout(() => {
                //TODO--
                this.xrayAttack()
                clearTimeout(this.firetimer);
                this.firetimer = null
            }, 2000)
        }

    }
    //射线攻击
    xrayAttack() {
        this.clearXray();
        ptattack_audio.playAudio()
       this.attacktarget.bloodLess(this.harm)
    }
    //绘制_清除射线
    clearXray() {
   
        let index = 0;
        let raylength = this.pointDistance(this.positions, this.attacktarget.currentclickpoints, true),
            verticee2s = {
                x: this.attacktarget.currentclickpoints.x - (this.positions.x + this.size.x * 0.5),
                y: this.attacktarget.currentclickpoints.y - (this.positions.y + 20)
            },
            sintheta = verticee2s.x / (this.squalCaculator(verticee2s, true)) ? verticee2s.x / (this.squalCaculator(verticee2s, true)) : 0,
            costheta = verticee2s.y / (this.squalCaculator(verticee2s, true)) ? verticee2s.y / (this.squalCaculator(verticee2s, true)) : 0,
            sixquoterx = sintheta * raylength / 6,
            sinthetay = costheta * raylength / 6;
        this.ctx.beginPath()
        this.ctx.moveTo(this.positions.x + this.size.x * 0.5, this.positions.y + 20);       //设置起点状态
        this.ctx.lineTo(this.attacktarget.currentclickpoints.x,this.attacktarget.currentclickpoints.y);       //设置末端状态
        this.ctx.lineWidth = 1.5;          //设置线宽状态
        this.ctx.strokeStyle = "rgb(191,191,255)";  //设置线的颜色状态
        this.ctx.stroke();     //进行绘制
        let x = Math.min(this.positions.x + this.size.x * 0.5, this.attacktarget.currentclickpoints.x),
            y = Math.min(this.positions.y + 20, this.attacktarget.currentclickpoints.y),
            w = Math.abs(this.positions.x + this.size.x * 0.5 - this.attacktarget.currentclickpoints.x),
            h = Math.abs(this.positions.y + 20 - this.attacktarget.currentclickpoints.y);
            setTimeout(()=>{
                this.ctx.clearRect(x, y, w, h)
                // this.clearLine(sintheta, costheta);
            },100)
        
        // let timerss = setInterval(() => {
        //     console.log(timerss)
        //     if (index < 6) {

        //     }

        //     if (index >= 12) {
        //         clearInterval(timerss);
        //        this.clearLine(sintheta,costheta);
        //     }
        //     index++
        // }, 16.6)
    }
    clearLine(sintheta, costheta) {
      let ps = {
          x: this.positions.x + this.size.x * 0.5,
          y: this.positions.y + 20,
        },
        pte = {
          x: this.attacktarget.currentclickpoints.x - ps.x,
          y: this.attacktarget.currentclickpoints.y - ps.y,
        },
        pteel = {
          x:
            pte.x / this.squalCaculator(pte)
              ? pte.x / this.squalCaculator(pte, true)
              : 0,
          y:
            pte.y / this.squalCaculator(pte)
              ? pte.y / this.squalCaculator(pte, true)
              : 0, //单位向量
        },
        rtw = 1.5 / Math.abs(sintheta) ? 1.5 / Math.abs(sintheta) : 2,
        rth = 3 / Math.abs(costheta) ? 3 / Math.abs(costheta) : 2,
        apart =
          1.5 / Math.abs(sintheta * costheta)
            ? 1.5 / Math.abs(sintheta * costheta)
            : 2,
        alllength = this.pointDistance(
          ps,
          this.attacktarget.currentclickpoints,
          true
        ),
        clearcounts = alllength / apart ? alllength / apart : 0;
      // debugger
      for (let j = 0; j < clearcounts; j++) {
        let x = ps.x + apart * j * pteel.x,
          y = ps.y + apart * j * pteel.y;
        this.ctx.fillRect(x, y, rtw, rth);
      }

      return;
      console.log("cao ");
      let raylength = this.pointDistance(
          { x: this.positions.x + this.size.x * 0.5, y: this.positions.y + 20 },
          this.attacktarget.currentclickpoints,
          true
        ),
        retanclewidth = 1.5 / sintheta ? 1.5 / sintheta : 0,
        retancleheight = (2 * 1.5) / costheta ? (2 * 1.5) / costheta : 0,
        counst = raylength / (1.5 / (sintheta * costheta)),
        x1 = this.positions.x + this.size.x * 0.5,
        y1 = this.positions.y + 20,
        x2 = this.attacktarget.currentclickpoints.x,
        y2 = this.attacktarget.currentclickpoints.y,
        cleartimes = 0;
      for (let j = 0; j < Math.abs(counst); j++) {
        let x = this.positions.x + this.size.x + cleartimes * retanclewidth,
          y =
            (sintheta / costheta ? sintheta / costheta : 0) * x +
            (x1 * y2 - x2 * y1) / (x1 - x2),
          width = retanclewidth,
          height = retancleheight;
        this.ctx.clearRect(x, y, Math.abs(width), Math.abs(height));
        cleartimes++;
      }
    }
}