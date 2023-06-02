import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/TumblerEditor/Index';

export const TumblerConfig = {
    caption: 'Пол',
    name: 'gender',
    value: '1',
    resetValue: '1',
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelExtEditors:TumblerEditor',
    editorOptions: {
        items: new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мужской',
                },
                {
                    id: '2',
                    caption: 'Женский',
                },
            ],
            keyProperty: 'id',
        }),
    },
};

export default class TumblerEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
    > {
        return {
            tumblerData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { caption: 'Мужской', gender: '1' },
                            { caption: 'Женский', gender: '2' },
                        ],
                        filter,
                        keyProperty: 'caption',
                    }),
                    keyProperty: 'caption',
                    displayProperty: 'caption',
                    filterDescription: [TumblerConfig],
                },
            },
        };
    }
}
