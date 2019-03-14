window.onload = () => {
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;

    class Ball {
        constructor() {
            // Create circle div
            this.el = document.createElement(`DIV`);
            this.el.style.top = `${Math.random() * winHeight}px`;
            this.el.style.left = `${Math.random() * winWidth}px`;
            this.dirY = Math.random() < 0.5 ? `down` : `up`;
            this.dirX = Math.random() < 0.5 ? `right` : `left`;

            const self = this;
            this.ballsMove = undefined;
            this.startInterval = () => {
                self.ballsMove = setInterval(self.start, 10);
            }

            this.start = () => {
                const evilBallPosY = parseInt(this.el.style.top);
                const evilBallPosX = parseInt(this.el.style.left);

                // Move the evil ball up or down 
                this.el.style.top = this.dirY === `down` ? `${evilBallPosY + 2}px` : `${evilBallPosY - 2}px`;

                // Move the ball left or right
                this.el.style.left = this.dirX === `right` ? `${evilBallPosX + 2}px` : `${evilBallPosX - 2}px`;

                // Change Y direction of evil ball if it hits the wall
                if (evilBallPosY > winHeight - 20) {
                    this.dirY = `up`;
                } else if (evilBallPosY < 0) {
                    this.dirY = `down`;
                }

                // Change X direction of evil ball if it hits the wall
                if (evilBallPosX > winWidth - 20) {
                    this.dirX = `left`;
                } else if (evilBallPosX < 0) {
                    this.dirX = `right`;
                }

                // Check for collision
                let evilTop = evilBallPosY, evilBottom = evilBallPosY + 20, evilLeft = evilBallPosX, evilRight = evilBallPosX + 20;
                let heroLeft = parseInt(ball1.el.style.left), heroBottom = parseInt(ball1.el.style.top) + 20, heroTop = parseInt(ball1.el.style.top), heroRight = parseInt(ball1.el.style.left) + 20;

                if (heroBottom >= evilTop && heroTop <= evilBottom && heroRight >= evilLeft && heroLeft <= evilRight) {
                    stopBalls()
                }
            }

            this.stop = () => {
                clearInterval(self.ballsMove);
            }
        }
    }

    // Create the players ball
    let ball1 = new Ball;
    ball1.el.className = `gameBall`;
    document.body.append(ball1.el);

    // Create the evil balls, one each second
    let ballsList = [];
    let newBalls;
    let ballCounter = 0;
    
    const createBalls = () => {
        newBalls = setInterval( function() {
            let b = new Ball;
            b.el.className = `evilBall`;
            document.body.append(b.el);
            ballsList.push(b)
            b.startInterval();
            ballCounter++;
            document.querySelector('#counter').innerHTML = ballCounter;
        }, 1000)
    }

    createBalls();

    // Stop producing balls, turn off controls
    function stopBalls() {
        ballsList.forEach( (ball) => {
            ball.stop();
            clearInterval(newBalls);
            clearInterval(going)
            controlsOn = false;
        })
    }

    // Store css properties for keyboard arrow directions
    var direction = {
        'right': {
            left: "+=1"
        },
        'down': {
            top: "+=1"
        },
        'left': {
            left: "-=1"
        },
        'up': {
            top: "-=1"
        },
        'leftUp': {
            top: "-=1",
            left: "-=1"
        },
        'upRight': {
            top: "-=1",
            left: "+=1"
        },
        'rightDown': {
            top: "+=1",
            left: "+=1"
        },
        'downRight': {
            top: "+=1",
            left: "-=1"
        },
    }
    
    // Store the keys pressed in an empty object (allows for multiple keypresses to be detected)
    let keyMap = {};
    let controlsOn = true;
    // Store the animated interval in a variable that can be accessed by stopBalls() 
    let going;

    onkeydown = onkeyup = (e) => {

        // Don't do anything if the controls are off or non-arrow keys have been pressed
        if ((!controlsOn) || (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40)) return;

        // Store the pressed key(s) in the keyMap
        keyMap[e.keyCode] = e.type == `keydown`;

        // Clear the existing animation (on keyup)
        clearInterval(going)

        let animation;
        const gameBall = document.querySelector(`.gameBall`).style;
        // Access postition of ball and parse into integers stored in variables
        const { left: posLeft, top: posTop } = gameBall;
        const intTop = parseInt(posTop);
        const intLeft = parseInt(posLeft);
        
        // Append CSS for movement of players ball
        function keepGoing() {
            $(".gameBall").css(animation)
        }

        if (keyMap[`37`] && keyMap[`38`]) {
            // If against a wall don't go any futher
            if (intLeft <= 0 || intTop <= 0) return;
            // Obtain the relevent CSS properties for a movement up and to the left
            animation = direction['leftUp'];
            // Define the animation using setInterval
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`38`] && keyMap[`39`]) {
            if (intLeft >= window.innerWidth - 20 || intTop <= 0) return;
            animation = direction['upRight'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`39`] && keyMap[`40`]) {
            if (intLeft >= window.innerWidth - 20 || intTop >= window.innerHeight - 20) return;
            animation = direction['rightDown'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`40`] && keyMap[`37`]) {
            if (intLeft <= 0 || intTop >= window.innerHeight - 20) return;
            animation = direction['downRight'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`37`]) {
            if (intLeft <= 0) return;
            animation = direction['left'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`38`]) {
            if (intTop <= 0) return;
            animation = direction['up'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`39`]) {
            if (intLeft >= window.innerWidth - 20) return;
            animation = direction['right'];
            going = setInterval(keepGoing, 1);
        } else if (keyMap[`40`]) {
            if (intTop >= window.innerHeight - 20) return;
            animation = direction['down'];
            going = setInterval(keepGoing, 1);
        }
    }
}