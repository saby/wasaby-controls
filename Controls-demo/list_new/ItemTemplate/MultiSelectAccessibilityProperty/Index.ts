import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/MultiSelectAccessibilityProperty/MultiSelectAccessibilityProperty';
import { Memory } from 'Types/source';
import { MultiSelectAccessibility } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';

function getData() {
    const data = getFewCategories();
    data[0].checkboxState = MultiSelectAccessibility.disabled;
    data[1].checkboxState = MultiSelectAccessibility.disabled;
    data[2].checkboxState = MultiSelectAccessibility.hidden;
    data[3].checkboxState = MultiSelectAccessibility.enabled;
    data[4].checkboxState = MultiSelectAccessibility.enabled;
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateMultiSelectAccessibilityProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    selectedKeys: [1],
                    excludedKeys: [],
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
