class TosCanvas {
    constructor(canvas, imgs, layout) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imgs = imgs;
        this.layout = layout;
        //格子間的距離
        this.dx = canvas.width / 6;
        this.dy = canvas.height / 5;

        canvas.addEventListener('mousedown', (e) => this.mousedownEvent(e));
        canvas.addEventListener('mousemove', (e) => this.mousemoveEvent(e));
        canvas.addEventListener('mouseup', (e) => this.mouseupEvent(e));

        this.drawBackground();
        this.drawLayout();
    }

    //畫背景
    drawBackground() {
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

    //畫版面
    drawLayout() {
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
    
    //畫被抓住的符石
    drawDragingStone(){
        //抓空的(-1)跳過
        if(this.dragedType == -1){
            return;
        }
        this.drawBackground();
        this.drawLayout();
        this.ctx.save();
        this.ctx.globalAlpha=0.5;
        this.ctx.drawImage(this.imgs[this.dragedType], this.dragingX, this.dragingY, this.dx, this.dy);
        this.ctx.restore();
    }

    //點下事件
    mousedownEvent(e) {
        // var pos = {
        //     x: parseInt(e.offsetX / this.dx),
        //     y: parseInt(e.offsetY / this.dy)
        // };
        var x = parseInt(e.offsetX / this.dx);
        var y = parseInt(e.offsetY / this.dy);
        //紀錄以符石為基準 點的座標和符石左上角的差
        this.dragedDx = e.offsetX % this.dx;
        this.dragedDy = e.offsetY % this.dy;

        this.dragedType = this.layout[y][x];
        this.layout[y][x] = -1;
        this.isDraged = true;
    }
    //拖曳事件
    mousemoveEvent(e){
        //沒有點下事件 就略過
        if (!this.isDraged) {
            return;
        }
        this.dragingX = e.offsetX - this.dragedDx;
        this.dragingY = e.offsetY - this.dragedDy;

        this.drawDragingStone();
        // console.log('moved');
    }

    //放開事件
    mouseupEvent(e) {
        //沒有點下事件 就略過
        if (!this.isDraged) {
            return;
        }
        // var pos = {
        //     x: parseInt(e.offsetX / this.dx),
        //     y: parseInt(e.offsetY / this.dy)
        // };
        var x = parseInt(e.offsetX / this.dx);
        var y = parseInt(e.offsetY / this.dy);

        // this.swapStones({ x: this.dragingX, y: this.dragingY }, { x: x, y: y })
        this.layout[y][x] = this.dragedType;

        this.drawBackground();
        this.drawLayout();
        this.isDraged = false;
    }

    //判斷是否經過小格子的角落(斜轉)
    isCornerPassed(){
        // to do
        return false;
    }

    //交換符石
    swapStones(from, to) {
        // var tmp = this.layout[from.y][from.x];
        // this.layout[from.y][from.x] = this.layout[to.y][to.x];
        // this.layout[to.y][to.x] = tmp;

        [this.layout[from.y][from.x], this.layout[to.y][to.x]] = [this.layout[to.y][to.x], this.layout[from.y][from.x]];
        // console.table(this.layout);
    }
}