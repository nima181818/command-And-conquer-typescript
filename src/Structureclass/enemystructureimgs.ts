function imginits(imgUrllist: any[], imgList: any[]) {
    return new Promise((resolve, reject) => {
        if (imgUrllist.length == imgList.length) {
            resolve();

        } else {
            for (let j = 0; j < imgUrllist.length; j++) {
                let img: HTMLImageElement = new Image();
                img.src = imgUrllist[j]
                img.onload = function () {

                    imgList[j] = img;
                    if (imgUrllist.length == imgList.length) {
                        resolve();

                    }
                }
                document.body.appendChild(img)


            }
        }
    })

}
const base1 = require('../assets/enemy/baseimgs/enemy_base1.png');
const base2 = require('../assets/enemy/baseimgs/enemy_base2.png');
const base3 = require('../assets/enemy/baseimgs/enemy_base3.png');
const base4 = require('../assets/enemy/baseimgs/enemy_base4.png');
const base5 = require('../assets/enemy/baseimgs/enemy_base5.png');
const base6 = require('../assets/enemy/baseimgs/enemy_base6.png');
const base7 = require('../assets/enemy/baseimgs/enemy_base7.png');
const base8 = require('../assets/enemy/baseimgs/enemy_base8.png');
const base9 = require('../assets/enemy/baseimgs/enemy_base9.png');
const base10 = require('../assets/enemy/baseimgs/enemy_base10.png');
const base11 = require('../assets/enemy/baseimgs/enemy_base11.png');
const base12 = require('../assets/enemy/baseimgs/enemy_base12.png');
const base13 = require('../assets/enemy/baseimgs/enemy_base13.png');
const base14 = require('../assets/enemy/baseimgs/enemy_base14.png');
let baseimgUrllist = [
    base1.default,
    base2.default,
    base3.default,
    base4.default,
    base5.default,
    base6.default,
    base7.default,
    base8.default,
    base9.default,
    base10.default,
    base11.default,
    base12.default,
    base13.default,
    base14.default
],
    baseimgList = []



const oil1 = require('../assets/enemy/oilstructure/enemy_oil1.png');
const oil2 = require('../assets/enemy/oilstructure/enemy_oil2.png')
const oil3 = require('../assets/enemy/oilstructure/enemy_oil3.png')
const oil4 = require('../assets/enemy/oilstructure/enemy_oil4.png')
const oil5 = require('../assets/enemy/oilstructure/enemy_oil5.png')
const oil6 = require('../assets/enemy/oilstructure/enemy_oil6.png');
const oil7 = require('../assets/enemy/oilstructure/enemy_oil7.png');
let oilimgUrllist = [
    oil1.default,
    oil2.default,
    oil3.default,
    oil4.default,
    oil5.default,
    oil6.default,
    oil7.default,
    // oil8.default,
    // oil7.default,
    oil6.default,
    oil5.default,
    oil4.default,
    oil3.default,
    oil2.default,
    oil1.default,
],
    oilimgList = [];


const structurepbstacle = require('./soliderfactoryobstacle.json');//注意这是相对位置，要转换为地图的绝对位置
const Soliderfactoryimg1 = require('../assets/enemy/infantry/enemy_infantry-1.png');
const Soliderfactoryimg2 = require('../assets/enemy/infantry/enemy_infantry-2.png')
const Soliderfactoryimg3 = require('../assets/enemy/infantry/enemy_infantry-3.png')
const Soliderfactoryimg4 = require('../assets/enemy/infantry/enemy_infantry-4.png')
const Soliderfactoryimg5 = require('../assets/enemy/infantry/enemy_infantry-5.png')
const Soliderfactoryimg6 = require('../assets/enemy/infantry/enemy_infantry-6.png');
let soilderimgUrllist = [
    Soliderfactoryimg1.default,
    Soliderfactoryimg2.default,
    Soliderfactoryimg3.default,
    Soliderfactoryimg4.default,
    Soliderfactoryimg5.default,
    Soliderfactoryimg6.default,
],
    soilderimgList = [];



const pb1 = require('../assets/enemy/powerstation/enemy_p-b1.png');
const pb2 = require('../assets/enemy/powerstation/enemy_p-b2.png')
const pb3 = require('../assets/enemy/powerstation/enemy_p-b3.png')
const pb4 = require('../assets/enemy/powerstation/enemy_p-b4.png')
const pb5 = require('../assets/enemy/powerstation/enemy_p-b5.png')
const pb6 = require('../assets/enemy/powerstation/enemy_p-b6.png');
const ps1 = require('../assets/enemy/powerstation/enemy_p-s1.png');
const ps2 = require('../assets/enemy/powerstation/enemy_p-s2.png');
const ps3 = require('../assets/enemy/powerstation/enemy_p-s3.png');
const ps4 = require('../assets/enemy/powerstation/enemy_p-s4.png');
const ps5 = require('../assets/enemy/powerstation/enemy_p-s5.png');
let powerstationimgUrllist = [
    pb1.default,
    pb2.default,
    pb3.default,
    pb4.default,
    pb5.default,
    pb6.default,
    ps1.default,
    ps2.default,
    ps3.default,
    ps4.default,
    ps5.default
],
    powerstationimgList = [];





const wcf1 = require('../assets/enemy/wcf/enemy_wcf1.png');
const wcf2 = require('../assets/enemy/wcf/enemy_wcf2.png')
const wcf3 = require('../assets/enemy/wcf/enemy_wcf3.png')
const wcf4 = require('../assets/enemy/wcf/enemy_wcf4.png')
const wcf5 = require('../assets/enemy/wcf/enemy_wcf5.png');
let wcfimgUrllist = [
    wcf1.default,
    wcf2.default,
    wcf3.default,
    wcf4.default,
    wcf5.default
],
    wcfimgList = [];


const pt_b1 = require('../assets/enemy/prismtower/enemy_pt_b1.png');
const pt_b2 = require('../assets/enemy/prismtower/enemy_pt_b2.png');
const pt_b3 = require('../assets/enemy/prismtower/enemy_pt_b3.png');
const pt_b4 = require('../assets/enemy/prismtower/enemy_pt_b4.png');
const pt_b5 = require('../assets/enemy/prismtower/enemy_pt_b5.png');
const pt_b6 = require('../assets/enemy/prismtower/enemy_pt_b6.png');
const pt_s1 = require('../assets/enemy/prismtower/enemy_pt_s1.png');
const pt_s2 = require('../assets/enemy/prismtower/enemy_pt_s2.png');
const pt_s3 = require('../assets/enemy/prismtower/enemy_pt_s3.png');
const pt_s4 = require('../assets/enemy/prismtower/enemy_pt_s4.png');
const pt_s5 = require('../assets/enemy/prismtower/enemy_pt_s5.png');
const pt_s6 = require('../assets/enemy/prismtower/enemy_pt_s6.png');
const pt_s7 = require('../assets/enemy/prismtower/enemy_pt_s7.png');
const pt_s8 = require('../assets/enemy/prismtower/enemy_pt_s8.png');
const pt_s9 = require('../assets/enemy/prismtower/enemy_pt_s9.png');
let ptimgUrllist = [
    pt_b1.default,
    pt_b2.default,
    pt_b3.default,
    pt_b4.default,
    pt_b5.default,
    pt_b6.default,
    pt_s1.default,
    pt_s2.default,
    pt_s3.default,
    pt_s4.default,
    pt_s5.default,
    pt_s6.default,
    pt_s7.default,
    pt_s8.default,
    pt_s9.default
],
    ptimgList = []
// imginits(oilimgUrllist,oilimgList);
// imginits(soilderimgUrllist,soilderimgList);
// imginits(powerstationimgUrllist,powerstationimgList);
// imginits(wcfimgUrllist,wcfimgList);
let oilobj = {
    oilimgList,
    oilimgUrllist
},
    soilderobj = {
        soilderimgUrllist,
        soilderimgList
    },
    powerstationobj = {
        powerstationimgUrllist,
        powerstationimgList
    },
    wcfobj = {
        wcfimgUrllist,
        wcfimgList
    },
    baseobj = {
        baseimgUrllist,
        baseimgList
    },
    ptobj = {
        ptimgUrllist,
        ptimgList
    }
export { oilobj as enemy_oilobj, 
    soilderobj as enemy_soilderobj, 
    powerstationobj as enemy_powerstationobj, 
    wcfobj as enemy_wcfobj, 
    baseobj as enemy_baseobj, 
    ptobj as enemy_ptobj, 
    imginits as enemy_imginits }
