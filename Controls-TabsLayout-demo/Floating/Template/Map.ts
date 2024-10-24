import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/Floating/Template/Map';
import { getResourceUrl } from 'RequireJsLoader/conduct';
import { constants } from 'Env/Env';

const bgImage = getResourceUrl(
    `${constants.resourceRoot}Controls-TabsLayout-demo/Floating/Image/mapStack.png`
);

export default class FloatingTabsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _bgImage: string = bgImage;
}
