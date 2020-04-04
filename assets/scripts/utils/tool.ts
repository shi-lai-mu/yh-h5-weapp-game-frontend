/**
 * 工具类
 */
export const url = 'https://perfergame.oss-cn-beijing.aliyuncs.com';


/**
 * 加载子包
 * @param packages - 子包名数组
 * @param callback - 回调
 */
export async function packLoading(
    packages: {
        sub?: string[],
        scene?: string[],
    },
    callback?: (
        targetPack: string,
        /**
         * 当前加载下标
         */
        successCount: number,
        /**
         * 加载总数
         */
        allCount: number,
        /**
         * 回执消息内容
         */
        message: string
    ) => boolean,
) {
    // console.log(Object.keys(cc.loader.downloader._subpackages).length);
    if (Object.keys(cc.loader.downloader._subpackages).length === 0) {
        return callback && callback('skip', 1, 1, '跳过加载...');
    }

    const { scene, sub } = packages;
    const allCount = scene.length + sub.length;

    for (const subIndex in sub) {
        const subName = sub[subIndex];
        await new Promise((resolve) => {
            cc.loader.downloader.loadSubpackage(subName, (err) => {
                if (err) {
                    return console.error(err);
                }
                resolve();
                callback && callback(subName, Number(subIndex) + 1, allCount, `subPack/${subName}... [${subIndex + 1}/${sub.length}]`);
            });
        })
    }

    for (const sceneIndex in scene) {
        const sceneName = scene[sceneIndex];
        await new Promise((resolve) => {
            cc.director.preloadScene(sceneName, (err) => {
                if (err) {
                    return console.error(err);
                }
                resolve();
                callback && callback(sceneName, Number(sceneIndex) + 1 + sub.length, allCount, `scene/${sceneName}... [${sceneIndex + 1}/${scene.length}]`);
            });
        })
    }
};


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
    avatar: 'https://perfergame.oss-cn-beijing.aliyuncs.com/avatar/',
};
export function loadImg(url, callback, type?: 'avatar', urlParams?: any, imgType: 'png' | false = 'png') {

    if (type === 'avatar' && !/\/\//.test(url)) {
        url = url ? urlParams : 'default';
    }

    if (!/\/\//.test(url)) {
        type && (url = urlBase[type] + url);
        if (imgType) url += `.${imgType}`;
    }
    console.log(url);
    cc.loader.load(url, (_error, texture) => {
        _error && console.error(_error);
        callback(new cc.SpriteFrame(texture));
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
