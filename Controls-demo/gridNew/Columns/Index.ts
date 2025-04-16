import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Columns';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ColumnsAlign from 'Controls-demo/gridNew/Columns/Align/Index';
import ColumnsBackgroundColorStyle from 'Controls-demo/gridNew/Columns/BackgroundColorStyle/Index';
import ColumnsCellNoClickable from 'Controls-demo/gridNew/Columns/CellNoClickable/Index';
import ColumnsDisplayPropertyIsNumber from 'Controls-demo/gridNew/Columns/DisplayPropertyIsNumber/Index';
import ColumnsFontColorStyle from 'Controls-demo/gridNew/Columns/FontColorStyle/Index';
import ColumnsHiglighted from 'Controls-demo/gridNew/Columns/Higlighted/Index';
import ColumnsFontSize from 'Controls-demo/gridNew/Columns/FontSize/Index';
import ColumnsFontWeight from 'Controls-demo/gridNew/Columns/FontWeight/Index';
import ColumnsHighlightOnHover from 'Controls-demo/gridNew/Columns/HighlightOnHover/Index';
import ColumnsHoverBackgroundStyle from 'Controls-demo/gridNew/Columns/HoverBackgroundStyle/Index';
import ColumnsTextOverflow from 'Controls-demo/gridNew/Columns/TextOverflow/Index';
import ColumnsTemplate from 'Controls-demo/gridNew/Columns/Template/Index';
import ColumnsTooltip from 'Controls-demo/gridNew/Columns/Tooltip/Index';
import ColumnsType from 'Controls-demo/gridNew/Columns/Type/Index';
import ColumnsValign from 'Controls-demo/gridNew/Columns/Valign/Index';
import ColumnsWidth from 'Controls-demo/gridNew/Columns/Width/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ColumnsAlign.getLoadConfig(),
            ...ColumnsBackgroundColorStyle.getLoadConfig(),
            ...ColumnsCellNoClickable.getLoadConfig(),
            ...ColumnsDisplayPropertyIsNumber.getLoadConfig(),
            ...ColumnsFontColorStyle.getLoadConfig(),
            ...ColumnsHiglighted.getLoadConfig(),
            ...ColumnsFontSize.getLoadConfig(),
            ...ColumnsFontWeight.getLoadConfig(),
            ...ColumnsHighlightOnHover.getLoadConfig(),
            ...ColumnsHoverBackgroundStyle.getLoadConfig(),
            ...ColumnsTextOverflow.getLoadConfig(),
            ...ColumnsTemplate.getLoadConfig(),
            ...ColumnsTooltip.getLoadConfig(),
            ...ColumnsType.getLoadConfig(),
            ...ColumnsValign.getLoadConfig(),
            ...ColumnsWidth.getLoadConfig(),
        };
    }
}
