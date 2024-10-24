/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IHrefOptions {
    href?: string;
}
/**
 * Интерфейс для контролов, которые могут работать в режиме гиперссылки.
 *
 * @public
 */
export default interface IHref {
    readonly '[Controls/_interface/IHref]': boolean;
}
/**
 * @name Controls/_interface/IHref#href
 * @cfg {String} Адрес документа, на который следует перейти.
 * @default undefined
 * @remark При задании этой опции контрол начинает работать как гиперссылка. Если необходимо открыть вложенный документ на новой вкладке, используйте attr:target="_blank".
 * @demo Controls-demo/Input/Label/Href/Index
 * @demo Controls-demo/Buttons/Href/Index
 */
