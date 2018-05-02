import Topographic from './topographic/Common.js';
import { scopeIcon, unScopeIcon} from './scope-icon/scope-icon.js';
import createTextStyle from './create-shared-style/index.js';

function showBoundingBox() {
	new Topographic({
		showType: 1
	});
}

function showTopographic() {
	new Topographic({
		showType: 2
	});
}

function clearTopographic() {
	new Topographic({
		showType: 0
	});
}

export {
	showBoundingBox,
	showTopographic,
	clearTopographic,
	createTextStyle,
	scopeIcon,
	unScopeIcon
};