interface handlers{
    name:string
    handlerfunction:Function
}
class Watcher<T>{
    eventHandlers:handlers[]=[]
    //订阅
    register(fucname:string,handlerfunction:Function){
        
    this.eventHandlers.push({
        name:fucname,
        handlerfunction:handlerfunction
    })
    }
    //响应式
    responseMode<K extends keyof T>(targrt:T,key:K){
        let tempx = 0;
        let tempy=0
        let that = this
        if(typeof targrt[key]=='object'){
            Object.defineProperty(targrt[key],'x',{
                get:function(){
                   return tempx
                },
                set:function(val){
               
                    tempx = val;
                   that.notify(key+'Trigger',targrt)
                }
            })
            Object.defineProperty(targrt[key],'y',{
                get:function(){
                   return tempy
                },
                set:function(val){
                 
                    tempy = val;
                   that.notify(key+'Trigger',targrt)
                }
            })
        }else{
            Object.defineProperty(targrt,key,{
                get:function(){
                   return tempx
                },
                set:function(val){
               
                    tempx = val;
                   that.notify(key+'Trigger',targrt)
                }
            })
        }
       
    }
    //发布
    notify(key,targrt:T){
      
      for(let j=0;j<this.eventHandlers.length;j++){
         
          if(key==this.eventHandlers[j].name){
              if(key!='currentclickpointsTrigger'){
             
              }
          
              this.eventHandlers[j].handlerfunction.call(targrt);
          }
      }
    }
}
export {Watcher}