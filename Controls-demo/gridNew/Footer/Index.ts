import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Footer/Footer';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import SeparatedFooter from 'Controls-demo/gridNew/Footer/SeparatedFooter/Index';
import TemplateOptions from 'Controls-demo/gridNew/Footer/TemplateOptions/Index';
import FooterTemplate from 'Controls-demo/gridNew/Footer/FooterTemplate/Index';
import Footer from 'Controls-demo/gridNew/Footer/Footer/Index';
import Sticky from 'Controls-demo/gridNew/Footer/Sticky/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SeparatedFooter.getLoadConfig(),
            ...TemplateOptions.getLoadConfig(),
            ...FooterTemplate.getLoadConfig(),
            ...Footer.getLoadConfig(),
            ...Sticky.getLoadConfig(),
        };
    }
}
