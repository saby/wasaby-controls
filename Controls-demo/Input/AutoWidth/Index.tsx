import { forwardRef, LegacyRef } from 'react';
import { Text, Number } from 'Controls/input';
import 'css!Controls-demo/Input/AutoWidth/Style';

export default forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div
                className="controlsDemo__wrapper controlsDemo__flex"
                data-qa={'controlsDemo_capture'}
            >
                <div className="controlsDemo__cell ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поля ввода с авто шириной
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Text
                            className={'controlsDemo__input-size'}
                            autoWidth={true}
                            data-qa={'Controls-demo_Input_AutoWidth__text'}
                        />
                    </div>
                    <div className="controlsDemo__cell controls-padding-m">
                        <Number
                            className={'controlsDemo__input-size'}
                            autoWidth={true}
                            data-qa={'Controls-demo_Input_AutoWidth__number'}
                        />
                    </div>
                </div>
                <div className="controlsDemo__cell ws-flex-column controls-padding_left-m">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поле ввода без авто ширины
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Text />
                    </div>
                    <div className="controlsDemo__cell controls-padding-m">
                        <Number />
                    </div>
                </div>
            </div>
        </div>
    );
});
