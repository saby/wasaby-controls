import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

import * as template from 'wml!Controls-demo/treeGridNew/TagStyle/TagStyleFromTemplateParam/TagStyleFromTemplateParam';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IData } from 'Controls-demo/treeGridNew/DemoHelpers/Interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXITEM = 7;

function getData(): IData[] {
    const styleVariants = [null, 'info', 'danger', 'primary', 'success', 'warning', 'secondary'];
    const modifiedData = Flat.getData().map((cur, i) => {
        const index = i <= styleVariants.length - 1 ? i : i % (styleVariants.length - 1);
        return {
            ...cur,
            tagStyle: styleVariants[index],
        };
    });
    return modifiedData.slice(0, MAXITEM);
}

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TagStyleFromTemplateParam: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
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
    }
}
