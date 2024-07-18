import { THeaderForCtor, TColumnsForCtor, IHeaderCell, IColumn } from 'Controls/grid';
import { ItemsView } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { Stack } from 'Controls/popupTemplate';
import { Model } from 'Types/entity';
import * as React from 'react';
export interface IColumnsListPopupRender {
    allHeader: THeaderForCtor;
    allColumns: TColumnsForCtor;
    columns: TColumnsForCtor;
    header: THeaderForCtor;
    onClose: Function;
    onItemClick?: Function;
    onItemClickParams?: object;
}

/**
 * Всплывающее окно списка доступных для добавления колонок
 * @param props {IColumnsListPopupRender}
 */
function ColumnsListPopupRender(props: IColumnsListPopupRender) {
    const { allHeader, columns, header, allColumns, onClose, onItemClick, onItemClickParams } =
        props;
    const listData: THeaderForCtor = React.useMemo(() => {
        const columnsList: THeaderForCtor = [];
        allColumns.filter((initColumn: IColumn, columnId: number) => {
            const isUsed = columns.find((column: IColumn) => {
                return column.displayProperty === initColumn.displayProperty;
            });
            if (!isUsed) {
                columnsList.push(
                    allHeader.find((initHeader: IHeaderCell) => {
                        return initHeader.startColumn - 1 === columnId;
                    })
                );
            }
        });
        return columnsList;
    }, [columns, header, allColumns, allHeader]);
    const items = React.useMemo(() => {
        return new RecordSet({
            keyProperty: 'caption',
            rawData: listData,
        });
    }, [listData]);
    const itemClick = React.useCallback(
        (item: Model) => {
            onItemClick?.({
                item,
                allColumns,
                onClose,
                columns,
                header,
                allHeader,
                ...onItemClickParams,
            });
        },
        [header, columns, onClose]
    );
    return (
        <div>
            {listData.length > 0 ? (
                <Stack
                    headingCaption={'Значение колонки'}
                    headerBackgroundStyle={'unaccented'}
                    backgroundStyle={'unaccented'}
                    onClose={onClose}
                    closeButtonVisible={true}
                    rightBorderVisible={false}
                    bodyContentTemplate={
                        <div
                            className={
                                'controls__block-wrapper tr ControlsListsEditors_columnsListPopup-content_wrapper'
                            }
                        >
                            <div
                                className={
                                    'controls__block ControlsListsEditors_columnsListPopup-content-padding_top'
                                }
                            >
                                <ItemsView
                                    items={items}
                                    displayProperty={'caption'}
                                    onItemClick={itemClick}
                                />
                            </div>
                        </div>
                    }
                />
            ) : null}
        </div>
    );
}
ColumnsListPopupRender.isReact = true;
export default ColumnsListPopupRender;
