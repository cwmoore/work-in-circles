class Wedge {
    constructor(orientation, dial) {
        this.orientation = orientation;
        this.dial = dial;
    }
}

class Dial {
    constructor(numSlots, radius) {
        this.numSlots = numSlots;
        this.radius = radius;
        this.orientation = 0;
        this.wedges = [];
    }
}

class Data {
    constructor(dataArray) {
        this.dataArray = dataArray;
    }

    getResults(even = 1) {
        let results = [];
        let numSlots = 72;
        for (let counter = 1; counter <= numSlots; counter++) {
            results.push({
                "name": counter
                , "count": 360 / numSlots
                , "color": (counter) % 2 === even ? "#000000" : "#FFFFFF"
            });
        }
        return results;
    }
}


class Circule {
    constructor(centerX, centerY, radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
    }

    draw() {
    }
}



const drawRing = (results) => {
    let total = results.length;
    let currentAngle = -0.5 * Math.PI;
    for (let result of results) {

        let sliceAngle = (result.count / total) * 2 * Math.PI;
        cx.beginPath();
        // center=100,100, radius=100
        // from current angle, clockwise by slice's angle
        // cx.arc(500, 500, 400,
        //  currentAngle, currentAngle + sliceAngle);
         cx.arc(500, 500, 299,
          currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(500, 500);
        cx.fillStyle = result.color;
        cx.fill();

        cx.beginPath();
        cx.arc(500, 500, 350, currentAngle, currentAngle + sliceAngle);
        currentAngle += sliceAngle;
        cx.lineTo(500, 500);
        cx.fillStyle = result.color;
        cx.fill();

        // cx.beginPath();
        // //cx.arc(500, 500, 450, currentAngle, currentAngle + 1);
        // //cx.arc(500, 500, 500, currentAngle, currentAngle + sliceAngle);
        // currentAngle += sliceAngle;
        // cx.lineTo(500, 500);
        // cx.fillStyle = #FF3333;
        // cx.fill();
    }
};

const drawGrids = (width1=12, width2=31) => {
    let min = 20;
    let max = 600;

    cx.beginPath();
    cx.fillStyle = "#0088DD";
    cx.fillRect(min, min, max - min, max - min);

    let i;
    for (i = min; i < max; i += 1) {

        if (i % (width1 - width2) == 0) {
            cx.beginPath();
            cx.moveTo(min, i + 2);
            cx.lineTo(max, i + 2);
            cx.moveTo(i + 2, min);
            cx.lineTo(i + 2, max);
            cx.strokeStyle = "#FFDDFF";
            cx.stroke();
        }
        if (i % (width1 + width2) == 0) {
            cx.beginPath();
            cx.moveTo(min, i + 2);
            cx.lineTo(max, i + 2);
            cx.moveTo(i + 2, min);
            cx.lineTo(i + 2, max);
            cx.strokeStyle = "#FFDD00";
            cx.stroke();
        }
        if (i % width2 == 0) {
            cx.beginPath();
            cx.moveTo(min, i);
            cx.lineTo(max, i);
            cx.moveTo(i, min);
            cx.lineTo(i, max);
            cx.strokeStyle = "#00FF00";
            cx.stroke();
        }
        if (i % width1 == 0) {
            cx.beginPath();
            cx.moveTo(min, i - 2);
            cx.lineTo(max, i - 2);
            cx.moveTo(i - 2, min);
            cx.lineTo(i - 2, max);
            cx.strokeStyle = "#00DDFF";
            cx.stroke();
        }
    }
    for (i; i >= min; i--) {
        if (i % 25 == 0) {
            cx.beginPath();
            cx.moveTo(min, i);
            cx.lineTo(max, i);
            cx.moveTo(i, min);
            cx.lineTo(i, max);
            cx.strokeStyle = "#0DDDD0";
            cx.stroke();
        }
        if (i % 100 == 0 || i === min || i === max) {
            cx.beginPath();
            cx.moveTo(min, i + 1);
            cx.lineTo(max, i + 1);
            cx.moveTo(i + 1, min);
            cx.lineTo(i + 1, max);
            cx.strokeStyle = "#010203";
            cx.stroke();
        }
    }
};

const drawCounter = (counter) => {
    cx.beginPath();
    cx.fillStyle = "#666666";
    cx.fillRect(620, 10, 80, 32);

    cx.beginPath();
    cx.fillStyle = "#000000";
    cx.fillRect(621, 11, 78, 30);

    cx.beginPath();
    cx.fillStyle = "#BBBBBB";
    cx.font = "16px serif";
    cx.fillText(counter, 630, 32);
};

const drawNext = (total, refreshId) => {

        centerX += 10;
        centerY += 11;

        orientation = 0;
        millisecondsperframe = 20;
        maxCount = 1805;

        if (total > 600) return 0;

        counter = 0;
        let newRefreshId = setInterval(() => {
            //if (start === total) return 0;//start++;
            //total = counter + total;
            setInterval(() => {
                if (drawCount > maxCount) clearInterval(newRefreshId);
                if ((counter + 1) % (total) === 0) orientation += 1;
                //drawRing(getResults(counter++ % 2));
                drawLines(counter % total, (total + 21) % 27, orientation, counter / 6, blank = !blank);
                // drawLines(counter, total, orientation, 50);
                // drawLines(counter, total, orientation, 40);
                counter += 1;
                drawCounter(drawCount++);
            }, millisecondsperframe = Math.log(1/counter));
            if (drawCount > 6000) return 0;
            if (counter > maxCount) drawNext(newRefreshId);
        }, millisecondsperframe * total);
};

const drawLines = (portion, total, orientation, radius, blank=false, maxRadius=325) => {
    let part = portion % total;
    let nextPart = (portion + 1) % total;

    let radialIncrement = 2 * Math.PI / total;
    let startDirection = 1.5 * Math.PI + (orientation % total) * radialIncrement;

    let beginArc = startDirection + part * radialIncrement;
    let endArc = startDirection + nextPart * radialIncrement;

    if (blank) {
        let fullRadius = radius + 200;

        if (fullRadius > maxRadius) {
            cx.beginPath();
            cx.moveTo(centerX, centerY);
            cx.arc(centerX, centerY
                    , maxRadius
                    , beginArc // begin arc
                    , endArc // end arc
                    , false);

            cx.fillStyle = "#FFFF77"; // blank out previous in space
            cx.fill();
        }

        fullRadius = fullRadius > maxRadius ? maxRadius - 2 : fullRadius; // big enough to cover
        cx.beginPath();
        cx.moveTo(centerX, centerY);
        cx.arc(centerX, centerY
                , fullRadius
                , beginArc // begin arc
                , endArc // end arc
                , false);

        cx.fillStyle = "#000000"; // blank out previous in space
        cx.fill();

        cx.beginPath();
        cx.arc(centerX, centerY
                , fullRadius
                , beginArc // begin arc
                , endArc // end arc
                , false);
        cx.strokeStyle = "#333333";
        cx.lineWidth = "2";
        cx.stroke();
    }

    cx.beginPath();
    cx.moveTo(centerX, centerY);
    cx.arc(centerX, centerY
            , radius
            , beginArc
            , endArc
            , false);
    //cx.arcTo(200 * portion / total,200 * portion / total, 60, 60, 50);
    if (orientation % total === 0) {
        if (portion % 8 === 0) {
            cx.fillStyle = "#00DD00";
        } else if (portion % 6 === 0) {
        cx.fillStyle = "#0DDDD0";
        } else if (portion % 4 === 0) {
            cx.fillStyle = "#00DDFF";
        } else if (portion % 3 === 0) {
            cx.fillStyle = "#FFDD00";
        } else if (portion % 2 === 0) {
            cx.fillStyle = "#00DD00";
        } else {
            cx.fillStyle = "#0088DD";
        }
    } else {
        if (portion % 8 === 0) {
            cx.fillStyle = "#666666";
        } else if (portion % 6 === 0) {
        cx.fillStyle = "#888888";
        } else if (portion % 4 === 0) {
            cx.fillStyle = "#AAAAAA";
        } else if (portion % 3 === 0) {
            cx.fillStyle = "#CCCCCC";
        } else if (portion % 2 === 0) {
            cx.fillStyle = "#EEEEEE";
        } else {
            cx.fillStyle = "#444444";
        }
    }
            //
            // if (orientation % 8 === 0) {
            //     cx.fillStyle = "#00DD00";
            // } else if (orientation % 6 === 0) {
            // cx.fillStyle = "#0DDDD0";
            // } else if (orientation % 4 === 0) {
            //     cx.fillStyle = "#00DDFF";
            // } else if (orientation % 3 === 0) {
            //     cx.fillStyle = "#FFDD00";
            // } else if (orientation % 2 === 0) {
            //     cx.fillStyle = "#00DD00";
            // } else {
            //     cx.fillStyle = "#0088DD";
            // }

    let startx = centerX + Math.cos(beginArc) * radius;
    let starty = centerY + Math.sin(beginArc) * radius;

    let controlx = centerX + Math.cos(endArc) * radius;
    let controly = centerY + Math.sin(endArc) * radius;

    let endx = centerX + Math.cos(endArc) * (radius * (1 + (part) / (4 * total)));
    let endy = centerY + Math.sin(endArc) * (radius * (1 + (part) / (4 * total)));

    cx.moveTo(startx, starty);
    cx.lineTo(endx, endy);
    cx.arcTo(startx, starty, controlx, controly, Math.pow(Math.pow(endx - controlx, 2) + Math.pow(endy - controly, 2), 1/2) / 2.25);
    //cx.arcTo(controlx2, controly2, controlx, controly, Math.pow(Math.pow(endx - controlx, 2) + Math.pow(endy - controly, 2), 1/2) / 2.25);

    cx.moveTo(centerX, centerY);

    cx.fill();

    if (blank) {
        // center hole
        cx.beginPath();
        cx.arc(centerX, centerY
                , 5
                , 0
                , 2 * Math.PI
                , false);
        cx.fillStyle = "#000000";
        cx.fill();
    }
};

const drawYinYang = () => {
    let radius = 100;
    let center = {'x': 150, 'y': 150};

    // blank out
    cx.beginPath();
    cx.arc(center.x + 8, center.y + 8, radius + 29, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(9, 99, 159, 0.75)";
    cx.fill();
    // blank out
    cx.beginPath();
    cx.arc(center.x - 5, center.y - 5, radius + 27, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(39, 159, 222, 0.75)";
    cx.fill();
    // blank out
    cx.beginPath();
    cx.arc(center.x - 3, center.y - 3, radius + 25, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(100, 200, 255, 0.75)";
    cx.fill();
    // blank out
    cx.beginPath();
    cx.arc(center.x + 3, center.y + 4, radius + 30, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // draw shadow
    cx.beginPath();
    cx.arc(center.x + 5, center.y + 5, radius - 5, 0, 2 * Math.PI, false);
    cx.strokeStyle = "rgba(100, 100, 100, 1)";
    cx.lineWidth = "10";
    cx.stroke();

    // make right black half-circle
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, -0.5 * Math.PI, 0.5 * Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make left white half-half
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, 0.5 * Math.PI, 1.5 * Math.PI, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make a black half-circle in bottom half
    cx.beginPath();
    cx.arc(center.x + 1, center.y + radius / 2, 2 + radius / 2, 0.5 * Math.PI, 1.5 * Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make a white half-circle in top half
    cx.beginPath();
    cx.arc(center.x - 1, -2 + center.y - radius / 2, radius / 2, 1.5 * Math.PI, 0.5 * Math.PI, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make small black circle in the top half
    cx.beginPath();
    cx.arc(center.x - 3, center.y - radius / 2, radius / 8, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make small white circle in the bottom half
    cx.beginPath();
    cx.arc(center.x + 3, center.y + radius / 2, radius / 8, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();
    //
    // // draw border
    // cx.beginPath();
    // cx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    // cx.strokeStyle = "rgba(180, 180, 200, 0.1)";
    // cx.lineWidth = "3";
    // cx.stroke();
};

const drawIBang = (iNotBang=true) => {
    console.log(`in drawIBang, iNotBang=${iNotBang}`);
    let radius = 150;
    let center = {'x': 600, 'y': 350};

    // fill a white circle
    cx.beginPath();
    cx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // stroke a black border
    cx.beginPath();
    cx.arc(center.x, center.y, radius - 10, 0, 2 * Math.PI, false);
    cx.strokeStyle = "rgba(0, 0, 0, 1)";
    cx.lineWeight = "2px";
    cx.stroke();

    if (iNotBang) {
        cx.beginPath();
        cx.arc(center.x, center.y - 5 * radius / 9, radius / 8, 0, 2 * Math.PI, false);
        cx.fillStyle = "rgba(0, 0, 0, 1)";
        cx.fill();
    } else {
        cx.beginPath();
        cx.arc(center.x, center.y + 5 * radius / 9, radius / 8, 0, 2 * Math.PI, false);
        cx.fillStyle = "rgba(0, 0, 0, 1)";
        cx.fill();
    }

    // draw central rectangle
    cx.beginPath();
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fillRect(center.x - radius / 8, center.y - ((iNotBang) ? -1 : 1) * (radius / 4) - radius / 2, radius / 4, 2 * radius / 2);

    // // find the center
    // cx.beginPath();
    // cx.arc(center.x, center.y, 3, 0, 2 * Math.PI, false);
    // cx.fillStyle = "rgba(0, 100, 255, 1)";
    // cx.fill();
};

const drawCircle = (total, orientation, radius, blank=true, maxRadius=300) => {
    for (let i = 0; i < total; i++) {
        drawLines(i, total, orientation, radius, blank, maxRadius);
        // cx.beginPath();
        // cx.fillStyle = "rgba(0, 0, 0, 1)";
        // cx.arc(300, 300, radius * 0.84, 0, 2 * Math.PI);
        // cx.fill();
        //drawCounter(drawCount + i);
    }
    orientation++;// = (1 + orientation) % total;
    //if (drawCount > maxCount) drawNext(refreshId);
    if (orientation > 6000) clearTimeout(myTimeout);//return 0;
    if (drawCount > 6000) clearTimeout(myTimeout);//return 0;
    if (radius > maxRadius) clearTimeout(myTimeout);//return 0;
};

// let results = getResults();
let cnv = document.querySelector("canvas.main");
cnv.height = window.innerHeight;//window.screen.availHeight;
cnv.width = window.innerWidth;//window.screen.availWidth;
// let cnv2 = document.querySelector("canvas.secondary");
// cnv2.height = window.screen.availHeight;
// cnv2.width = window.screen.availWidth;

let cx = cnv.getContext("2d");

//let start = 0;

let centerX = cnv.width / 2;
let centerY = cnv.height / 2;

let total = 12;

let orientation = 0;
var millisecondsperframe = Math.floor(1000 / 120);
let drawCount = 1;
let maxCount = 3300;

let blank = !true;
//drawGrids();
let counter = 0;
var myTimeout = null;
let maxRadius = Math.min(centerX, centerY) * 0.8;

let radius = maxRadius;

console.log(centerX, centerY, radius, maxRadius);

let portion = 0;
let modRadius = -0.5;
let interval = setInterval(() => {
            drawLines(portion++, total, orientation, radius += modRadius, blank=blank, maxRadius);
            //drawCircle(total, orientation, radius, blank = !blank, maxRadius);
            if (portion % total === 0) {
                orientation++;
            }
            //if (portion > 1000) {
            if (radius >= maxRadius) {
                clearInterval(interval);
            }
            if (radius <= 10) {
                modRadius = -modRadius;
            }
        }
        , millisecondsperframe);

    let refreshId = setInterval(() => {
        radius *= 1.25;
        radius = (radius < maxRadius) ? radius : maxRadius;

        myTimeout = setTimeout(
                drawCircle(total, orientation, radius, blank = !blank, maxRadius)
                , millisecondsperframe = 1 + Math.floor(25 / (total * Math.log(drawCount)))
        );

        //orientation++;
        if (orientation > maxCount) clearInterval(refreshId);
        if (radius >= maxRadius) clearInterval(refreshId);
        drawCount++;
    }, millisecondsperframe);

drawRing(new Data().getResults());
drawYinYang();
drawIBang();

let i = 0;
//let numMoves = 540;
let numMoves = 720;
while (i++ <= numMoves) {
    setTimeout(() => {
        //cx.save();
        drawYinYang();
        cx.translate(150, 150); // move the center of canvas to center of circle
        cx.rotate(Math.PI / 180);
        cx.translate(-150, -150); // move the canvas back
        //cx.restore();
    }, 500 * Math.log(Math.abs(i - numMoves)))
}

setTimeout(() => {
    millisecondsperframe = 1000;
    i = 0;
    numMoves = 9;
    let iNotBang = false;
    while (i++ < numMoves) {
        millisecondsperframe = 10 + 500 * i;
        let refreshId = setTimeout(() => {
            drawIBang(iNotBang = !iNotBang);
            console.log(`in setTimeout function, iNotBang=${iNotBang}, mspf=${millisecondsperframe}`);
        }, millisecondsperframe);
    }
}, 4500);
