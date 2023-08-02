import { Button, IButtonOptions } from 'Controls/buttons';
import { useContext } from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { Form } from 'Controls-DataEnv/dataFactory';
import type { TKey } from 'Controls/interface';

type Props = IButtonOptions;

/**
 * Компонент кнопки "Сохранить все".
 * @remark
 * Вызывает сохранение всех слайсов формы, доступных в контексте.
 * @param props
 */
export default function SaveDataContextButton(props: Props) {
    const context = useContext(DataContext) as Record<TKey, (typeof Form)['slice']>;
    const onClick = () => {
        for (const sliceName in context) {
            if (context.hasOwnProperty(sliceName)) {
                context[sliceName]?.update?.();
            }
        }
    };
    return <Button {...props} onClick={onClick} />;
}
