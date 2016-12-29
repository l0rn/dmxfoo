var socket = io();
var faderVal = 0;
var fIdent = 0;

$(document).ready(function(){

  $( function() {
    // setup graphic EQ

      $( '#red' ).slider({
        value: 0,
        range: 0,
        max: 255,
        animate: true,
        orientation: "vertical",
        slide: function(event, ui) {
          $("#ratingResult").text(ui.value);
          emitServer( 0, ui.value );
        },
        //this updates the value of your hidden field when user stops dragging
        change: function(event, ui) {
          $('#rateToPost').attr('value', ui.value);
          //faderVal = ui.value;
          //console.log( faderVal );
        }
      });
      $( '#green' ).slider({
        value: 0,
        range: 0,
        max: 255,
        animate: true,
        orientation: "vertical",
        slide: function(event, ui) {
          $("#ratingResult").text(ui.value);
          emitServer( 1, ui.value );
        },
        //this updates the value of your hidden field when user stops dragging
        change: function(event, ui) {
          $('#rateToPost').attr('value', ui.value);
          //faderVal = ui.value;
          //console.log( faderVal );
        }
      });
      $( '#blue' ).slider({
        value: 0,
        range: 0,
        max: 255,
        animate: true,
        orientation: "vertical",
        slide: function(event, ui) {
          $("#ratingResult").text(ui.value);
          emitServer( 2, ui.value );
        },
        //this updates the value of your hidden field when user stops dragging
        change: function(event, ui) {
          $('#rateToPost').attr('value', ui.value);
          //faderVal = ui.value;
          //console.log( faderVal );
        }
      });
      $( '#white' ).slider({
        value: 0,
        range: 0,
        max: 255,
        animate: true,
        orientation: "vertical",
        slide: function(event, ui) {
          $("#ratingResult").text(ui.value);
          emitServer( 3, ui.value );
        },
        //this updates the value of your hidden field when user stops dragging
        change: function(event, ui) {
          $('#rateToPost').attr('value', ui.value);
          //faderVal = ui.value;
          //console.log( faderVal );
        }
      });
      $('#picker').jPicker();
  });

  //Send data to server
  function emitServer( fIdent, fVal ){
    socket.emit('fader value', fIdent, fVal);
    console.log('Out of emitServer ' + fIdent +' '+ fVal);
    return false;
  }

  $('.full-tap').click(function(){
    var tapVal = $(this).attr('data-val');
    var chanVal = $(this).attr('data-chan');
    console.log( 'Button ' + tapVal + ' ' + chanVal );
    emitServer( chanVal, tapVal );
  });

  $('.function-tap').click(function(){
    var tapVal = $(this).attr('data-val');
    if( tapVal == 1 ){
      console.log( 'Button On ' + tapVal );
      fadeUpDown();
    }
    if( tapVal == 0 ){
      console.log( 'Button Off ' + tapVal );
      emitServer( 1, 0 );
      emitServer( 2, 0 );
      emitServer( 3, 0 );
      emitServer( 4, 0 );
    }
  });

  function fadeUpDown(){
    for( i = 0; i < 256; i++){
      emitServer( 1, i );
      $(this).delay(100);
    }
    for( i = 255; i >= 0; i--){
      emitServer( 1, i );
      $(this).delay(100);
    }
  }
});
