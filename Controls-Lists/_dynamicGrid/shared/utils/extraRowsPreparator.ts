import { ICellProps, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import { patchColumnProps, addDefaultClassNameToAllDynamicColumns } from './patchColumnProps';
import { TColumnDataDensity } from '../types';
import {
    IDynamicColumnConfig,
    IDynamicGridComponentProps,
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

type IExtraColumnConfig = IHeaderConfig | IFooterConfig;

export interface IPrepareExtraRowColumnsParams extends IPrepareDynamicColumnsParamsCommon {
    extraRowStaticColumns: IExtraColumnConfig[];
    extraRowEndStaticColumns?: IExtraColumnConfig[];
    extraRowDynamicColumn: IExtraColumnConfig;
    getPreparedDynamicColumn?: Function;
    dataDensity: TColumnDataDensity;
    dynamicColumn: IDynamicColumnConfig;
    getCellProps?: () => ICellProps;
    range: IRange;
    quantums?: IQuantum[];
}

export function prepareExtraRowColumns(
    params: IPrepareExtraRowColumnsParams
): IExtraColumnConfig[] {
    const {
        extraRowStaticColumns,
        extraRowDynamicColumn,
        extraRowEndStaticColumns,
        getPreparedDynamicColumn,
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