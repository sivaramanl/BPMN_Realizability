//Global variables
var wHeight, wWidth;

var globalProcesses = [];
var globalSelectors = [];
var globalConnectors = [];
var globalEvents = [];

var connectorSwitch = false;

jQuery(document).ready(function(){
            wHeight = jQuery(window).height();
            //window.alert(wHeight);
            wWidth = jQuery(window).width();
            //window.alert(wWidth);

            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id","defaultSvg");
            jQuery("#drawSvg").append(svg);

            calculateDivAttributes();

            drawPickerElements();

            /*
            var c = document.getElementById("MyCanvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(0,0,150,75);
            */
});

function calculateDivAttributes(){
  var module = document.getElementById("module").value;
  if(module!=null){
    switch (module) {
      case "blank":
          calculateHeaderAttribute("header");
          calulatePickerAttribute("Element_Picker");
          calculateSvgAttribute("drawSvg");
        break;
      default:
        //to be handled
    }
  }
}

function calculateHeaderAttribute(id){
  if(id!=null){
    id=convertIdToJQueryId(id);
    jQuery(id).css("height",wHeight/10);
    //jQuery(id).css("border-style","solid");
    jQuery(id).show();
  }
}

function calulatePickerAttribute(id){
  if(id!=null){
    id=convertIdToJQueryId(id);
    jQuery(id).css("width",wWidth);
    jQuery(id).css("max-height",(wHeight/10)*2);
    //jQuery(id).css("border-style","solid");
    jQuery(id).show();
  }
}

function convertIdToJQueryId(id){
  if(id!=null){
    return "#" + id;
  }
  return null;
}

function calculateSvgAttribute(id){
  if(id!=null){
    id=convertIdToJQueryId(id);
    jQuery(id).css("max-height",(wHeight/10)*7);
    //jQuery(id).css("width",(wWidth/5)*3.5);
    jQuery(id).css("height",(wHeight/10)*7);
    jQuery(id).css("border-style","solid");
    //jQuery(id).show();
    jQuery("#defaultSvg").css("width",wWidth);
    jQuery("#defaultSvg").css("height",(wHeight/10)*7);
  }
}

function overrideDefaultHandling(ev){
  ev.preventDefault();
}

function markElement(ev,id){
  if(id!=null && id!="undefined"){
    ev.dataTransfer.setData("element", id);
  }
  else{
    ev.dataTransfer.setData("element", "null");
  }
}

function addElement(ev){
  ev.preventDefault();
  var element = ev.dataTransfer.getData("element");
  var mouseX = ev.offsetX;
  var mouseY = ev.offsetY;
  //console.log(mouseX);
  //console.log(mouseY);
  if(element=="null"){
    console.log("Unexpected behavior");
  }
  else{
    if(element=="process"){
      createProcess(ev.target.id, mouseX, mouseY);
    }
    else if(element=="selector" || element=="parallel" || element=="join"){
      createSelector(ev.target.id, mouseX, mouseY, element);
    }
    else if(element=="startEvent" || element=="endEvent" || element=="eventHolder"){
      createEvent(ev.target.id, mouseX, mouseY, element);
    }
  }
}

var id1, id2;

function processMouseDown(ev){
  var id = jQuery(convertIdToJQueryId(ev.target.id)).attr('parent');
  console.log(id);
  if(connectorSwitch && id!=null && id!="undefined"){
    console.log(id);
    id1 = id;
  }
}

function processMouseUp(ev){
  ev.preventDefault();
  if(connectorSwitch){
    id2 = jQuery(convertIdToJQueryId(ev.target.id)).attr('parent');
    //console.log("Element 1 : " + id1);
    //console.log("Element 2 : " + id2);
    createConnector(id1, id2);
  }
  id1 = null;
  id2 = null;
}


function drawPickerElements(){
  drawDefaultEvent("startEventSvg");
  drawDefaultEvent("eventSvg");
  drawDefaultEvent("endEventSvg");
  drawDefaultSelector("selectorSvg");
  drawDefaultSelector("parallelSvg");
  drawDefaultSelector("joinSvg");
  drawDefaultProcess("processSvg");
  drawDefaultConnector("connectorSvg");
  return true;
}
