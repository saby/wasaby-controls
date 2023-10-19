import { Button as WasabyButton } from 'Controls/buttons';
import { useContext } from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { FormSliceActionType } from 'Controls-DataEnv/dataFactory';
import { Logger } from 'UI/Utils';

const DEFAULT_SLICE_NAME = 'FormData';
const DEFAULT_CALLBACK = () => {};

interface ISaveDataContextButtonProps {
    beforeSave: (slice: Slice<unknown>) => void;
    afterSave: (slice: Slice<unknown>) => void;
}

/**
 * Кнопка сохранения контекста {@link Controls-Buttons/SaveDataContextButton SaveDataContextButton}
 */
function SaveDataContextButton(props: ISaveDataContextButtonProps): JSX.Element {
    const context = useContext(DataContext);
    const { beforeSave = DEFAULT_CALLBACK, afterSave = DEFAULT_CALLBACK } = props;

    const onClick = () => {
        const slice = context?.[DEFAULT_SLICE_NAME];
        if (slice) {
            const beforeResult = beforeSave(slice);
            if (!!beforeResult) {
                return Logger.warn(
                    `Controls-Buttons/SaveDataContextButton: Сохранение контекста заблокировано в beforeSave: ${beforeResult}`
                );
            }
            slice?.update?.(FormSliceActionType.Save).then(() => {
                afterSave(slice);
            });
        }
    };

    return <WasabyButton {...props} onClick={onClick} />;
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
