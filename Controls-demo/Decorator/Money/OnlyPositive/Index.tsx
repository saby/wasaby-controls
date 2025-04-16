import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function OnlyPositive(props, ref) {
    const value = '-123.45';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">onlyPositive=true</div>
                <Money value={value} onlyPositive={true} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">onlyPositive=false</div>
                <Money value={value} onlyPositive={false} />
            </div>
        </div>
    );
});
