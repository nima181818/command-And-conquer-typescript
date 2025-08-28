
import {imgelements} from './bulletexpolisionimg';
import {fireout_audio,soilderbullet_audio} from '../assets/audios/audio'
import {fightimgselements} from '../assets/soilderimgs/soilder_attack_img/soilder_attackimg'
export class Bullet{

    position:  pointerface
    size:{width:number,height:number}
    // imgelements:HTMLImageElement[]
    sin:number
    target:pointerface
    speed: number
  
    drawsize:{
      width:number,
      height:number
    }   //绘制爆炸的图片大小
    currentctx: any
    master: any
    targetobject:any //目标打击对象
    harm:number
    timer: number = 0
    constructor(master: any,harm:number ,targetobject:any, position:pointerface,size: {width:number,height:number},speed:number,target:pointerface,currentctx:any,drawsize:{width:number,height:number
    }) {
        this.master = master
        this.harm = harm
        this.position = position;
        this.targetobject = targetobject
        this.size = size;
        this.speed = speed
        this.target = target;
        this.currentctx = currentctx;
        this.drawsize = drawsize
        this.calculateSin();
        this.initExplosion();
    }
    calculateSin(){
        let pt = {
            x: this.target.x - this.position.x,
            y: this.target.y - this.position.y
          };
        let  cos=pt.x/(pt.x**2+pt.y**2)**0.5?pt.x/(pt.x**2+pt.y**2)**0.5:0,
        sin = pt.y/(pt.x**2+pt.y**2)**0.5?pt.y/(pt.x**2+pt.y**2)**0.5:0;
        this.sin = sin
    }
    //士兵发射子弹—— 不需要弹道
    run_soilder(){
      let a=0;
   
       let t= setInterval(()=>{
          a+=0.2;
  
            this.currentctx.drawImage(fightimgselements[8],this.target.x,this.target.y,15,15);
   
           if(a>=2){
      
             clearInterval(t);
             this.currentctx.clearRect(this.target.x,this.target.y,15,15);
             soilderbullet_audio.playAudio();
             this.targetobject.bloodLess(this.harm)
             this.handleEnemydied()
           }
        },16.6)
      
 //     },60)
      

    }
    //当所在单位挂掉 enemy置空 movingwithattack为false
    handleEnemydied(){
      if(this.targetobject.blood<=0){
       this.master.movingwithattack = false;
       this.master.enemytarget = null;
      }
    }
    //借助贝塞尔曲线充当子弹的弹道 对tank有效
    run_tank(){
      fireout_audio.playAudio();
        let p2={
            x:this.target.x,
            y:this.target.y
          },
          p0 = {
            x:this.position.x,
            y:this.position.y
          },
          p0_2 = {
            x:p2.x-p0.x,
            y:p2.y-p0.y
          },
          p0_2_unit={
            x:(p0_2.x/(p0_2.x**2+p0_2.y**2)**0.5)?p0_2.x/(p0_2.x**2+p0_2.y**2)**0.5:0,
            y:(p0_2.y/(p0_2.x**2+p0_2.y**2)**0.5)?p0_2.y/(p0_2.x**2+p0_2.y**2)**0.5:0,
          },
          p0_2_stri = {
            x: -(1/p0_2_unit.x)?-(1/p0_2_unit.x):0,
            y: (1/p0_2_unit.y)?(1/p0_2_unit.y):0,
          },
          p0_2_stri_unit = {
            x:(p0_2_stri.x/(p0_2_stri.x**2+p0_2_stri.y**2)**0.5)?p0_2_stri.x/(p0_2_stri.x**2+p0_2_stri.y**2)**0.5:0,
            y:(p0_2_stri.y/(p0_2_stri.x**2+p0_2_stri.y**2)**0.5)?p0_2_stri.y/(p0_2_stri.x**2+p0_2_stri.y**2)**0.5:0,
          },
          p0_2_distance = (p0_2.x**2+p0_2.y**2)**0.5,
          
          centerp = {
            x:(p0.x+p2.x)*0.5,
            y:(p0.y+p2.y)*0.5
          },
          p1 = {
            x:centerp.x +(this.sin>0?-1:1) * p0_2_stri_unit.x*(((1-this.sin**2))<0.2?0:50),
            y:centerp.y + (this.sin>0?-1:1) * p0_2_stri_unit.y*(((1-this.sin**2))<0.2?0:50),
          },
          //注意这里需要加一个判断 距离过近，直接为直线--貌似近乎完美了？TODO--
          p={
            x:0,
            y:0
          },
          oldp={
              x:0,
              y:0
          },
          t=0;
          let timer = setInterval(()=>{
          
            t+=0.1;
            this.currentctx.clearRect(oldp.x-3,oldp.y-3,this.size.width+2,this.size.height+2);
            p.x = p0.x*(1-t)**2+2*(1-t)*t*p1.x+(t**2)*p2.x
            p.y = p0.y*(1-t)**2+2*(1-t)*t*p1.y+(t**2)*p2.y;
            this.currentctx.beginPath();
           
            this.currentctx.arc(p.x,p.y,this.size.width/2,0,Math.PI*2,false);
            this.currentctx.fillStyle='rgb(16,12,12)'
            this.currentctx.fill();
           if(this.master._id==0){
        //       console.log((p.x-p2.x)**2+(p.y-p2.y)**2)
           }
          
           
            oldp= JSON.parse(JSON.stringify(p));
            
             if((p.x-p2.x)**2+(p.y-p2.y)**2<6||(!this.master.alive)){
                this.currentctx.clearRect(p.x-2,p.y-2,this.size.width+1,this.size.height+1);
               clearInterval(timer);
               this.explosionEffect();
             }
          },16.6)
    }
    //爆炸效果-- 要让这一坨优先于其他地方的绘制TODO--
    explosionEffect(){
      let counts1=0; 
      let timer = setInterval(()=>{
        counts1+=0.5;
        let counts= parseInt(counts1.toString())
      //  console.log(this.currentctx,"8888")
        this.currentctx.clearRect(this.target.x-this.drawsize.width/2,this.target.y-this.drawsize.height/2,this.drawsize.width,this.drawsize.height);
        this.currentctx.drawImage(imgelements[counts],this.target.x-this.drawsize.width/2,this.target.y-this.drawsize.height/2,this.drawsize.width,this.drawsize.height);
        if(counts==imgelements.length-1){
           clearInterval(timer);
           this.currentctx.clearRect(this.target.x-this.drawsize.width/2,this.target.y-this.drawsize.height/2,this.drawsize.width,this.drawsize.height);
           //目标血量减少？条件：要击中
           //classType表明是坦克  否则就是建筑
           //TODO--  建筑的position可能不一样
           
           if(this.distanceFormlation(this.target,this.targetobject.classType=='tank'?this.targetobject.currentclickpoints:this.targetobject.positions,true)<=(this.targetobject.classType=='tank'?20:120)){
            this.targetobject.bloodLess(this.harm)
            this.handleEnemydied()
           }
           
        }
       },16.66)
    }
 //距离公式
 distanceFormlation(p1:pointerface,p2:pointerface,kf:boolean = false){
  let value = (p1.x - p2.x)**2+(p1.y-p2.y)**2;
  return kf?(value**0.5):value
}
    //初始化爆炸效果img
    initExplosion(){
      
    }
}
