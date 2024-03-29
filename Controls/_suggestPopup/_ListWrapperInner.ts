/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import * as template from 'wml!Controls/_suggestPopup/_ListWrapperInner';
import 'Controls/Container/Async';
import { IControlOptions, Control, TemplateFunction } from 'UI/Base';
import 'css!Controls/suggestPopup';
import 'css!Controls/suggest';

export default class ListWrapperInner extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
