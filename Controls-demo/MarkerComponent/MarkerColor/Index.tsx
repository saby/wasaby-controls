import Component from 'Controls/markerComponent';
import 'css!Controls-demo/MarkerComponent/MarkerColor/Style';
import { forwardRef } from 'react';

export default forwardRef(function Component(props, ref) {
    return (
        <div className={props.className} ref={ref}>
            <div className={'controls-demo_list_markerColor_color_green'}>
                <div>
                    <span>Green marker</span>
                </div>
                <div className={'controls-demo_list_markerColor__div_height'}>
                    <Component markerSize={'image-mt'} />
                </div>
            </div>
            <div className={'controls-demo_list_markerColor_color_blue'}>
                <div>
                    <span>Blue marker</span>
                </div>
                <div className={'controls-demo_list_markerColor__div_height'}>
                    <Component markerSize={'image-mt'} />
                </div>
            </div>
        </div>
    );
});
