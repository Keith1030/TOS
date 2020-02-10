class TOSCanvas {
    constructor(canvas, imgs, layout) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imgs = imgs;
        this.layout = layout;
        //格子的寬高
        this.gridWidth = canvas.width / 6;
        this.gridHeight = canvas.height / 5;

        //綁定事件
        canvas.addEventListener('mousedown', (e) => this.mousedownEvent(e));
        canvas.addEventListener('mousemove', (e) => this.mousemoveEvent(e));
        canvas.addEventListener('mouseup', (e) => this.mouseupEvent(e));

        this.refresh();
    }

    //刷新畫面
    refresh() {
        this.drawGrids();
        //測試斜轉有效區域
        for (var i = 0; i < 60; i++) {
            for (var j = 240; j < 300; j++) {
                if (myOblique([i/60*100,j%60/60*100],33)) {
                    this.ctx.fillRect(i, j, 1, 1);
                }
            }
        }
        this.drawLayout();
        this.drawDragingStone();
    }

    //畫格子
    drawGrids() {
        this.ctx.save();
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 5; j++) {
                //偶數格的格子
                if ((i + j) % 2) {
                    this.ctx.drawImage(this.imgs[7], i * this.gridWidth, j * this.gridHeight, this.gridWidth, this.gridHeight);
                }
                //偶數格的格子
                else {
                    this.ctx.drawImage(this.imgs[6], i * this.gridWidth, j * this.gridHeight, this.gridWidth, this.gridHeight);
                }
            }
        }
        this.ctx.restore();
    }

    //畫版面
    drawLayout() {
        this.ctx.save();
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                var stoneType = this.layout[i][j];
                if (!this.imgs[stoneType]) {
                    continue;
                }
                this.ctx.drawImage(this.imgs[stoneType], j * this.gridWidth, i * this.gridHeight, this.gridWidth, this.gridHeight);
            }
        }
        this.ctx.restore();
    }

    //畫被抓住的符石
    drawDragingStone() {
        //抓到空的
        if (!this.draging) {
            return;
        }
        this.ctx.save();
        this.ctx.globalAlpha = 0.7;
        this.ctx.drawImage(
            this.imgs[this.draging.imgIndex],
            ...this.draging.currentXY,
            this.gridWidth,
            this.gridHeight
        );
        this.ctx.restore();
    }

    //點下事件
    mousedownEvent(e) {
        var [x, y] = [e.offsetX, e.offsetY];
        var [posX, posY] = this.XYToPosXY([x, y]);
        var dragedType = this.layout[posY][posX];
        //抓到空的就略過
        if (dragedType == -1) {
            return;
        }

        var dX = x % this.gridWidth;
        var dY = y % this.gridHeight;
        this.draging = new DragingData(
            dragedType,
            [posX, posY],
            [x, y],
            [dX, dY],
            [this.gridWidth, this.gridHeight],
        )
        this.layout[posY][posX] = -1;
        this.refresh();
    }
    //拖曳事件
    mousemoveEvent(e) {
        //沒有點下事件 就略過
        if (!this.draging) {
            return;
        }
        var [x, y] = [e.offsetX, e.offsetY];

        //舊的中心座標
        var lastPosXY = this.XYToPosXY(this.draging.centerXY);
        this.draging.dragingXY = [x, y];
        //新的中心座標
        var newPosXY = this.XYToPosXY(this.draging.centerXY);
        //中心座標改變時
        if (!(newPosXY == '' + lastPosXY)) {
            //判斷是否合法的交換
            // if(this.isLegalSwap(this.draging.relativelyXY)){
            //     //swap
            //     this.swapStones(newPosXY, lastPosXY);
            // }
        }

        this.refresh();
    }

    //放開事件
    mouseupEvent(e) {
        //沒有點下事件 就略過
        if (!this.draging) {
            return;
        }
        var [x, y] = this.XYToPosXY(this.draging.centerXY);
        this.layout[y][x] = this.draging.imgIndex;

        this.draging = null;
        this.refresh();
    }

    //判斷是否合法的交換 (斜轉不合法, 所以不用交換)
    isLegalSwap([x, y]) {
        if (false) {
            return true;
        } else {

            return true;
        }
    }

    //交換符石
    swapStones(a, b) {
        [this.layout[a[1]][a[0]], this.layout[b[1]][b[0]]] = [this.layout[b[1]][b[0]], this.layout[a[1]][a[0]]];
    }

    //座標轉整數
    XYToPosXY([x, y]) {
        //檢查上下限
        x = Math.max(Math.min(x, this.canvas.width - 1), 0);
        y = Math.max(Math.min(y, this.canvas.height - 1), 0);
        return [
            parseInt(x / this.gridWidth),
            parseInt(y / this.gridHeight)
        ];
    }
}

class DragingData {
    //(樣式,現在拖曳的XY,修正XY,格子大小)
    constructor(imgIndex, lastPosXY, dragingXY, dXY, gridSize) {
        this.imgIndex = imgIndex;
        this.dragingXY = dragingXY;
        this.lastPosXY = lastPosXY;
        //紀錄以符石為基準 dragingXY的座標和符石左上角的差
        this.dXY = dXY;
        this.gridSize = gridSize;
    }
    //符石的左上角座標
    get currentXY() {
        return [
            this.dragingXY[0] - this.dXY[0],
            this.dragingXY[1] - this.dXY[1]
        ];
    }
    //符石的中心座標
    get centerXY() {
        return [
            this.currentXY[0] + this.gridSize[0] / 2,
            this.currentXY[1] + this.gridSize[1] / 2,
        ];
    }
    //在符石內的座標
    get relativelyXY() {
        return [
            this.centerXY[0] % this.gridSize[0],
            this.centerXY[1] % this.gridSize[1],
        ];
    }
}
// 33
var myOblique = ([x, y], sensitive) => {
    if (x + y < sensitive) {//左上
        return false;
    } else if (x + y > 200 - sensitive) {//右下
        return false;
    } else if (x - y > 100 - sensitive) {//右上
        return false;
    } else if (y - x > 100 - sensitive) {//左下
        return false;
    }
    return true;
}