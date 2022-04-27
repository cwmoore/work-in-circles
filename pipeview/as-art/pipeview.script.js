const drawCircle = (centerX, centerY, radius, lineWidth=1) => {
    cx.beginPath();
    cx.arc(centerX, centerY
            , radius - 10
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
            drawCircle(centerX, centerY, currentRadius, (coin = !coin) ? nextDifference / 2 : 0);
            //drawCircle(centerX, centerY, currentRadius);
            currentRadius -= nextDifference;
            currentDistance += firstRingVisibleDistance;
        }
    }

    let i = 0.4;
    const clearInt = setInterval(() => {
        cx.clearRect(0,0, canvas.width, canvas.height);
        drawIn(i += 0.01);
        console.log(i);
        if (i > 1.8) {
            drawIn(1.6);
            clearInterval(clearInt);
        }
    }, 15);
};

let canvas = document.querySelector("canvas");
let cx = canvas.getContext("2d");

//drawConcentricDistanceCircles();
drawConcentricDistanceCircles(
    centerX = 690
    , centerY = 470
    , maxRadius = 300
    , minRadius = 12
    , ocularDistance = 2.712
    , firstRingVisibleDistance = 3.1415);
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
