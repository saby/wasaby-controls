import { Fragment, memo, useEffect, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

import { INameValue, default as InputControl } from 'Controls-Name/Input';
import { Label } from 'Controls/input';

/**
 * @public
 */
export interface INameEditorProps extends IPropertyGridPropertyEditorProps<INameValue | undefined> {
    titlePosition?: string;
}

/**
 * Реакт компонент, редактор ФИО
 * @class Controls-editors/_input/NameEditorEditor
 * @implements Controls-editors/input:INameEditorProps
 * @public
 */
export const NameEditor = memo((props: INameEditorProps) => {
    const { value, onChange, LayoutComponent = Fragment } = props;
    const [currentValue, setCurrentValue] = useState<INameValue | undefined>(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const nameChangeHandler = (_: string, newValue: INameValue) => {
        setCurrentValue(newValue);
    };

    const inputCompleteHandler = () => {
        onChange?.(currentValue);
    };

    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <InputControl
                className="tw-w-full"
                value={currentValue}
                onValueChanged={nameChangeHandler}
                onInputCompleted={inputCompleteHandler}
                rightFieldTemplate={
                    <Label caption={rk('по умолчанию')} readOnly={true} underline="hovered" />
                }
            />
        </LayoutComponent>
    );
});
