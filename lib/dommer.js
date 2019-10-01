/*
~
~ 用来操作DOM元素的库
~ 了解更多请看看我博客aLib.js的elemunit
~
*/

;moudle = function (dom) {
    dom.hide = (elem) => {
        elem.hidden = true;
    };
    dom.show = (elem) => {
        elem.hidden = false;
    };
    dom.id = (id) => {
        return document.getElementById(id);
    };
    dom.class = (name) => {
        return document.getElementsByClassName(name);
    };
    dom.forEachClass = (name, handle) => {
        for (let elem of document.getElementsByClassName(name)) {
            handle(elem);
        };
    };
    dom.true = (elem) => {
        return window.getComputedStyle(elem);
    };
    dom.set = (elem, html) => {
        elem.innerHTML = html;
    };
    dom.add = (elem, html) => {
        elem.innerHTML += html;
    };
    dom.addl = (elem, html) => {
        dom.add(elem, html + "<br>");
    };
    dom.clear = (elem) => {
        dom.set(elem, "");
    };
    dom.title = (name) => {
        document.title = name;
    };
    dom.width = () => {
        return window.innerWidth;
    };
    dom.height = () => {
        return window.innerHeight;
    };
};
