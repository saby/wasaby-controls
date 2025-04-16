import { useState, forwardRef, LegacyRef } from 'react';
import { Text } from 'Controls/input';
import { IComponentProps } from 'Controls/interface';

export default forwardRef(function ShortPlaceholder(
    props: IComponentProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const [value, setValue] = useState('Very long long long comment');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input demo-InputPlaceholders__simple"
                    placeholder="Enter your name"
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input demo-InputPlaceholders__simple"
                    placeholder="Enter your comment"
                    shortPlaceholder="comment"
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input demo-InputPlaceholders__simple"
                    placeholder="Enter your comment"
                    shortPlaceholder="comment"
                    value={value}
                    onValueChanged={setValue}
                />
            </div>
        </div>
    );
});
