$(document).ready(function() {

$('#slider').ccslider({
effectType: '3d', 
effect: 'cubeRight', 
_3dOptions: { 
					imageWidth: 535,
					imageHeight: 351,
					innerSideColor: '#444',
					makeShadow: true,
					shadowColor: 'rgba(0, 0, 0, 0.7)',
					slices: 1,
					delay: 200,
					easing: 'easeInOutBack',
					fallBack: 'fadeSlide',
					fallBackSpeed: 1200
				},		
animSpeed: 2200,
startSlide: 0,	
directionNav: true,
controlLinks: true,
controlLinkThumbs: false,
controlThumbLocation: '',
autoPlay: true,
pauseTime: 3000,
pauseOnHover: true,
captions: true,
captionAnimation: 'slide',
captionAnimationSpeed: 600,
beforeSlideChange: function(index){},
afterSlideChange: function(index){}
});



/*$('#tweets').tweetable({limit: 3,                         //number of tweets to show
username: 'jakemccuistion',     //@username tweets to display
time: false,                     //display date
replies: false,                //filter out @replys
});*/


$('h1').hover(function() {
//$('.titleJake').css( {'z-index': '2'}).stop().animate( {
//top: '-26px', left: '15px'}, 'fast');
/*$('.titleMcCuistion').css( {'z-index': '-100'}).stop().animate( {
top: '10px', left: '-8px'}, 'fast');*/
},
function () {
//$('.titleJake').stop().animate( {
//top: '-14px', left: '7px', 'z-index': '1'}, 'fast');
/*$('.titleMcCuistion').css( {'z-index': '100'}).stop().animate( {
top: '0px', left: '0px'}, 'fast');*/
}); 
$(".ribbon").hover(
function () {
$('#beginRibbon img').stop(true, false).animate(
				{ left: 100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				}) 

$('.crossOverRibbon img').stop(true, false).delay(200).animate(
				{ left: -100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.crossBackRibbon img').stop(true, false).delay(200).animate(
				{ left: 100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.downRibbon img.a1').stop(true, false).delay(400).animate(
				{ top: 100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.downRibbon img.a2').stop(true, false).delay(600).animate(
				{ top: 100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.downRibbon img.a3').stop(true, false).delay(800).animate(
				{ top: 100 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
}
, function(){ 

$('#beginRibbon img').stop(true, false).delay(800).animate(
				{ left: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.crossOverRibbon img').stop(true, false).delay(600).animate(
				{ left: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
$('.crossBackRibbon img').stop(true, false).delay(600).animate(
				{ left: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
	 
$('.downRibbon img.a1').stop(true, false).delay(400).animate(
				{ top: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
	 
$('.downRibbon img.a2').stop(true, false).delay(200).animate(
				{ top: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
	 
$('.downRibbon img.a3').stop(true, false).animate(
				{ top: 0 }, {
						duration: 'slow',
						easing: 'easeOutBounce'
				})
});
$('.gotoAbout').click( function () {
$('html, body').animate({scrollTop: $("#about").offset().top}, 800);  
});
 $('.gotoPortfolio').click( function () {
$('html, body').animate({scrollTop: $("#portfolio").offset().top}, 800);  
});
 $('.gotoLikes').click( function () {
$('html, body').animate({scrollTop: $("#likes").offset().top}, 800);  
});
 $('.gotoSocial').click( function () {
$('html, body').animate({scrollTop: $("#social").offset().top}, 800);  
});
 $('.gotoContact').click( function () {
$('html, body').animate({scrollTop: $("#contact").offset().top}, 800);  
});
 $('.gotoIntro').click( function () {
$('html, body').animate({scrollTop: $("#nav").offset().top}, 800);  
});
	$("#nav a").hover(
function () {
$(this).stop(true, false).animate(
				{ 
backgroundColor: '#fcdca4',
color: '#3e252e' }, 0) ;
}
, function(){ 

$(this).stop(true, false).animate(
				{ 
backgroundColor: '#fbcf84',
color: '#a24c53' }, 800) ;

});

});