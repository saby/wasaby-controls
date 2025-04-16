import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Base from 'Controls-demo/gridNew/Base/Index';
import ItemTemplate from 'Controls-demo/gridNew/ItemTemplate/Index';
import EmptyGrid from 'Controls-demo/gridNew/EmptyGrid/Index';
import Header from 'Controls-demo/gridNew/Header/Index';
import Results from 'Controls-demo/gridNew/Results/Index';
import Sorting from 'Controls-demo/gridNew/Sorting/Index';
import EditInPlace from 'Controls-demo/gridNew/EditInPlace/Index';
import ColumnScroll from 'Controls-demo/gridNew/ColumnScroll/Index';
import Columns from 'Controls-demo/gridNew/Columns/Index';
import Multiselect from 'Controls-demo/gridNew/Multiselect/Index';
import CustomPosition from 'Controls-demo/gridNew/CustomPosition/Index';
import Ladder from 'Controls-demo/gridNew/Ladder/Index';
import VirtualScroll from 'Controls-demo/gridNew/VirtualScroll/Index';
import RowSeparator from 'Controls-demo/gridNew/RowSeparator/Index';
import ColumnSeparator from 'Controls-demo/gridNew/ColumnSeparator/Index';
import DragNDrop from 'Controls-demo/gridNew/DragNDrop/Index';
import Grouped from 'Controls-demo/gridNew/Grouped/Index';
import ItemActions from 'Controls-demo/gridNew/ItemActions/Index';
import TagStyle from 'Controls-demo/gridNew/TagStyle/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...ItemTemplate.getLoadConfig(),
            ...EmptyGrid.getLoadConfig(),
            ...Header.getLoadConfig(),
            ...Results.getLoadConfig(),
            ...Sorting.getLoadConfig(),
            ...EditInPlace.getLoadConfig(),
            ...ColumnScroll.getLoadConfig(),
            ...Columns.getLoadConfig(),
            ...Multiselect.getLoadConfig(),
            ...CustomPosition.getLoadConfig(),
            ...Ladder.getLoadConfig(),
            ...VirtualScroll.getLoadConfig(),
            ...RowSeparator.getLoadConfig(),
            ...ColumnSeparator.getLoadConfig(),
            ...DragNDrop.getLoadConfig(),
            ...Grouped.getLoadConfig(),
            ...ItemActions.getLoadConfig(),
            ...TagStyle.getLoadConfig(),
        };
    }
}
