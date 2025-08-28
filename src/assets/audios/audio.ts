const buiding =require('./eva_voice/building.mp3'),
      buidinginprogress =require('./eva_voice/building_in_progress.mp3'),
      cannotplayhere = require('./eva_voice/cannotplayhere.mp3'),
      constructionalcomplete = require('./eva_voice/constructionalcomplete.mp3'),
      constructionalnoctions =require('./eva_voice/constructionalnoctions.mp3'),
      unitready = require('./eva_voice/unit_ready.mp3'),

      //犀牛坦克声音
      tankmoving = require('./tank_voice/moving_rank.mp3'),
      waitingorders = require('./tank_voice/waitingorders.mp3'),
      fireout = require('./tank_voice/fireout.mp3'),
      tankattacking = require('./tank_voice/tank_attacking.mp3'),

      //解放军的声音
      howaboutaction = require('./soilder_voice/how about action.mp3'),
      movingnow = require('./soilder_voice/moving now.mp3'),
      soilderbullet = require('./soilder_voice/soidler_bullet.mp3'),
      soilderdied = require('./soilder_voice/soidler_died.mp3'),
      soilderdoit = require('./soilder_voice/soilder_lets_do_it.mp3'),

      //光棱塔的声音
      ptattack = require('./pt_voice/ptattack.mp3')

console.log(buiding,"啦啦啦啊")
class Audios{
    audio:HTMLAudioElement
    constructor(source:any){
      this.initAudios(source)
    }
    initAudios(source:any){
       this.audio = new Audio(source)
    }
    playAudio(){
        this.audio.play();
    }
}
let buiding_audio = new Audios(buiding.default),
buidinginprogress_audio = new Audios(buidinginprogress.default),
cannotplayhere_audio = new Audios(cannotplayhere.default),
constructionalcomplete_audio = new Audios(constructionalcomplete.default),
constructionalnoctions_audio = new Audios(constructionalnoctions.default),
unitready_audio = new Audios(unitready.default),


//犀牛坦克声音
tankmoving_audio = new Audios(tankmoving.default),
waitingorders_audio = new Audios(waitingorders.default),
fireout_audio = new Audios(fireout.default),
tankattacking_audio = new Audios(tankattacking.default),

//解放军的声音
howaboutaction_audio = new Audios(howaboutaction.default),
movingnow_audio = new Audios(movingnow.default),
soilderbullet_audio = new Audios(soilderbullet.default),
soilderdied_audio = new Audios(soilderdied.default),
soilderdoit_audio = new Audios(soilderdoit.default),

//光棱塔的攻击声音
ptattack_audio = new Audios(ptattack.default)

export {ptattack_audio,tankattacking_audio,unitready_audio,soilderdoit_audio,buiding_audio,buidinginprogress_audio,cannotplayhere_audio,tankmoving_audio,waitingorders_audio,constructionalcomplete_audio,constructionalnoctions_audio,fireout_audio,howaboutaction_audio,movingnow_audio,soilderbullet_audio,soilderdied_audio}