import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { TTagStyle } from 'Controls/interface';

import * as template from 'wml!Controls-demo/list_new/ColumnsView/TagStyle/TagStyle';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

// Генератор данных
const tagStyles: TTagStyle[] = [
    null,
    'info',
    'danger',
    'primary',
    'success',
    'warning',
    'secondary',
    'info',
];
const data = generateData<{ key: number; title: string; tagStyle: string }>({
    count: 7,
    entityTemplate: { title: 'string', tagStyle: 'string' },
    beforeCreateItemCallback: (item) => {
        item.title = `Запись с id="${item.key}".`;
        item.tagStyle = tagStyles[item.key];
    },
});

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }

    protected _getTagStyle(item: Model): TTagStyle {
        return item?.get('tagStyle');
    }

    /**
     * Эти хандлеры срабатывают при клике на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    protected _onTagClickCustomHandler(
        event: Event,
        item: Model,
        columnIndex: number,
        nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'click';
        this._currentValue = item.get('title');
    }

    /**
     * Эти хандлеры срабатывают при наведении на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    protected _onTagHoverCustomHandler(
        event: Event,
        item: Model,
        columnIndex: number,
        nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'hover';
        this._currentValue = item.get('title');
    }
}
