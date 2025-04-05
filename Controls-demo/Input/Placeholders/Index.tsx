import { useState, useCallback, forwardRef } from 'react';
import { Text } from 'Controls/input';
import { Button } from 'Controls/buttons';
import 'css!Controls-demo/Input/Placeholders/Placeholders';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('');
    const generatePassword = useCallback(() => {
        setValue(Math.random().toString(36).slice(2));
    }, []);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text className="controlsDemo__input demo-InputPlaceholders__empty" />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input demo-InputPlaceholders__simple"
                    placeholder="Enter your name"
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input demo-InputPlaceholders__withLink"
                    value={value}
                    onValueChanged={setValue}
                    placeholder={
                        <span>
                            Enter or{' '}
                            <Button
                                className="controlsDemo-Placeholders__button"
                                viewMode="link"
                                caption="paste generated"
                                fontColorStyle="label"
                                onClick={generatePassword}
                            />{' '}
                            password
                        </span>
                    }
                />
            </div>
        </div>
    );
});
