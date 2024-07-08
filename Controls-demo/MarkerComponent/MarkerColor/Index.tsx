import Component from 'Controls/markerComponent';
import 'css!Controls-demo/MarkerComponent/MarkerColor/Style';
import * as React from 'react';

export default function MarkerColor() {
    return (
        <div>
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
}
