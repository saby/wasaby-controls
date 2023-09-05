import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as template from 'wml!Controls-demo/Tabs/AdaptiveButtons/Icons/Template';

export default class TabButtonsDemo extends Control {
    protected _template: TemplateFunction = template;
    protected SelectedKeyIcon: string = '1';
    protected _containerWidth: number = 500;
    protected _itemsIcons: RecordSet | null = null;

    protected _beforeMount(): void {
        this._itemsIcons = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    caption: '5 262 052',
                    icons: [
                        {
                            icon: 'icon-AddContact',
                            iconStyle: 'success',
                        },
                        {
                            icon: 'icon-Check3',
                            iconStyle: 'danger',
                        },
                        {
                            icon: 'icon-Calc',
                            iconStyle: 'warning',
                        },
                    ],
                },
                {
                    id: '2',
                    caption: '132 516',
                    icons: [
                        {
                            icon: 'icon-SmileBtr',
                            iconStyle: 'success',
                            iconTooltip: 'drop',
                        },
                        {
                            icon: 'icon-Admin',
                            iconStyle: 'danger',
                        },
                    ],
                },
                {
                    id: '3',
                    caption: '897 133',
                    icons: [
                        {
                            icon: 'icon-AutoTuning',
                            iconStyle: 'success',
                        },
                    ],
                },
            ],
        });
    }

    static _styles: string[] = ['Controls-demo/Tabs/Buttons/Buttons'];
}
