/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls/_stickyBlock/WasabyWrappers/StickyGroupedBlockWasaby/StickyGroupedBlockWasaby');
import { IFixedEventData } from 'Controls/_stickyBlock/types';
import { IStickyGroupedBlock } from '../interfaces/IStickyBlock';

type TStickyGroupedBlockWasabyOptions = IControlOptions &
    IStickyGroupedBlock & {
        attrs?: Record<string, unknown>;
    };

/**
 * Обеспечивает прилипание контента к краю родительского контейнера в StickyGroup при прокрутке.
 * В зависимости от конфигурации, прилипание происходит в момент пересечения левой или правой части контента и родительского контейнера.
 * @remark
 * Используется внутри StickyGroup.
 * Фиксация заголовка в IE и Edge версии ниже 16 не поддерживается.
 * @class Controls/_stickyBlock/StickyGroupedBlock
 * @public
 * @extends UI/Base:Control
 * @demo Controls-demo/Scroll/StickyGroupReact/Default/Index
 */

export default class StickyGroupedBlockWasaby extends Control<TStickyGroupedBlockWasabyOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _onFixedCallback: Function = this._onFixed.bind(this);

    protected _onFixed(data: IFixedEventData): void {
        this._notify('fixed', [data, true], { bubbling: true });
    }
}

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#mode
 * @cfg {String} Режим прилипания заголовка.
 * @variant replaceable Заменяемый заголовок. Следующий заголовок заменяет текущий.
 * @variant stackable Составной заголовок. Следующий заголовок прилипает к нижней части текущего.
 * @variant dynamic Динамический заголовок. При скролле вниз заголовок скрывается, а при скролле вверх появляется.
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#shadowVisibility
 * @cfg {String} Устанавливает видимость вертикальных теней.
 * @variant visible Показать тень.
 * @variant hidden Не показывать.
 * @default visible
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#subPixelArtifactFix
 * @cfg {boolean} Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками.
 * @default false
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#pixelRatioBugFix
 * @cfg {boolean} Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safari.
 * @default true
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#position
 * @cfg {string} Определяет позицию прилипания.
 * @variant 'left' - блок будет прилипать сверху
 * @variant 'right' - блок будет прилипать снизу
 * @variant 'leftRight' - блок будет прилипать и слева, и справа
 * @example
 * <pre class="brush: html">
 *     <Controls.stickyBlock:StickyGroup>
 *         <Controls.stickyBlock:StickyGroupedBlock position="left">
 *             <div> Блок будет прилипать слева </div>
 *         </Controls.stickyBlock:StickyBlock/>
 *     </Controls.stickyBlock:StickyGroup>
 * </pre>
 *
 * <pre class="brush: html">
 *     <Controls.stickyBlock:StickyGroup position='top'>
 *         <Controls.stickyBlock:StickyGroupedBlock position="left">
 *             <div> Блок будет прилипать слева и сверху </div>
 *         </Controls.stickyBlock:StickyBlock/>
 *     </Controls.stickyBlock:StickyGroup>
 * </pre>
 * @default undefined
 * @demo Controls-demo/Scroll/StickyGroup/Position/Index
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#fixedBackgroundStyle
 * @cfg {String} Определяет постфикс стиля для настройки фона контрола, когда он зафиксирован
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#fixedZIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он зафиксирован
 * @default 2
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#zIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он не зафиксирован
 * @default 1
 */

/**
 * @name Controls/_stickyBlock/StickyGroupedBlock#offsetLeft
 * @cfg {Number} Определяет смещение позиции прилипания слева относительно позиции прилипания по умолчанию
 * @default 0
 */

/**
 * @event fixed Происходит при изменении состояния фиксации.
 * @name Controls/_stickyBlock/StickyGroupedBlock#fixed
 * @param {UI/Events:SyntheticEvent} event Дескриптор события.
 * @param {Controls/stickyBlock:IFixedEventData} information Информация о событии фиксации.
 * @remark Всплытие данного события нельзя останавливать.
 */
