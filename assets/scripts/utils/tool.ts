/**
 * 工具类
 */
export default {
    /**
     * 加载子包
     * @param packages - 子包名数组
     * @param callback - 回调
     */
    async subPackLoading(
        packages: string[],
        callback?: (targetPack: string, successCount: number, allCount: number) => boolean
    ) {
        if (Object.keys(cc.loader.downloader._subpackages).length === 0) {
            console.log('跳过 subPackage 加载...')
            return callback && callback('skip', 1, 1);
        }
        for (const packIndex in packages) {
            console.time();
            const packName = packages[packIndex];
            console.log(packName + ' subPackage 加载...')
            await new Promise((resolve) => {
                cc.loader.downloader.loadSubpackage(packName, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(packName + ' 加载成功!');
                    resolve();
                });
            })
            callback && callback(packName, Number(packIndex) + 1, packages.length);
            console.timeEnd();
        }
    }
}