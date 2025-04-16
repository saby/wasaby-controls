import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Popup/StackPageWrapper/Index';
import { Controller } from 'Controls/popup';
import { getPopupWidth } from 'Controls/popupTemplateStrategy';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _width: number;
    protected _minSavedWidth: number;
    protected _maxSavedWidth: number;

    protected _beforeMount(
        options: IControlOptions,
        context: object,
        resivedState: object
    ): Promise<unknown> {
        return new Promise((resolve) => {
            // Показываем как получать и передавать 'презагруженные' данные в StackPageWrapper
            getPopupWidth('new_tab_panel').then((resultData) => {
                this._width = resultData?.width;
                this._minSavedWidth = resultData?.minSavedWidth;
                this._maxSavedWidth = resultData?.maxSavedWidth;
                resolve(resultData || {});
            });
        });
    }

    protected _afterMount(): void {
        this._resizeHandler();
    }

    protected _resizeHandler(): void {
        const workspace = document.querySelector('.controls-PageTemplate');
        const workspaceCoords = workspace.getBoundingClientRect();
        const rightPanelWidth = 54;
        Controller.setContentData({
            top: workspaceCoords.top,
            left: workspaceCoords.left,
            width: workspaceCoords.width - rightPanelWidth,
        });
        window.clearSettinngStorage = false;
    }
}
