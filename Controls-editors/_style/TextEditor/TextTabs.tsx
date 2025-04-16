import { memo, useCallback, useMemo, useState } from 'react';
import { Buttons as TabButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';

interface ITextTabsProps {
    tabs: Record<string, string>;
    onChange: (key: string) => void;
}

const CUSTOM_EVENTS = ['onSelectedKeyChanged'];

export const TextTabs = memo(({ tabs, onChange }: ITextTabsProps) => {
    const [selectedKey, setSelectedKey] = useState(Object.keys(tabs)[0]);
    const items = useMemo(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: Object.entries(tabs).map(([id, title]) => {
                return {
                    id,
                    title,
                    align: 'left',
                };
            }),
        });
    }, [tabs]);

    const onSelectedKeyChanged = useCallback(
        (key: string) => {
            setSelectedKey(key);
            onChange(key);
        },
        [onChange]
    );

    return (
        // @ts-ignore
        <TabButtons
            keyProperty="id"
            selectedKey={selectedKey}
            items={items}
            onSelectedKeyChanged={onSelectedKeyChanged}
            customEvents={CUSTOM_EVENTS}
            borderVisible={false}
            selectedStyle="default"
            fontColorStyle="default"
            horizontalPadding="null"
        />
    );
});
