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

// Производит расчёт позиции окна
export function calculateTarget(originalTarget?: HTMLElement): DOMRect | undefined {
    if (!originalTarget) {
        return;
    }
    // При работе Actions на чистых слайсах в target может попадать событие
    const target: TModifiedTarget = (originalTarget as unknown as MouseEvent).target
        ? (originalTarget as unknown as MouseEvent).target
        : originalTarget;
    return (target && target.left
        ? target
        : target?.closest?.(BUTTON_SELECTOR)?.getBoundingClientRect()) as unknown as
        | DOMRect
        | undefined;
}

/**
 * Позволяет получить конфиг с координатой left или right для диалогового окна.
 * При right также добавляет направление открытия.
 * @param originalTarget
 */
export function getDialogCoordinates(originalTarget?: HTMLElement): {
    resizeDirection?: { horizontal: string };
    left?: number;
    right?: number;
} {
    const target = calculateTarget(originalTarget);
    const horizontalCenterOfWindow = window?.innerWidth ? window.innerWidth / 2 : 0;
    const offset = 12;
    if (target?.left !== undefined) {
        if (target.left > horizontalCenterOfWindow) {
            return {
                resizeDirection: {
                    horizontal: 'left',
                },
                right: window?.innerWidth - target.left + offset,
            };
        } else if (target.width !== undefined) {
            return {
                left: target.left + target.width + offset,
            };
        }
    }
    return {};
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
            ...getDialogCoordinates(config.target),
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
