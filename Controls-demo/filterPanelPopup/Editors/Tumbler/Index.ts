import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Editors/Tumbler/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';

export const tumblerConfig = {
    name: 'gender',
    value: '1',
    resetValue: null,
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelExtEditors:TumblerEditor',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мужской',
                },
                {
                    id: '2',
                    caption: 'Женский',
                },
            ],
            keyProperty: 'id',
            displayProperty: 'caption',
        }),
        extendedCaption: 'Пол',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                {
                    id: '1',
                    title: 'Мужской',
                },
                {
                    id: '2',
                    title: 'Женский',
                },
            ],
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                return (
                    queryFilter?.gender === item.get('id') ||
                    !queryFilter?.gender
                );
            },
        });
        this.filterButtonSource = [tumblerConfig];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/Index',
    ];
}
