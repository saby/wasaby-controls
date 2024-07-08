/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { ICellProps, IFooterConfig, IBaseColumnConfig } from 'Controls/gridReact';
import { patchColumnProps, addDefaultClassNameToAllDynamicColumns } from './patchColumnProps';
import { TColumnDataDensity } from '../types';
import {
    IDynamicColumnConfig,
    IDynamicHeaderConfig,
    IDynamicGridComponentProps,
    ISuperHeaderConfig,
} from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';
import { IRange, IQuantum } from '../../interfaces/IEventRenderProps';

export interface IPrepareDynamicColumnsParamsCommon
    extends Pick<
        IDynamicGridComponentProps,
        | 'hoverMode'
        | 'dynamicColumnsCount'
        | 'dynamicColumnsGridData'
        | 'columnsSpacing'
        | 'quantum'
    > {}

type IExtraColumnConfig = IDynamicHeaderConfig | IFooterConfig;

export interface IPrepareExtraRowColumnsParams extends IPrepareDynamicColumnsParamsCommon {
    extraRowStaticColumns: IExtraColumnConfig[];
    extraRowEndStaticColumns?: IExtraColumnConfig[];
    extraRowDynamicColumn: IExtraColumnConfig;
    extraRowDynamicSubColumns?: IBaseColumnConfig[];
    extraRowDynamicSuperColumns?: ISuperHeaderConfig[];
    getPreparedDynamicColumn?: Function;
    dataDensity: TColumnDataDensity;
    dynamicColumn: IDynamicColumnConfig;
    getCellProps?: () => ICellProps;
    range: IRange;
    quantums?: IQuantum[];
    filtered?: boolean;
}

export function prepareExtraRowColumns(
    params: IPrepareExtraRowColumnsParams
): IExtraColumnConfig[] {
    const {
        extraRowStaticColumns,
        extraRowDynamicColumn,
        extraRowEndStaticColumns,
        getPreparedDynamicColumn,
        extraRowDynamicSubColumns,
        extraRowDynamicSuperColumns,
        dataDensity,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        quantum,
        hoverMode,
        getCellProps,
        range,
        quantums,
        filtered,
    } = params;

    if (!params.extraRowDynamicColumn) {
        return null;
    }

    const resultColumns = [...extraRowStaticColumns];

    resultColumns.forEach((config) =>
        patchColumnProps(
            config,
            (originResult: ICellProps) => ({
                backgroundStyle: originResult?.backgroundStyle || 'unaccented',
            }),
            'extraRowBackground'
        )
    );

    if (extraRowDynamicColumn) {
        const preparedDynamicColumn = getPreparedDynamicColumn({
            extraRowDynamicColumn,
            extraRowDynamicSubColumns,
            extraRowDynamicSuperColumns,
            dataDensity,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            columnsSpacing,
            quantum,
            hoverMode,
            getCellProps,
            range,
            quantums,
            filtered,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    if (extraRowEndStaticColumns && extraRowEndStaticColumns.length) {
        const columns = [...extraRowEndStaticColumns];

        columns.forEach((config) => {
            patchColumnProps(
                config,
                (originResult: ICellProps) => ({
                    backgroundStyle: originResult?.backgroundStyle || 'unaccented',
                }),
                'extraRowEndBackground'
            );
        });

        resultColumns.push(...columns);
    }

    addDefaultClassNameToAllDynamicColumns(resultColumns);

    return resultColumns;
}
