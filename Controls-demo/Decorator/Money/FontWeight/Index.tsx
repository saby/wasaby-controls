import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function FontWeight(props, ref) {
    const value = '123.45';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontWeight=default</div>
                <Money value={value} fontWeight="default" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontWeight=bold</div>
                <Money value={value} fontWeight="bold" />
            </div>
        </div>
    );
});
