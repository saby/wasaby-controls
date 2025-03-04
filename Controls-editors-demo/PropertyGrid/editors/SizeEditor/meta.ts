import { WidgetType } from 'Meta/types';
import { getSizeType } from 'Controls-meta/style';

export const WidgetSizeType = WidgetType.id('').properties({
    ...getSizeType({ aspectRatio: 1.5 }).getProperties(),
});
