import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = null</div>
                <Money value={null} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 0</div>
                <Money value={0} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10</div>
                <Money value={10} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = '10'</div>
                <Money value="10" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.2020</div>
                <Money value={10.202} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = '10.2020'</div>
                <Money value="10.2020" />
            </div>
        </div>
    );
});
