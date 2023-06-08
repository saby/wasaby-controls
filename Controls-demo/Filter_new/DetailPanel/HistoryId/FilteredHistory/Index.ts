import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/DetailPanel/HistoryId/FilteredHistory/Index';
import 'Controls-demo/Filter_new/resources/HistorySourceDemo';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = [];

    protected _beforeMount(): void {
        this._source = [
            {
                name: 'NDS',
                value: [],
                resetValue: [],
                textValue: '',
                viewMode: 'extended',
                markFirstItem: true,
                group: 'secondGroup',
                column: 'left',
                itemTemplate:
                    'wml!Controls-demo/Filter_new/resources/Editors/Dropdown',
                additionalTemplate:
                    'Controls-demo/Filter_new/resources/Editors/Additional/Select',
                visibility: false,
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'С НДС' },
                            { id: 3, title: 'БЕЗ НДС' },
                        ],
                    }),
                },
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
