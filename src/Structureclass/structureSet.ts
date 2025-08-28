import {BaseControl} from './basecontrol';
import {Powerstation} from './powerstation';
import {Soliderfactory} from './soliderfactory';
import {Prismtower} from './prismtower'
import {Oil} from './oil'
import {world} from '../World'
import {Wcf} from './wcf'

class Structuresets{
     base:BaseControl[]=[]
     powertation:Powerstation[]=[]
     soliderfactory:Soliderfactory[]=[]
     oil:Oil[]=[]
     wcf:Wcf[]=[]
     prismtower:Prismtower[]=[]
     unitsList:any={}
     unittype:string
     constructor(unittype:string){
          this.unitsList.base = this.base;
          this.unittype = unittype
          this.unitsList.powertation = this.powertation;
          this.unitsList.soliderfactory = this.soliderfactory;
          this.unitsList.oil = this.oil;
          this.unitsList.prismtower = this.prismtower
          this.unitsList.wcf = this.wcf
     }
     //增加-新建_死亡-减少建筑
     operationStructure(name,type:string,obj:BaseControl|Powerstation|Soliderfactory|Oil|Wcf){
         for(let j in this.unitsList){
             if(j==name){
                 if(type=='add'){
                    this.unitsList[name].push(obj)
                 }else{
                   //TODO-- 这还没完
                    this.unitsList[name].splice(j,1);
                 }
                 
             }
         }
         this.barControl();
     }
     //控制bar的显示与否
     barControl(){
         let rightbars = world.rightbars
        if(!(this.unittype.indexOf('play')!=-1)){
            return; //AI 不参与bar的控制；
        }
         let hasbase = false, //是否有基地--》基地控制
             hasguard = false, //是否防御 由于战车工厂控制
             hassoilder = false, //是否有兵营 由兵营控制
             haswcf = false //是否有战车工厂 由战车工厂控制

             for(let j in this.unitsList){
                 if(j=='base'){
                     if(this.unitsList[j].length){
                        hasbase = true
                     }
                 
                 }
                 if(j=='soliderfactory'){
                    if(this.unitsList[j].length){
                        hassoilder = true
                     }
                  
                 }
                 if(j=='wcf'){
                    if(this.unitsList[j].length){
                        hasguard = true;
                    haswcf = true
                     }
                   
                 }
             }

                 setTimeout(()=>{
                    try{
                        rightbars.barElement[0].children[0].style.visibility = hasbase?'visible':'hidden';
                        rightbars.barElement[1].children[0].style.visibility = hasguard?'visible':'hidden';
                        rightbars.barElement[2].children[0].style.visibility = hassoilder?'visible':'hidden';
                        rightbars.barElement[3].children[0].style.visibility = haswcf?'visible':'hidden';
                    }catch(e){
                        console.log(e,"element did not init yet")
                    }
                   
                 },1000)
               
         
             
            
            // return {
            //     hasbase,
            //     hasguard,
            //     hassoilder,
            //     haswcf
            // }
     }
     //建筑的动画也均在此完成 TODO-- 还未实施
     structureAnimation(){
        for(let j in this.unitsList){
            for(let k=0;k<this.unitsList[j].length;k++){
                this.unitsList[j][k].animationMthod();
            }
        }
       // window.requestAnimationFrame(this.structureAnimation.bind(this))
     }
    

}



export {Structuresets}