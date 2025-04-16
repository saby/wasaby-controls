import { ReactElement, ReactNode, useCallback, useContext, useMemo } from 'react';
import { Label as LabelControl } from 'Controls/input';
import { IPropertyGridEditorLayout } from './IPropertyGrid';
import {
    ObjectTypeEditorRootContext,
    TypeHierarchyPadding,
    WarningTemplate,
    ValidationContainer,
    ValidationDescriptor,
} from 'Controls-editors/object-type';
import { Button } from 'Controls/buttons';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Decorator, Converter } from 'Controls/markup';
import { getWasabyContext } from 'UICore/Contexts';
import * as rk from 'i18n!Controls-editors';

function Label({
    title,
    titlePosition,
    disabled,
    required,
}: IPropertyGridEditorLayout): ReactElement | null {
    const labelClassName = `controls_PropertyGrid__editor_layout__title 
                            controls_PropertyGrid__editor_layout__title-${titlePosition}`;

    return title && titlePosition !== 'none' ? (
        <div className={labelClassName}>
            <TypeHierarchyPadding />
            <LabelControl
                caption={title}
                required={required && !disabled}
                className={'controls_PropertyGrid__editor_layout__label'}
            />
        </div>
    ) : null;
}

function Editor(props: IPropertyGridEditorLayout): ReactElement {
    const { titlePosition, children, title, metaType, attributeName, validation, doNotValidate } =
        props;

    const { readOnly } = useContext(getWasabyContext());

    let editorClassName = `controls_PropertyGrid__editor_layout__editor 
                             controls_PropertyGrid__editor_layout__editor-title-${titlePosition}`;

    const { hideProperty, showTooltip } = useContext(ObjectTypeEditorRootContext);
    const hidePropertyHandler = useCallback(() => {
        if (!attributeName) {
            return;
        }
        hideProperty(attributeName);
    }, [hideProperty, attributeName]);

    if (titlePosition === 'none') {
        editorClassName += ' ws-flexbox ws-flex-row';
    }

    let content = (
        <ValidationDescriptor name={attributeName}>
            <ValidationContainer validators={validation?.validators} doNotValidate={doNotValidate}>
                {children}
            </ValidationContainer>
        </ValidationDescriptor>
    );

    if (!title || titlePosition === 'none') {
        content = (
            <div className={'ws-flexbox ws-flex-row tw-items-baseline tw-w-full'}>
                <TypeHierarchyPadding />
                <div className={'tw-w-full'} style={{ flex: 1 }}>
                    {content}
                </div>
            </div>
        );
    }

    let closeButton: ReactNode | undefined;
    if (
        metaType?.getExtended() !== undefined &&
        showTooltip &&
        !readOnly &&
        metaType?.isDisabled() !== true
    ) {
        editorClassName += ' ws-flexbox ws-flex-row';

        closeButton = (
            <Button
                icon={'icon-Close'}
                viewMode="link"
                tooltip={rk('Скрыть свойство')}
                iconSize={'s'}
                className="controls-padding_left-st"
                onClick={hidePropertyHandler}
                data-qa={'propertygrid__hide-property'}
            />
        );
    }

    let infoButton: ReactNode | undefined;
    const description = metaType?.getDescription();

    const jsonmlDescription = useMemo(() => {
        if (!description) {
            return null;
        }

        return Converter.htmlToJson(description);
    }, [description]);
    if (!!jsonmlDescription && showTooltip) {
        infoButton = (
            <InfoboxTarget
                trigger="hover"
                template={
                    <ScrollContainer className="controls-padding_right-l">
                        <Decorator value={jsonmlDescription} />
                    </ScrollContainer>
                }
                hideDelay={500}
            >
                <Button
                    icon={'icon-Info'}
                    viewMode="link"
                    iconSize={'s'}
                    className="controls-padding_left-st"
                />
            </InfoboxTarget>
        );
    }

    if (!!infoButton || !!closeButton) {
        editorClassName += ' ws-flexbox tw-items-baseline';
        content = <div className={'tw-contents'}>{content}</div>;
    }

    return (
        <div className={editorClassName}>
            {content}
            {infoButton}
            {closeButton}
        </div>
    );
}

function Warning({ validation }: IPropertyGridEditorLayout): ReactElement | null {
    if (!validation?.warning) {
        return null;
    }

    return (
        <div className="tw-col-start-2 tw-col-end-4 tw-flex">
            <TypeHierarchyPadding />
            <WarningTemplate text={validation.warning} />
        </div>
    );
}

/**
 * Реакт компонент, для отрисовки редактора внутри проперти грида (для реализации сквозного выравнивания между редакторами)
 * @class Controls-editors/_propertyGrid/PropertyGridEditorLayout
 * @private
 */

function PropertyGridEditorLayout(props: IPropertyGridEditorLayout) {
    const { required, metaType, skipGridLayout, titlePosition } = props;

    const wrapperClassName =
        'controls_PropertyGrid__editor_layout ' +
        (skipGridLayout
            ? 'controls_PropertyGrid__editor_layout-skip-grid ws-flexbox ws-flex-row'
            : `controls_PropertyGrid__editor_layout-${titlePosition}`);

    const additionalProps = useMemo<Partial<IPropertyGridEditorLayout>>(() => {
        if (required !== undefined || !metaType) {
            return {};
        }

        return {
            required: metaType.isRequired(),
        };
    }, [metaType, required]);

    const { showTooltip } = useContext(ObjectTypeEditorRootContext);

    const preparedDescription = showTooltip ? props.title : props.description || props.title;

    return (
        <div className={wrapperClassName} title={preparedDescription}>
            <Label {...props} {...additionalProps} />
            <Editor {...props} {...additionalProps} />
            <Warning {...props} {...additionalProps} />
        </div>
    );
}

export default PropertyGridEditorLayout;
