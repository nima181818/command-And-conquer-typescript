import { Tank } from './Tank'

import { rvosystem } from '../utils/rovpathfindinghelper';
import { Bullet } from './Bullet';
import {imgList,picimgList,pics} from './engineerimgs'
import {enemy_imgList,enemy_picimgList,enemy_pics} from './enemyengineerimgs'
import {fightimg,fightimgselements,soilderfight} from '../assets/soilderimgs/soilder_attack_img/soilder_attackimg'
interface Position1 {
    x: number
    y: number
}
interface Position1 {
    x: number
    y: number
}
//alert('wocao')

 class Engineer extends Tank {
    speed: number = 2
    firerange:number=50 //攻击距离 在该区域下会自动攻击 
    soilderfightimgs:any
    firetimes:number=0
    constructor(unittype:string,position: Position1) {
        super(unittype,position)
       
        this.bodyposition = true
        this.width = 38; //覆盖父的
        this.obwidth = this.width/3*2
        this.height = 48; //覆盖父的
        this.obheight = this.height/3*2
        this.cost = 200
        this.blood = 15;
        this.maxblood = 15
        this.firerate = 150; //攻速
        this.MAX_SPEED = 54;
        this._name = 'engineer';
        this.harm = 0; 
        
       this.destinationpoint = JSON.parse(JSON.stringify(this.currentclickpoints))
       if(this.unittype=='player1'){
        pics(imgList,picimgList).then(()=>{
            this.imgList = imgList
            this.picimgList = picimgList
            rvosystem.addVihcles(this);
           })
       }else{
        enemy_pics(enemy_imgList,enemy_picimgList).then(()=>{
            this.imgList = enemy_imgList
            this.picimgList = enemy_picimgList
            rvosystem.addVihcles(this);
           })
       }
      //TODO 这里还没整图片
       soilderfight(fightimg,fightimgselements).then(()=>{
        
        this.soilderfightimgs = fightimgselements
  
    })
  
    }
    fire(position:pointerface,targetobject:any) {
      
        }
       // }
        
       
}
export {Engineer}