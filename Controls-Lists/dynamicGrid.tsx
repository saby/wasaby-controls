/**
 * Компонент "Таблица с загружаемыми колонками"
 * @class Controls-Lists/dynamicGrid
 * @public
 * @demo Controls-Lists-demo/dynamicGrid/base/Index
 */

import * as React from 'react';
import { View as GridComponent, IHeaderCell } from 'Controls/grid';
import 'Controls/gridReact';
import type { IColumnConfig } from 'Controls/gridReact';
import { DataContext } from 'Controls-DataEnv/context';
import { EdgeState } from 'Controls/columnScrollReact';
import {
    getPreparedDynamicColumn,
    getPreparedDynamicHeader,
    useRenderData,
} from './_dynamicGrid/render/DynamicColumnRender';
import 'Controls/gridColumnScroll';

export {
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
} from './_dynamicGrid/factory/IDynamicGridFactory';
export { default as DynamicGridFactory } from './_dynamicGrid/factory/Factory';
export { useRenderData };

interface IPrepareDynamicGridColumnsParams {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    dynamicColumnsCount: number;
}

interface IPrepareDynamicGridHeadersParams {
    staticHeaders: IHeaderCell[];
    dynamicHeader: IHeaderCell;
    dynamicHeadersCount: number;
}

function prepareDynamicGridColumns(
    params: IPrepareDynamicGridColumnsParams
): IColumnConfig[] {
    const { staticColumns, dynamicColumn, dynamicColumnsCount } = params;
    const resultColumns = [...staticColumns];

    // todo добавить валидацию на наличие опции dynamicColumn (и другие)
    if (dynamicColumn) {
        // params.columnsNavigation.sourceConfig.limit
        for (let col = 0; col < dynamicColumnsCount; col++) {
            const preparedDynamicColumn = getPreparedDynamicColumn(
                'dynamicColumnsData',
                col,
                dynamicColumn
            );
            resultColumns.push(preparedDynamicColumn);
        }
    }

    return resultColumns;
}

function prepareDynamicGridHeaders(
    params: IPrepareDynamicGridHeadersParams
): IHeaderCell[] {
    const { staticHeaders, dynamicHeader, dynamicHeadersCount } = params;
    const resultColumns = [...staticHeaders];

    // todo добавить валидацию на наличие опции dynamicColumn (и другие)
    if (dynamicHeader) {
        // params.columnsNavigation.sourceConfig.limit
        for (let col = 0; col < dynamicHeadersCount; col++) {
            const preparedDynamicColumn = getPreparedDynamicHeader(
                'dynamicColumnsData',
                col,
                dynamicHeader
            );
            resultColumns.push(preparedDynamicColumn);
        }
    }

    return resultColumns;
}

export default function DynamicGridComponent(props): React.ReactElement {
    const store = React.useContext(DataContext)[props.storeId];

    return <DynamicGrid {...props} store={store} />;
}

export class DynamicGrid extends React.Component {
    protected _gridComponentRef: React.Ref<HTMLDivElement>;
    protected _leftEdgeState: EdgeState;
    protected _rightEdgeState: EdgeState;

    constructor(props) {
        super(props);
        this._gridComponentRef = React.createRef();

        this.state = {
            storeId: props.storeId,
            store: props.store,
            className: props.className,
            columnsDataVersion: props.store.columnsDataVersion,
            preparedColumns: prepareDynamicGridColumns({
                staticColumns: props.store.staticColumns,
                dynamicColumn: props.store.dynamicColumn,
                dynamicColumnsCount:
                    props.store.columnsNavigation.sourceConfig.limit,
            }),
            preparedHeaders: prepareDynamicGridHeaders({
                staticHeaders: props.store.staticHeaders,
                dynamicHeader: props.store.dynamicHeader,
                dynamicHeadersCount:
                    props.store.columnsNavigation.sourceConfig.limit,
            }),
        };

        this._onEdgesStateChanged = this._onEdgesStateChanged.bind(this);
    }

    colspanCallback(item, column, columnIndex, isEditing) {
        return columnIndex > 0 ? 'end' : 1;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            prevState.columnsDataVersion !== nextProps.store.columnsDataVersion
        ) {
            return {
                columnsDataVersion: nextProps.store.columnsDataVersion,
            };
        }
        return null;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.columnsDataVersion !== this.state.columnsDataVersion) {
            const scrollableCellSelector =
                '.controls-ListView__itemV .js-controls-GridColumnScroll_fixed';
            const scrollableCell =
                this._gridComponentRef.current._container.querySelector(
                    scrollableCellSelector
                ).nextSibling;
            const offsetLeft = scrollableCell.offsetLeft;
            const rectLeft = scrollableCell.getBoundingClientRect().left;
            const scrollLeft = offsetLeft - rectLeft;
            let idx = 0;
            while (
                scrollableCell.children[idx].offsetLeft +
                    scrollableCell.children[idx].offsetWidth <
                scrollLeft
            ) {
                idx++;
            }
            return {
                savedCellOffsetLeft:
                    scrollableCell.children[idx].offsetLeft - scrollLeft,
                savedCellSelector: scrollableCell.children[idx].className,
            };
        }
        return null;
    }

    _onEdgesStateChanged(leftEdgeState: EdgeState, rightEdgeState: EdgeState) {
        if (this._leftEdgeState !== leftEdgeState) {
            this._leftEdgeState = leftEdgeState;
            if (leftEdgeState === EdgeState.Visible) {
                this.state.store.loadBackwardColumns();
            }
        }
        if (this._rightEdgeState !== rightEdgeState) {
            this._rightEdgeState = rightEdgeState;
            if (rightEdgeState === EdgeState.Visible) {
                this.state.store.loadForwardColumns();
            }
        }
    }

    render() {
        const style = {
            display: 'contents',
        };

        return (
            // todo вынести в css
            <div className="ControlsLists-dynamicGrid" style={style}>
                <GridComponent
                    ref={this._gridComponentRef}
                    onEdgesStateChanged={this._onEdgesStateChanged}
                    columns={this.state.preparedColumns}
                    colspanCallback={this.colspanCallback}
                    header={this.state.preparedHeaders}
                    className={this.state.className}
                    storeId={this.state.storeId}
                    columnScroll={true}
                    columnScrollViewMode="arrows"
                    columnScrollNavigationPosition="custom"
                />
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            const scrollableCell =
                this._gridComponentRef.current._container.querySelector(
                    `.${snapshot.savedCellSelector}`
                );
            const offsetLeft = scrollableCell.offsetLeft;
            this._gridComponentRef.current.horizontalScrollTo(
                offsetLeft - snapshot.savedCellOffsetLeft
            );
        }
    }
}
