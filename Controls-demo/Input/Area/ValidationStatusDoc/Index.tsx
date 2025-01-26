import { forwardRef } from 'react';
import { Area } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-justify-content-center ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__flex ws-flex-column controls-padding-m">
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">
                        Валидное состояние
                    </div>
                    <Area
                        className="controlsDemo__input"
                        validationStatus="valid"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">
                        Невалидное состояние
                    </div>
                    <Area
                        className="controlsDemo__input"
                        validationStatus="invalid"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">
                        Невалидное состояние в фокусе
                    </div>
                    <Area
                        className="controlsDemo__input"
                        validationStatus="invalidAccent"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
            </div>
            <div className="controlsDemo__flex ws-flex-column controls-background-unaccented-same controls-padding-m">
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">&nbsp;</div>
                    <Area
                        className="controlsDemo__input"
                        contrastBackground={true}
                        validationStatus="valid"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">&nbsp;</div>
                    <Area
                        className="controlsDemo__input"
                        contrastBackground={true}
                        validationStatus="invalid"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column">
                    <div className="controls-text-label controls-margin_bottom-s">&nbsp;</div>
                    <Area
                        className="controlsDemo__input"
                        contrastBackground={true}
                        validationStatus="invalidAccent"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
            </div>
        </div>
    );
});
