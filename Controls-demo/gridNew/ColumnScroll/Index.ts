import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/ColumnScroll';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ColumnScrollAddColumns from 'Controls-demo/gridNew/ColumnScroll/AddColumns/Index';
import ColumnScrollBase from 'Controls-demo/gridNew/ColumnScroll/Base/Index';
import ColumnScrollColspanFirstHeaderCell from 'Controls-demo/gridNew/ColumnScroll/ColspanFirstHeaderCell/Index';
import ColumnScrollDragScrolling from 'Controls-demo/gridNew/ColumnScroll/DragScrolling/Index';
import ColumnScrollEditOnAfterMount from 'Controls-demo/gridNew/ColumnScroll/EditOnAfterMount/Index';
import ColumnScrollDevelopmentFull from 'Controls-demo/gridNew/ColumnScroll/DevelopmentFull/Index';
import ColumnScrollWithFooter from 'Controls-demo/gridNew/ColumnScroll/WithFooter/Index';
import ColumnScrollLoadMore from 'Controls-demo/gridNew/ColumnScroll/LoadMore/Index';
import ColumnScrollWithEditing from 'Controls-demo/gridNew/ColumnScroll/WithEditing/Index';
import ColumnScrollScrollStartPositionCustom from 'Controls-demo/gridNew/ColumnScroll/ScrollStartPositionCustom/Index';
import ColumnScrollResetScrollPosition from 'Controls-demo/gridNew/ColumnScroll/ResetScrollPosition/Index';
import ColumnScrollScrollStartPositionEnd from 'Controls-demo/gridNew/ColumnScroll/ScrollStartPositionEnd/Index';
import ColumnScrollWithGroups from 'Controls-demo/gridNew/ColumnScroll/WithGroups/Index';
import ColumnScrollWithItemActions from 'Controls-demo/gridNew/ColumnScroll/WithItemActions/Index';
import ColumnScrollWithoutHeader from 'Controls-demo/gridNew/ColumnScroll/WithoutHeader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ColumnScrollAddColumns.getLoadConfig(),
            ...ColumnScrollBase.getLoadConfig(),
            ...ColumnScrollColspanFirstHeaderCell.getLoadConfig(),
            ...ColumnScrollDragScrolling.getLoadConfig(),
            ...ColumnScrollEditOnAfterMount.getLoadConfig(),
            ...ColumnScrollDevelopmentFull.getLoadConfig(),
            ...ColumnScrollWithFooter.getLoadConfig(),
            ...ColumnScrollLoadMore.getLoadConfig(),
            ...ColumnScrollWithEditing.getLoadConfig(),
            ...ColumnScrollScrollStartPositionCustom.getLoadConfig(),
            ...ColumnScrollResetScrollPosition.getLoadConfig(),
            ...ColumnScrollScrollStartPositionEnd.getLoadConfig(),
            ...ColumnScrollWithGroups.getLoadConfig(),
            ...ColumnScrollWithItemActions.getLoadConfig(),
            ...ColumnScrollWithoutHeader.getLoadConfig(),
        };
    }
}
