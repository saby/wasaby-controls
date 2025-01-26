import { forwardRef } from 'react';
import { Text } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    readOnly={true}
                    placeholderVisibility="editable"
                    placeholder="Enter your name"
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    readOnly={true}
                    placeholderVisibility="empty"
                    placeholder="Enter your name"
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    readOnly={true}
                    placeholderVisibility="editable"
                    value="Hello world"
                    placeholder="Enter your name"
                />
            </div>
        </div>
    );
});
