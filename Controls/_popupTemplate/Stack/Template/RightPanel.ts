/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/RightPanel/RightPanel';
import { Controller as ManagerController } from 'Controls/popup';
import 'css!Controls/popupTemplate';

interface IRightPanelOptions extends IControlOptions {
    maximizeButtonClickCallback?: () => void;
    toolbarContentTemplate: TemplateFunction;
}

export default class RightPanel extends Control<IRightPanelOptions> {
    protected _template: TemplateFunction = template;
    protected _rightBottomTemplate: string;
    protected _isOutsidePanel: boolean = true;

    protected _beforeMount(options: IRightPanelOptions): void {
        this._rightBottomTemplate = ManagerController.getRightPanelBottomTemplate();
        if (!ManagerController.hasRightPanel() && options.toolbarContentTemplate) {
            this._isOutsidePanel = false;
        }
    }

    protected _maximizeButtonClickHandler(): void {
        if (this._options.maximizeButtonClickCallback) {
            this._options.maximizeButtonClickCallback();
        }
    }

    protected _close(): void {
        this._notify('close', [], { bubbling: true });
    }
}
