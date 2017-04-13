var countError = 0;

function loadServer(type,epid) {
	if(epid != 0){
		var epid = epid;
	} else {
		var epid = 0;
	}
    $.ajax({
        type: "POST",
        url: Base + "ajax/loadServer.php",
        data: {
            film_id: fid,
			epid : epid
        },
        dataType: 'json',
        success: function(res) {
            $('#list-servers').html(res.list);
            if (type == 1 && res.last_episode != '') {
                loadEpisode(res.last_episode);
            }
			$('.list-episodes', $('body')).mCustomScrollbar('destroy');
			$('.list-episodes .episodes', $('body')).mCustomScrollbar({
				scrollButtons: {
					enable: !0
				},
				theme: 'light-thin'
			}).mCustomScrollbar('scrollTo', '.list-servers .list-episodes a.btn-brown');
        }
    });
}
function updateViews(film_id){
	$.ajax({
        type: "GET",
        url: Base + "ajax/FilmUpdateView.php",
        data: {
            film_id: film_id
        },
        dataType: 'json',
        success: function(res) {
            console.log('success update');
        }
    });
}
function loadEpisode(epid) { 
	if (epid != 0){
	$("#loadingvid").show();
	$(".sixteen-nine").block({
        message: "Đang tải, đợi một lát...",
        css: {
            border: "none",
            padding: "15px",
            backgroundColor: "#000",
            "-webkit-border-radius": "10px",
            "-moz-border-radius": "10px",
            opacity: .8,
            color: "#fff",
			width: "100%"
        }
    }),$('html, body').animate({
		scrollTop: $(".player-wrapper").offset().top
	}, 500).promise().done(function() {
		$("#loadingvid").html('<span class="loading style-1"></span>');
		$.getJSON( Base + "ajax/loadEpisode.php", {
			epid: epid
		  }).done(function( data ) {
				$('.list-servers span a[data-server-id]').removeClass('btn-red');
				$('.list-servers span a[data-server-id]').addClass('btn-primary');
				$('.list-servers span a[data-server-id] div').removeClass('playing');
				var curentString = $('#server'+data.server_id).text();
				var newString = '<div class="playing"></div> '+curentString;
				$('#server'+data.server_id).html(newString);
				$('#server'+data.server_id).removeClass("btn-primary");
				$('#server'+data.server_id).addClass("btn-red");
				
				if($('.episodes a.current').length > 0){
					$(".episodes a.current").removeClass("current");
				}
				$("#ep-" + epid).addClass("current");
				var TitleN = 'XemPhimOn-'+ data.Name + ' - Tập ' + data.EpPlaying;
				var host = data.Host;
				if (data.Raw.length > 0){
					loadIframe(data.Raw);
				} else {
					var Shitl	=	'http://play.xemphimon.com/proxy/proxy.php?file=' + data.Url + (data.UrlSrt ? ('&sub=' + data.UrlSrt): "") + '&img='+ data.Images + (data.Message ? ('&msg=' + data.Message) : "") + '&token=' + data.Token; 
					window.libPlayerCallback = {
						reloadMax : 1,
						videoDivPlayer : "loadingvid" ,
						config : {
							width : "100%" ,
							height : "100%",
							autostart : true
						},
						url 	: Shitl,
						mediaid : data.EpID,
						Host 	: data.Host,
						nextid 	: data.NextID,
						Alert_e	: 'Tập ' + data.EpPlaying +' lỗi rồi, Comment bên dưới nếu gặp lỗi này.'
					}
					startPlayerPlugin();
				}
				window.history.pushState(null, '', data.Slug);
				document.title = 'Xem Phim ' + data.Name + ' | Server ' + data.IDServer +' | Tập ' + data.EpPlaying;
				if($('span.item.last-child').length > 0){
					$('span.item.last-child').html('Server ' + data.IDServer + ' - Tập ' + data.EpPlaying);
				}
				if($('.title-tap-mobie').length > 0){
					$('.title-tap-mobie span').html('Server ' + data.IDServer + ' - Tập ' + data.EpPlaying);
				} 
			});	
	});
	}
}
function startPlayerPlugin(){
	if (typeof window.libPlayerCallback != "undefined"){
		if (window.libPlayerCallback.url == "" || window.libPlayerCallback.url == undefined){
			return;
		}
		if (typeof window.libPlayerCallback.reloadMax == "undefined"){
			window.libPlayerCallback.reloadMax = 1;
		}
		if (typeof window.libPlayerCallback.countLoad == "undefined"){
			window.libPlayerCallback.countLoad = 0;
		}
		$.ajax({
			url : window.libPlayerCallback.url,
			dataType : "json",
			timeout: 10 * 1000,
			error : function(e){
				if (window.libPlayerCallback.countLoad < window.libPlayerCallback.reloadMax){
					window.libPlayerCallback.countLoad ++;
					startPlayerPlugin();
				} else {
					$(".sixteen-nine").unblock();
					$(".sixteen-nine").block({
						message: "Xin Lỗi, Server Đang Quá Tải, Vui Lòng Thử Lại Sau.",
						css: {
							border: "none",
							padding: "20px",
							backgroundColor: "#000",
							"-webkit-border-radius": "10px",
							"-moz-border-radius": "10px",
							opacity: 2.5,
							color: "#fff",
							width: "100%",
							"font-size": "20px"
						}
					});
				}
			}, 
			success : function(e){
				if (typeof e.levels == null || e.levels.length == 0){
					if(e.raw.length > 0){
						loadIframe(e.raw);
					} else {
						$(".sixteen-nine").unblock();
						$(".sixteen-nine").block({
							message: window.libPlayerCallback.Alert_e,
							css: {
								border: "none",
								padding: "20px",
								backgroundColor: "#000",
								"-webkit-border-radius": "10px",
								"-moz-border-radius": "10px",
								opacity: 2.5,
								color: "#fff",
								width: "100%",
								"font-size": "20px"
							}
						});
					}
				}else{
					try {
						$(".sixteen-nine").unblock();
						var jwConfig = {};
						if (typeof window.libPlayerCallback.config == "object"){
							jwConfig = window.libPlayerCallback.config;
						}
						var jwplaylist = {};
						if (typeof e.levels != "undefined" && e.levels.length > 0){
							jwplaylist.sources = e.levels;
						}
						if (typeof e.tracks != "undefined" && e.tracks.length > 0){
							jwplaylist.tracks = e.tracks
						}
						if (typeof e.config != 'undefined'){
							if (e.config.image != undefined && e.config.image != ""){
								jwplaylist.image = e.config.image;
							}
							if (e.config.popup != "undefined" && e.config.popup.msg != ""){
								jwplaylist.popupmsg = e.config.popup.msg;
							}
						}
						jwplaylist.mediaid = window.libPlayerCallback.mediaid;
						jwConfig.playlist = [jwplaylist];
						var player = jwplayer(window.libPlayerCallback.videoDivPlayer).setup(jwConfig);
						player.on('complete', function(event) {
							loadEpisode(window.libPlayerCallback.nextid);
						});
						player.on('ready', function(event) {
							if (window.libPlayerCallback.nextid != 0) {
								this.addButton("http://i.imgur.com/jq5vedv.png", "Next Video", function() {
									loadEpisode(window.libPlayerCallback.nextid)
								}, "button5");
							}
						});
						player.on('error', function (event) { 
							var Domain = window.libPlayerCallback.Host;
							if(Domain.indexOf("google.com") > -1) {
								if (window.libPlayerCallback.countLoad < window.libPlayerCallback.reloadMax){
									window.libPlayerCallback.countLoad ++;
									startPlayerPlugin();
								} else {
									window.libPlayerCallback.countLoad = 0;
									if (window.libPlayerCallback.countLoad < window.libPlayerCallback.reloadMax){
										window.libPlayerCallback.countLoad ++;
										console.log("Getting lần 2 driver..." + window.libPlayerCallback.countLoad);
										window.libPlayerCallback = {
											reloadMax : 1,
											videoDivPlayer 	: "loadingvid" ,
											config : {
												width 		: "100%" ,
												height 		: "100%",
												autostart 	: true
											},
											url 	: window.libPlayerCallback.url + '&load=load_3',
											mediaid : 0,
											nextid 	: window.libPlayerCallback.nextid
										}
										startPlayerPlugin();
									} else {
											console.log("ko có giá trị trả về...");
											window.libPlayerCallback.countLoad = 0;
											$(".sixteen-nine").unblock();
											$(".sixteen-nine").block({
												message: "Xin Lỗi, IPv6 của bạn chưa hỗ trợ, vui lòng comment bên đươi để được hỗ trợ.",
												css: {
													border: "none",
													padding: "20px",
													backgroundColor: "#000",
													"-webkit-border-radius": "10px",
													"-moz-border-radius": "10px",
													opacity: 2.5,
													color: "#fff",
													width: "100%",
													"font-size": "20px"
												}
											});
									}
								}
							} else {
								if (window.libPlayerCallback.countLoad < window.libPlayerCallback.reloadMax){
									console.log("Getting...");
									window.libPlayerCallback.countLoad ++;
										window.libPlayerCallback = {
											reloadMax : 1,
											videoDivPlayer : "loadingvid" ,
											config : {
												width : "100%" ,
												height : "100%",
												autostart : true
											},
											url 	: window.libPlayerCallback.url + '&newcache=true',
											mediaid : 0,
											nextid 	: window.libPlayerCallback.nextid
										}
										startPlayerPlugin();
								} else {
										console.log("End...");
										window.libPlayerCallback.countLoad = 0;
										$(".sixteen-nine").unblock();
										$(".sixteen-nine").block({
											message: "Tập này bị lỗi, vui lòng comment bên đươi để được hỗ trợ.",
											css: {
												border: "none",
												padding: "20px",
												backgroundColor: "#000",
												"-webkit-border-radius": "10px",
												"-moz-border-radius": "10px",
												opacity: 2.5,
												color: "#fff",
												width: "100%",
												"font-size": "20px"
											}
										});
								}
							}
						});
					}catch(e){
						if (window.libPlayerCallback.countLoad < window.libPlayerCallback.reloadMax){
							window.libPlayerCallback.countLoad ++;
							startPlayerPlugin();
						} else {
							$(".sixteen-nine").unblock();
							$(".sixteen-nine").block({
								message: "Xin Lỗi, Lỗi Hệ Thống, Vui Lòng Tải Lại.",
								css: {
									border: "none",
									padding: "20px",
									backgroundColor: "#000",
									"-webkit-border-radius": "10px",
									"-moz-border-radius": "10px",
									opacity: 2.5,
									color: "#fff",
									width: "100%",
									"font-size": "20px"
								}
							});
						}
					}
				}
			}
		});
		
	}
}
function loadIframe(file){
	$("#loadingvid").html('<iframe style="width:100%;height:100%;" src="' + file + '" frameborder="0" allowfullscreen></iframe>');
	$(".sixteen-nine").unblock();
}