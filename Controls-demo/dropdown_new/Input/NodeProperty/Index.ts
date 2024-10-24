import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/NodeProperty/Index');
import { Memory } from 'Types/source';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _sourceWithIcons: Memory;
    protected _selectedKeys: number[] = [1];
    protected _selectedKeys1: number[] = [1];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'In any state',
                    text: 'In any state',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 2,
                    title: 'In progress',
                    text: 'In progress',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 3,
                    title: 'Completed',
                    text: 'Completed',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: 4,
                    title: 'positive',
                    parent: 3,
                    '@parent': null,
                },
                {
                    key: 5,
                    title: 'negative',
                    parent: 3,
                    '@parent': null,
                },
                {
                    key: 6,
                    title: 'Deleted',
                    text: 'Deleted',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 7,
                    title: 'Drafts',
                    text: 'Drafts',
                    parent: null,
                    '@parent': null,
                },
            ],
        });
        this._sourceWithIcons = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 1,
                    title: 'In any state',
                    text: 'In any state',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 2,
                    title: 'In progress',
                    text: 'In progress',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 3,
                    title: 'Completed',
                    text: 'Completed',
                    parent: null,
                    '@parent': false,
                },
                {
                    key: 4,
                    title: 'positive',
                    iconStyle: 'success',
                    icon: 'icon-Successful',
                    parent: 3,
                    '@parent': null,
                },
                {
                    key: 5,
                    title: 'negative',
                    iconStyle: 'danger',
                    icon: 'icon-Minus',
                    parent: 3,
                    '@parent': null,
                },
                {
                    key: 6,
                    title: 'Deleted',
                    text: 'Deleted',
                    parent: null,
                    '@parent': null,
                },
                {
                    key: 7,
                    title: 'Drafts',
                    text: 'Drafts',
                    parent: null,
                    '@parent': null,
                },
            ],
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
