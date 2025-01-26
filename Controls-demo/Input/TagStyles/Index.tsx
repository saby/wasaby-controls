import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';
const defaultValue = 'text';

export default forwardRef(function Component(props, ref) {
    const [primaryValue, setPrimaryValue] = useState(defaultValue);
    const [secondaryValue, setSecondaryValue] = useState(defaultValue);
    const [successValue, setSuccessValue] = useState(defaultValue);
    const [warningValue, setWarningValue] = useState(defaultValue);
    const [dangerValue, setDangerValue] = useState(defaultValue);
    const [infoValue, setInfoValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="primary"
                    value={primaryValue}
                    onValueChanged={setPrimaryValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="secondary"
                    value={secondaryValue}
                    onValueChanged={setSecondaryValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="success"
                    value={successValue}
                    onValueChanged={setSuccessValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="warning"
                    value={warningValue}
                    onValueChanged={setWarningValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="danger"
                    value={dangerValue}
                    onValueChanged={setDangerValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    tagStyle="info"
                    value={infoValue}
                    onValueChanged={setInfoValue}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
