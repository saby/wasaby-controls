import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/ReportDialog/OperationsSuccess/OperationsSuccess';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
