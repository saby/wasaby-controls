import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/Resize/Element/Element';
import { CrudEntityKey, Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { SyntheticEvent } from 'Vdom/Vdom';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import 'Controls-demo/list_new/VirtualScroll/Resize/Element/ExpandingElement';

interface IItem {
    key: number;
    title: string;
    template?: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        count: 10,
        entityTemplate: { title: 'number' },
        beforeCreateItemCallback(item: IItem): void {
            if (item.key === 1) {
                item.template =
                    'Controls-demo/list_new/VirtualScroll/Resize/Element/ExpandingElement';
            }

            item.title = `Запись #${item.key}`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _activeElement: CrudEntityKey = '2';

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollResizeElement: {
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
                    activeElement: '2',
                },
            },
        };
    }

    protected _onActiveElementChanged(e: SyntheticEvent, key: CrudEntityKey): void {
        this._activeElement = key;
    }
}
