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
     This file contains all repository page javascript and routines
*/


/*
* This file contains all routines used on a dyn/admin pages for repository management
*/
var statements = ['<print-item item-descriptor="param" id="param"/>', '<query-items item-descriptor="param">param</query-items>', '<remove-item item-descriptor="param" id="param"/>', '<add-item item-descriptor="param" id="param"><set-property name="param"><![CDATA[param]]></set-property></add-item>'];

// --- create an overlay with an input field
$('[name="xmltext"]').before(
  jQuery('<div/>', {
    id: 'repxmldiv',
    name: 'repxmldiv',
    display: 'block'
  })
);

$('#repxmldiv').append("<a id='repxml-field'><p><b>XML autompletion field:</b></p><textarea  rows='3' cols='80' id='atg-mod-repxml' name='atg-mod-repxml' placeholder='Type your instruction here... type help to display Help'>");
$('#repxmldiv').append(
  "<p><div id='module-help' name='module-help'> \
  Start to type your statement with '<', autocompletion suggestion should appear:<br>\
  <ul>\
    <li>Press <b>Tab</b> to autocomplete the statement\
    <li>Press <b>Tab</b> at any time to go to the next dynamic <b>param</b> token in the expression\
    <li>Press <b>ALT+L</b> when working on &lt;add-item&gt; statements to add a new &lt;set-property&gt; line\
    <li>Press <b>Return</b> to append the completed statement to the ATG XML statement field\
  </ul>\
  <a href='#repxml-field' id='close-module-help'>Close Help</a>\
  </div>");

// --- attach typeahead to the created div
var area = $('#atg-mod-repxml').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'statements',
  displayKey: 'value',
  source: substringMatcher(statements)
}).keydown(function(e) {
    // --- tab key is hit, go to next 'param' position to replace it
    switch(e.which) {
      case 9:
        $(this).setCursorPositionToNextParam();
        e.preventDefault();
        break;
      
      // --- return key is hit
      case 13:
        var v = $('[name="xmltext"]').val();
        if (v) {
          $('[name="xmltext"]').val(v + '\n' + $(this).val());
        } else {
          $('[name="xmltext"]').val($(this).val());
        }
        $('#atg-mod-repxml').val('');
        e.preventDefault();
        break;
        
      default:
        var none = false;
    }
  }
).on('typeahead:autocompleted', function(event, suggestion, dataset) {
  var value = $(this).val();
  if (value.indexOf('add-item') > 0) {
    $(this).val(value.replace('<set-property', '\n<set-property').replace('</set-property>', '</set-property>\n'));
  }
});