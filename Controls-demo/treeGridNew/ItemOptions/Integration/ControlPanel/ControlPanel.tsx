import * as React from 'react';

import { ColumnConfigChanges } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/ColumnConfigChanges';
import { ItemParentKey } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/ItemParentKey';
import { GetCellPropsControl } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/GetCellPropsControl';
import { TBackgroundStyle } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/GetCellPropsControl';
import 'css!Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlPanel';
import { GetRowPropsControl } from 'Controls-demo/treeGridNew/ItemOptions/Integration/ControlPanel/ControlledParams/GetRowPropsControl';
import { IRoundAngles } from 'Controls-demo/treeGridNew/ItemOptions/Integration';
import { TBorderVisibility } from 'Controls/display';

interface ControlPanelProps {
    columnWidth: number;
    onColumnWidthChange: (width: number) => void;
    backgroundColor: TBackgroundStyle;
    onBackgroundColorChange: (color: TBackgroundStyle) => void;
    roundAngle: IRoundAngles;
    setRoundAngle: (roundAngle: IRoundAngles) => void;
    borderVisibility: TBorderVisibility;
    setBorderVisibility: (borderVisibility: TBorderVisibility) => void;
    tagClassName: string;
    setTagClassName: (tagClassName: string) => void;
}

export function ControlPanel(props: ControlPanelProps): JSX.Element {
    const {
        tagClassName,
        setTagClassName,
        columnWidth,
        onColumnWidthChange,
        backgroundColor,
        roundAngle,
        setRoundAngle,
        onBackgroundColorChange,
        setBorderVisibility,
        borderVisibility,
    } = props;

    return (
        <div className="control-panel">
            <h2>Панель управления</h2>
            <ItemParentKey />
            <ColumnConfigChanges columnWidth={columnWidth} onWidthChange={onColumnWidthChange} />
            <GetCellPropsControl
                tagClassName={tagClassName}
                setTagClassName={setTagClassName}
                backgroundColor={backgroundColor}
                onBackgroundColorChange={onBackgroundColorChange}
            />
            <GetRowPropsControl
                borderVisibility={borderVisibility}
                setBorderVisibility={setBorderVisibility}
                roundAngle={roundAngle}
                setRoundAngle={setRoundAngle}
            />
            {/* Добавляйте новые контроллеры опций списка здесь */}
        </div>
    );
}
