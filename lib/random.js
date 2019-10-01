/*
~
~ 用来生成随机ID，判断重复还是需要考虑的
~
*/

;moudle = function (random) {
    random.uuid = () => {
        return parseInt(Math.random().toString().substr(2)).toString(36);
    }
    random.duuid = () => {
        return random.uuid() + random.uuid();
    }
    random.radInt = (n) => Math.floor(Math.random() * n);
};
