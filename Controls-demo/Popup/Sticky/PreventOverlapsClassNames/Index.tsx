import { Button } from 'Controls/buttons';
import { StickyOpener } from 'Controls/popup';
import { forwardRef, useEffect, useRef, useCallback, useState } from 'react';
import 'css!Controls-demo/Popup/Sticky/PreventOverlapsClassNames/PreventOverlapsClassNames';
import { Checkbox } from 'Controls/checkbox';

function PreventOverlapsClassNames(props, ref) {
    const stickyOpener = useRef();
    const targetRef1 = useRef();
    const targetRef2 = useRef();

    const [enablePreventOverlapsClassNames, setEnablePreventOverlapsClassNames] = useState(true);

    useEffect(() => {
        stickyOpener.current = new StickyOpener();
    }, []);

    const onClick = useCallback(
        (target) => {
            const config = {
                actionOnScroll: 'track',
                template: 'Controls-demo/Popup/Sticky/StickyTemplate',
                target,
            };
            if (enablePreventOverlapsClassNames) {
                config.preventOverlapsClassNames = [
                    'controlsDemo-Sticky__preventOverlapsClassName',
                ];
            }
            stickyOpener.current.open(config);
        },
        [enablePreventOverlapsClassNames]
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flex">
            <div>
                <Button
                    caption="Открыть стики окно"
                    ref={targetRef1}
                    onClick={() => {
                        onClick(targetRef1.current);
                    }}
                    className="controlsDemo-Sticky__button controlsDemo-Sticky__button1"
                />
                <Button
                    caption="Открыть стики окно"
                    ref={targetRef2}
                    onClick={() => {
                        onClick(targetRef2.current);
                    }}
                    className="controlsDemo-Sticky__button controlsDemo-Sticky__button2"
                />
            </div>
            <Checkbox
                value={enablePreventOverlapsClassNames}
                caption="Включить опцию preventOverlapsClassNames"
                onValueChanged={setEnablePreventOverlapsClassNames}
                customEvents={['onValueChanged']}
            />
            <div className="controlsDemo-Sticky__preventOverlapsClassName">
                Ограниченная от пересечения область
            </div>
        </div>
    );
}

export default forwardRef(PreventOverlapsClassNames);
