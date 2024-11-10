import StickyTemplate, { IStickyTemplateOptions } from './Sticky';
import { useContext, forwardRef, useCallback, ForwardedRef } from 'react';
import { useAdaptiveMode } from 'UI/Adaptive';
import { Context } from 'Controls/popup';
import { checkWasabyEvent } from 'UI/Events';

// Есть много мест, где прикладники завязались на on:close и стопают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст

/**
 * Базовый шаблон для {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ прилипающих блоков}.
 * Имеет три контентные опции - для шапки, контента и подвала, а так же крестик закрытия, соответствующие стандарту выпадающих списков.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
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
            }, [])}
        />
    );
}

export default forwardRef(Sticky);
