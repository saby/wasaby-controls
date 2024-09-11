/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */

// добавить вариант 'never', когда потребуется сделать разворот узлов без загрузки
/**
 * Режим загрузки дочерних элементов при развороте узла
 * @typedef {String} Controls/_baseTree/display/interface/ITree/TChildrenLoadMode
 * @variant once Загрузка дочерних элементов происходит только при первом развороте узла
 * @variant always Загрузка дочерних элементов происходит при каждом развороте узла
 */
export type TChildrenLoadMode = 'once' | 'always';
