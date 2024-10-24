import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/DateEditor/Index';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            dateData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            caption: 'Дата отправки',
                            name: 'dateEditor',
                            editorTemplateName: 'Controls/filterPanelEditors:Date',
                            resetValue: null,
                            viewMode: 'basic',
                            value: null,
                            editorOptions: {
                                closeButtonVisibility: 'hidden',
                                extendedCaption: 'Дата',
                            },
                        },
                    ],
                },
            },
        };
    }
}
