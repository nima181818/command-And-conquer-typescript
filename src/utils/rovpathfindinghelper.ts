/*
 RVO只改变数据层  ，界面渲染仍旧留给机车本身
 rvo 系统自诞生就一直在背后运行，当机车遇到障碍物时，此时运动交给rvo
 rvo类似于卫星导航  ，当我们无法正常行驶时，由卫星处理定位，当我们认路时 自己通过A*计算路
*/

interface goalsinternal {
    _uid: number
    list: number[]
}
// import { eventlist } from '../Tankclass/Eventlist';
class Rvosystem {
    rvoruningtimer: null
    rvohelper: any = RVO
    //timeStep, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity
    simulator: any = new RVO.Simulator(1, 50, 100, 100, 1000, 30, 2, [0, 1])
    goals: Array<goalsinternal> = []
    //增加机动车
    addVihcles(tank: any) {
        this.simulator.addAgent([tank.currentclickpoints.x, tank.currentclickpoints.y]);
        this.simulator.agents[this.simulator.agents.length - 1]._uid = tank._id
        let inner: goalsinternal = {
            _uid: tank._id,
            list: [tank.targetpoint.x, tank.targetpoint.y]
        }
        this.goals.push(inner);
        this.goals[this.goals.length - 1]._uid = tank._id
    }
    //当机车在运动的时候 动态更新goals的数据,
    //同时更新开始点？当A*算法结束,当前RVO开始的时候
    dynamicUpdategoals(tank: any, type: string) {
    
        if (type == 'np') {
            for (let j = 0; j < this.goals.length; j++) {
                if (this.goals[j]._uid == tank._id) {
                    this.goals[j].list = [tank.targetpoint.x, tank.targetpoint.y]
                }
            }
        }
        if (type == 'sp') {
            for (let j = 0; j < this.simulator.agents.length; j++) {
                if (this.simulator.agents[j]._uid == tank._id) {
                    this.simulator.agents[j].position = [tank.currentclickpoints.x, tank.currentclickpoints.y]
                }
            }
        }

    }
    //设置速度偏好
    setPreferredVelocities() {
        for (let i = 0, len = this.simulator.agents.length; i < len; i++) {
            let goalVector = this.rvohelper.Vector.subtract(this.goals[i].list, this.simulator.agents[i].position);
            if (this.rvohelper.Vector.absSq(goalVector) > 1) {
                goalVector = this.rvohelper.Vector.normalize(goalVector);
            }

            this.simulator.agents[i].prefVelocity = goalVector;


        }
    }
    //rvo！！！
    rvostart() {
      
    }
}


let rvosystem = new Rvosystem();
//rvosystem.rvostart();
export { rvosystem }

