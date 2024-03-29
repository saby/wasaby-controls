import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';
import { TTagStyle } from 'Controls/interface';

import { IColumn } from 'Controls/grid';

import * as template from 'wml!Controls-demo/list_new/ColumnsView/TagStyleProperty/TagStyleProperty';
import { generateData } from '../../DemoHelpers/DataCatalog';

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
    protected _columns: IColumn[];

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    // Разделитель колонок
    protected _columnSeparatorSize: string;

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
        item: Record,
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
        item: Record,
        columnIndex: number,
        nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'hover';
        this._currentValue = item.get('title');
    }

    protected _toggleColumnSeparator(event: Event): void {
        this._columnSeparatorSize =
            this._columnSeparatorSize === 's' ? undefined : 's';
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
