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
 class SolarSystemData {

    public planets: any[];
    public distances: number[];
    public mercDists: number[];
    public sqrtDists: number[];
    public yearDays: number[];

    constructor() {
        // round log e Distance from Sun * 10; Mercury, Venus...Saturn, Uranus
        this.planets = [
                {'radius': 1, 'mass': 10}, // sun
                {'radius': 41, 'mass': 1},
                {'radius': 47, 'mass': 4},
                {'radius': 50, 'mass': 4},
                {'radius': 54, 'mass': 2},
                {'radius': 67, 'mass': 10},
                {'radius': 73, 'mass': 8},
                {'radius': 80, 'mass': 7},
                {'radius': 84, 'mass': 7},
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
}


/**
 * The data and algorithms to generate the artwork.
 */
class SolarCycleTaijitu {

    private cnvs: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    public solarData: SolarSystemData;

    public sunCenter: any;

    public width: number;
    public height: number;

    constructor() {
        // initialize canvas element
        let cnvs = document.querySelector("canvas") as HTMLCanvasElement;

        // cnvs.style.width = window.innerWidth.toString();
        // cnvs.style.height = window.innerHeight.toString();

        // cnvs.style.width = screen.width.toString();
        // cnvs.style.height = screen.height.toString();
        
        cnvs.style.width = '100vw';
        cnvs.style.height = '100vh';
        // cnvs.style.paddingLeft = '10vw';
        //cnvs.style.paddingTop = '10vh';


        // viewport height is not using the entire height

        // set the canvas width and height attributes
        cnvs.setAttribute('width', window.getComputedStyle(cnvs, null).getPropertyValue('width'));
        cnvs.setAttribute('height', window.getComputedStyle(cnvs, null).getPropertyValue('height'));

        this.width = parseInt(window.getComputedStyle(cnvs, null).getPropertyValue('width'));
        this.height = parseInt(window.getComputedStyle(cnvs, null).getPropertyValue('height'));

        console.log(`width: ${this.width}, height: ${this.height}`);
    
        // get drawing context from canvas
        let cx = cnvs.getContext("2d") as CanvasRenderingContext2D;

        this.cnvs = cnvs;
        this.cx = cx;
        
        // use the NASA planetary orbit table data
        let solarData = new SolarSystemData();
        this.solarData = solarData;

        // set the sun's coordinates
        this.sunCenter = {'x': this.width / 2, 'y': this.height / 2};
    }

    public printThis() {
        console.log(this.sunCenter);
        console.log(this.width);
        console.log(this.height);
        console.log(this.cx);
        console.log(this.cnvs);
        console.table(this.solarData);
    }

    public printSolarData() {
        console.table(this.solarData);
    }

    
    /**
     * Draw the taijitu/yin-yan symbol.
     * 
     * @param center1 the location of the smallest black circle
     * @param center2 the location of the smallest white circle
     */
    public drawYinYanEccentric = (center1: any = null, center2: any = null) => {

        if (!center1) {
            center1 = {'x': this.sunCenter.x / 2, 'y': this.sunCenter.y / 2};
        }
        if (!center2) {
            center2 = {'x': this.sunCenter.x * 1.5, 'y': this.sunCenter.y * 1.5};
        }
        
        this.cx.globalCompositeOperation = 'difference';
        //this.cx.filter = 'invert(1)';
        this.cx.filter = 'invert(0)';


        // average of the two centers
        const centerCenter = {
            'x': (center1.x + center2.x) / 2,
            'y': (center1.y + center2.y) / 2
        };
        
        // radius of large circle is Euclidean distance between the centers of he two smallest circles (center1, center2)
        const radius = this.euclideanDistance(center1, center2);
        
        let start = Math.atan2(center1.y - center2.y, center1.x - center2.x);
        let end = start + Math.PI;

        // draw white large circle
        this.setWhite();
        this.cx.beginPath();
        this.cx.arc(centerCenter.x, centerCenter.y, radius, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black large semicircle
        this.setBlack();
        this.cx.beginPath();
        this.cx.arc(centerCenter.x, centerCenter.y, radius, end, start, false);
        this.cx.fill();this.cx.stroke();

        // draw white medium circle
        this.setWhite();
        this.cx.beginPath();
        this.cx.arc(center1.x, center1.y, radius / 2, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black medium circle
        this.setBlack();
        this.cx.beginPath();
        this.cx.arc(center2.x, center2.y, radius / 2, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw white small circle
        this.setWhite();
        this.cx.beginPath();
        this.cx.arc(center2.x, center2.y, radius / (2 * Math.PI), 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black small circle
        this.setBlack();
        this.cx.beginPath();
        this.cx.arc(center1.x, center1.y, radius / (2 * Math.PI), 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();  
    }

        
    /**
     * Draw the taijitu/yin-yan symbol.
     * 
     * @param center1 the location of the smallest black circle
     * @param center2 the location of the smallest white circle
     */
     public drawYinYanCircle = (center1: any = null, center2: any = null) => {
        this.drawYinYanPerspective(center1, center2);
    }

        
    // /**
    //  * Draw the taijitu/yin-yan symbol in perspective.
    //  * 
    //  * @param center1 the location of the smallest black circle
    //  * @param center2 the location of the smallest white circle
    //  */
    //public drawYinYanPerspective = (center1: any = null, center2: any = null, horizontalAngle: number = 0) => {

    
    /**
     * Draw the taijitu/yin-yan symbol in perspective.
     * 
     * @param centerCenter the location of the smallest black circle and the smallest white circle
     * @param radius
     */
    public drawYinYanPerspective = (centerCenter: any = null, radius: number = 100, horizontalAngle: number = Math.PI * 0) => {

        if (!centerCenter) { centerCenter = this.sunCenter; }

        let orientSmallCircle1 = Math.asin(horizontalAngle) * radius / 2;
        let orientSmallCircle2 = Math.acos(horizontalAngle + Math.PI) * radius / 2;
        let center1 = {'x': centerCenter.x * orientSmallCircle1, 'y': centerCenter.y * orientSmallCircle1};
        let center2 = {'x': centerCenter.x * orientSmallCircle2, 'y': centerCenter.y * orientSmallCircle2};
        
        this.cx.globalCompositeOperation = 'difference';
        //this.cx.filter = 'invert(1)';
        this.cx.filter = 'invert(0)';


        // average of the two centers
        // const centerCenter = {
        //     'x': (center1.x + center2.x) / 2,
        //     'y': (center1.y + center2.y) / 2
        // };

        let minorMajorRatio: number = Math.sin(horizontalAngle);
        
        // radius of large circle is Euclidean distance between the centers of the two smallest circles (center1, center2)
        //const radius = this.euclideanDistance(center1, center2);
        
        // compute orientation of yin and yan sides relative to vertical
        let start = Math.atan2(center1.y - center2.y, center1.x - center2.x);
        let end = start + Math.PI;

        let rotation = 0; // 

        if (radius < 0) {
            radius = -radius;
        }
        if (minorMajorRatio < 0) {
            minorMajorRatio = -minorMajorRatio;
        }

        // draw white large ellipse
        this.setWhite();
        this.cx.beginPath();
        this.cx.ellipse(centerCenter.x, centerCenter.y, radius, minorMajorRatio * radius, rotation, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black large semi-ellipse
        this.setBlack();
        this.cx.beginPath();
        this.cx.ellipse(centerCenter.x, centerCenter.y, radius, minorMajorRatio * radius, rotation, end, start, false);
        this.cx.fill();this.cx.stroke();

        // draw white medium ellipse
        this.setWhite();
        this.cx.beginPath();
        this.cx.ellipse(center1.x, center1.y, radius / 2, minorMajorRatio * radius / 2, rotation, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black medium ellipse
        this.setBlack();
        this.cx.beginPath();
        this.cx.ellipse(center2.x, center2.y, radius / 2, minorMajorRatio * radius / 2, rotation, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw white small ellipse
        this.setWhite();
        this.cx.beginPath();
        this.cx.ellipse(center2.x, center2.y, radius / (2 * Math.PI), minorMajorRatio * radius / (2 * Math.PI), rotation, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();

        // draw black small ellipse
        this.setBlack();
        this.cx.beginPath();
        this.cx.ellipse(center1.x, center1.y, radius / (2 * Math.PI), minorMajorRatio * radius / (2 * Math.PI), rotation, 0, 2 * Math.PI, false);
        this.cx.fill();this.cx.stroke();  
    }


    /**
     * Draw an orbital position of a planet.
     * 
     * @param planet an object with orbital radius and mass properties
     * @param center current x,y coordinates of the planet
     */
    public drawOrbit = (planet={'radius': 50, 'mass': 4}, center={'x': 600, 'y': 440}) => {
        
        this.cx.beginPath();
        this.cx.arc(center.x, center.y, planet.radius * 10, 0, 2 * Math.PI, false);
        this.cx.strokeStyle = "rgba(100, 100, 100, 1)";
        this.cx.lineWidth = Number(`${planet.mass / 2}`);
        this.cx.stroke();
    }


    /**
     * Set the drawing fill and stroke to white.
     * 
     * @param alpha the transparency value
     */
    private setWhite = (alpha=1) => {
        this.cx.fillStyle = `rgba(225, 225, 225, ${alpha})`;
        this.cx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    }


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
     private setBlack = (alpha=1) => {
         //temporary
        this.cx.fillStyle = `rgba(25, 25, 25, ${alpha})`;
        this.cx.strokeStyle = `rgba(25, 25, 25, ${alpha})`;
        // this.cx.fillStyle = `rgba(125, 25, 25, ${alpha})`;
        // this.cx.strokeStyle = `rgba(0, 210, 0, ${alpha})`;
    }

    
    /**
     * Compute the Euclidean distance between two points.
     * 
     * @param center1 x,y coordinate center of the first point
     * @param center2 x,y coordinate center of the second point
     * @returns the distance between the two points
     */
    public euclideanDistance = (center1, center2) => {
        
        const xDist = center1.x - center2.x;
        const yDist = center1.y - center2.y;
        
        return Math.sqrt(
                    Math.pow(xDist, 2) + Math.pow(yDist, 2)
            ); // 2D distance formula
    }

    public drawWorkspace() {
           
        this.solarData.sqrtDists.map(
            (rad) => {
                console.log(rad);
                this.drawYinYanEccentric(
                    {'x':this.sunCenter.x, 'y': this.sunCenter.y}
                    , {'x': this.sunCenter.x - rad, 'y': this.sunCenter.y + rad}
                );
            });
    }

    
    public drawWorkspace0(jMax = 10, iMax = 10) {
        let counter = 0;
        for (let j = 0; j < jMax; j += 1) {
            for (let i = 0; i < iMax; i++) {
                setInterval(() => this.drawYinYanEccentric(
                        this.sunCenter
                        , {'x': Math.pow(2, i / j), 'y': counter++ % Math.pow(2, j / i)})
                    , 0.051);
            }
        }
    }

    /**
     * Experiment with different kinds of drawing the artwork.
     */
    public drawWorkspace1() {
        //sqrtDists.map((distance, index) => planets[index].radius = distance);
        //console.table(planets);
        //planets.map((planet) => drawOrbit(planet));
        // const sunCenter = {'x': this.width / 2, 'y': this.height / 2};
        //const sunCenter = {'x': 0.25 * parseInt(window.innerWidth), 'y': 0.75 * parseInt(window.innerHeight)};


        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 1 * rad, 'y': 500}));
        //mercDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 2 * 1.618 * rad, 'y': 500}));
        //sqrtDists.map((rad) => drawYinYanEccentric(sunCenter, {'x': 400 + 10 * rad, 'y': 500}));

        let increment = 3;
        // let increment = 12;
        // let increment = 30;
        // let increment = 43;
        //let increment = 100;
        //for (let day = 0; day < yearDays[6]; day += increment) {
        let numCycles = 4 * this.solarData.yearDays[5];
        for (let day = 0; day < numCycles; day += increment) {
            
                
            if (day >= numCycles - increment) {
                // window.open(this.cnvs.toDataURL(), '_blank');
                console.log('done');
                break;
            }

            // if (day % 37 > 4) continue;
            // if (day % 37 < 13) continue;
            //if (day % 33 < 5) increment++;
            //if (day % 73 < 3) increment--;
            //if (increment > 21) increment = 1;
            //if (day % 43 > 4) continue;
            if (day % 43 > 3) continue;

            this.cx.fillStyle = 'black';
            this.cx.fillRect(0, 0, this.width, this.height);

            // let rotation = 0;
            this.solarData.sqrtDists.map((radius, index) => {
    
                // planets to include
                if ([0,1,2,3,4,/*5,6,7,8*/].indexOf(index) < 0) return;


                radius *= 19;//17.6667;//0.618;
                // radius /= 4;
                // console.log(day, radius);

                let rotation = .13333 * day / this.solarData.yearDays[index];
                // rotation = (rotation + 13) % 360;

                let radians = rotation * 2 * Math.PI;
                let radX = radius * Math.cos(radians);
                let radY = -radius * Math.sin(radians);
    
                setTimeout(() => {
                    this.drawYinYanEccentric(
                        this.sunCenter
                        , {
                            'x': this.sunCenter.x + radX
                            , 'y': this.sunCenter.y + radY
                        });
                    //this.drawYinYanCircle(this.sunCenter, {'x': this.sunCenter.x + radX, 'y': this.sunCenter.y + radY})
                    //this.drawYinYanPerspective(this.sunCenter, {'x': this.sunCenter.x, 'y': this.sunCenter.y}, Math.PI / 6)
                  }, 333);
                    
                

        });
        }
        

    }

}

function blit(cnvs) { // TODO implement for interactive performance, overlay and precomputation
    // adapted from: https://stackoverflow.com/a/6003174/6254147
    // setup
    var buffer = document.createElement('canvas');
    buffer.width = cnvs.width;
    buffer.height = cnvs.height;

    // save
    buffer.getContext('2d').drawImage(cnvs, 0, 0);

    // restore
    cnvs.getContext('2d').drawImage(buffer, 0, 0);
}

// when page is loaded
document.addEventListener("DOMContentLoaded", () => {

    // run it
    const solarCycleTaijitu = new SolarCycleTaijitu();
    solarCycleTaijitu.printThis();

    // TODO rotate head-on 2D circle in 3D as ellipse
    // let radius = 200;
    // console.log(radius);
    // let rotation = Math.PI / 4;
    // let radians = rotation * 1 * Math.PI;
    // let radX = radius * Math.cos(radians);
    // let radY = -radius * Math.sin(radians);
    // solarCycleTaijitu.drawYinYanPerspective({x: 300, y: 300}, 200, 0.5 * Math.PI);
    //solarCycleTaijitu.drawYinYanPerspective(solarCycleTaijitu.sunCenter, radius, Math.PI / -4);

    
    // solarCycleTaijitu.drawWorkspace(); // boring little single one
    //solarCycleTaijitu.drawWorkspace0(4, 17); // flashing nonsense
    solarCycleTaijitu.drawWorkspace1();
    // solarCycleTaijitu.drawYinYanEccentric(solarCycleTaijitu.sunCenter, {x: 600, y: 300});
});

// TODO add button to drop current PNG in new tab
// let dropBtn = document.querySelector('#dropPNG');
// dropBtn.addEventListener('click', (e) => {
//     window.open(document.querySelector('canvas').toDataURL(), '_blank');
// });
document.querySelector('#main_canvas').addEventListener('mousedown', (e) => {
    window.open(document.querySelector('canvas').toDataURL(), '_blank');
});