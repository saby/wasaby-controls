import { forwardRef } from 'react';

import { Text, Phone, Number } from 'Controls-Input/inputConnected';
import { Date } from 'Controls-Input/dateConnected';
import { Input as DateRange } from 'Controls-Input/dateRangeConnected';
import { default as RadioGroup } from 'Controls-Input/RadioGroupConnected';
import { default as CheckboxGroup } from 'Controls-Input/CheckboxGroupConnected';
import { default as Combobox } from 'Controls-Input/ComboboxConnected';
import { getLoadConfig, getBinding, Variants, VariantsCheckbox } from '../resources/_dataContextMock';
import { ContextRendererConnected } from './ContextRendererConnected';

const Index = forwardRef((props, ref) => {
    return (
        <div ref={ref} className="tw-grid tw-grid-cols-2 controlsDemo__wrapper">
            <div className="tw-flex tw-flex-col controlsDemo_fixedWidth400">
                <Text
                    name={getBinding('Text')}
                    label={getLabel('Text')}
                    multiline={{maxLines: 5, minLines: 3}}
                    data-qa="Controls-Input-demo_Connected__Text"
                />
                <Text name={getBinding('String')} label={getLabel('String')} multiline={{}} data-qa="Controls-Input-demo_Connected__String"/>
                <Number name={getBinding('Number')} label={getLabel('Number')} data-qa="Controls-Input-demo_Connected__Number"/>
                <Phone name={getBinding('Phone')} label={getLabel('Phone')} data-qa="Controls-Input-demo_Connected__Phone"/>
                <Date name={getBinding('Date')} label={getLabel('Date')} data-qa="Controls-Input-demo_Connected__Date"/>
                <DateRange name={getBinding('DateRange')} label={getLabel('DateRange')} data-qa="Controls-Input-demo_Connected__DateRange"/>
                <Combobox
                    name={getBinding('Combobox')}
                    variants={{
                        items: Variants
                    }}
                    label={getLabel('Combobox')}
                    data-qa="Controls-Input-demo_Connected__Combobox"
                />
                <CheckboxGroup
                    name={getBinding('CheckboxGroup')}
                    variants={{
                        items: VariantsCheckbox
                    }}
                    label={getLabel('CheckboxGroup')}
                    data-qa="Controls-Input-demo_Connected__CheckboxGroup"
                />
                <RadioGroup
                    name={getBinding('RadioGroup')}
                    variants={{
                        items: Variants
                    }}
                    label={getLabel('RadioGroup')}
                    data-qa="Controls-Input-demo_Connected__RadioGroup"
                />
            </div>
            <ContextRendererConnected/>
        </div>
    );
});

function getLabel(label: string): object {
    return {
        label,
        labelPosition: 'top',
    };
};

Index.getLoadConfig = getLoadConfig;

export default Index;
