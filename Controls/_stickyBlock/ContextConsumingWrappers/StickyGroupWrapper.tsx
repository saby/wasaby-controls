/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import * as Ctx from 'Controls/_stickyBlock/StickyContextReact';
import { delimitProps } from 'UICore/Jsx';
import StickyGroup from 'Controls/_stickyBlock/StickyGroup';

/**
 * Позволяет комбинировать липкие заголовки с одинаковым поведением.
 * @remark
 * Используется, как правило, для реализации прилипающих шапок в гридах или для организации горизонтального прилипания блоков.
 * @class Controls/_stickyBlock/StickyGroup
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/Scroll/StickyGroupReact/Default/Index
 */

function StickyGroupWrapper({ offsetTop = 0, ...props }, ref) {
    const stickyContext = React.useContext(Ctx.StickyContext);
    const groupContext = React.useContext(Ctx.StickyGroupContext);

    const [stickyId, setStickyId] = React.useState('');

    const setStickyIdCallback = React.useCallback((id) => {
        setStickyId(id);
    }, []);

    const { clearProps, userAttrs } = delimitProps(props);

    return (
        <StickyGroup
            children={props.children}
            shadowVisibility={props.shadowVisibility}
            offsetTop={offsetTop}
            mode={clearProps.mode}
            position={clearProps.position}
            stickyModel={stickyContext.models && stickyContext.models[stickyId]}
            scrollState={groupContext.scrollState}
            content={props.content}
            onFixed={props.onFixed}
            fixedPositionInitial={props.fixedPositionInitial}
            ref={ref}
            attrs={userAttrs}
            registerCallback={groupContext.registerCallback}
            addedBlockInGroupCallback={groupContext.addedBlockInGroupCallback}
            removedBlockInGroupCallback={groupContext.removedBlockInGroupCallback}
            unregisterCallback={groupContext.unregisterCallback}
            modeChangedCallback={groupContext.modeChangedCallback}
            offsetChangedCallback={groupContext.offsetChangedCallback}
            groupSizeChangedCallback={groupContext.groupSizeChangedCallback}
            groupChangeFixedPositionCallback={groupContext.groupChangeFixedPositionCallback}
            setStickyGroupId={setStickyIdCallback}
        />
    );
}

export default React.forwardRef(StickyGroupWrapper);

/**
 * @name Controls/_stickyBlock/StickyGroup#mode
 * @cfg {String} Режим прилипания заголовка.
 * @variant replaceable Заменяемый заголовок. Следующий заголовок заменяет текущий.
 * @variant stackable Составной заголовок. Следующий заголовок прилипает к нижней части текущего.
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#shadowVisibility
 * @cfg {String} Устанавливает видимость горизонтальных теней.
 * @variant visible Показать тень.
 * @variant hidden Не показывать.
 * @default visible
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#subPixelArtifactFix
 * @cfg {boolean} Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками.
 * @default false
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#pixelRatioBugFix
 * @cfg {boolean} Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safari.
 * @default true
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#position
 * @cfg {string} Определяет позицию прилипания.
 * @variant 'top' - блок будет прилипать сверху
 * @variant 'bottom' - блок будет прилипать снизу
 * @variant 'topBottom' - блок будет прилипать и сверху, и снизу
 * @example
 * <pre class="brush: html">
 *     <Controls.stickyBlock:StickyGroup position='top'>
 *         <Controls.stickyBlock:StickyGroupedBlock position="left">
 *             <div> Блок будет прилипать слева и сверху </div>
 *         </Controls.stickyBlock:StickyBlock/>
 *     </Controls.stickyBlock:StickyGroup>
 * </pre>
 *
 * <pre class="brush: html">
 *     <Controls.stickyBlock:StickyGroup>
 *         <Controls.stickyBlock:StickyGroupedBlock position="left">
 *             <div> Блок будет прилипать слева </div>
 *         </Controls.stickyBlock:StickyBlock/>
 *     </Controls.stickyBlock:StickyGroup>
 * </pre>
 * @default undefined
 * @demo Controls-demo/Scroll/StickyGroup/Position/Index
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#fixedBackgroundStyle
 * @cfg {String} Определяет постфикс стиля для настройки фона контрола, когда он зафиксирован
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#fixedZIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он зафиксирован
 * @default 2
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#zIndex
 * @cfg {Number} Определяет значение z-index на заголовке, когда он не зафиксирован
 * @default 1
 */

/**
 * @name Controls/_stickyBlock/StickyGroup#offsetTop
 * @cfg {Number} Определяет смещение позиции прилипания вниз относительно позиции прилипания по умолчанию
 * @default 0
 */
