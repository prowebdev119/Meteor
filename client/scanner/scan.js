import Quagga from 'quagga';
//const Quagga = require('quagga').default;

Template.stsscanner.onCreated(function(){
    const templateObject = Template.instance();


});


Template.stsscanner.onRendered(function() {
  // $(function() {
// Create the QuaggaJS config object for the live stream
var liveStreamConfig = {
    inputStream: {
      type : "LiveStream",
      constraints: {
        width: {min: 640},
        height: {min: 480},
        aspectRatio: {min: 1, max: 100},
        facingMode: "environment" // or "user" for the front camera
      }
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
    decoder: {
      "readers":[
        {"format":"ean_reader","config":{}},
        {"format":"code_39_reader","config":{}},
      ]
    },
    locate: true
  };
// The fallback to the file API requires a different inputStream option.
// The rest is the same
var fileConfig = $.extend(
    {},
    liveStreamConfig,
    {
      inputStream: {
        size: 800
      }
    }
  );
// Start the live stream scanner when the modal opens
$('#livestream_scanner').on('shown.bs.modal', function (e) {
  Quagga.init(
    liveStreamConfig,
    function(err) {
      if (err) {
        $('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
        Quagga.stop();
        return;
      }
      Quagga.start();
    }
  );
  });

// Make sure, QuaggaJS draws frames an lines around possible
// barcodes on the live stream
Quagga.onProcessed(function(result) {
  var drawingCtx = Quagga.canvas.ctx.overlay,
    drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
      });
    }

    if (result.box) {
      Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
    }
  }
});

// Once a barcode had been read successfully, stop quagga and
// close the modal after a second to let the user notice where
// the barcode had actually been found.
Quagga.onDetected(function(result) {
  if (result.codeResult.code){
    $('#scanner_input').val(result.codeResult.code);
    Quagga.stop();
    setTimeout(function(){ $('#livestream_scanner').modal('hide'); }, 1000);
  }
});

// Stop quagga in any case, when the modal is closed
  $('#livestream_scanner').on('hide.bs.modal', function(){
    if (Quagga){
      Quagga.stop();
    }
  });

// Call Quagga.decodeSingle() for every file selected in the
// file input
$("#livestream_scanner input:file").on("change", function(e) {
  if (e.target.files && e.target.files.length) {
    Quagga.decodeSingle($.extend({}, fileConfig, {src: URL.createObjectURL(e.target.files[0])}), function(result) {alert(result.codeResult.code);});
  }
});
// });

});
