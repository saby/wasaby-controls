import { Control } from 'Controls/Tumbler';
import { RecordSet } from 'Types/collection';
import { Fragment, useCallback } from 'react';
import { IBaseEditorProps } from './interfaces/IBaseEditorProps';
import { TumblerItemTemplate } from './common/TumblerItemTemplate';
import { TSelectedKey, ISingleSelectableOptions } from 'Controls/interface';

interface ILegendHorizontalPositionEditorProps extends IBaseEditorProps {}

const EDITOR_ITEMS = [
    { id: 'start', icon: 'icon-TileLeftSide' },
    { id: 'center', icon: 'icon-TileHorizontalCenter' },
    { id: 'end', icon: 'icon-TileRightSide' },
];

const EDITOR_ITEMS_RS = new RecordSet({
    keyProperty: 'id',
    rawData: EDITOR_ITEMS,
});

function LegendHorizontalPositionEditor(props: ILegendHorizontalPositionEditorProps) {
    const { LayoutComponent = Fragment, onChange, value = 'center' } = props;

    const onValueChanged = useCallback((key: string) => {
        onChange(key);
    }, []);

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Control
                items={EDITOR_ITEMS_RS}
                itemTemplate={TumblerItemTemplate}
                selectedKey={value as TSelectedKey}
                onSelectedKeyChanged={
                    onValueChanged as ISingleSelectableOptions['onSelectedKeyChanged']
                }
            />
        </LayoutComponent>
    );
}

LegendHorizontalPositionEditor.displayName =
    'Controls-Graphs-editors/LegendHorizontalPositionEditor:LegendHorizontalPositionEditor';

export { LegendHorizontalPositionEditor };
