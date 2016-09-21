/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
;(function($) {

	/**
	 * Spoofs placeholders in browsers that don't support them (eg Firefox 3)
	 * 
	 * Copyright 2011 Dan Bentley
	 * Licensed under the Apache License 2.0
	 *
	 * Author: Dan Bentley [github.com/danbentley]
	 */

	// Return if native support is available.
	if ("placeholder" in document.createElement("input")) return;

	$(document).ready(function(){
		$(':input[placeholder]').not(':password').each(function() {
			setupPlaceholder($(this));
		});

		$(':password[placeholder]').each(function() {
			setupPasswords($(this));
		});
	   
		$('form').submit(function(e) {
			clearPlaceholdersBeforeSubmit($(this));
		});
	});

	function setupPlaceholder(input) {

		var placeholderText = input.attr('placeholder');

		setPlaceholderOrFlagChanged(input, placeholderText);
		input.focus(function(e) {
			if (input.data('changed') === true) return;
			if (input.val() === placeholderText) input.val('');
		}).blur(function(e) {
			if (input.val() === '') input.val(placeholderText); 
		}).change(function(e) {
			input.data('changed', input.val() !== '');
		});
	}

	function setPlaceholderOrFlagChanged(input, text) {
		(input.val() === '') ? input.val(text) : input.data('changed', true);
	}

	function setupPasswords(input) {
		var passwordPlaceholder = createPasswordPlaceholder(input);
		input.after(passwordPlaceholder);

		(input.val() === '') ? input.hide() : passwordPlaceholder.hide();

		$(input).blur(function(e) {
			if (input.val() !== '') return;
			input.hide();
			passwordPlaceholder.show();
		});
			
		$(passwordPlaceholder).focus(function(e) {
			input.show().focus();
			passwordPlaceholder.hide();
		});
	}

	function createPasswordPlaceholder(input) {
		return $('<input>').attr({
			placeholder: input.attr('placeholder'),
			value: input.attr('placeholder'),
			id: input.attr('id'),
			readonly: true
		}).addClass(input.attr('class'));
	}

	function clearPlaceholdersBeforeSubmit(form) {
		form.find(':input[placeholder]').each(function() {
			if ($(this).data('changed') === true) return;
			if ($(this).val() === $(this).attr('placeholder')) $(this).val('');
		});
	}
})(jQuery);
;// Mobile navigation menu
var $sidebarToggleMenu = $('.sidebar__toggle-menu a'),
    $sidebarLinks = $('.sidebar__section--primary .sidebar__links');

$sidebarToggleMenu.on('click', function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $sidebarLinks.slideToggle('fast');
});

$sidebarToggleMenu.on('keyup', function(e){
    if ((e.which == 13) && ($(this).hasClass("active"))) {
        e.preventDefault();
        $sidebarLinks.find('li:first-child a').focus();
    }
});

function resetMenu() {
    if (matchMedia('(min-width: 1110px)').matches) {
        $sidebarToggleMenu.removeClass('active');
        $sidebarLinks.show();
    }
    if (matchMedia('(max-width: 1109px)').matches) {
        $sidebarToggleMenu.removeClass('active');
        $sidebarLinks.hide();
    }
}

function pretendTableCells(el) {
    var $previousButton,
        $row = $(),
        rows = [$row];

    $(el).each(function () {
        var $button = $(this);

        if ($previousButton && $button.offset().top > $previousButton.offset().top) {
            $row = $();
            rows.push($row);
        }

        $row.push($button[0]);

        $previousButton = $button;
    });

    $(rows).each(function (index, $row) {
        var heights = [],
            maxHeight;

        if ($row.length > 1) {
            $row
                .css({
                    '-webkit-transition': 'height 0s',
                    transition: 'height 0s',
                    height: ''
                })
                .each(function (index, button) {
                    heights.push($(button).outerHeight());
                });

            maxHeight = Math.max.apply(Math, heights);

            $row.innerHeight(maxHeight).css({'-webkit-transition': '', transition: ''});
        }
    });
}

function matchCellHeights() {
    if(matchMedia('(min-width: 768px)').matches) {
        $('.widget').css({height: ''});
        pretendTableCells('.widget');
    }
    else {
        $('.widget').css({height: ''});
    }
    pretendTableCells('.widget--banner--image, .widget--advert--summary');
}

$(document).ready(function(){
    matchCellHeights();
    
    // Add table wrapper and scroller classes to tables
    $('table:not(.calendar, .calendar__table)').each(function() {

        var table = $(this);
        
        $(this).wrap('<div class="table-wrapper"></div>').wrap('<div class="scroller"></div>');
        
        if (table.outerWidth() > table.parent().parent().outerWidth()) {
            table.parent().parent().addClass('has-scroll');
        }
        
        $(window).on('resize orientationchange', function() {
            if (table.outerWidth() > table.parent().parent().outerWidth()) {
                table.parent().parent().addClass('has-scroll');
            } else {
                table.parent().parent().removeClass('has-scroll');
            }
        });
        
    });
    
    // IE8
    if ($('html').hasClass('lt-ie9')) {
        $('.tasks-row .widget-width--25 li:nth-child(1)').addClass('nth-child-1');
        $('.tasks-row .widget-width--25 li:nth-child(2)').addClass('nth-child-2');
        $('.tasks-row .widget-width--25 li:nth-child(3)').addClass('nth-child-3');
        $('.tasks-row .widget-width--25 li:nth-child(4)').addClass('nth-child-4');
    }

    $('.sidr-class-form-wrapper p').append('<a class="form-close" href=""><i></i></a>');

    $('.sidr-class-form-wrapper .form-close').click(function(e) {
        e.preventDefault();
        $.sidr("close", "sidr-search");
    });

});

$(window).load(function() {
    matchCellHeights();
});

$(window).resize(function() {
    resetMenu();
    matchCellHeights();
});