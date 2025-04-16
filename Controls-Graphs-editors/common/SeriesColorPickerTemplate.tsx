import { Button } from 'ExtControls/colorPicker';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { useItemData } from 'Controls/grid';
import 'css!Controls-Graphs-editors/common/SeriesColorPickerTemplate';
import { TSelectedKey } from 'Controls/interface';

interface ISeriesColorPickerTemplate {
    onChange: (key: string, colorIndex: number) => void;
    keyProperty: string;
    valueProperty?: string;
}

// FIXME: кнопка выбора цвета должна сама это строить
const COLOR_PICKER_ITEMS = [
    { variable: '--graphs__baseColors_color-0', colorIndex: 0 },
    { variable: '--graphs__baseColors_color-1', colorIndex: 1 },
    { variable: '--graphs__baseColors_color-2', colorIndex: 2 },
    { variable: '--graphs__baseColors_color-3', colorIndex: 3 },
    { variable: '--graphs__baseColors_color-4', colorIndex: 4 },
    { variable: '--graphs__baseColors_color-5', colorIndex: 5 },
    { variable: '--graphs__baseColors_color-6', colorIndex: 6 },
    { variable: '--graphs__baseColors_color-7', colorIndex: 7 },
    { variable: '--graphs__baseColors_color-8', colorIndex: 8 },
    { variable: '--graphs__baseColors_color-9', colorIndex: 9 },
    { variable: '--graphs__baseColors_color-10', colorIndex: 10 },
    { variable: '--graphs__baseColors_color-11', colorIndex: 11 },
    { variable: '--graphs__baseColors_color-12', colorIndex: 12 },
];

function SeriesColorPickerTemplate(props: ISeriesColorPickerTemplate) {
    const { onChange, keyProperty = 'name', valueProperty = 'colorIndex' } = props;

    const { renderValues } = useItemData<Model>([keyProperty, valueProperty]);

    const items = React.useMemo(
        () =>
            new RecordSet({
                keyProperty: 'variable',
                rawData: COLOR_PICKER_ITEMS,
            }),
        []
    );

    const selectedKey = React.useMemo<TSelectedKey>(() => {
        return (COLOR_PICKER_ITEMS.find(
            (colorPickerItem) => colorPickerItem.colorIndex === renderValues[valueProperty]
        )?.variable || []) as TSelectedKey;
    }, [renderValues, valueProperty]);

    const onSelectedKeyChanged = React.useCallback(
        (colorVariable: TSelectedKey) => {
            const index = COLOR_PICKER_ITEMS.find(
                (colorPickerItem) => colorPickerItem.variable === colorVariable
            )?.colorIndex;

            onChange(renderValues[keyProperty], index as number);
        },
        [keyProperty, onChange, renderValues]
    );

    return (
        <Button
            items={items}
            columnsCount={2}
            keyProperty="variable"
            selectedKey={selectedKey}
            onSelectedKeyChanged={onSelectedKeyChanged}
            className="controlsGraphsEditors__colorPickerButton controls_Graphs_theme-default tw-place-self-center"
            panelClassName="controls_Graphs_theme-default"
        />
    );
}

export { SeriesColorPickerTemplate };
