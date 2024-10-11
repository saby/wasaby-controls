import {Model} from 'Types/entity';

export const getColor = (item: Model) => {
    return item.get('value').color.indexOf('--') !== -1 ? 'var(' + item.get('value').color + ')' :
        item.get('value').color;
};

export const getStyleClasses = ({b, u, i, s}) => {
    const mainClass = 'Colormark__List_styleSettings_style';
    let result = '';
    if (b) {
        result += mainClass + '_bold ';
    }
    if (u) {
        result += mainClass + '_underline ';
    }
    if (i) {
        result += mainClass + '_italic ';
    }
    if (s) {
        result += mainClass + '_stroked';
    }
    return result;
};

export const isElementContainsFieldOnArr = (field, arr) => {
    return arr.some((item) => item[field]);
};
