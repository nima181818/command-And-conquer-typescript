const expolision_1 = require('../assets/rhinocerotidaetank/expolision/expolision_1.png');
const expolision_2 = require('../assets/rhinocerotidaetank/expolision/expolision_2.png');
const expolision_3 = require('../assets/rhinocerotidaetank/expolision/expolision_3.png');
const expolision_4 = require('../assets/rhinocerotidaetank/expolision/expolision_4.png');
const expolision_5 = require('../assets/rhinocerotidaetank/expolision/expolision_5.png');
const expolision_6 = require('../assets/rhinocerotidaetank/expolision/expolision_6.png');
const expolision_7 = require('../assets/rhinocerotidaetank/expolision/expolision_7.png');
let imgelements=[];
const expolisionimglist = [expolision_1,expolision_2,expolision_3,expolision_4,expolision_5,expolision_6,expolision_7];
for(let j=0;j<expolisionimglist.length;j++){
    let img = new Image();
        img.style.display = 'none';
        img.src = expolisionimglist[j].default;
        document.body.appendChild(img);
        img.onload=function(){
imgelements[j] = img
        }.bind(this)
}
export {imgelements}