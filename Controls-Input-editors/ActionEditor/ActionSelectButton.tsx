import { useMemo, memo, MouseEventHandler, forwardRef, RefObject } from 'react';
import { Button } from 'Controls/buttons';
import { RecordSet } from 'Types/collection';
import actions, { IActionConfig } from 'Controls-Actions/actions';
import { Button as DropdownButton } from 'Controls/dropdown';
import * as translate from 'i18n!Controls-Actions';
import { Model } from 'Types/entity';
import 'css!Controls-Input-editors/ActionEditor/ActionSelectButton';

interface IActionSelectButtonProps {
    frequentActions?: string[];
    permittedActions?: string[];
    caption: string;
    dropdownApplyHandler: (actionType: string) => void;
    buttonClickHandler: MouseEventHandler;
}

const ActionSelectButton = forwardRef(function ActionSelectButton(
    props: IActionSelectButtonProps,
    ref
) {
    const { frequentActions, permittedActions, caption, dropdownApplyHandler, buttonClickHandler } =
        props;

    const frequentFilteredActions = useMemo(() => {
        if (!frequentActions) {
            return [];
        }

        return actions.filter(
            (action) =>
                frequentActions.includes(action.type) &&
                (!permittedActions || permittedActions.includes(action.type))
        );
    }, [frequentActions, permittedActions]);

    const itemData = useMemo(() => {
        if (!frequentFilteredActions.length) {
            return [
                {
                    type: 'singleAction',
                    title: caption,
                    icon: null,
                },
            ];
        }

        return frequentFilteredActions.map((action: IActionConfig) => {
            return {
                type: action.type,
                title: action.info?.title,
                icon: action.info?.icon,
            };
        });
    }, [caption, frequentFilteredActions]);

    const items = useMemo(
        () =>
            new RecordSet({
                keyProperty: 'type',
                rawData: itemData,
            }),
        [itemData]
    );

    const handleMenuItemActivate = (item: Model) => {
        if (frequentFilteredActions.length === 0) {
            buttonClickHandler?.(null as never);
        } else {
            dropdownApplyHandler(item.get('type'));
        }
    };

    return (
        <DropdownButton
            ref={ref as RefObject<DropdownButton>}
            data-qa="controls-Header_button__link"
            className="controls-buttons_actionEditor-content"
            viewMode="link"
            fontColorStyle="link"
            showHeader={false}
            caption={caption}
            items={items}
            menuPopupTrigger="click"
            keyProperty="type"
            displayProperty="title"
            onMenuItemActivate={handleMenuItemActivate}
            footerContentTemplate={
                frequentFilteredActions.length && (
                    <Button
                        className="controls-buttons_actionEditor-content controls-buttons_actionEditor-content_button_all-actions"
                        data-qa="controls-Header_button__footer_dropdown-actions"
                        caption={translate('Все действия')}
                        viewMode="link"
                        fontColorStyle="link"
                        onClick={buttonClickHandler}
                    />
                )
            }
        />
    );
});

export default memo(ActionSelectButton);
