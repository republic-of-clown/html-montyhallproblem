'use strict';

var montyhall = (function() {

    var a = document.getElementById('a');
    var b = document.getElementById('b');
    var c = document.getElementById('c');
    var gameCheck = document.getElementById('check');
    var gameStart = document.getElementById('start');
    var keep = document.getElementById('keep');
    var keepHitN = document.getElementById('keepHitN');
    var keepHitP = document.getElementById('keepHitP');
    var keepMiss = document.getElementById('keepMiss');
    var swap = document.getElementById('swap');
    var swapHitN = document.getElementById('swapHitN');
    var swapHitP = document.getElementById('swapHitP');
    var swapMiss = document.getElementById('swapMiss');

    var activeABC = false;
    var cachedABC = false;
    var config = { checkColor: 'white', choseColor: 'white', cleanColor: 'white', colorKey: 'border-color' };
    var keepLose = 0;
    var keepWin = 0;
    var swapLose = 0;
    var swapWin = 0;

    a.onclick = function() {
        if (activeABC) {
            cachedABC = a;
            enable(check, true);
            a.style[config.colorKey] = config.checkColor;
            b.style[config.colorKey] = config.cleanColor;
            c.style[config.colorKey] = config.cleanColor;
        }
    };

    b.onclick = function() {
        if (activeABC) {
            cachedABC = b;
            enable(check, true);
            a.style[config.colorKey] = config.cleanColor;
            b.style[config.colorKey] = config.checkColor;
            c.style[config.colorKey] = config.cleanColor;
        }
    };

    c.onclick = function() {
        if (activeABC) {
            cachedABC = c;
            enable(check, true);
            a.style[config.colorKey] = config.cleanColor;
            b.style[config.colorKey] = config.cleanColor;
            c.style[config.colorKey] = config.checkColor;
        }
    };

    gameCheck.onclick = function() {
        if (cachedABC) {
            switch (cachedABC) {
                case a:
                    (Math.random() < 0.5 ? b : c).className = 'display';
                    break;
                case b:
                    c.className = 'display';
                    break;
                case c:
                    b.className = 'display';
                    break;
            }
            activeABC = false;
            enable(gameCheck, false);
            enable(keep, true);
            enable(swap, true);
        }
    };

    gameStart.onclick = function() {
        a.className = 'exit';
        b.className = 'exit';
        c.className = 'exit';
        a.style[config.colorKey] = config.cleanColor;
        b.style[config.colorKey] = config.cleanColor;
        c.style[config.colorKey] = config.cleanColor;
        var num = Math.random() * 3;
        var abc = num < 1 ? [a, b, c] : (num < 2 ? [c, a, b] : [b, c, a]);
        for (var i = 0; i < 3; ++i) {
            abc[i].style['order'] = i;
        }
        activeABC = true;
        cachedABC = false;
        enable(gameCheck, false);
        enable(keep, false);
        enable(swap, false);
    };

    keep.onclick = function() {
        if (cachedABC !== a) {
            if (b.className === 'exit') {
                b.className = 'display';
                b.style[config.colorKey] = config.choseColor;
            } else {
                c.className = 'display';
                c.style[config.colorKey] = config.choseColor;
            }
            ++keepLose;
        } else {
            a.className = 'display';
            a.style[config.colorKey] = config.choseColor;
            ++keepWin;
        }
        keepHitN.innerText = keepWin;
        keepHitP.innerText = (keepWin * 100 / (keepLose + keepWin)).toFixed(0);
        keepMiss.innerText = keepLose;
        enable(keep, false);
        enable(swap, false);
    };

    swap.onclick = function() {
        if (cachedABC === a) {
            if (b.className === 'exit') {
                b.className = 'display';
                b.style[config.colorKey] = config.choseColor;
            } else {
                c.className = 'display';
                c.style[config.colorKey] = config.choseColor;
            }
            ++swapLose;
        } else {
            a.className = 'display';
            a.style[config.colorKey] = config.choseColor;
            ++swapWin;
        }
        swapHitN.innerText = swapWin;
        swapHitP.innerText = (swapWin * 100 / (swapLose + swapWin)).toFixed(0);
        swapMiss.innerText = swapLose;
        enable(keep, false);
        enable(swap, false);
    };

    function enable(button, value) {
        if (value) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', 'disabled');
        }
    }

    return {
        config: config,
        init: function() { enable(gameStart, true); }
    };
})();
