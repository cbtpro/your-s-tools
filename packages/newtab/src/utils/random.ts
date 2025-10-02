/**
 * 生成安全随机数
 * @param min 最小值（包含）
 * @param max 最大值（包含，整数时）
 * @param isFloat 是否生成浮点数（true 则返回浮点数，false 则返回整数）
 * @returns 生成的安全随机数
 */
const random = (min = 0, max = 100, isFloat = false) => {
  const array = new Uint32Array(1);
  const maxUint = 0xffffffff;
  const randomNumber = crypto.getRandomValues(array)[0] / maxUint;
  const randomRangeValue = (max - min + 1) * randomNumber + min;
  return isFloat ? randomRangeValue : Math.floor(randomRangeValue);
};

/**
 * 生成随机字符串
 * @param len 是否随机长度（true = 使用随机长度，false = 固定长度）
 * @param min 最小长度
 * @param max 最大长度
 * @returns 生成的随机字符串
 */
export const randomString = (len = true, min = 7, max = 7) => {
  let str = "";
  let range = min;
  const arr =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_-+=";
  // 随机产生
  if (len) {
    range = random(min, max);
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};
