/*
~
~ 程序的启动入口
~
*/

;(async () => {
    const
    dom = await require('lib/dommer'),
    random = await require('lib/random'),
    object = await require('lib/object');

    let getTrans = i => 79 + 134 * i;
    let getX = i => i % 4;
    let getY = i => 0|(i / 4);

    let getNullTilesIndex = () => tiles_arys.map((v, i) => v ? null : i).filter(v => v !== null);
    let getI = (x, y) => tiles_arys[x + y * 4];
    let getTotal = (ary) => {
        let c = 0;
        for (let tile of ary) {
            c += tile.value;
        }
        return c;
    };
    let setInner = (elem, inner) => {
        let i = inner.toString().length;
        i = i < 4 ? 4 : i;
        elem.style.fontSize = 40 * 4 / i + "px";
        elem.innerText = inner;
    };

    let game_score = 0;
    let game_over_flag = false;
    let game_board = dom.id("game-board");
    let game_current_score = dom.id("game-current-score");
    let game_best_score = dom.id("game-best-score");
    let game_new_game_bottom = dom.id("game-new-game-button");
    let game_over_elem = dom.id("game-over-elem");
    let game_clear_elem = dom.id("game-clear-elem");
    if (localStorage.getItem("2048::Best-score")) {
        setInner(game_best_score, localStorage.getItem("2048::Best-score"));
    } else {
        localStorage.setItem("2048::Best-score", "0");
    }

    let tiles_arys = [
        null, null, null, null,
        null, null, null, null,
        null, null, null, null,
        null, null, null, null
    ];

    let Tile = object.create({
        name: "Tile",
        constructor: function (value, x, y) {
            this.value = value;
            this.elem_tile = document.createElement("div");
            this.elem_tile.classList.add("game-tile");
            this.elem_tile.classList.add("game-tile-" + value);
            this.elem_code = document.createElement("div");
            this.elem_code.classList.add("game-code");
            this.elem_code.classList.add("game-code-" + value);
            this.elem_code.innerText = value;
            this.setPosition(this, x, y);
        },
        proto: {
            setPosition: (self, x, y) => {
                self.x = x;
                self.y = y;
                self.elem_tile.style.left = getTrans(x) + "px";
                self.elem_tile.style.top = getTrans(y) + "px";
                self.elem_code.style.left = getTrans(x) + "px";
                self.elem_code.style.top = getTrans(y) + "px";
            },
            delete: (self) => {
                game_board.removeChild(self.elem_tile);
                game_board.removeChild(self.elem_code);
            }
        }
    });

    let setScore = (score) => {
        game_score = score;
        setInner(game_current_score, game_score);
        if (game_score > parseInt(localStorage.getItem("2048::Best-score"))) {
            setInner(game_best_score, game_score);
            localStorage.setItem("2048::Best-score", game_score.toString());
        }
    };

    let createRandomTile = () => {
        let nullTiles = getNullTilesIndex();
        let i = nullTiles[random.radInt(nullTiles.length)];
        let tile = new Tile((random.radInt(2) + 1) * 2, getX(i), getY(i));
        game_board.appendChild(tile.elem_tile);
        game_board.appendChild(tile.elem_code);
        tiles_arys[i] = tile;
    };

    let temp_ary = [];
    let temp_flag = false;
    let moveLeft = () => {
        buildTemp();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < temp_ary.length; j++) {
                if (getX(j) > 0 && temp_ary[j].length) {
                    if (getTotal(temp_ary[j - 1]) === 0) {
                        temp_ary[j - 1] = temp_ary[j];
                        temp_ary[j] = [];
                        temp_flag = true;
                    } else if (getTotal(temp_ary[j - 1]) === getTotal(temp_ary[j])) {
                        temp_ary[j - 1].push(...temp_ary[j]);
                        temp_ary[j] = [];
                        temp_flag = true;
                    }
                }
            }
        }
        refreshTemp();
    };
    let moveRight = () => {
        buildTemp();
        for (let i = 0; i < 3; i++) {
            for (let j = temp_ary.length - 1; j >= 0; j--) {
                if (getX(j) < 3 && temp_ary[j].length) {
                    if (getTotal(temp_ary[j + 1]) === 0) {
                        temp_ary[j + 1] = temp_ary[j];
                        temp_ary[j] = [];
                        temp_flag = true;
                    } else if (getTotal(temp_ary[j + 1]) === getTotal(temp_ary[j])) {
                        temp_ary[j + 1].push(...temp_ary[j]);
                        temp_ary[j] = [];
                        temp_flag = true;
                    }
                }
            }
        }
        refreshTemp();
    };
    let moveTop = () => {
        buildTemp();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < temp_ary.length; j++) {
                if (getY(j) > 0 && temp_ary[j].length) {
                    if (getTotal(temp_ary[j - 4]) === 0) {
                        temp_ary[j - 4] = temp_ary[j];
                        temp_ary[j] = [];
                        temp_flag = true;
                    } else if (getTotal(temp_ary[j - 4]) === getTotal(temp_ary[j])) {
                        temp_ary[j - 4].push(...temp_ary[j]);
                        temp_ary[j] = [];
                        temp_flag = true;
                    }
                }
            }
        }
        refreshTemp();
    };
    let moveBottom = () => {
        buildTemp();
        for (let i = 0; i < 3; i++) {
            for (let j = temp_ary.length - 1; j >= 0; j--) {
                if (getY(j) < 3 && temp_ary[j].length) {
                    if (getTotal(temp_ary[j + 4]) === 0) {
                        temp_ary[j + 4] = temp_ary[j];
                        temp_ary[j] = [];
                        temp_flag = true;
                    } else if (getTotal(temp_ary[j + 4]) === getTotal(temp_ary[j])) {
                        temp_ary[j + 4].push(...temp_ary[j]);
                        temp_ary[j] = [];
                        temp_flag = true;
                    }
                }
            }
        }
        refreshTemp();
    };
    let buildTemp = () => {
        for (let i = 0; i < tiles_arys.length; i++) {
            temp_ary[i] = [];
            if (tiles_arys[i]) {
                temp_ary[i].push(tiles_arys[i]);
            }
        }
        temp_flag = false;
    };
    let refreshTemp = () => {
        for (let i = 0; i < temp_ary.length; i++) {
            for (let tile of temp_ary[i]) {
                tile.setPosition(tile, getX(i), getY(i));
                tile.elem_tile.classList.add("game-tile-" + getTotal(temp_ary[i]));
                if (temp_ary[i].length > 1) {
                    setTimeout(() => {
                        tile.delete(tile);
                    }, 300);
                }
            }
            if (temp_ary[i].length > 1) {
                if (getTotal(temp_ary[i]) === 2048) {
                    dom.show(game_clear_elem);
                    game_over_flag = true;
                }
                setScore(game_score + getTotal(temp_ary[i])/2);
                let tile = new Tile(getTotal(temp_ary[i]), getX(i), getY(i));
                game_board.appendChild(tile.elem_tile);
                game_board.appendChild(tile.elem_code);
                tiles_arys[i] = tile;
            } else if (temp_ary[i].length === 1) {
                tiles_arys[i] = temp_ary[i][0];
            } else {
                tiles_arys[i] = null;
            }
        }
        temp_ary = [];
        if (temp_flag) {
            createRandomTile();
        } else {
            if (getNullTilesIndex().length === 0) {
                dom.show(game_over_elem);
                game_over_flag = true;
            }
        }
    };

    for (let i = 0; i < tiles_arys.length; i++) {
        let div = document.createElement("div");
        div.classList.add("game-tile");
        div.style.left = getTrans(getX(i)) + "px";
        div.style.top = getTrans(getY(i)) + "px";
        game_board.appendChild(div);
    }

    game_new_game_bottom.onclick = (e) => {
        location.reload();
    };

    window.addEventListener("keydown", (e) => {
        if (game_over_flag) return;
        switch (e.key) {
            case "a":
                moveLeft();
                break;
            case "d":
                moveRight();
                break;
            case "w":
                moveTop();
                break;
            case "s":
                moveBottom();
                break;
            default:
        }
    });

    let startx = null;
    let starty = null;
    window.addEventListener("touchstart", (e) => {
        startx = e.touches[0].clientX;
        starty = e.touches[0].clientY;
    });
    window.addEventListener("touchend", (e) => {
        let mx = e.changedTouches[0].clientX - startx;
        let my = e.changedTouches[0].clientY - starty;
        if (Math.abs(mx) + Math.abs(my) < 10) return;
        if (Math.abs(mx) > Math.abs(my)) {
            if (mx > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            if (my > 0) {
                moveBottom();
            } else {
                moveTop();
            }
        }
    });

    createRandomTile();

})();
