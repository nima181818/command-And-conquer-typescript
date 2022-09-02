import { Watcher } from '../utils/watcher';
import { buildinglayer } from './buildinglayer'
import { Liberationarmy } from '../Tankclass/liberationarmy'
import { Rhinocerotidaetank } from '../Tankclass/rhinocerotidaetank'
import { Skystart } from '../Tankclass/skystarttank'
import { Engineer } from '../Tankclass/engineer'
import { Spy } from '../Tankclass/spy'
import { world } from '../World';
import { globalAstarmanage as realAstarmanage, globalAstarmanage } from '../utils/wayfinders'
import { buiding_audio, buidinginprogress_audio, constructionalcomplete_audio, unitready_audio } from '../assets/audios/audio'
import { Soliderfactory } from '../Structureclass/soliderfactory';
//总共要导出4个 分别对应建筑，防御，士兵，坦克
interface positions {
    x: number,
    y: number
}
interface taskitem {
    fun(),
    timer: number,
    typenum: number


}
interface taskque {
    stlist: taskitem[],
    guardlist: taskitem[],
    soilderlist: taskitem[],
    wartanklist: taskitem[]
}
class Masks {
    type: string   //为bar的类名？ stlist guardlist soilderlist wartanklist
    type_name: string
    finish: string //多少帧内结束 用于控制delta增量
    center: positions
    p1: positions
    p2: positions
    p3: positions
    p4: positions
    p5: positions
    p6: positions
    p7: positions
    watcher: Watcher<Masks> = new Watcher<this>()
    taskqueue: taskque = { stlist: [], guardlist: [], soilderlist: [], wartanklist: [] }  //任务列队，针对 战车和兵种可以重复多建造的：length>1
    element: HTMLDivElement
    r: number
    theta: number
    delta: number
    timer: number
    buildingrate: number
    currentbuildingindex: number = 0
    constructor(type: string) {

        this.type = type;
        this.buildingrate = 0.2 //TODO--
        this.watcher = new Watcher();
        //this.watcher.register('currentbuildingindexTrigger', this.currentbuildingindexTrigger);
        //this.watcher.responseMode(this, 'currentbuildingindex');
        this.initData();
        this.initGui();
        this.mountOnbar()
    }
    //当前正在执行任务index变化的监听回调
    currentbuildingindexTrigger() {

    }
    //初始化渲染的数据
    initData() {
        this.center = {
            x: 50,
            y: 50
        }

        this.p1 = {
            x: this.center.x,
            y: 0
        }
        // let array: positions[] = [this.p2, this.p3, this.p4, this.p5, this.p6, this.p7];
        // for (let j = 0; j < array.length; j++) {
        //     if (array[j].x === null) {
        //         array.splice(j, 1);
        //         j--
        //     }
        // }
    }
    //初始化要渲染的div
    initGui() {
        let div = document.createElement('div');
        div.className = 'mask';
        div.id = this.type + '_div';
        this.element = div;
        this.element.style.display = 'none';
        this.element.style.position = 'absolute';
        this.element.style.top = '0';
        this.element.style.left = '0';
        this.element.style.width = '100px';
        this.element.style.height = '100px';
        this.element.style.zIndex = '2'
        this.element.style.background = 'rgba(255,255,0,0.5)';
    }
    //div初始化完成需要挂载在对应的bar上
    mountOnbar() {
        let bar = document.getElementsByClassName(this.type)[0];

        bar.appendChild(this.element);
    }
    //分析命令
    analyseCommander(commander: string, typeNum: number) {
        if (commander == 'building') {
            if (this.taskqueue[this.type].length) {
                if (this.type == 'stlist' || this.type == 'guardlist') {
                    buidinginprogress_audio.playAudio();
                    return;
                }

            }
            buiding_audio.playAudio();
            if (this.type == 'stlist') {
                //建筑的建造均为单一的没有队列，做完一个 弹出队列？但是我是根据运行一个 走下一个？？

                switch (typeNum) {
                    case 0:
                        this.handlePositions(0, 0);
                        this.type_name = 'stpowertation'
                        break;
                    case 1:
                        this.handlePositions(0, 100);
                        this.type_name = 'stinfantry'
                        break;
                    case 2:
                        this.handlePositions(100, 0);
                        this.type_name = 'stoil'
                        break;
                    case 3:
                        this.handlePositions(100, 100);
                        this.type_name = 'stwcf'
                        break;
                    default:

                        break;
                }
            }
            if (this.type == 'guardlist') {
                switch (typeNum) {
                    case 0:
                        this.handlePositions(0, 0);
                        this.type_name = 'gdprismtower'
                        break;
                    case 1:
                        this.handlePositions(0, 100);
                        this.type_name = 'gdsentrycannon'
                        break;
                    default:

                        break;
                }
            }
            if (this.type == 'soilderlist') {
                if (this.taskqueue['soilderlist'].length) {
                    //只允许同时建立一个兵种
                    if (this.taskqueue['soilderlist'][0].typenum != typeNum) {
                        buidinginprogress_audio.playAudio();
                        return;
                    }
                }
                switch (typeNum) {
                    case 0:
                        this.handlePositions(0, 0);
                        this.type_name = 'sdliberationarmy'
                        break;
                    case 1:
                        this.handlePositions(0, 100);
                        this.type_name = 'sdengineer'
                        break;
                    case 2:
                        this.handlePositions(100, 0);
                        this.type_name = 'sdspy'
                        break;
                    default:
                        break;
                }
            }
            if (this.type == 'wartanklist') {
                if (this.taskqueue['wartanklist'].length) {
                  
                    if (this.taskqueue['wartanklist'][0].typenum != typeNum) {
                        buidinginprogress_audio.playAudio();
                        return;
                    }
                }
                switch (typeNum) {
                    case 0:
                        this.handlePositions(0, 0);
                        this.type_name = 'tkrhinocerotidaetank'
                        break;
                    case 1:
                        this.handlePositions(0, 100);
                        this.type_name = 'tkskystarttank'
                        break;
                   
                    default:
                        break;
                }
            }
            this.loadTasks(typeNum);
        } else {
            //取消建筑
            this.cancelBuilding();
        }


    }

    //任务装载
    loadTasks(typenum: number) {
        if (this.type == 'stlist' || this.type == 'guardlist') {

            let taskitem = {
                fun: this.startBuilding.bind(this),
                timer: null,
                typenum: typenum
            }
            this.taskqueue[this.type].push(taskitem);
            this.taskqueue[this.type][0].fun();
        } else {
            //处理兵种建造的情况
          //  if (this.type == 'soilderlist') {
                let taskitem = {
                    fun: this.startBuilding.bind(this),
                    timer: null,
                    typenum: typenum
                }
                this.taskqueue[this.type].push(taskitem);
                if (!this.taskqueue[this.type][this.currentbuildingindex].timer) {
                    this.taskqueue[this.type][0].fun();
                }

       //     }

        }
    }
    //取消建造 TODO--
    cancelBuilding() {
        //TODO cancel的声音
        if (this.type == 'stlist' || this.type == 'guardlist') {
            try {
                let item = this.taskqueue[this.type].splice(0, 1);

                console.log(item, 555)
                let timer = item[0].timer;
                if (timer) {
                    clearInterval(timer)
                }
                this.element.style.display = 'none'
            } catch (e) {
                console.log('your right click is not current building task')
            }

        } else {
            try {
                let le = this.taskqueue[this.type].length,
                    item = this.taskqueue[this.type].splice(le - 1, 1)

                let timer = item[0].timer;
                if (timer) {
                    clearInterval(timer)
                }
                if (this.taskqueue[this.type].length == 0) {
                    this.element.style.display = 'none'
                }
            } catch (e) {
                console.log('your right click is not current building task')
            }

        }

    }
    //位置处理
    handlePositions(top: number, left: number) {
        this.element.style.top = top + 'px';
        this.element.style.left = left + 'px';

    }
    //开始建造
    startBuilding() {
        let center = {
            x: 50,
            y: 50
        };
        this.p1 = {
            x: center.x,
            y: 0
        };
        this.theta = 0;
        this.r = 50;
        this.delta = Math.PI / 36;
        this.element.style.display = 'block'
        //    return new Promise(())
        let timer = window.setInterval(() => {
            // console.time('m')
            if (0 < this.theta && this.theta <= 0.25 * Math.PI) {
                this.r = 50 / Math.cos(this.theta);
                this.p2 = {
                    x: center.x + this.r * Math.sin(this.theta),
                    y: 0
                }
                this.p3 = {
                    x: center.x * 2,
                    y: 0
                }
                this.p4 = {
                    x: center.x * 2,
                    y: center.y * 2
                }
                this.p5 = {
                    x: 0,
                    y: center.y * 2
                }
                this.p6 = {
                    x: 0,
                    y: 0
                }
                this.p7 = this.p1
            }

            if (0.25 * Math.PI < this.theta && this.theta <= 0.75 * Math.PI) {
                this.r = 50 / Math.sin(this.theta);
                this.p2 = {
                    x: center.x * 2,
                    y: center.y - this.r * Math.cos(this.theta)
                }

                this.p3 = {
                    x: center.x * 2,
                    y: center.y * 2
                }
                this.p4 = {
                    x: 0,
                    y: center.y * 2
                }
                this.p5 = {
                    x: 0,
                    y: 0
                }
                this.p6 = this.p1
                this.p7 = null

            }

            if (0.75 * Math.PI < this.theta && this.theta <= 1.25 * Math.PI) {
                this.r = Math.abs(50 / Math.cos(this.theta))
                this.p2 = {
                    x: center.x + this.r * Math.sin(this.theta),

                    y: center.y * 2
                }

                this.p3 = {
                    x: 0,
                    y: center.y * 2
                }
                this.p4 = {
                    x: 0,
                    y: 0
                }
                this.p5 = this.p1
                this.p6 = null
                this.p7 = null

            }

            if (1.25 * Math.PI < this.theta && this.theta <= 1.75 * Math.PI) {
                this.r = Math.abs(50 / Math.sin(this.theta))
                this.p2 = {
                    x: 0,

                    y: center.y - this.r * Math.cos(this.theta)
                }

                this.p3 = {
                    x: 0,
                    y: 0
                }
                this.p4 = this.p1
                this.p5 = null
                this.p6 = null
                this.p7 = null

            }
            if (1.75 * Math.PI < this.theta && this.theta <= 2 * Math.PI) {
                this.r = Math.abs(50 / Math.cos(this.theta))
                this.p2 = {
                    x: center.x + this.r * Math.sin(this.theta),

                    y: 0
                }

                this.p3 = this.p1
                this.p4 = null
                this.p5 = null
                this.p6 = null
                this.p7 = null

            }

            let arrays = [this.p1, center, this.p2, this.p3, this.p4, this.p5, this.p6, this.p7];
            for (let j = 0; j < arrays.length; j++) {
                if (!arrays[j]) {
                    arrays.splice(j, 1);
                    j--
                }

            }
            let strings = 'polygon(';
            for (let j = 0; j < arrays.length; j++) {
                strings += `${arrays[j].x}% ${arrays[j].y}% ,`
            }
            strings = (strings + ')').replace(',)', ')');
            this.element.style.clipPath = strings;
            //     console.time('m')
            this.theta += this.delta;
            //    console.timeEnd('m')
            if (this.theta > 2 * Math.PI) {
                clearInterval(timer);



                this.toldPlayer();

                this.element.style.display = 'none'
                this.taskqueue[this.type].pop();
                if (this.taskqueue[this.type].length) {
                    this.taskqueue[this.type][this.currentbuildingindex].fun();
                }

            }

            //    console.log(strings) buildingrate??TODO
        }, 16.6);

        this.taskqueue[this.type][this.currentbuildingindex].timer = timer
    }
    //建造完成通知玩家进行鼠标左键选择-放在playground上
    //注意！！ 这只对 建筑和防御有效
    toldPlayer() {
        // stlist guardlist soilderlist wartanklist
        if (this.type == 'stlist' || this.type == 'guardlist') {

            buildinglayer.setType(this.type, this.type_name)
            buildinglayer.bindCanvas();
            constructionalcomplete_audio.playAudio();
        }
        if (this.type == 'soilderlist') {
            // buildinglayer.setType(this.type, this.type_name)
            //buildinglayer.bindCanvas();
            unitready_audio.playAudio();
            this.generateSoilder();

        }
        if (this.type == 'wartanklist') {
            // buildinglayer.setType(this.type, this.type_name)
            //buildinglayer.bindCanvas();
            unitready_audio.playAudio();
            this.generateTank();

        }
    }
    //生成tank string:unittype
    generateTank(type:string='player1'){
        let bornposition = this.circleGenerationline(type),
        
        player = world.playerManage.find(item => { return item.unittype == type }),
        // import {Engineer} from '../Tankclass/engineer'
        // import {Spy} from '../Tankclass/spy'
        unit = null;
        
    switch (this.type_name) {
        case 'tkrhinocerotidaetank':
            unit = new Rhinocerotidaetank(type, bornposition);
            //   alert(unit._id)
console.log(unit,"444")
            break;
        case 'tkskystarttank':
            unit = new Skystart(type, bornposition)
            break;
      
        default:
            break;
    }
    //   unit.setTankspoints(aggregation.x, aggregation.y, 'setendpoints', true, true);
    unit.paint(player.vehiclecanvas)
    }
    //生成兵种
    generateSoilder(type:string='player1') {
        
        let bornposition = this.circleGenerationline(type),
            player = world.playerManage.find(item => { return item.unittype == type }),
            // import {Engineer} from '../Tankclass/engineer'
            // import {Spy} from '../Tankclass/spy'
            unit = null;
        switch (this.type_name) {
            case 'sdliberationarmy':
                unit = new Liberationarmy(type, bornposition);
                //   alert(unit._id)

                break;
            case 'sdengineer':
                unit = new Engineer(type, bornposition)
                break;
            case 'sdspy':
                unit = new Spy(type, bornposition)
                break;
            default:
                break;
        }
        //   unit.setTankspoints(aggregation.x, aggregation.y, 'setendpoints', true, true);
        unit.paint(player.vehiclecanvas)
    }

    //采取在出生点环状生产的方式
    //代价：牺牲掉从军营门口生成的效果TODO
    circleGenerationline(type:string='player1'): pointerface {


        let player = world.playerManage.find(item => { return item.unittype == type }),
            alleventlist = world.getEventlist('all', 'player1'),
            soilderfactory =this.type=='soilderlist'?player.structuresets.unitsList.soliderfactory[0]:player.structuresets.unitsList.wcf[0];
        if (alleventlist.tanklist[0]) {
            for (let k = 0; k < alleventlist.tanklist[0].globalAstarmanage.map.length; k++) {
                for (let u = 0; u < alleventlist.tanklist[0].globalAstarmanage.map[k].length; u++) {
                    //-- 这里处理了地图障碍物，还有建筑障碍物未处理
                    if (alleventlist.tanklist[0].globalAstarmanage.map[k][u] != 33 && alleventlist.tanklist[0].globalAstarmanage.map[k][u] != 333) {
                        alleventlist.tanklist[0].globalAstarmanage.map[k][u] = 0
                    }

                }
            }
            alleventlist.tanklist[0].obstacleRepailie();
        }
        let othermap = alleventlist.tanklist[0] ? alleventlist.tanklist[0].globalAstarmanage.map : globalAstarmanage.map,//其他障碍物
            atankmap = globalAstarmanage.fakemap //（自身障碍物）//有问题TODO

      //  console.log(othermap, "其他地图")
        return this.calculateObstacles(soilderfactory, othermap, atankmap);
    }
    //计算障碍物
    calculateObstacles(soilderfactory: any, othermap: any, atankmap: any): pointerface {
        let unitownspace =this.type=='soilderlist'? {
            width: 26,
            height: 32
        }:{
            width: 40,
            height: 40
        },
            bornposition = {
                x: soilderfactory.positions.x + 0.5 * soilderfactory.size.x,
                y: soilderfactory.positions.y + soilderfactory.size.y + 10
            },
            r =this.type=='soilderlist'?50:100,
            theta = 2 * Math.PI / 7;
        let f = (r) => {
            let m = r;
            for (let j = 0; j < 7; j++) {
                let startx = this.closeFunc(bornposition.x + m * Math.cos(j * theta)),
                    starty = this.closeFunc(bornposition.y + m * Math.sin(j * theta)),
                    endx = this.closeFunc(bornposition.x + m * Math.cos(j * theta) + unitownspace.width),
                    useful = true,
                    endy = this.closeFunc(bornposition.y + m * Math.sin(j * theta) + unitownspace.height);
                for (let u = starty; u <= endy; u++) {
                    for (let k = startx; k <= endx; k++) {
                        if (othermap[u][k] == 33 || othermap[u][k] == 333 || othermap[u][k] == 3 || atankmap[u][k] == 3) {
                            useful = false;

                        }
                    }
                    if (useful) {
                 //       console.log(othermap, '啦啦啦')
                        return {
                            x: bornposition.x + r * Math.cos(j * theta),
                            y: bornposition.y + r * Math.sin(j * theta)
                        }
                    }
                    //无障碍，可以设置集结点

                }
            }
        }


        for (let j = 0; j < 100; j++) {
            if (!f(r + j * 41)) {

            } else {
                return f(r + j * 41)
            }
        }
        return null

    }

    //临近函数 //找出距离自己最近的矩阵点
    closeFunc(point: number): number {
        let k = parseInt((point / 10).toString());
        return k
    }
}
let stlistMask = new Masks('stlist'),
    guardlistMask = new Masks('guardlist'),
    soilderlistMask = new Masks('soilderlist'),
    wartanklistMask = new Masks('wartanklist');
export { stlistMask, guardlistMask, soilderlistMask, wartanklistMask }