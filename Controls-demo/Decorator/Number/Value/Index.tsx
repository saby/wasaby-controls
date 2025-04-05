import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = null</div>
                <Number value={null} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234567890</div>
                <Number value={1234567890} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = '1234567890'</div>
                <Number value="1234567890" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 12345.67890</div>
                <Number value={12345.6789} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = '12345.67890'</div>
                <Number value="12345.6789" />
            </div>
        </div>
    );
});
