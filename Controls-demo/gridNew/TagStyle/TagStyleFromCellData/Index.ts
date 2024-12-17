import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';

import { IColumn } from 'Controls/grid';

import * as template from 'wml!Controls-demo/gridNew/TagStyle/TagStyleFromCellData/TagStyleFromCellData';
import { TagStyle } from 'Controls-demo/gridNew/DemoHelpers/Data/TagStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = TagStyle;

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[];

    // Название свойства, из которого следует брать стильдля тега
    protected _tagStyleProperty: string;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    // Разделитель колонок
    protected _columnSeparatorSize: string;

    constructor(cfg: IControlOptions, context?: object) {
        super(cfg, context);
        this._tagStyleProperty = 'customProperty';
        this._columns = TagStyle.getColumns();
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
        this._currentValue = item.get('population');
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
        this._currentValue = item.get('population');
    }

    protected _toggleColumnSeparator(event: Event): void {
        this._columnSeparatorSize = this._columnSeparatorSize === 's' ? undefined : 's';
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TagStyleFromCellData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    }
}
