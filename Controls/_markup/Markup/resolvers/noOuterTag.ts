/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
/**
 *
 * Модуль с функцией получения html без внешнего тега.
 * Распознаватель тегов для jsonToHtml в {@link Controls/markup:Converter}.
 * @remark Подробнее о формате JsonML читайте {@link /doc/platform/developmentapl/service-development/service-contract/logic/json-markup-language/ здесь}.
 *
 * @class Controls/_markup/Markup/resolvers/noOuterTag
 * @public
 */

/*
 *
 * Module with a function to get html without outer tag.
 * Tag resolver for jsonToHtml in {@link Controls/markup:Converter}.
 *
 * @class Controls/_markup/Markup/resolvers/noOuterTag
 * @public
 * @author Угриновский Н.В.
 */
export default function noOuterTag(
    value: string | unknown[],
    parent?: string | unknown[]
) {
    if (!parent && value[0] === 'div') {
        value[0] = [];
    }
    return value;
}
