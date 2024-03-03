import {Model} from 'Types/entity';

export const getColor = (item: Model) => {
    return item.get('value').color.indexOf('--') !== -1 ? 'var(' + item.get('value').color + ')' :
        item.get('value').color;
};

export const getStyleClasses = ({b, u, i, s}) => {
    return (
        'Colormark__List_styleSettings_style_' + (b ? 'bold' : '') +
        ' Colormark__List_styleSettings_style_' + (u ? 'underline' : '') +
        ' Colormark__List_styleSettings_style_' + (i ? 'italic' : '') +
        ' Colormark__List_styleSettings_style_' + (s ? 'stroked' : '')
    );
};

export const isElementContainsFieldOnArr = (field, arr) => {
    return arr.some((item) => item[field]);
};
