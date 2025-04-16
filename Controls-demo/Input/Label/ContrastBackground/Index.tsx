import { forwardRef, useCallback, useState } from 'react';
import { Label, Text } from 'Controls/input';

export default forwardRef(function ContrastBackground(_, ref) {
    const [value, setValue] = useState('Текст в поле ввода');
    const valueHandler = useCallback(
        (_, val) => {
            setValue(val);
        },
        [setValue]
    );
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="tw-flex">
                <div className="controls-padding-l tw-flex tw-flex-col">
                    <div className="controls-text-label controls-fontsize-xs controls-text-unaccented">
                        Поле с прозрачным фоном
                    </div>
                    <div className="tw-flex controlsDemo_fixedWidth200 controls-margin_top-m">
                        <Label caption="Метка" />
                        <Text value={value} onValueChanged={valueHandler} />
                    </div>
                </div>
                <div className="controls-background-contrast controls-padding-l controls-margin_left-l tw-flex tw-flex-col">
                    <div className="controls-text-label controls-fontsize-xs controls-text-unaccented">
                        Поле с контрастным фоном
                    </div>
                    <div className="tw-flex controlsDemo_fixedWidth200 controls-margin_top-m">
                        <Label caption="Метка" />
                        <Text
                            value={value}
                            onValueChanged={valueHandler}
                            contrastBackground={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
