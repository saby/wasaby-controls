import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';

export default forwardRef(function Component(props, ref) {
    const [defaultValue, setDefaultValue] = useState('text');
    const [linkValue, setLinkValue] = useState(defaultValue);
    const [primaryValue, setPrimaryValue] = useState(defaultValue);
    const [secondaryValue, setSecondaryValue] = useState(defaultValue);
    const [successValue, setSuccessValue] = useState(defaultValue);
    const [warningValue, setWarningValue] = useState(defaultValue);
    const [dangerValue, setDangerValue] = useState(defaultValue);
    const [unaccentedValue, setUnaccentedValue] = useState(defaultValue);
    const [labelValue, setLabelValue] = useState(defaultValue);
    const [infoValue, setInfoValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="link"
                    value={linkValue}
                    onValueChanged={setLinkValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="primary"
                    value={primaryValue}
                    onValueChanged={setPrimaryValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="secondary"
                    value={secondaryValue}
                    onValueChanged={setSecondaryValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="success"
                    value={successValue}
                    onValueChanged={setSuccessValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="warning"
                    value={warningValue}
                    onValueChanged={setWarningValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="danger"
                    value={dangerValue}
                    onValueChanged={setDangerValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="unaccented"
                    value={unaccentedValue}
                    onValueChanged={setUnaccentedValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="label"
                    value={labelValue}
                    onValueChanged={setLabelValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="info"
                    value={infoValue}
                    onValueChanged={setInfoValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontColorStyle="default"
                    value={defaultValue}
                    onValueChanged={setDefaultValue}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
