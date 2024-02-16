import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/HeaderContentTemplate/PopupTemplate/PopupTemplate');
import { RecordSet } from 'Types/collection';

class PopupTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _toolbarItems: RecordSet = new RecordSet({
        rawData: [
            {
                id: 'delete',
                title: 'Удалить',
                icon: 'icon-Erase',
                showType: 0,
                viewMode: 'ghost',
            },
            {
                id: 'rubles',
                title: 'Оплатить',
                icon: 'icon-Ruble',
                showType: 0,
                viewMode: 'ghost',
            },
            {
                id: 'expand',
                title: 'История',
                icon: 'icon-ExpandList',
                showType: 0,
                viewMode: 'ghost',
            },
            {
                id: 'apply',
                title: 'Подтвердить',
                icon: 'icon-Yes',
                showType: 0,
                iconStyle: 'success',
                viewMode: 'filled',
            },
        ],
    });
}
export default PopupTemplate;
