import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';
const defaultValue = 'text';

export default forwardRef(function Component(props, ref) {
    const [inlineHeightMValue, setInlineHeightMValue] = useState(defaultValue);
    const [inlineHeightLValue, setInlineHeightLValue] = useState(defaultValue);
    const [inlineHeightXLValue, setInlineHeightXLValue] = useState(defaultValue);
    const [inlineHeight2XLValue, setInlineHeight2XLValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center controls-background-unaccented-same';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    inlineHeight="m"
                    value={inlineHeightMValue}
                    onValueChanged={setInlineHeightMValue}
                    contrastBackground={true}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    inlineHeight="l"
                    value={inlineHeightLValue}
                    onValueChanged={setInlineHeightLValue}
                    contrastBackground={true}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    inlineHeight="xl"
                    value={inlineHeightXLValue}
                    onValueChanged={setInlineHeightXLValue}
                    contrastBackground={true}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    inlineHeight="2xl"
                    value={inlineHeight2XLValue}
                    onValueChanged={setInlineHeight2XLValue}
                    contrastBackground={true}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
