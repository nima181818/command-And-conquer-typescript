import { Preloader } from "./utils/preloader";

import { Dashboard } from "./dashboard";
export class App {
  dashboard: Dashboard;
  constructor() {
    //  this.dashboard = new Dashboard()
    //  this.initJsFile();
    let prld: Preloader = new Preloader(this);
    prld.load();
  }
  loadpage() {
    this.dashboard = new Dashboard();
    this.initJsFile();
  }
  initJsFile() {
    let multithread = document.createElement("script");
    multithread.src = "./src/utils/mutithread.js";
    document.body.appendChild(multithread);
    {
      let multithread = document.createElement("script");
      multithread.src = "./src/utils/ROV.js";
      document.body.appendChild(multithread);
    }
  }
}
let app = new App();
window.onload = function () {
  //单位的所属情况，尽量在每一个函数里面判断，不要使用缓存
  let obstacles = [];
  // console.log(world)
  return;
  var back = document.getElementById("back");
  back.style.display = "flex";
  back.style.zIndex = "7";
  // for (let j = 0; j < 4800 * 4; j++) {
  //     let bodys = document.createElement('div');
  //     bodys.style.height = "9px";
  //     bodys.style.width = "9px";
  //     bodys.style.borderBottom = "1px solid rgba(0,0,0,0.5)";
  //     bodys.style.borderRight = "1px solid rgba(0,0,0,0.5)";
  //     bodys.onclick = function () {
  //         let y = parseInt((j / 200).toString());
  //         let x = (j % 200)
  //         obstacles.push({ x: x, y: y });
  //         console.log(j, y, x)
  //         bodys.style.background = 'red'
  //     }
  //     back.appendChild(bodys)
  // }
  let obstaclearray = [];
  for (let j = 0; j < 448 * 140; j++) {
    let div = document.createElement("div");
    div.style.height = "9px";
    div.style.width = "9px";
    div.style.borderRight = "1px solid black";
    div.style.borderBottom = "1px solid black";
    let x = j % 448,
      y = parseInt((j / 448).toString());
    back.appendChild(div);

    div.onclick = function () {
      console.log(x, y);
      div.style.background = "red";
      obstaclearray.push({
        x,
        y,
      });
    }; //注意揭开，开发的时候
    // .bind(this)
  }
  setInterval(() => {
    console.log(obstaclearray);
  }, 3000);
};
