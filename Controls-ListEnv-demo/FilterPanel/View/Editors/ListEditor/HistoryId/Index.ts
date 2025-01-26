import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MultiSelect/Index';
import HistoryMemory from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/HistoryId/HistoryMemory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const listConfig = {
    caption: 'Отдел',
    name: 'department',
    resetValue: [],
    value: [],
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        keyProperty: 'department',
        displayProperty: 'title',
        historyId: 'myHistoryId',
        source: new HistoryMemory({
            data: departments,
            keyProperty: 'department',
        }),
        multiSelect: true,
    },
};

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig() {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [listConfig],
                    source: new Memory({
                        data: departments,
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'department',
                    displayProperty: 'title',
                },
            },
        };
    }
}
