'use strict';

function Live() {}

Live.prototype = (function() {

    var jsArray = [];
    var jsIndex = 0;
    var reArray = [];
    var replied = false;
    var scripts = {};

    var mainScript = document.currentScript.getAttribute('defer-src');
    if (mainScript) {
        jsArray.push(mainScript);
        oncreate();
    } else {
        replied = true;
    }

    function oncreate() {
        if (jsIndex < jsArray.length) {
            var script = document.createElement('script');
            script.defer = true;
            script.src = jsArray[jsIndex];
            script.onload = onscript;
            document.head.appendChild(script);
        } else {
            var replies = reArray;
            reArray = [];
            replied = true;
            for (var i = 0; i < replies.length; ++i) {
                replies[i]?.();
            }
        }
    }

    function onscript() {
        var src = jsArray[jsIndex++];
        scripts[src] = this;
        scripts[src].onload = null;
        oncreate();
    }

    return Object.create(Object.prototype, {
        constructor: { value: Live },
        defineConstValue: {
            value: function(prop, value) {
                Object.defineProperty(this, prop, {
                    value: value,
                    configurable: false,
                    enumerable: false,
                    writable: false
                });
            }
        },
        defineGet: {
            value: function(prop, getter) {
                Object.defineProperty(this, prop, {
                    get: getter,
                    configurable: true,
                    enumerable: true
                });
            }
        },
        defineGetSet: {
            value: function(prop, getter, setter) {
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter,
                    configurable: true,
                    enumerable: true
                });
            }
        },
        defineValue: {
            value: function(prop, value) {
                Object.defineProperty(this, prop, {
                    value: value,
                    configurable: true,
                    enumerable: true,
                    writable: true
                });
            }
        },
        import: {
            value: function(js, reply) {
                var list = Array.isArray(js) ? js : [js];
                for (var i = 0; i < list.length; ++i) {
                    if (scripts.hasOwnProperty(list[i])) {
                        continue;
                    }
                    jsArray.push(list[i]);
                    scripts[list[i]] = false;
                }
                if (replied) {
                    replied = false;
                    reArray.push(reply?.bind(this));
                    oncreate();
                } else {
                    reArray.push(reply?.bind(this));
                }
            }
        },
        invoke: {
            value: function(prop) {
                if (this.hasOwnProperty(prop)) {
                    this[prop]();
                    return true;
                }
                return false;
            }
        },
        [Symbol.toStringTag]: { value: Live.name }
    });
})();

var live = new Live();
