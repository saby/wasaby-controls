import * as React from 'react';
import 'css!Controls-Lists-editors/_columnsEditor/styles/designTimeEditor';
import {
    SECONDARY_COLUMN_DEFAULT_PARAMS,
    PRIMARY_COLUMN_DEFAULT_PARAMS,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { Content } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/width/Content';

interface IColumnWidthEditorProps {
    value: string;
    // TODO разобраться с типом функции
    onChange: Function;
    LayoutComponent: JSX.Element;
    isMainColumn?: boolean;
    columnRef: React.MutableRefObject<HTMLElement>;
    containerWidth: number;
}

/**
 * Редактор ширины колонки
 */
export function ColumnWidthEditor(props: IColumnWidthEditorProps): JSX.Element {
    const { value, onChange, LayoutComponent, isMainColumn, columnRef, containerWidth } = props;
    const isDefaultValue = React.useMemo(() => {
        if (isMainColumn) {
            return value === PRIMARY_COLUMN_DEFAULT_PARAMS.width;
        }
        return value === SECONDARY_COLUMN_DEFAULT_PARAMS.width;
    }, [value, isMainColumn]);
    return (
        <LayoutComponent>
            <Content
                key={isDefaultValue ? 'default' : 'not-default'}
                initValue={value}
                onChange={onChange}
                isMainColumn={isMainColumn}
                columnRef={columnRef}
                containerWidth={containerWidth}
            />
        </LayoutComponent>
    );
}
