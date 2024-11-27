import * as React from 'react';

import { ColumnConfigChanges } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/ColumnConfigChanges';
import { ItemParentKey } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/ItemParentKey';
import { BackgroundColorControl } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/BackgroundColorStyle';
import { TBackgroundStyle } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/BackgroundColorStyle';
import 'css!Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlPanel';

interface ControlPanelProps {
    columnWidth: number;
    onColumnWidthChange: (width: number) => void;
    backgroundColor: TBackgroundStyle;
    onBackgroundColorChange: (color: TBackgroundStyle) => void;
}

export function ControlPanel(props: ControlPanelProps): JSX.Element {
    const { columnWidth, onColumnWidthChange, backgroundColor, onBackgroundColorChange } = props;

    return (
        <div className="control-panel">
            <h2>Панель управления</h2>
            <ItemParentKey />
            <ColumnConfigChanges columnWidth={columnWidth} onWidthChange={onColumnWidthChange} />
            <BackgroundColorControl
                backgroundColor={backgroundColor}
                onBackgroundColorChange={onBackgroundColorChange}
            />
            {/* Добавляйте новые контроллеры опций списка здесь */}
        </div>
    );
}
