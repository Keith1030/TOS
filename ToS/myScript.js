$(function () {
    console.log("Last refresh at ", new Date());

    var urls = [
        'pic/water.png',
        'pic/fire.png',
        'pic/wood.png',
        'pic/light.png',
        'pic/dark.png',
        'pic/heart.png',
        'pic/bg1.png',
        'pic/bg2.png',
    ];
    var layout = [
        // [0, 1, 2, 3, 4, 5],
        // [5, 3, -1, -1, -1, -1],
        // [-1, -1, -1, -1, -1, -1],
        // [0, -1, -1, -1, -1, -1],
        // [5, -1, -1, -1, -1, -1],
        
        // [0, 1, 2, 3, 4, 5],
        // [0, 1, 2, 3, 4, 5],
        // [0, 1, 2, 3, 4, 5],
        // [0, 1, 2, 3, 4, 5],
        // [0, 1, 2, 3, 4, 5],

        // [0, 0, 0, 0, 0, 0],
        // [1, 1, 1, 1, 1, 1],
        // [2, 2, 2, 2, 2, 2],
        // [3, 3, 3, 3, 3, 3],
        // [4, 4, 4, 4, 4, 4],

        [0, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1, 1],
        [0, 0, 0, 2, 2, 2],
        [3, 2, 2, 3, 3, 3],
        [1, 4, 4, 4, 4, 4],
    ];

    //svg
    var svgID = "#mySvg";
    
    //canvas
    var canvas = document.getElementById('myCanvas');
    if (!canvas.getContext) {
        console.log('canvas is not supported');
    };
    //svg
    var tosSvg = new TOSSvg(svgID, urls, layout);
    loadImages(urls, (imgs)=>{
        //canvas
        var tosCanvas = new TOSCanvas(canvas, imgs, layout);
        $("#btn1").on('click',()=>{
            // tosCanvas.foo();
        });
        $("#btn2").on('click',()=>{
            tosCanvas.resetLayout();
        });
    });
});

//載入多圖
var loadImages = (urls, callback) => {
    var promiseList = [];
    for (var i = 0; i < urls.length; i++) {
        var promise = loadImage(urls[i]);
        promiseList.push(promise);
    }
    Promise.all(promiseList).then(callback);
}

//載入單圖
var loadImage = (url) => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        }
        img.src = url;
    });
};