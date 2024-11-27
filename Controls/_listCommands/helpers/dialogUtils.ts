import {
    IBasePopupOptions,
    DialogOpener,
    IConfirmationOptions,
    IResizeDirection,
} from 'Controls/popup';

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

interface ITargetCoordinates {
    resizeDirection?: IResizeDirection;
    right?: number;
    left?: number;
    top?: number;
}

/**
 * Позволяет получить конфиг с координатой left или right для диалогового окна.
 * При right также добавляет направление открытия.
 * @param originalTarget Элемент, координаты или data аттрибуты которого будут использоватны для расчёта позиции окна
 * @param datasetKey Ключ, по которому можно получить координаты из data-аттрибута элемента
 * @param allowResizeLeft Разрешить ресайз окна влево (Следует использовать только для confirmation)
 */
export function getTargetCoordinates(
    originalTarget?: HTMLElement,
    datasetKey?: 'rowRect' | 'popupRect',
    allowResizeLeft?: boolean
): ITargetCoordinates {
    if (!originalTarget) {
        return {};
    }
    // При работе Actions на чистых слайсах в target может попадать событие
    const target: TModifiedTarget = (originalTarget as unknown as MouseEvent).target
        ? (originalTarget as unknown as MouseEvent).target
        : originalTarget;
    let result: ITargetCoordinates = {};
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
        // Случай, когда координаты нужно брать относительно строки меню или кнопки.
        // Берём координаты элемента (кнопка или пункт меню), относительно которого будем выравнивать окно.
        if (datasetKey === 'rowRect' && target?.dataset?.[datasetKey]) {
            domRect = JSON.parse(target.dataset[datasetKey] as string) as unknown as DOMRect;
        } else {
            // То же самое происходит, если не указан datasetKey или отсутствует dataset.
            // например, окно открыто не из меню, а по кнопке.
            domRect = target?.left
                ? target
                : target?.closest?.(BUTTON_SELECTOR)?.getBoundingClientRect();
        }
        if (domRect?.left !== undefined) {
            // Центр экрана
            const horizontalCenterOfWindow = window?.innerWidth ? window.innerWidth / 2 : 0;
            // Смещение относительно кнопки
            const offset = 12;
            if (allowResizeLeft && domRect.left > horizontalCenterOfWindow) {
                // Если allowResizeLeft===true (например, диалог подтверждения удаления) и окно открывается справа от центра экрана, то
                // правая граница окна будет слева от левой границы вызывающего элемента с отступом 12px,
                result = {
                    resizeDirection: {
                        horizontal: 'left',
                    },
                    right: window?.innerWidth - domRect.left + offset,
                };
            } else if (domRect.width !== undefined) {
                // Иначе левая граница окна будет справа от правой границы вызывающего элемента с отступом 12px,
                // а вертикально окно будет выровнено по центру экрана.
                result = {
                    left: domRect.left + domRect.width + offset,
                };
            }
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
            ...getTargetCoordinates(config.target, 'rowRect', true),
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
