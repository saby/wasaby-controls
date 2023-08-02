define([
   'Controls/_baseList/Data/DataInner',
   'Types/source',
   'Types/deferred',
   'Types/collection',
   'Application/Initializer',
   'Application/Env',
   'Controls/dataSource',
   'Browser/Transport'
], function (
   DataInner,
   sourceLib,
   deferredLib,
   collection,
   AppInit,
   AppEnv,
   dataSourceLib,
   Transport
) {
   describe('Container/Data', function () {
      var sourceData = [
         { id: 1, title: 'Sasha' },
         { id: 2, title: 'Dmitry' },
         { id: 3, title: 'Andrey' },
         { id: 4, title: 'Aleksey' },
         { id: 5, title: 'Sasha' },
         { id: 6, title: 'Ivan' }
      ];

      var sourceDataEdited = [
         { id: 1, title: 'Sasha' },
         { id: 2, title: 'Dmitry' },
         { id: 3, title: 'Andrey' },
         { id: 4, title: 'Petr' },
         { id: 5, title: 'Petr' },
         { id: 6, title: 'Petr' }
      ];

      var source = new sourceLib.Memory({
         keyProperty: 'id',
         data: sourceData
      });

      var getDataWithConfig = function (config) {
         var data = new DataInner.default(config);

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(data, '_forceUpdate').mockImplementation();
         data.saveOptions(config);
         return data;
      };

      var setNewEnvironmentValue = function (value) {
         if (value) {
            jest
               .spyOn(AppInit, 'isInit')
               .mockClear()
               .mockImplementation(() => {
                  return true;
               });
            jest
               .spyOn(AppEnv, 'getStore')
               .mockClear()
               .mockImplementation(() => {
                  return {
                     isNewEnvironment: true
                  };
               });
         } else {
            jest
               .spyOn(AppInit, 'isInit')
               .mockClear()
               .mockImplementation(() => {
                  return false;
               });
         }

         return function resetNewEnvironmentValue() {
            jest.restoreAllMocks();
         };
      };

      it('update source', function (done) {
         const dataOptions = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(dataOptions);
         const newSource = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceDataEdited
         });
         let callbackCalled = false;
         const dataLoadCallbackFunction = () => {
            callbackCalled = true;
         };

         data._beforeMount(dataOptions).then(() => {
            data._dataOptionsContext = {};
            const newFilter = { test: 'testFilter' };
            const newOptions = {
               source: newSource,
               idProperty: 'id',
               filter: newFilter,
               dataLoadCallback: dataLoadCallbackFunction
            };
            var loadDef = data._beforeUpdate(newOptions);
            data.saveOptions(newOptions);
            expect(data._loading).toBe(true);
            loadDef.addCallback(function () {
               try {
                  expect(data._contextState.source === newSource).toBe(true);
                  expect(data._filter).toEqual(newFilter);
                  expect(data._loading).toBe(false);
                  expect(callbackCalled).toBe(true);
                  done();
               } catch (e) {
                  done(e);
               }
            });
         });
      });

      it('update source, that returns error', async function () {
         let dataOptions = { source: source, keyProperty: 'id' };

         const data = getDataWithConfig(dataOptions);
         await data._beforeMount(dataOptions);

         const errorSource = new sourceLib.Memory();
         errorSource.query = () => {
            return Promise.reject(
               new Transport.fetch.Errors.HTTP({
                  httpError: Transport.HTTPStatus.GatewayTimeout,
                  message: undefined,
                  url: undefined
               })
            );
         };
         dataOptions = { ...dataOptions };
         dataOptions.source = errorSource;
         data._onDataError = jest.fn();
         const updateResult = await data._beforeUpdate(dataOptions);

         expect(updateResult instanceof Error).toBeTruthy();
         expect(data._errorConfig).toBeTruthy();
         expect(!data._loading).toBeTruthy();
      });

      it('cancel loading while loading data from new source', async function () {
         let dataOptions = { source: source, keyProperty: 'id' };

         const data = getDataWithConfig(dataOptions);
         await data._beforeMount(dataOptions);

         const newSource = new sourceLib.Memory();
         dataOptions = { ...dataOptions };
         dataOptions.source = newSource;
         const loadPromise = data._beforeUpdate(dataOptions);
         data._sourceController.cancelLoading();
         await loadPromise;

         expect(data._contextState.source === newSource).toBeTruthy();
      });

      it('filter, navigation, sorting changed', async () => {
         const dataOptions = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(dataOptions);
         data._contextState = {};

         const newNavigation = {
            view: 'page',
            source: 'page',
            sourceConfig: { pageSize: 2, page: 0, hasMore: false }
         };
         const newFilter = { title: 'Ivan' };
         const newSorting = [{ amount: 'ASC' }];
         await data._beforeMount(dataOptions);
         data.saveOptions(dataOptions);
         await data._beforeUpdate({
            source: source,
            idProperty: 'id',
            filter: newFilter,
            navigation: newNavigation,
            sorting: newSorting
         });

         expect(data._contextState.navigation).toEqual(newNavigation);
         expect(data._contextState.filter).toEqual(newFilter);
         expect(data._contextState.sorting).toEqual(newSorting);
         expect(data._filter).toEqual(newFilter);
      });

      it('source and filter/navigation changed', async () => {
         const dataOptions = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(dataOptions);
         data._contextState = {};

         const newSource = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceDataEdited
         });
         const newNavigation = {
            view: 'page',
            source: 'page',
            sourceConfig: { pageSize: 2, page: 0, hasMore: false }
         };
         const newFilter = { title: 'Ivan' };
         await data._beforeMount(dataOptions);

         const loadDef = data._beforeUpdate({
            source: newSource,
            idProperty: 'id',
            navigation: newNavigation,
            filter: newFilter
         });
         expect(data._contextState.navigation).not.toBeDefined();
         expect(data._filter).toEqual(newFilter);

         return new Promise((resolve, reject) => {
            loadDef
               .addCallback(() => {
                  expect(data._contextState.navigation).toEqual(newNavigation);
                  expect(data._contextState.filter).toEqual(newFilter);
                  expect(data._filter).toEqual(newFilter);
                  resolve();
               })
               .addErrback((error) => {
                  reject(error);
               });
         });
      });

      it('_beforeUpdate filter changed, sourceController in options', async () => {
         let filter = {};
         let options = {
            source,
            keyProperty: 'id',
            filter
         };
         const sourceController = new dataSourceLib.NewSourceController(options);
         options = { ...options, sourceController };
         const data = getDataWithConfig(options);
         await sourceController.reload();
         await data._beforeMount(options);
         data.saveOptions(options);

         options = { ...options };
         filter = { ...filter };
         filter.test = '123';

         data._beforeUpdate(options);
         expect(options.filter).toEqual(data._filter);
      });

      it('_beforeMount with receivedState', function () {
         let data = getDataWithConfig({ source: source, keyProperty: 'id' });
         let newSource = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceData
         });
         const items = new collection.RecordSet({
            rawData: sourceData,
            keyProperty: 'id'
         });
         let resetCallback = setNewEnvironmentValue(true);
         data._beforeMount({ source: newSource, idProperty: 'id' }, {}, { items });

         expect(data._items).toEqual(items);
         expect(data._sourceController.getItems()).toBeTruthy();
         expect(data._sourceController.getState().items).toBeTruthy();
         resetCallback();
      });

      it('_beforeMount with error in receivedState', async function () {
         let options = {
            source,
            keyProperty: 'id',
            filter: {}
         };
         const errorConfig = {};
         const sourceController = new dataSourceLib.NewSourceController(options);
         options = { ...options, sourceController };
         let data = getDataWithConfig(options);
         await data._beforeMount({ source, idProperty: 'id' }, {}, { errorConfig });
         expect(data._errorConfig === errorConfig).toBeTruthy();
      });

      it('_beforeMount with receivedState and prefetchProxy', function () {
         let memory = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceData
         });
         const items = new collection.RecordSet({
            rawData: sourceData,
            keyProperty: 'id'
         });
         let prefetchSource = new sourceLib.PrefetchProxy({
            target: memory,
            data: {
               query: items
            }
         });
         let data = getDataWithConfig({
            source: prefetchSource,
            keyProperty: 'id'
         });
         let resetCallback = setNewEnvironmentValue(true);

         data._beforeMount({ source: prefetchSource, idProperty: 'id' }, {}, { items });

         const sourceControllerState = data._sourceController.getState();
         expect(sourceControllerState.source === memory).toBe(true);
         expect(sourceControllerState.items).toEqual(items);
         expect(data._source === memory).toBe(true);

         resetCallback();
      });

      it('_beforeMount with prefetchProxy', async function () {
         let memory = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceData
         });
         const items = new collection.RecordSet({
            rawData: sourceData,
            keyProperty: 'id'
         });
         let prefetchSource = new sourceLib.PrefetchProxy({
            target: memory,
            data: {
               query: items
            }
         });
         let data = getDataWithConfig({
            source: prefetchSource,
            keyProperty: 'id'
         });

         await data._beforeMount({ source: prefetchSource, idProperty: 'id' }, {});

         const sourceControllerState = data._sourceController.getState();
         expect(sourceControllerState.source === memory).toBe(true);
         expect(sourceControllerState.items).toEqual(items);
         expect(data._source === prefetchSource).toBe(true);
      });

      it('_beforeMount without source', () => {
         const filter = {
            testField: 'testValue'
         };
         const dataOptions = { keyProperty: 'id', filter };
         const data = getDataWithConfig(dataOptions);

         data._beforeMount(dataOptions);
         expect(data._contextState.filter).toEqual(filter);
      });

      it('_beforeMount with root and parentProperty', async () => {
         const data = new sourceLib.DataSet();
         let sourceQuery;
         const dataSource = {
            query: function (query) {
               sourceQuery = query;
               return deferredLib.Deferred.success(data);
            },
            _mixins: [],
            '[Types/_source/ICrud]': true
         };

         const dataOptions = {
            source: dataSource,
            keyProperty: 'id',
            filter: {},
            parentProperty: 'testParentProperty',
            root: 'testRoot'
         };
         const dataContainer = getDataWithConfig(dataOptions);
         await dataContainer._beforeMount(dataOptions);
         expect(sourceQuery.getWhere()).toEqual({
            testParentProperty: 'testRoot'
         });
      });

      it('_beforeMount sourceController in options', () => {
         const memorySource = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceData
         });
         const items = new collection.RecordSet({
            rawData: sourceData,
            keyProperty: 'id'
         });
         const sourceController = new dataSourceLib.NewSourceController({
            source: memorySource
         });
         sourceController.setItems(items);
         const dataOptions = {
            sourceController,
            source: memorySource,
            keyProperty: 'id'
         };
         const dataContainer = getDataWithConfig(dataOptions);
         const mountResult = dataContainer._beforeMount(dataOptions);

         expect(!mountResult).toBe(true);
         expect(dataContainer._sourceController === sourceController).toBe(true);
         expect(dataContainer._items === sourceController.getItems()).toBe(true);
         expect(!dataContainer._errorRegister).toBe(true);
      });

      it('_beforeMount with sourceController and dataLoadCallback in options', async () => {
         const memorySource = new sourceLib.Memory({
            keyProperty: 'id',
            data: sourceData
         });
         const items = new collection.RecordSet({
            rawData: sourceData,
            keyProperty: 'id'
         });
         const sourceController = new dataSourceLib.NewSourceController({
            source: memorySource
         });
         sourceController.setItems(items);
         let dataLoadCallbackItems;
         const dataOptions = {
            sourceController,
            source: memorySource,
            keyProperty: 'id',
            dataLoadCallback: (loadedItems) => {
               dataLoadCallbackItems = loadedItems;
            }
         };
         const dataContainer = getDataWithConfig(dataOptions);
         await dataContainer._beforeMount(dataOptions);

         expect(dataLoadCallbackItems === items).toBe(true);
      });

      it('data source options tests', function (done) {
         var config = { source: null, keyProperty: 'id' },
            data = getDataWithConfig(config);

         // creating without source
         data._beforeMount(config);

         expect(data._source).toEqual(null);
         expect(!!data._contextState).toBe(true);

         // new source received in _beforeUpdate
         data._beforeUpdate({ source: source }).addCallback(function () {
            expect(data._sourceController._options.source === source).toBe(true);
            expect(data._sourceController.getState().items).toBeTruthy();
            done();
         });
      });

      it('update source', async function () {
         const config = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(config);

         await data._beforeMount(config);
         const contextSource = data._contextState.source;
         const newOptions = {
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: sourceDataEdited
            }),
            keyProperty: 'id'
         };
         await data._beforeUpdate(newOptions);
         expect(contextSource !== data._contextState.source).toBe(true);
      });

      it('sourceController is null in _beforeUpdate', async function () {
         let config = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(config);
         await data._beforeMount(config);

         const currentSourceController = data._sourceController;
         config = { ...config, sourceController: null };
         data._beforeUpdate(config);
         expect(data._sourceController).toBeTruthy();
         expect(data._sourceController !== currentSourceController).toBeTruthy();
      });

      it('sourceController is null on _beforeMount and _beforeUpdate', async function () {
         let config = {
            source: source,
            keyProperty: 'id',
            sourceController: null
         };
         const data = getDataWithConfig(config);

         await data._beforeMount(config);
         expect(data._sourceController).toBeTruthy();

         config = { ...config, sourceController: null };
         await data._beforeUpdate(config);
         expect(data._sourceController).toBeTruthy();
      });

      it('items sourceController are changed', async function () {
         let config = { source: source, keyProperty: 'id' };
         const data = getDataWithConfig(config);

         await data._beforeMount(config);
         expect(data._sourceController).toBeTruthy();

         const items = new collection.RecordSet();
         data._sourceController.setItems(null);
         data._sourceController.setItems(items);
         await data._beforeUpdate(config);
         expect(data._items === items).toBeTruthy();
      });

      it('set source after mount', function (done) {
         const config = { keyProperty: 'id' };
         const data = getDataWithConfig(config);

         data._beforeMount(config);

         data
            ._beforeUpdate({
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: sourceDataEdited
               }),
               keyProperty: 'id'
            })
            .addCallback(function () {
               expect(data._items.getRawData()).toEqual(sourceDataEdited);
               done();
            });
      });

      it('itemsChanged', (done) => {
         const config = {
            source: source,
            keyProperty: 'id'
         };
         const data = getDataWithConfig(config);
         const event = {
            stopPropagation: jest.fn()
         };

         data._beforeMount(config).addCallback(function () {
            const newList = new collection.RecordSet({
               rawData: [
                  {
                     id: 0,
                     title: 'Ivan'
                  }
               ],
               keyProperty: 'id'
            });
            data._itemsChanged(event, newList);
            expect(data._items.getRecordById(0)).toBeTruthy();
            expect(!data._items.getRecordById(1)).toBeTruthy();
            expect(event.stopPropagation).toHaveBeenCalled();
            done();
         });
      });

      it('filterChanged', function () {
         var config = {
            source: source,
            keyProperty: 'id',
            filter: { test: 'test' }
         };
         var data = getDataWithConfig(config);

         return new Promise(function (resolve) {
            data._beforeMount(config).addCallback(function () {
               data._filterChanged(null, { test1: 'test1' });
               expect(config.source === data._contextState.source).toBe(true);
               expect(data._filter).toEqual({ test1: 'test1' });
               resolve();
            });
         });
      });

      it('rootChanged', async () => {
         const config = {
            source: source,
            keyProperty: 'id',
            filter: { test: 'test' },
            root: '123',
            parentProperty: 'root'
         };
         const data = getDataWithConfig(config);

         await data._beforeMount(config);
         const newConfig = { ...config };
         delete newConfig.root;
         data._beforeUpdate(newConfig);
         expect(!data._contextState.filter.root).toBe(true);
      });

      it('query returns error', function (done) {
         // eslint-disable-next-line no-shadow
         var source = {
            query: function () {
               const error = new Error('testError');
               error.processed = true;
               error.canceled = false;
               error._isOfflineMode = false;
               return Promise.reject(error);
            },
            _mixins: [],
            '[Types/_source/ICrud]': true
         };
         var dataLoadErrbackCalled = false;
         var dataLoadErrback = function () {
            dataLoadErrbackCalled = true;
         };
         var config = {
            source: source,
            keyProperty: 'id',
            dataLoadErrback: dataLoadErrback
         };
         var data = getDataWithConfig(config);

         data._beforeMount(config).then(function () {
            // TODO тест для совместимости, чтоб ничего не разломать
            const soruceControllerState = data._sourceController.getState();
            expect(soruceControllerState.source).toBeTruthy();
            expect(soruceControllerState.source).toEqual(source);
            expect(data._contextState.source).toEqual(source);
            expect(dataLoadErrbackCalled).toBe(true);
            done();
         });
      });

      it('_beforeMount with error data', function (done) {
         var queryCalled = false;
         var error = new Error('test');
         error.processed = true;
         // eslint-disable-next-line no-shadow
         var source = {
            query: function () {
               queryCalled = true;
               return deferredLib.Deferred.fail(error);
            },
            _mixins: [],
            '[Types/_source/ICrud]': true
         };

         var dataLoadErrbackCalled = false;
         var dataLoadErrback = function () {
            dataLoadErrbackCalled = true;
         };

         var config = {
            source: source,
            keyProperty: 'id',
            dataLoadErrback: dataLoadErrback
         };
         var promise = getDataWithConfig(config)._beforeMount(config);
         expect(promise).toBeInstanceOf(Promise);
         promise
            .then(function (result) {
               expect(result).toEqual(error);
               expect(dataLoadErrbackCalled).toBe(true);
               expect(queryCalled).toBe(true);
               done();
            })
            .catch(function (err) {
               done(err);
            });
      });

      it('_beforeUnmount with sourceController in options', async () => {
         const sourceController = new dataSourceLib.NewSourceController({
            source: source,
            keyProperty: 'id'
         });
         const dataOptions = { source, sourceController, keyProperty: 'id' };
         let isSourceControllerDestroyed = false;
         sourceController.destroy = () => {
            isSourceControllerDestroyed = true;
         };
         await sourceController.reload();
         const data = getDataWithConfig(dataOptions);
         await data._beforeMount(dataOptions);
         data._beforeUnmount();
         expect(isSourceControllerDestroyed).toBe(false);
      });
   });
});
