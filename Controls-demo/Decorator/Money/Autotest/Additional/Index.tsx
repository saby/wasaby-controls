import { forwardRef } from 'react';
import { Reference } from 'Router/router';
import CurrencySizeIndex from '../../CurrencySize/Index';
import CurrencyStyleIndex from '../../CurrencyStyle/Index';
import FontColorStyleIndex from '../../FontColorStyle/Index';
import FontColorStyleCustomIndex from '../../FontColorStyleCustom/Index';
import FontSizeIndex from '../../FontSize/Index';
import ShowEmptyDecimalsIndex from '../../ShowEmptyDecimals/Index';
import 'css!Controls/CommonClasses';

function Link(props) {
    const clearProps = {
        ...props,
    };
    // на a нельзя вешать такой атрибут, будут ошибки в консоли. По-хорошему, надо править Reference, но не очень понятно как
    delete clearProps.onMouseOverCallback;
    return <a {...clearProps} />;
}

export default forwardRef(function Additional(props, ref) {
    const rootClass = props.className + ' tw-flex tw-flex-wrap';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/CurrencySize/Index"
                >
                    <Link>CurrencySize</Link>
                </Reference>
                <CurrencySizeIndex />
            </div>
            <div className="controlsDemo__cell controlsDemo__wrapper__horizontal">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/CurrencyStyle/Index"
                >
                    <Link>CurrencyStyle</Link>
                </Reference>
                <CurrencyStyleIndex />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/FontColorStyle/Index"
                >
                    <Link>FontColorStyle</Link>
                </Reference>
                <FontColorStyleIndex />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/FontColorStyleCustom/Index"
                >
                    <Link>FontColorStyle - Custom</Link>
                </Reference>
                <FontColorStyleCustomIndex />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/FontSize/Index"
                >
                    <Link>FontSize</Link>
                </Reference>
                <FontSizeIndex />
            </div>
            <div className="controlsDemo__cell">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app="Controls-demo/Decorator/Money/ShowEmptyDecimals/Index"
                >
                    <Link>ShowEmptyDecimals</Link>
                </Reference>
                <ShowEmptyDecimalsIndex />
            </div>
        </div>
    );
});
