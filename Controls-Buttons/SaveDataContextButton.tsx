import { useSlice } from 'Controls-DataEnv/context';
import { FormSliceActionType, IFormSlice } from 'Controls-DataEnv/dataFactory';
import type { Slice } from 'Controls-DataEnv/slice';
import { Button as WasabyButton, IButtonOptions } from 'Controls/buttons';
import { Logger } from 'UI/Utils';

const DEFAULT_SLICE_NAME = 'FormData';
const DEFAULT_CALLBACK = () => {};

/**
 * Интерфейс для кнопки сохранения контекста
 * @mixes Controls/buttons:IButton
 * @public
 */
export interface ISaveDataContextButtonProps extends IButtonOptions {
    /**
     * Вызывается перед сохранением
     * @param slice 
     * @returns 
     */
    beforeSave: (slice: IFormSlice) => void;
    /**
     * Вызывается после сохранения
     * @param slice 
     * @returns 
     */
    afterSave: (slice: IFormSlice) => void;
    className: string;
}

/**
 * Кнопка сохранения контекста {@link Controls-Buttons/SaveDataContextButton SaveDataContextButton}
 * @deprecated
 * @see Controls-Input/buttonConnected:Button
 */
function SaveDataContextButton(props: ISaveDataContextButtonProps): JSX.Element {
    const slice = useSlice<Slice<IFormSlice>>(DEFAULT_SLICE_NAME);
    const { beforeSave = DEFAULT_CALLBACK, afterSave = DEFAULT_CALLBACK, className = '' } = props;

    const onClick = async () => {
        if (slice) {
            await slice.validateAll();
            const beforeResult = beforeSave(slice);
            if (!!beforeResult) {
                return Logger.warn(
                    `Controls-Buttons/SaveDataContextButton: Сохранение контекста заблокировано в beforeSave: ${beforeResult}`
                );
            }

            if (slice.isValid()) {
                slice
                    ?.update?.(FormSliceActionType.Save)
                    .then(() => {
                        afterSave(slice);
                    })
                    .catch((error) => {
                        return Logger.warn(
                            `Controls-Buttons/SaveDataContextButton: не удалось сохранить контекст: ${error}`
                        );
                    });
            }
        }
    };

    return (
        <WasabyButton {...props} onClick={onClick} className={`controls-max-w-full ${className}`} />
    );
}

SaveDataContextButton.defaultProps = {
    viewMode: 'outlined',
    buttonStyle: 'primary',
    color: 'primary',
    inlineHeight: 'm',
    iconSize: 's',
    fontSize: 'm',
    caption: 'Отправить ответ',
};

SaveDataContextButton.displayName = 'Controls-Buttons/SaveDataContextButton';

export default SaveDataContextButton;
