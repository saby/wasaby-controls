import { Stack } from 'Controls/popupTemplate';
import { PropertyGrid } from 'Controls-editors/propertyGrid';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { Context as PopupContext } from 'Controls/popup';
interface IStackTemplateProps<T> {
    value: Record<string, unknown>;
    onChange: (value: Record<string, unknown>) => void;
    metaType: T;
}
export function StackTemplate<RuntimeInterface>(props: IStackTemplateProps<RuntimeInterface>) {
    const { value, onChange, metaType } = props;
    const popupContext = React.useContext(PopupContext);
    const [propertyGridValue, setPropertyGridValue] =
        React.useState<Record<string, unknown>>(value);
    const onPropertyGridValueChanged = React.useCallback((newValue: Record<string, unknown>) => {
        setPropertyGridValue(newValue);
    }, []);
    const onApplyButtonClick = React.useCallback(() => {
        onChange(propertyGridValue);
        popupContext.close();
    }, [onChange, propertyGridValue, popupContext]);
    return (
        <Stack
            rightBorderVisible={false}
            bodyContentTemplate={
                <div>
                    <PropertyGrid
                        value={propertyGridValue}
                        onChange={onPropertyGridValueChanged}
                        metaType={metaType}
                    />
                </div>
            }
            headerContentTemplate={
                <div>
                    <Button
                        viewMode="filled"
                        buttonStyle="success"
                        iconSize="m"
                        icon="icon-Yes"
                        iconStyle="contrast"
                        tooltip={'Применить'}
                        onClick={onApplyButtonClick}
                    />
                </div>
            }
        />
    );
}
