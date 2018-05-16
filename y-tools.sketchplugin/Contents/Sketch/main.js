var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/_/utils.js":
/*!************************!*\
  !*** ./src/_/utils.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * 基础库
 * detach:解锁symbol
 * getCurrentArtBoard:获取当前选中元素的artboard
 * msg:显示信息
 * getLastLayer:获取最后一个子元素
 * getGroupWithAllSon:获取该层所有元素的拷贝
 * getColorByString:根据颜色字符串转换成sketch需要的颜色对象
 * setFillColor:设置fill的颜色
 * setBorderColor:设置边框的颜色
 * setTextInfo:获取文本的信息
 * appendLayers:添加元素
 * replaceLayerByShapes:用形状替换一个层
 * getShapeByData:获取一个层的形状
 * getSelectedLayers:获取选中的图层
 * getTextStyles:获取Text图层的样式
 * getAjustInfo:获取frame最合适的尺寸
 * groupSelect:用sketch默认方式给layer打组 * 
 * 
 */
var sketch = __webpack_require__(/*! sketch/dom */ "sketch/dom");

var _api = context;
var _doc = _api.document;
var utils = {};
/**
 * [detach 解锁symbol]
 * @return {[type]} [description]
 */

/**
 * [detach 解锁symbol]
 * @param  {[type]} layer   [description]
 * @return {[type]}         [description]
 */

utils.detach = function (layer) {
  var _it = this;

  if (!layer) {
    return false;
  }

  var layerType = layer.className(); // 如果是组

  if (layerType == 'MSLayerGroup') {
    // 依次遍历每一个元素
    layer.children().forEach(function (it, index) {
      // 忽略自己
      if (index === 0) {
        return;
      }

      _it.detach(it);
    });
  } else if (layerType == 'MSSymbolInstance') {
    var newGroup = layer.detachByReplacingWithGroup();

    _it.detach(newGroup);
  }
};
/**
 * [getCurrentArtBoard 获取当前选中元素的artboard]
 * @return {[type]} [description]
 */


utils.getCurrentArtBoard = function () {
  var _it = this; // 获取当前选中第一个元素所在的画板


  var selections = _api.selection;

  if (!selections.count()) {
    _it.msg('Please select something 😊');

    return false;
  }

  var artBoard = selections[0].parentArtboard();

  if (!artBoard) {
    _it.msg('Please select something 😊');

    return false;
  } // 一个子元素都没有就什么都不做


  var layersNum = artBoard.layers().count();

  if (!(layersNum > 0)) {
    _it.msg('This is an empty artboard 😊');

    return false;
  }

  return artBoard;
};
/**
 * [msg 显示信息]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */


utils.msg = function (msg) {
  !!msg && _doc.showMessage(msg);
};
/**
 * [getLastLayer 获取最后一个子元素]
 * @param  {[type]} parentGroup [description]
 * @return {[type]}             [description]
 */


utils.getLastLayer = function (parentGroup) {
  var layers = parentGroup.layers();
  return layers[layers.count() - 1];
};
/**
 * [getGroupWithAllSon 获取该层所有元素的拷贝]
 * @param  {[type]} parentGroup [description]
 * @return {[type]}             [description]
 */


utils.getGroupWithAllSon = function (parentGroup) {
  // 创建一个空的Group
  var group = MSLayerGroup.new(); // 遍历这个画板里面的所有子元素

  parentGroup.layers().forEach(function (layer) {
    var name = layer.name(); // 如果子元素的名字是'_fe'那么删除
    // 如果自元素是以下划线开头则什么都不做

    if (name.substr(0, 3) == '_fe') {
      layer.removeFromParent();
    } else if (name.charAt(0) != '_') {
      var duplicate = layer.copy();
      group.insertLayers_beforeLayer_([duplicate], layer);
    }
  });
  return group;
};
/**
 * [getColorByString 根据颜色字符串转换成sketch需要的颜色对象]
 * @param  {[type]} colorString [description]
 * @return {[type]}             [description]
 * Hex
 * MSColorFromString("#33AE15")
 * MSColorFromString("#333")
 * MSColorFromString("FF0000")
 * MSColorFromString("#145515FF")
 *
 * rgb/rgba
 * MSColorFromString("rgb(255,0,0)")
 * MSColorFromString("rgba(255,0,0,0.5)")
 *
 * Color keywords
 * MSColorFromString("red")
 * MSColorFromString("blue")
 * MSColorFromString("magenta")
 * MSColorFromString("darkviolet")
 *
 * hls
 * MSColorFromString("hsl(270, 60%, 50%, .15)")
 * MSColorFromString("hsl(270deg, 60%, 70%)")
 * MSColorFromString("hsl(4.71239rad, 60%, 70%)")
 * MSColorFromString("hsla(240, 100%, 50%, .4)")
 * 
 */


utils.getColorByString = function (colorString) {
  return MSImmutableColor.colorWithSVGString(colorString).newMutableCounterpart();
};
/**
 * [setFillColor 设置fill的颜色]
 * @param {[type]} it    [description]
 * @param {[type]} color [description]
 * var fill = it.style().addStylePartOfType(0);
 * fill.color = MSColor.colorWithRGBADictionary({r: 0.8, g: 0.1, b: 0.1, a: 0.5});
 */


utils.setFillColor = function (shape, color) {
  // 设置背景颜色
  var fill = shape.style().addStylePartOfType(0);
  fill.color = this.getColorByString(color);
};
/**
 * [setFillColor 设置边框的颜色]
 * @param {[type]} it    [description]
 * @param {[type]} color [description]
 * var fill = it.style().addStylePartOfType(0);
 * fill.color = MSColor.colorWithRGBADictionary({r: 0.8, g: 0.1, b: 0.1, a: 0.5});
 */


utils.setBorderColor = function (shape, color, thickness) {
  var border = shape.style().addStylePartOfType(1);
  border.color = this.getColorByString(color);
  border.thickness = thickness || 1;
};
/**
 * [setTextInfo 获取文本的信息]
 * @param {[type]} info  [description]
 * @param {[type]} layer [description]
 */


utils.setTextInfo = function (info, layer) {
  var preName = 't:'; // 如果文字没有使用共享样式报错

  if (!layer.style().sharedObjectID()) {
    info.error = true;
    info.name = preName + 'No share textStyle';
    return;
  } // 如果行高不存在报错


  var lineHeight = layer.lineHeight();

  if (!lineHeight) {
    info.error = true;
    info.name = preName + 'No lh';
    return;
  } // 高度不是行高的固定倍数报错


  var height = layer.frame().height();

  if (height % lineHeight != 0) {
    info.error = true;
    info.name = preName + 'h % lh != 0';
    return;
  }

  info.name = preName + layer.name();
};
/**
 * [appendLayers 添加元素]
 * @param  {[type]} parent [要添加的父级容器]
 * @param  {[type]} items  [要添加的元素]
 * @return {[type]}        [description]
 */


utils.appendLayers = function (parent, items) {
  var bros = parent.layers();
  var brosNum = bros.count();

  if (brosNum > 0) {
    var lastBro = bros[0];
    parent.insertLayers_beforeLayer(items, lastBro);
  } else {
    parent.addLayers(items);
  }
};
/**
 * [replaceLayerByShape 用形状替换一个层]
 * @param  {[type]} shape [description]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */


utils.replaceLayerByShapes = function (layer, items) {
  layer.parentGroup().insertLayers_beforeLayer(items, layer);
  layer.removeFromParent();
};
/**
 * [getEmptyShapeByLayer 获取一个层的形状]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */


utils.getShapeByData = function (data) {
  var _it = this; // 获取形状大小


  var cgRect = CGRectMake(data.x, data.y, data.w, data.h); // 创建形状

  var newShape = MSShapeGroup.shapeWithRect_(cgRect); // 设置名字

  data.name && newShape.setName_(data.name);

  if (data.showType == 2) {
    // 显示地貌
    var color = data.error ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,0,0.1)';

    _it.setFillColor(newShape, color);
  } else if (data.showType == 1) {
    // 显示线框
    var color = data.error ? 'rgba(255,0,0,1)' : 'rgba(0,255,255,0.8)';

    _it.setBorderColor(newShape, color, 0.5);
  }

  return newShape;
};
/**
 * [selectedLayers 获取选中的图层]
 * @return {[type]} [description]
 */


utils.getSelectedLayers = function () {
  var document = sketch.fromNative(_doc);
  return document.selectedLayers.layers;
};
/**
 * [getTextStyles 获取Text图层的样式]
 * @param  {[type]} text [textLayer]
 * @return {[type]}      [description]
 */


utils.getTextStyles = function (text) {
  var fontSize = text.fontSize();
  var fontFamily = text.fontPostscriptName().split('-')[0];
  var fontWeight = text.fontPostscriptName().split('-')[1];
  var lineHeight = text.lineHeight();
  var color = '#' + text.textColor().NSColorWithColorSpace(nil).hexValue();
  return {
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    lineHeight: lineHeight,
    color: color
  };
};
/**
 * [getAjustInfo 获取frame最合适的尺寸]
 * @param  {[type]} frame [description]
 * @return {[type]}       [description]
 */


utils.getAjustInfo = function (frame) {
  var x = frame.x;
  var y = frame.y;
  var w = frame.width;
  var h = frame.height;
  var maxLen = w > h ? w : h;
  var newW = Math.ceil((maxLen + 1) / 4) * 4;
  var newX = Math.ceil((newW - w) / 2 * -1);
  var newY = Math.ceil((newW - h) / 2 * -1);
  return {
    x: newX,
    y: newY,
    width: newW,
    height: newW
  };
};
/**
 * [groupSelect 用sketch默认方式给layer打组 ]
 * sketch 论坛 http://sketchplugins.com/d/771-how-to-trigger-group-selection
 * @return {[type]} [description]
 */


utils.groupSelect = function () {
  _doc.actionsController().actionForID("MSGroupAction").doPerformAction(nil);
};
/**
 * [groupLayers 将选中的layer用group包裹起来，类似 ctrl+g ]
 * 但是会改变原始图层的位置，感觉还是用groupSelect比较好 所以被弃用了
 * @param  {[type]} layers [description]
 * @return {[type]}        [description]
 */
// utils.groupLayers = function(layers, name) {
// 	if (!(layers && layers.length > 0)) {
// 		return false;
// 	}
// 	let parent = layers[0].parent;
// 	if (!parent) {
// 		parent = sketch.Page.fromNative(layers[0].sketchObject.parentPage())
// 	}
// 	let container = new sketch.Group({
// 		layers: layers,
// 		name: name || '_',
// 		parent: parent
// 	});
// 	container.adjustToFit();
// 	return container;
// };


/* harmony default export */ __webpack_exports__["default"] = (utils);

/***/ }),

/***/ "./src/create-shared-style/index.js":
/*!******************************************!*\
  !*** ./src/create-shared-style/index.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_/utils.js */ "./src/_/utils.js");

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  if (!context.selection.length) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("Please select a layer");

    return;
  }

  var target = context.selection[0];

  if (target.className() != 'MSTextLayer') {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("Please select a text");

    return;
  }

  var textStyles = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getTextStyles(target); // 行高必须比文字大


  if (!(textStyles.lineHeight > textStyles.fontSize)) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("lineHeight「 " + textStyles.lineHeight + " 」 should bigger than fontSize「 " + textStyles.fontSize + " 」");

    return;
  } // 行高必须是4的倍数


  if (textStyles.lineHeight % 4 != 0) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("lineHeight「 " + textStyles.lineHeight + " 」 can't be divided by 4 ");

    return;
  }

  var textStyleName = generateStyleName(textStyles);
  var currentTextStyles = context.document.documentData().layerTextStyles();
  var s = MSSharedStyle.alloc().initWithName_firstInstance(textStyleName, target.style());
  currentTextStyles.addSharedObject(s);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("Success!");
});

function generateStyleName(styles) {
  var fontSize = styles.fontSize,
      fontFamily = styles.fontFamily,
      fontWeight = styles.fontWeight,
      lineHeight = styles.lineHeight,
      color = styles.color;
  var sharedTextName = "".concat(fontFamily, "/").concat(fontSize, "/").concat(lineHeight, "/").concat(color);

  if (fontWeight) {
    sharedTextName = sharedTextName + '/' + fontWeight;
  }

  return sharedTextName;
}

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! exports provided: showBoundingBox, showTopographic, clearTopographic, createTextStyle, scopeIcon, unScopeIcon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showBoundingBox", function() { return showBoundingBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showTopographic", function() { return showTopographic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearTopographic", function() { return clearTopographic; });
/* harmony import */ var _topographic_Common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./topographic/Common.js */ "./src/topographic/Common.js");
/* harmony import */ var _scope_icon_scope_icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scope-icon/scope-icon.js */ "./src/scope-icon/scope-icon.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "scopeIcon", function() { return _scope_icon_scope_icon_js__WEBPACK_IMPORTED_MODULE_1__["scopeIcon"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unScopeIcon", function() { return _scope_icon_scope_icon_js__WEBPACK_IMPORTED_MODULE_1__["unScopeIcon"]; });

/* harmony import */ var _create_shared_style_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./create-shared-style/index.js */ "./src/create-shared-style/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createTextStyle", function() { return _create_shared_style_index_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });





function showBoundingBox() {
  new _topographic_Common_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
    showType: 1
  });
}

function showTopographic() {
  new _topographic_Common_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
    showType: 2
  });
}

function clearTopographic() {
  new _topographic_Common_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
    showType: 0
  });
}



/***/ }),

/***/ "./src/scope-icon/scope-icon.js":
/*!**************************************!*\
  !*** ./src/scope-icon/scope-icon.js ***!
  \**************************************/
/*! exports provided: scopeIcon, unScopeIcon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scopeIcon", function() { return scopeIcon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unScopeIcon", function() { return unScopeIcon; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_/utils.js */ "./src/_/utils.js");
 // let's get a hold on the Sketch API

var sketch = __webpack_require__(/*! sketch/dom */ "sketch/dom");

var Group = sketch.Group;
var Shape = sketch.Shape;
var Rectangle = sketch.Rectangle;

function scopeIcon(context) {
  var layers = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedLayers(); //啥都没选就什么都不做


  if (!layers.length) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("select something 🙌");

    return;
  } // 用原生的方式打组


  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].groupSelect(); // 选取打组好的组


  var container = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedLayers()[0]; // 如果没有取到


  if (!container) {
    return;
  } // 计算出最合适的尺寸


  var ajustInfo = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getAjustInfo(container.frame); //创建矩形


  var shape = new Shape({
    parent: container,
    name: '_bg',
    // 不懂为什么这里不能设置x,y
    frame: new Rectangle(0, 0, ajustInfo.width, ajustInfo.height)
  }); // 重新挪动矩形位置

  var rect = new Rectangle({
    x: ajustInfo.x,
    y: ajustInfo.y
  });
  rect.changeBasis({
    from: shape,
    to: shape.parent
  }); // 移动到最底层

  shape.moveToBack(); // 让容器包含元素

  container.adjustToFit();

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("Scope icon success | 图标结界成功 🙌");
}

;

function unScopeIcon(context) {
  var layers = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getSelectedLayers();

  layers.forEach(function (layer, index) {
    if (layer.type === 'Group') {
      var firstLayer = layer.layers[0];

      if (firstLayer.name == '_bg') {
        firstLayer.remove();
      }

      layer.sketchObject.ungroup();
    }
  });

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg("unscope icon success | 图标结界解除 🙌");
}

;


/***/ }),

/***/ "./src/topographic/Common.js":
/*!***********************************!*\
  !*** ./src/topographic/Common.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_/utils.js */ "./src/_/utils.js");

var _api = context;
var _doc = _api.document;

function App(opt) {
  this.errorNum = 0; // 0 代表地貌
  // 1 代表线框

  this.showType = opt.showType || 0;
  this.init();
}

;

App.prototype.init = function () {
  var _it = this;

  var artBoard = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getCurrentArtBoard();

  if (!artBoard) {
    return false;
  } // 如果能找到'_fe'文件夹就直接删掉，然后理解为是第二次操作


  if (_it.showType == 0) {
    var lastLayer = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getLastLayer(artBoard);

    var lastLayerName = lastLayer.name();

    if (lastLayerName == '_fe') {
      lastLayer.removeFromParent();
      return;
    }
  }

  var group = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getGroupWithAllSon(artBoard);

  group.setName('_fe'); // group.setIsSelected(true);

  group.setIsLocked(true); // 要先添加到dom里面才能解除组件

  artBoard.addLayers([group]);

  var feGroup = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getLastLayer(artBoard); // 解组


  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].detach(feGroup); // 依次遍历每一个元素


  feGroup.children().forEach(function (layer, index) {
    // 忽略自己
    if (index === 0) {
      return;
    }

    var info = _it.getLayerInfo(layer);

    if (info.error) {
      _it.errorNum++;
    }

    _it.showShapeByInfo(layer, info);
  });

  if (_it.errorNum) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg('😢 ' + _it.errorNum + ' text error 😢');
  } else {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].msg('😊 No text error 😊');
  }
};

App.prototype.showShapeByInfo = function (layer, info) {
  var _it = this; // 删除默认要删除的


  if (info.del) {
    layer.removeFromParent();
    return;
  }

  var frame = layer.frame();

  var shape = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].getShapeByData({
    showType: _it.showType,
    error: info.error,
    name: info.name,
    x: info.type == 'MSLayerGroup' ? 0 : frame.x(),
    y: info.type == 'MSLayerGroup' ? 0 : frame.y(),
    w: frame.width(),
    h: frame.height()
  });

  if (info.append2Myself) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].appendLayers(layer, [shape]);

    return;
  }

  if (info.replaceWithShape) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].replaceLayerByShapes(layer, [shape]);

    return;
  }
};
/**
 * [getLayerInfo 输出layer信息]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */


App.prototype.getLayerInfo = function (layer) {
  var _it = this;

  var name = layer.name();
  var type = layer.className();
  var info = {
    name: name,
    type: type // del:false //是否删除
    // append2Myself:false // 直接在内部添加形状
    // replaceWithShape:false // 将自身替换成形状

  }; // 如果以下划线开头则删除这个元素

  if (name.charAt(0) == '_') {
    info.del = true;
    return info;
  } // 如果是图片也删除这个元素


  if (type == 'MSBitmapLayer') {
    info.del = true;
    return info;
  } // 如果是文件夹则判断自身


  if (type == 'MSLayerGroup') {
    info.append2Myself = true;
    return info;
  } // 如果是形状或者是symbol


  if (type == 'MSShapeGroup' || type == 'MSSymbolInstance') {
    info.replaceWithShape = true;
    return info;
  } // 处理文字


  if (type == 'MSTextLayer') {
    info.replaceWithShape = true;

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].setTextInfo(info, layer);

    return info;
  }

  return info;
};

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['scopeIcon'] = __skpm_run.bind(this, 'scopeIcon');
that['onRun'] = __skpm_run.bind(this, 'default');
that['unScopeIcon'] = __skpm_run.bind(this, 'unScopeIcon');
that['createTextStyle'] = __skpm_run.bind(this, 'createTextStyle');
that['showBoundingBox'] = __skpm_run.bind(this, 'showBoundingBox');
that['showTopographic'] = __skpm_run.bind(this, 'showTopographic');
that['clearTopographic'] = __skpm_run.bind(this, 'clearTopographic')

//# sourceMappingURL=main.js.map