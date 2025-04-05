import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function FractionSize(props, ref) {
    const value = '12345.6789';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">Не определен fractionSize</div>
                <Number value={value} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fractionSize = 0</div>
                <Number value={value} fractionSize={0} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fractionSize = 3</div>
                <Number value={value} fractionSize={3} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fractionSize = 10</div>
                <Number value={value} fractionSize={10} />
            </div>
        </div>
    );
});
