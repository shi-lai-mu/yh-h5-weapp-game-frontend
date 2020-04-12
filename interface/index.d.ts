// Type definitions for Wechat 1.7
// Project: https://github.com/Xiongqi-XQ/TypeScript-Definitions-For-Wechat
// Definitions by: xiongqi <https://github.com/xiongqi-xq>

/**
 * Wechat type definitions
 */

export = wx;
export as namespace wx;

/* namespace wx */
declare namespace wx {
  function request(object: {
    url: string,
    data?: object | string | ArrayBuffer,
    header?: object,
    method?: Method,
    dataType?: string,
    responseType?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): RequestTask

  function uploadFile(object: {
    url: string,
    filePath: string,
    name: string,
    header?: object,
    formData?: object,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): UploadTask

  function downLoadFile(object: {
    url?: string,
    header?: object,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): DownloadTask

  /**
   * WebSocket
   */
  function connectSocket(object: {
    url: string,
    header?: object,
    method?: string,
    protocols?: String[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): SocketTask

  function onSocketOpen(callback: Function): void
  function onSocketError(callback: Function): void

  function sendSocketMessage(object: {
    data?: String | ArrayBuffer
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  function onSocketMessage(callback: Function): void
  function closeSocket(object: {
    code?: number,
    reason?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  function onSocketClose(callback: Function): SocketTask

  /**
   * 媒体
   */
  // 图片
  function chooseImage(object: {
    count?: number,
    sizeType?: string[],
    sourceType?: string[],
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function previewImage(object: {
    count?: number,
    urls: string[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getImageInfo(object: {
    src: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function saveImageToPhotoAlbum(object: {
    filePath: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 录音
  function startRecord(object: { // 1.6 后不再维护 ， 建议使用 wx.getRecorderManager
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopRecord(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 录音管理
  function getRecorderManager(): RecordManager

  // 音频播放控制  注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
  function playVoice(object: {
    filePath: string,
    duration?: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function pauseVoice(): void
  function stopVoice(): void

  // 音乐播放控制   1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
  function getBackgroundAudioPlayerState(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function playBackgroundAudio(object: {
    dataUrl: string,
    title?: string,
    coverImgUrl?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function pauseBackgroundAudio(): void
  function seekBackgroundAudio(object: {
    position: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopBackgroundAudio(): void
  function onBackgroundAudioPlay(callback: Function): void
  function onBackgroundAudioPause(callback: Function): void
  function onBackgroundAudioStop(callback: Function): void

  // 背景音频播放管理
  function getBackgroundAudioManager(): BackgroundAudioManager

  // 音频组件控制
  function createAudioContext(audioId: string, that?: object): AudioContext
  function createInnerAudioContext(): InnerAudioContext // wx.createAudioContext 升级版。

  // 视频
  function chosseVideo(object: {
    sourceType?: string[],
    compressed?: boolean,
    maxDuration?: number,
    camera?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function saveVideoToPhotosAlbum(object: {
    filePath: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 视频组件控制
  function createVideoContext(videoId: string, that?: object): VideoContext

  // 相机组件控制
  function createCameraContext(that?: object): CameraContext

  // 实时音视频
  function createLivePlayerContext(domId: string, that?: object): LivePlayerContext
  function createLivePusherContext(that?: object): LivePusherContext

  /**
   * 文件
   */
  function saveFile(object: {
    tempFilePath: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getFileInfo(object: {
    filePath: string,
    digestAlgorithm?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  })
  function getSavedFileList(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getSavedFileInfo(object: {
    filePath: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function removeSavedFile(object: {
    filePath: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function openDocument(object: {
    filePath: string,
    fileTyp?: string
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  /**
   * 数据缓存
   */
  function setStorage(object: {
    key: string,
    data: object | string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function setStorageSync(key: string, data: object | string): void
  function getStorage(object: {
    key: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getStorageSync(key: string): object | string
  function getStorageInfo(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getStorageInfoSync(): {
    keys: string[],
    currentSize: number,
    limitSize: number
  }
  function removeStorage(object: {
    key: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function removeStorageSync(key: string): void
  function clearStorage(): void
  function clearStorageSync(): void

  /**
   * 位置
   */
  // 获取位置
  function getLocation(object: {
    type?: string,
    altitude?: boolean,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function chooseLocation(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  // 查看位置
  function openLocation(object: {
    latitude: number,
    longitude: number,
    scale?: number,
    name?: string,
    address?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  // 地图组件控制
  function createMapContext(mapId, that?: object): MapContext

  /**
   * device
   */
  // 系统信息
  function getSystemInfo(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getSystemInfoSync(): SystemInfo
  function canIUse(param: string): boolean

  // 网络状态
  function getNetworkType(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onNetworkStatusChange(callback: Function): void

  // 加速度计
  function onAccelerometerChange(callback: Function): void
  function startAccelerometer(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopAccelerometer(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 罗盘
  function onCompassChange(callback: Function): void
  function startCompass(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopCompass(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 拨打电话
  function makePhoneCall(object: {
    phoneNumber: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 扫码
  function scanCode(object: {
    onlyFromCamera?: boolean,
    scanType?: string[],
    success?: Function,
    fail?: Function,
    complete?: Function
  })

  // 剪贴板
  function setClipboardData(object: {
    data: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getClipboardData(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 蓝牙
  function openBluetoothAdapter(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function closeBluetoothAdapter(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getBluetoothAdapterState(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onBluetoothAdapterStateChange(callback: Function): void
  function startBluetoothDevicesDiscovery(object: {
    services?: string[],
    allowDuplicatesKey?: boolean,
    interval?: number,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopBluetoothDevicesDiscovery(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getBluetoothDevices(object: {
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getConnectedBluetoothDevices(object: {
    services: string[],
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onBluetoothDeviceFound(callback: Function): void
  function createBLEConnection(object: {
    deviceId: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function closeBLEConnection(object: {
    deviceId: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getBLEDeviceServices(object: {
    deviceId: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getBLEDeviceCharacteristics(object: {
    deviceId: string,
    serviceId: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function readBLECharacteristicValue(object: {
    deviceId: string,
    serviceId: string,
    characteristicld: string,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function writeBLECharacteristicValue(object: {
    deviceId: string,
    serviceId: string,
    characteristicld: string,
    value: ArrayBuffer,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function notifyBLECharacteristicValueChange(object: {
    deviceId: string,
    serviceId: string,
    characteristicld: string,
    state: boolean,
    success: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onBLEConnectionStateChange(callback: Function): void
  function onBLECharacteristicValueChange(callback: Function): void

  // iBeacon
  function startBeaconDiscovery(object: {
    uuids: string[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopBeaconDiscovery(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getBeacons(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onBeaconUpdate(callback: Function): void
  function onBeaconServiceChange(callback: Function): void

  // 屏幕亮度
  function setScreenBrightness(object: {
    value: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getScreenBrightness(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function setKeepScreenOn(object: {
    keepScreenOn: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void


  // 用户截屏事件
  function onUserCaptureScreen(callback: Function): void

  // 振动
  function vibrateLong(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function vibrateShort(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 手机联系人
  function addPhoneContact(object: {
    photoFilePath?: string,
    nickName?: string,
    lastName?: string,
    middleName?: string,
    firstName: string,
    remark?: string,
    mobilePhoneNumber?: string,
    weChatNumber?: string,
    addressCountry?: string,
    addressState?: string,
    addressCity?: string,
    addressStreet?: string,
    addressPostalCode?: string,
    organization?: string,
    title?: string,
    workFaxNumber?: string,
    workPhoneNumber?: string,
    hostNumber?: string,
    email?: string,
    url?: string,
    workAddressCountry?: string,
    workAddressState?: string,
    workAddressCity?: string,
    workAddressStreet?: string,
    workAddressPostalCode?: string,
    homeFaxNumber?: string,
    homePhoneNumber?: string,
    homeAddressCountry?: string,
    homeAddressState?: string,
    homeAddressCity?: string,
    homeAddressStreet?: string,
    homeAddressPostalCode?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // NFC
  function getHCEState(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function startHCE(object: {
    add_list: string[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopHCE(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onHCEMessage(callback: Function): void
  function sendHCEMessage(object: {
    data: ArrayBuffer,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // WIFI
  function startWifi(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopWifi(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function connectWifi(object: {
    SSID: string,
    BSSID: string,
    password?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getWifiList(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function onGetWifiList(callback: Function): void
  function setWifiList(object: { // IOS only
    wifiList: object[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // presetWifiList
  // onEvaluateWifi

  function getConnectedWifi(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  })
  function onWifiConnected(callback: Function): void

  /**
   * WXML 节点信息
   */
  function createSelectorQuery(): SelectorQuery

  /**
   * 界面
   */
  // 交互反馈
  function showToast(object: {
    title: string,
    icon?: string,
    image?: string,
    duration?: number,
    mask?: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function showLoading(object: {
    title: string,
    mask?: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function hideToast(): void
  function hideLoading(): void
  function showModal(object: {
    title: string,
    content: string,
    showCancel?: boolean,
    cancelText?: string,
    cancelColor?: string,
    confirmText?: string,
    confirmColor?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function showActionSheet(object: {
    itemList: string[],
    itemColor?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 设置导航条
  function setNavigationBarTitle(object: {
    title: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function showNavigationBarLoading(): void
  function hideNavigationBarLoading(): void
  function setNavigationBarColor(object: {
    frontColor: string,
    backgroundColor: string,
    animation?: {
      duration?: number,
      timingFunc?: TimingFunc
    },
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 设置置顶信息
  function setTopBarText(object: {
    text: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 导航
  function navigateTo(object: {
    url: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function redirectTo(object: {
    url: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function switchTab(object: {
    url: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function navigateBack(object?: {
    dalta?: number
  }): void
  function reLaunch(object: {
    url: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 动画
  function createAnimation(object?: {
    duration?: number,
    timingFunction?: TimingFunction,
    delay?: number,
    transformOrigin?: string
  }): void

  // 位置
  function pageScrollTo(object: {
    scrollTop: number
  }): void

  // 绘图
  function createCanvasContext(canvasId: string, that?: object): CanvasContext
  function createContext(): CanvasContext // 不推荐使用
  function drawCanvas(canvasId: string, actions: any[], reserve?: boolean): void // 不推荐使用
  function canvasToTempFilePath(ooo: {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    destWidth?: number,
    destHeight?: number,
    canvasId: string,
    fileType?: 'jpg' | 'png',
    quality?: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): string

  // 下拉刷新
  function startPullDownRefresh(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function stopPullDownRefresh(): void

  /**
   * 开放接口
   */
  // 登录
  function login(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function checkSession(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 授权
  function authorize(object: {
    scope: AuthorizeScope,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 用户信息
  function getUserInfo(object: {
    withCredentials?: boolean,
    lang?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 微信支付
  function requestPayment(object: {
    timeStamp: string,
    nonceStr: string,
    package: string,
    signType: string,
    paySign: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 转发
  function showShareMenu(object: {
    withShareTicket?: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function hideShareMenu(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function updateShareMenu(object: {
    withShareTicket?: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getShareInfo(object: {
    shareTicket: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 收获地址
  function chooseAddress(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 卡券
  function addCard(object: {
    cardList: CardAdd[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function openCard(object: {
    cardList: CardOpen[],
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 设置
  function openSetting(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function getSetting(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 微信运动
  function getWeRunData(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 打开小程序
  function navigateToMiniProgram(object: {
    appId: string,
    path?: string,
    extraData?: object,
    envVersion?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function navigateBackMiniProgram(object?: {
    extraData?: object,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 获取发票抬头
  function chooseInvoiceTitle(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void

  // 生物认证
  function checkIsSupportSoterAuthentication(object?: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function startSoterAuthentication(object: {
    requestAuthModes: string[],
    challenge: string,
    authContent?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
  function checkIsSoterEnrolledInDevice(object: {
    checkAuthMode: AuthMode,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void


  /**
   * 第三方平台
   */
  function getExtConfig(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  })
  function getExtConfigSync(): object

  /**
   * 调试接口
   */
  function setEnableDebug(object: {
    enableDebug: boolean,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
}
/* namespace wx */

type Method = 'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'HEAD' | 'DELETE' | 'TRACE' | 'CONNECT';
type AuthorizeScope = 'scope.userInfo' | 'scope.userLocation' | 'scope.address' | 'scope.invoiceTitle' | 'scope.werun' | 'scope.record' | 'scope.writePhotosAlbum' | 'scope.camera';
type AuthMode = 'fingerPrint' | 'facial' | 'speech';
type TimingFunc = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
type TimingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end';

interface RequestTask {
  abort: Function
}
interface UploadTask {
  onProgressUpdate(callback: Function): void;
  abort: Function;
}
interface DownloadTask {
  onProgressUpdate(callback: Function): void;
  abort: Function;
}
interface SocketTask {
  send(object: {
    data: string | ArrayBuffer,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  close(object: {
    code?: number,
    reason?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  })
  onOpen(callback: Function): void,
  onClose(callback: Function): void,
  onError(callback: Function): void,
  onMessage(callback: Function): void
}
interface RecordManager {
  start(options: StartOptions): void;
  pause: Function;
  resume: Function;
  stop: Function;
  onStart(callback: Function): void;
  onPause(callback: Function): void;
  onStop(callback: Function): void;
  onFrameRecorded(callback: Function): void;
  onError(callback: Function): void;
}
interface StartOptions {
  duration?: number;
  sampleRate?: number;
  numberOfChannels: number;
  encodeBitRate?: number;
  format?: string;
  frameSize?: number;
}
interface BackgroundAudioManager {
  readonly duration: number;
  readonly currentTime: number
  readonly paused: boolean;
  src: string;
  startTime: number;
  readonly buffered: number;
  title: string;
  epname: string;
  singer: string;
  coverImgUrl: string;
  webUrl: string

  play(): void;
  pause(): void;
  stop(): void;
  seek(position: number): void;
  onCanplay(callback: Function): void;
  onPlay(callback: Function): void;
  onPause(callback: Function): void;
  onStop(callback: Function): void;
  onEnded(callback: Function): void;
  onTimeUpdate(callback: Function): void;
  onPrev(callback: Function): void; // IOS only
  onNext(callback: Function): void; // IOS only
  onError(callback: Function): void;
  onWaiting(callback: Function): void;
}
interface AudioContext {
  setSrc(src: string): void;
  play(): void;
  pause(): void;
  seek(position: number): void;
}
interface InnerAudioContext {
  src: string;
  startTime: number;
  autoplay: boolean;
  loop: boolean;
  obeyMuteSwitch: boolean;
  readonly duration: number;
  readonly currentTime: number;
  readonly paused: boolean;
  readonly buffered: number;
  play(): void;
  pause(): void;
  stop(): void;
  seek(position: number): void;
  destroy(): void;
  onCanplay(callback: Function): void;
  onPlay(callback: Function): void;
  onPause(callback: Function): void;
  onStop(callback: Function): void;
  onEnded(callback: Function): void;
  onTimeUpdate(callback: Function): void;
  onError(callback: Function): void;
  onWaiting(callback: Function): void;
  onSeeking(callback: Function): void;
  onSeeked(callback: Function): void;
}
interface VideoContext {
  play(): void;
  pause(): void;
  seek(position: number): void;
  sendDanmu(danmu?: { text: string, color: string }): void;
  playbackRate(rate: number): void;
  requestFullScreen(): void;
  exiteFullScreen(): void;
}
interface CameraContext {
  takePhoto(object: {
    quality?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  shartRecord(object: {
    timeoutCallback?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  stopRecord(object: {
    quality?: string,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
}
interface LivePlayerContext {
  play(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  stop(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  mute(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  requestFullScreen(object: {
    direction?: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  exitFullScreen(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
}
interface LivePusherContext {
  start(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  stop(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  pause(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  resume(object: {
    direction?: number,
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  switchCamera(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
}
interface MapContext {
  getCenterLocation(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  moveToLocation(): void;
  translateMarker(object: {
    markerId: number,
    destination: object,
    autoRotate: boolean,
    rotate: number,
    duration?: number,
    animationEnd?: Function,
    fail?: Function
  }): void
  includePoints(object: {
    points: object[],
    padding?: number[]
  }): void;
  getRegion(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void;
  getScale(object: {
    success?: Function,
    fail?: Function,
    complete?: Function
  }): void
}
interface SystemInfo {
  brand: string;
  model: string;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  language: string;
  version: string;
  system: string;
  platform: string;
  fontSizeSetting: number;
  SDKVersion: string;
}
interface SelectorQuery {
  in(that: object): SelectorQuery;
  select(selector: string): NodesRef;
  selectAll(selector: string): NodesRef;
  selectViewport(): NodesRef;
  exec(callback?: Function): void
}
interface NodesRef {
  boundingClientRect(callback?: Function): SelectorQuery;
  scrollOffset(callback?: Function): SelectorQuery;
  fields(fields: Fields, callback?: Function): SelectorQuery;
}
interface Fields {
  id?: boolean;
  dataset?: boolean;
  rect?: boolean;
  size?: boolean;
  scrollOffset?: boolean;
  properties?: boolean;
}
interface Card {
  cardId: string;
}
interface CardAdd extends Card {
  cardExt: string;
}
interface CardOpen extends Card {
  code: string;
}
interface Animation {
  /* 样式 */
  opacity(value: number): Animation
  backgroundColor(color: string): Animation
  width(length: number | string): Animation
  height(length: number | string): Animation
  top(length: number | string): Animation
  left(length: number | string): Animation
  bottom(length: number | string): Animation
  right(length: number | string): Animation
  /* 旋转 */
  rotate(deg: number): Animation
  rotateX(deg: number): Animation
  rotateY(deg: number): Animation
  rotateZ(deg: number): Animation
  rotate3d(x: number, y: number, z: number, deg: number): Animation
  /* 缩放 */
  scale(sx: number, sy?: number): Animation
  scaleX(sx: number): Animation
  scaleY(sy: number): Animation
  scaleZ(sz: number): Animation
  scale3d(sx: number, sy: number, sz: number): Animation
  /* 偏移 */
  translate(tx: number, ty?: number): Animation
  translateX(tx: number): Animation
  translateY(ty: number): Animation
  translateZ(tz: number): Animation
  translate3d(tx: number, ty: number, tz: number): Animation
  /* 倾斜 */
  skew(ax: number, ay?: number): Animation
  skewX(ax: number): Animation
  skewY(ay: number): Animation
  /* 矩阵变形 */
  matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Animation
  matrix3d(a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): Animation
  /* 其他 */
  step(object?: object): Animation
  export(): { actions: object[], [propName: string]: any }
}
interface CanvasContext {
  /* 颜色，样式，阴影 */
  setFillStyle(color: string): void;
  setStrokeStyle(color: string): void;
  setShadow(offsetX: number, offsetY: number, blur: number, color: string): void
  /* 渐变 */
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): GradientContext
  createCircularGradient(x: number, y: number, r: number): GradientContext
  /* 线条样式 */
  setLineWidth(lineWidth: number): void
  setLineCap(lineCap: 'butt' | 'round' | 'square'): void
  setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void
  setLineDash(pattern: number[], offset: number): void
  setMiterLimit(miterLimit: number): void
  /* 矩形 */
  rect(x: number, y: number, width: number, height: number): void
  fillRect(x: number, y: number, width: number, height: number): void
  strokeRect(x: number, y: number, width: number, height: number): void
  clearRect(x: number, y: number, width: number, height: number): void
  /* 路径 */
  fill(): void
  stroke(): void
  beginPath(): void
  closePath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean): void
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void
  /* 变形 */
  scale(scaleWidth: number, scaleHeight: number): void
  rotate(rotate: number): void
  translate(x: number, y: number): void
  /* 文字 */
  fillText(text: string, x: number, y: number): void
  setFontSize(fontSize: number): void
  setTextBaseline(textBaseline: string): void
  setTextAlign(align: string): void
  /* 图片 */
  drawImage(imageResource: string, x: number, y: number, width: number, height: number): void
  /* 混合 */
  setGlobalAlpha(alpha: number): void
  /* 其他 */
  clip(): void
  save(): void
  restroe(): void
  draw(reserve?: boolean, callback?: Function): void
  getActions(...params: any[]): any // 不推荐使用
  clearActions(...params: any[]): any // 不推荐使用
}
interface GradientContext {
  [propName: string]: any;
  addColorStop(stop: number, color: string): void
}
