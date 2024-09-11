import { IPropertyEditorProps } from 'Meta/types';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { useCallback, useMemo } from 'react';
import { Memory } from 'Types/source';
import * as rk from 'i18n!Controls';

// TODO: перейти на новый интерфейс пропсов PropertyGrid
interface Props extends IPropertyEditorProps<TValidators> {
    LayoutComponent?: any;
    validators: IValidatorDescription[];
    emptyField?: string;
}

type TValidator = string;
type TValidators = TValidator[];

/**
 * Описание валидатора в справочнике валидаторов
 */
export interface IValidatorDescription {
    /**
     * Название валидатора
     */
    caption: string;
    /**
     * Модуль, содержащий функцию валидации
     */
    validatorModule: TValidator;
}

/**
 * Редактор, позволяющий выбрать один/несколько валидаторов из заданного списка
 * @remark Список валидаторов задается в опции validators
 * @param props
 * @constructor
 */
function ValidatorSelector(props: Props) {
    const { value, onChange, LayoutComponent, type, validators, emptyField } = props;
    const readOnly = type.isDisabled();
    const source = useMemo(() => {
        return new Memory({ keyProperty: 'value', data: validators || [] });
    }, [validators]);

    const onValueChanged = useCallback<(val: TValidators) => void>(
        (val) => {
            onChange(val);
        },
        [onChange]
    );

    const selectedKeys = useMemo<TValidators>(() => {
        return value || [];
    }, [value]);

    return (
        <LayoutComponent>
            <SelectorControl
                source={source}
                className={'controls-PropertyGrid__editor_enum'}
                closeMenuOnOutsideClick={true}
                selectedKeys={selectedKeys}
                readOnly={readOnly}
                displayProperty="caption"
                keyProperty="validatorModule"
                emptyKey={emptyField || value === undefined ? null : undefined}
                emptyText={value === undefined ? rk('Не выбрано') : emptyField}
                onSelectedKeysChanged={onValueChanged}
                customEvents={['onSelectedKeysChanged']}
                multiSelect={true}
            />
        </LayoutComponent>
    );
}

export default ValidatorSelector;
