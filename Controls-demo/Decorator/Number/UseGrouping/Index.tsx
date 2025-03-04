import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function UseGrouping(props, ref) {
    const value = '1234567890.12';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">useGrouping=false</div>
                <Number value={value} useGrouping={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">useGrouping=true</div>
                <Number value={value} useGrouping={true} />
            </div>
        </div>
    );
});
