function createImg(src){
  return new Promise(function(resolve, reject){
    let image = new Image()
    image.crossOrigin = '';
    image.src = src
    image.onload=function(){
      return resolve(new createjs.Bitmap(image))
    }
  })
}
async function createCanvas(pic_url){
  let records = []
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
  let canvas = document.querySelector('#canvas')
  let stage = new createjs.Stage(canvas)
  let container = new createjs.Container()
  let tempContainer = new createjs.Container()
  stage.addChild(container,tempContainer)
  createjs.Ticker.setFPS(60)
  createjs.Ticker.addEventListener('tick',stage)

  let img = await createImg(pic_url).then(e=>e)
  container.addChild(img)

  let insertRect = function(){
    tempContainer.removeAllChildren()
    
    if(tempRect.type == 'rect'){
      let shape = new createjs.Shape()
      shape.graphics.beginStroke("red").setStrokeStyle(1).drawRect(tempRect.x,tempRect.y,tempRect.moveX-tempRect.x,tempRect.moveY-tempRect.y);
      tempRect.type = 'rect';
      tempContainer.addChild(shape);
    } 
    if(tempRect.type == 'line'){
      let shape = new createjs.Shape()
      shape.graphics.beginStroke("red").setStrokeStyle(1).moveTo(tempRect.x,tempRect.y).lineTo(tempRect.moveX,tempRect.moveY)
      tempRect.type = 'line';
      tempContainer.addChild(shape)
    }
    
  }
  let insertRectB = function(){
    tempContainer.removeAllChildren()
    container.removeAllChildren()
    container.addChild(img)
    records.forEach(tempRect => {
      if(tempRect.type == 'rect'){
        let shape = new createjs.Shape()
        shape.graphics.beginStroke("red").setStrokeStyle(1).drawRect(tempRect.x,tempRect.y,tempRect.moveX-tempRect.x,tempRect.moveY-tempRect.y);
        tempRect.type = 'rect';
        container.addChild(shape);
      }
      if(tempRect.type == 'line'){
        let shape = new createjs.Shape()
        shape.graphics.beginStroke("red").setStrokeStyle(1).moveTo(tempRect.x,tempRect.y).lineTo(tempRect.moveX,tempRect.moveY)
        tempRect.type = 'line';
        container.addChild(shape)  
      }
    })
  }
  
  let cX = 0
  let cY = 0
  stage.addEventListener('mousedown',function(e){
    cX = e.stageX -container.x
    cY = e.stageY -container.y
    if(stateButton.innerText == '移动'){
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
  backButton.onclick = function(){
    records.pop()
    insertRectB()
  }
  moveButton.click()
}
createCanvas('http://p1.qhimgs4.com/t0142306e875d3a2fff.jpg')