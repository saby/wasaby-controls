import { Button as WasabyButton } from 'Controls/buttons';
import { useContext } from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { FormSliceActionType, IFormSlice } from 'Controls-DataEnv/dataFactory';
import { Logger } from 'UI/Utils';

const DEFAULT_SLICE_NAME = 'FormData';
const DEFAULT_CALLBACK = () => {};

interface ISaveDataContextButtonProps {
    beforeSave: (slice: IFormSlice) => void;
    afterSave: (slice: IFormSlice) => void;
    className: string;
}

/**
 * Кнопка сохранения контекста {@link Controls-Buttons/SaveDataContextButton SaveDataContextButton}
 */
function SaveDataContextButton(props: ISaveDataContextButtonProps): JSX.Element {
    const context = useContext<Record<string, IFormSlice>>(DataContext);
    const { beforeSave = DEFAULT_CALLBACK, afterSave = DEFAULT_CALLBACK, className = '' } = props;

    const onClick = async () => {
        const slice = context?.[DEFAULT_SLICE_NAME];
        if (slice) {
            await slice.validateAll();
            const beforeResult = beforeSave(slice);
            if (!!beforeResult) {
                return Logger.warn(
                    `Controls-Buttons/SaveDataContextButton: Сохранение контекста заблокировано в beforeSave: ${beforeResult}`
                );
            }

            if (slice.isValid()) {
                slice?.update?.(FormSliceActionType.Save).then(() => {
                    afterSave(slice);
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
