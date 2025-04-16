import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function RoundMode(props, ref) {
    const value = '12345.6789';
    const precision = 2;
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">roundMode=trunc</div>
                <Number value={value} precision={precision} roundMode="trunc" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">roundMode=round</div>
                <Number value={value} precision={precision} roundMode="round" />
            </div>
        </div>
    );
});
