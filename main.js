"use strict";

function createCanvas(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function getImageData(image) {
    var canvas = createCanvas(image.naturalWidth, image.naturalHeight);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function getImage(imageData) {
    var canvas = createCanvas(imageData.width, imageData.height);
    var ctx = canvas.getContext("2d");

    ctx.putImageData(imageData, 0, 0);

    var img = new Image();
    img.src = canvas.toDataURL();

    return img;
}

function getImageDataIndex(imageData, row, col) {
    return row * (4 * imageData.width) + col * 4;
}

function applyColorFunctions(imageData, rf, gf, bf, af) {
    var canvas = createCanvas(imageData.width, imageData.height)
    var ctx = canvas.getContext("2d");
    var newImageData = ctx.createImageData(canvas.width, canvas.height);

    var fs = [rf, gf, bf, af];

    var index;
    for (var row = 0; row < newImageData.height; row++) {
        for (var col = 0; col < newImageData.width; col++) {
            index = getImageDataIndex(imageData, row, col);
            for (var channel = 0; channel < 4; channel++) {
                newImageData.data[index + channel] = fs[channel](imageData.data[index + channel]);
            }
        }
    }

    return newImageData;
}

function process(inputImage, outputImage, rf, gf, bf, af) {
    var imageData = getImageData(inputImage);
    var newImageData = applyColorFunctions(imageData, rf, gf, bf, af);
    var temporaryImage = getImage(newImageData);
    outputImage.src = temporaryImage.src;
}

(function (){
    window.onload = function() {
        var rfEditor = ace.edit("rf-editor");
        var gfEditor = ace.edit("gf-editor");
        var bfEditor = ace.edit("bf-editor");
        var afEditor = ace.edit("af-editor");

        var editors = [rfEditor, gfEditor, bfEditor, afEditor];
        for (var i = 0; i < editors.length; i++) {
            editors[i].setTheme("ace/theme/tomorrow_night");
            editors[i].getSession().setMode("ace/mode/javascript");
            editors[i].getSession().setUseWorker(false);
            editors[i].$blockScrolling = Infinity;
        }

        var inputImage = document.getElementById("input-image");
        var outputImage = document.getElementById("output-image");

        inputImage.onload = function() {
            var invert = function(x) { return 255 - x; }
            var id = function(x) { return x; }

            process(inputImage, outputImage, invert, invert, invert, id);
        }

        inputImage.src = inputImage.src;
    }
})();
