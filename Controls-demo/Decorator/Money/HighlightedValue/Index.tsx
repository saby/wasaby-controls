import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function HighlightedValue(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth200';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">highlightedValue="1 23"</div>
                <Money value={1234567.22} highlightedValue="1 23" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">highlightedValue="5.11"</div>
                <Money value={98765.11} highlightedValue={5.11} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">highlightedValue="12"</div>
                <Money value={10000.12} highlightedValue="12" />
            </div>
        </div>
    );
});
