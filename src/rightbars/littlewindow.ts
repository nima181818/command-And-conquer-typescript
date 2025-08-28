const map = require("../assets/map.png");
// import { eventlist } from '../Tankclass/Eventlist';

import { world } from "../World";
//点击区域框均属于clickcanvas
class Littlewindow {
  img: HTMLImageElement;
  clickcanvas: HTMLCanvasElement;
  clickcanvasctx: any;
  canvas4alivethings: HTMLCanvasElement;
  canvas4alivethingsctx: any;
  fromcanvas: HTMLCanvasElement;
  frameposition: { x: number; y: number } = { x: null, y: null };
  oldframeposition: { x: number; y: number } = { x: null, y: null };
  constructor() {
    this.initCanvas();
    this.draw();
  }
  initCanvas() {
    let img = document.getElementById("canvas6") as HTMLImageElement,
      fromcanvas = document.getElementById("canvas1") as HTMLCanvasElement,
      canvas4alivethings = document.getElementById(
        "canvas4"
      ) as HTMLCanvasElement,
      clickcanvas = document.getElementById(
        "click_littlewindow"
      ) as HTMLCanvasElement;
    this.img = img;
    this.fromcanvas = fromcanvas;
    this.canvas4alivethings = canvas4alivethings;
    this.canvas4alivethingsctx = this.canvas4alivethings.getContext("2d");

    this.clickcanvas = clickcanvas;
    this.clickcanvasctx = this.clickcanvas.getContext("2d");

    this.img.src = map.default;
    this.bindEvent();
  }
  bindEvent() {
    this.clickcanvas.onclick = function (e) {
      console.log(e);
      this.changeFramelocation(e, "click");
    }.bind(this);
  }
  //左边界面可能会使用到
  changeFramelocation(
    e: { offsetX: number; offsetY: number },
    controler: string
  ) {
    console.log("change触发");
    if (controler == "click") {
      this.frameposition = {
        x: e.offsetX,
        y: e.offsetY,
      };
      world.changeViewport(
        {
          offsetX: ((this.frameposition.x - 15) / 150) * 3747,
          offsetY: ((this.frameposition.y - 23) / 59) * 821,
        },
        "click"
      );
    }
    if (controler == "scroll") {
      let pagex = (e.offsetX / 3747) * 150 + 15,
        pagey = (e.offsetY / 821) * 59 + 23;
      this.frameposition = {
        x: pagex,
        y: pagey,
      };
    }
  }
  draw() {
    setInterval(() => {
      //TODO--是否需要实时记录框的位置？

      // this.canvas4alivethingsctx.clearRect(this.oldframeposition.x-0.5*30,this.oldframeposition.y-0.5*45,30,45);

      //顶层的click
      this.clickcanvasctx.clearRect(0, 0, 180, 105);
      this.clickcanvasctx.beginPath();
      this.clickcanvasctx.rect(
        this.frameposition.x - 0.5 * 30,
        this.frameposition.y - 0.5 * 45,
        30,
        45
      );
      this.clickcanvasctx.strokeStyle = "rgb(255,253,1)";
      this.clickcanvasctx.stroke();

      this.canvas4alivethingsctx.clearRect(0, 0, 180, 105);
      //   this.canvas4alivethingsctx.beginPath();
      //    this.canvas4alivethingsctx.rect(this.frameposition.x-0.5*30,this.frameposition.y-0.5*45,30,45);
      //    this.canvas4alivethingsctx.strokeStyle="rgb(255,253,1)";
      //    this.canvas4alivethingsctx.stroke();

      this.oldframeposition.x = this.frameposition.x;
      this.oldframeposition.y = this.frameposition.y;

      let alleventlist = world.getEventlist("all", "player1"),
        allstructuresets = world.getStructuresets("all", "any");
      //TODO--这里还要添加建筑的， 还要添加敌方的
      //
      for (let j = 0; j < alleventlist.tanklist.length; j++) {
        let positionx = alleventlist.tanklist[j].currentclickpoints.x / 24,
          positiony =
            (alleventlist.tanklist[j].currentclickpoints.y * 1.875) / 24;
        this.canvas4alivethingsctx.fillStyle = "rgb(135,254,2)";
        this.canvas4alivethingsctx.fillRect(positionx, positiony, 2, 2);
      }
      for (let j in allstructuresets) {
        for (let k = 0; k < allstructuresets[j].length; k++) {
          let structure = allstructuresets[j][k];
          let positionx = structure.positions.x / 24,
            positiony = (structure.positions.y * 1.875) / 24;
          this.canvas4alivethingsctx.fillStyle = "rgb(135,254,2)";
          this.canvas4alivethingsctx.fillRect(
            positionx,
            positiony,
            structure.size.x / 24,
            (structure.size.y * 1.875) / 24
          );
        }
      }
    }, 200);
  }
}
export { Littlewindow };
