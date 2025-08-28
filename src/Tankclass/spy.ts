import { Tank } from './Tank'

import { rvosystem } from '../utils/rovpathfindinghelper';
import { Bullet } from './Bullet';
import {imgList,picimgList,pics} from './liberrationimgs'
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

 class Spy extends Tank {
    speed: number = 2
    firerange:number=120 //攻击距离 在该区域下会自动攻击 
    soilderfightimgs:any
    firetimes:number=0
    constructor(unittype:string,position: Position1) {
        super(unittype,position)
       
        this.bodyposition = true
        this.width = 38; //覆盖父的
        this.obwidth = this.width/3*2
        this.height = 48; //覆盖父的
        this.obheight = this.height/3*2
        this.cost = 250
        this.blood = 15;
        this.maxblood = 15
        this.firerate = 150; //攻速
        this.MAX_SPEED = 18;
        this._name = 'spy';
        this.harm = 0;
       
       this.destinationpoint = JSON.parse(JSON.stringify(this.currentclickpoints))
       pics(imgList,picimgList).then(()=>{
        this.imgList = imgList
        this.picimgList = picimgList
        rvosystem.addVihcles(this);
       })
       soilderfight(fightimg,fightimgselements).then(()=>{
        
        this.soilderfightimgs = fightimgselements
  
    })
  
    }
    fire(position:pointerface,targetobject:any) {
        //TODO 只针对敌人有效（电场，油井，兵工厂，战车工厂） 注意监听器需要修改TODO
     }

        
       
}
export {Spy}