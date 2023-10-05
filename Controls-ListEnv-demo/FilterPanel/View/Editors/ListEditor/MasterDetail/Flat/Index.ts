import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterDetail/Flat/Index';
import { Memory } from 'Types/source';
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
            displayProperty: 'title',
            source: new Memory({
                data: [
                    { id: 1, document: 'Задачи', title: 'Задачи' },
                    { id: 2, document: 'Ошибки', title: 'Ошибки' },
                ],
                keyProperty: 'document',
            }),
            markerStyle: 'primary',
        },
    },
];
export default class LayoutWithFilter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [
        { displayProperty: 'employee' },
        { displayProperty: 'date' },
        { displayProperty: 'department' },
    ];
    protected _header: IHeaderCell[] = [
        { caption: 'Исполнитель' },
        { caption: 'Срок' },
        { caption: 'Отдел' },
    ];

    static getLoadConfig(): unknown {
        return {
            documents: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 1,
                                employee: 'Иванов В.С.',
                                date: '21.02',
                                department: 'Разработка',
                                document: 'Задачи',
                            },
                            {
                                id: 2,
                                employee: 'Смирнов С.П.',
                                date: '23.04',
                                department: 'Продвижение СБИС',
                                document: 'Задачи',
                            },
                            {
                                id: 3,
                                employee: 'Васильев К.М.',
                                date: '25.05',
                                department: 'Федеральная клиентская служка',
                                document: 'Задачи',
                            },
                            {
                                id: 4,
                                employee: 'Новиков Д.В.',
                                date: '21.01',
                                department: 'Разработка',
                                document: 'Ошибки',
                            },
                            {
                                id: 5,
                                employee: 'Субботин А.В.',
                                date: '22.01',
                                department: 'Разработка',
                                document: 'Ошибки',
                            },
                        ],
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
