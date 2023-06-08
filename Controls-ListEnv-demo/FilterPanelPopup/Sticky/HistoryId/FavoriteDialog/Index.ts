import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanelPopup/Sticky/HistoryId/FavoriteDialog/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/HistoryId/FavoriteDialog/HistorySourceDemo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            historyData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { id: 'Yaroslavl', title: 'Yaroslavl' },
                            { id: 'Moscow', title: 'Moscow' },
                            { id: 'Kazan', title: 'Kazan' },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    historySaveMode: 'favorite',
                    historyId: 'myHistoryId',
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'city',
                            editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                            resetValue: [],
                            value: ['Moscow'],
                            viewMode: 'basic',
                            textValue: '',
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        { id: 'Yaroslavl', title: 'Yaroslavl' },
                                        { id: 'Moscow', title: 'Moscow' },
                                        { id: 'Kazan', title: 'Kazan' },
                                    ],
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                                multiSelect: true,
                            },
                        },
                    ],
                },
            },
        };
    }
}
