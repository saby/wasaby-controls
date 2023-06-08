/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import { wrapLinksInString } from '../resources/linkDecorateUtils';

/**
 *
 * Функция для оборачивания ссылок и адресов электронной почты в тег а.
 * Рассчитан для передачи в опцию tagResolver модуля {@link Controls/markup:Decorator}.
 *
 * @class Controls/_markup/Markup/resolvers/linkWrap
 * @public
 */
export default function linkWrap(
    value: string | unknown[],
    parent: string | unknown[],
    resolverParams: object
) {
    if (typeof value === 'string') {
        return wrapLinksInString(
            value,
            parent,
            resolverParams?.needParseFolderLinks
        );
    }
    return value;
}
