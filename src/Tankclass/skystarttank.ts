import { Tank } from './Tank'

import { rvosystem } from '../utils/rovpathfindinghelper';
import { Bullet } from './Bullet'
const imagelb = require('../assets/skytank/sky_lb.png');//↙
const imagebot = require('../assets/skytank/sky_b.png');//↓
const imagelef = require('../assets/skytank/sky_l.png');//←
const imagelt = require('../assets/skytank/sky_lt.png');//↖
const imagerb = require('../assets/skytank/sky_rb.png');//↘
const imagerig = require('../assets/skytank/sky_r.png');//→
const imagert = require('../assets/skytank/sky_rt.png');//↗
const imagetop = require('../assets/skytank/sky_t.png');//↑


const enemy_imagelb = require('../assets/enemy/skytank/enemy_sky_lb.png');//↙
const enemy_imagebot = require('../assets/enemy/skytank/enemy_sky_b.png');//↓
const enemy_imagelef = require('../assets/enemy/skytank/enemy_sky_l.png');//←
const enemy_imagelt = require('../assets/enemy/skytank/enemy_sky_lt.png');//↖
const enemy_imagerb = require('../assets/enemy/skytank/enemy_sky_rb.png');//↘
const enemy_imagerig = require('../assets/enemy/skytank/enemy_sky_r.png');//→
const enemy_imagert = require('../assets/enemy/skytank/enemy_sky_rt.png');//↗
const enemy_imagetop = require('../assets/enemy/skytank/enemy_sky_t.png');//↑
interface Position1 {
    x: number
    y: number
}
interface Position1 {
    x: number
    y: number
}
export class Skystart extends Tank {
    speed: number = 2
    firerange:number=200 //攻击距离 在该区域下会自动攻击 
    constructor(unittype:string,position: Position1) {
        super(unittype,position)
       
        this.width = 50; //覆盖父的
        this.obwidth = this.width;
        this.firerate = 500;

        this.height = 50; //覆盖父的
        this.obheight = this.height
        this.blood = 30;
        this.maxblood = 30
        this.MAX_SPEED = 120;
        this.cost = 600
        this._name = 'skystarttank'
      
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
       this.harm = 6;
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