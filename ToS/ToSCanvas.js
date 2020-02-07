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
        this.drawLayout();
        this.drawDragingStone();
    }

    //畫格子
    drawGrids() {
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
    }

    //畫版面
    drawLayout() {
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                var stoneType = this.layout[i][j];
                if (!this.imgs[stoneType]) {
                    continue;
                }
                this.ctx.drawImage(this.imgs[stoneType], j * this.gridWidth, i * this.gridHeight, this.gridWidth, this.gridHeight);
            }
        }
    }

    //畫被抓住的符石
    drawDragingStone() {
        //抓到空的
        if (!this.draging) {
            return;
        }
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
            this.imgs[this.draging.imgIndex],
            ...this.draging.drawXY,
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
        this.draging = new Draging(
            dragedType,
            [x, y],
            [x, y],
            [dX, dY]
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
        var [posX, posY] = this.XYToPosXY([x, y]);
        if(false){
            
            // //新的中心座標
            // var [newPosX, newPosY] = this.XYToPosXY(
            //     newX, 
            //     newY
            // );
            // //舊的中心座標
            // var [currentPosX, currentPosY] = this.XYToPosXY(
            //     this.draging.currentPosX,
            //     this.draging.currentPosY
            // )
            // //中心座標改變時
            // if (!(newPosX == currentPosX && newPosY == currentPosY)) {
            //     //swap
            //     console.log(currentPosX, newPosX, currentPosY, newPosY);
            // }
        }
        this.draging.currentXY = [x,y];

        this.refresh();
    }

    //放開事件
    mouseupEvent(e) {
        //沒有點下事件 就略過
        if (!this.draging) {
            return;
        }
        var [x, y] = this.XYToPosXY([e.offsetX, e.offsetY]);
        this.layout[y][x] = this.draging.imgIndex;

        this.draging = null;
        this.refresh();
    }

    //判斷是否經過小格子的角落(斜轉)
    isCornerPassed() {
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

    //座標轉整數
    XYToPosXY([x, y]) {
        return [
            parseInt(x / this.gridWidth),
            parseInt(y / this.gridHeight)
        ];
    }
}

class Draging {
    //(樣式,開始XY,現在XY,修正X,修正Y)
    constructor(imgIndex, [startX, startY], currentXY, dXY) {
        this.imgIndex = imgIndex;
        // this.startX = startX;
        // this.startY = startY;
        this.currentXY = currentXY;
        //紀錄以符石為基準 點的座標和符石左上角的差
        this.dXY = dXY;
    }
    get drawXY(){
        return [
            this.currentXY[0] - this.dXY[0],
            this.currentXY[1] - this.dXY[1]
        ]
    }
}