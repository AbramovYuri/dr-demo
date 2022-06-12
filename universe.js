window.addEventListener('DOMContentLoaded',()=>{

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

    let tunnel = false;


    const IDs = {
        canvas: 'canvas3D',
        shaders: {
            vertex: 'vertex-shader',
            fragment: 'fragment-shader'
        }
    };


    const CANVAS = document.getElementById(IDs.canvas);
    const GL = CANVAS.getContext('webgl');

    let PROGRAM;


    main();



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

    setTimeout(()=>{
        canvas.classList.remove('visible');

        setTimeout(()=>{
            tunnel = true;
            CANVAS.classList.add('visible');
        }, 8*1000)

    }, 78 * 1000)

    mainLoop();

    function mainLoop(timeStamp) {
        if (!tunnel) {
            if (!pause) {
                L = L <= circle ? L + .002 : 0;
                L2 = L2 <= circle ? L2 + .0009 : 0;
            }
            L3 = L3 <= circle / 2 ? L3 + .0007 : -circle / 2;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            pointSet();
            pointMove();
        }   else {
            GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_time'), timeStamp / 1000.0);
            GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

        }


        if (!pause) {
            flyingScroller();
        }


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


    function main() {
        // clearCanvas();
        createPlane();
        createProgram();
        createTexture();
        updateCanvasSize();
        // initEventListeners();
        // draw();
    }


    function clearCanvas() {
        GL.clearColor(0.26, 1, 0.93, 1.0);
        GL.clear(GL.COLOR_BUFFER_BIT);
    }


    function createPlane() {
        GL.bindBuffer(GL.ARRAY_BUFFER, GL.createBuffer());
        GL.bufferData(
            GL.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                -1, 1,
                1, -1,
                1, 1
            ]),
            GL.STATIC_DRAW
        );
    }


    function createProgram() {
        const shaders = getShaders();

        PROGRAM = GL.createProgram();

        GL.attachShader(PROGRAM, shaders.vertex);
        GL.attachShader(PROGRAM, shaders.fragment);
        GL.linkProgram(PROGRAM);

        const vertexPositionAttribute = GL.getAttribLocation(PROGRAM, 'a_position');

        GL.enableVertexAttribArray(vertexPositionAttribute);
        GL.vertexAttribPointer(vertexPositionAttribute, 2, GL.FLOAT, false, 0, 0);

        GL.useProgram(PROGRAM);
    }


    function getShaders() {
        return {
            vertex: compileShader(
                GL.VERTEX_SHADER,
                document.getElementById(IDs.shaders.vertex).textContent
            ),
            fragment: compileShader(
                GL.FRAGMENT_SHADER,
                document.getElementById(IDs.shaders.fragment).textContent
            )
        };
    }


    function compileShader(type, source) {
        const shader = GL.createShader(type);

        GL.shaderSource(shader, source);
        GL.compileShader(shader);

        console.log(GL.getShaderInfoLog(shader));

        return shader;
    }


    function createTexture() {
        const image = new Image();

        image.crossOrigin = 'anonymous';

        image.onload = () => {
            const texture = GL.createTexture();

            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, texture);
            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, GL.RGB, GL.UNSIGNED_BYTE, image);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            // GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);

            GL.uniform1i(GL.getUniformLocation(PROGRAM, 'u_texture'), 0);
        };

        // image.src = 'https://78.media.tumblr.com/7bd1cd32a3709a8e6821f5ffd3dbcea1/tumblr_pdti2hTKqw1xujoc5o1_540.jpg';

        // Seems like tumblr has been blocked in Russia, so I changed the image to repair demos in my article.
        image.src = 'https://raw.githubusercontent.com/StanislavPetrovV/Tunnel-Shader-Imitation/main/img/lava.jpg';
    }


    function updateCanvasSize() {
        const size = Math.ceil(Math.min(window.innerHeight, window.innerWidth) * .9) - 30;

        CANVAS.height = window.innerHeight;
        CANVAS.width = window.innerWidth;

        GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
        GL.uniform2fv(GL.getUniformLocation(PROGRAM, 'u_canvas_size'),
            [CANVAS.height, CANVAS.width]);
    }


    function initEventListeners() {
        window.addEventListener('resize', updateCanvasSize);
    }


    function draw(timeStamp) {
        GL.uniform1f(GL.getUniformLocation(PROGRAM, 'u_time'), timeStamp / 1000.0);

        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(draw);
    }
}) ;
