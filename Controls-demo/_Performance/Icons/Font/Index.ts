import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/_Performance/Icons/Font/template';
import { getData } from '../Data';
import { Memory } from 'Types/source';
import 'css!Controls/CommonClasses';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory = new Memory({
        keyProperty: 'id',
        data: getData(),
    });

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
    > {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
