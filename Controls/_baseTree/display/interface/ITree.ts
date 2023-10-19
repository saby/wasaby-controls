/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */

// добавить вариант 'never', когда потребуется сделать разворот узлов без загрузки
/**
 * Режим загрузки дочерних элементов при развороте узла
 * @typedef {String} Controls/_baseTree/display/interface/ITree/TChildrenLoadMode
 * @variant once Загрузка дочерних элементов происходит только при первом развороте узла
 * @variant always Загрузка дочерних элементов происходит при каждом развороте узла
 */
export type TChildrenLoadMode = 'once' | 'always';
