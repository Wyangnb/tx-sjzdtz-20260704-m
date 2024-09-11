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


// 导航相关
var navTypyList = $('.nav-type-list')
var regionList = $('.region-list')
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
// var mapScaleInfo = cgxgInfo
function getMapPos (posX, posY) {
    console.log(111, clickMap);
    
    var x = Number(posX)
    var y = Number(posY)
    // x轴转换计算公式：世界轴 / 设计稿宽度/2
    // x轴倍率：81086.304688 / 4096 = 19.79646110546875
    // var xB = 81086.304688 / 4096
    // 81086.304688 / 128
    var xB2 = mapScaleInfo.width / 128

    // y轴计算公式：世界轴 / 设计稿宽度/2
    // y轴倍率：80988.500000 / 4096 = 19.7725830078125
    // var yB = 80988.500000 / 4096 / -128
    var yB2 = mapScaleInfo.height / 128

    // 世界中心轴x： 358155.687500； y： 750191.750000
    // return {x:  (mapScaleInfo.centerX - x ) / xB2, y: - (mapScaleInfo.centerY + y ) / yB2}
    if (clickMap == 1) {
        return {x: 128 - (mapScaleInfo.centerY + y ) / yB2, y: -128 + (mapScaleInfo.centerX - x ) / xB2}
    } else{
        return {x: 128 - (mapScaleInfo.centerX - x ) / xB2, y: -128 - (mapScaleInfo.centerY + y ) / yB2}
    }
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

// 标点
	var map
    var mapFolder = '0_4/'
    var cacheMarker = [];
    var removeCacheMarker = [];
    var markerList = [];
    var currClickMarker;

    // 切换地图
    var dom_changeMapBtn = $('.curr-map-name')
    var dom_mapList = $('.map-list')
    var dom_map_lv = $('.curr-map-lv')
    var dom_map_lv_list = $('.map-lv-list')
    var currMap = '0';
    var clickMap = '0';
    var currLv = '0'
    var isZj = false;
    var mapChangeIsClick = false;
    var mapLvIsClick = false;
    var rightNavIsClick = false;

    var showCheck = false;


var markerPop = $('.marker-pop-ctn')
var markerName = $('.marker-pop-ctn .marker-name')
var addressName = $('.marker-pop-ctn .address-name')

function refreshMarker2(from, arr) {
    $.each(cacheMarker, function () {
        this.remove();
    
    });
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
            if (item['自定义区域']) {
                var popupHtml = `
                <div class="name">${this.name}${item['自定义区域'] !== ''? `<span> ( ${item['自定义区域']} ) </span>`: ''}</div>
                <div class="address">地点：<span>${item['自定义区域']}</span></div>
            `;
            } else {
                var popupHtml = `
                <div class="name">${this.name}${item['自定义区域'] !== ''? `<span> ( ${item['自定义区域']} ) </span>`: ''}</div>
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
            if (this.icon) {
                var myIcon =  L.divIcon({
                    className: ` map-icon`,
                    html: `<div class="map-icon-bg"><img src="../../img/xdaba/${that.icon}.png"/></div>`,
                    iconSize: [30, 30],			//设置图标大小
                    iconAnchor: [15, 15],		//设置图标偏移
                })
                
                cacheMarker.push(L.marker([pos.y, pos.x], {icon:  myIcon}).bindPopup(popupHtml).addTo(map).on({
                    click: function () {
                        currClickMarker?.setIcon(currClickMarker?.myIcon)
                        this.isClick = true;
                        this.myIcon = myIcon;
                        this.openPopup();
                        this.setIcon( L.divIcon({
                            className: ` map-icon click`,
                            html: `<div class="map-icon-bg"><img src="../../img/xdaba/${that.icon}.png"/></div>`,
                            iconSize: [50, 50],			//设置图标大小
                            iconAnchor: [25, 25],		//设置图标偏移
                        }));
                        currClickMarker = this;
                        $(this.getElement()).addClass('click')
                        // this?.remove()
                        markerName.html(`${that.name}${item['拾取条件'] && item['拾取条件'] !== ''? `<span> ( ${item['拾取条件']} ) </span>`: ''}`)
                        addressName.html(that['自定义区域'])
                        markerPop.addClass('show')
                    },
                    popupclose: function () {
                        markerPop.removeClass('show')
                    }
                }))
            }
            
        }
      
    });
    isRemove = false;
    console.log('设置false');
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
    console.log('type', type);
    function renderMarker () {
        if (Number(currLeftNav) === 0) {
            for (var o in visibleMarker) {
                if (visibleMarker.hasOwnProperty(o)) {
                    visibleMarker[o] = (type.indexOf('all') > 0 ? true : false);
                }
            }
        } else {
            for (let index = 0; index < navTypeList[currLeftNav].typeList.length; index++) {
                const element = navTypeList[currLeftNav].typeList[index];
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
    var mapWidth = mapScaleInfo.boundsW;  
    var mapHeight = mapScaleInfo.boundsH;  
    var mapOrigin = L.latLng(0, 0);
    var pixelToLatLngRatio = -1;
    var southWest = mapOrigin; // 左上角  
    var northEast = L.latLng((mapHeight - 70) * pixelToLatLngRatio, mapWidth * pixelToLatLngRatio); // 右下角  
    var bounds = L.latLngBounds(southWest, northEast);  

    map = L.map('MapContainer', {
        crs: L.CRS.Simple,
        attributionControl: false,
        zoomControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: mapScaleInfo.minZoom,
        maxZoom: 8,
        preferCanvas: true,
        smoothSensitivity: 1,   // zoom speed. default is 1
        zoomSnap: .1,
        wheelDebounceTime: 10
    }).setView([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom);
    // let control = new L.Control.Zoomslider()
    // map.addControl(control);

    addLayer('map_db');


    map.on('click', function(e) {
        if (!currClickMarker) return;
        currClickMarker.setIcon(currClickMarker.myIcon)
     });
 
     $('.leaflet-popup-pane').on('click', (e) => {
         console.log(e);
         console.log(currClickMarker);
         currClickMarker?.closePopup();
         currClickMarker?.setIcon(currClickMarker.myIcon)
     })

    initNav();
    bindEvent();
};

function addLayer (mapName) {
    console.log(mapScaleInfo);
    var mapWidth = mapScaleInfo.boundsW;  
    var mapHeight = mapScaleInfo.boundsH;  
    var mapOrigin = L.latLng(0, 0);
    var pixelToLatLngRatio = -1;
    var southWest = mapOrigin; // 左上角  
    var northEast = L.latLng((mapHeight - 70) * pixelToLatLngRatio, mapWidth * pixelToLatLngRatio); // 右下角  

    var bounds = L.latLngBounds(southWest, northEast);  
    console.log(northEast, bounds);
    currLayer = L.tileLayer(`../../img/${mapName}/{z}_{x}_{y}.jpg`, {
        minZoom: mapScaleInfo.minZoom,
        maxZoom: 8,
        maxNativeZoom: 5,
        noWrap: true,
        attribution: '© OpenStreetMap contributors',
        bounds: bounds
    }).addTo(map);
    currLayer.name = mapName

    map.setMaxBounds(bounds)
    map.options.minZoom = mapScaleInfo.minZoom;
    map.setView([mapScaleInfo.initX, mapScaleInfo.initY], mapScaleInfo.initZoom)
    console.log('mapScaleInfo.minZoom', mapScaleInfo.minZoom, mapScaleInfo.initZoom);

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
    var pos = getMapPos(item.x, item.y)
     html+= `<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`
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
    var navLeft = $('.nav-options');
    allNavList.forEach(function (item, index) {
        navLeft.append(`<div class="nav-option-item nav-option-item-${index} ${currLeftNav === index ? 'active': ''}" data-index="${index}"></div>`)

    })
    renderNavTypeList(allNavList[0].typeList, 0)

        
    selectRegion.forEach(function (item, index) {
        regionList.append(`<div class="region-item region-item-${index}" data-x="${item.x}" data-y="${item.y}">${item.name}</div>`)
    })
}

var renderNavTypeList = function (list, navIndex = 0){
    var html = ''
    if (list.length > 15) {
        html = '<div class="fgx top0">物资点</div>'
    }
    list.forEach(function (item, index) {
        // console.log(visibleMarker[item.name], item.name);
        if (item.name === '行动接取站' || item.name === '高价值接取站') return;
        if (item.name === '付费撤离点' || item.name === '拉闸撤离点') {
            html+=`
            <div class="fgx ${list.length > 15 ? '' : 'top0'}">撤离点</div>
                <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? `img_${item.icon}_click active`: `img_${item.icon}`}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
                <div class="wz-bg">
                    <div class="wz-num">${item.num}</div>
                </div>
                <div class="wz-name">${item.name}</div>
            </div>`
        } else if (item.name === '出生点' || item.name === '撤离点' || item.name === '首领' || item.name === '行动接取站') {
            html+=`
            <div class="fgx ${list.length > 15 ? '' : 'top0'}">${item.name}</div>
                <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? `img_${item.icon}_click active`: `img_${item.icon}`}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
                <div class="wz-bg">
                    <div class="wz-num">${item.num}</div>
                </div>
                <div class="wz-name">${item.name}</div>
            </div>`
        } else {
            html+=`
            <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? `img_${item.icon}_click active`: `img_${item.icon}`}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
                <div class="wz-bg">
                    <div class="wz-num">${item.num}</div>
                </div>
                <div class="wz-name">${item.name}</div>
            </div>`
        }
       
        
       !typeListInit && (visibleMarker[item.name] = false)
    })
    navTypyList.html(html)
    typeListInit = true;
    visibleMarker2[navIndex].isInit = true;
}

function toastTips () {
    $('.m-toast').show();
    setTimeout(() => {
        $('.m-toast').hide();
    }, 800)
}

// 地图难度切换
function changeMapLv(type) {
    console.log('难度', type);

    switch (type) {
        case '00':
            mapScaleInfo = dabaInfo;
            allNavList = navList;
            navTypeList = navListInfo;
            mapIcons = mapArticle;
            poiInfo = selectRegion;
            $('.map-lv').text('( 普通 )')
            $('.curr-map-name').text('零号大坝')
            currLayer.name !== 'map_db' && addLayer('map_db')
            break;
        case '01':
            mapScaleInfo = dabaInfo;
            allNavList = navList2;
            navTypeList = navListInfo2;
            mapIcons = mapArticle2;
            poiInfo = selectRegion;
            $('.map-lv').text('( 机密 )')
            $('.curr-map-name').text('零号大坝')
            currLayer.name !== 'map_db' && addLayer('map_db')
            break;
        case '10':
            mapScaleInfo = cgxgInfo;
            allNavList = navList_cgxg;
            navTypeList = navListInfo_cgxg;
            mapIcons = mapArticle_cgxg;
            poiInfo = selectRegion_cgxg;
            $('.map-lv').text('( 普通 )')
            $('.curr-map-name').text('长弓溪谷')
            map.removeLayer(currLayer)
            currLayer.name !== 'map_yc' && addLayer('map_yc')
            map.addLayer(currLayer);
            // toastTips();
            break;
        case '10_s':
            mapScaleInfo = cgxgInfo;
            allNavList = navList2_cgxg;
            navTypeList = navListInfo2_cgxg;
            mapIcons = mapArticle2_cgxg;
            poiInfo = selectRegion_cgxg;
            $('.map-lv').text('( 普通 )')
            $('.curr-map-name').text('长弓溪谷')
            map.removeLayer(currLayer)
            currLayer.name !== 'map_yc2' && addLayer('map_yc2')
            map.addLayer(currLayer);
            // toastTips();
            break;
            case '11':
                mapScaleInfo = cgxgInfo;
                allNavList = navList3_cgxg;
                navTypeList = navListInfo3_cgxg;
                mapIcons = mapArticle3_cgxg;
                poiInfo = selectRegion_cgxg;
                $('.map-lv').text('( 普通 )')
                $('.curr-map-name').text('长弓溪谷')
                map.removeLayer(currLayer)
                currLayer.name !== 'map_yc' && addLayer('map_yc')
                map.addLayer(currLayer);
                // toastTips();
                break;
            case '11_s':
                mapScaleInfo = cgxgInfo;
                allNavList = navList4_cgxg;
                navTypeList = navListInfo4_cgxg;
                mapIcons = mapArticle4_cgxg;
                console.log('我操死你吗');
                
                poiInfo = selectRegion_cgxg;
                $('.map-lv').text('( 普通 )')
                $('.curr-map-name').text('长弓溪谷')
                map.removeLayer(currLayer)
                currLayer.name !== 'map_yc2' && addLayer('map_yc2')
                map.addLayer(currLayer);
                // toastTips();
                break;
            case '22':
                mapScaleInfo = htjdInfo;
                allNavList = navList2_htjd;
                navTypeList = navListInfo2_htjd;
                mapIcons = mapArticle2_htjd;
                poiInfo = selectRegion_htjd;
                $('.map-lv').text('( 绝密 )')
                $('.curr-map-name').text('航天基地')
                map.removeLayer(currLayer)
                currLayer.name !== 'map_htjd' && addLayer('map_htjd')
                map.addLayer(currLayer);
                break;
        default:
            toastTips();
            break;
    }
    typeListInit = false;
    resetAll('none')
    if (listIsAll[currLeftNav]) {
        toggleVisible(`${currLeftNav}_all`, currLeftNav);
        $('.choose-all').attr('class', 'img_all_open choose-all')
    } else {
        toggleVisible(`${currLeftNav}_none`, currLeftNav);
        $('.choose-all').attr('class', 'img_all_close choose-all')
    }
    // renderNavTypeList(navList[0].typeList)
    console.log(allNavList);
    if (Number(currLeftNav) === 0) {
        renderNavTypeList(allNavList[0].typeList, 0)
    } else {
        renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
    }

    bindOptionEvent();
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
        <div class="nav-list-item nav-list-item-${index} nav-list-${item.icon} ${visibleMarker[item.name] ? `img_${item.icon}_click active`: `img_${item.icon}`}" data-index="${index}" data-icon="${item.icon}" data-name="${item.name}">
            <div class="wz-bg">
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
        var icon = $(e.target).attr('data-icon');
        var name = $(e.target).attr('data-name');
        var NavListItemNum = $(e.target).find('.wz-num')
        if (NavListItemNum.text() == 0) return;
        if (!visibleMarker[name]) {
            $(this).addClass(`img_${icon}_click active`)
        } else {
            $(this).removeClass(`img_${icon}_click active`)
            $(this).addClass(`img_${icon}`)
        }
        toggleVisible(name, currLeftNav);
 
        
        let chooseNum = $('.nav-type-list').find('.active').length;
        console.log(chooseNum, navTypeList[currLeftNav].typeList.length);
        if (chooseNum === navTypeList[currLeftNav].typeList.length) {
            $('.choose-all').attr('class', 'img_all_open choose-all')
        } else {
            if (listIsAll[currLeftNav]) {
                listIsAll[currLeftNav] = false;
                listIsAll[0] = false;
                $('.choose-all').attr('class', 'img_all_close choose-all')
            } else {
                $('.choose-all').attr('class', 'img_all_close choose-all')
            }
        }
        console.log('点击');
    })
}

// 事件
var bindEvent = function () {
    // 导航栏状态
    var navState = false;
    var navCtn = $('.nav-ctn')
    var navCtnBg = $('.nav-ctn-bg')
    var navOptItem = $('.nav-option-item')
    var NavListItem = $('.nav-list-item')
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
    $('.choose-all').on('click', function (e) {
        e.stopPropagation();
        // resetNav();
        resetAll()
        
        if (listIsAll[currLeftNav]) {
            toggleVisible(`${currLeftNav}_all`, currLeftNav);
            $('.choose-all').attr('class', 'img_all_open choose-all')
        } else {
            toggleVisible(`${currLeftNav}_none`, currLeftNav);
            $('.choose-all').attr('class', 'img_all_close choose-all')
        }
        // renderNavTypeList(navList[0].typeList)
        if (Number(currLeftNav) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
        }

        bindOptionEvent();
       
    })

    $('.reset-choose').on('click', function (e) {
        e.stopPropagation();
        resetAll('none')
        toggleVisible(`none`, currLeftNav);
        $('.choose-all').attr('class', 'img_all_close choose-all')
        // renderNavTypeList(navList[0].typeList)
        if (Number(currLeftNav) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
        }

        bindOptionEvent();
    })

    // 选择类型
    navOptItem.on('click', function (e) {
        e.stopPropagation();
        var index = $(e.target).attr('data-index');
        currLeftNav = index;
        navOptItem.removeClass('active')
        $(`.nav-option-item-${index}`).addClass('active')
        console.log($(e.target).attr('data-index'));
        if (Number(index) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[index].typeList, index)
        }

        if (listIsAll[currLeftNav]) {
            $('.choose-all').attr('class', 'img_all_open choose-all')
        } else {
            $('.choose-all').attr('class', 'img_all_close choose-all')
        }
        
        bindOptionEvent();
    })

     // 选择标签
    bindOptionEvent();

   
    // 打开关闭导航
    btnNavState.on('click', function (e) {
        e.stopPropagation();
        navState = !navState;
        if (navState) {
            navCtn.addClass('open')
        } else {
            navCtn.removeClass('open')
        }
    })

    $('.btn-check-marker').on('click', function (e) {
        e.stopPropagation();
        navState = !navState;
        if (navState) {
            navCtn.addClass('open')
        } else {
            navCtn.removeClass('open')
        }
    })




    $('.m-index').on('click', function (e) {
        console.log(e, $(e.target).attr('class'));
       
        if ($(e.target).attr('class') === 'nav-ctn open') {
            navState = false;
            navCtn.removeClass('open')
        }

        if ($(e.target).attr('class') === 'nav-ctn open open_max') {
            // navState = false;
            navCtn.removeClass('open_max')
        }

        $('.select-region-ctn').removeClass('click')

        dom_mapList.removeClass('show')
        dom_changeMapBtn.removeClass('click')
        dom_map_lv_list.attr('class', 'map-lv-list')
        dom_map_lv.removeClass('click')
        mapLvIsClick = false;
        mapChangeIsClick = false;

        if (rightNavIsClick) {
            rightNavIsClick = false;
            $('.right-nav').removeClass('click')
        }


        // 地图选择控制
        if (!mapChangeIsClick) {
            mapChangeIsClick = false;
            $('.map-list').removeClass('show')
        }
    })
    let startY = 0;
    navCtn.on('touchstart', (e) => {
        if ($(e.target).attr('class').indexOf('nav-ctn') === -1) return;
        console.log($(e.target).attr('class'));
        e.stopPropagation();
        startY = e.originalEvent.touches[0].clientY;
    })

    function moveNavCtn (e) {
        if ($(e.target).attr('class').indexOf('nav-ctn') === -1) return;
        var currentTouchY = e.originalEvent.touches[0].clientY;
        var touchDifferenceY = currentTouchY - startY;
        navCtn.off("touchmove", moveNavCtn);
        if (touchDifferenceY < 0) {
            // that.toLeft();
            
            navCtn.addClass('open_max')
            console.log('上');
        } else {
            console.log(navCtn.attr('class'));
            if ( navCtn.attr('class') === 'nav-ctn open') {
                navState = false;
                navCtn.removeClass('open')
            } else {
                navCtn.removeClass('open_max')
            } 
        }
        setTimeout(autoRoll, 100);
    }

   
    function autoRoll() {
        // that.canvas.addEventListener("touchmove", touch);
        // that.canvas.addEventListener("touchmove", move);
        navCtn.on('touchmove', moveNavCtn)
        
      }
      autoRoll();

    // 地图选择控制
    dom_changeMapBtn.on('click', function (e) {
        e.stopPropagation();

        mapChangeIsClick = !mapChangeIsClick
        if (mapChangeIsClick) {
            dom_mapList.addClass('show')
            dom_changeMapBtn.addClass('click')
            dom_map_lv_list.removeClass('top0')
        } else {
            dom_mapList.removeClass('show')
            dom_changeMapBtn.removeClass('click')
            // dom_map_lv_list.removeClass('show')
            dom_map_lv_list.attr('class', 'map-lv-list')
            dom_map_lv.removeClass('click')
            mapLvIsClick = false;
        }
        
    })

    dom_map_lv.on('click', function (e) {
        e.stopPropagation();
        mapLvIsClick = !mapLvIsClick
        if (mapLvIsClick) {
            mapChangeIsClick ? dom_map_lv_list.addClass(`show show-${clickMap}`) : dom_map_lv_list.addClass(`show show-${clickMap} top0`)
            
            dom_map_lv.addClass('click')
            // dom_mapList.addClass('show')
            // dom_changeMapBtn.addClass('click')
            // mapChangeIsClick = true;
        } else {
            // dom_map_lv_list.removeClass('show')
            dom_map_lv_list.attr('class', 'map-lv-list')
            dom_map_lv.removeClass('click')
        }
        
    })

    $('.btn-right-nav').on('click', function (e) {
        e.stopPropagation();
        rightNavIsClick = !rightNavIsClick
        rightNavIsClick ? $('.right-nav').addClass('click') : $('.right-nav').removeClass('click')
    })
    
    dom_mapList.on('click', function (e) {
        e.stopPropagation();
        var index = $(e.target).attr('data-index')

        if (index) {
            clickMap = index;
            dom_map_lv_list.attr('class', `map-lv-list show show-${clickMap}`)
            mapChangeIsClick = true;
            $('.map-item').removeClass('action')
            $('.map-lv-item').removeClass('action')
            dom_map_lv.addClass('click')
            clickMap === currMap && $(`.map-lv-item-${currLv}`).addClass('action')
            $(e.target).addClass('action')
            // dom_mapList.attr('class', `map-list-ctn hover_${index}`)

         
        }
        // dom_mapList.css('width', '2.1rem');
        // isMoveMapList = true;
    })

    var lvText = ['普通', '机密', '绝密']
    // 选择难度等级
    $('.map-lv-item').on('click', function (e) {
        e.stopPropagation();
        var lv = $(e.target).attr('data-lv')
        if (clickMap == 1 && isZj) {
            changeMapLv(clickMap + lv + '_s');
        } else {
            changeMapLv(clickMap + lv);
        }

        if (clickMap == 1) {
            $('.zj-ctn').addClass('show')   
        } else {
            $('.zj-ctn').removeClass('show')   
        }
       
        console.log(currMap + lv);
        if (currMap + currLv !== currMap + lv) {
            map.flyTo([mapScaleInfo.initX,  mapScaleInfo.initY], mapScaleInfo.initZoom)
            $('.curr-map-lv').text(lvText[Number(lv)] )
        }
        currMap = clickMap;
        currLv = lv;

        $('.map-lv-item').removeClass('action')
        $(`.map-lv-item-${currLv}`).addClass('action')

        dom_mapList.removeClass('show')
        dom_changeMapBtn.removeClass('click')
        dom_map_lv_list.attr('class', 'map-lv-list')
        dom_map_lv.removeClass('click')
        mapLvIsClick = false;

        resetAll('none')
        toggleVisible(`none`, currLeftNav);
    })

        // 坠机事件
        $('.zj-ctn').on('click', function () {
            isZj = !isZj;
            isZj ? $('.zj-ctn').addClass('open') : $('.zj-ctn').removeClass('open')
            console.log($('.curr-map-lv').text());
            
            if (isZj) {
                if ($('.curr-map-lv').text() === '普通') {
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
                if ($('.curr-map-lv').text() === '普通') {
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
    $('.btn-log').on('click', function (e) {
        e.stopPropagation();
        // toastTips();
        $('.log-pop').fadeIn();
    })

    // 关闭日志弹窗
    $('.btn-close-pop').on('click', function () {
        $('.log-pop').fadeOut();
    })

    $('.btn-share').on('click', function () {
        // $('.bottom-bar').fadeIn();
        // $('.bottom-bar').addClass('show')
        $('.share-tips').fadeIn();
    })
    $('.share-tips').on('click', function () {
        $('.share-tips').fadeOut();
    })
    $('.bottom-bar').on('click', function() {
        $('.bottom-bar').removeClass('show')
        $('.bottom-bar').fadeOut();
    })

    // 快速定位
    $('.select-region-ctn').on('click', function (e) {
        e.stopPropagation();
        $(this).attr('class').indexOf('click') > -1? $(this).removeClass('click') : $(this).addClass('click')
        
    });

    $('.region-item').on('click',  function (e) {
        e.stopPropagation();
        var x = $(e.target).attr('data-x');
        var y = $(e.target).attr('data-y');
        var pos = getMapPos(x, y)
        map.flyTo([pos.y, pos.x], 5)
        $('.region-item').removeClass('action')
        $(this).addClass('action')
    })
    

    // 搜索
    $('.select-iput').on('input',  debounce(function (e) {
        var name = $(e.target).val()
        selectmarker(name)
    }, 500));
    

    // 关闭搜索
    $('.btn-close-select').on('click', function () {
        
        if ($('.select-iput').val() === '') {
            navState = false;
            navCtn.attr('class').indexOf('open_max') > -1 ? navCtn.removeClass('open_max') : navCtn.removeClass('open')
        } else {
            $('.select-iput').val('')
            $('.map-select').removeClass('show')
        }

        if (Number(currLeftNav) === 0) {
            renderNavTypeList(allNavList[0].typeList, 0)
        } else {
            renderNavTypeList(navTypeList[currLeftNav].typeList, currLeftNav)
        }
        bindOptionEvent();
    })

    $('.btn-tutorial').on('click', function () {
        toastTips();
    })

    // 反馈
    $('.btn-feedback').on('click', function () {
        window.open('https://wj.qq.com/s2/15023838/70c7/')
    })

    $('.bottom-bar-list').on('click', function () {
        toastTips();
    })

    // navCtn.on('touchstart', (e) => {
    //     console.log(e);
    // })
}

$('.btn-close-marker-pop').on('click', function () {

    markerPop.removeClass('show')
    currClickMarker.setIcon(currClickMarker.myIcon)
})


window.addEventListener('load', () => {
    init();
    console.log(document.querySelector('.left-nav-ctn'));
});

