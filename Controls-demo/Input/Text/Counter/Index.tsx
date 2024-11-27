import { forwardRef, useState } from 'react';
import { Text } from 'Controls/input';

export default forwardRef(function TextWithCounter(_, ref) {
    const [valueWithCounter, setValueWithCounter] = useState('');
    const [valueWithoutCounter, setValueWithoutCounter] = useState('');
    return (
        <div
            ref={ref}
            className="controls-margin_top-xl controls-margin_left-2xl controls-margin_bottom-xl"
        >
            <div className="controlsDemo__cell controls-margin_bottom-2xl">
                <div className="controls-text-label">Отображение счётчика, maxLength=10</div>
                <Text
                    value={valueWithCounter}
                    onValueChanged={(_, res) => {
                        setValueWithCounter(res);
                    }}
                    className="controlsDemo_fixedWidth300"
                    counterVisibility={true}
                    maxLength={10}
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">Стандартный вариант, maxLength=10</div>
                <Text
                    value={valueWithoutCounter}
                    onValueChanged={(_, res) => {
                        setValueWithoutCounter(res);
                    }}
                    className="controlsDemo_fixedWidth300"
                    maxLength={10}
                />
            </div>
        </div>
    );
});
