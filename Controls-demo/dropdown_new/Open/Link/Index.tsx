import * as React from 'react';
import For from '../For';
import 'css!Controls-demo/dropdown_new/Open/Index';

export default React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <h3 className="controls-text-label tw-flex tw-justify-center">Link Button</h3>
            <For viewMode="link" />
        </div>
    );
});
