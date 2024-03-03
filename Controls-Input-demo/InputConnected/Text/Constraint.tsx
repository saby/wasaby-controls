import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Constraint = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('constraint = onlyLetters')}
                        constraint="[a-zA-Zа-яА-ЯёЁ \n\t\r]"
                    />
                    <Text
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('constraint = notSpecial')}
                        constraint="[a-zA-Zа-яА-Я0-9еЁ \n\t\r]"
                    />
                    <Text
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('constraint is empty')}
                    />
                </div>
            </div>
        </div>
    );
});

Constraint.getLoadConfig = getLoadConfig;

export default Constraint;
