/* 
     © 2009 ROBO Design
     http://www.robodesign.ro
     License: Creative Commons 3.0 BY-SA
     Source: http://dev.opera.com/articles/view/html5-canvas-painting/
*/
 
/* 
     Random Pen Sizes and Colors Adaptation 
     Copyright © 2011 by Jake McCuistion 
*/

// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context;

  // Initialization sequence.
  function init () {
    // Find the canvas element.
    canvas = document.getElementById('imageView');
    if (!canvas) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvas.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    context = canvas.getContext('2d');
    if (!context) {
      alert('Error: failed to getContext!');
      return;
    }

    // Attach the mousemove event handler.
    canvas.addEventListener('mousemove', ev_mousemove, false);
  }


function randomFromTo(from, to){
       return Math.floor(Math.random() * (to - from + 1) + from);
    }

  // The mousemove event handler.
  var started = false;
	var savedwidth = 0;
	var i = 0;
  function ev_mousemove (ev) {
    var x, y, makewidth;
 i++;
    // Get the mouse position relative to the canvas element.
    if (ev.layerX || ev.layerX == 0) { // Firefox
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }

	/*if ((started) && ((x <= (savedx+5)) || (y <= (savedy+5)) || (x >= (savedx+5)) || (y >= (savedy+5)))) { //x or y changed
		savedx = x;
		savedy = y;
		
	  context.strokeStyle = "rgba(225, 225, 225, 0.0.9)";
	  context.lineWidth = 1;
		context.stroke();
      started = false;
	  context.closePath();
		
	}*/
    // The event handler works like a drawing pencil which tracks the mouse 
    // movements. We start drawing a path made up of lines.
    if (!started) {
      context.beginPath();
      context.moveTo(x, y);
	  //context.strokeStyle = "rgba(215, 97, 25, 0.0.9)";
	  //context.lineWidth = randomFromTo(1,10);
      started = true;
    } else {
	 
	  // = randomFromTo(1,3);
	  if (i <= 100) {
	  context.strokeStyle = "rgba(249, 203, 127, 0.9)";
	  } else if (i <= 200) {
	  context.strokeStyle = "rgba(229, 184, 114, 0.9)";
	  } else if (i <= 300) {
	  context.strokeStyle = "rgba(246, 192, 115, 0.9)";
	  } else if (i <= 400) {
	  context.strokeStyle = "rgba(240, 173, 94, 0.9)";
	  } else if (i <= 500) {
	  context.strokeStyle = "rgba(245, 176, 98, 0.9)";
	  } else if (i <= 600) {
	  context.strokeStyle = "rgba(240, 173, 94, 0.9)";
	  } else if (i <= 700) {
	  context.strokeStyle = "rgba(246, 192, 115, 0.9)";
	  } else if (i <= 800) {
	  context.strokeStyle = "rgba(247, 197, 120, 0.9)";
	  }
	  if (i == 800) {
		i =0;  
	  }
	 // context.strokeStyle = "rgba("+randomFromTo(240,246)+", "+randomFromTo(173,192)+", "+randomFromTo(94,115)+", 0.9)";
	  makewidth = (randomFromTo(1,50) + savedwidth)/2;
	  context.lineWidth = makewidth;
      context.lineTo(x, y);
	  context.lineCap="round";
      context.stroke();
      //started = false;
	  context.closePath();
      context.beginPath();
      context.moveTo(x, y); 
	  savedwidth = makewidth;
    }
  }

  init();
}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
