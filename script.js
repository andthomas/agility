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
                self.ballsMove = setInterval(self.start, 25);
            }

            this.start = () => {
                const evilBallPosY = parseInt(this.el.style.top);
                const evilBallPosX = parseInt(this.el.style.left);

                // Move the evil ball up or down 
                this.el.style.top = this.dirY === `down` ? `${evilBallPosY + 5}px` : `${evilBallPosY - 5}px`;

                // Change direction of evil ball if it hits the wall
                if (evilBallPosY > winHeight) {
                    this.dirY = `up`;
                } else if (evilBallPosY < 10) {
                    this.dirY = `down`;
                }

                // Move the ball left or right
                this.el.style.left = this.dirX === `right` ? `${evilBallPosX + 5}px` : `${evilBallPosX - 5}px`;

                // Change direction of evil ball if it hits the wall
                if (evilBallPosX > winWidth) {
                    this.dirX = `left`;
                } else if (evilBallPosX < 10) {
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
            controlsOn = false;
        })
    }

    var change = {
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
    
    let map = {};
    let controlsOn = true;
    let going;
    onkeydown = onkeyup = (e) => {

        if (!controlsOn) return;

        map[e.keyCode] = e.type == `keydown`;
        if (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) return;

        clearInterval(going)

        let animation;

        function keepGoing() {
            $(".gameBall").css(animation)
        }

        const gameBall = document.querySelector(`.gameBall`).style;
        const { left: posLeft, top: posTop } = gameBall;
        
        if (map[`37`] && map[`38`]) {
            if (parseInt(posLeft) <= 0 || parseInt(posTop) <= 0) return;
            animation = change['leftUp'];
            going = setInterval(keepGoing, 1);
        } else if (map[`38`] && map[`39`]) {
            if (parseInt(posLeft) >= window.innerWidth - 20 || parseInt(posTop) <= 0) return;
            animation = change['upRight'];
            going = setInterval(keepGoing, 1);
        } else if (map[`39`] && map[`40`]) {
            if (parseInt(posLeft) >= window.innerWidth - 20 || parseInt(posTop) >= window.innerHeight - 20) return;
            animation = change['rightDown'];
            going = setInterval(keepGoing, 1);
        } else if (map[`40`] && map[`37`]) {
            if (parseInt(posLeft) <= 0 || parseInt(posTop) >= window.innerHeight - 20) return;
            animation = change['downRight'];
            going = setInterval(keepGoing, 1);
        } else if (map[`37`]) {
            if (parseInt(posLeft) <= 0) return;
            animation = change['left'];
            going = setInterval(keepGoing, 1);
        } else if (map[`38`]) {
            if (parseInt(posTop) <= 0) return;
            animation = change['up'];
            going = setInterval(keepGoing, 1);
        } else if (map[`39`]) {
            if (parseInt(posLeft) >= window.innerWidth - 20) return;
            animation = change['right'];
            going = setInterval(keepGoing, 1);
        } else if (map[`40`]) {
            if (parseInt(posTop) >= window.innerHeight - 20) return;
            animation = change['down'];
            going = setInterval(keepGoing, 1);
        }
    }
}