function findDistance(startPoint, endPoint){
  return Math.sqrt(Math.pow(endPoint[0]-startPoint[0], 2) + Math.pow(endPoint[1]-startPoint[1], 2));
}

function calculateConnectorCoordinates(id, givenCoordinates){
  //console.log("givenCoordinates : " + givenCoordinates);
  var element = getElementObject(id);
  //console.log(element.id);
  if(element!=null){
    //console.log(element.cx);
    //console.log(element.cy);
    if(givenCoordinates[1]<element.cy){
      if(givenCoordinates[0]<element.cx){
        //sector 4
        var dist1 = findDistance(element.connectors[1], givenCoordinates);
        var dist2 = findDistance(element.connectors[0], givenCoordinates);
        if(dist1<dist2){
          //console.log("1");
          return element.connectors[1];
        }
        else{
          //console.log("2");
          return element.connectors[0];
        }
      }
      else{
        //sector 1
        var dist1 = findDistance(element.connectors[1], givenCoordinates);
        var dist2 = findDistance(element.connectors[2], givenCoordinates);
        if(dist1<dist2){
          //console.log("3");
          return element.connectors[1];
        }
        else{
          //console.log("4");
          return element.connectors[2];
        }
      }
    }
    else{
      if(givenCoordinates[0]<element.cx){
        //sector 3
        var dist1 = findDistance(element.connectors[0], givenCoordinates);
        var dist2 = findDistance(element.connectors[3], givenCoordinates);
        if(dist1<dist2){
          //console.log("5");
          return element.connectors[0];
        }
        else{
          //console.log("6");
          return element.connectors[3];
        }
      }
      else{
        //sector 2
        var dist1 = findDistance(element.connectors[2], givenCoordinates);
        var dist2 = findDistance(element.connectors[3], givenCoordinates);
        if(dist1<dist2){
          //console.log("7");
          return element.connectors[2];
        }
        else{
          //console.log("8");
          return element.connectors[3];
        }
      }
    }
  }
  return null;
}

function getElementType(id){
  if(id.indexOf("process")!=-1){
    return "process";
  }
  else if(id.indexOf("selector")!=-1){
    return "selector";
  }
  else if(id.indexOf("event")!=-1){
    return "event";
  }
  return null;
}

function getElementObject(id){
  var elementType = getElementType(id);
  if(elementType!=null){
    if(elementType=="process"){
      return getProcess(id);
    }
    else if(elementType=="selector"){
      return getSelector(id);
    }
    else if(elementType=="event"){
      return getEvent(id);
    }
  }
  return null;
}

function createConnectorObj(connector){
  connector = {
    start : [null, []],
    end : [null, []],
    id : null,
    text : null,
    position : -1
  };
  return connector;
}

function assignConnectorId(connector){
  connector.id = "connector_" + globalConnectors.length;
  return connector;
}

function updateElementToConnectors(elementId, connectorID, type){
  var elementType = getElementType(elementId);
  if(elementType!=null){
    var element = getElementObject(elementId);
    if(element!=null){
      if(elementType=="process"){
        globalProcesses[element.position].connectorID[globalProcesses[element.position].connectorID.length] = [connectorID, type];
      }
      else if(elementType=="selector"){
        globalSelectors[element.position].connectorID[globalSelectors[element.position].connectorID.length] = [connectorID, type];
      }
      else if(elementType=="event"){
        globalEvents[element.position].connectorID[globalEvents[element.position].connectorID.length] = [connectorID, type];
      }
    }
  }
}

function drawEndIdentifier(canvas, connector){
  var aPoint = connector.end[1];
  var verticalHeight = 10;
  var height = Math.sqrt(3) * verticalHeight / 2;
  var m = (connector.end[1][1] - connector.start[1][1]) / (connector.end[1][0] - connector.start[1][0]);

  //calculating point D coordinates
  var k = height / (Math.sqrt(1 + Math.pow(m,2)));
  var d = [];

  if(connector.end[1][0] < connector.start[1][0]){
    d[0] = aPoint[0] + k;
    d[1] = aPoint[1] + (k * m);
  }
  else{
    d[0] = aPoint[0] - k;
    d[1] = aPoint[1] - (k * m);
  }

  var m2 = -1/m;

  var k2 = (verticalHeight / 2) / (Math.sqrt(1 + Math.pow(m2,2)));

  var b = [];
  b[0] = d[0] + k2;
  b[1] = d[1] + (k2 * m2);

  var c = [];
  c[0] = d[0] - k2;
  c[1] = d[1] - (k2 * m2);

  var pointer = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
  var pointsVal = aPoint[0] + "," + aPoint[1] + " " + b[0] + "," + b[1] + " " + c[0] + "," + c[1];
  pointer.setAttribute("points", pointsVal);
  pointer.setAttribute("stroke", "red");
  pointer.setAttribute("fill", "red");
  jQuery(canvas).append(pointer);

  //console.log(d[0]);
  //console.log(d[1]);
  //console.log(m2);
}

function drawConnector(canvas, connector){
  var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  var dVal = "M" + connector.start[1][0] + " " + connector.start[1][1] + " ";
  dVal += "L" + connector.end[1][0] + " " + connector.end[1][1];
  path.setAttribute("d", dVal);
  path.setAttribute("id", connector.id);
  path.setAttribute("stroke", "red");
  path.setAttribute("fill", "white");
  jQuery(canvas).append(path);
  drawEndIdentifier(canvas, connector);
}

function canAddConnector(id1, id2){
  if(id1==id2){
    return false;
  }
  else{
    if(~id1.indexOf("event")){
      var element = getEvent(id1);
      if(~id1.indexOf("start")){
        if(element.connectorID.length!=0){
          return false;
        }
      }
      else if(~id1.indexOf("end")){
        return false;
      }
      else{
        for(var i=0; i<element.connectorID.length; i++){
          if(~element.connectorID[i][1].indexOf("start")){
            return false;
          }
        }
      }
    }
    else if(~id1.indexOf("process")){
      var element = getProcess(id1);
      for(var i=0; i<element.connectorID.length; i++){
        if(~element.connectorID[i][1].indexOf("start")){
          return false;
        }
      }
    }
    else if(~id1.indexOf("selector")){
      var element = getSelector(id1);
      var startC = 0;
      for(var i=0; i<element.connectorID.length; i++){
        if(~element.connectorID[i][1].indexOf("start")){
          if(++startC>1){
            return false;
          }
        }
      }
    }

    if(~id2.indexOf("event")){
      var element = getEvent(id2);
      if(~id2.indexOf("start")){
        return false;
      }
      else if(~id2.indexOf("end")){
        if(element.connectorID.length!=0){
          return false;
        }
      }
      else{
        for(var i=0; i<element.connectorID.length; i++){
          if(~element.connectorID[i][1].indexOf("end")){
            return false;
          }
        }
      }
    }
    else if(~id2.indexOf("process")){
      var element = getProcess(id2);
      for(var i=0; i<element.connectorID.length; i++){
        if(~element.connectorID[i][1].indexOf("end")){
          return false;
        }
      }
    }
    //To do - join element check to be added
    else if(~id2.indexOf("selector")){
      var element = getSelector(id2);
      for(var i=0; i<element.connectorID.length; i++){
        if(~element.connectorID[i][1].indexOf("end")){
          return false;
        }
      }
    }
  }
  return true;
}

function createConnector(id1, id2){
  if(canAddConnector(id1, id2)){
    console.log("true");
    var element2 = getElementObject(id2);
    var startCoordinates = calculateConnectorCoordinates(id1, [element2.cx, element2.cy]);
    var endCoordinates = startCoordinates!=null? calculateConnectorCoordinates(id2, startCoordinates) : null;
    //console.log(startCoordinates);
    //console.log(endCoordinates);
    if(startCoordinates!=null && endCoordinates!=null){
      var connector;
      connector = createConnectorObj(connector);
      connector = assignConnectorId(connector);
      connector.start = [id1, startCoordinates];
      connector.end = [id2, endCoordinates];
      updateElementToConnectors(id1, connector.id, "start");
      updateElementToConnectors(id2, connector.id, "end");
      connector.position = globalConnectors.length;
      globalConnectors[globalConnectors.length] = connector;
      drawConnector(convertIdToJQueryId(jQuery(convertIdToJQueryId(id1)).parent().attr('id')), connector);
    }
  }
}

function markConnector(){
  connectorSwitch = !connectorSwitch;
  if(connectorSwitch){
    jQuery('#defaultConnectorH').attr('style', 'fill:black;');
    jQuery('#defaultConnectorC').attr('fill', 'black');
  }
  else{
    jQuery('#defaultConnectorH').attr('style', 'fill:white;');
    jQuery('#defaultConnectorC').attr('fill', 'white');
  }
}

function drawDefaultConnector(id){
  var newHighlight = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
  newHighlight.setAttribute("id", "defaultConnectorH");
  newHighlight.setAttribute("x", 0);
  newHighlight.setAttribute("y", 0);
  newHighlight.setAttribute("width", 40);
  newHighlight.setAttribute("height", 40);
  newHighlight.setAttribute("style", "fill:white;");
  jQuery(convertIdToJQueryId(id)).append(newHighlight);
  var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  var dVal = "M5,10 L20,10 L20,30 L35,30";
  path.setAttribute("id", "defaultConnectorC");
  path.setAttribute("d", dVal);
  path.setAttribute("stroke", "red");
  path.setAttribute("fill", "white");
  jQuery(convertIdToJQueryId(id)).append(path);
  var pointer = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
  var pointsVal = "35,30 30,25 30,35";
  pointer.setAttribute("points", pointsVal);
  pointer.setAttribute("stroke", "red");
  pointer.setAttribute("fill", "red");
  jQuery(convertIdToJQueryId(id)).append(pointer);
}
