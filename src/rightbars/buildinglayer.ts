
//引入 tank中的一个
// import { eventlist } from '../Tankclass/Eventlist';
import { globalAstarmanage as realAstarmanage, globalAstarmanage } from '../utils/wayfinders'
import { Powerstation, Soliderfactory, Oil, Wcf, Prismtower,Sentrycannon } from '../Structureclass/allStructureslist'
import { cannotplayhere_audio, constructionalnoctions_audio } from '../assets/audios/audio'
import { world } from '../World';

let myeventlist = world.getEventlist('my', 'player1'),
    alleventlist = world.getEventlist('all', 'player1')

class Buildinglayer {
    timer: number = null
    debouncetimer: number = null
    drawTimer: number = null
    type: string
    type_name: string
    finish: boolean = false
    positions: { x: number, y: number } = { x: 0, y: 0 }
    oldpositions: { x: number, y: number } = { x: 0, y: 0 }
    canvas: HTMLCanvasElement
    context: any  //顶层绘图
    unitcontext: any //单元实体绘图
    obstaclemap: { x: number, y: number }[] = []
    oldobstaclemap: { x: number, y: number }[] = []
    size: { width: number, height: number }
    canBuild: boolean = false //能够在此修建 条件之一
    inarea: boolean = false //在基地范围内
    constructor() {


        this.mouseMovehandler = this.mouseMovehandler.bind(this);
        this.mouseClickhandler = this.mouseClickhandler.bind(this);


    }
    setType(type: string, type_name: string) {
        this.type = type;
        this.type_name = type_name;
        this.sizeJudge();
        this.cancelTankselectormultiselect();
    }
    //种类判别 建筑的大小是不同的
    sizeJudge() {
        switch (this.type_name) {
            case 'stpowertation':
                this.size = {
                    width: 108,
                    height: 90
                }
                break;
            case 'stinfantry':
                this.size = {
                    width: 95,
                    height: 168
                }
                break;
            case 'stoil':
                this.size = {
                    width: 106,
                    height: 91
                }

                break;
            case 'stwcf':   //TODO--
                this.size = {
                    width: 106,
                    height: 91
                }

                break;
            case 'stwcf':   //TODO--
                this.size = {
                    width: 106,
                    height: 91
                }

                break;
            case 'gdprismtower':   //TODO--
                this.size = {
                    width: 48,
                    height: 95
                }

                break;
                case 'gdsentrycannon':   //TODO--
                this.size = {
                    width: 48,
                    height: 95
                }

                break;
            default:
                break;
        }
    }
    //TODO-- 连续建造存在初始换问题 需要注意 
    mouseMovehandler(e: MouseEvent) {
        console.log('卧槽无情');
        //节流
        if (!this.timer) {
            this.timer = window.setTimeout(() => {
                this.positions = {
                    x: e.offsetX,
                    y: e.offsetY
                }
                this.draw();
                this.getObstacles();
                clearTimeout(this.timer);
                this.timer = null;
            }, 50);
        }
    }
    mouseClickhandler(e: MouseEvent) {
        if (this.validationAreasafe()) {
            this.finish = true;
            let buildinglocation = {
                x: this.positions.x - this.size.width * 0.5,
                y: this.positions.y - this.size.height * 0.5,
            }
            this.canvas.removeEventListener('mousemove', this.mouseMovehandler);
            this.canvas.removeEventListener('click', this.mouseClickhandler);
            //清楚绿色待建造区
            this.context.clearRect(buildinglocation.x, buildinglocation.y, this.size.width + 2, this.size.height)
            //开始建造了
            this.newStructures();
        } else {
            cannotplayhere_audio.playAudio();
        }
    }
    //TODO-- 得阻止 物体的选择
    //新建筑物
    newStructures() {

        let buildinglocation = {
            x: this.positions.x - this.size.width * 0.5,
            y: this.positions.y - this.size.height * 0.5,
        },
            size = {
                x: this.size.width,
                y: this.size.height
            }
           

        // Powerstation,Soliderfactory,Oil
        switch (this.type_name) {
          case "stpowertation":
            let powerstation = new Powerstation(
              "player1",
              10,
              "20",
              buildinglocation,
              "powertation",
              this.unitcontext,
              size
            );
            break;
          case "stinfantry":
            let soliderfactory1 = new Soliderfactory(
              "player1",
              10,
              "20",
              buildinglocation,
              "soliderfactory",
              this.unitcontext,
              size
            );
            break;
          case "stoil":
            let oil = new Oil(
              "player1",
              10,
              "20",
              buildinglocation,
              "oil",
              this.unitcontext,
              size
            );
            break;
          case "stwcf":
            let wcf = new Wcf(
              "player1",
              10,
              "20",
              buildinglocation,
              "wcf",
              this.unitcontext,
              size
            );
            break;
          case "gdprismtower":
            // debugger
            let prismtower = new Prismtower(
              "player1",
              10,
              "20",
              buildinglocation,
              "prismtower",
              this.unitcontext,
              size
            );
            break;
          case "gdprismtower": //TODO __这里是哨所炮还未做
            let gdsentrycannon = new Sentrycannon(
              "player1",
              10,
              "20",
              buildinglocation,
              "sentrycannon",
              this.unitcontext,
              size
            );
            break;
          default:
            break;
        }
        //迎合图片加载的时间
        setTimeout(() => {
            constructionalnoctions_audio.playAudio();
        }, 200)

    }
    //当鼠标已在滑动的时候 应取消tank的选择或多选状态 对建筑这一方法成立
    cancelTankselectormultiselect() {
        if (this.type == 'stlist' || this.type == 'guardlist') {
            for (let j = 0; j < myeventlist.tanklist.length; j++) {
                myeventlist.tanklist[j].selected = false;
                myeventlist.tanklist[j].multiselect = false;
            }
        }

    }
    //绑定滑动，游击事件
    bindCanvas() {
        let canvas = document.getElementById('canvasclick') as HTMLCanvasElement, //事件应绑定在顶层上,
            unitcanvas = document.getElementById('canvas2') as HTMLCanvasElement;
        this.canvas = canvas as HTMLCanvasElement
        this.context = canvas.getContext('2d')
        this.unitcontext = unitcanvas
        canvas.addEventListener('mousemove', this.mouseMovehandler);
        canvas.addEventListener('click', this.mouseClickhandler);
    }
    //获取其中一个坦克的地图
    //障碍区= fakeMap（自身障碍物）+其他障碍物
    getObstacles() {
        //用防抖来校验？？？ 当停下的时候计算最后一次是否符合规范
        if (this.debouncetimer) {
            clearTimeout(this.debouncetimer);
            this.debouncetimer = null
        }
        this.debouncetimer = window.setTimeout(() => {
            let othermap = alleventlist.tanklist[0] ? alleventlist.tanklist[0].globalAstarmanage.map : globalAstarmanage.map,//其他障碍物
                atankmap = globalAstarmanage.fakemap, //（自身障碍物）//有问题
                MT = new Multithread(4);//web worker
            console.log(othermap, "其他地图")
            return new Promise((resolve, reject) => {
                ///   console.log('呵呵') TODO--这里应该可以优化一下 如果上次的map与本次的相同 就没必要使用webwer计算 直接返回这个值
                let handle = MT.process(this.calculateObstacles, (e) => {
                    this.obstaclemap = e;
                    resolve();
                    //   console.log(e, "啦啦啦啦")
                });
                handle(othermap, atankmap)
            })
        }, 100)




    }
    //计算障碍物
    calculateObstacles(othermap: any, atankmap: any) {
        let lastmap = [];
        console.time()
        for (let j = 0; j < 140; j++) {
            for (let k = 0; k < 448; k++) {
                if (othermap[j][k] == 33 || othermap[j][k] == 333 || atankmap[j][k] == 3) {
                    // lastmap[j][k] = 9 //假设9为不允许建造
                    lastmap.push({
                        x: j,
                        y: k
                    })
                }
            }
        }
        console.timeEnd()
        return lastmap
    }
    //校验是否选择的区域是平坦的
    validationAreasafe(): boolean {
        //TODO--  基地区域内的校验
        let startx = 835,
            starty = 364,
            endx = 835 + 580,

            endy = 364 + 580;
        this.inarea = false;
        if (startx <= this.positions.x - this.size.width * 0.5
            && starty <= this.positions.y - this.size.height * 0.5
            && endx >= this.positions.x + this.size.width * 0.5
            && endy >= this.positions.y + this.size.height * 0.5) {
            this.inarea = true
        }
        return this.canBuild && this.inarea
    }

    draw() {
        this.validationAreasafe();
        this.context.clearRect(this.oldpositions.x - this.size.width * 0.5, this.oldpositions.y - this.size.height * 0.5 - 1, this.size.width + 2, this.size.height + 2);
        // //绘制绿色部分
        this.context.fillStyle = this.inarea ? 'rgb(0,220,0)' : 'rgb(220,0,0)';
        this.context.fillRect(this.positions.x - this.size.width * 0.5, this.positions.y - this.size.height * 0.5, this.size.width, this.size.height);
        this.oldpositions = {
            x: this.positions.x,
            y: this.positions.y
        }
        //绘制红色
        let startx = this.positions.x - this.size.width * 0.5,
            starty = this.positions.y - this.size.height * 0.5,
            endx = startx + this.size.width,
            endy = starty + this.size.height;
        for (let j = 0; j < this.oldobstaclemap.length; j++) {
            this.context.clearRect(this.oldobstaclemap[j].y * 10, this.oldobstaclemap[j].x * 10, 10, 10);
        }
        if (this.oldobstaclemap.length == 0) {
            if (this.inarea) {
                this.canBuild = true
            } else {
                this.canBuild = false
            }

        } else {
            this.canBuild = false  //这里有一个时效性问题 webworker为异步的TODO--,目前表现还良好
        }
        this.oldobstaclemap = [];
        for (let j = 0; j < this.obstaclemap.length; j++) {
            if (startx <= this.obstaclemap[j].y * 10
                && starty <= this.obstaclemap[j].x * 10
                && endx >= this.obstaclemap[j].y * 10
                && endy >= this.obstaclemap[j].x * 10) {

                this.context.fillStyle = 'rgb(220,0,0)';
                this.context.fillRect(this.obstaclemap[j].y * 10, this.obstaclemap[j].x * 10, 10, 10);
                this.oldobstaclemap.push({
                    x: this.obstaclemap[j].x,
                    y: this.obstaclemap[j].y,
                })
            }
        }



    }

}
export let buildinglayer = new Buildinglayer()