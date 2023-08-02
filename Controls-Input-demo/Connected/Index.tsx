import {
    String,
    Text,
    Number,
    Phone,
    Date,
    CheckboxGroup,
    RadioGroup,
} from 'Controls-Input/connected';
import { getLoadConfig, getBinding, Variants } from './_dataContextMock';
import { ContextRendererConnected } from './ContextRendererConnected';

function Index() {
    return (
        <div className="tw-grid tw-grid-cols-2 controlsDemo__wrapper">
            <div className="tw-flex tw-flex-col controlsDemo_fixedWidth400">
                <b>Controls-Input/connected:Text</b>
                <Text name={getBinding('Text')} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:String</b>
                <String name={getBinding('String')} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:Number</b>
                <Number name={getBinding('Number')} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:Phone</b>
                <Phone name={getBinding('Phone')} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:Date</b>
                <Date name={getBinding('Date')} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:CheckboxGroup</b>
                <CheckboxGroup name={getBinding('CheckboxGroup')} items={Variants} />
                <b className="controlsDemo__margin-top">Controls-Input/connected:RadioGroup</b>
                <RadioGroup name={getBinding('RadioGroup')} items={Variants} />
            </div>
            <ContextRendererConnected />
        </div>
    );
}

Index.getLoadConfig = getLoadConfig;

export default Index;
