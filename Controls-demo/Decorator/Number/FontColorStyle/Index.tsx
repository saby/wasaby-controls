import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';
import 'css!Controls-demo/Decorator/Money/FontColorStyle/Style';

export default forwardRef(function FontColorStyle(props, ref) {
    const value = 123.45;
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=default</div>
                <Number value={value} fontColorStyle="default" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=unaccented</div>
                <Number value={value} fontColorStyle="unaccented" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=readonly,</div>
                <Number value={value} fontColorStyle="readonly" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=link,</div>
                <Number value={value} fontColorStyle="link" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=primary,</div>
                <Number value={value} fontColorStyle="primary" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=secondary</div>
                <Number value={value} fontColorStyle="secondary" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=success</div>
                <Number value={value} fontColorStyle="success" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=warning</div>
                <Number value={value} fontColorStyle="warning" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=danger</div>
                <Number value={value} fontColorStyle="danger" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=brand</div>
                <Number value={value} fontColorStyle="brand" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=label</div>
                <Number value={value} fontColorStyle="label" />
            </div>
            <div className="controlsDemo__cell controls-padding_left-s controlsDemo__backgroundContrast controlsDemo_fixedWidth200">
                <div className="controls-text-label">fontColorStyle=contrast</div>
                <Number value={value} fontColorStyle="contrast" />
                <br />
                <Number
                    value={123}
                    fontColorStyle="contrast"
                    precision={2}
                    roundMode="trunc"
                    showEmptyDecimals={true}
                />
            </div>
        </div>
    );
});
