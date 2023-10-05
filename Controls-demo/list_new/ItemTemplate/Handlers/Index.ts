import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/Handlers/Handlers';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { SyntheticEvent } from 'UICommon/Events';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _events: string[] = [];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemTemplateHandlers: {
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

    protected _itemEventHandler(event: SyntheticEvent, eventName: string, item: Model): void {
        const eventDescription = `${eventName} on item=${item.getKey()}`;
        const eventIsLast = this._events.lastIndexOf(eventDescription) === this._events.length - 1;
        if (!this._events.length || !eventIsLast) {
            this._events.push(eventDescription);
        }
    }

    protected _clearOutput(): void {
        this._events = [];
    }
}
