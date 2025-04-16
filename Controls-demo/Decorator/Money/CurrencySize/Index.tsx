import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const value = '123.45';
    const baseSizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'];
    const rootClass =
        props.className + ' controlsDemo__wrapper ws-flexbox ws-justify-content-center';
    return (
        <div className={rootClass} ref={ref}>
            <div>
                {baseSizes.map((size) => {
                    return (
                        <div className="controlsDemo__cell" key={size}>
                            <Money
                                value={value}
                                currency="Dollar"
                                fontSize={size}
                                currencySize={size}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
