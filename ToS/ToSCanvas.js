class TosCanvas {
    constructor(canvas, imgs, layout) {
        // this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imgs = imgs;
        this.layout = layout;
        //格子間距離
        this.dx = canvas.width / 6;
        this.dy = canvas.height / 5;

        canvas.addEventListener('mousedown', (e) => this.mousedownEvent(e));
        canvas.addEventListener('mouseup', (e) => this.mouseupEvent(e));

        this.drawBackground();
        this.drawStones();
    }

    //畫背景
    drawBackground() {
        // console.log('畫背景');
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                //偶數格的背景
                if ((i + j) % 2) {
                    this.ctx.drawImage(this.imgs[7], i * this.dx, j * this.dy, this.dx, this.dy);
                }
                //偶數格的背景
                else {
                    this.ctx.drawImage(this.imgs[6], i * this.dx, j * this.dy, this.dx, this.dy);
                }
            }
        }
    }

    //畫符石
    drawStones() {
        // console.log('畫符石');
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                var stoneType = this.layout[i][j];
                if (!this.imgs[stoneType]) {
                    continue;
                }
                this.ctx.drawImage(this.imgs[stoneType], j * this.dx, i * this.dy, this.dx, this.dy);
            }
        }
    }

    //點下事件
    mousedownEvent(e) {
        // var pos = {
        //     x: parseInt(e.offsetX / this.dx),
        //     y: parseInt(e.offsetY / this.dy)
        // };
        this.dragingX = parseInt(e.offsetX / this.dx);
        this.dragingY = parseInt(e.offsetY / this.dy);
        this.draged = true;
    }

    //放開事件
    mouseupEvent(e) {
        //只有放開事件 沒有點下事件
        if (!this.draged) {
            return;
        }
        // var pos = {
        //     x: parseInt(e.offsetX / this.dx),
        //     y: parseInt(e.offsetY / this.dy)
        // };
        var x = parseInt(e.offsetX / this.dx);
        var y = parseInt(e.offsetY / this.dy);
        // console.log(`mouseup at ${x},${y}`);

        this.swapStones({ x: this.dragingX, y: this.dragingY }, { x: x, y: y })

        this.drawBackground();
        this.drawStones();
        this.draged = false;
    }

    //

    //交換符石
    swapStones(from, to) {
        // var tmp = this.layout[from.y][from.x];
        // this.layout[from.y][from.x] = this.layout[to.y][to.x];
        // this.layout[to.y][to.x] = tmp;

        [this.layout[from.y][from.x], this.layout[to.y][to.x]] = [this.layout[to.y][to.x], this.layout[from.y][from.x]];
        // console.table(this.layout);
    }
}