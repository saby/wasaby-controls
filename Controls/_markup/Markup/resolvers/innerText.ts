/**
 * @kaizen_zone 87f8c36a-e8b9-4a3c-9554-83bbc997482a
 */
/**
 *
 * Модуль с функцией получения внутреннего текста из json.
 * Распознаватель тегов для jsonToHtml в {@link Controls/markup:Converter}.
 *
 * @class Controls/_markup/Markup/resolvers/innerText
 * @public
 */

const BLOCK_ELEMENTS = ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/*
 *
 * Module with a function to get inner text from json.
 * Tag resolver for jsonToHtml in {@link Controls/markup/Converter}.
 *
 * @class Controls/_decorator/Markup/resolvers/innerText
 * @public
 * @author Угриновский Н.В.
 */
// eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
const innerText = function innerText(value: string | unknown[], parent?: string | unknown[]) {
    if (typeof value === 'string') {
        return parent ? value : [[], value];
    }
    if (Array.isArray(value)) {
        let newValue: string | any[] = '';
        if (Array.isArray(value[0])) {
            newValue = innerText(value[0], value);
        }
        for (let i = 1; i < value.length; ++i) {
            newValue += innerText(value[i], value);
        }
        if (BLOCK_ELEMENTS.includes(value[0])) {
            newValue += '\n';
        }
        return parent ? newValue : [[], newValue];
    }
    return '';
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
innerText.__noNeedEscapeString = true;

export default innerText;
