import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Source/IsAdaptive/Index';
import { Memory } from 'Types/source';
import ListData from 'Controls-ListEnv-demo/FilterPanel/View/Source/IsAdaptive/resources/ListData';
import * as filter from './DataFilter';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            adaptiveData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: ListData,
                        keyProperty: 'fullName',
                        filter,
                    }),
                    keyProperty: 'fullName',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'post',
                            caption: 'Должность',
                            value: [],
                            resetValue: [],
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            textValue: '',
                            viewMode: 'basic',
                            isAdaptive: true,
                            editorOptions: {
                                source: new Memory({
                                    data: [
                                        {
                                            id: 'Генеральный директор',
                                            title: 'Генеральный директор',
                                            parent: null,
                                            node: null,
                                        },
                                        {
                                            id: 'Программист',
                                            title: 'Программист',
                                            node: true,
                                            parent: null,
                                        },
                                        {
                                            id: 'Технолог',
                                            title: 'Технолог',
                                            parent: 'Программист',
                                            node: null,
                                        },
                                        {
                                            id: 'Инженер',
                                            title: 'Инженер',
                                            parent: 'Программист',
                                            node: null,
                                        },
                                        {
                                            id: 'Уборщик',
                                            title: 'Уборщик',
                                            parent: null,
                                            node: null,
                                        },
                                        {
                                            id: 'Менеджер',
                                            title: 'Менеджер',
                                            parent: null,
                                            node: null,
                                        },
                                    ],
                                    keyProperty: 'id',
                                }),
                                displayProperty: 'title',
                                keyProperty: 'id',
                                parentProperty: 'parent',
                                nodeProperty: 'node',
                                markerStyle: 'primary',
                            },
                        },
                    ],
                },
            },
        };
    }
}
