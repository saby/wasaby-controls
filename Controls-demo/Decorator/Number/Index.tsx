import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = null</div>
                <Number value={null} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 123456 useGrouping = false tooltip = Сумма
                </div>
                <Number value={123456} useGrouping={false} tooltip="Сумма" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 123456 useGrouping = true</div>
                <Number value={123456} useGrouping={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 123456 precision = 3 roundMode = trunc
                </div>
                <Number value={123456} precision={3} roundMode="trunc" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 123456 precision = 3 roundMode = round
                </div>
                <Number value={123456} precision={3} showEmptyDecimals={true} roundMode="round" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1.2349 precision = 3 roundMode = trunc
                </div>
                <Number value={1.2349} precision={3} roundMode="trunc" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1.2349 precision = 3 roundMode = round
                </div>
                <Number value={1.2349} precision={3} roundMode="round" />
            </div>
        </div>
    );
});
