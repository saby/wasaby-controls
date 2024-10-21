import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/MasterDetail/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Base from 'Controls-demo/MasterDetail/Base/Index';
import ResizingLine from 'Controls-demo/MasterDetail/ResizingLine/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...ResizingLine.getLoadConfig(),
        };
    }
}
