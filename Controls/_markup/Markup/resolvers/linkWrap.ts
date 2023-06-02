/**
 * @kaizen_zone 87f8c36a-e8b9-4a3c-9554-83bbc997482a
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
