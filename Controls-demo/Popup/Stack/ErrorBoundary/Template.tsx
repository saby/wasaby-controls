import { useCallback, forwardRef, useState } from 'react';
import { Stack } from 'Controls/popupTemplate';
import { Button } from 'Controls/buttons';
import 'css!Controls-demo/Popup/Stack/doc/Template/Template';

function Template(props) {
    const [hasError, setHasError] = useState(false);

    const getBodyContentTemplate = () => {
        const onClick = () => {
            setHasError(true);
        };
        return (
            <div className="controlsDemo-Stack__template" onClick={onClick}>
                Контент внутри стекового окна <Button caption={'Вызвать ошибку в окне'} />
                {hasError ? (
                    <div>
                        Используем несуществующее поле, что вызовет ошибку {props.counter.value}
                    </div>
                ) : null}
            </div>
        );
    };

    const getHeaderContentTemplate = useCallback(() => {
        return <div className="controlsDemo-Stack__template">Контент внутри шапки окна</div>;
    }, []);

    return (
        <Stack
            {...props}
            bodyContentTemplate={getBodyContentTemplate}
            headerContentTemplate={getHeaderContentTemplate}
        />
    );
}

export default forwardRef(Template);
