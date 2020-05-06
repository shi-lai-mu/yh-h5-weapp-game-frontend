
/**
 * 加载子包
 * @param packages - 子包名数组
 * @param callback - 回调
 */
export default async function packLoading(
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
            console.error(subName);
              if (err) {
                  return console.error(err);
              }
              resolve();
              callback && callback(
                  subName,
                  +subIndex + 1,
                  allCount,
                  `subPack/${subName}... [${+subIndex + 1}/${sub.length}]`
              );
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
              callback && callback(
                  sceneName,
                  +sceneIndex + 1 + sub.length,
                  allCount,
                  `scene/${sceneName}... [${+sceneIndex + 1}/${scene.length}]`
              );
          });
      })
  }
};