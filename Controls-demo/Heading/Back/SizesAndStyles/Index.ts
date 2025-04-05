import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Heading/Back/SizesAndStyles/SizesAndStyles');
import 'css!Controls-demo/Heading/Back/SizesAndStyles/Index';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _cfgSource: object[] = [
        {
            fontSize: 'xs',
            fontColorStyle: 'readonly',
            iconStyle: 'readonly',
        },
        {
            fontSize: 's',
            fontColorStyle: 'secondary',
            iconStyle: 'primary',
        },
        {
            fontSize: 'm',
            fontColorStyle: 'link',
            iconStyle: 'default',
        },
        {
            fontSize: 'l',
            fontColorStyle: 'default',
            iconStyle: 'link',
        },
        {
            fontSize: 'xl',
            fontColorStyle: 'primary',
            iconStyle: 'secondary',
        },
        {
            fontSize: '2xl',
            fontColorStyle: 'label',
            iconStyle: 'label',
        },
        {
            fontSize: '3xl',
            fontColorStyle: 'danger',
            iconStyle: 'danger',
        },
        {
            fontSize: '4xl',
            fontColorStyle: 'success',
            iconStyle: 'success',
        },
        {
            fontSize: '5xl',
            fontColorStyle: 'warning',
            iconStyle: 'warning',
        },
        {
            fontSize: '6xl',
            fontColorStyle: 'unaccented',
            iconStyle: 'unaccented',
        },
        {
            fontSize: '7xl',
            fontColorStyle: 'info',
            iconStyle: 'info',
        },
    ];
}
export default ViewModes;
