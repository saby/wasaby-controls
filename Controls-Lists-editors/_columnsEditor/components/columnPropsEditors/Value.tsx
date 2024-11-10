import { Button } from 'Controls/buttons';
import * as React from 'react';
import { StackOpener } from 'Controls/popup';
import {
    itemClickForReplace,
    onOpenColumnsList,
} from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { getUnusedColumns } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

/**
 * Редактор свойства "Значение" в колонке
 * @param props
 * @constructor
 */
export function ColumnValueEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent, allColumns, allHeader, columns, header } = props;
    const dialog = React.useMemo(() => {
        return new StackOpener();
    }, []);
    // Тк нет доступа к шаблону окна редактора объектного типа, то в качестве opener'а передается HTMLNode редактора значения
    const columnValueRef = React.useRef(null);
    const [currentColumns, setCurrentColumns] = React.useState(columns);
    const [currentHeader, setCurrentHeader] = React.useState(header);
    const onResult = React.useCallback((newColumns, newHeader) => {
        setCurrentColumns(newColumns);
        setCurrentHeader(newHeader);
    }, []);
    const unusedColumns = React.useMemo(() => {
        return getUnusedColumns(allColumns, allHeader, columns);
    }, [allColumns, allHeader, columns]);
    const onButtonClick = React.useCallback(() => {
        const onItemClickParams = {
            onValueChange: onChange,
        };
        onOpenColumnsList(
            allColumns,
            allHeader,
            header,
            columns,
            dialog,
            itemClickForReplace,
            onItemClickParams,
            onResult,
            columnValueRef.current
        );
    }, [onChange, columns, header, allColumns, allHeader]);
    return (
        <LayoutComponent>
            <Button
                caption={value.initCaption}
                viewMode={'link'}
                onClick={onButtonClick}
                readOnly={!unusedColumns || unusedColumns.length === 0}
                ref={columnValueRef}
            />
        </LayoutComponent>
    );
}
