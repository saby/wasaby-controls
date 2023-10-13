import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dropdown_new/Button/ItemAlign/Left/Left';
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _sourceWithIcons: Memory;

    protected _beforeMount(): void {
        this._sourceWithIcons = new Memory({
            keyProperty: 'key',
            data: [
                {
                    id: 1,
                    title: 'Task',
                    '@parent': true,
                    icon: 'icon-Attach',
                    parent: null,
                },
                {
                    id: 2,
                    title: 'Error in the development',
                    '@parent': false,
                    icon: 'icon-Attach',
                    parent: null,
                },
                { id: 3, title: 'Commission', parent: 1, icon: 'icon-Attach' },
                {
                    id: 4,
                    title: 'Coordination',
                    parent: 1,
                    icon: 'icon-Attach',
                    '@parent': true,
                },
                { id: 5, title: 'Application', parent: 1, icon: 'icon-Attach' },
                { id: 6, title: 'Development', parent: 1, icon: 'icon-Attach' },
                {
                    id: 7,
                    title: 'Exploitation',
                    parent: 1,
                    icon: 'icon-Attach',
                },
                {
                    id: 8,
                    title: 'Coordination',
                    parent: 4,
                    icon: 'icon-Attach',
                },
                {
                    id: 9,
                    title: 'Negotiate the discount',
                    parent: 4,
                    icon: 'icon-Attach',
                },
                {
                    id: 10,
                    title: 'Coordination of change prices',
                    parent: 4,
                    icon: 'icon-Attach',
                },
                {
                    id: 11,
                    title: 'Matching new dish',
                    parent: 4,
                    icon: 'icon-Attach',
                },
            ],
        });
    }

    static _styles: string[] = ['Controls-demo/dropdown_new/Menu/Menu'];
}
