class TOSSvg {
    constructor(svgID, urls, originalLayout) {
        this.svg = SVG(svgID);
        this.urls = urls;
        this.originalLayout = originalLayout;
        //格子的寬高
        this.gridWidth = this.svg.width() / 6
        this.gridHeight = this.svg.height() / 5;

        this.stones = [...Array(6)].map(()=>Array(5));

        this.resetLayout();
        this.createLayout();
    }
    //畫版面
    createLayout() {
        if(!this.layout){
            console.error('TOSSvg.resetLayout() first');
            return;
        }
        for (var i = 0; i < this.layout.length; i++) {
            for (var j = 0; j < this.layout[i].length; j++) {
                var stone = this.svg.
                    image(this.urls[this.layout[i][j]]).
                    size(this.gridWidth, this.gridHeight).
                    move(this.gridWidth * j, this.gridHeight * i);
                stone.draggable();
                // bind
                stone.on('dragstart.namespace', (e) => this.mousedownEvent(e));
                stone.on('dragmove.namespace', (e) => this.mousemoveEvent(e));
                stone.on('dragend.namespace', (e) => this.mouseupEvent(e));
                this.stones[j][i] = stone;
            }
        }
    }
    //點下事件
    mousedownEvent(e) {
        var stone = e.detail.handler.el;
        // 移到最上面
        stone.front();
        if(typeof(stone.opacity)!= 'function'){
            console.log(stone);
        }
        stone.opacity(0.7);
        this.lastCXY = [stone.cx(), stone.cy()];
        this.dragStartPosXY = this.XYToPosXY(this.lastCXY);
        this.dragingStone = this.dragStartPosXY.reverse().reduce((parent, index)=>{
                return parent[index];
            },this.stones);
    }
    //拖曳事件
    mousemoveEvent(e) {
        var stone = e.detail.handler.el;
        //舊的中心座標
        var lastPosXY = this.XYToPosXY(this.lastCXY);
        //更新中心座標
        this.lastCXY = [stone.cx(), stone.cy()];
        //新的中心座標
        var newPosXY = this.XYToPosXY(this.lastCXY);
        $('#tmp1').text(this.lastCXY);
        //中心座標改變時
        if (!(newPosXY == '' + lastPosXY)) {
            this.dragingCenterChanged = true;
        }
        if (this.dragingCenterChanged) {
            //判斷是否合法的交換
            if (myOblique([
                stone.cx()%60 / this.gridWidth * 100,
                stone.cy()%60 / this.gridHeight * 100],
                33
            )) {
                console.log('swap');
                //被交換的
                var swapedStone = this.stones[newPosXY[0]][newPosXY[1]];
                if(!swapedStone){
                    console.log(newPosXY);
                    console.table(this.stones);
                }
                swapedStone.x(this.dragStartPosXY[1]*60);
                swapedStone.y(this.dragStartPosXY[0]*60);
                //
                this.stones[newPosXY[0]][newPosXY[1]] = this.stones[this.dragStartPosXY[1]][this.dragStartPosXY[0]];
                this.stones[this.dragStartPosXY[1]][this.dragStartPosXY[0]] = swapedStone;
                
                this.dragStartPosXY = newPosXY.reverse();
                this.dragingCenterChanged = false;
            }
        }
    }
    //放開事件
    mouseupEvent(e){
        var newXY = this.XYToPosXY([this.dragingStone.cx(),this.dragingStone.cy()]);
        console.log(newXY);
        console.log(this.dragingStone);
        this.dragingStone.x(newXY[0] * 60);
        this.dragingStone.y(newXY[1] * 60);
        this.dragingStone.opacity = 1;
        this.dragingStone = undefined;
    }
    //座標轉整數
    XYToPosXY([x, y]) {
        //檢查上下限
        x = Math.max(Math.min(x, this.svg.width() - 1), 0);
        y = Math.max(Math.min(y, this.svg.height() - 1), 0);
        return [
            parseInt(x / this.gridWidth),
            parseInt(y / this.gridHeight)
        ];
    }
    resetLayout() {
        this.layout = JSON.parse(JSON.stringify(this.originalLayout));
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