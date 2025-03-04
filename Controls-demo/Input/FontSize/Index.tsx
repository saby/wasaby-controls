import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';
const defaultValue = 'text';

export default forwardRef(function Component(props, ref) {
    const [fontSizeSValue, setFontSizeSValue] = useState(defaultValue);
    const [fontSizeMValue, setFontSizeMValue] = useState(defaultValue);
    const [fontSizeLValue, setFontSizeLValue] = useState(defaultValue);
    const [fontSizeXLValue, setFontSizeXLValue] = useState(defaultValue);
    const [fontSize2XLValue, setFontSize2XLValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontSize="s"
                    value={fontSizeSValue}
                    onValueChanged={setFontSizeSValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontSize="m"
                    value={fontSizeMValue}
                    onValueChanged={setFontSizeMValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontSize="l"
                    value={fontSizeLValue}
                    onValueChanged={setFontSizeLValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontSize="xl"
                    value={fontSizeXLValue}
                    onValueChanged={setFontSizeXLValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    fontSize="2xl"
                    value={fontSize2XLValue}
                    onValueChanged={setFontSize2XLValue}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
