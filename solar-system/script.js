/**
 *
 * "Solar Cycles" is a computational and visual art series, part of the larger series Work In Circles by [Curtis W. Moore](https://www.curtiswmoore.com).
 *
 * The piece is based on observed and computed orbits of the the planets in the solar system around the Sun,
 * by replacing the music of the spheres with an iterated visual symbol to create a natural complexity and harmony
 * that references the passage of time as well as its returning rhythm, building endless unique combinations from
 * a simple black and white, binary origin.
 * The chosen symbol is the taijitu, commonly known as a yin-yan, a Taoist symbol of a union of dualities.
 * In the artist's interpretation for this piece, the Sun and each planet find their locations at the
 * inner circle of each component of the taijitu, and as the simulated passage of the affect of time on the
 * physical solar system advances the orbital position of every celestial body in the solar system,
 * the artwork draws this symbol, for each of the planets, at each iterated period of time.
 * Over the course of a generated work, the ireated snapshots are overlapped with one another, eventually
 * generating a grayscale image of surprise and subtlety that has the properties of being generally unknown
 * at the beginning or a generative sequence, and deterministically repeatable to be generated identically
 * if the algorithm is again given the same parameters.
 *
 *
 *
 * Components:
 *     orbital data
 *     control and configuration
 *         start and stop data
 *         output format data
 *         symbol parameters
 *
 *     a completed drawing is of the layers of time snapshots between two dates
 *     for each iteration (fixed period length or the total number of iterations between two dates can be set in configuration)
 *        draw the snapshot:
 *            for each planet:
 *                draw a taijitu based on the angular orientation of that planet at the current date/time
 *                the Sun is at one inner circle, the planet at another
 *                the distance between the two is the basis for all other distances in the symbol construction
 *                the angle of the line through the two relative to the drawing canvas orients the rest of the symbol
 *
 */
/**
 * Raw and computed data about solar system planets.
 * source: https://nssdc.gsfc.nasa.gov/planetary/factsheet/
 */
var SolarSystemData = /** @class */ (function () {
    function SolarSystemData() {
        // round log e Distance from Sun * 10; Mercury, Venus...Saturn, Uranus
        this.planets = [
            { 'radius': 1, 'mass': 10 },
            { 'radius': 41, 'mass': 1 },
            { 'radius': 47, 'mass': 4 },
            { 'radius': 50, 'mass': 4 },
            { 'radius': 54, 'mass': 2 },
            { 'radius': 67, 'mass': 10 },
            { 'radius': 73, 'mass': 8 },
            { 'radius': 80, 'mass': 7 },
            { 'radius': 84, 'mass': 7 },
        ];
        // log orbit distances
        this.distances = [
            0.02,
            1.76,
            2.03,
            2.17,
            2.36,
            2.89,
            3.16,
            3.46,
            3.65,
        ];
        // mercury orbit unit distances to sun
        this.mercDists = [
            0.5,
            10,
            19,
            26,
            39,
            134,
            248,
            496,
            776,
        ];
        // square root of average distance to sun
        this.sqrtDists = [
            1,
            7.61,
            10.40,
            12.23,
            15.10,
            27.90,
            37.86,
            53.60,
            67.05,
        ];
        // orbital period, in earth days
        this.yearDays = [
            1,
            88.0,
            224.7,
            365.2,
            687.0,
            4331,
            10747,
            30589,
            59800,
        ];
    }
    return SolarSystemData;
}());
/**
 * The data and algorithms to generate the artwork.
 */
var SolarCycleTaijitu = /** @class */ (function () {
    function SolarCycleTaijitu() {
        var _this = this;
        /**
         * Draw the taijitu/yin-yan symbol.
         *
         * @param center1 the location of the smallest black circle
         * @param center2 the location of the smallest white circle
         */
        this.drawYinYanEccentric = function (center1, center2) {
            if (center1 === void 0) { center1 = null; }
            if (center2 === void 0) { center2 = null; }
            if (!center1) {
                center1 = { 'x': _this.sunCenter.x / 2, 'y': _this.sunCenter.y / 2 };
            }
            if (!center2) {
                center2 = { 'x': _this.sunCenter.x * 1.5, 'y': _this.sunCenter.y * 1.5 };
            }
            _this.cx.globalCompositeOperation = 'difference';
            //this.cx.filter = 'invert(1)';
            _this.cx.filter = 'invert(0)';
            // average of the two centers
            var centerCenter = {
                'x': (center1.x + center2.x) / 2,
                'y': (center1.y + center2.y) / 2
            };
            // radius of large circle is Euclidean distance between the centers of he two smallest circles (center1, center2)
            var radius = _this.euclideanDistance(center1, center2);
            var start = Math.atan2(center1.y - center2.y, center1.x - center2.x);
            var end = start + Math.PI;
            // draw white large circle
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.arc(centerCenter.x, centerCenter.y, radius, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black large semicircle
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.arc(centerCenter.x, centerCenter.y, radius, end, start, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw white medium circle
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.arc(center1.x, center1.y, radius / 2, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black medium circle
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.arc(center2.x, center2.y, radius / 2, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw white small circle
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.arc(center2.x, center2.y, radius / (2 * Math.PI), 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black small circle
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.arc(center1.x, center1.y, radius / (2 * Math.PI), 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
        };
        /**
         * Draw the taijitu/yin-yan symbol.
         *
         * @param center1 the location of the smallest black circle
         * @param center2 the location of the smallest white circle
         */
        this.drawYinYanCircle = function (center1, center2) {
            if (center1 === void 0) { center1 = null; }
            if (center2 === void 0) { center2 = null; }
            _this.drawYinYanPerspective(center1, center2);
        };
        /**
         * Draw the taijitu/yin-yan symbol in perspective.
         *
         * @param center1 the location of the smallest black circle
         * @param center2 the location of the smallest white circle
         */
        //public drawYinYanPerspective = (center1: any = null, center2: any = null, horizontalAngle: number = 0) => {
        this.drawYinYanPerspective = function (centerCenter, radius, horizontalAngle) {
            if (centerCenter === void 0) { centerCenter = null; }
            if (radius === void 0) { radius = 100; }
            if (horizontalAngle === void 0) { horizontalAngle = Math.PI * 0; }
            if (!centerCenter) {
                centerCenter = _this.sunCenter;
            }
            var orientSmallCircle1 = Math.asin(horizontalAngle) * radius / 2;
            var orientSmallCircle2 = Math.acos(horizontalAngle + Math.PI) * radius / 2;
            var center1 = { 'x': centerCenter.x * orientSmallCircle1, 'y': centerCenter.y * orientSmallCircle1 };
            var center2 = { 'x': centerCenter.x * orientSmallCircle2, 'y': centerCenter.y * orientSmallCircle2 };
            _this.cx.globalCompositeOperation = 'difference';
            //this.cx.filter = 'invert(1)';
            _this.cx.filter = 'invert(0)';
            // average of the two centers
            // const centerCenter = {
            //     'x': (center1.x + center2.x) / 2,
            //     'y': (center1.y + center2.y) / 2
            // };
            var minorMajorRatio = Math.sin(horizontalAngle);
            // radius of large circle is Euclidean distance between the centers of the two smallest circles (center1, center2)
            //const radius = this.euclideanDistance(center1, center2);
            // compute orientation of yin and yan sides relative to vertical
            var start = Math.atan2(center1.y - center2.y, center1.x - center2.x);
            var end = start + Math.PI;
            var rotation = 0; // 
            // draw white large ellipse
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.ellipse(centerCenter.x, centerCenter.y, radius, minorMajorRatio * radius, rotation, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black large semi-ellipse
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.ellipse(centerCenter.x, centerCenter.y, radius, minorMajorRatio * radius, rotation, end, start, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw white medium ellipse
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.ellipse(center1.x, center1.y, radius / 2, minorMajorRatio * radius / 2, rotation, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black medium ellipse
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.ellipse(center2.x, center2.y, radius / 2, minorMajorRatio * radius / 2, rotation, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw white small ellipse
            _this.setWhite();
            _this.cx.beginPath();
            _this.cx.ellipse(center2.x, center2.y, radius / (2 * Math.PI), minorMajorRatio * radius / (2 * Math.PI), rotation, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
            // draw black small ellipse
            _this.setBlack();
            _this.cx.beginPath();
            _this.cx.ellipse(center1.x, center1.y, radius / (2 * Math.PI), minorMajorRatio * radius / (2 * Math.PI), rotation, 0, 2 * Math.PI, false);
            _this.cx.fill();
            _this.cx.stroke();
        };
        /**
         * Draw an orbital position of a planet.
         *
         * @param planet an object with orbital radius and mass properties
         * @param center current x,y coordinates of the planet
         */
        this.drawOrbit = function (planet, center) {
            if (planet === void 0) { planet = { 'radius': 50, 'mass': 4 }; }
            if (center === void 0) { center = { 'x': 600, 'y': 440 }; }
            _this.cx.beginPath();
            _this.cx.arc(center.x, center.y, planet.radius * 10, 0, 2 * Math.PI, false);
            _this.cx.strokeStyle = "rgba(100, 100, 100, 1)";
            _this.cx.lineWidth = Number("".concat(planet.mass / 2));
            _this.cx.stroke();
        };
        /**
         * Set the drawing fill and stroke to white.
         *
         * @param alpha the transparency value
         */
        this.setWhite = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            _this.cx.fillStyle = "rgba(225, 225, 225, ".concat(alpha, ")");
            _this.cx.strokeStyle = "rgba(255, 255, 255, ".concat(alpha, ")");
        };
        /**
         * Set the drawing fill to dark gray and stroke to black.
         *
         * @param alpha the transparency value
         */
        //  private setPurply = (alpha=1) => {
        //     this.cx.fillStyle = `rgba(150, 25, 125, ${alpha})`;
        //     this.cx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        // }
        /**
         * Set the drawing fill to dark gray and stroke to black.
         *
         * @param alpha the transparency value
         */
        //  private setAllColo = (alpha=1) => {
        //     this.cx.fillStyle = `rgba(150, 50, 5, ${alpha})`;
        //     this.cx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        // }
        /**
         * Set the drawing fill to dark gray and stroke to black.
         *
         * @param alpha the transparency value
         */
        //  private setRastaPlus = (alpha=1) => {
        //     this.cx.fillStyle = `rgba(25, 75, 125, ${alpha})`;
        //     this.cx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        // }
        /**
         * Set the drawing fill to dark gray and stroke to black.
         *
         * @param alpha the transparency value
         */
        //  private setBlack = (alpha=1) => {
        //     this.cx.fillStyle = `rgba(25, 25, 25, ${alpha})`;
        //     this.cx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        // }
        /**
         * Set the drawing fill to dark gray and stroke to
         *
         * @param alpha the transparency value
         */
        this.setBlack = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            //temporary
            _this.cx.fillStyle = "rgba(125, 25, 25, ".concat(alpha, ")");
            _this.cx.strokeStyle = "rgba(0, 210, 0, ".concat(alpha, ")");
        };
        /**
         * Compute the Euclidean distance between two points.
         *
         * @param center1 x,y coordinate center of the first point
         * @param center2 x,y coordinate center of the second point
         * @returns the distance between the two points
         */
        this.euclideanDistance = function (center1, center2) {
            var xDist = center1.x - center2.x;
            var yDist = center1.y - center2.y;
            return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)); // 2D distance formula
        };
        // initialize canvas element
        var cnvs = document.querySelector("canvas");
        // cnvs.style.width = window.innerWidth.toString();
        // cnvs.style.height = window.innerHeight.toString();
        // cnvs.style.width = screen.width.toString();
        // cnvs.style.height = screen.height.toString();
        cnvs.style.width = '80vw';
        cnvs.style.height = '100vh';
        cnvs.style.paddingLeft = '10vw';
        //cnvs.style.paddingTop = '10vh';
        // viewport height is not using the entire height
        // set the canvas width and height attributes
        cnvs.setAttribute('width', window.getComputedStyle(cnvs, null).getPropertyValue('width'));
        cnvs.setAttribute('height', window.getComputedStyle(cnvs, null).getPropertyValue('height'));
        this.width = parseInt(window.getComputedStyle(cnvs, null).getPropertyValue('width'));
        this.height = parseInt(window.getComputedStyle(cnvs, null).getPropertyValue('height'));
        console.log("width: ".concat(this.width, ", height: ").concat(this.height));
        // get drawing context from canvas
        var cx = cnvs.getContext("2d");
        this.cnvs = cnvs;
        this.cx = cx;
        // use the NASA planetary orbit table data
        var solarData = new SolarSystemData();
        this.solarData = solarData;
        // set the sun's coordinates
        this.sunCenter = { 'x': this.width / 2, 'y': this.height / 2 };
    }
    SolarCycleTaijitu.prototype.printThis = function () {
        console.log(this.sunCenter);
        console.log(this.width);
        console.log(this.height);
        console.log(this.cx);
        console.log(this.cnvs);
        console.table(this.solarData);
    };
    SolarCycleTaijitu.prototype.printSolarData = function () {
        console.table(this.solarData);
    };
    SolarCycleTaijitu.prototype.drawWorkspace = function () {
        var _this = this;
        this.solarData.sqrtDists.map(function (rad) {
            console.log(rad);
            _this.drawYinYanEccentric({ 'x': _this.sunCenter.x, 'y': _this.sunCenter.y }, { 'x': _this.sunCenter.x - rad, 'y': _this.sunCenter.y + rad });
        });
    };
    SolarCycleTaijitu.prototype.drawWorkspace0 = function () {
        var _this = this;
        var jMax = 10;
        var iMax = 10;
        var counter = 0;
        var _loop_1 = function (j) {
            var _loop_2 = function (i) {
                setInterval(function () { return _this.drawYinYanEccentric(_this.sunCenter, { 'x': Math.pow(2, i / j), 'y': counter++ % Math.pow(2, j / i) }); }, 0.1);
            };
            for (var i = 0; i < iMax; i++) {
                _loop_2(i);
            }
        };
        for (var j = 0; j < jMax; j += 1) {
            _loop_1(j);
        }
    };
    /**
     * Experiment with different kinds of drawing the artwork.
     */
    SolarCycleTaijitu.prototype.drawWorkspace1 = function () {
        //sqrtDists.map((distance, index) => planets[index].radius = distance);
        //console.table(planets);
        //planets.map((planet) => drawOrbit(planet));
        // const sunCenter = {'x': this.width / 2, 'y': this.height / 2};
        //const sunCenter = {'x': 0.25 * parseInt(window.innerWidth), 'y': 0.75 * parseInt(window.innerHeight)};
        var _this = this;
        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 1 * rad, 'y': 500}));
        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 2 * 1.618 * rad, 'y': 500}));
        //sqrtDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 10 * rad, 'y': 500}));
        //let increment = 1;
        //let increment = 12;
        var increment = 30;
        var _loop_3 = function (day) {
            //if (day % 37 > 4) continue;
            if (day % 37 < 30)
                return "continue";
            //if (day % 33 < 5) increment++;
            //if (day % 73 < 3) increment--;
            //if (increment > 21) increment = 1;
            //if (day % 43 > 4) continue;
            //if (day % 43 > 5) continue;
            this_1.cx.fillStyle = 'black';
            this_1.cx.fillRect(0, 0, this_1.width, this_1.height);
            this_1.solarData.sqrtDists.map(function (radius, index) {
                // let ret = setInterval(
                //     () => { 
                if (index > 5)
                    return;
                radius *= 11; //0.99;//0.618;
                console.log(day, radius);
                var rotation = day / _this.solarData.yearDays[index];
                var radians = rotation * 2 * Math.PI;
                var radX = radius * Math.cos(radians);
                var radY = -radius * Math.sin(radians);
                _this.drawYinYanEccentric(_this.sunCenter, { 'x': _this.sunCenter.x + radX, 'y': _this.sunCenter.y + radY });
                //this.drawYinYanCircle(this.sunCenter, {'x': this.sunCenter.x + radX, 'y': this.sunCenter.y + radY})
                //this.drawYinYanPerspective(this.sunCenter, {'x': this.sunCenter.x, 'y': this.sunCenter.y}, Math.PI / 6)
            }
            //        , 20
            );
            if (day >= 12000) {
                window.open(this_1.cnvs.toDataURL(), '_blank');
            }
            if (day > 12000) {
                return "break";
            }
        };
        var this_1 = this;
        //let increment = 60;
        //let increment = 100;
        //for (let day = 0; day < yearDays[6]; day += increment) {
        for (var day = 0; day < this.solarData.yearDays[8]; day += increment) {
            var state_1 = _loop_3(day);
            if (state_1 === "break")
                break;
        }
    };
    /**
     * Experiment with different kinds of drawing the artwork.
     */
    SolarCycleTaijitu.prototype.drawWorkspace2 = function () {
        var _this = this;
        var numDays = 1200;
        //sqrtDists.map((distance, index) => planets[index].radius = distance);
        //console.table(planets);
        //planets.map((planet) => drawOrbit(planet));
        // const sunCenter = {'x': this.width / 2, 'y': this.height / 2};
        //const sunCenter = {'x': 0.25 * parseInt(window.innerWidth), 'y': 0.75 * parseInt(window.innerHeight)};
        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 1 * rad, 'y': 500}));
        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 2 * 1.618 * rad, 'y': 500}));
        //sqrtDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 10 * rad, 'y': 500}));
        //let increment = 1;
        //let increment = 12;
        var increment = 30;
        var _loop_4 = function (day) {
            if (day % 37 < 35)
                return "continue";
            //if (day % 33 < 5) increment++;
            //if (day % 73 < 3) increment--;
            //if (increment > 21) increment = 1;
            if (day % 43 > 4)
                return "continue";
            this_2.cx.fillStyle = 'black';
            this_2.cx.fillRect(0, 0, this_2.width, this_2.height);
            this_2.solarData.sqrtDists.map(function (radius, index) {
                // let ret = setInterval(
                //     () => { 
                if (index > 5)
                    return;
                radius *= 11; //0.99;//0.618;
                console.log(day, radius);
                var rotation = day / _this.solarData.yearDays[index];
                var radians = rotation * 2 * Math.PI;
                var radX = radius * Math.cos(radians);
                var radY = -radius * Math.sin(radians);
                _this.drawYinYanEccentric(_this.sunCenter, { 'x': _this.sunCenter.x + radX, 'y': _this.sunCenter.y + radY });
                //this.drawYinYanCircle(this.sunCenter, {'x': this.sunCenter.x + radX, 'y': this.sunCenter.y + radY})
                //this.drawYinYanPerspective(this.sunCenter, {'x': this.sunCenter.x, 'y': this.sunCenter.y}, Math.PI / 6)
            }
            //        , 20
            );
            if (day >= numDays) {
                window.open(this_2.cnvs.toDataURL(), '_blank');
                return "break";
            }
        };
        var this_2 = this;
        //let increment = 60;
        //let increment = 100;
        //for (let day = 0; day < yearDays[6]; day += increment) {
        for (var day = 0; day < this.solarData.yearDays[8]; day += increment) {
            var state_2 = _loop_4(day);
            if (state_2 === "break")
                break;
        }
    };
    return SolarCycleTaijitu;
}());
// when page is loaded
document.addEventListener("DOMContentLoaded", function () {
    // run it
    var solarCycleTaijitu = new SolarCycleTaijitu();
    solarCycleTaijitu.printThis();
    // solarCycleTaijitu.drawYinYanEccentric(); // boring little single one
    //solarCycleTaijitu.drawWorkspace(); // neat and small colorful geometry
    //solarCycleTaijitu.drawWorkspace0(); // flashing nonsense
    // solarCycleTaijitu.drawWorkspace1();
    solarCycleTaijitu.drawWorkspace2();
    // insert parameters before redraw
    // TODO rotate head-on 2D circle in 3D as ellipse
    // let radius = 300;
    // let rotation = Math.PI / 4;
    // let radians = rotation * 1 * Math.PI;
    // let radX = radius * Math.cos(radians);
    // let radY = -radius * Math.sin(radians);
    // solarCycleTaijitu.drawYinYanPerspective(solarCycleTaijitu.sunCenter, radius, Math.PI / -6)
});
//# sourceMappingURL=script.js.map