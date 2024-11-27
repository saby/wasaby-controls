/**
 * @kaizen_zone f4aee25a-8072-469d-b51f-fa0b1c29931d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplateStrategy/Notification/Template/NotificationContent/NotificationContent';

export default class NotificationContent extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
