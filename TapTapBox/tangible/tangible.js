/***********************************************
*                                              *
*                   TANGIBLE                   *
*                                              *
************************************************/

/**************
* Definitions *
***************/
var neutralCommand = "stroke grey \nstrokeSize (sin((frame\/10)%240\/8)*200)+199 \nbackground black \nrotate(0.3,1,0) \nwhite box";
var commandSequence = []; // commands to execute
var editCursor = 0;  // step in sequence to insert new commande
var execCursor = 0; // step currently executed
var playLoop = false;

// Our list of available commands //
var commandList = {
"bounce" : "stroke grey \nstrokeSize 5 background  black \nmove 0, (sin((frame\/8)%120\/2)*1), 0 \nrotate (sin((frame\/12)%120\/2)*2),(sin((frame\/10)%120\/2)*2),(sin((frame\/13)%120\/2)*2)  \nwhite box",

"flip": "stroke grey \nstrokeSize 5 background  black \nrotate(sin((frame/8)%240/6)*3)+2.99 move 0.5, 0.5, 0 white box",

"grow" : "stroke grey \nstrokeSize 5 \nbackground  black \nscale sin(frame%240\/200)+1.1 \nrotate frame%480\/500 \nwhite box",

"zoom" : "stroke grey \nstrokeSize 5 background black \nscale ((sin((frame/13)%240/3)*3)+2) \nrotate(0.3,1,(sin((frame/120)%240/3)*3)+2) \nwhite box"
};

/************
* Functions *
*************/

// curs2im transforms the edition index into the id of the image in the visual representation of the sequence in index.html
  
var curs2im = function(editCursor){
  return '#im' + editCursor;
};


// executeCommand sends to livecodelab's editor the current command defined by the index execCursor

var executeCommand = function() {
      $('#im' + execCursor).removeClass("visiblecursor");
      execCursor = (execCursor + 1) % 8; // next step

      while (!commandSequence[execCursor]) { //skipping empty steps
        execCursor = (execCursor + 1) % 8;
      }
      $('#im' + execCursor).addClass("visiblecursor");
      top.frames[0].editor.setValue(commandSequence[execCursor]);
      top.frames[1].focus();
  };

var clearSequence = function(){
  $('#im0').attr('src','vide.png');
  $('#im1').attr('src','vide.png');
  $('#im2').attr('src','vide.png');
  $('#im3').attr('src','vide.png');
  $('#im4').attr('src','vide.png');
  $('#im5').attr('src','vide.png');
  $('#im6').attr('src','vide.png');
  $('#im7').attr('src','vide.png');

  $('#im' + execCursor).removeClass("visiblecursor");
  commandSequence = [];
  editCursor = 0;
  
  top.frames[0].editor.setValue(neutralCommand);
  top.frames[1].focus();
  
  clearInterval(playLoop);
  playLoop = false;

};

var initialisation = function(){
  if(top.frames[0].editor){
    clearSequence();
    $(top.frames[ "livecodelab" ].document).contents().find( ".menubar" ).css( "display", "none" );
    $(top.frames[ "livecodelab" ].document).contents().find( "body" ).css( "background", "black" );
    $(top.frames[ "livecodelab" ].document).contents().find( "#statsWidget" ).css( "display", "none" );
    $(top.frames[ "livecodelab" ].document).contents().find( ".CodeMirror-lines" ).css("opacity","0.5");
    top.frames[1].focus();
  }
  else{
    setTimeout(initialisation,100);
  }
};

initialisation();

// inserting a command in the buffer

$(document).keyup(function(touche){

  var keyPressed = touche.which || touche.keyCode;

  if (playLoop){
    editCursor = execCursor;
  }

  var image = curs2im(editCursor);

  if(keyPressed == 37){ // si le code de la touche est égal à 37 (Gauche)
    $(image).attr('src','bounce.png');
    commandSequence[editCursor] = commandList.bounce;
    editCursor = (editCursor + 1) %8;
  }
  if(keyPressed == 38){ // si le code de la touche est égal à 38 (Haut)
    $(image).attr('src','flip.png');
    commandSequence[editCursor] = commandList.flip;
    editCursor = (editCursor + 1) %8;
  }
  if(keyPressed == 39){ // si le code de la touche est égal à 39 (Droite)
    $(image).attr('src','grow.png');
    commandSequence[editCursor] = commandList.grow;
    editCursor = (editCursor + 1) %8;
  }
  if(keyPressed == 40){ // si le code de la touche est égal à 40 (Bas)
    $(image).attr('src','zoom.png');
    commandSequence[editCursor] = commandList.zoom;
    editCursor = (editCursor + 1) %8;
  }
  
  if(keyPressed == 71){ // si le code de la touche est égal à 71 (g)
    clearSequence();
  }
  if(keyPressed == 32){ // si le code de la touche est égal à 32 (Spacebar)
    if (commandSequence !== undefined && commandSequence.length !== 0 && !playLoop){
      
      execCursor = 0; // first run
      $('#im' + execCursor).addClass("visiblecursor");
      top.frames[0].editor.setValue(commandSequence[execCursor]);
      top.frames[1].focus();
      playLoop = setInterval(executeCommand, 2000); // then with delay
    }
  }
});
