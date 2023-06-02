import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/HierarchyWithHierarchyList/Index';
import { Memory } from 'Types/source';
import {
    tasksFolders,
    tasksData,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IHeaderCell, IColumn } from 'Controls/grid';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const filterDescription = [
    {
        name: 'document',
        resetValue: 'Все документы',
        value: 'Все документы',
        textValue: '',
        emptyKey: 'Все документы',
        emptyText: 'Все документы',
        editorTemplateName: 'Controls/filterPanel:ListEditor',
        editorOptions: {
            keyProperty: 'document',
            displayProperty: 'document',
            source: new Memory({
                data: tasksFolders,
                keyProperty: 'document',
            }),
            parentProperty: 'parent',
            nodeProperty: 'node',
            markerStyle: 'primary',
        },
    },
];
export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [{ displayProperty: 'document' }];
    protected _header: IHeaderCell[] = [{ caption: 'Документ' }];

    static getLoadConfig(): unknown {
        return {
            documents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'document',
                        data: tasksData,
                        filter,
                    }),
                    displayProperty: 'document',
                    keyProperty: 'document',
                    parentProperty: 'parent',
                    viewMode: 'table',
                    nodeProperty: 'node',
                    filterDescription,
                },
            },
        };
    }
}
