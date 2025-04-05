import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function FontSize(props, ref) {
    const value = '123.45';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=xs</div>
                <Money value={value} fontSize="xs" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=m</div>
                <Money value={value} fontSize="m" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=l</div>
                <Money value={value} fontSize="l" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=xl</div>
                <Money value={value} fontSize="xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=2xl</div>
                <Money value={value} fontSize="2xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=3xl</div>
                <Money value={value} fontSize="3xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=4xl</div>
                <Money value={value} fontSize="4xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=5xl</div>
                <Money value={value} fontSize="5xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=6xl</div>
                <Money value={value} fontSize="6xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=7xl</div>
                <Money value={value} fontSize="7xl" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontSize=8xl</div>
                <Money value={value} fontSize="8xl" />
            </div>
        </div>
    );
});
