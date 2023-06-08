import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/MultiSelect/CustomPosition/CustomPosition';
import { CrudEntityKey, Memory } from 'Types/source';
import { SyntheticEvent } from 'UICommon/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys: CrudEntityKey[] = [2, 5];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData3: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    selectedKeys: [2, 5],
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    }

    protected _onSelectedKeysChanged(event: SyntheticEvent, keys: CrudEntityKey[]): void {
        this._selectedKeys = keys;
    }
}
