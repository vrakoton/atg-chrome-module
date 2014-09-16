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
      Common function for all module routines. This file should be included before all other custom JS scripts 
*/

/* 
* Sets cursor position in an input field
*/
$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};

/*
* Sends the cursor to the next 'param' keyword in the dynamic statement
*/
$.fn.setCursorPositionToNextParam = function() {
  var currVal = $(this).val();
  var index = currVal.indexOf("param");
  
  if (index >= 0) {
    $(this).val(currVal.replace("param", ""));
    $(this).setCursorPosition(index);
  } else {
    // --- send cursor to end of field
    $(this).setCursorPosition(currVal.length);
  }
};

/*
* Custom matcher used by the typeahead call
*/
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    // --- only take last line of the entered value
    var tokens = q.split("\n");
    if (tokens) {
      q = tokens[tokens.length - 1];
    }
    
    // --- q: the entered text
    // --- cb: the render callback function from typeahead
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};

/*
* resets the global boolean keys for control keys to none
*/
var resetControlKeys = function () {
  altmode = false;
  shiftmode = false;
}

/*
* This function makes an ajax call to change a property of a service.
* If the call is successful, the current page is refreshed
* otherwise an alert window will notify the user
*/
var changeProperty = function (myprop, myvalue, errormsg) {
  console.log('changing property ' + myprop + ' value to ' + myvalue);
  $.ajax({
    type: "POST",
    url: window.location.pathname,
    data: { propertyName: myprop, newValue: myvalue, change: "Change Value" }
  }).done(
    function(data) {
      document.location = window.location.pathname;
    }
  ).fail(
    function() {
      if (errormsg)
        alert(errormsg);
    }
  );
};

/*
* creates the help box in the page
*/
var createFloatingHelp = function () {
  $('#oracleATGbrand').after('<div id="right-hand-help" class="floating-help"><b>Help On ATG Chrome plugin</b>\
  <div class="help-subtitle">Shortcuts:</div>\
  <div class="help-text">\
  ALT+G: enables debug on current component<br>\
  ALT+Shift+G: disables debug on current component<br>\
  </div>\
  </div>');
};

/*
* Adds help to the help box
*/
var addHelpText = function (title, text) {
  if ($('#right-hand-help').length <= 0) {
    return;
  }
  
  var helpval = $('#right-hand-help').val();
  
  if (title) {
    helpval += '<div class="help-subtitle">';
    helpval += title;
    helpval += '</div>';
  }
  
  if (text) {
    helpval += '<div class="help-text">';
    helpval += text;
    helpval += '</div>';
  }
  $('#right-hand-help').val(helpval);
};