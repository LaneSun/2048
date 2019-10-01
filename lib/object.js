/*
~
~ 可拓展对象支持库
~ 有点大，我都快看不懂了。。。想了解的可以看我博客的aLib.js的codeunit.object
~ 好吧，博客也可以不用看，已经是好几个版本之前的API了。。。
~
*/

;moudle = function (object) {
    object.create = (sets) => {
        let obj = null;
        if (!sets.extend) {
            sets.extend = object.EmptyObject;
        }
        switch (sets.method) {
            case object.METHOD_NEW:
                if (sets.new_arg) {
                    obj = new sets.extend(...sets.new_arg);
                } else {
                    obj = new sets.extend();
                }
                break;
            case object.METHOD_CLASS:
                obj = class Obj extends sets.extend {
                    constructor(...arg) {
                        super();
                        this.trueConstructor.call(this, ...arg);
                    }
                };
                break;
            case object.METHOD_CREATE:
            case object.METHOD_MERGE:
            default:
                obj = sets.constructor;
                Object.assign(obj.prototype, sets.extend.prototype);
                break;
        }
        obj.prototype.nameList = new Set([sets.name]);
        if (sets.extends) {
            sets.extends.forEach((t) => {
                Object.assign(obj.prototype, t.prototype);
            });
        }
        if (sets.proto) {
            Object.assign(obj.prototype, sets.proto);
        }
        if (sets.static) {
            Object.assign(obj, sets.static);
        }
        obj.prototype.name = sets.name;
        for (let name of sets.extend.prototype.nameList) {
            obj.prototype.nameList.add(name);
        }
        if (sets.method !== object.METHOD_CLASS) {
            obj.prototype.constructor = sets.constructor;
        } else {
            obj.prototype.trueConstructor = sets.constructor;
        }
        return obj;
    };

    object.METHOD_MERGE = 0;
    object.METHOD_NEW = 1;
    object.METHOD_CLASS = 2;
    object.METHOD_CREATE = 3;
    
    object.createFromFunction = (builder) => {
        let data = new builder();
        return object.create(data);
    };
    object.EmptyObject = {};
    object.EmptyObject.prototype = {
        name: "EmptyObject",
        nameList: new Set(["EmptyObject"])
    }
};
