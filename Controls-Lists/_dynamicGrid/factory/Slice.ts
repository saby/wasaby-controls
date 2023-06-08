import { IListState, IListLoadResult, List } from 'Controls/dataFactory';
import {
    IDynamicGridDataFactoryArguments,
    IColumnsNavigation,
} from './IDynamicGridFactory';
import { IColumnConfig } from 'Controls/gridReact';
import { IHeaderCell } from 'Controls/grid';
import {
    applyColumnsData,
    prepareLoadColumnsFilter,
    prepareLoadColumnsNavigation,
} from './utils';
import { TNavigationDirection } from 'Controls/interface';
import { unstable_batchedUpdates } from 'react-dom';

export interface IDynamicGridState extends IListState {
    staticColumns: IColumnConfig[];
    dynamicColumn: IColumnConfig;
    staticHeaders: IHeaderCell[];
    dynamicHeader: IHeaderCell;
    columnsNavigation: IColumnsNavigation;
    columnsDataVersion: number;
}

export default class DynamicGridSlice extends List.slice {
    protected _columnsPosition: Date;

    _initState(
        loadResult: IListLoadResult,
        config: IDynamicGridDataFactoryArguments
    ): IDynamicGridState {
        return {
            ...super._initState(loadResult, config),
            staticColumns: config.staticColumns,
            dynamicColumn: config.dynamicColumn,
            staticHeaders: config.staticHeaders,
            dynamicHeader: config.dynamicHeader,
            columnsNavigation: config.columnsNavigation,
            columnsDataVersion: 0,
        } as IDynamicGridState;
    }

    private _loadColumns(direction: TNavigationDirection): void {
        const filter = this.state.filter;
        const verticalNavigationField =
            this.state.sourceController.getNavigation().sourceConfig.field;
        const columnsNavigation = this.state.columnsNavigation;
        const items = this.state.sourceController.getItems();
        const shiftSize = columnsNavigation.sourceConfig.limit / 2;

        if (this._columnsPosition === undefined) {
            this._columnsPosition = new Date(
                columnsNavigation.sourceConfig.position
            );
            if (direction === 'backward') {
                this._columnsPosition.setDate(
                    this._columnsPosition.getDate() + shiftSize
                );
            } else {
                this._columnsPosition.setDate(
                    this._columnsPosition.getDate() +
                        columnsNavigation.sourceConfig.limit -
                        shiftSize
                );
            }
        } else {
            this._columnsPosition.setDate(
                this._columnsPosition.getDate() - shiftSize
            );
        }

        const preparedFilter = prepareLoadColumnsFilter({
            filter,
            columnsNavigation,
            actualPosition: this._columnsPosition,
            actualDirection: direction,
        });

        const navigation = prepareLoadColumnsNavigation({
            position: items.at(0).get(verticalNavigationField),
            field: verticalNavigationField,
            itemsCount: items.getCount(),
        });

        // applyColumnsData({
        //     items: this.state.items,
        //     columnsData: null,
        //     columnsDataProperty
        // });

        this.load('forward', undefined, preparedFilter, false, navigation).then(
            (loadedColumnsData) => {
                unstable_batchedUpdates(() => {
                    // Можно переписать без версии, например, сделав подписку на уровне dynamicGrid на
                    // items::onCollectionItemChange. Профит - не прокидывать через контекст избыточную версию.
                    this.setState({
                        columnsDataVersion: this.state.columnsDataVersion + 1,
                    });
                    applyColumnsData({
                        items: this.state.sourceController.getItems(),
                        columnsData: loadedColumnsData,
                        columnsDataProperty:
                            this.state.columnsNavigation.sourceConfig.field,
                    });
                    if (direction === 'forward') {
                        const columnsData = loadedColumnsData
                            .at(0)
                            .get(
                                this.state.columnsNavigation.sourceConfig.field
                            );
                        this._columnsPosition = new Date(
                            columnsData.at(columnsData.getCount() - 1).getKey()
                        );
                    }
                });
            }
        );
    }

    loadBackwardColumns(): Promise<void> {
        this._loadColumns('backward');
    }

    loadForwardColumns(): Promise<void> {
        this._loadColumns('forward');
    }
}
