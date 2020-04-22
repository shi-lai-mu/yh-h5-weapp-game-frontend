import State from "../utils/state";
// import axios from '../utils/axiosUtils';

/**
 * 工具类
 */
export const url = State.OSS_BASE;




/**
 *  格式化日期
 *  @param fmt 日期格式 如：yyyy-MM-dd HH:mm:ss
 *  @param form 指定时间 不传参 默认目前时间
 */
export function dateFrom(fmt: string = 'yyyy-MM-dd HH:mm:ss', form?: number) {
    const date: any = form ? new Date(form) : new Date();
    const o: any = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds(),
    };
    const week: string[] = [ '日', '一', '二', '三', '四', '五', '六' ];
    const season: string[] = [ '', '春', '夏', '秋', '冬' ];
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '')
        + week[date.getDay()]);
    }
    if (/(q+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, season[o['q+']] + ((RegExp.$1.length > 1) ? '季' : ''));
    }
    let k: string;
    for (k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 加载图片
 * @param url       - 图片url
 * @param callback  - 回调函数
 * @param type      - 图片类型
 * @param urlParams - 携带参数
 * @param imgType   - 图片后缀
 */
const urlBase = {
    avatar: State.OSS_BASE + '/avatar/',
};
export function loadImg(url, callback, type?: 'avatar', urlParams?: any, imgType: 'png' | false = 'png') {

    if (type === 'avatar' && !/\/\//.test(url)) {
        url = ![ -1, '0' ].indexOf(url) ? (urlParams || 'default') : 'default';
    }

    if (!/\/\//.test(url)) {
        type && (url = urlBase[type] + url);
        if (imgType) url += `.${imgType}`;
    }
    // console.log(url);
    cc.loader.load(url, (_error, texture) => {
        _error && console.error(_error);
        callback(new cc.SpriteFrame(texture));
    });
}


/**
 * 分享转发
 * @param title    转发标题，不传则默认使用当前小游戏的昵称
 * @param imageUrl 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
 * @param query    查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
 */
export const shareAppMessage = (title: string, imageUrl?: string, query?: string | object) => {
    if (State.IS_WECHAT) {
        wx.shareAppMessage({
            title,
            imageUrl,
            query,
        });
    }
}


/**
 * 上传文件
 * @param unit 文件单位
 */
export const uploadFile = (ossOption, fileName, unit?: string) => {
    return new Promise((reslove, reject) => {
        console.log(ossOption);
        if (State.IS_WECHAT) {
            // 微信上传
            wx.chooseImage({
                success (res) {
                    const tempFilePaths = res.tempFilePaths
                    console.log(tempFilePaths);
                    const suffix = tempFilePaths[0].match(/\.\w+$/);
                    ossOption.key = ossOption.startsWith + fileName + suffix;

                    if (!/^\.(png|jpg)/.test(suffix)) {
                        return reject('文件类型错误!');
                    }

                    if (res.tempFiles[0].size > 1024 * 500) {
                        return reject('文件不能大于500KB!');
                    }

                    Window.wx.uploadFile({
                        url: ossOption.host,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        formData: ossOption,
                        header: {
                            'content-type': 'application/json',
                        },
                        success_action_status: '200',
                        success: reslove,
                        fial: reject,
                    });
                },
                fial: reject,
            });
        } else if (State.IS_BROWSER) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.click();
            const formData = new FormData();
            Object.keys(ossOption).forEach(key => {
                formData.append(key, ossOption[key]);
            });

            fileInput.onchange = (e) => {
                // reslove(fileInput.files);
                formData.append('file', fileInput.files[0]);
                console.log(fileInput.files);
                // axios.request('post', ossOption.host, {
                //     data: formData,
                // }).then(res => {
                //     console.log(res);
                // })
                
                let xhr = cc.loader.getXMLHttpRequest();
                xhr.open('post', ossOption.host, true);
                // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8"); 
                xhr.onreadystatechange = function () {
                    
                };
                let dataStr = '';
                Object.keys(formData || {}).forEach(key => {
                    dataStr += key + '=' + encodeURIComponent(formData[key]) + '&';
                })
                console.log(dataStr);
                xhr.send(formData);
            }
        }
    });
}


/**
 * 设置资源是否被释放
 * @param Recursively UID
 * @param Auto        是否自动释放
 */
export const setAutoRecursively = (Recursively: string[], Auto: boolean = true) => {
    Recursively.forEach(val => cc.loader.setAutoReleaseRecursively(val, Auto));
}


/**
 * 获取启动时的参数
 */
export const luanchOptions = (() => {
    let shareOption = {
      title: '玩休闲游戏，赢优惠券，一起来玩~~',
      imageUrl: State.OSS_BASE + '/H5Game/share/main.png',
    };
    let options;
    if (State.IS_WECHAT) {
        options = wx.getLaunchOptionsSync().query;
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.onShareAppMessage(() => shareOption);
    }
    return {
        /**
         * 分享参数
         */
        query: options || {},
        /**
         * 设置分享参数
         */
        setShareOption: (option: typeof shareOption) => shareOption = option,
    };
})();


/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const onShow = (callback, that = null) => {
    if (State.IS_WECHAT) {
        wx.onShow(callback.bind(that));
    }
};

/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const offShow = (callback, that = null) => {
    if (State.IS_WECHAT) {
        wx.offShow(callback.bind(that));
    }
};

/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const onHide = (callback, that = null) => {
    if (State.IS_WECHAT) {
        wx.onHide(callback.bind(that));
    }
};

/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const offHide = (callback, that = null) => {
    if (State.IS_WECHAT) {
        wx.offHide(callback.bind(that));
    }
};
