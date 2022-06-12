// const { exit } = require("process");


/*
# 
filename: concentric_interconnect

 adapted from:
        circ yin

        bit flipping pixel rotates around a point, forming a unit
        that unit rotates around a point forming a 2unit
        the 2unit rotates around a point forming a 3unit
        the 3unit rotates around a point forming a 4unit
        etc.

        animate the process
        at what unit number is a smooth yinyan symbol formed?

 */


const origin = (x = 500, y = 500) => {
    return {'x': x, 'y': y};
}


const rotateByRadians = (radians = (Math.PI / 16), object = false) => {
    if (!object === true) {
        object = 'canvas';
    }

    return object;
}
const rotateByDegrees = (degrees = 15, object = false) => {
    return rotateByRadians(Math.PI * degrees / 180, object);
}


const flipBit = (bit) => {
    bit = !bit;
}


const flipBits = (bitList) => {
    for (let bit of bitList) {
        flipBit(bit);
    }
}


const initialize1Unit = () => {
    [x, y] = origin();

}




// distance between points 1 and 2
const euclideanDistance = (p1=[0,0], p2=[0,0]) => {
    //console.log(p1, p2);
    return Math.sqrt( Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) );
}


// distance between points 1 and 2
const manhattanDistance = (p1=[0,0], p2=[0,0]) => {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}


// per: Quantifying the relationships between network distance and straight-line distance: applications in spatial bias correction. Xinyue Chen, Yimin Chen https://www.tandfonline.com/doi/full/10.1080/19475683.2021.1966503
// detour index (DI) defined as the ratio of network distance (ND) to straight-line/Euclidean distance (ED)
const detourIndex = (points=[[0,0]]) => {
    let accDI = 0; // accumulator for averaging detour index
    for (let point1 of points) {
        for (let point2 of points) {
            if (point1 === point2) continue;
            accDI += manhattanDistance(point1, point2) / euclideanDistance(point1, point2);
        }
    }
    let DI = accDI / points.length;
    return DI;
}


// draw a circle
const scribeCircle = (
            currentAngle = -Math.PI/2 + (2 * Math.PI * 2.5 / 12) // -= Math.PI / 12 //
            , sliceAngle = 3 * Math.PI
            , color='rgba(10,20,30,0.2)'
        ) => {
    console.log("in scribeCircle");

    cx.beginPath();
    cx.arc(centerX, centerY, baseRadius, currentAngle, currentAngle + sliceAngle);
    cx.fillStyle = color;
    cx.strokeStyle = '#F6F7F8';

    cx.fill();
    cx.stroke();

    // TODO: reset cx params to previous?
};


/***
 * Boolean functional image drawing
 */
// boolean whether point is in image (T) or is not in image (F)
const inImage = (x=-1, y=-1, imageCallback) => {
    return imageCallback(x,y); // a boolean draw function for (x,y)
}

// draw function for a circle
const imageBitEuclidean = (x,y) => {
    return baseRadius > euclideanDistance([x,y], [centerX,centerY]);
}
// draw function for a Manhattan Distance "circle" (a tilted square)
const imageBitManhattan = (x,y) => {
    return baseRadius >  manhattanDistance([x,y], [centerX,centerY]);
}
// another draw function for another pattern
const imageBitCombiner = (x,y) => {
    return baseRadius > euclideanDistance([x,y], [centerX,centerY]) * manhattanDistance([x,y], [centerX,centerY]) / baseRadius;
}
// subtracting manhattan from euclidean distance
const imageBitDiffing = (x,y) => {
    return baseRadius > Math.pow(euclideanDistance([x,y], [centerX,centerY]) - manhattanDistance([x,y], [centerX,centerY]), 2) / 2;
}


// draw grids
const drawGrids = () => {
    console.log("in drawGridSimple", minX, maxX, minY, maxY, width);

    const sqCenter = width / 2.0;
    let sqX = sqCenter;
    let sqY = sqCenter;
    let gridCenterY = Math.floor((minY + maxY)/2.0);
    let gridCenterX = Math.floor((minX + maxX)/2.0);
    for (let j = minY; j <= maxY; j += width) { // each row
        if (j + sqY > gridCenterY) { // after halfway point, subtract
            sqY = -Math.abs(sqY); // sign is negative
        }

        for (let i = minX; i <= maxX; i += width) { // each column
            if (i + sqX >= gridCenterX) { // subtract after halfway point
                sqX = -Math.abs(sqX); // sign is negative
            }

            cx.beginPath();

            if (false) {
                // skip
            }
            //else if (inImage(i + sqX, j + sqY, imageBitDiffing)) {
                
            //     console.log('in Diffing');
            //     cx.fillStyle = "rgba(0,152,252,0.75)";
            //     cx.strokeStyle = "rgba(9, 9, 9, 0.9)";

            // }
            // else if (inImage(i + sqX, j + sqY, imageBitCombiner)) {
                
            //     console.log('in combiner');
            //     cx.fillStyle = "rgba(22,22,23,0.75)";
            //     cx.strokeStyle = "rgba(9, 9, 9, 0.9)";

            // }
            else if (inImage(i + sqX, j + sqY, imageBitEuclidean)) {
                // console.log('in Euclkidean');
                cx.fillStyle = "rgba(0,122,123,0.5)";
                cx.strokeStyle = "rgba(0, 69, 59, 0.7)";

            }  else if (inImage(i + sqX, j + sqY, imageBitManhattan)) {
                // console.log('in Manhattan');
                // cx.fillStyle = "rgba(0,122,123,0.5)";
                // cx.strokeStyle = "rgba(0, 69, 59, 0.7)";

            } else {
                // background cell
                // console.log('in background');
                cx.fillStyle = "rgba(222,222,253,0.65)";
                cx.strokeStyle = "rgba(60, 90, 130, 0.9)";
            }
            cx.fillRect(i + 1, j + 1 , width-1, width-1);
            cx.strokeRect(i, j, width, width);
        }
    }
};


/**
 * Rotate content to the left
 * @param {} e 
 */
const handlePressLeft = (e) => {
    console.log('Left button pressed');
    // redraw();
}


/**
 * Decrease cell size
 * @param {} e 
 */
const handlePressMinus = (e, subtractPercent = 12.3) => {
    handlePressPlus(e, -subtractPercent);
}


/**
 * Non-functional
 * @param {} e 
 */
const handlePressRun = (e) => {
    console.log('Run button pressed');
    // redraw();
}


/**
 * Increase cell size
 * @param {} e 
 */
const handlePressPlus = (e, addPercent = 12.3) => {
    width *= (100.0 + addPercent) / 100.0;
    if (width < 0.5) width = 0.5 // TODO throw exception?
    console.log('width parameter now:', width);
    redraw();
}

/**
 * Rotate content to the right
 * @param {} e 
 */
const handlePressRight = (e) => {
    console.log('Right button pressed');
    // redraw();
}
const handlePressReset = (e) => {
    init();
    redraw();
}


// clear and draw with current params
const redraw = (
        currentAngle = -(Math.PI / 2) + (Math.PI / 4) // , (Math.PI / 4) or (2 * Math.PI * 1.5 / 12)
        , sliceAngle = 3 * Math.PI
        , color='rgba(0,0,0,0)'
    ) => {
    console.log('in redraw');
    cx.beginPath();
    cx.stroke();
    cx.fill();
    cx.clearRect(0,0,3000,3000);

    drawGrids();
    scribeCircle(currentAngle, sliceAngle);
}


// initialize canvas
let cnvs = document.querySelector("canvas");
// set the css property from the window dimensions
cnvs.style.width = window.innerWidth;
cnvs.style.height = window.innerHeight;
// set the canvas with and height attributes
cnvs.setAttribute('width', window.getComputedStyle(cnvs, null).getPropertyValue('width'));
cnvs.setAttribute('height', window.getComputedStyle(cnvs, null).getPropertyValue('height'));
// TODO attempt to set style.width property
// let windowRoom = Math.min(window.getComputedStyle(cnvs, null).getPropertyValue('height'), window.getComputedStyle(cnvs, null).getPropertyValue('width'));
// cnvs.setAttribute('width', windowRoom);
// cnvs.setAttribute('height', windowRoom);
// get context
let cx = cnvs.getContext("2d");


let boxBitmap;
let width, minX, minY, maxX, maxY;
let centerX, centerY, baseRadius, radiusInWidths;
let x = 0;
let y = 0;


// set or reset intitial parameters
const init = () => {
    console.log("in init");

    minX = 2;
    minY = 2;
    // baseRadius = 150; // smaller screen size
    baseRadius = Math.max(400, Math.floor(cnvs.style.width / 2)) - (minX + minY); // center, subtract for margin
    // baseRadius = Math.min(cnvs.style.height, cnvs.style.width) / 2;
    radiusInWidths = 40;
    width = baseRadius / radiusInWidths;
    // width = 1.0001234 * Math.floor(baseRadius / radiusInWidths); // start closer to an integer for moire pattern effects

    console.log('in init, params=', baseRadius, radiusInWidths, width);

    // let radiusInWidths = Math.ceil(baseRadius / width);
    // baseRadius = width * radiusInWidths;//Math.sqrt(2) * 5;
    maxX = Math.floor(width * 2 * (radiusInWidths + (minX + minY)));
    maxY = maxX;
    centerX = Math.floor((width/2) * minX + baseRadius);
    centerY = Math.floor((width/2) * minY + baseRadius);
    // centerX = width * minX + baseRadius;
    // centerY = width * minY + baseRadius;
    // centerX = width / 2 + minX + baseRadius;
    // centerY = width / 2 + minY + baseRadius;
    // centerX = (minX + maxX) / 2 - width - 2;
    // centerY = (minY + maxY) / 2 - width - 2;

    // bind event functions
    document.querySelector('#left_btn').addEventListener('click', handlePressLeft);
    document.querySelector('#minus_btn').addEventListener('click', handlePressMinus);
    document.querySelector('#run_btn').addEventListener('click', handlePressRun)
    document.querySelector('#plus_btn').addEventListener('click', handlePressPlus);
    document.querySelector('#right_btn').addEventListener('click', handlePressRight);
    document.querySelector('#reset_btn').addEventListener('click', handlePressReset);
}


// initialize and draw
const run = () => {
    console.log("in run");
    init();
    redraw();
}

