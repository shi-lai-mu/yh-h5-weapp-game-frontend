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
        console.time();
        if (Object.keys(cc.loader.downloader._subpackages).length === 0) {
            return console.log('跳过 subPackage 加载...');
        }
        for (const packIndex in packages) {
            const packName = packages[packIndex];
            await cc.loader.downloader.loadSubpackage(packName, (err) => {
                if (err) {
                    return console.error(err);
                }
                cc.log(packName + ' load subpackage successfully.');
            });
            callback && callback(packName, Number(packIndex), packages.length);
            console.timeEnd();
            cc.log(packName);
        }
    }
}