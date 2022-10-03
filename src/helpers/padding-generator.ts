/**
 * Creating paddings for all sides
 */
export default (top: number, right?: number, bottom?: number, left?: number) => ({
  paddingTop: top,
  paddingRight: right ? right : top,
  paddingBottom: bottom ? bottom : top,
  paddingLeft: left ? left : right || top,
});
