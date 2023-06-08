import { ObjectType, BooleanType, StringType, NumberType } from 'Types/meta';
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
    initializingWay: null,
    closeOnOutsideClick: BooleanType.optional(),
    templateOptions: null,
    opener: null,
    autofocus: BooleanType.optional(),
    topPopup: BooleanType.optional(),
    modal: BooleanType.optional(),
    autoClose: BooleanType.optional(),
    closeOnOverlayClick: BooleanType.optional(),
    eventHandlers: null,
    isDefaultOpener: BooleanType.optional(),
    showIndicator: BooleanType.optional(),
    indicatorConfig: ILoadingIndicatorOptionsType,
    dataLoaders: null,
    restrictiveContainer: StringType.optional(),
    actionOnScroll: StringType.optional(),
    zIndex: NumberType.optional(),
    isCompoundTemplate: BooleanType.optional(),
    _type: null,
    isHelper: BooleanType.optional(),
    zIndexCallback: null,
    shouldNotUpdatePosition: BooleanType.optional(),
});
