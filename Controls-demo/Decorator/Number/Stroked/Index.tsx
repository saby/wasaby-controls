import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, stroked = false</div>
                <Number value={10} stroked={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, stroked = true</div>
                <Number value={10} stroked={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.11, stroked = true</div>
                <Number value={10.11} stroked={true} />
            </div>
        </div>
    );
});
