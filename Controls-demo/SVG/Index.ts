import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/SVG/SVG';
import {getResourceUrl} from 'RequireJsLoader/conduct';
import { constants } from 'Env/Env';

export default class extends Control {
    protected _template: TemplateFunction = template;

    private _circleUrl: string = getResourceUrl(
        `${constants.resourceRoot}Controls-demo/SVG/example.svg#circle`
    );
}
