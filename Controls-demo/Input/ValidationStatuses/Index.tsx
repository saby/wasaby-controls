import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';
const defaultValue = 'text';

export default forwardRef(function Component(props, ref) {
    const [validValue, setValidValue] = useState(defaultValue);
    const [invalidValue, setInvalidValue] = useState(defaultValue);
    const [invalidAccentValue, setInvalidAccentValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                <div className="controls-text-label controls-margin_bottom-s">
                    Валидное состояние
                </div>
                <Text
                    className="controlsDemo__input"
                    validationStatus="valid"
                    value={validValue}
                    onValueChanged={setValidValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                <div className="controls-text-label controls-margin_bottom-s">
                    Невалидное состояние
                </div>
                <Text
                    className="controlsDemo__input"
                    validationStatus="invalid"
                    value={invalidValue}
                    onValueChanged={setInvalidValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                <div className="controls-text-label controls-margin_bottom-s">
                    Невалидное состояние в фокусе
                </div>
                <Text
                    className="controlsDemo__input"
                    validationStatus="invalidAccent"
                    contrastBackground={true}
                    value={invalidAccentValue}
                    onValueChanged={setInvalidAccentValue}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
