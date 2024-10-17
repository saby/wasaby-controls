import { forwardRef } from 'react';
import { Label, Text } from 'Controls/input';

export default forwardRef(function FontSizeDoc(_, ref) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__cell ws-flex-column tw-flex controlsDemo_fixedWidth200">
                <Label caption="Метка размера m" fontSize="m" />
                <Text />
            </div>
            <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth200">
                <Label caption="Метка размера xs" fontSize="xs" />
                <Text />
            </div>
        </div>
    );
});
