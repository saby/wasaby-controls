import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import { Record } from 'Types/entity';

import * as template from 'wml!Controls-demo/treeGridNew/TagStyle/TagStyleFromTemplateParam/TagStyleFromTemplateParam';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IData } from 'Controls-demo/treeGridNew/DemoHelpers/Interface';

const MAXITEM = 7;

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    // Раскрытые элементы дерева
    protected _expandedItems: any[] = [1];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        const data = this._getModifiedData().slice(0, MAXITEM);
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
        item: CollectionItem<Record>,
        columnIndex: number,
        nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'click';
        this._currentValue = item.getContents().get('title');
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

    private _getModifiedData(): IData[] {
        const styleVariants = [
            null,
            'info',
            'danger',
            'primary',
            'success',
            'warning',
            'secondary',
        ];
        return Flat.getData().map((cur, i) => {
            const index = i <= styleVariants.length - 1 ? i : i % (styleVariants.length - 1);
            return {
                ...cur,
                tagStyle: styleVariants[index],
            };
        });
    }
}
