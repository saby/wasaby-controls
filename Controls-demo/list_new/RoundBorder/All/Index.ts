import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import 'css!Controls-demo/list_new/RoundBorder/All/All';
import * as Template from 'wml!Controls-demo/list_new/RoundBorder/All/All';

/**
 * Демка для автотестов по скруглению углов в плоском списке с операциями над записью
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
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

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
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
            ],
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
