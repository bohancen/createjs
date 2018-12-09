let canvas = document.querySelector('#canvas')
let stage = new createjs.Stage(canvas)
let container = new createjs.Container()
// 存放临时渲染
let tempContainer = new createjs.Container()
// 记录
let records = []
stage.addChild(container)
stage.addChild(tempContainer)
createjs.Touch.enable(stage) //允许设备触控
let reader = new FileReader()
createjs.Ticker.setFPS(60);  
// 缩放值
let s = 1
// 缩放速度
let n = 0.02;
let tempRect = {
  type:'',
  x:0,
  y:0,
  moveX:0,
  moveY:0,
}


let append = function(src,fn){
  let image = new Image()
  image.src = src
  image.onload=function(){
    let img = new createjs.Bitmap(this)
    container.addChild(img)
    stage.update()
    fn && fn()
  }
}
let inserText= function({x,y,txt}){
  txt = txt || 'Hello World'
  let text = new createjs.Text(txt, "20px Arial", "#ff7700")
  console.log(s)
  text.x = x/s;
  text.y = y/s;
  text.textBaseline = "alphabetic";
  container.addChild(text)
  stage.update()
}
let insertRect = function(){
  tempContainer.removeAllChildren()
  
  if(tempRect.type == 'rect'){
    let shape = new createjs.Shape()
    shape.graphics.beginStroke("red").setStrokeStyle(1).drawRect(tempRect.x,tempRect.y,tempRect.moveX-tempRect.x,tempRect.moveY-tempRect.y);
    tempRect.type = 'rect';
    tempContainer.addChild(shape);

    stage.update()
  } 
  if(tempRect.type == 'line'){
    let shape = new createjs.Shape()
    shape.graphics.beginStroke("red").setStrokeStyle(1).moveTo(tempRect.x,tempRect.y).lineTo(tempRect.moveX,tempRect.moveY)
    tempRect.type = 'line';
    tempContainer.addChild(shape)
    
    stage.update()
  }
  
}
let insertRectB = function(){
  tempContainer.removeAllChildren()
  // container.removeAllChildren()
  // append('./test.jpg')
  records.forEach(tempRect => {
    
    if(tempRect.type == 'rect'){
      let shape = new createjs.Shape()
      shape.graphics.beginStroke("red").setStrokeStyle(1).drawRect(tempRect.x,tempRect.y,tempRect.moveX-tempRect.x,tempRect.moveY-tempRect.y);
      tempRect.type = 'rect';
      container.addChild(shape);
      console.log(shape,88);
    }
    if(tempRect.type == 'line'){
      let shape = new createjs.Shape()
      shape.graphics.beginStroke("red").setStrokeStyle(1).moveTo(tempRect.x,tempRect.y).lineTo(tempRect.moveX,tempRect.moveY)
      tempRect.type = 'line';
      container.addChild(shape)
      
    }
  })
  stage.update()
}


// stage.addEventListener('click',function(e){
//   let txt = prompt('输入标注')
//   if(!txt){return }
//   inserText({
//     txt,
//     x:e.stageX,
//     y:e.stageY,
//   })
// })

let cX = 0
let cY = 0
stage.addEventListener('mousedown',function(e){
  cX = e.stageX -container.x
  cY = e.stageY -container.y
  if(stateButton.innerText == '移动'){
    
    // stage.update()
    return false
  }
  tempRect.x=e.stageX
  tempRect.y=e.stageY
  tempRect.moveX=e.stageX
  tempRect.moveY=e.stageY
  if(stateButton.innerText == '矩形'){
    tempRect.type = 'rect'
    insertRect();
  } 
  if(stateButton.innerText == '直线'){
    tempRect.type = 'line'
    insertRect();
  }
  
 
})
stage.addEventListener('pressmove',function(e){
  if(stateButton.innerText == '移动'){
    container.x = e.stageX - cX
    container.y = e.stageY - cY
    stage.update()
    return false
  }
  tempRect.moveX=e.stageX
  tempRect.moveY=e.stageY
  if(stateButton.innerText == '矩形'){
    tempRect.type = 'rect'
    insertRect();
  } 
  if(stateButton.innerText == '直线'){
    tempRect.type = 'line'
    insertRect();
  }
})
stage.addEventListener('pressup',function(e){
  if(stateButton.innerText == '移动'){
    return false
  }
  tempRect.moveX=e.stageX
  tempRect.moveY=e.stageY
  records.push({
    x:(tempRect.x-container.x)/s,
    y:(tempRect.y-container.y)/s,
    moveX:(tempRect.moveX-container.x)/s,
    moveY:(tempRect.moveY-container.y)/s,
    type:tempRect.type
  })
  if(stateButton.innerText == '矩形'){
    tempRect.type = 'rect'
    insertRectB()
  } 
  if(stateButton.innerText == '直线'){
    tempRect.type = 'line'
    insertRectB()
  }
  
  console.log(records, 99);
})


canvas.addEventListener('mousewheel',function(e){
  e.preventDefault();
  if (e.deltaY > 0) { //up
    s = s + n > 10 ? s : s + n
  }
  if (e.deltaY < 0) { //down
    s = s - n
  }
  container.scaleX = s
  container.scaleY = s
  stage.update();
})

document.querySelector('#moveButton').addEventListener('click',function(){
  
})
moveButton.onclick=function(){
  stateButton.innerText = this.innerText
}
rectButton.onclick=function(){
  stateButton.innerText = this.innerText
}
lineButton.onclick = function(){
  stateButton.innerText = this.innerText
}
moveButton.click()


append('./test.jpg')