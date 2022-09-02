//bar图片
const s1 = require('../assets/rightbar/s1.png'),
    s2 = require('../assets/rightbar/s2.png'),
    s3 = require('../assets/rightbar/s3.png'),
    s4 = require('../assets/rightbar/s4.png'),
    us1 = require('../assets/rightbar/us1.png'),
    us2 = require('../assets/rightbar/us2.png'),
    us3 = require('../assets/rightbar/us3.png'),
    us4 = require('../assets/rightbar/us4.png'),
    //建筑图片
    stpowertation = require('../assets/buildings-structure/st_powerstation.png'),
    stinfantry = require('../assets/buildings-structure/st_infantry.png'),
    stoil = require('../assets/buildings-structure/st_oil.png'),
    stwcf = require('../assets/buildings-structure/wcf.png'),

    //防御图片
    gdprismtower = require('../assets/buildings-structure/gd_prismtower.png'),
    sentrycannon = require('../assets/buildings-structure/gd_prismtower.png'),


    //兵种单位
    liberationarmy = require('../assets/buildings-structure/soilder_liberationarmy.png'),
    engineer = require('../assets/buildings-structure/soilder_engineer.png'),
    spy = require('../assets/buildings-structure/soilder_spy.png'),

    //坦克单位
    rhinocerotidaetank = require('../assets/buildings-structure/tk_rhinocerotidae.png'),
    skystart = require('../assets/buildings-structure/tk_skystart.png'),

    $id = document.getElementById.bind(document),
    $cls = document.getElementsByClassName.bind(document);
import { stlistMask, guardlistMask, soilderlistMask, wartanklistMask } from './masks';
import { world } from '../World';
// import {player1} from '../player'
let player1 = world.playerManage.find(item => { return item.unittype == 'player1' });
let maskListall = [stlistMask, guardlistMask, soilderlistMask, wartanklistMask]
export class Rightbars {
    currentpageIndex: number = 0
    alllist: Array<HTMLDivElement> = []

    barimgUrllist: Array<string> = []
    barimgList: Array<HTMLImageElement> = []
    barElement: Array<HTMLDivElement> = []


    structureimgurl: Array<string>
    structureimg: Array<HTMLImageElement> = []
    structurelist: Array<HTMLDivElement> = []
    structureinbuiding: boolean = false


    guardimgurl: Array<string>
    guardimg: Array<HTMLImageElement> = []
    guardlist: Array<HTMLDivElement> = []


    //兵种
    soilderimgurl: Array<string>
    soilderimg: Array<HTMLImageElement> = []
    soilderlist: Array<HTMLDivElement> = []

   //tank
   tankimgurl: Array<string>
   tankimg: Array<HTMLImageElement> = []
   tanklist: Array<HTMLDivElement> = []

    constructor() {

        this.initContainerlist();
        this.initBarelment();


        this.initStructure();
        this.initGuard();
        this.initSoilder();
        this.initTank();

    }
    //初始化下方类型框container
    initContainerlist() {
        let stlist = $cls('stlist')[0] as HTMLDivElement,
            guardlist = $cls('guardlist')[0] as HTMLDivElement,
            soilderlist = $cls('soilderlist')[0] as HTMLDivElement,
            wartanklist = $cls('wartanklist')[0] as HTMLDivElement;

        this.alllist = [stlist, guardlist, soilderlist, wartanklist];
        for (let j = 1; j < this.alllist.length; j++) {
            this.alllist[j].style.display = 'none'
        }
    }
    //初始化bar的div元素
    initBarelment() {
        let items = document.getElementsByClassName('items');
        let barlist: HTMLDivElement[] = [];
        for (let j = 0; j < items.length; j++) {
            barlist.push(items[j] as HTMLDivElement)
        }
        this.barElement = barlist;
        this.initbarImgelement();
    }
    //初始化 bar的图片
    initbarImgelement() {
        this.barimgUrllist = [
            s1.default,
            s2.default,
            s3.default,
            s4.default,
            us1.default,
            us2.default,
            us3.default,
            us4.default,
        ]
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.barimgUrllist.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.barimgUrllist[j];
                // img.style.display='inline-block'
                img.onload = function () {
                    counts++;

                    this.barimgList[j] = img;
                    if (counts == this.barimgUrllist.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        }).then(res => {
            this.paintbarImg();
        })

    }

    //初始化bar，绑定事件
    paintbarImg() {
        for (let j = 0; j < this.barElement.length; j++) {
            this.barElement[j].appendChild(this.barimgList[j + 4]);
            this.barElement[j].onclick = function () {
                if(this.barElement[j].children[0].style.visibility=='hidden'){
                    return;
                }
                this.currentpageIndex = j;
                this.alllist[j].style.display = 'flex';
                this.barElement[j].innerHTML = '';
                this.barElement[j].appendChild(this.barimgList[j]);
                for (let k = 0; k < this.barElement.length; k++) {
                    if (k != j) {
                        this.barElement[k].innerHTML = '';
                        this.barElement[k].appendChild(this.barimgList[k + 4]);
                        //校验是否有该选项
                    //    let obj = player1.structuresets.barControl();
                        this.alllist[k].style.display = 'none'
                    }
                }
            }.bind(this)
        }
    }
    //初始化建筑
    initStructure() {
        let stpowertation = $id('stpowertation'),
            stinfantry = $id('stinfantry'),
            stoil = $id('stoil'),
            stwcf = $id('stwcf');
        this.structurelist = [stpowertation, stoil, stinfantry, stwcf];
        this.initStructureimg();
    }
    //初始化 建筑图片
    initStructureimg() {
        this.structureimgurl = [
            stpowertation.default,
            stinfantry.default,
            stoil.default,
            stwcf.default
        ]
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.structureimgurl.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.structureimgurl[j]
                img.onload = function () {
                    counts++;
                    this.structureimg[j] = img;
                    if (counts == this.structureimgurl.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        }).then(res => {
            this.bindingStructureevent();
        })

    }
    //绑定建筑事件
    bindingStructureevent() {
        for (let j = 0; j < this.structurelist.length; j++) {
            this.structurelist[j].appendChild(this.structureimg[j]);
            //左键建造，
            this.structurelist[j].onclick = function () {
                //TODO 这里需要预判是否钱够
                if (!this.moneyPrejudge(j, 'bar','player1')) {
                    alert('钱不够')
                    return;
                }


                let powervalue = world.playerManage.find(item=>{return item.unittype.indexOf('ai')==-1}).powernumber
      
               
                if(j==1){
                    if(powervalue-(150)<0){
                        alert('电量不足')
                        return
                    }
                    
                }
                if(j==2){
                    if(powervalue-(150)<0){
                        alert('电量不足')
                        return
                    }
                    
                }     
                if(j==3){
                    if(powervalue-(200)<0){
                        alert('电量不足')
                        return
                    }
                    
                }   
             
                maskListall[0].analyseCommander('building', j);
                // if (this.structureinbuiding) {
                //     return;
                // }
                // this.structureinbuiding = true
                // setTimeout(() => {
                //     this.structureinbuiding = false;
                //     console.log('修建完成')
                // }, 4000)

            }.bind(this)
            //右键取消
            this.structurelist[j].oncontextmenu = function (e:any) {
                maskListall[0].cancelBuilding()
                e.preventDefault()
            }.bind(this)
        }
    }

    //初始化防御
    initGuard() {
        let prismtower = $id('prismtower'),
            sentrycannon = $id('sentrycannon');
        //还有哨所炮TODO--
        this.guardlist = [prismtower];
        this.initGuardimg();
    }
    //初始化防御图片
    initGuardimg() {
        this.guardimgurl = [gdprismtower.default];
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.guardimgurl.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.guardimgurl[j]
                img.onload = function () {
                    counts++;
                    this.guardimg[j] = img;
                    if (counts == this.guardimgurl.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        }).then(result => {
            this.bindingGuardevent();
        })
    }
    //绑定防御事件
    bindingGuardevent() {
        for (let j = 0; j < this.guardlist.length; j++) {
            this.guardlist[j].appendChild(this.guardimg[j]);
            //左键建造，
            
            this.guardlist[j].onclick = function () {
                //TODO 这里需要预判是否钱够
                let powervalue = world.playerManage.find(item=>{return item.unittype.indexOf('ai')==-1}).powernumber
      
                if (!this.moneyPrejudge(j, 'guard')) {
                    alert('钱不够')
                    return;
                }

                if(j==0){
                    if(powervalue-(300)<0){
                        alert('电量不足')
                        return
                    }
                    
                }
                maskListall[1].analyseCommander('building', j);
                // if (this.structureinbuiding) {
                //     return;
                // }
                // this.structureinbuiding = true
                // setTimeout(() => {
                //     this.structureinbuiding = false;
                //     console.log('修建完成')
                // }, 4000)

            }.bind(this)
            //右键取消
            this.guardlist[j].oncontextmenu = function () {
                maskListall[1].cancelBuilding()
            }.bind(this)
        }
    }
    
    initSoilder() {


        let liberationarmy = $id('liberationarmy'),
            engineer = $id('engineer'),
            spy = $id('spy');
        //还有哨所炮TODO--
        this.soilderlist = [liberationarmy, engineer];
        this.initSoilderimg();
    }
    initSoilderimg(){
        this.soilderimgurl = [liberationarmy.default, engineer.default];
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.soilderimgurl.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.soilderimgurl[j]
                img.onload = function () {
                    counts++;
                    this.soilderimg[j] = img;
                    if (counts == this.soilderimgurl.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        }).then(result => {
            this.bindingSoilderevent();
        })
    }
    //绑定兵种建造事件
    bindingSoilderevent(){
        for (let j = 0; j < this.soilderlist.length; j++) {
            this.soilderlist[j].appendChild(this.soilderimg[j]);
            //左键建造，
            this.soilderlist[j].onclick = function () {
                
                //TODO 这里需要预判是否钱够
                if (!this.moneyPrejudge(j, 'soilder')) {
                    alert('钱不够')
                    return;
                }

                maskListall[2].analyseCommander('building', j);
              
            }.bind(this)
            //右键取消
            this.soilderlist[j].oncontextmenu = function () {
                maskListall[2].cancelBuilding()
            }.bind(this)
        }
    }
    //初始化tank
    initTank(){
        let rhinocerotidaetank = $id('rhinocerotidaetank'),
            skystart = $id('skystart');
          this.tanklist = [rhinocerotidaetank,skystart]
          this.initTankimg();
    }
    initTankimg(){
        this.tankimgurl = [rhinocerotidaetank.default, skystart.default];
        return new Promise((res, rej) => {
            let counts = 0;
            for (let j = 0; j < this.tankimgurl.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = this.tankimgurl[j]
                img.onload = function () {
                    counts++;
                    this.tankimg[j] = img;
                    if (counts == this.tankimgurl.length) {
                        res();
                    }
                }.bind(this)
                document.body.appendChild(img)

            }
        }).then(result => {
            this.bindingTankevent();
        })
    }
    bindingTankevent(){
        for (let j = 0; j < this.tanklist.length; j++) {
            this.tanklist[j].appendChild(this.tankimg[j]);
            //左键建造，
            this.tanklist[j].onclick = function () {
                
                //TODO 这里需要预判是否钱够
                
                if (!this.moneyPrejudge(j, 'tank','player1')) {
                    alert('钱不够')
                    return;
                }

                maskListall[3].analyseCommander('building', j);
              
            }.bind(this)
            //右键取消
            this.tanklist[j].oncontextmenu = function () {
                maskListall[3].cancelBuilding()
            }.bind(this)
        }
    }
    //金钱的判断
    moneyPrejudge(j: number, type: string,unittype:string='player1') {
        let canbuild = false,
        player1 =  world.playerManage.find(item => { return item.unittype == unittype });
        
        if (type == 'bar') {
            switch (j) {
                case 0:
                    canbuild = player1.money - 150 >= 0 //TODO 这里写死 应该要引用
                    break;
                case 1:
                    canbuild = player1.money - 200 >= 0 //TODO 这里写死 应该要引用
                    break;
                case 2:
                    canbuild = player1.money - 200 >= 0 //TODO 这里写死 应该要引用
                    break;
                case 3:
                    canbuild = player1.money - 250 >= 0 //TODO 这里写死 应该要引用
                    break;
                default:
                    break;



            }
        }
        if (type == 'guard') {
            switch (j) {
                case 0:
                    canbuild = player1.money - 400 >= 0 //光棱塔 TODO 这里写死 应该要引用TODO-- 还有哨所炮
                    break;
                case 1:
                    canbuild = player1.money - 300 >= 0 //光棱塔 TODO 这里写死 应该要引用TODO-- 还有哨所炮
                    break;
                default:
                    break;



            }
        }
        if(type=='soilder'){
          // debugger
          switch (j) {
            case 0:
              canbuild = player1.money - 200 >= 0; //解放军 TODO 这里写死 应该要引用TODO--
              break;
            case 1:
              canbuild = player1.money - 300 >= 0; //工程师 TODO 这里写死 应该要引用TODO--
              break;
            // case 2:
            //     canbuild = player1.money - 250 >= 0 //间谍 TODO 这里写死 应该要引用TODO--
            //     break;
            default:
              break;
          }
        }
        if(type=='tank'){
            switch(j){
                case 0:
                    canbuild = player1.money - 400 >= 0 //犀牛坦克 TODO 这里写死 应该要引用TODO--
                    break;
                case 1:
                    canbuild = player1.money - 600 >= 0 //天启tank TODO 这里写死 应该要引用TODO--
                    break;
                    // case 2:
                    //     canbuild = player1.money - 250 >= 0 //间谍 TODO 这里写死 应该要引用TODO--
                    //     break;
                default:
                    break;


            }
        }
        return canbuild
    }

}