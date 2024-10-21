import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';
import * as Template from 'wml!Controls-demo/list_new/Grouped/CollapsedGroups/CollapsedGroups';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _collapsedGroups: string[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedCollapsedGroups: {
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

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        setTimeout(() => {
            this._collapsedGroups = ['apple', 'aser'];
        }, 20);
    }
}
