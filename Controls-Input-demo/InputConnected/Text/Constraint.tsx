import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Constraint = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Text
                name={getBinding('Empty')}
                label={getOuterTextLabel('constraint = onlyLetters')}
                constraint='onlyLetters'
            />
            <Text
                name={getBinding('Empty')}
                label={getOuterTextLabel('constraint = notSpecial')}
                constraint='notSpecial'
            />
            <Text
                name={getBinding('Empty')}
                label={getOuterTextLabel('constraint is empty')}
            />
        </div>
    );
});

Constraint.getLoadConfig = getLoadConfig;

export default Constraint;
