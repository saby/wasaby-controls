/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_searchDeprecated/Input/WrappedContainer';

export default class WrappedContainer extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
