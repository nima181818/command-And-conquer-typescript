import { Structuresets } from './Structureclass/structureSet'
import { Eventlist } from './Tankclass/Eventlist';

import { Rhinocerotidaetank } from './Tankclass/rhinocerotidaetank'
import { BaseControl } from './Structureclass/basecontrol'
import { Soliderfactory } from './Structureclass/soliderfactory'
import { Powerstation } from './Structureclass/powerstation'
import { Prismtower } from './Structureclass/prismtower'
import { Oil } from './Structureclass/oil'
import { Wcf } from './Structureclass/wcf'
import { world } from './World'
import { globalAstarmanage as realAstarmanage, globalAstarmanage } from './utils/wayfinders'

export class Player {
  baseMapcanvas: HTMLCanvasElement;
  topUnitscanvas: HTMLCanvasElement;
  vehiclecanvas: HTMLCanvasElement;
  structuresets: any;
  eventlist: any;
  money: number = 1800;
  powernumber: number = 0;
  unittype: string;
  moneyelement: HTMLDivElement;
  constructor(unittype: string, baseposition: pointerface) {
    //    this.
    this.unittype = unittype;
    this.structuresets = new Structuresets(this.unittype);
    this.eventlist = new Eventlist(unittype);
    this.initCanvas();
    this.playersSelection();
    this.initBase(baseposition); //这里又要使用异步的方式
    //this.allAnimations();
  }
  powerCanculations(type: string, value: number) {
    let powerel = document.getElementById("powernumber") as HTMLSpanElement;

    if (type == "add") {
      this.powernumber += value;
    }
    if (type == "reduce") {
      let tempvalue = this.powernumber;
      tempvalue -= value;

      this.powernumber -= value;
    }
    this.powernumber = this.powernumber || 0;
    if (this.unittype == "player1") {
      powerel.innerHTML = this.powernumber.toString();
    }
  }
  //通过unittype获取eventList

  //初始化canvas |以及金钱
  initCanvas() {
    let canvas1: HTMLCanvasElement = document.getElementById(
        "canvas1"
      ) as HTMLCanvasElement,
      canvas2: HTMLCanvasElement = document.getElementById(
        "canvas2"
      ) as HTMLCanvasElement,
      vehiclecanvas: HTMLCanvasElement = document.getElementById(
        "canvasunit"
      ) as HTMLCanvasElement;
    this.baseMapcanvas = canvas1;
    this.topUnitscanvas = canvas2;
    this.vehiclecanvas = vehiclecanvas;
    this.moneyelement = document.getElementsByClassName(
      "tops"
    )[0] as HTMLDivElement;
  }
  //初始化基地，部队
  initBase(baseposition: pointerface) {
    setTimeout(() => {
      let base = new BaseControl(
        this.unittype,
        10,
        "20",
        baseposition,
        "base",
        this.topUnitscanvas,
        { x: 98.9 * 1.5, y: 58.5 * 1.5 + 25 }
      );

      let t1 = new Rhinocerotidaetank(
          this.unittype,
          this.unittype == "player1" ? { x: 1000, y: 800 } : { x: 3500, y: 800 }
        ),
        t2 = new Rhinocerotidaetank(
          this.unittype,
          this.unittype == "player1" ? { x: 800, y: 800 } : { x: 3600, y: 800 }
        );
      t1.paint(this.vehiclecanvas);
      t2.paint(this.vehiclecanvas);
      this.allAnimations(); //放到这里是为了防止游戏已初始化就被判定为失败/胜利
    });
  }
  getAnotherplayer() {
    let player = world.playerManage.find((item) => {
      return item.unittype != this.unittype;
    });
    return player;
  }
  //所有单位的动画 由于这个控制
  allAnimations() {
    //  setTimeout(()=>{
    this.eventlist.allTanksanimation();
    this.structuresets.structureAnimation();

    window.requestAnimationFrame(this.allAnimations.bind(this));
    // window.setTimeout(()=>{
    //     this.allAnimations();
    // },16.6)

    ///},2000)
  }

  //更新金币
  updateMoney(type: string, value: number) {
    if (type == "add") {
      this.money += value;
    }
    if (type == "reduce") {
      this.money -= value;
    }
    //TODO 现要考虑敌方AI
    if (this.unittype.indexOf("player") != -1) {
      this.moneyelement.innerHTML = "$" + this.money.toString();
    }
  }
  //敌人 创建建筑
  createStructure(type: string) {
    //type 的参考值 powerstation soliderfactory wcf oil prismtower
    switch (type) {
      case "powerstation":
        let buildlocation1 = this.circleGenerationline("powerstation");

        let s1 = new Powerstation(
          "ai1",
          10,
          "20",
          buildlocation1,
          "powertation",
          this.topUnitscanvas,
          { x: 1, y: 1 }
        );
        break;
      case "soliderfactory":
        let buildlocation2 = this.circleGenerationline("soliderfactory");

        let s2 = new Soliderfactory(
          "ai1",
          10,
          "20",
          buildlocation2,
          "soliderfactory",
          this.topUnitscanvas,
          { x: 1, y: 1 }
        );
        break;
      case "oil":
        let buildlocation3 = this.circleGenerationline("oil");

        let s3 = new Oil(
          "ai1",
          10,
          "20",
          buildlocation3,
          "oil",
          this.topUnitscanvas,
          { x: 1, y: 1 }
        );
        break;
      case "wcf":
        let buildlocation4 = this.circleGenerationline("wcf");

        let s4 = new Wcf(
          "ai1",
          10,
          "20",
          buildlocation4,
          "wcf",
          this.topUnitscanvas,
          { x: 1, y: 1 }
        );
        break;
      case "prismtower":
        let buildlocation5 = this.circleGenerationline("prismtower");

        let s5 = new Prismtower(
          "ai1",
          10,
          "20",
          buildlocation5,
          "prismtower",
          this.topUnitscanvas,
          { x: 1, y: 1 }
        );
        break;
    }
  }

  //采取在出生点环状生产的方式
  //代价：牺牲掉从军营门口生成的效果TODO
  circleGenerationline(structurename: string): pointerface {
    let base = world.getStructuresets("other", "player1")["base"][0];
    let player1 = world.playerManage.find((item) => {
        return item.unittype == "player1";
      }),
      alleventlist = world.getEventlist("all", "player1");
    if (alleventlist.tanklist[0]) {
      for (
        let k = 0;
        k < alleventlist.tanklist[0].globalAstarmanage.map.length;
        k++
      ) {
        for (
          let u = 0;
          u < alleventlist.tanklist[0].globalAstarmanage.map[k].length;
          u++
        ) {
          //-- 这里处理了地图障碍物，还有建筑障碍物未处理
          if (
            alleventlist.tanklist[0].globalAstarmanage.map[k][u] != 33 &&
            alleventlist.tanklist[0].globalAstarmanage.map[k][u] != 333
          ) {
            alleventlist.tanklist[0].globalAstarmanage.map[k][u] = 0;
          }
        }
      }
      alleventlist.tanklist[0].obstacleRepailie();
    }
    let othermap = alleventlist.tanklist[0]
        ? alleventlist.tanklist[0].globalAstarmanage.map
        : globalAstarmanage.map, //其他障碍物
      atankmap = globalAstarmanage.fakemap; //（自身障碍物）//有问题TODO

    console.log(othermap, "其他地图");
    return this.calculateObstacles(base, othermap, atankmap, structurename);
  }
  //计算障碍物
  calculateObstacles(
    structure: any,
    othermap: any,
    atankmap: any,
    structurename: string
  ): pointerface {
    let unitownspace = {
        width: 40,
        height: 40,
      },
      bornposition = {
        x: structure.positions.x + 0.5 * structure.size.x,
        y: structure.positions.y + 0.5 * structure.size.y, //从基地开始辐射
      },
      r = 100,
      theta = (2 * Math.PI) / 8;
    //建筑的unitownspace不一样
    //type 的参考值 powerstation soliderfactory wcf oil prismtower
    if (structurename == "powerstation") {
      unitownspace = {
        width: 1261 / 12,
        height: 1059 / 12,
      };
    }

    if (structurename == "soliderfactory") {
      unitownspace = {
        width: 578 / 6,
        height: 1022 / 6,
      };
    }
    if (structurename == "wcf") {
      unitownspace = {
        width: 2020 / 12,
        height: 1660 / 12,
      };
    }
    if (structurename == "oil") {
      unitownspace = {
        width: 1261 / 12,
        height: 1059 / 12,
      };
    }
    if (structurename == "prismtower") {
      unitownspace = {
        width: 48,
        height: 95,
      };
    }
    let f = (r) => {
      let m = r;
      for (let j = 0; j < 8; j++) {
        let startx = this.closeFunc(
            bornposition.x + m * Math.cos(j * theta) + (j == 2 ? -50 : 0)
          ),
          starty = this.closeFunc(bornposition.y + m * Math.sin(j * theta)),
          endx = this.closeFunc(
            bornposition.x + m * Math.cos(j * theta) + unitownspace.width
          ),
          useful = true,
          endy = this.closeFunc(
            bornposition.y + m * Math.sin(j * theta) + unitownspace.height
          );
        for (let u = starty; u <= endy; u++) {
          for (let k = startx; k <= endx; k++) {
            if (
              othermap[u][k] == 33 ||
              othermap[u][k] == 333 ||
              othermap[u][k] == 3 ||
              atankmap[u][k] == 3
            ) {
              useful = false;
            }
          }

          //无障碍，可以设置集结点
        }
        if (useful) {
          return {
            x: bornposition.x + r * Math.cos(j * theta),
            y: bornposition.y + r * Math.sin(j * theta),
          };
        }
      }
    };

    for (let j = 0; j < 100; j++) {
      if (!f(r + j * 41)) {
      } else {
        return f(r + j * 41);
      }
    }
    return null;
  }

  //临近函数 //找出距离自己最近的矩阵点
  closeFunc(point: number): number {
    let k = parseInt((point / 10).toString());
    return k;
  }
  playersSelection() {
    if (this.unittype.indexOf("player") != -1) {
      let canvas2: HTMLCanvasElement = document.getElementById(
        "canvasclick"
      ) as HTMLCanvasElement;
      let context = canvas2.getContext("2d"),
        pages = {
          x: 0,
          y: 0,
        },
        distance = 0,
        leftclick = false,
        oldposition = { x: 0, y: 0 };

      canvas2.onmousedown = function (e) {
        pages = {
          x: e.offsetX,
          y: e.offsetY,
        };
        distance = 0;
        leftclick = true;
      };
      canvas2.onmouseup = function (e) {
        distance = (pages.x - e.offsetX) ** 2 + (pages.y - e.offsetY) ** 2;
        leftclick = false;
        context.clearRect(
          pages.x - 1,
          pages.y - 1,
          oldposition.x + 2,
          oldposition.y + 2
        );
        if (distance != 0) {
          this.eventlist.multiSelection(pages, { x: e.offsetX, y: e.offsetY });
        }
      }.bind(this);
      let timer;
      // 多选框
      canvas2.onmousemove = function (e) {
        if (!timer) {
          timer = setTimeout(() => {
            if (leftclick) {
              let width = ((e.offsetX - pages.x) ** 2) ** 0.5,
                height = ((e.offsetY - pages.y) ** 2) ** 0.5;
              //绘制区域
              // 清除区域
              let clearwidth = 0;
              let clearheight = 0;
              clearwidth = Math.max(oldposition.x, width);
              clearheight = Math.max(oldposition.y, height);
              context.clearRect(pages.x - 1, pages.y - 1, 5000, 5000);
              context.strokeStyle = "white";
              context.strokeRect(pages.x, pages.y, width, height);
              oldposition = {
                x: width,
                y: height,
              };
              context.stroke();
              //绘制区域
            }
            clearTimeout(timer);
            timer = null;
          }, 50);
        }
      };
      canvas2.onclick = function (e) {
        if (distance > 10) {
          return;
        } else {
          this.eventlist.movingjudge(e);
        }
      }.bind(this);
      canvas2.oncontextmenu = function (e) {
        for (let j = 0; j < this.eventlist.tanklist.length; j++) {
          this.eventlist.tanklist[j].selected = false;
          this.eventlist.tanklist[j].multiselect = false;
        }
        return false;
      }.bind(this);
    }
  }
}



// let baseControl1 = new BaseControl(10, '20', { x: 900, y: 600 }, 'base', canvas2, { x: 98.9 * 1.5, y: 58.5 * 1.5+25 });
// let soliderfactory1 = new Soliderfactory(10, '20', { x: 100, y: 0 }, 'soliderfactory', canvas2, { x: 89.6, y: 86.7 });
// let powerstation = new Powerstation(10, '20', { x: 200, y: 300 }, 'powertation', canvas2, { x: 89.6, y: 86.7 });
// let oil = new Oil(10, '20', { x: 400, y: 400 }, 'oil', canvas2, { x: 89.6, y: 86.7 });
// let rightbars = new Rightbars()

//建筑物本身的障碍是否也应该优先于机车？机车
// let newTank3 = new Rhinocerotidaetank({ x: 1000, y: 800 });
// let newTank4 = new Rhinocerotidaetank({ x: 0, y: 200 });
// let newTank5 = new Rhinocerotidaetank({ x: 100, y: 200 });
// let newTank6 = new Rhinocerotidaetank({ x: 200, y: 200 });
// let soider1 = new Liberationarmy({x:1000,y:1000})


    // newTank3.paint(canvas2);
    // newTank4.paint(canvas2);
    // newTank5.paint(canvas2);
    // newTank6.paint(canvas2);
    // soider1.paint(canvas2)