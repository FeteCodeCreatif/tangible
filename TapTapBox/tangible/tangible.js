/***********************************************
*                                              *
*                   TANGIBLE                   *
*                                              *
************************************************/

var cursor = 0;
var commandes = [];

var curs2im = function(cursor){
  return '#im' + cursor;
};

var clear = function(){
  $('#im0').attr('src','vide.png');
  $('#im1').attr('src','vide.png');
  $('#im2').attr('src','vide.png');
  $('#im3').attr('src','vide.png');
  $('#im4').attr('src','vide.png');
  $('#im5').attr('src','vide.png');
  $('#im6').attr('src','vide.png');
  $('#im7').attr('src','vide.png');
  cursor = 0;
  commandes = [];
};

$(document).keyup(function(touche){ // on écoute l'évènement keyup()

  var appui = touche.which || touche.keyCode; // le code est compatible tous navigateurs grâce à ces deux propriétés
  var image = curs2im(cursor);

  if(appui == 37){ // si le code de la touche est égal à 37 (Gauche)
    top.frames[0].editor.setValue("rotate blue box");
    $(image).attr('src','commande_2.png');
    commandes[cursor] = "commande_2";
    cursor = (cursor + 1) %8;
  }
  if(appui == 38){ // si le code de la touche est égal à 38 (Haut)
    top.frames[0].editor.setValue("rotate white ball");
    $(image).attr('src','commande_3.png');
    commandes[cursor] = "commande_3";
    cursor = (cursor + 1) %8;
  }
  if(appui == 39){ // si le code de la touche est égal à 39 (Droite)
    top.frames[0].editor.setValue("rotate red ball");
    $(image).attr('src','commande_4.png');
    commandes[cursor] = "commande_4";
    cursor = (cursor + 1) %8;
  }
  if(appui == 40){ // si le code de la touche est égal à 40 (Bas)
    top.frames[0].editor.setValue("rotate move yellow box");
    $(image).attr('src','commande_5.png');
    commandes[cursor] = "commande_5";
    cursor = (cursor + 1) %8;
  }
  if(appui == 32){ // si le code de la touche est égal à 31 (Espace)
    top.frames[0].editor.setValue("move black box");
    $(image).attr('src','commande_6.png');
    commandes[cursor] = "commande_6";
    cursor = (cursor + 1) %8;
  }
  if(appui == 71){ // si le code de la touche est égal à 71 (g)
    clear();
  }
});
