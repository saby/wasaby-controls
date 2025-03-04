import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import { useTheme } from 'UI/Contexts';

export default forwardRef(function PrecisionDemo(props, ref) {
    const value = '12345.67';
    const theme = useTheme();
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className={`controls-text-label_theme-${theme}`}>
                    value = 12345.67, default precision
                </div>
                <Money value={value} />
            </div>
            <div className="controlsDemo__cell">
                <div className={`controls-text-label_theme-${theme}`}>
                    value = 12345.67, precision = 0
                </div>
                <Money value={value} precision={0} />
            </div>
            <div className="controlsDemo__cell">
                <div className={`controls-text-label_theme-${theme}`}>
                    value = 12345.67, precision = 2
                </div>
                <Money value={value} precision={2} />
            </div>
        </div>
    );
});
