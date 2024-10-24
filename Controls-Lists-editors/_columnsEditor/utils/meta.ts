import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { SeparatorEditorIcon } from 'Controls-Lists-editors/_columnsEditor/utils/templates/SeparatorEditorIcon';
import rk = require('i18n!Controls-Lists-editors');

// Утилиты для работы с метатипом редактора колонки

export const alignEditorOptions = ['left', 'center', 'right'];
export const separatorEditorIconOptions = new RecordSet({
    rawData: [
        {
            id: 'left',
            tooltip: rk('Левая'),
            caption: React.createElement(SeparatorEditorIcon, { icon: 'icon-TheBordersLeft' }),
        },
        {
            id: 'right',
            tooltip: rk('Правая'),
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
            tooltip: rk('По левому краю'),
        },
        {
            id: 'center',
            icon: 'icon-AlignmentCenter',
            tooltip: rk('По центру'),
        },
        {
            id: 'right',
            icon: 'icon-AlignmentRight',
            tooltip: rk('По правому краю'),
        },
    ],
    keyProperty: 'id',
});
