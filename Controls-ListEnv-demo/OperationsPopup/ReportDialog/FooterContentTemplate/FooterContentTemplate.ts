import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/OperationsPopup/ReportDialog/FooterContentTemplate/FooterContentTemplate';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static _styles: string[] = ['Controls-ListEnv-demo/OperationsPopup/ReportDialog/Index'];
}
