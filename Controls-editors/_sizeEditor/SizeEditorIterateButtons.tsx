import { Button } from 'Controls/buttons';

import { IConstraint, DEFAULT_CONSTRAINT } from './_utils/constraint';
import { checkIsBaseUnit } from './_utils/functions';
import { KeyUnits } from './constants';

interface ISizeIteratorProps {
    readOnlyAdd?: boolean;
    readOnlySubtract?: boolean;
    onAdd: () => void;
    onSubtract: () => void;
}
interface IButtonsReadOnly {
    readOnlyAdd: boolean;
    readOnlySubtract: boolean;
}

export const getButtonsReadOnly = (
    inputValue: string,
    unit: KeyUnits,
    constraints: Record<string, IConstraint>
): IButtonsReadOnly => {
    const value = +inputValue;
    const { min, max } = constraints[unit] || DEFAULT_CONSTRAINT;
    const addAvailable = value + 1 <= max && value + 1 >= min;
    const subtractAvailable = value - 1 <= max && value - 1 >= min;
    const isChangeableUnit = checkIsBaseUnit(unit);

    return {
        readOnlyAdd: !isChangeableUnit && !addAvailable,
        readOnlySubtract: !isChangeableUnit && !subtractAvailable,
    };
};

function SizeEditorIterateButtons(props: ISizeIteratorProps): JSX.Element {
    const { readOnlyAdd = false, readOnlySubtract = false, onAdd, onSubtract } = props;

    return (
        <div>
            <Button
                viewMode="filled"
                buttonStyle="pale"
                icon="icon-Subtraction"
                className="controls-margin_left-s controls-margin_right-2xs"
                data-qa="SizeEditorField__subtractionButton"
                readOnly={readOnlySubtract}
                onClick={onSubtract}
            />
            <Button
                viewMode="filled"
                buttonStyle="pale"
                icon="icon-Addition"
                data-qa="SizeEditorField__additionButton"
                readOnly={readOnlyAdd}
                onClick={onAdd}
            />
        </div>
    );
}

export default SizeEditorIterateButtons;
