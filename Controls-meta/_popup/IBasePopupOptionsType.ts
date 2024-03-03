import { ObjectType, BooleanType, StringType, NumberType, NullType } from 'Meta/types';
import { IBasePopupOptions } from 'Controls/popup';
import { TemplateFunctionType } from '../_interface/TemplateFunctionType';
import { ILoadingIndicatorOptionsType } from '../_loadingIndicator/ILoadingIndicatorOptionsType';

export const IBasePopupOptionsType = ObjectType.id(
    'Controls/meta:IBasePopupOptionsType'
).attributes<IBasePopupOptions>({
    asyncShow: BooleanType.optional(),
    id: StringType.optional(),
    content: TemplateFunctionType.optional(),
    className: StringType.optional(),
    template: TemplateFunctionType.optional(),
    pageId: StringType.optional(),
    initializingWay: NullType,
    closeOnOutsideClick: BooleanType.optional(),
    templateOptions: NullType,
    opener: NullType,
    autofocus: BooleanType.optional(),
    topPopup: BooleanType.optional(),
    modal: BooleanType.optional(),
    autoClose: BooleanType.optional(),
    closeOnOverlayClick: BooleanType.optional(),
    eventHandlers: NullType,
    isDefaultOpener: BooleanType.optional(),
    showIndicator: BooleanType.optional(),
    indicatorConfig: ILoadingIndicatorOptionsType,
    dataLoaders: NullType,
    restrictiveContainer: StringType.optional(),
    actionOnScroll: StringType.optional(),
    zIndex: NumberType.optional(),
    isCompoundTemplate: BooleanType.optional(),
    _type: NullType,
    isHelper: BooleanType.optional(),
    zIndexCallback: NullType,
    shouldNotUpdatePosition: BooleanType.optional(),
});
