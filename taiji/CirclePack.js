// adapted from: https://codepen.io/hey-nick/pen/xbONzg itself referencing: http://jacksonkr.com/playground

/* // html
<canvas id="circle-pack"></canvas>

<a href="#" id="btn">click me</a>
*/

/* // CSS
body {
  background-color: #efefef;
  margin: 0;
  //overflow: hidden;
}
*/


var circleCount = 40;
var maxSize = 70;
var minSize = 10;


function CirclePacking(canvas) {
	this.canvas = canvas;
	this._ctx = this.canvas.getContext("2d");
	this._circles = [];
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
	
	var self = this;
  var intervalCounter = 0;
	var intervalStop = circleCount * 2; // pretty arbitary, but it works

  
	var interval = setInterval(function(){
    self.enterFrame();
    
   /* if (++intervalCounter === intervalStop) {
       // positioning is now complete
       clearInterval(interval);
    }*/
    
  }, 1000/60);

}

CirclePacking.prototype.addCircle = function(circle) {
	this._circles.push(circle);
}

CirclePacking.prototype.enterFrame = function() {
  
  var ctx = this._ctx;
  var v = new VectorXY();
  
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this._circles = this._circles.sort(Circle.sortOnDistanceToCenter);
	
  
  // Push them away from each other
	for(var i = 0; i < circleCount ; i++) {
		var ci = this._circles[i];
		
		for (var j = i + 1; j < circleCount; j++) {
			var cj = this._circles[j];
			
      var dx = cj.x - ci.x;
			var dy = cj.y - ci.y;
			var r = ci.size + cj.size;
			var d = (dx*dx) + (dy*dy);
      
			if (d < (r * r) - 0.01 ) {
				v.x = dx;
				v.y = dy;
				v.normalize();
				v.scaleBy((r - Math.sqrt(d)) * 0.2);
				
        cj.x += v.x;
			  cj.y += v.y;
        ci.x -= v.x;
			  ci.y -= v.y;
				
			}
		}
    
	}
  
  
  
	// draw circles
	for(var i = 0; i < circleCount; i++) {
		var obj = this._circles[i];
    
		ctx.beginPath();
		ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI*2, true);
		ctx.fillStyle = "rgb(173,35,75)";
		ctx.lineWidth = 0;
		ctx.fill();
    
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(obj.size, obj.x, obj.y + 5 );
    
		//ctx.strokeStyle = "rgba(0,0,0,0.2)";
    //ctx.stroke();
    ctx.closePath();
 
	}
  
}

function Circle(x, y, size) {
	//this._cp = cp;
	this.x = x || 0;
	this.y = y || 0;
	this.size = size || 10;
}

function VectorXY(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	//this.z = z || 0;
}


VectorXY.prototype.normalize = function() {
	var s = 1/Math.sqrt(this.x*this.x + this.y*this.y);
	this.scaleBy(s, s);
}

VectorXY.prototype.scaleBy = function(x, y) {
	if (y === undefined) y = x;
	if (x === undefined) x = y;

	this.x *= x;
	this.y *= y;
	//this.z *= z;
}

var size;
  var cp = new CirclePacking(document.getElementById('circle-pack'));
  
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

window.onload = function() {
  
  
  
  for (var i = 0; i < circleCount; i++) {
     size = getRandomInt(minSize, maxSize);
		 cp.addCircle(new Circle(Math.random() + (window.innerWidth / 2), Math.random() + (window.innerHeight / 2), size));
	}
  
}

$('#btn').on('click', function(e) {
  e.preventDefault();
  
  console.log('yeah');
  
  circleCount++;
  
  size = getRandomInt(minSize, maxSize);
		 cp.addCircle(new Circle(Math.random() + (window.innerWidth / 2), Math.random() + (window.innerHeight / 2), size));
  
  
//  CirclePacking.enterFrame();
});