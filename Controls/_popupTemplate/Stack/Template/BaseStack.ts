/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/BaseStack/BaseStack';
import { Controller as ManagerController } from 'Controls/popup';
import 'css!Controls/popupTemplate';

export interface IBaseStackTemplateOptions extends IControlOptions {
    stackPosition?: 'right' | 'left';
}

class StackTemplate extends Control<IBaseStackTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _popupDirection: string;

    protected _beforeMount(options: IBaseStackTemplateOptions): void {
        this._popupDirection = options.stackPosition || ManagerController.getStackPosition();
    }
}
export default StackTemplate;
