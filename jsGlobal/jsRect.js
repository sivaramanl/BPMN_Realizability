//Global variable to contain Message Icon attributes
var msgCoordinates = {
  size : 20
};

//Function to create initial process object
function createProcessObj(process){
  process = {
    id : null,
    cx : -1,
    cy : -1,
    u : 20,
    width : 130,
    height : 60, //make sure its divisble by 10 & 3
    corners : [[-1, -1], [-1, -1], [-1, -1], [-1, -1]],
    connectors : [[-1, -1], [-1, -1], [-1, -1], [-1, -1]],
    connectorID : [],
    position : -1,
    text : null,
    parent : null,
    bands : []
  };
  return process;
}

function assignProcessId(process){
  process.id = "process_" + globalProcesses.length;
  return process;
}

function calculateProcessCorners(process){
  var x = process.cx - (process.width/2);
  var y = process.cy - (process.height/2);
  //Redefine the following after icon creation has been added to the project
  x = x<40?40:x;
  y = y<40?40:y;
  process.cx = x + (process.width/2);
  process.cy = y + (process.height/2);
  process.corners[0] = [x, y];
  process.corners[1] = [x + process.width, y];
  process.corners[2] = [x, y + process.height];
  process.corners[3] = [x + process.width, y + process.height];
  return process;
}

function calculateProcessConnectors(process){
  var x = process.width/2;
  var y = process.height/2;
  process.connectors[0] = [process.cx - x, process.cy];
  process.connectors[1] = [process.cx, process.cy - y];
  process.connectors[2] = [process.cx + x, process.cy];
  process.connectors[3] = [process.cx, process.cy + y];
  return process;
}

function calculateProcessBand(process, participantType, position){
  var maxBands = Math.floor(process.bands.length/2);
  var band = {
    id : process.id + "_band_" + maxBands + "_" + position,
    type : participantType,
    text : null,
    position : position,
    startPoint : [process.cx-(process.width/2), position=="top"?((process.cy-(process.height/2))+((maxBands+1)*process.u)):((process.cy+(process.height/2))-((maxBands+1)*process.u))],
    endPoint : [process.cx+(process.width/2), position=="top"?((process.cy-(process.height/2))+((maxBands+1)*process.u)):((process.cy+(process.height/2))-((maxBands+1)*process.u))]
  };
  return band;
}

function calculateProcessInitialBands(process){
  var band1 = calculateProcessBand(process, "receiver", "top");
  process.bands[process.bands.length] = band1;
  var band2 = calculateProcessBand(process, "sender", "bottom");
  process.bands[process.bands.length] = band2;
  return process;
}

function drawMsgIcon(canvas, process, curBand, multiplierVal){
  var mx = -1;
  var my = -1;
  var startx = -1;
  var starty = -1;
  var holdery = -1;
  var iconSize = msgCoordinates.size;
  if(curBand.position=="top"){
    mx = process.corners[1][0] - (multiplierVal*process.u);
    my = process.corners[1][1];
    holdery = my - (iconSize/2);
    startx = mx - (iconSize/2);
    starty = my - (1.5 * iconSize);
  }
  else{
    mx = process.corners[2][0] + (multiplierVal*process.u);
    my = process.corners[2][1];
    holdery = my + (iconSize/2);
    startx = mx - (iconSize/2);
    starty = my + (iconSize/2);
  }
  var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  var dVal = "M" + startx + " " + starty + " ";
  dVal += "L" + startx + " " + (starty+iconSize) + " ";
  dVal += "L" + (startx+iconSize) + " " + (starty + iconSize) + " ";
  dVal += "L" + (startx+iconSize) + " " + starty + " ";
  dVal += "L" + startx + " " + starty + " ";
  dVal += "L" + (startx+(iconSize/2)) + " " + (starty+(iconSize/2)) + " ";
  dVal += "L" + (startx+iconSize) + " " + starty + " ";
  dVal += "M" + mx + " " + holdery + " ";
  dVal += "L" + mx + " " + my + " ";
  dVal += "Z";
  path.setAttribute("d", dVal);
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "white");
  path.setAttribute("id", curBand.id + "_icon");
  path.setAttribute("parent", process.id);
  jQuery(canvas).append(path);
}

function drawBands(canvas, process){
  var topMsgIcon = 0;
  var bottomMsgIcon = 0;
  for(var i=0; i<process.bands.length; i++){
    var curBand = process.bands[i];
    var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttribute("id", curBand.id);
    line.setAttribute("x1", curBand.startPoint[0]);
    line.setAttribute("y1", curBand.startPoint[1]);
    line.setAttribute("x2", curBand.endPoint[0]);
    line.setAttribute("y2", curBand.endPoint[1]);
    line.setAttribute("stroke", "black");
    line.setAttribute("parent", process.id);
    jQuery(canvas).append(line);

    //Drawing msg icon for receiver
    if(curBand.type=="receiver"){
      curBand.position=="top"?drawMsgIcon(canvas, process, curBand,++topMsgIcon):drawMsgIcon(canvas, process, curBand,++bottomMsgIcon);
    }
  }
}

function drawProcess(canvas, process){
  var newProcess = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
  newProcess.setAttribute("id", process.id);
  newProcess.setAttribute("x", process.corners[0][0]);
  newProcess.setAttribute("y", process.corners[0][1]);
  newProcess.setAttribute("width", process.width);
  newProcess.setAttribute("height", process.height);
  newProcess.setAttribute("rx", 10);
  newProcess.setAttribute("ry", 10);
  newProcess.setAttribute("parent", process.id);
  newProcess.setAttribute("style", "fill:white;stroke:black;opacity:1");
  newProcess.setAttribute("onmousedown", "processMouseDown(event)");
  newProcess.setAttribute("onmouseup", "processMouseUp(event)");
  jQuery(canvas).append(newProcess);
  drawBands(canvas, process);
}

//Function to create and draw Process element
function createProcess(canvasID, offsetX, offsetY){
  var process;
  process = createProcessObj(process);
  process.cx = offsetX;
  process.cy = offsetY;
  process = assignProcessId(process);
  process = calculateProcessCorners(process);
  process = calculateProcessConnectors(process);
  process = calculateProcessInitialBands(process);
  process.position = globalProcesses.length;
  globalProcesses[globalProcesses.length] = process;
  drawProcess(convertIdToJQueryId(canvasID), process);
}

function getProcess(id){
  for(var i=0; i<globalProcesses.length; i++){
    if(globalProcesses[i].id==id){
      return globalProcesses[i];
    }
  }
  return null;
}

function drawDefaultProcess(id){
  var newProcess = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
  newProcess.setAttribute("x", 5);
  newProcess.setAttribute("y", 5);
  newProcess.setAttribute("width", 70);
  newProcess.setAttribute("height", 30);
  newProcess.setAttribute("rx", 5);
  newProcess.setAttribute("ry", 5);
  newProcess.setAttribute("style", "fill:white;stroke:black;opacity:1");
  jQuery(convertIdToJQueryId(id)).append(newProcess);

  var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  line.setAttribute("x1", 5);
  line.setAttribute("y1", 15);
  line.setAttribute("x2", 75);
  line.setAttribute("y2", 15);
  line.setAttribute("stroke", "black");
  jQuery(convertIdToJQueryId(id)).append(line);

  line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
  line.setAttribute("x1", 5);
  line.setAttribute("y1", 25);
  line.setAttribute("x2", 75);
  line.setAttribute("y2", 25);
  line.setAttribute("stroke", "black");
  jQuery(convertIdToJQueryId(id)).append(line);
}
