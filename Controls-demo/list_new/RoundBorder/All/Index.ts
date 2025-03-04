import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'css!Controls-demo/list_new/RoundBorder/All/All';
import 'css!DemoStand/Controls-demo';
import * as Template from 'wml!Controls-demo/list_new/RoundBorder/All/All';

function getData() {
    return [
        {
            key: 1,
            title: 'Notebooks',
            description:
                'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
            byDemand: 'Popular',
            tplPath:
                'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight',
            cursor: 'default',
            checkbox: false,
            hovered: false,
            value: 'cursor - default, hovered - false',
        },
    ];
}

/**
 * Демка для автотестов по скруглению углов в плоском списке с операциями над записью
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = [
        {
            id: 'delete',
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'Удалить',
        },
    ];
    protected _roundBorderVariants: string[] = [
        '3xs',
        '2xs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        '2xl',
        '3xl',
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RoundBorderAll: {
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
