OkaySound = function () {

  $(document).ready(function(){

          ion.sound({
              sounds: [
                  {name: "plucky"}
              ],
              path: "sounds/",
              preload: true,
              volume: 1.0
          });


        //  $("#b01").on("click", function(){
              ion.sound.play("plucky");
          //});



      });

  //var okayaudio = new Audio('/sounds/plucky.mp3');
  //okayaudio.play();
  //window.addEventListener('load', function () {
/*
         var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
         var source = audioCtx.createBufferSource();
         var xhr = new XMLHttpRequest();
         xhr.open('GET', '/sounds/plucky.mp3');
         xhr.responseType = 'arraybuffer';
         xhr.addEventListener('load', function (r) {
             audioCtx.decodeAudioData(
                     xhr.response,
                     function (buffer) {
                         source.buffer = buffer;
                         source.connect(audioCtx.destination);
                         source.loop = false;
                     });
             source.start(0);
         });
         xhr.send();
*/
    // });

};

DangerSound = function () {
  $(document).ready(function(){

          ion.sound({
              sounds: [
                  {name: "system-fault"}
              ],
              path: "sounds/",
              preload: true,
              volume: 1.0
          });


        //  $("#b01").on("click", function(){
              ion.sound.play("system-fault");
          //});



      });
      setTimeout(function () {
        swal.close();
      }, 2500);

};
