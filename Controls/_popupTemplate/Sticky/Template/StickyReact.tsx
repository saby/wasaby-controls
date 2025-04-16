/**
 * @kaizen_zone 75e61337-2408-4b9e-b6c7-556929cedca1
 */
import StickyTemplate, { IStickyTemplateOptions } from './Sticky';
import { useContext, forwardRef, useCallback, ForwardedRef } from 'react';
import { useAdaptiveMode } from 'UI/Adaptive';
import { Context } from 'Controls/popup';
import { checkWasabyEvent } from 'UI/Events';

// Есть много мест, где прикладники завязались на on:close и останавливают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст

/**
 * Базовый шаблон для {@link https://n.sbis.ru/article/7c32a8ae-6e9b-4859-b9d3-7e7237663a6e прилипающих окон}.
 * Имеет три контентные опции - для шапки, контента и подвала, а также крестик закрытия, соответствующие стандарту выпадающих списков.
 *
 * @remark
 * Полезные ссылки:
 * <ul>
 *     <li>{@link https://n.sbis.ru/article/7c32a8ae-6e9b-4859-b9d3-7e7237663a6e руководство разработчика}</li>
 *     <li>{@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}</li>
 * </ul>
 * @class Controls/_popupTemplate/Sticky
 *
 * @public
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @implements Controls/popupTemplate:IPopupTemplate
 * @implements Controls/interface:IBorderRadius
 * @implements Controls/popupTemplate:IResize
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/PopupTemplate/Sticky/FooterContentTemplate/Index
 * @demo Controls-demo/PopupTemplate/Sticky/CloseButtonVisible/Index
 * @demo Controls-demo/PopupTemplate/Sticky/HeaderContentTemplate/Index
 */
function Sticky(props: IStickyTemplateOptions, ref: ForwardedRef<HTMLElement>) {
    const context = useContext(Context);
    const adaptiveMode = useAdaptiveMode();
    return (
        <StickyTemplate
            {...props}
            // Защита от того, что кто-то может передать устаревшую опцию customEvents, из-за чего могут не стрелять
            // коллбеки событий
            customEvents={null}
            ref={ref}
            adaptiveMode={adaptiveMode}
            onClose={useCallback(() => {
                if (props.onClose) {
                    if (checkWasabyEvent(props.onClose)) {
                        props.onClose();
                    }
                } else {
                    context?.close();
                }
            }, [props.onClose])}
        />
    );
}

export default forwardRef(Sticky);
