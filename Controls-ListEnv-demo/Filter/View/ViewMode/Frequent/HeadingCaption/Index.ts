import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/ViewMode/Frequent/HeadingCaption/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: object[] = null;

    protected _beforeMount(): void {
        this._source = [
            {
                name: 'files',
                value: 1,
                resetValue: [],
                emptyText: 'All files',
                editorOptions: {
                    headingCaption: 'files',
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            { id: 1, title: 'Incoming' },
                            { id: 2, title: 'Outgoing' },
                        ],
                    }),
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
                viewMode: 'frequent',
            },
        ];
    }
}
