import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/ConstantHeights';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ConstantHeightsAddItemInEnd from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/AddItemInEnd/Index';
import ConstantHeightsBigLastItem from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/BigLastItem/Index';
import ConstantHeightsDefault from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/Default/Index';
import ConstantHeightsOneLoadOnInitDown from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/OneLoadOnInit/Down/Index';
import ConstantHeightsVirtualPageEqualSourcePage from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/VirtualPageEqualSourcePage/Index';
import ConstantHeightsScrollToItem from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/ScrollToItem/Index';
import ConstantHeightsUpdateByScrolling from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/UpdateByScrolling/Index';
import ConstantHeightsSmallDialog from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/SmallDialog/Index';
import ConstantHeightsOneLoadOnInitUp from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/OneLoadOnInit/Up/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            // ...ConstantHeightsAddItemInEnd.getLoadConfig(),
            ...ConstantHeightsBigLastItem.getLoadConfig(),
            ...ConstantHeightsDefault.getLoadConfig(),
            ...ConstantHeightsOneLoadOnInitDown.getLoadConfig(),
            ...ConstantHeightsVirtualPageEqualSourcePage.getLoadConfig(),
            ...ConstantHeightsScrollToItem.getLoadConfig(),
            ...ConstantHeightsUpdateByScrolling.getLoadConfig(),
            ...ConstantHeightsSmallDialog.getLoadConfig(),
            ...ConstantHeightsOneLoadOnInitUp.getLoadConfig(),
        };
    }
}
