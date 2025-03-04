import { Memory } from 'Types/source';
import * as filter from 'Controls-Layout-demo/SelectorStack/DataFilter';

export const getConfig = () => {
    return {
        employee: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: departments,
                    keyProperty: 'department',
                    filter,
                }),
                columns: [
                    {
                        displayProperty: 'title',
                        width: '',
                    },
                ],
                filterDescription: [BooleanEditorConfig],
                displayProperty: 'department',
                keyProperty: 'department',
                searchParam: 'title',
            },
        },
    };
};

const departments = [
    {
        id: 1,
        department: 'Разработка',
        title: 'Разработка',
        isDevelopment: true,
        salary: 100,
        amount: '999+',
    },
    {
        id: 2,
        department: 'Продвижение СБИС',
        title: 'Продвижение СБИС',
        isDevelopment: false,
        salary: 200,
        amount: 30,
    },
    {
        id: 3,
        department: 'Федеральная клиентская служка',
        title: 'Федеральная клиентская служка',
        isDevelopment: false,
        salary: 300,
        amount: '999+',
    },
];

const BooleanEditorConfig = {
    caption: '',
    name: 'booleanEditor',
    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
    resetValue: false,
    viewMode: 'extended',
    textValue: '',
    value: false,
    extendedCaption: 'Без рабочих групп',
    editorOptions: {
        filterValue: true,
    },
};
