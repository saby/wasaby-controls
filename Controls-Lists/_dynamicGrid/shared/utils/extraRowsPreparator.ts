import { IColumnConfig, IFooterConfig, IHeaderConfig } from 'Controls/gridReact';
import { patchColumnProps, addDefaultClassNameToAllDynamicColumns } from './patchColumnProps';
import { IExtraRowDynamicCellsColspanCallback } from 'Controls-Lists/_dynamicGrid/render/ExtraRow';
import { TColumnDataDensity } from '../types';
import { IDynamicGridComponentProps } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';

interface IPrepareDynamicColumnsParamsCommon
    extends Pick<
        IDynamicGridComponentProps,
        | 'hoverMode'
        | 'dynamicColumnsCount'
        | 'dynamicColumnsGridData'
        | 'columnsSpacing'
        | 'quantum'
    > {}

type IExtraColumnConfig = IHeaderConfig | IFooterConfig;

interface IPrepareExtraRowColumnsParams extends IPrepareDynamicColumnsParamsCommon {
    extraRowStaticColumns: IExtraColumnConfig[];
    extraRowEndStaticColumns?: IExtraColumnConfig[];
    extraRowDynamicColumn: IExtraColumnConfig;
    extraRowDynamicCellsColspanCallback?: IExtraRowDynamicCellsColspanCallback;
    getPreparedDynamicColumn?: Function;
    dataDensity: TColumnDataDensity;
    dynamicColumn: IColumnConfig;
}

export function prepareExtraRowColumns(
    params: IPrepareExtraRowColumnsParams
): IExtraColumnConfig[] {
    const {
        extraRowStaticColumns,
        extraRowDynamicColumn,
        extraRowDynamicCellsColspanCallback,
        extraRowEndStaticColumns,
        getPreparedDynamicColumn,
        dataDensity,
        dynamicColumn,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        quantum,
        hoverMode,
    } = params;

    if (!params.extraRowDynamicColumn || !params.extraRowDynamicColumn) {
        return null;
    }

    const resultColumns = [...extraRowStaticColumns];

    resultColumns.forEach((config) =>
        patchColumnProps(config, () => ({
            backgroundStyle: 'unaccented',
        }))
    );

    if (extraRowDynamicColumn) {
        const preparedDynamicColumn = getPreparedDynamicColumn({
            extraRowDynamicColumn,
            extraRowDynamicCellsColspanCallback,
            dataDensity,
            dynamicColumn,
            dynamicColumnsCount,
            dynamicColumnsGridData,
            columnsSpacing,
            quantum,
            hoverMode,
        });
        resultColumns.push(preparedDynamicColumn);
    }

    if (extraRowEndStaticColumns && extraRowEndStaticColumns.length) {
        const columns = [...extraRowEndStaticColumns];

        columns.forEach((config) => {
            patchColumnProps(config, () => ({
                backgroundStyle: 'unaccented',
            }));
        });

        resultColumns.push(...columns);
    }

    addDefaultClassNameToAllDynamicColumns(resultColumns);

    return resultColumns;
}
