window.onload = () => {
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;

    class EvilBall {
        constructor() {
            // Create circle div
            this.el = document.createElement(`DIV`);
            const playerBall = document.querySelector(`.gameBall`).style;
            const { left: playerLeft } = playerBall;

            // Place ball on opposite side of the screen to the players ball so they don't instantly collide
            this.el.style.left = (parseInt(playerLeft) < window.innerWidth / 2) ? `${(0.5 + Math.random() * 0.5) * winWidth}px` : `${(Math.random() * 0.5) * winWidth}px`;

            this.el.style.top = `${Math.random() * winHeight}px`;
            this.dirY = Math.random() < 0.5 ? `down` : `up`;
            this.dirX = Math.random() < 0.5 ? `right` : `left`;

            // Create interval for moving evil balls
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
                let heroLeft = parseInt(playerBall.left), heroBottom = parseInt(playerBall.top) + 20, heroTop = parseInt(playerBall.top), heroRight = parseInt(playerBall.left) + 20;

                if (heroBottom >= evilTop && heroTop <= evilBottom && heroRight >= evilLeft && heroLeft <= evilRight) {
                    stopBalls()
                }
            }

            this.stop = () => {
                clearInterval(self.ballsMove);
            }
        }
    };

    class PlayerBall {
        constructor() {
            this.el = document.createElement(`DIV`);
            this.el.style.top = `${Math.random() * winHeight}px`;
            this.el.style.left = `${Math.random() * winWidth}px`;
            this.dirY = Math.random() < 0.5 ? `down` : `up`;
            this.dirX = Math.random() < 0.5 ? `right` : `left`;
            
            const self = this;
            
            this.playerBoundary = undefined;
            this.setPlayerBoundary = () => {
                self.playerBoundary = setInterval(self.checkPlayerBoundary, 2);
            }

            this.checkPlayerBoundary = () => {
                // Access postition of ball and parse as integers
                const gameBall = document.querySelector(`.gameBall`).style;
                const { left: posLeft, top: posTop } = gameBall;
                const intTop = parseInt(posTop);
                const intLeft = parseInt(posLeft);

                // Keep player ball within the boundaries of the screen
                if (intLeft < 0) gameBall.left = 0;
                if (intTop < 0) gameBall.top = 0;
                if (intLeft > window.innerWidth - 20) gameBall.left = `${window.innerWidth - 20}px`;
                if (intTop > window.innerHeight - 20) gameBall.top = `${window.innerHeight - 20}px`;
            }
        }
    };

    // Create the players ball
    let playerBall = new PlayerBall;
    playerBall.el.className = `gameBall`;
    document.body.append(playerBall.el);
    playerBall.setPlayerBoundary();

    // Create the evil balls, one each second
    let ballsList = [];
    let newBalls;
    let ballCounter = 0;
    
    const createBalls = () => {
        newBalls = setInterval( function() {
            let b = new EvilBall;
            b.el.className = `evilBall`;
            document.body.append(b.el);
            ballsList.push(b);
            b.startInterval();
            ballCounter++;
            document.querySelector('#counter').innerHTML = ballCounter;
        }, 1000)
    };

    createBalls();

    // Stop producing balls, turn off controls
    function stopBalls() {
        ballsList.forEach( (ball) => {
            ball.stop();
            clearInterval(newBalls);
            clearInterval(going)
            controlsOn = false;
        });
    };

    // Player ball movement
    // Store css properties for keyboard arrow directions
    var direction = {
        '39': {
            left: "+=1"
        },
        '40': {
            top: "+=1"
        },
        '37': {
            left: "-=1"
        },
        '38': {
            top: "-=1"
        }
    }
    
    // Store the keys pressed in an empty object (allows for multiple keypresses to be detected)
    let keyMap = {};
    let controlsOn = true;
    // Store the animated interval in a variable that can be accessed by stopBalls() 
    let going;

    onkeydown = onkeyup = (e) => {
        // Don't do anything if the controls are off or non-arrow keys have been pressed
        if ((!controlsOn) || (e.keyCode < 37 || e.keyCode > 40)) return;

        // Clear the existing animation
        clearInterval(going);

        // Store the pressed key(s) in the keyMap and convert into an array
        keyMap[e.keyCode] = e.type === `keydown`;
        const keyArray = Object.entries(keyMap);

        // Get all keys that have been pressed and convert them to their direction counterparts, filtering out non-pressed keys (undefined values)
        const activeKeys = keyArray.map((k) => {
            if (!k[1]) return;
            return direction[k[0]];
        }).filter( (a) => a != null);

        // If two keys have been pressed they need to be merged into one object to be passed to the .css() method
        const animation = (activeKeys.length > 1) ? { ...activeKeys[0], ...activeKeys[1] } : activeKeys[0];
        
        // Append CSS for movement of players ball
        function keepGoing() {
            $(".gameBall").css(animation);
        }

        // Set the interval for the animation if key has been pressed
        if (animation) going = setInterval(keepGoing, 1);
    }
}