function createSelectorObj(selector){
  selector = {
    id : null,
    cx : -1,
    cy : -1,
    width : 50,
    height : 50,
    position : -1,
    text : null,
    corners : [[-1, -1], [-1, -1], [-1, -1], [-1, -1]],
    connectors : [[-1, -1], [-1, -1], [-1, -1], [-1, -1]],
    connectorID : [],
    type : ""
  };
  return selector;
}

function assignSelectorId(selector){
  selector.id = "selector_" + globalSelectors.length;
  return selector;
}

function calculateSelectorCorners(selector){
  var hWidth = selector.width/2;
  var hHeight = selector.height/2;
  selector.corners[0] = [selector.cx - hWidth, selector.cy];
  selector.corners[1] = [selector.cx, selector.cy - hHeight];
  selector.corners[2] = [selector.cx + hWidth, selector.cy];
  selector.corners[3] = [selector.cx, selector.cy + hHeight];
  return selector;
}

function calculateSelectorConnectors(selector){
  selector.connectors[0] = [selector.corners[0][0], selector.corners[0][1]];
  selector.connectors[1] = [selector.corners[1][0], selector.corners[1][1]];
  selector.connectors[2] = [selector.corners[2][0], selector.corners[2][1]];
  selector.connectors[3] = [selector.corners[3][0], selector.corners[3][1]];
  return selector;
}

function drawSelector(canvas, selector){
  var newSelector = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
  var pointsVal = "";
  for(var i=0; i<selector.corners.length; i++){
    pointsVal += selector.corners[i][0] + "," + selector.corners[i][1] + " ";
  }
  newSelector.setAttribute("id", selector.id);
  newSelector.setAttribute("points", pointsVal);
  newSelector.setAttribute("fill", "white");
  newSelector.setAttribute("parent", selector.id);
  if(selector.type=="parallel"){
    newSelector.setAttribute("stroke", "purple");
    newSelector.setAttribute("stroke-width", "3");
  }
  else if(selector.type=="join"){
    newSelector.setAttribute("stroke", "green");
  }
  else{
    newSelector.setAttribute("stroke", "black");
  }
  newSelector.setAttribute("onmouseup", "processMouseUp(event)");
  newSelector.setAttribute("onmousedown", "processMouseDown(event)");
  jQuery(canvas).append(newSelector);

  if(selector.type=="parallel"){
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute("id", selector.id + "_text");
    //text.setAttribute("x", selector.text.length>5?(selector.cx - (2 * (5 + 1))):(selector.cx - (2 * (selector.text.length + 1))));
    text.setAttribute("x", selector.cx-4);
    text.setAttribute("y", selector.cy + 3);
    text.setAttribute("fill", "black");
    text.setAttribute("class", "noselect");
    //text.setAttribute("class", "textContent");
    text.setAttribute("parent", selector.id);
    text.setAttribute("onmouseup", "processMouseUp(event)");
    text.setAttribute("onmousedown", "processMouseDown(event)");
    text.innerHTML = selector.text;
    jQuery(canvas).append(text);
    console.log(selector.text.length);
    console.log(selector.cx);
    console.log(selector.cy);
  }
}

function createSelector(canvas, offsetX, offsetY, selectorType){
  var selector;
  selector = createSelectorObj(selector);
  selector.cx = offsetX;
  selector.cy = offsetY;
  selector.type = selectorType;
  if(selectorType=="parallel"){
    selector.text = "||";
  }
  selector = assignSelectorId(selector);
  selector = calculateSelectorCorners(selector);
  selector = calculateSelectorConnectors(selector);
  selector.position = globalSelectors.length;
  globalSelectors[globalSelectors.length] = selector;
  drawSelector(convertIdToJQueryId(canvas), selector);
}

function getSelector(id){
  for(var i=0; i<globalSelectors.length; i++){
    if(globalSelectors[i].id==id){
      return globalSelectors[i];
    }
  }
  return null;
}

function drawDefaultSelector(id){
  var newSelector = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
  var pointsVal = "5,20 20,5 35,20 20,35";
  newSelector.setAttribute("points", pointsVal);
  newSelector.setAttribute("fill", "white");
  if(~id.indexOf("parallel")){
    newSelector.setAttribute("stroke", "purple");
    newSelector.setAttribute("stroke-width", "3");
  }
  else if(~id.indexOf("join")){
    newSelector.setAttribute("stroke", "green");
  }
  else{
    newSelector.setAttribute("stroke", "black");
  }
  jQuery(convertIdToJQueryId(id)).append(newSelector);
}
