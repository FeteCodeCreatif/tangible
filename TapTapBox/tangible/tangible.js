/***********************************************
*                                              *
*                   TANGIBLE                   *
*                                              *
************************************************/

var edit_cursor = 0;
var exec_cursor = 0;
var command_list = [
  "rotate blue box",
  "rotate white ball",
  "rotate red ball",
  "rotate move yellow box",
  "move black box"
]
var commands = ["box"];



var curs2im = function(edit_cursor){
  return '#im' + edit_cursor;
};

var send_command = function(command_index){
  console.log((commands[command_index]));
  top.frames[0].editor.setValue(commands[command_index]);
}

var execute_buffer = function(){
  while (!commands[exec_cursor]){
    exec_cursor = (exec_cursor+1)%8
  }
  console.log(exec_cursor);
  send_command(exec_cursor);
  exec_cursor = (exec_cursor+1)%8

}


setInterval(execute_buffer, 1000);

var clear = function(){
  $('#im0').attr('src','vide.png');
  $('#im1').attr('src','vide.png');
  $('#im2').attr('src','vide.png');
  $('#im3').attr('src','vide.png');
  $('#im4').attr('src','vide.png');
  $('#im5').attr('src','vide.png');
  $('#im6').attr('src','vide.png');
  $('#im7').attr('src','vide.png');
  edit_cursor = 0;
  commands = [];
};

$(document).keyup(function(touche){ // on écoute l'évènement keyup()

  var appui = touche.which || touche.keyCode; // le code est compatible tous navigateurs grâce à ces deux propriétés
  var image = curs2im(edit_cursor);

  if(appui == 37){ // si le code de la touche est égal à 37 (Gauche)
    //top.frames[0].editor.setValue("rotate blue box");
    $(image).attr('src','bounce.png');
    commands[edit_cursor] = command_list[0];
    //send_command(edit_cursor );
    //execute_buffer();
    console.log(commands);
    edit_cursor = (edit_cursor + 1) %8;
  }
  if(appui == 38){ // si le code de la touche est égal à 38 (Haut)
    //top.frames[0].editor.setValue("rotate white ball");
    $(image).attr('src','flip.png');
    commands[edit_cursor] = command_list[1];
    //execute_buffer();
    console.log(commands);
    edit_cursor = (edit_cursor + 1) %8;
  }
  if(appui == 39){ // si le code de la touche est égal à 39 (Droite)
    //top.frames[0].editor.setValue("rotate red ball");
    $(image).attr('src','grow.png');
    commands[edit_cursor] = command_list[2];
    //execute_buffer();
    console.log(commands);
    edit_cursor = (edit_cursor + 1) %8;
  }
  if(appui == 40){ // si le code de la touche est égal à 40 (Bas)
    //top.frames[0].editor.setValue("rotate move yellow box");
    $(image).attr('src','zoom.png');
    commands[edit_cursor] = command_list[3];
    //execute_buffer();
    console.log(commands);
    edit_cursor = (edit_cursor + 1) %8;
  }
  if(appui == 32){ // si le code de la touche est égal à 31 (Espace)
    //top.frames[0].editor.setValue("move black box");
    $(image).attr('src','commande_6.png');
    commands[edit_cursor] = command_list[4];
    //execute_buffer();
    console.log(commands);
    edit_cursor = (edit_cursor + 1) %8;
  }
  if(appui == 71){ // si le code de la touche est égal à 71 (g)
    clear();
  }
});
