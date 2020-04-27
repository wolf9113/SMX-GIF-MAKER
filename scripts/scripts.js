var c = document.getElementById("templateCanvas");
var referenceCanvas = document.getElementById("referenceCanvas");
var colorCanvas = document.getElementById("colorCanvas");
var selectedColorCanvas = document.getElementById("selectedColorCanvas");


var createGIFButton = document.getElementById("createGIFButton");
var saveGIFButton = document.getElementById("saveGIFButton");
var createFrame = document.getElementById("createFrame");
var runFramesButton = document.getElementById("runFrames");

if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("ok");
} else {
    alert('The File APIs are not fully supported in this browser.');
}

//buttons fill
var allButton = document.getElementById("allButton");
var upLeft = document.getElementById("upLeft");
var up = document.getElementById("up");
var upRight = document.getElementById("upRight");
var centerLeft = document.getElementById("centerLeft");
var center = document.getElementById("center");
var centerRight = document.getElementById("centerRight");
var downLeft = document.getElementById("downLeft");
var down = document.getElementById("down");
var downRight = document.getElementById("downRight");

var selectedColor = '#000';
var frameList = [];
var frameReferenceList = [];
var frameCanvasList = [];
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
var colorCTX = colorCanvas.getContext("2d");
var selectedColorCTX = selectedColorCanvas.getContext("2d");
setSelectedColor()

drawCanvas(true);
drawReferenceCanvas(true);
drawColorCanvas();

function setSelectedColor() {
    selectedColorCTX.fillStyle = selectedColor;
    selectedColorCTX.fillRect(0, 0, 100, 50);
    selectedColorCTX.fillStyle = "#000000";
    selectedColorCTX.rect(0, 0, 100, 50);
    selectedColorCTX.stroke();
    selectedColorCTX.fillStyle = selectedColor;
}

function drawColorCanvas() {
    colorCTX.fillStyle = "#000";
    colorCTX.fillRect(0, 0, 50, 50);

    colorCTX.fillStyle = "#ffffff";
    colorCTX.fillRect(50, 0, 50, 50);

    colorCTX.fillStyle = "#ff0000";
    colorCTX.fillRect(0, 50, 50, 50);

    colorCTX.fillStyle = "#00ff00";
    colorCTX.fillRect(50, 50, 50, 50);

    colorCTX.fillStyle = "#0000ff";
    colorCTX.fillRect(0, 100, 50, 50);

    colorCTX.fillStyle = "#ffff00";
    colorCTX.fillRect(50, 100, 50, 50);

    colorCTX.fillStyle = "#ff00ff";
    colorCTX.fillRect(0, 150, 50, 50);

    colorCTX.fillStyle = "#00ffff";
    colorCTX.fillRect(50, 150, 50, 50);

    colorCTX.fillStyle = "#000000";
    colorCTX.rect(0, 0, 100, 200);
    colorCTX.stroke();

}

function drawReferenceCanvas(init) {
    if (init) {
        referenceCanvasCTX.fillStyle = '#FFF';
        referenceCanvasCTX.fillRect(0, 0, 23, 24);
    }
    referenceCanvasCTX.fillStyle = '#000';
    referenceCanvasCTX.fillRect(7, 0, 1, 24);
    referenceCanvasCTX.fillRect(15, 0, 1, 24);
    referenceCanvasCTX.fillRect(0, 7, 23, 1);
    referenceCanvasCTX.fillRect(0, 15, 23, 1);
    referenceCanvasCTX.fillRect(0, 23, 23, 1);
    for (var j = 0; j < 24; j = j + 2) {
        for (var i = 1; i < 22; i = i + 2) {
            referenceCanvasCTX.fillRect(i, j, 1, 1);
        }
    }

    for (var j = 1; j < 24; j = j + 2) {
        for (var i = 0; i < 24; i = i + 2) {
            referenceCanvasCTX.fillRect(i, j, 1, 1);
        }
    }
    referenceCanvasCTX.fillStyle = selectedColor
}

function drawCanvas(init) {
    if (init) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, 230, 240);
    }

    ctx.fillStyle = '#000';
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

    ctx.fillStyle = selectedColor
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

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

document.onmouseup = mouseUp;
document.onmousedown = mouseDown;
var mouseDownState = false;

function mouseDown(ev) {
    mouseDownState = true;
}

function mouseUp(ev) {
    mouseDownState = false;
}

c.addEventListener('click', function (event) {
    var x = event.layerX,
        y = event.layerY;

    var xOffset = Math.floor(x / 10) * 10;
    var yOffset = Math.floor(y / 10) * 10;

    paintTile(xOffset, yOffset);
}, false);

c.addEventListener('mousemove', function (event) {
    if (!mouseDownState) {
        return;
    }
    var x = event.layerX,
        y = event.layerY;

    var xOffset = Math.floor(x / 10) * 10;
    var yOffset = Math.floor(y / 10) * 10;

    paintTile(xOffset, yOffset);
}, false);

colorCanvas.addEventListener('click', function (event) {
    var x = event.layerX,
        y = event.layerY;

    var pixel = colorCTX.getImageData(x, y, 1, 1).data;
    selectedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setSelectedColor();
}, false);

colorCanvas.addEventListener('mousemove', function (event) {
    if (!mouseDownState) {
        return;
    }
    var x = event.layerX,
        y = event.layerY;

    var pixel = colorCTX.getImageData(x, y, 1, 1).data;
    selectedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setSelectedColor();
}, false);

function paintTile(x, y) {
    var ctx = c.getContext("2d");
    if (!isValidTile(Math.floor(x / 10), Math.floor(y / 10)))
        return

    ctx.fillStyle = selectedColor;
    ctx.fillRect(x, y, 10, 10);
    referenceCanvasCTX.fillStyle = selectedColor;
    referenceCanvasCTX.fillRect(x / 10, y / 10, 1, 1);
}

createFrame.addEventListener('click', function (event) {
    var img = c.toDataURL("image/png");
    var imgRef = referenceCanvas.toDataURL("image/png");
    frameList.push(img);
    frameReferenceList.push(imgRef);
    frameCanvasList.push(referenceCanvas);
    showFrames();
}, false);

allButton.addEventListener('click', function (event) {
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, 230, 240);

    referenceCanvasCTX.fillStyle = selectedColor;
    referenceCanvasCTX.fillRect(0, 0, 23, 24);
    drawCanvas(false);
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
        numWorkers: 2
    };

    var downloadOptions = {
        gifWidth: 23,
        gifHeight: 24,
        images: frameReferenceList,
        interval: speed / 1000,
        numWorkers: 4,
        sampleInterval: 1 / 100
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
    downloadGIF(this, 'animation.gif');
}, false);

function fillCuadrant(x, y) {
    ctx.fillStyle = selectedColor
    referenceCanvasCTX.fillStyle = selectedColor;

    for (var j = y; j < 80 + y; j = j + 20) {
        for (var i = x; i < 80 + x; i = i + 20) {
            ctx.fillRect(i, j, 10, 10);
            referenceCanvasCTX.fillRect(i / 10, j / 10, 1, 1);
        }
    }

    for (var j = 10 + y; j < 60 + y; j = j + 20) {
        for (var i = 10 + x; i < 60 + x; i = i + 20) {
            ctx.fillRect(i, j, 10, 10);
            referenceCanvasCTX.fillRect(i / 10, j / 10, 1, 1);
        }
    }
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var list = $('#list');
                list.empty();
                list.append('' +
                    '<span>' +
                    '<img id="uploadGif" class="thumb" ' +
                    'src="' + e.target.result + '" ' +
                    'rel:animated_src="' + e.target.result + '" ' +
                    'title="' + escape(theFile.name) + '" alt="">' +
                    '</span>');

                var sup = new SuperGif({gif: document.getElementById('uploadGif')});
                sup.load(function () {
                    console.log('gif is loaded');
                    console.log(sup);
                    for (var i = 0; i < sup.get_length(); i++) {
                        sup.move_to(i);
                        //frameList.push(sup.get_canvas().toDataURL("image/png"));
                        scaleCanvas(sup.get_canvas());
                        frameReferenceList.push(sup.get_canvas().toDataURL("image/png"));
                        frameCanvasList.push(sup.get_canvas());
                    }
                    showFrames();
                });
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function scaleCanvas(canvasToScale) {
    var canvas = document.createElement('canvas');
    canvas.width = 230;
    canvas.height = 240;
    var ctx = canvas.getContext('2d');
    var ctxScale = canvasToScale.getContext('2d')
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 230, 240);
    for (var x = 0, iX = 0; x < 23; x++, iX += 10) {
        for (var y = 0, iY = 0; y < 24; y++, iY += 10) {
            var pixel = ctxScale.getImageData(x, y, 1, 1).data;
            var data = ctx.getImageData(iX, iY, x + 10, y + 10);
            var pixels = data.data;
            for (var i = 0; i < pixels.length; i += 4) {
                pixels[i] = pixel[0];
                pixels[i + 1] = pixel[1];
                pixels[i + 2] = pixel[2];
                pixels[i + 3] = pixel[3];
            }
            ctx.putImageData(data, iX, iY);
        }
    }
    ctx.fillStyle = '#000';
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
    frameList.push(canvas.toDataURL("image/png"));
}

upLeft.addEventListener('click', function (e) {
    fillCuadrant(0, 0);
}, false);
up.addEventListener('click', function (e) {
    fillCuadrant(80, 0);
}, false);
upRight.addEventListener('click', function (e) {
    fillCuadrant(160, 0);
}, false);
centerLeft.addEventListener('click', function (e) {
    fillCuadrant(0, 80);
}, false);
center.addEventListener('click', function (e) {
    fillCuadrant(80, 80);
}, false);
centerRight.addEventListener('click', function (e) {
    fillCuadrant(160, 80);
}, false);
downLeft.addEventListener('click', function (e) {
    fillCuadrant(0, 160);
}, false);
down.addEventListener('click', function (e) {
    fillCuadrant(80, 160);
}, false);
downRight.addEventListener('click', function (e) {
    fillCuadrant(160, 160);
}, false);

