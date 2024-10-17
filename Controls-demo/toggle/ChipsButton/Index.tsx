import * as React from 'react';
import { Button } from 'Controls/Chips';

export default React.forwardRef(function ChipsButton(_, ref) {
    const [value, setValue] = React.useState<boolean>(false);

    return (
        <div className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center">
            <div
                className="controlsDemo__flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <Button
                    ref={ref}
                    caption="Chips Button"
                    value={value}
                    onValueChanged={() => {
                        setValue(!value);
                    }}
                />
            </div>
        </div>
    );
});
