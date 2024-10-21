import { forwardRef } from 'react';
import { Label } from 'Controls/input';

export default forwardRef(function RequiredDoc(_, ref) {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="controlsDemo__cell">
                <Label caption="Label" required={true} />
            </div>
        </div>
    );
});
