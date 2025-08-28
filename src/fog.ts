// class Fog {
//   fogcanvas: HTMLCanvasElement;
//   context: any;
//   context2: any;
//   time: any;
//   fog_littlewindow: HTMLCanvasElement;
//   fog_littlewindowctx: any;
//   fogcanvas2: HTMLCanvasElement;
//   constructor() {
//     this.initCanvas();
//   }
//   initCanvas() {
//     this.fogcanvas = document.getElementById("canvas3") as HTMLCanvasElement;
//     this.fogcanvas2 = document.getElementById("canvas8") as HTMLCanvasElement;
//     this.context = this.fogcanvas.getContext("2d");
//     this.context2 = this.fogcanvas2.getContext("2d");
//     this.fog_littlewindow = document.getElementById(
//       "fog_littlewindow"
//     ) as HTMLCanvasElement;
//     this.fog_littlewindowctx = this.fog_littlewindow.getContext("2d");
//     this.context.fillRect(0, 0, 4480, 1400);
//     this.context2.fillRect(0, 0, 4480, 1400);
//     this.fog_littlewindowctx.fillRect(0, 0, 180, 105.8);
//     this.clear(782, 442, 1123 - 782, 835 - 442);
//   }
//   clear(x: number, y: number, width: number, height: number) {
//     let center = {
//       x: x + width / 2,
//       y: y + height / 2,
//     };
//     this.context.clearRect(x, y, width, height);
//     this.paint(center, width);
//     this.fog_littlewindowctx.clearRect(
//       x / 24,
//       (y * 1.875) / 24,
//       width / 24,
//       (height * 1.875) / 24
//     );
//   }
//   paint(center: any, width: number) {
//     if (!this.time) {
//       this.time = setTimeout(() => {
//         let radialGradient1 = this.context.createRadialGradient(
//           center.x,
//           center.y,
//           width - 40 > 0 ? width - 40 : 1,
//           center.x,
//           center.y,
//           width
//         );
//         radialGradient1.addColorStop(0, "white");
//         radialGradient1.addColorStop(0.4, "rgba(0,0,0,0.5)");
//         radialGradient1.addColorStop(1, "transparent");
//         this.context.globalCompositeOperation = "destination-out";
//         this.context.beginPath();
//         this.context.fillStyle = radialGradient1;
//         this.context.arc(center.x, center.y, width, 0, Math.PI * 2, true);
//         this.context.fill();
//         this.paint2(center, width);
//         // this.context.restore();
//         clearTimeout(this.time);
//         this.time = null;
//       }, 16.6);
//     }
//   }
//   paint2(center: any, width: number) {
//     // return;
//     let radialGradient1 = this.context2.createRadialGradient(
//       center.x,
//       center.y,
//       width / 4,
//       center.x,
//       center.y,
//       width
//     );
//     radialGradient1.addColorStop(0, "white");
//     radialGradient1.addColorStop(0.8, "rgba(0,0,0,0.1)");
//     radialGradient1.addColorStop(1, "rgba(0,0,0,0.01)");
//     this.context2.globalCompositeOperation = "destination-out";
//     this.context.beginPath();
//     this.context2.fillStyle = radialGradient1;
//     this.context2.arc(center.x, center.y, width, 0, Math.PI * 2, true);
//     this.context2.fill();
//   }
// }
// export let fog = new Fog();
class Fog {
  fogcanvas: HTMLCanvasElement;
  context: any;
  fog_littlewindow: HTMLCanvasElement;
  fog_littlewindowctx: any;
  constructor() {
    this.initCanvas();
  }
  initCanvas() {
    this.fogcanvas = document.getElementById("canvas3") as HTMLCanvasElement;

    this.context = this.fogcanvas.getContext("2d");
    this.fog_littlewindow = document.getElementById(
      "fog_littlewindow"
    ) as HTMLCanvasElement;
    this.fog_littlewindowctx = this.fog_littlewindow.getContext("2d");
    this.context.fillRect(0, 0, 4480, 1400);
    this.fog_littlewindowctx.fillRect(0, 0, 180, 105.8);
    this.clear(782, 442, 1123 - 782, 835 - 442);
  }
  clear(x: number, y: number, width: number, height: number) {
    this.context.clearRect(x, y, width, height);
    this.fog_littlewindowctx.clearRect(
      x / 24,
      (y * 1.875) / 24,
      width / 24,
      (height * 1.875) / 24
    );
  }
}
export let fog = new Fog();
