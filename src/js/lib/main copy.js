/* eslint-disable */

var getQuery = function (name) {
    var m = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
    return !m ? '' : decodeURIComponent(m[2]);
};

function debounce(callback, delay) {
    let timerId;
   
    return function(...args) {
      clearTimeout(timerId);
   
      timerId = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }

function copyToClipboard (text) {
    var textarea = document.createElement("textarea"); //创建临时的文本区域元素
    textarea.value = text; //将要复制的内容赋值给文本区域
    document.body.appendChild(textarea); //添加到页面中
    textarea.select(); //选中文本区域的内容
    try {
        var successful = document.execCommand('copy'); //执行复制命令
        var msg = successful ? '成功' : '失败';
        console.log('已经'+msg+'复制到剪贴板！');
    } catch (err) {
        console.error('无法复制到剪贴板', err);
    } finally {
        document.body.removeChild(textarea); //移除临时的文本区域元素
    }
}

var browser = {
    versions: (function () {
        var u = navigator.userAgent;
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 移动终端
            Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1, // 平板
            ios: u.indexOf('like Mac OS X') > -1, // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
            Safari: u.indexOf('Safari') > -1,
            Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
            IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
            Edge: u.indexOf('Edge') > -1,
            QQBrowser: u.indexOf('QQBrowser') > -1,
            QQ: u.indexOf('QQ/') > -1,
            Wechat: u.indexOf('MicroMessenger') > -1,
            Weibo: u.indexOf('Weibo') > -1,
            360: u.indexOf('QihooBrowser') > -1,
            UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
            Taobao: u.indexOf('AliApp(TB') > -1,
            Alipay: u.indexOf('AliApp(AP') > -1,
            isMac: /macintosh|mac os x/i.test(navigator.userAgent),
            isSafari: /Safari/.test(u) && !/Chrome/.test(u)
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};



/**变量 */
const navCtn = $('.left-nav-ctn');
let pageSwiper = null;
let part3ListTop = true;
let part3ListBot = false;
let movePart3List = false;
let currScrollIndex = 0;
let footShow = false;

const warLvText = [
    'A','B','C','D','E'
]


// 全面战场新全局变量
window.viewChange = true; // 进攻方视角

window.occupy = false; // 占领模式

window.warLv = 0; // 阶段

window.isLvChange = false;

window.warSwiper = null; // 部署swiper

window.pervInitX = '' // 上一次位移

// 导航相关
var navTypyList = $('.nav-type-list')
var regionList = $('.region-list')
var floorList = $('.floor-list')
var currLeftNav = 0;

// 地图相关
var visibleMarker = {};
var listIsAll = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
}
var visibleMarker2 = {
    0: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    1: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    2: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    3: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    4: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    5: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    6: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    7: {
        isAll: false,
        isInit: false,
        markers: {}
    },
    8: {
        isAll: false,
        isInit: false,
        markers: {}
    }
};
var hoverMarker = {};
var clickMarker = {}
var ciLayer = null;
var typeListInit = false;
function Page() {
    var _this = this;
    _this.$page = $('.m-index')

    // _this.$page.css('height', window.innerHeight)
    _this.init = function () {
        console.log(11111);
        if (!browser.versions.mobile) {
           
            _this.resizeDom();
            if (window.innerWidth / window.innerHeight > 1920 / 1080) {
                $('.select_map_video').css({ 'width': '100%', 'height': 'auto'})
            } else {
                $('.select_map_video').css({ 'width': 'auto', 'height': '100%'})
            }
        }
       
        console.log('init');
        _this.isInit = true;
    }
    _this.sizeList = { 'ar' : true, 'en': true, 'zh-tw': true, 'ko': true, 'tr': true}
    var sizeAutoList = $('.sizeAuto');
    var scaleAutoList = $('.scaleAuto')
    _this.resizeDom = () => {
        if (window.innerHeight > window.innerWidth) return;
        var size = window.innerWidth / 1920  > 1 ? 1 : window.innerWidth / 1920;
        if (window.innerWidth / window.innerHeight - 1920 / 1080 > 0) {
            // let scale = window.innerWidth / window.innerHeight - 1920 / 1080
            // scaleAutoList.css('bottom', `${scale * 250}px`)
            // topCtn[0].style.top = `${scale * 250}px`
        } else {
            scaleAutoList.css('bottom', '0px')
        }

        
    };

    window.onresize = function(e) {
        if (!browser.versions.mobile) {
            _this.resizeDom();
        }
    }


}

var mapScaleInfo = dabaInfo;
// var mapScaleInfo = gcInfo;
function getMapPos (posX, posY) {
    // var x = Number(posX)
    // var y = Number(posY)
    
    var x = Number(posX)
    var y = Number(posY)
    var bj = isFloor ? mapScaleInfo.floorInfo.info.bj : 128
    // x轴转换计算公式：世界轴 / 设计稿宽度/2
    // x轴倍率：81086.304688 / 4096 = 19.79646110546875
    // var xB = 81086.304688 / 4096
    // 81086.304688 / 128
    var xB2 = mapScaleInfo.width / bj

    // y轴计算公式：世界轴 / 设计稿宽度/2
    // y轴倍率：80988.500000 / 4096 = 19.7725830078125
    // var yB = 80988.500000 / 4096 / -bj
    var yB2 = mapScaleInfo.height / bj
    
    // 世界中心轴x： 358155.687500； y： 750191.750000
    // return {x: bj - (mapScaleInfo.centerX - x ) / xB2, y: -bj - (mapScaleInfo.centerY + y ) / yB2}
    // currLayer.name === 'map_gc'|| currLayer.name === 'map_pc'
    if (currLayer.name.indexOf('cgxg') !== -1 || currLayer.name === 'map_yc2' || currLayer.name === 'map_yc'|| mapScaleInfo.rotate) {

        return {x: bj - (mapScaleInfo.centerY + y ) / yB2, y: -bj + (mapScaleInfo.centerX - x ) / xB2}
    } else{
        return {x: bj - (mapScaleInfo.centerX - x ) / xB2, y: -bj - (mapScaleInfo.centerY + y ) / yB2}
    }
    // return {x: 127, y: -68}
}

new Page().init();

        // 项目初始化的一些函数
        var initProject = function () {
            // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
            // document.body.addEventListener('touchmove', function (e) {
            //     e.preventDefault();
            // }, { passive: false });

            /** 解决ios12微信input软键盘收回时页面不回弹，兼容动态添加dom(腾讯登录组件)的情况 */
            var resetScroll = (function () {
                var timeWindow = 500;
                var timeout; // time in ms
                var functionName = function (args) {
                    let inputEl = $('input, select, textarea');
                    // TODO: 连续添加元素时，可能存在重复绑定事件的情况
                    inputEl && inputEl.on('blur', () => {
                        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                        window.scrollTo(0, Math.max(scrollHeight, 0));
                    });
                };
        
                return function () {
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        functionName.apply();
                    }, timeWindow);
                };
            }());
        };
    initProject();

    var getImgName = function (str, search) {
        let lastIndex = str.lastIndexOf(search);
        let newStr = str.slice(lastIndex + 1)
        return newStr.split('.')[0];
    }

// 当前地图信息
// 全部icon
var allNavList = navList;
// 单个大类
var navTypeList = navListInfo;
// icon地图映射
var mapIcons = mapArticle;

var poiInfo = selectRegion;

// var allNavList = navList_cgxg;
// // 单个大类
// var navTypeList = navListInfo_cgxg;
// // icon地图映射
// var mapIcons = mapArticle_cgxg;

var isRemove = false;

var poiList = []

// 当前地图
var currLayer;

// 切换地图
var dom_changeMapBtn = $('.btn-change-map-ctn')
var dom_mapList = $('.map-list-ctn')
var isMoveMapList = false;
var currMap = '0';
var currLv = '0';
var currWarMap = 'pc';
var currWarType = 'pc';
var isZj = false;

// 全面战场模式
var isWar = false;
// 攻守方
var isAttack = true;

// 楼层模式
var isFloor = false;
var currFloorIndex = -1;
var currMapFloor = dabaFloor;

// 标点
	var map
    var mapFolder = '0_4/'
    var cacheMarker = [];
    var removeCacheMarker = [];
    var markerList = [];
    var currClickMarker;
    var warMark = [];
    var borderList = [];
    


    function refreshMarker2(from, arr) {
        $.each(cacheMarker, function () {
            this.remove();
        
        });
        // $.each(borderList, function () {
        //     this.remove();
        
        // });
        
        
        isRemove = true;
        console.log('设置true');
        console.log('remove', isRemove);
        cacheMarker = [];
        markerList = []

        
        $.each(arr, function (index, item) {
            var visible = false;
            var that = this;
            if (from === "filter" && visibleMarker[item.name]) visible = true;
            if (from === "filter" && visibleMarker['出生点'] && item.type === 'revive') {
                visible = true;
            }
            if (from === "filter" && visibleMarker['首领'] && item.type === 'Boss') {
                visible = true;
            }
            if (from === "filter" && (visibleMarker['行动接取站']) && item.type === 'move') {
                visible = true;
            }
            if (from === "filter" && (visibleMarker['高价值']) && item.type === 'move') {
                visible = true;
            }
            if (visible) {
                if (item['随机']) {
                    var popupHtml = `
                    <div class="name ${(this.name === '[地狱黑鲨]雷斯—雷达站摧毁者' || this.name === '[地狱黑鲨]雷斯—酒店守卫者') && 'max'}">${this.name}<span> ( ${item['随机']} )</span></div>
                    <div class="btn-floor" data-floor=${this.floor}></div>
                    <div class="address">地点：<span>${item['自定义区域']}</span></div>
                    <div class="open-text ${(!item['拾取条件'] || item['拾取条件'] === '') ? 'hide': ''}">开启条件：<span>${item['拾取条件']}</span></div>
                `;
                } else if (item['自定义区域']) {
                    var popupHtml = `
                    <div class="name ${(this.name === '[地狱黑鲨]雷斯—雷达站摧毁者' || this.name === '[地狱黑鲨]雷斯—酒店守卫者') && 'max'}">${this?.sub_name ? this.sub_name : this.name}</div>
                    <div class="btn-floor" data-floor=${this.floor}></div>
                    <div class="address">地点：<span>${item['自定义区域']}</span></div>
                    <div class="open-text ${(!item['拾取条件'] || item['拾取条件'] === '') ? 'hide': ''}">开启条件：<span>${item['拾取条件']}</span></div>
                `;
                } else if (item['激活条件']) {
                    var popupHtml =`
                            <div class="name">${this.name}</div>
                         <div class="open-text war ${(!item['激活条件'] || item['激活条件'] === '' || item['激活条件'] === '-') ? 'hide': ''}">激活条件：<span>${item['激活条件']}</span></div>
                         `
                   
                } else {
                    var popupHtml = `
                    <div class="name">${this.name}</div>
                `;
                }
              


                popupHtml += '</div>';

                var className = ''
                if (item?.type) {
                    className =  item.type
                } else {
                    className =  'article'
                }
                var pos = getMapPos(this.x, this.y)
                console.log(this.x, this.y, pos);
                
                var path = isWar ? '../../img/dzc_i/' : '../../img/xdaba/'
                var iconName;
                if (that.name === "进攻方基地" ) {
                    iconName = window.viewChange ? 'g_jdbsd_g': 'g_jdbsd_r'
                } else if (that.name === "防守方基地") {
                    iconName = window.viewChange ? 'f_jdbsd_r': 'f_jdbsd_g'
                } else {
                    iconName = that.icon
                }
                
                if (this.icon) {
                    // style=`transform: translate3d(-50%, -50%, 0) rotate(${element.rotate}deg)`
                    let rotate = currWarMap === 'qhz' ? 90 : 180
                    console.log('rotate', currWarMap);
                    var myIcon =  L.divIcon({
                        className: ` map-icon`,
                        html: `<div class="map-icon-bg" style="${that?.rotate ? `transform: translate3d(-50%, -50%, 0) rotate(${Number(that?.rotate) + rotate}deg)` : ''}"><img src="${path + iconName}.png"/></div>`,
                        iconSize: [30, 30],			//设置图标大小
                        iconAnchor: [15, 15],		//设置图标偏移
                    })
                    console.log(that);
                    
                    if (that.name === '电梯撤离点' && that.point1) {
                        var pos1 = getMapPos(that.point1.x, that.point1.y)
                        var pos2 = getMapPos(that.point2.x, that.point2.y)
                        var latlngs1 = [
                            [pos1.y, pos1.x],
                            [pos.y, pos.x]  // 添加终点坐标
                        ];
                        var latlngs2 = [
                            [pos2.y, pos2.x],
                            [pos.y, pos.x]  // 添加终点坐标
                        ];
                        
                        myIcon.polyline = L.polyline(latlngs1, {
                            color: '#EAEBEB',
                            dashArray: '10, 10',  // 虚线样式：10px线段，10px间隔
                            weight: 2
                        }).addTo(map);
                        myIcon.polyline2 = L.polyline(latlngs2, {
                            color: '#EAEBEB',
                            dashArray: '10, 10',  // 虚线样式：10px线段，10px间隔
                            weight: 2
                        }).addTo(map);
                    }
                    myIcon.name = that.name;
                    
                    
                    cacheMarker.push(L.marker([pos.y, pos.x], {icon:  myIcon}).bindPopup(popupHtml).addTo(map).on({
                        click: function () {
                            document.getElementById('MapContainer').classList.remove('zooming');
                            currClickMarker?.setIcon(currClickMarker?.myIcon)
                            this.isClick = true;
                            console.log(this);
                            let rotate = currWarMap === 'qhz' ? 90 : 180
                            this.myIcon = myIcon;
                            if (that?.floor) {
                                $('.leaflet-popup').addClass('floor')
                            } else {
                                $('.leaflet-popup').removeClass('floor')
                            }
                            $('.leaflet-popup-close-button').html('')
                            this.openPopup();
                            this.setIcon( L.divIcon({
                                className: ` map-icon click`,
                                html: `<div class="map-icon-bg" ><img src="${path + iconName}.png" style="${that?.rotate ? `transform:  rotate(${Number(that?.rotate) + rotate}deg)` : ''}"/></div>`,
                                iconSize: [30, 30],			//设置图标大小
                                iconAnchor: [15, 15],		//设置图标偏移
                            }));
                            currClickMarker = this;
                            $(this.getElement()).addClass('click')
                            console.log(item);
                            if (this.myIcon.name.indexOf('基地') > -1 || (this.myIcon.name.indexOf('据点') > -1 && window.occupy)) {
                                initWarSwiper(this.myIcon.name, that);
                            }
                            // this?.remove()
                        }
                    }))
                }
                
            }
          
        });
        isRemove = false;
        console.log(cacheMarker.length);
    }



    function toggleVisible(type, index) {
        
        switch (type) {
            case "0_all":
            case "1_all":
            case "2_all":
            case "3_all":
            case "4_all":
            case "5_all":
                renderMarker()
                break;
            case "0_none":
            case "1_none":
            case "2_none":
            case "3_none":
            case "4_none":
            case "5_none":
              
                renderMarker()
                $('.map-icon').remove();
                console.log('删除', $('.map-icon').remove());
                break;
            case "none":
                $('.map-icon').remove();
                currClickMarker?.remove();
                renderMarker2()
                break;
        
            default:
                visibleMarker[type] = visibleMarker[type] ? false : true;
                break;
        }
        $('.deploy-swiper').removeClass('show')
        console.log('type', type);
        function renderMarker () {
            if (Number(currLeftNav) === 0) {
                console.log(111, navTypeList, visibleMarker);
                
                for (var o in visibleMarker) {
                    if (visibleMarker.hasOwnProperty(o)) {
                        visibleMarker[o] = (type.indexOf('all') > 0 ? true : false);
                    }
                }
            } else {
                for (let index = 0; index < navTypeList[currLeftNav].typeList.length; index++) {
                    const element = navTypeList[currLeftNav].typeList[index];
                    // console.log(element);
                    // if (element.num === 0) return;
                    
                    visibleMarker[element.name] = (type.indexOf('all') > 0 ? true : false);
                }
            }
           
        }

        function renderMarker2 () {
            for (var o in visibleMarker) {
                if (visibleMarker.hasOwnProperty(o)) {
                    visibleMarker[o] = (type.indexOf('all') > 0 ? true : false);
                }
            }
           
        }

        refreshMarker2("filter", mapIcons);
    }




var init = function () {
    // var mapWidth = -250;  
    // var mapHeight = 250;  

    var mapWidth = isFloor ? mapScaleInfo.floorInfo.info.boundsW : mapScaleInfo.boundsW;  
    var mapHeight = isFloor ? mapScaleInfo.floorInfo.info.boundsH :mapScaleInfo.boundsH;  
    console.log('mapWidth', mapWidth);
    
    var mapOrigin = isWar ? L.latLng(0, -80) : L.latLng(0, 0);
    var pixelToLatLngRatio = -1;
    var southWest = mapOrigin; // 左上角  
    var northEast = L.latLng((mapHeight - 70) * pixelToLatLngRatio, mapWidth * pixelToLatLngRatio); // 右下角  
    var bounds = L.latLngBounds(southWest, northEast);  
    // zoomAnimation: !0,
    // zoomAnimationThreshold: 4,
    // fadeAnimation: !0,
    // markerZoomAnimation: !0,
    // transform3DLimit: 8388608,
    // zoomSnap: 1,
    // zoomDelta: 1,
    // trackResize: !0

    map = L.map('MapContainer', {
        crs: L.CRS.Simple,
        attributionControl: false,
        zoomControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: mapScaleInfo.minZoom,
        maxZoom: 8,
        preferCanvas: true,
        detectRetina: true,
        smoothSensitivity: 1,   // zoom speed. default is 1
        // zoomSnap: .1,
        wheelDebounceTime: 10,
        // 新增
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomAnimationThreshold: 2,
        transform3DLimit: 8388608,
        // zoomSnap: 0.25,
        // zoomDelta: 0.25,
        // zoomSnap: 0.1,
        // zoomDelta: 0.1,
        trackResize: !0
    }).setView([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom);
    let control = new L.Control.Zoomslider()
    map.addControl(control);
    window.pervInitX = mapScaleInfo.initX
    addLayer('map_db');

    map.on('zoomanim', function() {
        document.getElementById('MapContainer').classList.add('zooming');
        
        // 强制更新所有弹窗位置
        // map.eachLayer(layer => {
        //     if (layer instanceof L.Popup) {
        //         const popupNode = layer.getElement();
        //         popupNode.style.transform = getComputedStyle(popupNode).transform;
        //     }
        // });
    });
    // loucengTest();
    
    // addLayer('map_gc');
    // currLayer = L.tileLayer(`../../img/map/{z}_{x}_{y}.jpg`, {
    //     minZoom: mapScaleInfo.minZoom,
    //     maxZoom: 5,
    //     noWrap: true,
    //     attribution: '© OpenStreetMap contributors',
    //     bounds: bounds
    // }).addTo(map);

    // selectRegion_cgxg
    // [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole

    map.on('click', function(e) {
       console.log(currClickMarker);
       if (currClickMarker) {
        currClickMarker.setIcon(currClickMarker.myIcon)
        $('.deploy-swiper').removeClass('show')
        document.getElementById('MapContainer').classList.remove('zooming');
       }
     
    });

    $('.leaflet-popup-pane').on('click', (e) => {
        console.log(e);
        console.log(currClickMarker);
        currClickMarker.closePopup();
        currClickMarker.setIcon(currClickMarker.myIcon)
        $('.deploy-swiper').removeClass('show')
        document.getElementById('MapContainer').classList.remove('zooming');
    })
    
    initNav();
    initFloor();
    bindEvent();
};

// 边界数组转换
function filterPos (str, char1, char2, i) {
    var index = str.indexOf(char1);
    var index2 = str.indexOf(char2, index + 1);
    // console.log(index, index2);
    
    if (index != -1 && index2 != -1) {
        return str.slice(index + 2, index2);
    }
    return str;
}


function drawBorderPub (color, border, border2) {
    var latlngs = [];
    var latlngs2 = [];
    var latlng = []

    for (let index = 0; index < border.length; index++) {
        const element = border[index];
        let x = filterPos(element, 'X', ',')
        let y = filterPos(element, 'Y', ',', 1)
        let pos = getMapPos(x, y)
        latlngs.push([pos.y, pos.x])
    }
    for (let index = 0; index < border2.length; index++) {
        const element = border2[index];
        let x = filterPos(element, 'X', ',')
        let y = filterPos(element, 'Y', ',', 1)
        let pos = getMapPos(x, y)
        latlngs2.push([pos.y, pos.x])
    }
    latlng.push(latlngs)
    latlng.push(latlngs2)
    const line = L.polygon(latlng, {color: color, fillColor: color, weight: 3, stroke: false}).addTo(map)
    borderList.push(line);
}
// 绘制边界
function drawBorder (color, border, isJd = false){ 

    var latlngs = [];
   

    for (let index = 0; index < border.length; index++) {
        const element = border[index];
        let x = filterPos(element, 'X', ',')
        let y = filterPos(element, 'Y', ',', 1)
        var pos = getMapPos(x, y)
        latlngs.push([pos.y, pos.x])
    }

    // 全地图边界
    let fourLatlng = [[0, mapScaleInfo.boundsW * -1],[-mapScaleInfo.boundsH, mapScaleInfo.boundsW * -1],[-mapScaleInfo.boundsH, -mapScaleInfo.boundsW * -1], [0, -mapScaleInfo.boundsW * -1]];
    var latlngs2 = [latlngs]
    

    // // 绘制且添加
    // transparent
    // if (isAttack) {
    //     var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    // } else {
    //     var polyline = L.polyline(latlngs, {color: 'green'}).addTo(map);
    // }
   
    
    if (isJd) {
        // const line = L.polygon(latlngs, {color: 'white', fillColor: 'white', weight: 3, stroke: false}).addTo(map)
        // const line2 = L.polygon(latlngs, {color: 'white', fillColor: 'white', weight: 3, stroke: false}).addTo(map)
        // const line3 = L.polygon(latlngs, {color: 'white', fillColor: 'white', weight: 3, stroke: false}).addTo(map)

        let colors
        if (window.occupy) {
            colors = 'white'
        } else {
            colors = window.viewChange ? 'red' : color
        }
        console.log('colors', colors);
        
        const line = L.polygon(latlngs, {color: colors, fillColor: colors, weight: 3, stroke: false}).addTo(map)
        const line2 = L.polygon(latlngs, {color: colors, fillColor: colors, weight: 3, stroke: false}).addTo(map)
        const line3 = L.polygon(latlngs, {color: colors, fillColor: colors, weight: 3, stroke: false}).addTo(map)
        const line4 = L.polyline(latlngs, {color: colors}).addTo(map)
        // line.bringToFront();
        
        borderList.push(line);
        borderList.push(line2);
        borderList.push(line3);
        borderList.push(line4);
    } else {
        borderList.push(L.polyline(latlngs, {color}).addTo(map));
    }
   
    // var polygon = L.polygon(latlngs, { color: "transparent"}).addTo(map);

    // polygon.on('click', (e) => {
    //     console.log(1, e);
    //     polyline.setStyle({color: 'red'});
    // })
}

function addLayer (mapName) {
    // $('.leaflet-container').attr('class', `leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom map-${currMap}`)
    var mapWidth
    var mapHeight

    var minZoom, initZoom, initX, initY
    var mapOrigin
    var pixelToLatLngRatio;
    var southWest; // 左上角  
    if (window.occupy) {
        mapWidth = mapScaleInfo.boundsW_s
        mapHeight = mapScaleInfo.boundsH_s
        southWest = L.latLng(0, 0)
        pixelToLatLngRatio = -1
    } else if (isFloor) {
        mapWidth = mapScaleInfo.floorInfo.info.boundsW
        mapHeight = mapScaleInfo.floorInfo.info.boundsH
        // southWest = L.latLng(-25, 55)
        // pixelToLatLngRatio = -0.85
        // mapWidth = mapScaleInfo.boundsW
        // mapHeight = mapScaleInfo.boundsH
        southWest = L.latLng(mapScaleInfo.floorInfo.info.latLngX, mapScaleInfo.floorInfo.info.latLngY)
        pixelToLatLngRatio = mapScaleInfo.floorInfo.info.pixelToLatLngRatio
    } else if (isWar) {
        mapWidth = mapScaleInfo.boundsW
        mapHeight = mapScaleInfo.boundsH
        southWest = L.latLng(0, -80)
        pixelToLatLngRatio = -1
    } else {
        mapWidth = mapScaleInfo.boundsW
        mapHeight = mapScaleInfo.boundsH
        southWest = L.latLng(0, 0)
        pixelToLatLngRatio = -1
    }
    var northEast = L.latLng((mapHeight - 70) * pixelToLatLngRatio, mapWidth * pixelToLatLngRatio); // 右下角  
    var href = mapScaleInfo?.href ? mapScaleInfo?.href : '../../img/'
    console.log(href);

    if (window.occupy) {
        minZoom = mapScaleInfo.minZoom_s
        initZoom = mapScaleInfo.initZoom_s
        initX = mapScaleInfo.initX_s
        initY = mapScaleInfo.initY_s
    } else if (isFloor) {
        minZoom = mapScaleInfo.floorInfo.info.minZoom
        initZoom =  mapScaleInfo.floorInfo.info.initZoom
        initX = mapScaleInfo.floorInfo.info.initX
        initY = mapScaleInfo.floorInfo.info.initY;
        
    } else {
        minZoom = mapScaleInfo.minZoom
        initZoom =  mapScaleInfo.initZoom
        initX = mapScaleInfo.initX
        initY = mapScaleInfo.initY;
    }
    console.log(minZoom, initZoom);
    
    var bounds = L.latLngBounds(southWest, northEast);  
    currLayer = L.tileLayer(href + `${mapName}/{z}_{x}_{y}.jpg`, {
        minZoom: minZoom,
        maxZoom: 8,
        maxNativeZoom: isFloor ? 6 : 5,
        noWrap: false,
        attribution: '© OpenStreetMap contributors',
        bounds: bounds,
        errorTileUrl: href + `${mapName}/0_0_0.jpg`,
        tileSize: isFloor ? 512 : 256,
        zoomOffset: isFloor ? -1 : 0
    }).addTo(map);
    currLayer.name = mapName
    map.setMaxBounds(bounds)
    map.options.minZoom = minZoom;
    
    if (mapName === 'map_qhz' && currWarType === 'mobile') {
        map.setView([window.occupy ? mapScaleInfo.initX_mobile_s : mapScaleInfo.initX, window.occupy ? mapScaleInfo.initY_mobile_s : mapScaleInfo.initY], initZoom)
    } else {
        map.setView([initX, initY], initZoom)
    }
   

    window.pervInitX = window.occupy ? mapScaleInfo.initX_s : mapScaleInfo.initX



    $.each(poiList, function () {
        this.remove();
    
    });
    poiList = [];
    let html = ''
    poiInfo.forEach((item, index) => {
        if (item.name === '行政西楼' || item.name === '行政东楼') return;
    var myIcon =  L.divIcon({
        className: ` map-region-name`,
        html: `<div class="map-region-name">${item.name}</div>`,
    })
      html+= `<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`
    var pos = getMapPos(item.x, item.y)
    // console.log(item.x, item.y);
    
  
    // regionList.append(`<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`)
 
    poiList.push(L.marker([pos.y, pos.x], {icon: myIcon}).addTo(map))
})
    // 锚点定位
    regionList.html(html)
    $('.region-item').on('click', function (e) {
        var x = $(e.target).attr('data-x');
        var y = $(e.target).attr('data-y');
        var pos = getMapPos(x, y)
        map.flyTo([pos.y, pos.x], 5)
    })
}

// 初始化楼层
function initFloor () {
    floorList.html('')
    floorList.append(`<div class="floor-item not-event">大地图模式</div>`)
    floorTop = $('.map-floor-change-list')
    let html2 = ''
    mapScaleInfo.floor.forEach((item, index) => {
        let html = `<div class="floor-item floor-item-${index} ${currFloorIndex === index ? 'act' : ''}" data-index="${index}" data-floor="${item.floor_f}">${item.floor_f}</div>`
        html2 += `<div class="map-floor-item floor_${item.floor_f} ${currFloorIndex === index ? 'act' : ''}" data-index="${index}"></div>`
        floorList.append(html)
       
    })
    floorTop.html(html2)

    $('.floor-item').on('click', (e) => {
        isFloor = true;
        let index = Number($(e.target).attr('data-index'));
        let floor = $(e.target).attr('data-floor');
        currFloorIndex = index;
        console.log($(this));
        $('.floor-item').removeClass('act');
        $(e.target).addClass('act');
        $('.map-floor-change-ctn').addClass('show')
        $('.map-floor-item').removeClass('act')
        $(`.floor_${mapScaleInfo.floor[index].floor_f}`).addClass('act');
        $('.floor-tips .span1').text(mapScaleInfo.floor[currFloorIndex].floor_name)

        $('.map-floor-item').on('click', (e) => {
            let index = $(e.target).attr('data-index');
            currFloorIndex = index;
            $('.map-floor-item').removeClass('act')
            $(`.floor_${mapScaleInfo.floor[index].floor_f}`).addClass('act');
            $('.floor-item').removeClass('act');
            $(`.floor-item-${index}`).addClass('act');
        })

        $('.floor-tips .span2').on('click', () => {
            isFloor = false;
            $('.floor-item').removeClass('act');
            $('.map-floor-change-ctn').removeClass('show')
            changeMapLv(`${currMap + currLv}`)
        })
        console.log('floor', floor, currLv);
        if (isZj) {
            changeMapLv(`${currMap + currLv + '_s_' +floor}`)
        } else {
            changeMapLv(`${currMap + currLv + '_' +floor}`)
        }
        
    })
}

// 重置全选
function resetAll (type) {
    if (currLeftNav == 0) {
        console.log('全部');
        if (listIsAll[0]) {
            for (const key in listIsAll) {
                if (Object.hasOwnProperty.call(listIsAll, key)) {
                    listIsAll[key] = false
                }
            }
        } else {
            for (const key in listIsAll) {
                if (Object.hasOwnProperty.call(listIsAll, key)) {
                    listIsAll[key] = type === 'none' ? false : true
                }
            }
        }
       
    } else if (type === 'none') {
        console.log('走这里');
        for (const key in listIsAll) {
            if (Object.hasOwnProperty.call(listIsAll, key)) {
                listIsAll[key] = false
            }
        }
    } else {
        // listIsAll[currLeftNav] = type === 'none' ? false: true;
        listIsAll[currLeftNav] = listIsAll[currLeftNav] ? false: true;
    }
    
    if (listIsAll[1] && listIsAll[2] && listIsAll[3] && listIsAll[4] && listIsAll[5]) {
        listIsAll[0] = true;
    } else if (!listIsAll[1] || !listIsAll[2] || !listIsAll[3] || !listIsAll[4] || !listIsAll[5]) {
        listIsAll[0] = false;
    }
   
}

var initNav = function () {
    currLeftNav = 0;
    var navLeft = $('.nav-options');
    navLeft.html('')
    var navList;
    if (isWar) {
        navList = allNavList.typeList;
    } else {
        navList = allNavList
    }
    

    
    allNavList.forEach(function (item, index) {
        navLeft.append(`<div class="nav-option-item nav-option-item-${index} ${currLeftNav === index ? 'active': ''}" style="${item.title === '行动接取站' ? 'display: none' : ''}" data-index="${index}">${item.title}</div>`)
       
    })

    var navOptItem = $('.nav-option-item')
    // 选择类型
    navOptItem.on('click', function (e) {
        var index = $(e.target).attr('data-index');
        currLeftNav = index;
        navOptItem.removeClass('active')
        $(`.nav-option-item-${index}`).addClass('active')
        console.log($(e.target).attr('data-index'));
        if (Number(index) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            console.log('navTypeList[index]', navTypeList, index, navTypeList[index]);
            
            renderNavTypeList(navTypeList[index].typeList, index)
        }

        if (listIsAll[currLeftNav]) {
            $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon')
        } else {
            $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        }
        
        bindOptionEvent();

        // if (isWar) {
        //     warInit(currWarMap, currWarType);
        // }

    })
    
    renderNavTypeList(allNavList[0].typeList, 0)
    

        
    selectRegion.forEach(function (item, index) {
        regionList.append(`<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`)
    })
}

var renderNavTypeList = function (list, navIndex = 0) {
    console.log(list);
    
    // 定义分类容器
    const categories = {
        wz: { title: '物资点', html: '' },
        csd: { title: '出生点', html: '' },
        cld: { title: '撤离点', html: '' },
        sl: { title: '首领', html: '' },
        jd: { title: '据点', html: '' },
        jdbsd: { title: '基地部署点', html: '' },
        zj: { title: '载具', html: '' },
        zjbjz: { title: '载具补给站', html: '' },
        gddyx: { title: '固定弹药箱', html: '' },
        gdwq: { title: '固定武器', html: '' },
        zz: { title: '装置', html: '' }
    };

    // 分类处理函数
    function addToCategory(item, index, category) {
        categories[category].html += `
            <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? 'active': ''}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
                <div class="wz-bg">
                    <div class="wz-icon img_${item.icon}"></div>
                    <div class="wz-num ${item.num === 1? 'hides': ''}">${item.num}</div>
                </div>
                <div class="wz-name">${item.name}</div>
            </div>`;
    }

    // 遍历列表并分类
    list.forEach((item, index) => {
        if (item.name === '行动接取站' || item.name === '高价值接取站') return;
        
        if (item.name.indexOf('撤离点') !== -1) {
            addToCategory(item, index, 'cld');
        } else if (item.name.indexOf('出生点') !== -1) {
            addToCategory(item, index, 'csd');
        } else if (item.name.indexOf('首领') !== -1) {
            addToCategory(item, index, 'sl');
        } else if (item.name.indexOf('基地') > -1) {
            addToCategory(item, index, 'jdbsd');
        } else if (item.name.indexOf('据点') > -1 && !window.occupy) {
            addToCategory(item, index, 'jd');
        } else if (isWar && (item.name.indexOf('车') > -1 || item.name.indexOf('舟') > -1)) {
            addToCategory(item, index, 'zj');
        } else if (item.name.indexOf('载具补给站') > -1) {
            addToCategory(item, index, 'zjbjz');
        } else if (item.name.indexOf('固定弹药箱') > -1) {
            addToCategory(item, index, 'gddyx');
        } else if (isWar && (item.name.indexOf('枪') > -1 || item.name.indexOf('炮') > -1)) {
            addToCategory(item, index, 'gdwq');
        } else if (item.name.indexOf('滑索') > -1 || item.name.indexOf('电梯') > -1) {
            addToCategory(item, index, 'zz');
        } else {
            addToCategory(item, index, 'wz');
        }
    });

    // 按指定顺序生成最终 HTML
    let finalHtml = '';
    Object.keys(categories).forEach(key => {
        if (categories[key].html) {
            finalHtml += `<div class="nav-type-item nav-${key}"><div class="fgx top0 type-item-fgx" data-nav="${key}">${categories[key].title}</div>${categories[key].html}</div>`;
        }
    });

    navTypyList.html(finalHtml);
    typeListInit = true;
    visibleMarker2[navIndex].isInit = true;

    $('.type-item-fgx').on('click', (e) => {
        const type = $(e.target).attr('data-nav');
        $(`.nav-${type}`).attr('class').indexOf('close') > -1 ? $(`.nav-${type}`).removeClass('close') :  $(`.nav-${type}`).addClass('close')
    })
}

function toastTips () {
    $('.m-toast').show();
    setTimeout(() => {
        $('.m-toast').hide();
    }, 800)
}



function fuzzyMatch(text, pattern) {
    // 将模糊词转换为正则表达式
    const regex = new RegExp(pattern.split('').join('.*'), 'i');
    return regex.test(text);
  }

var mapSelectCtn = $('.map-select')
var selectCtn = $('.select-ctn');
// 搜索
function selectmarker(name) {
    if (name === '') {
        mapSelectCtn.removeClass('show');
        return;
    };
    console.log('name', name, allNavList);
    var markerList = []
    var html = '';
    for (let index = 0; index < allNavList[0].typeList.length; index++) {
        const element = allNavList[0].typeList[index];
        console.log(element);
        fuzzyMatch(element.name, name) && markerList.push(element)
    }
    console.log('markerList', markerList);
    markerList.length && markerList.forEach(function (item, index) {
        // console.log(visibleMarker[item.name], item.name);
        html+=`
        <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? 'active': ''}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
            <div class="wz-bg">
                <div class="wz-icon img_${item.icon}"></div>
                <div class="wz-num">${item.num}</div>
            </div>
            <div class="wz-name">${item.name}</div>
        </div>`

    })
    // navTypyList.html(html)
    selectCtn.html(html)
    mapSelectCtn.addClass('show');

    bindOptionEvent();
}

function bindOptionEvent () {
    var NavListItem = $('.nav-list-item')
    
    
    // 选择标签
    NavListItem.on('click', function (e) {
        var index = $(e.target).attr('data-index');
        var name = $(e.target).attr('data-name');
        var icon = $(e.target).attr('data-icon')
        console.log('index', $(e.target).attr('data-icon'));
        
        // if (isWar) {
        //     $(this).attr('class').indexOf('active') ===  -1 ?  $(this).addClass('active'): $(this).removeClass('active')
        // } else {
        //     !visibleMarker[name] ? $(this).addClass('active'): $(this).removeClass('active')
        //     toggleVisible(name, currLeftNav);
        // }
        !visibleMarker[name] ? $(this).addClass('active'): $(this).removeClass('active')
        toggleVisible(name, currLeftNav);
 
        
        let chooseNum = $('.nav-type-list').find('.active').length;

        console.log('chooseNum', chooseNum, currLeftNav, navTypeList, navTypeList[currLeftNav].typeList);
        
        if (isFloor && chooseNum === navTypeList) {
            $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon')
        } else if (!isFloor && chooseNum === navTypeList[currLeftNav].typeList.length) {
            $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon')
        } else {
            if (listIsAll[currLeftNav]) {
                listIsAll[currLeftNav] = false;
                listIsAll[0] = false;
                $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
            } else {
                $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
            }
        }
        console.log('点击');
    })
}

// 事件
var bindEvent = function () {
    // 导航栏状态
    var navState = true;
    var navCtn = $('.nav-ctn')
    var navOptItem = $('.nav-option-item')
    var btnNavState = $('.btn-nav-state');

    // 搜索地区
    $('.region-item').on('click', function (e) {
        var x = $(e.target).attr('data-x');
        var y = $(e.target).attr('data-y');
        var pos = getMapPos(x, y)
        map.flyTo([pos.y, pos.x], 5)
    })

    // 全选
    var isAll = false;
    $('.choose-all').on('click', function () {
        // resetNav();
        resetAll()

        if (listIsAll[currLeftNav]) {
            toggleVisible(`${currLeftNav}_all`, currLeftNav);
            $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon')
        } else {
            toggleVisible(`${currLeftNav}_none`, currLeftNav);
            $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        }
        // renderNavTypeList(navList[0].typeList)
        if (Number(currLeftNav) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
        }

        bindOptionEvent();

    })

    $('.reset-choose').on('click', function () {
        resetAll('none')
        toggleVisible(`none`, currLeftNav);
            $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        // renderNavTypeList(navList[0].typeList)
        if (isFloor) {
            renderNavTypeList(navTypeList, 0)
        } else if (Number(index) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[index].typeList, index)
        }

        bindOptionEvent();
    })

    // 选择类型
    navOptItem.on('click', function (e) {
        var index = $(e.target).attr('data-index');
        currLeftNav = index;
        navOptItem.removeClass('active')
        $(`.nav-option-item-${index}`).addClass('active')
        console.log($(e.target).attr('data-index'));
        if (isFloor) {
            renderNavTypeList(navTypeList, 0)
        } else if (Number(index) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[index].typeList, index)
        }

        if (listIsAll[currLeftNav]) {
            $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon')
        } else {
            $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        }

        bindOptionEvent();

    })

    bindOptionEvent();


    // 打开关闭导航
    btnNavState.on('click', function () {
        navState = !navState;
        if (navState) {
            navCtn.attr('class', 'open img_nav_bg nav-ctn')
        } else {
            navCtn.attr('class', 'close img_nav_bg nav-ctn')
        }
    })



    // 切换地图移入事件
    dom_changeMapBtn.on('mouseenter', function () {
        dom_mapList.css({height: '2.25rem', width: '1.2rem'});
        dom_changeMapBtn.css('height', '1rem')
        dom_changeMapBtn.addClass('hover')
    })

    dom_changeMapBtn.on('mouseleave', function () {
        // dom_mapList.css('height', '0px');
        if (!isMoveMapList) {
            dom_mapList.css('height', '0px');
            dom_mapList.css('width', '1.2rem');
            dom_changeMapBtn.css('height', '0.3rem')
            dom_changeMapBtn.removeClass('hover')
            dom_mapList.attr('class', `map-list-ctn hover_0`)
        }
    })
    let mapItem =  $('.map-item');
    mapItem.on('mouseenter', function (e) {
        console.log('currWarMap_s', currWarMap_s);

        // $(this).addClass('action')
        // mapItem.addClass('action')
    })
    // mapItem.on('mouseenter', function () {
    //     mapItem.addClass('action')
    // })

    let currWarMap_s;
    dom_mapList.on('mouseover', function (e) {
        var index = $(e.target).attr('data-index')
        var warMap = $(e.target).attr('data-map')
        console.log(index, warMap);

        if (index) {
            currMap = index;
            currWarMap_s = warMap;
            // currWarMap = warMap
            dom_mapList.attr('class', `map-list-ctn hover_${index}`)
        }

        if (warMap) {
            mapItem.removeClass('action')
            // currWarMap = warMap;
            currWarMap_s = warMap;
            $(e.target).addClass('action')
        }
        dom_mapList.css('width', '4rem');
        isMoveMapList = true;
    })

    dom_mapList.on('mouseleave', function () {
        dom_mapList.css('height', '0px');
        dom_mapList.css('width', '1.2rem');
        dom_changeMapBtn.css('height', '0.3rem')
        dom_changeMapBtn.removeClass('hover')
        dom_mapList.attr('class', `map-list-ctn hover_0`)
        isMoveMapList = false;

        currWarMap_s = currWarMap;
        console.log('currWarMap_s', currWarMap_s);
        $('.map-lv-item').removeClass('action')
        mapItem.removeClass('action')
    })

    $('.map-lv-item').on('mouseover', function (e) {
        var lv = $(e.target).attr('data-lv')
        var type = $(e.target).attr('data-type')
        if (lv && Number(lv) > 0) {
            console.log(lv);
            $('.btn-random').attr('class').indexOf('top') === -1 && $('.btn-random').addClass('top')
            $('.btn-type-change').attr('class').indexOf('top') === -1 && $('.btn-type-change').addClass('top')
        } else {
            $('.btn-random').removeClass('top')
            $('.btn-type-change').removeClass('top')
        }

        if (type) {
            $('.map-lv-item').removeClass('action')
            currWarMap = currWarMap_s;
            currWarType = type;
            $(e.target).addClass('action')
        }
    })

    // 选择难度等级
    $('.map-lv-item').on('click', function (e) {
        var lv = $(e.target).attr('data-lv')
        
        var type = $(e.target).attr('data-type')
        console.log('isZj', isZj);
        resetFloor();
        if (isWar) {
            window.warLv = 0
            $('.lv-change-tips').text(`区域${warLvText[window.warLv]}`)
            resetAll('none')
            toggleVisible(`none`, currLeftNav);
            changeWarMap(currWarMap, type)
            // initNav();
            // bindOptionEvent();
        } else if (isZj && currMap == 1) {
            changeMapLv(currMap + lv + '_s');
        } else {
            changeMapLv(currMap + lv);
        }
        

        if (currMap + currLv !== currMap + lv) {
            currLv = lv
            currWarType = type
            if (window.pervInitX === window.occupy ? mapScaleInfo.initX_s : mapScaleInfo.initX) return;
            map.flyTo([window.occupy ? mapScaleInfo.initX_s : mapScaleInfo.initX,  window.occupy ? mapScaleInfo.initY_s : mapScaleInfo.initY], window.occupy ? mapScaleInfo.initZoom_s : mapScaleInfo.initZoom)
            window.pervInitX = window.occupy ? mapScaleInfo.initX_s : mapScaleInfo.initX
        }


        dom_mapList.css('height', '0px');
        dom_mapList.css('width', '1.2rem');
        dom_changeMapBtn.css('height', '0.3rem')
        dom_changeMapBtn.removeClass('hover')
        dom_mapList.attr('class', `map-list-ctn hover_0`)
        isMoveMapList = false;
        // $('.btn-random').removeClass('open')
        if (!isWar) {
            resetAll('none')
            toggleVisible(`none`, currLeftNav);
        }

    })

    // 坠机事件
    $('.btn-random').on('click', function () {
        isZj = !isZj;
        resetFloor();
        isZj ? $('.btn-random').addClass('open') : $('.btn-random').removeClass('open')
        if (isZj) {
            if ( $('.btn-random').attr('class').indexOf('top') === -1) {
                changeMapLv('10_s');
                if (currMap + currLv !== '10_s') {
                    // map.setView([mapScaleInfo.initX, mapScaleInfo.initY], mapScaleInfo.initZoom)
                    map.flyTo([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom)
                }
                currLv = '0'
            } else {
                changeMapLv('11_s');
                if (currMap + currLv !== '11_s') {
                    map.flyTo([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom)
                }
                currLv = '1'
            }

        } else {
            if ( $('.btn-random').attr('class').indexOf('top') === -1) {
                changeMapLv('10');
                if (currMap + currLv !== '10') {
                    // map.setView([mapScaleInfo.initX, mapScaleInfo.initY], mapScaleInfo.initZoom)
                    map.flyTo([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom)
                }
                currLv = '0'
            } else {
                changeMapLv('11');
                if (currMap + currLv !== '11') {
                    map.flyTo([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom)
                }
                currLv = '1'
            }
        }
        resetAll('none')
        toggleVisible(`none`, currLeftNav);
    })
    // 打开日志
    $('.btn-log').on('click', function () {
        $('.log-pop').fadeIn();
        // toastTips();
    })

    // 关闭日志弹窗
    $('.btn-close-pop').on('click', function () {
        $('.log-pop').fadeOut();
    })

    // 打开教程
    $('.btn-tutorial').on('click', function () {
        toastTips();
    })

    // 反馈
    $('.btn-feedback').on('click', function () {
        window.open('https://wj.qq.com/s2/15023838/70c7/')
    })

    $('.bottom-bar-ctn').on('click', function (e) {
        // toastTips();
        e.stopPropagation();
    })


    $('.btn-share').on('click', function () {
        $('.bottom-bar').fadeIn();
        $('.bottom-bar').addClass('show')
    })
    $('.bottom-bar').on('click', function() {
        $('.bottom-bar').removeClass('show')
        $('.bottom-bar').fadeOut();
    })


    // 搜索
    $('.select-iput').on('input',  debounce(function (e) {
        var name = $(e.target).val()
        selectmarker(name)
    }, 500));

    // 关闭搜索
    $('.btn-close-select').on('click', function () {
        $('.select-iput').val('')
        $('.map-select').removeClass('show')
        if (Number(currLeftNav) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
        }
        bindOptionEvent();
        PTTSendClick && PTTSendClick('btn', 'close', '关闭弹窗');
    })

    $('.lj').on('click', () => {
        copyToClipboard(window.location.href)
        $('.toast-copy').css('display', 'block');
        setTimeout(() => {
            $('.toast-copy').css('display', 'none');
        }, 800)
    })


    navTypyList.on('scroll', function (e) {

        var aScrollHeight = document.querySelector('.nav-type-list').scrollHeight - document.querySelector('.nav-type-list').clientHeight;
        if ((aScrollHeight - navTypyList.scrollTop() >= -10 && aScrollHeight - navTypyList.scrollTop() <= 10)) {
            navTypyList.addClass('bot')
        } else {
            navTypyList.removeClass('bot')
        }
    })

    var regionName = $('.map-region-name')
    window.addEventListener('zoom', function (e) {
        regionName.attr('class', `map-region-name lv-${e.detail}`)
        // console.log(Number(e.detail), e.detail);
        // if (Number(e.detail) >= 2) {
        //     console.log(1111);
        //     mapFolder = '5/';
        //     currLayer.setUrl(`../../img/map_db/5/{z}_{x}_{y}.jpg`);
          
        // } else {
        //     currLayer.setUrl(`../../img/map_db/0_4/{z}_{x}_{y}.jpg`);
        // }
    })

    // 进攻方视角
    $('.view-change1').on('click', () => {
        if (!window.viewChange) {
            window.viewChange = true;
            window.isViewChange = true;
            $('.btn-view-change').addClass('g')
            $('.btn-view-change').removeClass('f')
            $('.nav-option-ctn').addClass('g');
            $('.nav-option-ctn').removeClass('f');
            $('.war-lv-change-list').attr('class', 'war-lv-change-list g')
           
            warInit(currWarMap, currWarType, true);
            viewChangeToMap();


            setTimeout(() => {
                window.isViewChange = false;
            }, 800);
        }
    })

    // 防守方视角
    $('.view-change2').on('click', () => {
        if (window.viewChange) {
            window.viewChange = false;
            window.isViewChange = true;
            $('.btn-view-change').addClass('f')
            $('.btn-view-change').removeClass('g')
            $('.nav-option-ctn').addClass('f');
            $('.nav-option-ctn').removeClass('g');
            $('.war-lv-change-list').attr('class', 'war-lv-change-list f')


            warInit(currWarMap, currWarType, true);
            // console.log(cacheMarker);
            viewChangeToMap();
            setTimeout(() => {
                window.isViewChange = false;
            }, 800);

        }
    })

    $('.btn-type-change').on('click', (e) => {
        var type = $(e.target).attr('data-type')
        type === 'occupy' ? (window.occupy = true) : (window.occupy = false)
        console.log('window.occupy', window.occupy);
        
        // window.occupy = !window.occupy;
        window.warLv = 0
        $('.lv-change-tips').text(`区域${warLvText[window.warLv]}`)
        if (window.occupy) {
            $('.btn-type-change').addClass('open')
            // $('.war-lv-change-ctn').addClass('show')
            $('.war-lv-change-ctn').removeClass('show')
        } else {
            $('.btn-type-change').removeClass('open')
            $('.war-lv-change-ctn').addClass('show')
         
        }

        changeWarMap(currWarMap, currWarType);
        // initNav();
        // bindOptionEvent();
        // warInit(currWarMap, currWarType);
    })

    $('.lv-change-prev').on('click', () => {
        if (window.isLvChange) return;
        if (window.warLv === 0) return;
        window.isLvChange = true;
        window.warLv--;
        changeWarMap(currWarMap, currWarType);
        // initNav();
        // bindOptionEvent();
        $('.lv-change-tips').text(`区域${warLvText[window.warLv]}`)
        $('.deploy-swiper').removeClass('show')
        map.flyTo([window[currWarMap].info.sectorInit[window.warLv].initX,  window[currWarMap].info.sectorInit[window.warLv].initY], window[currWarMap].info.sectorInit[window.warLv].initZoom)
        listIsAll[currLeftNav] = false;
        $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        setTimeout(() => {
            window.isLvChange = false;
        }, 500)
    })

    $('.lv-change-next').on('click', () => {
        if (window.isLvChange) return;
        if (window.warLv === window[currWarMap].info.sector - 1) return;
        window.isLvChange = true;
        window.warLv++;
        changeWarMap(currWarMap, currWarType);
        // initNav();
        // bindOptionEvent();
        $('.lv-change-tips').text(`区域${warLvText[window.warLv]}`)
        $('.deploy-swiper').removeClass('show')
        console.log('currWarMap', currWarMap);

        map.flyTo([window[currWarMap].info.sectorInit[window.warLv].initX,  window[currWarMap].info.sectorInit[window.warLv].initY], window[currWarMap].info.sectorInit[window.warLv].initZoom)
        listIsAll[currLeftNav] = false;
        $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
        setTimeout(() => {
            window.isLvChange = false;
        }, 500)
    })

    $('.btn-swiper-prev').on('click', () => {
        window.warSwiper.slidePrev();
    })

    $('.btn-swiper-next').on('click', () => {
        window.warSwiper.slideNext();
    })

    $('.war-change-text').on('click', () => {
        if (isWar) return;
        isWar = true;
        resetFloor();
        $('#MapContainer').removeClass('map')
        dom_changeMapBtn.addClass('war')
        $('.btn-war-change').addClass('war')
        $('.btn-war-change').removeClass('fh')
        $('.btn-view-change').addClass('g')
        $('.map-floor').css('display', 'none');
        // changeWarMap('jq', 'pc');
        currWarMap = 'dg';
        currWarType = 'pc'
        changeWarMap('dg', 'pc');


        // initNav();
        // bindOptionEvent();
        $('.war-lv-change-ctn').addClass('show')
        $('.select-region-ctn').css('display', 'none')
    })

    $('.map-change-text').on('click', () => {
        if (!isWar) return;
        isWar = false;
        $('#MapContainer').addClass('map')
        window.occupy = false;
        window.viewChange = true;
        $('.btn-view-change').addClass('g')
        $('.btn-view-change').removeClass('f')
        $('.nav-option-ctn').addClass('g');
        $('.nav-option-ctn').removeClass('f');
        $('.war-lv-change-list').attr('class', 'war-lv-change-list g')
        $('.map-floor').css('display', 'block');
        
        dom_changeMapBtn.removeClass('war')
        $('.btn-war-change').addClass('fh')
        $('.btn-war-change').removeClass('war')
        $('.btn-view-change').attr('class', 'btn-view-change')
        changeMapLv('00');
        warRemove();
        currMap = '0';
        currLv = '0'
        initNav();
        bindOptionEvent();
        $('.war-lv-change-ctn').removeClass('show')
        $('.select-region-ctn').css('display', 'block')
    })

    // 处理楼层切换的通用函数
    function handleFloorChange(index) {
        $('.map-floor-item, .floor-item').removeClass('act');
        $(`.floor_${mapScaleInfo.floor[index].floor_f}`).addClass('act');
        $(`.floor-item-${index}`).addClass('act');
        $('.floor-tips .span1').text(mapScaleInfo.floor[index].floor_name);
        changeMapLv(`${currMap}${currLv}_${mapScaleInfo.floor[index].floor_f}`);
    }

    // 上一层
    $('.floor-change-prev').on('click', () => {
        if (currFloorIndex > 0) {
            currFloorIndex--;
            handleFloorChange(currFloorIndex);
        }
    });

    // 下一层
    $('.floor-change-next').on('click', () => {
        if (currFloorIndex < mapScaleInfo.floor.length - 1) {
            currFloorIndex++;
            handleFloorChange(currFloorIndex);
        }
    });

}

// 视角切换
function viewChangeToMap () {

    $.each(cacheMarker, function (index) {
        if (this.options.icon.name === "进攻方基地" ) {
            console.log(`${window.viewChange ? 'g_jdbsd_g': 'g_jdbsd_r'}`);
            var icon = L.divIcon({
                className: ` map-icon`,
                html: `<div class="map-icon-bg"><img src="../../img/dzc_i/${window.viewChange ? 'g_jdbsd_g': 'g_jdbsd_r'}.png"/></div>`,
                iconSize: [30, 30],			//设置图标大小
                iconAnchor: [15, 15],		//设置图标偏移
            })
            icon.name = '进攻方基地'
            this.setIcon(icon);
        } else if (this.options.icon.name === "防守方基地") {
            var icon = L.divIcon({
                className: ` map-icon`,
                html: `<div class="map-icon-bg"><img src="../../img/dzc_i/${window.viewChange ? 'f_jdbsd_r': 'f_jdbsd_g'}.png"/></div>`,
                iconSize: [30, 30],			//设置图标大小
                iconAnchor: [15, 15],		//设置图标偏移
            })
            icon.name = '防守方基地'
            this.setIcon(icon);
        }
    })
}

// 重制楼层
function resetFloor () {
    $('.map-floor-change-ctn').removeClass('show')
    isFloor = false;
    currFloorIndex = -1;
}

// 地图难度切换
function changeMapLv(type) {
    console.log(bksInfo);
    
    // 地图配置映射表
    const mapConfigs = {
        // 零号大坝配置
        '00': {
            info: dabaInfo,
            nav: navList,
            navInfo: navListInfo,
            icons: mapArticle,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'map_db',
            needRemove: true
        },
        '00_0F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList_firest,
            navInfo: dabaInfo.floorInfo.navList_firest,
            icons: dabaInfo.floorInfo.mapArticle_first,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'map_db',
            needRemove: true
        },
        '00_1F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList_firest,
            navInfo: dabaInfo.floorInfo.navList_firest,
            icons: dabaInfo.floorInfo.mapArticle_first,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'daba_1f',
            needRemove: true
        },
        '00_2F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList_second,
            navInfo: dabaInfo.floorInfo.navList_second,
            icons: dabaInfo.floorInfo.mapArticle_second,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'daba_2f',
            needRemove: true
        },
        '01': {
            info: dabaInfo,
            nav: navList2,
            navInfo: navListInfo2,
            icons: mapArticle2,
            poi: selectRegion,
            name: '零号大坝',
            level: '机密',
            layer: 'map_db',
            needRemove: true
        },
        '01_0F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList2_firest,
            navInfo: dabaInfo.floorInfo.navList2_firest,
            icons: dabaInfo.floorInfo.mapArticle2_first,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'daba_1f',
            needRemove: true
        },
        '01_1F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList2_firest,
            navInfo: dabaInfo.floorInfo.navList2_firest,
            icons: dabaInfo.floorInfo.mapArticle2_first,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'daba_1f',
            needRemove: true
        },
        '01_2F': {
            info: dabaInfo,
            nav: dabaInfo.floorInfo.navList2_second,
            navInfo: dabaInfo.floorInfo.navList2_second,
            icons: dabaInfo.floorInfo.mapArticle2_second,
            poi: selectRegion,
            name: '零号大坝',
            level: '普通',
            layer: 'daba_2f',
            needRemove: true
        },
        // 长弓溪谷配置
        '10': {
            info: cgxgInfo,
            nav: navList_cgxg,
            navInfo: navListInfo_cgxg,
            icons: mapArticle_cgxg,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通',
            layer: 'map_yc',
            needRemove: true
        },
        '10_1F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList_firest,
            navInfo: cgxgInfo.floorInfo.navList_firest,
            icons: cgxgInfo.floorInfo.mapArticle_first,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通',
            layer: 'cgxg_1f',
            needRemove: true
        },
        '10_2F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList_second,
            navInfo: cgxgInfo.floorInfo.navList_second,
            icons: cgxgInfo.floorInfo.mapArticle_second,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通',
            layer: 'cgxg_2f',
            needRemove: true
        },
        '10_s': {
            info: cgxgInfo,
            nav: navList2_cgxg,
            navInfo: navListInfo2_cgxg,
            icons: mapArticle2_cgxg,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通｜坠机事件',
            layer: 'map_yc2',
            needRemove: true
        },
        '10_s_1F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList_s_firest,
            navInfo: cgxgInfo.floorInfo.navList_s_firest,
            icons: cgxgInfo.floorInfo.mapArticle_s_first,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通｜坠机事件',
            layer: 'cgxg_1f',
            needRemove: true
        },
        '10_s_2F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList_s_second,
            navInfo: cgxgInfo.floorInfo.navList_s_second,
            icons: cgxgInfo.floorInfo.mapArticle_s_second,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '普通｜坠机事件',
            layer: 'cgxg_2f',
            needRemove: true
        },
        '11': {
            info: cgxgInfo,
            nav: navList3_cgxg,
            navInfo: navListInfo3_cgxg,
            icons: mapArticle3_cgxg,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密',
            layer: 'map_yc',
            needRemove: true
        },
        '11_1F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList2_firest,
            navInfo: cgxgInfo.floorInfo.navList2_firest,
            icons: cgxgInfo.floorInfo.mapArticle2_first,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密',
            layer: 'cgxg_1f',
            needRemove: true
        },
        '11_2F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList2_second,
            navInfo: cgxgInfo.floorInfo.navList2_second,
            icons: cgxgInfo.floorInfo.mapArticle2_second,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密',
            layer: 'cgxg_2f',
            needRemove: true
        },
        '11_s': {
            info: cgxgInfo,
            nav: navList4_cgxg,
            navInfo: navListInfo4_cgxg,
            icons: mapArticle4_cgxg,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密｜坠机事件',
            layer: 'map_yc2',
            needRemove: true
        },
        '11_s_1F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList2_s_firest,
            navInfo: cgxgInfo.floorInfo.navList2_s_firest,
            icons: cgxgInfo.floorInfo.mapArticle2_s_first,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密｜坠机事件',
            layer: 'cgxg_1f',
            needRemove: true
        },
        '11_s_2F': {
            info: cgxgInfo,
            nav: cgxgInfo.floorInfo.navList2_s_second,
            navInfo: cgxgInfo.floorInfo.navList2_s_second,
            icons: cgxgInfo.floorInfo.mapArticle2_s_second,
            poi: selectRegion_cgxg,
            name: '长弓溪谷',
            level: '机密｜坠机事件',
            layer: 'cgxg_2f',
            needRemove: true
        },
        // 航天基地配置
        '21': {
            info: htjdInfo,
            nav: navList_htjd,
            navInfo: navListInfo_htjd,
            icons: mapArticle_htjd,
            poi: selectRegion_htjd,
            name: '航天基地',
            level: '机密',
            layer: 'map_htjd',
            needRemove: true
        },
        '22': {
            info: htjdInfo,
            nav: navList2_htjd,
            navInfo: navListInfo2_htjd,
            icons: mapArticle2_htjd,
            poi: selectRegion_htjd,
            name: '航天基地',
            level: '绝密',
            layer: 'map_htjd',
            needRemove: true
        },
        // 巴克什配置
        '30': {
            info: bksInfo,
            nav: navList_bks,
            navInfo: navListInfo_bks,
            icons: mapArticle_bks,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '普通',
            layer: 'map_bks2',
            needRemove: true
        },
        '31': {
            info: bksInfo,
            nav: navList_bks,
            navInfo: navListInfo_bks,
            icons: mapArticle_bks,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '机密',
            layer: 'map_bks2',
            needRemove: true
        },
        '31_1F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList_firest,
            navInfo: bksInfo.floorInfo.navList_firest,
            icons: bksInfo.floorInfo.mapArticle_first,
            poi: selectRegion_cgxg,
            name: '巴克什',
            level: '机密',
            // layer: 'map_bks2',
            layer: 'bks_1f',
            needRemove: true
        },
        '31_2F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList_second,
            navInfo: bksInfo.floorInfo.navList_second,
            icons: bksInfo.floorInfo.mapArticle_second,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '机密',
            // layer: 'map_bks2',
            layer: 'bks_2f',
            needRemove: true
        },
        '31_3F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList_three,
            navInfo: bksInfo.floorInfo.navList_three,
            icons: bksInfo.floorInfo.mapArticle_three,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '机密',
            // layer: 'map_bks2',
            layer: 'bks_3f',
            needRemove: true
        },
        '32': {
            info: bksInfo,
            nav: navList2_bks,
            navInfo: navListInfo2_bks,
            icons: mapArticle2_bks,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '绝密',
            layer: 'map_bks2',
            needRemove: true
        },
        '32_1F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList2_firest,
            navInfo: bksInfo.floorInfo.navList2_firest,
            icons: bksInfo.floorInfo.mapArticle2_first,
            poi: selectRegion_cgxg,
            name: '巴克什',
            level: '绝密',
            // layer: 'map_bks2',
            layer: 'bks_1f',
            needRemove: true
        },
        '32_2F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList2_second,
            navInfo: bksInfo.floorInfo.navList2_second,
            icons: bksInfo.floorInfo.mapArticle2_second,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '绝密',
            // layer: 'map_bks2',
            layer: 'bks_2f',
            needRemove: true
        },
        '32_3F': {
            info: bksInfo,
            nav: bksInfo.floorInfo.navList2_three,
            navInfo: bksInfo.floorInfo.navList2_three,
            icons: bksInfo.floorInfo.mapArticle2_three,
            poi: selectRegion_bks,
            name: '巴克什',
            level: '绝密',
            // layer: 'map_bks2',
            layer: 'bks_3f',
            needRemove: true
        },
    };

    // 获取当前地图配置
    const config = mapConfigs[type];
    console.log("mapConfigs", type);
    
    if (!config) {
        toastTips();
        return;
    }

    // 更新地图状态
    mapScaleInfo = config.info;
    allNavList = config.nav;
    navTypeList = config.navInfo;
    mapIcons = config.icons;
    poiInfo = config.poi;

    // 更新UI
    $('.curr-map-name').html(`${config.name} <span class="map-lv"> ( ${config.level} )</span>`);
    
    // 切换地图图层
    if (config.needRemove) {
        map.removeLayer(currLayer);
    }
    if (currLayer.name !== config.layer) {
        addLayer(config.layer);
    }
    if (config.needRemove) {
        map.addLayer(currLayer);
    }

    // 重置标记状态
    typeListInit = false;
    resetAll('none');
    initFloor();

    // 更新按钮状态和可见性
    if (listIsAll[currLeftNav]) {
        toggleVisible(`${currLeftNav}_all`, currLeftNav);
        $('.btn-choose-all-icon').attr('class', 'img_all_open btn-choose-all-icon');
    } else {
        toggleVisible(`${currLeftNav}_none`, currLeftNav);
        $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon');
    }

    // 渲染导航类型列表
    if (!isFloor) {
        renderNavTypeList(
            Number(currLeftNav) === 0 ? allNavList[0].typeList : navTypeList[currLeftNav].typeList,
            currLeftNav
        );
    } else {
        renderNavTypeList(allNavList, 0);
    }

    bindOptionEvent();
}


// 战场切换
function changeWarMap(mapName, type) {
    visibleMarker = {}
    mapScaleInfo = window[mapName].info;
    poiInfo =  window[mapName].region;
    if (window.occupy) {
        mapIcons = window[`${mapName}_${type}_s`].mapArticle;
        allNavList = window[`${mapName}_${type}_s`].navRegion;
        navTypeList = window[`${mapName}_${type}_s`].navRegionInfo;
        if (currLayer.name !== mapScaleInfo.names) {
            map.removeLayer(currLayer)
            addLayer(mapScaleInfo[`names_${currWarType}`])
        }
    } else {
        mapIcons = window[`${mapName}_${type}`].mapArticle[window.warLv];
        allNavList = window[`${mapName}_${type}`].navRegion[window.warLv];
        navTypeList = window[`${mapName}_${type}`].navRegionInfo[window.warLv];
        if (currLayer.name !== mapScaleInfo.name) {
            map.removeLayer(currLayer)
            addLayer(mapScaleInfo[`name_${currWarType}`])
        }
    }

    const title = !window.occupy ? window[`${mapName}_${type}`].title : window[`${mapName}_${type}_s`].title
    $('.curr-map-name').html(title)



    typeListInit = false;

    initNav();
    warInit(currWarMap, currWarType);


    bindOptionEvent();
}

// 战场初始化
function warInit (mapName, type, isBorder = false) {

    var init;
    init = window.occupy ? window[`${mapName}_${type}_s`].init : window[`${mapName}_${type}`].init
    // if (window.viewChange) {
    //     init = window.occupy ? window[`${mapName}_${type}_s`].init_g : window[`${mapName}_${type}`].init_g
    // } else {
    //     init = window.occupy ? window[`${mapName}_${type}_s`].init_s : window[`${mapName}_${type}`].init_s
    // }
    if (!window.isViewChange) {
        listIsAll[currLeftNav] = false;
        $('.btn-choose-all-icon').attr('class', 'img_all_close btn-choose-all-icon')
    }


    $.each(borderList, function () {
        this.remove();

    });

    if (!isBorder) {
        $.each(warMark, function () {
            this.remove();

        });

        $.each(cacheMarker, function () {
            this.remove();

        });
    } else {
        $.each(cacheMarker, function () {
            console.log(111, this.options);
            if (this.options.icon.name) {
                if (this.options.icon.name.indexOf('据点') > -1) {

                    this.remove();
                }
            }
            if (this.options.icon.options.html.indexOf('jd') > -1) {
                this.remove();
            }


        });
    }



    console.log('cacheMarker', cacheMarker);


    // visibleMarker = []
    // cacheMarker = []

    borderList = []

    var initList = [];
    // 是否是占领模式
    if (window.occupy) {
        initList = init
    } else {
        initList = init[window.warLv].typeList
    }

    let lineHtmlg = ''
    let lineHtmlf = ''
    let lineHtmlz = ''
    let lineHtml = ''

    console.log(window[`${currWarMap}`]);

    for (let index = 0; index < window[`${currWarMap}`].info.sector; index++) {
        lineHtml += `
            <div class="war-lv-item war-lv-item-${index} ${window.warLv === index && 'active'}" data-index="${index}"></div>
        `

    }
    $('.war-lv-change-list').html(lineHtml)

    $('.war-lv-item').on('click', (e) => {
        var index = $(e.target).attr('data-index')
        window.warLv = Number(index);
        changeWarMap(currWarMap, currWarType);
        // initNav();
        // bindOptionEvent();
        $('.lv-change-tips').text(`区域${warLvText[window.warLv]}`)
        $('.deploy-swiper').removeClass('show')
        map.flyTo([window[currWarMap].info.sectorInit[window.warLv].initX,  window[currWarMap].info.sectorInit[window.warLv].initY], window[currWarMap].info.sectorInit[window.warLv].initZoom)
    })

    // console.log('init.border', window[mapName].info);
    testWarInit(init);
    return;
    // drawBorderPub('red', window[mapName].info.border, window[mapName].info.border2)
    for (let index = 0; index < initList.length; index++) {
        const element = initList[index];

        if (element.border) {
            // if (element.region.indexOf('进攻') > -1) {
            //     drawBorder('red', element.border)
            // }

            //  if (element.region.indexOf('防守') > -1){
            //     drawBorder('green', element.border)
            // }

            // if (element.isRegion === 'true') {
            //     drawBorder('white', element.border)
            // }

            if (element.name.indexOf('据点') > -1) {
                drawBorder(window.occupy ? 'white' : 'green', element.border, true)
            } else {
                if (element.region.indexOf('进攻') > -1 || element.region.indexOf('GTI') > -1) {
                    drawBorder(window.viewChange ? 'green' : 'red', element.border)
                } else if (element.region.indexOf('防守') > -1 || element.region.indexOf('HAAVK') > -1){
                    drawBorder(window.viewChange ? 'red' : 'green', element.border)
                } else {
                    drawBorder('white', element.border)
                }
            }



        }

        if (element.isRegion === "false") {
            console.log(element.x, element.y);

            var pos = getMapPos(element.x, element.y)
            let myIcon;
            if (element.name.indexOf('据点') > -1) {
                lineHtmlz += `<div class="war-lv-jd img_nav_jd_${element['自定义区域']}"></div>`
            } else {
                if (element.region.indexOf('进攻') > -1 || element.region.indexOf('GTI') > -1) {
                    lineHtmlg += `<div class="war-lv-item ${window.viewChange ? 'green' : 'red'}"></div>`
                } else if (element.region.indexOf('防守') > -1 || element.region.indexOf('HAAVK') > -1){
                    lineHtmlf += `<div class="war-lv-item ${window.viewChange ? 'red' : 'green'}"></div>`
                }
            }
           let icon;
           if (element.name === "进攻方基地" ) {
                icon = window.viewChange ? 'g_jdbsd_g': 'g_jdbsd_r'
            } else if (element.name === "防守方基地") {
                icon = window.viewChange ? 'f_jdbsd_r': 'f_jdbsd_g'
            } else {
                icon = element.icon
            }

            if (element.rotate) {
                let rotate = currWarMap === 'qhz' ? 90 : 180
                console.log('rotate', currWarMap);

                myIcon = L.divIcon({
                    className: ` map-war-icon`,
                    html: `<div class="map-icon-bg" style="transform: translate3d(-50%, -50%, 0)"><img src="../../img/dzc_i/${icon}.png" style="transform:  rotate(${Number(element.rotate) + rotate}deg)"/></div>`,
                    iconSize: [30, 30],			//设置图标大小
                    iconAnchor: [15, 15],		//设置图标偏移
                })
            } else {
                myIcon = L.divIcon({
                    className: ` map-war-icon`,
                    html: `<div class="map-icon-bg"><img src="../../img/dzc_i/${icon}.png"/></div>`,
                    iconSize: [30, 30],			//设置图标大小
                    iconAnchor: [15, 15],		//设置图标偏移
                })
            }
            myIcon.name = element.name;
            myIcon.icon = icon;
            visibleMarker[element.name] = true;
            $(`.nav-list-nav${icon.substring(1)}`).addClass('active')
            if (element['激活条件']) {
                var popupHtml =`
                    <div class="name">${element.name}</div>
                     <div class="open-text war ${(!element['激活条件'] || element['激活条件'] === '' || element['激活条件'] === '-') ? 'hide': ''}">激活条件：<span>${element['激活条件']}</span></div>
                     `
            } else {
                var popupHtml = `
                <div class="name">${element.name}</div>
            `;
            }
           
            console.log('pos', pos);
            
            // popupHtml += '</div>';
            cacheMarker.push(L.marker([pos.y, pos.x], {icon: myIcon}).bindPopup(popupHtml).addTo(map).on({
                click: function () {
                    currClickMarker?.setIcon(currClickMarker?.myIcon)
                    this.isClick = true;
                    this.myIcon = myIcon;
                    console.log(this);
                    let rotate = currWarMap === 'qhz' ? 90 : 180
                    this.openPopup();
                    this.setIcon( L.divIcon({
                        className: ` map-icon click`,
                        html: `<div class="map-icon-bg" style="${element?.rotate ? `transform: translate3d(-50%, -50%, 0) rotate(${Number(element?.rotate) + rotate}deg)` : ''}"><img src="../../img/dzc_i/${icon}.png"/></div>`,
                        iconSize: [30, 30],			//设置图标大小
                        iconAnchor: [15, 15],		//设置图标偏移
                    }));
                    currClickMarker = this;
                    $(this.getElement()).addClass('click')
                    
                    console.log(this.myIcon);
                    
                    if (this.myIcon.name.indexOf('基地') > -1 || (this.myIcon.name.indexOf('据点') > -1 && window.occupy)) {
                        initWarSwiper(this.myIcon.name, element);
                    }
                    
                    // this?.remove()
                }
            }))
            
            
           
        }

       
    }

    
}

function testWarInit (list) {
    let lineHtmlg = ''
    let lineHtmlf = ''
    let lineHtmlz = ''
    let lineHtml = ''
    for (let index_f = 0; index_f < list.length; index_f++) {
        const element_f = list[index_f];
        console.log(111, element_f);
        
        for (let index = 0; index < element_f.typeList.length; index++) {
            const element = element_f.typeList[index];
            console.log(222, element);
            
            if (element.border) {
                // if (element.region.indexOf('进攻') > -1) {
                //     drawBorder('red', element.border)
                // }
    
                //  if (element.region.indexOf('防守') > -1){
                //     drawBorder('green', element.border)
                // }
    
                // if (element.isRegion === 'true') {
                //     drawBorder('white', element.border)
                // }
    
                if (element.name.indexOf('据点') > -1) {
                    drawBorder(window.occupy ? 'white' : 'green', element.border, true)
                } else {
                    if (element.region.indexOf('进攻') > -1 || element.region.indexOf('GTI') > -1) {
                        drawBorder(window.viewChange ? 'green' : 'red', element.border)
                    } else if (element.region.indexOf('防守') > -1 || element.region.indexOf('HAAVK') > -1){
                        drawBorder(window.viewChange ? 'red' : 'green', element.border)
                    } else {
                        drawBorder('white', element.border)
                    }
                }
    
    
    
            }
    
            if (element.isRegion === "false") {
                console.log(element.x, element.y);
    
                var pos = getMapPos(element.x, element.y)
                let myIcon;
                if (element.name.indexOf('据点') > -1) {
                    lineHtmlz += `<div class="war-lv-jd img_nav_jd_${element['自定义区域']}"></div>`
                } else {
                    if (element.region.indexOf('进攻') > -1 || element.region.indexOf('GTI') > -1) {
                        lineHtmlg += `<div class="war-lv-item ${window.viewChange ? 'green' : 'red'}"></div>`
                    } else if (element.region.indexOf('防守') > -1 || element.region.indexOf('HAAVK') > -1){
                        lineHtmlf += `<div class="war-lv-item ${window.viewChange ? 'red' : 'green'}"></div>`
                    }
                }
               let icon;
               if (element.name === "进攻方基地" ) {
                    icon = window.viewChange ? 'g_jdbsd_g': 'g_jdbsd_r'
                } else if (element.name === "防守方基地") {
                    icon = window.viewChange ? 'f_jdbsd_r': 'f_jdbsd_g'
                } else {
                    icon = element.icon
                }
    
                if (element.rotate) {
                    let rotate = currWarMap === 'qhz' ? 90 : 180
                    console.log('rotate', currWarMap);
    
                    myIcon = L.divIcon({
                        className: ` map-war-icon`,
                        html: `<div class="map-icon-bg" style="transform: translate3d(-50%, -50%, 0)"><img src="../../img/dzc_i/${icon}.png" style="transform:  rotate(${Number(element.rotate) + rotate}deg)"/></div>`,
                        iconSize: [30, 30],			//设置图标大小
                        iconAnchor: [15, 15],		//设置图标偏移
                    })
                } else {
                    myIcon = L.divIcon({
                        className: ` map-war-icon`,
                        html: `<div class="map-icon-bg"><img src="../../img/dzc_i/${icon}.png"/></div>`,
                        iconSize: [30, 30],			//设置图标大小
                        iconAnchor: [15, 15],		//设置图标偏移
                    })
                }
                myIcon.name = element.name;
                myIcon.icon = icon;
                visibleMarker[element.name] = true;
                $(`.nav-list-nav${icon.substring(1)}`).addClass('active')
                if (element['激活条件']) {
                    var popupHtml =`
                        <div class="name">${element.name}</div>
                         <div class="open-text war ${(!element['激活条件'] || element['激活条件'] === '' || element['激活条件'] === '-') ? 'hide': ''}">激活条件：<span>${element['激活条件']}</span></div>
                         `
                } else {
                    var popupHtml = `
                    <div class="name">${element.name}</div>
                `;
                }
               
                console.log('pos', pos);
                
                // popupHtml += '</div>';
                cacheMarker.push(L.marker([pos.y, pos.x], {icon: myIcon}).bindPopup(popupHtml).addTo(map).on({
                    click: function () {
                        currClickMarker?.setIcon(currClickMarker?.myIcon)
                        this.isClick = true;
                        this.myIcon = myIcon;
                        console.log(this);
                        let rotate = currWarMap === 'qhz' ? 90 : 180
                        this.openPopup();
                        this.setIcon( L.divIcon({
                            className: ` map-icon click`,
                            html: `<div class="map-icon-bg" style="${element?.rotate ? `transform: translate3d(-50%, -50%, 0) rotate(${Number(element?.rotate) + rotate}deg)` : ''}"><img src="../../img/dzc_i/${icon}.png"/></div>`,
                            iconSize: [30, 30],			//设置图标大小
                            iconAnchor: [15, 15],		//设置图标偏移
                        }));
                        currClickMarker = this;
                        $(this.getElement()).addClass('click')
                        
                        console.log(this.myIcon);
                        
                        if (this.myIcon.name.indexOf('基地') > -1 || (this.myIcon.name.indexOf('据点') > -1 && window.occupy)) {
                            initWarSwiper(this.myIcon.name, element);
                        }
                        
                        // this?.remove()
                    }
                }))
                
                
               
            }
    
           
        }
        
    }

}

// 清除战场
function warRemove () {
    $.each(borderList, function () {
        this.remove();
    
    });
    $.each(warMark, function () {
        this.remove();
    
    });
}

// 部署swiper
function initWarSwiper (name, data) {
    if (window.warSwiper) {
        window.warSwiper.destroy(true);
    }

    let html = '';
    console.log(data);
    let list = window.occupy ? window[currWarMap + '_' + currWarType + '_s'].deploy : window[currWarMap + '_' + currWarType].deploy[window.warLv]
    console.log(name, list);
    // if (!list) return;
    let length = 0;
    
   
    $.each(list, function(index) {
        
        if (name.indexOf(this['阵营']) > -1 && !window.occupy) {
            length++;
            if (this?.type) {
                html += ` <div class="swiper-slide">
                <div class="slide-name">${this.name}</div>
                <div class="slide-bot">
                    <div class="slide-img-ctn">
                        <div class="slide-img ${this.icon}"></div>
                    </div>
                    <div class="slide-info">
                        <div class="slide-help">所需积分:${this.num}</div>
                    </div>
                </div>
            </div>`
            } else if (this['阵营'] === data['name']) { 
                html += ` <div class="swiper-slide">
                <div class="slide-name">${this.name}</div>
                <div class="slide-bot">
                    <div class="slide-img-ctn">
                        <div class="slide-img ${this.icon}"></div>
                    </div>
                    <div class="slide-info">
                        <div class="slide-tiem">${this.CD}s</div>
                        <div class="slide-num">可部署:${this.num}</div>
                    </div>
                </div>
            </div>`
            } else {
                if (this['备注'] !== data['自定义区域']) return;
                html += ` <div class="swiper-slide">
                <div class="slide-name">${this.name}</div>
                <div class="slide-bot">
                    <div class="slide-img-ctn">
                        <div class="slide-img ${this.icon}"></div>
                    </div>
                    <div class="slide-info">
                        <div class="slide-tiem">${this.CD}s</div>
                        <div class="slide-num">可部署:${this.num}</div>
                    </div>
                </div>
            </div>`
            }
        // } else if ((name.indexOf(this['阵营']) > -1) && window.occupy) {
        } else if (this['备注'] === data['自定义区域'] && window.occupy) {
            console.log('有', this['备注'], data['自定义区域']);
            
            length++;
                html += ` <div class="swiper-slide">
                <div class="slide-name">${this.name}</div>
                <div class="slide-bot">
                    <div class="slide-img-ctn">
                        <div class="slide-img ${this.icon}"></div>
                    </div>
                    <div class="slide-info">
                        <div class="slide-tiem">${this.CD}s</div>
                        <div class="slide-num">可部署:${this.num}</div>
                    </div>
                </div>
            </div>`
        } else if (this['阵营'] === data['name']) {
            html += ` <div class="swiper-slide">
                <div class="slide-name">${this.name}</div>
                <div class="slide-bot">
                    <div class="slide-img-ctn">
                        <div class="slide-img ${this.icon}"></div>
                    </div>
                    <div class="slide-info">
                        <div class="slide-tiem">${this.CD}s</div>
                        <div class="slide-num">可部署:${this.num}</div>
                    </div>
                </div>
            </div>`
        }
        // console.log(this['备注'], data['自定义区域'], this['备注'] === data['自定义区域']);
        
        

        
    })

    if (length < 7) {
        $('.btn-swiper-prev').css('display', 'none')
        $('.btn-swiper-next').css('display', 'none')
    } else {
        $('.btn-swiper-prev').css('display', 'block')
        $('.btn-swiper-next').css('display', 'block')
    }
    
 
    $('.swiper-wrapper').html(html)

    window.warSwiper= new Swiper('.swiper-container', {
        slidesPerView: 'auto',
    });

    if (html !== '') {
        $('.deploy-swiper').addClass('show')
    } else {
        $('.deploy-swiper').removeClass('show')
    }
  

    
}
window.addEventListener('load', () => {
    init();
    console.log(document.querySelector('.left-nav-ctn'));
});


function loucengTest () {
    let x = 364900.000000;
    let y = -788316.875000
    let z =-20885.804688
    let w = 500.000000 * 7.830000 * 1.5
    let c = 500.000000 * 6.697500 * 1.5
    let h = 300.000000 * 1.250000
    // var posLeftB = getMapPos(x, y)
    // 左下
    // var posLeftB = getMapPos(x - w, y + c)
    // 右上
    var posLeftB = getMapPos(x + w, y - c)
    var posTopR = getMapPos(x + w, y)
    // var posLeftB = getMapPos(x, y)
    // var posTopR = getMapPos(x, y)
    var imageUrl = '../../img/test/512_Office_1F.png';
    console.log(posLeftB);
    let html = ''
    var myIcon =  L.divIcon({
        className: ` map-region-name`,
        html: `<div class="map-region-name">楼</div>`,
    })
      html+= `<div class="region-item ">楼</div>`
    // var pos = getMapPos(posLeftB.x, posLeftB.y)
  
    // regionList.append(`<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`)
 
    L.marker([posLeftB.y, posLeftB.x], {icon: myIcon}).addTo(map)
    // imageBounds = [[posLeftB.y, posLeftB.x], [posTopR.y, posTopR.x]];
//     imageBounds = [[-67.44384696592726, 79.68960903628746], [-67.44384696592726, 139.68960903628746]];
// L.imageOverlay(imageUrl, imageBounds).addTo(map);
}