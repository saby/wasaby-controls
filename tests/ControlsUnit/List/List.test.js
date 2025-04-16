define(['Controls/list'], function (lists) {
   describe('Controls.List', () => {
      it('reloadItem', function () {
         var list = new lists.View({});
         list._children = {
            listControl: {
               reloadItem: function (key, options) {
                  expect(key).toEqual('test');
                  expect(options.readMeta).toEqual({ test: 'test' });
                  expect(options.hierarchyReload).toEqual(true);
               }
            }
         };
         list.reloadItem('test', {
            readMeta: { test: 'test' },
            hierarchyReload: true
         });
      });
   });
});
