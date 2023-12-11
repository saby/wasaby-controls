import { forwardRef, useMemo } from 'react';
import { default as CheckboxGroup } from 'Controls-Input/CheckboxGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';
import * as rk from 'i18n!Controls';

const Variants = forwardRef((_, ref) => {
    const variants = useMemo(() => {
        return {
            items: [
                {
                    id: 1,
                    title: rk('1'),
                    parent: null,
                    node: false,
                },
                {
                    id: 2,
                    title: rk('2'),
                    parent: null,
                    node: true,
                },
                {
                    id: 3,
                    title: rk('3'),
                    parent: 2,
                    node: false,
                },
            ]
        };
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <CheckboxGroup
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('variants')}
                variants={variants}
            />
            <CheckboxGroup
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('Variants is empty')}
            />
        </div>
    );
});

Variants.getLoadConfig = getLoadConfig;

export default Variants;
