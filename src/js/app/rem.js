// (function (doc, win) {
//     var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样

//     var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//     var reCalc = (function () {
//         var reCalc = function () {
//             var docEl = doc.documentElement;
//             var winWidth = docEl.clientWidth;
//             if (!winWidth) return;
//             var fontSize;
//             // if (winWidth > 768) { // PC
//             //     fontSize = rootValue * winWidth / 1920;
//             // } else { // mobile
//             //     fontSize = rootValue * winWidth / 750;
//             // }
//             fontSize = rootValue * winWidth / 750;
//             docEl.style.fontSize = fontSize + 'px';
//             return reCalc;
//         };
//         return reCalc();
//     })();

//     reCalc();
//     setTimeout(function () {
//         reCalc();
//     }, 300);
//     win.addEventListener('load', reCalc, false);
//     win.addEventListener(rszEvt, reCalc, false);
//     if (!doc.addEventListener) return;
//     doc.addEventListener('DOMContentLoaded', reCalc, false);
// })(document, window);

// (function (doc, win) {
//     var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样

//     var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//     var reCalc = (function () {
//         var reCalc = function () {
//             var docEl = doc.documentElement;
//             var winWidth = docEl.clientWidth;
//             var winHeight = docEl.clientHeight;
//             if (!winWidth) return;
//             var fontSize;
//             // console.log('高', winHeight);
//             if (winWidth > winHeight) {
//                 if (winWidth >= 1024) { // PC
//                     fontSize = rootValue * winWidth / 1920;
//                 } else if (winWidth / winHeight > 1.5) {
//                     docEl.classList.add('landscape');
//                 } else {
//                     docEl.classList.remove('landscape');
//                 }
//             } else {
//                 if (winWidth >= 768) { // PC
//                     fontSize = rootValue * winWidth / 1080;
//                 } else { // mobile
//                     fontSize = rootValue * winWidth / 750;
//                 }
//                 docEl.classList.remove('landscape');
//                 // fontSize = rootValue * winWidth / 750;
//             }
//             // if (winWidth >= 1024) { // PC
//             //     fontSize = rootValue * winWidth / 1080;
//             // } else { // mobile
//             //     fontSize = rootValue * winWidth / 750;
//             // }
//             // fontSize = rootValue * winWidth / 750;
//             docEl.style.fontSize = fontSize + 'px';
//             return reCalc;
//         };
//         return reCalc();
//     })();

//     reCalc();
//     setTimeout(function () {
//         reCalc();
//     }, 300);
//     win.addEventListener('load', reCalc, false);
//     win.addEventListener(rszEvt, reCalc, false);
//     if (!doc.addEventListener) return;
//     doc.addEventListener('DOMContentLoaded', reCalc, false);
// })(document, window);

// (function (doc, win) {
//     var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样

//     var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//     var reCalc = (function () {
//         var reCalc = function () {
//             var docEl = doc.documentElement;
//             var winWidth = docEl.clientWidth;
//             var winHeight = docEl.clientHeight;
//             if (!winWidth) return;
//             var fontSize;
//             // console.log('高', winHeight);
//             console.log(winWidth / winHeight);
//             if (winWidth > winHeight) {
//                 if (winWidth / winHeight < 1.75) { // PC
//                     fontSize = rootValue * winWidth / 1920;
//                     docEl.classList.add('pad_landscape');
//                     docEl.classList.remove('landscape');
//                 } else if (winWidth / winHeight > 1.7) {
//                     docEl.classList.add('landscape');
//                     fontSize = rootValue * winWidth / 1600;
//                     docEl.classList.remove('pad_landscape');
//                 } else {
//                     docEl.classList.remove('landscape');
//                     docEl.classList.remove('pad_landscape');
//                 }
//             } else {
//                 if (winWidth >= 768) { // PC
//                     fontSize = rootValue * winWidth / 750;
//                     // fontSize = rootValue * winWidth / 1080;
//                 } else { // mobile
//                     fontSize = rootValue * winWidth / 750;
//                 }
//                 docEl.classList.remove('landscape');
//                 docEl.classList.remove('pad_landscape');
//                 // fontSize = rootValue * winWidth / 750;
//             }
//             // if (winWidth >= 1024) { // PC
//             //     fontSize = rootValue * winWidth / 1080;
//             // } else { // mobile
//             //     fontSize = rootValue * winWidth / 750;
//             // }
//             // fontSize = rootValue * winWidth / 750;
//             docEl.style.fontSize = fontSize + 'px';
//             return reCalc;
//         };
//         return reCalc();
//     })();

//     reCalc();
//     setTimeout(function () {
//         reCalc();
//     }, 300);
//     win.addEventListener('load', reCalc, false);
//     win.addEventListener(rszEvt, reCalc, false);
//     if (!doc.addEventListener) return;
//     doc.addEventListener('DOMContentLoaded', reCalc, false);
// })(document, window);

// 判断是常规尺寸手机横屏还是宽屏或折叠屏横屏
function isLandscapeType () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // const userAgent = navigator.userAgent.toLowerCase();

    // 确保是横屏状态
    if (width <= height) {
        return null; // 非横屏状态
    }

    // 常规手机横屏：宽度小于768px且是移动设备
    const isRegularPhoneLandscape = width / height > 1.5;

    // 宽屏或折叠屏横屏：宽度大于等于768px
    const isWideOrFoldableLandscape = width / height <= 1.5;

    if (isRegularPhoneLandscape) {
        return 'landscape'; // 常规尺寸手机横屏
    } else if (isWideOrFoldableLandscape) {
        return 'pad_landscape'; // 宽屏或折叠屏横屏
    }

    return null;
}

// 使用示例
// const landscapeType = isLandscapeType();
// console.log('横屏类型:', landscapeType);

(function (doc, win) {
    var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var reCalc = (function () {
        var reCalc = function () {
            var docEl = doc.documentElement;
            var winWidth = docEl.clientWidth;
            var winHeight = docEl.clientHeight;
            if (!winWidth) return;
            var fontSize;
            // console.log('高', winHeight);
            console.log(winWidth / winHeight);
            if (winWidth > winHeight) {
                // if (winWidth > 768 && winWidth / winHeight < 2) {
                if (winWidth / winHeight < 2) {
                    fontSize = rootValue * winWidth / 1920;
                    // docEl.classList.add('pad_landscape');
                    // docEl.classList.remove('landscape');
                } else if (winWidth / winHeight > 2) {
                    // docEl.classList.add('landscape');
                    fontSize = rootValue * winWidth / 1920;
                    // docEl.classList.remove('pad_landscape');
                } else if (winWidth / winHeight > 1.7 && winWidth < 768) {
                    // docEl.classList.add('landscape');
                    fontSize = rootValue * winWidth / 1600;
                    // docEl.classList.remove('pad_landscape');
                } else {
                    // docEl.classList.remove('landscape');
                    // docEl.classList.remove('pad_landscape');
                }
                docEl.classList = isLandscapeType();
            } else {
                if (winWidth >= 768) { // PC
                    fontSize = rootValue * winWidth / 750;
                    // fontSize = rootValue * winWidth / 1080;
                } else if (winWidth / winHeight > 0.6) {
                    fontSize = rootValue * winWidth / 750;
                } else { // mobile
                    fontSize = rootValue * winWidth / 750;
                    // fontSize = rootValue * winWidth / 1080;
                }
                docEl.classList.remove('landscape');
                docEl.classList.remove('pad_landscape');
                // fontSize = rootValue * winWidth / 750;
            }
            // if (winWidth >= 1024) { // PC
            //     fontSize = rootValue * winWidth / 1080;
            // } else { // mobile
            //     fontSize = rootValue * winWidth / 750;
            // }
            // fontSize = rootValue * winWidth / 750;
            // docEl.style.fontSize = fontSize > 100 ? 100 + 'px' : fontSize + 'px';
            docEl.style.fontSize = fontSize + 'px';
            window.fontSize = fontSize;
            console.log('fontSize', fontSize);
            // const landscapeType = isLandscapeType();
            // console.log('横屏类型:', landscapeType);
            return reCalc;
        };
        return reCalc();
    })();

    reCalc();
    setTimeout(function () {
        reCalc();
    }, 300);
    win.addEventListener('load', reCalc, false);
    win.addEventListener(rszEvt, reCalc, false);
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document, window);
