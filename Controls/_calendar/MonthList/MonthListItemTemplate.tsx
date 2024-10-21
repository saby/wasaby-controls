/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { IntersectionObserverContainer } from 'Controls/scroll';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { Record } from 'Types/entity';
import ExtDataModel from './ExtDataModel';

interface IMonthListItemTemplateProps extends TInternalProps, IControlProps {
    item: Record;
    extData: ExtDataModel;
    itemTemplate: React.ReactElement;
}

export default function MonthListItemTemplate(
    props: IMonthListItemTemplateProps
): React.ReactElement {
    return (
        <IntersectionObserverContainer observerName="monthList" data={props.item.getRawData()}>
            <props.itemTemplate
                {...props}
                className={`${props.className || ''} controls-MonthList__template`}
                date={props.item.get('date')}
            />
        </IntersectionObserverContainer>
    );
}
