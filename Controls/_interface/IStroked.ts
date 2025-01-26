/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */

export interface IStrokedOptions {
    stroked?: boolean;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку перечеркнутости.
 * @public
 */
interface IStroked {
    readonly '[Controls/_interface/IStroked]': boolean;
}

export default IStroked;

/**
 * @name Controls/_interface/IStroked#stroked
 * @cfg {Boolean} Определяет, должно ли число быть перечеркнутым.
 * @default false
 * @demo Controls-demo/Decorator/Number/Stroked/Index
 * @remark
 * * true - перечеркнуть число.
 * * false - не перечеркивать число.
 */
