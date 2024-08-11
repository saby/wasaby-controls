import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import {
    BaseEditor,
    IEditingValue,
} from 'Controls-Lists-editors/_columnsEditor/editorClasses/base';
import { ObjectType, StringType } from 'Meta/types';
import { separatorEditorIconOptions } from 'Controls-Lists-editors/_columnsEditor/utils/meta';
import { PRIMARY_COLUMN_DEFAULT_PARAMS } from 'Controls-Lists-editors/_columnsEditor/constants';
import * as rk from 'i18n!Controls-Lists-editors';
import * as React from 'react';

export class MainColumnEditor extends BaseEditor {
    protected _columnRef: React.MutableRefObject<HTMLElement>;
    protected _containerWidth: number;
    protected _isMinimalState: boolean;
    constructor(
        markupValue: IMarkupValue,
        columnRef: React.MutableRefObject<HTMLElement>,
        containerWidth: number,
        isMinimalState: boolean
    ) {
        super();
        this._value = {
            width: markupValue.width,
            columnSeparatorSize: markupValue.columnSeparatorSize,
        };
        this._columnRef = columnRef;
        this._containerWidth = containerWidth;
        this._isMinimalState = isMinimalState;
    }
    getMetaType(): object {
        const columnRef = this._columnRef;
        const containerWidth = this._containerWidth;
        const isMinimalState = this._isMinimalState;
        return {
            width: StringType.oneOf([])
                .id('width')
                .editor('Controls-Lists-editors/columnsEditor:ColumnWidthEditor', {
                    isMainColumn: !isMinimalState,
                    columnRef,
                    containerWidth,
                })
                .title(rk('Ширина'))
                .optional()
                .order(0)
                .defaultValue('minmax(200px, 1fr)'),
            columnSeparatorSize: ObjectType.editor(
                'Controls-Lists-editors/columnsEditor:ColumnSeparatorEditor',
                {
                    items: separatorEditorIconOptions,
                }
            )
                .optional()
                .title(rk('Границы'))
                .order(1)
                .defaultValue({}),
        };
    }
    updateValue(oldValue: IMarkupValue, newProperties: IEditingValue): IMarkupValue {
        const result: IMarkupValue = oldValue;
        // Границы
        if (newProperties.columnSeparatorSize !== undefined) {
            result.columnSeparatorSize = newProperties.columnSeparatorSize;
        } else {
            result.columnSeparatorSize = PRIMARY_COLUMN_DEFAULT_PARAMS.columnSeparatorSize;
        }
        // Ширина
        if (newProperties.width !== oldValue.width) {
            if (newProperties.width !== undefined) {
                result.width = newProperties.width;
            } else {
                result.width = PRIMARY_COLUMN_DEFAULT_PARAMS.width;
            }
        }
        return result;
    }
}
