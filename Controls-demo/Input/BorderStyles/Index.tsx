import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const defaultValue = 'text';
const placeholder = 'Tooltip';

export default forwardRef(function Component(props, ref) {
    const [successValue, setSuccessValue] = useState(defaultValue);
    const [secondaryValue, setSecondaryValue] = useState(defaultValue);
    const [warningValue, setWarningValue] = useState(defaultValue);
    const [successContrastValue, setSuccessContrastValue] = useState(defaultValue);
    const [secondaryContrastValue, setSecondaryContrastValue] = useState(defaultValue);
    const [warningContrastValue, setWarningContrastValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    borderStyle="secondary"
                    value={secondaryValue}
                    onValueChanged={setSecondaryValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    borderStyle="success"
                    value={successValue}
                    onValueChanged={setSuccessValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    borderStyle="warning"
                    value={warningValue}
                    onValueChanged={setWarningValue}
                    placeholder={placeholder}
                />
            </div>

            <div className="controls-background-unaccented-same controls-padding-m">
                <div className="controlsDemo__cell">
                    <Text
                        className="controlsDemo__input"
                        borderStyle="secondary"
                        contrastBackground={true}
                        value={secondaryContrastValue}
                        onValueChanged={setSecondaryContrastValue}
                        placeholder={placeholder}
                    />
                </div>
                <div className="controlsDemo__cell">
                    <Text
                        className="controlsDemo__input"
                        borderStyle="success"
                        contrastBackground={true}
                        value={successContrastValue}
                        onValueChanged={setSuccessContrastValue}
                        placeholder={placeholder}
                    />
                </div>
                <div>
                    <Text
                        className="controlsDemo__input"
                        borderStyle="warning"
                        contrastBackground={true}
                        value={warningContrastValue}
                        onValueChanged={setWarningContrastValue}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </div>
    );
});
