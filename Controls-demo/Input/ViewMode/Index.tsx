import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('text');
    const [valueReadonly, setValueReadonly] = useState('text');
    const rootClass =
        props.className + ' controlsDemo__wrapper controlsDemo__flex ws-justify-content-center';
    return (
        <div className={rootClass} ref={ref}>
            <div
                className="controlsDemo__flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__cell">
                    <Text
                        className="controlsDemo__input"
                        data-qa="Controls-demo_Input_ViewMode__contrastBackground-false"
                        value={value}
                        onValueChanged={setValue}
                        contrastBackground={false}
                    />
                </div>
                <div className="controlsDemo__cell controls-padding-m controls-background-unaccented-same">
                    <Text
                        className="controlsDemo__input"
                        data-qa="Controls-demo_Input_ViewMode__contrastBackground-true"
                        value={value}
                        onValueChanged={setValue}
                        contrastBackground={true}
                    />
                </div>
                <div className="controlsDemo__cell controls-padding-m controls-background-unaccented-same">
                    <Text
                        className="controlsDemo__input"
                        data-qa="Controls-demo_Input_ViewMode__contrastBackground-true-readOnly"
                        value={valueReadonly}
                        onValueChanged={setValueReadonly}
                        readOnly={true}
                        contrastBackground={true}
                    />
                </div>
            </div>
        </div>
    );
});
