import _utils from '../_/utils.js';

// let's get a hold on the Sketch API
const sketch = require('sketch/dom');
const Group = sketch.Group;
const Shape = sketch.Shape;
const Rectangle = sketch.Rectangle;

function scopeIcon(context) {
	let layers = _utils.getSelectedLayers();

	//啥都没选就什么都不做
	if (!layers.length) {
		_utils.msg("select something 🙌");
		return;
	}

	// 用原生的方式打组
	_utils.groupSelect();
	// 选取打组好的组
	let container = _utils.getSelectedLayers()[0];
	// 如果没有取到
	if (!container) {
		return;
	}

	// 计算出最合适的尺寸
	let ajustInfo = _utils.getAjustInfo(container.frame);

	//创建矩形
	let shape = new Shape({
		parent: container,
		name: '_bg',
		// 不懂为什么这里不能设置x,y
		frame: new Rectangle(0, 0, ajustInfo.width, ajustInfo.height)
	});

	// 重新挪动矩形位置
	var rect = new Rectangle({
		x: ajustInfo.x,
		y: ajustInfo.y
	});
	rect.changeBasis({ from: shape, to: shape.parent });

	// 移动到最底层
	shape.moveToBack();

	// 让容器包含元素
	container.adjustToFit();

	_utils.msg("Scope icon success | 图标结界成功 🙌");
};

function unScopeIcon(context) {
	let layers = _utils.getSelectedLayers();
	layers.forEach(function(layer, index) {
		if (layer.type === 'Group') {
			let firstLayer = layer.layers[0];
			if (firstLayer.name == '_bg') {
				firstLayer.remove();
			}
			layer.sketchObject.ungroup();
		}
	});
	_utils.msg("unscope icon success | 图标结界解除 🙌");
};

export {
	scopeIcon,
	unScopeIcon,
};