interface Positions{
    x:number
    y:number
}
class Obstacle{
    points:Positions[]=[]
    constructor(){
      for(let j=0;j<50;j++){
          let param={
              x:5*j,
              y:4*j
          }
          this.points.push(param)
      }
    }
}
let obstacle = new Obstacle();
export { obstacle }