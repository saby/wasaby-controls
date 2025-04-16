import { forwardRef } from 'react';
import { default as Checkbox } from 'Controls-Input/CheckboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const WrapText = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Checkbox
                name={getBinding('Checkbox')}
                label={getOuterTextLabel('WrapText = true, и очень длинный текст, который не помещается в 1 строку',
                    'captionEnd')}
                wrapText={true}
            />
            <Checkbox
                name={getBinding('Checkbox')}
                label={getOuterTextLabel('WrapText = false, и очень длинный текст, который не помещается в 1 строку',
                    'captionEnd')}
                wrapText={false}
            />
        </div>
    );
});

WrapText.getLoadConfig = getLoadConfig;

export default WrapText;
