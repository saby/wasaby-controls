import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/Hierarchy/Index';
import { Memory, HierarchicalMemory } from 'Types/source';
import * as filter from './DataFilter';
import { IHeaderCell, IColumn } from 'Controls/grid';
import { tasks } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as CntTpl from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/Hierarchy/PersonInfo';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const filterDescription = [
    {
        name: 'document',
        resetValue: null,
        value: null,
        textValue: '',
        editorTemplateName: 'Controls/filterPanel:ListEditor',
        editorOptions: {
            keyProperty: 'document',
            displayProperty: 'document',
            historyId: 'TEST_HISTORY_ID',
            source: new HierarchicalMemory({
                data: [
                    { document: 'Задачи', node: true, parent: null },
                    { document: 'Ошибки', node: true, parent: null },
                    {
                        document: 'Ошибки в разработке',
                        node: null,
                        parent: 'Ошибки',
                    },
                    {
                        document: 'Ошибки на тестировании',
                        node: null,
                        parent: 'Ошибки',
                    },
                    {
                        document: 'Задачи в разработке',
                        node: null,
                        parent: 'Задачи',
                    },
                    {
                        document: 'Задачи на тестировании',
                        node: null,
                        parent: 'Задачи',
                    },
                ],
                keyProperty: 'document',
                parentProperty: 'parent',
            }),
            parentProperty: 'parent',
            nodeProperty: 'node',
            markerStyle: 'primary',
        },
    },
];
export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [
        { displayProperty: 'task', template: CntTpl, width: 'max-content' },
        { displayProperty: 'department' },
    ];
    protected _header: IHeaderCell[] = [{ caption: 'Текст' }, { caption: 'Отдел' }];

    static getLoadConfig(): unknown {
        return {
            documents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: tasks,
                        filter,
                    }),
                    displayProperty: 'department',
                    keyProperty: 'id',
                    filterDescription,
                },
            },
        };
    }
}
