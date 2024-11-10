/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IViewOptions } from '../interface/IViewOptions';
import VIEW_PROPS from './ViewProps';

type TViewOptions = keyof IViewOptions;

/**
 * Опции View, которые НЕ пробрасываются от контекста.
 *
 * FIXME: Такого быть не должно, это ошибочное legacy.
 */
const NON_CONSUMING_PROPS: TViewOptions[] = [
    'selectFields',
    'selectionType',
    'nodeHistoryId',
    'nodeHistoryType',
    'groupHistoryId',
    'deepReload',
    'singleExpand',
];

/**
 * Дополнительные значения, которые пробрасываются от контекста во View.
 *
 * FIXME: Такого быть не должно, это ошибочное legacy. supportSelection вообще фантом непонятно откуда.
 */
const EXTRA_PROPS: TViewOptions[] = ['keyProperty', 'searchNavigationMode', 'supportSelection'];

/**
 * Значения, которые пробрасываются от контекста во View.
 *
 * TODO: Не должно быть фильтрации. Не должно быть обогащения.
 *  Это показывает расхождения интерфейсов View и коннектора.
 */
const CONSUMING_PROPS: TViewOptions[] = VIEW_PROPS.filter(
    (o) => NON_CONSUMING_PROPS.indexOf(o) === -1
).concat(EXTRA_PROPS);

export default CONSUMING_PROPS;
