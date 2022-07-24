$(document).ready(function(){
    $( document ).on( 'focus', ':input', function(){
        $( this ).attr( 'autocomplete', 'off' );
    });
    $( document ).on( 'focus', ':password', function(){
        $( this ).attr( 'autocomplete', 'off' );
    });
    $( document ).on( 'focus', ':password', function(){
        $( this ).attr( 'autocomplete', 'new-password' );
    });
    $( document ).on( 'click', '.close', function(){
      var vid = document.getElementById("myVideo");
      vid.pause();
    });

    $( document ).on( 'click', '.closeAdd', function(){
      var vidClass = document.getElementById("myVideoAdd");
      vidClass.pause();
    });

    $( document ).on( 'click', '.helpModal', function(){
      var vidPlay = document.getElementById("myVideo");
      vidPlay.play();
    });

    $( document ).on( 'click', '.helpModalAdd', function(){
      var vidClassPlay = document.getElementById("myVideoAdd");
      vidClassPlay.play();
    });
});
