import { useState, forwardRef } from 'react';
import { Area } from 'Controls/input';
import { Button } from 'Controls/buttons';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('text');
    const [value1, setValue1] = useState('text');
    const [value2, setValue2] = useState('message');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">default</div>
                <Area
                    className="controlsDemo_fixedWidth300"
                    value={value}
                    onValueChanged={setValue}
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">minLines=2, maxLines=3</div>
                <Area
                    className="controlsDemo_fixedWidth300"
                    value={value1}
                    onValueChanged={setValue1}
                    minLines={2}
                    maxLines={3}
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">footerTemplate</div>
                <Area
                    className="controlsDemo_fixedWidth300"
                    value={value2}
                    onValueChanged={setValue2}
                    maxLines={3}
                    horizontalPadding="null"
                    footerTemplate={
                        <Button
                            caption="Прикрепить"
                            viewMode="link"
                            icon="icon-TFAttach"
                            iconSize="s"
                            iconStyle="secondary"
                        />
                    }
                />
            </div>
        </div>
    );
});
