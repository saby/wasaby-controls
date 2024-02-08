import { THeaderForCtor, TColumnsForCtor, IHeaderCell, IColumn } from 'Controls/grid';
import { ItemsView } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { Dialog } from 'Controls/popupTemplate';
import { Model } from 'Types/entity';
import {
    recalculateColumnsHeader,
    notifyContextValueChanged,
} from 'Controls-Lists-editors/_columnsEditor/components/ColumnsDesignTimeEditor';
import * as React from 'react';
import { Button } from 'Controls/buttons';
export interface IColumnsListPopupRender {
    allHeader: THeaderForCtor;
    allColumns: TColumnsForCtor;
    columns: TColumnsForCtor;
    header: THeaderForCtor;
    onChange: Function;
    value: object;
    onClose: Function;
    neighbourIdx: number;
    mode: 'right' | 'left';
}
interface IOnItemClickHandler extends IColumnsListPopupRender {
    item: Model;
}
const LEFT_OFFSET = 0;
const RIGHT_OFFSET = 1;

/**
 * Обработчик клика по элементу списка колонок
 * @param params {IOnItemClickHandler}
 */
function onItemClickHandler(params: IOnItemClickHandler) {
    const { item, allColumns, columns, header, value, onChange, onClose, mode, neighbourIdx } =
        params;
    const offset = mode === 'right' ? RIGHT_OFFSET : LEFT_OFFSET;
    const columnToAdd = allColumns[item.getRawData().startColumn - 1];
    const headerToAdd = {
        ...item.getRawData(),
        startColumn: header[neighbourIdx].startColumn + offset,
        endColumn: header[neighbourIdx].endColumn + offset,
    };
    const newColumns = [...columns];
    const columnIdx = headerToAdd.startColumn - 1;
    newColumns.splice(columnIdx, 0, columnToAdd);
    const newHeader = [...header];
    recalculateColumnsHeader(
        newHeader,
        neighbourIdx + offset,
        headerToAdd.startColumn - headerToAdd.endColumn
    );
    newHeader.splice(neighbourIdx + offset, 0, headerToAdd);
    const newStaticProperties = {
        ...value.getStaticProperties(),
        selectedColumns: newColumns,
        selectedHeaders: newHeader,
    };
    notifyContextValueChanged(onChange, value, newStaticProperties);
    onClose();
}

/**
 * Всплывающее окно списка доступных для добавления колонок
 * @param props {IColumnsListPopupRender}
 */
function ColumnsListPopupRender(props: IColumnsListPopupRender) {
    const {
        allHeader,
        columns,
        header,
        value,
        onChange,
        allColumns,
        onClose,
        neighbourIdx,
        mode = 'right',
    } = props;
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
    const onItemClick = React.useCallback(
        (item: Model) => {
            onItemClickHandler({
                item,
                allColumns,
                value,
                onChange,
                onClose,
                mode,
                columns,
                header,
                neighbourIdx,
                allHeader,
            });
        },
        [header, columns, value, onChange, onClose]
    );
    return (
        <div>
            {listData.length > 0 ? (
                <Dialog
                    headingCaption={'Значение колонки'}
                    closeButtonVisible={false}
                    headerContentTemplate={
                        <div className="ws-flexbox ws-flex-end">
                            <Button
                                viewMode="filled"
                                buttonStyle="pale"
                                iconSize="m"
                                icon="icon-Close"
                                iconStyle="contrast"
                                tooltip={'Закрыть'}
                                onClick={() => {
                                    onClose();
                                }}
                            />
                        </div>
                    }
                    bodyContentTemplate={
                        <ItemsView
                            items={items}
                            displayProperty={'caption'}
                            onItemClick={onItemClick}
                        />
                    }
                    closeButtonViewMode={'functionalButton'}
                />
            ) : null}
        </div>
    );
}
ColumnsListPopupRender.isReact = true;
export default ColumnsListPopupRender;
