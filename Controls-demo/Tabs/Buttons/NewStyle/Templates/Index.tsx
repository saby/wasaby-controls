import { forwardRef, LegacyRef, useState } from 'react';
import { Buttons } from 'Controls/tabs';
import { TextCounterWideTabTemplate } from 'Controls/tabs';
import { ITEMS_WITH_ICON_AND_COUNTER } from 'Controls-demo/Tabs/Buttons/NewStyle/resources/index';

export default forwardRef(function NewStyleTemplates(_, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKey, setSelectedKey] = useState('1');

    return (
        <div ref={ref} className="controls-margin_left-2xl ws-flexbox ws-justify-content-center">
            <div className="controlsDemo_fixedWidth500" data-qa="controlsDemo_capture">
                <Buttons
                    className="controls-Tabs_style-wide"
                    selectedKey={selectedKey}
                    selectedStyle="primary"
                    onSelectedKeyChanged={(selectedKey) => {
                        setSelectedKey(selectedKey);
                    }}
                    customEvents={['onSelectedKeyChanged']}
                    keyProperty="id"
                    items={ITEMS_WITH_ICON_AND_COUNTER}
                    itemTemplate={(props) => (
                        <TextCounterWideTabTemplate
                            {...props}
                            isSelected={selectedKey === props.item.get('id')}
                        />
                    )}
                />
            </div>
        </div>
    );
});
