/**
 * Библиотека компонента markup.
 * @library
 * @public
 */

export { default as Decorator } from './_markup/Decorator';

export { default as InnerText } from './_markup/Markup/resolvers/innerText';
export { default as _highlightResolver } from './_markup/Markup/resolvers/highlight';
export { default as noOuterTag } from './_markup/Markup/resolvers/noOuterTag';
export { default as linkDecorate } from './_markup/Markup/resolvers/linkDecorate';
export { default as linkWrapResolver } from './_markup/Markup/resolvers/linkWrap';

import * as Converter from './_markup/Markup/Converter';
import {
    getLinks,
    parseLinks,
    linkParseRegExp,
    parseFolderLinks,
    needDecorate,
    clearNeedDecorateGlobals,
} from './_markup/Markup/resources/linkDecorateUtils';

export {
    Converter,
    getLinks,
    parseLinks,
    linkParseRegExp,
    parseFolderLinks,
    needDecorate,
    clearNeedDecorateGlobals,
};
