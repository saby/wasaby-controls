import { forwardRef } from 'react';
import { Reference } from 'Router/router';
import AbbreviationIndex from '../../Abbreviation/Index';
import CurrencyIndex from '../../Currency/Index';
import HoveredIndex from '../../Hovered/Index';
import OnlyPositiveIndex from '../../OnlyPositive/Index';
import PrecisionIndex from '../../Precision/Index';
import StrokedIndex from '../../Stroked/Index';
import BaseIndex from '../../Base/Index';
import UnderlineIndex from '../../Underline/Index';
import HighlightedValueIndex from '../../HighlightedValue/Index';
import ValueIndex from '../../Value/Index';
import FontWeightIndex from '../../FontWeight/Index';
import 'css!Controls/CommonClasses';

function Link(props) {
    const clearProps = {
        ...props,
    };
    // на a нельзя вешать такой атрибут, будут ошибки в консоли. По-хорошему, надо править Reference, но не очень понятно как
    delete clearProps.onMouseOverCallback;
    return <a {...clearProps} />;
}

export default forwardRef(function Main(props, ref) {
    const rootClass =
        props.className + ' controlsDemo__wrapper controlsDemo__flex controlsDemo__flex-flow_wrap';
    return (
        <div ref={ref} className={rootClass}>
            <div>
                <div className="controlsDemo__cell">
                    <Reference
                        className="controls-text-label"
                        state="app/:app"
                        app="Controls-demo/Decorator/Money/Abbreviation/Index"
                    >
                        <Link>Abbreviation</Link>
                    </Reference>
                    <AbbreviationIndex />
                </div>
                <div className="ws-flexbox">
                    <div className="controlsDemo__cell">
                        <Reference
                            className="controls-text-label"
                            state="app/:app"
                            app="Controls-demo/Decorator/Money/Currency/Index"
                        >
                            <Link>Currency</Link>
                        </Reference>
                        <CurrencyIndex />
                    </div>
                    <div>
                        <div className="controlsDemo__cell">
                            <Reference
                                className="controls-text-label"
                                state="app/:app"
                                app="Controls-demo/Decorator/Money/Hovered/Index"
                            >
                                <Link>Hovered</Link>
                            </Reference>
                            <HoveredIndex />
                            <div className="ws-flexbox">
                                <div className="controlsDemo__cell">
                                    <Reference
                                        className="controls-text-label"
                                        state="app/:app"
                                        app="Controls-demo/Decorator/Money/OnlyPositive/Index"
                                    >
                                        <Link>OnlyPositive</Link>
                                    </Reference>
                                    <OnlyPositiveIndex />
                                </div>
                                <div className="controlsDemo__cell">
                                    <Reference
                                        className="controls-text-label"
                                        state="app/:app"
                                        app="Controls-demo/Decorator/Money/Precision/Index"
                                    >
                                        <Link>Precision</Link>
                                    </Reference>
                                    <PrecisionIndex />
                                </div>
                            </div>
                            <div className="ws-flexbox">
                                <div className="controlsDemo__cell">
                                    <Reference
                                        className="controls-text-label"
                                        state="app/:app"
                                        app="Controls-demo/Decorator/Money/Stroked/Index"
                                    >
                                        <Link>Stroked</Link>
                                    </Reference>
                                    <StrokedIndex />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="controlsDemo__cell">
                    <Reference
                        className="controls-text-label"
                        state="app/:app"
                        app="Controls-demo/Decorator/Money/Base/Index"
                    >
                        <Link>Base</Link>
                    </Reference>
                    <BaseIndex />
                    <div className="ws-flexbox">
                        <div className="controlsDemo__cell">
                            <Reference
                                className="controls-text-label"
                                state="app/:app"
                                app="Controls-demo/Decorator/Money/Underline/Index"
                            >
                                <Link>Underline</Link>
                            </Reference>
                            <UnderlineIndex />
                        </div>
                        <div className="controlsDemo__cell">
                            <Reference
                                className="controls-text-label"
                                state="app/:app"
                                app="Controls-demo/Decorator/Money/HighlightedValue/Index"
                            >
                                <Link>HighlightedValue</Link>
                            </Reference>
                            <HighlightedValueIndex />
                        </div>
                    </div>
                    <div className="ws-flexbox">
                        <div className="controlsDemo__cell">
                            <Reference
                                className="controls-text-label"
                                state="app/:app"
                                app="Controls-demo/Decorator/Money/Value/Index"
                            >
                                <Link>Value</Link>
                            </Reference>
                            <ValueIndex />
                        </div>
                        <div className="controlsDemo__cell">
                            <Reference
                                className="controls-text-label"
                                state="app/:app"
                                app="Controls-demo/Decorator/Money/FontWeight/Index"
                            >
                                <Link>FontWeight</Link>
                            </Reference>
                            <FontWeightIndex />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
