import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/VirtualScrollEvents/NotifyKeyOnRender/NotifyKeyOnRender';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

interface IItem {
    key: number;
    title: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        count: 50,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback(item: IItem): void {
            item.title = `Запись с id="${item.key}" .${item.title}`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _notifiedKeys: string = '';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollVirtualScrollEventsNotifyKeyOnRender: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        view: 'infinity',
                    },
                },
            },
        };
    }

    protected _trackNotifiedKeys(event: Event, keys: string): void {
        if (keys.length) {
            keys.forEach((key) => {
                this._notifiedKeys += 'Загружаемый id : ' + keys + '\n';
            });
        }
    }
}
