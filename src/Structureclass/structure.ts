interface positions {
    x: number
    y: number
}
/*
  军营的基础计算位置是按照{ x: 100, y: 0 }参考的 且是5为单位的
  基地是900 600 1 0
  战车工厂基于 1072, y: 691.5 10
  光临塔基于 1053, y: 791.5
*/
// console.log(Multithread, "wocao")
import { globalAstarmanage } from '../utils/wayfinders';
// import { eventlist } from '../Tankclass/Eventlist';
import {world} from '../World'
import {Structuresets} from './structureSet'
import {fog} from '../fog'
// import {player1} from '../player'
// import {baseControl} from './basecontrol'
class Structure {
    static ids:number=0
    unittype:string
    alive:boolean=true //死亡还是活着
    index:number = 0 //自身的动画片段
    readyforselfanimation:boolean=false //已准备好自身的动画
    _id:number
    classType:string='structure' 
    name: string
    imginitsuccess:boolean=false
    cost:number //消耗
    powercost:number //电量消耗
    blood: number
    maxblood:number
    owner: string
    imgsize: positions
    ctx: any
    imgList: Array<HTMLImageElement> = []
    imgUrllist: Array<string> = []
    positions: positions
    size: positions
    circletime: number = 16.6 //对于不同的建筑物，动画是不一样的
    animationtimer: number = null
    needanimation: boolean = false
    animationendstart: number
    animationend: number
    ownobstacles: positions[] = [] //存取自身的障碍矩阵 已/5
    constructor(unittype:string,bl: number, owner: string, position: positions, name: string, ctx: HTMLCanvasElement, size: positions) {
        this.unittype = unittype
        this.blood = bl;
        this.maxblood = bl;
        Structure.ids++;
        this._id = Structure.ids
        this.owner = owner
        this.positions = position
        this.name = name
        this.size = size
        this.ctx = ctx.getContext('2d');

        let structuresets = world.playerManage.find(item=>{return item.unittype==this.unittype}).structuresets
        structuresets.operationStructure(this.name,'add',this)
        // this.paint(position)
        if(this.name!='base'){
            if(structuresets.base.length){
                
                structuresets.base[0].newBuildingadded();
            }
           
        }
        console.log(structuresets)
        setTimeout(()=>{
            let player1 = world.playerManage.find(item=>{return item.unittype==this.unittype})
            player1.updateMoney('reduce',this.cost)
        })
        if(this.unittype=='player1'){
            fog.clear(this.positions.x-60,this.positions.y-60,this.size.x+120,this.size.y+120)
        }
    
    }
    
   
    //
     /*
    1,死亡时发出声音 TODO
    2，清理自己在globalMap的障碍
    3，清理自己的drawImage
    4，弹出
  */
    destroy() {
        clearInterval(this.animationtimer);
        this.animationtimer = null;
        this.alive = false;
        console.log('建筑毁灭')
        let alleventlist = world.getEventlist('all',this.unittype)
        //地图上销毁障碍?这点还要反应到各个机车上？？？--代价应该不大 因为现在已明确找到了不用遍历直接操作map的方式
        for (let j = 0; j < alleventlist.tanklist.length; j++) {
            for (let k = 0; k < this.ownobstacles.length; k++) {
                alleventlist.tanklist[j].globalAstarmanage.map[this.ownobstacles[k].x][this.ownobstacles[k].y] = 0;

            }
        }
        let structuresets = world.playerManage.find(item=>{return item.unittype==this.unittype}).structuresets
        this.ctx.clearRect(this.positions.x, this.positions.y, this.size.x, this.size.y );
        for(let j in structuresets.unitsList){
            for(let k=0;k<structuresets.unitsList[j].length;k++){
                if(this._id==structuresets.unitsList[j][k]._id){
                    structuresets.unitsList[j].splice(k,1);
                    k--
                }
            }
        }
        //电量占用解除TODO
        this.powerCaluc('die')
    }
   
//电量相关 类型：出生和死亡
     powerCaluc(type:string){
        let player = world.playerManage.find(item=>{return item.unittype==this.unittype});
        if(type=='born'){
            player.powerCanculations('reduce',this.powercost)
        }
        if(type=='die'){
            player.powerCanculations('add',this.powercost)
        }
     }
    initImgelement() {
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.imgUrllist.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.imgUrllist[j]
                img.onload = function () {
                    counts++;
                    this.imgList[j] = img;
                    if (counts == this.imgUrllist.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        })

    }
    paint(position: { x: number, y: number }) {
            if(!this.imginitsuccess){
                return;
            }
        let index = 0;
        //  setTimeout(()=>{
        let time = setInterval(() => {
            index++;

            if (index <= this.imgList.length) {
              
                    this.ctx.clearRect(this.positions.x, this.positions.y-2, this.size.x, this.size.y+4 );
                    this.ctx.drawImage(this.imgList[index - 1], this.positions.x, this.positions.y, this.size.x , this.size.y );

              
            } else {
                clearInterval(time);
                time = null;
                this.readyforselfanimation = true
                //  if(this.needanimation){
//this.animationMthod(this.animationendstart, this.animationend);
                //  }

            }

        }, 100)
        //   },1000)




    }
     //distance function 计算两点之间的距离
		pointDistance(obj1:pointerface,obj2:pointerface,kf=false):number{
			let distance =  (obj1.x-obj2.x)**2 +(obj1.y - obj2.y)**2;
            return kf?(distance**0.5):distance			
			
        }
        //监听模式对光棱塔和哨所炮成立
        watchMode(){

        }
    animationMthod() {
        if(this.name=='prismtower'){
          // debugger
        }
          if((!this.alive)||(!this.readyforselfanimation)){
            this.index = this.animationendstart;
              return;
          }
           
            let start = this.animationendstart;
            let end = this.animationend;
         
            let player = world.playerManage.find(item=>{ return item.unittype==this.unittype})
            if (this.needanimation) {
               
//this.animationtimer = window.setInterval(() => {
                    //TODO circle time的处理 算作累加器0.2？

                
                   if(this.name=='prismtower'){
                       this.watchMode();
                   }
                   let showindex = parseInt(this.index.toString())
                    if(showindex%2==0&&this.name=='oil'&&showindex>=5){
                        player.updateMoney('add',1)
                    }
                    // if(this.name=='prismtower'){
                    //     console.log(showindex)
                    // }
                    this.ctx.clearRect( this.positions.x,this.positions.y-2, this.size.x, this.size.y+3);
                    this.ctx.drawImage(this.imgList[showindex], this.positions.x, this.positions.y, this.size.x, this.size.y);
                    this.index+=this.circletime;
                    if (this.index > end) {
                        this.index = start
                    }
            //    }, this.circletime)
            } else {
            //    this.animationtimer = window.setInterval(() => {
                    this.index = this.imgList.length;
                    //TODO-- 这里不清除效果好一点点 ，但是对于上面需要自身更新的怎么办？
                    // 
                    this.ctx.drawImage(this.imgList[this.index - 1], this.positions.x, this.positions.y, this.size.x , this.size.y );
    
              //  }, 16.6)
            }
      
       

    }
    //临近函数 //找出距离自己最近的矩阵点
    closeFunc(point: number): number {
        let k = parseInt((point / 10).toString());
        return k
    }
    //初始化自身的地图
    initStructureobstacle(obstacle: positions[]) {
        let temp = [],
        alleventlist = world.getEventlist('all',this.unittype);

        //TODO-- 这里还没有结合自己的位置
     //   if (this.name == 'soliderfactory') {
            for (let j = 0; j < obstacle.length; j++) {
                 let item ={x:null,y:null}
                  if(this.name=='soliderfactory'){
                    item = {
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 0),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 100)
                    }
                  }
                  if(this.name=='base'){
                    item = {
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 600),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 900)
                    }
                  }
                  if(this.name=='oil'){
                    item = {
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 400),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 400)
                    }
                  }
                  if(this.name=='wcf'){
                    item = {
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 691.5),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 1072)
                    }
                  }
                  if(this.name=='powertation'){
                    item = {
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 300),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 200)
                    }
                  }
                  //暂时将光棱塔的obstacle定义为oil的obstacle TODO--
                  if(this.name=='prismtower'){
                    item = {
                    
                        x: obstacle[j].y + this.closeFunc(this.positions.y - 791.5),
                        y: obstacle[j].x + this.closeFunc(this.positions.x - 1053)
                    }
                  }
                temp.push(item)
            }
            console.log('已走')
            this.ownobstacles = temp //TODO新加的 之前貌似有点问题
    //    }
        globalAstarmanage.addObstacle(temp, 333);
        //当建筑出生的时候 动态映射到真实地图和每个坦克的地图上
        for (let j = 0; j < alleventlist.tanklist.length; j++) {

            alleventlist.tanklist[j].globalAstarmanage.addObstacle(temp, 333)


        }
    }
    //血量减少
    bloodLess(value){
      this.blood-=value;
      console.log(this.blood)
      if(this.blood<=0){
        this.destroy();
    }
    }
      //Square conversion  计算长度本身上
      squalCaculator(obj: pointerface, needgh: boolean = false) {
        let value = obj.x ** 2 + obj.y ** 2;
        return needgh ? (value ** 0.5) : value
    }
    //处理自身位置的障碍
    handleSelfobstacle(obstacle: positions[]) {
        let temp = [];
        // -(this.closeFunc(this.positions.x)),
        // -(this.closeFunc(this.positions.y))
        //TODO-- 障碍需要又加有减？
        for (let j = 0; j < obstacle.length; j++) {
            let item={}
            if(this.name=='soliderfactory'){
                item = {
                    x: parseInt((obstacle[j].x / 2).toString()),
                    y: parseInt((obstacle[j].y / 2).toString())
                }
            }
            //TODO-- 光棱塔的
            if(this.name=='base'||this.name=='oil'||this.name=='powertation'||this.name=='prismtower'||this.name=='wcf'){
                item = {
                    x: parseInt((obstacle[j].x).toString()),
                    y: parseInt((obstacle[j].y).toString())
                }
            }
           
            temp.push(item);
        }
        this.ownobstacles = temp;
        this.initStructureobstacle(temp);
    }

}
export { Structure }