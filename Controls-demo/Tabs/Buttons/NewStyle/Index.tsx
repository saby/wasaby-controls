import { forwardRef, LegacyRef, useState } from 'react';
import { Buttons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';

const ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Document',
        },
        {
            id: '2',
            title: 'Files',
        },
        {
            id: '3',
            title: 'Orders',
        },
    ],
});

export default forwardRef(function NewStyle(_, ref: LegacyRef<HTMLDivElement>) {
    const [firstSelectedKey, setFirstSelectedKey] = useState<string>('1');
    const [secondSelectedKey, setSecondSelectedKey] = useState<string>('1');
    return (
        <div ref={ref} className="controls-margin_left-2xl ws-flexbox ws-justify-content-center">
            <div className="controlsDemo_fixedWidth500" data-qa="controlsDemo_capture">
                <Buttons
                    className="controls-Tabs_style-wide"
                    selectedKey={firstSelectedKey}
                    onSelectedKeyChanged={(selectedKey) => {
                        setFirstSelectedKey(selectedKey);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                    keyProperty="id"
                    items={ITEMS}
                />
                <Buttons
                    className="controls-margin_top-m"
                    selectedKey={secondSelectedKey}
                    onSelectedKeyChanged={(selectedKey) => {
                        setSecondSelectedKey(selectedKey);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                    keyProperty="id"
                    items={ITEMS}
                />
            </div>
        </div>
    );
});
