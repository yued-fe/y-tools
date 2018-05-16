import _utils from '../_/utils.js';


export default function (context) {
  if (!context.selection.length) {
    _utils.msg("Please select a layer");
    return;
  }

  const target = context.selection[0];

  if (target.className() != 'MSTextLayer') {
    _utils.msg("Please select a text");
    return;
  }

  const textStyles = _utils.getTextStyles(target);

  // 行高必须比文字大
  if (!(textStyles.lineHeight > textStyles.fontSize)) {
    _utils.msg("lineHeight「 " + textStyles.lineHeight + " 」 should bigger than fontSize「 " + textStyles.fontSize + " 」");
    return;
  }

  // 行高必须是4的倍数
  if (textStyles.lineHeight % 4 != 0) {
    _utils.msg("lineHeight「 " + textStyles.lineHeight + " 」 can't be divided by 4 ");
    return;
  }

  const textStyleName = generateStyleName(textStyles);
  const currentTextStyles = context.document.documentData().layerTextStyles();
  const s = MSSharedStyle.alloc().initWithName_firstInstance(textStyleName, target.style());
  currentTextStyles.addSharedObject(s);
  _utils.msg("Success!");
}

function generateStyleName(styles) {
  const { fontSize, fontFamily, fontWeight, lineHeight, color } = styles;
  let sharedTextName=`${fontFamily}/${fontSize}/${lineHeight}/${color}`;
  if (fontWeight) {
    sharedTextName = sharedTextName + '/' + fontWeight;
  }
  return sharedTextName;
}