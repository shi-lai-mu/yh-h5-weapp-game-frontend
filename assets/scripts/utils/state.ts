// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 缓存数据
 * 负责数据缓存npm install --save socket.io-wxapp-client
 */
const userInfo = localStorage.getItem('userInfo');
const observer = {};
import socket from '../utils/socketIO';


const State = {
    /**
     * 用户数据
     */
    userInfo: userInfo ? JSON.parse(userInfo) : {
        id: '0000',
        nickname: '* * * * * *',
        diamond: 0,
        gold: 0,
        token: false,
        avatarUrl: false,
        signal: 0,
    },

    /**
     * WebSocket IO
     */
    io: {
        connected: false,
        emit(keyword, callback) {},
        on(keyword, callback) {},
        off(keyword, callback) {},
        online: false,
    },

    /**
     * 服务器数据
     */
    server: {
        /**
         * 状态:
         *  - -1: 关闭中
         *  -  0: 正常
         *  -  1: 维护中
         *  -  2: 拥挤
         *   
         */
        state: 0,
    },

    /**
     * 服务器配置
     */
    serverConfig: {
        state: {
            value: 0,
        },
        startMessage: {
            value: 0,
        }
    },

    /**
     * 游戏数据
     */
    gameData: {
        id: -1,
        gameName: '',
        name: '',
        peopleMax: 0,
        frequency: 0,
        payType: 0,
        pwdType: 0,
        roomCode: '',
        roomPwd: -1,
        gameData: { createTime: 1582084691210, blackSetp: 0, whiteSetp: 0, target: 0 },
        players: [],
        isStart: !0,
    },

    /**
     * Observer
     */
    observer: {

        /**
         * 订阅事件
         * @param keyword  - 事件名
         * @param callback - 回调
         */
        on(keyword: string, callback: any) {
            !observer[keyword] && (observer[keyword] = []);
            observer[keyword].push(callback);
        },

        /**
         * 发布内容
         * @param keyword - 事件名
         * @param data    - 数据
         */
        emit(keyword: string, data?: any) {
            if (observer[keyword]) {
                observer[keyword].forEach((cb) => {
                    cb(data);
                });
            }
        },

        /**
         * 取消订阅
         * @param keyword  - 事件名
         * @param callback - 回调
         */
        off(keyword: string, callback: any) {
            if (observer[keyword]) {
                observer[keyword].forEach((cb, index) => {
                    if (callback === cb) {
                        delete observer[index];
                    }
                });
                if (!observer[keyword].length) delete observer[keyword];
            }
        },
    },
}

export default State;
socket.init();

/**
 * 全局重登机制 [Bate]
 */
import axios from './axiosUtils';
localStorage.getItem('account') && onLogin();
function onLogin() {
    let accountInputText = '';
    let passwordInputText = '';
    

    // 重新登录
    const { a, p } = JSON.parse(localStorage.getItem('account') || '{}');
    if (a && p) {
        passwordInputText = p.split('-').map((pwd: string) => {
            return String.fromCharCode(+pwd - 10);
        }).join('');
        accountInputText = a.split('-').map((acc: string) => {
            return String.fromCharCode(+acc - 10);
        }).join('');
    }

    if (!accountInputText || !passwordInputText) {
        return;
    }

    axios
        .api('login', {
            data: {
                account: accountInputText,
                password: passwordInputText,
            }
        })
        .then((res) => {
            if (res.token) {
                localStorage.setItem('userInfo', JSON.stringify(res));
                State.userInfo = res;
                console.log('==== State 登录机制 登录成功 ====');
                State.observer.emit('tokenUpdate', res.token);
            }
        })
    ;
}
