/*
~
~          Keep Simple.
~   A Moudle Core by Lane Sun :)
~
*/
window.Lcore = {};

(function (core) {
    try {
        core.Moudles = new Map([["core", core]]);
        let promises = new Map();
        window.require = core.require = async (name) => {
            if (core.Moudles.has(name)) {
                return core.Moudles.get(name);
            } else if (promises.has(name)) {
                return await promises.get(name);
            } else {
                return await core.init(name);
            }
        };
        window.init = core.init = (name) => {
            let promise = new Promise(resolve => {
                let elem = document.createElement('script');
                elem.type = "text/javascript";
                elem.onload = async () => {
                    let mod = {};
                    let moudle = window.moudle;
                    window.moudle = null;
                    await moudle(mod);
                    core.Moudles.set(name, mod);
                    promises.delete(name);
                    resolve(mod);
                };
                elem.src = name + ".js";
                document.body.appendChild(elem);
            });
            promises.set(name, promise);
            return promise;
        };
        window.moudle = null;
    } catch (e) {
        console.error("[CORE]core init error\n" + e.toString());
    }
})(window.Lcore);
