import * as rk from 'i18n!Controls';
import { forwardRef, memo, ElementType } from 'react';
import { Button } from 'Controls/buttons';

const Footer = memo(
    forwardRef<
        HTMLDivElement,
        { showSelectorButtonTemplate: ElementType; addButtonClickCallback: Function }
    >((props, ref) => {
        return (
            <div
                className="tw-w-full tw-flex tw-items-baseline tw-justify-end controls-margin_right-s"
                ref={ref}
            >
                <Button
                    icon="icon-Add"
                    className="controls-margin_right-m"
                    iconSize="s"
                    caption={rk('Создать')}
                    fontSize="m"
                    fontColorStyle="label"
                    viewMode="link"
                    readOnly={false}
                    onClick={() => {
                        props.addButtonClickCallback();
                    }}
                />

                <props.showSelectorButtonTemplate />
            </div>
        );
    })
);

export default Footer;
