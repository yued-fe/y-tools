import _utils from '../_/utils.js';

const _api = context;
const _doc = _api.document;


function App(opt) {
	this.errorNum = 0;
	// 0 代表地貌
	// 1 代表线框
	this.showType = opt.showType || 0;
	this.init();
};

App.prototype.init = function() {
	var _it = this;
	var artBoard = _utils.getCurrentArtBoard();

	if (!artBoard) {
		return false;
	}

	// 如果能找到'_fe'文件夹就直接删掉，然后理解为是第二次操作
	if (_it.showType == 0) {
		var lastLayer = _utils.getLastLayer(artBoard);
		var lastLayerName = lastLayer.name();
		if (lastLayerName == '_fe') {
			lastLayer.removeFromParent();
			return;
		}
	}

	var group = _utils.getGroupWithAllSon(artBoard);
	group.setName('_fe');
	// group.setIsSelected(true);
	group.setIsLocked(true);

	// 要先添加到dom里面才能解除组件
	artBoard.addLayers([group]);

	var feGroup = _utils.getLastLayer(artBoard);

	// 解组
	_utils.detach(feGroup);

	// 依次遍历每一个元素
	feGroup.children().forEach(function(layer, index) {
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
		_utils.msg('😢 ' + _it.errorNum + ' text error 😢');
	} else {
		_utils.msg('😊 No text error 😊');
	}
};

App.prototype.showShapeByInfo = function(layer, info) {
	var _it = this;
	// 删除默认要删除的
	if (info.del) {
		layer.removeFromParent();
		return;
	}

	var frame = layer.frame();
	var shape = _utils.getShapeByData({
		showType: _it.showType,
		error: info.error,
		name: info.name,
		x: info.type == 'MSLayerGroup' ? 0 : frame.x(),
		y: info.type == 'MSLayerGroup' ? 0 : frame.y(),
		w: frame.width(),
		h: frame.height()
	});

	if (info.append2Myself) {
		_utils.appendLayers(layer, [shape]);
		return;
	}

	if (info.replaceWithShape) {
		_utils.replaceLayerByShapes(layer, [shape]);
		return;
	}
};

/**
 * [getLayerInfo 输出layer信息]
 * @param  {[type]} layer [description]
 * @return {[type]}       [description]
 */
App.prototype.getLayerInfo = function(layer) {
	var _it = this;
	var name = layer.name();
	var type = layer.className();

	var info = {
		name: name,
		type: type
		// del:false //是否删除
		// append2Myself:false // 直接在内部添加形状
		// replaceWithShape:false // 将自身替换成形状
	};

	// 如果以下划线开头则删除这个元素
	if (name.charAt(0) == '_') {
		info.del = true;
		return info;
	}
	// 如果是图片也删除这个元素
	if (type == 'MSBitmapLayer') {
		info.del = true;
		return info;
	}

	// 如果是文件夹则判断自身
	if (type == 'MSLayerGroup') {
		info.append2Myself = true;
		return info;
	}

	// 如果是形状或者是symbol
	if ((type == 'MSShapeGroup') || (type == 'MSSymbolInstance')) {
		info.replaceWithShape = true;
		return info;
	}

	// 处理文字
	if (type == 'MSTextLayer') {
		info.replaceWithShape = true;
		_utils.setTextInfo(info, layer);
		return info;
	}

	return info;
};

export default App;