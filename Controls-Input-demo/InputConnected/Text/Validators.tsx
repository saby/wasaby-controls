import { forwardRef, useMemo } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const MIN_VALUE = 10;

const Validators = forwardRef((_, ref) => {
    const validators = useMemo(() => {
        return [
            (res: { value: string }) => {
                return (
                    res.value.length > MIN_VALUE ||
                    `Введенное значение должно быть больше ${MIN_VALUE} символов`
                );
            },
        ];
    }, []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('validate min value length')}
                        validators={validators}
                    />
                </div>
            </div>
        </div>
    );
});

Validators.getLoadConfig = getLoadConfig;

export default Validators;
