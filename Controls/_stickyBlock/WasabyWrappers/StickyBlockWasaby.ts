/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls/_stickyBlock/WasabyWrappers/StickyBlockWasaby/StickyBlockWasaby');
import { IFixedEventData } from 'Controls/_stickyBlock/types';

/**
 * Обеспечивает прилипание контента к краю родительского контейнера при прокрутке.
 * В зависимости от конфигурации, прилипание происходит в момент пересечения верхней или нижней части контента и родительского контейнера.
 * @remark
 * Фиксация заголовка в IE и Edge версии ниже 16 не поддерживается.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_scroll.less переменные тем оформления}
 *
 * @class Controls/_stickyBlock/StickyBlock
 * @public
 * @extends UI/Base:Control
 *
 * @implements Controls/interface:IBackgroundStyle
 *
 * @demo Controls-demo/Scroll/StickyBlockReact/Default/Index
 */

export default class StickyGroupedBlockWasaby extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _onFixedCallback: Function = this._onFixed.bind(this);

    protected _onFixed(data: IFixedEventData): void {
        this._notify('fixed', [data, true], { bubbling: true });
    }
}

//# region JS DOC
/**
 * @name Controls/_stickyBlock/StickyBlock#subPixelArtifactFix
 * @cfg {boolean} Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками.
 * @default false
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#pixelRatioBugFix
 * @cfg {boolean} Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safary.
 * @default true
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#mode
 * @cfg {String} Режим прилипания заголовка.
 * @variant replaceable Заменяемый заголовок. Следующий заголовок заменяет текущий.
 * @variant stackable Составной заголовок. Следующий заголовок прилипает к нижней части текущего.
 * @variant dynamic Динамический заголовок. При скролле вниз заголовок скрывается, а при скролле вверх появляется.
 * @demo Controls-demo/Scroll/StickyBlock/Mode/Index
 * @demo Controls-demo/StickyBlock/Mode/Index
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#shadowVisibility
 * @cfg {String} Устанавливает видимость тени.
 * @variant visible Показать тень.
 * @variant hidden Не показывать.
 * @default visible
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#position
 * @cfg {string} Определяет позицию прилипания.
 * @variant 'top' - блок будет прилипать сверху
 * @variant 'bottom' - блок будет прилипать снизу
 * @variant 'topBottom' - блок будет прилипать и сверху, и снизу
 * @variant 'left' - блок будет прилипать слева
 * @variant 'right' - блок будет прилипать справа
 * @example
 * <pre class="brush: html">
 *     <Controls.stickyBlock:StickyBlock position="top">
 *         <div> Блок будет прилипать сверху </div>
 *     </Controls.stickyBlock:StickyBlock/>
 * </pre>
 * @default 'top'
 * @demo Controls-demo/Scroll/StickyBlock/Position/Index
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#fixedBackgroundStyle
 * @cfg {String} Определяет постфикс стиля для настройки фона контрола, когда он зафиксирован
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#fixedZIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он зафиксирован
 * @default 2
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#zIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он не зафиксирован
 * @default 1
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#offsetTop
 * @cfg {Number} Определяет смещение позиции прилипания вниз относительно позиции прилипания по умолчанию
 * @default 0
 */

/**
 * @name Controls/_stickyBlock/StickyBlock#shadowMode
 * @cfg {String} Режим отображения тени.
 * @remark {@link Controls/scroll:IShadows#shadowMode Подробнее}
 * @demo Controls-demo/Scroll/StickyBlock/ShadowMode/Rounded/Index
 */

/**
 * @event fixed Происходит при изменении состояния фиксации.
 * @name Controls/_stickyBlock/StickyBlock#fixed
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Controls/stickyBlock:IFixedEventData} information Информация о событии фиксации.
 * @remark Всплытие данного события нельзя останавливать.
 */
//# endregion
