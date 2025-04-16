import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/Validators/Index';
import { isRangeLessThanYear } from 'Controls-ListEnv-demo/Filter/View/Editors/Validators/Validator';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig() {
        return {
            delivery: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [
                        {
                            caption: 'Срок',
                            name: 'dateEditorTerm',
                            editorTemplateName: 'Controls/filterPanelEditors:DateRange',
                            resetValue: [],
                            viewMode: 'basic',
                            value: [],
                            editorOptions: {
                                emptyCaption: 'Бессрочно',
                                validators: [isRangeLessThanYear],
                            },
                        },
                    ],
                    source: new Memory({
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                },
            },
        };
    }
}
