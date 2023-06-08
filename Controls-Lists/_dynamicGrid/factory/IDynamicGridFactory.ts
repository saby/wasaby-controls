import type { IColumnConfig } from 'Controls/gridReact';
import type {
    IListDataFactoryArguments,
    IDataFactory,
} from 'Controls/dataFactory';
import type { ICrud, CrudEntityKey } from 'Types/source';
import type { TNavigationDirection } from 'Controls/interface';
import { IHeaderCell } from 'Controls/grid';

export interface IColumnsNavigationSourceConfig {
    field: string;
    direction: TNavigationDirection;
    limit: number;
    position: Date;
}

export interface IColumnsNavigation {
    source: string;
    sourceConfig: IColumnsNavigationSourceConfig;
}

export interface IDynamicGridParams {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    staticHeaders: IHeaderCell[];
    dynamicHeader: IHeaderCell;
    dynamicColumnsSource: ICrud;
    columnsNavigation: IColumnsNavigation;
}

export interface IDynamicColumnsFilter {
    direction: TNavigationDirection;
    limit: number;
    position: Date;
}

export interface IDynamicGridDataFactoryArguments
    extends IListDataFactoryArguments,
        IDynamicGridParams {}

export type IDynamicGridDataFactory = IDataFactory<
    unknown,
    IDynamicGridDataFactoryArguments
>;
