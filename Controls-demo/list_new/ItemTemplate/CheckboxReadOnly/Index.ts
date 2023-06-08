import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/CheckboxReadOnly/CheckboxReadOnly';
import {Memory} from 'Types/source';
import {getFewCategories as getData} from '../../DemoHelpers/DataCatalog';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';

// Демка для теста https://online.sbis.ru/opendoc.html?guid=1e54d20d-1c75-4ab1-81e7-415a4aa98013
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: [] = [4, 5];
    protected _excludedKeys: [] = [];

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
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
