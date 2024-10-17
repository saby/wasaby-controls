import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/EditArrow/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

const data = [
    { department: 'Разработка', title: 'Разработка', count: 4 },
    { department: 'Продвижение СБИС', title: 'Продвижение СБИС', count: 10, addText: '15' },
    {
        department: 'Федеральная клиентская служка',
        title: 'Федеральная клиентская служка',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            itemActionsData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: 'Отдел',
                            name: 'department',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                showEditArrow: true,
                                keyProperty: 'department',
                                displayProperty: 'title',
                                source: new Memory({
                                    data,
                                    keyProperty: 'department',
                                }),
                                additionalTextProperty: 'addText',
                                mainCounterProperty: 'count',
                                itemActions: [
                                    {
                                        id: 'erase',
                                        icon: 'icon-Erase',
                                        iconSize: 's',
                                        commandName: 'Controls/listCommands:RemoveWithConfirmation',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        };
    }
}
