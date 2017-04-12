(function($) {
    var bodyTag = $('body'),
        mySlidebars;
    $.fn.bootstrapButton = $.fn.button;
    $.fn.bootstrapTooltip = $.fn.tooltip;
    BootstrapDialog.defaultOptions.nl2br = false;
    BootstrapDialog.defaultOptions.type = BootstrapDialog.TYPE_DEFAULT;
    var _setIntervalProgress;
    var blockUiConfig = {
        message: 'Loading...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    };
    window.add_query_var = function(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    };
    window.show_loading_page = function(id) {
        if (loadedShowLoadingPage) {
            return;
        }
        var progressBar = $('#progress-content-ajax', bodyTag);
        progressBar.removeClass('done').css({
            width: '100%'
        });
        var _timeProgress = 0;
        if (!_setIntervalProgress) {
            _setIntervalProgress = setInterval(function() {
                _timeProgress += 10;
                if (_timeProgress >= 100) {
                    clearInterval(_setIntervalProgress);
                    _setIntervalProgress = 0;
                    progressBar.addClass('done').css({
                        width: '0%'
                    });
                }
            }, 50);
        }
        loadedShowLoadingPage = true;
        $('.ajax-overlay').removeClass('hidden');
        $('.ajax-loading-box').removeClass('hidden');
        $('[type="submit"]').each(function() {
            if (!$(this).attr('data-loading-text')) {
                $(this).attr('data-loading-text', 'Loading...');
            }
        });
        $('input[type="submit"][data-loading-text], button[type="submit"][data-loading-text]').each(function() {
            $(this).button('loading');
        });
        setTimeout(function() {
            hide_loading_page();
        }, 7000);
    };
    window.hide_loading_page = function(id, data) {
        if (!loadedShowLoadingPage) {
            return false;
        }
        loadedShowLoadingPage = false;
        $('.ajax-overlay').addClass('hidden');
        $('.ajax-loading-box').addClass('hidden');
        $('input[type="submit"][data-loading-text], button[type="submit"][data-loading-text]').each(function() {
            $(this).button('reset');
        });
    };
    window.showAlert = function(_message, callback, title, options) {
        $.each(BootstrapDialog.dialogs, function(id, dialog) {
            dialog.close();
        });
        if (typeof title == 'undefined') {
            title = 'Thông Báo';
        }
        if (typeof options == 'undefined') {
            options = {};
        }
        options = $.extend(true, {
            title: title,
            message: _message,
            type: BootstrapDialog.TYPE_DEFAULT,
            callback: callback,
            buttonLabel: 'Close!'
        }, options);
        BootstrapDialog.alert(options);
    };
    var loadedShowLoadingPage = false,
        bodyTag = $('body'),
        scrollTrigger = 100,
        loadLazyLoad = function() {
            $('.lazyload-image', bodyTag).lazyLoadXT();
        },
        afterAjaxLoad = function() {
            bodyTag = $('body');
            $('[data-toggle="tooltip"]', bodyTag).tooltip();
            $('[data-toggle="dropdown"]', bodyTag).dropdown();
            $('input[data-type]', bodyTag).each(function() {
                $(this).attr('type', $(this).data('type'));
            });
            $('select.select2', bodyTag).each(function() {
                if (!$(this).data('select2')) {
                    var ob_config = $(this).data();
                    ob_config.with = '100%';
                    $(this).select2(ob_config);
                }
            });
            loadBackToTop();
            loadLazyLoad();
            if (typeof FB != 'undefined' && typeof FB.XFBML != 'undefined') {
                FB.XFBML.parse();
            }
            if ($("#slider-container", bodyTag).length > 0) {
                $("#slider-container", bodyTag).wowSlider({
                    effect: "louvers",
                    duration: 20 * 100,
                    delay: 20 * 100,
                    width: 960,
                    height: 360,
                    autoPlay: true,
                    autoPlayVideo: false,
                    playPause: true,
                    stopOnHover: false,
                    loop: false,
                    bullets: 1,
                    caption: true,
                    captionEffect: "parallax",
                    controls: true,
                    controlsThumb: false,
                    responsive: 2,
                    fullScreen: false,
                    gestures: 2,
                    onBeforeStep: 0,
                    images: 0
                });
            }
            $('.has-slide .block-items').each(function() {
                $(this).owlCarousel({
                    loop: true,
                    margin: 10,
                    dots: false,
                    items: 4,
                    nav: true,
                    responsive: {
                        0: {
                            items: 4
                        },
                        299: {
                            items: 2
                        },
                        319: {
                            items: 2
                        },
                        479: {
                            items: 3
                        },
                        767: {
                            items: 3
                        },
                        992: {
                            items: 3
                        },
                        993: {
                            items: 4
                        }
                    }
                });
            });
            if ($('.list-servers .list-episodes .episodes', bodyTag).length) {
                $('.list-servers .list-episodes .episodes', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {
                        enable: true
                    },
                    theme: "light-thin"
                }).mCustomScrollbar('scrollTo', '.list-servers .list-episodes a.btn-brown');
            }
            if ($('.list-actor .items', bodyTag).length) {
                $('.list-actor .items', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {
                        enable: true
                    },
                    theme: "light-thin"
                });
            }
            if ($('.list-group-trailer', bodyTag).length) {
                $('.list-group-trailer', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {
                        enable: true
                    },
                    theme: "light-thin"
                });
            }
            if ($('.movie-meta-info', bodyTag).length) {
                $('.movie-meta-info', bodyTag).css({
                    overflow: 'hidden'
                }).mCustomScrollbar({
                    scrollButtons: {
                        enable: true
                    },
                    theme: "light-thin"
                });
            }
            $('.rating-bar input', bodyTag).each(function() {
                var current_val_rating = $(this).val();
                var current_film_id = $(this).data('id');
                var current_this_rate = $(this);
                $(this).val((current_val_rating / 5).toFixed(1) * 5);
                $(this).rating({
                    showClear: false,
                    showCaptions: true,
                    hoverOnClear: false,
                    language: 'vi',
                    size: 'xs',
                    theme: 'krajee-fa',
                    min: 1,
                    max: 5,
                    step: 0.5,
                    filledStar: '<i class="fa fa-star"></i>',
                    emptyStar: '<i class="fa fa-star-o"></i>'
                }).on("rating.change", function(event, value, caption) {
                    var data_post = {
                        id: current_film_id,
                        value: parseInt(value)
                    };
                    $.ajax({
                        type: 'POST',
                        url: website_config.system.ajax_url + 'rate.php',
                        data: data_post,
                        dataType: 'json',
                        success: function(response) {
                            showAlert(response.message);
                            if (response.status == 'success') {
                                current_this_rate.rating('update', (response.data.rating_avg / 5).toFixed(1) * 5);
                            }
                        }
                    });
                });
            });
            $('.with-tabs .box-asian-tabs, .box-asian-tabs.tab-remote', bodyTag).each(function() {
                var _block_element, _block_content_element, $isBlock = true;
                if ($(this).hasClass('tab-remote')) {
                    $isBlock = false;
                }
                if ($isBlock) {
                    _block_element = $(this).parents('.block');
                    _block_content_element = $('>.block-content', _block_element);
                } else {
                    _block_element = $(this);
                    _block_content_element = $('>.tab-content', _block_element);
                }
                var nav_tabs = $(".nav-tabs", $(this));
                $('a', nav_tabs).on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('li', nav_tabs).removeClass('active');
                    $(this).parent('li').addClass('active');
                    var _blockID = $(this).data('block');
                    var _currentElm = $('> .' + _blockID, _block_content_element);
                    if (!_currentElm.length) {
                        $('<div class="' + _blockID + ' hidden"></div>').appendTo(_block_content_element);
                        _currentElm = $('> .' + _blockID, _block_content_element);
                    }
                    if (_currentElm.length > 0) {
                        if ($.trim(_currentElm.html())) {
                            $('> div', _block_content_element).addClass('hidden');
                            _currentElm.removeClass('hidden');
                        } else {
                            _block_content_element.block(blockUiConfig);
                            $.ajax({
                                type: 'POST',
                                url: Base + 'ajax/widget.php',
                                data: {
                                    widget: 'list-film',
                                    type: _blockID
                                },
                                success: function(html) {
                                    $('> div', _block_content_element).addClass('hidden');
                                    _currentElm.html(html).removeClass('hidden');
                                    _block_content_element.unblock();
                                },
                                error: function() {
                                    _block_content_element.unblock();
                                }
                            });
                        }
                    }
                    return false;
                });
            });
            $('.input-search', bodyTag).keyup(function() {
                if (window.innerWidth <= 1000 && window.innerHeight <= 800) {
                    var kw = $(".input-search.mobile").val();
                } else {
                    var kw = $(".input-search.desktop").val();
                }
                if (kw != '') {
                    $(".btn-search").html($("<i></i>").addClass("fa fa-spin fa-spinner"));
                    $.ajax({
                        type: 'POST',
                        url: Base + 'ajax/search.php',
                        data: {
                            query: kw
                        },
                        dataType: 'json',
                        success: function(a) {
                            $(".btn-search").html('<i class="fa fa-search"></i>');
                            if (window.innerWidth <= 1000 && window.innerHeight <= 800) {
                                $('#result-mobile').attr('style', 'display:block');
                                $('#result-mobile').html(a.results);
                            } else {
                                $('#result-desktop').attr('style', 'display:block');
                                $('#result-desktop').html(a.results);
                            }
                        }
                    });
                } else {
                    $('#result-mobile').attr('style', 'display:none');
                    $('#result-desktop').attr('style', 'display:none');
                }
            });
        },
        backToTop = function() {
            if ($('#back-to-top').length > 0) {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            }
        },
        loadBackToTop = function() {
            setTimeout(function() {
                if ($('#back-to-top').length < 1) {
                    bodyTag.append('<span id="back-to-top">&uarr;</span>');
                    backToTop();
                }
            }, 1000);
        },
        updateCssMedia = function() {
            if (window.matchMedia('(max-width: 860px)').matches) {
                if ($('.movie-info-detail').length < 1) {
                    var movie_info = $('.movie-info .page-col-right.pull-left', bodyTag).clone();
                    movie_info.removeAttr('class');
                    movie_info.addClass('movie-info-detail');
                    movie_info.appendTo($('.movie-info-top', bodyTag));
                }
            }
            if (window.matchMedia('(max-width: 991px)').matches) {
                bodyTag.addClass('max-width-992');
            } else {
                bodyTag.removeClass('max-width-992');
            }
        };
    $(window).on('scroll', function() {
        backToTop();
    });
    $(window).resize(function() {
        updateCssMedia();
    });
    $(document).ready(function() {
        $('#movie-carousel-top').carouFredSel({
            auto: false,
            prev: '#prevTop',
            next: '#nextTop',
        });
        window.topSliderInit = true;
        eval('console.log("topSliderInit")');
        //loadUserInfo(afterAjaxLoad);
        mySlidebars = new $.slidebars();
        updateCssMedia();
        afterAjaxLoad();
        $('.list-v').click();
        $('.top-day-ple').click();
        $('.top-day-pbo').click();
        $("#nav-menu-mobile > li > a").on("click", function(e) {
            if ($(this).parent().has("ul")) {
                e.preventDefault();
            }
            if (!$(this).hasClass("open")) {
                // hide any open menus and remove all other classes
                $("#nav-menu-mobile li ul").slideUp(350);
                $("#nav-menu-mobile li a").removeClass("open");
                // open our new menu and add the open class
                $(this).next("ul").slideDown(350);
                $(this).addClass("open");
            } else if ($(this).hasClass("open")) {
                $(this).removeClass("open");
                $(this).next("ul").slideUp(350);
            }
        });
        bodyTag.on('click', '.open-search', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).data('openSearch')) {
                $(this).data('openSearch', false);
                $('#mobile-header .form-search', bodyTag).hide();
                $(this).html('<i class="fa fa-search"></i>');
                $('#result-mobile').attr('style', 'display:none');
                $('#result-mobile').html('');
            } else {
                $(this).data('openSearch', true);
                $('#mobile-header .form-search', bodyTag).show().find('input').focus();
                $(this).html('<i class="fa fa-remove"></i>');
                $('#result-mobile').attr('style', 'display:block');
            }
            return false;
        }).on('click', '.movie-banner .icon-play.is-license', function(e) {
            e.preventDefault();
            showAlert('<p>Sorry! This content has been removed</p>');
            return false;
        }).on('click', '.movie-banner .icon-play.no-episode', function(e) {
            e.preventDefault();
            showAlert('<p>Sorry! This content has been removed</p>');
            return false;
        }).on('click', '.row-trailer a', function(e) {
            e.preventDefault();
            if ($('.trailer #youtube-frame').length > 0) {
                $('.trailer #youtube-frame').remove();
            }
            var html_embed_youtube = '<div id="youtube-frame"><span class="close"><i class="fa fa-remove"></i></span><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + $(this).data('id') + '?rel=0&autoplay=1&modestbranding=1&autohide=1&showinfo=0&controls=0" scrolling="no" frameborder="0" allowfullscreen></iframe></div>';
            $('.trailer', bodyTag).append(html_embed_youtube);
            return false;
        }).on('click', '.row-trailer .trailer .close', function() {
            if ($('.trailer #youtube-frame').length > 0) {
                $('.trailer #youtube-frame').remove();
            }
        }).on('click', '#back-to-top', function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
            return false;
        }).on('click', 'span a[data-server-id]', function(a) {
            a.preventDefault();
            var i = $(this).parent('li');
            if (i.hasClass('active')) {
                return false
            };
            var d = $(this).data('filmId');
            var c = $.trim($('.list-episodes a.btn-brown').text());
            var l = $(this).data('serverId');
            var s = $.trim($(this).text());
            var r = $(this).parents('ul');
            $('.list-episodes', bodyTag).block(blockUiConfig);
            $.ajax({
                type: 'POST',
                url: Base + 'ajax/listEpisodes.php',
                data: {
                    server_id: l,
                    film_id: d,
                    n: c,
                    server_name: s
                },
                dataType: 'json',
                success: function(a) {
                    if (a) {
                        $('.list-servers span a[data-server-id]').removeClass('btn-red');
                        $('.list-servers span a[data-server-id]').addClass('btn-primary');
                        $('.list-servers span a[data-server-id] div').removeClass('playing');
                        var curentString = $('#server' + l).text();
                        var newString = '<div class="playing"></div> ' + curentString;
                        $('#server' + l).removeClass("btn-primary");
                        $('#server' + l).addClass("btn-red");
                        $('#server' + l).html(newString);
                        $('li', r).removeClass('active');
                        i.addClass('active');
                        $('.list-servers #server-name', bodyTag).html('<i class="sp-movie-icon-camera""></i> ' + curentString);
                        $('.list-episodes', bodyTag).html(a.list);
                        if (a.epPlay) {
                            loadEpisode(a.epPlay);
                        }
                        $('.list-episodes', bodyTag).mCustomScrollbar('destroy');
                        $('.list-episodes .episodes', bodyTag).mCustomScrollbar({
                            scrollButtons: {
                                enable: !0
                            },
                            theme: 'light-thin'
                        }).mCustomScrollbar('scrollTo', '.list-servers .list-episodes a.btn-brown');
                        //ajaxLoadEpisode($('.list-episodes .episodes .btn-brown', bodyTag))
                    } else {
                        showAlert('This server was not found in our system!')
                    };
                    $('.list-episodes', bodyTag).unblock()
                },
                error: function() {
                    $('.list-episodes', bodyTag).unblock()
                }
            });
            return !1
        })
    });
})(jQuery);
$(document).ready(function() {
	$(".list-home").length && $(".list-home").css({
		overflow: "hidden"
	}).mCustomScrollbar({
		scrollButtons: {
			enable: !0
		},
		theme: "light-thin"
	})
    $("html").on("click", "#download-image", function() {
        refreshCaptcha();
    });
    $("html").on("click", ".episodes a", function(e) {
        e.preventDefault();
        if ($(this).hasClass('active')) {
            return false;
        }
        loadEpisode($(this).data("id"));
    });
    $("html").on("click", "#lightBtn, #lightOff", function(e) {
        e.preventDefault();
        LightToggle();
    });
    $("html").on("click", "#zoomBtn", function(e) {
        e.preventDefault();
        ZoomToggle();
    });
    $(window).on("popstate", function(e) {
        if (e.originalEvent.state !== null) {
            window.location.href = location.pathname;
        }
    });
});
//////////////
var uagent = navigator.userAgent.toLowerCase();
var arrMobi = new Array('midp', 'j2me', 'avantg', 'ipad', 'iphone', 'docomo', 'novarra', 'palmos', 'palmsource', '240x320', 'opwv', 'chtml', 'pda', 'windows ce', 'mmp/', 'mib/', 'symbian', 'wireless', 'nokia', 'hand', 'mobi', 'phone', 'cdm', 'up.b', 'audio', 'sie-', 'sec-', 'samsung', 'htc', 'mot-', 'mitsu', 'sagem', 'sony', 'alcatel', 'lg', 'erics', 'vx', 'nec', 'philips', 'mmm', 'xx', 'panasonic', 'sharp', 'wap', 'sch', 'rover', 'pocket', 'benq', 'java', 'pt', 'pg', 'vox', 'amoi', 'bird', 'compal', 'kg', 'voda', 'sany', 'kdd', 'dbt', 'sendo', 'sgh', 'gradi', 'jb', 'dddi', 'moto', 'opera mobi', 'opera mini', 'android');
var isMobile = false;
for (i = 0; i < arrMobi.length; i++) {
    if (uagent.indexOf(arrMobi[i]) != -1) {
        var isMobile = true;
        break;
    }
}
////////
function replace_embed(code) {
    var player_holder = $("#player-holder");
    var w = player_holder.width();
    var h = player_holder.height();
    return code.replace(/\(width\)/g, w).replace(/\(height\)/g, h);
}

function refreshCaptcha() {
    document.getElementById('download-image').src = Base + "captcha.php?rnd=" + Math.random();
}

function submitDownload(film_id) {
    var captcha = $('#captcha').val();
    if (captcha == '') {
        showAlert('Hãy nhập mã bảo vệ !');
    } else {
        $.ajax({
            type: "POST",
            url: Base + "ajax/getLinkDownload.php",
            data: {
                film_id: film_id,
                code: captcha
            },
            dataType: 'json',
            success: function(res) {
                if (res.status == 'success') {
                    $('#download-list').html(res.list);
                } else if (res.status == 'er') {
                    showAlert('Sai Mã bảo vệ');
                    $('#captcha').val('')
                    refreshCaptcha();
                } else {
                    showAlert(res.mss);
                }
            }
        });
    }
}

function LightToggle() {
    $("html, body").animate({
        scrollTop: $(".player-wrapper").offset().top
    }, 500).promise().done(function() {
        if ($(".sixteen-nine").hasClass("fixLightOff")) {
            $("#lightOff").fadeOut().promise().done(function() {
                $(".sixteen-nine").removeClass("fixLightOff");
            });
        } else {
            $(".sixteen-nine").addClass("fixLightOff");
            $("#lightOff").fadeIn();
        }
    });
}

function ZoomToggle() {
        if ($(".right-sidebar").hasClass("mt-lg")) {
			$("html, body").animate({
				scrollTop: $("#zoomPlayer").offset().top
			}, 500).promise().done(function() {
				$("#player-content").detach().appendTo('#normalPlayer');
				$(".right-sidebar").removeClass('mt-lg');
				$('.sixteen-nine').attr('style', 'height:450px');
				$('#zoomBtn').html('<i class="fa fa-expand btn-glyphicon img-circle text-primary"></i>Phóng to');
			});
        } else {
			$("html, body").animate({
				scrollTop: $(".player-wrapper").offset().top
			}, 500).promise().done(function() {
				$("#player-content").detach().appendTo('#zoomPlayer');
				$(".right-sidebar").addClass('mt-lg');
				$('.sixteen-nine').attr('style', 'height:550px');
				$('#zoomBtn').html('<i class="fa fa-compress btn-glyphicon img-circle text-primary"></i>Thu nhỏ');
			});
        }
}

function turnOffAds() {
    $("html, body").animate({
        scrollTop: $(".player-wrapper").offset().top
    }, 500).promise().done(function() {
		$("[class=" + IDADSclass + "]").hide();
		$('.adsClose').css("display", "none");
	});
}

function MakeSearch() {
    if (window.innerWidth <= 1000 && window.innerHeight <= 800) {
        var kw = $(".input-search.mobile").val();
    } else {
        var kw = $(".input-search.desktop").val();
    }
    kw = encodeURIComponent(kw);
    kw = kw.replace(/%20/g, '-');
    kw = kw.replace(/-+-/g, "-"); //replace 2- to 1-
    kw = kw.replace(/^\-+|\-+$/g, ""); //remove - from first and last
    if (kw == '') alert("Vui lòng nhập từ khóa !");
    else location.href = Base + "tim-kiem/" + kw + ".html"
}
if (isMobile) {
    $("[id=" + advertiseElement + "]").hide();
    $("[class=" + advertiseElement + "]").hide();
    $(".bannermobi").show();
    $(".bannermobi2").addClass("ballon_mobi");
    $(".iframemobi").addClass("iframe_link");
} else {
    $(".bannermobi").hide();
    $("[id=" + advertiseElement + "]").show();
    $("[class=" + advertiseElement + "]").show();
}