import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as controlTemplate from 'wml!Controls-demo/list_new/Navigation/Cut/CutSize/CutSize';

import CutSizeL from 'Controls-demo/list_new/Navigation/Cut/CutSize/L/Index';
import CutSizeM from 'Controls-demo/list_new/Navigation/Cut/CutSize/M/Index';
import CutSizeS from 'Controls-demo/list_new/Navigation/Cut/CutSize/S/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...CutSizeL.getLoadConfig(),
            ...CutSizeM.getLoadConfig(),
            ...CutSizeS.getLoadConfig(),
        };
    }
}
