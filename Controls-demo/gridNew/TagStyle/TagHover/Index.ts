import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Record } from 'Types/entity';

import { IColumn } from 'Controls/grid';

import * as template from 'wml!Controls-demo/gridNew/TagStyle/TagHover/TagHover';
import { TagStyle } from 'Controls-demo/gridNew/DemoHelpers/Data/TagStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return TagStyle.getData().slice(1, 2);
}

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[];

    constructor(cfg: IControlOptions, context?: object) {
        super(cfg, context);
        this._columns = TagStyle.getColumns();
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
        const config = {
            target: nativeEvent.target,
            message: 'Hello world!!!',
        };

        this._notify('openInfoBox', [config], { bubbling: true });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TagHover3: {
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
