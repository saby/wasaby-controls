import * as React from 'react';
import { IDateMenuOptions } from './IDateMenu';
import { inputDefaultContentTemplate as InputDefaultContentTemplate } from 'Controls/dropdown';
import Async from 'Controls/Container/Async';
import MenuItemTemplate from './MenuItemTemplate';

const customEvents = ['onMenuItemClick'];

export default React.memo(
    React.forwardRef((props: IDateMenuOptions, ref) => {
        const isFirstBasicDateEditor =
            props.viewMode === 'basic' &&
            !props.extendedCaption &&
            props.filterViewMode === 'popup' &&
            props.filterIndex === 0;

        const contentTemplateOptions = {
            fontColorStyle: props.fontColorStyle || 'default',
            inlineHeight: 'm',
            underline: props.underline,
            caption: props.caption,
            fontSize: isFirstBasicDateEditor ? 'xl' : props.fontSize,
        };
        const templateOptions = {
            ...contentTemplateOptions,
            items: props.items,
            keyProperty: props.keyProperty,
            displayProperty: props.displayProperty,
            selectedKeys: props.selectedKeys,
            headerTemplate: null,
            itemTemplate:
                props.itemTemplate ||
                (props.isNewPeriodTypes
                    ? (contentProps) => (
                          <MenuItemTemplate
                              {...contentProps}
                              periodType={props.periodType}
                              userPeriods={props.userPeriods}
                              captionFormatter={props.captionFormatter}
                              _date={props._date}
                          />
                      )
                    : props.itemTemplate),
            menuPopupOptions: {
                templateOptions: {
                    markerVisibility: 'onactivated',
                },
                allowAdaptive: true,
            },
            onMenuItemClick: (item) => {
                props.onItemClick(item, props);
            },
            contentTemplate: () => (
                <InputDefaultContentTemplate
                    {...contentTemplateOptions}
                    tooltip={props.caption}
                    text={props.caption}
                />
            ),
        };

        return (
            <Async
                {...props.attrs}
                customEvents={customEvents}
                className={`${props.attrs?.className} controls-FilterViewPanel__dropdownEditor 
                ${isFirstBasicDateEditor ? 'controls-fontweight-bold' : ''}`}
                templateName="Controls/dropdown:Selector"
                templateOptions={templateOptions}
            />
        );
    })
);
