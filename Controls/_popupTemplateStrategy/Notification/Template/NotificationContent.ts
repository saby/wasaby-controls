/**
 * @kaizen_zone c7f0da9e-2888-4829-ad87-bd0d8c22d857
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplateStrategy/Notification/Template/NotificationContent/NotificationContent';

export default class NotificationContent extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
