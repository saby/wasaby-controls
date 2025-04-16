import { forwardRef } from 'react';
import { Area } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className + ' controlsDemo__wrapper controlsDemo__flex ws-justify-content-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__flex ws-flex-column ws-align-items-center controlsDemo__mr3">
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        borderVisibility="partial"
                        placeholder="borderVisibility=partial"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        borderVisibility="bottom"
                        placeholder="borderVisibility=bottom"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        borderVisibility="hidden"
                        placeholder="borderVisibility=hidden"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
            </div>
            <div className="controlsDemo__flex ws-flex-column ws-align-items-center">
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        readOnly={true}
                        borderVisibility="partial"
                        placeholder="borderVisibility=partial"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        readOnly={true}
                        borderVisibility="bottom"
                        placeholder="borderVisibility=bottom"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
                <div className="controlsDemo__cell">
                    <Area
                        className="controlsDemo_fixedWidth300"
                        readOnly={true}
                        borderVisibility="hidden"
                        placeholder="borderVisibility=hidden"
                        minLines={4}
                        maxLines={4}
                    />
                </div>
            </div>
        </div>
    );
});
