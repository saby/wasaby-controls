import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../DemoHelpers/DataCatalog';
import template = require('wml!Controls-demo/list_new/ColumnsView/ColumnMinWidth/Template');

const NUMBER_OF_ITEMS = 10;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _wideColumns: boolean = true;
    protected _maxColumnsCount: number = 0;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewColumnMinWidth: {
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

    _changeColumnWidth(): void {
        this._wideColumns = !this._wideColumns;
    }

    _changeMaxColumnsCount(): void {
        this._maxColumnsCount = this._maxColumnsCount ? 0 : 2;
    }
}
