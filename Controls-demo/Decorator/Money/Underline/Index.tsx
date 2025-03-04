import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, underline = 'hovered'</div>
                <Money
                    data-qa="controlsDemo-DecoratorUnderline__hovered"
                    value={10}
                    underline="hovered"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, underline = 'none'</div>
                <Money
                    data-qa="controlsDemo-DecoratorUnderline__none"
                    value={10}
                    underline="none"
                />
            </div>
        </div>
    );
});
