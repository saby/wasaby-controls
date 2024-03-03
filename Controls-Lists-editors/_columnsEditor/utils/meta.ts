import { BooleanType, ObjectType, StringType } from 'Meta/types';
import * as rk from 'i18n!Controls';
import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { SeparatorEditorIcon } from 'Controls-Lists-editors/_columnsEditor/utils/templates/SeparatorEditorIcon';

// Утилиты для работы с метатипом редактора колонки

const alignEditorOptions = ['left', 'center', 'right'];
const separatorEditorIconOptions = new RecordSet({
    rawData: [
        {
            id: 'left',
            tooltip: 'Левая',
            caption: React.createElement(SeparatorEditorIcon, { icon: 'icon-TheBordersLeft' }),
        },
        {
            id: 'right',
            tooltip: 'Правая',
            caption: React.createElement(SeparatorEditorIcon, { icon: 'icon-TheBordersRight' }),
        },
    ],
    keyProperty: 'id',
});
const alignEditorIconOptions = new RecordSet({
    rawData: [
        {
            id: 'left',
            icon: 'icon-AlignmentLeft',
        },
        {
            id: 'center',
            icon: 'icon-AlignmentCenter',
        },
        {
            id: 'right',
            icon: 'icon-AlignmentRight',
        },
    ],
    keyProperty: 'id',
});

/**
 * Получить метатип редактора второстепенной колонки
 * @param onReplaceColumnClick
 */
export function getColumnEditorMetaType(onReplaceColumnClick: Function) {
    return {
        caption: ObjectType.id('caption')
            .title(rk('Название'))
            .order(-1)
            .editor('Controls-Lists-editors/columnsEditor:ColumnCaptionEditor'),
        columnValue: ObjectType.id('columnValue')
            .optional()
            .title('Значение')
            .order(0)
            .editor('Controls-Lists-editors/columnsEditor:ColumnValueEditor', {
                onClick: onReplaceColumnClick,
            }),
        width: StringType.oneOf([])
            .id('width')
            .editor('Controls-Lists-editors/columnsEditor:ColumnWidthEditor', {})
            .title(rk('Ширина'))
            .optional()
            .order(1),
        textOverflow: BooleanType.title('Перенос строк')
            .editor('Controls-editors/toggle:SwitchEditor')
            .optional()
            .order(2),
        align: StringType.title('Выравнивание')
            .editor('Controls-editors/toggle:TumblerEditor', { options: alignEditorIconOptions })
            .oneOf(alignEditorOptions)
            .optional()
            .order(3),
        columnSeparatorSize: ObjectType.editor(
            'Controls-Lists-editors/columnsEditor:ColumnSeparatorEditor',
            {
                items: separatorEditorIconOptions,
            }
        )
            .optional()
            .title('Границы')
            .order(4),
    };
}

/**
 * Получить метатип редактора главной колонки
 */
export function getMainColumnEditorMetaType() {
    return {
        width: StringType.oneOf([])
            .id('width')
            .editor('Controls-Lists-editors/columnsEditor:ColumnWidthEditor', {
                isMainColumn: true,
            })
            .title(rk('Ширина'))
            .optional()
            .order(0),
        columnSeparatorSize: ObjectType.editor(
            'Controls-Lists-editors/columnsEditor:ColumnSeparatorEditor',
            {
                items: separatorEditorIconOptions,
            }
        )
            .optional()
            .title('Границы')
            .order(1),
    };
}
