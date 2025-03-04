import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, currency = 'Dollar'</div>
                <Money value={10} currency="Dollar" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Dollar', currencyPosition = 'left'
                </div>
                <Money value={10.1} currency="Dollar" currencyPosition="left" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Dollar', currencyPosition = 'right'
                </div>
                <Money value={10.1} currency="Dollar" currencyPosition="right" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, currency = 'Ruble'</div>
                <Money value={10} currency="Ruble" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Ruble', currencyPosition = 'left'
                </div>
                <Money value={10.1} currency="Ruble" currencyPosition="left" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Ruble', currencyPosition = 'right'
                </div>
                <Money value={10.1} currency="Ruble" currencyPosition="right" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10, currency = 'Euro'</div>
                <Money value={10} currency="Euro" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Euro', currencyPosition = 'left'
                </div>
                <Money value={10.1} currency="Euro" currencyPosition="left" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 10.10, currency = 'Euro', currencyPosition = 'right'
                </div>
                <Money value={10.1} currency="Euro" currencyPosition="right" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.10, currency = '¥'</div>
                <Money value={10.1} currency="¥" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.10, currency = '₨'</div>
                <Money value={10.1} currency="₨" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 10.10, currency = 'ℳ'</div>
                <Money value={10.1} currency="ℳ" />
            </div>
        </div>
    );
});
