import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function ShowEmptyDecimals(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234.00, showEmptyDecimals = true</div>
                <Money value={1234.0} showEmptyDecimals={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1234.00, showEmptyDecimals = false
                </div>
                <Money value={1234.0} showEmptyDecimals={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1234.56, showEmptyDecimals = false
                </div>
                <Money value={1234.56} showEmptyDecimals={false} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = false abbreviationType = long
                </div>
                <Money value={1000.0} showEmptyDecimals={false} abbreviationType="long" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = false abbreviationType = short
                </div>
                <Money value={1000.0} showEmptyDecimals={false} abbreviationType="short" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = true abbreviationType = long
                </div>
                <Money value={1000.0} showEmptyDecimals={true} abbreviationType="long" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = true abbreviationType = short
                </div>
                <Money value={1000.0} showEmptyDecimals={true} abbreviationType="short" />
            </div>
        </div>
    );
});
