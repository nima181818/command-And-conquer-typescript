
const t1 = require('../assets/soilderimgs/t1.png');
const t2 = require('../assets/soilderimgs/t2.png');
const t3 = require('../assets/soilderimgs/t3.png');
const t4 = require('../assets/soilderimgs/t4.png');
const t5 = require('../assets/soilderimgs/t5.png');

const rt1 = require('../assets/soilderimgs/rt1.png');
const rt2 = require('../assets/soilderimgs/rt2.png');
const rt3 = require('../assets/soilderimgs/rt3.png');
const rt4 = require('../assets/soilderimgs/rt4.png');
const rt5 = require('../assets/soilderimgs/rt5.png');

const r1 = require('../assets/soilderimgs/r1.png');
const r2 = require('../assets/soilderimgs/r2.png');
const r3 = require('../assets/soilderimgs/r3.png');
const r4 = require('../assets/soilderimgs/r4.png');
const r5 = require('../assets/soilderimgs/r5.png');

const rb1 = require('../assets/soilderimgs/rb1.png');
const rb2 = require('../assets/soilderimgs/rb2.png');
const rb3 = require('../assets/soilderimgs/rb3.png');
const rb4 = require('../assets/soilderimgs/rb4.png');
const rb5 = require('../assets/soilderimgs/rb5.png');

const b1 = require('../assets/soilderimgs/b1.png');
const b2 = require('../assets/soilderimgs/b2.png');
const b3 = require('../assets/soilderimgs/b3.png');
const b4 = require('../assets/soilderimgs/b4.png');
const b5 = require('../assets/soilderimgs/b5.png');

const lb1 = require('../assets/soilderimgs/lb1.png');
const lb2 = require('../assets/soilderimgs/lb2.png');
const lb3 = require('../assets/soilderimgs/lb3.png');
const lb4 = require('../assets/soilderimgs/lb4.png');
const lb5 = require('../assets/soilderimgs/lb5.png');


const l1 = require('../assets/soilderimgs/l1.png');
const l2 = require('../assets/soilderimgs/l2.png');
const l3 = require('../assets/soilderimgs/l3.png');
const l4 = require('../assets/soilderimgs/l4.png');
const l5 = require('../assets/soilderimgs/l5.png');



const lt1 = require('../assets/soilderimgs/lt1.png');
const lt2 = require('../assets/soilderimgs/lt2.png');
const lt3 = require('../assets/soilderimgs/lt3.png');
const lt4 = require('../assets/soilderimgs/lt4.png');
const lt5 = require('../assets/soilderimgs/lt5.png');









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

export {imgList,picimgList,pics}