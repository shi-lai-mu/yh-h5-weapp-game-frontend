/**
 * 工具类
 */
export default {
    /**
     * 加载子包
     * @param packages - 子包名数组
     * @param callback - 回调
     */
    async packLoading(
        packages: {
            sub?: string[],
            scene?: string[],
        },
        callback?: (targetPack: string, successCount: number, allCount: number) => boolean
    ) {
        if (Object.keys(cc.loader.downloader._subpackages).length === 0) {
            console.log('跳过 subPackage 加载...')
            return callback && callback('skip', 1, 1);
        }

        const { scene, sub } = packages;
        const allCount = scene.length + sub.length;

        for (const subIndex in sub) {
            const subName = sub[subIndex];
            console.log(subName + ' subPackage 加载...')
            await new Promise((resolve) => {
                console.time();
                cc.loader.downloader.loadSubpackage(subName, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(subName + ' 加载成功!');
                    resolve();
                    console.timeEnd();
                    callback && callback(subName, Number(subIndex) + 1, allCount);
                });
            })
        }

        for (const sceneIndex in scene) {
            const sceneName = scene[sceneIndex];
            console.log(sceneName + ' scene 加载...')
            await new Promise((resolve) => {
                console.time();
                cc.director.preloadScene(sceneName, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(sceneName + ' 加载成功!');
                    resolve();
                    console.timeEnd();
                    callback && callback(sceneName, Number(sceneIndex) + 1 + sub.length, allCount);
                });
            })
        }
    },
}