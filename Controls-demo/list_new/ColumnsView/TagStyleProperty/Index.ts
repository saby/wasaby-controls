import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import {Model} from 'Types/entity';
import {TTagStyle} from 'Controls/interface';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';

import * as template from 'wml!Controls-demo/list_new/ColumnsView/TagStyleProperty/TagStyleProperty';
import {generateData} from '../../DemoHelpers/DataCatalog';
import 'css!DemoStand/Controls-demo';

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

function getData() {
    return generateData<{ key: number; title: string; tagStyle: string }>({
        count: 7,
        entityTemplate: { title: 'string', tagStyle: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}".`;
            item.tagStyle = tagStyles[item.key];
        },
    });
}

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
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
