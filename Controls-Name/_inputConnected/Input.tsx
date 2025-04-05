import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo,
    cloneElement,
    ReactElement,
} from 'react';
import { clearProps, useConnectedValue, useFormReadonly } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { INameProps, InputLabel } from 'Controls-Input/inputConnected';
import { IComponentProps } from 'Controls/interface';
import {
    default as NameInput,
    INameValue as IDefaultNameProps,
    ISuggestInput,
} from 'Controls-Name/Input';
import { default as MultilineContainer } from 'Controls-Name/MultilineContainer';
import { Model, adapter } from 'Types/entity';
import * as rk from 'i18n!Controls';
import { useAdaptiveMode } from 'UI/Adaptive';
import { getStyleProps } from 'Controls-Input/utils';
import * as fnParser from 'optional!FullnameParser/DataContainer';

function validateName({ value }: { value: INameProps['value'] }) {
    const isEmpty = !(
        value &&
        (value.get('MiddleName') || value.get('FirstName') || value.get('LastName'))
    );
    return isEmpty ? rk('Поле обязательно для заполнения') : true;
}

const VALIDATE_FNS = [validateName];

const FIRST_FIELD = ['lastName'];
const SECOND_FIELD = ['firstName', 'middleName'];

const MIN_WIDTH = 400;

function FirstNameComponents(props: ISuggestInput) {
    return <NameInput {...props} onFocus={undefined} className={undefined} fields={FIRST_FIELD} />;
}

function SecondNameComponents(props: ISuggestInput) {
    return (
        <NameInput
            {...props}
            onFocus={undefined}
            className="controls-margin_top-s"
            fields={SECOND_FIELD}
        />
    );
}

function getCorrectValue(value: INameProps['value']): IDefaultNameProps | undefined {
    if (value) {
        return {
            firstName: value.get?.('FirstName') || value.firstName,
            lastName: value.get?.('LastName') || value.lastName,
            middleName: value.get?.('MiddleName') || value.middleName,
        };
    }
    return value;
}

function setValue(
    model: INameProps['value'],
    value: IDefaultNameProps | undefined
): INameProps['value'] {
    const newData = new Model({
        format: [
            { name: 'FirstName', type: 'string' },
            { name: 'LastName', type: 'string' },
            { name: 'MiddleName', type: 'string' },
        ],
        adapter: new adapter.Sbis(),
    });
    newData.set({
        FirstName: value?.firstName,
        LastName: value?.lastName,
        MiddleName: value?.middleName,
    });
    return newData;
}

function EmptyTemplate(props: Record<string, unknown>) {
    const clProps = { ...props };
    delete clProps.children;
    return cloneElement(props.children as ReactElement, {
        ...props.children.props,
        ...clProps,
        className: (clProps.className || '') + ' ' + (props.children.props?.className || ''),
        props: {
            ...(props.children.props?.props || {}),
            ...clProps,
            className:
                (clProps.className || '') + ' ' + (props.children.props?.props?.className || ''),
        },
    });
}

const FIELDS = {
    lastFirst: ['lastName', 'firstName'],
    full: ['lastName', 'firstName', 'middleName'],
};

/**
 * Редактор типа "ФИО", работающий со слайсом формы
 * @param {INameProps} props
 */
function Input(props: INameProps & IComponentProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const [inputValue, setInputValue] = useState<IDefaultNameProps | undefined>(
        getCorrectValue(value as INameProps['value'])
    );
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props, VALIDATE_FNS),
        ref
    );

    const onValueChanged = useCallback((_, result: IDefaultNameProps) => {
        resetValidation();
        setInputValue(result);
    }, []);

    useEffect(() => {
        setInputValue(getCorrectValue(value as INameProps['value']));
    }, [value]);

    const onInputCompleted = useCallback((_, result: IDefaultNameProps) => {
        onChange(setValue(value as INameProps['value'], result));
        validate();
    }, []);
    const onFocusHandler = () => {
        onFocus();
        onChange(setValue(value as INameProps['value'], inputValue));
        validate();
    };
    const styleProps = getStyleProps(props);
    const readOnly = useFormReadonly(props.name);

    const adaptiveMode = useAdaptiveMode();
    const isMultiline = useMemo(() => {
        if (props.field !== 'full') {
            return false;
        }
        if (adaptiveMode.device.isPhone()) {
            return true;
        }
        const containerWidth = adaptiveMode.width.value;
        if (containerWidth) {
            return containerWidth < MIN_WIDTH;
        }
    }, [adaptiveMode, props.field]);
    const DataContainer = fnParser?.default || EmptyTemplate;

    return (
        <InputLabel
            value={value}
            label={props.label}
            className={props.className}
            fontSize={styleProps.fontSize}
        >
            <DataContainer>
                {isMultiline ? (
                    <MultilineContainer
                        ref={ref}
                        // @ts-ignore
                        {...clearProps(props)}
                        className="Name-Input-connected tw-flex tw-flex-col"
                        value={inputValue}
                        // @ts-ignore
                        onValueChanged={onValueChanged}
                        onFocus={onFocusHandler}
                        // @ts-ignore
                        customEvents={['onValueChanged']}
                        validationStatus={validationStatus}
                        {...styleProps}
                        firstLineTemplate={FirstNameComponents}
                        secondLineTemplate={SecondNameComponents}
                        readOnly={readOnly}
                    />
                ) : (
                    <NameInput
                        ref={ref}
                        // @ts-ignore
                        {...clearProps(props)}
                        className="Name-Input-connected"
                        value={inputValue}
                        fields={FIELDS[props.field || 'lastFirst']}
                        // @ts-ignore
                        onValueChanged={onValueChanged}
                        onInputCompleted={onInputCompleted}
                        onFocus={onFocus}
                        // @ts-ignore
                        customEvents={['onValueChanged', 'onInputCompleted']}
                        validationStatus={validationStatus}
                        {...styleProps}
                        readOnly={readOnly}
                    />
                )}
            </DataContainer>
        </InputLabel>
    );
}

Input.displayName = 'Controls-Name/inputConnected:Input';
export { Input };
