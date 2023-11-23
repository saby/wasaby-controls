import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { HierarchicalMemory, CrudEntityKey } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { getData } from 'Controls-ListEnv-demo/Toc/Data';
import 'Controls/operations';

import * as Template from 'wml!Controls-ListEnv-demo/Toc/MasterDetail/Template';

export default class TocDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _selectedKey: CrudEntityKey = 'in_root-1';

    protected _beforeMount(): void {
        this._onSelectedKeyChanged = this._onSelectedKeyChanged.bind(this);
    }

    protected _onSelectedKeyChanged(key: CrudEntityKey): void {
        this._selectedKey = key;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            documents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    root: 'in_root-1',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    displayProperty: 'caption',
                    keyProperty: 'key',
                },
            },
        };
    }
}
