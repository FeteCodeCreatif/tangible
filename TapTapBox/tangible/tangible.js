/***********************************************
*                                              *
*                   TANGIBLE                   *
*                                              *
************************************************/

/**************
* Definitions *
***************/
var commands = ["box"]; // The buffer of current commands
var editCursor = 0;  // the index of the command to be edited next
var execCursor = 0; // the index of the command currently executed

// Our list of available commands //
var commandList = [
  "rotate blue box",
  "rotate white ball",
  "rotate red ball",
  "rotate move yellow box",
  "move black box"
];

var boucleExec = false; // to avoid an error on initialisation


/************
* Functions *
*************/

// curs2im transforms the edition index into the id of the image in our visual
//         buffer in index.html
var curs2im = function(editCursor){
  return '#im' + editCursor;
};

// logBuffer logs the current state of our command buffer
var logBuffer = function(){
  console.log("Commands currently bufferized for execution : ");
  console.log(commands);
}

// sendCommand sets the content of livecodelab's editor to the command in our
//             command buffer at the index commandIndex
var sendCommand = function(commandIndex){
  top.frames[0].editor.setValue(commands[commandIndex]);
}

// executeBuffer sends to livecodelab's editor the current command defined by
//               the index execCursor and
var executeBuffer = function(){
  while (!commands[execCursor]){
    execCursor = (execCursor+1)%8
  }
  sendCommand(execCursor);
  execCursor = (execCursor+1)%8
}

var play = function(){
  var boucleExec = setInterval(executeBuffer, 1000);
}

var clearBuffer = function(){
  $('#im0').attr('src','vide.png');
  $('#im1').attr('src','vide.png');
  $('#im2').attr('src','vide.png');
  $('#im3').attr('src','vide.png');
  $('#im4').attr('src','vide.png');
  $('#im5').attr('src','vide.png');
  $('#im6').attr('src','vide.png');
  $('#im7').attr('src','vide.png');
  editCursor = 0;
  commands = ["box"];
  executeBuffer();
  if(boucleExec){
    clearInterval(boucleExec);
  }
};

var initialisation = function(){
  if(top.frames[0].editor){
    clearBuffer();
  }
  else{
    setTimeout(initialisation,100);
  }
}

initialisation();

$(document).keyup(function(touche){ // on écoute l'évènement keyup()

  var appui = touche.which || touche.keyCode; // le code est compatible tous navigateurs grâce à ces deux propriétés
  var image = curs2im(editCursor);

  if(appui == 37){ // si le code de la touche est égal à 37 (Gauche)
    $(image).attr('src','bounce.png');
    commands[editCursor] = commandList[0];
    logBuffer();
    editCursor = (editCursor + 1) %8;
  }
  if(appui == 38){ // si le code de la touche est égal à 38 (Haut)
    $(image).attr('src','flip.png');
    commands[editCursor] = commandList[1];
    logBuffer();
    editCursor = (editCursor + 1) %8;
  }
  if(appui == 39){ // si le code de la touche est égal à 39 (Droite)
    $(image).attr('src','grow.png');
    commands[editCursor] = commandList[2];
    logBuffer();
    editCursor = (editCursor + 1) %8;
  }
  if(appui == 40){ // si le code de la touche est égal à 40 (Bas)
    $(image).attr('src','zoom.png');
    commands[editCursor] = commandList[3];
    logBuffer();
    editCursor = (editCursor + 1) %8;
  }
  if(appui == 71){ // si le code de la touche est égal à 71 (g)
    clearBuffer();
  }
  if(appui == 32){ // si le code de la touche est égal à 32 (Entrée)
    play();
  }
});
