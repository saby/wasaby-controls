import { forwardRef } from 'react';
import { AddButton } from 'Controls/list';

export default forwardRef(function Index(_, ref) {
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
            ref={ref}
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <AddButton caption="Добавить запись" />
            </div>
        </div>
    );
});
