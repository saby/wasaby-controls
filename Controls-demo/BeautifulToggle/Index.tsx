import { forwardRef, useState, useCallback } from 'react';
import { default as Toggle } from 'Controls/beautifulToggle';

export default forwardRef(function ButtonDemo(_, ref) {
    const [value, setValue] = useState(true);
    const onValueChanged = useCallback((value) => {
        setValue(value);
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
                            onCaption="сотруднику"
                            offCaption="клиенту"
                            value={value}
                            onValueChanged={onValueChanged}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
