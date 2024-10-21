import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Controller as ManagerController } from 'Controls/popup';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Stack/CloseButtonViewMode/CloseButtonViewMode');
import 'css!Controls-demo/PopupTemplate/Stack/CloseButtonViewMode/CloseButtonViewMode';

class HeaderBorderVisible extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _beforeMount(): void {
        // Отключаем правую панель, чтобы показать все виды крестика закрытия
        ManagerController.setRightPanelBottomTemplate(null);
    }
}
export default HeaderBorderVisible;
