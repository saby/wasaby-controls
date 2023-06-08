import { Text, Phone, Number } from 'Controls-Input/inputConnected';
import { Date } from 'Controls-Input/dateConnected';
import { Input as DateRange } from 'Controls-Input/dateRangeConnected';
import { default as RadioGroup } from 'Controls-Input/RadioGroupConnected';
import { default as CheckboxGroup } from 'Controls-Input/CheckboxGroupConnected';
import { default as Combobox } from 'Controls-Input/ComboboxConnected';
import { getLoadConfig, getBinding, Variants } from './_dataContextMock';
import { ContextRendererConnected } from './ContextRendererConnected';

function Index() {
    return (
        <div className="tw-grid tw-grid-cols-2 controlsDemo__wrapper">
            <div className="tw-flex tw-flex-col controlsDemo_fixedWidth400">
                <Text
                    name={getBinding('Text')}
                    label={getLabel('Text')}
                    multiline={{ maxLines: 5, minLines: 3 }}
                />
                <Text name={getBinding('String')} label={getLabel('String')} multiline={{}} />
                <Number name={getBinding('Number')} label={getLabel('Number')} />
                <Phone name={getBinding('Phone')} label={getLabel('Phone')} />
                <Date name={getBinding('Date')} label={getLabel('Date')} />
                <DateRange name={getBinding('DateRange')} label={getLabel('DateRange')} />
                <Combobox
                    name={getBinding('Combobox')}
                    items={Variants}
                    label={getLabel('Combobox')}
                />
                <CheckboxGroup
                    name={getBinding('CheckboxGroup')}
                    items={Variants}
                    label={getLabel('CheckboxGroup')}
                />
                <RadioGroup
                    name={getBinding('RadioGroup')}
                    items={Variants}
                    label={getLabel('RadioGroup')}
                />
            </div>
            <ContextRendererConnected />
        </div>
    );
}

function getLabel(label: string): object {
    return {
        label,
        labelPosition: 'top',
    };
}

Index.getLoadConfig = getLoadConfig;

export default Index;
