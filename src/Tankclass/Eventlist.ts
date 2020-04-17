let {border} = require('../map-border.json');
import {Structure} from '../Structureclass/structure'
import {Tank}  from './Tank'
console.log(border,"888888")
interface Positions {
    x: number
    y: number
}
interface tankobject extends Tank {
    // selected: boolean
    // // nextPoint(x:number,y:number)
    // fire(x: number, y: number)
    // ownobstacles: Positions[]
    // currentclickpoints: Positions
    // targetpoint: Positions
    // globalAstarmanage: any
    // _id: number
    // multiselect:boolean
    // width: number
    // height: number
    // stable:boolean
    // loopMethods():void
    // movingcommander: boolean
    // pathplaningbyRvo(x: number, y: number)
    // closeFunc(x: number)
    // setTankspoints(x: number, y: number, type: string, moving: boolean)
}
class Eventlist {
    multimode: boolean = false
    canvasclickeventlist: Function[] = []
    windowmousemoveeventlist: Function[] = []
    incommunication: tankobject[] = []
    tanklist: tankobject[] = []
    mapborder:number[][]=[]
    
    constructor(){
        this.initMapborder();
        setTimeout(()=>{
            this.allTanksanimation();
        },3000)
       
    }
    initMapborder(){
            for(let j=0;j<border.length;j++){
                this.mapborder.push([border[j].x,border[j].y])
            }
    }
    allTanksanimation(){
        
        for(let j=0;j<this.tanklist.length;j++){
            this.tanklist[j].loopMethods()
        }
        window.requestAnimationFrame(this.allTanksanimation.bind(this))
    }
    movingjudge(e: MouseEvent) {
      console.log(e)
        let currentclick = null,
        beforehasselected = false, //存在之前选中的
        selectnoarea = true;//未选中任何机车
        for (let k = 0; k < this.tanklist.length; k++) {
            if ((e.offsetX - this.tanklist[k].currentclickpoints.x) ** 2 < ((this.tanklist[k].width/2) ** 2) && (e.offsetY - this.tanklist[k].currentclickpoints.y) ** 2 < ((this.tanklist[k].height/2) ** 2)){
                selectnoarea = false;
                currentclick = k
            }
            if(this.tanklist[k].selected||this.tanklist[k].multiselect){
               //证明之前有被选中过的
               beforehasselected = true;
            }
        }
    if(selectnoarea&&beforehasselected){
        for(let j=0;j<this.tanklist.length;j++){
            if(this.tanklist[j].selected||this.tanklist[j].multiselect){
                if(this.tanklist[j].multiselect){
                    this.tanklist[j].stable = false;
                }
                let isuseful = this.inside([parseInt((e.offsetX/10).toString()),parseInt((e.offsetY/10).toString())],this.mapborder);
                if(!isuseful){
                    console.log('点击无效')
                   return;
                }
                this.tanklist[j].setTankspoints(e.offsetX, e.offsetY, 'setendpoints', true)
            }
          
        }
    }
      if(!selectnoarea){
          //单选
          for(let j=0;j<this.tanklist.length;j++){
            this.tanklist[j].multiselect = false;
            
              if(j!=currentclick){
                  this.tanklist[j].selected = false
              }else{
                this.tanklist[j].selected = true;
              }
          }
     
      }

       

    }
   inside(points:number[],vs:number[][]):boolean{
    var x = points[0], y = points[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if(intersect){
			 console.log(xi,yi,xj,yj)
			}
        if (intersect) inside = !inside;
    }

    return inside;

   }
    //多选
    multiSelection(start: Positions, end: Positions) {

        for (let j = 0; j < this.tanklist.length; j++) {
            let tank = this.tanklist[j]
            tank.selected = false;
            tank.multiselect = false
            if (tank.currentclickpoints.x >= start.x
                && tank.currentclickpoints.y >= start.y
                && tank.currentclickpoints.x <= end.x
                && tank.currentclickpoints.y <= end.y) {
              
                this.multimode = true;
                tank.stable = false;
               tank.multiselect = true
            }
        }
    }
    
}
let eventlist = new Eventlist();
export { eventlist }