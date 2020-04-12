
/**
 * 混淆内容
 */
export const confusion = {
  encrypt: content => content.split('').map(pwd => pwd.charCodeAt(0) + 10).join('-'),
  decrypt: content => content.split('-').map(pwd => String.fromCharCode(+pwd - 10)).join(''),
}
