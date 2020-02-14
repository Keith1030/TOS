class TOSCanvas {
    constructor(canvas, imgs, originalLayout) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.imgs = imgs;
        this.originalLayout = originalLayout;
        
        //格子的寬高
        this.gridWidth = canvas.width / 6;
        this.gridHeight = canvas.height / 5;
        //開發模式
        this.debugMode = false;
        
        //綁定事件
        canvas.addEventListener('mousedown', (e) => this.mousedownEvent(e));
        canvas.addEventListener('mousemove', (e) => this.mousemoveEvent(e));
        canvas.addEventListener('mouseup', (e) => this.mouseupEvent(e));
        
        this.resetLayout();
    }

    //刷新畫面
    refresh() {
        this.drawGrids();
        this.drawLayout();
        this.drawDragingStone();
        if (this.debugMode) {
            //測試斜轉有效區域
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            for (var i = 0; i < 60; i++) {
                for (var j = 240; j < 300; j++) {
                    if (myOblique([i / 60 * 100, j % 60 / 60 * 100], 33)) {
                        this.ctx.fillRect(i, j, 1, 1);
                    }
                }
            }
            this.ctx.restore();
        }
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
                if (this.debugMode) {
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillRect((j + 0.5) * this.gridWidth, (i + 0.5) * this.gridHeight, 5, 5);
                }
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
        if (this.debugMode) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.draging.currentXY[0] + 0.5 * this.gridWidth, this.draging.currentXY[1] + 0.5 * this.gridHeight, 5, 5);
        }
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
        //更新中心座標
        this.draging.dragingXY = [x, y];
        //新的中心座標
        var newPosXY = this.XYToPosXY(this.draging.centerXY);
        //中心座標改變時
        if (!(newPosXY == '' + lastPosXY)) {
            this.dragingCenterChanged = true;
        }
        if (this.dragingCenterChanged) {
            //判斷是否合法的交換
            if (myOblique([
                this.draging.relativelyXY[0] / this.gridWidth * 100,
                this.draging.relativelyXY[1] / this.gridHeight * 100],
                33
            )) {
                //swap

                this.swapStones(newPosXY, this.draging.lastPosXY);
                this.draging.lastPosXY = newPosXY;
                // console.log(this.draging.lastPosXY);
                this.dragingCenterChanged = false;
            }
        }

        this.refresh();
    }

    //放開事件
    mouseupEvent(e) {
        //沒有點下事件 就略過
        if (!this.draging) {
            return;
        }
        var [x, y] = this.draging.lastPosXY;
        this.layout[y][x] = this.draging.imgIndex;

        this.draging = null;
        this.refresh();
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

    //消珠
    foo() {
        this.result = [];
        var lay = this.layout;
        var eliminateArray = [];
        //2維陣列 且值為 false
        var used = [...Array(5)].map(() => Array(6).fill(false));
        var r = this.findSame(lay, used, 1, 1);
        console.log(r);
        for (var i = 0; i < r.length; i++) {
            var x = r[i][0];
            var y = r[i][1];
            this.layout[y][x] = 5;
        }
        this.refresh();
    }
    //尋找同色
    findSame(lay, used, x, y) {
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        var arr4 = [];
        if (used[x][y]) {
            return [y,x];
        }
        //向下相同的
        if (x + 1 < lay.length && lay[x][y] == lay[x + 1][y]) {
            used[y][x] = true;
            arr1 = this.findSame(lay, used, x + 1, y).concat([[y, x]]);
        }
        //向右相同的
        if (y + 1 < lay[0].length && lay[x][y] == lay[x][y + 1]) {
            used[y][x] = true;
            arr2 = this.findSame(lay, used, x, y + 1).concat([[y, x]]);
        }
        //向上相同的
        if (x - 1 >= 0 && lay[x][y] == lay[x - 1][y]) {
            used[y][x] = true;
            arr3 = this.findSame(lay, used, x - 1, y).concat([[y, x]]);
        }
        //向左相同的
        if (y - 1 >= 0 && lay[x][y] == lay[x][y - 1]) {
            used[y][x] = true;
            arr4 = this.findSame(lay, used, x, y - 1).concat([[y, x]]);
        }
        if (arr1.length || arr2.length || arr3.length || arr4.length) {
            return arr1.concat(arr2).concat(arr3).concat(arr4);
        }
        else {
            used[y][x] = true;
            return [[y, x]];
        }
    }
    resetLayout() {
        this.layout = JSON.parse(JSON.stringify(this.originalLayout));
        this.refresh();
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