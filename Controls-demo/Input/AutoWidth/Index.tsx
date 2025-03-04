import { forwardRef, LegacyRef, CSSProperties } from 'react';
import { Text, Number } from 'Controls/input';

const STYLE: CSSProperties = {
    minWidth: '3ch',
    maxWidth: '20ch',
};

export default forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-xs">
                        Поля ввода с авто шириной
                    </div>
                    <div className="controlsDemo__cell controls-padding_left-m">
                        <Text style={STYLE} autoWidth={true} />
                    </div>
                    <div className="controlsDemo__cell controls-padding-m">
                        <Number style={STYLE} autoWidth={true} />
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
