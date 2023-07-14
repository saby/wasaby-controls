import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/OpenFromCode/Index');
import { Memory } from 'Types/source';
import { Button } from 'Controls/dropdown';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _children: {
        button: Button;
    };

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '1',
                    title: 'Task',
                    '@parent': true,
                    parent: null,
                },
                {
                    id: '2',
                    title: 'Error in the development',
                    '@parent': false,
                    parent: null,
                },
                { id: '3', title: 'Commission', parent: '1' },
                {
                    id: '4',
                    title: 'Coordination',
                    parent: '1',
                    '@parent': true,
                },
                { id: '5', title: 'Application', parent: '1' },
                { id: '6', title: 'Development', parent: '1', '@parent': true },
                { id: '7', title: 'Exploitation', parent: '1' },
                { id: '8', title: 'Coordination', parent: '4' },
                { id: '9', title: 'Negotiate the discount', parent: '4' },
                {
                    id: '10',
                    title: 'Coordination of change prices',
                    parent: '4',
                },
                { id: '11', title: 'Merge request', parent: '6' },
                { id: '12', title: 'Changing the operation rule', parent: '6' },
                {
                    id: '13',
                    title: 'Code review',
                    parent: '6',
                    '@parent': true,
                },
                { id: '14', title: 'Matching new dish', parent: '6' },
                { id: '15', title: 'Frontend', parent: '13' },
                { id: '16', title: 'Backend', parent: '13' },
            ],
        });
    }

    _openSubMenu(): void {
        this._children.button.openMenu(
            {
                templateOptions: {
                    borderStyle: 'warning',
                },
            },
            '',
            '1'
        );
    }

    _closeSubMenu(event: Event, key: string): void {
        this._children.button.closeMenu(key);
    }
}
