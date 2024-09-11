import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { SeparatorEditorIcon } from 'Controls-Lists-editors/_columnsEditor/utils/templates/SeparatorEditorIcon';

// Утилиты для работы с метатипом редактора колонки

export const alignEditorOptions = ['left', 'center', 'right'];
export const separatorEditorIconOptions = new RecordSet({
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
export const alignEditorIconOptions = new RecordSet({
    rawData: [
        {
            id: 'left',
            icon: 'icon-AlignmentLeft',
            tooltip: 'По левому краю',
        },
        {
            id: 'center',
            icon: 'icon-AlignmentCenter',
            tooltip: 'По центру',
        },
        {
            id: 'right',
            icon: 'icon-AlignmentRight',
            tooltip: 'По правому краю',
        },
    ],
    keyProperty: 'id',
});
