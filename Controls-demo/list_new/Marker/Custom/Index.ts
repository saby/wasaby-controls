import { Control, IControlOptions, TemplateFunction } from 'UI/Base';

import * as Template from 'wml!Controls-demo/list_new/Marker/Custom/Custom';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _markerSizes: object = {
        l: 'image-l',
        mt: 'image-mt',
        m: 'image-m',
        s: 'image-s',
        xl: 'content-xl',
        xs: 'content-xs',
    };

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
