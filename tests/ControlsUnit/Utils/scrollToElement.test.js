define(['Controls/scroll', 'UI/NodeCollector', 'Core/core-instance'], function (
   scroll,
   NodeCollector,
   cInstance
) {
   describe('Controls/scroll:scrollToElement', function () {
      var documentElement = {};
      function mockDOM(bodyScrollTop, bodyClientHeight) {
         // eslint-disable-next-line no-global-assign
         document = {
            body: {
               overflowY: 'scroll',
               scrollTop: bodyScrollTop || 0,
               clientHeight: bodyClientHeight || 0,
               className: '',
               closest: () => {
                  return [];
               },
               getBoundingClientRect: () => {
                  return { height: 100 };
               }
            },
            documentElement: documentElement
         };
         document.body.scrollHeight = document.body.clientHeight + 10;
         // eslint-disable-next-line no-global-assign
         window = {
            pageYOffset: 0,
            pageXOffset: 0,
            getComputedStyle: function (element) {
               return {
                  overflowY: element.overflowY,
                  scrollHeight: element.scrollHeight,
                  clientHeight: element.clientHeight
               };
            }
         };
      }
      function mockScrollTo(elementObj, resultHeadersHeight) {
         jest
            .spyOn(NodeCollector, 'goUpByControlTree')
            .mockClear()
            .mockReturnValue([
               {
                  syncRegisterDelayedBlocks: jest.fn(),
                  scrollTo: (position) => {
                     elementObj.parentElement.scrollTop = position;
                  },
                  getHeadersHeight: () => {
                     return resultHeadersHeight;
                  },
                  getHeadersRects: () => {
                     return [
                        {
                           rect: {
                              left: 0,
                              height: 4,
                              width: 100
                           },
                           block: {
                              props: {
                                 offsetTop: 0
                              }
                           }
                        }
                     ];
                  },
                  getBlocksHeightByScrollTop: () => {
                     return 0;
                  }
               }
            ]);
         jest
            .spyOn(cInstance, 'instanceOfModule')
            .mockClear()
            .mockReturnValue(true);
      }

      afterEach(function () {
         // eslint-disable-next-line no-global-assign
         document = undefined;
         // eslint-disable-next-line no-global-assign
         window = undefined;
         jest.restoreAllMocks();
      });

      it('waitInitialization = true', function () {
         mockDOM();
         let isInited = false;
         var element = {
            classList: {
               contains: () => {
                  return false;
               }
            },
            querySelector: () => {
               return null;
            },
            parentElement: {
               overflowY: 'scroll',
               scrollHeight: 110,
               clientHeight: 100,
               top: 10,
               getBoundingClientRect: function () {
                  return {
                     top: this.top,
                     height: this.clientHeight
                  };
               },
               scrollTop: 0,
               className: '',
               closest: () => {
                  return [];
               }
            },
            getBoundingClientRect: function () {
               return {
                  top: 15,
                  left: 0,
                  height: 150
               };
            },
            closest: jest.fn()
         };
         jest
            .spyOn(NodeCollector, 'goUpByControlTree')
            .mockClear()
            .mockReturnValue([
               {
                  containerLoaded: true,
                  initHeaderController: () => {
                     let resp;
                     if (!isInited) {
                        resp = Promise.resolve();
                        isInited = true;
                     }
                     return resp;
                  },
                  getHeadersHeight: () => {
                     return 4;
                  },
                  scrollTo: (position) => {
                     element.parentElement.scrollTop = position;
                  },
                  getHeadersRects: () => {
                     return [
                        {
                           rect: {
                              left: 0,
                              height: 4,
                              width: 100
                           },
                           block: {
                              props: {
                                 offsetTop: 0
                              }
                           }
                        }
                     ];
                  },
                  getBlocksHeightByScrollTop: () => {
                     return 4;
                  },
                  syncRegisterDelayedBlocks: jest.fn()
               }
            ]);
         jest
            .spyOn(cInstance, 'instanceOfModule')
            .mockClear()
            .mockReturnValue(true);
         const resp = scroll
            .scrollToElement(element, 'top', false, true)
            .then(() => {
               expect(element.parentElement.scrollTop).toEqual(1);
            });
         expect(element.parentElement.scrollTop).toEqual(0);
         return resp;
      });

      describe('scroll down', function () {
         it('to top', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 10,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 15,
                     height: 150
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element);
            expect(element.parentElement.scrollTop).toEqual(5);
            jest.restoreAllMocks();
         });

         it('to top force', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 10,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 15,
                     height: 150
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'top', true);
            expect(element.parentElement.scrollTop).toEqual(5);
            jest.restoreAllMocks();
         });

         it('to center', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 1000,
                  clientHeight: 100,
                  top: 10,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 300,
                  className: '',
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 200,
                     height: 10
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'center');
            expect(element.parentElement.scrollTop).toEqual(445);
            jest.restoreAllMocks();
         });

         it('to bottom', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 10,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 15,
                     height: 150
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'bottom');
            expect(element.parentElement.scrollTop).toEqual(55);
            jest.restoreAllMocks();
         });

         it('should scroll only first parentElement', function () {
            mockDOM();
            let element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 15,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  parentElement: {
                     overflowY: 'scroll',
                     scrollHeight: 110,
                     clientHeight: 100,
                     top: 5,
                     getBoundingClientRect: function () {
                        return {
                           top: this.top,
                           height: this.clientHeight
                        };
                     },
                     scrollTop: 0,
                     className: '',
                     closest: () => {
                        return [];
                     }
                  },
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 25,
                     height: 20
                  };
               },
               closest: function (class1) {
                  return class1 !== '.ws-hidden';
               }
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'top', true);
            expect(element.parentElement.parentElement.scrollTop).toEqual(0);
            expect(element.parentElement.scrollTop).toEqual(10);
            jest.restoreAllMocks();
         });

         it('to bottom with fractional coords', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 10.6,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 15,
                     height: 150
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'bottom');
            expect(element.parentElement.scrollTop).toEqual(54);
            jest.restoreAllMocks();
         });

         it('with sticky header', () => {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 110,
                  clientHeight: 100,
                  top: 10.6,
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  className: '',
                  closest: () => {
                     return {};
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 15,
                     height: 150
                  };
               },
               closest: jest.fn()
            };
            jest
               .spyOn(NodeCollector, 'goUpByControlTree')
               .mockClear()
               .mockReturnValue([
                  {
                     getHeadersHeight: () => {
                        return 10;
                     },
                     scrollTo: (position) => {
                        element.parentElement.scrollTop = position;
                     },
                     getHeadersRects: () => {
                        return [
                           {
                              rect: {
                                 left: 0,
                                 width: 100
                              },
                              block: {
                                 props: {
                                    offsetTop: 0
                                 }
                              }
                           }
                        ];
                     },
                     syncRegisterDelayedBlocks: jest.fn()
                  }
               ]);
            jest
               .spyOn(cInstance, 'instanceOfModule')
               .mockClear()
               .mockReturnValue(true);
            scroll.scrollToElement(element, 'bottom');
            expect(element.parentElement.scrollTop).toEqual(64);
            jest.restoreAllMocks();
         });

         describe('scroll body', function () {
            it('to top', function () {
               mockDOM(10, 100);
               var element = {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  },
                  querySelector: () => {
                     return null;
                  },
                  parentElement: document.body,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: 15,
                        height: 150
                     };
                  },
                  closest: jest.fn()
               };
               mockScrollTo(element, 0);
               scroll.scrollToElement(element);
               expect(element.parentElement.scrollTop).toEqual(15);
               jest.restoreAllMocks();
            });

            it('to bottom', function () {
               mockDOM(10, 100);
               var element = {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  },
                  querySelector: () => {
                     return null;
                  },
                  parentElement: document.body,
                  getBoundingClientRect: function () {
                     return {
                        top: 15,
                        height: 150
                     };
                  },
                  className: '',
                  closest: jest.fn()
               };
               mockScrollTo(element, 0);
               scroll.scrollToElement(element, 'bottom');
               expect(element.parentElement.scrollTop).toEqual(75);
               jest.restoreAllMocks();
            });

            it('to bottom with fractional coords', function () {
               mockDOM(10, 100);
               var element = {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  },
                  querySelector: () => {
                     return null;
                  },
                  parentElement: document.body,
                  getBoundingClientRect: function () {
                     return {
                        top: 14.6,
                        height: 150
                     };
                  },
                  className: '',
                  closest: jest.fn()
               };
               mockScrollTo(element, 0);
               scroll.scrollToElement(element, 'bottom');
               expect(element.parentElement.scrollTop).toEqual(75);
               jest.restoreAllMocks();
            });
         });
      });

      describe('content in sticky block', function () {
         it('should scroll only in sticky block container', function () {
            mockDOM(15, 150);
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 15,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  closest: () => {
                     return [];
                  },
                  parentElement: {
                     overflowY: 'scroll',
                     scrollHeight: 160,
                     clientHeight: 150,
                     top: 15,
                     className: '',
                     getBoundingClientRect: function () {
                        expect(true).toBe(false);
                     },
                     scrollTop: 0,
                     closest: jest.fn()
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 10,
                     height: 100
                  };
               },
               closest: function (class1) {
                  return class1 !== '.ws-hidden';
               }
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element);
            expect(element.parentElement.scrollTop).toEqual(-5);
            jest.restoreAllMocks();
         });
      });

      describe('scroll up', function () {
         it('to top', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 15,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 10,
                     height: 100
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element);
            expect(element.parentElement.scrollTop).toEqual(-5);
            jest.restoreAllMocks();
         });

         it('to top force', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 15,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 10,
                     height: 100
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'top', true);
            expect(element.parentElement.scrollTop).toEqual(-5);
            jest.restoreAllMocks();
         });

         it('to top force and inner sticky block', function () {
            mockDOM();
            const element = {
               offsetHeight: 10,
               classList: {
                  contains: () => {
                     return true;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 10,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 15,
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 20,
                     height: 100
                  };
               },
               closest: jest.fn(),
               style: {
                  top: 5
               }
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'top', true);
            expect(element.parentElement.scrollTop).toEqual(25);
            jest.restoreAllMocks();
         });

         it('to top force and sticky block with offsetTop', function () {
            mockDOM();
            jest
               .spyOn(NodeCollector, 'goUpByControlTree')
               .mockClear()
               .mockReturnValue([
                  {
                     getHeadersHeight: () => {
                        return 10;
                     },
                     getHeadersRects: () => {
                        return [
                           {
                              rect: {
                                 left: 0,
                                 width: 100
                              },
                              block: {
                                 props: {
                                    offsetTop: 0
                                 }
                              }
                           }
                        ];
                     },
                     syncRegisterDelayedBlocks: jest.fn()
                  }
               ]);
            jest
               .spyOn(cInstance, 'instanceOfModule')
               .mockClear()
               .mockReturnValue(true);
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 10,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 15,
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 20,
                     left: 0,
                     height: 100
                  };
               },
               closest: jest.fn()
            };
            scroll.scrollToElement(element, 'top', true);
            expect(element.parentElement.scrollTop).toEqual(15);
            jest.restoreAllMocks();
         });

         it('to bottom', function () {
            mockDOM();
            var element = {
               classList: {
                  contains: () => {
                     return false;
                  }
               },
               querySelector: () => {
                  return null;
               },
               parentElement: {
                  overflowY: 'scroll',
                  scrollHeight: 160,
                  clientHeight: 150,
                  top: 15,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: this.top,
                        height: this.clientHeight
                     };
                  },
                  scrollTop: 0,
                  closest: () => {
                     return [];
                  }
               },
               getBoundingClientRect: function () {
                  return {
                     top: 10,
                     height: 100
                  };
               },
               closest: jest.fn()
            };
            mockScrollTo(element, 0);
            scroll.scrollToElement(element, 'bottom');
            expect(element.parentElement.scrollTop).toEqual(-55);
            jest.restoreAllMocks();
         });

         describe('scroll body', function () {
            it('to top', function () {
               mockDOM(15, 150);
               var element = {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  },
                  querySelector: () => {
                     return null;
                  },
                  parentElement: document.body,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: 10,
                        height: 100
                     };
                  },
                  closest: jest.fn()
               };

               mockScrollTo(element, 0);
               scroll.scrollToElement(element);
               expect(element.parentElement.scrollTop).toEqual(10);
               jest.restoreAllMocks();
            });

            it('to bottom', function () {
               mockDOM(15, 150);
               var element = {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  },
                  querySelector: () => {
                     return null;
                  },
                  parentElement: document.body,
                  className: '',
                  getBoundingClientRect: function () {
                     return {
                        top: 10,
                        height: 100
                     };
                  },
                  closest: jest.fn()
               };

               mockScrollTo(element, 0);
               scroll.scrollToElement(element, 'bottom');
               expect(element.parentElement.scrollTop).toEqual(-25);
               jest.restoreAllMocks();
            });
         });
      });
   });
});
