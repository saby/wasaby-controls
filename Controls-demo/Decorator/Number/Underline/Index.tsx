import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, underline = 'none'</div>
                <Number
                    data-qa="controlsDemo-DecoratorUnderline__none"
                    value={10}
                    underline="none"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, underline = 'hovered'</div>
                <Number
                    data-qa="controlsDemo-DecoratorUnderline__hovered"
                    value={10}
                    underline="hovered"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.11, underline = 'hovered'</div>
                <Number
                    data-qa="controlsDemo-DecoratorUnderline__hoveredFloat"
                    value={10.11}
                    underline="hovered"
                />
            </div>
        </div>
    );
});
