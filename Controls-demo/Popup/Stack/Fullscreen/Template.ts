import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Stack/Fullscreen/Template';

class Template extends Control {
    protected _template: TemplateFunction = template;
    private _isOpenFullscreen: boolean = false;

    protected _clickHandlerFullscreen(event: Event) {
        this._isOpenFullscreen = !this._isOpenFullscreen;
        this._notify('fullscreen', [this._isOpenFullscreen], { bubbling: true });
    }
}

export default Template;
