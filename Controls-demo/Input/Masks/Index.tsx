import { forwardRef } from 'react';
import FormatMaskCharsIndex from 'Controls-demo/Input/Masks/FormatMaskChars/Index';
import ReplacerIndex from 'Controls-demo/Input/Masks/Replacer/Index';
import BaseIndex from 'Controls-demo/Input/Masks/Base/Index';
import { Reference } from 'Router/router';

function Link(props) {
    const clearProps = {
        ...props,
    };
    // на a нельзя вешать такой атрибут, будут ошибки в консоли. По-хорошему, надо править Reference, но не очень понятно как
    delete clearProps.onMouseOverCallback;
    return <a {...clearProps} />;
}

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className + ' controlsDemo__wrapper controlsDemo__flex controlsDemo__flex-flow_wrap';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controls-margin_right-l">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app={'Controls-demo/Masks/Input/Base/Index'}
                >
                    <Link>Базовая настройка</Link>
                </Reference>
                <BaseIndex />
            </div>
            <div className="controlsDemo__cell controls-margin_right-l">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app={'Controls-demo/Input/Masks/Replacer/Index'}
                >
                    <Link>Настройка replacer</Link>
                </Reference>
                <ReplacerIndex />
            </div>
            <div className="controlsDemo__cell controls-margin_right-l">
                <Reference
                    className="controls-text-label"
                    state="app/:app"
                    app={'Controls-demo/Input/Masks/FormatMaskChars/Index'}
                >
                    <Link>Настройка formatMaskChars</Link>
                </Reference>
                <FormatMaskCharsIndex />
            </div>
        </div>
    );
});
