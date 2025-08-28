const flash = require('./fire_flash.png');
const s_b = require('./s_b.png');
const s_l = require('./s_l.png');
const s_lb = require('./s_lb.png');
const s_lt = require('./s_lt.png');
const s_r = require('./s_r.png');
const s_rb = require('./s_rb.png');
const s_rt = require('./s_rt.png');
const s_t = require('./s_t.png');
let fightimg = [s_t,s_rt,s_r,s_rb,s_b,s_lb,s_l,s_lt,flash],
    fightimgselements = [],
    soilderfight = function(fightimg,fightimgselements){

        return new Promise((resolve,reject)=>{
            if(fightimgselements.length==fightimg.length){
                  resolve();
                  return;
            }
            let counts=0;
            for(let j=0;j<fightimg.length;j++){
                let img = new Image();
                    img.style.display = 'none';
                    img.src = fightimg[j].default;
                    img.onload=function(e){
                        fightimgselements[j]=img;
                        counts++
                        if(counts==fightimg.length-1){
                            resolve()
                        }
                    }
            }
        })
    }

    export {fightimg,fightimgselements,soilderfight}