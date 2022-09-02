
import { Player } from './player'
//借用mask来辅助建造兵，坦克
let soilderlistMask: any,
    wartanklistMask: any

import { Liberationarmy } from './Tankclass/liberationarmy'
import { Rhinocerotidaetank } from './Tankclass/rhinocerotidaetank'
import { Skystart } from './Tankclass/skystarttank'
import { Structure } from './Structureclass/structure'
export class Timemanager {
    currenttime: number
    gamestarttime: number
    looptime: number = 0
    kuilei: Player
    creatingtimer: number
    enemytarget:any={}
    soilderbuildtimer: number
    rhibuildertimer: number
    skybuildertimer: number

    troops: any[] = []
    attackingtimeintervals: number
    constructor(kuilei: Player) {
        this.gamestarttime = new Date().getTime();
        this.kuilei = kuilei
        this.flushTime()
    }
    //刷新时间
    flushTime() {
        window.setInterval(() => {
            this.currenttime = new Date().getTime();
            this.looptime += 0.5
            this.beginningBuilding();
            this.stableBuildingstructure();
            let lierationarmy = [],
                rhitank = [],
                skytank = [];
            for (let j = 0; j < this.kuilei.eventlist.tanklist.length; j++) {
                if (this.kuilei.eventlist.tanklist[j]._name == 'liberationarmy') {
                    lierationarmy.push(this.kuilei.eventlist.tanklist[j])
                }
                if (this.kuilei.eventlist.tanklist[j]._name == 'rhinocerotidaetank') {
                    rhitank.push(this.kuilei.eventlist.tanklist[j])
                }
                if (this.kuilei.eventlist.tanklist[j]._name == 'skystarttank') {
                    skytank.push(this.kuilei.eventlist.tanklist[j])
                }
            }
            
            this.buildMovingunits(lierationarmy, rhitank, skytank)
            this.attackPlayer1(lierationarmy, rhitank, skytank)
        }, 500)
    }
    //初始化的建造
    beginningBuilding() {
        // powerstation soliderfactory wcf oil prismtower
        if (this.looptime == 1) {
            //1s 后修建第一个 电场
            this.kuilei.createStructure('powerstation')
        }
        if (this.looptime == 5) {
            //5s后修建第二个电场
            this.kuilei.createStructure('powerstation')
        }
        if (this.looptime == 10) {
            //第20秒 修建第2个油井
            // this.kuilei.createStructure('oil');
            this.kuilei.createStructure('soliderfactory')

        }
        if (this.looptime == 15) {
            //第10秒 修建
            this.kuilei.createStructure('oil')
        }
        if (this.looptime == 20) {
            //第15秒 修建第三个电场
            
            this.kuilei.createStructure('powerstation')
        }
        if (this.looptime == 25) {
            //第20秒 修建第2个油井
            // this.kuilei.createStructure('oil');
            this.kuilei.createStructure('wcf')

        }
        if (this.looptime == 30) {
            //第20秒 修建第2个油井
            // this.kuilei.createStructure('oil');
            this.kuilei.createStructure('oil')

        }


    }
    //稳定后的建造——建筑__用作补给
    stableBuildingstructure() {
    //    console.log(this.kuilei.money)
        //初始化完成 补给操作要求基地存在
        if (this.looptime > 40 && this.kuilei.structuresets.unitsList['base'].length) {
            //powerstation

            if (this.kuilei.structuresets.unitsList['powertation'].length < 3) {
                if (this.kuilei.money - 150 >= 0) {

                    if (!this.creatingtimer) {
                        this.creatingtimer = window.setTimeout(() => {
                            this.kuilei.createStructure('powerstation');
                            this.creatingtimer = null
                        }, 3000)
                    }
                }
                return
            }
            //oil
            if (this.kuilei.structuresets.unitsList['oil'].length < 2) {
                if ((this.kuilei.money - 200 >= 0) && (this.kuilei.powernumber - 150 >= 0)) {

                    if (!this.creatingtimer) {
                        this.creatingtimer = window.setTimeout(() => {
                            this.kuilei.createStructure('oil');
                            this.creatingtimer = null
                        }, 3000)
                    }
                }
                return
            }
            //兵营
            if (this.kuilei.structuresets.unitsList['soliderfactory'].length < 1) {
                if ((this.kuilei.money - 200 >= 0) && (this.kuilei.powernumber - 150 >= 0)) {

                    if (!this.creatingtimer) {
                        this.creatingtimer = window.setTimeout(() => {
                            this.kuilei.createStructure('soliderfactory');
                            this.creatingtimer = null
                        }, 3000)
                    }
                }
                return
            }
            //战车工厂
            if (this.kuilei.structuresets.unitsList['wcf'].length < 1) {
                if ((this.kuilei.money - 250 >= 0) && (this.kuilei.powernumber - 200 >= 0)) {

                    if (!this.creatingtimer) {
                        this.creatingtimer = window.setTimeout(() => {
                            this.kuilei.createStructure('wcf');
                            this.creatingtimer = null
                        }, 3000)
                    }
                }
                return
            }
        }
    }
    //稳定后的建造--移动单位_5个兵，2个天启坦克  ，家园由5个犀牛 8个兵防守
    buildMovingunits(lierationarmy, rhitank, skytank) {


        return new Promise((resolve, rej) => {
            if (soilderlistMask && wartanklistMask) {
                resolve();
                return;
            }
            import('./rightbars/masks').then(res => {
                soilderlistMask = res.soilderlistMask;
                wartanklistMask = res.wartanklistMask;
                resolve()
            })
        }).then(() => {
            if (this.kuilei.structuresets.unitsList.soliderfactory.length) {
                if (lierationarmy.length < 13) {
                    if (!this.soilderbuildtimer) {
                        soilderlistMask.type_name = 'sdliberationarmy';
                        this.soilderbuildtimer = window.setTimeout(() => {
                            this.soilderbuildtimer = null
                            soilderlistMask.generateSoilder('ai1');
                           
                        }, 3000)
                    }

                }
            }
            if (this.kuilei.structuresets.unitsList.wcf.length) {
                if (rhitank.length < 5) {
                    wartanklistMask.type_name = 'tkrhinocerotidaetank'
                    if (!this.rhibuildertimer) {
                        this.rhibuildertimer = window.setTimeout(() => {
                            this.rhibuildertimer = null
                            wartanklistMask.generateTank('ai1');
                          
                        }, 3000)
                    }

                }
                if (skytank.length < 2) {
                    wartanklistMask.type_name = 'tkskystarttank'
                    if (!this.skybuildertimer) {
                        this.skybuildertimer = window.setTimeout(() => {
                            this.skybuildertimer = null
                            wartanklistMask.generateTank('ai1');
                           
                        }, 3000)
                    }

                }

            }
        })


    }

    //攻击 _5个兵，2个天启坦克+2个犀牛  ，家园由3个犀牛 8个兵防守
    attackPlayer1(lierationarmy, rhitank, skytank) {
        let hasalive = this.troops.find((item) => { return item.alive });
        //设计player1的一些建筑为随机目标
        let player1 = this.kuilei.getAnotherplayer(),
            player1Structurelist = [];
      

        for (let j in player1.structuresets.unitsList) {
            for (let k = 0; k < player1.structuresets.unitsList[j].length; k++) {
                player1Structurelist.push(player1.structuresets.unitsList[j][k])
            }
        }
        let randomindex = parseInt((Math.random() * (player1Structurelist.length - 1)).toString())
      
        if (!hasalive && this.looptime % 60 == 0) {
            this.troops = []
            this.enemytarget = player1Structurelist[randomindex]
            if (this.enemytarget) {
                if (lierationarmy.length == 13) {

                    for (let j = 0; j < 5; j++) {
                        this.troops.push(lierationarmy[j]);
                    }
                }
                if (rhitank.length == 5) {
                    for (let j = 0; j < 2; j++) {
                        this.troops.push(rhitank[j]);
                    }
                }
                if (skytank.length == 2) {
                    for (let j = 0; j < 2; j++) {
                        this.troops.push(skytank[j]);
                    }
                }

                for (let j = 0; j < this.troops.length; j++) {
                    let center = {
                        x: this.enemytarget.positions.x + this.enemytarget.size.x,
                        y: this.enemytarget.positions.y + this.enemytarget.size.y,
                    }
                    this.troops[j].setTankspoints(center.x, center.y, 'setendpoints', true)
                }

            }


        }
        if (hasalive) {
           try{
            if (!this.enemytarget.alive) {
               
                //建筑物死亡 reset target
                this.enemytarget = player1Structurelist.find(item=>{return item.alive});
                  if(this.enemytarget){
                    for (let j = 0; j < this.troops.length; j++) {
                        let center = {
                            x: this.enemytarget.positions.x + this.enemytarget.size.x,
                            y: this.enemytarget.positions.y + this.enemytarget.size.y,
                        }
                        if(this.troops[j].alive){
                            this.troops[j].setTankspoints(center.x, center.y, 'setendpoints', true)
                        }
                     
                    }
                  }
              
            }
           }catch(e){
                 
           }
            
        }

    }
    //防守 应适当扩大当单位在基地周围的防守半径

}
class StateMachine {
    state: string
}