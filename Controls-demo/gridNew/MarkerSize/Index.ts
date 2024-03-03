import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/MarkerSize/MarkerSize';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import MarkerSizeImage from 'Controls-demo/gridNew/MarkerSize/Image/Index';
import MarkerSizeText from 'Controls-demo/gridNew/MarkerSize/Text/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MarkerSizeImage.getLoadConfig(),
            ...MarkerSizeText.getLoadConfig(),
        };
    }
}
