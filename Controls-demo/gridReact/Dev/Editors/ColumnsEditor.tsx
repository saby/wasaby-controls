import * as React from 'react';

import { ICellProps, IColumnConfig } from 'Controls/gridReact';

import { SizeSelector } from './selectors/SizeSelector';
import { ColorStyleSelector } from './selectors/ColorStyleSelector';
import { HAlignSelector } from './selectors/HAlignSelector';
import { VAlignSelector } from './selectors/VAlignSelector';
import BaseEditor from './base/BaseEditor';
import BaseSelector from './base/BaseSelector';

interface ICellPropsEditorProps {
    cellProps: ICellProps;
    onChange: (cellProps: ICellProps) => void;
}
function CellPropsEditor(props: ICellPropsEditorProps): React.ReactElement {
    const cellProps = props.cellProps;

    const updateCellProps = (newProps: Partial<ICellProps>) => {
        props.onChange({
            ...cellProps,
            ...newProps,
        });
    };

    return (
        <div className={'ws-flexbox ws-flex-wrap'}>
            <BaseSelector header={'paddingLeft'}>
                <SizeSelector
                    value={cellProps.padding?.left}
                    rangeType={'grid-h-padding'}
                    onChange={(left) => {
                        return updateCellProps({
                            padding: { ...cellProps.padding, left },
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'paddingRight'}>
                <SizeSelector
                    value={cellProps.padding?.right}
                    rangeType={'grid-h-padding'}
                    onChange={(right) => {
                        return updateCellProps({
                            padding: { ...cellProps.padding, right },
                        });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'backgroundColorStyle'}>
                <ColorStyleSelector
                    value={cellProps.backgroundColorStyle}
                    onChange={(backgroundColorStyle) => {
                        return updateCellProps({ backgroundColorStyle });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'hoverBackgroundStyle'}>
                <ColorStyleSelector
                    value={cellProps.hoverBackgroundStyle}
                    onChange={(hoverBackgroundStyle) => {
                        return updateCellProps({ hoverBackgroundStyle });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'halign'}>
                <HAlignSelector
                    value={cellProps.halign}
                    onChange={(halign) => {
                        return updateCellProps({ halign });
                    }}
                />
            </BaseSelector>
            <BaseSelector header={'valign'}>
                <VAlignSelector
                    value={cellProps.valign}
                    onChange={(valign) => {
                        return updateCellProps({ valign });
                    }}
                />
            </BaseSelector>
        </div>
    );
}

interface IColumnEditorProps {
    column: IColumnConfig;
    onChange: (column: IColumnConfig) => void;
}
function ColumnEditor(props: IColumnEditorProps): React.ReactElement {
    const cellProps = props.column.getCellProps?.(null) || {};

    const updateCellProps = (newCellProps: ICellProps) => {
        props.onChange({
            ...props.column,
            getCellProps: () => {
                return newCellProps;
            },
        });
    };

    const updateConfig = (newConfigValues: Partial<IColumnConfig>) => {
        props.onChange({
            ...props.column,
            ...newConfigValues,
        });
    };

    return (
        <div className={'controls__block-layout-item controls-padding-xs'}>
            <BaseEditor
                header={`Column Editor ${props.column.displayProperty}`}
                level={3}
            >
                <CellPropsEditor
                    cellProps={cellProps}
                    onChange={updateCellProps}
                />
            </BaseEditor>
        </div>
    );
}

interface IColumnsEditorProps {
    columns: IColumnConfig[];
    onChange: (columns: IColumnConfig[]) => void;
}
function ColumnsEditor(props: IColumnsEditorProps): React.ReactElement {
    const updateColumns = (column, index) => {
        const newColumns = props.columns.slice();
        newColumns.splice(index, 1, column);
        props.onChange(newColumns);
    };

    const columnEditors = props.columns.map((column, index) => {
        return (
            <ColumnEditor
                key={column.key}
                column={column}
                onChange={(newColumn) => {
                    return updateColumns(newColumn, index);
                }}
            />
        );
    });

    return (
        <BaseEditor header={'Columns Editor'} level={2}>
            {columnEditors}
        </BaseEditor>
    );
}

interface IHookResult {
    columns: IColumnConfig[];
    columnsEditor: React.ReactElement;
}
export function useColumnsEditor(initialColumns: IColumnConfig[]): IHookResult {
    const [columns, setColumns] = React.useState(initialColumns);

    const columnsEditor = (
        <ColumnsEditor
            columns={columns}
            onChange={(newColumns) => {
                return setColumns(newColumns);
            }}
        />
    );

    return { columns, columnsEditor };
}
