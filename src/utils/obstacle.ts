interface Positions{
    x:number
    y:number
}
export class Obstacle{
    points:Positions[]=[]
    constructor(){
      for(let j=0;j<40;j++){
          let param={
              x:5*j,
              y:4*j
          }
          this.points.push(param)
      }
    }
}

