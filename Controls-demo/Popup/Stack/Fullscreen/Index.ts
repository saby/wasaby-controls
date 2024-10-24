import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Stack/Fullscreen/Index';
import {StackOpener} from 'Controls/popup';

class FullscreenPopup extends Control {
    protected _template: TemplateFunction = template;
    protected _stackOpener: StackOpener;


    protected _afterMount(options?: {}) {
        this._stackOpener = new StackOpener();
    }

    protected _clickHandler(event: Event) {
        this._stackOpener.open({
            template: 'Controls-demo/Popup/Stack/Fullscreen/Template',
            opener: this._container,
            minWidth: 400,
            maxWidth: 800,
        });
    }
}

export default FullscreenPopup;
