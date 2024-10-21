/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
import Container from 'Controls/_popup/Popup/Container';
import { getModuleByName, loadModule } from 'Controls/_popup/utils/moduleHelper';
import { getStateReceiver, getStore } from 'Application/Env';
import { constants } from 'Env/Env';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { Logger } from 'UI/Utils';
import { ISerializableState } from 'Application/Interface';

interface IContentData {
    left: number;
    top: number;
    width: number;
}

const UID: string = 'popupAccordionTemplate';

class ReceivedAccordionTemplate implements ISerializableState {
    setState(accordionTemplate: string): void {
        getStore(UID)?.set('accordionTemplate', accordionTemplate);
    }

    getState(): string {
        return getStore(UID)?.get('accordionTemplate');
    }
}

/**
 * Контроллер попапов
 * @class Controls/_popup/Popup/ManagerController
 * @private
 */

/**
 * Метод, который устанавливает переданную функцию в стек коллбеков. Функция будет вызвана после открытия попапа.
 * @function Controls/_popup/Popup/ManagerController#setOpenPopupCallback
 * @remark Поле открытия попапа, в функцию будут переданы 2 аргумента - попап элемент и контейнер попапа.
 * @param {Function} openPopupCallback Коллбек функция.
 * @see Controls/_popup/Popup/ManagerController#removeOpenPopupCallback
 */

/**
 * Метод, который удаляет переданную фунцию из стека коллбек функций.
 * @function Controls/_popup/Popup/ManagerController#removeOpenPopupCallback
 * @param {Function} openPopupCallback Коллбек функция, которую нужно удалить.
 * @see Controls/_popup/Popup/ManagerController#setOpenPopupCallback
 */

// Модуль, необходимый для работы окон/панелей в слое совместимости
// В WS2/WS3 модулях нет возможности работать через события, чтобы вызвать методы по работе с окнами
// т.к. хелперы/инстансы старых компонентов могут не лежать в верстке.
// (а если и лежат, то нет возможности общаться с Manager)

class GlobalController {
    private _controller;
    private _container: Container;
    private _indicator: Control;
    private _contentData: IContentData;
    private _rightTemplate: string;
    private _rightBottomTemplate: string;
    private _rightTemplateVisible: boolean;
    private _stackPosition: string = 'right';
    private _theme: string;
    private _openPopupCallbacks: Function[] = [];
    private _pageTemplate: string;
    private _dataLoaderModule: string;

    private _allowAdaptive: boolean = true;

    private _accordionTemplate: stirng;

    setController(controller): void {
        this._controller = controller;
    }

    getController() {
        return this._controller;
    }

    // TODO: Убрать после того, как переведем прикладинков на новое апи https://online.sbis.ru/opendoc.html?guid=1bd40f3c-89e4-419e-9b21-97aadf293fab&client=3
    find(id: string) {
        return this._controller.find(id);
    }

    // TODO: Убрать после того, как переведем прикладинков на новое апи https://online.sbis.ru/opendoc.html?guid=1bd40f3c-89e4-419e-9b21-97aadf293fab&client=3
    getManager() {
        return this._controller;
    }

    // Регистрируем индикатор, лежащий в application.
    // Необходимо для того, чтобы старый индикатор на вдомной странице мог работать через новый компонент
    // COMPATIBLE
    setIndicator(indicator: Control): void {
        this._indicator = indicator;
    }

    getIndicator(): Control {
        return this._indicator;
    }

    setContainer(container: Container): void {
        this._container = container;
    }

    getContainer(): Container {
        return this._container;
    }

    setTheme(themeName: string): void {
        this._theme = themeName;
    }

    getTheme(): string {
        return this._theme;
    }

    // устаревший способ предзагрузить данные
    loadData(dataLoaders: unknown[]): Promise<unknown> {
        const loaderModule = this.getDataLoaderModule();
        if (!loaderModule) {
            const message =
                'На приложении не задан загрузчик данных. Опция окна dataLoaders будет проигнорирована';
            Logger.warn(message, this);
            return undefined;
        }
        return new Promise((resolve, reject) => {
            this._getModuleByModuleName(loaderModule, (DataLoader) => {
                DataLoader.load(dataLoaders).then(resolve, reject);
            });
        });
    }

    setContentData(data: IContentData): void {
        this._contentData = data;
    }

    getContentData(): IContentData {
        return this._contentData;
    }

    setRightPanelBottomTemplate(rightTemplate: string, visible: boolean = true): void {
        this._rightBottomTemplate = rightTemplate;
        this._rightTemplateVisible = visible;
    }

    getRightPanelBottomTemplate(): string {
        return this._rightBottomTemplate;
    }

    setStackPosition(position: string): void {
        this._stackPosition = position;
    }

    getStackPosition(): string {
        return this._stackPosition;
    }

    hasRightPanel(): boolean {
        // На старых страницах настройки на приложении нет, отключаю для темной темы руками, т.к.
        // в облаке правая панель выключена и на вдомных страницах.
        const compatible = !isNewEnvironment() && this._theme !== 'default__dark';
        return (
            (!!this._rightBottomTemplate && this._rightTemplateVisible) ||
            !!this._rightTemplate ||
            compatible
        );
    }

    setRightTemplate(template: string): void {
        this._rightTemplate = template;
    }

    getRightTemplate(): string {
        return this._rightTemplate;
    }

    getDataLoaderModule(): string {
        return this._dataLoaderModule;
    }

    setDataLoaderModule(dataLoaderModule: string): string {
        this._dataLoaderModule = dataLoaderModule;
    }

    // Из-за того что контроллер синглтон,он возвращает одно и то же значение для всех пользователей
    // на отдельной странице. Есть страницы, на которых не устанавливают аккордеон и падает ошибка гидратации.
    // TODO: Найти общее решение https://online.sbis.ru/opendoc.html?guid=527a29d5-8417-4143-9050-0ca37edb88bf&client=3
    setAccordionTemplate(accordionTemplate: string): void {
        if (constants.isServerSide) {
            const receivedAccordionTemplate = new ReceivedAccordionTemplate();
            receivedAccordionTemplate.setState(accordionTemplate);
            getStateReceiver().register(UID, receivedAccordionTemplate);
        } else {
            this._accordionTemplate = accordionTemplate;
        }
    }

    getAccordionTemplate(): string {
        const storeValue = getStore(UID)?.get('accordionTemplate');
        if (!storeValue) {
            const receivedAccordionTemplate = new ReceivedAccordionTemplate();
            getStateReceiver().register(UID, receivedAccordionTemplate);
            return receivedAccordionTemplate.getState();
        }
        return storeValue || this._accordionTemplate;
    }

    _getModuleByModuleName(moduleName: string, callback: Function): void {
        const module = getModuleByName(moduleName);
        if (module) {
            callback(module);
        } else {
            loadModule(moduleName).then((loadedModule) => {
                callback(loadedModule);
            });
        }
    }

    setOpenPopupCallback(openPopupCallback: Function): void {
        const index = this._openPopupCallbacks.indexOf(openPopupCallback);
        if (index === -1) {
            this._openPopupCallbacks.push(openPopupCallback);
        } else {
            Logger.error(
                'Controls/popup/Controller: Попытка установить уже существующий коллбек в методе setOpenPopupCallback'
            );
        }
    }

    getOpenPopupCallbacks(): Function[] {
        return this._openPopupCallbacks;
    }

    removeOpenPopupCallback(openPopupCallback: Function): void {
        const index = this._openPopupCallbacks.indexOf(openPopupCallback);
        if (index !== -1) {
            this._openPopupCallbacks.splice(index, 1);
        } else {
            Logger.error(
                'Controls/popup/Controller: Попытка удалить несуществующий коллбек в методе removeOpenPopupCallback'
            );
        }
    }

    // Используется для устаревшего способа презагрузки данных в окне через pageId
    setPageTemplate(template: string): void {
        this._pageTemplate = template;
    }

    getPageTemplate(): string {
        return this._pageTemplate;
    }

    // TODO: Удалить после https://online.sbis.ru/opendoc.html?guid=a655427d-f00c-42a1-bc40-685a056f70dd&client=3

    setIsAdaptive(isAdaptive: boolean): void {
        this._allowAdaptive = isAdaptive;
    }
    getIsAdaptive(): boolean {
        return this._allowAdaptive;
    }
}

export default new GlobalController();
