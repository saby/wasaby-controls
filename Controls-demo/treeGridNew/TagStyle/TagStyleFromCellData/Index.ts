import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { IColumn, TCellHorizontalAlign } from 'Controls/grid';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

import * as template from 'wml!Controls-demo/treeGridNew/TagStyle/TagStyleFromCellData/TagStyleFromCellData';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const MAXITEM = 7;

const TAG_STYLE_PROPERTY = 'customProperty';

function getData() {
    const styleVariants = [null, 'info', 'danger', 'primary', 'success', 'warning', 'secondary'];
    const modifiedData = Flat.getData().map((cur, i) => {
        const index = i <= styleVariants.length - 1 ? i : i % (styleVariants.length - 1);
        return {
            ...cur,
            [TAG_STYLE_PROPERTY]: styleVariants[index],
        };
    });
    return modifiedData.slice(0, MAXITEM);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[];
    protected _hasMultiSelect: boolean = false;

    // Название свойства, из которого следует брать стильдля тега
    protected _tagStyleProperty: string;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    constructor(cfg: IControlOptions, context?: object) {
        super(cfg, context);
        this._tagStyleProperty = TAG_STYLE_PROPERTY;
        this._columns = [
            {
                displayProperty: 'title',
                width: '200px',
            },
            {
                displayProperty: 'rating',
                width: '150px',
            },
            {
                displayProperty: 'country',
                width: '150px',
                align: 'right' as TCellHorizontalAlign,
                tagStyleProperty: this._tagStyleProperty,
            },
        ];
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
        item: CollectionItem<Model>,
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
        item: Model,
        columnIndex: number,
        nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'hover';
        this._currentValue = item.get('title');
    }

    protected _onHasMultiSelectChanged(e: Event, value: boolean): void {
        this._hasMultiSelect = value;
        this._options._dataOptionsValue.listdata.setState({
            multiSelectVisibility: value ? 'visible' : 'hidden',
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TagStyleFromCellData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    expandedItems: [1],
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    },
});
