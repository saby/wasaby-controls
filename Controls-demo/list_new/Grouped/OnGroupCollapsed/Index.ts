import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';

import * as Template from 'wml!Controls-demo/list_new/Grouped/OnGroupCollapsed/OnGroupCollapsed';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _groupClickMessage: String;

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
                },
            },
        };
    }

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._groupClickMessage = '';
    }

    protected _clearMessage(): void {
        this._groupClickMessage = '';
    }

    protected _onGroupCollapsed(event: Event, changes: String): void {
        this._groupClickMessage = `Свернули группу с id="${changes}".`;
    }

    protected _onGroupExpanded(event: Event, changes: String): void {
        this._groupClickMessage = `Развернули группу с id="${changes}".`;
    }
}
