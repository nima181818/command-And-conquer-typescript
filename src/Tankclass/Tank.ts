
interface Position1 {
    x: number
    y: number
}
import { globalAstarmanage as realAstarmanage } from '../utils/wayfinders'
import { Watcher } from '../utils/watcher';
import {world} from '../World'
import { transformimg } from '../assets/imgurltransform';
import { rvosystem } from '../utils/rovpathfindinghelper';
import {tankattacking_audio,soilderdoit_audio,tankmoving_audio,waitingorders_audio,howaboutaction_audio,movingnow_audio,soilderdied_audio} from '../assets/audios/audio'
// import {structuresets} from  '../Structureclass/structureSet'

import {fog} from '../fog'

console.log(rvosystem)
export class Tank {
  static id: number = -1;
  chaostime: number = 0;
  fps: number = 0; //采样每20帧采样一次
  cost: number; //消耗金钱
  alive: boolean = true;
  gathertimeobj: { s: number; e: number } = { s: null, e: null }; //截取时间开始与截取时间结束
  unittype: string;
  classType: string = "tank"; //类型 有tank和建筑
  movingwithattack: boolean = false; //带有攻击性的移动
  enemytarget: any; //攻击目标 该攻击目标由玩家主动点击敌人产生，非自动产生
  recalculatetimer: number; //重新计算路线的settimeout id 在有移动的攻击目标下生效
  recaltimespace: number = 2000; //重新计算的时间间隔 2s
  olderpath: pointerface[] = []; //储存开始寻路计算到当前位置的路线
  _id: number;
  fightanimationcontrol: boolean = false; //攻击时刻的动画，必要时由fire函数来控制
  lastobstaclematrix: pointerface[] = [];
  _name: string;
  bodyposition: boolean = false; //身体的动作  为士兵所特有
  tick: number = 0; //一次士兵身体动作改变的index
  lastpickindex: number = 0; //上一次的方向
  workername: string; //webwork创造id  因为有时需要去掉不必要的worker
  r: number = 20;
  dt: number = 0.08;
  infire: number = null; //正处于攻击状态
  firerate: number; //每500毫秒攻击一次
  harm: number; //伤害
  startmoving: boolean = false;
  obstaclematrix: Position1 = { x: 0, y: 0 };
  avoidforce: Position1 = { x: 0, y: 0 };
  seekforce: Position1 = { x: 0, y: 0 };
  velocity: Position1 = { x: 0, y: 0 };
  mass: number = 2;
  stable: boolean = false;
  MAX_SEE_AHEAD: number = 40;
  MAX_AVOID_FORCE: number = 80;
  MAX_SPEED: number = 80;
  MAX_SEEK_FORCE: number = 180;
  headpositionleft: Position1 = { x: 0, y: 0 };
  headpositionright: Position1 = { x: 0, y: 0 };
  head: Position1 = { x: 0, y: 0 };
  headposition: Position1 = { x: 0, y: 0 };
  collisiondectingbyAstar: boolean = false; //由A*系统检测是否遭遇碰撞
  movingcommander: boolean = false; //运动控制默认为false，true为运动状态
  engineDriver: string = "A*"; //引擎驱动器  默认为A* 还有可能为 rvo
  oldengineDriver: string = "A*"; //上一次的引擎驱动器
  inrvocintrol: boolean = false;
  incollision: boolean = false;
  globalAstarmanage: any = {};
  picimgList: HTMLImageElement[] = [];
  imgList: string[] = [];
  baseimg: HTMLImageElement;
  blood: number;
  maxblood: number;
  firerange: number; //攻击距离 在该范围内可以攻击
  infirearea: boolean = false; //是否在攻击区
  matrixposition: Position1 = { x: 0, y: 0 };
  watcher: Watcher<Tank> = new Watcher<this>();
  autofirecurrency: number = 200;
  bulletmaxmile: number = 173;
  clicktimestamp: number = new Date().getTime();
  lastp: pointerface = { x: null, y: null };
  currentclickpoints: Position1 = { x: null, y: null };
  proxycurrentclickpoints: Position1 = { x: null, y: null }; //保证在不操作 currentclickpoints的情况下处理rvo的回调，以备不时之需
  targetpoint: Position1 = { x: 0, y: 0 }; //目标点
  destinationpoint: Position1 = { x: 0, y: 0 }; //目标点的子集 用以寻路
  startpoint: Position1 = { x: 0, y: 0 }; //开始点
  width: number = 54; //绘制宽度
  height: number = 54; //绘制高度
  obwidth: number; //障碍宽度
  obheight: number; //障碍高度
  currentctx: any = null;
  timer: number;
  position: Position1 = { x: null, y: null };
  selected: boolean = false;
  multiselect: boolean = false;
  tankbullet: any;
  speed: number = 2;
  myendpoint: Position1;
  ownobstacles: Position1[] = [];
  constructor(unittype: string, position: Position1) {
    Tank.id++;
    this.unittype = unittype;
    this._id = Tank.id;
    for (let j in realAstarmanage) {
      if (typeof realAstarmanage[j] == "function") {
        this.globalAstarmanage[j] = realAstarmanage[j];
      } else {
        this.globalAstarmanage[j] = JSON.parse(
          JSON.stringify(realAstarmanage[j])
        );
        //    if(j=='map'){
        //        for(let u=0;u<realAstarmanage.map.length;u++){
        //            for(let k=0;k<realAstarmanage.map[u].length;k++){
        //                 if(realAstarmanage.map[u][k]==33||realAstarmanage.map[u][k]==333){
        //                     this.globalAstarmanage.map[j] = realAstarmanage
        //                 }
        //            }
        //        }
        //    }
      }
    }

    this.autoFire();
    let myeventlist = world.getEventlist("my", this.unittype);
    myeventlist.tanklist.push(this);
    this.watcher = new Watcher();
    this.watcher.register(
      "currentclickpointsTrigger",
      this.currentclickpointsTrigger
    );
    this.watcher.responseMode(this, "currentclickpoints");
    this.watcher.register("targetpointTrigger", this.targetpointTrigger);
    this.watcher.responseMode(this, "targetpoint");

    this.watcher.register("targetpointTrigger", this.targetpointTrigger);
    this.watcher.responseMode(this, "targetpoint");

    this.watcher.register("selectedTrigger", this.selectedTrigger);
    this.watcher.responseMode(this, "selected");

    this.watcher.register("multiselectTrigger", this.multiselectTrigger);
    this.watcher.responseMode(this, "multiselect");

    // this.watcher.register('startmovingTrigger', this.startmovingTrigger);
    // this.watcher.responseMode(this, 'startmoving');

    this.currentclickpoints.x = position.x;
    this.currentclickpoints.y = position.y;
    this.position.x = position.x;
    this.position.y = position.y;
    this.targetpoint.x = this.currentclickpoints.x;
    this.targetpoint.y = this.currentclickpoints.y;
    realAstarmanage.setStartpointandendpoint(
      this.closeFunc(this.currentclickpoints.y),
      this.closeFunc(this.currentclickpoints.x),
      "startpoint"
    );
    this.initStartpointendpoint();

    /*
		
		 */

    //	 this.paintAgain()
    setTimeout(() => {
      let player1 = world.playerManage.find((item) => {
        return item.unittype == this.unittype;
      });
      player1.updateMoney("reduce", this.cost);
    });
  }
  //初始化几个tank集合 other，all，my
  initEventtanklist() {}
  //处理目标点变化
  targetpointTrigger() {
    rvosystem.dynamicUpdategoals(this, "np");
  }
  //动态的改变自己的
  currentclickpointsTrigger() {
    //尝试设置为异步让子先初始化好
    setTimeout(() => {
      if (this.ownobstacles.length) {
        this.realUpdatingownerobstacle(0);
      }
      if (this.unittype == "player1") {
        let width = this.width + 100,
          height = this.height + 100;
        fog.clear(
          this.currentclickpoints.x - width * 0.5,
          this.currentclickpoints.y - height * 0.5,
          width,
          height
        );
      }
      this.ownobstacles = [
        {
          x:
            this.currentclickpoints.x - this.obwidth * 0.5 <= 0
              ? 0
              : this.currentclickpoints.x - this.obwidth * 0.5,
          y:
            this.currentclickpoints.y - this.obheight * 0.5 <= 0
              ? 0
              : this.currentclickpoints.y - this.obheight * 0.5,
        },
        {
          x:
            this.currentclickpoints.x + this.obwidth * 0.5 >= 4480
              ? 4480
              : this.currentclickpoints.x + this.obwidth * 0.5,
          y:
            this.currentclickpoints.y + this.obheight * 0.5 >= 1400
              ? 1400
              : this.currentclickpoints.y + this.obheight * 0.5,
        },
      ];

      this.proxycurrentclickpoints.x =
        this.currentclickpoints.x + Math.random();
      this.proxycurrentclickpoints.y =
        this.currentclickpoints.y + Math.random();
      this.realUpdatingownerobstacle(3);
    });

    //还要做一件事 AI会告诉我他的位置TODO 不是追逐TODO
  }
  //单选改变
  selectedTrigger() {
    if (this.selected) {
      // tankmoving_audio
      if (this._name == "rhinocerotidaetank" || this._name == "skystarttank") {
        waitingorders_audio.playAudio();
      } else if (this._name == "liberationarmy") {
        howaboutaction_audio.playAudio();
      } else if (this._name == "") {
      }
    }
  }
  //多选改变
  multiselectTrigger() {
    if (this.multiselect) {
      if (this._name == "rhinocerotidaetank" || this._name == "skystarttank") {
        waitingorders_audio.playAudio();
      } else if (this._name == "liberationarmy") {
        howaboutaction_audio.playAudio();
      } else if (this._name == "") {
      }
    }
  }

  //去目的地改变 //参数表示是否是从出生位置到集合点
  startmovingTrigger(byborn: boolean = false) {
    if (byborn) {
      return;
    }
    if (this.startmoving) {
      //     this.movingwithattack = false;
      if (this._name == "rhinocerotidaetank" || this._name == "skystarttank") {
        //目标点不是敌人
        if (!this.enemytarget) {
          if (this.unittype != "ai1") {
            tankmoving_audio.playAudio();
          }

          //      this.enemytarget = null
        }
      } else if (this._name == "liberationarmy") {
        if (!this.enemytarget) {
          if (this.unittype != "ai1") {
            movingnow_audio.playAudio();
          }

          //     this.enemytarget = null
        }
      } else if (this._name == "") {
      }
    }
  }
  //
  //实时更新自己本身的障碍点
  realUpdatingownerobstacle(value: number) {
    let ks = parseInt((this.ownobstacles[0].y / 10).toString()),
      us = parseInt((this.ownobstacles[0].x / 10).toString()),
      width = parseInt((this.obwidth / 10).toString()),
      height = parseInt((this.obheight / 10).toString());
    for (let j = 0; j < this.lastobstaclematrix.length; j++) {
      realAstarmanage.fakemap[this.lastobstaclematrix[j].y][
        this.lastobstaclematrix[j].x
      ] = 0;
    }
    this.lastobstaclematrix = [];
    for (let k = ks; k < ks + height; k++) {
      for (let u = us; u < us + width; u++) {
        realAstarmanage.fakemap[k][u] = value;

        this.lastobstaclematrix.push({
          x: us,
          y: ks,
        });
      }
    }
  }
  initStartpointendpoint() {}

  select(canvas: HTMLCanvasElement): void {}
  //单位死亡
  /*
      1,死亡时发出声音 TODO
      2，清理自己在globalMap的障碍
      3，清理自己的drawImage，血量
      4，弹出eventList.tanklist
    */
  destroy() {
    this.alive = false;
    if (this._name == "liberationarmy") {
      soilderdied_audio.playAudio();
    }
    let myeventlist = world.getEventlist("my", this.unittype);
    for (let j = 0; j < this.lastobstaclematrix.length; j++) {
      realAstarmanage.fakemap[this.lastobstaclematrix[j].y][
        this.lastobstaclematrix[j].x
      ] = 0;
    }
    this.currentctx.clearRect(
      this.currentclickpoints.x - this.width * 0.5,
      this.currentclickpoints.y - this.height * 0.5,
      this.width,
      this.height
    );
    //TODO 血量这里可能还有点问题
    this.currentctx.clearRect(
      this.currentclickpoints.x -
        this.velocity.x * this.dt -
        this.obwidth * 0.5 -
        3,
      this.currentclickpoints.y -
        this.velocity.y * this.dt -
        this.obheight * 0.5 -
        11 -
        3,
      this.obwidth + 6,
      7 + 6
    );

    clearInterval(this.timer);
    for (let j = 0; j < myeventlist.tanklist.length; j++) {
      if (this._id == myeventlist.tanklist[j]._id) {
        myeventlist.tanklist.splice(j, 1);
        j--;
      }
    }
  }
  //血量减少
  bloodLess(value) {
    this.blood -= value;
    if (this.blood <= 0) {
      this.blood = 0; //有小于的情况处理为0
      this.destroy();
    }
  }
  //开火
  fire(position: pointerface, targetobject: any) {
    //TODO 共
  }

  //监听敌人 是否在攻击范围内 在的话 TODO--  静态的敌人？？TODO
  // 现目前是将自己这边的（tank）添加为敌人 还要添加建筑
  detectingEnviromentchange() {
    let index = 0,
      distance = 10 ** 9, //够大以防有小于他的
      othereventlist = world.getEventlist("other", this.unittype),
      otherstructuresets = world.playerManage.find((item) => {
        return item.unittype != this.unittype;
      }).structuresets, //注意这里要改进
      mystructuresets = world.playerManage.find((item) => {
        return item.unittype == this.unittype;
      }).structuresets; //自己的建筑，对工程师有效
    //这里处理了 tank
    for (let j = 0; j < othereventlist.tanklist.length; j++) {
      if (
        distance >=
        this.pointDistance(
          othereventlist.tanklist[j].currentclickpoints,
          this.currentclickpoints,
          true
        )
      ) {
        distance = this.pointDistance(
          othereventlist.tanklist[j].currentclickpoints,
          this.currentclickpoints,
          true
        );
        index = j;
      }
    }
    //TODO 还要处理 建筑
    let strindex = 0,
      strname = "",
      strdistance = 10 ** 9;
    if (this._name != "engineer") {
      for (let j in otherstructuresets.unitsList) {
        for (let k = 0; k < otherstructuresets[j].length; k++) {
          let structurecenter = {
            x:
              otherstructuresets[j][k].positions.x +
              otherstructuresets[j][k].size.x * 0.5,
            y:
              otherstructuresets[j][k].positions.y +
              otherstructuresets[j][k].size.y * 0.5,
          };
          if (
            strdistance >=
            this.pointDistance(this.currentclickpoints, structurecenter, true)
          ) {
            strdistance = this.pointDistance(
              this.currentclickpoints,
              structurecenter,
              true
            );
            strname = j;
            strindex = k;
          }
        }
      }
    } else {
      //TODO 工程师的情况
      let temp: any = {};
      for (let m in mystructuresets.unitsList) {
        temp[m] = [...mystructuresets.unitsList[m]];
      }
      for (let n in otherstructuresets.unitsList) {
        temp[n].push(...otherstructuresets.unitsList[n]);
      }
      for (let j in temp) {
        for (let k = 0; k < temp[j].length; k++) {
          let structurecenter = {
            x: temp[j][k].positions.x + temp[j][k].size.x * 0.5,
            y: temp[j][k].positions.y + temp[j][k].size.y * 0.5,
          };
          if (
            strdistance >=
            this.pointDistance(this.currentclickpoints, structurecenter, true)
          ) {
            strdistance = this.pointDistance(
              this.currentclickpoints,
              structurecenter,
              true
            );
            strname = j;
            strindex = k;
          }
        }
      }
    }

    //比较 strdistance和distance的大小,取较小者
    let smaller = strdistance > distance ? "tank" : "structure";
    if (this.enemytarget) {
      if (this.enemytarget.classType == "tank") {
        distance = this.pointDistance(
          this.currentclickpoints,
          this.enemytarget.currentclickpoints,
          true
        );
      } else {
        let center = {
          x: this.enemytarget.positions.x + this.enemytarget.size.x * 0.5,
          y: this.enemytarget.positions.y + this.enemytarget.size.y * 0.5,
        };

        distance = this.pointDistance(this.currentclickpoints, center, true);
      }

      this.runThefire(distance, this.enemytarget, this.enemytarget.classType);
    } else {
      if (smaller == "tank") {
        this.runThefire(distance, othereventlist.tanklist[index], smaller);
      } else {
        try {
          this.runThefire(
            strdistance,
            otherstructuresets.unitsList[strname][strindex],
            smaller
          );
        } catch (e) {
          //	  console.log(e,"侦查发生错误")
        }
      }
    }
  }
  runThefire(distance: number, obj, type) {
    if (distance > this.firerange) {
      // console.time('666')
      clearTimeout(this.infire);
      //console.timeEnd('666')
      this.infire = null;
      //这里表示距离还远不影响什么

      if (this.fightanimationcontrol) {
        this.fightanimationcontrol = false; //交由默认控制
      }
    } else {
      //    console.log('有目标',this.unittype)

      //有目标  TODO 运动状态下是否攻击？ 否?
      if (!this.timer) {
        if (!this.infire) {
          this.infire = window.setTimeout(() => {
            try {
              this.fire(
                type == "tank"
                  ? obj.currentclickpoints
                  : {
                      x: obj.positions.x + obj.size.x * 0.5,
                      y: obj.positions.y + obj.size.y * 0.5,
                    },
                obj
              );
            } catch (e) {
              console.log("index is not defined", e);
            }

            clearTimeout(this.infire);
            this.infire = null;
          }, this.firerate);
        }
      } else {
        //运动状态控制权还是设置为默认
        this.fightanimationcontrol = false; //交由默认控制
        if (this.movingwithattack) {
          //目标为可攻击对象 TODO 这里只处理了敌人为静止的TODO--
          //动的敌人岂不是要每一个tick 执行一次A*？？
          clearInterval(this.timer);
          this.timer = null;
          this.velocity.x = 0;
          this.velocity.y = 0;
          //如果是工程师 进入建筑之后 毁灭
          if (this._name == "engineer") {
            this.engineerOperationsprejudge();
            this.destroy();
          }
        }
      }
    }
  }
  //临近函数 //找出距离自己最近的矩阵点
  closeFunc(point: number): number {
    let k = parseInt((point / 10).toString());
    return k * 10;
  }
  //处理运动中的敌人
  handleMovingenemies() {
    if (!this.harm) {
      return;
    }
    if (this.enemytarget) {
      if (this.enemytarget.timer) {
        if (!this.recalculatetimer) {
          this.recalculatetimer = window.setTimeout(() => {
            this.olderpath = [];
            this.gathertimeobj.s = new Date().getTime();
            console.log("处理中");
            this.operationofTankautomove(
              this.currentclickpoints,
              this.enemytarget.currentclickpoints
            );
            clearTimeout(this.recalculatetimer);
            this.recalculatetimer = null;
          }, this.recaltimespace);
        }
      }
    }
  }
  //坦克自动移动的操作
  operationofTankautomove(tp: pointerface, eps: pointerface) {
    return;
    for (let k = 0; k < this.globalAstarmanage.map.length; k++) {
      for (let u = 0; u < this.globalAstarmanage.map[k].length; u++) {
        //-- 这里处理了地图障碍物，还有建筑障碍物未处理
        if (
          this.globalAstarmanage.map[k][u] != 33 &&
          this.globalAstarmanage.map[k][u] != 333
        ) {
          this.globalAstarmanage.map[k][u] = 0;
        }
      }
    }
    this.globalAstarmanage.setStartpointandendpoint(
      this.closeFunc(tp.y),
      this.closeFunc(tp.x),
      "startpoint"
    );
    this.globalAstarmanage.setStartpointandendpoint(
      this.closeFunc(eps.y),
      this.closeFunc(eps.x),
      "endpoint"
    );
    this.judgeDestinationhasenemy(eps);
    this.obstacleRepailie();
    var MT = new Multithread(4, this.workername); //web worker

    //  console.time('x')
    let handle = MT.process(this.globalAstarmanage.prepareForwebworker, (e) => {
      // console.timeEnd('x')
      this.startmoving = true;
      this.gathertimeobj.e = new Date().getTime();
      this.globalAstarmanage.map = e.map;
      this.globalAstarmanage.lastwaysmatrixlist = e.lastwaysmatrixlist;
      this.workername = null; //置空
      clearInterval(this.timer);
      this.timer = null;
      this.movingfunc(
        "tank",
        this.currentclickpoints,
        this.height,
        this.width,
        this.speed,
        this,
        "byauto"
      );
    });

    let sp = {
        x: this.globalAstarmanage.startPoint.x,
        y: this.globalAstarmanage.startPoint.y,
      },
      ep = {
        x: this.globalAstarmanage.endPoint.x,
        y: this.globalAstarmanage.endPoint.y,
      };

    handle(this.globalAstarmanage.map, sp, ep);
  }
  //工程师对单位造成的后果
  engineerOperationsprejudge() {
    let enemystructuresets = world.playerManage.find((item) => {
        return item.unittype != this.unittype;
      }).structuresets,
      mystructuresets = world.playerManage.find((item) => {
        return item.unittype == this.unittype;
      }).structuresets;
    if (this.enemytarget) {
      if (this.enemytarget.unittype != this.unittype) {
        this.enemytarget.powerCaluc("die"); //对于敌方来说，死亡
        this.enemytarget.unittype = this.unittype; //TODO ?将敌方变成自己的，是否要destroy?
        this.enemytarget.powerCaluc("born"); //对于自己来说，新生
        //更换色彩
        this.enemytarget.occupyByengineer(false, { x: null, y: null });

        //处理电场和油井

        //处理敌方unitList
        for (let m in enemystructuresets.unitsList) {
          for (let n = 0; n < enemystructuresets.unitsList[m].length; n++) {
            if (
              enemystructuresets.unitsList[m][n]._id == this.enemytarget._id
            ) {
              enemystructuresets.unitsList[m].splice(n, 1);
            }
          }
        }
        //处理自己unitList 往unitList中添加

        for (let m in mystructuresets.unitsList) {
          if (m == this.enemytarget.name) {
            mystructuresets.unitsList[m].push(this.enemytarget);
          }
        }
      } else {
        //让建筑满血
        this.enemytarget.blood = this.enemytarget.maxblood;
      }
    }
  }
  //坦克手动移动的操作
  setTankspoints(
    x: number,
    y: number,
    type: string,
    movingcommander: boolean = false,
    byborn: boolean = false
  ) {
    this.startmoving = false;
    if (type == "setstartpoints") {
      let { x, y } = this.currentclickpoints;
      this.startpoint = { x, y };
    }
    if (type == "setendpoints") {
      this.targetpoint.x = x;
      this.targetpoint.y = y;
      this.chaostime = 1;
      clearInterval(this.timer);
      this.timer = null;
      this.startpoint = JSON.parse(JSON.stringify(this.currentclickpoints));
    }
    if (movingcommander) {
      //高耗时操作
      for (let k = 0; k < this.globalAstarmanage.map.length; k++) {
        for (let u = 0; u < this.globalAstarmanage.map[k].length; u++) {
          //-- 这里处理了地图障碍物，还有建筑障碍物未处理
          if (
            this.globalAstarmanage.map[k][u] != 33 &&
            this.globalAstarmanage.map[k][u] != 333
          ) {
            this.globalAstarmanage.map[k][u] = 0;
          }
        }
      }
      this.globalAstarmanage.setStartpointandendpoint(
        this.closeFunc(this.startpoint.y),
        this.closeFunc(this.startpoint.x),
        "startpoint"
      );

      let judgevalue = this.judgeDestinationhasenemy({ x, y }, this._name);
      if (this._name == "engineer") {
        if (judgevalue == "enemy is a tank") {
          return;
        }
      }
      this.obstacleRepailie();
      this.globalAstarmanage.setStartpointandendpoint(
        this.closeFunc(this.targetpoint.y),
        this.closeFunc(this.targetpoint.x),
        "endpoint"
      );

      if (this.workername) {
        window[this.workername].terminate(); //去掉正在运行的worker
      }
      //     this.currentctx.clearRect(this.currentclickpoints.x - this.width*0.5-10, this.currentclickpoints.y -this.height*0.5-10, this.width+20, this.height+20);
      //   this.fightanimationcontrol= false
      //这里判断是否那个地方有敌人 TODO--

      //开始寻路
      this.workername =
        "worker" + parseInt((Math.random() * 10 ** 10).toString());
      var MT = new Multithread(4, this.workername); //web worker

      console.log("寻路开始");
      if (judgevalue == "enemy is a tank") {
        // document.write(JSON.stringify(this.globalAstarmanage.map))
      }
      let handle = MT.process(
        this.globalAstarmanage.prepareForwebworker,
        (e) => {
          console.log("寻路结束");
          this.startmoving = true;
          this.startmovingTrigger(byborn);
          this.globalAstarmanage.map = e.map;
          this.globalAstarmanage.lastwaysmatrixlist = e.lastwaysmatrixlist;
          this.workername = null; //置空
          this.movingfunc(
            "tank",
            this.currentclickpoints,
            this.height,
            this.width,
            this.speed,
            this
          );
        }
      );

      let sp = {
          x: this.globalAstarmanage.startPoint.x,
          y: this.globalAstarmanage.startPoint.y,
        },
        ep = {
          x: this.globalAstarmanage.endPoint.x,
          y: this.globalAstarmanage.endPoint.y,
        };

      handle(this.globalAstarmanage.map, sp, ep);

      /*
               
                 this.globalAstarmanage.FindPoint();
              this.movingfunc('tank', this.currentclickpoints, this.height, this.width, this.speed, this)
               */
    }
  }
  //判断目标点的位置是否被敌人占据 mytype参数貌似没用？TODO
  judgeDestinationhasenemy(p: pointerface, mytype: string = "army"): string {
    this.enemytarget = null;
    this.movingwithattack = false;
    //TODO-- 待优化 如果敌人有多股势力怎么办?
    let player = world.playerManage.find((item) => {
        return item.unittype != this.unittype;
      }),
      myplayer = world.playerManage.find((item) => {
        return item.unittype == this.unittype;
      });
    if (player || myplayer) {
      for (let j = 0; j < player.eventlist.tanklist.length; j++) {
        if (
          this.pointDistance(
            p,
            player.eventlist.tanklist[j].currentclickpoints,
            true
          ) <= player.eventlist.tanklist[j].r
        ) {
          if (this._name == "liberationarmy") {
            if (this.unittype != "ai1") {
              soilderdoit_audio.playAudio();
            }
          }
          if (this._name == "engineer") {
          }
          if (
            this._name == "rhinocerotidaetank" ||
            this._name == "skystarttank"
          ) {
            if (this.unittype != "ai1") {
              tankattacking_audio.playAudio();
            }
          }

          this.movingwithattack = true;
          this.enemytarget = player.eventlist.tanklist[j]; //这里只处理了地方tank，还有建筑未处理TODO--
          this.disguise();
          return "enemy is a tank";
        }
      }
      if (this._name == "engineer") {
        for (let j in myplayer.structuresets.unitsList) {
          for (let k = 0; k < myplayer.structuresets.unitsList[j].length; k++) {
            let currentstructure = myplayer.structuresets.unitsList[j][k],
              centerposition = {
                x: currentstructure.positions.x + 0.5 * currentstructure.size.x,
                y: currentstructure.positions.y + 0.5 * currentstructure.size.y,
              };
            //currentstructure.size.x??
            if (
              this.pointDistance(p, centerposition, true) <=
              currentstructure.size.x
            ) {
              this.movingwithattack = true;
              this.enemytarget = currentstructure; //这里只处理了地方tank，还有建筑未处理TODO--
              this.disguise();
              return "enemy is a my structure";
            }
          }
        }
      }
      for (let j in player.structuresets.unitsList) {
        for (let k = 0; k < player.structuresets.unitsList[j].length; k++) {
          let currentstructure = player.structuresets.unitsList[j][k],
            centerposition = {
              x: currentstructure.positions.x + 0.5 * currentstructure.size.x,
              y: currentstructure.positions.y + 0.5 * currentstructure.size.y,
            };
          //currentstructure.size.x??
          if (
            this.pointDistance(p, centerposition, true) <=
            0.5 * currentstructure.size.x
          ) {
            if (this._name == "liberationarmy") {
              if (this.unittype != "ai1") {
                soilderdoit_audio.playAudio();
              }
            }
            if (this._name == "engineer") {
              //TODO
            }
            if (this._name == "rhinocerotidaetank") {
              if (this.unittype != "ai1") {
                tankattacking_audio.playAudio();
              }
            }

            this.movingwithattack = true;
            this.enemytarget = currentstructure; //这里只处理了地方tank，还有建筑未处理TODO--
            this.disguise();
            return "enemy is a structure";
          }
        }
      }
    }
    return "no enemy";
  }
  //伪装————对间谍有效
  disguise() {}
  //占领_偷盗TODO--

  ///障碍重排
  obstacleRepailie() {
    let mapshows = document.getElementById("mapshows");
    mapshows.onclick = function () {
      mapshows.innerHTML = JSON.stringify(this.globalAstarmanage.map);
    }.bind(this);
    let alleventlist = world.getEventlist("all", this.unittype),
      player = world.playerManage.find((item) => {
        return item.unittype != this.unittype;
      }),
      myplayer = world.playerManage.find((item) => {
        return item.unittype == this.unittype;
      });
    for (let j = 0; j < alleventlist.tanklist.length; j++) {
      //这里应该是虚拟地图对真实地图进行映射,再加一个条件：目标点是敌人的话 那一坨应该不设置为障碍物
      if (this._id !== alleventlist.tanklist[j]._id) {
        //高耗时操作
        for (let k = 0; k < this.globalAstarmanage.map.length; k++) {
          for (let u = 0; u < this.globalAstarmanage.map[k].length; u++) {
            if (
              k * 10 >= alleventlist.tanklist[j].ownobstacles[0].y &&
              k * 10 <= alleventlist.tanklist[j].ownobstacles[1].y &&
              u * 10 >= alleventlist.tanklist[j].ownobstacles[0].x &&
              u * 10 <= alleventlist.tanklist[j].ownobstacles[1].x
            ) {
              //-- 还有建筑物生成的障碍物未处理TODO
              if (
                this.globalAstarmanage.map[k][u] != 33 &&
                this.globalAstarmanage.map[k][u] != 333
              ) {
                this.globalAstarmanage.map[k][u] = 3;
                if (this.enemytarget) {
                  if (alleventlist.tanklist[j]._id == this.enemytarget._id) {
                    this.globalAstarmanage.map[k][u] = 0;
                  }
                }
              }
            }
          }
        }
      }
    }

    //处理建筑
    for (let m in player.structuresets.unitsList) {
      for (let n = 0; n < player.structuresets.unitsList[m].length; n++) {
        let str = player.structuresets.unitsList[m][n];
        if (this.enemytarget) {
          if (str._id == this.enemytarget._id) {
            for (let j = 0; j < str.ownobstacles.length; j++) {
              console.log(str.ownobstacles[j].x, str.ownobstacles[j].y);
              this.globalAstarmanage.map[str.ownobstacles[j].x][
                str.ownobstacles[j].y
              ] = 9;

              console.log(
                this.globalAstarmanage.map[str.ownobstacles[j].x][
                  str.ownobstacles[j].y
                ]
              );
              //	console.log(str.ownobstacles[j].x,str.ownobstacles[j].y)
            }
          }
        }
      }
    }
    //当选中对象为工程师的时候 同时也要将自己的建筑纳入考虑
    if (this._name == "engineer") {
      for (let m in myplayer.structuresets.unitsList) {
        for (let n = 0; n < myplayer.structuresets.unitsList[m].length; n++) {
          let str = myplayer.structuresets.unitsList[m][n];
          if (this.enemytarget) {
            if (str._id == this.enemytarget._id) {
              for (let j = 0; j < str.ownobstacles.length; j++) {
                this.globalAstarmanage.map[str.ownobstacles[j].x][
                  str.ownobstacles[j].y
                ] = 0;
                console.log(str.ownobstacles[j].x, str.ownobstacles[j].y);
              }
            }
          }
        }
      }
    }
    //
  }

  //重绘--不可打扰其他物体的在界面上的显示
  repaint() {}
  //自动攻击
  autoFire() {}
  //初始化图片
  initPicimg() {
    for (let j = 0; j < this.imgList.length; j++) {
      let img: HTMLImageElement = new Image();
      img.src = this.imgList[j];
      img.onload = function () {
        this.picimgList[j] = img;
      }.bind(this);

      document.body.appendChild(img);
    }
  }
  //抽象层地图，用以表征地图的所有为障碍物的地方
  abstractMap() {}

  //停止移动
  stopCommand() {
    clearInterval(this.timer);
    this.timer = null;
  }
  //通知RVO系统进行寻路?
  notifyRVOsystem() {
    //设置开始点
    rvosystem.dynamicUpdategoals(this, "sp");
    //  rvosystem.rvostart(this);
  }

  //路径规划 --A*驱动
  /*
    comefrom：
      byhand:手动
      byauto:自动
    */
  movingfunc(
    type: string,
    position: Position1,
    height: number,
    width: number,
    speed: number,
    that: any,
    comefrom: string = "byhand"
  ) {
    window.clearInterval(this.timer);
    this.timer = null;
    //     this.olderpath = [];
    //最新的路径规划方案
    let positionarrays = [],
      currentindex = 0;

    //设置开始速度
    // this.velocity.x = 0;
    // this.velocity.y = 50;
    for (
      let j = 0;
      j + 1 < this.globalAstarmanage.lastwaysmatrixlist.length;
      j++
    ) {
      let obj = {
        x: this.globalAstarmanage.lastwaysmatrixlist[j].y,
        y: this.globalAstarmanage.lastwaysmatrixlist[j].x,
      };
      positionarrays.unshift(obj);
    }
    positionarrays = [...this.olderpath, ...positionarrays];
    if (positionarrays.length == 0) {
      return;
    }
    let calltime = 0;
    that.timer = window.setInterval(() => {
      that.fps++;
      calltime++;
      //	  console.log(calltime)
      //p为当前点，a为寻路算法当前点，b为寻路算法下一点
      let PA = {
        x: positionarrays[currentindex].x * 10 - this.currentclickpoints.x,
        y: positionarrays[currentindex].y * 10 - this.currentclickpoints.y,
      };
      let AB;
      try {
        AB = {
          x:
            positionarrays[currentindex + 1].x * 10 -
            positionarrays[currentindex].x * 10,
          y:
            positionarrays[currentindex + 1].y * 10 -
            positionarrays[currentindex].y * 10,
        };
        if (PA.x * AB.x + PA.y * AB.y < 0) {
          //已经越过当前寻路点
          currentindex++;
        }
      } catch (e) {
        AB = {
          x:
            positionarrays[currentindex].x * 10 -
            positionarrays[currentindex - 1].x * 10,
          y:
            positionarrays[currentindex].y * 10 -
            positionarrays[currentindex - 1].y * 10,
        };
      }
      //收集A'-->A"的线路
      let currenttime = new Date().getTime();
      if (
        this.gathertimeobj.s <= currenttime &&
        currenttime <= this.gathertimeobj.e &&
        comefrom == "byhand"
      ) {
        this.olderpath.push();
      }

      try {
        this.destinationpoint = {
          x: positionarrays[currentindex + 1].x * 10,
          y: positionarrays[currentindex + 1].y * 10,
        };
      } catch (e) {
        console.log(e, "出错");
        this.destinationpoint = {
          x: positionarrays[currentindex].x * 10,
          y: positionarrays[currentindex].y * 10,
        };
      }
      // this.destinationpoint = {
      //     x: positionarrays[currentindex + 1].x * 10,
      //     y: positionarrays[currentindex + 1].y * 10
      // }
      let temp = {
        x: this.velocity.x * this.dt,
        y: this.velocity.y * this.dt,
      };

      if (currentindex >= positionarrays.length - 2) {
        this.startpoint.x = position.x;
        this.startpoint.y = position.y;
        window.clearInterval(that.timer);
        that.timer = null;
        this.velocity = {
          x: 0,
          y: 0,
        };
        this.globalAstarmanage.setStartpointandendpoint(
          this.closeFunc(this.startpoint.y),
          this.closeFunc(this.startpoint.x),
          "startpoint"
        );
        this.movingcommander = false;
      }
      this.updating();
      this.updatingcalculateobstaclematrix();

      this.updatingVelocity();

      this.updatingDisplacement();
      this.handleDestinations();
    }, 16.6);
  }
  //实时更新--head,head position
  updating() {
    //	 console.log(this.id,this.velocity.x,this.velocity.y)
    let cosv = this.velocity.x / this.squalCaculator(this.velocity, true),
      sinv = this.velocity.y / this.squalCaculator(this.velocity, true);

    this.head = {
      x: cosv * this.MAX_SEE_AHEAD ? cosv * this.MAX_SEE_AHEAD : 0,
      y: sinv * this.MAX_SEE_AHEAD ? sinv * this.MAX_SEE_AHEAD : 0,
    };
    const cos = this.head.x / (this.head.x ** 2 + this.head.y ** 2) ** 0.5;
    const sin = this.head.y / (this.head.x ** 2 + this.head.y ** 2) ** 0.5;
    this.headposition = {
      x: this.currentclickpoints.x + this.head.x,
      y: this.currentclickpoints.y + this.head.y,
    };
    this.headpositionleft = {
      x: this.headposition.x - this.r * (sin ? sin : 0),
      y: this.headposition.y + this.r * (cos ? cos : 0),
    };
    this.headpositionright = {
      x: this.headposition.x + this.r * (sin ? sin : 0),
      y: this.headposition.y - this.r * (cos ? cos : 0),
    };
  }
  //updating--计算障碍中心到head的向量--障碍物产生的力obstacle avoidance
  updatingcalculateobstaclematrix() {
    let obstacle = this.findMostcloseobstacle();
    //	console.log(obstacle)
    // if(!obstacle){
    //     return;
    // }
    this.calculateObstacleavoidance(obstacle);

    this.calculateSeekforce();
    let cosobstaclematrix =
        this.obstaclematrix.x / this.squalCaculator(this.obstaclematrix, true),
      sinobstaclematriy =
        this.obstaclematrix.y / this.squalCaculator(this.obstaclematrix, true);
    this.avoidforce = {
      x: this.obstaclematrix.x,
      y: this.obstaclematrix.y,
    };
    if (this.squalCaculator(this.obstaclematrix, true) > this.MAX_AVOID_FORCE) {
      this.avoidforce = {
        x:
          cosobstaclematrix * this.MAX_AVOID_FORCE
            ? cosobstaclematrix * this.MAX_AVOID_FORCE
            : 0,
        y:
          sinobstaclematriy * this.MAX_AVOID_FORCE
            ? sinobstaclematriy * this.MAX_AVOID_FORCE
            : 0,
      };
    }

    if (
      this.calculateDistance(obstacle, false) > obstacle.r &&
      (obstacle.currentclickpoints.x - this.currentclickpoints.x) ** 2 +
        (obstacle.currentclickpoints.y - this.currentclickpoints.y) ** 2 >=
        (this.r + obstacle.r) ** 2
    ) {
      this.avoidforce = {
        x: 0,
        y: 0,
      };
    } else {
    }

    //	 console.log(this.avoidforce.x,this.avoidforce.y)
  }
  //距离公式
  distanceFormlation(p1: any, p2: Position1, kf: boolean = false) {
    let value = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    return kf ? value ** 0.5 : value;
  }
  //重绘--自身的图片形状  类型：初始化阶段需要调用一次
  paintAgain() {
    // this.currentclickpoints.x += this.velocity.x * this.dt;
    // this.currentclickpoints.y += this.velocity.y * this.dt;
    if (this.fightanimationcontrol) {
      //动画控制权交由fire函数控制  //具有特异性。对兵种成立，对坦克不成立
      return;
    }
    if (!this.timer) {
      if (this._name != "rhinocerotidaetank" && this._name != "skystarttank") {
        this.currentctx.clearRect(
          this.currentclickpoints.x -
            this.velocity.x * this.dt -
            this.width * 0.5 -
            2,
          this.currentclickpoints.y -
            this.velocity.y * this.dt -
            this.height * 0.5 -
            2,
          this.width + 3,
          this.height + 3
        );
        this.currentctx.drawImage(
          this.picimgList[0],
          this.currentclickpoints.x - this.width * 0.5,
          this.currentclickpoints.y - this.height * 0.5,
          this.width,
          this.height
        );
        return;
      }
    }
    let picindex = 0,
      velocitylength = this.squalCaculator(this.velocity, true),
      v = {
        x:
          this.velocity.x / velocitylength
            ? this.velocity.x / velocitylength
            : 0,
        y:
          this.velocity.y / velocitylength
            ? this.velocity.y / velocitylength
            : 0,
      },
      part = 0.7071,
      imglist = [
        { x: 0, y: -1 },
        {
          x: part,
          y: -part,
        },
        {
          x: 1,
          y: 0,
        },
        {
          x: part,
          y: part,
        },
        {
          x: 0,
          y: 1,
        },
        {
          x: -part,
          y: part,
        },
        {
          x: -1,
          y: 0,
        },
        {
          x: -part,
          y: -part,
        },
      ],
      mini = null;
    for (let j = 0; j < imglist.length; j++) {
      let value = this.distanceFormlation(imglist[j], v, true);

      if (j == 0) {
        mini = value;
      }

      if (value <= mini) {
        mini = value;
        picindex = j;
      }
    }

    if (!this.bodyposition) {
      this.currentctx.clearRect(
        this.currentclickpoints.x -
          this.velocity.x * this.dt -
          this.width * 0.5 -
          2,
        this.currentclickpoints.y -
          this.velocity.y * this.dt -
          this.height * 0.5 -
          2,
        this.width + 3,
        this.height + 3
      );
      this.currentctx.drawImage(
        this.picimgList[picindex],
        this.currentclickpoints.x - this.width * 0.5,
        this.currentclickpoints.y - this.height * 0.5,
        this.width,
        this.height
      );
    } else {
      this.bodypositionChangehandler(picindex);
    }
    this.lastpickindex = picindex;
  }
  //身体位置的变化 picindex:方向
  bodypositionChangehandler(picindex: number) {
    if (picindex != this.lastpickindex) {
      //方向发生突变，
      this.tick = 0;
    } else {
      this.tick += 0.26;

      if (this.tick >= 5) {
        this.tick = 0;
      }
    }

    if (
      this.squalCaculator(this.velocity, true) < 1 &&
      this.pointDistance(this.destinationpoint, this.currentclickpoints, true) <
        30
    ) {
      this.currentctx.drawImage(
        this.picimgList[0],
        this.currentclickpoints.x - this.width * 0.5,
        this.currentclickpoints.y - this.height * 0.5,
        this.width,
        this.height
      );
    } else {
      this.currentctx.clearRect(
        this.currentclickpoints.x -
          this.velocity.x * this.dt -
          this.width * 0.5 -
          2,
        this.currentclickpoints.y -
          this.velocity.y * this.dt -
          this.height * 0.5 -
          2,
        this.width + 3,
        this.height + 3
      );
      this.currentctx.drawImage(
        this.picimgList[picindex * 5 + parseInt(this.tick.toString())],
        this.currentclickpoints.x - this.width * 0.5,
        this.currentclickpoints.y - this.height * 0.5,
        this.width,
        this.height
      );
    }
  }
  //////////////////////steering behavior↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  //计算最近的距离
  calculateDistance(obstacle: any, usemiddle: boolean = false) {
    if (!usemiddle) {
      let left =
          ((this.headpositionleft.x - obstacle.currentclickpoints.x) ** 2 +
            (this.headpositionleft.y - obstacle.currentclickpoints.y) ** 2) **
          0.5,
        right =
          ((this.headpositionright.x - obstacle.currentclickpoints.x) ** 2 +
            (this.headpositionright.y - obstacle.currentclickpoints.y) ** 2) **
          0.5;

      return left <= right ? left : right;
    } else {
      return (
        ((this.headposition.x - obstacle.currentclickpoints.x) ** 2 +
          (this.headposition.y - obstacle.currentclickpoints.y) ** 2) **
        0.5
      );
    }
  }
  ////计算最近的障碍物
  findMostcloseobstacle() {
    let tempobstaclearray = [],
      alleventlist = world.getEventlist("all", this.unittype);

    // return
    for (let j = 0; j < alleventlist.tanklist.length; j++) {
      if (alleventlist.tanklist[j]._id != this._id) {
        tempobstaclearray.push(alleventlist.tanklist[j]);
      }
    }
    let obstacle = tempobstaclearray[0];

    for (let j = 0; j < tempobstaclearray.length; j++) {
      if (tempobstaclearray[j]._id != this._id) {
        if (tempobstaclearray[j + 1]) {
          if (
            this.calculateDistance(tempobstaclearray[j + 1], true) <
            this.calculateDistance(obstacle)
          ) {
            obstacle = tempobstaclearray[j + 1];
          }
        }
      }
    }
    if (!obstacle) {
      return this;
    }
    return obstacle;
  }
  //handle multi-entitys have the same destination
  handleDestinations() {
    if (this.multiselect) {
      // console.log(this.pointDistance(this.currentclickpoints, this.targetpoint,true),this.r,"呵呵呵")
      //当前位置已抵达终点

      if (
        this.pointDistance(this.currentclickpoints, this.targetpoint, true) >
          this.r * 1 - 50 &&
        this.pointDistance(this.currentclickpoints, this.targetpoint, true) <
          this.r * 1 + 50
      ) {
        this.stable = true;
        let obstacle = this.minDistancefromcenter();
        if (obstacle) {
          if (
            this.pointDistance(
              obstacle.currentclickpoints,
              this.currentclickpoints
            ) <
              (this.r + obstacle.r) ** 2 + 100 &&
            this.pointDistance(
              obstacle.currentclickpoints,
              this.currentclickpoints
            ) >
              (this.r + obstacle.r) ** 2 - 100
          ) {
            //

            obstacle.destinationpoint.x = obstacle.currentclickpoints.x;
            obstacle.destinationpoint.y = obstacle.currentclickpoints.y;
            clearInterval(obstacle.timer);
            obstacle.timer = null;
            obstacle.stable = true;
            // this.timer = null;
          }
        }
      } else {
        //当前位置未到达终点TODO--  有点问题
        let obstacle = this.minDistancefromcenter();
        //    console.log('调整中');
        if (obstacle) {
          if (
            this.pointDistance(
              obstacle.currentclickpoints,
              this.currentclickpoints
            ) <
              (this.r + obstacle.r) ** 2 + 100 &&
            this.pointDistance(
              obstacle.currentclickpoints,
              this.currentclickpoints
            ) >
              (this.r + obstacle.r) ** 2 - 100 &&
            obstacle.stable
          ) {
            //
            console.log("调整成功");

            this.destinationpoint.x = this.currentclickpoints.x;
            this.destinationpoint.y = this.currentclickpoints.y;
            clearInterval(this.timer);
            this.timer = null;
            this.stable = true;
          }
        }
      }
    }
    // else{
    //凌乱模式检测
    if (this._id == 8) {
      //  debugger
    }
    if (
      this.timer &&
      this.pointDistance(this.lastp, this.currentclickpoints, true) <= 10
    ) {
      this.chaostime++;
    } else {
      this.chaostime = 1;
    }

    if (this.fps % 20 == 0) {
      this.lastp.x = this.currentclickpoints.x;
      this.lastp.y = this.currentclickpoints.y;
    }
    if (this.chaostime > 40) {
      clearInterval(this.timer);
      this.timer = null;
      this.chaostime = 1;
    }
    return;
    let alleventlist = world.getEventlist("all", this.unittype).tanklist,
      sametargets = [];

    for (let j = 0; j < alleventlist.length; j++) {
      if (
        this._id != alleventlist._id &&
        this.pointDistance(
          this.targetpoint,
          alleventlist[j].targetpoint,
          true
        ) <= 10
      ) {
        //即说明 有相同的目标；
        if (
          this.pointDistance(
            this.targetpoint,
            alleventlist[j].currentclickpoints,
            true
          ) <= this.firerange
        ) {
          //已经抵达周围，当前单位已经被其他单位挡住了路线
          //从目标点开始搜寻最近的点作为新的目标点 代价有点大？非地图层面

          sametargets.push(alleventlist[j]);
        }
      }
    }
    //上面为找到已经达到目标点附近的点
    for (let j = 0; j < sametargets.length; j++) {
      let r1 =
          (sametargets[j].obheight ** 2 + sametargets[j].obwidth ** 2) ** 0.5,
        r2 = (this.obheight ** 2 + this.obwidth ** 2) ** 0.5;
      if (
        this.pointDistance(
          sametargets[j].currentclickpoints,
          this.currentclickpoints,
          true
        ) <=
        r1 + r2
      ) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
  //计算两个机车圆心的距离
  minDistancefromcenter() {
    let temp = [],
      alleventlist = world.getEventlist("all", this.unittype);
    for (let j = 0; j < alleventlist.tanklist.length; j++) {
      if (
        alleventlist.tanklist[j].multiselect &&
        this._id != alleventlist.tanklist[j]._id
      ) {
        temp.push(alleventlist.tanklist[j]);
      }
    }
    let obstacle = temp[0];
    for (let j = 0; j < temp.length; j++) {
      if (
        this.pointDistance(
          this.currentclickpoints,
          temp[j].currentclickpoints
        ) <=
        this.pointDistance(this.currentclickpoints, obstacle.currentclickpoints)
      ) {
        obstacle = temp[j];
      }
    }
    return obstacle;
  }
  //distance function 计算两点之间的距离
  pointDistance(obj1: Position1, obj2: Position1, kf = false): number {
    let distance = (obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2;
    return kf ? distance ** 0.5 : distance;
  }
  //计算-seek
  calculateSeekforce() {
    let destination = {
      x: this.destinationpoint.x - this.currentclickpoints.x,
      y: this.destinationpoint.y - this.currentclickpoints.y,
    };

    let cons = destination.x / (destination.x ** 2 + destination.y ** 2) ** 0.5;
    let sins = destination.y / (destination.x ** 2 + destination.y ** 2) ** 0.5;
    let currentspendlength = (destination.x ** 2 + destination.y ** 2) ** 0.5;

    //这是期望的最大速度
    let destinationvelocity = {
      x: cons * this.MAX_SPEED ? cons * this.MAX_SPEED : 0,
      y: sins * this.MAX_SPEED ? sins * this.MAX_SPEED : 0,
    };

    //假设朝向终点的seekforce与物体到终点的长度成正比?
    this.seekforce = {
      x: destinationvelocity.x - this.velocity.x,
      y: destinationvelocity.y - this.velocity.y,
      //TODO--控制力太小了？？x10
    };
    //上述假设不成立  假设牵引力大小始终为恒定值？
    //    this.seekforce = {
    //        x:this.MAX_SEEK_FORCE*(this.seekforce.x/(this.squalCaculator(this.seekforce,true))),
    //        y:this.MAX_SEEK_FORCE*(this.seekforce.y/(this.squalCaculator(this.seekforce,true)))
    //    }
    if (this._id == 2) {
      // console.log(this.seekforce.x, this.seekforce.y)
    }
  }

  //Square conversion  计算长度本身上
  squalCaculator(obj: Position1, needgh: boolean = false) {
    let value = obj.x ** 2 + obj.y ** 2;
    return needgh ? value ** 0.5 : value;
  }
  //位置检测函数 如果两者的距离小于了两者圆心的距离则迅速让其分离
  positionTestfunc() {
    let obstacle = this.findMostcloseobstacle();
    let speedlength = this.squalCaculator(this.velocity, true);
    if (
      (obstacle.currentclickpoints.x - this.currentclickpoints.x) ** 2 +
        (obstacle.currentclickpoints.y - this.currentclickpoints.y) ** 2 +
        speedlength * this.dt * 2 <
      (this.r + obstacle.r) ** 2
    ) {
      let this2obstacle = {
        x: obstacle.currentclickpoints.x - this.currentclickpoints.x,
        y: obstacle.currentclickpoints.y - this.currentclickpoints.y,
      };
      let ethis2obstacle = {
        x:
          this2obstacle.x / this.squalCaculator(this2obstacle, true)
            ? this2obstacle.x / this.squalCaculator(this2obstacle, true)
            : 0,
        y:
          this2obstacle.y / this.squalCaculator(this2obstacle, true)
            ? this2obstacle.y / this.squalCaculator(this2obstacle, true)
            : 0,
      };
      let cose =
        (this.velocity.x * this2obstacle.x +
          this.velocity.y * this2obstacle.y) /
        (this.squalCaculator(this.velocity, true) *
          this.squalCaculator(this2obstacle, true));
      if (cose < 0) {
        return;
      } else {
        let velocitylength = this.squalCaculator(this.velocity, true);
        let striktlength = velocitylength * (cose ? cose : 0);
        let velocitylengthmatrix = {
          x: ethis2obstacle.x * striktlength,
          y: ethis2obstacle.y * striktlength,
        };
        this.velocity = {
          x: this.velocity.x - velocitylengthmatrix.x,
          y: this.velocity.y - velocitylengthmatrix.y,
        };
        // this.seekforce = {
        //     x:this.seekforce.x - 10*velocitylengthmatrix.x,
        //     y:this.seekforce.y - 10*velocitylengthmatrix.y,
        // }
      }
      // let overlapdistance = ((((obstacle.currentclickpoints.x - this.currentclickpoints.x) ** 2 + (obstacle.currentclickpoints.y - this.currentclickpoints.y) ** 2) ** 0.5 - (this.r + obstacle.r)) ** 2) ** 0.5,
      // overlapobj = {
      //     x: this.currentclickpoints.x - obstacle.currentclickpoints.x,
      //     y: this.currentclickpoints.y - obstacle.currentclickpoints.y
      // },

      // cos = overlapobj.x / ((overlapobj.x) ** 2 + (overlapobj.y) ** 2) ** 0.5,
      // sin = overlapobj.y / ((overlapobj.x) ** 2 + (overlapobj.y) ** 2) ** 0.5;
      // this.currentclickpoints.x = this.currentclickpoints.x + (overlapdistance) * cos
      //     this.currentclickpoints.y = this.currentclickpoints.y + (overlapdistance) * sin
    }
  }
  //实时更新速度
  updatingVelocity() {
    // let obstacle = this.findMostcloseobstacle();
    //  if(!obstacle){
    //       return;
    //  }
    let acceleration = {
      x:
        (this.seekforce.x + this.avoidforce.x) / this.mass
          ? (this.seekforce.x + this.avoidforce.x) / this.mass
          : 0,
      y:
        (this.seekforce.y + this.avoidforce.y) / this.mass
          ? (this.seekforce.y + this.avoidforce.y) / this.mass
          : 0,
    };

    // let directionofmiles = {
    //     x: obstacle.currentclickpoints.x - this.currentclickpoints.x,
    //     y: obstacle.currentclickpoints.y - this.currentclickpoints.y
    // }
    let xvelocity =
        acceleration.x / (acceleration.x ** 2 + acceleration.y ** 2) ** 0.5,
      yvelocity =
        acceleration.y / (acceleration.x ** 2 + acceleration.y ** 2) ** 0.5;

    this.velocity = {
      //  x: velocityall * xvelocity + id * 2,
      x: this.velocity.x + (acceleration.x ? acceleration.x : 0) * this.dt,
      y: this.velocity.y + (acceleration.y ? acceleration.y : 0) * this.dt,
      //y: velocityall * yvelocity + id * 2
    };
    let all = (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
    if (this.squalCaculator(this.avoidforce, true) < 0.0001) {
      //方向为seekforce的方向
      // let cosseek = this.seekforce.x/this.squalCaculator(this.seekforce,true),
      //     sinseek = this.seekforce.y/this.squalCaculator(this.seekforce,true);
      //     this.velocity = {
      //         x:(cosseek?cosseek:0)*this.MAX_SPEED,
      //         y:(sinseek?sinseek:0)*this.MAX_SPEED
      //  }
    }
    if (all > this.MAX_SPEED) {
      let cosa =
        this.velocity.x / (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
      let sina =
        this.velocity.y / (this.velocity.x ** 2 + this.velocity.y ** 2) ** 0.5;
      this.velocity = {
        x: this.MAX_SPEED * (cosa ? cosa : 0),
        y: this.MAX_SPEED * (sina ? sina : 0),
      };
    }

    //	  clearInterval(this.movingtimer)
    this.positionTestfunc();
    // this.motivateForce();

    //	 console.log(this.velocity)
  }

  //计算-obstacle avoidance
  calculateObstacleavoidance(obstacle: any) {
    this.obstaclematrix = {
      x: this.headposition.x - obstacle.currentclickpoints.x,
      y: this.headposition.y - obstacle.currentclickpoints.y,
    };
  }
  //实时更新位移
  updatingDisplacement() {
    //如果快到边边了 返回去
    // if (this.currentclickpoints.x > 700 || this.currentclickpoints.y > 700 || this.currentclickpoints.x < 0 || this.currentclickpoints.y < 0) {
    //     this.velocity = {

    //         x: -this.velocity.x,
    //         y: -this.velocity.y
    //     }

    // }
    if (
      (this.currentclickpoints.x - this.targetpoint.x) ** 2 +
        (this.currentclickpoints.y - this.targetpoint.y) ** 2 <
      1
    ) {
      this.handleEntityisinstable(true);
    } else {
      this.handleEntityisinstable(false);
    }
    let ds = {
      x: this.velocity.x * this.dt,
      y: this.velocity.y * this.dt,
    };
    this.currentclickpoints.x += ds.x;
    this.currentclickpoints.y += ds.y;
  }
  //处理物体是否处于稳定状态
  handleEntityisinstable(state: boolean) {
    // this.stable = state;
    // if(this.stable){
    //     this.velocity = {
    //         x:0,
    //         y:0
    //       }
    // }
  }
  //////////////////////steering behavior↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  //选中时显示血量
  showBloodlength(
    x: number = this.currentclickpoints.x,
    y: number = this.currentclickpoints.y
  ) {
    //console.time()

    let ablood = this.obwidth / this.maxblood;
    this.currentctx.clearRect(
      this.currentclickpoints.x -
        2 * this.velocity.x * this.dt -
        this.obwidth * 0.5 -
        3,
      this.currentclickpoints.y -
        2 * this.velocity.y * this.dt -
        this.obheight * 0.5 -
        11 -
        3,
      this.obwidth + (1 / 5) * ablood + 6,
      7 + 6
    );
    if (!(this.selected || this.multiselect)) {
      return;
    }
    if (this.selected || this.multiselect) {
      this.currentctx.fillStyle = "white";
      this.currentctx.fillRect(
        this.currentclickpoints.x - this.obwidth * 0.5,
        this.currentclickpoints.y - this.obheight * 0.5 - 11,
        this.obwidth + (1 / 5) * ablood,
        7
      );

      for (let j = 0; j < this.maxblood; j++) {
        this.currentctx.fillStyle = "white";
        this.currentctx.fillRect(
          j * ablood + this.currentclickpoints.x - this.obwidth * 0.5,
          this.currentclickpoints.y - this.obheight * 0.5 - 10,
          ablood * (1 / 5),
          5
        );

        this.currentctx.fillStyle = "rgb(16,201,19)";
        if (this.blood <= 0.5 * this.maxblood) {
          //TODO-- 注意血量低于1/2 显示红色
          this.currentctx.fillStyle = "red";
        }

        this.currentctx.fillRect(
          j * ablood +
            this.currentclickpoints.x -
            this.obwidth * 0.5 +
            (1 / 5) * ablood,
          this.currentclickpoints.y - this.obheight * 0.5 - 10,
          (4 / 5) * ablood,
          5
        );

        if (j > this.blood) {
          this.currentctx.fillStyle = "gray";
          this.currentctx.fillRect(
            j * ablood + this.currentclickpoints.x - this.obwidth * 0.5,
            this.currentclickpoints.y - this.obheight * 0.5 - 10,
            (4 / 5) * ablood,
            5
          );

          this.currentctx.fillStyle = "black";
          this.currentctx.fillRect(
            j * ablood +
              this.currentclickpoints.x -
              this.obwidth * 0.5 +
              (1 / 5) * ablood,
            this.currentclickpoints.y - this.obheight * 0.5 - 10,
            (4 / 5) * ablood,
            5
          );
        }
      }

      // this.currentctx.fillStyle = "green";
      // this.currentctx.clearRect(x - 10, y - 10 - 5, 50 + 2, 10 + 2);
      // this.currentctx.fillRect(this.currentclickpoints.x - 10, this.currentclickpoints.y - 10 - 5, 50, 10)
    }
    //    console.timeEnd()
  }
  paint(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");

    this.currentctx = ctx;

    if (!this.imgList[0]) {
      return;
    }
    let img = transformimg(this.imgList[0]);
    this.baseimg = img;
    // ctx.beginPath();
    // ctx.fillStyle = "black";
    let that = this;

    this.baseimg.onload = function () {
      that.currentctx.drawImage(
        this.baseimg,
        this.currentclickpoints.x - this.width * 0.5,
        this.currentclickpoints.y - this.height * 0.5,
        this.width,
        this.height
      );
    }.bind(that);
    this.position = {
      x: 10,
      y: 10,
    };
    //  this.loopMethods();
    // this.select(canvas)
  }
  loopMethods() {
    this.paintAgain();
    //只对有攻击力的单位有效
    //  if(this.harm){
    this.detectingEnviromentchange();
    this.handleMovingenemies();
    //       }
  }
}
