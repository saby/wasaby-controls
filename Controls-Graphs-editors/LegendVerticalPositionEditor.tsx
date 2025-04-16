import { Control } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { Fragment, useCallback } from 'react';
import { IBaseEditorProps } from './interfaces/IBaseEditorProps';
import { TumblerItemTemplate } from './common/TumblerItemTemplate';
import { TSelectedKey, ISingleSelectableOptions } from 'Controls/interface';

interface ILegendVerticalPositionEditorProps extends IBaseEditorProps {}

const EDITOR_ITEMS = [
    { id: 'top', icon: 'icon-TileUpSide' },
    { id: 'bottom', icon: 'icon-TileDownSide' },
];

const EDITOR_ITEMS_RS = new RecordSet({
    keyProperty: 'id',
    rawData: EDITOR_ITEMS,
});

function LegendVerticalPositionEditor(props: ILegendVerticalPositionEditorProps) {
    const { LayoutComponent = Fragment, onChange, value = 'top' } = props;

    const onValueChanged = useCallback((key: string) => {
        onChange(key);
    }, []);

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Control
                items={EDITOR_ITEMS_RS}
                keyProperty="id"
                selectedKey={value as TSelectedKey}
                onSelectedKeyChanged={
                    onValueChanged as ISingleSelectableOptions['onSelectedKeyChanged']
                }
                itemTemplate={TumblerItemTemplate}
            />
        </LayoutComponent>
    );
}

LegendVerticalPositionEditor.displayName =
    'Controls-Graphs-editors/LegendVerticalPositionEditor:LegendVerticalPositionEditor';

export { LegendVerticalPositionEditor };
