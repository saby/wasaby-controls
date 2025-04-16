import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function CurrencyStyle(props, ref) {
    const value = '123.45';
    const baseStyles = [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'unaccented',
        'link',
        'label',
        'info',
        'default',
    ];
    const rootClass =
        props.className + ' controlsDemo__wrapper ws-flexbox ws-justify-content-center';
    return (
        <div className={rootClass} ref={ref}>
            <div>
                {baseStyles.map((style) => {
                    return (
                        <div className="controlsDemo__cell" key={style}>
                            <Money value={value} currency="Dollar" currencyStyle={style} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
