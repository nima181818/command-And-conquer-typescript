import { Tank } from './Tank'

import { rvosystem } from '../utils/rovpathfindinghelper';
import { Bullet } from './Bullet'
const imagelb = require('../assets/rhinocerotidaetank/rhi_lb.png');//↙
const imagebot = require('../assets/rhinocerotidaetank/rhi_b.png');//↓
const imagelef = require('../assets/rhinocerotidaetank/rhi_l.png');//←
const imagelt = require('../assets/rhinocerotidaetank/rhi_lt.png');//↖
const imagerb = require('../assets/rhinocerotidaetank/rhi_rb.png');//↘
const imagerig = require('../assets/rhinocerotidaetank/rhi_r.png');//→
const imagert = require('../assets/rhinocerotidaetank/rhi_rt.png');//↗
const imagetop = require('../assets/rhinocerotidaetank/rhi_t.png');//↑


const enemy_imagelb = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_lb.png');//↙
const enemy_imagebot = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_b.png');//↓
const enemy_imagelef = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_l.png');//←
const enemy_imagelt = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_lt.png');//↖
const enemy_imagerb = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_rb.png');//↘
const enemy_imagerig = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_r.png');//→
const enemy_imagert = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_rt.png');//↗
const enemy_imagetop = require('../assets/enemy/rhinocerotidaetank/enemy_rhi_t.png');//↑
interface Position1 {
    x: number
    y: number
}
interface Position1 {
    x: number
    y: number
}
export class Rhinocerotidaetank extends Tank {
    speed: number = 2
    firerange:number=150 //攻击距离 在该区域下会自动攻击 
    constructor(unittype:string,position: Position1) {
        super(unittype,position)
       
        this.width = 40; //覆盖父的
        this.obwidth = this.width;
        this.firerate = 500;

        this.height = 40; //覆盖父的
        this.obheight = this.height
        this.blood = 20;
        this.maxblood = 20
        this.MAX_SPEED = 90;
        this.cost = 400
        this._name = 'rhinocerotidaetank'
      if(this.unittype=='player1'){
        this.imgList = [imagetop.default, imagert.default, imagerig.default, imagerb.default, imagebot.default, imagelb.default, imagelef.default, imagelt.default, imagetop.default];
        
      }else{
        this.imgList = [enemy_imagetop.default, enemy_imagert.default, enemy_imagerig.default, enemy_imagerb.default, enemy_imagebot.default, enemy_imagelb.default, enemy_imagelef.default, enemy_imagelt.default, enemy_imagetop.default];
         
      }
       this.initPicimg(); 
        rvosystem.addVihcles(this);
        // console.log(rvosystem,"rvo系统")
      //  setInterval(()=>{
       //     this.fire();
       // },3000)
       this.harm = 3;
    }
    fire(position:pointerface,targetobject:any) {
      //  if(this._id==0){
            let that = this
            let j = 0
            let bullet = new Bullet(that,this.harm, targetobject,{
                x: this.currentclickpoints.x,
                y: this.currentclickpoints.y
            }, {
                width: 4,
                height: 4
    
            }, 10,
            position, this.currentctx,{width:62,height:78})
                bullet.run_tank();
    //    }
        }
       
}