define(['Controls/list'], function (list) {
   'use strict';
   describe('Controls.Utils.CssClassList', () => {
      let CssClassList = list.CssClassList;

      it('method "add()" should return this instance of CssClassList', () => {
         let classList = new CssClassList(),
            result = classList.add('any', true);

         expect(result instanceof CssClassList).toBe(true);
         expect(result === classList).toBe(true);
      });

      it('clear()', () => {
         let classesObject = {
               any: true,
               also: true,
               me: false
            },
            classList = new CssClassList(classesObject);

         expect(classesObject).toEqual(classList.getClassList());
         classList.clear();
         expect({}).toEqual(classList.getClassList());
      });

      it('method "clear()" should return this instance of CssClassList', () => {
         let classList = new CssClassList({ my: true }),
            result = classList.add('any', true);

         expect(result instanceof CssClassList).toBe(true);
         expect(result === classList).toBe(true);
      });

      it('chaining "add()" method', () => {
         let classesObject = {
               first: true,
               second: true
            },
            classList = new CssClassList(classesObject);

         expect(classesObject).toEqual(classList.getClassList());

         classesObject.green = false;
         classesObject.blue = true;
         classesObject.red = true;

         classList.add('green', false).add('blue').add('red', true);

         expect(classesObject).toEqual(classList.getClassList());
      });

      it('chaining with clear method', () => {
         let classesObject = {
               first: true
            },
            classList = new CssClassList(classesObject);

         expect(classesObject).toEqual(classList.getClassList());

         classList.add('green', false).add('blue').clear().add('red', true);

         expect({ red: true }).toEqual(classList.getClassList());
      });

      it('"getClassList()" should returns copy of real class list object', () => {
         let classList = new CssClassList({ my: true }),
            result = classList.getClassList();

         expect(result === classList).toBe(false);
         expect({ my: true }).toEqual(result);
      });

      it('"compile()" without chain', () => {
         let classesObject = {
               any: true,
               also: true,
               me: false
            },
            classList = new CssClassList(classesObject);

         expect('any also').toEqual(classList.compile());
      });

      it('"compile()" with chaining', () => {
         let classesObject = {
               any: true,
               also: true,
               me: false
            },
            classList = new CssClassList(classesObject),
            result = classList.add('one').add('two', false).add('three', true).compile();

         expect('any also one three').toEqual(result);
      });

      it('static "compile(classList)" without chain', () => {
         let classesObject = {
            any: true,
            also: true,
            me: false
         };

         expect('any also').toEqual(CssClassList.compile(classesObject));
         expect('').toEqual(CssClassList.compile());
         expect('').toEqual(CssClassList.compile({}));
      });

      it('static "compile()" chain', () => {
         let result = CssClassList.add('any', true).add('also').add('me', false).compile();

         expect('any also').toEqual(result);

         expect('').toEqual(CssClassList.compile());
         expect('').toEqual(CssClassList.compile({}));
         expect('').toEqual(CssClassList.add('').compile({}));
      });
   });
});
