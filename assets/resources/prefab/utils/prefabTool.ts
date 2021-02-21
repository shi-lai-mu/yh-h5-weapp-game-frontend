
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
 * 分享转发
 * @param title    转发标题，不传则默认使用当前小游戏的昵称
 * @param imageUrl 转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
 * @param query    查询字符串，从这条转发消息进入后，可通过 wx.getLaunchOptionsSync() 或 wx.onShow() 获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
 */
export const shareAppMessage = (title: string, imageUrl?: string, query?: string | object) => {
    if (CC_WECHATGAME) {
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
        if (CC_WECHATGAME) {
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
        } else if (CC_PREVIEW) {
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
 * 如果为刘海屏则进行适配
 * @param node 节点
 */
export const screenFringe = (nodes: cc.Node[]) => {
    const isFringe = hasScreenFringe();
    if (isFringe) {
        nodes.forEach(node => {
            node.getComponent(cc.Widget).left += 60;
        });
    }
}


/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const onShow = (callback, that = null) => {
    if (CC_WECHATGAME) {
        wx.onShow(callback.bind(that));
    }
};


/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const offShow = (callback, that = null) => {
    if (CC_WECHATGAME) {
        wx.offShow(callback.bind(that));
    }
};


/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const onHide = (callback, that = null) => {
    if (CC_WECHATGAME) {
        wx.onHide(callback.bind(that));
    }
};


/**
 * 监听小游戏回到前台的事件
 * @param callback 回调
 * @param that     this指向
 */
export const offHide = (callback, that = null) => {
    if (CC_WECHATGAME) {
        wx.offHide(callback.bind(that));
    }
};


/**
 * 判断是否为刘海
 */
const fringeScreenModels = [
  'iPhone X', 'iPhone x', 'vivo X21A', 'ASUS Zenfone 5',
  'Ulefone T2 Pro', 'Leagoo S9', 'HUAWEI P20', 'DooGee V',
  'OPPO R15', 'LG G7', 'SAMSUNG S9', 'COR-AL00',
  'vivo Y83A', 'LLD-AL20', 'vivo Z1', 'PACM00', 'PAAM00'
];
export const hasScreenFringe = () => {
  const systemInfo = CC_WECHATGAME ? wx.getSystemInfoSync() : { model: null };

  if (systemInfo.model != null) {
      for (let i in fringeScreenModels) {
          if (systemInfo.model.indexOf(fringeScreenModels[i]) > -1) {
              // 是已知机型里的刘海手机
              return true;
          }
      }
  }
  // 屏幕宽高比大于2，基本上90%的手机可以确定是刘海屏，就算个别手机不是也按刘海屏处理
  // 竖屏游戏判断：
  // if (systemInfo.windowHeight >= 800 || systemInfo.windowHeight / systemInfo.windowWidth > 2) {
  //     return true;
  // }

  // 横屏游戏判断：
  // if (this.systemInfo.windowWidth >= 800 || this.systemInfo.windowWidth / this.systemInfo.windowHeight > 2) {
  //     return true;
  // }
  return false;
}


/**
 * 检测旋转屏幕
 */
export const testingRotate = () => {
    const { width, height } = cc.view.getFrameSize();
    cc.view.setFrameSize(width, width < height ? height / 3 : height);
    if (width < height) {
      alert('请横屏游玩!');
    }
}