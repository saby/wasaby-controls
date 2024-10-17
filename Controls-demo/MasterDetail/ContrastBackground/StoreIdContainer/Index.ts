import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/MasterDetail/ContrastBackground/StoreIdContainer/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): unknown {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'name',
                        data: [
                            {
                                name: 'Выручка',
                                type: null,
                                parent: null,
                                count: 155,
                            },
                            {
                                name: 'Приход',
                                type: true,
                                parent: null,
                                count: 200,
                            },
                            {
                                name: 'Рассчет',
                                type: null,
                                parent: 'Приход',
                                count: 120,
                            },
                            {
                                name: 'Аванс',
                                type: null,
                                parent: 'Приход',
                                count: 80,
                            },
                            {
                                name: 'Расход',
                                type: null,
                                parent: null,
                                count: 45,
                            },
                        ],
                    }),
                    expandedItems: ['Приход'],
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    keyProperty: 'name',
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            {
                                id: 1,
                                title: 'Огурец соленый',
                                name: 'Рассчет',
                                parent: 'Приход',
                            },
                            {
                                id: 2,
                                title: 'Рис',
                                name: 'Рассчет',
                                parent: 'Приход',
                            },
                            {
                                id: 3,
                                title: 'Кальмар',
                                name: 'Аванс',
                                parent: 'Приход',
                            },
                            {
                                id: 4,
                                title: 'Зеленый чай',
                                name: 'Аванс',
                                parent: 'Приход',
                            },
                            {
                                id: 5,
                                title: 'Гречневая крупа',
                                name: 'Аванс',
                                parent: 'Приход',
                            },
                            {
                                id: 6,
                                title: 'Расходные материалы',
                                name: 'Расход',
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                },
            },
        };
    }

    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];
}
