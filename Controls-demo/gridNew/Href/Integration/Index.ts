import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Href/Integration/Href';
import { Memory } from 'Types/source';
import { Href } from 'Controls-demo/gridNew/DemoHelpers/Data/Href';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Href;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown = Href.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Href: {
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
}
