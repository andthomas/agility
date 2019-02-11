window.onload = () => {
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;

    class Ball {
        constructor() {
            this.el = document.createElement("DIV");
            this.el.style.top = `${Math.random() * winHeight}px`;
            this.el.style.left = `${Math.random() * winWidth}px`;
            this.el.style.transition = "left 0.05s, top 0.05s";
            this.dirY = 'down';
            this.dirX = 'right';

            this.start = () => {
                setInterval(() => {
                    const evilBallPosY = parseInt(this.el.style.top);
                    const evilBallPosX = parseInt(this.el.style.left);

                    // Move the evil ball up or down 
                    this.el.style.top = this.el.dirY === "down" ? `${evilBallPosY + 10}px` : `${evilBallPosY - 10}px`;

                    // Change direction of evil ball if it hits the wall
                    if (evilBallPosY > winHeight) {
                        this.el.dirY = "up";
                    } else if (evilBallPosY < 10) {
                        this.el.dirY = "down";
                    }

                    // Move the ball left or right
                    this.el.style.left = this.el.dirX === "right" ? `${evilBallPosX + 10}px` : `${evilBallPosX - 10}px`;

                    // Change direction of evil ball if it hits the wall
                    if (evilBallPosX > winWidth) {
                        this.el.dirX = "left";
                    } else if (evilBallPosX < 10) {
                        this.el.dirX = "right";
                    }
                }, 50)
            }
        }
    }

    let ball1 = new Ball;
    ball1.el.className = "gameBall";
    document.body.append(ball1.el);

    const evilBalls = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"];

    evilBalls.forEach((b) => {
        b = new Ball;
        b.el.className = "evilBall";
        document.body.append(b.el);
        b.start();
    })
    
    let map = {}; // You could also use an array

    // window.addEventListener('keydown', (e) => {
    onkeydown = onkeyup = function (e) {
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';
        if (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) return;
        console.log(e.keyCode)
        const currentKey = e.keyCode;

        const gameBall = document.querySelector('.gameBall').style;
        const { left: posLeft, top: posTop } = gameBall;
        
        if (map["37"] && map["38"]) {
            gameBall.left = `${parseInt(posLeft) - 10}px`;
            gameBall.top = `${parseInt(posTop) - 10}px`;
        } else if (map["38"] && map["39"]) {
            gameBall.top = `${parseInt(posTop) - 10}px`;
            gameBall.left = `${parseInt(posLeft) + 10}px`;
        } else if (map["39"] && map["40"]) {
            gameBall.left = `${parseInt(posLeft) + 10}px`;
            gameBall.top = `${parseInt(posTop) + 10}px`;
        } else if (map["40"] && map["37"]) {
            gameBall.top = `${parseInt(posTop) + 10}px`;
            gameBall.left = `${parseInt(posLeft) - 10}px`;
        } else if (map["37"]) {
            gameBall.left = `${parseInt(posLeft) - 10}px`;
        } else if (map["38"]) {
            gameBall.top = `${parseInt(posTop) - 10}px`;
        } else if (map["39"]) {
            gameBall.left = `${parseInt(posLeft) + 10}px`;
        } else if (map["40"]) {
            gameBall.top = `${parseInt(posTop) + 10}px`;
        }
        console.log(map);
    }
    
}