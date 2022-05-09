window.onload = function () {

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let universeDiv = document.querySelector('.universe');
    let canvasWidth = universeDiv.offsetWidth;
    let canvasHeight = universeDiv.offsetHeight;
    let canvasXCenter = canvasWidth / 2;
    let canvasYCenter = canvasHeight / 2;
    let canvasXQuarter = canvasWidth / 4;
    let canvasYQuarter = canvasHeight / 4;
    let pointCoord = [];
    let starsCount;
    let starsSpeed = 10;
    let deepStars = 3000;
    let circle = 2 * Math.PI;
    let L = 0;
    let L2 = 0;
    let L3 = -circle / 2;
    let pause = true;

    let scrollerText = document.querySelector('.scroller-text').innerHTML;
    let scrollLetterCount = 61;
    let firstLetter = 1;
    let sinusCount = 2.5;
    let cosCount = 0;
    let preSinusCount = sinusCount;
    let preCosCount = cosCount;
    let scrollDelay = 4;


    addEventListener('resize', resize);
    addEventListener('orientationchange', resize);

    addEventListener('keydown', ev => {

        switch (ev.key) {
            case 'ArrowRight':
                L2 -= .005;
                break;
            case 'ArrowLeft':
                L2 += .005;
                break;
            case 'ArrowUp':
                L += .005;

                break;
            case 'ArrowDown':

                L -= .005;
                break;
        }
        L = L <= circle ? L : 0;
        L2 = L2 <= circle ? L2 : 0;

    });

    resize();
    pointGenerator();
    pointSet();
    generateHtmlLetterScroller();

    let letter = document.querySelectorAll('.letter');

    setTimeout(() => {
        pause = false;
    }, 16000);

    mainLoop();

    function mainLoop() {
        if (!pause) {
            L = L <= circle ? L + .002 : 0;
            L2 = L2 <= circle ? L2 + .0009 : 0;
        }
        L3 = L3 <= circle / 2 ? L3 + .0007 : -circle / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        pointSet();
        if (!pause) {
            flyingScroller();
        }
        pointMove();
        requestAnimationFrame(mainLoop);
    }

    function pointGenerator() {
        let x, y, z, s, c, xSpeed, ySpeed;
        for (let i = 0; i < starsCount; i++) {
            x = Math.random() * canvasWidth - canvasXCenter;
            xSpeed = Math.random();
            Math.random() > .5 ? xSpeed *= -1 : null;
            y = Math.random() * canvasHeight - canvasYCenter;
            ySpeed = Math.random();
            Math.random() > .5 ? ySpeed *= -1 : null;
            z = Math.random() * -deepStars;
            s = Math.random() * starsSpeed + 1;
            c = '255,255,255';
            pointCoord[i] = [x, y, z, s, c, 0, xSpeed, ySpeed];
        }
    }

    function pointMove() {
        for (let i = 1; i < starsCount; i++) {

            if (pointCoord[i][2] > -deepStars) {
                pointCoord[i][2] -= pointCoord[i][3];
            } else {
                pointCoord[i][2] = deepStars;
            }
            if (!pause) {
                pointCoord[i][0] = pointCoord[i][0] + pointCoord[i][6];
                if (pointCoord[i][0] > canvasWidth) {
                    pointCoord[i][0] = canvasWidth / 2 * -1
                }
                if (pointCoord[i][0] < (canvasWidth * -1)) {
                    pointCoord[i][0] = canvasWidth / 2;
                }
                pointCoord[i][1] = pointCoord[i][1] + pointCoord[i][7];
                if (pointCoord[i][1] > canvasHeight) {
                    pointCoord[i][1] = canvasHeight / 2 * -1
                }
                if (pointCoord[i][1] < (canvasHeight * -1)) {
                    pointCoord[i][1] = canvasHeight / 2;
                }
            }
        }
    }

    function pointSet() {
        const cosL = Math.cos(L);
        const cosL2 = Math.cos(L2);
        const sinL = Math.sin(L);
        const sinL2 = Math.sin(L2);

        for (let i = 1; i < starsCount; i++) {
            let x = pointCoord[i][0];
            let y = pointCoord[i][1];
            let z = pointCoord[i][2];

            Ny = y * cosL + z * sinL;
            Nz = -y * sinL + z * cosL;

            Nx = x * cosL2 + Nz * sinL2;
            Nz = -x * sinL2 + Nz * cosL2;

            // Nx = Nx * Math.cos(L3) - Ny * Math.sin(L3);
            // Ny = Nx * Math.sin(L3) + Ny * Math.cos(L3);

            x = (deepStars * Nx) / (Nz + deepStars) + canvasXCenter;
            y = (deepStars * Ny) / (Nz + deepStars) + canvasYCenter;
            let r = (deepStars - Nz) / deepStars * 1.5;
            if (r > .1) {
                ctx.fillStyle = 'rgba(' + pointCoord[i][4] + ',' + r + ')';
                r < 1 ? r = 1 : null;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, circle);
                ctx.fill();
            }
        }
    }

    function resize() {
        canvasWidth = universeDiv.offsetWidth;
        canvasHeight = universeDiv.offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvasXCenter = canvasWidth / 2;
        canvasYCenter = canvasHeight / 2;
        canvasXQuarter = canvasWidth / 4;
        anvasYQuarter = canvasHeight / 4;
        starsCount = canvasWidth * canvasHeight / 6000;
        pointGenerator();
    }

    function flyingScroller() {
        scrollDelay++;
        preSinusCount = sinusCount;
        preCosCount = cosCount;
        sinusCount = sinusCount <= circle ? sinusCount + .003 : 0;
        cosCount = cosCount <= circle ? cosCount + .0009 : 0;

        if (scrollDelay === 35) {
            letter[firstLetter].classList.remove('visible');
            letter[firstLetter - 1].classList.remove('prepared');
            letter[firstLetter + scrollLetterCount].classList.add('visible');
            letter[firstLetter + scrollLetterCount + 1].classList.add('prepared');
            firstLetter++;
            scrollDelay = 0;
            sinusCount = preSinusCount;
            cosCount = preCosCount;
            sinusCount -= .1;
            cosCount -= .3;
        }

        let sin = sinusCount;
        let cos = cosCount;

        for (let i = firstLetter; i < firstLetter + scrollLetterCount; i++) {
            letter[i].style.left = Math.sin(-sin) * canvasXQuarter + canvasXCenter + "px";
            letter[i].style.top = Math.cos(sin) * canvasYQuarter + canvasYCenter + Math.cos(sin) * 20 +"px" ;
            sin -= .1;
            cos -= .3;
        }
    }

    function generateHtmlLetterScroller() {
        const container = document.querySelector('.letters-container');
        for (let i = 0; i < scrollerText.length; i++) {
            container.insertAdjacentHTML('beforeend', `<span class="letter">${scrollerText[i]}</span>`);
        }
    }
};
