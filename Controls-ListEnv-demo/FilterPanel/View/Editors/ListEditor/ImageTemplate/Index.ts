import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageTemplate/Index';
import 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageTemplate/ImageTemplate';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            imageTemplateData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departments,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'owner',
                            caption: 'Ответственный',
                            resetValue: null,
                            value: null,
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanel:ListEditor',
                            editorOptions: {
                                style: 'master',
                                keyProperty: 'id',
                                displayProperty: 'title',
                                imageTemplate:
                                    'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/ImageTemplate/ImageTemplate',
                                source: new Memory({
                                    data: departments,
                                    keyProperty: 'id',
                                }),
                            },
                        },
                    ],
                },
            },
        };
    }
}
