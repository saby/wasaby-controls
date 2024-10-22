import { IBasePopupOptions, DialogOpener, IConfirmationOptions } from 'Controls/popup';

const BUTTON_SELECTOR = '.controls-BaseButton';

type TModifiedTarget =
    | (Partial<HTMLElement> & {
          left?: number;
          top?: number;
          width?: number;
          height?: number;
          x?: number;
          y?: number;
      })
    | null;

/**
 * Позволяет получить конфиг с координатой left или right для диалогового окна.
 * При right также добавляет направление открытия.
 * @param originalTarget
 * @param datasetKey
 */
export function getTargetCoordinates(
    originalTarget?: HTMLElement,
    datasetKey?: 'rowRect' | 'popupRect'
): {
    left?: number;
    top?: number;
} {
    if (!originalTarget) {
        return {};
    }
    // При работе Actions на чистых слайсах в target может попадать событие
    const target: TModifiedTarget = (originalTarget as unknown as MouseEvent).target
        ? (originalTarget as unknown as MouseEvent).target
        : originalTarget;
    let result: {
        left?: number;
        top?: number;
    } = {};
    let domRect: TModifiedTarget | DOMRect | undefined;
    // Координаты могут быть преданы как json в rowRect или popupRect
    // Это сделано, потому что доступ к координатам меню есть только на момент вызова меню.
    // В момент выполнения действия по кнопке меню уже закрыто.
    // Если координаты нужно брать относительно окна, то верхний левый угол окна будет совпадать с меню.
    if (datasetKey === 'popupRect' && target?.dataset?.[datasetKey]) {
        domRect = JSON.parse(target.dataset[datasetKey] as string) as unknown as DOMRect;
        if (domRect?.left !== undefined && domRect.top !== undefined) {
            // Если меню было открыто очень близко к нижней границе окна,
            // то мы открываем его в позиции 350px от нижней границы окна.
            const bottomOfWindow = window?.innerHeight ? window.innerHeight : 0;
            // Значение выбрано совместно с проектированием.
            const offset = 350;
            result = {
                top: Math.min(domRect.top, Math.max(bottomOfWindow - offset, 0)),
                left: domRect.left,
            };
        }
    } else {
        // Если координаты нужно брать относительно строки меню,
        // то левая граница окна будет справа от правой границы вызывающего элемента с отступом 12px,
        // а вертикально окно будет выровнено по центру экрана.
        if (datasetKey === 'rowRect' && target?.dataset?.[datasetKey]) {
            domRect = JSON.parse(target.dataset[datasetKey] as string) as unknown as DOMRect;
        } else {
            // То же самое происходит, если не указан datasetKey или отсутствует dataset.
            // например, окно открыто не из меню, а по кнопке.
            domRect = target?.left
                ? target
                : target?.closest?.(BUTTON_SELECTOR)?.getBoundingClientRect();
        }
        if (domRect?.left !== undefined && domRect.width !== undefined) {
            // Смещение относительно кнопки
            const offset = 12;
            // справа от кнопки с отступом 12 px
            result = {
                left: domRect.left + domRect.width + offset,
            };
        }
    }
    return result;
}

interface IOpenConfirmationDialogParams extends IBasePopupOptions<IConfirmationOptions> {
    target?: HTMLElement;
}

/**
 * Открывает диалог подтверждения, который горизонтально выравнивается относительно
 * вызывающего элемента (target), а вертикально по центру экрана.
 * @param config
 */
export function openConfirmationDialog(config: IOpenConfirmationDialogParams): Promise<boolean> {
    const templateOptions = { ...config.templateOptions };
    return new Promise((resolve, reject) => {
        templateOptions.closeHandler = (result: boolean | undefined) => {
            if (typeof result === 'boolean') {
                if (result) {
                    return resolve(result);
                }
                return reject();
            }
        };
        new DialogOpener().open({
            ...getTargetCoordinates(config.target, 'rowRect'),
            opener: config?.opener,
            templateOptions,
            template: 'Controls/popupTemplate:ConfirmationDialog',
            topPopup: true,
            modal: true,
            autofocus: true,
            className: 'controls-Confirmation_popup',
            allowAdaptive: false,
        });
    });
}
