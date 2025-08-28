export class Dashboard{
    dashboarddom:string
    worldDom:string
    leftanimationtimer:number
    showindex:number = 0
    coverimgs:HTMLImageElement[]=[]
    constructor(){
this.initDom();
this.initLeftcoverpictures();
    }
    initDom(){
       this.dashboarddom =`
        <div class="dashboard">
          <div class="leftradios">
            <div class="sons"></div>
          </div>
          <div class="rightselections">
           <img class="top1" src="./src/assets/covers/right_boardtop.jpg">
            <div class="selectionslist">
               <div class="menu_items" id="startgame">开始游戏</div>
               <div class="menu_items" id="gamedescription">游戏说明</div>
               <div class="menu_items" id="aboutgame">关于游戏</div>
               <div class="menu_items"></div>
               <div class="menu_items"></div>
               <div class="menu_items"></div>
               <div class="menu_items">版本:1.0.0_Alpha</div>
            </div>
            </div>
          </div>
        </div>
       `;
       let template = document.createElement('div')
       template.innerHTML = this.dashboarddom;
       for(let j=0;j<template.children.length;j++){
        var y=template.children[j].cloneNode(true);  
          
        document.body.appendChild(y)
       }
   
      this.bindEvents();
    }
    bindEvents(){
        let startgame = document.getElementById('startgame'),
        gamedescription = document.getElementById('gamedescription'),
        aboutgame = document.getElementById('aboutgame');
        startgame.onclick=function(){
           //先走动画
        
          
           let j = 0;
           let items:any =  document.getElementsByClassName('menu_items');
          let timer = setInterval(()=>{
              try{
                items[j].style.left = '200px';
                j++;
                
                if(j==items.length){
                    clearInterval(timer);
                    setTimeout(()=>{
                        this.toGameworld();
                        import('./World').then(r=>{
                            
                        })
                    },200)
                   
                   
                 
                }
              }catch(e){

              }
          
           },40)
      
        }.bind(this)
        gamedescription.onclick=function(){
           alert(
             "本游戏取材于命令与征服：红色警戒2，精简了原游戏90%的功能，保留了RTS最本质的游戏体验：建造与攻击，游戏处于Alpha阶段，我仅代表个人开发者向红色警戒这款经典游戏致敬！"
           );
        }
        aboutgame.onclick=function(){
            alert('完善开发中')
        }
    }
    initLeftcoverpictures(){
         return new Promise((resolve,rej)=>{
            for(let j=0;j<=30;j++){
                let img = new Image();
                   img.src = require(`./assets/covers/covers (${j+1}).jpg`).default;
                   
                    this.coverimgs.push(img);
                   if(j>0){
                    img.style.display='none'
                   }
                   if(this.coverimgs.length==31){
                       resolve()
                   }
                // import(`./assets/covers/covers (${j+1}).jpg`).then(r=>{
                //     console.log(r)
                // })
              
            }
         }).then(()=>{
           let leftradios = document.getElementsByClassName('sons')[0] as HTMLDivElement
           for(let j=0;j<this.coverimgs.length;j++){
            leftradios.appendChild(this.coverimgs[j]);
           }
           this.leftCoveranimations();

         })
    }
    leftCoveranimations(){
        this.leftanimationtimer= window.setInterval(()=>{
            this.showindex+=0.1;
            if(this.showindex>31){
                this.showindex=0;
            }
            for(let j=0;j<this.coverimgs.length;j++){
                if(j==parseInt((this.showindex).toString())){
                    this.coverimgs[j].style.display='block'
                }else{
                    this.coverimgs[j].style.display='none'
                }
            }
        },16.6)
        
  // this.leftanimationtimer = 
    }
    toGameworld(){
        clearInterval(this.leftanimationtimer);
        let dashboard = document.getElementsByClassName('dashboard')[0] as HTMLDivElement
        dashboard.style.display='none'
        this.worldDom = `<div class="world"> <img src='./src/assets/victory.jpg' style="width: 544px;
        height: 144px;
        display: none;
        position: absolute;
        left: 85px;
        z-index: 11;
        flex-shrink: 0;
        top: 190px;" class="victory" />
        <img src='./src/assets/lost.jpg' style="width: 544px;
        height: 144px;
        display: none;
        position: absolute;
        left: 85px;
        z-index: 11;
        flex-shrink: 0;
        top: 190px;" class="lost" />
        <div class="leftwrapper" style="flex-shrink:0">
        <canvas width="4480" height="1400" id="canvas1" style="background: black;"></canvas>
        <canvas width="4480"  height="1400" style="position: absolute;top:0px;z-index:3" id="canvas2"></canvas>
        <canvas width="4480"  height="1400" style="position: absolute;top:0px;z-index:3" id="canvasunit"></canvas>
        <!-- canvas3 fog 层 -->
        <canvas width="4480"  height="1400" style="position: absolute;top:0px;z-index:4;" id="canvas3"></canvas>
        <canvas width="4480"  height="1400" style="position: absolute;top:0px;z-index:4;" id="canvas8"></canvas>
        <canvas width="4480"  height="1400" style="position: absolute;top:0px;z-index:5;" id="canvasclick"></canvas>
        
        <div id="back" style="display: flex;z-index: -1;width:4480px;"></div>
        <div id="basecontrol">
           
        </div>
        </div>
        <div class="rightcontainer">
            <div class="moneyandpower">
             
                <div class="tops">
                   $ 0
                </div>
                
                <div class="powers">
                    / 
                   <img style="width:29px"  src="./src/assets/powervalue.png" /><span id="powernumber"> 0</span>
                </div>
    
            </div>
           
            <div class="playground">
                <div class="wrappers" style="background: black;">
                    <img id="canvas6"  style="background: black;width:100%;height:105.8px;margin-top:35px"/>
                    <canvas id="canvas4"  width=180 height=105.8 style="position:relative;top:-110px;"></canvas>
                    <canvas id="fog_littlewindow" width=180 height=105.8 style="position:relative;top:-219px;z-index:6"></canvas>
                    <canvas id="click_littlewindow" width=180 height=105.8 style="position:relative;top:-328px;z-index:7"></canvas>
                </div>
            </div>
            <div class="bars">
                <div class="items">
                    
                </div>
                <div class="items"></div>
                <div class="items"></div>
                <div class="items"></div>
            </div>
            <!-- 建筑 -->
            <div class="stlist">
              <div id="stpowertation" title="磁能反应堆 $150"></div>
              <div id="stoil" title="科技钻油井 $200"></div>
              <div id="stinfantry" title="兵营 $200"></div>
              <div id="stwcf" title="战车工厂 $250"></div>
              
            </div>
            <!-- 防御 -->
            <div class="guardlist">
                <div id="prismtower" title="光棱塔 $400"></div>
              
                <!-- <div id="sentrycannon"></div> -->
            </div>
    
            <!-- 兵种 -->
            <div class="soilderlist">
                <div id="liberationarmy" title="解放军战士 $200"></div>
                <div id="engineer" title="工程师 $200"></div>
                <!-- <div id="spy"></div> -->
            </div>
    
            <!-- 坦克 -->
            <div class="wartanklist">
                <div id="rhinocerotidaetank" title="犀牛坦克 $400"></div>
                <div id="skystart" title="天启坦克 $600"></div>
            </div>
        </div>
        <br>
        <div id="mapshows">
            <!-- 地图映射器 -->
        </div>
        </div>
       
        <script>
          //！注意  以后的事件绑定请使用addEventlistner
        </script>`;
        let template = document.createElement('div')
        template.innerHTML = this.worldDom;
        for(let j=0;j<template.children.length;j++){
         var y=template.children[j].cloneNode(true);  
         document.body.appendChild(y)
        }
        
    }
}