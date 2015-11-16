'use strict';
/*
    ATG Browser module
    Copyright (C) 2014  Vina Rakotondrainibe

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

    Author: vrakoton
    Version: 1.0

    Description:
      Common callbacks functions for the content script extension. if you need generic
      behaviour for some page part in the admin console, this is the place to put them.
*/

/**
 * Global variables
 */
var altmode = false;
var shiftmode = false;
var setPropString = '<set-property name="param"><![CDATA[param]]></set-property>';
var setPropertyEndTag = '</set-property>';
var addItemEndTag = '</add-item>';


/*
*   this function positions all common callback on atg module artifacts (ex: on help close button)
*/
$(function() {

  // --- create the help div
  createFloatingHelp();
  // -- add ids to part of the page so that our future manipulations are easier
  decoratePageWithIds();
  createFloatingMethodInvocation();

  // --- close help button link
  $('.module-help').click(
    function() {
      $(this).fadeOut();
    }
  );
  $('#close-module-help').click(
    function() {
      $('#module-help').fadeOut();
    }
  );

  $(document).keydown(
    function(e) {
      if (e.which == 18) {
        altmode = true;
        //console.log('control mode is set to on');
        return;
      }
      if (altmode) {
        switch(e.which) {
          // --- shift key detected
          case 16:
            shiftmode = true;
            break;

          // --- I key detected
          case 73:
            // --- cache invalidation
            if ($('[name="xmltext"]').length <= 0) break;
            $.ajax({
              type: 'POST',
              url: window.location.pathname,
              data: { invokeMethod: 'invalidateCaches', submit: 'Invoke Method'}
            }).done(
              function(data) {
                //console.log('received: ' + data);
                if (data.match('<tr><td>null</td><td>null</td></tr>')) {
                  alert('Invalidation successful');
                }
              }
            ).fail(
              function() {
                alert('Cache invalidation request failed');
              }
            );
            resetControlKeys();
            //altmode = false;
            //console.log('cache invalidating for repository');
            break;

          // --- G key detected
          case 71:
            if(altmode && shiftmode) {
              // remove debug
              changeProperty('loggingDebug', false, 'Debug could not be turned off due to an error');
              resetControlKeys();
              break;
            }

            if(altmode) {
              // enable debug
              changeProperty('loggingDebug', true, 'Debug could not be turned on due to an error');
              resetControlKeys();
              break;
            }

          // --- L key detected
          case 76:
            if($('#atg-mod-repxml').length > 0) {
              var value = $('#atg-mod-repxml').val();
              var idx = value.lastIndexOf(setPropertyEndTag);
              $('#atg-mod-repxml').val(value.substr(0, idx + setPropertyEndTag.length) + '\n' + setPropString + '\n' + addItemEndTag);
            }
            resetControlKeys();
            break;
          default:
            resetControlKeys();
            //altmode = false;
        }
      }
    }
  );
  
  /**
   * scroll the help sidebox automatically
   */
  var element = $('#floating-help');
  var originalY = element.offset().top;

    // Space between element and top of screen (when scrolling)
    var topMargin = 20;

    $(window).on('scroll', function(event) {
        var scrollTop = $(window).scrollTop();

        element.stop(false, false).animate({
            top: scrollTop < originalY ? 0 : scrollTop - originalY + topMargin
        }, 300);
    });
  
});

