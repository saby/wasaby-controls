import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/HeadingCaptionProperty/Index');
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'Task',
                    '@parent': true,
                    parent: null,
                },
                {
                    key: 2,
                    title: 'Error in the development',
                    '@parent': false,
                    parent: null,
                },
                { key: 3, title: 'Commission', parent: 1 },
                {
                    key: 4,
                    title: 'Coordination',
                    parent: 1,
                    '@parent': true,
                    headingCaption: 'Node header caption',
                },
                { key: 5, title: 'Application', parent: 1 },
                { key: 6, title: 'Development', parent: 1 },
                { key: 7, title: 'Exploitation', parent: 1 },
                { key: 8, title: 'Coordination', parent: 4 },
                { key: 9, title: 'Negotiate the discount', parent: 4 },
                { key: 10, title: 'Coordination of change prices', parent: 4 },
                { key: 11, title: 'Matching new dish', parent: 4 },
            ],
        });
    }
}
