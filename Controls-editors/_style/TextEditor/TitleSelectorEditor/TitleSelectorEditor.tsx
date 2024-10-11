import { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { Render } from 'Controls/input';
import { isRequired } from 'Controls/validate';
import { Field } from './Field';
import { MinMaxLength, useValidation } from 'Controls-Input/validators';
import { TValidationStatus } from 'Controls/interface';
import * as rk from 'i18n!Controls-editors';

const MAX_LENGTH = 40;
const PLACEHOLDER_NAME = rk('Название');
const PLACEHOLDER_SELECTOR = rk('Селектор');
const SELECTOR_START_CONSTRAINT = /^[a-zA-Z]/;
const SELECTOR_END_CONSTRAINT = /[a-zA-Z0-9]$/;
const SELECTOR_CONSTRAINT = /^[a-zA-Z0-9\-_]+$/;

function selectorValidator(value: string): boolean | string {
    if (!SELECTOR_CONSTRAINT.test(value)) {
        return (
            rk('Имя селектора может содержать только цифры, латинские буквы и символы') + ': _, -'
        );
    }

    if (!SELECTOR_START_CONSTRAINT.test(value)) {
        return rk('Имя селектора должно начинаться с латинской буквы');
    }

    if (!SELECTOR_END_CONSTRAINT.test(value)) {
        return rk('Имя селектора должно заканчиваться латинской буквой или цифрой');
    }

    return true;
}

interface ITextTypeEditorProps {
    name: string;
    selector: string;
    storeId?: string;
    onChange: (name: string, selector: string) => void;
}

function getValidationStatus(
    a: TValidationStatus = TValidationStatus.Valid,
    b: TValidationStatus = TValidationStatus.Valid
): TValidationStatus {
    return a === TValidationStatus.Valid && b === TValidationStatus.Valid
        ? TValidationStatus.Valid
        : TValidationStatus.Invalid;
}

export const TitleSelectorEditor = memo(
    ({ selector, name, storeId, onChange }: ITextTypeEditorProps): JSX.Element => {
        const nameField = useRef<HTMLDivElement>(null);
        const selectorField = useRef<HTMLDivElement>(null);
        const nameValue = useRef<string>(name);
        const selectorValue = useRef<string>(selector);

        const nameValidators = useMemo(() => {
            return [
                () => isRequired({ value: nameValue.current }),
                () => MinMaxLength({ maxLength: MAX_LENGTH }, { value: nameValue.current }),
            ];
        }, []);

        const selectorValidators = useMemo(() => {
            return [
                () => isRequired({ value: selectorValue.current }),
                () => MinMaxLength({ maxLength: MAX_LENGTH }, { value: selectorValue.current }),
                () => selectorValidator(selectorValue.current),
            ];
        }, []);

        const {
            validationStatus: nameValidationStatus,
            onFocus: onNameFocus,
            validate: validateName,
        } = useValidation(storeId ? [storeId, 'styleName'] : [], nameValidators, nameField);

        const {
            validationStatus: selectorValidationStatus,
            onFocus: onSelectorFocus,
            validate: validateSelector,
        } = useValidation(
            storeId ? [storeId, 'styleSelector'] : [],
            selectorValidators,
            selectorField
        );

        const onNameChange = useCallback(
            async (_, newName) => {
                nameValue.current = newName;
                await validateName();
                onChange(newName, selector);
            },
            [onChange, selector, validateName]
        );

        const onSelectorChange = useCallback(
            async (_, newSelector) => {
                selectorValue.current = newSelector;
                await validateSelector();
                onChange(name, newSelector);
            },
            [name, onChange, validateSelector]
        );

        useEffect(() => {
            validateName();
            validateSelector();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const validationStatus = getValidationStatus(
            nameValidationStatus,
            selectorValidationStatus
        );

        return (
            <Render
                className="tw-w-full"
                fontSize="3xl"
                inlineHeight="l"
                validationStatus={validationStatus}
            >
                <>
                    <div className="tw-self-center" ref={nameField}>
                        <Field
                            value={name}
                            placeholder={PLACEHOLDER_NAME}
                            onValueChanged={onNameChange}
                            onInputCompleted={onNameChange}
                            onFocus={onNameFocus}
                        />
                    </div>
                    <div className="TextTitleEditor__separator tw-self-center"></div>
                    <div className="controls-fontweight-default tw-self-center" ref={selectorField}>
                        <Field
                            value={selector}
                            placeholder={PLACEHOLDER_SELECTOR}
                            onValueChanged={onSelectorChange}
                            onInputCompleted={onSelectorChange}
                            onFocus={onSelectorFocus}
                        />
                    </div>
                </>
            </Render>
        );
    }
);
