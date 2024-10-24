import { IMarkupValue } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import {
    DEFAULT_COLUMN_PARAMS,
    SECONDARY_COLUMN_DEFAULT_PARAMS,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/baseGrid';
import { BooleanType, ObjectType, StringType } from 'Meta/types';
import {
    alignEditorIconOptions,
    alignEditorOptions,
    separatorEditorIconOptions,
} from 'Controls-Lists-editors/_columnsEditor/utils/meta';
import {
    BaseEditor,
    IEditingValue,
} from 'Controls-Lists-editors/_columnsEditor/editorClasses/base';
import * as rk from 'i18n!Controls-Lists-editors';
import * as React from 'react';

/**
 * Класс, реализующий методы работы с редактором типа "второстепенная колонка"
 */
export class ColumnEditor extends BaseEditor {
    protected _columns: TColumnsForCtor;
    protected _header: THeaderForCtor;
    protected _allColumns: TColumnsForCtor;
    protected _allHeader: THeaderForCtor;
    protected _columnRef: React.MutableRefObject<null>;
    protected _containerWidth: number;
    constructor(
        markupValue: IMarkupValue,
        headers: THeaderForCtor,
        columns: TColumnsForCtor,
        allColumns: TColumnsForCtor,
        allHeaders: THeaderForCtor,
        columnRef: React.MutableRefObject<null>,
        containerWidth: number
    ) {
        super();
        this._value = {
            caption:
                markupValue.caption === markupValue.columnValue.initCaption
                    ? ''
                    : markupValue.caption,
            width: markupValue.width,
            whiteSpace: markupValue.whiteSpace === DEFAULT_COLUMN_PARAMS.whiteSpace,
            align: markupValue.align ?? DEFAULT_COLUMN_PARAMS.align,
            columnValue: markupValue.columnValue,
            columnSeparatorSize: markupValue.columnSeparatorSize,
        };
        this._allColumns = allColumns;
        this._columns = columns;
        this._header = headers;
        this._allHeader = allHeaders;
        this._columnRef = columnRef;
        this._containerWidth = containerWidth;
    }

    columnValueChanged(oldValue: IMarkupValue, newProperties: IEditingValue): boolean {
        return (
            newProperties.columnValue !== undefined &&
            newProperties.columnValue.initCaption !== oldValue.columnValue.initCaption
        );
    }
    updateValue(oldValue: IMarkupValue, newProperties: IEditingValue): IMarkupValue {
        const result: IMarkupValue = { ...oldValue };
        // Заголовок
        if (this.columnValueChanged(oldValue, newProperties)) {
            // Если изменилось значение колонки
            result.caption = newProperties.columnValue.initCaption;
        } else if (newProperties.caption) {
            // Если ввели свой заголовок
            result.caption = newProperties.caption;
        } else if (newProperties.caption === undefined) {
            // Если сбросили до значения по умолчанию
            result.caption = oldValue.columnValue.initCaption;
        }
        // Перенос строк
        if (
            this.columnValueChanged(oldValue, newProperties) ||
            newProperties.whiteSpace === undefined
        ) {
            result.whiteSpace = SECONDARY_COLUMN_DEFAULT_PARAMS.whiteSpace;
        } else {
            result.whiteSpace = !newProperties.whiteSpace ? 'nowrap' : 'normal';
        }
        // Выравнивание
        if (this.columnValueChanged(oldValue, newProperties) || newProperties.align === undefined) {
            result.align = SECONDARY_COLUMN_DEFAULT_PARAMS.align;
        } else {
            result.align = newProperties.align;
        }
        // Значение
        if (this.columnValueChanged(oldValue, newProperties)) {
            result.columnValue = newProperties.columnValue;
        }
        // Границы
        if (
            this.columnValueChanged(oldValue, newProperties) ||
            newProperties.columnSeparatorSize === undefined
        ) {
            result.columnSeparatorSize = SECONDARY_COLUMN_DEFAULT_PARAMS.columnSeparatorSize;
        } else {
            result.columnSeparatorSize = newProperties.columnSeparatorSize;
        }
        // Ширина
        if (this.columnValueChanged(oldValue, newProperties) || newProperties.width === undefined) {
            result.width = SECONDARY_COLUMN_DEFAULT_PARAMS.width;
        } else if (newProperties.width !== oldValue.width) {
            result.width = newProperties.width;
        }
        return result;
    }

    getMetaType(): object {
        const columns = this._columns;
        const header = this._header;
        const allColumns = this._allColumns;
        const allHeader = this._allHeader;
        const columnRef = this._columnRef;
        const containerWidth = this._containerWidth;
        return {
            caption: StringType.id('caption')
                .title(rk('Название'))
                .order(-1)
                .editor('Controls-Lists-editors/columnsEditor:ColumnCaptionEditor', {
                    placeholder: this._value.columnValue.initCaption,
                })
                .optional()
                .defaultValue(''),
            columnValue: ObjectType.id('columnValue')
                .optional()
                .title(rk('Значение'))
                .order(0)
                .editor('Controls-Lists-editors/columnsEditor:ColumnValueEditor', {
                    columns,
                    header,
                    allColumns,
                    allHeader,
                })
                .defaultValue({
                    ...this._value.columnValue,
                }),
            width: StringType.oneOf([])
                .id('width')
                .editor('Controls-Lists-editors/columnsEditor:ColumnWidthEditor', {
                    columnRef,
                    containerWidth,
                })
                .title(rk('Ширина'))
                .optional()
                .order(1)
                .defaultValue('max-content'),
            whiteSpace: BooleanType.title(rk('Перенос строк'))
                .editor('Controls-editors/toggle:SwitchEditor')
                .optional()
                .order(2)
                .defaultValue(true),
            align: StringType.title(rk('Выравнивание'))
                .editor('Controls-editors/toggle:TumblerEditor', {
                    options: alignEditorIconOptions,
                })
                .oneOf(alignEditorOptions)
                .optional()
                .order(3)
                .defaultValue('left'),
            columnSeparatorSize: ObjectType.editor(
                'Controls-Lists-editors/columnsEditor:ColumnSeparatorEditor',
                {
                    items: separatorEditorIconOptions,
                }
            )
                .optional()
                .title(rk('Границы'))
                .order(4)
                .defaultValue({}),
        };
    }
}
