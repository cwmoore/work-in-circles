const drawYinYang = (centerX, centerY, radius) => {

    let center = {'x': centerX, 'y': centerY};
    radius++;
    
    let halfRadius = 0.5 * radius;
    let halfPi = 0.5 * Math.PI;
    let twoPi = 2 * Math.PI;

    // // draw shadow/border
    // cx.beginPath();
    // cx.arc(center.x - 4, center.y - 3, radius, 0, twoPi, false);
    // cx.strokeStyle = "rgba(20, 20, 20, 0.5)";
    // cx.lineWidth = "10";
    // cx.stroke();

    // make right black half-circle
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, -halfPi, halfPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make left white half-half
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, halfPi, halfPi + Math.PI, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make a black half-circle in bottom half
    cx.beginPath();
    cx.arc(center.x + 1, center.y + halfRadius, 2 + halfRadius, halfPi, halfPi + Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make a white half-circle in top half
    cx.beginPath();
    cx.arc(center.x - 1, -2 + center.y - halfRadius, halfRadius, halfPi + Math.PI, halfPi, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make small black circle in the top half
    cx.beginPath();
    cx.arc(center.x - 3, center.y - halfRadius, halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make small white circle in the bottom half
    cx.beginPath();
    cx.arc(center.x + 3, center.y + halfRadius, halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();
    
    // // draw border
    // cx.beginPath();
    // cx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    // cx.strokeStyle = "rgba(180, 180, 200, 0.1)";
    // cx.lineWidth = "3";
    // cx.stroke();
};

const drawYinYangLeft = (centerX, centerY, radius) => {

    let center = {'x': centerX, 'y': centerY};
    radius++;
    
    let halfRadius = 0.5 * radius;
    let halfPi = 0.5 * Math.PI;
    let twoPi = 2 * Math.PI;

    // // draw shadow/border
    // cx.beginPath();
    // cx.arc(center.x - 4, center.y - 3, radius, 0, twoPi, false);
    // cx.strokeStyle = "rgba(20, 20, 20, 0.5)";
    // cx.lineWidth = "10";
    // cx.stroke();

    // make right black half-circle
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, halfPi, -halfPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make left white half-half
    cx.beginPath();
    cx.arc(center.x, center.y, 2 + radius, -halfPi, -(halfPi + Math.PI), false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make a black half-circle in bottom half
    cx.beginPath();
    cx.arc(center.x + 1, center.y + halfRadius, 2 + halfRadius, - halfPi, -(halfPi + Math.PI), false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make a white half-circle in top half
    cx.beginPath();
    cx.arc(center.x - 1, -2 + center.y - halfRadius, halfRadius, -(halfPi + Math.PI), -halfPi, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();

    // make small black circle in the top half
    cx.beginPath();
    cx.arc(center.x - 3, center.y - halfRadius, halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make small white circle in the bottom half
    cx.beginPath();
    cx.arc(center.x + 3, center.y + halfRadius, halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();
    
    // // draw border
    // cx.beginPath();
    // cx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    // cx.strokeStyle = "rgba(180, 180, 200, 0.1)";
    // cx.lineWidth = "3";
    // cx.stroke();
};

async function sleep(millis) {
    //console.log(millis);
    await new Promise(r => setTimeout(r, millis));
}

async function drawYinYangSpinningDonuts(centerX, centerY, radius) {
    drawYinYang(centerX, centerY, radius);
    await sleep(2800);
    drawYinYangLeft(centerX, centerY, radius);
    await sleep(1000);
    const max = 360 * Math.pow(2, 3);
    for (let i = 0; i <= max; i++)
    {
        if (i + 120 <= max) {
            await sleep(2 + (360 * 8) / (1 + i));
        }
        else {
            await sleep(i / (max*2));
        }
        drawTwoDonuts(centerX, centerY, radius);
        cx.translate(centerX, centerY);
        cx.rotate(i * Math.PI / (180 * (4 + 1 / 180)));
        //cx.rotate(i * Math.PI / 180);
        cx.translate(-centerX, -centerY);
        //cx.setTransform(1, 0, 0, 1, centerX, centerY);
    }
    //cx.restore();
    drawYinYangLeft(centerX, centerY, radius * 0.998);
    await sleep(1200);
    drawYinYang(centerX, centerY, radius * 0.989);
    await sleep(1300);
}

const drawTwoDonuts = (centerX, centerY, radius) => {
    // two donuts, spinning around center
    let center = {'x': centerX, 'y': centerY};
    
    let halfRadius = 0.5 * radius;
    let halfPi = 0.5 * Math.PI;
    let pi = Math.PI;
    let twoPi = 2 * Math.PI;

    // black background
    cx.beginPath();
    cx.arc(center.x, center.y - halfRadius - 1, 1 + halfRadius, 0, twoPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();
    // white donut
    cx.beginPath();
    cx.arc(center.x, center.y - halfRadius - 1, 1 + halfRadius, 0, twoPi, false);
    cx.arc(center.x, center.y - halfRadius - 1, -1 + halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill('evenodd');

    // white background
    cx.beginPath();
    cx.arc(center.x, center.y + halfRadius + 1, 1 + halfRadius, twoPi, 0, false);
    cx.fillStyle = "rgba(255, 255, 255, 1)";
    cx.fill();
    // black donut
    cx.beginPath();
    cx.arc(center.x, center.y + halfRadius + 1, 1 + halfRadius, twoPi, 0, false);
    cx.arc(center.x, center.y + halfRadius + 1, -1 + halfRadius / Math.PI, 0, twoPi, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill('evenodd');
}

const cnv = document.querySelector("canvas");
let cx = cnv.getContext("2d");

async function draw() {
    // cnv.width = Math.min(window.innerWidth, document.body.clientWidth, document.documentElement.clientWidth) * 0.95;
    // cnv.height = Math.min(window.innerHeight, document.body.clientHeight, document.documentElement.clientHeight) * 0.9;

    let origDescription = document.querySelector('#descriptive_para').innerHTML;
    document.querySelector('#descriptive_para').innerHTML = '';
    document.querySelector('#run_button').innerHTML = 'Running...';

    cnv.width = window.innerWidth * 0.95;
    cnv.height = window.innerHeight * 0.9;

    //let start = 0;

    let centerX = cnv.width / 2;
    let centerY = cnv.height / 2;

    let radius = Math.min(centerX, centerY) * 0.8;

    await drawYinYangSpinningDonuts(centerX, centerY, radius);

    document.querySelector('#run_button').innerHTML = 'Run Again';
    document.querySelector('#descriptive_para').innerHTML = origDescription;
}

const drawStaticYinYang = () => {
    cnv.width = window.innerWidth * 0.95;
    cnv.height = window.innerHeight * 0.9;

    let centerX = cnv.width / 2;
    let centerY = cnv.height / 2;

    let radius = Math.min(centerX, centerY) * 0.8;

    drawYinYang(centerX, centerY, radius);    
}

//window.onresize = draw;

/*
let total = 12;

let orientation = 0;
var millisecondsperframe = Math.floor(1000 / 120);
let drawCount = 1;
let maxCount = 3300;

let blank = !true;
//drawGrids();
let counter = 0;
var myTimeout = null;
let maxRadius = 333;
let radius = 333;

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



// nice blue gray border elements
const drawYinYangNice = () => {
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
    cx.strokeStyle = "rgba(123, 123, 123, 0.5)";
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

    // make a gray half-circle in bottom half
    cx.beginPath();
    cx.arc(center.x + 1, center.y + radius / 2, 3 + radius / 2, 0.5 * Math.PI, 1.5 * Math.PI, false);
    cx.fillStyle = "rgba(123, 123, 123, 0.5)";
    cx.fill();

    // make a black half-circle in bottom half
    cx.beginPath();
    cx.arc(center.x + 1, center.y + radius / 2, radius / 2, 0.5 * Math.PI, 1.5 * Math.PI, false);
    cx.fillStyle = "rgba(0, 0, 0, 1)";
    cx.fill();

    // make a gray half-circle in top half
    cx.beginPath();
    cx.arc(center.x - 1, -1 + center.y - radius / 2, 3 + radius / 2, 1.5 * Math.PI, 0.5 * Math.PI, false);
    cx.fillStyle = "rgba(123, 123, 123, 0.5)";
    cx.fill();

    // make a white half-circle in top half
    cx.beginPath();
    cx.arc(center.x - 1, -1 + center.y - radius / 2, radius / 2, 1.5 * Math.PI, 0.5 * Math.PI, false);
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
    
    // draw border
    // cx.beginPath();
    // cx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    // cx.strokeStyle = "rgba(180, 180, 200, 0.1)";
    // cx.lineWidth = "3";
    // cx.stroke();
};



        */