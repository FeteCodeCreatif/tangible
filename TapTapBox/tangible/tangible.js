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
var colorSequence = []; //  colors to use
var editCursor = 0;  // step in sequence to insert new commande
var execCursor = 0; // step currently executed
var playLoop = false;

// Our list of available commands //
// colors : http://html-color-codes.info/color-names/
var colorStyles = {
  "yellow" : "stroke white \nstrokeSize 5 background black fill yellow\n",
  "deeppink" : "stroke white \nstrokeSize 5 background black fill deeppink\n",
  "lime" : "stroke white \nstrokeSize 5 background black fill lime\n",
  "white" : "stroke grey \nstrokeSize 5 background black fill white\n"
};

var commandList = {
"bounce" : "move 0, (sin((frame\/8)%120\/2)*1), 0 \nrotate (sin((frame\/12)%120\/2)*2),(sin((frame\/10)%120\/2)*2),(sin((frame\/13)%120\/2)*2)  \nbox",

"flip": "rotate(sin((frame/8)%240/6)*3)+2.99 move 0.5, 0.5, 0 box",

"grow" : "scale sin(frame%240\/200)+1.1 \nrotate frame%480\/500 \nbox",

"zoom" : "scale ((sin((frame/13)%240/3)*3)+2) \nrotate(0.3,1,(sin((frame/120)%240/3)*3)+2) \nbox"
};

/************
* Functions *
*************/

// executeCommand sends to livecodelab's editor the current command defined by the index execCursor

var executeCommand = function() {
      $('#im' + execCursor).removeClass();
      execCursor = (execCursor + 1) % 8; // next step

      while (!commandSequence[execCursor]) { //skipping empty steps
        execCursor = (execCursor + 1) % 8;
      }
      $('#im' + execCursor).addClass("execcursor");
      $('#im' + execCursor).addClass(colorSequence[execCursor]);
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

  $('#im' + execCursor).removeClass();
  commandSequence = [];
  editCursor = 0;
  $('#im' + editCursor).addClass("editcursor");
  
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

  var imageID = '#im' + editCursor;

  if(keyPressed == 37){ // 37 is Left Arrow key
    $(imageID).attr('src','bounce.png');
    commandSequence[editCursor] = colorStyles.yellow+commandList.bounce;
    colorSequence[editCursor] = "yellow";
  }
  if(keyPressed == 38){ // 38 is Up Arrow key
    $(imageID).attr('src','flip.png');
    commandSequence[editCursor] = colorStyles.lime+commandList.flip;
    colorSequence[editCursor] = "lime";
  }
  if(keyPressed == 39){ // 39 is Right Arrow key
    $(imageID).attr('src','grow.png');
    commandSequence[editCursor] = colorStyles.deeppink+commandList.grow;
        colorSequence[editCursor] = "deeppink";
  }
  if(keyPressed == 40){ // 40 is Down Arrow key
    $(imageID).attr('src','zoom.png');
    commandSequence[editCursor] = colorStyles.white+commandList.zoom;
    colorSequence[editCursor] = "white";
  }

  if((keyPressed == 37 || keyPressed == 38 || keyPressed == 39 || keyPressed == 40) && !playLoop){
    $('#im' + editCursor).removeClass("editcursor");
    editCursor = (editCursor + 1) % 8;
    $('#im' + editCursor).addClass("editcursor");
  }
  
  if(keyPressed == 71){ // 71 is G key
    clearSequence();
  }
  if(keyPressed == 32){ // 32 is Spacebar key
    if (commandSequence !== undefined && commandSequence.length !== 0 && !playLoop){
      
      $('#im' + editCursor).removeClass(); // clean edit position

      execCursor = 0; // first run
      $('#im' + execCursor).addClass("execcursor");
      $('#im' + execCursor).addClass(colorSequence[execCursor]);
      top.frames[0].editor.setValue(commandSequence[execCursor]);
      top.frames[1].focus();

      playLoop = setInterval(executeCommand, 2000); // then with delay
    }
  }
});
