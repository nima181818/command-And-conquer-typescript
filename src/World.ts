interface sizes {
  x: number
  y: number

}
interface CanvasRenderingContext2D{
  drawImage()
}



Function.prototype.befores=function(f){
 let self = this;
     return function(){
        let can=f.apply(this,arguments);
        if(!can){
           return false
        }
        return self.apply(this,arguments)
     }
}
import { transformimg } from './assets/imgurltransform'
import { globalAstarmanage } from './utils/wayfinders';
import {Littlewindow} from './rightbars/littlewindow'

import {Player} from './player'
import {Timemanager} from './enemyai'
const map = require("./assets/map.png");
const mapobstacle = require('./mapobstacle.json');
 class World {
  size: sizes
  ctx: any
  scrollLeft: number = 0
  scrollTop: number = 0
  timemanager:any
  // tanks:[]
  worldimg: HTMLImageElement
  pageflowtimer: number
  playerManage:Player[]=[]
  controler:string
  canvascontainer:HTMLDivElement
  littlewindow:Littlewindow
  rightbars:any
  worldobstacles: sizes[] = []
  constructor(size: sizes, ctx: HTMLCanvasElement) {
    this.size = size
    this.ctx = ctx.getContext('2d');
this.changeCanvasdrawimgbehavior();
    this.initWorldobstacle();
    this.paint()
    this.bindScrollmapevent();
    let player1 = new Player('player1',{ x: 900, y: 600 }); //有数字的原因是有可能是多玩家玩耍
    let ai1 = new Player('ai1',{ x: 3400, y: 600 });
  //  this.timemanager = new Timemanager(ai1);
 
    this.timemanager = new Timemanager(ai1);//异步加载？

    this.playerManage.push(player1,ai1);
   this.initComponents()
  let timers = setInterval(()=>{
    
	   let gameresults = this.judgeWinornot();
	    if(gameresults=='win'){
        clearInterval(timers)
        let victory = document.getElementsByClassName('victory')[0] as HTMLImageElement;
          victory.style.display = 'block';
          //回到主页面
          setTimeout(()=>{
            window.location.reload()
          },10000)
         
      }
      if(gameresults=='lost'){
        clearInterval(timers)
        setTimeout(()=>{
          window.location.reload()
        },10000)
        let victory = document.getElementsByClassName('lost')[0] as HTMLImageElement;
          victory.style.display = 'block';
          //回到主页面
      }
   },500)
  }
  	//判断是否玩家失败/胜利
	judgeWinornot(){
		//胜利
		{
		
		
		let ai = this.playerManage.find(item=>{return item.unittype=='ai1'}),
		    gamestate = 'running',
		    hasaliveunits = ai.eventlist.tanklist.find(item=>{return item.alive}),
			hasstructure = false;
			for(let j in ai.structuresets.unitsList){
				for(let k =0;k<ai.structuresets.unitsList[j].length;k++){
					if(ai.structuresets.unitsList[j][k].alive){
						hasstructure = true
					}
				}
			}
			if((!hasstructure)){
				//敌方建筑均死亡
				gamestate = 'win';
				return gamestate
			}
		}
		{
	    let my = this.playerManage.find(item=>{return item.unittype=='player1'}),
		    gamestate = 'running',
		    hasaliveunits = my.eventlist.tanklist.find(item=>{return item.alive}),
			hasstructure = false;
			for(let j in my.structuresets.unitsList){
				for(let k =0;k<my.structuresets.unitsList[j].length;k++){
					if(my.structuresets.unitsList[j][k].alive){
						hasstructure = true
					}
				}
			}
			if((!hasstructure)){
				//我方建筑均死亡
				gamestate = 'lost';
				return gamestate
			}
		}
	    return 'running'
		
	}
  //试图改变drawImage的默认行为
  changeCanvasdrawimgbehavior(){
    let f=function(imgelement:any){
      if(!imgelement){
    //    console.log('还不得行哦')
        return false
      }else{
        return true
      }
    }
    CanvasRenderingContext2D.prototype.drawImage=CanvasRenderingContext2D.prototype.drawImage.befores(f)
 
  }
  initComponents(){
    this.littlewindow = new Littlewindow();
      
      //TODO-- 这里还应该可以改造一下
      import('./rightbars/rightbars').then(res=>{
        this.rightbars = new res.Rightbars()
      })
     


  }
  //根据分类获取eventlist
  /*
    type:种类 all my other
    unittype: player  ai
  */
  getEventlist(type:string,unittype:string){
    if(type=='all'){
      let obj = {
         tanklist:[]
      };
         for(let j=0;j<this.playerManage.length;j++){
            
               obj.tanklist.push(...this.playerManage[j].eventlist.tanklist)
            
         }
         return obj
    }
    if(type=='my'){
       let obj;
       for(let j=0;j<this.playerManage.length;j++){
         if(this.playerManage[j].unittype==unittype){
           obj = this.playerManage[j].eventlist
         }
       }
       return obj
    }
    if(type=='other'){
      let obj = {
        tanklist:[]
      }
      for(let j=0;j<this.playerManage.length;j++){
        if(this.playerManage[j].unittype!=unittype){
          obj.tanklist.push(...this.playerManage[j].eventlist.tanklist)
        }
      }
      return obj
    }
  }
  getStructuresets(type:string,unittype:string){
    if(type=='all'){
      let obj = {
        
      };
      for(let m in this.playerManage[0].structuresets.unitsList){
        obj[m] =[];
      }
         for(let j=0;j<this.playerManage.length;j++){
            
              for(let m in this.playerManage[j].structuresets.unitsList){
                obj[m].push(...this.playerManage[j].structuresets.unitsList[m])
              }
            
         }
         return obj
    }
    if(type=='my'){
       let obj;
       for(let j=0;j<this.playerManage.length;j++){
         if(this.playerManage[j].unittype==unittype){
          obj = this.playerManage[j].structuresets.unitsList
         }
       }
       return obj
    }
    if(type=='other'){
      let obj = {
        tanklist:[]
      }
      for(let j=0;j<this.playerManage.length;j++){
        if(this.playerManage[j].unittype!=unittype){
          obj=this.playerManage[j].structuresets.unitsList
        }
      }
      return obj
    }
  }
  paint() {
    let img = transformimg(map.default);
    this.worldimg = img;
    
    this.worldimg.onload = function () {
      // 960-464
    
      this.ctx.drawImage(this.worldimg, 0, 0, 4480, 1400)
    }.bind(this)

  }
  initWorldobstacle() {
    let temp = [];//下方的循环是为了转换坐标系，寻路系统的x,y互换
    for (let j = 0; j < mapobstacle.obstacle.length; j++) {
      temp.push({
        x: parseInt((mapobstacle.obstacle[j].y ).toString()),
        y: parseInt((mapobstacle.obstacle[j].x ).toString())
      })
    }

    globalAstarmanage.addObstacle(temp, 33)
  }
  //改变视口 拖动窗口可以控制，点击littewindow也可以控制
  changeViewport(e:{offsetX:number,offsetY:number},controler:string){
       if(controler=='click'){
         console.log('我先走')
         this.controler = 'click'
        this.canvascontainer.scrollLeft = e.offsetX;
        this.canvascontainer.scrollTop = e.offsetY;
       }
       if(controler=='scroll'){
         //TODO-- 只改变this.scrollLeft和this.scrollTop

       }
  }
  bindScrollmapevent() {
    let canvascontainer: HTMLDivElement = document.getElementsByClassName('leftwrapper')[0] as HTMLDivElement;
    this.canvascontainer = canvascontainer;
    let timer;
    /*
     canvascontainer.onmousemove = function (e) {
      if (!timer) {
        timer = window.setTimeout(() => {
     //     console.log(e.pageX, e.pageY)
          // canvascontainer.scrollLeft
          if (this.pageflowtimer) {
            clearInterval(this.pageflowtimer);
            this.pageflowtimer = null
          }
          this.pageflowtimer = window.setInterval(() => {
            if (e.pageX <= 20) {

               console.log(1)
              this.scrollLeft--;
              if (this.scrollLeft <= 0) {
                this.scrollLeft = 0;
                console.log(2)
                clearInterval(this.pageflowtimer);
                this.pageflowtimer = null
              }

            }
            if (e.pageX >= 700) {
              console.log(3)
              this.scrollLeft++;
              if (this.scrollLeft >= 2030) {
                console.log(4)
                this.scrollLeft = 2030
                clearInterval(this.pageflowtimer);
                this.pageflowtimer = null
              }
            }
            if (e.pageY <= 20) {
              this.scrollTop--;
              console.log(5)
              if (this.scrollTop <= 0) {
                this.scrollTop = 0;
                console.log(6)
                clearInterval(this.pageflowtimer);
                this.pageflowtimer = null
              }
            }
            if (e.pageY >= 530) {
              this.scrollTop++;
              console.log(7)
              if (this.scrollTop >= 580) {
                this.scrollTop = 580
                console.log(8)
                clearInterval(this.pageflowtimer);
                this.pageflowtimer = null
              }
            }
            canvascontainer.scrollLeft = this.scrollLeft
            canvascontainer.scrollTop = this.scrollTop
          }, 4)

          clearTimeout(timer);
          timer = null;
        }, 50)
      }
    }.bind(this)
    canvascontainer.onmouseleave=function(){
      setTimeout(()=>{
    //    console.log('已离开')
        clearInterval(this.pageflowtimer);
        this.pageflowtimer = null
      },50)
      
    }.bind(this)
    */
   let scrolltimer,
      oldcontroler;
    canvascontainer.onscroll=function(e){
      oldcontroler = this.controler;
      this.controler = 'scroll';
      if(oldcontroler=='click'){
           return;
      }
     
   //   console.log('被迫触发')
      let target:any = e.target;
      if(!scrolltimer){
        scrolltimer = setTimeout(()=>{
       
          this.littlewindow.changeFramelocation({offsetX:target.scrollLeft,offsetY:target.scrollTop},'scroll');
          clearTimeout(scrolltimer);
          scrolltimer = null
        },100)
      }
    
    }.bind(this)

  }

}
let canvas1 = document.getElementById('canvas1') as HTMLCanvasElement;
export let world =  new World({ x: 0, y: 0 }, canvas1);  //world的生成顺序至关重要，因为地图障碍物会在此生成，