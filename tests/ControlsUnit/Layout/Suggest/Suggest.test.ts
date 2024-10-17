import { _InputController } from 'Controls/suggest';
import { Deferred } from 'Types/deferred';
import { SyntheticEvent } from 'UI/Vdom';
import { List, RecordSet } from 'Types/collection';
import { constants } from 'Env/Env';
import { Stack } from 'Controls/popup';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { SearchResolver as SearchResolverController } from 'Controls/search';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { PrefetchProxy } from 'Types/source';
import { IHistoryItem, IHistoryStore } from 'Controls/HistoryStore';

describe('Controls/suggest', () => {
    describe('Controls.Container.Suggest.Layout', () => {
        const IDENTIFICATORS = [1, 2, 3];

        const getMemorySource = (): Memory => {
            return new Memory({
                data: [{ id: 1 }, { id: 2 }, { id: 3 }],
            });
        };

        const getComponentObject = (customOptions: object = {}) => {
            const controller = new _InputController({});
            const options = {
                source: getMemorySource(),
                suggestTemplate: {},
                footerTemplate: {},
                minSearchLength: 3,
            };
            controller.saveOptions({ ...options, ...customOptions });
            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(controller, '_forceUpdate').mockClear().mockImplementation();
            return controller;
        };

        const getRecentKeys = (component: _InputController) => {
            return component._getRecentKeys();
        };

        _InputController._getRecentKeys = () => {
            return Deferred.success(IDENTIFICATORS);
        };

        const getHistorySource = (component: _InputController) => {
            return component._getHistoryStore();
        };

        _InputController._getHistoryStore = () => {
            return {
                addCallback(func) {
                    func({
                        update(item) {
                            item._isUpdateHistory = true;
                        },
                    });
                },
            };
        };

        // it('Suggest::_getHistoryStore', (done) => {
        //     const controller = getComponentObject({
        //         historyId: 'TEST_HISTORY_ID_GET_SOURCE',
        //     });
        //     getHistorySource(controller).then(async (historyService: IHistoryStore) => {
        //         await historyService.push('TEST_HISTORY_ID_GET_SOURCE', 12);
        //         expect(
        //             historyService
        //                 .getLocal('TEST_HISTORY_ID_GET_SOURCE')
        //                 .recent?.getRecordById(12)
        //                 .getKey()
        //         ).toEqual(12);
        //         expect(
        //             historyService
        //                 .getLocal('TEST_HISTORY_ID_GET_SOURCE')
        //                 .recent?.getRecordById(12)
        //                 .get('HistoryId')
        //         ).toEqual('TEST_HISTORY_ID_GET_SOURCE');
        //         done();
        //     });
        // });

        it('Suggest::_suggestStateNotify', () => {
            const inputContainer = getComponentObject({
                suggestState: true,
            });
            let stateNotifyed = false;
            inputContainer._notify = (eventName, args) => {
                stateNotifyed = true;
            };
            inputContainer._forceUpdate = jest.fn();
            inputContainer._suggestStateNotify(true);
            expect(stateNotifyed).toBe(false);

            inputContainer._suggestStateNotify(false);
            expect(stateNotifyed).toBe(true);
        });

        it('Suggest::close', async () => {
            let state;
            let isReady = true;
            let isCallCancel = false;
            let isSourceControllerNulled = false;
            let isTimerCleared = false;

            const inputContainer = getComponentObject();
            await inputContainer._makeLoad(inputContainer._options);
            inputContainer._searchResolverController = {
                clearTimer: () => {
                    return (isTimerCleared = true);
                },
            };

            inputContainer._getSourceController().destroy = () => {
                isSourceControllerNulled = true;
            };

            inputContainer._notify = (eventName, args) => {
                if (eventName === 'suggestStateChanged') {
                    state = args[0];
                }
            };
            inputContainer._dependenciesDeferred = {
                isReady: () => {
                    return isReady;
                },
                cancel: () => {
                    isCallCancel = true;
                },
            };
            inputContainer.closeSuggest();
            expect(state).toBe(false);
            expect(isCallCancel).toBe(false);

            expect(isSourceControllerNulled).toBe(true);
            expect(isTimerCleared).toBe(true);
            expect(inputContainer._sourceController).toEqual(undefined);
            expect(inputContainer._searchResult).toBeNull();

            isReady = false;
            inputContainer.closeSuggest();
            expect(isCallCancel).toBe(true);
            expect(inputContainer._dependenciesDeferred).toEqual(null);
        });

        it('Suggest::_closeHandler', () => {
            const suggestComponent = getComponentObject();
            let propagationStopped = false;
            const event = {
                stopPropagation: () => {
                    propagationStopped = true;
                },
            };
            suggestComponent._loading = true;
            suggestComponent._showContent = true;
            suggestComponent.activate = jest.fn();

            suggestComponent._closeHandler(event);
            expect(propagationStopped).toBe(true);
            expect(suggestComponent._loading).toEqual(null);
            expect(suggestComponent._showContent).toEqual(false);
        });

        it('Suggest::_open', async () => {
            const inputContainer = getComponentObject({
                suggestState: false,
            });
            let state;

            inputContainer._inputActive = true;
            inputContainer._notify = (eventName, args) => {
                state = args[0];
            };
            inputContainer._forceUpdate = jest.fn();
            await inputContainer._open();
            expect(state).toBe(true);

            state = false;
            inputContainer._options.suggestState = false;
            inputContainer._inputActive = false;
            await inputContainer._open();
            expect(state).toBe(false);
        });

        it('Suggest::_shouldShowSuggest', () => {
            const inputContainer = getComponentObject();
            inputContainer._inputActive = true;
            const result = new List({ items: [1, 2, 3] });
            const emptyResult = new List();

            // case 1. emptyTemplate - is null/undefined, searchValue - is empty string/null
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(false);

            // case 2. emptyTemplate is set, searchValue - is empty string/null
            inputContainer._options.emptyTemplate = {};
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(true);

            // case 3. emptyTemplate is set, searchValue - is set
            inputContainer._inputSearchValue = 'test';
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(true);

            // case 4. emptyTemplate is set, search - is empty string, historyId is set
            inputContainer._inputSearchValue = '';
            inputContainer._options.historyId = '123';
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(false);
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);

            // emptyTemplate is set, search - is set, historyId is set
            inputContainer._inputSearchValue = '123';
            inputContainer._options.historyId = '123';
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(true);
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);

            inputContainer._tabsSelectedKey = 'testTab';
            inputContainer._inputSearchValue = '';
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(true);
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);

            // case 6. emptyTemplate is null/undefined, search - is empty string, historyId is set
            inputContainer._options.emptyTemplate = null;
            expect(!!inputContainer._shouldShowSuggest(emptyResult)).toBe(false);
            expect(!!inputContainer._shouldShowSuggest(result)).toBe(true);
        });

        it('_suggestDirectionChangedCallback', async () => {
            const inputController = getComponentObject();
            await inputController._makeLoad(inputController._options);

            inputController._suggestOpened = false;
            inputController._suggestDirectionChangedCallback('up');
            expect(inputController._suggestDirection).toBeNull();

            inputController._suggestOpened = true;
            inputController._sourceController = null;
            expect(inputController._suggestDirection).toBeNull();
        });

        it('Suggest::_prepareFilter', () => {
            const inputContainer = getComponentObject();
            const resultFilter = {
                currentTab: 1,
                searchParam: 'test',
                filterTest: 'filterTest',
            };

            inputContainer._historyKeys = [1, 2];
            inputContainer._inputSearchValue = 'test';
            let filter = inputContainer._prepareFilter(
                { filterTest: 'filterTest' },
                'searchParam',
                3,
                1
            );
            expect(filter).toEqual(resultFilter);

            const newFilter = { ...resultFilter, ...{ historyKeys: [1, 2] } };
            newFilter.searchParam = '';
            filter = inputContainer._prepareFilter(
                { filterTest: 'filterTest' },
                'searchParam',
                20,
                1
            );
            expect(filter).toEqual(newFilter);
        });

        it('Suggest::_setFilter', () => {
            const inputContainer = getComponentObject();
            inputContainer._options.searchParam = 'searchParam';
            inputContainer._inputSearchValue = 'test';
            inputContainer._tabsSelectedKey = 1;
            const filter = {
                test: 'test',
            };
            const resultFilter = {
                searchParam: 'test',
                test: 'test',
                currentTab: 1,
            };
            inputContainer._setFilter(filter, inputContainer._options);
            expect(inputContainer._filter).toEqual(resultFilter);
            // TODO: Нужен кейс на sourceController().setFilter?
        });

        it('Suggest::_loadStart', () => {
            const inputContainer = getComponentObject();
            let isCallShowIndicator = false;
            let isCallHideIndicator = false;
            let errorFired = false;

            inputContainer._children.indicator = {
                show: () => {
                    return (isCallShowIndicator = true);
                },
                hide: () => {
                    return (isCallHideIndicator = true);
                },
            };

            inputContainer._loadStart();
            expect(inputContainer._loading).toBe(true);

            inputContainer._children = {};
            try {
                inputContainer._loadStart();
            } catch (e) {
                errorFired = true;
            }
            expect(errorFired).toBe(false);
        });

        it('Suggest::_loadEnd', () => {
            const options = {
                searchDelay: 300,
                suggestState: true,
                source: new Memory(),
            };
            const inputContainer = new _InputController({});
            let errorFired = false;

            inputContainer._loading = null;
            inputContainer.saveOptions(options);
            inputContainer._children = {};

            try {
                inputContainer._loadEnd();
            } catch (e) {
                errorFired = true;
            }

            expect(errorFired).toBe(false);
            expect(inputContainer._loading).toEqual(null);

            inputContainer._loading = true;
            inputContainer._loadEnd();
            expect(inputContainer._loading).toEqual(null);

            inputContainer._loading = true;
            inputContainer._loadEnd(new RecordSet({ rawData: [1] }));
            expect(inputContainer._loading).not.toBe(true);

            inputContainer._destroyed = false;
            inputContainer._showContent = true;
            inputContainer._loadEnd(null);
            expect(inputContainer._showContent).toBe(false);
        });

        it('Suggest::_searchErrback', () => {
            let isErrorCallbackCalled = false;
            const inputContainer = getComponentObject({
                searchErrorCallback: () => {
                    isErrorCallbackCalled = true;
                },
            });
            let isIndicatorVisible = true;
            inputContainer._forceUpdate = jest.fn();
            inputContainer._children = {};
            inputContainer._children.indicator = {
                hide: () => {
                    isIndicatorVisible = false;
                },
            };

            inputContainer._loading = null;
            inputContainer._searchErrback({ canceled: true });
            expect(inputContainer._loading === null).toBe(true);
            expect(isErrorCallbackCalled).toBe(true);

            inputContainer._loading = true;
            inputContainer._searchErrback({ canceled: true });
            expect(inputContainer._loading).toBe(false);

            inputContainer._loading = true;
            inputContainer._searchErrback({ canceled: false });
            expect(isIndicatorVisible).toBe(false);
            expect(inputContainer._loading).toBe(false);
        });

        it('Suggest::_searchErrback without children', async () => {
            const inputContainer = getComponentObject();
            inputContainer._children = {};
            await inputContainer._makeLoad(inputContainer._options);

            inputContainer._loading = true;
            inputContainer._searchErrback({ canceled: false });
            expect(inputContainer._loading).toBe(false);
        });

        it('Suggest::searchErrback', async () => {
            const suggest = getComponentObject();
            await suggest._makeLoad(suggest._options);
            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(suggest, '_forceUpdate').mockClear().mockImplementation();
            suggest._loading = true;
            suggest._searchErrback({ canceled: true });
            expect(suggest._loading).toBe(false);
        });

        it('Suggest::_showAllClick', async () => {
            const suggest = getComponentObject();
            let stackOpened = false;
            const eventResult = false;
            let openCfg;

            await suggest._makeLoad(suggest._options);
            suggest._notify = (event, options) => {
                openCfg = options;
                return eventResult;
            };
            suggest._showContent = true;
            Stack.openPopup = () => {
                stackOpened = true;
            };

            suggest._options.suggestTemplate = {
                templateName: 'test',
                templateOptions: {},
            };

            suggest._showAllClick();

            expect(stackOpened).toBe(false);
            expect(suggest._showContent).toBe(false);
            expect(!!openCfg).toBe(true);
        });

        it('Suggest::_moreClick', async () => {
            let isNotifyShowSelector = false;
            const suggest = getComponentObject();
            await suggest._makeLoad(suggest._options);

            Stack.openPopup = jest.fn();

            suggest._options.suggestTemplate = {
                templateName: 'test',
                templateOptions: {},
            };

            suggest._notify = (eventName, data) => {
                if (eventName === 'showSelector') {
                    isNotifyShowSelector = true;
                    expect(data[0].templateOptions.filter).toEqual(suggest._filter);
                }
            };
            suggest._filter = {};
            suggest._moreClick();
            expect(isNotifyShowSelector).toBe(true);
        });

        describe('Suggest::_resolveLoad', () => {
            let inputContainer;

            beforeEach(() => {
                inputContainer = getComponentObject({
                    searchStartCallback: jest.fn(),
                    searchParam: 'testtt',
                    dataLoadCallback: jest.fn(),
                });
                jest.spyOn(SourceController.prototype, 'setItems').mockClear();
                jest.spyOn(inputContainer, '_loadEnd').mockClear();
            });

            it('value is cleared', async () => {
                const value = '';
                inputContainer._inputActive = true;
                await inputContainer._resolveLoad(value);
                expect(inputContainer._inputSearchValue).toEqual(value);
                expect(!inputContainer._showContent).toBe(true);
            });
        });

        it('Suggest::_resolveSearch', async () => {
            const inputContainer = getComponentObject({
                searchDelay: 300,
                minSearchLength: 3,
            });

            const resolverSpy = jest
                .spyOn(SearchResolverController.prototype, 'resolve')
                .mockClear();

            await inputContainer._resolveSearch('test');

            expect(inputContainer._searchResolverController).toBeInstanceOf(
                SearchResolverController
            );
            expect(resolverSpy).toHaveBeenCalledWith('test');
        });

        describe('Suggest::_searchResetCallback', () => {
            let inputContainer;
            let setItemsSpy;

            beforeEach(() => {
                inputContainer = getComponentObject();
                setItemsSpy = jest
                    .spyOn(inputContainer, '_setItems')
                    .mockClear()
                    .mockImplementation();
            });

            // it('openWithHistory case :: suggest should stay opened', async () => {
            //     await inputContainer._makeLoad(inputContainer._options);
            //     jest.spyOn(inputContainer, '_openWithHistory').mockClear().mockImplementation();
            //     jest.spyOn(inputContainer, '_shouldSearch')
            //         .mockClear()
            //         .mockImplementation(() => {
            //             return false;
            //         });
            //     inputContainer._options.historyId = 'historyField';
            //     inputContainer._options.suggestState = false;
            //     inputContainer._options.autoDropDown = false;
            //     inputContainer._inputActive = true;
            //     await inputContainer._searchResetCallback();
            //
            //     expect(setItemsSpy).toHaveBeenCalledTimes(1);
            // });

            it('default case with autoDropDown :: suggest should stay opened', async () => {
                await inputContainer._makeLoad(inputContainer._options);
                jest.spyOn(inputContainer, '_shouldSearch')
                    .mockClear()
                    .mockImplementation(() => {
                        return true;
                    });
                jest.spyOn(inputContainer, '_open').mockClear().mockImplementation();
                jest.spyOn(inputContainer, '_setFilter').mockClear().mockImplementation();

                inputContainer._options.historyId = 'historyField';
                inputContainer._options.suggestState = false;
                inputContainer._options.autoDropDown = true;
                inputContainer._inputActive = true;
                await inputContainer._searchResetCallback();

                expect(setItemsSpy).toHaveBeenCalled();
            });

            it('only autoDropDown :: suggest should stay opened', async () => {
                await inputContainer._makeLoad(inputContainer._options);
                jest.spyOn(inputContainer, '_shouldSearch')
                    .mockClear()
                    .mockImplementation(() => {
                        return true;
                    });

                inputContainer._options.historyId = undefined;
                inputContainer._options.autoDropDown = true;
                inputContainer._inputActive = true;
                await inputContainer._searchResetCallback();

                expect(setItemsSpy).toHaveBeenCalledTimes(1);
            });

            it('autoDropDown is False :: suggest should close, setItems not called', async () => {
                await inputContainer._makeLoad(inputContainer._options);
                jest.spyOn(inputContainer, '_shouldSearch')
                    .mockClear()
                    .mockImplementation(() => {
                        return false;
                    });
                const closeSpy = jest.spyOn(inputContainer, '_close').mockClear();

                inputContainer._options.historyId = undefined;
                inputContainer._options.autoDropDown = false;
                await inputContainer._searchResetCallback();

                expect(setItemsSpy).not.toHaveBeenCalled();
                expect(closeSpy).toHaveBeenCalledTimes(1);
            });

            it('autoDropDown is False :: suggest should close', async () => {
                jest.spyOn(inputContainer, '_shouldSearch')
                    .mockClear()
                    .mockImplementation(() => {
                        return false;
                    });
                const closeSpy = jest.spyOn(inputContainer, '_close').mockClear();

                await inputContainer._makeLoad(inputContainer._options);
                inputContainer._options.historyId = undefined;
                inputContainer._options.autoDropDown = false;
                inputContainer._getSourceController().setItems(
                    new RecordSet({
                        rawData: [{ id: 1 }, { id: 2 }],
                        keyProperty: 'id',
                    })
                );
                await inputContainer._searchResetCallback();

                expect(setItemsSpy).not.toHaveBeenCalled();
                expect(closeSpy).toHaveBeenCalledTimes(1);
            });
        });

        it('Suggest::_loadDependencies', async () => {
            const inputContainer = getComponentObject();
            const options = {
                footerTemplate: 'test',
                suggestTemplate: 'test',
                emptyTemplate: 'test',
            };
            await inputContainer._loadDependencies(options);

            expect(inputContainer._dependenciesDeferred.isReady()).toBe(true);

            const dep = inputContainer._dependenciesDeferred;
            inputContainer._getTemplatesToLoad = jest.fn().mockReturnValue([]);
            await inputContainer._loadDependencies(options);
            expect(inputContainer._dependenciesDeferred).toEqual(dep);
        });

        it('Suggest::_processResultData', async () => {
            const navigation = {
                source: 'page',
                view: 'page',
                sourceConfig: {
                    pageSize: 2,
                    page: 0,
                    hasMore: false,
                },
            };

            const inputContainer = getComponentObject({
                navigation,
                source: getMemorySource(),
            });
            await inputContainer._makeLoad(inputContainer._options);
            const queryRecordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }, { id: 3 }],
                keyProperty: 'id',
            });

            inputContainer._notify = jest.fn();
            inputContainer._inputSearchValue = 'notEmpty';
            inputContainer._inputActive = true;
            inputContainer._errorConfig = { errorField: 'errorValue' };

            queryRecordSet.setMetaData({
                results: new Model({
                    rawData: {
                        tabsSelectedKey: 'testId',
                        switchedStr: 'testStr',
                    },
                }),
                more: 10,
            });

            inputContainer._getSourceController().setItems(queryRecordSet);
            inputContainer._processResultData(queryRecordSet);

            expect(inputContainer._searchResult).toEqual(queryRecordSet);
            expect(inputContainer._tabsSelectedKey).toEqual('testId');
            expect(inputContainer._misspellingCaption).toEqual('testStr');
            expect(inputContainer._moreCount).toEqual(7);
            expect(inputContainer._errorConfig).toBeNull();

            const queryRecordSetEmpty = new RecordSet();
            queryRecordSetEmpty.setMetaData({
                results: new Model({
                    rawData: {
                        tabsSelectedKey: 'testId2',
                        switchedStr: 'testStr2',
                    },
                }),
            });
            inputContainer._suggestMarkedKey = 'test';

            inputContainer._sourceController = null;
            inputContainer._getSourceController().setItems(queryRecordSetEmpty);

            inputContainer._processResultData(queryRecordSetEmpty);

            expect(inputContainer._suggestMarkedKey).toEqual(null);
            expect(inputContainer._searchResult).not.toEqual(queryRecordSet);
            expect(inputContainer._searchResult).toBeNull();
            expect(inputContainer._tabsSelectedKey).toEqual(null);
            expect(inputContainer._misspellingCaption).toEqual(null);
        });

        it('Suggest::_beforeMount', () => {
            const suggestComponent = getComponentObject();

            suggestComponent._beforeMount({
                searchParam: 'title',
                minSearchLength: 3,
                filter: { test: 5 },
                value: '123',
                source: getMemorySource(),
            });

            expect(suggestComponent._filter).toEqual({
                test: 5,
                title: '123',
            });
        });

        it('Suggest::_beforeUpdate', async () => {
            const suggestComponent = getComponentObject({
                emptyTemplate: 'anyTpl',
                footerTemplate: 'anyTp',
                suggestState: true,
                value: '',
                trim: true,
                searchParam: 'testSearchParam',
                minSearchLength: 3,
            });
            suggestComponent._loadDependencies = () => {
                return Promise.resolve(true);
            };
            const dependenciesDeferred = {
                isReady: () => {
                    return true;
                },
            };
            suggestComponent._loading = true;
            suggestComponent._showContent = true;
            suggestComponent._dependenciesDeferred = dependenciesDeferred;
            suggestComponent._inputActive = true;
            suggestComponent._suggestMarkedKey = 'test';

            await suggestComponent._beforeUpdate({
                suggestState: false,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: 'te',
                source: getMemorySource(),
            });
            expect(suggestComponent._showContent).toBe(false);
            expect(suggestComponent._loading).toEqual(null);
            expect(suggestComponent._dependenciesDeferred).toEqual(dependenciesDeferred);
            expect(suggestComponent._inputSearchValue).toEqual('');
            expect(suggestComponent._filter).toEqual(null);
            expect(suggestComponent._suggestMarkedKey).toEqual(null);

            await suggestComponent._beforeUpdate({
                suggestState: false,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: '   ',
                source: getMemorySource(),
            });
            expect(suggestComponent._filter).toEqual(null);
            expect(suggestComponent._inputSearchValue).toEqual('');

            await suggestComponent._beforeUpdate({
                suggestState: false,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: 'test',
                searchParam: 'testSearchParam',
                minSearchLength: 3,
                source: getMemorySource(),
            });
            expect(suggestComponent._filter).toEqual({
                testSearchParam: 'test',
            });
            expect(suggestComponent._inputSearchValue).toEqual('test');
            expect(suggestComponent._searchValue).toEqual('');

            const notifySpy = jest.spyOn(suggestComponent, '_notify').mockClear();

            suggestComponent._options.suggestState = true;
            suggestComponent._options.value = 'test';
            await suggestComponent._beforeUpdate({
                suggestState: true,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: '',
                source: getMemorySource(),
            });
            expect(suggestComponent._inputSearchValue).toEqual('');
            expect(suggestComponent._dependenciesDeferred).toEqual(dependenciesDeferred);
            expect(notifySpy).toHaveBeenCalledWith('suggestStateChanged', [false]);

            suggestComponent._inputSearchValue = 'test';
            await suggestComponent._beforeUpdate({
                suggestState: false,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: '',
                searchParam: 'testSearchParam',
                source: getMemorySource(),
            });
            expect(suggestComponent._filter).toEqual({ testSearchParam: '' });
            expect(suggestComponent._inputSearchValue).toEqual('');
            expect(suggestComponent._notify).toHaveBeenCalledTimes(4);

            suggestComponent._options.suggestState = false;
            suggestComponent._options.value = '';
            await suggestComponent._beforeUpdate({
                suggestState: false,
                value: 'test',
                minSearchLength: 3,
                source: getMemorySource(),
            });
            expect(suggestComponent._inputSearchValue).toEqual('test');
            expect(suggestComponent._notify).toHaveBeenCalledTimes(4);

            suggestComponent._options.validationStatus = 'valid';
            suggestComponent._inputSearchValue = '';
            await suggestComponent._beforeUpdate({
                suggestState: true,
                value: '',
                validationStatus: 'invalid',
                source: getMemorySource(),
            });
            expect(suggestComponent._loading).toBeNull();

            suggestComponent._options.validationStatus = 'invalid';
            suggestComponent._options.suggestState = true;
            suggestComponent._loading = true;
            await suggestComponent._beforeUpdate({
                suggestState: true,
                value: '',
                validationStatus: 'invalid',
                source: getMemorySource(),
            });
            expect(suggestComponent._loading).toBe(true);

            suggestComponent._options.value = '';
            suggestComponent._inputSearchValue = '';
            await suggestComponent._beforeUpdate({
                suggestState: false,
                value: null,
                source: getMemorySource(),
            });
            expect(suggestComponent._inputSearchValue).toEqual('');

            suggestComponent._inputActive = false;
            await suggestComponent._beforeUpdate({
                suggestState: false,
                emptyTemplate: 'anotherTpl',
                footerTemplate: 'anotherTpl',
                value: 'test',
                searchParam: 'testSearchParam',
                minSearchLength: 3,
                source: getMemorySource(),
            });
            expect(suggestComponent._filter).toEqual({
                testSearchParam: 'test',
            });
            expect(suggestComponent._inputSearchValue).toEqual('test');

            suggestComponent._dependenciesDeferred = dependenciesDeferred;
            suggestComponent._options.suggestState = false;
            suggestComponent._options.value = undefined;
            suggestComponent._inputSearchValue = 'testValue';
            suggestComponent._searchResult = undefined;

            const resolveLoadStub = jest
                .spyOn(suggestComponent, '_resolveLoad')
                .mockClear()
                .mockImplementation(() => {
                    return Promise.resolve();
                });
            const newOptions = {
                suggestState: true,
                searchParam: 'testSearchParam',
                minSearchLength: 3,
                source: getMemorySource(),
            };
            await suggestComponent._beforeUpdate(newOptions);

            expect(resolveLoadStub).toHaveBeenCalledWith('testValue', newOptions);

            suggestComponent._options.suggestState = true;
            suggestComponent._inputSearchValue = '';
            suggestComponent._searchResult = undefined;
            suggestComponent._options.filter = { param: 'old_test' };
            suggestComponent._showContent = true;
            resolveLoadStub.mockClear();

            suggestComponent._inputSearchValue = 'test';
            const resolveSearchStub = jest
                .spyOn(suggestComponent, '_resolveSearch')
                .mockClear()
                .mockImplementation(() => {
                    return Promise.resolve();
                });
            await suggestComponent._beforeUpdate({
                suggestState: true,
                searchParam: 'testSearchParam',
                minSearchLength: 3,
                source: getMemorySource(),
                filter: { param: 'new_test' },
            });

            expect(resolveSearchStub).toHaveBeenCalledTimes(1);
        });

        describe('_beforeUpdate hook', () => {
            it('source is empty on mount', async () => {
                const options = {
                    emptyTemplate: 'anyTpl',
                    footerTemplate: 'anyTp',
                    suggestState: true,
                    value: '',
                    trim: true,
                    searchParam: 'testSearchParam',
                    minSearchLength: 3,
                    suggestListsOptions: {
                        0: {
                            id: 0,
                            source: null,
                        },
                    },
                };

                const inputController = getComponentObject(options);

                expect(!inputController._dataLoader).toBeTruthy();

                options.suggestListsOptions[0].source = new Memory();
                inputController._beforeUpdate(options);
                inputController.saveOptions(options);
                await inputController._makeLoad(inputController._options);

                expect(!!inputController._getSourceController().getState().source).toBeTruthy();
            });

            it('value and suggestState are changed in options while loading', async () => {
                let options = {
                    emptyTemplate: 'anyTpl',
                    footerTemplate: 'anyTp',
                    suggestState: false,
                    value: '',
                    trim: true,
                    searchParam: 'testSearchParam',
                    minSearchLength: 3,
                    source: new Memory(),
                };

                const inputController = getComponentObject(options);
                await inputController._beforeMount(options);
                await inputController._getSearchResolver();

                await inputController._changeValueHandler({}, 'newValue');

                options = { ...options };
                options.value = 'newValue';
                options.suggestState = true;
                inputController._beforeUpdate(options);
                expect(!inputController._searchResolverController._delayTimer).toBeTruthy();
            });

            it('value is cleared', async () => {
                let options = {
                    emptyTemplate: 'anyTpl',
                    footerTemplate: 'anyTp',
                    suggestState: false,
                    value: 'newValue',
                    trim: true,
                    searchParam: 'testSearchParam',
                    minSearchLength: 3,
                    source: new Memory(),
                };

                const inputController = getComponentObject(options);
                await inputController._beforeMount(options);
                inputController.saveOptions(options);
                await inputController._getSearchResolver();

                options = { ...options };
                options.value = '';
                options.suggestState = true;
                await inputController._beforeUpdate(options);
                expect(!inputController._inputSearchValue).toBeTruthy();
            });

            it('navigation is updated', async () => {
                const navigation = {
                    source: 'page',
                    view: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                };
                const options = {
                    suggestState: false,
                    value: 'newValue',
                    trim: true,
                    searchParam: 'title',
                    minSearchLength: 3,
                    source: new Memory({
                        data: [
                            {
                                id: 0,
                                title: 'sasha',
                            },
                            {
                                id: 1,
                                title: 'sasha',
                            },
                        ],
                    }),
                };
                options.navigation = navigation;
                const inputController = getComponentObject(options);
                await inputController._beforeMount(options);
                inputController.saveOptions(options);
                const items = await inputController._resolveLoad('sasha');
                expect(items.getCount()).toEqual(1);
            });
        });

        it('PrefetchProxy source should became to original source type', async () => {
            const inputContainer = getComponentObject({
                searchParam: 'testSearchParam',
                minSearchLength: 3,
                source: new PrefetchProxy({ target: getMemorySource() }),
            });

            await inputContainer._makeLoad(inputContainer._options);

            expect(inputContainer._getSourceController().getState().source).toBeInstanceOf(Memory);
        });

        describe('Suggest::_updateSuggestState', () => {
            let inputContainer;
            let suggestOpened;
            let stub;
            beforeEach(async () => {
                inputContainer = getComponentObject({
                    filter: {},
                    searchParam: 'testSearchParam',
                    minSearchLength: 3,
                    historyId: 'historyField',
                    emptyTemplate: 'test',
                });
                inputContainer._open = () => {
                    suggestOpened = true;
                };
                await inputContainer._makeLoad(inputContainer._options);

                stub = jest
                    .spyOn(inputContainer._getSourceController(), 'getItems')
                    .mockClear()
                    .mockImplementation(() => {
                        return {
                            getCount: () => {
                                return 1;
                            },
                        };
                    });
            });

            beforeEach(() => {
                suggestOpened = false;
            });

            it('suggest with history', () => {
                inputContainer._inputSearchValue = 'te';
                inputContainer._historyKeys = [1, 2];
                inputContainer._inputActive = true;

                inputContainer._options.autoDropDown = true;
                inputContainer._updateSuggestState();
                expect(inputContainer._filter).toEqual({
                    testSearchParam: '',
                    historyKeys: inputContainer._historyKeys,
                });
            });

            it('suggest with searchValue', () => {
                inputContainer._inputSearchValue = 'test';
                inputContainer._inputActive = true;
                inputContainer._updateSuggestState();
                expect(inputContainer._filter).toEqual({
                    testSearchParam: 'test',
                });
            });

            it('autoDropDown = false', async () => {
                jest.spyOn(inputContainer, '_getRecentKeys').mockClear().mockResolvedValue(null);

                inputContainer._options.autoDropDown = false;
                inputContainer._historyKeys = null;
                inputContainer._filter = {};

                await inputContainer._updateSuggestState();
                expect(inputContainer._filter).toEqual({ testSearchParam: '' });
                expect(suggestOpened).toBe(false);
            });

            it('suggestState = true', () => {
                inputContainer._options.autoDropDown = false;
                inputContainer._options.suggestState = true;
                inputContainer._updateSuggestState();
                expect(suggestOpened).toBe(true);
            });

            it('suggestState = true, value is reseted', () => {
                inputContainer._options.autoDropDown = false;
                inputContainer._options.suggestState = true;
                inputContainer._updateSuggestState(true);
                expect(suggestOpened).toBe(false);
            });

            it('without items and history', () => {
                stub.mockImplementation(() => {
                    return {
                        getCount: () => {
                            return 0;
                        },
                    };
                });
                inputContainer._options.autoDropDown = true;
                inputContainer._options.historyId = null;
                inputContainer._filter = {};
                inputContainer._options.emptyTemplate = undefined;
                inputContainer._updateSuggestState();

                expect(inputContainer._filter).toEqual({});
                expect(suggestOpened).toBe(false);
            });
        });

        it('Suggest::_misspellClick', async () => {
            let value;
            const suggestComponent = getComponentObject();

            suggestComponent.activate = () => {
                suggestComponent._inputActive = true;
            };
            suggestComponent._notify = (event, val) => {
                if (event === 'valueChanged') {
                    value = val[0];
                }
            };
            suggestComponent._options.minSearchLength = 3;
            suggestComponent._misspellingCaption = 'test';
            await suggestComponent._misspellClick();

            expect(value).toEqual('test');
            expect(suggestComponent._misspellingCaption).toEqual('');
            expect(suggestComponent._inputSearchValue).toEqual('test');
            expect(suggestComponent._inputActive).toBe(true);
        });

        it('Suggest::_setMisspellingCaption', () => {
            const inputContainer = getComponentObject();

            inputContainer._setMisspellingCaption('test');
            expect(inputContainer._misspellingCaption).toEqual('test');
        });

        // it('Suggest::_select', async () => {
        //     const item: Model<IHistoryItem> = new Model<IHistoryItem>({
        //         keyProperty: 'Object_id',
        //         rawData: {
        //             Object_id: 'testItem',
        //             ObjectData: null,
        //             HistoryId: null,
        //             Counter: 1,
        //         },
        //     });
        //
        //     const suggestComponent = getComponentObject();
        //     jest.spyOn(suggestComponent, '_closePopup').mockClear().mockImplementation();
        //     await suggestComponent._select(null, item);
        //     await expect(
        //         suggestComponent._getHistoryStore().then((store) => {
        //             return store.getLocal('testFieldHistoryId')?.recent?.getRecordById('testItem');
        //         })
        //     ).resolves.toBeUndefined();
        //     suggestComponent._options.historyId = 'testFieldHistoryId';
        //     await suggestComponent._select(null, item);
        //     await expect(
        //         suggestComponent._getHistoryStore().then((store) => {
        //             return store.getLocal('testFieldHistoryId')?.recent?.getRecordById('testItem');
        //         })
        //     ).resolves.toBeTruthy();
        // });

        it('Suggest::markedKeyChangedHandler', () => {
            const suggestComponent = getComponentObject();
            suggestComponent._markedKeyChangedHandler(null, 'test');
            expect(suggestComponent._suggestMarkedKey).toEqual('test');

            suggestComponent._markedKeyChangedHandler(null, 'test2');
            expect(suggestComponent._suggestMarkedKey).toEqual('test2');
        });

        it('Suggest::_keyDown', () => {
            const suggestComponent = getComponentObject();
            let eventPreventDefault = false;
            let eventStopPropagation = false;
            let suggestStateChanged = false;
            let eventTriggered = false;
            let suggestActivated = false;
            suggestComponent._children = {
                inputKeydown: {
                    start: () => {
                        eventTriggered = true;
                    },
                },
            };

            suggestComponent._notify = (event) => {
                if (event === 'suggestStateChanged') {
                    suggestStateChanged = true;
                }
            };

            suggestComponent.activate = () => {
                suggestActivated = true;
            };

            function getEvent(keyCode: number): SyntheticEvent<KeyboardEvent> {
                return {
                    nativeEvent: {
                        keyCode,
                    },
                    preventDefault: () => {
                        eventPreventDefault = true;
                    },
                    stopPropagation: () => {
                        eventStopPropagation = true;
                    },
                };
            }
            suggestComponent._keydown(getEvent(constants.key.down));
            expect(eventPreventDefault).toBe(false);
            expect(eventStopPropagation).toBe(false);
            expect(suggestActivated).toBe(false);

            suggestComponent._options.suggestState = true;

            suggestComponent._keydown(getEvent(constants.key.down));
            expect(eventPreventDefault).toBe(true);
            expect(eventStopPropagation).toBe(true);
            expect(suggestActivated).toBe(true);
            eventPreventDefault = false;
            suggestActivated = false;

            suggestComponent._keydown(getEvent(constants.key.up));
            expect(eventPreventDefault).toBe(true);
            expect(suggestActivated).toBe(true);
            eventPreventDefault = false;
            suggestActivated = false;

            suggestComponent._keydown(getEvent(constants.key.enter));
            expect(eventPreventDefault).toBe(false);
            expect(suggestActivated).toBe(false);
            eventPreventDefault = false;

            suggestComponent._suggestMarkedKey = 'test';
            suggestComponent._keydown(getEvent(constants.key.enter));
            expect(eventPreventDefault).toBe(true);
            expect(suggestActivated).toBe(true);

            eventPreventDefault = false;
            suggestActivated = false;
            suggestComponent._keydown(getEvent('test'));
            expect(eventPreventDefault).toBe(false);
            expect(eventTriggered).toBe(true);
            expect(suggestActivated).toBe(false);

            eventPreventDefault = false;
            suggestComponent._keydown(getEvent(constants.key.esc));
            expect(suggestStateChanged).toBe(true);
            expect(suggestActivated).toBe(false);
        });

        it('Suggest::_openWithHistory', async () => {
            const suggestComponent = getComponentObject({
                minSearchLength: 3,
                searchParam: 'search',
                autoDropDown: true,
            });

            suggestComponent._filter = {};
            suggestComponent._historyKeys = [7, 8];
            suggestComponent._inputSearchValue = '';
            await suggestComponent._openWithHistory();
            expect(suggestComponent._filter).toEqual({
                search: '',
                historyKeys: [7, 8],
            });

            suggestComponent._historyKeys = [];
            suggestComponent._options.autoDropDown = false;
            await suggestComponent._openWithHistory();
            expect(suggestComponent._filter).toEqual({ search: '' });
        });

        // it('Suggest:_getRecentKeys', () => {
        //     const inputContainer = getComponentObject();
        //     return new Promise((resolve) => {
        //         getRecentKeys(inputContainer).addCallback((keys) => {
        //             expect([]).toEqual(keys);
        //             resolve();
        //         });
        //     });
        // });

        it('Suggest::_inputClicked', () => {
            const suggestComponent = getComponentObject();

            suggestComponent._inputClicked({
                nativeEvent: {
                    target: {},
                },
            });
            expect(suggestComponent._inputActive).toBe(true);
        });

        it('Suggest::_closePopup', () => {
            let isClosePopup = false;
            const suggestComponent = new _InputController({});

            suggestComponent._children.layerOpener = {
                close: () => {
                    isClosePopup = true;
                },
            };

            suggestComponent._closePopup();
            expect(isClosePopup).toBe(true);
        });

        describe('_openSelector', () => {
            let isOpenPopup;
            let suggestComponent;

            beforeEach(() => {
                isOpenPopup = false;
                suggestComponent = getComponentObject({
                    suggestTemplate: {},
                });
                suggestComponent._getSelectorOptions = () => {
                    isOpenPopup = true;
                };
            });

            it('dont show selector', async () => {
                isOpenPopup = false;
                suggestComponent._notify = () => {
                    return false;
                };
                await suggestComponent._openSelector({});
                expect(isOpenPopup).toBe(false);
            });
        });

        it('changeValueHandler without suggestTemplate', async () => {
            let searchResolved = false;
            const suggestComponent = getComponentObject({});

            suggestComponent._resolveSearch = () => {
                searchResolved = true;
                return Promise.resolve();
            };
            suggestComponent._options.suggestTemplate = null;

            suggestComponent._changeValueHandler({}, '');
            expect(searchResolved).toBe(false);
        });

        describe('_beforeUnmount', () => {
            it('_beforeUnmount while load dependencies', () => {
                const suggestComponent = getComponentObject(_InputController.getDefaultOptions());
                suggestComponent._loadDependencies(suggestComponent._options);
                expect(suggestComponent._dependenciesDeferred).toBeTruthy();

                suggestComponent._beforeUnmount();
                expect(!suggestComponent._dependenciesDeferred).toBeTruthy();
            });

            it('_beforeUnmount while load searchLib', async () => {
                const suggestComponent = getComponentObject(_InputController.getDefaultOptions());
                suggestComponent._getSearchLibrary();
                expect(suggestComponent._searchLibraryLoader).toBeDefined();

                const spy = jest.spyOn(suggestComponent._searchLibraryLoader, 'cancel').mockClear();
                const rejectPromise = expect(
                    suggestComponent._searchLibraryLoader.promise
                ).rejects.toThrow('Unknown reason');
                suggestComponent._beforeUnmount();
                await rejectPromise;
                expect(spy).toHaveBeenCalledTimes(1);
                expect(suggestComponent._searchLibraryLoader).toBeNull();
            });
        });
    });
});
