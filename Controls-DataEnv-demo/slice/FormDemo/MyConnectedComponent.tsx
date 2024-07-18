import { useConnectedValue } from 'Controls-Input/useConnectedValue';
import { Phone as PhoneInput } from 'Controls/input';
import { useCallback, useEffect, useState } from 'react';

interface IProps {
    name: string[];
}

/**
 * Пример прикладного компонента, работающего с контекстом данных
 * @remark В демо приведен пример доступа к полю в контексте с помощью хука Controls-Input/useConnectedValue.
 * Для получения прямого доступа к контексту:
 * <pre>
 *     const dataContext = React.useContext(DataContext);
 *     const formSlice = dataContext.FormData as IFormSlice;
 *     const data = formSlice.get(props.name.join('.'));
 * </pre>
 * @param props
 * @constructor
 */
export function MyConnectedComponent(props: IProps): JSX.Element {
    // получение значения из контекста с помощью платформенного хука
    const { value, onChange } = useConnectedValue(props.name);

    const [phoneValue, setPhoneValue] = useState('');

    const onValueChanged = useCallback((result) => {
        setPhoneValue(result);
    }, []);
    const onInputCompleted = useCallback((_, result) => {
        onChange(result);
    }, []);

    useEffect(() => {
        setPhoneValue(value);
    }, [value]);

    return (
        <PhoneInput
            value={phoneValue}
            valueChangedCallback={onValueChanged}
            onInputCompleted={onInputCompleted}
        />
    );
}
