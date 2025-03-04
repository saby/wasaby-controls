import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';

const IntegerLength = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__cell demo-NumberBase__default">
                <div className="controls-text-label">Стандартная настройка</div>
                <Number name={getBinding('Number')} />
            </div>
            <div className="controlsDemo__cell demo-NumberBase__length4Precision1">
                <div className="controls-text-label">4 знака до запятой и 1 после</div>
                <Number name={getBinding('Number')} integersLength={4} precision={1} />
            </div>
            <div className="controlsDemo__cell demo-NumberBase__onlyPositive">
                <div className="controls-text-label">Только положительные числа</div>
                <Number name={getBinding('Number')} onlyPositive={true} />
            </div>
        </div>
    );
});

IntegerLength.getLoadConfig = getLoadConfig;

export default IntegerLength;
