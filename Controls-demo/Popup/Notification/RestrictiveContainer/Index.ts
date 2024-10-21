import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Notification/RestrictiveContainer/Index';
import { NotificationOpener } from 'Controls/popup';
import 'css!Controls-demo/Popup/Notification/RestrictiveContainer/Index';

export default class RestrictiveContainerNotification extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _openRestrictiveContainerNotification(): void {
        new NotificationOpener({
            template: 'Controls/popupTemplate:NotificationSimple',
            templateOptions: {
                text: 'Окно с restrictiveContainer',
            },
        }).open({});
    }
}
