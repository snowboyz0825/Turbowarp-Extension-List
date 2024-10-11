// Name: Object
// ID: skyhigh173object
// Description: Treat JSON strings as objects, to boost the performance.
// By: Skyhigh173

(function (Scratch) {
  'use strict';
  // ! to editor:
  // ! pay attention to comments which contains '!' at the beginning.
  // ! they are important.

  // ! custom functions
  window.Map._e = {
    get empty() {
      return new Map();
    },

    // reviver for JSON.parse
    reviver(_, value) {
      if (value instanceof Array || value instanceof Object) return new Map(Object.entries(value));
      return value;
    },

    // replacer for JSON.stringify
    replacer(_, value) {
      if (value instanceof Map) return Object.fromEntries(value);
      return value;
    },

    // ! use when you need to modify contents of the map
    deepCopy(value) {
      if (value instanceof Map) return structuredClone(value);
      return Map._e.parse(value);
    },

    // ! use when you only needs to read the contents of the map
    shallowCopy(value) {
      return Map._e.parse(value);
    },

    // (shallow) parse value
    parse(value) {
      if (value instanceof Map) return value;
      try {
        const result = JSON.parse(value, Map._e.reviver);
        if (result instanceof Map) return result; // make sure they are not Numbers
      } catch {
        // ignore
      }
      return Map._e.empty;
    },

    // used in 'set' related functions
    fromMapOrString(value) {
      if (value instanceof Map) return structuredClone(value);
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return value;
      try {
        // ! we can get strings representing unrelated types (i.e. number and boolean)
        const parsed = JSON.parse(value);
        if (typeof parsed !== 'object') return parsed;
        return new Map(Object.entries(parsed));
      } catch {
        return value;
      }
    },

    // Array to Map
    fromArray(arr) {
      return new Map(Object.entries(arr));
    },

    // to array
    toArray(obj) {
      return [...Map._e.shallowCopy(obj).values()];
    },

    // to indexed obj
    toIndexed(obj) {
      return Map._e.fromArray(Map._e.toArray(obj));
    },

    // do things as Array
    asArray(obj, func, inplaceReturn = false) {
      let tmp = [...Map._e.deepCopy(obj).values()];
      const res = func(tmp);
      if (inplaceReturn) tmp = res;
      return Map._e.fromArray(tmp);
    }
  };

  window.Map.prototype.toString = function() { return JSON.stringify(Object.fromEntries(this), Map._e.replacer); };


  const exampleJSON = {
    empty: '{}',
    keyValue: '{"key":"value"}',
    keyValue2: '{"key2":"value2"}',
    double: '{"apple":"banana","one":"two"}',
    array: '{"0":"a","1":"b","2":"c"}'
  };

  const label = (text) => ({
    blockType: 'label',
    text: text
  });

  class ObjectExtension {
    getInfo() {
      return {
        id: 'skyhigh173object',
        name: 'Object',
        color1: '#9999FF',
        blocks: [
          {
            opcode: 'newObject',
            blockType: Scratch.BlockType.REPORTER,
            text: 'new Object',
            disableMonitor: true
          },
          {
            opcode: 'toJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] to JSON',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          {
            opcode: 'toMap',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] to Object',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          {
            opcode: 'keyval',
            blockType: Scratch.BlockType.REPORTER,
            text: '{[key]: [val]}',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              val: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
            }
          },
          '---',
          {
            opcode: 'set',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] set [key] to value [value]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.empty
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
            }
          },
          {
            opcode: 'get',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] get [key]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: 'delete',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] delete [key]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: 'has',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[obj] has [key]?',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: exampleJSON.keyValue
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'key'
              }
            }
          },
          {
            opcode: 'length',
            blockType: Scratch.BlockType.REPORTER,
            text: 'size of [obj]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.empty
              }
            }
          },
          '---',
          {
            opcode: 'merge',
            blockType: Scratch.BlockType.REPORTER,
            text: 'merge [obj1] with [obj2]',
            arguments: {
              obj1: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              },
              obj2: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue2
              }
            }
          },
          '---',
          {
            opcode: 'indexOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'index of key [key] in [obj]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'one'
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.double
              }
            }
          },
          {
            opcode: 'getWhole',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get whole from key [key] in [obj]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'one'
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.double
              }
            }
          },
          '---',
          {
            opcode: 'keys',
            blockType: Scratch.BlockType.REPORTER,
            text: 'keys of [obj]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          {
            opcode: 'values',
            blockType: Scratch.BlockType.REPORTER,
            text: 'values of [obj]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          {
            opcode: 'entries',
            blockType: Scratch.BlockType.REPORTER,
            text: 'entries of [obj]',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          '---',
          {
            opcode: 'isObject',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [obj] object?',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: ' '
              }
            }
          },
          label('Indexed Object'),
          {
            opcode: 'toIndexed',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] to indexed object',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.keyValue
              }
            }
          },
          {
            opcode: 'toArray',
            blockType: Scratch.BlockType.REPORTER,
            text: '[obj] to Array',
            arguments: {
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          '---',
          {
            opcode: 'item',
            blockType: Scratch.BlockType.REPORTER,
            text: 'item [idx] of [obj]',
            arguments: {
              idx: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: -1
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          {
            opcode: 'push',
            blockType: Scratch.BlockType.REPORTER,
            text: 'push value [value] to [obj]',
            arguments: {
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'd'
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          '---',
          {
            opcode: 'slice',
            blockType: Scratch.BlockType.REPORTER,
            text: 'slice [obj] with [a] [b]',
            arguments: {
              a: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          {
            opcode: 'splice1',
            blockType: Scratch.BlockType.REPORTER,
            text: 'splice [obj] with [a]',
            arguments: {
              a: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          {
            opcode: 'splice2',
            blockType: Scratch.BlockType.REPORTER,
            text: 'splice [obj] with [a] [b]',
            arguments: {
              a: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          {
            opcode: 'splice3',
            blockType: Scratch.BlockType.REPORTER,
            text: 'splice [obj] with [a] [b] [i]',
            arguments: {
              a: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              b: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              i: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'z'
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
          '---',
          {
            opcode: 'listAsObject',
            blockType: Scratch.BlockType.REPORTER,
            text: 'list [list] as object',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                menu: 'list'
              }
            }
          },
          {
            opcode: 'setListAsObject',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set list [list] to object [obj]',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                menu: 'list'
              },
              obj: {
                type: Scratch.ArgumentType.STRING,
                exemptFromNormalization: true,
                defaultValue: exampleJSON.array
              }
            }
          },
        ],
        menus: {
          list: {
            acceptReporters: true,
            items: 'getLists'
          }
        }
      };
    }

    getLists () {
      const globalLists = Object.values(Scratch.vm.runtime.getTargetForStage().variables).filter(x => x.type == 'list');
      const localLists = Object.values(Scratch.vm.editingTarget.variables).filter(x => x.type == 'list');
      const uniqueLists = [...new Set([...globalLists, ...localLists])];
      if (uniqueLists.length === 0) {
        return [
          {
            text: 'select a list',
            value: 'select a list'
          }
        ];
      }
      return uniqueLists.map(i => ({
        text: i.name,
        value: i.id
      }));
    }

    getScratchLists(util) {
      const globalLists = Object.values(Scratch.vm.runtime.getTargetForStage().variables).filter(x => x.type == 'list');
      const localLists = Object.values(util.target.variables).filter(x => x.type == 'list');
      const uniqueLists = [...new Set([...globalLists, ...localLists])];
      return uniqueLists.map(i => ({
        text: i.name,
        value: i.id
      }));
    }

    // from json extension
    listAsObject({ list }, util) {
      try {
        let listVariable = util.target.lookupVariableById(list);
        if (listVariable == undefined) {
          listVariable = this.getListsID(util).find(x => x.text === list).value;
          listVariable = util.target.lookupVariableById(listVariable);
        }

        if (listVariable && listVariable.type === 'list') {
          return Map._e.fromArray(listVariable.value);
        }
      } catch (e) {
        // ignore
      }
      return '';
    }

    setListAsObject({ list, obj }, util) {
      try {
        let listVariable = util.target.lookupVariableById(list);

        if (listVariable == undefined) {
          listVariable = this.getListsID(util).find(x => x.text === list).value;
          listVariable = util.target.lookupVariableById(listVariable);
        }

        if (listVariable && listVariable.type === 'list') {
          listVariable.value = this._toArray(Map._e.deepCopy(obj));
        }
      } catch (e) {
        // ignore
      }
    }

    newObject() {
      return Map._e.empty;
    }

    toJSON(args) {
      return Map._e.shallowCopy(args.obj).toString();
    }

    toMap(args) {
      return Map._e.shallowCopy(args.obj);
    }

    keyval(args) {
      return new Map().set(Scratch.Cast.toString(args.key), Map._e.fromMapOrString(args.val));
    }

    _toArray(obj) {
      return Array.from(obj.values());
    }

    toArray(args) {
      return JSON.stringify(this._toArray(Map._e.shallowCopy(args.obj)));
    }

    set(args) {
      const value = Map._e.fromMapOrString(args.value);
      return Map._e.deepCopy(args.obj).set(Scratch.Cast.toString(args.key), value);
    }

    get(args) {
      return Map._e.shallowCopy(args.obj).get(Scratch.Cast.toString(args.key)) ?? '';
    }

    delete(args) {
      let obj = Map._e.deepCopy(args.obj);
      obj.delete(Scratch.Cast.toString(args.key));
      return obj;
    }

    length(args) {
      return Map._e.shallowCopy(args.obj).size;
    }

    has(args) {
      return Map._e.shallowCopy(args.obj).has(args.key);
    }

    merge(args) {
      return new Map([...Map._e.shallowCopy(args.obj1), ...Map._e.shallowCopy(args.obj2)]);
    }

    isObject(args) {
      return args.obj instanceof Map;
    }

    keys(args) {
      return Map._e.fromArray([...Map._e.shallowCopy(args.obj).keys()]);
    }

    values(args) {
      return  Map._e.fromArray([...Map._e.shallowCopy(args.obj).values()]);
    }

    entries(args) {
      const obj = Map._e.shallowCopy(args.obj);
      // convert entries to map
      return Map._e.fromArray(Array.from(obj.entries()).map(x => Map._e.fromArray(x)));
    }

    indexOf(args) {
      return [...Map._e.shallowCopy(args.obj).keys()].indexOf(Scratch.Cast.toString(args.key));
    }

    getWhole(args) {
      const key = Scratch.Cast.toString(args.key);
      const obj = Map._e.shallowCopy(args.obj);
      if (!obj.has(key)) return Map._e.empty;
      return new Map([[key, obj.get(key)]]);
    }

    toIndexed(args) {
      return Map._e.toIndexed(args.obj);
    }

    push(args) {
      const value = Map._e.fromMapOrString(args.value);
      return Map._e.asArray(args.obj, x => x.push(value));
    }

    slice(args) {
      const obj = Map._e.deepCopy(args.obj);
      return new Map([...obj.entries()].slice(args.a, args.b));
    }

    splice1(args) {
      return Map._e.asArray(args.obj, x => x.splice(args.a));
    }

    splice2(args) {
      return Map._e.asArray(args.obj, x => x.splice(args.a, args.b));
    }

    splice3(args) {
      const value = Map._e.fromMapOrString(args.i);
      return Map._e.asArray(args.obj, x => x.splice(args.a, args.b, value));
    }

    item(args) {
      return Map._e.toArray(args.obj).at(args.idx);
    }
  }

  Scratch.extensions.register(new ObjectExtension());
})(Scratch);
