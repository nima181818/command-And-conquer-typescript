import { Tank } from './Tank'

import { rvosystem } from '../utils/rovpathfindinghelper';
import { Bullet } from './Bullet';
import {imgList,picimgList,pics} from './liberrationimgs'
import {enemy_imgList,enemy_picimgList,enemy_pics} from './enemyliberationimgs'
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

 class Liberationarmy extends Tank {
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
        this.cost = 200
        this.blood = 15;
        this.maxblood = 15
        this.firerate = 150; //攻速
        this.MAX_SPEED = 54;
        this._name = 'liberationarmy';
        this.harm = 0.5; 
        
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
      
       soilderfight(fightimg,fightimgselements).then(()=>{
        
        this.soilderfightimgs = fightimgselements
  
    })
  
    }
    fire(position:pointerface,targetobject:any) {
        this.fightanimationcontrol = true
        let direction = {
            x:position.x - this.currentclickpoints.x,
            y:position.y - this.currentclickpoints.y
        },
        singaldirection ={
            x:direction.x/this.squalCaculator(direction,true)?direction.x/this.squalCaculator(direction,true):0,
            y:direction.y/this.squalCaculator(direction,true)?direction.y/this.squalCaculator(direction,true):0
        },
         part = 0.7071,
         picindex=0,
        directionobj = [{x:0,y:-1},{
            x:part,y:-part
        },{
            x:1,y:0
        },{
            x:part,y:part
        },{
            x:0,y:1
        },{
            x:-part,y:part
        },{
            x:-1,y:0
        },{
            x:-part,y:-part
        }],
        mini = null;
        for(let j=0;j<directionobj.length;j++){
            let value = this.distanceFormlation(directionobj[j],singaldirection,true)
            
           
           if(j==0){
               mini=value
           }
         
           if(value<=mini){
               mini = value;
               picindex = j
           }
        }
   
        this.firetimes+=0.5;
        if(this.firetimes%2==0){
            this.currentctx.clearRect(this.currentclickpoints.x - this.width*0.5, this.currentclickpoints.y -this.height*0.5, this.width, this.height);
          
            this.currentctx.drawImage(this.soilderfightimgs[picindex], this.currentclickpoints.x-this.width*0.5, this.currentclickpoints.y-this.height*0.5, this.width, this.height)
        }else{
            this.currentctx.clearRect(this.currentclickpoints.x - this.width*0.5, this.currentclickpoints.y -this.height*0.5, this.width, this.height);
            this.currentctx.drawImage(this.soilderfightimgs[0], this.currentclickpoints.x-this.width*0.5, this.currentclickpoints.y-this.height*0.5, this.width, this.height)
        }
       
        // this.currentctx.drawImage(this.soilderfightimgs[picindex], this.currentclickpoints.x-this.width*0.5, this.currentclickpoints.y-this.height*0.5, this.width, this.height)
        // this.currentctx.drawImage(this.soilderfightimgs[picindex], this.currentclickpoints.x-this.width*0.5, this.currentclickpoints.y-this.height*0.5, this.width, this.height)
        // this.currentctx.drawImage(this.soilderfightimgs[picindex], this.currentclickpoints.x-this.width*0.5, this.currentclickpoints.y-this.height*0.5, this.width, this.height)
    
     //   if(this._id==0){
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
                bullet.run_soilder();
        }
       // }
        
       
}
export {Liberationarmy}