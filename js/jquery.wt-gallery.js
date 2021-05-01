/*
 * jQuery Image Gallery plugin
 * Copyright (c) 2010 Allan Ma (http://codecanyon.net/user/webtako)
 * Version: 1.31 (08/23/2010)
 */
;(function($) {
	$.fn.wtGallery = function(params) {		
		var INTERVAL_DELAY = 100;
		var DEFAULT_DELAY = 5000;
		var TOOLTIP_DELAY = 800;
		var TRANSPEED = 800;
		var SCROLL_SPEED = 600;
		var ANIMATE_SPEED = "normal";
		var STRIPE_SIZE = 50;
		var TOP = "top";
		var BOTTOM = "bottom";
		var BUTTON_OPACITY = 0.66;
		var TOOLTIP_Y = 25;
		
		var TRANSITIONS = new Array(25);		
		TRANSITIONS["fade"] 			= 0;		
		TRANSITIONS["vert.tl"] 			= 1;
		TRANSITIONS["vert.tr"] 			= 2;
		TRANSITIONS["vert.bl"] 			= 3;
		TRANSITIONS["vert.br"]  		= 4;		
		TRANSITIONS["fade.left"] 		= 5;				
		TRANSITIONS["fade.right"]		= 6;		
		TRANSITIONS["alt.left"]     	= 7;
		TRANSITIONS["alt.right"]    	= 8;
		TRANSITIONS["blinds.left"]  	= 9;
		TRANSITIONS["blinds.right"] 	= 10;
		TRANSITIONS["vert.random.fade"] = 11;	
		TRANSITIONS["horz.tl"] 			= 12;
		TRANSITIONS["horz.tr"] 			= 13;		
		TRANSITIONS["horz.bl"] 			= 14;
		TRANSITIONS["horz.br"]  		= 15;				
		TRANSITIONS["fade.top"] 		= 16;		
		TRANSITIONS["fade.bottom"]		= 17;
		TRANSITIONS["alt.top"]      	= 18;
		TRANSITIONS["alt.bottom"]   	= 19;
		TRANSITIONS["blinds.top"]   	= 20;
		TRANSITIONS["blinds.bottom"]	= 21; 
		TRANSITIONS["horz.random.fade"] = 22;	
		TRANSITIONS["random"]	        = 23;
		TRANSITIONS["none"] 		    = 24;
		
		//Vertical Stripes
		function VertStripes(rotator, w, h, size, bgColor, tranSpeed) {
			var areaWidth = w;
			var areaHeight = h;
			var stripeSize = size;
			var stripeArr;
			var $stripes;
			var intervalId = null;
			
			//init stripes
			var init = function() {		
				var len = Math.ceil(areaWidth/stripeSize);
				stripeArr = new Array(len);
				
				var divs = "";
				for (var i = 0; i < len; i++) {
					divs += "<div class='vpiece' id='" + i + "'></div>";					
				}					
				rotator.addToScreen(divs);
				
				$stripes = $("div.vpiece", rotator.$el);
				$stripes.each(
					function(n) {
						stripeArr[n] = $(this).css({left: (n * stripeSize), 
													 width: stripeSize, 
													 height: areaHeight});
					}							 
				);	
			}

			//clear animation
			this.clear = function() {
				clearInterval(intervalId);
				$stripes.stop().css({"z-index":2, opacity:0});
			}

			//display content
			this.displayContent = function(newImg, tran) {
				setPieces(newImg, tran);
				if (tran == TRANSITIONS["vert.random.fade"]) {
					animateRandom(newImg);
				}
				else {
					animate(newImg, tran);
				}
			}			
			
			//set image stripes
			var setPieces = function(newImg, tran) {
				if (tran == TRANSITIONS["vert.tl"] || tran == TRANSITIONS["vert.tr"]) {
					setVertPieces(newImg, -areaHeight, 0, stripeSize);
				}
				else if (tran == TRANSITIONS["vert.bl"] || tran == TRANSITIONS["vert.br"]) {
					setVertPieces(newImg, areaHeight, 0, stripeSize);
				}
				else if (tran == TRANSITIONS["alt.left"] || tran == TRANSITIONS["alt.right"]) {
					setAltVertPieces(newImg, 0);
				}
				else if (tran == TRANSITIONS["blinds.left"] || tran == TRANSITIONS["blinds.right"]) {
					setVertPieces(newImg, 0, 1, 0);
				}
				else {
					setVertPieces(newImg, 0, 0, stripeSize);
				}
			}
			
			//set vertical stripes
			var setVertPieces = function(newImg, topPos, opacity, size) {
				var newImgSrc = newImg.src;
				var tOffset = (areaHeight - newImg.height)/2;
				var lOffset = (areaWidth - newImg.width)/2;
				for (var i = 0; i < stripeArr.length; i++) {		
					var xPos =  ((-i * stripeSize) + lOffset);
					$(stripeArr[i]).css({
							"background":bgColor + " url('"+ newImgSrc +"') " + 
							xPos + "px " + tOffset + "px no-repeat",
							"backgroundPositionX":xPos + "px",
							"backgroundPositionY":tOffset + "px",
							opacity:opacity, top:topPos, width:size, "z-index":3});						
				}
			}
			
			//set alternative pos vertical stripes
			var setAltVertPieces = function(newImg, opacity) {
				var newImgSrc = newImg.src;
				var tOffset = (areaHeight - newImg.height)/2;
				var lOffset = (areaWidth - newImg.width)/2;
				for (var i = 0; i < stripeArr.length; i++) {		
					var xPos =  ((-i * stripeSize) + lOffset);
					var topPos = (i % 2) == 0 ? -areaHeight: areaHeight;
					$(stripeArr[i]).css({
							"background":bgColor + " url('"+ newImgSrc +"') " + 
							xPos + "px " + tOffset + "px no-repeat",
							"backgroundPositionX":xPos + "px",
							"backgroundPositionY":tOffset + "px",
							opacity:opacity, top:topPos, width:stripeSize, "z-index":3});						
				}
			}
			
			//animate random fade 
			var animateRandom = function(newImg) {					
				var count = 0;		
				var total = stripeArr.length;
				$stripes.each(	
					function(n) {
						$(this).delay(Math.random() * tranSpeed)
							   .animate({opacity:1}, tranSpeed, "",
							function() {
								count++;
								if (count == total) {
									rotator.setComplete(newImg);
								}
							}
						);
					}
				);
			}
			
			//animate stripes
			var animate = function(newImg, tran) {
				var lastVert = stripeArr.length - 1;
				if (tran == TRANSITIONS["vert.tl"] || tran == TRANSITIONS["vert.bl"] || 
					tran == TRANSITIONS["fade.left"] || tran == TRANSITIONS["blinds.left"] || 
					tran == TRANSITIONS["alt.left"]) {
					var i = 0;
					intervalId = setInterval(
						function() {
							$(stripeArr[i++]).animate({top: 0, opacity:1, width:stripeSize}, 
													  tranSpeed, "",
								function() {
									if ($(this).attr("id") == lastVert) {
										rotator.setComplete(newImg);
									}
								}
							);
		
							if (i == stripeArr.length) {
								clearInterval(intervalId);
							}
						}, INTERVAL_DELAY);			
				}
				else {
					var i = lastVert;
					intervalId = setInterval(
						function() {
							$(stripeArr[i--]).animate({top: 0, opacity:1, width:stripeSize}, 
													  tranSpeed, "",
								function() {
									if ($(this).attr("id") == 0) {
										rotator.setComplete(newImg);
									}
								}
							);
		
							if (i < 0) {
								clearInterval(intervalId);
							}
						}, INTERVAL_DELAY);
				}
			}
			
			init();
		}
		
		//Horizontal Stripes
		function HorzStripes(rotator, w, h, size, bgColor, tranSpeed) {
			var areaWidth = w;
			var areaHeight = h;
			var stripeSize = size;
			var stripeArr;
			var $stripes;
			var intervalId = null;
			
			//init stripes
			var init = function() {			
				stripeArr = new Array(Math.ceil(areaHeight/stripeSize));
				
				var divs = "";
				for (var i = 0; i < stripeArr.length; i++) {
					divs += "<div class='hpiece' id='" + i + "'></div>";
				}				
				rotator.addToScreen(divs);
				
				$stripes = $("div.hpiece", rotator.$el);				
				$stripes.each(
					function(n) {
						stripeArr[n] = $(this).css({top: (n * stripeSize), 
													width: areaWidth,
													height: stripeSize});
					}							 
				);
			}

			//clear animation
			this.clear = function() {
				clearInterval(intervalId);
				$stripes.stop().css({"z-index":2, opacity:0});
			}

			//display content
			this.displayContent = function(newImg, tran) {
				setPieces(newImg, tran);
				if (tran == TRANSITIONS["horz.random.fade"]) {
					animateRandom(newImg);
				}
				else {
					animate(newImg, tran);
				}
			}			
			
			//set image stripes
			var setPieces = function(newImg, tran) {
				if (tran == TRANSITIONS["horz.tr"] || tran == TRANSITIONS["horz.br"]) {
					setHorzPieces(newImg, areaWidth, 0, stripeSize);
				}
				else if (tran == TRANSITIONS["horz.tl"] || tran == TRANSITIONS["horz.bl"]) {
					setHorzPieces(newImg, -areaWidth, 0, stripeSize);					
				}
				else if (tran == TRANSITIONS["alt.top"] || tran == TRANSITIONS["alt.bottom"]) {
					setAltHorzPieces(newImg, 0);
				}
				else  if (tran == TRANSITIONS["blinds.top"] || tran == TRANSITIONS["blinds.bottom"]) {
					setHorzPieces(newImg, 0, 1, 0);
				}
				else {
					setHorzPieces(newImg, 0, 0, stripeSize);					
				}
			}
			
			//set horizontal stripes
			var setHorzPieces = function(newImg, leftPos, opacity, size) {
				var newImgSrc = newImg.src;
				var tOffset = (areaHeight - newImg.height)/2;
				var lOffset = (areaWidth - newImg.width)/2;
				for (var i = 0; i < stripeArr.length; i++) {			
					var yPos = ((-i * stripeSize) + tOffset);
					$(stripeArr[i]).css({
							"background":bgColor + " url('"+ newImgSrc +"') " + 
							lOffset + "px " + yPos  + "px no-repeat",
							"backgroundPositionX":lOffset  + "px",
							"backgroundPositionY":yPos + "px",
							opacity:opacity, left:leftPos, height:size,
							"z-index":3});			  
				}
			}
			
			//set alternative pos horizontal stripes
			var setAltHorzPieces = function(newImg, opacity) {
				var newImgSrc = newImg.src;
				var tOffset = (areaHeight - newImg.height)/2;
				var lOffset = (areaWidth - newImg.width)/2;
				for (var i = 0; i < stripeArr.length; i++) {			
					var yPos = ((-i * stripeSize) + tOffset);
					var leftPos = (i % 2) == 0 ? -areaWidth: areaWidth;
					$(stripeArr[i]).css({
							"background":bgColor + " url('"+ newImgSrc +"') " + 
							lOffset + "px " + yPos  + "px no-repeat",
							"backgroundPositionX":lOffset  + "px",
							"backgroundPositionY":yPos + "px",
							opacity:opacity, left:leftPos, height:stripeSize,
							"z-index":3});			  
				}
			}
			
			//animate random fade 
			var animateRandom = function(newImg) {					
				var count = 0;		
				var total = stripeArr.length;
				$stripes.each(	
					function(n) {
						$(this).delay(Math.random() * tranSpeed)
							   .animate({opacity:1}, tranSpeed, "",
							function() {
								count++;
								if (count == total) {
									rotator.setComplete(newImg);
								}
							}
						);
					}
				);
			}
			
			//animate stripes
			var animate = function(newImg, tran) {
				var lastHorz = stripeArr.length - 1;
				if (tran == TRANSITIONS["horz.tl"] || tran == TRANSITIONS["horz.tr"] || 
						 tran == TRANSITIONS["fade.top"] || tran == TRANSITIONS["blinds.top"] ||
						 tran == TRANSITIONS["alt.top"]) {
					var i = 0;
					intervalId = setInterval(
						function() {
							$(stripeArr[i++]).animate({left: 0, opacity:1, height:stripeSize}, 
													  tranSpeed, "",
								function() {
									if ($(this).attr("id") == lastHorz) {
										rotator.setComplete(newImg);
									}
								}
							);
		
							if (i == stripeArr.length) {
								clearInterval(intervalId);
							}
						}, INTERVAL_DELAY);
				}
				else {
					var i = lastHorz;
					intervalId = setInterval(
						function() {
							$(stripeArr[i--]).animate({left: 0, opacity:1, height:stripeSize}, 
													  tranSpeed, "",
								function() {
									if ($(this).attr("id") == 0) {
										rotator.setComplete(newImg);
									}
								}
							);
		
							if (i < 0) {
								clearInterval(intervalId);
							}
						}, INTERVAL_DELAY);
				}
			}
			
			init();
		}
		
		//Gallery Class
		function Gallery($obj, opts) {
			//set options
			var numDisplay = opts.num_display;
			var padding = opts.padding;
			var screenWidth = opts.screen_width;
			var screenHeight = opts.screen_height;
			var thumbWidth = opts.thumb_width;
			var thumbHeight = opts.thumb_height;
			var thumbMargin = opts.thumb_margin;
			var imageNavCirc = opts.image_nav_circ;
			var thumbNavCirc = opts.thumb_nav_circ;
			var displayTooltip = opts.thumb_tooltip;
			var displayImageNav = opts.image_nav;
			var displayImgNum = opts.image_number;
			var displayThumbNav = opts.thumb_nav;
			var displayPagination = opts.pagination;
			var displayThumbNum = opts.thumb_number;
			var displayArrow = opts.select_arrow;
			var mouseoverText = opts.mouseover_text;
			var mouseoverCaption = opts.mouseover_caption;
			var mouseoverDBtns = opts.mouseover_buttons;
			var descAlign = opts.text_panel_align;
			var captionAlign = opts.caption_align;
			var autoStart = opts.auto_rotate;
			var rotate = autoStart;			
			var delay = opts.delay > 0 ? opts.delay: DEFAULT_DELAY;
			var tranSpeed = opts.transition_speed > 0 ? opts.transition_speed : TRANSPEED;
			var scrollSpeed = opts.scroll_speed > 0 ? opts.scroll_speed : SCROLL_SPEED;
			var vertSize = opts.vert_size > 0 ? opts.vert_size : STRIPE_SIZE;
			var horzSize = opts.horz_size > 0 ? opts.horz_size : STRIPE_SIZE;
			
			var gTranNum = TRANSITIONS[opts.transition.toLowerCase()];
			if (gTranNum == undefined) {
				gTranNum = TRANSITIONS["fade"];
			}			

			var numItems;
			var unitSize;
			var backSlots;
			var fwdSlots;
			var numSlots;	
			var currIndex;
			var pos;
			var winColor;
			var imgPaths;
			var imgs;		
			var vStripes;
			var hStripes;
			var transNum;	
			var timerId = null;
			var screenHover = false;
			var selectedClass = "curr-thumb";
			
			var $gallery = 		$(".wt-gallery", $obj);			   
			var $thumbnails = 	$gallery.find(".thumbnails");	
			var $thumbList =	$thumbnails.find(">ul");
			var $thumbs	=		$thumbList.find(">li");
			var $thumbPanels = 	$thumbs.find(">div:first");
			var $mainScreen = 	$gallery.find(".main-screen");
			var $mainImg = 		$gallery.find("#main-img");
			var $bgImg;
			var $prevBtn = 		$gallery.find("#prev-btn");
			var $nextBtn = 		$gallery.find("#next-btn");
			var $desc = 		$gallery.find(".desc");
			var $tmpDesc;
			var $info = 		$gallery.find(".info-pane");
			var $cPanel = 		$gallery.find(".c-panel");
			var $thumbsBack = 	$gallery.find("#thumbs-back");
			var $thumbsFwd = 	$gallery.find("#thumbs-fwd");
			var $lowerPanel = 	$gallery.find(".lower-panel");
			var $pagination = 	$gallery.find(".pagination");
			var $thumbInfo =	$gallery.find(".thumb-info");
			var $preloader = 	$gallery.find(".preloader");
			var $tooltip;
			this.$el = $obj;
			
			this.init = function() {
				currIndex = 0;
				pos = 0;
				numItems = $thumbs.size();
				if (numItems < numDisplay) {
					numDisplay = numItems;
				}				
				numSlots = numItems - numDisplay;
				backSlots = 0;
				fwdSlots = numSlots;
				
				//init components
				initMainScreen();
				initThumbs();
				initThumbPanel();
				
				//config gallery 
				var galleryWidth;
				var galleryHeight = $mainScreen.outerHeight() + $cPanel.outerHeight();
				if ($mainScreen.outerWidth() >= $cPanel.outerWidth()) {
					galleryWidth = $mainScreen.outerWidth();
				}
				else {
					galleryWidth = $cPanel.outerWidth();
				}
				$gallery.css({width:galleryWidth, height:galleryHeight,
							  padding:padding}).hover(galleryOver, galleryOut);
				
				//init stripes
				vStripes =  new VertStripes(this, screenWidth, screenHeight, 
											vertSize, winColor, tranSpeed);
				hStripes =  new HorzStripes(this, screenWidth, screenHeight, 
											horzSize, winColor, tranSpeed);			
				
				//init image loading
				initImgLoad();
				
				//display initial image
				loadContent(currIndex);
				updatePagination();
			}
			
			//set main image
			this.setComplete = function(newImg) {
				setImgPadding(newImg);
				$mainImg.attr("src", newImg.src);
				startTimer();
			}
			
			//add to screen
			this.addToScreen = function(s) {
				$mainScreen.find(">a:first").append(s);
			}
			
			//config main screen
			var initMainScreen = function() {
				//config main screen window
				winColor = $mainScreen.css("background-color");
				$mainScreen.css({width:screenWidth, height:screenHeight});
				$mainImg.css("background-color", winColor);
				$mainScreen.append("<img id='bg-img' src='assets/spacer.png'/>");
				$bgImg = $mainScreen.find("#bg-img");
				$bgImg.css("background-color", winColor);
				
				//config text description 
				initDescription();
				
				//config directional buttons;
				initDButtons();
				
				//config preloader	
				$preloader.css({top: (screenHeight - $preloader.outerHeight())/2, 
								left:(screenWidth -  $preloader.outerWidth())/2});
			}
			
			//config image directional buttons
			var initDButtons = function() {				
				$prevBtn = 	$gallery.find("#prev-btn");
				$nextBtn = 	$gallery.find("#next-btn");
				if (displayImageNav) {
					$prevBtn.css({top:(screenHeight - $prevBtn.height())/2, display:"block"})
							.click(imgBack).mousedown(onMouseDown);
					$nextBtn.css({top:(screenHeight - $nextBtn.height())/2, display:"block"})
							.click(imgFwd).mousedown(onMouseDown);	
							
					if (mouseoverDBtns) {			
						$prevBtn.css({left:-$prevBtn.width()});
						$nextBtn.css({left:screenWidth});
						$mainScreen.hover(displayDButtons, hideDButtons);		
					}
					else {
						$prevBtn.css({left:0});
						$nextBtn.css({left:screenWidth - $nextBtn.width()});
					}
				}
				else {
					$prevBtn.css({display:"none"});
					$nextBtn.css({display:"none"});					
				}
			}
			
			//display image directional buttons
			var displayDButtons = function() {
				$prevBtn.stop().animate({left:0}, ANIMATE_SPEED);
				$nextBtn.stop().animate({left:screenWidth - $nextBtn.width()}, ANIMATE_SPEED);
			}

			//hide image directional buttons
			var hideDButtons = function() {
				$prevBtn.stop().animate({left:-$prevBtn.width()}, ANIMATE_SPEED);
				$nextBtn.stop().animate({left:screenWidth}, ANIMATE_SPEED);	
			}
			
			//config text description & info panel
			var initDescription = function() {
				var descProps;
				var infoProps;
				if (mouseoverText) {
					if (descAlign == BOTTOM) {
						descProps = {bottom:-$desc.outerHeight()};
						infoProps = {top:-$info.outerHeight()};
					}
					else {
						descProps = {top:-$desc.outerHeight()};
						infoProps = {bottom:-$info.outerHeight()};
					}
					$mainScreen.hover(displayDesc, hideDesc);
				}
				else {
					if (descAlign == BOTTOM) {
						descProps = {bottom:0};
						infoProps = {top:0};
					}
					else {
						descProps = {top:0};
						infoProps = {bottom:0};					
					}
				}
				$desc.css(descProps);
				$info.css(infoProps);
				
				var descPadding = $desc.outerWidth() - $desc.width();
				$desc.width(screenWidth - descPadding);
				$mainScreen.append("<div class='tmp-desc'></div>");
				$tmpDesc = $mainScreen.find(".tmp-desc");
				$tmpDesc.width($desc.width());
				
				if (displayImgNum) {
					var infoPadding = $info.outerWidth() - $info.width();
					$info.width(screenWidth - infoPadding);	
				}
				else {
					$info.css({display:"none"});					
				}				
			}
			
			//display description
			var displayDesc = function() {
				screenHover = true;
				var offset = ($desc.height() != 0) ? 0 : $desc.height() - $desc.outerHeight();			
				if (descAlign == TOP) {
					$desc.stop(true, true).animate({top:offset}, ANIMATE_SPEED);
					$info.stop(true, true).animate({bottom:0}, ANIMATE_SPEED);
				}
				else {
					$desc.stop(true, true).animate({bottom:offset}, ANIMATE_SPEED);
					$info.stop(true, true).animate({top:0}, ANIMATE_SPEED);
				}													
			}
			
			//hide description
			var hideDesc = function() {
				screenHover = false;							
				if (descAlign == TOP) {
					$desc.stop(true, true).animate({top:-$desc.outerHeight()}, ANIMATE_SPEED);
					$info.stop(true, true).animate({bottom:-$info.outerHeight()}, ANIMATE_SPEED);								
				}
				else {
					$desc.stop(true, true).animate({bottom:-$desc.outerHeight()}, ANIMATE_SPEED);
					$info.stop(true, true).animate({top:-$info.outerHeight()}, ANIMATE_SPEED);																
				}
			}
			
			//display caption
			var displayCaption = function() {
				var $caption = $(this).find(">p:first");
				if (captionAlign == BOTTOM) {
					$caption.stop().animate({bottom:0}, ANIMATE_SPEED);
				}
				else {
					$caption.stop().animate({top:0}, ANIMATE_SPEED);
				}
			}
			
			//hide caption
			var hideCaption = function() {
				var $caption = $(this).find(">p:first");
				if (captionAlign == BOTTOM) {
					$caption.stop().animate({bottom:-$caption.outerHeight()}, ANIMATE_SPEED);
				}
				else {
					$caption.stop().animate({top:-$caption.outerHeight()}, ANIMATE_SPEED);
				}
			}
			
			//init thumbnails
			var initThumbs = function() {
				//config thumbs
				$thumbPanels.css({width:thumbWidth, height:thumbHeight});
				$thumbs.css({"margin-right":thumbMargin});
				unitSize = $thumbs.outerWidth(true);
				
				$thumbnails.width((numDisplay * $thumbPanels.outerWidth()) + 
								  ((numDisplay - 1) * thumbMargin));
				$thumbList.width(numItems * unitSize);
				
				$thumbs.click(
					function() {
						currIndex = $(this).index();
						loadContent(currIndex);
						return false;
					}
				);
				
				//process thumb images
				var thumbImgs = $thumbPanels.find("img");
				
				$thumbPanels.find("img").each(
					function(n) {
						if (this.complete && this.width > 0) {
							processImg(this);
						}
						else {
							$(this).load(processLoadedImg);				
						}
					}
				);
				
				if (displayTooltip) {
					$thumbPanels.find(">p:first").css("display", "none");
					$gallery.append("<div id='tooltip'></div>");
					$tooltip = $gallery.find("#tooltip");
					$thumbPanels.hover(showTooltip, hideTooltip).mousemove(moveTooltip);
				}
				else {
					$thumbPanels.each(
						function(n) {										  
							var $caption = $(this).find(">p:first");
							if (captionAlign == BOTTOM) {
								if (mouseoverCaption) {
									$caption.css({bottom:-$caption.outerHeight()});
								}
								else {
									$caption.css({bottom:0});
								}
							}
							else {
								if (mouseoverCaption) {
									$caption.css({top:-$caption.outerHeight()});
								}
								else {
									$caption.css({top:0});
								}
							}
						});
						
					if (mouseoverCaption) {
						$thumbPanels.hover(displayCaption, hideCaption);
					}
					else {
						$thumbPanels.hover(
							function(e) { $(this).addClass("thumb-over"); },
							function(e) { $(this).removeClass("thumb-over"); }
						);
					}
				}
			}
			
			//init thumb panel
			var initThumbPanel = function() {
				if (!displayArrow) {
					selectedClass = "curr-plain";
				}
				
				//config thumb nav buttons
				if (displayThumbNav && numItems > numDisplay) {
					var topMargin = ($thumbs.outerHeight(true) - $thumbPanels.outerHeight());
					var btnHeight = $thumbPanels.outerHeight();
					
					$thumbsBack.css({height:btnHeight, "margin-top":topMargin})
							   .click(thumbsBack).mousedown(onMouseDown);
					$thumbsFwd.css({height:btnHeight, "margin-top":topMargin})
							  .click(thumbsFwd).mousedown(onMouseDown);					
				}
				else {
					$thumbsBack.css({display:"none", width:0, height:0});
					$thumbsFwd.css({display:"none", width:0, height:0});					
				}
				
				//config lower panel
				initLowerPanel();
				
				//config control panel	
				$cPanel.width($thumbnails.outerWidth() + $thumbsBack.outerWidth() + $thumbsFwd.outerWidth());
				$cPanel.height($thumbnails.outerHeight() + $lowerPanel.outerHeight(true));				
			}
			
			//config lower panel			
			var initLowerPanel = function() {				
				$lowerPanel.css({width:$thumbnails.outerWidth(),
								 "margin-left":$thumbsBack.outerWidth(),
								 "margin-right":$thumbsFwd.outerWidth()});
							
				if (displayPagination && numItems > numDisplay) {
					var numPage = Math.ceil(numItems/numDisplay);
					var pageBtns = "";
					for (var i = 0; i < numPage; i++) {			
						pageBtns += "<span class='circle-btn'></span>";
					}
					$pagination.append(pageBtns);			
					$pagination.find("span.circle-btn").click(moveToPage);
					
					$pagination.css({width:$lowerPanel.width()});
				}
				else {
					displayPagination = false;
					$pagination.css({display:"none", width:0, height:0, padding:0});
				}
				
				if (!displayThumbNum) {
					$thumbInfo.css({display:"none"});
					
					if (!displayPagination) {
						$lowerPanel.css({height:0}).hide();
					}
				}				
			}
			
			//move main image back
			var imgBack = function() {
				if (currIndex > 0) {
					currIndex = currIndex - 1;
				}
				else if (imageNavCirc) {
					currIndex = numItems - 1;					
				}
				else {
					return;
				}				
				loadContent(currIndex);	
				moveThumbs(currIndex);
				return false;
			}
			
			//move main image forward
			var imgFwd = function() {
				if (currIndex < numItems - 1) {
					currIndex = currIndex + 1
				}
				else if (imageNavCirc) {
					currIndex = 0;					
				}
				else {
					return;
				}
				loadContent(currIndex);
				moveThumbs(currIndex);
				return false;
			}
			
			//move thumbs back
			var thumbsBack = function() {
				if (fwdSlots < numSlots) {
					var numBack = numSlots - fwdSlots;
					if (numBack >= numDisplay) {
						numBack = numDisplay;
					}
					
					fwdSlots += numBack;
					backSlots -= numBack;
					pos += numBack * unitSize;
				}
				else if (thumbNavCirc) {
					fwdSlots = 0;
					backSlots = numSlots;
					pos = -numSlots * unitSize;
				}
				else {
					return;
				}
				
				$thumbList.stop(true, true).animate({left: pos}, scrollSpeed);
				updatePagination();
				return false;
			}
				
			//move thumbs forward
			var thumbsFwd = function() {
				if (backSlots < numSlots) {
					var numFwd = numSlots - backSlots;
					if (numFwd >= numDisplay) {
						numFwd = numDisplay;
					}
					
					backSlots += numFwd;
					fwdSlots -= numFwd;		
					pos -= numFwd * unitSize;	
				}
				else if (thumbNavCirc) {
					backSlots = 0;
					fwdSlots = numSlots;		
					pos = 0;		
				}
				else {
					return;
				}
				
				$thumbList.stop(true, true).animate({left: pos}, scrollSpeed);
				updatePagination();
				return false;
			}
				
			//move thumbs by index
			var moveThumbs = function(thumbIndex) {
				var pageIndex = Math.floor(thumbIndex/numDisplay);
				
				var numFwd = pageIndex * numDisplay;
				if (numFwd >= numSlots) {
					numFwd = numSlots;
				}			
				
				backSlots = numFwd;
				fwdSlots = numSlots - numFwd;
				pos = -numFwd * unitSize;	
				
				$thumbList.stop(true, true).animate({left: pos}, scrollSpeed);
				updatePagination();
			}
				
			//update pagination buttons
			var updatePagination = function() {
				var pageIndex = Math.ceil(backSlots/numDisplay);
				$pagination.find("span").removeClass("circlefill-btn");
				$pagination.find("span:nth-child(" + (pageIndex + 1) + ")")
						   .addClass("circlefill-btn");
							
				updateThumbInfo();			
			}
			
			//update thumb information
			var updateThumbInfo = function() {
				var begIndex = Math.abs(pos/unitSize);
				var endIndex = begIndex + numDisplay;
				$thumbInfo.html((begIndex + 1) + " - " + endIndex + " of " + numItems);
				
				//disable/enable back button
				if (!thumbNavCirc) {
					if (begIndex > 0) {
						$thumbsBack.css({opacity:1, cursor:"pointer"});	
					}
					else {
						$thumbsBack.css({opacity:BUTTON_OPACITY, cursor:"default"});
					}
					
					if (endIndex < numItems) {
						$thumbsFwd.css({opacity:1, cursor:"pointer"});	
					}
					else {
						$thumbsFwd.css({opacity:BUTTON_OPACITY, cursor:"default"});	
					}
				}
			}
			
			//go to page 
			var moveToPage = function() {		
				var pageIndex = $(this).index();
				
				var numFwd = pageIndex * numDisplay;
				if (numFwd >= numSlots) {
					numFwd = numSlots;
				}			
				
				backSlots = numFwd;
				fwdSlots = numSlots - numFwd;
				pos = -numFwd * unitSize;	
				
				$thumbList.stop(true, true).animate({left: pos}, scrollSpeed);
				updatePagination();
				return false;
			}
				
			//rotate image
			var rotateImage = function() {
				stopTimer();
				currIndex = (currIndex < numItems - 1) ? currIndex + 1 : 0;
				loadContent(currIndex);
				moveThumbs(currIndex);
			}
			
			//on gallery over
			var galleryOver = function() {
				rotate = false;
				stopTimer();				
			}
			
			//on gallery out
			var galleryOut = function() {
				rotate = true;
				startTimer();
			}
			
			//display tooltip
			var showTooltip = function(e) {
				var $p = $(this).find(">p:first");
				if ($p.length > 0) {
					var caption = $(this).find(">p:first").html();
					if (caption != "") {
						$tooltip.html(caption);
						var offset = $gallery.offset();
						$tooltip.css({top:e.pageY + TOOLTIP_Y, left:e.pageX})
								.delay(TOOLTIP_DELAY).show(0);
					}
				}
			}
			
			//hide tooltip
			var hideTooltip = function(e) {
				$tooltip.stop().hide();
			}
			
			//move tooltip
			var moveTooltip = function(e) {
				var offset = $gallery.offset();
				$tooltip.css({top:e.pageY + TOOLTIP_Y, left:e.pageX});
			}
			
			//on mouse down 
			var onMouseDown = function() {
				return false;
			}
			
			//update description
			var updateDesc = function(desc) {
				var props;
				$tmpDesc.html(desc);	
				var descHeight = $tmpDesc.height();
				
				if (mouseoverText && !screenHover) {
					$desc.stop();
					props = (descAlign == TOP) ? {height:descHeight, top:-$tmpDesc.outerHeight()} : {height:descHeight, bottom:-$tmpDesc.outerHeight()}; 				
					$desc.css(props).html(desc);
				}
				else {
					$desc.html("");							
					var offset = (descHeight != 0) ? 0 : $desc.height() - $desc.outerHeight();			
					props = (descAlign == TOP) ? {height:descHeight, top:offset} : {height:descHeight, bottom:offset}; 				
					$desc.stop().animate(props, "slow", 
							function () {  
								$(this).html(desc);
							});  	
				}
			}
			
			//load content
			var loadContent = function(i) {
				//get selected thumb's properties
				var $thumb = $thumbnails.find("li:nth-child(" + (i+1) + ")");
				var desc = $thumb.find("div.data>p").html();
				var urlLink = $thumb.find("div.data>a").attr("href");
				var urlTarget = $thumb.find("div.data>a").attr("target");			
				var imgTrans = $thumb.attr("tran");
				transNum = (imgTrans == undefined || TRANSITIONS[imgTrans] == undefined) ? 
							gTranNum :TRANSITIONS[imgTrans];
				
				$thumbs.removeClass(selectedClass);				
				$thumb.addClass(selectedClass);
				
				//update info panel
				$info.html((i+1) + " / " + numItems);
				if (!imageNavCirc) {
					if (i == 0) {
						$prevBtn.css({opacity:0, cursor:"default"});
					}
					else {
						$prevBtn.css({opacity:1, cursor:"pointer"});
					}
					
					if (i == (numItems - 1)) {
						$nextBtn.css({opacity:0, cursor:"default"});
					}
					else {
						$nextBtn.css({opacity:1, cursor:"pointer"});
					}
				}
				
				//update link
				if (urlLink != undefined && urlLink != "") {
					$mainScreen.find("a").css({cursor:"pointer"})
							   .attr({href:urlLink, target:urlTarget});
				}
				else {
					$mainScreen.find("a").css({cursor:"default"})
							   .attr({href:"#", target:"_self"});
				}
				
				//update description
				updateDesc(desc);
				
				if (imgs[i]) {
					$preloader.hide();
					//display stored image	
					displayContent(imgs[i]);
				}	
				else {	
					//load new image
					var currImg = new Image();		
					$(currImg).attr("src", imgPaths[i]);
					if (!currImg.complete) {
						$preloader.show();
						$(currImg).load(
							function() {
								$preloader.hide();
								imgs[i] = jQuery.extend(true, {}, this);	
								displayContent(currImg);
							}
						).error(
							function() {
								alert("Error loading image");
							}
						);
					}
					else {
						$preloader.hide();
						imgs[i] = jQuery.extend(true, {}, currImg);
						displayContent(imgs[i]);
					}
				}	    
			}
				
			//display image
			var displayContent = function(newImg) {
				vStripes.clear();
				hStripes.clear();
				
				if (transNum == TRANSITIONS["random"]) {
					transNum = Math.floor(Math.random() * (TRANSITIONS.length - 2));
				}
				
				if (transNum == TRANSITIONS["none"]) {
					showContent(newImg);
				}
				else if (transNum == TRANSITIONS["fade"]) {
					fadeInContent(newImg);
				}
				else if (transNum < TRANSITIONS["horz.tl"]){
					vStripes.displayContent(newImg, transNum);
				}
				else {
					hStripes.displayContent(newImg, transNum);
				}
			}
			
			//display image (no transition)
			var showContent = function(newImg) {
				setImgPadding(newImg);
					
				$mainImg.attr("src", newImg.src).show(0, 
					function() {
						startTimer();
					}
				);	
			}
			
			//display image (fade transition)
			var fadeInContent = function(newImg) {
				$bgImg.css({top:$mainImg.css("top"), left:$mainImg.css("left"),
							"padding-top":$mainImg.css("padding-top"), "padding-bottom":$mainImg.css("padding-bottom"),
							"padding-left":$mainImg.css("padding-left"), "padding-right":$mainImg.css("padding-right")})
							.attr("src", $mainImg.attr("src")).show();
		
				$mainImg.hide();	
				setImgPadding(newImg);
				$mainImg.attr("src", newImg.src).fadeIn(tranSpeed, 
					function() {				
						startTimer();
					}
				);	
			}
			
			//adjust image padding
			var setImgPadding = function(newImg) {
				var tMargin = Math.round((screenHeight - newImg.height)/2);
				var lMargin = Math.round((screenWidth  - newImg.width)/2);
				var top = 0;
				var left = 0;
				var vertPadding = 0;
				var horzPadding = 0;
				
				if (tMargin > 0) {
					vertPadding = tMargin;
				}
				else if (tMargin < 0) {
					top = tMargin;
				}
				
				if (lMargin > 0) {
					horzPadding = lMargin;
				}
				else if (lMargin < 0) {
					left = lMargin;
				}
				
				$mainImg.css({top:top, left:left, 
							  "padding-top":vertPadding, "padding-bottom":vertPadding,
							  "padding-left":horzPadding, "padding-right":horzPadding});	
			}
		
			//init image loading
			var initImgLoad = function() {
				imgs = new Array(numItems);
				imgPaths = new Array(numItems);
				
				//init image paths
				$thumbPanels.each(
					function(n){
						imgPaths[n] = $(this).find(">a").attr("href");
					}
				);
				
				//start image loading		
				var loadIndex = 0;
				var img = new Image();
				$(img).attr("src", imgPaths[loadIndex]);
				
				//load image complete/error event handler
				$(img).load(
					function() {
						imgs[loadIndex] = jQuery.extend(true, {}, this);	
						
						loadIndex++
						if (loadIndex < imgPaths.length) {
							$(this).attr("src", imgPaths[loadIndex]);
						}
					}).error(function() {
						//error loading image, continue next
						loadIndex++
						if (loadIndex < imgPaths.length) {
							$(this).attr("src", imgPaths[loadIndex]);
						}
					}
				);
			}
				
			//process loaded image size & position
			var processLoadedImg = function() {
				processImg(this);
			}
			
			//process image size & position
			var processImg = function(newImg) {
				var ratio;
				var $newImg = $(newImg);
				if ($newImg.outerWidth() > thumbWidth) {
					ratio = $newImg.outerHeight()/$newImg.outerWidth();
					$newImg.width(thumbWidth);
					$newImg.height(ratio * thumbWidth);
				}
				
				if ($newImg.outerHeight() > thumbHeight) {
					ratio = $newImg.outerWidth()/$newImg.outerHeight();
					$newImg.width(ratio * thumbHeight);
					$newImg.height(thumbHeight);
				}
				$newImg.css({left: Math.round((thumbWidth - $newImg.outerWidth())/2),
							 top:  Math.round((thumbHeight - $newImg.outerHeight())/2)});				
			}
			
			//start timer
			var startTimer = function() {
				if (autoStart && rotate && timerId == null) {
					timerId = setTimeout(rotateImage, delay);
				}
			}
			
			//stop timer
			var stopTimer = function() {
				clearTimeout(timerId);
				timerId = null;
			}
		}
		
		var defaults = { 
			num_display:5,
			padding:10,			
			screen_width:700,
			screen_height:394,
			thumb_width:125,
			thumb_height:70,
			thumb_margin:5,			
			text_panel_align:TOP,
			caption_align:BOTTOM,
			auto_rotate:true,
			delay:DEFAULT_DELAY,
			image_nav_circ:true,
			thumb_nav_circ:true,
			thumb_tooltip:false,
			image_nav:true,			
			image_number:true,		
			thumb_nav:true,
			pagination:true,
			thumb_number:true,
			select_arrow:true,
			mouseover_text:false,
			mouseover_caption:false,
			mouseover_buttons:true,
			transition:"fade",
			transition_speed:TRANSPEED,
			scroll_speed:SCROLL_SPEED,
			vert_size:STRIPE_SIZE,
			horz_size:STRIPE_SIZE
		};
		
		var opts = $.extend({}, defaults, params);		
		return this.each(
			function() {
				var gallery = new Gallery($(this), opts);
				gallery.init();
			}
		);
	}
})(jQuery);