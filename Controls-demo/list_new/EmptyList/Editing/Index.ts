import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EmptyList/Editing/Editing';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
        };
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd();
    }
}
