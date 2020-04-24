var c = document.getElementById("templateCanvas");
var referenceCanvas = document.getElementById("referenceCanvas");
var createGIFButton = document.getElementById("createGIFButton");
var saveGIFButton = document.getElementById("saveGIFButton");
var createFrame = document.getElementById("createFrame");
var runFramesButton = document.getElementById("runFrames");

var selectedColor = '#000';
var frameList = [];
var frameReferenceList = [];
var frameListHTML = $("#frameList");
var speed = 200;
var speedInput = $("#speedInput");
speedInput.attr("value", speed);

var colorPicker = new Picker({
    parent: document.querySelector('#main-color'),
    popup: false,
    color: selectedColor,
    editor: true,
    editorFormat: 'rgb',
    onChange: function (color) {
        selectedColor = color.hex;
    }
});

var ctx = c.getContext("2d");
var referenceCanvasCTX = referenceCanvas.getContext("2d");

drawCanvas();
drawReferenceCanvas();

function drawReferenceCanvas() {
    referenceCanvasCTX.fillStyle = '#FFF';
    referenceCanvasCTX.fillRect(0, 0, 23, 24);
    referenceCanvasCTX.fillStyle = selectedColor
}

function drawCanvas() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 230, 240);
    ctx.fillStyle = selectedColor
    ctx.fillRect(70, 0, 10, 240);
    ctx.fillRect(150, 0, 10, 240);
    ctx.fillRect(0, 70, 230, 10);
    ctx.fillRect(0, 150, 230, 10);
    ctx.fillRect(0, 230, 230, 10);
    for (var j = 0; j < 240; j = j + 20) {
        for (var i = 10; i < 220; i = i + 20) {
            ctx.fillRect(i, j, 10, 10);
        }
    }

    for (var j = 10; j < 240; j = j + 20) {
        for (var i = 0; i < 240; i = i + 20) {
            ctx.fillRect(i, j, 10, 10);
        }
    }
}

var img = c.toDataURL("image/png");
var generatedImage = document.getElementById("gifImage");
generatedImage.src = img;

function isValidTile(x, y) {
    if (y > 0) {
        if (((y + 1) % 8 === 0 || (x + 1) % 8 === 0)) {
            return false
        }
    }
    if (y % 2 === 0) {
        return x % 2 === 0;
    } else {
        return x % 2 === 1;
    }
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

c.addEventListener('click', function (event) {
    var x = event.layerX,
        y = event.layerY;
    var ctx = c.getContext("2d");
    var p = ctx.getImageData(x, y, 1, 1).data;
    if (!isValidTile(Math.floor(x / 10), Math.floor(y / 10)))
        return

    var xOffset = Math.floor(x / 10) * 10;
    var yOffset = Math.floor(y / 10) * 10;

    ctx.fillStyle = selectedColor;
    ctx.fillRect(xOffset, yOffset, 10, 10);
    referenceCanvasCTX.fillStyle = selectedColor;
    referenceCanvasCTX.fillRect(xOffset / 10, yOffset / 10, 1, 1);
}, false);

createFrame.addEventListener('click', function (event) {
    var img = c.toDataURL("image/png");
    var imgRef = referenceCanvas.toDataURL("image/png");
    frameList.push(img);
    frameReferenceList.push(imgRef);
    showFrames();
}, false);

runFramesButton.addEventListener('click', function (event) {
    runFrames();
}, false);

speedInput.change(function () {
    speed = this.value;
    console.log(speed);
});

function showFrames() {
    frameListHTML.empty();
    for (var i = 0; i < frameList.length; i++) {
        frameListHTML.append('<div class="col-md-2 frameItem">' +
            '<div class="row">' +
            '<div class="col text-center">' +
            '<img id="frame' + i + '" src="' + frameList[i] + '" width="115" height="140" alt="">' +
            '</div> ' +
            '</div>' +
            '<div class="row">' +
            '<div class="col text-center">' +
            '<button class="btn btn-outline-info" onclick="editFrame(' + i + ')"><i class="fa fa-edit"></i></button> ' +
            '<button class="btn btn-outline-danger" onclick="deleteFrame(' + i + ')"><i class="fa fa-trash"></i></button> ' +
            '<button class="btn btn-outline-success" onclick="saveFrame(' + i + ')"><i class="fa fa-save"></i></button> ' +
            '</div> ' +
            '</div> ' +
            '</div>');
    }
}

function saveFrame(position) {
    var img = c.toDataURL("image/png");
    var imgRef = referenceCanvas.toDataURL("image/png");
    frameList[position] = img;
    frameReferenceList[position] = imgRef
    showFrames();
}

function deleteFrame(position) {
    frameList.splice(position, 1);
    frameReferenceList.splice(position, 1);
    showFrames();
}

function editFrame(position) {
    var imageSRC = $('#frame' + position).attr('src');
    var image = new Image();
    image.src = imageSRC;
    ctx.drawImage(image, 0, 0, 230, 240);
    referenceCanvasCTX.drawImage(image, 0, 0, 23, 24);
}

var counter = 0;

function runFrames() {
    console.log("run");
    counter = -1;
    setImage()
}

function setImage() {
    counter++;
    if (counter > frameList.length) {
        return;
    }
    var generatedImage = $('#generatedImage');
    generatedImage.attr("src", frameList[counter]);
    setTimeout(setImage, speed);
}

createGIFButton.addEventListener('click', function (e) {
    e.preventDefault();
    var animatedImage = document.getElementById('gifImage');
    animatedImage.src = '';

    var hiddenGIF = document.getElementById('gifDownload');
    hiddenGIF.src = '';

    var gifOptions = {
        gifWidth: 230,
        gifHeight: 240,
        images: frameList,
        interval: speed / 1000,
        numFrames: 30,
        numWorkers: 2
    };

    var downloadOptions = {
        gifWidth: 23,
        gifHeight: 24,
        images: frameReferenceList,
        interval: speed / 1000,
        numFrames: 30,
        numWorkers: 2
    };

    var method = 'createGIF';
    gifshot[method](gifOptions, function (obj) {
        if (!obj.error) {
            var image = obj.image;
            var animatedImage = document.getElementById('gifImage');
            animatedImage.src = image;

            $('#saveGIFButton').removeAttr('hidden');
        } else {
            console.log('obj.error', obj.error);
            console.log('obj.errorCode', obj.errorCode);
            console.log('obj.errorMsg', obj.errorMsg);
        }
    });

    gifshot[method](downloadOptions, function (obj) {
        if (!obj.error) {
            var image = obj.image;
            var animatedImage = document.getElementById('gifDownload');
            animatedImage.src = image;
        } else {
            console.log('obj.error', obj.error);
            console.log('obj.errorCode', obj.errorCode);
            console.log('obj.errorMsg', obj.errorMsg);
        }
    });
}, false);


function downloadGIF(link, filename) {
    var gif = $('#gifDownload');
    link.href = gif.attr('src');
    link.download = filename;
}

saveGIFButton.addEventListener('click', function (e) {
    console.log("save");
    downloadGIF(this, 'animation.gif')
}, false);

