export class Point{
    x:number=0
    y:number=0
    G:number=0
    H:number=0
    father:Point=null
    Init(x:number,y:number,father:Point){
        this.x=x;
        this.y=y;
        this.father=father;
    }
}
export class Astar{
    map:Array<Array<any>>=[]
    rowCount:number=0
    colCount:number=0
    startPoint:Point=new Point()
    endPoint:Point=new Point()
    openList:Point[]=[]
    closeList:Point[]=[]
    constructor(){
        this.rowCount = 600;
        this.colCount = 400;
        for(let j=0;j<80;j++){
			this.map[j] = []
			for(let k=0;k<120;k++){
				this.map[j][k] = 0
			}
		}
    }
    //是否为障碍物
    IsBar(x:number,y:number):boolean{
        let xshrink = parseInt((x/5).toString());
        let Yshrink = parseInt((y/5).toString());
        try{
            if(this.map[Yshrink][xshrink]==3){
         
                return true;
            }
            else{
               
                return false;
            }
        }catch(e){
            debugger
        }
      
    }
     //当前坐标是否在OpenList
     IsInOpenList(x:number,y:number):boolean{
        for(var i=0;i<this.openList.length;i++){
            if(this.openList[i].x==x&&this.openList[i].y==y){
                return true;
            }

        }
       return false;
     }
        //当前坐标是否在OpenList
        IsInCloseList(x:number,y:number):boolean{
            for(var i=0;i<this.closeList.length;i++){
                if(this.closeList[i].x==x&&this.closeList[i].y==y){
                    return true;
                }

            }
            return false;
         }
          //计算G值;(p是Point类)
          GetG(p:Point):number{
            if(p.father==null){
                return 0;
            }
            return p.father.G+5;
        }
          //计算H值
          GetH(p:Point,pb:Point){
            return Math.abs(p.x-pb.x)+Math.abs(p.y-pb.y);
        }
         //添加当前点的上下左右相邻的方格到Open列表中
         AddNeiToOpenList(curPoint:Point){
             console.log(curPoint,"666666")
            for(var x=curPoint.x-5;x<=curPoint.x+5;x+=5){
                for(var y=curPoint.y-5;y<=curPoint.y+5;y+=5){
                    //排除自身以及超出下标的点
                    if((x>=0&&x<this.colCount&&y>=0&&y<this.rowCount)&&!(curPoint.x==x&&curPoint.y==y)){
                        //排除斜对角
                        if(Math.abs(x-curPoint.x)+Math.abs(y-curPoint.y)==5){
                            //不是障碍物且不在关闭列表中
                            if(this.IsBar(x,y)==false&&this.IsInCloseList(x,y)==false){
                                //不存在Open列表
                                if(this.IsInOpenList(x,y)==false){
                                    var point=new Point();
                                    point.x=x;
                                    point.y=y;
                                    point.father=curPoint;
                                    point.G=this.GetG(point);
                                    point.H=this.GetH(point,this.endPoint);
                                    this.openList.push(point);
                                }
                            }
                        }
                    }
                }
           }
         }
          //在openlist集合中获取G+H为最小的Point点
          GetMinFFromOpenList():any{
            var minPoint=null;
            var index=0;
            for(var i=0;i<this.openList.length;i++){
                if(minPoint==null||minPoint.G+minPoint.H>=this.openList[i].G+this.openList[i].H){
                    minPoint=this.openList[i];
                    index=i;
                }
            }
            return{
                minPoint:minPoint,
                index:index
            }
        }
        //获取该点在openList中的位置
        GetPointFromOpenList(x:number,y:number):Point{
            for(var i=0;i<this.openList.length;i++){
                if(this.openList[i].x==x&&this.openList[i].y==y){
                    return this.openList[i];
                }
            }
            return null;
        }
        //寻路算法
        FindPoint(){
            
            console.log(this);
            this.openList.push(this.startPoint);
            while(this.IsInOpenList(this.endPoint.x,this.endPoint.y)==false||this.openList.length==0){
                var curPoint=this.GetMinFFromOpenList().minPoint;
               
                var index=this.GetMinFFromOpenList().index;
                if(curPoint==null){
                    console.log("没有路");
                    return;
                }
                this.openList.splice(index,1);
                this.closeList.push(curPoint);
                this.AddNeiToOpenList(curPoint);
            }
            var p=this.GetPointFromOpenList(this.endPoint.x,this.endPoint.y);
            console.log(p+".....");
            while(p.father!=null){
                p= p.father;
                let xshrink = parseInt((p.x/5).toString());
                 let Yshrink = parseInt((p.y/5).toString());
                this.map[Yshrink][xshrink]=4;
            }
            //把终结点也设置成4
            let endxshrink = parseInt((this.endPoint.x/5).toString());
            let endYshrink = parseInt((this.endPoint.y/5).toString());
            this.map[endYshrink][endxshrink]=4;
        }
    }