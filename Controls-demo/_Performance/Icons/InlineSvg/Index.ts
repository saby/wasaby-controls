import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls-demo/_Performance/Icons/InlineSvg/template';
import {getData} from '../Data';
import {Memory} from 'Types/source';
import 'css!Controls/CommonClasses';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _source: Memory = new Memory({
        keyProperty: 'id',
        data: getData()
    });
}
