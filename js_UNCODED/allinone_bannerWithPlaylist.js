/*
 * AllInOne Banner - Banner With Playlist v3.6.3
 *
 * Copyright 2012-2023, LambertGroup
 *
*/


(function($) {

	//the vars
	var effects_arr=new Array(
			'fade',

			'slideFromLeft',
			'slideFromRight',
			'slideFromTop',
			'slideFromBottom',

			'topBottomDroppingStripes',
			'topBottomDroppingReverseStripes',

			'bottomTopDroppingStripes',
			'bottomTopDroppingReverseStripes',

			'asynchronousDroppingStripes',

			'leftRightFadingStripes',
			'leftRightFadingReverseStripes',

			'topBottomDiagonalBlocks',
			'topBottomDiagonalReverseBlocks',

			'alternateSlide',

			'randomBlocks'

	);

	var stripe_width;
	var new_stripe_width;
	var delay_time = 100;
	var delay_time_stripes_step=50;
	var delay_time_blocks_step=25;


	var currentCarouselTop=0;
	var val = navigator.userAgent.toLowerCase();


	function animate_singular_text(elem,current_obj,options) {
		if (options.responsive) {
			newCss='';
			if (elem.css('font-size').lastIndexOf('px')!=-1) {
				fontSize=elem.css('font-size').substr(0,elem.css('font-size').lastIndexOf('px'));
				newCss+='font-size:'+fontSize/(options.origWidth/options.width)+'px;';
			} else if (elem.css('font-size').lastIndexOf('em')!=-1) {
				fontSize=elem.css('font-size').substr(0,elem.css('font-size').lastIndexOf('em'));
				newCss+='font-size:'+fontSize/(options.origWidth/options.width)+'em;';
			}

			if (elem.css('line-height').lastIndexOf('px')!=-1) {
				lineHeight=elem.css('line-height').substr(0,elem.css('line-height').lastIndexOf('px'));
				newCss+='line-height:'+lineHeight/(options.origWidth/options.width)+'px;';
			} else if (elem.css('line-height').lastIndexOf('em')!=-1) {
				lineHeight=elem.css('line-height').substr(0,elem.css('line-height').lastIndexOf('em'));
				newCss+='line-height:'+lineHeight/(options.origWidth/options.width)+'em;';
			}

			elem.wrapInner('<div class="newFS" style="'+newCss+'" />');

		}

		var theLeft=elem.attr('data-final-left');
		var theTop=elem.attr('data-final-top');
		if (options.responsive) {
			theLeft=parseInt(theLeft/(options.origWidth/options.width),10);
			theTop=parseInt(theTop/(options.origWidth/options.width),10);
		}

        var opacity_aux=1;
		if (current_obj.isVideoPlaying==true)
		   opacity_aux=0;
        elem.animate({
                opacity: opacity_aux,
                left:theLeft+'px',
                top: theTop+'px'
              }, elem.attr('data-duration')*1000, function() {
                if (current_obj.isVideoPlaying==true) {
                   var texts = $(current_obj.currentImg.attr('data-text-id')).children();
				   texts.css("opacity",0);
		        }
              });
	};




	function animate_texts(current_obj,options,allinone_bannerWithPlaylist_the,bannerControls) {
		$(current_obj.currentImg.attr('data-text-id')).css("display","block");
		var texts = $(current_obj.currentImg.attr('data-text-id')).children();

		var i=0;
		currentText_arr=Array();
		texts.each(function() {
			currentText_arr[i] = $(this);


		  var theLeft=currentText_arr[i].attr('data-initial-left');
		  var theTop=currentText_arr[i].attr('data-initial-top');
		  if (options.responsive) {
				theLeft=parseInt(theLeft/(options.origWidth/options.width),10);
				theTop=parseInt(theTop/(options.origWidth/options.width),10);
		  }

            currentText_arr[i].css({
				'left':theLeft+'px',
				'top':theTop+'px',
				'opacity':parseInt(currentText_arr[i].attr('data-fade-start'),10)/100
			});

            var currentText=currentText_arr[i];
            setTimeout(function() { animate_singular_text(currentText,current_obj,options);}, (currentText_arr[i].attr('data-delay')*1000));

            i++;
        });
	};


	function shuffle(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i,10), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};


	//circ
	function the_arc(current_obj,options) {
			nowx = (new Date).getTime();
			if (!current_obj.mouseOverBanner && !current_obj.effectIsRunning && options.showCircleTimer) {
				current_obj.ctx.clearRect(0,0,current_obj.canvas.width,current_obj.canvas.height);

                current_obj.ctx.beginPath();
                current_obj.ctx.globalAlpha=options.behindCircleAlpha/100;
                current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, 2 * Math.PI, false);
                current_obj.ctx.lineWidth = options.circleLineWidth+2;
                current_obj.ctx.strokeStyle = options.behindCircleColor;
                current_obj.ctx.stroke();


                current_obj.ctx.beginPath();
                current_obj.ctx.globalAlpha=options.circleAlpha/100;
                current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, ((current_obj.timeElapsed+nowx)-current_obj.arcInitialTime)/1000*2/options.autoPlay*Math.PI,  false);
                current_obj.ctx.lineWidth = options.circleLineWidth;
                current_obj.ctx.strokeStyle = options.circleColor;
                current_obj.ctx.stroke();
             }
    }


        // generate the stripes
        function allinone_bannerWithPlaylist_generate_stripes(allinone_bannerWithPlaylist_container,options,current_obj) {
			var ver_ie=getInternetExplorerVersion();
			$('.stripe', allinone_bannerWithPlaylist_container).remove();
			$('.block', allinone_bannerWithPlaylist_container).remove();
            stripe_width = Math.round(allinone_bannerWithPlaylist_container.width()/options.numberOfStripes);
			new_stripe_width=stripe_width;
        	var cssBgResize=true;
			for (var i = 0; i < options.numberOfStripes; i++){
				if (i == options.numberOfStripes-1) {
					new_stripe_width=allinone_bannerWithPlaylist_container.width()-stripe_width*(options.numberOfStripes-1);
					//alert (stripe_width+'  -  '+new_stripe_width);
				}
				if (!options.responsive || (ver_ie==-1) || (ver_ie!=-1 && ver_ie>=9)  ) {
					if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
						cssBgResize=false;
					} else {
						allinone_bannerWithPlaylist_container.append(
							$('<div class="stripe"></div>').css({
								opacity:'0',
								left:(stripe_width*i)+'px',
								width:new_stripe_width+'px',
								height:'0px',
								background: 'url("'+ current_obj.current_imgInside.attr('src') +'") '+ (-1)*(i * stripe_width) +'px 0%'
							})
						);
					}
				} else {
					cssBgResize=false;
				}

				if (!cssBgResize) {
					mleft=(-1)*(stripe_width*i);
					allinone_bannerWithPlaylist_container.append(
						$('<div class="stripe"><img src="'+current_obj.current_imgInside.attr('src')+'" width="'+allinone_bannerWithPlaylist_container.width()+'" height="'+allinone_bannerWithPlaylist_container.height()+'" style="margin-left:'+mleft+'px;"></div>').css({
							opacity:'0',
							left:(stripe_width*i)+'px',
							width:new_stripe_width+'px',
							height:'0px'
						})
					);
				}
			}

			if (options.responsive && cssBgResize) {
				if (ver_ie==-1 || (ver_ie!=-1 && ver_ie>=9) ) {
					$('.stripe', allinone_bannerWithPlaylist_container).css({
						'-webkit-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-moz-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-o-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-ms-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px'
					});

				}
			}
        };



        // generate the blocks
        function allinone_bannerWithPlaylist_generate_blocks(allinone_bannerWithPlaylist_container,options,current_obj) {
			var ver_ie=getInternetExplorerVersion();
			$('.stripe', allinone_bannerWithPlaylist_container).remove();
			$('.block', allinone_bannerWithPlaylist_container).remove();
			var block_width = Math.round(allinone_bannerWithPlaylist_container.width()/options.numberOfColumns);
			var block_height = Math.round(allinone_bannerWithPlaylist_container.height()/options.numberOfRows);
        	var new_block_width=block_width;
			var new_block_height=block_height;
			var cur_left=0;
			var cur_top=0;
        	var cssBgResize=true;

            for(var i = 0; i < options.numberOfRows; i++){
            	for(var j = 0; j < options.numberOfColumns; j++){
					cur_left=block_width*j;
					cur_top=block_height*i;

					if (j == options.numberOfColumns-1) {
						new_block_width=allinone_bannerWithPlaylist_container.width()-block_width*(options.numberOfColumns-1);
					} else {
						new_block_width=block_width;
					}

					if (i == options.numberOfRows-1) {
						new_block_height=allinone_bannerWithPlaylist_container.height()-block_height*(options.numberOfRows-1);
					} else {
						new_block_height=block_height;
					}

					if (!options.responsive || (ver_ie==-1) || (ver_ie!=-1 && ver_ie>=9)  ) {
						if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1) {
							cssBgResize=false;
						} else {
							allinone_bannerWithPlaylist_container.append(
								$('<div class="block"></div>').css({
									opacity:'0',
									left:cur_left+'px',
									top:cur_top+'px',
									width:new_block_width+'px',
									height:new_block_height+'px',
									background: 'url("'+ current_obj.current_imgInside.attr('src') +'") -'+ cur_left +'px -'+ cur_top +'px'
								})
							);
						}
					} else {
						cssBgResize=false;
					}

					if (!cssBgResize) {
						mleft=(-1)*cur_left;
						mtop=(-1)*cur_top;
						allinone_bannerWithPlaylist_container.append(
							$('<div class="block"><img src="'+current_obj.current_imgInside.attr('src')+'" width="'+allinone_bannerWithPlaylist_container.width()+'" height="'+allinone_bannerWithPlaylist_container.height()+'" style="margin-left:'+mleft+'px; margin-top:'+mtop+'px;"></div>').css({
								opacity:'0',
								left:cur_left+'px',
								top:cur_top+'px',
								width:new_block_width+'px',
								height:new_block_height+'px'
							})
						);
					}

            	}
			}
			if (options.responsive && cssBgResize) {
				if (ver_ie==-1 || (ver_ie!=-1 && ver_ie>=9) ) {
					$('.block', allinone_bannerWithPlaylist_container).css({
						'-webkit-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-moz-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-o-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'-ms-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
						'background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px'
					});
				}
			}

        };


    function animate_block(block,i,j,options,allinone_bannerWithPlaylist_container){
        var w = block.width();
        var h = block.height();
        block.css({'width':'0'});
        block.css({'height':'0'});
        if (i==options.numberOfRows-1 && j==options.numberOfColumns-1)
        	setTimeout(function(){
				block.animate({ opacity:'1.0', width:w, height:h }, (options.effectDuration*1000)/3 , '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
			}, (delay_time));
        else
			setTimeout(function(){
				block.animate({ opacity:'1.0', width:w, height:h }, (options.effectDuration*1000)/3 );
			}, (delay_time));
		delay_time += delay_time_blocks_step;
	};





    // navigation
    function allinone_bannerWithPlaylist_navigation(direction,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs){
		var navigateAllowed=true;
		if ((!options.loop && current_obj.current_img_no+direction>=total_images) || (!options.loop && current_obj.current_img_no+direction<0))
			navigateAllowed=false;

		if (navigateAllowed) {
			$('.newFS', allinone_bannerWithPlaylist_container ).contents().unwrap();
			current_obj.arcInitialTime=(new Date).getTime();
			current_obj.timeElapsed=0;

				if (options.showCircleTimer) {
						//clearInterval(current_obj.intervalID);

						current_obj.ctx.clearRect(0,0,current_obj.canvas.width,current_obj.canvas.height);
						current_obj.ctx.beginPath();
						current_obj.ctx.globalAlpha=options.behindCircleAlpha/100;
						current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, 2 * Math.PI, false);
						current_obj.ctx.lineWidth = options.circleLineWidth+2;
						current_obj.ctx.strokeStyle = options.behindCircleColor;
						current_obj.ctx.stroke();


						current_obj.ctx.beginPath();
						current_obj.ctx.globalAlpha=options.circleAlpha/100;
						current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, 0,  false);
						current_obj.ctx.lineWidth = options.circleLineWidth;
						current_obj.ctx.strokeStyle = options.circleColor;
						current_obj.ctx.stroke();

						//current_obj.intervalID=setInterval(function(){the_arc(current_obj,options)}, 125);
				}


			//hide previous texts
			//$(current_obj.currentImg.attr('data-text-id')).css('opacity','0');
			$(current_obj.currentImg.attr('data-text-id')).css("display","none");

			//deactivate previous
			$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');

			//set current img
			if (options.randomizeImages && !current_obj.bottomNavClicked) {
				var rand_no=Math.floor(Math.random() * total_images);
				if (current_obj.current_img_no===rand_no)
					current_obj.current_img_no=Math.floor(Math.random() * total_images);
				else
					current_obj.current_img_no=rand_no;
			} else {
				if (current_obj.current_img_no+direction>=total_images) {
					current_obj.current_img_no=0;
				} else if (current_obj.current_img_no+direction<0) {
					current_obj.current_img_no=total_images-1;
				} else {
					current_obj.current_img_no+=direction;
				}
			}
			current_obj.bottomNavClicked=false;
			//activate current
			$(thumbsHolder_Thumbs[current_obj.current_img_no]).addClass('thumbsHolder_ThumbON');
			//auto scroll carousel if needed
			/*currentCarouselTop=allinone_bannerWithPlaylist_thumbsHolder.css('top').substr(0,allinone_bannerWithPlaylist_thumbsHolder.css('top').lastIndexOf('px'));*/
			carouselScroll(0,thumbsHolder_Thumb,total_images,allinone_bannerWithPlaylist_thumbsHolder,options,current_obj,allinone_bannerWithPlaylist_sliderVertical);

			current_obj.currentImg = $(imgs[current_obj.current_img_no]);
            current_obj.current_imgInside=current_obj.currentImg.find('img:first');

			//set current_effect
			if(current_obj.currentImg.attr('data-transition')){
					current_effect = current_obj.currentImg.attr('data-transition');
					if (current_effect=='random') {
								current_effect=effects_arr[Math.floor(Math.random()*(effects_arr.length))];
					}
      } else if (options.defaultEffect!='random') {
            	current_effect=options.defaultEffect;
      } else {
            	current_effect=effects_arr[Math.floor(Math.random()*(effects_arr.length))];
      }

			//alert (direction);
			if (current_effect=='alternateSlide') {
						if (direction===1) {
							current_effect='slideFromRight';
						} else {
							current_effect='slideFromLeft';
						}
			}

			//alert(current_obj.current_img_no);
			current_obj.effectIsRunning=true;
			if(current_effect == 'fade' || current_effect == 'slideFromLeft' || current_effect == 'slideFromRight' || current_effect == 'slideFromTop' || current_effect == 'slideFromBottom'){
				//alert ("fade");
				allinone_bannerWithPlaylist_generate_stripes(allinone_bannerWithPlaylist_container,options,current_obj);
				var first_stripe = $('.stripe:first', allinone_bannerWithPlaylist_container);

				if (current_effect == 'fade') {
					first_stripe.css({
						'top':'0px',
	                    'height': '100%',
	                    'width': allinone_bannerWithPlaylist_container.width() + 'px'
	                });
					first_stripe.animate({ opacity:'1.0' }, (options.effectDuration*2000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
				}

				if (current_effect == 'slideFromLeft') {
					first_stripe.css({
						'top':'0px',
	                    'height': '100%',
	                    'width': '0'
	                });
					first_stripe.animate({ opacity:'1.0', width:allinone_bannerWithPlaylist_container.width() + 'px' }, (options.effectDuration*1000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
				}

				if (current_effect == 'slideFromRight') {
					first_stripe.css({
						'top':'0px',
	                    'height': '100%',
	                    'width':  '0',
	                    'left': allinone_bannerWithPlaylist_container.width()+5 + 'px'
	                });
					first_stripe.animate({ opacity:'1.0', left:'0', 'width':  allinone_bannerWithPlaylist_container.width() + 'px' }, (options.effectDuration*1000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
				}

				if (current_effect == 'slideFromTop') {
					first_stripe.css({
						'top':'0px',
	                    'height': '0',
	                    'width': allinone_bannerWithPlaylist_container.width() + 'px'
	                });
					first_stripe.animate({ opacity:'1.0', height:allinone_bannerWithPlaylist_container.height() + 'px' }, (options.effectDuration*1000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
				}

				if (current_effect == 'slideFromBottom') {
					first_stripe.css({
	                    'height': '0',
	                    'width': allinone_bannerWithPlaylist_container.width() + 'px',
	                    'top': allinone_bannerWithPlaylist_container.height() + 'px'
	                });
					first_stripe.animate({ opacity:'1.0', top:0, height:allinone_bannerWithPlaylist_container.height() + 'px' }, (options.effectDuration*1000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
				}

			}

			if(current_effect.indexOf('Stripes')>=0) {
				allinone_bannerWithPlaylist_generate_stripes(allinone_bannerWithPlaylist_container,options,current_obj);
				if (current_effect.indexOf('Reverse')>=0){
					var stripes = $('.stripe', allinone_bannerWithPlaylist_container).myReverse();
				} else {
					var stripes = $('.stripe', allinone_bannerWithPlaylist_container);
				}
				delay_time = 100;
				i = 0;
				stripes.each(function(){
					var stripe = $(this);
					//setting the css for stripes according to current effect
					if(current_effect=='topBottomDroppingStripes' || current_effect=='topBottomDroppingReverseStripes')
						stripe.css({ 'top': '0px' });
					if(current_effect=='bottomTopDroppingStripes' || current_effect=='bottomTopDroppingReverseStripes')
						stripe.css({ 'bottom': '0px' });
					if(current_effect=='leftRightFadingStripes' || current_effect=='leftRightFadingReverseStripes')
						stripe.css({ 'top': '0px', 'height':'100%', 'width':'0' });
					if (current_effect=='asynchronousDroppingStripes') {
						if (i % 2)
							stripe.css({ 'top': '0px' });
						else
							stripe.css({ 'bottom': '0px' });
					}

					if(current_effect=='leftRightFadingStripes' || current_effect=='leftRightFadingReverseStripes') {
						var aux_stripe_width=stripe_width;
						if ( (current_effect=='leftRightFadingStripes' && i == options.numberOfStripes-1) || (current_effect=='leftRightFadingReverseStripes' && i==0) )
							aux_stripe_width=new_stripe_width;


						if(i == options.numberOfStripes-1){
							setTimeout(function(){
								stripe.animate({ width:aux_stripe_width+'px', opacity:'1.0' }, (options.effectDuration*800), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
							}, (delay_time));
						} else {
							setTimeout(function(){
								stripe.animate({ width:aux_stripe_width+'px', opacity:'1.0' }, (options.effectDuration*800) );
							}, (delay_time));
						}
					} else {
							if(i == options.numberOfStripes-1){
								setTimeout(function(){
									stripe.animate({ height:'100%', opacity:'1.0' }, (options.effectDuration*1000), '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
								}, (delay_time));
							} else {
								setTimeout(function(){
									stripe.animate({ height:'100%', opacity:'1.0' }, (options.effectDuration*1000) );
								}, (delay_time));
							}
					}
					delay_time += delay_time_stripes_step;
					i++;
				});
			} //if stripes


			if(current_effect.indexOf('Blocks')>=0) {
				allinone_bannerWithPlaylist_generate_blocks(allinone_bannerWithPlaylist_container,options,current_obj);
				if (current_effect.indexOf('Reverse')>=0){
					var blocks = $('.block', allinone_bannerWithPlaylist_container).myReverse();
				} else if (current_effect=='randomBlocks') {
					var blocks = shuffle($('.block', allinone_bannerWithPlaylist_container));
				} else {
					var blocks = $('.block', allinone_bannerWithPlaylist_container);
				}
				delay_time = 100;

				if (current_effect=='randomBlocks') {
					i=0;
					var total_blocks = options.numberOfRows*options.numberOfColumns;
					blocks.each(function(){
						var block = $(this);
		                var w = block.width();
		                var h = block.height();
		                block.css({
							'width':'0',
							'height':'0'
						});
						if(i == total_blocks-1){
		                	setTimeout(function(){
								block.animate({ opacity:'1.0', width:w, height:h }, (options.effectDuration*1000)/3 , '', function(){ allinone_bannerWithPlaylist_container.trigger('effectComplete'); });
							}, (delay_time));
						} else {
							setTimeout(function(){
								block.animate({ opacity:'1.0', width:w, height:h }, (options.effectDuration*1000)/3 );
							}, (delay_time));
						}
						delay_time += delay_time_blocks_step;
						i++;
					});
				} else {

						var row_i=0;
						var col_i=0;
						var blocks_arr=new Array();
						blocks_arr[row_i] = new Array();
						blocks.each(function(){
								blocks_arr[row_i][col_i] = $(this);
								col_i++;
								if(col_i == options.numberOfColumns){
									row_i++;
									col_i = 0;
									blocks_arr[row_i] = new Array();
								}
						});


						//first part
						row_i=0;
						col_i=0;
						delay_time = 100;
						var block = $(blocks_arr[row_i][col_i]);
						animate_block(block,0,0,options,allinone_bannerWithPlaylist_container);
						while (row_i<options.numberOfRows-1 || col_i<options.numberOfColumns-1) {
							if (row_i<options.numberOfRows-1)
								row_i++;
							if (col_i<options.numberOfColumns-1)
								col_i++;

							i=row_i;
							if (col_i<row_i && options.numberOfRows>options.numberOfColumns)
								i=row_i-col_i;
							j=0;
							if (row_i<col_i && options.numberOfRows<options.numberOfColumns)
								j=col_i-row_i;
							while (i>=0 && j<=col_i) {
								var block = $(blocks_arr[i--][j++]);
								animate_block(block,i,j,options,allinone_bannerWithPlaylist_container);
								//alert (i+' - '+j);
							}

						}


						//last part
						if (options.numberOfRows<options.numberOfColumns)
							delay_time-=(options.numberOfRows-1)*delay_time_blocks_step;
						else
							delay_time-=(options.numberOfColumns-1)*delay_time_blocks_step;

						limit_i=0;
						limit_j=col_i-row_i;
						//alert (limit_j)
						//alert (row_i+'  -  '+col_i+' - '+limit_i+' - '+limit_j)
						while (limit_i<row_i && limit_j<col_i) {
							i=row_i+1; //options.numberOfRows-1;
							j=limit_j;
							while (i>limit_i && j<col_i) {
								i=i-1;
								j=j+1;
								var block = $(blocks_arr[i][j]);
								animate_block(block,i,j,options,allinone_bannerWithPlaylist_container);
								//alert (i+'-'+j);
							}
							limit_i++;
							limit_j++;
						}

				} // else randomBlocks
			} // if blocks

		} // if navigateAllowed

	};


	function carouselScroll(direction,thumbsHolder_Thumb,total_images,allinone_bannerWithPlaylist_thumbsHolder,options,current_obj,allinone_bannerWithPlaylist_sliderVertical) {
		if (total_images>options.numberOfThumbsPerScreen) {
					//var MAX_TOP=(thumbsHolder_Thumb.height()+current_obj.thumbMarginTop)*(total_images-1);
					var MAX_TOP=(thumbsHolder_Thumb.height()+current_obj.thumbMarginTop)*(total_images-options.numberOfThumbsPerScreen);

					//alert (allinone_bannerWithPlaylist_sliderVertical.slider( "option", "animate" ));
					allinone_bannerWithPlaylist_thumbsHolder.stop(true,true);
					//alert(current_obj.isCarouselScrolling)
					if (direction && !current_obj.isCarouselScrolling) {

						current_obj.isCarouselScrolling=true;
						//allinone_bannerWithPlaylist_thumbsHolder.css('opacity','0.5');
						if (direction<=1)
							direction=0;

						allinone_bannerWithPlaylist_thumbsHolder.animate({
						    //opacity: 1,
						    top:parseInt(options.borderWidth/(options.origWidth/options.width)+MAX_TOP*(direction-100)/100,10)+'px'
						  }, 1100, 'easeOutQuad', function() {
						    // Animation complete.
							  current_obj.isCarouselScrolling=false;
						});
					} else if (!current_obj.isCarouselScrolling) {
						current_obj.isCarouselScrolling=true;
						allinone_bannerWithPlaylist_thumbsHolder.css('opacity','0.5');
						var new_top=parseInt(options.borderWidth/(options.origWidth/options.width)-(thumbsHolder_Thumb.height()+current_obj.thumbMarginTop)*current_obj.current_img_no,10);
						if( Math.abs(new_top) > MAX_TOP ){ new_top = options.borderWidth/(options.origWidth/options.width) - MAX_TOP; }
						allinone_bannerWithPlaylist_sliderVertical.slider( "value" , 100 + parseInt( new_top * 100 / MAX_TOP ,10) );
						allinone_bannerWithPlaylist_thumbsHolder.animate({
						    opacity: 1,
						    top:new_top+'px'
						  }, 500, 'easeOutCubic', function() {
						    // Animation complete.
							  current_obj.isCarouselScrolling=false;
						});
					}
		}
	};



			function rearangethumbs(current_obj,options,total_images,allinone_bannerWithPlaylist_container,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_thumbsHolder,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper,allinone_bannerWithPlaylist_thumbsHolderWrapper,allinone_bannerWithPlaylist_paddingDiv,allinone_bannerWithPlaylist_titleDiv,allinone_bannerWithPlaylist_regDiv) {
						//thumbs
				//if (options.origWidth!=options.width) {
					//alert (allinone_bannerWithPlaylist_regDiv.html());
							thumbsHolder_Thumbs.css({
								'height':parseInt(options.origThumbH/(options.origWidth/options.width),10)+'px'
							});
							//parseInt(options.origThumbH/(options.origWidth/options.width),10)

							allinone_bannerWithPlaylist_paddingDiv.css({
								'padding-left':parseInt(options.origthumbLeftPadding/(options.origWidth/options.width),10)+'px',
								'padding-right':parseInt(options.origthumbRightPadding/(options.origWidth/options.width),10)+'px',
								'padding-top':parseInt(options.origthumbTopPadding/(options.origWidth/options.width),10)+'px',
								'padding-bottom':parseInt(options.origthumbBottomPadding/(options.origWidth/options.width),10)+'px'
							});

							var font_units='px';
							if (allinone_bannerWithPlaylist_titleDiv.css('font-size').lastIndexOf('em')!=-1)
								font_units='em';
							var height_units='px';
							if (allinone_bannerWithPlaylist_titleDiv.css('line-height').lastIndexOf('em')!=-1)
								height_units='em';
							allinone_bannerWithPlaylist_titleDiv.css({
								'font-size':parseInt(options.origthumbTitleFont/(options.origWidth/options.width),10)+font_units,
								'line-height':parseInt(options.origthumbTitleLineHeight/(options.origWidth/options.width),10)+height_units
							});

							//alert (options.origthumbRegLineHeight+'  --  '+parseInt(options.origthumbRegLineHeight/(options.origWidth/options.width),10));
							font_units='px';
							if (allinone_bannerWithPlaylist_regDiv.css('font-size').lastIndexOf('em')!=-1)
								font_units='em';
							height_units='px';
							if (allinone_bannerWithPlaylist_regDiv.css('line-height').lastIndexOf('em')!=-1)
								height_units='em';
							allinone_bannerWithPlaylist_regDiv.css({
								'font-size':parseInt(options.origthumbRegFont/(options.origWidth/options.width),10)+font_units,
								'line-height':parseInt(options.origthumbRegLineHeight/(options.origWidth/options.width),10)+height_units
							});

							if (options.showThumbs) {
								var imageInside = $('.thumbsHolder_ThumbOFF', allinone_bannerWithPlaylist_container).find('img:first');

								imageInside.css({
									"width":parseInt(options.origThumbImgW/(options.origWidth/options.width),10)+"px",
									"height":parseInt(options.origThumbImgH/(options.origWidth/options.width),10)+"px"
								});
							}



							//allinone_bannerWithPlaylist_thumbsHolder.css('height',allinone_bannerWithPlaylist_thumbsHolder.height()+current_obj.thumbMarginTop+thumbsHolder_Thumb.height()+'px');
							current_obj.thumbMarginTop=Math.floor( (allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-thumbsHolder_Thumb.height()*options.numberOfThumbsPerScreen)/(options.numberOfThumbsPerScreen-1) );
							thumb_i=0;
							allinone_bannerWithPlaylist_thumbsHolder.children().each(function() {
								thumb_i++;
								theThumb = $(this);
								if ( thumb_i<=1 ) {
									theThumb.css('margin-top',Math.floor( ( allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-2*options.borderWidth/(options.origWidth/options.width)-(current_obj.thumbMarginTop+theThumb.height())*(options.numberOfThumbsPerScreen-1) - theThumb.height() )/2 )+'px');
								} else {
									theThumb.css('margin-top',current_obj.thumbMarginTop+'px');
								}


							});


				//}


			}






			function doResize(current_obj,options,current_effect,total_images,imgs,allinone_bannerWithPlaylist_the,bannerControls,allinone_bannerWithPlaylist_container,allinone_bannerWithPlaylist_border,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_thumbsHolder,thumbsHolder_Thumb,allinone_bannerWithPlaylist_leftNav,allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper,allinone_bannerWithPlaylist_thumbsHolderWrapper,allinone_bannerWithPlaylist_paddingDiv,allinone_bannerWithPlaylist_titleDiv,allinone_bannerWithPlaylist_regDiv,allinone_bannerWithPlaylist_sliderVertical) {
					var ver_ie=getInternetExplorerVersion();
					//var bodyOverflow_initial=$('body').css('overflow');
					var sliderEpsilon=0;
					//$('body').css('overflow','hidden');


					/*responsiveWidth=allinone_bannerWithPlaylist_the.parent().parent().width();
					responsiveHeight=allinone_bannerWithPlaylist_the.parent().parent().height();*/
					responsiveWidth=allinone_bannerWithPlaylist_the.parent().parent().parent().width();
					responsiveHeight=allinone_bannerWithPlaylist_the.parent().parent().parent().height();

					if (options.responsiveRelativeToBrowser) {
						responsiveWidth=$(window).width();
						responsiveHeight=$(window).height();
					}


					if (options.width100Proc) {
						options.width=responsiveWidth;
					}

					if (options.height100Proc) {
						options.height=responsiveHeight;
					}

					if (options.origWidth!=responsiveWidth || options.width100Proc) {
						if (options.origWidth>responsiveWidth || options.width100Proc) {
							options.width=responsiveWidth;
						} else if (!options.width100Proc) {
							options.width=options.origWidth;
						}
						if (!options.height100Proc)
							options.height=options.width/current_obj.bannerRatio;

						options.width=parseInt(options.width,10);
						options.height=parseInt(options.height,10);



						/*** reposition elements start **/
						//set banner size
						allinone_bannerWithPlaylist_border.width(options.width);
						allinone_bannerWithPlaylist_border.height(options.height);

						allinone_bannerWithPlaylist_container.width(parseInt(options.width - 3*options.borderWidth/(options.origWidth/options.width) - options.playlistWidth/(options.origWidth/options.width),10));
						allinone_bannerWithPlaylist_container.height(parseInt(options.height - 2*options.borderWidth/(options.origWidth/options.width),10));
						allinone_bannerWithPlaylist_container.css({
							'left':options.borderWidth/(options.origWidth/options.width)+'px',
							'top':options.borderWidth/(options.origWidth/options.width)+'px'
						});


						allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper.width(options.playlistWidth/(options.origWidth/options.width));
						allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper.height(allinone_bannerWithPlaylist_container.height());


						allinone_bannerWithPlaylist_thumbsHolderWrapper.width(options.playlistWidth/(options.origWidth/options.width));
						allinone_bannerWithPlaylist_thumbsHolderWrapper.height(allinone_bannerWithPlaylist_container.height());
						allinone_bannerWithPlaylist_thumbsHolderWrapper.css({
							'top':0,
							'right':(-1)*(options.borderWidth/(options.origWidth/options.width)+options.playlistWidth/(options.origWidth/options.width))+'px'
						});


						allinone_bannerWithPlaylist_thumbsHolder.width(options.playlistWidth/(options.origWidth/options.width));
						allinone_bannerWithPlaylist_thumbsHolder.css('top',options.borderWidth/(options.origWidth/options.width)+'px');


						if (total_images>options.numberOfThumbsPerScreen) {
							if (options.borderWidth<=0)
								sliderEpsilon=allinone_bannerWithPlaylist_sliderVertical.width()/2;
							allinone_bannerWithPlaylist_sliderVertical.height(allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-25); // 25 is the height of  .slider-vertical.ui-slider .ui-slider-handle
							allinone_bannerWithPlaylist_sliderVertical.css({
								'display':'block',
								'left':Math.floor(options.width-2*options.borderWidth/(options.origWidth/options.width)+(options.borderWidth/(options.origWidth/options.width)-allinone_bannerWithPlaylist_sliderVertical.width())/2)-sliderEpsilon+'px'
							});
						}

						if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || (ver_ie!=-1 && ver_ie<=7)) {
							$('#curBgImgIos', allinone_bannerWithPlaylist_container).attr('src',current_obj.current_imgInside.attr("src"));
							$('#curBgImgIos', allinone_bannerWithPlaylist_container).width(allinone_bannerWithPlaylist_container.width());
							$('#curBgImgIos', allinone_bannerWithPlaylist_container).height(allinone_bannerWithPlaylist_container.height());
						} else {
							if (ver_ie==-1 || (ver_ie!=-1 && ver_ie>=9) ) {
								allinone_bannerWithPlaylist_container.css({
								'-webkit-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
								'-moz-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
								'-o-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
								'-ms-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
								'background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px'
								});
							} else if (ver_ie==8) {
								allinone_bannerWithPlaylist_container.css({filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+current_obj.current_imgInside.attr('src')+"',sizingMethod='scale')"});
							}
						}



						/*** reposition elements end **/



						/*for (i=0; i<total_images; i++) {
							//reposition text
							$($(imgs[i]).attr('data-text-id')).css('width',allinone_bannerWithPlaylist_the.width()+'px');
						}*/


						rearangethumbs(current_obj,options,total_images,allinone_bannerWithPlaylist_container,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_thumbsHolder,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper,allinone_bannerWithPlaylist_thumbsHolderWrapper,allinone_bannerWithPlaylist_paddingDiv,allinone_bannerWithPlaylist_titleDiv,allinone_bannerWithPlaylist_regDiv);



					clearTimeout(current_obj.timeoutID);

					allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);


					}


					//$('body').css('overflow',bodyOverflow_initial);
			}



			function getInternetExplorerVersion()
			// -1 - not IE
			// 7,8,9 etc
			{
			   var rv = -1; // Return value assumes failure.
			   if (navigator.appName == 'Microsoft Internet Explorer')
			   {
				  var ua = navigator.userAgent;
				  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				  if (re.exec(ua) != null)
					 rv = parseFloat( RegExp.$1 );
			   }
			   return parseInt(rv,10);
			}




	$.fn.allinone_bannerWithPlaylist = function(options) {


		var options = $.extend({},$.fn.allinone_bannerWithPlaylist.defaults, options);

		return this.each(function() {
			var allinone_bannerWithPlaylist_the = $(this);

					responsiveWidth=allinone_bannerWithPlaylist_the.parent().width();
					responsiveHeight=allinone_bannerWithPlaylist_the.parent().height();
					if (options.responsiveRelativeToBrowser) {
						responsiveWidth=$(window).width();
						responsiveHeight=$(window).height();
					}
					options.origWidth=options.width;
					if (options.width100Proc)
						options.width=responsiveWidth;

					options.origHeight=options.height;
					if (options.height100Proc) {
						options.height=responsiveHeight;
					}

					if (options.responsive && (options.origWidth!=responsiveWidth || options.width100Proc)) {
						if (options.origWidth>responsiveWidth || options.width100Proc) {
							options.width=responsiveWidth;
						} else {
							options.width=options.origWidth;
						}
						if (!options.height100Proc)
							options.height=options.width/(options.origWidth/options.origHeight);
					}

					options.width=parseInt(options.width,10);
					options.height=parseInt(options.height,10);



			allinone_bannerWithPlaylist_the.css("display","block");

			//the controllers
			var allinone_bannerWithPlaylist_wrapBorder = $('<div></div>').addClass('allinone_bannerWithPlaylistBorder');
			var allinone_bannerWithPlaylist_wrap = $('<div></div>').addClass('allinone_bannerWithPlaylist').addClass(options.skin);
			var bannerControls = $('<div class="bannerControls">   <div class="leftNav"></div>   <div class="rightNav"></div>    <div class="thumbsHolderWrapper"><div class="thumbsHolderVisibleWrapper"><div class="thumbsHolder"></div></div></div>  <div class="slider-vertical"></div>     </div>  <canvas class="mycanvas"></canvas>');
			allinone_bannerWithPlaylist_the.wrap(allinone_bannerWithPlaylist_wrap);
			allinone_bannerWithPlaylist_the.after(bannerControls);



			if (!options.showAllControllers)
				bannerControls.css("display","none");

			//the elements
			var allinone_bannerWithPlaylist_container = allinone_bannerWithPlaylist_the.parent('.allinone_bannerWithPlaylist');
			var bannerControls = $('.bannerControls', allinone_bannerWithPlaylist_container);

			allinone_bannerWithPlaylist_container.wrap(allinone_bannerWithPlaylist_wrapBorder);
			var allinone_bannerWithPlaylist_border = allinone_bannerWithPlaylist_container.parent('.allinone_bannerWithPlaylistBorder');

			var allinone_bannerWithPlaylist_leftNav = $('.leftNav', allinone_bannerWithPlaylist_container);
			var allinone_bannerWithPlaylist_rightNav = $('.rightNav', allinone_bannerWithPlaylist_container);
			allinone_bannerWithPlaylist_leftNav.css("display","none");
			allinone_bannerWithPlaylist_rightNav.css("display","none");
			if (options.showNavArrows) {
				if (options.showOnInitNavArrows) {
					allinone_bannerWithPlaylist_leftNav.css("display","block");
					allinone_bannerWithPlaylist_rightNav.css("display","block");
				}
			}


			var allinone_bannerWithPlaylist_thumbsHolderWrapper = $('.thumbsHolderWrapper', allinone_bannerWithPlaylist_container);
			var allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper = $('.thumbsHolderVisibleWrapper', allinone_bannerWithPlaylist_container);
			var allinone_bannerWithPlaylist_thumbsHolder = $('.thumbsHolder', allinone_bannerWithPlaylist_container);
			var allinone_bannerWithPlaylist_sliderVertical = $('.slider-vertical', allinone_bannerWithPlaylist_container);
			var allinone_bannerWithPlaylist_paddingDiv;
			var allinone_bannerWithPlaylist_titleDiv;
			var allinone_bannerWithPlaylist_regDiv;

		    var ver_ie=getInternetExplorerVersion();

			//the vars
			var current_effect=options.defaultEffect;
			var total_images=0;
			var current_obj = {
				current_img_no:0,
				currentImg:0,
				current_imgInside:'',
				windowWidth:0,
				carouselStep:0,
				thumbMarginTop:0,
				bottomNavClicked:false,
				effectIsRunning:false,
				mouseOverBanner:false,
				timeoutID:'',
				intervalID:'',
				arcInitialTime:(new Date).getTime(),
				timeElapsed:0,
				canvas:'',
				ctx:'',
				bannerRatio:options.origWidth/options.origHeight
			};

			var i = 0;


			current_obj.canvas = $('.mycanvas', allinone_bannerWithPlaylist_container)[0];
			current_obj.canvas.width=2*options.circleRadius+4*options.circleLineWidth;
			current_obj.canvas.height=2*options.circleRadius+4*options.circleLineWidth;

			if (ver_ie!=-1 && ver_ie<9) {
			   options.showCircleTimer=false;
			}
			if (options.showCircleTimer) {
				current_obj.ctx = current_obj.canvas.getContext('2d');
			}

			//set banner size
			allinone_bannerWithPlaylist_border.width(options.width);
			allinone_bannerWithPlaylist_border.height(options.height);
			allinone_bannerWithPlaylist_border.css("background",options.borderColor);

			allinone_bannerWithPlaylist_container.width(options.width - 3*options.borderWidth/(options.origWidth/options.width) - options.playlistWidth/(options.origWidth/options.width));
			allinone_bannerWithPlaylist_container.height(options.height - 2*options.borderWidth/(options.origWidth/options.width));
			allinone_bannerWithPlaylist_container.css({
				'left':options.borderWidth/(options.origWidth/options.width)+'px',
				'top':options.borderWidth/(options.origWidth/options.width)+'px'
			});

			bannerControls.width('100%');
			bannerControls.height('100%');

			allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper.width(options.playlistWidth/(options.origWidth/options.width));
			allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper.height(allinone_bannerWithPlaylist_container.height());


			allinone_bannerWithPlaylist_thumbsHolderWrapper.width(options.playlistWidth/(options.origWidth/options.width));
			allinone_bannerWithPlaylist_thumbsHolderWrapper.height(allinone_bannerWithPlaylist_container.height());
			allinone_bannerWithPlaylist_thumbsHolderWrapper.css({
				'top':0,
				'right':(-1)*(options.borderWidth/(options.origWidth/options.width)+options.playlistWidth/(options.origWidth/options.width))+'px'
			});


			allinone_bannerWithPlaylist_thumbsHolder.width(options.playlistWidth/(options.origWidth/options.width));
			allinone_bannerWithPlaylist_thumbsHolder.css('top',options.borderWidth/(options.origWidth/options.width)+'px');

			//center plugin
			if (options.centerPlugin) {
				allinone_bannerWithPlaylist_border.css({
					"margin":"0 auto"
				});
			}

			//get images
			var theul= allinone_bannerWithPlaylist_the.find('ul:first');
			var imgs = theul.children();
			var thumbsHolder_Thumb;
			var image_name='';
			var thumbUnit='';
			var sliderEpsilon=0;
			imgs.each(function() {
	            current_obj.currentImg = $(this);
	            if(!current_obj.currentImg.is('li')){
	            	current_obj.currentImg = current_obj.currentImg.find('li:first');
	            }

	            if(current_obj.currentImg.is('li')){
	            	current_obj.currentImg.css('display','none');
	            	total_images++;


		            //generate thumbsHolder
					var image_name = $(imgs[total_images-1]).attr('data-bottom-thumb');
					thumbUnit='';
					if (options.showThumbs)
						thumbUnit='<img src="' + image_name + '">';
					thumbsHolder_Thumb = $('<div class="thumbsHolder_ThumbOFF" rel="'+ (total_images-1) +'"><div class="padding">'+thumbUnit+'<span class="title">'+current_obj.currentImg.attr('data-title')+'</span><span class="reg">'+current_obj.currentImg.attr('data-desc')+'</span></div></div>');
		            allinone_bannerWithPlaylist_thumbsHolder.append(thumbsHolder_Thumb);

					if (options.origThumbW==0) {

					   	if (options.numberOfThumbsPerScreen==0) {
							options.numberOfThumbsPerScreen=Math.floor((options.origHeight)/thumbsHolder_Thumb.height());
						}
						options.origThumbW=thumbsHolder_Thumb.width();
						options.origThumbH=thumbsHolder_Thumb.height();

						allinone_bannerWithPlaylist_paddingDiv=$('.thumbsHolder_ThumbOFF .padding', allinone_bannerWithPlaylist_container);
						options.origthumbLeftPadding=allinone_bannerWithPlaylist_paddingDiv.css('padding-left').substr(0,allinone_bannerWithPlaylist_paddingDiv.css('padding-left').lastIndexOf('px'));
						options.origthumbRightPadding=allinone_bannerWithPlaylist_paddingDiv.css('padding-right').substr(0,allinone_bannerWithPlaylist_paddingDiv.css('padding-left').lastIndexOf('px'));
						options.origthumbTopPadding=allinone_bannerWithPlaylist_paddingDiv.css('padding-top').substr(0,allinone_bannerWithPlaylist_paddingDiv.css('padding-left').lastIndexOf('px'));
						options.origthumbBottomPadding=allinone_bannerWithPlaylist_paddingDiv.css('padding-bottom').substr(0,allinone_bannerWithPlaylist_paddingDiv.css('padding-left').lastIndexOf('px'));
						current_obj.thumbMarginTop=Math.floor( (allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-thumbsHolder_Thumb.height()*options.numberOfThumbsPerScreen)/(options.numberOfThumbsPerScreen-1) );

						allinone_bannerWithPlaylist_titleDiv=$('.thumbsHolder_ThumbOFF .title', allinone_bannerWithPlaylist_container);
						allinone_bannerWithPlaylist_regDiv=$('.thumbsHolder_ThumbOFF .reg', allinone_bannerWithPlaylist_container);

						if (allinone_bannerWithPlaylist_titleDiv.css('font-size').lastIndexOf('px')!=-1) {
							options.origthumbTitleFont=allinone_bannerWithPlaylist_titleDiv.css('font-size').substr(0,allinone_bannerWithPlaylist_titleDiv.css('font-size').lastIndexOf('px'));
						} else if (allinone_bannerWithPlaylist_titleDiv.css('font-size').lastIndexOf('em')!=-1) {
							options.origthumbTitleFont=allinone_bannerWithPlaylist_titleDiv.css('font-size').substr(0,allinone_bannerWithPlaylist_titleDiv.css('font-size').lastIndexOf('em'));
						}
						if (allinone_bannerWithPlaylist_titleDiv.css('line-height').lastIndexOf('px')!=-1) {
							options.origthumbTitleLineHeight=allinone_bannerWithPlaylist_titleDiv.css('line-height').substr(0,allinone_bannerWithPlaylist_titleDiv.css('line-height').lastIndexOf('px'));
						} else if (allinone_bannerWithPlaylist_titleDiv.css('line-height').lastIndexOf('em')!=-1) {
							options.origthumbTitleLineHeight=allinone_bannerWithPlaylist_titleDiv.css('line-height').substr(0,allinone_bannerWithPlaylist_titleDiv.css('line-height').lastIndexOf('em'));
						}


						if (allinone_bannerWithPlaylist_regDiv.css('font-size').lastIndexOf('px')!=-1) {
							options.origthumbRegFont=allinone_bannerWithPlaylist_regDiv.css('font-size').substr(0,allinone_bannerWithPlaylist_regDiv.css('font-size').lastIndexOf('px'));
						} else if (allinone_bannerWithPlaylist_regDiv.css('font-size').lastIndexOf('em')!=-1) {
							options.origthumbRegFont=allinone_bannerWithPlaylist_regDiv.css('font-size').substr(0,allinone_bannerWithPlaylist_regDiv.css('font-size').lastIndexOf('em'));
						}
						if (allinone_bannerWithPlaylist_regDiv.css('line-height').lastIndexOf('px')!=-1) {
							options.origthumbRegLineHeight=allinone_bannerWithPlaylist_regDiv.css('line-height').substr(0,allinone_bannerWithPlaylist_regDiv.css('line-height').lastIndexOf('px'));
						} else if (allinone_bannerWithPlaylist_regDiv.css('line-height').lastIndexOf('em')!=-1) {
							options.origthumbRegLineHeight=allinone_bannerWithPlaylist_regDiv.css('line-height').substr(0,allinone_bannerWithPlaylist_regDiv.css('line-height').lastIndexOf('em'));
						}


                    }


		            //alert(allinone_bannerWithPlaylist_thumbsHolderWrapper.height());
		            allinone_bannerWithPlaylist_thumbsHolder.css('height',allinone_bannerWithPlaylist_thumbsHolder.height()+current_obj.thumbMarginTop+thumbsHolder_Thumb.height()+'px');
		            if ( total_images<=1 ) {
		            	thumbsHolder_Thumb.css('margin-top',Math.floor( ( allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-2*options.borderWidth/(options.origWidth/options.width)-(current_obj.thumbMarginTop+thumbsHolder_Thumb.height())*(options.numberOfThumbsPerScreen-1) - thumbsHolder_Thumb.height() )/2 )+'px');
		            } else {
		            	thumbsHolder_Thumb.css('margin-top',current_obj.thumbMarginTop+'px');
		            }

	            }



	        });


			allinone_bannerWithPlaylist_paddingDiv=$('.thumbsHolder_ThumbOFF .padding', allinone_bannerWithPlaylist_container);
			allinone_bannerWithPlaylist_titleDiv=$('.thumbsHolder_ThumbOFF .title', allinone_bannerWithPlaylist_container);
			allinone_bannerWithPlaylist_regDiv=$('.thumbsHolder_ThumbOFF .reg', allinone_bannerWithPlaylist_container);
			var thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', allinone_bannerWithPlaylist_container);
			rearangethumbs(current_obj,options,total_images,allinone_bannerWithPlaylist_container,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_thumbsHolder,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper,allinone_bannerWithPlaylist_thumbsHolderWrapper,allinone_bannerWithPlaylist_paddingDiv,allinone_bannerWithPlaylist_titleDiv,allinone_bannerWithPlaylist_regDiv);


            //the scroller
			if (total_images>options.numberOfThumbsPerScreen) {
				allinone_bannerWithPlaylist_sliderVertical.slider({
					orientation: "vertical",
					range: "min",
					min: 1,
					max: 100,
					step:1,
					value: 100,
					slide: function( event, ui ) {
						//alert( ui.value );
						carouselScroll(ui.value,thumbsHolder_Thumb,total_images,allinone_bannerWithPlaylist_thumbsHolder,options,current_obj,allinone_bannerWithPlaylist_sliderVertical);

					}
				});

				if (options.borderWidth<=0)
					sliderEpsilon=allinone_bannerWithPlaylist_sliderVertical.width()/2;
            	allinone_bannerWithPlaylist_sliderVertical.height(allinone_bannerWithPlaylist_thumbsHolderWrapper.height()-25); // 25 is the height of  .slider-vertical.ui-slider .ui-slider-handle
            	allinone_bannerWithPlaylist_sliderVertical.css({
					'display':'block',
					'left':Math.floor(options.width-2*options.borderWidth/(options.origWidth/options.width)+(options.borderWidth/(options.origWidth/options.width)-allinone_bannerWithPlaylist_sliderVertical.width())/2)-sliderEpsilon+'px'
				});
            }






	        //initialize first number image
			current_obj.current_img_no = options.firstImg;
			if (options.firstImg>total_images)
				current_obj.current_img_no=total_images;
			if (options.firstImg<0)
				current_obj.current_img_no=0;


			//initialize first image number if randomize option is set
			if(options.randomizeImages){
	        	current_obj.current_img_no = Math.floor(Math.random() * total_images);
	        }


			if (current_obj.current_img_no>=options.numberOfThumbsPerScreen) {
				carouselScroll(0,thumbsHolder_Thumb,total_images,allinone_bannerWithPlaylist_thumbsHolder,options,current_obj,allinone_bannerWithPlaylist_sliderVertical);
			}



	        //Get first image (using initialized above current_obj.current_img_no) and init first bg
            current_obj.currentImg = $(imgs[current_obj.current_img_no]);
			current_obj.current_imgInside=current_obj.currentImg.find('img:first');


			if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || (ver_ie!=-1 && ver_ie<=7)) {
				allinone_bannerWithPlaylist_container.append('<img id="curBgImgIos" src="'+ current_obj.current_imgInside.attr("src") +'" width="'+allinone_bannerWithPlaylist_container.width()+'" height="'+allinone_bannerWithPlaylist_container.height()+'">');
			} else {
				allinone_bannerWithPlaylist_container.css('background','url("'+ current_obj.current_imgInside.attr('src') +'") no-repeat');
				if (options.responsive) {
					if (ver_ie==-1 || (ver_ie!=-1 && ver_ie>=9) ) {
						allinone_bannerWithPlaylist_container.css({
							'-webkit-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
							'-moz-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
							'-o-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
							'-ms-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
							'background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px'
						});

					} else if (ver_ie==8) {
						allinone_bannerWithPlaylist_container.css({filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+current_obj.current_imgInside.attr('src')+"',sizingMethod='scale')"});
					}
				}
			}





			/*if (options.enableTouchScreen) {
				var randomNo=Math.floor(Math.random()*100000);

				allinone_bannerWithPlaylist_container.wrap('<div id="bannerWithPlaylistParent_'+randomNo+'" style="position:relative;" />');
				$('#bannerWithPlaylistParent_'+randomNo).width(allinone_bannerWithPlaylist_container.width());
				$('#bannerWithPlaylistParent_'+randomNo).height(options.height-2*options.borderWidth/(options.origWidth/options.width)+1);
				$('#bannerWithPlaylistParent_'+randomNo).css({
					'left':options.borderWidth/(options.origWidth/options.width)+'px',
					'top':options.borderWidth/(options.origWidth/options.width)+'px'
				});

				allinone_bannerWithPlaylist_container.css({
					'cursor':'url('+options.absUrl+'skins/hand.cur),url('+options.absUrl+'skins/hand.cur),move',
					'left':0+'px',
					'top':0+'px',
					'position':'absolute'
				});


				allinone_bannerWithPlaylist_container.draggable({
					axis: 'y',
					containment: 'parent',
					start: function(event, ui) {
						origTop=$(this).css('top');
					},
					stop: function(event, ui) {
						if (!current_obj.effectIsRunning) {
							finalTop=$(this).css('top');
							direction=1;
							if (origTop>=finalTop) {
								direction=-1;
							}
							//alert (origTop+'<'+finalTop+'-'+direction);
							allinone_bannerWithPlaylist_navigation(direction,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);
						}
						$(this).css('top',0+'px');
					}

				});
			}	*/


			if (options.enableTouchScreen) {
				allinone_bannerWithPlaylist_container.swipe({
				  swipe:function(event, direction, distance, duration, fingerCount) {
					  if (!current_obj.effectIsRunning) {
						  if (direction=='right') {
							  direction=-1;
						  } else {
							  direction=1;
						  }
						 //clearTimeout(current_obj.timeoutID);
						 allinone_bannerWithPlaylist_navigation(direction,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);
						//$(this).text("You swiped " + direction );
					  }
				  }
				});
			}





	        //generate the text for first image
	        animate_texts(current_obj,options,allinone_bannerWithPlaylist_the,bannerControls);






	        //Event when Animation finishes
			allinone_bannerWithPlaylist_container.bind('effectComplete', function(){
				var ver_ie=getInternetExplorerVersion();
				current_obj.effectIsRunning=false;

					if (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1 || (ver_ie!=-1 && ver_ie<=7)) {
						$('#curBgImgIos', allinone_bannerWithPlaylist_container).attr('src',current_obj.current_imgInside.attr("src"));
						$('#curBgImgIos', allinone_bannerWithPlaylist_container).width(allinone_bannerWithPlaylist_container.width());
						$('#curBgImgIos', allinone_bannerWithPlaylist_container).height(allinone_bannerWithPlaylist_container.height());
					} else {
						allinone_bannerWithPlaylist_container.css('background','url("'+ current_obj.current_imgInside.attr('src') +'") no-repeat');
						if (options.responsive) {
							if (ver_ie==-1 || (ver_ie!=-1 && ver_ie>=9) ) {
								allinone_bannerWithPlaylist_container.css({
									'-webkit-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
									'-moz-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
									'-o-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
									'-ms-background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px',
									'background-size':allinone_bannerWithPlaylist_container.width()+'px '+allinone_bannerWithPlaylist_container.height()+'px'
								});

							} else if (ver_ie==8) {
								allinone_bannerWithPlaylist_container.css({filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+current_obj.current_imgInside.attr('src')+"',sizingMethod='scale')"});
							}
					}
				}


				current_obj.arcInitialTime=(new Date).getTime();
				current_obj.timeElapsed=0;
				if (options.showCircleTimer) {
						clearInterval(current_obj.intervalID);

						current_obj.ctx.clearRect(0,0,current_obj.canvas.width,current_obj.canvas.height);
						current_obj.ctx.beginPath();
						current_obj.ctx.globalAlpha=options.behindCircleAlpha/100;
						current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, 2 * Math.PI, false);
						current_obj.ctx.lineWidth = options.circleLineWidth+2;
						current_obj.ctx.strokeStyle = options.behindCircleColor;
						current_obj.ctx.stroke();


						current_obj.ctx.beginPath();
						current_obj.ctx.globalAlpha=options.circleAlpha/100;
						current_obj.ctx.arc(options.circleRadius+2*options.circleLineWidth, options.circleRadius+2*options.circleLineWidth, options.circleRadius, 0, 0,  false);
						current_obj.ctx.lineWidth = options.circleLineWidth;
						current_obj.ctx.strokeStyle = options.circleColor;
						current_obj.ctx.stroke();

						current_obj.intervalID=setInterval(function(){the_arc(current_obj,options)}, 125);
				}


				animate_texts(current_obj,options,allinone_bannerWithPlaylist_the,bannerControls);

				if (options.autoPlay>0 && total_images>1 && !current_obj.mouseOverBanner) {
					clearTimeout(current_obj.timeoutID);
					current_obj.timeoutID=setTimeout(function(){ allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs)},options.autoPlay*1000);
				}
	        }); //bind









			//pause on hover
			allinone_bannerWithPlaylist_container.on( "mouseenter", function() {
				current_obj.mouseOverBanner=true;

				clearTimeout(current_obj.timeoutID);
				nowx = (new Date).getTime();
				current_obj.timeElapsed=current_obj.timeElapsed+(nowx-current_obj.arcInitialTime);

				if (options.autoHideNavArrows && options.showNavArrows) {
					allinone_bannerWithPlaylist_leftNav.css("display","block");
					allinone_bannerWithPlaylist_rightNav.css("display","block");
				}

			});

			allinone_bannerWithPlaylist_container.on( "mouseleave", function() {
				current_obj.mouseOverBanner=false;
				nowx = (new Date).getTime();
				if (options.autoHideNavArrows && options.showNavArrows) {
					allinone_bannerWithPlaylist_leftNav.css("display","none");
					allinone_bannerWithPlaylist_rightNav.css("display","none");
				}

				if (options.autoPlay>0 && total_images>1) {
					clearTimeout(current_obj.timeoutID);
					current_obj.arcInitialTime = (new Date).getTime();
					var new_delay = parseInt(options.autoPlay*1000-((current_obj.timeElapsed+nowx)-current_obj.arcInitialTime),10);
					current_obj.timeoutID=setTimeout(function(){ allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs)},new_delay);
				}
			});



			allinone_bannerWithPlaylist_container.on( "click", function() {
				if ($(imgs[current_obj.current_img_no]).attr('data-link')!=undefined && $(imgs[current_obj.current_img_no]).attr('data-link')!='' && !current_obj.effectIsRunning) {
					var cur_target=options.target;
					if ($(imgs[current_obj.current_img_no]).attr('data-target')!=undefined && $(imgs[current_obj.current_img_no]).attr('data-target')!=''){
						cur_target=$(imgs[current_obj.current_img_no]).attr('data-target');
					}

					if (cur_target=="_blank")
						window.open($(imgs[current_obj.current_img_no]).attr('data-link'));
					else
						window.location = $(imgs[current_obj.current_img_no]).attr('data-link');
				}
			});





			//controllers
			allinone_bannerWithPlaylist_leftNav.on( "click", function() {
				if (!current_obj.effectIsRunning) {
					//current_obj.mouseOverBanner=false;
					clearTimeout(current_obj.timeoutID);
					allinone_bannerWithPlaylist_navigation(-1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);
				}
			});
			allinone_bannerWithPlaylist_rightNav.on( "click", function() {
				if (!current_obj.effectIsRunning) {
					//current_obj.mouseOverBanner=false;
					clearTimeout(current_obj.timeoutID);
					allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);
				}
			});





			//tumbs nav
			//var thumbsHolder_Thumbs=$(".thumbsHolder_ThumbOFF");
			//var thumbsHolder_Thumbs=$('.thumbsHolder_ThumbOFF', allinone_bannerWithPlaylist_container);
			thumbsHolder_Thumbs.on( "click", function() {
				if (!current_obj.effectIsRunning) {
					var currentBut=$(this);
					var i=currentBut.attr('rel');
					//deactivate previous
					$(thumbsHolder_Thumbs[current_obj.current_img_no]).removeClass('thumbsHolder_ThumbON');

					current_obj.bottomNavClicked=true;
					current_obj.current_img_no=i-1;
					allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs);
					//alert (i+'  --  '+current_obj.current_img_no+'  --  '+total_images);
				}
			});

			thumbsHolder_Thumbs.on( "mouseenter", function() {
				var currentBut=$(this);
				var i=currentBut.attr('rel');

				currentBut.addClass('thumbsHolder_ThumbON');
			});

			thumbsHolder_Thumbs.on( "mouseleave", function() {
				var currentBut=$(this);
				var i=currentBut.attr('rel');

				if (current_obj.current_img_no!=i)
					currentBut.removeClass('thumbsHolder_ThumbON');
			});





			// mouse wheel
			allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper.mousewheel(function(event, delta, deltaX, deltaY) {
					if (total_images>options.numberOfThumbsPerScreen) {
							event.preventDefault();
							var currentScrollVal=allinone_bannerWithPlaylist_sliderVertical.slider( "value");
							//alert (currentScrollVal+' -- '+delta);
							if ( (parseInt(currentScrollVal,10)>1 && parseInt(delta,10)==-1) || (parseInt(currentScrollVal,10)<100 && parseInt(delta,10)==1) ) {
								currentScrollVal = currentScrollVal + delta;
								allinone_bannerWithPlaylist_sliderVertical.slider( "value", currentScrollVal);
								carouselScroll(currentScrollVal,thumbsHolder_Thumb,total_images,allinone_bannerWithPlaylist_thumbsHolder,options,current_obj,allinone_bannerWithPlaylist_sliderVertical);
								//alert (currentScrollVal);
							}
					}
			});



			var TO = false;
			$(window).on( "resize", function() {
				var ver_ie=getInternetExplorerVersion();
				doResizeNow=true;
				if (navigator.userAgent.indexOf('Android') != -1) {
					if (options.windowOrientationScreenSize0==0 && window.orientation==0)
						options.windowOrientationScreenSize0=$(window).width();

					if (options.windowOrientationScreenSize90==0 && window.orientation==90)
						options.windowOrientationScreenSize90=$(window).height();

					if (options.windowOrientationScreenSize_90==0 && window.orientation==-90)
						options.windowOrientationScreenSize_90=$(window).height();

					if (options.windowOrientationScreenSize0 && window.orientation==0 && $(window).width()>options.windowOrientationScreenSize0)
						doResizeNow=false;

					if (options.windowOrientationScreenSize90 && window.orientation==90 && $(window).height()>options.windowOrientationScreenSize90)
						doResizeNow=false;

					if (options.windowOrientationScreenSize_90 && window.orientation==-90 && $(window).height()>options.windowOrientationScreenSize_90)
						doResizeNow=false;


					if (current_obj.windowWidth==0) {
						doResizeNow=false;
						current_obj.windowWidth=$(window).width();
					}

				}
				if (ver_ie!=-1 && ver_ie==9 && current_obj.windowWidth==0)
					doResizeNow=false;


				if (current_obj.windowWidth==$(window).width()) {
					doResizeNow=false;
					if (options.windowCurOrientation!=window.orientation && navigator.userAgent.indexOf('Android') != -1) {
						options.windowCurOrientation=window.orientation;
						doResizeNow=true;
					}
				} else {
					/*if (current_obj.windowWidth===0 && (val.indexOf("ipad") != -1 || val.indexOf("iphone") != -1 || val.indexOf("ipod") != -1 || val.indexOf("webos") != -1))
						doResizeNow=false;*/
					current_obj.windowWidth=$(window).width();
				}



				if (options.responsive && doResizeNow) {
					 if(TO !== false)
						clearTimeout(TO);


					 TO = setTimeout(function(){ doResize(current_obj,options,current_effect,total_images,imgs,allinone_bannerWithPlaylist_the,bannerControls,allinone_bannerWithPlaylist_container,allinone_bannerWithPlaylist_border,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_thumbsHolder,thumbsHolder_Thumb,allinone_bannerWithPlaylist_leftNav,allinone_bannerWithPlaylist_thumbsHolderVisibleWrapper,allinone_bannerWithPlaylist_thumbsHolderWrapper,allinone_bannerWithPlaylist_paddingDiv,allinone_bannerWithPlaylist_titleDiv,allinone_bannerWithPlaylist_regDiv,allinone_bannerWithPlaylist_sliderVertical) }, 300); //200 is time in miliseconds
				}
			});



			//first start autoplay
			$(thumbsHolder_Thumbs[current_obj.current_img_no]).addClass('thumbsHolder_ThumbON');
			if (options.autoPlay>0 && total_images>1) {
				if (options.showCircleTimer) {
					current_obj.intervalID=setInterval(function(){the_arc(current_obj,options)}, 125);
				}

				current_obj.timeoutID=setTimeout(function(){ allinone_bannerWithPlaylist_navigation(1,current_obj,options,total_images,thumbsHolder_Thumbs,allinone_bannerWithPlaylist_container,thumbsHolder_Thumb,allinone_bannerWithPlaylist_thumbsHolder,allinone_bannerWithPlaylist_sliderVertical,imgs)},options.autoPlay*1000);
			}


		});
	};

	//reverse effect
	$.fn.myReverse = [].reverse;

	//
	// plugin skins
	//
	$.fn.allinone_bannerWithPlaylist.defaults = {
			skin: 'elegant',
			width:960,
			height:384,
			width100Proc:false,
			height100Proc:false,
			randomizeImages: false,
			firstImg:0,
			numberOfStripes:20,
			numberOfRows:5,
			numberOfColumns:10,
			defaultEffect:'random',
			effectDuration:0.5,
			autoPlay:4,
			loop:true,
			target:"_blank",
			showAllControllers:true,
			showNavArrows:true,
			showOnInitNavArrows:true, // o1
			autoHideNavArrows:true, // o1
			showThumbs:true,
			borderWidth: 15,
			borderColor: '#e9e9e9',
			playlistWidth: 300,
			enableTouchScreen:true,
			absUrl:'',

			showCircleTimer:true,
			showCircleTimerIE8IE7:false,
			circleRadius:10,
			circleLineWidth:4,
			circleColor: "#FF0000",
			circleAlpha: 100,
			behindCircleColor: "#000000",
			behindCircleAlpha: 50,
			responsive:false,
			responsiveRelativeToBrowser:true,
			centerPlugin:false,

			numberOfThumbsPerScreen:0,

			/*thumbsOnMarginTop:0,
			thumbsWrapperMarginTop:0,*/
			origWidth:0,
			origHeight:0,
			origThumbW:0,
			origThumbH:0,

			origThumbImgW:214,
			origThumbImgH:128,
			origthumbLeftPadding:0,
			origthumbRightPadding:0,
			origthumbTopPadding:0,
			origthumbBottomPadding:0,
			origthumbTitleFont:0,
			origthumbRegFont:0,
			origthumbTitleLineHeight:0,
			origthumbRegLineHeight:0,

			origthumbsHolder_MarginTop:0,
			windowOrientationScreenSize0:0,
			windowOrientationScreenSize90:0,
			windowOrientationScreenSize_90:0,
			windowCurOrientation:0
	};



})(jQuery);
