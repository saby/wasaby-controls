/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
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
