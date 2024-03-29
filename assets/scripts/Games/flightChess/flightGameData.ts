/**
 * 四位玩家的骰子达到条件后 起飞的位置
 */
export const startPoint = [
  [-163.44, -327.72],
  [-328.279, 164.67],
  [165.661, 328.74],
  [330.599, -163.543],
];

/**
 * 棋子可移动位置
 */
export const chessPoint = [
  [ 1.001, -306.912, -90 ],
  [ -40.003, -306.912 ],
  [ -81.228, -306.912 ],

  [ -122.232, -286.85, -45 ],

  [ -143.176, -245.625, 0 ],
  [ -143.176, -204.621 ],
  [ -122.268, -163.726 ],

  [ -163.528, -122.38, -45 ],
  [ -205.194, -143.103, -90 ],
  [ -246.198, -143.103 ],

  [ -286.762, -122.601, -45 ],

  [ -307.776, -81.86, 0 ],
  [ -307.776, -40.69 ],
  [ -307.776, 0.75 ],
  [ -307.776, 41.257 ],
  [ -307.776, 82.884 ],

  [ -287.274, 123.007, 45 ],

  [ -246.049, 143.95, 90 ],
  [ -205.147, 143.95 ],
  
  [ -163.702, 123.889, 45 ],
  [ -122.918, 164.452, 0 ],

  [ -142.759, 205.897 ],
  [ -142.759, 246.591 ],

  [ -122.226, 287.845, 45 ],

  [ -81.346, 308.005, 90 ],
  [ -40.092, 308.005 ],
  [ 1.162, 308.005 ],
  [ 42.229, 308.005 ],
  [ 83.296, 308.005 ],

  [ 124.55, 288.032, 135 ],

  [ 145.118, 246.375, 180 ],
  [ 145.118, 205.499 ],

  [ 124.55, 164.623, 135 ],
  [ 165.686, 123.487, 90 ],

  [ 206.939, 144.025 ],
  [ 248.336, 144.025 ],
  
  [ 289.211, 123.717, 135 ],

  [ 309.909, 82.629, 180 ],
  [ 309.909, 41.753 ],
  [ 309.909, 0.244 ],
  [ 309.909, -40.65 ],
  [ 309.909, -81.544 ],

  [ 289.616, -122.746, 225 ],

  [ 248.414, -143.347, 270 ],
  [ 206.905, -143.347 ],

  [ 165.703, -122.131, 225 ],
  [ 124.809, -163.333, 180 ],

  [ 144.795, -204.535 ],
  [ 144.795, -245.737 ],

  [ 124.809, -286.324, -90 ],

  [ 83.3, -306.925 ],
  [ 42.098, -306.925 ],
  [ 1.001, -306.912, -90 ],
];

/**
 * 中间的坐标
 */
export const centerPedestal = [
  [
    [0.894, -246.166, 0],
    [0.894, -204.892, 0],
    [0.894, -163.684, 0],
    [0.894, -122.476, 0],
    [0.894, -81.841, 0],
    [0.894, -40.323, 0],
  ],
  [
    [-245.944, 0.671, 90],
    [-204.736, 0.671, 90],
    [-164.05, 0.671, 90],
    [-122.581, 0.671, 90],
    [-81.634, 0.671, 90],
    [-40.165, 0.671, 90],
  ],
  [
    [1.456, 246.076, 180],
    [1.456, 205.441, 180],
    [1.456, 164.494, 180],
    [1.456, 122.764, 180],
    [1.456, 82.338, 180],
    [1.456, 41.13, 180],
  ],
  [
    [247.922, 0.444, -90],
    [206.975, 0.444, -90],
    [165.245, 0.444, -90],
    [122.994, 0.444, -90],
    [83.351, 0.444, -90],
    [41.621, 0.444, -90],
  ],
];

/**
 * 特殊坐标
 * out: 飞机出的位置
 * in:  飞机入的位置
 * start: 飞机跳跃起飞的位置
 * end: 飞机跳跃结束的位置
 * 0: 为棋盘正下方，红色开始，顺序为【红、黄、蓝、绿】
 */
export const notePoint = [
  {
    out: 3,
    in: 52,
    start: 20,
    end: 32,
  },
  {
    out: 16,
    in: 13,
    start: 33,
    end: 45,
  },
  {
    out: 29,
    in: 26,
    start: 46,
    end: 6,
  },
  {
    out: 42,
    in: 39,
    start: 7,
    end: 19,
  },
];
