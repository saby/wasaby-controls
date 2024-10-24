import { forwardRef, LegacyRef, useState } from 'react';
import { Buttons } from 'Controls/tabs';
import { ITEMS } from 'Controls-demo/Tabs/Buttons/NewStyle/resources/index';

export default forwardRef(function NewStyle(_, ref: LegacyRef<HTMLDivElement>) {
    const [firstSelectedKey, setFirstSelectedKey] = useState<string>('1');
    const [secondSelectedKey, setSecondSelectedKey] = useState<string>('1');
    return (
        <div ref={ref} className="controls-margin_left-2xl ws-flexbox ws-justify-content-center">
            <div className="controlsDemo_fixedWidth500" data-qa="controlsDemo_capture">
                <Buttons
                    className="controls-Tabs_style-wide"
                    selectedStyle="default"
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
