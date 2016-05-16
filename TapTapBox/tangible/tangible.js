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

/***********
* Tracking *
************/

startWebcam = function() {
  
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.createElement('video');
    var detector;
  
    try {
      compatibility.getUserMedia({video: true}, function(stream) {
        try {
          video.src = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          video.src = stream;
        }
        compatibility.requestAnimationFrame(play);
      }, function (error) {
        alert("WebRTC not available. Try https://");
      });
    } catch (error) {
      alert(error);
    }
  
    var symbolPositionPrevious;
    var commandAlreadyAdded;
    var angle = [0, 0];
    
    function play() {
      compatibility.requestAnimationFrame(play);
      if (video.paused) video.play();
          
          // Draw video overlay:
      canvas.width = ~~(100 * video.videoWidth / video.videoHeight);
      canvas.height = 100;
      context.drawImage(video, 0, 0, canvas.clientWidth, canvas.clientHeight);
      
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      
        // Prepare the detector once the video dimensions are known:
              if (!detector) {
              var width = ~~(140 * video.videoWidth / video.videoHeight);
          var height = 140;
              detector = new objectdetect.detector(width, height, 1.1, objectdetect.handfist);
            }
              
  
              // Perform the actual detection. Multiple object give multiple coordinates.
        var allCoords = detector.detect(video, 1);
        
        if (allCoords[0]) {
          var coord = allCoords[0];
          
          // Rescale coordinates from detector to video coordinate space:
          coord[0] *= video.videoWidth / detector.canvas.width;
          coord[1] *= video.videoHeight / detector.canvas.height;
          coord[2] *= video.videoWidth / detector.canvas.width;
          coord[3] *= video.videoHeight / detector.canvas.height;
          
          var symbolPosition = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
          
          if (symbolPositionPrevious) {
            var dx = (symbolPosition[0] - symbolPositionPrevious[0]) / video.videoWidth,
              dy = (symbolPosition[1] - symbolPositionPrevious[1]) / video.videoHeight;
            
            if (dx*dx + dy*dy < 0.2) {
              angle[0] += 5.0 * dx;
              angle[1] += 5.0 * dy;
            }
            symbolPositionPrevious = symbolPosition;
          } else if (coord[4] > 2) {
            symbolPositionPrevious = symbolPosition;
          }
      
  
          // Draw coordinates on video overlay:
          context.beginPath();
          context.lineWidth = '2';
          context.fillStyle = symbolPositionPrevious ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)';
          context.fillRect(
            coord[0] / video.videoWidth * canvas.clientWidth,
            coord[1] / video.videoHeight * canvas.clientHeight,
            coord[2] / video.videoWidth * canvas.clientWidth,
            coord[3] / video.videoHeight * canvas.clientHeight);
          context.stroke();

          if (symbolPositionPrevious && !commandAlreadyAdded) { // if the detection is steady
          var imageID = '#im' + editCursor;
          $(imageID).attr('src', 'bounce.png');
          commandSequence[editCursor] = colorStyles.yellow + commandList.bounce;
          colorSequence[editCursor] = "yellow";

          $('#im' + editCursor).removeClass("editcursor");
          editCursor = (editCursor + 1) % 8;
          $('#im' + editCursor).addClass("editcursor");

          commandAlreadyAdded = true;
        }
        } else {
          symbolPositionPrevious = null;
          commandAlreadyAdded = false;
        }
      }
    }
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

    startWebcam();
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
