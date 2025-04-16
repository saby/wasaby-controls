import { IBaseEditorProps } from './interfaces/IBaseEditorProps';
import { Fragment, useCallback } from 'react';
import { Control } from 'Controls/Tumbler';
import { TumblerItemTemplate } from './common/TumblerItemTemplate';
import { RecordSet } from 'Types/collection';
import { ISingleSelectableOptions } from 'Controls/interface';

interface IYAxisOppositeEditorProps extends IBaseEditorProps {}

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

function YAxisOppositeEditor(props: IYAxisOppositeEditorProps) {
    const { LayoutComponent = Fragment, value = false, onChange } = props;

    const onSelectedKeysChanged = useCallback((key: string) => {
        onChange(EDITOR_ITEMS.find((item) => item.id === key)?.opposite);
    }, []);

    return (
        // @ts-expect-error JSX
        <LayoutComponent>
            <Control
                selectedKey={!value ? '1' : '2'}
                itemTemplate={TumblerItemTemplate}
                items={EDITOR_ITEMS_RS}
                onSelectedKeyChanged={
                    onSelectedKeysChanged as ISingleSelectableOptions['onSelectedKeyChanged']
                }
            />
        </LayoutComponent>
    );
}

YAxisOppositeEditor.displayName =
    'Controls-Graphs-editors/YAxisEditorOppositeEditor:YAxisEditorOppositeEditor';

export { YAxisOppositeEditor };
