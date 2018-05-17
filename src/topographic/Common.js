import _utils from '../_/utils.js';

const _api = context;
const _doc = _api.document;


function App(opt) {
	this.shapeNum = 0;
	// 0 代表地貌
	// 1 代表线框
	this.showType = opt.showType || 0;
	this.init();
};

App.prototype.init = function() {
	var _it = this;

	_it.startTime = new Date().getTime();

	var selection = _utils.getOneSelection();
	if (!selection) {
		return;
	}
	var feGroup = _utils.createFeGroup(selection);
	if (!feGroup) {
		return;
	}

	_utils.detach(feGroup, function(layer) {
		var name = layer.name();

		// 删除下划线文件
		if (name.charAt(0) == '_') {
			layer.removeFromParent();
			return false;
		}

		// 忽略 i/文件
		if (name.substr(0, 2) == 'i/') {
			return false;
		}
	});

	// 依次遍历每一个元素
	feGroup.children().forEach(function(layer, index) {
		if (index == 0) {
			return;
		}
		_it.showShape(layer);
	});
	_utils.msg('I draw ' + _it.shapeNum + ' shapes in ' + _it.getRunTime() + 'ms 😊');
};

App.prototype.getRunTime = function() {
	var _it = this;
	var endTime = new Date().getTime();
	var startTime = _it.startTime;

	return endTime - startTime;
};

App.prototype.showShape = function(layer) {
	var _it = this;
	var name = layer.name();
	var type = layer.className();
	var isGroup = (type == 'MSLayerGroup') ? true : false;

	// 创建形状
	var frame = layer.frame();
	var shapeData = {
		showType: _it.showType,
		name: '_' + name,
		x: isGroup ? 0 : frame.x(),
		y: isGroup ? 0 : frame.y(),
		w: frame.width(),
		h: frame.height()
	};

	var shape = _utils.getShapeByData(shapeData);

	_it.shapeNum++;
	if (isGroup) {
		_utils.appendLayers(layer, [shape]);
	} else {
		_utils.replaceLayerByShapes(layer, [shape]);
	}
};

export default App;