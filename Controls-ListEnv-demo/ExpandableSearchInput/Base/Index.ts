import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/ExpandableSearchInput/Base/Base';
import { Memory } from 'Types/source';
import { listData } from 'Controls-ListEnv-demo/Filter/resources/Data';
import 'css!Controls-ListEnv-demo/Search/Index';

export default class ExpandableInputDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, unknown> {
        return {
            list: {
                type: 'list',
                typeOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: listData,
                    }),
                    searchParam: 'name',
                    keyProperty: 'id',
                    displayProperty: 'name',
                },
            },
        };
    }
}
