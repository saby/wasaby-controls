import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';
import 'css!Controls-demo/Decorator/Money/FontColorStyle/Style';

export default forwardRef(function FontColorStyle(props, ref) {
    const value = '123.45';
    const value1 = '123.00';
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=default, underline=hovered</div>
                <Money
                    value={value}
                    fontColorStyle="default"
                    underline="hovered"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__default"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    fontColorStyle=unaccented, underline=hovered
                </div>
                <Money
                    value={value}
                    fontColorStyle="unaccented"
                    underline="hovered"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__unaccented"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    fontColorStyle=readonly, underline=hovered
                </div>
                <Money
                    value={value}
                    fontColorStyle="readonly"
                    underline="hovered"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__readonly"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=link, underline=hovered</div>
                <Money
                    value={value}
                    fontColorStyle="link"
                    underline="hovered"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__link"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=primary, underline=hovered</div>
                <Money
                    value={value}
                    fontColorStyle="primary"
                    underline="hovered"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__primary"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=secondary</div>
                <Money
                    value={value}
                    fontColorStyle="secondary"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__secondary"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=success</div>
                <Money
                    value={value}
                    fontColorStyle="success"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__success"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=warning</div>
                <Money
                    value={value}
                    fontColorStyle="warning"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__warning"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=danger</div>
                <Money
                    value={value}
                    fontColorStyle="danger"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__danger"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=brand</div>
                <Money
                    value={value}
                    fontColorStyle="brand"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__brand"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">fontColorStyle=label</div>
                <Money
                    value={value}
                    fontColorStyle="label"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__label"
                />
            </div>
            <div className="controlsDemo__cell controls-padding_left-s controlsDemo__backgroundContrast controlsDemo_fixedWidth200">
                <div className="controls-text-label">fontColorStyle=contrast</div>
                <Money
                    value={value}
                    fontColorStyle="contrast"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__contrast-with-decimal"
                />
                <br />
                <Money
                    value={value1}
                    fontColorStyle="contrast"
                    data-qa="Controls-demo_Decorator_Money_FontColorStyle__contrast-without-decimal"
                />
            </div>
        </div>
    );
});
