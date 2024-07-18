import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import controlTemplate = require('wml!Controls-demo/Lookup/WithHierarchy/Index');
import suggestTemplate = require('wml!Controls-demo/Lookup/resources/SuggestTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _suggestTemplate: TemplateFunction = suggestTemplate;
    protected _selectorTemplate: TemplateFunction = null;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                {
                    id: 1,
                    title: 'Mаркировка',
                    active: true,
                    'parent@': false,
                    parent: null,
                },
                {
                    id: 2,
                    title: 'ЕГАИС',
                    active: true,
                    'parent@': null,
                    parent: null,
                },
                {
                    id: 3,
                    title: 'Базовые возможности',
                    active: true,
                    'parent@': null,
                    parent: null,
                },
                {
                    id: 4,
                    title: 'Госсистемы',
                    active: true,
                    'parent@': false,
                    parent: null,
                },
                {
                    id: 5,
                    title: 'Salary Зарплаты',
                    active: true,
                    'parent@': false,
                    parent: null,
                },
                {
                    id: 6,
                    title: 'Склад и госсистемы',
                    active: true,
                    'parent@': false,
                    parent: null,
                },
                {
                    id: 7,
                    title: 'SMS, Viber, Соцсети (рассылки)',
                    active: true,
                    'parent@': null,
                    parent: null,
                },
                {
                    id: 8,
                    title: 'Меркурий',
                    active: false,
                    'parent@': null,
                    parent: null,
                },
                {
                    id: 9,
                    title: 'Маркировка лекарства',
                    active: false,
                    'parent@': null,
                    parent: null,
                },
            ],
            idProperty: 'id',
            filter: MemorySourceFilter(),
        });
    }
}
