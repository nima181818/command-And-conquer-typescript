
const t1 = require('../assets/enemy/engineer/enemy_eng_t1.png');
const t2 = require('../assets/enemy/engineer/enemy_eng_t2.png');
const t3 = require('../assets/enemy/engineer/enemy_eng_t3.png');
const t4 = require('../assets/enemy/engineer/enemy_eng_t4.png');
const t5 = require('../assets/enemy/engineer/enemy_eng_t5.png');

const rt1 = require('../assets/enemy/engineer/enemy_eng_rt1.png');
const rt2 = require('../assets/enemy/engineer/enemy_eng_rt2.png');
const rt3 = require('../assets/enemy/engineer/enemy_eng_rt3.png');
const rt4 = require('../assets/enemy/engineer/enemy_eng_rt4.png');
const rt5 = require('../assets/enemy/engineer/enemy_eng_rt5.png');

const r1 = require('../assets/enemy/engineer/enemy_eng_r1.png');
const r2 = require('../assets/enemy/engineer/enemy_eng_r2.png');
const r3 = require('../assets/enemy/engineer/enemy_eng_r3.png');
const r4 = require('../assets/enemy/engineer/enemy_eng_r4.png');
const r5 = require('../assets/enemy/engineer/enemy_eng_r5.png');

const rb1 = require('../assets/enemy/engineer/enemy_eng_rb1.png');
const rb2 = require('../assets/enemy/engineer/enemy_eng_rb2.png');
const rb3 = require('../assets/enemy/engineer/enemy_eng_rb3.png');
const rb4 = require('../assets/enemy/engineer/enemy_eng_rb4.png');
const rb5 = require('../assets/enemy/engineer/enemy_eng_rb5.png');

const b1 = require('../assets/enemy/engineer/enemy_eng_b1.png');
const b2 = require('../assets/enemy/engineer/enemy_eng_b2.png');
const b3 = require('../assets/enemy/engineer/enemy_eng_b3.png');
const b4 = require('../assets/enemy/engineer/enemy_eng_b4.png');
const b5 = require('../assets/enemy/engineer/enemy_eng_b5.png');

const lb1 = require('../assets/enemy/engineer/enemy_eng_lb1.png');
const lb2 = require('../assets/enemy/engineer/enemy_eng_lb2.png');
const lb3 = require('../assets/enemy/engineer/enemy_eng_lb3.png');
const lb4 = require('../assets/enemy/engineer/enemy_eng_lb4.png');
const lb5 = require('../assets/enemy/engineer/enemy_eng_lb5.png');


const l1 = require('../assets/enemy/engineer/enemy_eng_l1.png');
const l2 = require('../assets/enemy/engineer/enemy_eng_l2.png');
const l3 = require('../assets/enemy/engineer/enemy_eng_l3.png');
const l4 = require('../assets/enemy/engineer/enemy_eng_l4.png');
const l5 = require('../assets/enemy/engineer/enemy_eng_l5.png');



const lt1 = require('../assets/enemy/engineer/enemy_eng_lt1.png');
const lt2 = require('../assets/enemy/engineer/enemy_eng_lt2.png');
const lt3 = require('../assets/enemy/engineer/enemy_eng_lt3.png');
const lt4 = require('../assets/enemy/engineer/enemy_eng_lt4.png');
const lt5 = require('../assets/enemy/engineer/enemy_eng_lt5.png');









let imgList = [t1, t2, t3, t4, t5,
    rt1, rt2, rt3, rt4, rt5,
    r1, r2, r3, r4, r5,
    rb1, rb2, rb3, rb4, rb5,
    b1, b2, b3, b4, b5,
    lb1, lb2, lb3, lb4, lb5,
    l1, l2, l3, l4, l5,
    lt1, lt2, lt3, lt4, lt5,
],
picimgList:HTMLImageElement[]=[]
function pics(imgList:any[],picimgList:HTMLImageElement[]){
    return new Promise((resolve,reject)=>{
        if(picimgList.length==imgList.length){
          resolve()
        }else{
            for(let j=0;j<imgList.length;j++){
                imgList[j] = imgList[j].default;
                let img:HTMLImageElement = new Image(); 
                img.src = imgList[j]
                img.style.display = 'none'
                img.onload = function(){
                    picimgList[j] = img;
                    if(picimgList.length==imgList.length){
                        resolve();
                    }
                }.bind(this)
            
            document.body.appendChild(img)
            }
        }
      
    })
    
}

export {imgList as enemy_imgList,picimgList as enemy_picimgList,pics as enemy_pics}