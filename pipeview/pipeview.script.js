const drawCircle = (centerX, centerY, radius, lineWidth=1) => {
    cx.beginPath();
    cx.arc(centerX, centerY
            , radius
            , 0
            , 2 * Math.PI
            , false);
    cx.strokeStyle = "#000044";
    cx.lineWidth = lineWidth;
    cx.stroke();
};

const drawConcentricDistanceCircles = (
    centerX = 300
    , centerY = 450
    , maxRadius = 460
    , minRadius = 12
    , ocularDistance = 4
    , firstRingVisibleDistance = 2
) => {

    const totalLength = Math.ceil(maxRadius - minRadius);

    const drawIn = (i) => {
        let currentRadius = maxRadius;
        let currentDistance = ocularDistance;
        let coin = false;

        while (currentRadius >= minRadius) {
            let nextDifference = Math.ceil( totalLength / (i * currentDistance) );
            drawCircle(centerX, centerY, currentRadius, (coin = !coin) ? nextDifference / (5 * i) : 0);
            //drawCircle(centerX, centerY, currentRadius);
            currentRadius -= nextDifference;
            currentDistance += firstRingVisibleDistance;
            //drawCaption(`${i} QUERY`);
        }
    };

    let i = 1.8;
    const clearInt = setInterval(() => {
        cx.clearRect(0,0, canvas.width, canvas.height);
        drawIn(i -= 0.012);
        console.log(i);
        if (i < 0.4) {
            drawIn(1.6);
            clearInterval(clearInt);
        }
    }, 1);
};


// needs line to link to sections, consider polar coordinates, in degrees or radians
const drawCaption = (caption, leftX=300, topY=300, height=200, width=300, borderWidth=1,fontHeight=32) => {
    cx.beginPath();
    cx.fillStyle = "darkblue";
    cx.fillRect(leftX, topY, width, height);

    cx.beginPath();
    cx.fillStyle = "#000000";
    cx.fillRect(leftX + borderWidth, topY + borderWidth, width - borderWidth, height - borderWidth);

    cx.beginPath();
    cx.fillStyle = "lightblue";
    cx.font = `${fontHeight}px serif`;
    //const avgCharWidth = cx.measureText("ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz 0123456789").width / 200;// 194 is the length of the alphanumeric chars
    const charWidth = cx.measureText("M").width;
    const lineHeight = cx.measureText("M").height;
    const formattedCaptionString = fitStringToCaptionBox(caption, Math.floor(1.9 * width / charWidth));
    if (formattedCaptionString.includes("\n")) {
        // multi-line caption
        const padding = charWidth / 2;
        let lines = formattedCaptionString.split("\n");
        let y = topY
        for (let ndx in lines) {
            console.log(`ndx: ${ndx}`);
            cx.fillText(lines[ndx], leftX + padding, topY + fontHeight + padding + (ndx * fontHeight));
        }
    } else {
        cx.fillText(formattedCaptionString, leftX + width, topY + fontHeight - height);
    }
};


const fitStringToCaptionBox = (captionString, charsWide=20) => {
    console.log(`captionString: ${captionString}`);
    console.log(`charsWide: ${charsWide}`);
    let words = captionString.split(/\s+/g);
    console.table(words);
    let formattedCaptionString = '';

    // loop over words and add words that fit width to captionString
    // else add a newline before word.
    let remainingCharWidth = charsWide;
    let firstWord = true;
    for (let word of words) {
        // if firstWord and word.length() longer than charWidth
        if (remainingCharWidth > 1 + word.length) { // TODO focus and test edae-case logic with this block
            console.log(`word.length > remainingCharWidth || remainingCharWidth - word.length >= 0`);
            formattedCaptionString = formattedCaptionString +
                (firstWord ? '' : ' ') + word;
            remainingCharWidth -= (firstWord ? 0 : 1) + word.length;
        } else {
            console.log(`word.length < remainingCharWidth || remainingCharWidth - word.length < 0`);
            formattedCaptionString = formattedCaptionString +
                "\n" + word;
            remainingCharWidth = charsWide - word.length;
        }
        firstWord = false;
        console.log(`word: ${word}`);
        console.log(`formattedCaptionString: ${ "\n" + formattedCaptionString }`);
        console.log(`word.length: ${word.length}, remainingCharWidth: ${remainingCharWidth}`);
    }
    return formattedCaptionString;
};

/*************************************************
Run script below
*************************************************/

let canvas = document.querySelector("canvas");
canvas.width = screen.width;
canvas.height = screen.height;
let cx = canvas.getContext("2d");

let centerX = 690;
let centerY = 470;
let maxRadius = 400;
let minRadius = 12;
let ocularDistance = 2.712;
let firstRingVisibleDistance = 3.1415;
//
// drawConcentricDistanceCircles();
// drawConcentricDistanceCircles(
//     centerX
//     , centerY
//     , maxRadius
//     , minRadius
//     , ocularDistance
//     , firstRingVisibleDistance);
drawConcentricDistanceCircles(
    centerX
    , centerY
    , maxRadius * 3
    , minRadius * 2
    , ocularDistance * 2
    , firstRingVisibleDistance * 2);
// drawConcentricDistanceCircles();
// drawConcentricDistanceCircles(
//     centerX / 2
//     , centerY / 2
//     , maxRadius / 2
//     , minRadius / 2
//     , ocularDistance / 2
//     , firstRingVisibleDistance / 2);

/*
shape
color
border
font/size/color
boundary-rectangle: minX, maxX, minY, maxY

*/
drawCaption("the quickest little brown fox jumped over the lazy dog twice and then ran away as fast as asjf;jknreberupossible and then some extra");
//drawCaption("the quick brown fox");
/*
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    , firstRingVisibleDistance = 0.1);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    ,firstRingVisibleDistance = 1);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    , firstRingVisibleDistance = 1.618);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    , firstRingVisibleDistance = 2);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    , firstRingVisibleDistance = 2.71);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 10
    , firstRingVisibleDistance = 3);
drawConcentricDistanceCircles(
    centerX = 300
    , centerY = 300
    , maxRadius = 120
    , minRadius = 12
    , ocularDistance = 5
        , firstRingVisibleDistance = 3);
*/
