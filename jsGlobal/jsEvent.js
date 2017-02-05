function createEventObj(event){
  event = {
    id : null,
    cx : -1,
    cy : -1,
    radius : 20,
    innerRadius : -1,
    type : "",
    position : -1,
    text : null,
    connectors : [[-1, -1], [-1, -1], [-1, -1], [-1, -1]],
    connectorID : []
  };
  return event;
}

function assignEventId(event){
  if(event.type=="startEvent"){
    event.id = "event_start";
  }
  else if(event.type=="endEvent"){
    event.id = "event_end_" + globalEvents.length;
  }
  else if(event.type=="eventHolder"){
    event.id = "event_" + globalEvents.length;
  }
  return event;
}

function calculateEventConnectors(event){
  event.connectors[0] = [event.cx - event.radius, event.cy];
  event.connectors[1] = [event.cx, event.cy - event.radius];
  event.connectors[2] = [event.cx + event.radius, event.cy];
  event.connectors[3] = [event.cx, event.cy + event.radius];
  return event;
}

function calculateEventInnerRadius(event){
  if(event.type=="eventHolder"){
    event.innerRadius = event.radius-3;
  }
  return event;
}

function drawEvent(canvas, event){
  var newEvent = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  newEvent.setAttribute("id", event.id);
  newEvent.setAttribute("cx", event.cx);
  newEvent.setAttribute("cy", event.cy);
  newEvent.setAttribute("r", event.radius);
  newEvent.setAttribute("fill", "white");
  newEvent.setAttribute("stroke", "black");
  if(event.type=="endEvent"){
    newEvent.setAttribute("stroke-width", "5");
  }
  newEvent.setAttribute("parent", event.id);
  newEvent.setAttribute("onmouseup", "processMouseUp(event)");
  newEvent.setAttribute("onmousedown", "processMouseDown(event)");
  jQuery(canvas).append(newEvent);
  if(event.type=="eventHolder"){
    var newInnerEvent = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newInnerEvent.setAttribute("id", event.id + "_inner");
    newInnerEvent.setAttribute("cx", event.cx);
    newInnerEvent.setAttribute("cy", event.cy);
    newInnerEvent.setAttribute("r", event.radius-3);
    newInnerEvent.setAttribute("fill", "white");
    newInnerEvent.setAttribute("stroke", "black");
    newInnerEvent.setAttribute("parent", event.id);
    newInnerEvent.setAttribute("onmouseup", "processMouseUp(event)");
    newInnerEvent.setAttribute("onmousedown", "processMouseDown(event)");
    jQuery(canvas).append(newInnerEvent);
  }

  if(event.type=="startEvent"){
    disableStartEventIcon();
  }
}

function disableStartEventIcon(){
  jQuery('#startEvent').attr('draggable', 'false');
  jQuery('#startEvent').attr('ondragstart', 'function(){return false;}');
}

function canCreateEvent(eventType){
  if(~eventType.indexOf("start")){
    var startEvent = getStartEvent();
    if(startEvent==null){
      return true;
    }
    return false;
  }
  return true;
}

function createEvent(canvas, offsetX, offsetY, eventType){
  if(canCreateEvent(eventType)){
    var event;
    event = createEventObj(event);
    event.cx = offsetX;
    event.cy = offsetY;
    event.type = eventType;
    event = assignEventId(event);
    event = calculateEventConnectors(event);
    event = calculateEventInnerRadius(event);
    event.position = globalEvents.length;
    globalEvents[globalEvents.length] = event;
    drawEvent(convertIdToJQueryId(canvas), event);
  }
}

function getEvent(id){
  if(id.indexOf("_inner")!=-1){
    id = id.substring(0, id.indexOf("_inner"));
  }
  for(var i=0; i<globalEvents.length; i++){
    if(globalEvents[i].id==id){
      return globalEvents[i];
    }
  }
  return null;
}

function getStartEvent(){
  for(var i=0; i<globalEvents.length; i++){
    if(~globalEvents[i].id.indexOf("start")){
      return globalEvents[i];
    }
  }
  return null;
}

function drawDefaultEvent(id){
  var newEvent = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  newEvent.setAttribute("cx", 20);
  newEvent.setAttribute("cy", 20);
  newEvent.setAttribute("r", 15);
  newEvent.setAttribute("fill", "white");
  newEvent.setAttribute("stroke", "black");
  if(~id.indexOf("end")){
    newEvent.setAttribute("stroke-width", "3");
  }
  jQuery(convertIdToJQueryId(id)).append(newEvent);
  if(~id.indexOf("event")){
    var newInnerEvent = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newInnerEvent.setAttribute("cx", 20);
    newInnerEvent.setAttribute("cy", 20);
    newInnerEvent.setAttribute("r", 15-3);
    newInnerEvent.setAttribute("fill", "white");
    newInnerEvent.setAttribute("stroke", "black");
    jQuery(convertIdToJQueryId(id)).append(newInnerEvent);
  }
}
