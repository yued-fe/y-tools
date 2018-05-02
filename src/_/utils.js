const sketch = require('sketch/dom');
const _api = context;
const _doc = _api.document;

let utils = {};
/**
 * [msg 显示信息]
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
utils.msg = function(msg) {
	!!msg && _doc.showMessage(msg);
};

/**
 * [getLastLayer 获取最后一个字元素]
 * @param  {[type]} parentGroup [description]
 * @return {[type]}             [description]
 */
utils.getLastLayer = function(parentGroup) {
	var layers = parentGroup.layers();
	return layers[layers.count() - 1];
};

/**
 * [getGroupWithAllSon 获取改层所有元素的拷贝]
 * @param  {[type]} parentGroup [description]
 * @return {[type]}             [description]
 */
utils.getGroupWithAllSon = function(parentGroup) {
	// 创建一个空的Group
	var group = MSLayerGroup.new();

	// 遍历这个画板里面的所有子元素
	parentGroup.layers().forEach(function(layer) {
		var name = layer.name();

		// 如果子元素的名字是'_fe'那么删除
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
 * [getColorByString 根据颜色字符串转换成sketck 需要的颜色对象]
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
utils.getColorByString = function(colorString) {
	return MSImmutableColor.colorWithSVGString(colorString).newMutableCounterpart();
};

/**
 * [setFillColor 设置fill的颜色]
 * @param {[type]} it    [description]
 * @param {[type]} color [description]
 * var fill = it.style().addStylePartOfType(0);
 * fill.color = MSColor.colorWithRGBADictionary({r: 0.8, g: 0.1, b: 0.1, a: 0.5});
 */
utils.setFillColor = function(shape, color) {
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
utils.setBorderColor = function(shape, color, thickness) {
	var border = shape.style().addStylePartOfType(1);
	border.color = this.getColorByString(color);
	border.thickness = thickness || 1;
};

/**
 * [setTextInfo 获取文本的信息]
 * @param {[type]} info  [description]
 * @param {[type]} layer [description]
 */
utils.setTextInfo = function(info, layer) {
	var preName = 't:';

	// 如果文字没有使用共享样式报错
	if (!layer.style().sharedObjectID()) {
		info.error = true;
		info.name = preName + 'No share textStyle';
		return;
	}

	// 如果行高不存在报错
	var lineHeight = layer.lineHeight();
	if (!lineHeight) {
		info.error = true;
		info.name = preName + 'No lh';
		return;
	}

	// 高度不是行高的固定倍数报错
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
utils.appendLayers = function(parent, items) {
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
 * [replaceLayerByShape]
 * @param  {[type]} shape [description]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */
utils.replaceLayerByShapes = function(layer, items) {
	layer.parentGroup().insertLayers_beforeLayer(items, layer);
	layer.removeFromParent();
};

/**
 * [getEmptyShapeByLayer 获取一个层的形状]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */
utils.getShapeByData = function(data) {
	var _it = this;

	// 获取形状大小
	var cgRect = CGRectMake(data.x, data.y, data.w, data.h);
	// 创建形状
	var newShape = MSShapeGroup.shapeWithRect_(cgRect);

	// 设置名字
	data.name && newShape.setName_(data.name);

	if (data.showType == 2) {
		// 显示地貌
		var color = (data.error) ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,0,0.1)';
		_it.setFillColor(newShape, color);
	} else if (data.showType == 1) {
		// 显示线框
		var color = (data.error) ? 'rgba(255,0,0,1)' : 'rgba(0,255,255,0.8)';
		_it.setBorderColor(newShape, color, 0.5);
	}

	return newShape;
};

/**
 * [selectedLayers 获取选中的图层]
 * @return {[type]} [description]
 */
utils.getSelectedLayers = function() {
	const document = sketch.fromNative(_doc);
	return document.selectedLayers.layers;
};

/**
 * [getTextStyles 获取Text图层的样式]
 * @param  {[type]} text [textLayer]
 * @return {[type]}      [description]
 */
utils.getTextStyles=function(text) {
	const fontSize = text.fontSize();
	const fontFamily = text.fontPostscriptName().split('-')[0];
	const fontWeight = text.fontPostscriptName().split('-')[1];
	const lineHeight = text.lineHeight();
	const color = '#' + text.textColor().NSColorWithColorSpace(nil).hexValue();
  	return { fontSize, fontFamily, fontWeight, lineHeight, color }
};

/**
 * [getAjustInfo 获取frame最合适的尺寸]
 * @param  {[type]} frame [description]
 * @return {[type]}       [description]
 */
utils.getAjustInfo = function(frame) {
	let x = frame.x;
	let y = frame.y;
	let w = frame.width;
	let h = frame.height;
	let maxLen = (w > h) ? w : h;
	let newW = Math.ceil((maxLen + 1) / 4) * 4;
	let newX = Math.ceil((newW - w) / 2 * -1);
	let newY = Math.ceil((newW - h) / 2 * -1);
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
utils.groupSelect = function() {
	_doc.actionsController().actionForID("MSGroupAction").doPerformAction(nil);
};

/**
 * [groupLayers 将选中的layer用group包裹起来，类似 ctrl+g ]
 * 但是会改变原始图层的位置，感觉还是用groupSelect比较好
 * @param  {[type]} layers [description]
 * @return {[type]}        [description]
 */
utils.groupLayers = function(layers, name) {
	if (!(layers && layers.length > 0)) {
		return false;
	}
	let parent = layers[0].parent;
	if (!parent) {
		parent = sketch.Page.fromNative(layers[0].sketchObject.parentPage())
	}
	let container = new sketch.Group({
		layers: layers,
		name: name || '_',
		parent: parent
	});
	container.adjustToFit();
	return container;
};

export default utils;