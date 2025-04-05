import { IBaseEditorProps } from './interfaces/IBaseEditorProps';
import { Fragment, useCallback } from 'react';
import { Control } from 'Controls/Tumbler';
import { TumblerItemTemplate } from './common/TumblerItemTemplate';
import { RecordSet } from 'Types/collection';
import { TSelectedKey, ISingleSelectableOptions } from 'Controls/interface';

interface IYAxisEditor extends IBaseEditorProps {}

const EDITOR_ITEMS = [
    {
        id: '1',
        icon: 'icon-TileLeftSide',
        opposite: false,
        tooltip: 'По левому краю',
    },
    {
        id: '2',
        icon: 'icon-TileRightSide',
        opposite: false,
        tooltip: 'По правому краю',
    },
];

const EDITOR_ITEMS_RS = new RecordSet({
    keyProperty: 'id',
    rawData: EDITOR_ITEMS,
});

function YAxisEditor(props: IYAxisEditor) {
    const { LayoutComponent = Fragment, value, onChange } = props;

    const onSelectedKeysChanged = useCallback((key: string) => {
        onChange(key);
    }, []);

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Control
                selectedKey={value as TSelectedKey}
                itemTemplate={TumblerItemTemplate}
                items={EDITOR_ITEMS_RS}
                onSelectedKeyChanged={
                    onSelectedKeysChanged as ISingleSelectableOptions['onSelectedKeyChanged']
                }
            />
        </LayoutComponent>
    );
}

YAxisEditor.displayName = 'Controls-Graphs-editors/YAxisEditor:YAxisEditor';

export { YAxisEditor };
