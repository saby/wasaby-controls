import { ReactElement, useCallback, useMemo } from 'react';
import { useSelectSlice } from 'Controls/selector';
import { RecordSet } from 'Types/collection';
import { Buttons as TabButtons } from 'Controls/tabs';
import { IControlProps } from 'Controls/interface';

interface IButtonProps extends IControlProps {
    listName: string;
}

export default function Tabs(props: IButtonProps): ReactElement | null {
    const selectSlice = useSelectSlice();
    const configs = selectSlice.state.configs;
    const tabsItems = useMemo(() => {
        const rawData = Object.keys(configs).map((key) => {
            return {
                id: key,
                title: configs[key].tabCaption,
            };
        });
        return new RecordSet({
            rawData,
            keyProperty: 'id',
        });
    }, [configs]);

    const selectedKeyChangedHandler = useCallback(
        (selectedKey) => {
            selectSlice.setCurrentTab(selectedKey);
        },
        [selectSlice]
    );

    return tabsItems.getCount() > 1 ? (
        <TabButtons
            keyProperty="id"
            items={tabsItems}
            selectedKey={props.listName}
            onSelectedKeyChanged={selectedKeyChangedHandler}
            selectedStyle="default"
            borderVisible={false}
            className={'controls-Layout-SelectorStack__tabs'}
        />
    ) : null;
}
