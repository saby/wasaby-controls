import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function FractionSize(props, ref) {
    const value = '12345.6789';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">Не определен precision</div>
                <Number value={value} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">precision = 0</div>
                <Number value={value} precision={0} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">precision = 3</div>
                <Number value={value} precision={3} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">precision = 10</div>
                <Number value={value} precision={10} />
            </div>
        </div>
    );
});
