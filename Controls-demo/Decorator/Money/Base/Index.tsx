import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 100000 useGrouping = false</div>
                <Money value={100000} useGrouping={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 100000 useGrouping = true</div>
                <Money value={100000} useGrouping={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 100000.00 showEmptyDecimals = false
                </div>
                <Money value={100000.0} showEmptyDecimals={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 100000.00 showEmptyDecimals = true
                </div>
                <Money value={100000.0} showEmptyDecimals={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 100000 tooltip = Current money</div>
                <Money value={100000} tooltip="Current money" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">readOnly = true</div>
                <Money value={100000} readOnly={true} />
            </div>
        </div>
    );
});
