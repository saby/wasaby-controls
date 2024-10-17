/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_tile/itemActions/Menu/Menu';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';

/**
 * Опции контрола, отображающего опции над записью в виде меню
 * @private
 */
export interface ITileMenuActionsOptions extends IControlOptions {
    source: Memory;
    previewWidth: number;
    previewHeight: number;
    additionalText: string;
    title: string;
}

/**
 * Контрол, отображающий опции над записью в виде меню
 * @private
 */
export default class extends Control<ITileMenuActionsOptions> {
    protected _template: TemplateFunction = template;

    protected _itemClick(event: Event) {
        this._notify('sendResult', ['click', null, event], { bubbling: true });
    }

    protected _sendResult(
        event: SyntheticEvent<MouseEvent>,
        action: string,
        data: unknown,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._notify('sendResult', [action, data, nativeEvent], {
            bubbling: true,
        });
    }
}
