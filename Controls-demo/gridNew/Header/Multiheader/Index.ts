import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/Multiheader';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import MultiheaderBase from 'Controls-demo/gridNew/Header/Multiheader/Base/Index';
import MultiheaderGridCaption from 'Controls-demo/gridNew/Header/Multiheader/GridCaption/Index';
import MultiheaderAddButton from 'Controls-demo/gridNew/Header/Multiheader/AddButton/Index';
import MultiheaderColumnScroll from 'Controls-demo/gridNew/Header/Multiheader/ColumnScroll/Index';
import MultiheaderTextOverflow from 'Controls-demo/gridNew/Header/Multiheader/TextOverflow/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MultiheaderBase.getLoadConfig(),
            ...MultiheaderGridCaption.getLoadConfig(),
            ...MultiheaderAddButton.getLoadConfig(),
            ...MultiheaderColumnScroll.getLoadConfig(),
            ...MultiheaderTextOverflow.getLoadConfig(),
        };
    }
}
