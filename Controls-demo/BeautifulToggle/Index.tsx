import { forwardRef, useState, useCallback } from 'react';
import { default as Toggle } from 'Controls/beautifulToggle';

const items = [
    {
        id: '1',
        caption: 'сотруднику',
    },
    {
        id: '2',
        caption: 'клиенту',
    },
];

export default forwardRef(function ButtonDemo(_, ref) {
    const [selectedKey, setSelectedKey] = useState('1');
    const onSelectedKeyChanged = useCallback((key) => {
        setSelectedKey(key);
    }, []);
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
            ref={ref}
        >
            <div
                className="controlsDemo__flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div
                    data-qa="controlsDemo_Buttons__capture"
                    className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                >
                    <div className="controls-margin_right-m">
                        <Toggle
                            items={items}
                            selectedKey={selectedKey}
                            onSelectedKeyChanged={onSelectedKeyChanged}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
