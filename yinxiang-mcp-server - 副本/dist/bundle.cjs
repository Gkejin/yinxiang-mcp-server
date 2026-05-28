var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/ajv/dist/compile/codegen/code.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.regexpCode = exports2.getEsmExportName = exports2.getProperty = exports2.safeStringify = exports2.stringify = exports2.strConcat = exports2.addCodeArg = exports2.str = exports2._ = exports2.nil = exports2._Code = exports2.Name = exports2.IDENTIFIER = exports2._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports2._CodeOrName = _CodeOrName;
    exports2.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports2.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports2.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a3;
        return (_a3 = this._str) !== null && _a3 !== void 0 ? _a3 : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a3;
        return (_a3 = this._names) !== null && _a3 !== void 0 ? _a3 : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports2._Code = _Code;
    exports2.nil = new _Code("");
    function _(strs, ...args2) {
      const code = [strs[0]];
      let i = 0;
      while (i < args2.length) {
        addCodeArg(code, args2[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports2._ = _;
    var plus = new _Code("+");
    function str(strs, ...args2) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args2.length) {
        expr.push(plus);
        addCodeArg(expr, args2[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports2.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports2.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports2.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports2.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports2.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports2.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports2.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports2.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports2.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports2.regexpCode = regexpCode;
  }
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/ajv/dist/compile/codegen/scope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ValueScope = exports2.ValueScopeName = exports2.Scope = exports2.varKinds = exports2.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports2.UsedValueState = UsedValueState = {}));
    exports2.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a3, _b;
        if (((_b = (_a3 = this._parent) === null || _a3 === void 0 ? void 0 : _a3._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports2.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports2.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a3;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a3 = value.key) !== null && _a3 !== void 0 ? _a3 : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports2.varKinds.var : exports2.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports2.ValueScope = ValueScope;
  }
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/ajv/dist/compile/codegen/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.or = exports2.and = exports2.not = exports2.CodeGen = exports2.operators = exports2.varKinds = exports2.ValueScopeName = exports2.ValueScope = exports2.Scope = exports2.Name = exports2.regexpCode = exports2.stringify = exports2.getProperty = exports2.nil = exports2.strConcat = exports2.str = exports2._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports2, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports2, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports2, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports2, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports2, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports2, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports2, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports2.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error2) {
        super();
        this.error = error2;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a3;
        this.else = (_a3 = this.else) === null || _a3 === void 0 ? void 0 : _a3.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args2, async) {
        super();
        this.name = name;
        this.args = args2;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a3, _b;
        super.optimizeNodes();
        (_a3 = this.catch) === null || _a3 === void 0 ? void 0 : _a3.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a3, _b;
        super.optimizeNames(names, constants);
        (_a3 = this.catch) === null || _a3 === void 0 ? void 0 : _a3.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error2) {
        super();
        this.error = error2;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports2.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error2 = this.name("e");
          this._currNode = node.catch = new Catch(error2);
          catchCode(error2);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error2) {
        return this._leafNode(new Throw(error2));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args2 = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args2, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports2.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports2.not = not;
    var andCode = mappend(exports2.operators.AND);
    function and(...args2) {
      return args2.reduce(andCode);
    }
    exports2.and = and;
    var orCode = mappend(exports2.operators.OR);
    function or(...args2) {
      return args2.reduce(orCode);
    }
    exports2.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/ajv/dist/compile/util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkStrictMode = exports2.getErrorPath = exports2.Type = exports2.useFunc = exports2.setEvaluated = exports2.evaluatedPropsToName = exports2.mergeEvaluated = exports2.eachItem = exports2.unescapeJsonPointer = exports2.escapeJsonPointer = exports2.escapeFragment = exports2.unescapeFragment = exports2.schemaRefOrVal = exports2.schemaHasRulesButRef = exports2.schemaHasRules = exports2.checkUnknownRules = exports2.alwaysValidSchema = exports2.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports2.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports2.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports2.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports2.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports2.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports2.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports2.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports2.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports2.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports2.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports2.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues: mergeValues2, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues2(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports2.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports2.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports2.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports2.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports2.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports2.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports2.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/ajv/dist/compile/names.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports2.default = names;
  }
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/ajv/dist/compile/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extendErrors = exports2.resetErrorsCount = exports2.reportExtraError = exports2.reportError = exports2.keyword$DataError = exports2.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports2.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports2.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error2 = exports2.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error2, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports2.reportError = reportError;
    function reportExtraError(cxt, error2 = exports2.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error2, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports2.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports2.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports2.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error2, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error2, errorPaths);
    }
    function errorObject(cxt, error2, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error2, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.boolOrEmptySchema = exports2.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports2.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports2.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/ajv/dist/compile/rules.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getRules = exports2.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports2.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports2.getRules = getRules;
  }
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/ajv/dist/compile/validate/applicability.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.shouldUseRule = exports2.shouldUseGroup = exports2.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports2.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports2.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a3;
      return schema[rule.keyword] !== void 0 || ((_a3 = rule.definition.implements) === null || _a3 === void 0 ? void 0 : _a3.some((kwd) => schema[kwd] !== void 0));
    }
    exports2.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/ajv/dist/compile/validate/dataType.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.reportTypeError = exports2.checkDataTypes = exports2.checkDataType = exports2.coerceAndCheckDataType = exports2.getJSONTypes = exports2.getSchemaTypes = exports2.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports2.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports2.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports2.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports2.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports2.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports2.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports2.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/ajv/dist/compile/validate/defaults.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports2.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/code.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateUnion = exports2.validateArray = exports2.usePattern = exports2.callValidateCode = exports2.schemaProperties = exports2.allSchemaProperties = exports2.noPropertyInData = exports2.propertyInData = exports2.isOwnProperty = exports2.hasPropFunc = exports2.reportMissingProp = exports2.checkMissingProp = exports2.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports2.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports2.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports2.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports2.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports2.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports2.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports2.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports2.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports2.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args2 = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args2})` : (0, codegen_1._)`${func}(${args2})`;
    }
    exports2.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports2.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports2.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports2.validateUnion = validateUnion;
  }
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/ajv/dist/compile/validate/keyword.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateKeywordUsage = exports2.validSchemaType = exports2.funcKeywordCode = exports2.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports2.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a3;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a3 = def.valid) !== null && _a3 !== void 0 ? _a3 : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a4;
        gen.if((0, codegen_1.not)((_a4 = def.valid) !== null && _a4 !== void 0 ? _a4 : valid), errors);
      }
    }
    exports2.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports2.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports2.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/ajv/dist/compile/validate/subschema.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.extendSubschemaMode = exports2.extendSubschemaData = exports2.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports2.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports2.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports2.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/json-schema-traverse/index.js"(exports2, module2) {
    "use strict";
    var traverse = module2.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/ajv/dist/compile/resolve.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getSchemaRefs = exports2.resolveUrl = exports2.normalizeId = exports2._getFullPath = exports2.getFullPath = exports2.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports2.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports2.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports2._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports2.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports2.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports2.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/ajv/dist/compile/validate/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getData = exports2.KeywordCxt = exports2.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports2.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports2.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports2.getData = getData;
  }
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/ajv/dist/runtime/validation_error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports2.default = ValidationError;
  }
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/ajv/dist/compile/ref_error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports2.default = MissingRefError;
  }
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/ajv/dist/compile/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveSchema = exports2.getCompilingSchema = exports2.resolveRef = exports2.compileSchema = exports2.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a3;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a3 = env.baseId) !== null && _a3 !== void 0 ? _a3 : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports2.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports2.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a3;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a3 = root.localRefs) === null || _a3 === void 0 ? void 0 : _a3[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports2.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports2.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports2.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a3;
      if (((_a3 = parsedRef.fragment) === null || _a3 === void 0 ? void 0 : _a3[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/ajv/dist/refs/data.json"(exports2, module2) {
    module2.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports2, module2) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function consumeIsZone(buffer) {
      buffer.length = 0;
      return true;
    }
    function consumeHextets(buffer, address, output) {
      if (buffer.length) {
        const hex = stringArrayToHexStripped(buffer);
        if (hex !== "") {
          address.push(hex);
        } else {
          output.error = true;
          return false;
        }
        buffer.length = 0;
      }
      return true;
    }
    function getIPV6(input) {
      let tokenCount = 0;
      const output = { error: false, address: "", zone: "" };
      const address = [];
      const buffer = [];
      let endipv6Encountered = false;
      let endIpv6 = false;
      let consume = consumeHextets;
      for (let i = 0; i < input.length; i++) {
        const cursor = input[i];
        if (cursor === "[" || cursor === "]") {
          continue;
        }
        if (cursor === ":") {
          if (endipv6Encountered === true) {
            endIpv6 = true;
          }
          if (!consume(buffer, address, output)) {
            break;
          }
          if (++tokenCount > 7) {
            output.error = true;
            break;
          }
          if (i > 0 && input[i - 1] === ":") {
            endipv6Encountered = true;
          }
          address.push(":");
          continue;
        } else if (cursor === "%") {
          if (!consume(buffer, address, output)) {
            break;
          }
          consume = consumeIsZone;
        } else {
          buffer.push(cursor);
          continue;
        }
      }
      if (buffer.length) {
        if (consume === consumeIsZone) {
          output.zone = buffer.join("");
        } else if (endIpv6) {
          address.push(buffer.join(""));
        } else {
          address.push(stringArrayToHexStripped(buffer));
        }
      }
      output.address = address.join("");
      return output;
    }
    function normalizeIPv6(host) {
      if (findToken(host, ":") < 2) {
        return { host, isIPV6: false };
      }
      const ipv62 = getIPV6(host);
      if (!ipv62.error) {
        let newHost = ipv62.address;
        let escapedHost = ipv62.address;
        if (ipv62.zone) {
          newHost += "%" + ipv62.zone;
          escapedHost += "%25" + ipv62.zone;
        }
        return { host: newHost, isIPV6: true, escapedHost };
      } else {
        return { host, isIPV6: false };
      }
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(input[i])) {
          output += input[i];
        } else {
          output += escape(input[i]);
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(component.userinfo);
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = unescape(component.host);
        if (!isIPv4(host)) {
          const ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(component.port));
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module2.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports2, module2) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const [path, query] = wsComponent.resourceName.split("?");
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = query;
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module2.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports2, module2) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse3(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const resolved = resolveComponent(parse3(baseURI, schemelessOptions), parse3(relativeURI, schemelessOptions), schemelessOptions, true);
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse3(serialize(base, options), options);
        relative = parse3(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = escapePreservingEscapes(component.path);
          if (component.scheme !== void 0) {
            component.path = component.path.split("%3A").join(":");
          }
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", component.query);
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", component.fragment);
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const ipv6result = normalizeIPv6(parsed.host);
            parsed.host = ipv6result.host.toLowerCase();
            isIP = ipv6result.isIPV6;
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
          if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
            try {
              parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
            } catch (e) {
              parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
            }
          }
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.scheme !== void 0) {
              parsed.scheme = unescape(parsed.scheme);
            }
            if (parsed.host !== void 0) {
              parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
            }
          }
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.fragment) {
            try {
              parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
            } catch {
              parsed.error = parsed.error || "URI malformed";
            }
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort };
    }
    function parse3(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri === "string") {
        const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
        return malformedAuthorityOrPort ? void 0 : normalized;
      }
      if (typeof uri === "object") {
        return serialize(uri, opts);
      }
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse: parse3
    };
    module2.exports = fastUri;
    module2.exports.default = fastUri;
    module2.exports.fastUri = fastUri;
  }
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv/dist/runtime/uri.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports2.default = uri;
  }
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/ajv/dist/core.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CodeGen = exports2.Name = exports2.nil = exports2.stringify = exports2.str = exports2._ = exports2.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports2, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports2, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a3 = o.code) === null || _a3 === void 0 ? void 0 : _a3.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta: meta2, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta2 && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta: meta2, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta2 == "object" ? meta2[schemaId] || meta2 : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta2) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta2);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta2);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta2, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta: meta2, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    exports2.default = Ajv2;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a3;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a3 = definition.implements) === null || _a3 === void 0 ? void 0 : _a3.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/id.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/ref.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.callRef = exports2.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports2.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a3;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a3 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a3 === void 0 ? void 0 : _a3.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports2.callRef = callRef;
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports2.default = core;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error2 = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports2.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error2 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/required.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error: error2,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports2.default = equal;
  }
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/const.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error2 = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports2.default = validation;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error: error2,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports2.validateAdditionalItems = validateAdditionalItems;
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports2.validateTuple = validateTuple;
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error2 = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error: error2,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateSchemaDeps = exports2.validatePropertyDeps = exports2.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports2.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports2.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports2.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports2.validateSchemaDeps = validateSchemaDeps;
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error: error2,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error2 = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error2 = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error: error2,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports2.default = getApplicator;
  }
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/format.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error2 = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports2.default = format;
  }
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/ajv/dist/vocabularies/metadata.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.contentVocabulary = exports2.metadataVocabulary = void 0;
    exports2.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports2.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft7.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports2.default = draft7Vocabularies;
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports2.DiscrError = DiscrError = {}));
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error2 = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error: error2,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a3;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a3 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a3 === void 0 ? void 0 : _a3[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required: required2 }) {
            return Array.isArray(required2) && required2.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports2.default = def;
  }
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports2, module2) {
    module2.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv/dist/ajv.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MissingRefError = exports2.ValidationError = exports2.CodeGen = exports2.Name = exports2.nil = exports2.stringify = exports2.str = exports2._ = exports2.KeywordCxt = exports2.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports2.Ajv = Ajv2;
    module2.exports = exports2 = Ajv2;
    module2.exports.Ajv = Ajv2;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports2, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports2, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports2, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports2, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports2, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports2, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports2, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports2, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports2, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.formatNames = exports2.fastFormats = exports2.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports2.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date3, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports2.fastFormats = {
      ...exports2.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports2.formatNames = Object.keys(exports2.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date3(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time3(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time3 = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date3(dateTime[0]) && time3(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "node_modules/ajv-formats/dist/limit.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error2 = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports2.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error: error2,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv) => {
      ajv.addKeyword(exports2.formatLimitDefinition);
      return ajv;
    };
    exports2.default = formatLimitPlugin;
  }
});

// node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "node_modules/ajv-formats/dist/index.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats(ajv, opts, formats_1.fullFormats, fullName);
        return ajv;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats(ajv, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv);
      return ajv;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats(ajv, list, fs, exportName) {
      var _a3;
      var _b;
      (_a3 = (_b = ajv.opts.code).formats) !== null && _a3 !== void 0 ? _a3 : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv.addFormat(f, fs[f]);
    }
    module2.exports = exports2 = formatsPlugin;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = formatsPlugin;
  }
});

// node_modules/oauth/lib/sha1.js
var require_sha1 = __commonJS({
  "node_modules/oauth/lib/sha1.js"(exports2) {
    var b64pad = "=";
    function b64_hmac_sha1(k, d) {
      return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
    }
    function rstr_hmac_sha1(key, data) {
      var bkey = rstr2binb(key);
      if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
      var ipad = Array(16), opad = Array(16);
      for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 909522486;
        opad[i] = bkey[i] ^ 1549556828;
      }
      var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
      return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
    }
    function rstr2b64(input) {
      try {
        b64pad;
      } catch (e) {
        b64pad = "";
      }
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var output = "";
      var len = input.length;
      for (var i = 0; i < len; i += 3) {
        var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
          if (i * 8 + j * 6 > input.length * 8) output += b64pad;
          else output += tab.charAt(triplet >>> 6 * (3 - j) & 63);
        }
      }
      return output;
    }
    function str2rstr_utf8(input) {
      var output = "";
      var i = -1;
      var x, y;
      while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (55296 <= x && x <= 56319 && 56320 <= y && y <= 57343) {
          x = 65536 + ((x & 1023) << 10) + (y & 1023);
          i++;
        }
        if (x <= 127)
          output += String.fromCharCode(x);
        else if (x <= 2047)
          output += String.fromCharCode(
            192 | x >>> 6 & 31,
            128 | x & 63
          );
        else if (x <= 65535)
          output += String.fromCharCode(
            224 | x >>> 12 & 15,
            128 | x >>> 6 & 63,
            128 | x & 63
          );
        else if (x <= 2097151)
          output += String.fromCharCode(
            240 | x >>> 18 & 7,
            128 | x >>> 12 & 63,
            128 | x >>> 6 & 63,
            128 | x & 63
          );
      }
      return output;
    }
    function rstr2binb(input) {
      var output = Array(input.length >> 2);
      for (var i = 0; i < output.length; i++)
        output[i] = 0;
      for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << 24 - i % 32;
      return output;
    }
    function binb2rstr(input) {
      var output = "";
      for (var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 255);
      return output;
    }
    function binb_sha1(x, len) {
      x[len >> 5] |= 128 << 24 - len % 32;
      x[(len + 64 >> 9 << 4) + 15] = len;
      var w = Array(80);
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      var e = -1009589776;
      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
          if (j < 16) w[j] = x[i + j];
          else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          var t = safe_add(
            safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
            safe_add(safe_add(e, w[j]), sha1_kt(j))
          );
          e = d;
          d = c;
          c = bit_rol(b, 30);
          b = a;
          a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
      }
      return Array(a, b, c, d, e);
    }
    function sha1_ft(t, b, c, d) {
      if (t < 20) return b & c | ~b & d;
      if (t < 40) return b ^ c ^ d;
      if (t < 60) return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    function sha1_kt(t) {
      return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }
    function safe_add(x, y) {
      var lsw = (x & 65535) + (y & 65535);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 65535;
    }
    function bit_rol(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
    }
    exports2.HMACSHA1 = function(key, data) {
      return b64_hmac_sha1(key, data);
    };
  }
});

// node_modules/oauth/lib/_utils.js
var require_utils2 = __commonJS({
  "node_modules/oauth/lib/_utils.js"(exports2, module2) {
    module2.exports.isAnEarlyCloseHost = function(hostName) {
      return hostName && hostName.match(".*google(apis)?.com$");
    };
  }
});

// node_modules/oauth/lib/oauth.js
var require_oauth = __commonJS({
  "node_modules/oauth/lib/oauth.js"(exports2) {
    var crypto = require("crypto");
    var sha1 = require_sha1();
    var http = require("http");
    var https = require("https");
    var URL2 = require("url");
    var querystring = require("querystring");
    var OAuthUtils = require_utils2();
    exports2.OAuth = function(requestUrl, accessUrl, consumerKey, consumerSecret, version2, authorize_callback, signatureMethod, nonceSize, customHeaders) {
      this._isEcho = false;
      this._requestUrl = requestUrl;
      this._accessUrl = accessUrl;
      this._consumerKey = consumerKey;
      this._consumerSecret = this._encodeData(consumerSecret);
      if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
      }
      this._version = version2;
      if (authorize_callback === void 0) {
        this._authorize_callback = "oob";
      } else {
        this._authorize_callback = authorize_callback;
      }
      if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
        throw new Error("Un-supported signature method: " + signatureMethod);
      this._signatureMethod = signatureMethod;
      this._nonceSize = nonceSize || 32;
      this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
      };
      this._clientOptions = this._defaultClientOptions = {
        "requestTokenHttpMethod": "POST",
        "accessTokenHttpMethod": "POST",
        "followRedirects": true
      };
      this._oauthParameterSeperator = ",";
    };
    exports2.OAuthEcho = function(realm, verify_credentials, consumerKey, consumerSecret, version2, signatureMethod, nonceSize, customHeaders) {
      this._isEcho = true;
      this._realm = realm;
      this._verifyCredentials = verify_credentials;
      this._consumerKey = consumerKey;
      this._consumerSecret = this._encodeData(consumerSecret);
      if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
      }
      this._version = version2;
      if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1")
        throw new Error("Un-supported signature method: " + signatureMethod);
      this._signatureMethod = signatureMethod;
      this._nonceSize = nonceSize || 32;
      this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
      };
      this._oauthParameterSeperator = ",";
    };
    exports2.OAuthEcho.prototype = exports2.OAuth.prototype;
    exports2.OAuth.prototype._getTimestamp = function() {
      return Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
    };
    exports2.OAuth.prototype._encodeData = function(toEncode) {
      if (toEncode == null || toEncode == "") return "";
      else {
        var result = encodeURIComponent(toEncode);
        return result.replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
      }
    };
    exports2.OAuth.prototype._decodeData = function(toDecode) {
      if (toDecode != null) {
        toDecode = toDecode.replace(/\+/g, " ");
      }
      return decodeURIComponent(toDecode);
    };
    exports2.OAuth.prototype._getSignature = function(method, url, parameters, tokenSecret) {
      var signatureBase = this._createSignatureBase(method, url, parameters);
      return this._createSignature(signatureBase, tokenSecret);
    };
    exports2.OAuth.prototype._normalizeUrl = function(url) {
      var parsedUrl = URL2.parse(url, true);
      var port = "";
      if (parsedUrl.port) {
        if (parsedUrl.protocol == "http:" && parsedUrl.port != "80" || parsedUrl.protocol == "https:" && parsedUrl.port != "443") {
          port = ":" + parsedUrl.port;
        }
      }
      if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
      return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
    };
    exports2.OAuth.prototype._isParameterNameAnOAuthParameter = function(parameter) {
      var m = parameter.match("^oauth_");
      if (m && m[0] === "oauth_") {
        return true;
      } else {
        return false;
      }
    };
    exports2.OAuth.prototype._buildAuthorizationHeaders = function(orderedParameters) {
      var authHeader = "OAuth ";
      if (this._isEcho) {
        authHeader += 'realm="' + this._realm + '",';
      }
      for (var i = 0; i < orderedParameters.length; i++) {
        if (this._isParameterNameAnOAuthParameter(orderedParameters[i][0])) {
          authHeader += "" + this._encodeData(orderedParameters[i][0]) + '="' + this._encodeData(orderedParameters[i][1]) + '"' + this._oauthParameterSeperator;
        }
      }
      authHeader = authHeader.substring(0, authHeader.length - this._oauthParameterSeperator.length);
      return authHeader;
    };
    exports2.OAuth.prototype._makeArrayOfArgumentsHash = function(argumentsHash) {
      var argument_pairs = [];
      for (var key in argumentsHash) {
        if (argumentsHash.hasOwnProperty(key)) {
          var value = argumentsHash[key];
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              argument_pairs[argument_pairs.length] = [key, value[i]];
            }
          } else {
            argument_pairs[argument_pairs.length] = [key, value];
          }
        }
      }
      return argument_pairs;
    };
    exports2.OAuth.prototype._sortRequestParams = function(argument_pairs) {
      argument_pairs.sort(function(a, b) {
        if (a[0] == b[0]) {
          return a[1] < b[1] ? -1 : 1;
        } else return a[0] < b[0] ? -1 : 1;
      });
      return argument_pairs;
    };
    exports2.OAuth.prototype._normaliseRequestParams = function(args2) {
      var argument_pairs = this._makeArrayOfArgumentsHash(args2);
      for (var i = 0; i < argument_pairs.length; i++) {
        argument_pairs[i][0] = this._encodeData(argument_pairs[i][0]);
        argument_pairs[i][1] = this._encodeData(argument_pairs[i][1]);
      }
      argument_pairs = this._sortRequestParams(argument_pairs);
      var args2 = "";
      for (var i = 0; i < argument_pairs.length; i++) {
        args2 += argument_pairs[i][0];
        args2 += "=";
        args2 += argument_pairs[i][1];
        if (i < argument_pairs.length - 1) args2 += "&";
      }
      return args2;
    };
    exports2.OAuth.prototype._createSignatureBase = function(method, url, parameters) {
      url = this._encodeData(this._normalizeUrl(url));
      parameters = this._encodeData(parameters);
      return method.toUpperCase() + "&" + url + "&" + parameters;
    };
    exports2.OAuth.prototype._createSignature = function(signatureBase, tokenSecret) {
      if (tokenSecret === void 0) var tokenSecret = "";
      else tokenSecret = this._encodeData(tokenSecret);
      var key = this._consumerSecret + "&" + tokenSecret;
      var hash = "";
      if (this._signatureMethod == "PLAINTEXT") {
        hash = key;
      } else if (this._signatureMethod == "RSA-SHA1") {
        key = this._privateKey || "";
        hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, "base64");
      } else {
        if (crypto.Hmac) {
          hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
        } else {
          hash = sha1.HMACSHA1(key, signatureBase);
        }
      }
      return hash;
    };
    exports2.OAuth.prototype.NONCE_CHARS = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ];
    exports2.OAuth.prototype._getNonce = function(nonceSize) {
      var result = [];
      var chars = this.NONCE_CHARS;
      var char_pos;
      var nonce_chars_length = chars.length;
      for (var i = 0; i < nonceSize; i++) {
        char_pos = Math.floor(Math.random() * nonce_chars_length);
        result[i] = chars[char_pos];
      }
      return result.join("");
    };
    exports2.OAuth.prototype._createClient = function(port, hostname, method, path, headers, sslEnabled) {
      var options = {
        host: hostname,
        port,
        path,
        method,
        headers
      };
      var httpModel;
      if (sslEnabled) {
        httpModel = https;
      } else {
        httpModel = http;
      }
      return httpModel.request(options);
    };
    exports2.OAuth.prototype._prepareParameters = function(oauth_token, oauth_token_secret, method, url, extra_params) {
      var oauthParameters = {
        "oauth_timestamp": this._getTimestamp(),
        "oauth_nonce": this._getNonce(this._nonceSize),
        "oauth_version": this._version,
        "oauth_signature_method": this._signatureMethod,
        "oauth_consumer_key": this._consumerKey
      };
      if (oauth_token) {
        oauthParameters["oauth_token"] = oauth_token;
      }
      var sig;
      if (this._isEcho) {
        sig = this._getSignature("GET", this._verifyCredentials, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
      } else {
        if (extra_params) {
          for (var key in extra_params) {
            if (extra_params.hasOwnProperty(key)) oauthParameters[key] = extra_params[key];
          }
        }
        var parsedUrl = URL2.parse(url, false);
        if (parsedUrl.query) {
          var key2;
          var extraParameters = querystring.parse(parsedUrl.query);
          for (var key in extraParameters) {
            var value = extraParameters[key];
            if (typeof value == "object") {
              for (key2 in value) {
                oauthParameters[key + "[" + key2 + "]"] = value[key2];
              }
            } else {
              oauthParameters[key] = value;
            }
          }
        }
        sig = this._getSignature(method, url, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
      }
      var orderedParameters = this._sortRequestParams(this._makeArrayOfArgumentsHash(oauthParameters));
      orderedParameters[orderedParameters.length] = ["oauth_signature", sig];
      return orderedParameters;
    };
    exports2.OAuth.prototype._performSecureRequest = function(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback) {
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);
      if (!post_content_type) {
        post_content_type = "application/x-www-form-urlencoded";
      }
      var parsedUrl = URL2.parse(url, false);
      if (parsedUrl.protocol == "http:" && !parsedUrl.port) parsedUrl.port = 80;
      if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;
      var headers = {};
      var authorization = this._buildAuthorizationHeaders(orderedParameters);
      if (this._isEcho) {
        headers["X-Verify-Credentials-Authorization"] = authorization;
      } else {
        headers["Authorization"] = authorization;
      }
      headers["Host"] = parsedUrl.host;
      for (var key in this._headers) {
        if (this._headers.hasOwnProperty(key)) {
          headers[key] = this._headers[key];
        }
      }
      for (var key in extra_params) {
        if (this._isParameterNameAnOAuthParameter(key)) {
          delete extra_params[key];
        }
      }
      if ((method == "POST" || method == "PUT") && (post_body == null && extra_params != null)) {
        post_body = querystring.stringify(extra_params).replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
      }
      if (post_body) {
        if (Buffer.isBuffer(post_body)) {
          headers["Content-length"] = post_body.length;
        } else {
          headers["Content-length"] = Buffer.byteLength(post_body);
        }
      } else {
        headers["Content-length"] = 0;
      }
      headers["Content-Type"] = post_content_type;
      var path;
      if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
      if (parsedUrl.query) path = parsedUrl.pathname + "?" + parsedUrl.query;
      else path = parsedUrl.pathname;
      var request;
      if (parsedUrl.protocol == "https:") {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
      } else {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
      }
      var clientOptions = this._clientOptions;
      if (callback) {
        var data = "";
        var self = this;
        var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(parsedUrl.hostname);
        var callbackCalled = false;
        var passBackControl = function(response) {
          if (!callbackCalled) {
            callbackCalled = true;
            if (response.statusCode >= 200 && response.statusCode <= 299) {
              callback(null, data, response);
            } else {
              if ((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
                self._performSecureRequest(oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type, callback);
              } else {
                callback({ statusCode: response.statusCode, data }, data, response);
              }
            }
          }
        };
        request.on("response", function(response) {
          response.setEncoding("utf8");
          response.on("data", function(chunk) {
            data += chunk;
          });
          response.on("end", function() {
            passBackControl(response);
          });
          response.on("close", function() {
            if (allowEarlyClose) {
              passBackControl(response);
            }
          });
        });
        request.on("error", function(err) {
          if (!callbackCalled) {
            callbackCalled = true;
            callback(err);
          }
        });
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
          request.write(post_body);
        }
        request.end();
      } else {
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
          request.write(post_body);
        }
        return request;
      }
      return;
    };
    exports2.OAuth.prototype.setClientOptions = function(options) {
      var key, mergedOptions = {}, hasOwnProperty = Object.prototype.hasOwnProperty;
      for (key in this._defaultClientOptions) {
        if (!hasOwnProperty.call(options, key)) {
          mergedOptions[key] = this._defaultClientOptions[key];
        } else {
          mergedOptions[key] = options[key];
        }
      }
      this._clientOptions = mergedOptions;
    };
    exports2.OAuth.prototype.getOAuthAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
      var extraParams = {};
      if (typeof oauth_verifier == "function") {
        callback = oauth_verifier;
      } else {
        extraParams.oauth_verifier = oauth_verifier;
      }
      this._performSecureRequest(oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error2, data, response) {
        if (error2) callback(error2);
        else {
          var results = querystring.parse(data);
          var oauth_access_token = results["oauth_token"];
          delete results["oauth_token"];
          var oauth_access_token_secret = results["oauth_token_secret"];
          delete results["oauth_token_secret"];
          callback(null, oauth_access_token, oauth_access_token_secret, results);
        }
      });
    };
    exports2.OAuth.prototype.getProtectedResource = function(url, method, oauth_token, oauth_token_secret, callback) {
      this._performSecureRequest(oauth_token, oauth_token_secret, method, url, null, "", null, callback);
    };
    exports2.OAuth.prototype.delete = function(url, oauth_token, oauth_token_secret, callback) {
      return this._performSecureRequest(oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback);
    };
    exports2.OAuth.prototype.get = function(url, oauth_token, oauth_token_secret, callback) {
      return this._performSecureRequest(oauth_token, oauth_token_secret, "GET", url, null, "", null, callback);
    };
    exports2.OAuth.prototype._putOrPost = function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      var extra_params = null;
      if (typeof post_content_type == "function") {
        callback = post_content_type;
        post_content_type = null;
      }
      if (typeof post_body != "string" && !Buffer.isBuffer(post_body)) {
        post_content_type = "application/x-www-form-urlencoded";
        extra_params = post_body;
        post_body = null;
      }
      return this._performSecureRequest(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.put = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.post = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
      return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
    };
    exports2.OAuth.prototype.getOAuthRequestToken = function(extraParams, callback) {
      if (typeof extraParams == "function") {
        callback = extraParams;
        extraParams = {};
      }
      if (this._authorize_callback) {
        extraParams["oauth_callback"] = this._authorize_callback;
      }
      this._performSecureRequest(null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error2, data, response) {
        if (error2) callback(error2);
        else {
          var results = querystring.parse(data);
          var oauth_token = results["oauth_token"];
          var oauth_token_secret = results["oauth_token_secret"];
          delete results["oauth_token"];
          delete results["oauth_token_secret"];
          callback(null, oauth_token, oauth_token_secret, results);
        }
      });
    };
    exports2.OAuth.prototype.signUrl = function(url, oauth_token, oauth_token_secret, method) {
      if (method === void 0) {
        var method = "GET";
      }
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
      var parsedUrl = URL2.parse(url, false);
      var query = "";
      for (var i = 0; i < orderedParameters.length; i++) {
        query += orderedParameters[i][0] + "=" + this._encodeData(orderedParameters[i][1]) + "&";
      }
      query = query.substring(0, query.length - 1);
      return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + query;
    };
    exports2.OAuth.prototype.authHeader = function(url, oauth_token, oauth_token_secret, method) {
      if (method === void 0) {
        var method = "GET";
      }
      var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
      return this._buildAuthorizationHeaders(orderedParameters);
    };
  }
});

// node_modules/oauth/lib/oauth2.js
var require_oauth2 = __commonJS({
  "node_modules/oauth/lib/oauth2.js"(exports2) {
    var querystring = require("querystring");
    var crypto = require("crypto");
    var https = require("https");
    var http = require("http");
    var URL2 = require("url");
    var OAuthUtils = require_utils2();
    exports2.OAuth2 = function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
      this._clientId = clientId;
      this._clientSecret = clientSecret;
      this._baseSite = baseSite;
      this._authorizeUrl = authorizePath || "/oauth/authorize";
      this._accessTokenUrl = accessTokenPath || "/oauth/access_token";
      this._accessTokenName = "access_token";
      this._authMethod = "Bearer";
      this._customHeaders = customHeaders || {};
      this._useAuthorizationHeaderForGET = false;
      this._agent = void 0;
    };
    exports2.OAuth2.prototype.setAgent = function(agent) {
      this._agent = agent;
    };
    exports2.OAuth2.prototype.setAccessTokenName = function(name) {
      this._accessTokenName = name;
    };
    exports2.OAuth2.prototype.setAuthMethod = function(authMethod) {
      this._authMethod = authMethod;
    };
    exports2.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
      this._useAuthorizationHeaderForGET = useIt;
    };
    exports2.OAuth2.prototype._getAccessTokenUrl = function() {
      return this._baseSite + this._accessTokenUrl;
    };
    exports2.OAuth2.prototype.buildAuthHeader = function(token) {
      return this._authMethod + " " + token;
    };
    exports2.OAuth2.prototype._chooseHttpLibrary = function(parsedUrl) {
      var http_library = https;
      if (parsedUrl.protocol != "https:") {
        http_library = http;
      }
      return http_library;
    };
    exports2.OAuth2.prototype._request = function(method, url, headers, post_body, access_token, callback) {
      var parsedUrl = URL2.parse(url, true);
      if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
      }
      var http_library = this._chooseHttpLibrary(parsedUrl);
      var realHeaders = {};
      for (var key in this._customHeaders) {
        realHeaders[key] = this._customHeaders[key];
      }
      if (headers) {
        for (var key in headers) {
          realHeaders[key] = headers[key];
        }
      }
      realHeaders["Host"] = parsedUrl.host;
      if (!realHeaders["User-Agent"]) {
        realHeaders["User-Agent"] = "Node-oauth";
      }
      if (post_body) {
        if (Buffer.isBuffer(post_body)) {
          realHeaders["Content-Length"] = post_body.length;
        } else {
          realHeaders["Content-Length"] = Buffer.byteLength(post_body);
        }
      } else {
        realHeaders["Content-length"] = 0;
      }
      if (access_token && !("Authorization" in realHeaders)) {
        if (!parsedUrl.query) parsedUrl.query = {};
        parsedUrl.query[this._accessTokenName] = access_token;
      }
      var queryStr = querystring.stringify(parsedUrl.query);
      if (queryStr) queryStr = "?" + queryStr;
      var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + queryStr,
        method,
        headers: realHeaders
      };
      this._executeRequest(http_library, options, post_body, callback);
    };
    exports2.OAuth2.prototype._executeRequest = function(http_library, options, post_body, callback) {
      var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(options.host);
      var callbackCalled = false;
      function passBackControl(response, result2) {
        if (!callbackCalled) {
          callbackCalled = true;
          if (!(response.statusCode >= 200 && response.statusCode <= 299) && response.statusCode != 301 && response.statusCode != 302) {
            callback({ statusCode: response.statusCode, data: result2 });
          } else {
            callback(null, result2, response);
          }
        }
      }
      var result = "";
      if (this._agent) {
        options.agent = this._agent;
      }
      var request = http_library.request(options);
      request.on("response", function(response) {
        response.on("data", function(chunk) {
          result += chunk;
        });
        response.on("close", function(err) {
          if (allowEarlyClose) {
            passBackControl(response, result);
          }
        });
        response.addListener("end", function() {
          passBackControl(response, result);
        });
      });
      request.on("error", function(e) {
        callbackCalled = true;
        callback(e);
      });
      if ((options.method == "POST" || options.method == "PUT") && post_body) {
        request.write(post_body);
      }
      request.end();
    };
    exports2.OAuth2.prototype.getAuthorizeUrl = function(params) {
      var params = params || {};
      params["client_id"] = this._clientId;
      return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
    };
    exports2.OAuth2.prototype.getOAuthAccessToken = function(code, params, callback) {
      var params = params || {};
      params["client_id"] = this._clientId;
      params["client_secret"] = this._clientSecret;
      var codeParam = params.grant_type === "refresh_token" ? "refresh_token" : "code";
      params[codeParam] = code;
      var post_data = querystring.stringify(params);
      var post_headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error2, data, response) {
        if (error2) callback(error2);
        else {
          var results;
          try {
            results = JSON.parse(data);
          } catch (e) {
            results = querystring.parse(data);
          }
          var access_token = results["access_token"];
          var refresh_token = results["refresh_token"];
          delete results["refresh_token"];
          callback(null, access_token, refresh_token, results);
        }
      });
    };
    exports2.OAuth2.prototype.getProtectedResource = function(url, access_token, callback) {
      this._request("GET", url, {}, "", access_token, callback);
    };
    exports2.OAuth2.prototype.get = function(url, access_token, callback) {
      if (this._useAuthorizationHeaderForGET) {
        var headers = { "Authorization": this.buildAuthHeader(access_token) };
        access_token = null;
      } else {
        headers = {};
      }
      this._request("GET", url, headers, "", access_token, callback);
    };
  }
});

// node_modules/oauth/index.js
var require_oauth3 = __commonJS({
  "node_modules/oauth/index.js"(exports2) {
    exports2.OAuth = require_oauth().OAuth;
    exports2.OAuthEcho = require_oauth().OAuthEcho;
    exports2.OAuth2 = require_oauth2().OAuth2;
  }
});

// node_modules/evernote/lib/thrift/thrift.js
var require_thrift = __commonJS({
  "node_modules/evernote/lib/thrift/thrift.js"(exports2) {
    "use strict";
    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var Thrift = {
      Version: "0.9.0",
      Type: {
        STOP: 0,
        VOID: 1,
        BOOL: 2,
        BYTE: 3,
        I08: 3,
        DOUBLE: 4,
        I16: 6,
        I32: 8,
        I64: 10,
        STRING: 11,
        UTF7: 11,
        STRUCT: 12,
        EXCEPTION: 12,
        MAP: 13,
        SET: 14,
        LIST: 15,
        UTF8: 16,
        UTF16: 17,
        BINARY: 18
      },
      MessageType: {
        CALL: 1,
        REPLY: 2,
        EXCEPTION: 3
      },
      objectLength: function objectLength(obj) {
        var length = 0;
        for (var k in obj) {
          if (obj.hasOwnProperty(k)) {
            length++;
          }
        }
        return length;
      },
      inherits: function inherits(constructor, superConstructor) {
        function F() {
        }
        F.prototype = superConstructor.prototype;
        constructor.prototype = new F();
      }
    };
    Thrift.equals = function(t1, t2) {
      return t1 == t2 || t1 == Thrift.Type.BINARY && t2 == Thrift.Type.STRING || t1 == Thrift.Type.STRING && t2 == Thrift.Type.BINARY;
    };
    Thrift.serializedType = function(t) {
      return t == Thrift.Type.BINARY ? Thrift.Type.STRING : t;
    };
    Thrift.defaults = function(target) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
          for (var prop in source) {
            if (target[prop] === void 0) target[prop] = source[prop];
          }
        }
      });
      return target;
    };
    Thrift.extend = function(target) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
          for (var prop in source) {
            target[prop] = source[prop];
          }
        }
      });
      return target;
    };
    Thrift.Method = function(config2) {
      this.alias = config2.alias;
      this.args = config2.args;
      this.result = config2.result;
    };
    Thrift.Method.define = function(config2) {
      return new Thrift.Method(config2);
    };
    Thrift.Method.noop = function() {
    };
    Thrift.Method.sendException = function(output, seqid, structOrErr, structdef) {
      var config2;
      if (!structdef) {
        if (structOrErr instanceof Thrift.TApplicationException) {
          structdef = Thrift.TApplicationException;
        } else if (structOrErr instanceof Thrift.TException) {
          structdef = Thrift.TException;
        } else {
          structdef = Thrift.TApplicationException;
          config2 = {};
          if (structOrErr) {
            if (structOrErr.message) config2.message = structOrErr.message + "";
            if (structOrErr.code != null && Number.isFinite(config2.code)) config2.code = structOrErr.code;
          }
          structOrErr = new Thrift.TApplicationException(config2);
        }
      }
      output.writeMessageBegin("", Thrift.MessageType.EXCEPTION, seqid);
      structdef.write(output, structOrErr);
      output.writeMessageEnd();
      output.flush();
    };
    Thrift.Method.prototype.sendRequest = function(output, seqid, struct, callback) {
      output.writeMessageBegin(this.alias, Thrift.MessageType.CALL, seqid);
      this.args.write(output, struct);
      output.writeMessageEnd();
      output.flush(function(err, response) {
        if (err) callback(err);
        else this.processResponse(response, callback);
      }.bind(this));
    };
    Thrift.Method.prototype.sendResponse = function(output, seqid, struct) {
      output.writeMessageBegin(this.alias, Thrift.MessageType.REPLY, seqid);
      this.result.write(output, struct);
      output.writeMessageEnd();
      output.flush();
    };
    Thrift.Method.prototype.processResponse = function(response, callback) {
      var header;
      var result;
      var err;
      var index;
      callback = callback || Thrift.Method.noop;
      var header = response.readMessageBegin();
      if (header.mtype == Thrift.MessageType.EXCEPTION) {
        err = Thrift.TApplicationException.read(response);
        response.readMessageEnd();
        callback(err);
        return;
      }
      if (header.mtype != Thrift.MessageType.REPLY) {
        err = Error("Client expects REPLY but received unsupported message type: " + header.mtype);
        callback(err);
        return;
      }
      if (this.alias != header.fname) {
        err = Error("Unrecognized method name. Expected [" + me.alias + "] Received [" + header.fname + "]");
        callback(err);
        return;
      }
      result = this.result.read(response);
      response.readMessageEnd();
      for (index in this.result.fields) {
        if (index != 0 && result[this.result.fields[index].alias]) {
          err = result[this.result.fields[index].alias];
          callback(err);
          return;
        }
      }
      callback(null, result.returnValue);
    };
    Thrift.List = {};
    Thrift.List.define = function(name, type, def) {
      var ThriftList = function ThriftList2() {
        return [];
      };
      if (typeof name != "string") {
        def = type;
        type = name;
        name = "anonymous";
      }
      ThriftList.alias = name;
      ThriftList.type = type;
      ThriftList.def = def;
      ThriftList.read = Thrift.List.read.bind(null, ThriftList);
      ThriftList.write = Thrift.List.write.bind(null, ThriftList);
      return ThriftList;
    };
    Thrift.List.read = function(listdef, input) {
      var list = new listdef();
      var header = input.readListBegin();
      Thrift.List.readEntries(listdef, list, input, header.size);
      input.readListEnd();
      return list;
    };
    Thrift.List.readEntries = function(listdef, list, input, size) {
      var i;
      for (i = 0; i < size; i++) {
        if (listdef.def != null) {
          list.push(listdef.def.read(input));
        } else {
          list.push(input.readType(listdef.type));
        }
      }
    };
    Thrift.List.write = function(listdef, output, list) {
      var val;
      var index;
      var size = list.length;
      output.writeListBegin(listdef.type, size);
      for (index = 0; index < size; index++) {
        val = list[index];
        if (listdef.def) {
          listdef.def.write(output, val);
        } else {
          output.writeType(listdef.type, val);
        }
      }
      output.writeListEnd();
    };
    Thrift.Set = {};
    Thrift.Set.define = function(name, type, def) {
      var ThriftSet = function ThriftSet2() {
        return [];
      };
      if (typeof name != "string") {
        def = type;
        type = name;
        name = "anonymous";
      }
      ThriftSet.alias = name;
      ThriftSet.type = type;
      ThriftSet.def = def;
      ThriftSet.read = Thrift.Set.read.bind(null, ThriftSet);
      ThriftSet.write = Thrift.Set.write.bind(null, ThriftSet);
      return ThriftSet;
    };
    Thrift.Set.read = function(setdef, input) {
      var set = new setdef();
      var header = input.readSetBegin();
      Thrift.Set.readEntries(setdef, set, input, header.size);
      input.readSetEnd();
      return set;
    };
    Thrift.Set.readEntries = function(setdef, set, input, size) {
      var i;
      for (i = 0; i < size; i++) {
        if (setdef.def != null) {
          set.push(setdef.def.read(input));
        } else {
          set.push(input.readType(setdef.type));
        }
      }
    };
    Thrift.Set.write = function(setdef, output, set) {
      var val;
      var index;
      var size = set.length;
      output.writeSetBegin(setdef.type, size);
      for (index = 0; index < size; index++) {
        val = set[index];
        if (setdef.def) {
          setdef.def.write(output, val);
        } else {
          output.writeType(setdef.type, val);
        }
      }
      output.writeSetEnd();
    };
    Thrift.Map = {};
    Thrift.Map.define = function(name, ktype, vtype, vdef) {
      var ThriftMap = function ThriftMap2() {
        return {};
      };
      if (typeof name != "string") {
        vdef = vtype;
        vtype = ktype;
        ktype = name;
        name = "anonymous";
      }
      ThriftMap.alias = name;
      ThriftMap.ktype = ktype;
      ThriftMap.vtype = vtype;
      ThriftMap.vdef = vdef;
      ThriftMap.read = Thrift.Map.read.bind(null, ThriftMap);
      ThriftMap.write = Thrift.Map.write.bind(null, ThriftMap);
      return ThriftMap;
    };
    Thrift.Map.read = function(mapdef, input) {
      var map = new mapdef();
      var header = input.readMapBegin();
      Thrift.Map.readEntries(mapdef, map, input, header.size);
      input.readMapEnd();
      return map;
    };
    Thrift.Map.readEntries = function(mapdef, map, input, size) {
      var i;
      var key;
      for (i = 0; i < size; i++) {
        key = input.readType(mapdef.ktype);
        if (mapdef.vdef != null) {
          map[key] = mapdef.vdef.read(input);
        } else {
          map[key] = input.readType(mapdef.vtype);
        }
      }
    };
    Thrift.Map.write = function(mapdef, output, map) {
      var keys = Object.keys(map);
      var key;
      var value;
      var index;
      var size = keys.length;
      output.writeMapBegin(mapdef.ktype, mapdef.vtype, size);
      for (index = 0; index < size; index++) {
        key = keys[index];
        output.writeType(mapdef.ktype, key);
        value = map[key];
        if (mapdef.vdef) {
          mapdef.vdef.write(output, value);
        } else {
          output.writeType(mapdef.vtype, value);
        }
      }
      output.writeMapEnd();
    };
    Thrift.Struct = {};
    Thrift.Struct.define = function(name, fields) {
      var defaultValues = {};
      var fid;
      var field;
      fields = fields || {};
      for (fid in fields) {
        field = fields[fid];
        defaultValues[field.alias] = field.defaultValue || null;
      }
      var ThriftStruct = function ThriftStruct2(args2) {
        args2 = (typeof args2 === "undefined" ? "undefined" : _typeof(args2)) === "object" ? args2 : {};
        return Thrift.defaults({}, args2, defaultValues);
      };
      ThriftStruct.alias = name;
      ThriftStruct.fields = fields;
      ThriftStruct.defaultValues = defaultValues;
      ThriftStruct.read = Thrift.Struct.read.bind(null, ThriftStruct);
      ThriftStruct.write = Thrift.Struct.write.bind(null, ThriftStruct);
      ThriftStruct.values = Thrift.Struct.values.bind(null, ThriftStruct);
      ThriftStruct.setByDef = Thrift.Struct.setByDef.bind(null, ThriftStruct);
      return ThriftStruct;
    };
    Thrift.Struct.setByDef = function(structdef, struct, value) {
      var fid;
      var fields = structdef.fields;
      var field;
      var foundMatch = false;
      for (fid in fields) {
        field = fields[fid];
        if (field.def && value instanceof field.def) {
          struct[field.alias] = value;
          foundMatch = true;
          break;
        }
      }
      return foundMatch;
    };
    Thrift.Struct.values = function(structdef, struct) {
      var fields = structdef.fields;
      var keys = Object.keys(structdef.fields);
      var result = new Array(keys.length);
      var fid;
      var index;
      var i;
      for (i = 0; i < keys.length; i++) {
        fid = keys[i];
        index = fields[fid].index;
        if (index != null) result[index] = struct[fields[fid].alias];
        else result[i] = struct[fields[fid].alias];
      }
      return result;
    };
    Thrift.Struct.read = function(structdef, input) {
      var struct = new structdef();
      input.readStructBegin();
      Thrift.Struct.readFields(structdef, input, struct);
      input.readStructEnd();
      return struct;
    };
    Thrift.Struct.readFields = function(structdef, input, struct) {
      var header;
      var field;
      while (true) {
        header = input.readFieldBegin();
        if (header.ftype == Thrift.Type.STOP) return;
        field = structdef.fields[header.fid];
        if (field) {
          if (Thrift.equals(header.ftype, field.type)) {
            if (field.def) {
              struct[field.alias] = field.def.read(input);
            } else {
              struct[field.alias] = input.readType(field.type);
            }
          } else {
            input.skip(header.ftype);
          }
        } else {
          input.skip(header.ftype);
        }
        input.readFieldEnd();
      }
    };
    Thrift.Struct.write = function(structdef, output, struct) {
      var fid;
      var field;
      var value;
      output.writeStructBegin(structdef.alias);
      for (fid in structdef.fields) {
        field = structdef.fields[fid];
        value = struct[field.alias];
        if (value !== null && value !== void 0) {
          output.writeFieldBegin(field.alias, Thrift.serializedType(field.type), fid);
          if (field.def) {
            new field.def.write(output, value);
          } else {
            output.writeType(field.type, value);
          }
          output.writeFieldEnd();
        }
      }
      output.writeFieldStop();
      output.writeStructEnd();
    };
    Thrift.Exception = {};
    Thrift.Exception.define = function(name, fields) {
      var defaultValues = {};
      var fid;
      var field;
      fields = fields || {};
      for (fid in fields) {
        field = fields[fid];
        defaultValues[field.alias] = field.defaultValue || null;
      }
      var ThriftException = function ThriftException2(messageOrConfig) {
        var config2 = {};
        if ((typeof messageOrConfig === "undefined" ? "undefined" : _typeof(messageOrConfig)) == "object") {
          config2 = messageOrConfig;
        }
        Thrift.defaults(this, config2, defaultValues);
        if (typeof messageOrConfig == "string") {
          this.message = messageOrConfig;
        } else if (messageOrConfig instanceof Error) {
          this.message = messageOrConfig.message;
        }
      };
      ThriftException.alias = name;
      ThriftException.fields = fields;
      ThriftException.defaultValues = defaultValues;
      ThriftException.read = Thrift.Struct.read.bind(null, ThriftException);
      ThriftException.write = Thrift.Struct.write.bind(null, ThriftException);
      return ThriftException;
    };
    Thrift.TException = Thrift.Exception.define("TException", {
      1: { alias: "message", type: Thrift.Type.STRING }
    });
    Thrift.TApplicationExceptionType = {
      "UNKNOWN": 0,
      "UNKNOWN_METHOD": 1,
      "INVALID_MESSAGE_TYPE": 2,
      "WRONG_METHOD_NAME": 3,
      "BAD_SEQUENCE_ID": 4,
      "MISSING_RESULT": 5,
      "INTERNAL_ERROR": 6,
      "PROTOCOL_ERROR": 7
    };
    Thrift.TApplicationException = Thrift.Exception.define("TApplicationException", {
      1: { alias: "message", type: Thrift.Type.STRING },
      2: {
        alias: "code",
        type: Thrift.Type.I32,
        defaultValue: Thrift.TApplicationExceptionType.INTERNAL_ERROR
      }
    });
    Thrift.Processor = function() {
      this.methods = {};
    };
    Thrift.Processor.prototype.addMethod = function(mdef, fn) {
      this.methods[mdef.alias] = {
        def: mdef,
        fn
      };
    };
    Thrift.Processor.prototype.process = function(input, output) {
      var method;
      var def;
      var result;
      var header;
      try {
        header = input.readMessageBegin();
        if (header.mtype != Thrift.MessageType.CALL) {
          throw new Thrift.TException("Server expects CALL but received unsupported message type: " + header.mtype);
        }
        method = me.methods[header.fname];
        if (method == null) {
          throw new Thrift.TException("Unrecognized method name: " + header.fname);
        }
        def = method.def;
        def.args.read(input);
        result = new def.result();
        method.fn.apply(null, def.args.values(args).concat([function(returnValue) {
          result.returnValue = returnValue;
          def.sendResponse(output, header.seqid, result);
        }, function(err) {
          var seqid2 = header ? header.seqid : -1;
          if (result && def.result.setByDef(result, err)) {
            def.sendResponse(output, header.seqid, result);
          } else {
            Thrift.Method.sendException(output, seqid2, err);
          }
        }]));
      } catch (err) {
        console.log(err);
        var seqid = header ? header.seqid : -1;
        if (result && def.result.setByDef(result, err)) {
          def.sendResponse(output, header.seqid, result);
        } else {
          Thrift.Method.sendException(output, seqid, err);
        }
      }
    };
    Object.keys(Thrift).forEach(function(key) {
      exports2[key] = Thrift[key];
    });
  }
});

// node_modules/evernote/lib/thrift/gen-js2/Limits.js
var require_Limits = __commonJS({
  "node_modules/evernote/lib/thrift/gen-js2/Limits.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    module2.exports.EDAM_ATTRIBUTE_LEN_MIN = 1;
    module2.exports.EDAM_ATTRIBUTE_LEN_MAX = 4096;
    module2.exports.EDAM_ATTRIBUTE_REGEX = "^[^\\p{Cc}\\p{Zl}\\p{Zp}]{1,4096}$";
    module2.exports.EDAM_ATTRIBUTE_LIST_MAX = 100;
    module2.exports.EDAM_ATTRIBUTE_MAP_MAX = 100;
    module2.exports.EDAM_GUID_LEN_MIN = 36;
    module2.exports.EDAM_GUID_LEN_MAX = 36;
    module2.exports.EDAM_GUID_REGEX = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";
    module2.exports.EDAM_EMAIL_LEN_MIN = 6;
    module2.exports.EDAM_EMAIL_LEN_MAX = 255;
    module2.exports.EDAM_EMAIL_LOCAL_REGEX = "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$";
    module2.exports.EDAM_EMAIL_DOMAIN_REGEX = "^[A-Za-z0-9-]*[A-Za-z0-9](\\.[A-Za-z0-9-]*[A-Za-z0-9])*\\.([A-Za-z]{2,})$";
    module2.exports.EDAM_EMAIL_REGEX = "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9-]*[A-Za-z0-9](\\.[A-Za-z0-9-]*[A-Za-z0-9])*\\.([A-Za-z]{2,})$";
    module2.exports.EDAM_VAT_REGEX = "^(AT)?U[0-9]{8}$|^(BE)?0?[0-9]{9}$|^(BG)?[0-9]{9,10}$|^(CY)?[0-9]{8}L$|^(CZ)?[0-9]{8,10}$|^(DE)?[0-9]{9}$|^(DK)?[0-9]{8}$|^(EE)?[0-9]{9}$|^(EL|GR)?[0-9]{9}$|^(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]$|^(FI)?[0-9]{8}$|^(FR)?[0-9A-Z]{2}[0-9]{9}$|^(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$|^(HU)?[0-9]{8}$|^(IE)?[0-9]S[0-9]{5}L$|^(IT)?[0-9]{11}$|^(LT)?([0-9]{9}|[0-9]{12})$|^(LU)?[0-9]{8}$|^(LV)?[0-9]{11}$|^(MT)?[0-9]{8}$|^(NL)?[0-9]{9}B[0-9]{2}$|^(PL)?[0-9]{10}$|^(PT)?[0-9]{9}$|^(RO)?[0-9]{2,10}$|^(SE)?[0-9]{12}$|^(SI)?[0-9]{8}$|^(SK)?[0-9]{10}$|^[0-9]{9}MVA$|^[0-9]{6}$|^CHE[0-9]{9}(TVA|MWST|IVA)$";
    module2.exports.EDAM_TIMEZONE_LEN_MIN = 1;
    module2.exports.EDAM_TIMEZONE_LEN_MAX = 32;
    module2.exports.EDAM_TIMEZONE_REGEX = "^([A-Za-z_-]+(/[A-Za-z_-]+)*)|(GMT(-|\\+)[0-9]{1,2}(:[0-9]{2})?)$";
    module2.exports.EDAM_MIME_LEN_MIN = 3;
    module2.exports.EDAM_MIME_LEN_MAX = 255;
    module2.exports.EDAM_MIME_REGEX = "^[A-Za-z]+/[A-Za-z0-9._+-]+$";
    module2.exports.EDAM_MIME_TYPE_GIF = "image/gif";
    module2.exports.EDAM_MIME_TYPE_JPEG = "image/jpeg";
    module2.exports.EDAM_MIME_TYPE_PNG = "image/png";
    module2.exports.EDAM_MIME_TYPE_TIFF = "image/tiff";
    module2.exports.EDAM_MIME_TYPE_WAV = "audio/wav";
    module2.exports.EDAM_MIME_TYPE_MP3 = "audio/mpeg";
    module2.exports.EDAM_MIME_TYPE_AMR = "audio/amr";
    module2.exports.EDAM_MIME_TYPE_AAC = "audio/aac";
    module2.exports.EDAM_MIME_TYPE_M4A = "audio/mp4";
    module2.exports.EDAM_MIME_TYPE_MP4_VIDEO = "video/mp4";
    module2.exports.EDAM_MIME_TYPE_INK = "application/vnd.evernote.ink";
    module2.exports.EDAM_MIME_TYPE_PDF = "application/pdf";
    module2.exports.EDAM_MIME_TYPE_DEFAULT = "application/octet-stream";
    module2.exports.EDAM_MIME_TYPES = ["image/gif", "image/jpeg", "image/png", "audio/wav", "audio/mpeg", "audio/amr", "application/vnd.evernote.ink", "application/pdf", "video/mp4", "audio/aac", "audio/mp4"];
    module2.exports.EDAM_INDEXABLE_RESOURCE_MIME_TYPES = ["application/msword", "application/mspowerpoint", "application/excel", "application/vnd.ms-word", "application/vnd.ms-powerpoint", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.apple.pages", "application/vnd.apple.numbers", "application/vnd.apple.keynote", "application/x-iwork-pages-sffpages", "application/x-iwork-numbers-sffnumbers", "application/x-iwork-keynote-sffkey"];
    module2.exports.EDAM_INDEXABLE_PLAINTEXT_MIME_TYPES = ["application/x-sh", "application/x-bsh", "application/sql", "application/x-sql"];
    module2.exports.EDAM_SEARCH_QUERY_LEN_MIN = 0;
    module2.exports.EDAM_SEARCH_QUERY_LEN_MAX = 1024;
    module2.exports.EDAM_SEARCH_QUERY_REGEX = "^[^\\p{Cc}\\p{Zl}\\p{Zp}]{0,1024}$";
    module2.exports.EDAM_HASH_LEN = 16;
    module2.exports.EDAM_USER_USERNAME_LEN_MIN = 1;
    module2.exports.EDAM_USER_USERNAME_LEN_MAX = 64;
    module2.exports.EDAM_USER_USERNAME_REGEX = "^[a-z0-9]([a-z0-9_-]{0,62}[a-z0-9])?$";
    module2.exports.EDAM_USER_NAME_LEN_MIN = 1;
    module2.exports.EDAM_USER_NAME_LEN_MAX = 255;
    module2.exports.EDAM_USER_NAME_REGEX = "^[^\\p{Cc}\\p{Zl}\\p{Zp}]{1,255}$";
    module2.exports.EDAM_TAG_NAME_LEN_MIN = 1;
    module2.exports.EDAM_TAG_NAME_LEN_MAX = 100;
    module2.exports.EDAM_TAG_NAME_REGEX = "^[^,\\p{Cc}\\p{Z}]([^,\\p{Cc}\\p{Zl}\\p{Zp}]{0,98}[^,\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_NOTE_TITLE_LEN_MIN = 1;
    module2.exports.EDAM_NOTE_TITLE_LEN_MAX = 255;
    module2.exports.EDAM_NOTE_TITLE_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,253}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_NOTE_CONTENT_LEN_MIN = 0;
    module2.exports.EDAM_NOTE_CONTENT_LEN_MAX = 5242880;
    module2.exports.EDAM_APPLICATIONDATA_NAME_LEN_MIN = 3;
    module2.exports.EDAM_APPLICATIONDATA_NAME_LEN_MAX = 32;
    module2.exports.EDAM_APPLICATIONDATA_VALUE_LEN_MIN = 0;
    module2.exports.EDAM_APPLICATIONDATA_VALUE_LEN_MAX = 4092;
    module2.exports.EDAM_APPLICATIONDATA_ENTRY_LEN_MAX = 4095;
    module2.exports.EDAM_APPLICATIONDATA_NAME_REGEX = "^[A-Za-z0-9_.-]{3,32}$";
    module2.exports.EDAM_APPLICATIONDATA_VALUE_REGEX = "^[\\p{Space}[^\\p{Cc}]]{0,4092}$";
    module2.exports.EDAM_NOTEBOOK_NAME_LEN_MIN = 1;
    module2.exports.EDAM_NOTEBOOK_NAME_LEN_MAX = 100;
    module2.exports.EDAM_NOTEBOOK_NAME_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,98}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_NOTEBOOK_STACK_LEN_MIN = 1;
    module2.exports.EDAM_NOTEBOOK_STACK_LEN_MAX = 100;
    module2.exports.EDAM_NOTEBOOK_STACK_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,98}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_PUBLISHING_URI_LEN_MIN = 1;
    module2.exports.EDAM_PUBLISHING_URI_LEN_MAX = 255;
    module2.exports.EDAM_PUBLISHING_URI_REGEX = "^[a-zA-Z0-9.~_+-]{1,255}$";
    module2.exports.EDAM_PUBLISHING_URI_PROHIBITED = [".", ".."];
    module2.exports.EDAM_PUBLISHING_DESCRIPTION_LEN_MIN = 1;
    module2.exports.EDAM_PUBLISHING_DESCRIPTION_LEN_MAX = 200;
    module2.exports.EDAM_PUBLISHING_DESCRIPTION_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,198}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_SAVED_SEARCH_NAME_LEN_MIN = 1;
    module2.exports.EDAM_SAVED_SEARCH_NAME_LEN_MAX = 100;
    module2.exports.EDAM_SAVED_SEARCH_NAME_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,98}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_USER_PASSWORD_LEN_MIN = 6;
    module2.exports.EDAM_USER_PASSWORD_LEN_MAX = 64;
    module2.exports.EDAM_USER_PASSWORD_REGEX = "^[A-Za-z0-9!#$%&'()*+,./:;<=>?@^_`{|}~\\[\\]\\\\-]{6,64}$";
    module2.exports.EDAM_BUSINESS_URI_LEN_MAX = 32;
    module2.exports.EDAM_BUSINESS_MARKETING_CODE_REGEX_PATTERN = "[A-Za-z0-9-]{1,128}";
    module2.exports.EDAM_NOTE_TAGS_MAX = 100;
    module2.exports.EDAM_NOTE_RESOURCES_MAX = 1e3;
    module2.exports.EDAM_USER_TAGS_MAX = 1e5;
    module2.exports.EDAM_BUSINESS_TAGS_MAX = 1e5;
    module2.exports.EDAM_USER_SAVED_SEARCHES_MAX = 100;
    module2.exports.EDAM_USER_NOTES_MAX = 1e5;
    module2.exports.EDAM_BUSINESS_NOTES_MAX = 5e5;
    module2.exports.EDAM_USER_NOTEBOOKS_MAX = 250;
    module2.exports.EDAM_BUSINESS_NOTEBOOKS_MAX = 1e4;
    module2.exports.EDAM_USER_RECENT_MAILED_ADDRESSES_MAX = 10;
    module2.exports.EDAM_USER_MAIL_LIMIT_DAILY_FREE = 50;
    module2.exports.EDAM_USER_MAIL_LIMIT_DAILY_PREMIUM = 200;
    module2.exports.EDAM_USER_UPLOAD_LIMIT_FREE = 62914560;
    module2.exports.EDAM_USER_UPLOAD_LIMIT_PREMIUM = 10737418240;
    module2.exports.EDAM_USER_UPLOAD_LIMIT_PLUS = 1073741824;
    module2.exports.EDAM_USER_UPLOAD_SURVEY_THRESHOLD = 5368709120;
    module2.exports.EDAM_USER_UPLOAD_LIMIT_BUSINESS = 10737418240;
    module2.exports.EDAM_USER_UPLOAD_LIMIT_BUSINESS_PER_USER = 2147483647;
    module2.exports.EDAM_NOTE_SIZE_MAX_FREE = 26214400;
    module2.exports.EDAM_NOTE_SIZE_MAX_PREMIUM = 209715200;
    module2.exports.EDAM_RESOURCE_SIZE_MAX_FREE = 26214400;
    module2.exports.EDAM_RESOURCE_SIZE_MAX_PREMIUM = 209715200;
    module2.exports.EDAM_USER_LINKED_NOTEBOOK_MAX = 100;
    module2.exports.EDAM_USER_LINKED_NOTEBOOK_MAX_PREMIUM = 500;
    module2.exports.EDAM_NOTEBOOK_BUSINESS_SHARED_NOTEBOOK_MAX = 5e3;
    module2.exports.EDAM_NOTEBOOK_PERSONAL_SHARED_NOTEBOOK_MAX = 500;
    module2.exports.EDAM_NOTE_BUSINESS_SHARED_NOTE_MAX = 1e3;
    module2.exports.EDAM_NOTE_PERSONAL_SHARED_NOTE_MAX = 100;
    module2.exports.EDAM_NOTE_CONTENT_CLASS_LEN_MIN = 3;
    module2.exports.EDAM_NOTE_CONTENT_CLASS_LEN_MAX = 32;
    module2.exports.EDAM_NOTE_CONTENT_CLASS_REGEX = "^[A-Za-z0-9_.-]{3,32}$";
    module2.exports.EDAM_HELLO_APP_CONTENT_CLASS_PREFIX = "evernote.hello.";
    module2.exports.EDAM_FOOD_APP_CONTENT_CLASS_PREFIX = "evernote.food.";
    module2.exports.EDAM_CONTENT_CLASS_HELLO_ENCOUNTER = "evernote.hello.encounter";
    module2.exports.EDAM_CONTENT_CLASS_HELLO_PROFILE = "evernote.hello.profile";
    module2.exports.EDAM_CONTENT_CLASS_FOOD_MEAL = "evernote.food.meal";
    module2.exports.EDAM_CONTENT_CLASS_SKITCH_PREFIX = "evernote.skitch";
    module2.exports.EDAM_CONTENT_CLASS_SKITCH = "evernote.skitch";
    module2.exports.EDAM_CONTENT_CLASS_SKITCH_PDF = "evernote.skitch.pdf";
    module2.exports.EDAM_CONTENT_CLASS_PENULTIMATE_PREFIX = "evernote.penultimate.";
    module2.exports.EDAM_CONTENT_CLASS_PENULTIMATE_NOTEBOOK = "evernote.penultimate.notebook";
    module2.exports.EDAM_SOURCE_APPLICATION_POSTIT = "postit";
    module2.exports.EDAM_SOURCE_APPLICATION_MOLESKINE = "moleskine";
    module2.exports.EDAM_SOURCE_APPLICATION_EN_SCANSNAP = "scanner.scansnap.evernote";
    module2.exports.EDAM_SOURCE_APPLICATION_EWC = "clipncite.web";
    module2.exports.EDAM_SOURCE_OUTLOOK_CLIPPER = "app.ms.outlook";
    module2.exports.EDAM_NOTE_TITLE_QUALITY_UNTITLED = 0;
    module2.exports.EDAM_NOTE_TITLE_QUALITY_LOW = 1;
    module2.exports.EDAM_NOTE_TITLE_QUALITY_MEDIUM = 2;
    module2.exports.EDAM_NOTE_TITLE_QUALITY_HIGH = 3;
    module2.exports.EDAM_RELATED_PLAINTEXT_LEN_MIN = 1;
    module2.exports.EDAM_RELATED_PLAINTEXT_LEN_MAX = 131072;
    module2.exports.EDAM_RELATED_MAX_NOTES = 25;
    module2.exports.EDAM_RELATED_MAX_NOTEBOOKS = 1;
    module2.exports.EDAM_RELATED_MAX_TAGS = 25;
    module2.exports.EDAM_RELATED_MAX_EXPERTS = 10;
    module2.exports.EDAM_RELATED_MAX_RELATED_CONTENT = 10;
    module2.exports.EDAM_BUSINESS_NOTEBOOK_DESCRIPTION_LEN_MIN = 1;
    module2.exports.EDAM_BUSINESS_NOTEBOOK_DESCRIPTION_LEN_MAX = 200;
    module2.exports.EDAM_BUSINESS_NOTEBOOK_DESCRIPTION_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,198}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_BUSINESS_PHONE_NUMBER_LEN_MAX = 20;
    module2.exports.EDAM_PREFERENCE_NAME_LEN_MIN = 3;
    module2.exports.EDAM_PREFERENCE_NAME_LEN_MAX = 32;
    module2.exports.EDAM_PREFERENCE_VALUE_LEN_MIN = 1;
    module2.exports.EDAM_PREFERENCE_VALUE_LEN_MAX = 1024;
    module2.exports.EDAM_MAX_PREFERENCES = 100;
    module2.exports.EDAM_MAX_VALUES_PER_PREFERENCE = 256;
    module2.exports.EDAM_PREFERENCE_ONLY_ONE_VALUE_LEN_MAX = 16384;
    module2.exports.EDAM_PREFERENCE_NAME_REGEX = "^[A-Za-z0-9_.-]{3,32}$";
    module2.exports.EDAM_PREFERENCE_VALUE_REGEX = "^[^\\p{Cc}]{1,1024}$";
    module2.exports.EDAM_PREFERENCE_ONLY_ONE_VALUE_REGEX = "^[^\\p{Cc}]{1,16384}$";
    module2.exports.EDAM_PREFERENCE_SHORTCUTS = "evernote.shortcuts";
    module2.exports.EDAM_PREFERENCE_BUSINESS_DEFAULT_NOTEBOOK = "evernote.business.notebook";
    module2.exports.EDAM_PREFERENCE_BUSINESS_QUICKNOTE = "evernote.business.quicknote";
    module2.exports.EDAM_PREFERENCE_SHORTCUTS_MAX_VALUES = 250;
    module2.exports.EDAM_DEVICE_ID_LEN_MAX = 32;
    module2.exports.EDAM_DEVICE_ID_REGEX = "^[^\\p{Cc}]{1,32}$";
    module2.exports.EDAM_DEVICE_DESCRIPTION_LEN_MAX = 64;
    module2.exports.EDAM_DEVICE_DESCRIPTION_REGEX = "^[^\\p{Cc}]{1,64}$";
    module2.exports.EDAM_SEARCH_SUGGESTIONS_MAX = 10;
    module2.exports.EDAM_SEARCH_SUGGESTIONS_PREFIX_LEN_MAX = 1024;
    module2.exports.EDAM_SEARCH_SUGGESTIONS_PREFIX_LEN_MIN = 2;
    module2.exports.EDAM_FIND_CONTACT_DEFAULT_MAX_RESULTS = 100;
    module2.exports.EDAM_FIND_CONTACT_MAX_RESULTS = 256;
    module2.exports.EDAM_NOTE_LOCK_VIEWERS_NOTES_MAX = 150;
    module2.exports.EDAM_GET_ORDERS_MAX_RESULTS = 2e3;
    module2.exports.EDAM_MESSAGE_BODY_LEN_MAX = 2048;
    module2.exports.EDAM_MESSAGE_BODY_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,2046}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_MESSAGE_RECIPIENTS_MAX = 50;
    module2.exports.EDAM_MESSAGE_ATTACHMENTS_MAX = 100;
    module2.exports.EDAM_MESSAGE_ATTACHMENT_TITLE_LEN_MAX = 255;
    module2.exports.EDAM_MESSAGE_ATTACHMENT_TITLE_REGEX = "^[^\\p{Cc}\\p{Z}]([^\\p{Cc}\\p{Zl}\\p{Zp}]{0,253}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_MESSAGE_ATTACHMENT_SNIPPET_LEN_MAX = 2048;
    module2.exports.EDAM_MESSAGE_ATTACHMENT_SNIPPET_REGEX = "^[^\\p{Cc}\\p{Z}]([\\n[^\\p{Cc}\\p{Zl}\\p{Zp}]]{0,2046}[^\\p{Cc}\\p{Z}])?$";
    module2.exports.EDAM_USER_PROFILE_PHOTO_MAX_BYTES = 716800;
    module2.exports.EDAM_PROMOTION_ID_LEN_MAX = 32;
    module2.exports.EDAM_PROMOTION_ID_REGEX = "^[A-Za-z0-9_.-]{1,32}$";
    module2.exports.EDAM_APP_RATING_MIN = 1;
    module2.exports.EDAM_APP_RATING_MAX = 5;
    module2.exports.EDAM_SNIPPETS_NOTES_MAX = 24;
    module2.exports.EDAM_CONNECTED_IDENTITY_REQUEST_MAX = 100;
  }
});

// node_modules/evernote/lib/thrift/gen-js2/Types.js
var require_Types = __commonJS({
  "node_modules/evernote/lib/thrift/gen-js2/Types.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    var Limits = require_Limits();
    module2.exports.PrivilegeLevel = {
      "NORMAL": 1,
      "PREMIUM": 3,
      "VIP": 5,
      "MANAGER": 7,
      "SUPPORT": 8,
      "ADMIN": 9
    };
    module2.exports.ServiceLevel = {
      "BASIC": 1,
      "PLUS": 2,
      "PREMIUM": 3
    };
    module2.exports.QueryFormat = {
      "USER": 1,
      "SEXP": 2
    };
    module2.exports.NoteSortOrder = {
      "CREATED": 1,
      "UPDATED": 2,
      "RELEVANCE": 3,
      "UPDATE_SEQUENCE_NUMBER": 4,
      "TITLE": 5
    };
    module2.exports.PremiumOrderStatus = {
      "NONE": 0,
      "PENDING": 1,
      "ACTIVE": 2,
      "FAILED": 3,
      "CANCELLATION_PENDING": 4,
      "CANCELED": 5
    };
    module2.exports.SharedNotebookPrivilegeLevel = {
      "READ_NOTEBOOK": 0,
      "MODIFY_NOTEBOOK_PLUS_ACTIVITY": 1,
      "READ_NOTEBOOK_PLUS_ACTIVITY": 2,
      "GROUP": 3,
      "FULL_ACCESS": 4,
      "BUSINESS_FULL_ACCESS": 5
    };
    module2.exports.SharedNotePrivilegeLevel = {
      "READ_NOTE": 0,
      "MODIFY_NOTE": 1,
      "FULL_ACCESS": 2
    };
    module2.exports.SponsoredGroupRole = {
      "GROUP_MEMBER": 1,
      "GROUP_ADMIN": 2,
      "GROUP_OWNER": 3
    };
    module2.exports.BusinessUserRole = {
      "ADMIN": 1,
      "NORMAL": 2
    };
    module2.exports.SharedNotebookInstanceRestrictions = {
      "ASSIGNED": 1,
      "NO_SHARED_NOTEBOOKS": 2
    };
    module2.exports.ReminderEmailConfig = {
      "DO_NOT_SEND": 1,
      "SEND_DAILY_EMAIL": 2
    };
    module2.exports.BusinessInvitationStatus = {
      "APPROVED": 0,
      "REQUESTED": 1,
      "REDEEMED": 2
    };
    module2.exports.ContactType = {
      "EVERNOTE": 1,
      "SMS": 2,
      "FACEBOOK": 3,
      "EMAIL": 4,
      "TWITTER": 5,
      "LINKEDIN": 6
    };
    module2.exports.RelatedContentType = {
      "NEWS_ARTICLE": 1,
      "PROFILE_PERSON": 2,
      "PROFILE_ORGANIZATION": 3,
      "REFERENCE_MATERIAL": 4
    };
    module2.exports.RelatedContentAccess = {
      "NOT_ACCESSIBLE": 0,
      "DIRECT_LINK_ACCESS_OK": 1,
      "DIRECT_LINK_LOGIN_REQUIRED": 2,
      "DIRECT_LINK_EMBEDDED_VIEW": 3
    };
    module2.exports.UserIdentityType = {
      "EVERNOTE_USERID": 1,
      "EMAIL": 2,
      "IDENTITYID": 3
    };
    module2.exports.CLASSIFICATION_RECIPE_USER_NON_RECIPE = "000";
    module2.exports.CLASSIFICATION_RECIPE_USER_RECIPE = "001";
    module2.exports.CLASSIFICATION_RECIPE_SERVICE_RECIPE = "002";
    module2.exports.EDAM_NOTE_SOURCE_WEB_CLIP = "web.clip";
    module2.exports.EDAM_NOTE_SOURCE_WEB_CLIP_SIMPLIFIED = "Clearly";
    module2.exports.EDAM_NOTE_SOURCE_MAIL_CLIP = "mail.clip";
    module2.exports.EDAM_NOTE_SOURCE_MAIL_SMTP_GATEWAY = "mail.smtp";
    module2.exports.Data = Thrift.Struct.define("Data", {
      1: { alias: "bodyHash", type: Thrift.Type.BINARY },
      2: { alias: "size", type: Thrift.Type.I32 },
      3: { alias: "body", type: Thrift.Type.BINARY }
    });
    module2.exports.UserAttributes = Thrift.Struct.define("UserAttributes", {
      1: { alias: "defaultLocationName", type: Thrift.Type.STRING },
      2: { alias: "defaultLatitude", type: Thrift.Type.DOUBLE },
      3: { alias: "defaultLongitude", type: Thrift.Type.DOUBLE },
      4: { alias: "preactivation", type: Thrift.Type.BOOL },
      5: { alias: "viewedPromotions", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      6: { alias: "incomingEmailAddress", type: Thrift.Type.STRING },
      7: { alias: "recentMailedAddresses", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      9: { alias: "comments", type: Thrift.Type.STRING },
      11: { alias: "dateAgreedToTermsOfService", type: Thrift.Type.I64 },
      12: { alias: "maxReferrals", type: Thrift.Type.I32 },
      13: { alias: "referralCount", type: Thrift.Type.I32 },
      14: { alias: "refererCode", type: Thrift.Type.STRING },
      15: { alias: "sentEmailDate", type: Thrift.Type.I64 },
      16: { alias: "sentEmailCount", type: Thrift.Type.I32 },
      17: { alias: "dailyEmailLimit", type: Thrift.Type.I32 },
      18: { alias: "emailOptOutDate", type: Thrift.Type.I64 },
      19: { alias: "partnerEmailOptInDate", type: Thrift.Type.I64 },
      20: { alias: "preferredLanguage", type: Thrift.Type.STRING },
      21: { alias: "preferredCountry", type: Thrift.Type.STRING },
      22: { alias: "clipFullPage", type: Thrift.Type.BOOL },
      23: { alias: "twitterUserName", type: Thrift.Type.STRING },
      24: { alias: "twitterId", type: Thrift.Type.STRING },
      25: { alias: "groupName", type: Thrift.Type.STRING },
      26: { alias: "recognitionLanguage", type: Thrift.Type.STRING },
      28: { alias: "referralProof", type: Thrift.Type.STRING },
      29: { alias: "educationalDiscount", type: Thrift.Type.BOOL },
      30: { alias: "businessAddress", type: Thrift.Type.STRING },
      31: { alias: "hideSponsorBilling", type: Thrift.Type.BOOL },
      32: { alias: "taxExempt", type: Thrift.Type.BOOL },
      33: { alias: "useEmailAutoFiling", type: Thrift.Type.BOOL },
      34: { alias: "reminderEmailConfig", type: Thrift.Type.I32 },
      35: { alias: "emailAddressLastConfirmed", type: Thrift.Type.I64 },
      36: { alias: "passwordUpdated", type: Thrift.Type.I64 },
      37: { alias: "salesforcePushEnabled", type: Thrift.Type.BOOL },
      38: { alias: "shouldLogClientEvent", type: Thrift.Type.BOOL }
    });
    module2.exports.BusinessUserAttributes = Thrift.Struct.define("BusinessUserAttributes", {
      1: { alias: "title", type: Thrift.Type.STRING },
      2: { alias: "location", type: Thrift.Type.STRING },
      3: { alias: "department", type: Thrift.Type.STRING },
      4: { alias: "mobilePhone", type: Thrift.Type.STRING },
      5: { alias: "linkedInProfileUrl", type: Thrift.Type.STRING },
      6: { alias: "workPhone", type: Thrift.Type.STRING },
      7: { alias: "companyStartDate", type: Thrift.Type.I64 }
    });
    module2.exports.Accounting = Thrift.Struct.define("Accounting", {
      2: { alias: "uploadLimitEnd", type: Thrift.Type.I64 },
      3: { alias: "uploadLimitNextMonth", type: Thrift.Type.I64 },
      4: { alias: "premiumServiceStatus", type: Thrift.Type.I32 },
      5: { alias: "premiumOrderNumber", type: Thrift.Type.STRING },
      6: { alias: "premiumCommerceService", type: Thrift.Type.STRING },
      7: { alias: "premiumServiceStart", type: Thrift.Type.I64 },
      8: { alias: "premiumServiceSKU", type: Thrift.Type.STRING },
      9: { alias: "lastSuccessfulCharge", type: Thrift.Type.I64 },
      10: { alias: "lastFailedCharge", type: Thrift.Type.I64 },
      11: { alias: "lastFailedChargeReason", type: Thrift.Type.STRING },
      12: { alias: "nextPaymentDue", type: Thrift.Type.I64 },
      13: { alias: "premiumLockUntil", type: Thrift.Type.I64 },
      14: { alias: "updated", type: Thrift.Type.I64 },
      16: { alias: "premiumSubscriptionNumber", type: Thrift.Type.STRING },
      17: { alias: "lastRequestedCharge", type: Thrift.Type.I64 },
      18: { alias: "currency", type: Thrift.Type.STRING },
      19: { alias: "unitPrice", type: Thrift.Type.I32 },
      20: { alias: "businessId", type: Thrift.Type.I32 },
      21: { alias: "businessName", type: Thrift.Type.STRING },
      22: { alias: "businessRole", type: Thrift.Type.I32 },
      23: { alias: "unitDiscount", type: Thrift.Type.I32 },
      24: { alias: "nextChargeDate", type: Thrift.Type.I64 },
      25: { alias: "availablePoints", type: Thrift.Type.I32 }
    });
    module2.exports.BusinessUserInfo = Thrift.Struct.define("BusinessUserInfo", {
      1: { alias: "businessId", type: Thrift.Type.I32 },
      2: { alias: "businessName", type: Thrift.Type.STRING },
      3: { alias: "role", type: Thrift.Type.I32 },
      4: { alias: "email", type: Thrift.Type.STRING },
      5: { alias: "updated", type: Thrift.Type.I64 }
    });
    module2.exports.AccountLimits = Thrift.Struct.define("AccountLimits", {
      1: { alias: "userMailLimitDaily", type: Thrift.Type.I32 },
      2: { alias: "noteSizeMax", type: Thrift.Type.I64 },
      3: { alias: "resourceSizeMax", type: Thrift.Type.I64 },
      4: { alias: "userLinkedNotebookMax", type: Thrift.Type.I32 },
      5: { alias: "uploadLimit", type: Thrift.Type.I64 },
      6: { alias: "userNoteCountMax", type: Thrift.Type.I32 },
      7: { alias: "userNotebookCountMax", type: Thrift.Type.I32 },
      8: { alias: "userTagCountMax", type: Thrift.Type.I32 },
      9: { alias: "noteTagCountMax", type: Thrift.Type.I32 },
      10: { alias: "userSavedSearchesMax", type: Thrift.Type.I32 },
      11: { alias: "noteResourceCountMax", type: Thrift.Type.I32 }
    });
    module2.exports.PremiumInfo = Thrift.Struct.define("PremiumInfo", {
      1: { alias: "currentTime", type: Thrift.Type.I64 },
      2: { alias: "premium", type: Thrift.Type.BOOL },
      3: { alias: "premiumRecurring", type: Thrift.Type.BOOL },
      4: { alias: "premiumExpirationDate", type: Thrift.Type.I64 },
      5: { alias: "premiumExtendable", type: Thrift.Type.BOOL },
      6: { alias: "premiumPending", type: Thrift.Type.BOOL },
      7: { alias: "premiumCancellationPending", type: Thrift.Type.BOOL },
      8: { alias: "canPurchaseUploadAllowance", type: Thrift.Type.BOOL },
      11: { alias: "premiumUpgradable", type: Thrift.Type.BOOL }
    });
    module2.exports.User = Thrift.Struct.define("User", {
      1: { alias: "id", type: Thrift.Type.I32 },
      2: { alias: "username", type: Thrift.Type.STRING },
      3: { alias: "email", type: Thrift.Type.STRING },
      4: { alias: "name", type: Thrift.Type.STRING },
      6: { alias: "timezone", type: Thrift.Type.STRING },
      7: { alias: "privilege", type: Thrift.Type.I32 },
      21: { alias: "serviceLevel", type: Thrift.Type.I32 },
      9: { alias: "created", type: Thrift.Type.I64 },
      10: { alias: "updated", type: Thrift.Type.I64 },
      11: { alias: "deleted", type: Thrift.Type.I64 },
      13: { alias: "active", type: Thrift.Type.BOOL },
      14: { alias: "shardId", type: Thrift.Type.STRING },
      15: { alias: "attributes", type: Thrift.Type.STRUCT, def: module2.exports.UserAttributes },
      16: { alias: "accounting", type: Thrift.Type.STRUCT, def: module2.exports.Accounting },
      18: { alias: "businessUserInfo", type: Thrift.Type.STRUCT, def: module2.exports.BusinessUserInfo },
      19: { alias: "photoUrl", type: Thrift.Type.STRING },
      20: { alias: "photoLastUpdated", type: Thrift.Type.I64 },
      22: { alias: "accountLimits", type: Thrift.Type.STRUCT, def: module2.exports.AccountLimits }
    });
    module2.exports.Contact = Thrift.Struct.define("Contact", {
      1: { alias: "name", type: Thrift.Type.STRING },
      2: { alias: "id", type: Thrift.Type.STRING },
      3: { alias: "type", type: Thrift.Type.I32 },
      4: { alias: "photoUrl", type: Thrift.Type.STRING },
      5: { alias: "photoLastUpdated", type: Thrift.Type.I64 },
      6: { alias: "messagingPermit", type: Thrift.Type.BINARY },
      7: { alias: "messagingPermitExpires", type: Thrift.Type.I64 }
    });
    module2.exports.Identity = Thrift.Struct.define("Identity", {
      1: { alias: "id", type: Thrift.Type.I64 },
      2: { alias: "contact", type: Thrift.Type.STRUCT, def: module2.exports.Contact },
      3: { alias: "userId", type: Thrift.Type.I32 },
      4: { alias: "deactivated", type: Thrift.Type.BOOL },
      5: { alias: "sameBusiness", type: Thrift.Type.BOOL },
      6: { alias: "blocked", type: Thrift.Type.BOOL },
      7: { alias: "userConnected", type: Thrift.Type.BOOL },
      8: { alias: "eventId", type: Thrift.Type.I64 }
    });
    module2.exports.Tag = Thrift.Struct.define("Tag", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "name", type: Thrift.Type.STRING },
      3: { alias: "parentGuid", type: Thrift.Type.STRING },
      4: { alias: "updateSequenceNum", type: Thrift.Type.I32 }
    });
    module2.exports.LazyMap = Thrift.Struct.define("LazyMap", {
      1: { alias: "keysOnly", type: Thrift.Type.SET, def: Thrift.Set.define(Thrift.Type.STRING) },
      2: { alias: "fullMap", type: Thrift.Type.MAP, def: Thrift.Map.define(Thrift.Type.STRING, Thrift.Type.STRING) }
    });
    module2.exports.ResourceAttributes = Thrift.Struct.define("ResourceAttributes", {
      1: { alias: "sourceURL", type: Thrift.Type.STRING },
      2: { alias: "timestamp", type: Thrift.Type.I64 },
      3: { alias: "latitude", type: Thrift.Type.DOUBLE },
      4: { alias: "longitude", type: Thrift.Type.DOUBLE },
      5: { alias: "altitude", type: Thrift.Type.DOUBLE },
      6: { alias: "cameraMake", type: Thrift.Type.STRING },
      7: { alias: "cameraModel", type: Thrift.Type.STRING },
      8: { alias: "clientWillIndex", type: Thrift.Type.BOOL },
      9: { alias: "recoType", type: Thrift.Type.STRING },
      10: { alias: "fileName", type: Thrift.Type.STRING },
      11: { alias: "attachment", type: Thrift.Type.BOOL },
      12: { alias: "applicationData", type: Thrift.Type.STRUCT, def: module2.exports.LazyMap }
    });
    module2.exports.Resource = Thrift.Struct.define("Resource", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "noteGuid", type: Thrift.Type.STRING },
      3: { alias: "data", type: Thrift.Type.STRUCT, def: module2.exports.Data },
      4: { alias: "mime", type: Thrift.Type.STRING },
      5: { alias: "width", type: Thrift.Type.I16 },
      6: { alias: "height", type: Thrift.Type.I16 },
      7: { alias: "duration", type: Thrift.Type.I16 },
      8: { alias: "active", type: Thrift.Type.BOOL },
      9: { alias: "recognition", type: Thrift.Type.STRUCT, def: module2.exports.Data },
      11: { alias: "attributes", type: Thrift.Type.STRUCT, def: module2.exports.ResourceAttributes },
      12: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      13: { alias: "alternateData", type: Thrift.Type.STRUCT, def: module2.exports.Data }
    });
    module2.exports.NoteAttributes = Thrift.Struct.define("NoteAttributes", {
      1: { alias: "subjectDate", type: Thrift.Type.I64 },
      10: { alias: "latitude", type: Thrift.Type.DOUBLE },
      11: { alias: "longitude", type: Thrift.Type.DOUBLE },
      12: { alias: "altitude", type: Thrift.Type.DOUBLE },
      13: { alias: "author", type: Thrift.Type.STRING },
      14: { alias: "source", type: Thrift.Type.STRING },
      15: { alias: "sourceURL", type: Thrift.Type.STRING },
      16: { alias: "sourceApplication", type: Thrift.Type.STRING },
      17: { alias: "shareDate", type: Thrift.Type.I64 },
      18: { alias: "reminderOrder", type: Thrift.Type.I64 },
      19: { alias: "reminderDoneTime", type: Thrift.Type.I64 },
      20: { alias: "reminderTime", type: Thrift.Type.I64 },
      21: { alias: "placeName", type: Thrift.Type.STRING },
      22: { alias: "contentClass", type: Thrift.Type.STRING },
      23: { alias: "applicationData", type: Thrift.Type.STRUCT, def: module2.exports.LazyMap },
      24: { alias: "lastEditedBy", type: Thrift.Type.STRING },
      26: { alias: "classifications", type: Thrift.Type.MAP, def: Thrift.Map.define(Thrift.Type.STRING, Thrift.Type.STRING) },
      27: { alias: "creatorId", type: Thrift.Type.I32 },
      28: { alias: "lastEditorId", type: Thrift.Type.I32 },
      29: { alias: "sharedWithBusiness", type: Thrift.Type.BOOL },
      30: { alias: "conflictSourceNoteGuid", type: Thrift.Type.STRING },
      31: { alias: "noteTitleQuality", type: Thrift.Type.I32 }
    });
    module2.exports.SharedNote = Thrift.Struct.define("SharedNote", {
      1: { alias: "sharerUserID", type: Thrift.Type.I32 },
      2: { alias: "recipientIdentity", type: Thrift.Type.STRUCT, def: module2.exports.Identity },
      3: { alias: "privilege", type: Thrift.Type.I32 },
      4: { alias: "serviceCreated", type: Thrift.Type.I64 },
      5: { alias: "serviceUpdated", type: Thrift.Type.I64 },
      6: { alias: "serviceAssigned", type: Thrift.Type.I64 }
    });
    module2.exports.NoteRestrictions = Thrift.Struct.define("NoteRestrictions", {
      1: { alias: "noUpdateTitle", type: Thrift.Type.BOOL },
      2: { alias: "noUpdateContent", type: Thrift.Type.BOOL },
      3: { alias: "noEmail", type: Thrift.Type.BOOL },
      4: { alias: "noShare", type: Thrift.Type.BOOL },
      5: { alias: "noSharePublicly", type: Thrift.Type.BOOL }
    });
    module2.exports.NoteLimits = Thrift.Struct.define("NoteLimits", {
      1: { alias: "noteResourceCountMax", type: Thrift.Type.I32 },
      2: { alias: "uploadLimit", type: Thrift.Type.I64 },
      3: { alias: "resourceSizeMax", type: Thrift.Type.I64 },
      4: { alias: "noteSizeMax", type: Thrift.Type.I64 },
      5: { alias: "uploaded", type: Thrift.Type.I64 }
    });
    module2.exports.Note = Thrift.Struct.define("Note", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "title", type: Thrift.Type.STRING },
      3: { alias: "content", type: Thrift.Type.STRING },
      4: { alias: "contentHash", type: Thrift.Type.BINARY },
      5: { alias: "contentLength", type: Thrift.Type.I32 },
      6: { alias: "created", type: Thrift.Type.I64 },
      7: { alias: "updated", type: Thrift.Type.I64 },
      8: { alias: "deleted", type: Thrift.Type.I64 },
      9: { alias: "active", type: Thrift.Type.BOOL },
      10: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      11: { alias: "notebookGuid", type: Thrift.Type.STRING },
      12: { alias: "tagGuids", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      13: { alias: "resources", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.Resource) },
      14: { alias: "attributes", type: Thrift.Type.STRUCT, def: module2.exports.NoteAttributes },
      15: { alias: "tagNames", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      16: { alias: "sharedNotes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.SharedNote) },
      17: { alias: "restrictions", type: Thrift.Type.STRUCT, def: module2.exports.NoteRestrictions },
      18: { alias: "limits", type: Thrift.Type.STRUCT, def: module2.exports.NoteLimits }
    });
    module2.exports.Publishing = Thrift.Struct.define("Publishing", {
      1: { alias: "uri", type: Thrift.Type.STRING },
      2: { alias: "order", type: Thrift.Type.I32 },
      3: { alias: "ascending", type: Thrift.Type.BOOL },
      4: { alias: "publicDescription", type: Thrift.Type.STRING }
    });
    module2.exports.BusinessNotebook = Thrift.Struct.define("BusinessNotebook", {
      1: { alias: "notebookDescription", type: Thrift.Type.STRING },
      2: { alias: "privilege", type: Thrift.Type.I32 },
      3: { alias: "recommended", type: Thrift.Type.BOOL }
    });
    module2.exports.SavedSearchScope = Thrift.Struct.define("SavedSearchScope", {
      1: { alias: "includeAccount", type: Thrift.Type.BOOL },
      2: { alias: "includePersonalLinkedNotebooks", type: Thrift.Type.BOOL },
      3: { alias: "includeBusinessLinkedNotebooks", type: Thrift.Type.BOOL }
    });
    module2.exports.SavedSearch = Thrift.Struct.define("SavedSearch", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "name", type: Thrift.Type.STRING },
      3: { alias: "query", type: Thrift.Type.STRING },
      4: { alias: "format", type: Thrift.Type.I32 },
      5: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      6: { alias: "scope", type: Thrift.Type.STRUCT, def: module2.exports.SavedSearchScope }
    });
    module2.exports.Ad = Thrift.Struct.define("Ad", {
      1: { alias: "id", type: Thrift.Type.I32 },
      2: { alias: "width", type: Thrift.Type.I16 },
      3: { alias: "height", type: Thrift.Type.I16 },
      4: { alias: "advertiserName", type: Thrift.Type.STRING },
      5: { alias: "imageUrl", type: Thrift.Type.STRING },
      6: { alias: "destinationUrl", type: Thrift.Type.STRING },
      7: { alias: "displaySeconds", type: Thrift.Type.I16 },
      8: { alias: "score", type: Thrift.Type.DOUBLE },
      9: { alias: "image", type: Thrift.Type.BINARY },
      10: { alias: "imageMime", type: Thrift.Type.STRING },
      11: { alias: "html", type: Thrift.Type.STRING },
      12: { alias: "displayFrequency", type: Thrift.Type.DOUBLE },
      13: { alias: "openInTrunk", type: Thrift.Type.BOOL }
    });
    module2.exports.SharedNotebookRecipientSettings = Thrift.Struct.define("SharedNotebookRecipientSettings", {
      1: { alias: "reminderNotifyEmail", type: Thrift.Type.BOOL },
      2: { alias: "reminderNotifyInApp", type: Thrift.Type.BOOL }
    });
    module2.exports.NotebookRecipientSettings = Thrift.Struct.define("NotebookRecipientSettings", {
      1: { alias: "reminderNotifyEmail", type: Thrift.Type.BOOL },
      2: { alias: "reminderNotifyInApp", type: Thrift.Type.BOOL },
      3: { alias: "inMyList", type: Thrift.Type.BOOL },
      4: { alias: "stack", type: Thrift.Type.STRING }
    });
    module2.exports.SharedNotebook = Thrift.Struct.define("SharedNotebook", {
      1: { alias: "id", type: Thrift.Type.I64 },
      2: { alias: "userId", type: Thrift.Type.I32 },
      3: { alias: "notebookGuid", type: Thrift.Type.STRING },
      4: { alias: "email", type: Thrift.Type.STRING },
      18: { alias: "recipientIdentityId", type: Thrift.Type.I64 },
      5: { alias: "notebookModifiable", type: Thrift.Type.BOOL },
      7: { alias: "serviceCreated", type: Thrift.Type.I64 },
      10: { alias: "serviceUpdated", type: Thrift.Type.I64 },
      8: { alias: "globalId", type: Thrift.Type.STRING },
      9: { alias: "username", type: Thrift.Type.STRING },
      11: { alias: "privilege", type: Thrift.Type.I32 },
      13: { alias: "recipientSettings", type: Thrift.Type.STRUCT, def: module2.exports.SharedNotebookRecipientSettings },
      14: { alias: "sharerUserId", type: Thrift.Type.I32 },
      15: { alias: "recipientUsername", type: Thrift.Type.STRING },
      17: { alias: "recipientUserId", type: Thrift.Type.I32 },
      16: { alias: "serviceAssigned", type: Thrift.Type.I64 }
    });
    module2.exports.NotebookRestrictions = Thrift.Struct.define("NotebookRestrictions", {
      1: { alias: "noReadNotes", type: Thrift.Type.BOOL },
      2: { alias: "noCreateNotes", type: Thrift.Type.BOOL },
      3: { alias: "noUpdateNotes", type: Thrift.Type.BOOL },
      4: { alias: "noExpungeNotes", type: Thrift.Type.BOOL },
      5: { alias: "noShareNotes", type: Thrift.Type.BOOL },
      6: { alias: "noEmailNotes", type: Thrift.Type.BOOL },
      7: { alias: "noSendMessageToRecipients", type: Thrift.Type.BOOL },
      8: { alias: "noUpdateNotebook", type: Thrift.Type.BOOL },
      9: { alias: "noExpungeNotebook", type: Thrift.Type.BOOL },
      10: { alias: "noSetDefaultNotebook", type: Thrift.Type.BOOL },
      11: { alias: "noSetNotebookStack", type: Thrift.Type.BOOL },
      12: { alias: "noPublishToPublic", type: Thrift.Type.BOOL },
      13: { alias: "noPublishToBusinessLibrary", type: Thrift.Type.BOOL },
      14: { alias: "noCreateTags", type: Thrift.Type.BOOL },
      15: { alias: "noUpdateTags", type: Thrift.Type.BOOL },
      16: { alias: "noExpungeTags", type: Thrift.Type.BOOL },
      17: { alias: "noSetParentTag", type: Thrift.Type.BOOL },
      18: { alias: "noCreateSharedNotebooks", type: Thrift.Type.BOOL },
      19: { alias: "updateWhichSharedNotebookRestrictions", type: Thrift.Type.I32 },
      20: { alias: "expungeWhichSharedNotebookRestrictions", type: Thrift.Type.I32 },
      21: { alias: "noShareNotesWithBusiness", type: Thrift.Type.BOOL },
      22: { alias: "noRenameNotebook", type: Thrift.Type.BOOL }
    });
    module2.exports.Notebook = Thrift.Struct.define("Notebook", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "name", type: Thrift.Type.STRING },
      5: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      6: { alias: "defaultNotebook", type: Thrift.Type.BOOL },
      7: { alias: "serviceCreated", type: Thrift.Type.I64 },
      8: { alias: "serviceUpdated", type: Thrift.Type.I64 },
      10: { alias: "publishing", type: Thrift.Type.STRUCT, def: module2.exports.Publishing },
      11: { alias: "published", type: Thrift.Type.BOOL },
      12: { alias: "stack", type: Thrift.Type.STRING },
      13: { alias: "sharedNotebookIds", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.I64) },
      14: { alias: "sharedNotebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.SharedNotebook) },
      15: { alias: "businessNotebook", type: Thrift.Type.STRUCT, def: module2.exports.BusinessNotebook },
      16: { alias: "contact", type: Thrift.Type.STRUCT, def: module2.exports.User },
      17: { alias: "restrictions", type: Thrift.Type.STRUCT, def: module2.exports.NotebookRestrictions },
      18: { alias: "recipientSettings", type: Thrift.Type.STRUCT, def: module2.exports.NotebookRecipientSettings }
    });
    module2.exports.LinkedNotebook = Thrift.Struct.define("LinkedNotebook", {
      2: { alias: "shareName", type: Thrift.Type.STRING },
      3: { alias: "username", type: Thrift.Type.STRING },
      4: { alias: "shardId", type: Thrift.Type.STRING },
      5: { alias: "sharedNotebookGlobalId", type: Thrift.Type.STRING },
      6: { alias: "uri", type: Thrift.Type.STRING },
      7: { alias: "guid", type: Thrift.Type.STRING },
      8: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      9: { alias: "noteStoreUrl", type: Thrift.Type.STRING },
      10: { alias: "webApiUrlPrefix", type: Thrift.Type.STRING },
      11: { alias: "stack", type: Thrift.Type.STRING },
      12: { alias: "businessId", type: Thrift.Type.I32 }
    });
    module2.exports.NotebookDescriptor = Thrift.Struct.define("NotebookDescriptor", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "notebookDisplayName", type: Thrift.Type.STRING },
      3: { alias: "contactName", type: Thrift.Type.STRING },
      4: { alias: "hasSharedNotebook", type: Thrift.Type.BOOL },
      5: { alias: "joinedUserCount", type: Thrift.Type.I32 }
    });
    module2.exports.UserProfile = Thrift.Struct.define("UserProfile", {
      1: { alias: "id", type: Thrift.Type.I32 },
      2: { alias: "name", type: Thrift.Type.STRING },
      3: { alias: "email", type: Thrift.Type.STRING },
      4: { alias: "username", type: Thrift.Type.STRING },
      5: { alias: "attributes", type: Thrift.Type.STRUCT, def: module2.exports.BusinessUserAttributes },
      6: { alias: "joined", type: Thrift.Type.I64 },
      7: { alias: "photoLastUpdated", type: Thrift.Type.I64 },
      8: { alias: "photoUrl", type: Thrift.Type.STRING },
      9: { alias: "role", type: Thrift.Type.I32 }
    });
    module2.exports.RelatedContentImage = Thrift.Struct.define("RelatedContentImage", {
      1: { alias: "url", type: Thrift.Type.STRING },
      2: { alias: "width", type: Thrift.Type.I32 },
      3: { alias: "height", type: Thrift.Type.I32 },
      4: { alias: "pixelRatio", type: Thrift.Type.DOUBLE },
      5: { alias: "fileSize", type: Thrift.Type.I32 }
    });
    module2.exports.RelatedContent = Thrift.Struct.define("RelatedContent", {
      1: { alias: "contentId", type: Thrift.Type.STRING },
      2: { alias: "title", type: Thrift.Type.STRING },
      3: { alias: "url", type: Thrift.Type.STRING },
      4: { alias: "sourceId", type: Thrift.Type.STRING },
      5: { alias: "sourceUrl", type: Thrift.Type.STRING },
      6: { alias: "sourceFaviconUrl", type: Thrift.Type.STRING },
      7: { alias: "sourceName", type: Thrift.Type.STRING },
      8: { alias: "date", type: Thrift.Type.I64 },
      9: { alias: "teaser", type: Thrift.Type.STRING },
      10: { alias: "thumbnails", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.RelatedContentImage) },
      11: { alias: "contentType", type: Thrift.Type.I32 },
      12: { alias: "accessType", type: Thrift.Type.I32 },
      13: { alias: "visibleUrl", type: Thrift.Type.STRING },
      14: { alias: "clipUrl", type: Thrift.Type.STRING },
      15: { alias: "contact", type: Thrift.Type.STRUCT, def: module2.exports.Contact },
      16: { alias: "authors", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) }
    });
    module2.exports.BusinessInvitation = Thrift.Struct.define("BusinessInvitation", {
      1: { alias: "businessId", type: Thrift.Type.I32 },
      2: { alias: "email", type: Thrift.Type.STRING },
      3: { alias: "role", type: Thrift.Type.I32 },
      4: { alias: "status", type: Thrift.Type.I32 },
      5: { alias: "requesterId", type: Thrift.Type.I32 },
      6: { alias: "fromWorkChat", type: Thrift.Type.BOOL },
      7: { alias: "created", type: Thrift.Type.I64 }
    });
    module2.exports.UserIdentity = Thrift.Struct.define("UserIdentity", {
      1: { alias: "type", type: Thrift.Type.I32 },
      2: { alias: "stringIdentifier", type: Thrift.Type.STRING },
      3: { alias: "longIdentifier", type: Thrift.Type.I64 }
    });
  }
});

// node_modules/evernote/lib/thrift/gen-js2/Errors.js
var require_Errors = __commonJS({
  "node_modules/evernote/lib/thrift/gen-js2/Errors.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    var Types = require_Types();
    module2.exports.EDAMErrorCode = {
      "UNKNOWN": 1,
      "BAD_DATA_FORMAT": 2,
      "PERMISSION_DENIED": 3,
      "INTERNAL_ERROR": 4,
      "DATA_REQUIRED": 5,
      "LIMIT_REACHED": 6,
      "QUOTA_REACHED": 7,
      "INVALID_AUTH": 8,
      "AUTH_EXPIRED": 9,
      "DATA_CONFLICT": 10,
      "ENML_VALIDATION": 11,
      "SHARD_UNAVAILABLE": 12,
      "LEN_TOO_SHORT": 13,
      "LEN_TOO_LONG": 14,
      "TOO_FEW": 15,
      "TOO_MANY": 16,
      "UNSUPPORTED_OPERATION": 17,
      "TAKEN_DOWN": 18,
      "RATE_LIMIT_REACHED": 19,
      "BUSINESS_SECURITY_LOGIN_REQUIRED": 20,
      "DEVICE_LIMIT_REACHED": 21
    };
    module2.exports.EDAMInvalidContactReason = {
      "BAD_ADDRESS": 0,
      "DUPLICATE_CONTACT": 1,
      "NO_CONNECTION": 2
    };
    module2.exports.EDAMUserException = Thrift.Exception.define("EDAMUserException", {
      1: { alias: "errorCode", type: Thrift.Type.I32 },
      2: { alias: "parameter", type: Thrift.Type.STRING }
    });
    module2.exports.EDAMSystemException = Thrift.Exception.define("EDAMSystemException", {
      1: { alias: "errorCode", type: Thrift.Type.I32 },
      2: { alias: "message", type: Thrift.Type.STRING },
      3: { alias: "rateLimitDuration", type: Thrift.Type.I32 }
    });
    module2.exports.EDAMNotFoundException = Thrift.Exception.define("EDAMNotFoundException", {
      1: { alias: "identifier", type: Thrift.Type.STRING },
      2: { alias: "key", type: Thrift.Type.STRING }
    });
    module2.exports.EDAMInvalidContactsException = Thrift.Exception.define("EDAMInvalidContactsException", {
      1: { alias: "contacts", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Contact) },
      2: { alias: "parameter", type: Thrift.Type.STRING },
      3: { alias: "reasons", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.I32) }
    });
  }
});

// node_modules/evernote/lib/thrift/gen-js2/UserStore.js
var require_UserStore = __commonJS({
  "node_modules/evernote/lib/thrift/gen-js2/UserStore.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    var Types = require_Types();
    var Errors = require_Errors();
    module2.exports.EDAM_VERSION_MAJOR = 1;
    module2.exports.EDAM_VERSION_MINOR = 28;
    module2.exports.PublicUserInfo = Thrift.Struct.define("PublicUserInfo", {
      1: { alias: "userId", type: Thrift.Type.I32 },
      7: { alias: "serviceLevel", type: Thrift.Type.I32 },
      4: { alias: "username", type: Thrift.Type.STRING },
      5: { alias: "noteStoreUrl", type: Thrift.Type.STRING },
      6: { alias: "webApiUrlPrefix", type: Thrift.Type.STRING }
    });
    module2.exports.UserUrls = Thrift.Struct.define("UserUrls", {
      1: { alias: "noteStoreUrl", type: Thrift.Type.STRING },
      2: { alias: "webApiUrlPrefix", type: Thrift.Type.STRING },
      3: { alias: "userStoreUrl", type: Thrift.Type.STRING },
      4: { alias: "utilityUrl", type: Thrift.Type.STRING },
      5: { alias: "messageStoreUrl", type: Thrift.Type.STRING },
      6: { alias: "userWebSocketUrl", type: Thrift.Type.STRING }
    });
    module2.exports.AuthenticationResult = Thrift.Struct.define("AuthenticationResult", {
      1: { alias: "currentTime", type: Thrift.Type.I64 },
      2: { alias: "authenticationToken", type: Thrift.Type.STRING },
      3: { alias: "expiration", type: Thrift.Type.I64 },
      4: { alias: "user", type: Thrift.Type.STRUCT, def: Types.User },
      5: { alias: "publicUserInfo", type: Thrift.Type.STRUCT, def: module2.exports.PublicUserInfo },
      6: { alias: "noteStoreUrl", type: Thrift.Type.STRING },
      7: { alias: "webApiUrlPrefix", type: Thrift.Type.STRING },
      8: { alias: "secondFactorRequired", type: Thrift.Type.BOOL },
      9: { alias: "secondFactorDeliveryHint", type: Thrift.Type.STRING },
      10: { alias: "urls", type: Thrift.Type.STRUCT, def: module2.exports.UserUrls }
    });
    module2.exports.BootstrapSettings = Thrift.Struct.define("BootstrapSettings", {
      1: { alias: "serviceHost", type: Thrift.Type.STRING },
      2: { alias: "marketingUrl", type: Thrift.Type.STRING },
      3: { alias: "supportUrl", type: Thrift.Type.STRING },
      4: { alias: "accountEmailDomain", type: Thrift.Type.STRING },
      5: { alias: "enableFacebookSharing", type: Thrift.Type.BOOL },
      6: { alias: "enableGiftSubscriptions", type: Thrift.Type.BOOL },
      7: { alias: "enableSupportTickets", type: Thrift.Type.BOOL },
      8: { alias: "enableSharedNotebooks", type: Thrift.Type.BOOL },
      9: { alias: "enableSingleNoteSharing", type: Thrift.Type.BOOL },
      10: { alias: "enableSponsoredAccounts", type: Thrift.Type.BOOL },
      11: { alias: "enableTwitterSharing", type: Thrift.Type.BOOL },
      12: { alias: "enableLinkedInSharing", type: Thrift.Type.BOOL },
      13: { alias: "enablePublicNotebooks", type: Thrift.Type.BOOL },
      16: { alias: "enableGoogle", type: Thrift.Type.BOOL }
    });
    module2.exports.BootstrapProfile = Thrift.Struct.define("BootstrapProfile", {
      1: { alias: "name", type: Thrift.Type.STRING },
      2: { alias: "settings", type: Thrift.Type.STRUCT, def: module2.exports.BootstrapSettings }
    });
    module2.exports.BootstrapInfo = Thrift.Struct.define("BootstrapInfo", {
      1: { alias: "profiles", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.BootstrapProfile) }
    });
    var UserStore = module2.exports.UserStore = {};
    UserStore.checkVersion = Thrift.Method.define({
      alias: "checkVersion",
      args: Thrift.Struct.define("checkVersionArgs", {
        1: { alias: "clientName", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "edamVersionMajor", type: Thrift.Type.I16, index: 1 },
        3: { alias: "edamVersionMinor", type: Thrift.Type.I16, index: 2 }
      }),
      result: Thrift.Struct.define("checkVersionResult", {
        0: { alias: "returnValue", type: Thrift.Type.BOOL }
      })
    });
    UserStore.getBootstrapInfo = Thrift.Method.define({
      alias: "getBootstrapInfo",
      args: Thrift.Struct.define("getBootstrapInfoArgs", {
        1: { alias: "locale", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getBootstrapInfoResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.BootstrapInfo }
      })
    });
    UserStore.authenticateLongSession = Thrift.Method.define({
      alias: "authenticateLongSession",
      args: Thrift.Struct.define("authenticateLongSessionArgs", {
        1: { alias: "username", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "password", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "consumerKey", type: Thrift.Type.STRING, index: 2 },
        4: { alias: "consumerSecret", type: Thrift.Type.STRING, index: 3 },
        5: { alias: "deviceIdentifier", type: Thrift.Type.STRING, index: 4 },
        6: { alias: "deviceDescription", type: Thrift.Type.STRING, index: 5 },
        7: { alias: "supportsTwoFactor", type: Thrift.Type.BOOL, index: 6 }
      }),
      result: Thrift.Struct.define("authenticateLongSessionResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.AuthenticationResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.completeTwoFactorAuthentication = Thrift.Method.define({
      alias: "completeTwoFactorAuthentication",
      args: Thrift.Struct.define("completeTwoFactorAuthenticationArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "oneTimeCode", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "deviceIdentifier", type: Thrift.Type.STRING, index: 2 },
        4: { alias: "deviceDescription", type: Thrift.Type.STRING, index: 3 }
      }),
      result: Thrift.Struct.define("completeTwoFactorAuthenticationResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.AuthenticationResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.revokeLongSession = Thrift.Method.define({
      alias: "revokeLongSession",
      args: Thrift.Struct.define("revokeLongSessionArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("revokeLongSessionResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.authenticateToBusiness = Thrift.Method.define({
      alias: "authenticateToBusiness",
      args: Thrift.Struct.define("authenticateToBusinessArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("authenticateToBusinessResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.AuthenticationResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.getUser = Thrift.Method.define({
      alias: "getUser",
      args: Thrift.Struct.define("getUserArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getUserResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.User },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.getPublicUserInfo = Thrift.Method.define({
      alias: "getPublicUserInfo",
      args: Thrift.Struct.define("getPublicUserInfoArgs", {
        1: { alias: "username", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getPublicUserInfoResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.PublicUserInfo },
        1: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException }
      })
    });
    UserStore.getPremiumInfo = Thrift.Method.define({
      alias: "getPremiumInfo",
      args: Thrift.Struct.define("getPremiumInfoArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getPremiumInfoResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.PremiumInfo },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.getUserUrls = Thrift.Method.define({
      alias: "getUserUrls",
      args: Thrift.Struct.define("getUserUrlsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getUserUrlsResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.UserUrls },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.inviteToBusiness = Thrift.Method.define({
      alias: "inviteToBusiness",
      args: Thrift.Struct.define("inviteToBusinessArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "emailAddress", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("inviteToBusinessResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.removeFromBusiness = Thrift.Method.define({
      alias: "removeFromBusiness",
      args: Thrift.Struct.define("removeFromBusinessArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "emailAddress", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("removeFromBusinessResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    UserStore.updateBusinessUserIdentifier = Thrift.Method.define({
      alias: "updateBusinessUserIdentifier",
      args: Thrift.Struct.define("updateBusinessUserIdentifierArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "oldEmailAddress", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "newEmailAddress", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("updateBusinessUserIdentifierResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    UserStore.listBusinessUsers = Thrift.Method.define({
      alias: "listBusinessUsers",
      args: Thrift.Struct.define("listBusinessUsersArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listBusinessUsersResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.UserProfile) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.listBusinessInvitations = Thrift.Method.define({
      alias: "listBusinessInvitations",
      args: Thrift.Struct.define("listBusinessInvitationsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "includeRequestedInvitations", type: Thrift.Type.BOOL, index: 1 }
      }),
      result: Thrift.Struct.define("listBusinessInvitationsResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.BusinessInvitation) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    UserStore.getAccountLimits = Thrift.Method.define({
      alias: "getAccountLimits",
      args: Thrift.Struct.define("getAccountLimitsArgs", {
        1: { alias: "serviceLevel", type: Thrift.Type.I32, index: 0 }
      }),
      result: Thrift.Struct.define("getAccountLimitsResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.AccountLimits },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException }
      })
    });
    function UserStoreClient(output) {
      this.output = output;
      this.seqid = 0;
    }
    UserStoreClient.prototype.checkVersion = function(clientName, edamVersionMajor, edamVersionMinor, callback) {
      var mdef = UserStore.checkVersion;
      var args2 = new mdef.args();
      args2.clientName = clientName;
      args2.edamVersionMajor = edamVersionMajor;
      args2.edamVersionMinor = edamVersionMinor;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getBootstrapInfo = function(locale, callback) {
      var mdef = UserStore.getBootstrapInfo;
      var args2 = new mdef.args();
      args2.locale = locale;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.authenticateLongSession = function(username, password, consumerKey, consumerSecret, deviceIdentifier, deviceDescription, supportsTwoFactor, callback) {
      var mdef = UserStore.authenticateLongSession;
      var args2 = new mdef.args();
      args2.username = username;
      args2.password = password;
      args2.consumerKey = consumerKey;
      args2.consumerSecret = consumerSecret;
      args2.deviceIdentifier = deviceIdentifier;
      args2.deviceDescription = deviceDescription;
      args2.supportsTwoFactor = supportsTwoFactor;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.completeTwoFactorAuthentication = function(authenticationToken, oneTimeCode, deviceIdentifier, deviceDescription, callback) {
      var mdef = UserStore.completeTwoFactorAuthentication;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.oneTimeCode = oneTimeCode;
      args2.deviceIdentifier = deviceIdentifier;
      args2.deviceDescription = deviceDescription;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.revokeLongSession = function(authenticationToken, callback) {
      var mdef = UserStore.revokeLongSession;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.authenticateToBusiness = function(authenticationToken, callback) {
      var mdef = UserStore.authenticateToBusiness;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getUser = function(authenticationToken, callback) {
      var mdef = UserStore.getUser;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getPublicUserInfo = function(username, callback) {
      var mdef = UserStore.getPublicUserInfo;
      var args2 = new mdef.args();
      args2.username = username;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getPremiumInfo = function(authenticationToken, callback) {
      var mdef = UserStore.getPremiumInfo;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getUserUrls = function(authenticationToken, callback) {
      var mdef = UserStore.getUserUrls;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.inviteToBusiness = function(authenticationToken, emailAddress, callback) {
      var mdef = UserStore.inviteToBusiness;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.emailAddress = emailAddress;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.removeFromBusiness = function(authenticationToken, emailAddress, callback) {
      var mdef = UserStore.removeFromBusiness;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.emailAddress = emailAddress;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.updateBusinessUserIdentifier = function(authenticationToken, oldEmailAddress, newEmailAddress, callback) {
      var mdef = UserStore.updateBusinessUserIdentifier;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.oldEmailAddress = oldEmailAddress;
      args2.newEmailAddress = newEmailAddress;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.listBusinessUsers = function(authenticationToken, callback) {
      var mdef = UserStore.listBusinessUsers;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.listBusinessInvitations = function(authenticationToken, includeRequestedInvitations, callback) {
      var mdef = UserStore.listBusinessInvitations;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.includeRequestedInvitations = includeRequestedInvitations;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    UserStoreClient.prototype.getAccountLimits = function(serviceLevel, callback) {
      var mdef = UserStore.getAccountLimits;
      var args2 = new mdef.args();
      args2.serviceLevel = serviceLevel;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    module2.exports.UserStore.Client = UserStoreClient;
    function UserStoreServer(service, stransport, Protocol2) {
      var methodName;
      this.service = service;
      this.stransport = stransport;
      this.processor = new Thrift.Processor();
      for (methodName in UserStore) {
        if (service[methodName]) {
          this.processor.addMethod(UserStore[methodName], service[methodName].bind(service));
        }
      }
      this.stransport.process = function(input, output, noop) {
        var inprot = new Protocol2(input);
        var outprot = new Protocol2(output);
        this.processor.process(inprot, outprot, noop);
      }.bind(this);
    }
    UserStoreServer.prototype.start = function() {
      this.stransport.listen();
    };
    UserStoreServer.prototype.stop = function() {
      this.stransport.close();
    };
    module2.exports.UserStore.Server = UserStoreServer;
  }
});

// node_modules/evernote/lib/thrift/gen-js2/NoteStore.js
var require_NoteStore = __commonJS({
  "node_modules/evernote/lib/thrift/gen-js2/NoteStore.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    var UserStore = require_UserStore();
    var Types = require_Types();
    var Errors = require_Errors();
    var Limits = require_Limits();
    module2.exports.UserSetting = {
      "RECEIVE_REMINDER_EMAIL": 1,
      "TIMEZONE": 2
    };
    module2.exports.ShareRelationshipPrivilegeLevel = {
      "READ_NOTEBOOK": 0,
      "READ_NOTEBOOK_PLUS_ACTIVITY": 10,
      "MODIFY_NOTEBOOK_PLUS_ACTIVITY": 20,
      "FULL_ACCESS": 30
    };
    module2.exports.SyncState = Thrift.Struct.define("SyncState", {
      1: { alias: "currentTime", type: Thrift.Type.I64 },
      2: { alias: "fullSyncBefore", type: Thrift.Type.I64 },
      3: { alias: "updateCount", type: Thrift.Type.I32 },
      4: { alias: "uploaded", type: Thrift.Type.I64 },
      5: { alias: "userLastUpdated", type: Thrift.Type.I64 },
      6: { alias: "userMaxMessageEventId", type: Thrift.Type.I64 }
    });
    module2.exports.SyncChunk = Thrift.Struct.define("SyncChunk", {
      1: { alias: "currentTime", type: Thrift.Type.I64 },
      2: { alias: "chunkHighUSN", type: Thrift.Type.I32 },
      3: { alias: "updateCount", type: Thrift.Type.I32 },
      4: { alias: "notes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Note) },
      5: { alias: "notebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Notebook) },
      6: { alias: "tags", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Tag) },
      7: { alias: "searches", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.SavedSearch) },
      8: { alias: "resources", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Resource) },
      9: { alias: "expungedNotes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      10: { alias: "expungedNotebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      11: { alias: "expungedTags", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      12: { alias: "expungedSearches", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      13: { alias: "linkedNotebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.LinkedNotebook) },
      14: { alias: "expungedLinkedNotebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) }
    });
    module2.exports.SyncChunkFilter = Thrift.Struct.define("SyncChunkFilter", {
      1: { alias: "includeNotes", type: Thrift.Type.BOOL },
      2: { alias: "includeNoteResources", type: Thrift.Type.BOOL },
      3: { alias: "includeNoteAttributes", type: Thrift.Type.BOOL },
      4: { alias: "includeNotebooks", type: Thrift.Type.BOOL },
      5: { alias: "includeTags", type: Thrift.Type.BOOL },
      6: { alias: "includeSearches", type: Thrift.Type.BOOL },
      7: { alias: "includeResources", type: Thrift.Type.BOOL },
      8: { alias: "includeLinkedNotebooks", type: Thrift.Type.BOOL },
      9: { alias: "includeExpunged", type: Thrift.Type.BOOL },
      10: { alias: "includeNoteApplicationDataFullMap", type: Thrift.Type.BOOL },
      12: { alias: "includeResourceApplicationDataFullMap", type: Thrift.Type.BOOL },
      13: { alias: "includeNoteResourceApplicationDataFullMap", type: Thrift.Type.BOOL },
      17: { alias: "includeSharedNotes", type: Thrift.Type.BOOL },
      16: { alias: "omitSharedNotebooks", type: Thrift.Type.BOOL },
      11: { alias: "requireNoteContentClass", type: Thrift.Type.STRING },
      15: { alias: "notebookGuids", type: Thrift.Type.SET, def: Thrift.Set.define(Thrift.Type.STRING) }
    });
    module2.exports.NoteFilter = Thrift.Struct.define("NoteFilter", {
      1: { alias: "order", type: Thrift.Type.I32 },
      2: { alias: "ascending", type: Thrift.Type.BOOL },
      3: { alias: "words", type: Thrift.Type.STRING },
      4: { alias: "notebookGuid", type: Thrift.Type.STRING },
      5: { alias: "tagGuids", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      6: { alias: "timeZone", type: Thrift.Type.STRING },
      7: { alias: "inactive", type: Thrift.Type.BOOL },
      8: { alias: "emphasized", type: Thrift.Type.STRING },
      9: { alias: "includeAllReadableNotebooks", type: Thrift.Type.BOOL }
    });
    module2.exports.NoteList = Thrift.Struct.define("NoteList", {
      1: { alias: "startIndex", type: Thrift.Type.I32 },
      2: { alias: "totalNotes", type: Thrift.Type.I32 },
      3: { alias: "notes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Note) },
      4: { alias: "stoppedWords", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      5: { alias: "searchedWords", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      6: { alias: "updateCount", type: Thrift.Type.I32 }
    });
    module2.exports.NoteMetadata = Thrift.Struct.define("NoteMetadata", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "title", type: Thrift.Type.STRING },
      5: { alias: "contentLength", type: Thrift.Type.I32 },
      6: { alias: "created", type: Thrift.Type.I64 },
      7: { alias: "updated", type: Thrift.Type.I64 },
      8: { alias: "deleted", type: Thrift.Type.I64 },
      10: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      11: { alias: "notebookGuid", type: Thrift.Type.STRING },
      12: { alias: "tagGuids", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      14: { alias: "attributes", type: Thrift.Type.STRUCT, def: Types.NoteAttributes },
      20: { alias: "largestResourceMime", type: Thrift.Type.STRING },
      21: { alias: "largestResourceSize", type: Thrift.Type.I32 }
    });
    module2.exports.NotesMetadataList = Thrift.Struct.define("NotesMetadataList", {
      1: { alias: "startIndex", type: Thrift.Type.I32 },
      2: { alias: "totalNotes", type: Thrift.Type.I32 },
      3: { alias: "notes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteMetadata) },
      4: { alias: "stoppedWords", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      5: { alias: "searchedWords", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      6: { alias: "updateCount", type: Thrift.Type.I32 }
    });
    module2.exports.NotesMetadataResultSpec = Thrift.Struct.define("NotesMetadataResultSpec", {
      2: { alias: "includeTitle", type: Thrift.Type.BOOL },
      5: { alias: "includeContentLength", type: Thrift.Type.BOOL },
      6: { alias: "includeCreated", type: Thrift.Type.BOOL },
      7: { alias: "includeUpdated", type: Thrift.Type.BOOL },
      8: { alias: "includeDeleted", type: Thrift.Type.BOOL },
      10: { alias: "includeUpdateSequenceNum", type: Thrift.Type.BOOL },
      11: { alias: "includeNotebookGuid", type: Thrift.Type.BOOL },
      12: { alias: "includeTagGuids", type: Thrift.Type.BOOL },
      14: { alias: "includeAttributes", type: Thrift.Type.BOOL },
      20: { alias: "includeLargestResourceMime", type: Thrift.Type.BOOL },
      21: { alias: "includeLargestResourceSize", type: Thrift.Type.BOOL }
    });
    module2.exports.NoteCollectionCounts = Thrift.Struct.define("NoteCollectionCounts", {
      1: { alias: "notebookCounts", type: Thrift.Type.MAP, def: Thrift.Map.define(Thrift.Type.STRING, Thrift.Type.I32) },
      2: { alias: "tagCounts", type: Thrift.Type.MAP, def: Thrift.Map.define(Thrift.Type.STRING, Thrift.Type.I32) },
      3: { alias: "trashCount", type: Thrift.Type.I32 }
    });
    module2.exports.NoteResultSpec = Thrift.Struct.define("NoteResultSpec", {
      1: { alias: "includeContent", type: Thrift.Type.BOOL },
      2: { alias: "includeResourcesData", type: Thrift.Type.BOOL },
      3: { alias: "includeResourcesRecognition", type: Thrift.Type.BOOL },
      4: { alias: "includeResourcesAlternateData", type: Thrift.Type.BOOL },
      5: { alias: "includeSharedNotes", type: Thrift.Type.BOOL },
      6: { alias: "includeNoteAppDataValues", type: Thrift.Type.BOOL },
      7: { alias: "includeResourceAppDataValues", type: Thrift.Type.BOOL },
      8: { alias: "includeAccountLimits", type: Thrift.Type.BOOL }
    });
    module2.exports.NoteEmailParameters = Thrift.Struct.define("NoteEmailParameters", {
      1: { alias: "guid", type: Thrift.Type.STRING },
      2: { alias: "note", type: Thrift.Type.STRUCT, def: Types.Note },
      3: { alias: "toAddresses", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      4: { alias: "ccAddresses", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
      5: { alias: "subject", type: Thrift.Type.STRING },
      6: { alias: "message", type: Thrift.Type.STRING }
    });
    module2.exports.NoteVersionId = Thrift.Struct.define("NoteVersionId", {
      1: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      2: { alias: "updated", type: Thrift.Type.I64 },
      3: { alias: "saved", type: Thrift.Type.I64 },
      4: { alias: "title", type: Thrift.Type.STRING },
      5: { alias: "lastEditorId", type: Thrift.Type.I32 }
    });
    module2.exports.RelatedQuery = Thrift.Struct.define("RelatedQuery", {
      1: { alias: "noteGuid", type: Thrift.Type.STRING },
      2: { alias: "plainText", type: Thrift.Type.STRING },
      3: { alias: "filter", type: Thrift.Type.STRUCT, def: module2.exports.NoteFilter },
      4: { alias: "referenceUri", type: Thrift.Type.STRING },
      5: { alias: "context", type: Thrift.Type.STRING },
      6: { alias: "cacheKey", type: Thrift.Type.STRING }
    });
    module2.exports.RelatedResult = Thrift.Struct.define("RelatedResult", {
      1: { alias: "notes", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Note) },
      2: { alias: "notebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Notebook) },
      3: { alias: "tags", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Tag) },
      4: { alias: "containingNotebooks", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.NotebookDescriptor) },
      5: { alias: "debugInfo", type: Thrift.Type.STRING },
      6: { alias: "experts", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.UserProfile) },
      7: { alias: "relatedContent", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.RelatedContent) },
      8: { alias: "cacheKey", type: Thrift.Type.STRING },
      9: { alias: "cacheExpires", type: Thrift.Type.I32 }
    });
    module2.exports.RelatedResultSpec = Thrift.Struct.define("RelatedResultSpec", {
      1: { alias: "maxNotes", type: Thrift.Type.I32 },
      2: { alias: "maxNotebooks", type: Thrift.Type.I32 },
      3: { alias: "maxTags", type: Thrift.Type.I32 },
      4: { alias: "writableNotebooksOnly", type: Thrift.Type.BOOL },
      5: { alias: "includeContainingNotebooks", type: Thrift.Type.BOOL },
      6: { alias: "includeDebugInfo", type: Thrift.Type.BOOL },
      7: { alias: "maxExperts", type: Thrift.Type.I32 },
      8: { alias: "maxRelatedContent", type: Thrift.Type.I32 },
      9: { alias: "relatedContentTypes", type: Thrift.Type.SET, def: Thrift.Set.define(Thrift.Type.I32) }
    });
    module2.exports.UpdateNoteIfUsnMatchesResult = Thrift.Struct.define("UpdateNoteIfUsnMatchesResult", {
      1: { alias: "note", type: Thrift.Type.STRUCT, def: Types.Note },
      2: { alias: "updated", type: Thrift.Type.BOOL }
    });
    module2.exports.ShareRelationshipRestrictions = Thrift.Struct.define("ShareRelationshipRestrictions", {
      1: { alias: "noSetReadOnly", type: Thrift.Type.BOOL },
      2: { alias: "noSetReadPlusActivity", type: Thrift.Type.BOOL },
      3: { alias: "noSetModify", type: Thrift.Type.BOOL },
      4: { alias: "noSetFullAccess", type: Thrift.Type.BOOL }
    });
    module2.exports.InvitationShareRelationship = Thrift.Struct.define("InvitationShareRelationship", {
      1: { alias: "displayName", type: Thrift.Type.STRING },
      2: { alias: "recipientUserIdentity", type: Thrift.Type.STRUCT, def: Types.UserIdentity },
      3: { alias: "privilege", type: Thrift.Type.I32 },
      5: { alias: "sharerUserId", type: Thrift.Type.I32 }
    });
    module2.exports.MemberShareRelationship = Thrift.Struct.define("MemberShareRelationship", {
      1: { alias: "displayName", type: Thrift.Type.STRING },
      2: { alias: "recipientUserId", type: Thrift.Type.I32 },
      3: { alias: "bestPrivilege", type: Thrift.Type.I32 },
      4: { alias: "individualPrivilege", type: Thrift.Type.I32 },
      5: { alias: "restrictions", type: Thrift.Type.STRUCT, def: module2.exports.ShareRelationshipRestrictions },
      6: { alias: "sharerUserId", type: Thrift.Type.I32 }
    });
    module2.exports.ShareRelationships = Thrift.Struct.define("ShareRelationships", {
      1: { alias: "invitations", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.InvitationShareRelationship) },
      2: { alias: "memberships", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.MemberShareRelationship) },
      3: { alias: "invitationRestrictions", type: Thrift.Type.STRUCT, def: module2.exports.ShareRelationshipRestrictions }
    });
    module2.exports.ManageNotebookSharesParameters = Thrift.Struct.define("ManageNotebookSharesParameters", {
      1: { alias: "notebookGuid", type: Thrift.Type.STRING },
      2: { alias: "inviteMessage", type: Thrift.Type.STRING },
      3: { alias: "membershipsToUpdate", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.MemberShareRelationship) },
      4: { alias: "invitationsToCreateOrUpdate", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.InvitationShareRelationship) },
      5: { alias: "unshares", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.UserIdentity) }
    });
    module2.exports.ManageNotebookSharesError = Thrift.Struct.define("ManageNotebookSharesError", {
      1: { alias: "userIdentity", type: Thrift.Type.STRUCT, def: Types.UserIdentity },
      2: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
      3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
    });
    module2.exports.ManageNotebookSharesResult = Thrift.Struct.define("ManageNotebookSharesResult", {
      1: { alias: "errors", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.ManageNotebookSharesError) }
    });
    module2.exports.SharedNoteTemplate = Thrift.Struct.define("SharedNoteTemplate", {
      1: { alias: "noteGuid", type: Thrift.Type.STRING },
      4: { alias: "recipientThreadId", type: Thrift.Type.I64 },
      2: { alias: "recipientContacts", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Contact) },
      3: { alias: "privilege", type: Thrift.Type.I32 }
    });
    module2.exports.NotebookShareTemplate = Thrift.Struct.define("NotebookShareTemplate", {
      1: { alias: "notebookGuid", type: Thrift.Type.STRING },
      4: { alias: "recipientThreadId", type: Thrift.Type.I64 },
      2: { alias: "recipientContacts", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Contact) },
      3: { alias: "privilege", type: Thrift.Type.I32 }
    });
    module2.exports.CreateOrUpdateNotebookSharesResult = Thrift.Struct.define("CreateOrUpdateNotebookSharesResult", {
      1: { alias: "updateSequenceNum", type: Thrift.Type.I32 },
      2: { alias: "matchingShares", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.SharedNotebook) }
    });
    module2.exports.NoteShareRelationshipRestrictions = Thrift.Struct.define("NoteShareRelationshipRestrictions", {
      1: { alias: "noSetReadNote", type: Thrift.Type.BOOL },
      2: { alias: "noSetModifyNote", type: Thrift.Type.BOOL },
      3: { alias: "noSetFullAccess", type: Thrift.Type.BOOL }
    });
    module2.exports.NoteMemberShareRelationship = Thrift.Struct.define("NoteMemberShareRelationship", {
      1: { alias: "displayName", type: Thrift.Type.STRING },
      2: { alias: "recipientUserId", type: Thrift.Type.I32 },
      3: { alias: "privilege", type: Thrift.Type.I32 },
      4: { alias: "restrictions", type: Thrift.Type.STRUCT, def: module2.exports.NoteShareRelationshipRestrictions },
      5: { alias: "sharerUserId", type: Thrift.Type.I32 }
    });
    module2.exports.NoteInvitationShareRelationship = Thrift.Struct.define("NoteInvitationShareRelationship", {
      1: { alias: "displayName", type: Thrift.Type.STRING },
      2: { alias: "recipientIdentityId", type: Thrift.Type.I64 },
      3: { alias: "privilege", type: Thrift.Type.I32 },
      5: { alias: "sharerUserId", type: Thrift.Type.I32 }
    });
    module2.exports.NoteShareRelationships = Thrift.Struct.define("NoteShareRelationships", {
      1: { alias: "invitations", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteInvitationShareRelationship) },
      2: { alias: "memberships", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteMemberShareRelationship) },
      3: { alias: "invitationRestrictions", type: Thrift.Type.STRUCT, def: module2.exports.NoteShareRelationshipRestrictions }
    });
    module2.exports.ManageNoteSharesParameters = Thrift.Struct.define("ManageNoteSharesParameters", {
      1: { alias: "noteGuid", type: Thrift.Type.STRING },
      2: { alias: "membershipsToUpdate", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteMemberShareRelationship) },
      3: { alias: "invitationsToUpdate", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteInvitationShareRelationship) },
      4: { alias: "membershipsToUnshare", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.I32) },
      5: { alias: "invitationsToUnshare", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.I64) }
    });
    module2.exports.ManageNoteSharesError = Thrift.Struct.define("ManageNoteSharesError", {
      1: { alias: "identityID", type: Thrift.Type.I64 },
      2: { alias: "userID", type: Thrift.Type.I32 },
      3: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
      4: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
    });
    module2.exports.ManageNoteSharesResult = Thrift.Struct.define("ManageNoteSharesResult", {
      1: { alias: "errors", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.ManageNoteSharesError) }
    });
    var NoteStore = module2.exports.NoteStore = {};
    NoteStore.getSyncState = Thrift.Method.define({
      alias: "getSyncState",
      args: Thrift.Struct.define("getSyncStateArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getSyncStateResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.SyncState },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getFilteredSyncChunk = Thrift.Method.define({
      alias: "getFilteredSyncChunk",
      args: Thrift.Struct.define("getFilteredSyncChunkArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "afterUSN", type: Thrift.Type.I32, index: 1 },
        3: { alias: "maxEntries", type: Thrift.Type.I32, index: 2 },
        4: { alias: "filter", type: Thrift.Type.STRUCT, def: module2.exports.SyncChunkFilter, index: 3 }
      }),
      result: Thrift.Struct.define("getFilteredSyncChunkResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.SyncChunk },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getLinkedNotebookSyncState = Thrift.Method.define({
      alias: "getLinkedNotebookSyncState",
      args: Thrift.Struct.define("getLinkedNotebookSyncStateArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "linkedNotebook", type: Thrift.Type.STRUCT, def: Types.LinkedNotebook, index: 1 }
      }),
      result: Thrift.Struct.define("getLinkedNotebookSyncStateResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.SyncState },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getLinkedNotebookSyncChunk = Thrift.Method.define({
      alias: "getLinkedNotebookSyncChunk",
      args: Thrift.Struct.define("getLinkedNotebookSyncChunkArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "linkedNotebook", type: Thrift.Type.STRUCT, def: Types.LinkedNotebook, index: 1 },
        3: { alias: "afterUSN", type: Thrift.Type.I32, index: 2 },
        4: { alias: "maxEntries", type: Thrift.Type.I32, index: 3 },
        5: { alias: "fullSyncOnly", type: Thrift.Type.BOOL, index: 4 }
      }),
      result: Thrift.Struct.define("getLinkedNotebookSyncChunkResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.SyncChunk },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.listNotebooks = Thrift.Method.define({
      alias: "listNotebooks",
      args: Thrift.Struct.define("listNotebooksArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listNotebooksResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Notebook) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.listAccessibleBusinessNotebooks = Thrift.Method.define({
      alias: "listAccessibleBusinessNotebooks",
      args: Thrift.Struct.define("listAccessibleBusinessNotebooksArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listAccessibleBusinessNotebooksResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Notebook) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getNotebook = Thrift.Method.define({
      alias: "getNotebook",
      args: Thrift.Struct.define("getNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Notebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getDefaultNotebook = Thrift.Method.define({
      alias: "getDefaultNotebook",
      args: Thrift.Struct.define("getDefaultNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getDefaultNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Notebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.createNotebook = Thrift.Method.define({
      alias: "createNotebook",
      args: Thrift.Struct.define("createNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "notebook", type: Thrift.Type.STRUCT, def: Types.Notebook, index: 1 }
      }),
      result: Thrift.Struct.define("createNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Notebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.updateNotebook = Thrift.Method.define({
      alias: "updateNotebook",
      args: Thrift.Struct.define("updateNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "notebook", type: Thrift.Type.STRUCT, def: Types.Notebook, index: 1 }
      }),
      result: Thrift.Struct.define("updateNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.expungeNotebook = Thrift.Method.define({
      alias: "expungeNotebook",
      args: Thrift.Struct.define("expungeNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("expungeNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.listTags = Thrift.Method.define({
      alias: "listTags",
      args: Thrift.Struct.define("listTagsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listTagsResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Tag) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.listTagsByNotebook = Thrift.Method.define({
      alias: "listTagsByNotebook",
      args: Thrift.Struct.define("listTagsByNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "notebookGuid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("listTagsByNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.Tag) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getTag = Thrift.Method.define({
      alias: "getTag",
      args: Thrift.Struct.define("getTagArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getTagResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Tag },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.createTag = Thrift.Method.define({
      alias: "createTag",
      args: Thrift.Struct.define("createTagArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "tag", type: Thrift.Type.STRUCT, def: Types.Tag, index: 1 }
      }),
      result: Thrift.Struct.define("createTagResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Tag },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.updateTag = Thrift.Method.define({
      alias: "updateTag",
      args: Thrift.Struct.define("updateTagArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "tag", type: Thrift.Type.STRUCT, def: Types.Tag, index: 1 }
      }),
      result: Thrift.Struct.define("updateTagResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.untagAll = Thrift.Method.define({
      alias: "untagAll",
      args: Thrift.Struct.define("untagAllArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("untagAllResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.expungeTag = Thrift.Method.define({
      alias: "expungeTag",
      args: Thrift.Struct.define("expungeTagArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("expungeTagResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.listSearches = Thrift.Method.define({
      alias: "listSearches",
      args: Thrift.Struct.define("listSearchesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listSearchesResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.SavedSearch) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getSearch = Thrift.Method.define({
      alias: "getSearch",
      args: Thrift.Struct.define("getSearchArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getSearchResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.SavedSearch },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.createSearch = Thrift.Method.define({
      alias: "createSearch",
      args: Thrift.Struct.define("createSearchArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "search", type: Thrift.Type.STRUCT, def: Types.SavedSearch, index: 1 }
      }),
      result: Thrift.Struct.define("createSearchResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.SavedSearch },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.updateSearch = Thrift.Method.define({
      alias: "updateSearch",
      args: Thrift.Struct.define("updateSearchArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "search", type: Thrift.Type.STRUCT, def: Types.SavedSearch, index: 1 }
      }),
      result: Thrift.Struct.define("updateSearchResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.expungeSearch = Thrift.Method.define({
      alias: "expungeSearch",
      args: Thrift.Struct.define("expungeSearchArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("expungeSearchResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.findNoteOffset = Thrift.Method.define({
      alias: "findNoteOffset",
      args: Thrift.Struct.define("findNoteOffsetArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "filter", type: Thrift.Type.STRUCT, def: module2.exports.NoteFilter, index: 1 },
        3: { alias: "guid", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("findNoteOffsetResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.findNotesMetadata = Thrift.Method.define({
      alias: "findNotesMetadata",
      args: Thrift.Struct.define("findNotesMetadataArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "filter", type: Thrift.Type.STRUCT, def: module2.exports.NoteFilter, index: 1 },
        3: { alias: "offset", type: Thrift.Type.I32, index: 2 },
        4: { alias: "maxNotes", type: Thrift.Type.I32, index: 3 },
        5: { alias: "resultSpec", type: Thrift.Type.STRUCT, def: module2.exports.NotesMetadataResultSpec, index: 4 }
      }),
      result: Thrift.Struct.define("findNotesMetadataResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.NotesMetadataList },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.findNoteCounts = Thrift.Method.define({
      alias: "findNoteCounts",
      args: Thrift.Struct.define("findNoteCountsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "filter", type: Thrift.Type.STRUCT, def: module2.exports.NoteFilter, index: 1 },
        3: { alias: "withTrash", type: Thrift.Type.BOOL, index: 2 }
      }),
      result: Thrift.Struct.define("findNoteCountsResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.NoteCollectionCounts },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteWithResultSpec = Thrift.Method.define({
      alias: "getNoteWithResultSpec",
      args: Thrift.Struct.define("getNoteWithResultSpecArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "resultSpec", type: Thrift.Type.STRUCT, def: module2.exports.NoteResultSpec, index: 2 }
      }),
      result: Thrift.Struct.define("getNoteWithResultSpecResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNote = Thrift.Method.define({
      alias: "getNote",
      args: Thrift.Struct.define("getNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "withContent", type: Thrift.Type.BOOL, index: 2 },
        4: { alias: "withResourcesData", type: Thrift.Type.BOOL, index: 3 },
        5: { alias: "withResourcesRecognition", type: Thrift.Type.BOOL, index: 4 },
        6: { alias: "withResourcesAlternateData", type: Thrift.Type.BOOL, index: 5 }
      }),
      result: Thrift.Struct.define("getNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteApplicationData = Thrift.Method.define({
      alias: "getNoteApplicationData",
      args: Thrift.Struct.define("getNoteApplicationDataArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getNoteApplicationDataResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.LazyMap },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteApplicationDataEntry = Thrift.Method.define({
      alias: "getNoteApplicationDataEntry",
      args: Thrift.Struct.define("getNoteApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("getNoteApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.setNoteApplicationDataEntry = Thrift.Method.define({
      alias: "setNoteApplicationDataEntry",
      args: Thrift.Struct.define("setNoteApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 },
        4: { alias: "value", type: Thrift.Type.STRING, index: 3 }
      }),
      result: Thrift.Struct.define("setNoteApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.unsetNoteApplicationDataEntry = Thrift.Method.define({
      alias: "unsetNoteApplicationDataEntry",
      args: Thrift.Struct.define("unsetNoteApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("unsetNoteApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteContent = Thrift.Method.define({
      alias: "getNoteContent",
      args: Thrift.Struct.define("getNoteContentArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getNoteContentResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteSearchText = Thrift.Method.define({
      alias: "getNoteSearchText",
      args: Thrift.Struct.define("getNoteSearchTextArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "noteOnly", type: Thrift.Type.BOOL, index: 2 },
        4: { alias: "tokenizeForIndexing", type: Thrift.Type.BOOL, index: 3 }
      }),
      result: Thrift.Struct.define("getNoteSearchTextResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceSearchText = Thrift.Method.define({
      alias: "getResourceSearchText",
      args: Thrift.Struct.define("getResourceSearchTextArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceSearchTextResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteTagNames = Thrift.Method.define({
      alias: "getNoteTagNames",
      args: Thrift.Struct.define("getNoteTagNamesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getNoteTagNamesResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRING) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.createNote = Thrift.Method.define({
      alias: "createNote",
      args: Thrift.Struct.define("createNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "note", type: Thrift.Type.STRUCT, def: Types.Note, index: 1 }
      }),
      result: Thrift.Struct.define("createNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.updateNote = Thrift.Method.define({
      alias: "updateNote",
      args: Thrift.Struct.define("updateNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "note", type: Thrift.Type.STRUCT, def: Types.Note, index: 1 }
      }),
      result: Thrift.Struct.define("updateNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.deleteNote = Thrift.Method.define({
      alias: "deleteNote",
      args: Thrift.Struct.define("deleteNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("deleteNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.expungeNote = Thrift.Method.define({
      alias: "expungeNote",
      args: Thrift.Struct.define("expungeNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("expungeNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.copyNote = Thrift.Method.define({
      alias: "copyNote",
      args: Thrift.Struct.define("copyNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "noteGuid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "toNotebookGuid", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("copyNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.listNoteVersions = Thrift.Method.define({
      alias: "listNoteVersions",
      args: Thrift.Struct.define("listNoteVersionsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "noteGuid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("listNoteVersionsResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, module2.exports.NoteVersionId) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getNoteVersion = Thrift.Method.define({
      alias: "getNoteVersion",
      args: Thrift.Struct.define("getNoteVersionArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "noteGuid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "updateSequenceNum", type: Thrift.Type.I32, index: 2 },
        4: { alias: "withResourcesData", type: Thrift.Type.BOOL, index: 3 },
        5: { alias: "withResourcesRecognition", type: Thrift.Type.BOOL, index: 4 },
        6: { alias: "withResourcesAlternateData", type: Thrift.Type.BOOL, index: 5 }
      }),
      result: Thrift.Struct.define("getNoteVersionResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Note },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResource = Thrift.Method.define({
      alias: "getResource",
      args: Thrift.Struct.define("getResourceArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "withData", type: Thrift.Type.BOOL, index: 2 },
        4: { alias: "withRecognition", type: Thrift.Type.BOOL, index: 3 },
        5: { alias: "withAttributes", type: Thrift.Type.BOOL, index: 4 },
        6: { alias: "withAlternateData", type: Thrift.Type.BOOL, index: 5 }
      }),
      result: Thrift.Struct.define("getResourceResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Resource },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceApplicationData = Thrift.Method.define({
      alias: "getResourceApplicationData",
      args: Thrift.Struct.define("getResourceApplicationDataArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceApplicationDataResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.LazyMap },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceApplicationDataEntry = Thrift.Method.define({
      alias: "getResourceApplicationDataEntry",
      args: Thrift.Struct.define("getResourceApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("getResourceApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.setResourceApplicationDataEntry = Thrift.Method.define({
      alias: "setResourceApplicationDataEntry",
      args: Thrift.Struct.define("setResourceApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 },
        4: { alias: "value", type: Thrift.Type.STRING, index: 3 }
      }),
      result: Thrift.Struct.define("setResourceApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.unsetResourceApplicationDataEntry = Thrift.Method.define({
      alias: "unsetResourceApplicationDataEntry",
      args: Thrift.Struct.define("unsetResourceApplicationDataEntryArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "key", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("unsetResourceApplicationDataEntryResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.updateResource = Thrift.Method.define({
      alias: "updateResource",
      args: Thrift.Struct.define("updateResourceArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "resource", type: Thrift.Type.STRUCT, def: Types.Resource, index: 1 }
      }),
      result: Thrift.Struct.define("updateResourceResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceData = Thrift.Method.define({
      alias: "getResourceData",
      args: Thrift.Struct.define("getResourceDataArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceDataResult", {
        0: { alias: "returnValue", type: Thrift.Type.BINARY },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceByHash = Thrift.Method.define({
      alias: "getResourceByHash",
      args: Thrift.Struct.define("getResourceByHashArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "noteGuid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "contentHash", type: Thrift.Type.BINARY, index: 2 },
        4: { alias: "withData", type: Thrift.Type.BOOL, index: 3 },
        5: { alias: "withRecognition", type: Thrift.Type.BOOL, index: 4 },
        6: { alias: "withAlternateData", type: Thrift.Type.BOOL, index: 5 }
      }),
      result: Thrift.Struct.define("getResourceByHashResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Resource },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceRecognition = Thrift.Method.define({
      alias: "getResourceRecognition",
      args: Thrift.Struct.define("getResourceRecognitionArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceRecognitionResult", {
        0: { alias: "returnValue", type: Thrift.Type.BINARY },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceAlternateData = Thrift.Method.define({
      alias: "getResourceAlternateData",
      args: Thrift.Struct.define("getResourceAlternateDataArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceAlternateDataResult", {
        0: { alias: "returnValue", type: Thrift.Type.BINARY },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getResourceAttributes = Thrift.Method.define({
      alias: "getResourceAttributes",
      args: Thrift.Struct.define("getResourceAttributesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getResourceAttributesResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.ResourceAttributes },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.getPublicNotebook = Thrift.Method.define({
      alias: "getPublicNotebook",
      args: Thrift.Struct.define("getPublicNotebookArgs", {
        1: { alias: "userId", type: Thrift.Type.I32, index: 0 },
        2: { alias: "publicUri", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getPublicNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Notebook },
        1: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.shareNotebook = Thrift.Method.define({
      alias: "shareNotebook",
      args: Thrift.Struct.define("shareNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "sharedNotebook", type: Thrift.Type.STRUCT, def: Types.SharedNotebook, index: 1 },
        3: { alias: "message", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("shareNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.SharedNotebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.createOrUpdateNotebookShares = Thrift.Method.define({
      alias: "createOrUpdateNotebookShares",
      args: Thrift.Struct.define("createOrUpdateNotebookSharesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "shareTemplate", type: Thrift.Type.STRUCT, def: module2.exports.NotebookShareTemplate, index: 1 }
      }),
      result: Thrift.Struct.define("createOrUpdateNotebookSharesResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.CreateOrUpdateNotebookSharesResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        4: { alias: "invalidContactsException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMInvalidContactsException }
      })
    });
    NoteStore.updateSharedNotebook = Thrift.Method.define({
      alias: "updateSharedNotebook",
      args: Thrift.Struct.define("updateSharedNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "sharedNotebook", type: Thrift.Type.STRUCT, def: Types.SharedNotebook, index: 1 }
      }),
      result: Thrift.Struct.define("updateSharedNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.setNotebookRecipientSettings = Thrift.Method.define({
      alias: "setNotebookRecipientSettings",
      args: Thrift.Struct.define("setNotebookRecipientSettingsArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "notebookGuid", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "recipientSettings", type: Thrift.Type.STRUCT, def: Types.NotebookRecipientSettings, index: 2 }
      }),
      result: Thrift.Struct.define("setNotebookRecipientSettingsResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.Notebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.listSharedNotebooks = Thrift.Method.define({
      alias: "listSharedNotebooks",
      args: Thrift.Struct.define("listSharedNotebooksArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listSharedNotebooksResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.SharedNotebook) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.createLinkedNotebook = Thrift.Method.define({
      alias: "createLinkedNotebook",
      args: Thrift.Struct.define("createLinkedNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "linkedNotebook", type: Thrift.Type.STRUCT, def: Types.LinkedNotebook, index: 1 }
      }),
      result: Thrift.Struct.define("createLinkedNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.LinkedNotebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.updateLinkedNotebook = Thrift.Method.define({
      alias: "updateLinkedNotebook",
      args: Thrift.Struct.define("updateLinkedNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "linkedNotebook", type: Thrift.Type.STRUCT, def: Types.LinkedNotebook, index: 1 }
      }),
      result: Thrift.Struct.define("updateLinkedNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.listLinkedNotebooks = Thrift.Method.define({
      alias: "listLinkedNotebooks",
      args: Thrift.Struct.define("listLinkedNotebooksArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("listLinkedNotebooksResult", {
        0: { alias: "returnValue", type: Thrift.Type.LIST, def: Thrift.List.define(Thrift.Type.STRUCT, Types.LinkedNotebook) },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.expungeLinkedNotebook = Thrift.Method.define({
      alias: "expungeLinkedNotebook",
      args: Thrift.Struct.define("expungeLinkedNotebookArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("expungeLinkedNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.I32 },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.authenticateToSharedNotebook = Thrift.Method.define({
      alias: "authenticateToSharedNotebook",
      args: Thrift.Struct.define("authenticateToSharedNotebookArgs", {
        1: { alias: "shareKeyOrGlobalId", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("authenticateToSharedNotebookResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: UserStore.AuthenticationResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getSharedNotebookByAuth = Thrift.Method.define({
      alias: "getSharedNotebookByAuth",
      args: Thrift.Struct.define("getSharedNotebookByAuthArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 }
      }),
      result: Thrift.Struct.define("getSharedNotebookByAuthResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: Types.SharedNotebook },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.emailNote = Thrift.Method.define({
      alias: "emailNote",
      args: Thrift.Struct.define("emailNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "parameters", type: Thrift.Type.STRUCT, def: module2.exports.NoteEmailParameters, index: 1 }
      }),
      result: Thrift.Struct.define("emailNoteResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.shareNote = Thrift.Method.define({
      alias: "shareNote",
      args: Thrift.Struct.define("shareNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("shareNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRING },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.stopSharingNote = Thrift.Method.define({
      alias: "stopSharingNote",
      args: Thrift.Struct.define("stopSharingNoteArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "guid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("stopSharingNoteResult", {
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.authenticateToSharedNote = Thrift.Method.define({
      alias: "authenticateToSharedNote",
      args: Thrift.Struct.define("authenticateToSharedNoteArgs", {
        1: { alias: "guid", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "noteKey", type: Thrift.Type.STRING, index: 1 },
        3: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 2 }
      }),
      result: Thrift.Struct.define("authenticateToSharedNoteResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: UserStore.AuthenticationResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.findRelated = Thrift.Method.define({
      alias: "findRelated",
      args: Thrift.Struct.define("findRelatedArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "query", type: Thrift.Type.STRUCT, def: module2.exports.RelatedQuery, index: 1 },
        3: { alias: "resultSpec", type: Thrift.Type.STRUCT, def: module2.exports.RelatedResultSpec, index: 2 }
      }),
      result: Thrift.Struct.define("findRelatedResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.RelatedResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException },
        3: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException }
      })
    });
    NoteStore.updateNoteIfUsnMatches = Thrift.Method.define({
      alias: "updateNoteIfUsnMatches",
      args: Thrift.Struct.define("updateNoteIfUsnMatchesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "note", type: Thrift.Type.STRUCT, def: Types.Note, index: 1 }
      }),
      result: Thrift.Struct.define("updateNoteIfUsnMatchesResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.UpdateNoteIfUsnMatchesResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.manageNotebookShares = Thrift.Method.define({
      alias: "manageNotebookShares",
      args: Thrift.Struct.define("manageNotebookSharesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "parameters", type: Thrift.Type.STRUCT, def: module2.exports.ManageNotebookSharesParameters, index: 1 }
      }),
      result: Thrift.Struct.define("manageNotebookSharesResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.ManageNotebookSharesResult },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    NoteStore.getNotebookShares = Thrift.Method.define({
      alias: "getNotebookShares",
      args: Thrift.Struct.define("getNotebookSharesArgs", {
        1: { alias: "authenticationToken", type: Thrift.Type.STRING, index: 0 },
        2: { alias: "notebookGuid", type: Thrift.Type.STRING, index: 1 }
      }),
      result: Thrift.Struct.define("getNotebookSharesResult", {
        0: { alias: "returnValue", type: Thrift.Type.STRUCT, def: module2.exports.ShareRelationships },
        1: { alias: "userException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMUserException },
        2: { alias: "notFoundException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMNotFoundException },
        3: { alias: "systemException", type: Thrift.Type.EXCEPTION, def: Errors.EDAMSystemException }
      })
    });
    function NoteStoreClient(output) {
      this.output = output;
      this.seqid = 0;
    }
    NoteStoreClient.prototype.getSyncState = function(authenticationToken, callback) {
      var mdef = NoteStore.getSyncState;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getFilteredSyncChunk = function(authenticationToken, afterUSN, maxEntries, filter, callback) {
      var mdef = NoteStore.getFilteredSyncChunk;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.afterUSN = afterUSN;
      args2.maxEntries = maxEntries;
      args2.filter = filter;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getLinkedNotebookSyncState = function(authenticationToken, linkedNotebook, callback) {
      var mdef = NoteStore.getLinkedNotebookSyncState;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.linkedNotebook = linkedNotebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getLinkedNotebookSyncChunk = function(authenticationToken, linkedNotebook, afterUSN, maxEntries, fullSyncOnly, callback) {
      var mdef = NoteStore.getLinkedNotebookSyncChunk;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.linkedNotebook = linkedNotebook;
      args2.afterUSN = afterUSN;
      args2.maxEntries = maxEntries;
      args2.fullSyncOnly = fullSyncOnly;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listNotebooks = function(authenticationToken, callback) {
      var mdef = NoteStore.listNotebooks;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listAccessibleBusinessNotebooks = function(authenticationToken, callback) {
      var mdef = NoteStore.listAccessibleBusinessNotebooks;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNotebook = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getDefaultNotebook = function(authenticationToken, callback) {
      var mdef = NoteStore.getDefaultNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createNotebook = function(authenticationToken, notebook, callback) {
      var mdef = NoteStore.createNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.notebook = notebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateNotebook = function(authenticationToken, notebook, callback) {
      var mdef = NoteStore.updateNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.notebook = notebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.expungeNotebook = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.expungeNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listTags = function(authenticationToken, callback) {
      var mdef = NoteStore.listTags;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listTagsByNotebook = function(authenticationToken, notebookGuid, callback) {
      var mdef = NoteStore.listTagsByNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.notebookGuid = notebookGuid;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getTag = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getTag;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createTag = function(authenticationToken, tag, callback) {
      var mdef = NoteStore.createTag;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.tag = tag;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateTag = function(authenticationToken, tag, callback) {
      var mdef = NoteStore.updateTag;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.tag = tag;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.untagAll = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.untagAll;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.expungeTag = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.expungeTag;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listSearches = function(authenticationToken, callback) {
      var mdef = NoteStore.listSearches;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getSearch = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getSearch;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createSearch = function(authenticationToken, search, callback) {
      var mdef = NoteStore.createSearch;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.search = search;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateSearch = function(authenticationToken, search, callback) {
      var mdef = NoteStore.updateSearch;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.search = search;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.expungeSearch = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.expungeSearch;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.findNoteOffset = function(authenticationToken, filter, guid2, callback) {
      var mdef = NoteStore.findNoteOffset;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.filter = filter;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.findNotesMetadata = function(authenticationToken, filter, offset, maxNotes, resultSpec, callback) {
      var mdef = NoteStore.findNotesMetadata;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.filter = filter;
      args2.offset = offset;
      args2.maxNotes = maxNotes;
      args2.resultSpec = resultSpec;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.findNoteCounts = function(authenticationToken, filter, withTrash, callback) {
      var mdef = NoteStore.findNoteCounts;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.filter = filter;
      args2.withTrash = withTrash;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteWithResultSpec = function(authenticationToken, guid2, resultSpec, callback) {
      var mdef = NoteStore.getNoteWithResultSpec;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.resultSpec = resultSpec;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNote = function(authenticationToken, guid2, withContent, withResourcesData, withResourcesRecognition, withResourcesAlternateData, callback) {
      var mdef = NoteStore.getNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.withContent = withContent;
      args2.withResourcesData = withResourcesData;
      args2.withResourcesRecognition = withResourcesRecognition;
      args2.withResourcesAlternateData = withResourcesAlternateData;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteApplicationData = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getNoteApplicationData;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteApplicationDataEntry = function(authenticationToken, guid2, key, callback) {
      var mdef = NoteStore.getNoteApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.setNoteApplicationDataEntry = function(authenticationToken, guid2, key, value, callback) {
      var mdef = NoteStore.setNoteApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      args2.value = value;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.unsetNoteApplicationDataEntry = function(authenticationToken, guid2, key, callback) {
      var mdef = NoteStore.unsetNoteApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteContent = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getNoteContent;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteSearchText = function(authenticationToken, guid2, noteOnly, tokenizeForIndexing, callback) {
      var mdef = NoteStore.getNoteSearchText;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.noteOnly = noteOnly;
      args2.tokenizeForIndexing = tokenizeForIndexing;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceSearchText = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceSearchText;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteTagNames = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getNoteTagNames;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createNote = function(authenticationToken, note, callback) {
      var mdef = NoteStore.createNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.note = note;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateNote = function(authenticationToken, note, callback) {
      var mdef = NoteStore.updateNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.note = note;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.deleteNote = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.deleteNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.expungeNote = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.expungeNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.copyNote = function(authenticationToken, noteGuid, toNotebookGuid, callback) {
      var mdef = NoteStore.copyNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.noteGuid = noteGuid;
      args2.toNotebookGuid = toNotebookGuid;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listNoteVersions = function(authenticationToken, noteGuid, callback) {
      var mdef = NoteStore.listNoteVersions;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.noteGuid = noteGuid;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNoteVersion = function(authenticationToken, noteGuid, updateSequenceNum, withResourcesData, withResourcesRecognition, withResourcesAlternateData, callback) {
      var mdef = NoteStore.getNoteVersion;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.noteGuid = noteGuid;
      args2.updateSequenceNum = updateSequenceNum;
      args2.withResourcesData = withResourcesData;
      args2.withResourcesRecognition = withResourcesRecognition;
      args2.withResourcesAlternateData = withResourcesAlternateData;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResource = function(authenticationToken, guid2, withData, withRecognition, withAttributes, withAlternateData, callback) {
      var mdef = NoteStore.getResource;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.withData = withData;
      args2.withRecognition = withRecognition;
      args2.withAttributes = withAttributes;
      args2.withAlternateData = withAlternateData;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceApplicationData = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceApplicationData;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceApplicationDataEntry = function(authenticationToken, guid2, key, callback) {
      var mdef = NoteStore.getResourceApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.setResourceApplicationDataEntry = function(authenticationToken, guid2, key, value, callback) {
      var mdef = NoteStore.setResourceApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      args2.value = value;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.unsetResourceApplicationDataEntry = function(authenticationToken, guid2, key, callback) {
      var mdef = NoteStore.unsetResourceApplicationDataEntry;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      args2.key = key;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateResource = function(authenticationToken, resource, callback) {
      var mdef = NoteStore.updateResource;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.resource = resource;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceData = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceData;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceByHash = function(authenticationToken, noteGuid, contentHash, withData, withRecognition, withAlternateData, callback) {
      var mdef = NoteStore.getResourceByHash;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.noteGuid = noteGuid;
      args2.contentHash = contentHash;
      args2.withData = withData;
      args2.withRecognition = withRecognition;
      args2.withAlternateData = withAlternateData;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceRecognition = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceRecognition;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceAlternateData = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceAlternateData;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getResourceAttributes = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.getResourceAttributes;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getPublicNotebook = function(userId, publicUri, callback) {
      var mdef = NoteStore.getPublicNotebook;
      var args2 = new mdef.args();
      args2.userId = userId;
      args2.publicUri = publicUri;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.shareNotebook = function(authenticationToken, sharedNotebook, message, callback) {
      var mdef = NoteStore.shareNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.sharedNotebook = sharedNotebook;
      args2.message = message;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createOrUpdateNotebookShares = function(authenticationToken, shareTemplate, callback) {
      var mdef = NoteStore.createOrUpdateNotebookShares;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.shareTemplate = shareTemplate;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateSharedNotebook = function(authenticationToken, sharedNotebook, callback) {
      var mdef = NoteStore.updateSharedNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.sharedNotebook = sharedNotebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.setNotebookRecipientSettings = function(authenticationToken, notebookGuid, recipientSettings, callback) {
      var mdef = NoteStore.setNotebookRecipientSettings;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.notebookGuid = notebookGuid;
      args2.recipientSettings = recipientSettings;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listSharedNotebooks = function(authenticationToken, callback) {
      var mdef = NoteStore.listSharedNotebooks;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.createLinkedNotebook = function(authenticationToken, linkedNotebook, callback) {
      var mdef = NoteStore.createLinkedNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.linkedNotebook = linkedNotebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateLinkedNotebook = function(authenticationToken, linkedNotebook, callback) {
      var mdef = NoteStore.updateLinkedNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.linkedNotebook = linkedNotebook;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.listLinkedNotebooks = function(authenticationToken, callback) {
      var mdef = NoteStore.listLinkedNotebooks;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.expungeLinkedNotebook = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.expungeLinkedNotebook;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.authenticateToSharedNotebook = function(shareKeyOrGlobalId, authenticationToken, callback) {
      var mdef = NoteStore.authenticateToSharedNotebook;
      var args2 = new mdef.args();
      args2.shareKeyOrGlobalId = shareKeyOrGlobalId;
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getSharedNotebookByAuth = function(authenticationToken, callback) {
      var mdef = NoteStore.getSharedNotebookByAuth;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.emailNote = function(authenticationToken, parameters, callback) {
      var mdef = NoteStore.emailNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.parameters = parameters;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.shareNote = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.shareNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.stopSharingNote = function(authenticationToken, guid2, callback) {
      var mdef = NoteStore.stopSharingNote;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.guid = guid2;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.authenticateToSharedNote = function(guid2, noteKey, authenticationToken, callback) {
      var mdef = NoteStore.authenticateToSharedNote;
      var args2 = new mdef.args();
      args2.guid = guid2;
      args2.noteKey = noteKey;
      args2.authenticationToken = authenticationToken;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.findRelated = function(authenticationToken, query, resultSpec, callback) {
      var mdef = NoteStore.findRelated;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.query = query;
      args2.resultSpec = resultSpec;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.updateNoteIfUsnMatches = function(authenticationToken, note, callback) {
      var mdef = NoteStore.updateNoteIfUsnMatches;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.note = note;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.manageNotebookShares = function(authenticationToken, parameters, callback) {
      var mdef = NoteStore.manageNotebookShares;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.parameters = parameters;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    NoteStoreClient.prototype.getNotebookShares = function(authenticationToken, notebookGuid, callback) {
      var mdef = NoteStore.getNotebookShares;
      var args2 = new mdef.args();
      args2.authenticationToken = authenticationToken;
      args2.notebookGuid = notebookGuid;
      mdef.sendRequest(this.output, this.seqid++, args2, callback);
    };
    module2.exports.NoteStore.Client = NoteStoreClient;
    function NoteStoreServer(service, stransport, Protocol2) {
      var methodName;
      this.service = service;
      this.stransport = stransport;
      this.processor = new Thrift.Processor();
      for (methodName in NoteStore) {
        if (service[methodName]) {
          this.processor.addMethod(NoteStore[methodName], service[methodName].bind(service));
        }
      }
      this.stransport.process = function(input, output, noop) {
        var inprot = new Protocol2(input);
        var outprot = new Protocol2(output);
        this.processor.process(inprot, outprot, noop);
      }.bind(this);
    }
    NoteStoreServer.prototype.start = function() {
      this.stransport.listen();
    };
    NoteStoreServer.prototype.stop = function() {
      this.stransport.close();
    };
    module2.exports.NoteStore.Server = NoteStoreServer;
  }
});

// node_modules/evernote/lib/thrift/transport/memBuffer.js
var require_memBuffer = __commonJS({
  "node_modules/evernote/lib/thrift/transport/memBuffer.js"(exports2, module2) {
    "use strict";
    function MemBuffer(buffer) {
      this.queue = [];
      this.offset = 0;
      this.buffer = buffer;
    }
    MemBuffer.prototype.read = function(len) {
      if (this.offset + len > this.buffer.length) throw Error("MemBuffer overrun");
      var buffer = this.buffer.slice(this.offset, this.offset + len);
      this.offset += len;
      return buffer;
    };
    MemBuffer.prototype.write = function(buffer) {
      if (Buffer.isBuffer(buffer)) {
        this.queue.push(buffer);
      } else {
        throw Error("Unsupported type sent to MemBuffer.write. Accepts Buffer.");
      }
    };
    MemBuffer.prototype.clear = function() {
      this.queue = [];
      this.buffer = null;
      this.offset = 0;
    };
    MemBuffer.prototype.flush = function() {
      if (this.buffer) this.queue.unshift(this.buffer);
      this.buffer = Buffer.concat(this.queue);
      this.queue = [];
    };
    module2.exports = MemBuffer;
  }
});

// node_modules/evernote/lib/thrift/transport/binaryHttpTransport.js
var require_binaryHttpTransport = __commonJS({
  "node_modules/evernote/lib/thrift/transport/binaryHttpTransport.js"(exports2, module2) {
    "use strict";
    var MemBuffer = require_memBuffer();
    var http = require("https");
    var url = require("url");
    function BinaryHttpTransport(serviceUrl, quiet) {
      var parsedUrl = url.parse(serviceUrl);
      this.hostname = parsedUrl.hostname;
      this.port = parsedUrl.port;
      this.path = parsedUrl.path;
      this.url = parsedUrl.href;
      this.quiet = quiet;
      this.input = new MemBuffer();
      this.additionalHeaders = {};
    }
    BinaryHttpTransport.prototype.addHeaders = function(headers) {
      Object.assign(this.additionalHeaders, headers);
    };
    BinaryHttpTransport.prototype.open = function() {
    };
    BinaryHttpTransport.prototype.close = function() {
    };
    BinaryHttpTransport.prototype.read = function(len) {
      throw Error("BinaryHttpTransport object does not support reads");
    };
    BinaryHttpTransport.prototype.write = function(bytes) {
      this.input.write(bytes);
    };
    BinaryHttpTransport.prototype.clear = function() {
      this.input.clear();
    };
    BinaryHttpTransport.prototype.flush = function(callback) {
      var me2 = this;
      var options = {
        protocol: "https:",
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: "POST",
        headers: Object.assign({}, {
          "Content-Type": "application/x-thrift",
          "Accept": "application/x-thrift"
        }, me2.additionalHeaders)
      };
      var req = http.request(options, function(res) {
        var chunkCount = 0;
        var chunks = [];
        if (res.statusCode != 200) {
          me2.log("Error in Thrift HTTP response: " + res.statusCode);
          if (callback) callback(res);
        }
        res.on("data", function(chunk) {
          chunks.push(chunk);
        });
        res.on("end", function() {
          var buffer = Buffer.concat(chunks);
          if (callback) callback(null, new MemBuffer(buffer));
        });
      });
      req.on("error", function(err) {
        me2.log("Error making Thrift HTTP request: " + err);
        if (callback) callback(err);
      });
      this.input.flush();
      req.write(this.input.buffer);
      req.end();
      this.clear();
    };
    BinaryHttpTransport.prototype.log = function(msg) {
      if (this.quiet) return;
      console.log(msg);
    };
    module2.exports = BinaryHttpTransport;
  }
});

// node_modules/evernote/lib/thrift/protocol/binaryProtocol.js
var require_binaryProtocol = __commonJS({
  "node_modules/evernote/lib/thrift/protocol/binaryProtocol.js"(exports2, module2) {
    "use strict";
    var Thrift = require_thrift();
    var Type = Thrift.Type;
    var VERSION_MASK = -65536;
    var VERSION_1 = -2147418112;
    var TYPE_MASK = 255;
    function BinaryProtocol(trans, strictRead, strictWrite) {
      this.transport = this.trans = trans;
      this.strictRead = strictRead !== void 0 ? strictRead : false;
      this.strictWrite = strictWrite !== void 0 ? strictWrite : true;
    }
    BinaryProtocol.prototype.flush = function(callback) {
      var wrapTransport;
      if (callback) {
        wrapTransport = function wrapTransport2(err, transport) {
          var protocol;
          if (transport) protocol = new BinaryProtocol(transport);
          return callback(err, protocol);
        };
      }
      return this.trans.flush(wrapTransport);
    };
    BinaryProtocol.prototype.writeMessageBegin = function(name, type, seqid) {
      if (this.strictWrite) {
        this.writeI32(VERSION_1 | type);
        this.writeString(name);
        this.writeI32(seqid);
      } else {
        this.writeString(name);
        this.writeByte(type);
        this.writeI32(seqid);
      }
    };
    BinaryProtocol.prototype.writeMessageEnd = function() {
    };
    BinaryProtocol.prototype.writeStructBegin = function(name) {
    };
    BinaryProtocol.prototype.writeStructEnd = function() {
    };
    BinaryProtocol.prototype.writeFieldBegin = function(name, type, id) {
      this.writeByte(type);
      this.writeI16(id);
    };
    BinaryProtocol.prototype.writeFieldEnd = function() {
    };
    BinaryProtocol.prototype.writeFieldStop = function() {
      this.writeByte(Type.STOP);
    };
    BinaryProtocol.prototype.writeMapBegin = function(ktype, vtype, size) {
      this.writeByte(ktype);
      this.writeByte(vtype);
      this.writeI32(size);
    };
    BinaryProtocol.prototype.writeMapEnd = function() {
    };
    BinaryProtocol.prototype.writeListBegin = function(etype, size) {
      this.writeByte(etype);
      this.writeI32(size);
    };
    BinaryProtocol.prototype.writeListEnd = function() {
    };
    BinaryProtocol.prototype.writeSetBegin = function(etype, size) {
      this.writeByte(etype);
      this.writeI32(size);
    };
    BinaryProtocol.prototype.writeSetEnd = function() {
    };
    BinaryProtocol.prototype.writeBool = function(bool) {
      if (bool) {
        this.writeByte(1);
      } else {
        this.writeByte(0);
      }
    };
    BinaryProtocol.prototype.writeByte = function(b) {
      this.trans.write(BinaryParser.fromByte(b));
    };
    BinaryProtocol.prototype.writeBinary = function(bytes) {
      if (typeof bytes === "string") {
        bytes = BinaryParser.fromString(bytes);
      }
      if (bytes.length != null) {
        this.writeI32(bytes.length);
      } else {
        throw Error("Cannot read length of binary data");
      }
      this.trans.write(bytes);
    };
    BinaryProtocol.prototype.writeI16 = function(i16) {
      this.trans.write(BinaryParser.fromShort(i16));
    };
    BinaryProtocol.prototype.writeI32 = function(i32) {
      this.trans.write(BinaryParser.fromInt(i32));
    };
    BinaryProtocol.prototype.writeI64 = function(i64) {
      var buffer = BinaryParser.fromLong(i64);
      this.trans.write(buffer);
    };
    BinaryProtocol.prototype.writeDouble = function(dub) {
      this.trans.write(BinaryParser.fromDouble(dub));
    };
    BinaryProtocol.prototype.writeString = function(str) {
      var bytes = BinaryParser.fromString(str);
      this.writeI32(bytes.length);
      this.trans.write(bytes);
    };
    BinaryProtocol.prototype.writeType = function(type, value) {
      switch (type) {
        case Type.BOOL:
          return this.writeBool(value);
        case Type.BYTE:
          return this.writeByte(value);
        case Type.I16:
          return this.writeI16(value);
        case Type.I32:
          return this.writeI32(value);
        case Type.I64:
          return this.writeI64(value);
        case Type.DOUBLE:
          return this.writeDouble(value);
        case Type.STRING:
          return this.writeString(value);
        case Type.BINARY:
          return this.writeBinary(value);
        //            case Type.STRUCT:
        //            case Type.MAP:
        //            case Type.SET:
        //            case Type.LIST:
        default:
          throw Error("Invalid type: " + type);
      }
    };
    BinaryProtocol.prototype.readMessageBegin = function() {
      var size = this.readI32();
      var signature = {
        mtype: null,
        fname: null,
        seqid: null
      };
      if (size < 0) {
        var version2 = size & VERSION_MASK;
        if (version2 != VERSION_1) {
          console.log("BAD: " + version2);
          throw Error("Bad version in readMessageBegin: " + size);
        }
        signature.mtype = size & TYPE_MASK;
        signature.fname = this.readString();
        signature.seqid = this.readI32();
      } else {
        if (this.strictRead) {
          throw Error("No protocol version header");
        }
        signature.fname = this.trans.read(size);
        signature.mtype = this.readByte();
        signature.seqid = this.readI32();
      }
      return signature;
    };
    BinaryProtocol.prototype.readMessageEnd = function() {
    };
    BinaryProtocol.prototype.readStructBegin = function() {
      return { fname: "" };
    };
    BinaryProtocol.prototype.readStructEnd = function() {
    };
    BinaryProtocol.prototype.readFieldBegin = function() {
      var type = this.readByte();
      var field = {
        fname: null,
        ftype: type,
        fid: 0
      };
      if (type != Type.STOP) {
        field.fid = this.readI16();
      }
      return field;
    };
    BinaryProtocol.prototype.readFieldEnd = function() {
    };
    BinaryProtocol.prototype.readMapBegin = function() {
      var result = {
        ktype: null,
        vtype: null,
        size: null
      };
      result.ktype = this.readByte();
      result.vtype = this.readByte();
      result.size = this.readI32();
      return result;
    };
    BinaryProtocol.prototype.readMapEnd = function() {
    };
    BinaryProtocol.prototype.readListBegin = function() {
      var result = {
        etype: null,
        size: null
      };
      result.etype = this.readByte();
      result.size = this.readI32();
      return result;
    };
    BinaryProtocol.prototype.readListEnd = function() {
    };
    BinaryProtocol.prototype.readSetBegin = function() {
      var result = {
        etype: null,
        size: null
      };
      result.etype = this.readByte();
      result.size = this.readI32();
      return result;
    };
    BinaryProtocol.prototype.readSetEnd = function() {
    };
    BinaryProtocol.prototype.readBool = function() {
      var b = this.readByte();
      return b == 1;
    };
    BinaryProtocol.prototype.readByte = function() {
      var buffer = this.trans.read(1);
      var result = buffer.readUInt8(0);
      return result;
    };
    BinaryProtocol.prototype.readI16 = function() {
      var buffer = this.trans.read(2);
      var result = buffer.readInt16BE(0);
      return result;
    };
    BinaryProtocol.prototype.readI32 = function() {
      var buffer = this.trans.read(4);
      var result = buffer.readInt32BE(0);
      return result;
    };
    BinaryProtocol.prototype.readI64 = function() {
      var buffer = this.trans.read(8);
      var result = BinaryParser.toLong(buffer);
      return result;
    };
    BinaryProtocol.prototype.readDouble = function() {
      var buffer = this.trans.read(8);
      var result = buffer.readDoubleBE(0);
      return result;
    };
    BinaryProtocol.prototype.readBinary = function() {
      var len = this.readI32();
      var buffer = this.trans.read(len);
      return buffer;
    };
    BinaryProtocol.prototype.readString = function() {
      var len = this.readI32();
      var buffer = this.trans.read(len);
      var result = buffer.toString();
      return result;
    };
    BinaryProtocol.prototype.readType = function(type) {
      switch (type) {
        case Type.BOOL:
          return this.readBool();
        case Type.BYTE:
          return this.readByte();
        case Type.I16:
          return this.readI16();
        case Type.I32:
          return this.readI32();
        case Type.I64:
          return this.readI64();
        case Type.DOUBLE:
          return this.readDouble();
        case Type.STRING:
          return this.readString();
        case Type.BINARY:
          return this.readBinary();
        //            case Type.STRUCT:
        //            case Type.MAP:
        //            case Type.SET:
        //            case Type.LIST:
        default:
          throw new Error("Invalid type: " + type);
      }
    };
    BinaryProtocol.prototype.getTransport = function() {
      return this.trans;
    };
    BinaryProtocol.prototype.skipStruct = function() {
      this.readStructBegin();
      this.skipFields();
      this.readStructEnd();
    };
    BinaryProtocol.prototype.skipFields = function() {
      var r = this.readFieldBegin();
      if (r.ftype === Type.STOP) return;
      this.skip(r.ftype);
      this.readFieldEnd();
      this.skipFields();
    };
    BinaryProtocol.prototype.skipMap = function() {
      var i = 0;
      var map = this.readMapBegin();
      for (i = 0; i < map.size; i++) {
        this.skip(map.ktype);
        this.skip(map.vtype);
      }
      this.readMapEnd();
    };
    BinaryProtocol.prototype.skipSet = function() {
      var i = 0;
      var set = this.readSetBegin();
      for (i = 0; i < set.size; i++) {
        this.skip(set.etype);
      }
      this.readSetEnd();
    };
    BinaryProtocol.prototype.skipList = function() {
      var i = 0;
      var list = this.readListBegin();
      for (i = 0; i < list.size; i++) {
        this.skip(list.etype);
      }
      this.readListEnd();
    };
    BinaryProtocol.prototype.skip = function(type) {
      switch (type) {
        case Type.STOP:
          return;
        case Type.BOOL:
          return this.readBool();
        case Type.BYTE:
          return this.readByte();
        case Type.I16:
          return this.readI16();
        case Type.I32:
          return this.readI32();
        case Type.I64:
          return this.readI64();
        case Type.DOUBLE:
          return this.readDouble();
        case Type.STRING:
          return this.readString();
        case Type.STRUCT:
          return this.skipStruct();
        case Type.MAP:
          return this.skipMap();
        case Type.SET:
          return this.skipSet();
        case Type.LIST:
          return this.skipList();
        case Type.BINARY:
          return this.readBinary();
        default:
          throw Error("Invalid type: " + type);
      }
    };
    var BinaryParser = {};
    BinaryParser.fromByte = function(b) {
      var buffer = new Buffer(1);
      buffer.writeInt8(b, 0);
      return buffer;
    };
    BinaryParser.fromShort = function(i16) {
      i16 = parseInt(i16);
      var buffer = new Buffer(2);
      buffer.writeInt16BE(i16, 0);
      return buffer;
    };
    BinaryParser.fromInt = function(i32) {
      i32 = parseInt(i32);
      var buffer = new Buffer(4);
      buffer.writeInt32BE(i32, 0);
      return buffer;
    };
    BinaryParser.fromLong = function(n) {
      n = parseInt(n);
      if (Math.abs(n) >= Math.pow(2, 53)) {
        throw new Error("Unable to accurately transfer numbers larger than 2^53 - 1 as integers. Number provided was " + n);
      }
      var bits = (Array(64).join("0") + Math.abs(n).toString(2)).slice(-64);
      if (n < 0) bits = this.twosCompliment(bits);
      var buffer = new Buffer(8);
      for (var i = 0; i < 8; i++) {
        var uint8 = parseInt(bits.substr(8 * i, 8), 2);
        buffer.writeUInt8(uint8, i);
      }
      return buffer;
    };
    BinaryParser.twosCompliment = function(bits) {
      var smallestOne = bits.lastIndexOf("1");
      var left = bits.substring(0, smallestOne).replace(/1/g, "x").replace(/0/g, "1").replace(/x/g, "0");
      bits = left + bits.substring(smallestOne);
      return bits;
    };
    BinaryParser.fromDouble = function(d) {
      var buffer = new Buffer(8);
      buffer.writeDoubleBE(d, 0);
      return buffer;
    };
    BinaryParser.fromString = function(s) {
      var len = Buffer.byteLength(s);
      var buffer = new Buffer(len);
      buffer.write(s);
      return buffer;
    };
    BinaryParser.toLong = function(buffer) {
      var sign = 1;
      var bits = "";
      for (var i = 0; i < 8; i++) {
        bits += (Array(8).join("0") + buffer.readUInt8(i).toString(2)).slice(-8);
      }
      if (bits[0] === "1") {
        sign = -1;
        bits = this.twosCompliment(bits);
      }
      var largestOne = bits.indexOf("1");
      if (largestOne != -1 && largestOne < 64 - 54) throw new Error("Unable to receive number larger than 2^53 - 1 as an integer");
      return parseInt(bits, 2) * sign;
    };
    module2.exports = BinaryProtocol;
  }
});

// node_modules/evernote/package.json
var require_package = __commonJS({
  "node_modules/evernote/package.json"(exports2, module2) {
    module2.exports = {
      author: "Evernote",
      name: "evernote",
      description: "Evernote JavaScript SDK",
      version: "2.0.5",
      repository: {
        url: "https://github.com/evernote/evernote-sdk-js"
      },
      files: [
        "lib"
      ],
      main: "lib/index",
      scripts: {
        lint: "eslint src",
        build: "babel src -d lib",
        clean: "rm -rf lib"
      },
      devDependencies: {
        "babel-cli": "^6.11.4",
        "babel-eslint": "^6.1.2",
        "babel-plugin-transform-object-rest-spread": "^6.8.0",
        "babel-preset-es2015": "^6.13.2",
        eslint: "^3.2.2",
        "eslint-config-evernote": "^2.0.2",
        "eslint-plugin-evernote": "^1.0.0"
      },
      dependencies: {
        oauth: "^0.9.14"
      }
    };
  }
});

// node_modules/evernote/lib/stores.js
var require_stores = __commonJS({
  "node_modules/evernote/lib/stores.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.UserStoreClient = exports2.NoteStoreClient = void 0;
    var _createClass = /* @__PURE__ */ (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    var _NoteStore = require_NoteStore();
    var _UserStore = require_UserStore();
    var _binaryHttpTransport = require_binaryHttpTransport();
    var _binaryHttpTransport2 = _interopRequireDefault(_binaryHttpTransport);
    var _binaryProtocol = require_binaryProtocol();
    var _binaryProtocol2 = _interopRequireDefault(_binaryProtocol);
    var _package = require_package();
    var _package2 = _interopRequireDefault(_package);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _possibleConstructorReturn(self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    var AUTH_PLACEHOLDER = "AUTH_TOKEN";
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    function getParamNames(fn) {
      var fnString = fn.toString().replace(STRIP_COMMENTS, "");
      var paramNames = fnString.slice(fnString.indexOf("(") + 1, fnString.indexOf(")")).match(ARGUMENT_NAMES);
      return paramNames === null ? [] : paramNames;
    }
    function makeProxyPromise(fn, fnName) {
      return function() {
        var _this = this;
        var newArgs = [];
        var paramNames = getParamNames(fn);
        var requiresAuthToken = false;
        paramNames.pop();
        for (var i = 0; i < paramNames.length; i++) {
          var param = paramNames[i];
          if (param === "authenticationToken") {
            newArgs.push(AUTH_PLACEHOLDER);
            requiresAuthToken = true;
          }
          if (i < arguments.length) {
            newArgs.push(arguments[i]);
          }
        }
        return new Promise(function(resolve, reject) {
          var expectedNum = requiresAuthToken ? paramNames.length - 1 : paramNames.length;
          var actualNum = requiresAuthToken ? newArgs.length - 1 : newArgs.length;
          if (expectedNum !== actualNum) {
            reject("Incorrect number of arguments passed to " + fnName + ": expected " + expectedNum + " but found " + actualNum);
          } else {
            var prelimPromise = requiresAuthToken ? _this.getAuthToken() : Promise.resolve();
            prelimPromise.then(function(authTokenMaybe) {
              if (authTokenMaybe) {
                newArgs[newArgs.indexOf(AUTH_PLACEHOLDER)] = authTokenMaybe;
              }
              newArgs.push(function(err, response) {
                return err ? reject(err) : resolve(response);
              });
              fn.apply(_this, newArgs);
            }).catch(function(err) {
              return reject(err);
            });
          }
        });
      };
    }
    function extendClientWithEdamClient(Client, EDAMClient) {
      for (var key in EDAMClient.prototype) {
        if (typeof EDAMClient.prototype[key] === "function") {
          Client.prototype[key] = makeProxyPromise(EDAMClient.prototype[key], key);
        }
      }
    }
    function getAdditionalHeaders(token) {
      var m = token && token.match(/:A=([^:]+):/);
      var userAgentId = m ? m[1] : "";
      return {
        "User-Agent": userAgentId + "/" + _package2.default.version + "; Node.js / " + process.version
      };
    }
    var UserStoreClient = (function(_EDAMUserStore$Client) {
      _inherits(UserStoreClient2, _EDAMUserStore$Client);
      function UserStoreClient2() {
        var opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, UserStoreClient2);
        if (opts.url) {
          var transport = new _binaryHttpTransport2.default(opts.url);
          var protocol = new _binaryProtocol2.default(transport);
          transport.addHeaders(getAdditionalHeaders(opts.token));
          var _this2 = _possibleConstructorReturn(this, (UserStoreClient2.__proto__ || Object.getPrototypeOf(UserStoreClient2)).call(this, protocol));
          _this2.url = opts.url;
        } else {
          throw Error("UserStoreClient requires a UserStore Url when initialized");
        }
        if (opts.token) {
          _this2.token = opts.token;
        }
        return _possibleConstructorReturn(_this2);
      }
      _createClass(UserStoreClient2, [{
        key: "getAuthToken",
        value: function getAuthToken() {
          var _this3 = this;
          return new Promise(function(resolve) {
            return resolve(_this3.token);
          });
        }
      }]);
      return UserStoreClient2;
    })(_UserStore.UserStore.Client);
    extendClientWithEdamClient(UserStoreClient, _UserStore.UserStore.Client);
    var NoteStoreClient = (function(_EDAMNoteStore$Client) {
      _inherits(NoteStoreClient2, _EDAMNoteStore$Client);
      function NoteStoreClient2() {
        var opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, NoteStoreClient2);
        if (opts.url) {
          var transport = new _binaryHttpTransport2.default(opts.url);
          var protocol = new _binaryProtocol2.default(transport);
          transport.addHeaders(getAdditionalHeaders(opts.token));
          var _this4 = _possibleConstructorReturn(this, (NoteStoreClient2.__proto__ || Object.getPrototypeOf(NoteStoreClient2)).call(this, protocol));
          _this4.url = opts.url;
        } else {
          throw Error("NoteStoreClient requires a NoteStore Url when initialized");
        }
        if (opts.token) {
          _this4.token = opts.token;
        }
        return _possibleConstructorReturn(_this4);
      }
      _createClass(NoteStoreClient2, [{
        key: "getAuthToken",
        value: function getAuthToken() {
          var _this5 = this;
          return new Promise(function(resolve) {
            return resolve(_this5.token);
          });
        }
      }]);
      return NoteStoreClient2;
    })(_NoteStore.NoteStore.Client);
    extendClientWithEdamClient(NoteStoreClient, _NoteStore.NoteStore.Client);
    exports2.NoteStoreClient = NoteStoreClient;
    exports2.UserStoreClient = UserStoreClient;
  }
});

// node_modules/evernote/lib/client.js
var require_client = __commonJS({
  "node_modules/evernote/lib/client.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    var _createClass = /* @__PURE__ */ (function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    })();
    var _oauth = require_oauth3();
    var _oauth2 = _interopRequireDefault(_oauth);
    var _stores = require_stores();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var WrappedNoteStoreClient = (function() {
      function WrappedNoteStoreClient2(enInfoFunc) {
        _classCallCheck(this, WrappedNoteStoreClient2);
        this.enInfoFunc = enInfoFunc;
        for (var key in _stores.NoteStoreClient.prototype) {
          if (key.indexOf("_") === -1 && typeof _stores.NoteStoreClient.prototype[key] === "function") {
            this[key] = this.createWrapperFunction(key);
          }
        }
      }
      _createClass(WrappedNoteStoreClient2, [{
        key: "getThriftClient",
        value: function getThriftClient() {
          if (!this._thriftClient) {
            this._thriftClient = this.enInfoFunc().then(function(_ref) {
              var token = _ref.token, url = _ref.url;
              return new _stores.NoteStoreClient({ token, url });
            });
          }
          return this._thriftClient;
        }
      }, {
        key: "createWrapperFunction",
        value: function createWrapperFunction(name) {
          var _this = this;
          return function() {
            for (var _len = arguments.length, orgArgs = Array(_len), _key = 0; _key < _len; _key++) {
              orgArgs[_key] = arguments[_key];
            }
            return _this.getThriftClient().then(function(client2) {
              return client2[name].apply(client2, orgArgs);
            });
          };
        }
      }, {
        key: "getParamNames",
        value: function getParamNames(func) {
          var funStr = func.toString();
          return funStr.slice(funStr.indexOf("(") + 1, funStr.indexOf(")")).match(/([^\s,]+)/g);
        }
      }]);
      return WrappedNoteStoreClient2;
    })();
    var Client = (function() {
      function Client2() {
        var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        _classCallCheck(this, Client2);
        this.consumerKey = options.consumerKey;
        this.consumerSecret = options.consumerSecret;
        this.sandbox = options.sandbox === void 0 ? true : options.sandbox;
        this.china = !!options.china;
        this.token = options.token;
        var defaultServiceHost = void 0;
        if (this.sandbox) {
          defaultServiceHost = "sandbox.evernote.com";
        } else if (this.china) {
          defaultServiceHost = "app.yinxiang.com";
        } else {
          defaultServiceHost = "www.evernote.com";
        }
        this.serviceHost = options.serviceHost || defaultServiceHost;
      }
      _createClass(Client2, [{
        key: "getRequestToken",
        value: function getRequestToken(callbackUrl, callback) {
          var oauth = this.getOAuthClient(callbackUrl);
          oauth.getOAuthRequestToken(function(err, oauthToken, oauthTokenSecret, results) {
            callback(err, oauthToken, oauthTokenSecret, results);
          });
        }
      }, {
        key: "getAuthorizeUrl",
        value: function getAuthorizeUrl(oauthToken) {
          return this.getEndpoint("OAuth.action") + "?oauth_token=" + oauthToken;
        }
      }, {
        key: "getAccessToken",
        value: function getAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, callback) {
          var _this2 = this;
          var oauth = this.getOAuthClient("");
          oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
            _this2.token = oauthAccessToken;
            callback(err, oauthAccessToken, oauthAccessTokenSecret, results);
          });
        }
      }, {
        key: "getUserStore",
        value: function getUserStore() {
          if (!this._userStore) {
            this._userStore = new _stores.UserStoreClient({
              token: this.token,
              url: this.getEndpoint("/edam/user")
            });
          }
          return this._userStore;
        }
      }, {
        key: "getNoteStore",
        value: function getNoteStore(noteStoreUrl) {
          var _this3 = this;
          if (noteStoreUrl) {
            this.noteStoreUrl = noteStoreUrl;
          }
          return new WrappedNoteStoreClient(function() {
            if (_this3.noteStoreUrl) {
              return Promise.resolve({ token: _this3.token, url: _this3.noteStoreUrl });
            } else {
              return _this3.getUserStore().getUserUrls().then(function(userUrls) {
                _this3.noteStoreUrl = userUrls.noteStoreUrl;
                return { token: _this3.token, url: userUrls.noteStoreUrl };
              });
            }
          });
        }
      }, {
        key: "getSharedNoteStore",
        value: function getSharedNoteStore(linkedNotebook) {
          var _this4 = this;
          return new WrappedNoteStoreClient(function() {
            var cache = _this4[linkedNotebook.sharedNotebookGlobalId];
            if (cache && cache.sharedToken) {
              return Promise.resolve({ token: cache.sharedToken, url: linkedNotebook.noteStoreUrl });
            } else {
              return _this4.getNoteStore().authenticateToSharedNotebook(linkedNotebook.sharedNotebookGlobalId).then(function(sharedAuth) {
                var token = sharedAuth.authenticationToken;
                _this4[linkedNotebook.sharedNotebookGlobalId] = { sharedToken: token };
                return { token, url: linkedNotebook.noteStoreUrl };
              });
            }
          });
        }
      }, {
        key: "getBusinessNoteStore",
        value: function getBusinessNoteStore() {
          var _this5 = this;
          return new WrappedNoteStoreClient(function() {
            if (_this5.bizToken && _this5.bizNoteStoreUrl) {
              return Promise.resolve({ token: _this5.bizToken, url: _this5.bizNoteStoreUrl });
            } else {
              return _this5.getUserStore().authenticateToBusiness().then(function(bizAuth) {
                _this5.bizToken = bizAuth.authenticationToken;
                _this5.bizNoteStoreUrl = bizAuth.noteStoreUrl;
                _this5.bizUser = bizAuth.user;
                return { token: bizAuth.authenticationToken, url: bizAuth.noteStoreUrl };
              });
            }
          });
        }
      }, {
        key: "getEndpoint",
        value: function getEndpoint(path) {
          var url = "https://" + this.serviceHost;
          if (path) {
            url = url + "/" + path;
          }
          return url;
        }
      }, {
        key: "getOAuthClient",
        value: function getOAuthClient(callbackUrl) {
          return new _oauth2.default.OAuth(this.getEndpoint("oauth"), this.getEndpoint("oauth"), this.consumerKey, this.consumerSecret, "1.0", callbackUrl, "HMAC-SHA1");
        }
      }]);
      return Client2;
    })();
    exports2.default = Client;
  }
});

// node_modules/evernote/lib/index.js
var require_lib = __commonJS({
  "node_modules/evernote/lib/index.js"(exports2, module2) {
    "use strict";
    var _client = require_client();
    var _client2 = _interopRequireDefault(_client);
    var _Errors = require_Errors();
    var _Errors2 = _interopRequireDefault(_Errors);
    var _Limits = require_Limits();
    var _Limits2 = _interopRequireDefault(_Limits);
    var _NoteStore = require_NoteStore();
    var _NoteStore2 = _interopRequireDefault(_NoteStore);
    var _Types = require_Types();
    var _Types2 = _interopRequireDefault(_Types);
    var _UserStore = require_UserStore();
    var _UserStore2 = _interopRequireDefault(_UserStore);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    module2.exports = {
      Client: _client2.default,
      Errors: _Errors2.default,
      Limits: _Limits2.default,
      NoteStore: _NoteStore2.default,
      Types: _Types2.default,
      UserStore: _UserStore2.default
    };
  }
});

// node_modules/zod/v4/core/core.js
var _a;
// @__NO_SIDE_EFFECTS__
function $constructor(name, initializer3, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer3(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a3;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def);
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $ZodAsyncError = class extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
};
var $ZodEncodeError = class extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}

// node_modules/zod/v4/core/util.js
var util_exports = {};
__export(util_exports, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone,
  cloneDef: () => cloneDef,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  merge: () => merge,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function assertIs(_arg) {
}
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
function assert(_) {
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object3, key, getter) {
  let value = void 0;
  Object.defineProperty(object3, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object3, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
};
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class2, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class2 ? new Class2({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class2, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class2({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a3;
    (_a3 = iss).path ?? (_a3.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
function issue(...args2) {
  const [iss, input, inst] = args2;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base642) {
  const binaryString = atob(base642);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url2) {
  const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base642.length % 4) % 4);
  return base64ToUint8Array(base642 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var Class = class {
  constructor(..._args) {
  }
};

// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error2.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error3, path = []) => {
    for (const issue2 of error3.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error2);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};

// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args2) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args2.precision === "number" ? args2.precision === -1 ? `${hhmm}` : args2.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args2.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args2) {
  return new RegExp(`^${timeSource(args2)}$`);
}
function datetime(args2) {
  const time3 = timeSource({ precision: args2.precision });
  const opts = ["Z"];
  if (args2.local)
    opts.push("");
  if (args2.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time3}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a3;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    var _a3;
    (_a3 = inst2._zod.bag).multipleOf ?? (_a3.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst2._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst2._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== void 0;
  });
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a3, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst2) => {
    const bag = inst2._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
var Doc = class {
  constructor(args2 = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args2;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args2 = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args2, lines.join("\n"));
  }
};

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a3;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks2, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error();
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error();
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazy(inst._zod, "propValues", () => {
    const propValues = {};
    for (const option of def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
      for (const [k, v] of Object.entries(pv)) {
        if (!propValues[k])
          propValues[k] = /* @__PURE__ */ new Set();
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    return propValues;
  });
  const disc = cached(() => {
    const opts = def.options;
    const map = /* @__PURE__ */ new Map();
    for (const o of opts) {
      const values = o._zod.propValues?.[def.discriminator];
      if (!values || values.size === 0)
        throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
      for (const v of values) {
        if (map.has(v)) {
          throw new Error(`Duplicate discriminator value "${String(v)}"`);
        }
        map.set(v, o);
      }
    }
    return map;
  });
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const opt = disc.value.get(input?.[def.discriminator]);
    if (opt) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[keyResult.value] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === void 0) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => {
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
  $ZodPipe.init(inst, def);
});
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}

// node_modules/zod/v4/locales/en.js
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
        const receivedType = parsedType(issue2.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
          const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}

// node_modules/zod/v4/core/registries.js
var _a2;
var $ZodRegistry = class {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta2 = _meta[0];
    this._map.set(schema, meta2);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.set(meta2.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta2 = this._map.get(schema);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.delete(meta2.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class2, params) {
  return new Class2({
    type: "string",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _number(Class2, params) {
  return new Class2({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class2, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}

// node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
function process2(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a3;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process2(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    Object.assign(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process2(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};

// node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {
};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === void 0) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      } else {
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
var transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process2(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  json.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json.properties[key] = process2(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === void 0;
    } else {
      return v.optout === void 0;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = process2(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process2(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = process2(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process2(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process2(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process2(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process2(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues;
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process2(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process2(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
function isZ4Schema(s) {
  const schema = s;
  return !!schema._zod;
}
function safeParse2(schema, data) {
  if (isZ4Schema(schema)) {
    const result2 = safeParse(schema, data);
    return result2;
  }
  const v3Schema = schema;
  const result = v3Schema.safeParse(data);
  return result;
}
function getObjectShape(schema) {
  if (!schema)
    return void 0;
  let rawShape;
  if (isZ4Schema(schema)) {
    const v4Schema = schema;
    rawShape = v4Schema._zod?.def?.shape;
  } else {
    const v3Schema = schema;
    rawShape = v3Schema.shape;
  }
  if (!rawShape)
    return void 0;
  if (typeof rawShape === "function") {
    try {
      return rawShape();
    } catch {
      return void 0;
    }
  }
  return rawShape;
}
function getLiteralValue(schema) {
  if (isZ4Schema(schema)) {
    const v4Schema = schema;
    const def2 = v4Schema._zod?.def;
    if (def2) {
      if (def2.value !== void 0)
        return def2.value;
      if (Array.isArray(def2.values) && def2.values.length > 0) {
        return def2.values[0];
      }
    }
  }
  const v3Schema = schema;
  const def = v3Schema._def;
  if (def) {
    if (def.value !== void 0)
      return def.value;
    if (Array.isArray(def.values) && def.values.length > 0) {
      return def.values[0];
    }
  }
  const directValue = schema.value;
  if (directValue !== void 0)
    return directValue;
  return void 0;
}

// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
      // enumerable: false,
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
      // enumerable: false,
    },
    addIssue: {
      value: (issue2) => {
        inst.issues.push(issue2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (issues2) => {
        inst.issues.push(...issues2);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
      // enumerable: false,
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse3 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode2 = /* @__PURE__ */ _encode(ZodRealError);
var decode2 = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse3(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode2(inst, data, params);
  inst.decode = (data, params) => decode2(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def2 = this.def;
      return this.clone(util_exports.mergeDefs(def2, {
        checks: [
          ...def2.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def2, params) {
      return clone(this, def2, params);
    },
    brand() {
      return this;
    },
    register(reg, meta2) {
      reg.add(this, meta2);
      return this;
    },
    refine(check, params) {
      return this.check(refine(check, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args2) {
      if (args2.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args2[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(void 0).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args2) {
      return this.check(_regex(...args2));
    },
    includes(...args2) {
      return this.check(_includes(...args2));
    },
    startsWith(...args2) {
      return this.check(_startsWith(...args2));
    },
    endsWith(...args2) {
      return this.check(_endsWith(...args2));
    },
    min(...args2) {
      return this.check(_minLength(...args2));
    },
    max(...args2) {
      return this.check(_maxLength(...args2));
    },
    length(...args2) {
      return this.check(_length(...args2));
    },
    nonempty(...args2) {
      return this.check(_minLength(1, ...args2));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args2) {
      return this.check(_normalize(...args2));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  util_exports.defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(incoming) {
      return util_exports.extend(this, incoming);
    },
    safeExtend(incoming) {
      return util_exports.safeExtend(this, incoming);
    },
    merge(other) {
      return util_exports.merge(this, other);
    },
    pick(mask) {
      return util_exports.pick(this, mask);
    },
    omit(mask) {
      return util_exports.omit(this, mask);
    },
    partial(...args2) {
      return util_exports.partial(ZodOptional, this, args2[0]);
    },
    required(...args2) {
      return util_exports.required(ZodNonOptional, this, args2[0]);
    }
  });
});
function object2(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...util_exports.normalizeParams(params)
  };
  return new ZodObject(def);
}
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...util_exports.normalizeParams(params)
  });
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...util_exports.normalizeParams(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util_exports.normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...util_exports.normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util_exports.normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(util_exports.issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(util_exports.issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodPreprocess.init(inst, def);
});
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}

// node_modules/zod/v4/classic/external.js
config(en_default());

// node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var LATEST_PROTOCOL_VERSION = "2025-11-25";
var SUPPORTED_PROTOCOL_VERSIONS = [LATEST_PROTOCOL_VERSION, "2025-06-18", "2025-03-26", "2024-11-05", "2024-10-07"];
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
var JSONRPC_VERSION = "2.0";
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
var ProgressTokenSchema = union([string2(), number2().int()]);
var CursorSchema = string2();
var TaskCreationParamsSchema = looseObject({
  /**
   * Requested duration in milliseconds to retain task from creation.
   */
  ttl: number2().optional(),
  /**
   * Time in milliseconds to wait between task status requests.
   */
  pollInterval: number2().optional()
});
var TaskMetadataSchema = object2({
  ttl: number2().optional()
});
var RelatedTaskMetadataSchema = object2({
  taskId: string2()
});
var RequestMetaSchema = looseObject({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: ProgressTokenSchema.optional(),
  /**
   * If specified, this request is related to the provided task.
   */
  [RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
var BaseRequestParamsSchema = object2({
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta: RequestMetaSchema.optional()
});
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * If specified, the caller is requesting task-augmented execution for this request.
   * The request will return a CreateTaskResult immediately, and the actual result can be
   * retrieved later via tasks/result.
   *
   * Task augmentation is subject to capability negotiation - receivers MUST declare support
   * for task augmentation of specific request types in their capabilities.
   */
  task: TaskMetadataSchema.optional()
});
var isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
var RequestSchema = object2({
  method: string2(),
  params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object2({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var NotificationSchema = object2({
  method: string2(),
  params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var RequestIdSchema = union([string2(), number2().int()]);
var JSONRPCRequestSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  ...RequestSchema.shape
}).strict();
var isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
var JSONRPCNotificationSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  ...NotificationSchema.shape
}).strict();
var isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
var JSONRPCResultResponseSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  result: ResultSchema
}).strict();
var isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2[ErrorCode2["ConnectionClosed"] = -32e3] = "ConnectionClosed";
  ErrorCode2[ErrorCode2["RequestTimeout"] = -32001] = "RequestTimeout";
  ErrorCode2[ErrorCode2["ParseError"] = -32700] = "ParseError";
  ErrorCode2[ErrorCode2["InvalidRequest"] = -32600] = "InvalidRequest";
  ErrorCode2[ErrorCode2["MethodNotFound"] = -32601] = "MethodNotFound";
  ErrorCode2[ErrorCode2["InvalidParams"] = -32602] = "InvalidParams";
  ErrorCode2[ErrorCode2["InternalError"] = -32603] = "InternalError";
  ErrorCode2[ErrorCode2["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
var JSONRPCErrorResponseSchema = object2({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema.optional(),
  error: object2({
    /**
     * The error type that occurred.
     */
    code: number2().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: string2(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: unknown().optional()
  })
}).strict();
var isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
var JSONRPCMessageSchema = union([
  JSONRPCRequestSchema,
  JSONRPCNotificationSchema,
  JSONRPCResultResponseSchema,
  JSONRPCErrorResponseSchema
]);
var JSONRPCResponseSchema = union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the request to cancel.
   *
   * This MUST correspond to the ID of a request previously issued in the same direction.
   */
  requestId: RequestIdSchema.optional(),
  /**
   * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
   */
  reason: string2().optional()
});
var CancelledNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/cancelled"),
  params: CancelledNotificationParamsSchema
});
var IconSchema = object2({
  /**
   * URL or data URI for the icon.
   */
  src: string2(),
  /**
   * Optional MIME type for the icon.
   */
  mimeType: string2().optional(),
  /**
   * Optional array of strings that specify sizes at which the icon can be used.
   * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
   *
   * If not provided, the client should assume that the icon can be used at any size.
   */
  sizes: array(string2()).optional(),
  /**
   * Optional specifier for the theme this icon is designed for. `light` indicates
   * the icon is designed to be used with a light background, and `dark` indicates
   * the icon is designed to be used with a dark background.
   *
   * If not provided, the client should assume the icon can be used with any theme.
   */
  theme: _enum(["light", "dark"]).optional()
});
var IconsSchema = object2({
  /**
   * Optional set of sized icons that the client can display in a user interface.
   *
   * Clients that support rendering icons MUST support at least the following MIME types:
   * - `image/png` - PNG images (safe, universal compatibility)
   * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
   *
   * Clients that support rendering icons SHOULD also support:
   * - `image/svg+xml` - SVG images (scalable but requires security precautions)
   * - `image/webp` - WebP images (modern, efficient format)
   */
  icons: array(IconSchema).optional()
});
var BaseMetadataSchema = object2({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: string2(),
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display (except for Tool,
   * where `annotations.title` should be given precedence over using `name`,
   * if present).
   */
  title: string2().optional()
});
var ImplementationSchema = BaseMetadataSchema.extend({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  version: string2(),
  /**
   * An optional URL of the website for this implementation.
   */
  websiteUrl: string2().optional(),
  /**
   * An optional human-readable description of what this implementation does.
   *
   * This can be used by clients or servers to provide context about their purpose
   * and capabilities. For example, a server might describe the types of resources
   * or tools it provides, while a client might describe its intended use case.
   */
  description: string2().optional()
});
var FormElicitationCapabilitySchema = intersection(object2({
  applyDefaults: boolean2().optional()
}), record(string2(), unknown()));
var ElicitationCapabilitySchema = preprocess((value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) {
      return { form: {} };
    }
  }
  return value;
}, intersection(object2({
  form: FormElicitationCapabilitySchema.optional(),
  url: AssertObjectSchema.optional()
}), record(string2(), unknown()).optional()));
var ClientTasksCapabilitySchema = looseObject({
  /**
   * Present if the client supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the client supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for sampling requests.
     */
    sampling: looseObject({
      createMessage: AssertObjectSchema.optional()
    }).optional(),
    /**
     * Task support for elicitation requests.
     */
    elicitation: looseObject({
      create: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ServerTasksCapabilitySchema = looseObject({
  /**
   * Present if the server supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the server supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for tool requests.
     */
    tools: looseObject({
      call: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ClientCapabilitiesSchema = object2({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: object2({
    /**
     * Present if the client supports context inclusion via includeContext parameter.
     * If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
     */
    context: AssertObjectSchema.optional(),
    /**
     * Present if the client supports tool use via tools and toolChoice parameters.
     */
    tools: AssertObjectSchema.optional()
  }).optional(),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: ElicitationCapabilitySchema.optional(),
  /**
   * Present if the client supports listing roots.
   */
  roots: object2({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the client supports task creation.
   */
  tasks: ClientTasksCapabilitySchema.optional(),
  /**
   * Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
   */
  protocolVersion: string2(),
  capabilities: ClientCapabilitiesSchema,
  clientInfo: ImplementationSchema
});
var InitializeRequestSchema = RequestSchema.extend({
  method: literal("initialize"),
  params: InitializeRequestParamsSchema
});
var ServerCapabilitiesSchema = object2({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: AssertObjectSchema.optional(),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: AssertObjectSchema.optional(),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: object2({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any resources to read.
   */
  resources: object2({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: boolean2().optional(),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any tools to call.
   */
  tools: object2({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server supports task creation.
   */
  tasks: ServerTasksCapabilitySchema.optional(),
  /**
   * Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeResultSchema = ResultSchema.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: string2(),
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ImplementationSchema,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: string2().optional()
});
var InitializedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/initialized"),
  params: NotificationsParamsSchema.optional()
});
var PingRequestSchema = RequestSchema.extend({
  method: literal("ping"),
  params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object2({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: number2(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: optional(number2()),
  /**
   * An optional message describing the current progress.
   */
  message: optional(string2())
});
var ProgressNotificationParamsSchema = object2({
  ...NotificationsParamsSchema.shape,
  ...ProgressSchema.shape,
  /**
   * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
   */
  progressToken: ProgressTokenSchema
});
var ProgressNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/progress"),
  params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * An opaque token representing the current pagination position.
   * If provided, the server should return results starting after this cursor.
   */
  cursor: CursorSchema.optional()
});
var PaginatedRequestSchema = RequestSchema.extend({
  params: PaginatedRequestParamsSchema.optional()
});
var PaginatedResultSchema = ResultSchema.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: CursorSchema.optional()
});
var TaskStatusSchema = _enum(["working", "input_required", "completed", "failed", "cancelled"]);
var TaskSchema = object2({
  taskId: string2(),
  status: TaskStatusSchema,
  /**
   * Time in milliseconds to keep task results available after completion.
   * If null, the task has unlimited lifetime until manually cleaned up.
   */
  ttl: union([number2(), _null3()]),
  /**
   * ISO 8601 timestamp when the task was created.
   */
  createdAt: string2(),
  /**
   * ISO 8601 timestamp when the task was last updated.
   */
  lastUpdatedAt: string2(),
  pollInterval: optional(number2()),
  /**
   * Optional diagnostic message for failed tasks or other status information.
   */
  statusMessage: optional(string2())
});
var CreateTaskResultSchema = ResultSchema.extend({
  task: TaskSchema
});
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
var TaskStatusNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tasks/status"),
  params: TaskStatusNotificationParamsSchema
});
var GetTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/get"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
var GetTaskPayloadRequestSchema = RequestSchema.extend({
  method: literal("tasks/result"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskPayloadResultSchema = ResultSchema.loose();
var ListTasksRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tasks/list")
});
var ListTasksResultSchema = PaginatedResultSchema.extend({
  tasks: array(TaskSchema)
});
var CancelTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/cancel"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
var ResourceContentsSchema = object2({
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: string2()
});
var Base64Schema = string2().refine((val) => {
  try {
    atob(val);
    return true;
  } catch {
    return false;
  }
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: Base64Schema
});
var RoleSchema = _enum(["user", "assistant"]);
var AnnotationsSchema = object2({
  /**
   * Intended audience(s) for the resource.
   */
  audience: array(RoleSchema).optional(),
  /**
   * Importance hint for the resource, from 0 (least) to 1 (most).
   */
  priority: number2().min(0).max(1).optional(),
  /**
   * ISO 8601 timestamp for the most recent modification.
   */
  lastModified: iso_exports.datetime({ offset: true }).optional()
});
var ResourceSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
   *
   * This can be used by Hosts to display file sizes and estimate context window usage.
   */
  size: optional(number2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ResourceTemplateSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: string2(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: optional(string2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/list")
});
var ListResourcesResultSchema = PaginatedResultSchema.extend({
  resources: array(ResourceSchema)
});
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/templates/list")
});
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
  resourceTemplates: array(ResourceTemplateSchema)
});
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
   *
   * @format uri
   */
  uri: string2()
});
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
var ReadResourceRequestSchema = RequestSchema.extend({
  method: literal("resources/read"),
  params: ReadResourceRequestParamsSchema
});
var ReadResourceResultSchema = ResultSchema.extend({
  contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema]))
});
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var SubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/subscribe"),
  params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var UnsubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/unsubscribe"),
  params: UnsubscribeRequestParamsSchema
});
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
   */
  uri: string2()
});
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/updated"),
  params: ResourceUpdatedNotificationParamsSchema
});
var PromptArgumentSchema = object2({
  /**
   * The name of the argument.
   */
  name: string2(),
  /**
   * A human-readable description of the argument.
   */
  description: optional(string2()),
  /**
   * Whether this argument must be provided.
   */
  required: optional(boolean2())
});
var PromptSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * An optional description of what this prompt provides
   */
  description: optional(string2()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: optional(array(PromptArgumentSchema)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("prompts/list")
});
var ListPromptsResultSchema = PaginatedResultSchema.extend({
  prompts: array(PromptSchema)
});
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The name of the prompt or prompt template.
   */
  name: string2(),
  /**
   * Arguments to use for templating the prompt.
   */
  arguments: record(string2(), string2()).optional()
});
var GetPromptRequestSchema = RequestSchema.extend({
  method: literal("prompts/get"),
  params: GetPromptRequestParamsSchema
});
var TextContentSchema = object2({
  type: literal("text"),
  /**
   * The text content of the message.
   */
  text: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ImageContentSchema = object2({
  type: literal("image"),
  /**
   * The base64-encoded image data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var AudioContentSchema = object2({
  type: literal("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ToolUseContentSchema = object2({
  type: literal("tool_use"),
  /**
   * The name of the tool to invoke.
   * Must match a tool name from the request's tools array.
   */
  name: string2(),
  /**
   * Unique identifier for this tool call.
   * Used to correlate with ToolResultContent in subsequent messages.
   */
  id: string2(),
  /**
   * Arguments to pass to the tool.
   * Must conform to the tool's inputSchema.
   */
  input: record(string2(), unknown()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var EmbeddedResourceSchema = object2({
  type: literal("resource"),
  resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ResourceLinkSchema = ResourceSchema.extend({
  type: literal("resource_link")
});
var ContentBlockSchema = union([
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ResourceLinkSchema,
  EmbeddedResourceSchema
]);
var PromptMessageSchema = object2({
  role: RoleSchema,
  content: ContentBlockSchema
});
var GetPromptResultSchema = ResultSchema.extend({
  /**
   * An optional description for the prompt.
   */
  description: string2().optional(),
  messages: array(PromptMessageSchema)
});
var PromptListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/prompts/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ToolAnnotationsSchema = object2({
  /**
   * A human-readable title for the tool.
   */
  title: string2().optional(),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: boolean2().optional(),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: boolean2().optional(),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: boolean2().optional(),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: boolean2().optional()
});
var ToolExecutionSchema = object2({
  /**
   * Indicates the tool's preference for task-augmented execution.
   * - "required": Clients MUST invoke the tool as a task
   * - "optional": Clients MAY invoke the tool as a task or normal request
   * - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
   *
   * If not present, defaults to "forbidden".
   */
  taskSupport: _enum(["required", "optional", "forbidden"]).optional()
});
var ToolSchema = object2({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A human-readable description of the tool.
   */
  description: string2().optional(),
  /**
   * A JSON Schema 2020-12 object defining the expected parameters for the tool.
   * Must have type: 'object' at the root level per MCP spec.
   */
  inputSchema: object2({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()),
  /**
   * An optional JSON Schema 2020-12 object defining the structure of the tool's output
   * returned in the structuredContent field of a CallToolResult.
   * Must have type: 'object' at the root level per MCP spec.
   */
  outputSchema: object2({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()).optional(),
  /**
   * Optional additional tool information.
   */
  annotations: ToolAnnotationsSchema.optional(),
  /**
   * Execution-related properties for this tool.
   */
  execution: ToolExecutionSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListToolsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tools/list")
});
var ListToolsResultSchema = PaginatedResultSchema.extend({
  tools: array(ToolSchema)
});
var CallToolResultSchema = ResultSchema.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: array(ContentBlockSchema).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: record(string2(), unknown()).optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: boolean2().optional()
});
var CompatibilityCallToolResultSchema = CallToolResultSchema.or(ResultSchema.extend({
  toolResult: unknown()
}));
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The name of the tool to call.
   */
  name: string2(),
  /**
   * Arguments to pass to the tool.
   */
  arguments: record(string2(), unknown()).optional()
});
var CallToolRequestSchema = RequestSchema.extend({
  method: literal("tools/call"),
  params: CallToolRequestParamsSchema
});
var ToolListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tools/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ListChangedOptionsBaseSchema = object2({
  /**
   * If true, the list will be refreshed automatically when a list changed notification is received.
   * The callback will be called with the updated list.
   *
   * If false, the callback will be called with null items, allowing manual refresh.
   *
   * @default true
   */
  autoRefresh: boolean2().default(true),
  /**
   * Debounce time in milliseconds for list changed notification processing.
   *
   * Multiple notifications received within this timeframe will only trigger one refresh.
   * Set to 0 to disable debouncing.
   *
   * @default 300
   */
  debounceMs: number2().int().nonnegative().default(300)
});
var LoggingLevelSchema = _enum(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]);
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
   */
  level: LoggingLevelSchema
});
var SetLevelRequestSchema = RequestSchema.extend({
  method: literal("logging/setLevel"),
  params: SetLevelRequestParamsSchema
});
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The severity of this log message.
   */
  level: LoggingLevelSchema,
  /**
   * An optional name of the logger issuing this message.
   */
  logger: string2().optional(),
  /**
   * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
   */
  data: unknown()
});
var LoggingMessageNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/message"),
  params: LoggingMessageNotificationParamsSchema
});
var ModelHintSchema = object2({
  /**
   * A hint for a model name.
   */
  name: string2().optional()
});
var ModelPreferencesSchema = object2({
  /**
   * Optional hints to use for model selection.
   */
  hints: array(ModelHintSchema).optional(),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: number2().min(0).max(1).optional()
});
var ToolChoiceSchema = object2({
  /**
   * Controls when tools are used:
   * - "auto": Model decides whether to use tools (default)
   * - "required": Model MUST use at least one tool before completing
   * - "none": Model MUST NOT use any tools
   */
  mode: _enum(["auto", "required", "none"]).optional()
});
var ToolResultContentSchema = object2({
  type: literal("tool_result"),
  toolUseId: string2().describe("The unique identifier for the corresponding tool call."),
  content: array(ContentBlockSchema).default([]),
  structuredContent: object2({}).loose().optional(),
  isError: boolean2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var SamplingContentSchema = discriminatedUnion("type", [TextContentSchema, ImageContentSchema, AudioContentSchema]);
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ToolUseContentSchema,
  ToolResultContentSchema
]);
var SamplingMessageSchema = object2({
  role: RoleSchema,
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  messages: array(SamplingMessageSchema),
  /**
   * The server's preferences for which model to select. The client MAY modify or omit this request.
   */
  modelPreferences: ModelPreferencesSchema.optional(),
  /**
   * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
   */
  systemPrompt: string2().optional(),
  /**
   * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
   * The client MAY ignore this request.
   *
   * Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
   * declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
   */
  includeContext: _enum(["none", "thisServer", "allServers"]).optional(),
  temperature: number2().optional(),
  /**
   * The requested maximum number of tokens to sample (to prevent runaway completions).
   *
   * The client MAY choose to sample fewer tokens than the requested maximum.
   */
  maxTokens: number2().int(),
  stopSequences: array(string2()).optional(),
  /**
   * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
   */
  metadata: AssertObjectSchema.optional(),
  /**
   * Tools that the model may use during generation.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   */
  tools: array(ToolSchema).optional(),
  /**
   * Controls how the model uses tools.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   * Default is `{ mode: "auto" }`.
   */
  toolChoice: ToolChoiceSchema.optional()
});
var CreateMessageRequestSchema = RequestSchema.extend({
  method: literal("sampling/createMessage"),
  params: CreateMessageRequestParamsSchema
});
var CreateMessageResultSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. Single content block (text, image, or audio).
   */
  content: SamplingContentSchema
});
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   * - "toolUse": The model wants to use one or more tools
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
   */
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
var BooleanSchemaSchema = object2({
  type: literal("boolean"),
  title: string2().optional(),
  description: string2().optional(),
  default: boolean2().optional()
});
var StringSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  minLength: number2().optional(),
  maxLength: number2().optional(),
  format: _enum(["email", "uri", "date", "date-time"]).optional(),
  default: string2().optional()
});
var NumberSchemaSchema = object2({
  type: _enum(["number", "integer"]),
  title: string2().optional(),
  description: string2().optional(),
  minimum: number2().optional(),
  maximum: number2().optional(),
  default: number2().optional()
});
var UntitledSingleSelectEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  default: string2().optional()
});
var TitledSingleSelectEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  oneOf: array(object2({
    const: string2(),
    title: string2()
  })),
  default: string2().optional()
});
var LegacyTitledEnumSchemaSchema = object2({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  enumNames: array(string2()).optional(),
  default: string2().optional()
});
var SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
var UntitledMultiSelectEnumSchemaSchema = object2({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object2({
    type: literal("string"),
    enum: array(string2())
  }),
  default: array(string2()).optional()
});
var TitledMultiSelectEnumSchemaSchema = object2({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object2({
    anyOf: array(object2({
      const: string2(),
      title: string2()
    }))
  }),
  default: array(string2()).optional()
});
var MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
var EnumSchemaSchema = union([LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema]);
var PrimitiveSchemaDefinitionSchema = union([EnumSchemaSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema]);
var ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   *
   * Optional for backward compatibility. Clients MUST treat missing mode as "form".
   */
  mode: literal("form").optional(),
  /**
   * The message to present to the user describing what information is being requested.
   */
  message: string2(),
  /**
   * A restricted subset of JSON Schema.
   * Only top-level properties are allowed, without nesting.
   */
  requestedSchema: object2({
    type: literal("object"),
    properties: record(string2(), PrimitiveSchemaDefinitionSchema),
    required: array(string2()).optional()
  })
});
var ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   */
  mode: literal("url"),
  /**
   * The message to present to the user explaining why the interaction is needed.
   */
  message: string2(),
  /**
   * The ID of the elicitation, which must be unique within the context of the server.
   * The client MUST treat this ID as an opaque value.
   */
  elicitationId: string2(),
  /**
   * The URL that the user should navigate to.
   */
  url: string2().url()
});
var ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
var ElicitRequestSchema = RequestSchema.extend({
  method: literal("elicitation/create"),
  params: ElicitRequestParamsSchema
});
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the elicitation that completed.
   */
  elicitationId: string2()
});
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/elicitation/complete"),
  params: ElicitationCompleteNotificationParamsSchema
});
var ElicitResultSchema = ResultSchema.extend({
  /**
   * The user action in response to the elicitation.
   * - "accept": User submitted the form/confirmed the action
   * - "decline": User explicitly decline the action
   * - "cancel": User dismissed without making an explicit choice
   */
  action: _enum(["accept", "decline", "cancel"]),
  /**
   * The submitted form data, only present when action is "accept".
   * Contains values matching the requested schema.
   * Per MCP spec, content is "typically omitted" for decline/cancel actions.
   * We normalize null to undefined for leniency while maintaining type compatibility.
   */
  content: preprocess((val) => val === null ? void 0 : val, record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional())
});
var ResourceTemplateReferenceSchema = object2({
  type: literal("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: string2()
});
var PromptReferenceSchema = object2({
  type: literal("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: string2()
});
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
  ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
  /**
   * The argument's information
   */
  argument: object2({
    /**
     * The name of the argument
     */
    name: string2(),
    /**
     * The value of the argument to use for completion matching.
     */
    value: string2()
  }),
  context: object2({
    /**
     * Previously-resolved variables in a URI template or prompt.
     */
    arguments: record(string2(), string2()).optional()
  }).optional()
});
var CompleteRequestSchema = RequestSchema.extend({
  method: literal("completion/complete"),
  params: CompleteRequestParamsSchema
});
var CompleteResultSchema = ResultSchema.extend({
  completion: looseObject({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: array(string2()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: optional(number2().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: optional(boolean2())
  })
});
var RootSchema = object2({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: string2().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: string2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListRootsRequestSchema = RequestSchema.extend({
  method: literal("roots/list"),
  params: BaseRequestParamsSchema.optional()
});
var ListRootsResultSchema = ResultSchema.extend({
  roots: array(RootSchema)
});
var RootsListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/roots/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ClientRequestSchema = union([
  PingRequestSchema,
  InitializeRequestSchema,
  CompleteRequestSchema,
  SetLevelRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ClientNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  InitializedNotificationSchema,
  RootsListChangedNotificationSchema,
  TaskStatusNotificationSchema
]);
var ClientResultSchema = union([
  EmptyResultSchema,
  CreateMessageResultSchema,
  CreateMessageResultWithToolsSchema,
  ElicitResultSchema,
  ListRootsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);
var ServerRequestSchema = union([
  PingRequestSchema,
  CreateMessageRequestSchema,
  ElicitRequestSchema,
  ListRootsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ServerNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  LoggingMessageNotificationSchema,
  ResourceUpdatedNotificationSchema,
  ResourceListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
  PromptListChangedNotificationSchema,
  TaskStatusNotificationSchema,
  ElicitationCompleteNotificationSchema
]);
var ServerResultSchema = union([
  EmptyResultSchema,
  InitializeResultSchema,
  CompleteResultSchema,
  GetPromptResultSchema,
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesResultSchema,
  ReadResourceResultSchema,
  CallToolResultSchema,
  ListToolsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);
var McpError = class _McpError extends Error {
  constructor(code, message, data) {
    super(`MCP error ${code}: ${message}`);
    this.code = code;
    this.data = data;
    this.name = "McpError";
  }
  /**
   * Factory method to create the appropriate error type based on the error code and data
   */
  static fromError(code, message, data) {
    if (code === ErrorCode.UrlElicitationRequired && data) {
      const errorData = data;
      if (errorData.elicitations) {
        return new UrlElicitationRequiredError(errorData.elicitations, message);
      }
    }
    return new _McpError(code, message, data);
  }
};
var UrlElicitationRequiredError = class extends McpError {
  constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
    super(ErrorCode.UrlElicitationRequired, message, {
      elicitations
    });
  }
  get elicitations() {
    return this.data?.elicitations ?? [];
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
function isTerminal(status) {
  return status === "completed" || status === "failed" || status === "cancelled";
}

// node_modules/zod-to-json-schema/dist/esm/parsers/string.js
var ALPHA_NUMERIC = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
function getMethodLiteral(schema) {
  const shape = getObjectShape(schema);
  const methodSchema = shape?.method;
  if (!methodSchema) {
    throw new Error("Schema is missing a method literal");
  }
  const value = getLiteralValue(methodSchema);
  if (typeof value !== "string") {
    throw new Error("Schema method literal must be a string");
  }
  return value;
}
function parseWithCompat(schema, data) {
  const result = safeParse2(schema, data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/protocol.js
var DEFAULT_REQUEST_TIMEOUT_MSEC = 6e4;
var Protocol = class {
  constructor(_options) {
    this._options = _options;
    this._requestMessageId = 0;
    this._requestHandlers = /* @__PURE__ */ new Map();
    this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
    this._notificationHandlers = /* @__PURE__ */ new Map();
    this._responseHandlers = /* @__PURE__ */ new Map();
    this._progressHandlers = /* @__PURE__ */ new Map();
    this._timeoutInfo = /* @__PURE__ */ new Map();
    this._pendingDebouncedNotifications = /* @__PURE__ */ new Set();
    this._taskProgressTokens = /* @__PURE__ */ new Map();
    this._requestResolvers = /* @__PURE__ */ new Map();
    this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
      this._oncancel(notification);
    });
    this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
      this._onprogress(notification);
    });
    this.setRequestHandler(
      PingRequestSchema,
      // Automatic pong by default.
      (_request) => ({})
    );
    this._taskStore = _options?.taskStore;
    this._taskMessageQueue = _options?.taskMessageQueue;
    if (this._taskStore) {
      this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
        const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        }
        return {
          ...task
        };
      });
      this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
        const handleTaskResult = async () => {
          const taskId = request.params.taskId;
          if (this._taskMessageQueue) {
            let queuedMessage;
            while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
              if (queuedMessage.type === "response" || queuedMessage.type === "error") {
                const message = queuedMessage.message;
                const requestId = message.id;
                const resolver = this._requestResolvers.get(requestId);
                if (resolver) {
                  this._requestResolvers.delete(requestId);
                  if (queuedMessage.type === "response") {
                    resolver(message);
                  } else {
                    const errorMessage = message;
                    const error2 = new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data);
                    resolver(error2);
                  }
                } else {
                  const messageType = queuedMessage.type === "response" ? "Response" : "Error";
                  this._onerror(new Error(`${messageType} handler missing for request ${requestId}`));
                }
                continue;
              }
              await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
            }
          }
          const task = await this._taskStore.getTask(taskId, extra.sessionId);
          if (!task) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
          }
          if (!isTerminal(task.status)) {
            await this._waitForTaskUpdate(taskId, extra.signal);
            return await handleTaskResult();
          }
          if (isTerminal(task.status)) {
            const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
            this._clearTaskQueue(taskId);
            return {
              ...result,
              _meta: {
                ...result._meta,
                [RELATED_TASK_META_KEY]: {
                  taskId
                }
              }
            };
          }
          return await handleTaskResult();
        };
        return await handleTaskResult();
      });
      this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
        try {
          const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
          return {
            tasks,
            nextCursor,
            _meta: {}
          };
        } catch (error2) {
          throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error2 instanceof Error ? error2.message : String(error2)}`);
        }
      });
      this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
        try {
          const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
          if (!task) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
          }
          if (isTerminal(task.status)) {
            throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
          }
          await this._taskStore.updateTaskStatus(request.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId);
          this._clearTaskQueue(request.params.taskId);
          const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
          if (!cancelledTask) {
            throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
          }
          return {
            _meta: {},
            ...cancelledTask
          };
        } catch (error2) {
          if (error2 instanceof McpError) {
            throw error2;
          }
          throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error2 instanceof Error ? error2.message : String(error2)}`);
        }
      });
    }
  }
  async _oncancel(notification) {
    if (!notification.params.requestId) {
      return;
    }
    const controller = this._requestHandlerAbortControllers.get(notification.params.requestId);
    controller?.abort(notification.params.reason);
  }
  _setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
    this._timeoutInfo.set(messageId, {
      timeoutId: setTimeout(onTimeout, timeout),
      startTime: Date.now(),
      timeout,
      maxTotalTimeout,
      resetTimeoutOnProgress,
      onTimeout
    });
  }
  _resetTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (!info)
      return false;
    const totalElapsed = Date.now() - info.startTime;
    if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
      this._timeoutInfo.delete(messageId);
      throw McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
        maxTotalTimeout: info.maxTotalTimeout,
        totalElapsed
      });
    }
    clearTimeout(info.timeoutId);
    info.timeoutId = setTimeout(info.onTimeout, info.timeout);
    return true;
  }
  _cleanupTimeout(messageId) {
    const info = this._timeoutInfo.get(messageId);
    if (info) {
      clearTimeout(info.timeoutId);
      this._timeoutInfo.delete(messageId);
    }
  }
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
   */
  async connect(transport) {
    if (this._transport) {
      throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
    }
    this._transport = transport;
    const _onclose = this.transport?.onclose;
    this._transport.onclose = () => {
      _onclose?.();
      this._onclose();
    };
    const _onerror = this.transport?.onerror;
    this._transport.onerror = (error2) => {
      _onerror?.(error2);
      this._onerror(error2);
    };
    const _onmessage = this._transport?.onmessage;
    this._transport.onmessage = (message, extra) => {
      _onmessage?.(message, extra);
      if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) {
        this._onresponse(message);
      } else if (isJSONRPCRequest(message)) {
        this._onrequest(message, extra);
      } else if (isJSONRPCNotification(message)) {
        this._onnotification(message);
      } else {
        this._onerror(new Error(`Unknown message type: ${JSON.stringify(message)}`));
      }
    };
    await this._transport.start();
  }
  _onclose() {
    const responseHandlers = this._responseHandlers;
    this._responseHandlers = /* @__PURE__ */ new Map();
    this._progressHandlers.clear();
    this._taskProgressTokens.clear();
    this._pendingDebouncedNotifications.clear();
    for (const info of this._timeoutInfo.values()) {
      clearTimeout(info.timeoutId);
    }
    this._timeoutInfo.clear();
    for (const controller of this._requestHandlerAbortControllers.values()) {
      controller.abort();
    }
    this._requestHandlerAbortControllers.clear();
    const error2 = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
    this._transport = void 0;
    this.onclose?.();
    for (const handler of responseHandlers.values()) {
      handler(error2);
    }
  }
  _onerror(error2) {
    this.onerror?.(error2);
  }
  _onnotification(notification) {
    const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
    if (handler === void 0) {
      return;
    }
    Promise.resolve().then(() => handler(notification)).catch((error2) => this._onerror(new Error(`Uncaught error in notification handler: ${error2}`)));
  }
  _onrequest(request, extra) {
    const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
    const capturedTransport = this._transport;
    const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
    if (handler === void 0) {
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: ErrorCode.MethodNotFound,
          message: "Method not found"
        }
      };
      if (relatedTaskId && this._taskMessageQueue) {
        this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId).catch((error2) => this._onerror(new Error(`Failed to enqueue error response: ${error2}`)));
      } else {
        capturedTransport?.send(errorResponse).catch((error2) => this._onerror(new Error(`Failed to send an error response: ${error2}`)));
      }
      return;
    }
    const abortController = new AbortController();
    this._requestHandlerAbortControllers.set(request.id, abortController);
    const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : void 0;
    const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : void 0;
    const fullExtra = {
      signal: abortController.signal,
      sessionId: capturedTransport?.sessionId,
      _meta: request.params?._meta,
      sendNotification: async (notification) => {
        if (abortController.signal.aborted)
          return;
        const notificationOptions = { relatedRequestId: request.id };
        if (relatedTaskId) {
          notificationOptions.relatedTask = { taskId: relatedTaskId };
        }
        await this.notification(notification, notificationOptions);
      },
      sendRequest: async (r, resultSchema, options) => {
        if (abortController.signal.aborted) {
          throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
        }
        const requestOptions = { ...options, relatedRequestId: request.id };
        if (relatedTaskId && !requestOptions.relatedTask) {
          requestOptions.relatedTask = { taskId: relatedTaskId };
        }
        const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
        if (effectiveTaskId && taskStore) {
          await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
        }
        return await this.request(r, resultSchema, requestOptions);
      },
      authInfo: extra?.authInfo,
      requestId: request.id,
      requestInfo: extra?.requestInfo,
      taskId: relatedTaskId,
      taskStore,
      taskRequestedTtl: taskCreationParams?.ttl,
      closeSSEStream: extra?.closeSSEStream,
      closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
    };
    Promise.resolve().then(() => {
      if (taskCreationParams) {
        this.assertTaskHandlerCapability(request.method);
      }
    }).then(() => handler(request, fullExtra)).then(async (result) => {
      if (abortController.signal.aborted) {
        return;
      }
      const response = {
        result,
        jsonrpc: "2.0",
        id: request.id
      };
      if (relatedTaskId && this._taskMessageQueue) {
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "response",
          message: response,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      } else {
        await capturedTransport?.send(response);
      }
    }, async (error2) => {
      if (abortController.signal.aborted) {
        return;
      }
      const errorResponse = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: Number.isSafeInteger(error2["code"]) ? error2["code"] : ErrorCode.InternalError,
          message: error2.message ?? "Internal error",
          ...error2["data"] !== void 0 && { data: error2["data"] }
        }
      };
      if (relatedTaskId && this._taskMessageQueue) {
        await this._enqueueTaskMessage(relatedTaskId, {
          type: "error",
          message: errorResponse,
          timestamp: Date.now()
        }, capturedTransport?.sessionId);
      } else {
        await capturedTransport?.send(errorResponse);
      }
    }).catch((error2) => this._onerror(new Error(`Failed to send response: ${error2}`))).finally(() => {
      if (this._requestHandlerAbortControllers.get(request.id) === abortController) {
        this._requestHandlerAbortControllers.delete(request.id);
      }
    });
  }
  _onprogress(notification) {
    const { progressToken, ...params } = notification.params;
    const messageId = Number(progressToken);
    const handler = this._progressHandlers.get(messageId);
    if (!handler) {
      this._onerror(new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
      return;
    }
    const responseHandler = this._responseHandlers.get(messageId);
    const timeoutInfo = this._timeoutInfo.get(messageId);
    if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) {
      try {
        this._resetTimeout(messageId);
      } catch (error2) {
        this._responseHandlers.delete(messageId);
        this._progressHandlers.delete(messageId);
        this._cleanupTimeout(messageId);
        responseHandler(error2);
        return;
      }
    }
    handler(params);
  }
  _onresponse(response) {
    const messageId = Number(response.id);
    const resolver = this._requestResolvers.get(messageId);
    if (resolver) {
      this._requestResolvers.delete(messageId);
      if (isJSONRPCResultResponse(response)) {
        resolver(response);
      } else {
        const error2 = new McpError(response.error.code, response.error.message, response.error.data);
        resolver(error2);
      }
      return;
    }
    const handler = this._responseHandlers.get(messageId);
    if (handler === void 0) {
      this._onerror(new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
      return;
    }
    this._responseHandlers.delete(messageId);
    this._cleanupTimeout(messageId);
    let isTaskResponse = false;
    if (isJSONRPCResultResponse(response) && response.result && typeof response.result === "object") {
      const result = response.result;
      if (result.task && typeof result.task === "object") {
        const task = result.task;
        if (typeof task.taskId === "string") {
          isTaskResponse = true;
          this._taskProgressTokens.set(task.taskId, messageId);
        }
      }
    }
    if (!isTaskResponse) {
      this._progressHandlers.delete(messageId);
    }
    if (isJSONRPCResultResponse(response)) {
      handler(response);
    } else {
      const error2 = McpError.fromError(response.error.code, response.error.message, response.error.data);
      handler(error2);
    }
  }
  get transport() {
    return this._transport;
  }
  /**
   * Closes the connection.
   */
  async close() {
    await this._transport?.close();
  }
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * @example
   * ```typescript
   * const stream = protocol.requestStream(request, resultSchema, options);
   * for await (const message of stream) {
   *   switch (message.type) {
   *     case 'taskCreated':
   *       console.log('Task created:', message.task.taskId);
   *       break;
   *     case 'taskStatus':
   *       console.log('Task status:', message.task.status);
   *       break;
   *     case 'result':
   *       console.log('Final result:', message.result);
   *       break;
   *     case 'error':
   *       console.error('Error:', message.error);
   *       break;
   *   }
   * }
   * ```
   *
   * @experimental Use `client.experimental.tasks.requestStream()` to access this method.
   */
  async *requestStream(request, resultSchema, options) {
    const { task } = options ?? {};
    if (!task) {
      try {
        const result = await this.request(request, resultSchema, options);
        yield { type: "result", result };
      } catch (error2) {
        yield {
          type: "error",
          error: error2 instanceof McpError ? error2 : new McpError(ErrorCode.InternalError, String(error2))
        };
      }
      return;
    }
    let taskId;
    try {
      const createResult = await this.request(request, CreateTaskResultSchema, options);
      if (createResult.task) {
        taskId = createResult.task.taskId;
        yield { type: "taskCreated", task: createResult.task };
      } else {
        throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
      }
      while (true) {
        const task2 = await this.getTask({ taskId }, options);
        yield { type: "taskStatus", task: task2 };
        if (isTerminal(task2.status)) {
          if (task2.status === "completed") {
            const result = await this.getTaskResult({ taskId }, resultSchema, options);
            yield { type: "result", result };
          } else if (task2.status === "failed") {
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
            };
          } else if (task2.status === "cancelled") {
            yield {
              type: "error",
              error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
            };
          }
          return;
        }
        if (task2.status === "input_required") {
          const result = await this.getTaskResult({ taskId }, resultSchema, options);
          yield { type: "result", result };
          return;
        }
        const pollInterval = task2.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        options?.signal?.throwIfAborted();
      }
    } catch (error2) {
      yield {
        type: "error",
        error: error2 instanceof McpError ? error2 : new McpError(ErrorCode.InternalError, String(error2))
      };
    }
  }
  /**
   * Sends a request and waits for a response.
   *
   * Do not use this method to emit notifications! Use notification() instead.
   */
  request(request, resultSchema, options) {
    const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
    return new Promise((resolve, reject) => {
      const earlyReject = (error2) => {
        reject(error2);
      };
      if (!this._transport) {
        earlyReject(new Error("Not connected"));
        return;
      }
      if (this._options?.enforceStrictCapabilities === true) {
        try {
          this.assertCapabilityForMethod(request.method);
          if (task) {
            this.assertTaskCapability(request.method);
          }
        } catch (e) {
          earlyReject(e);
          return;
        }
      }
      options?.signal?.throwIfAborted();
      const messageId = this._requestMessageId++;
      const jsonrpcRequest = {
        ...request,
        jsonrpc: "2.0",
        id: messageId
      };
      if (options?.onprogress) {
        this._progressHandlers.set(messageId, options.onprogress);
        jsonrpcRequest.params = {
          ...request.params,
          _meta: {
            ...request.params?._meta || {},
            progressToken: messageId
          }
        };
      }
      if (task) {
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          task
        };
      }
      if (relatedTask) {
        jsonrpcRequest.params = {
          ...jsonrpcRequest.params,
          _meta: {
            ...jsonrpcRequest.params?._meta || {},
            [RELATED_TASK_META_KEY]: relatedTask
          }
        };
      }
      const cancel = (reason) => {
        this._responseHandlers.delete(messageId);
        this._progressHandlers.delete(messageId);
        this._cleanupTimeout(messageId);
        this._transport?.send({
          jsonrpc: "2.0",
          method: "notifications/cancelled",
          params: {
            requestId: messageId,
            reason: String(reason)
          }
        }, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error3) => this._onerror(new Error(`Failed to send cancellation: ${error3}`)));
        const error2 = reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason));
        reject(error2);
      };
      this._responseHandlers.set(messageId, (response) => {
        if (options?.signal?.aborted) {
          return;
        }
        if (response instanceof Error) {
          return reject(response);
        }
        try {
          const parseResult = safeParse2(resultSchema, response.result);
          if (!parseResult.success) {
            reject(parseResult.error);
          } else {
            resolve(parseResult.data);
          }
        } catch (error2) {
          reject(error2);
        }
      });
      options?.signal?.addEventListener("abort", () => {
        cancel(options?.signal?.reason);
      });
      const timeout = options?.timeout ?? DEFAULT_REQUEST_TIMEOUT_MSEC;
      const timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout }));
      this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
      const relatedTaskId = relatedTask?.taskId;
      if (relatedTaskId) {
        const responseResolver = (response) => {
          const handler = this._responseHandlers.get(messageId);
          if (handler) {
            handler(response);
          } else {
            this._onerror(new Error(`Response handler missing for side-channeled request ${messageId}`));
          }
        };
        this._requestResolvers.set(messageId, responseResolver);
        this._enqueueTaskMessage(relatedTaskId, {
          type: "request",
          message: jsonrpcRequest,
          timestamp: Date.now()
        }).catch((error2) => {
          this._cleanupTimeout(messageId);
          reject(error2);
        });
      } else {
        this._transport.send(jsonrpcRequest, { relatedRequestId, resumptionToken, onresumptiontoken }).catch((error2) => {
          this._cleanupTimeout(messageId);
          reject(error2);
        });
      }
    });
  }
  /**
   * Gets the current status of a task.
   *
   * @experimental Use `client.experimental.tasks.getTask()` to access this method.
   */
  async getTask(params, options) {
    return this.request({ method: "tasks/get", params }, GetTaskResultSchema, options);
  }
  /**
   * Retrieves the result of a completed task.
   *
   * @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
   */
  async getTaskResult(params, resultSchema, options) {
    return this.request({ method: "tasks/result", params }, resultSchema, options);
  }
  /**
   * Lists tasks, optionally starting from a pagination cursor.
   *
   * @experimental Use `client.experimental.tasks.listTasks()` to access this method.
   */
  async listTasks(params, options) {
    return this.request({ method: "tasks/list", params }, ListTasksResultSchema, options);
  }
  /**
   * Cancels a specific task.
   *
   * @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
   */
  async cancelTask(params, options) {
    return this.request({ method: "tasks/cancel", params }, CancelTaskResultSchema, options);
  }
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  async notification(notification, options) {
    if (!this._transport) {
      throw new Error("Not connected");
    }
    this.assertNotificationCapability(notification.method);
    const relatedTaskId = options?.relatedTask?.taskId;
    if (relatedTaskId) {
      const jsonrpcNotification2 = {
        ...notification,
        jsonrpc: "2.0",
        params: {
          ...notification.params,
          _meta: {
            ...notification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options.relatedTask
          }
        }
      };
      await this._enqueueTaskMessage(relatedTaskId, {
        type: "notification",
        message: jsonrpcNotification2,
        timestamp: Date.now()
      });
      return;
    }
    const debouncedMethods = this._options?.debouncedNotificationMethods ?? [];
    const canDebounce = debouncedMethods.includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask;
    if (canDebounce) {
      if (this._pendingDebouncedNotifications.has(notification.method)) {
        return;
      }
      this._pendingDebouncedNotifications.add(notification.method);
      Promise.resolve().then(() => {
        this._pendingDebouncedNotifications.delete(notification.method);
        if (!this._transport) {
          return;
        }
        let jsonrpcNotification2 = {
          ...notification,
          jsonrpc: "2.0"
        };
        if (options?.relatedTask) {
          jsonrpcNotification2 = {
            ...jsonrpcNotification2,
            params: {
              ...jsonrpcNotification2.params,
              _meta: {
                ...jsonrpcNotification2.params?._meta || {},
                [RELATED_TASK_META_KEY]: options.relatedTask
              }
            }
          };
        }
        this._transport?.send(jsonrpcNotification2, options).catch((error2) => this._onerror(error2));
      });
      return;
    }
    let jsonrpcNotification = {
      ...notification,
      jsonrpc: "2.0"
    };
    if (options?.relatedTask) {
      jsonrpcNotification = {
        ...jsonrpcNotification,
        params: {
          ...jsonrpcNotification.params,
          _meta: {
            ...jsonrpcNotification.params?._meta || {},
            [RELATED_TASK_META_KEY]: options.relatedTask
          }
        }
      };
    }
    await this._transport.send(jsonrpcNotification, options);
  }
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler(requestSchema, handler) {
    const method = getMethodLiteral(requestSchema);
    this.assertRequestHandlerCapability(method);
    this._requestHandlers.set(method, (request, extra) => {
      const parsed = parseWithCompat(requestSchema, request);
      return Promise.resolve(handler(parsed, extra));
    });
  }
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(method) {
    this._requestHandlers.delete(method);
  }
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(method) {
    if (this._requestHandlers.has(method)) {
      throw new Error(`A request handler for ${method} already exists, which would be overridden`);
    }
  }
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler(notificationSchema, handler) {
    const method = getMethodLiteral(notificationSchema);
    this._notificationHandlers.set(method, (notification) => {
      const parsed = parseWithCompat(notificationSchema, notification);
      return Promise.resolve(handler(parsed));
    });
  }
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(method) {
    this._notificationHandlers.delete(method);
  }
  /**
   * Cleans up the progress handler associated with a task.
   * This should be called when a task reaches a terminal status.
   */
  _cleanupTaskProgressHandler(taskId) {
    const progressToken = this._taskProgressTokens.get(taskId);
    if (progressToken !== void 0) {
      this._progressHandlers.delete(progressToken);
      this._taskProgressTokens.delete(taskId);
    }
  }
  /**
   * Enqueues a task-related message for side-channel delivery via tasks/result.
   * @param taskId The task ID to associate the message with
   * @param message The message to enqueue
   * @param sessionId Optional session ID for binding the operation to a specific session
   * @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
   *
   * Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
   * the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
   * simply propagates the error.
   */
  async _enqueueTaskMessage(taskId, message, sessionId) {
    if (!this._taskStore || !this._taskMessageQueue) {
      throw new Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
    }
    const maxQueueSize = this._options?.maxTaskQueueSize;
    await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
  }
  /**
   * Clears the message queue for a task and rejects any pending request resolvers.
   * @param taskId The task ID whose queue should be cleared
   * @param sessionId Optional session ID for binding the operation to a specific session
   */
  async _clearTaskQueue(taskId, sessionId) {
    if (this._taskMessageQueue) {
      const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
      for (const message of messages) {
        if (message.type === "request" && isJSONRPCRequest(message.message)) {
          const requestId = message.message.id;
          const resolver = this._requestResolvers.get(requestId);
          if (resolver) {
            resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed"));
            this._requestResolvers.delete(requestId);
          } else {
            this._onerror(new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
          }
        }
      }
    }
  }
  /**
   * Waits for a task update (new messages or status change) with abort signal support.
   * Uses polling to check for updates at the task's configured poll interval.
   * @param taskId The task ID to wait for
   * @param signal Abort signal to cancel the wait
   * @returns Promise that resolves when an update occurs or rejects if aborted
   */
  async _waitForTaskUpdate(taskId, signal) {
    let interval = this._options?.defaultTaskPollInterval ?? 1e3;
    try {
      const task = await this._taskStore?.getTask(taskId);
      if (task?.pollInterval) {
        interval = task.pollInterval;
      }
    } catch {
    }
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
        return;
      }
      const timeoutId = setTimeout(resolve, interval);
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
      }, { once: true });
    });
  }
  requestTaskStore(request, sessionId) {
    const taskStore = this._taskStore;
    if (!taskStore) {
      throw new Error("No task store configured");
    }
    return {
      createTask: async (taskParams) => {
        if (!request) {
          throw new Error("No request provided");
        }
        return await taskStore.createTask(taskParams, request.id, {
          method: request.method,
          params: request.params
        }, sessionId);
      },
      getTask: async (taskId) => {
        const task = await taskStore.getTask(taskId, sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
        }
        return task;
      },
      storeTaskResult: async (taskId, status, result) => {
        await taskStore.storeTaskResult(taskId, status, result, sessionId);
        const task = await taskStore.getTask(taskId, sessionId);
        if (task) {
          const notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: task
          });
          await this.notification(notification);
          if (isTerminal(task.status)) {
            this._cleanupTaskProgressHandler(taskId);
          }
        }
      },
      getTaskResult: (taskId) => {
        return taskStore.getTaskResult(taskId, sessionId);
      },
      updateTaskStatus: async (taskId, status, statusMessage) => {
        const task = await taskStore.getTask(taskId, sessionId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
        }
        if (isTerminal(task.status)) {
          throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
        }
        await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
        const updatedTask = await taskStore.getTask(taskId, sessionId);
        if (updatedTask) {
          const notification = TaskStatusNotificationSchema.parse({
            method: "notifications/tasks/status",
            params: updatedTask
          });
          await this.notification(notification);
          if (isTerminal(updatedTask.status)) {
            this._cleanupTaskProgressHandler(taskId);
          }
        }
      },
      listTasks: (cursor) => {
        return taskStore.listTasks(cursor, sessionId);
      }
    };
  }
};
function isPlainObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeCapabilities(base, additional) {
  const result = { ...base };
  for (const key in additional) {
    const k = key;
    const addValue = additional[k];
    if (addValue === void 0)
      continue;
    const baseValue = result[k];
    if (isPlainObject2(baseValue) && isPlainObject2(addValue)) {
      result[k] = { ...baseValue, ...addValue };
    } else {
      result[k] = addValue;
    }
  }
  return result;
}

// node_modules/@modelcontextprotocol/sdk/dist/esm/validation/ajv-provider.js
var import_ajv = __toESM(require_ajv(), 1);
var import_ajv_formats = __toESM(require_dist(), 1);
function createDefaultAjvInstance() {
  const ajv = new import_ajv.default({
    strict: false,
    validateFormats: true,
    validateSchema: false,
    allErrors: true
  });
  const addFormats = import_ajv_formats.default;
  addFormats(ajv);
  return ajv;
}
var AjvJsonSchemaValidator = class {
  /**
   * Create an AJV validator
   *
   * @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
   *
   * @example
   * ```typescript
   * // Use default configuration (recommended for most cases)
   * import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
   * const validator = new AjvJsonSchemaValidator();
   *
   * // Or provide custom AJV instance for advanced configuration
   * import { Ajv } from 'ajv';
   * import addFormats from 'ajv-formats';
   *
   * const ajv = new Ajv({ validateFormats: true });
   * addFormats(ajv);
   * const validator = new AjvJsonSchemaValidator(ajv);
   * ```
   */
  constructor(ajv) {
    this._ajv = ajv ?? createDefaultAjvInstance();
  }
  /**
   * Create a validator for the given JSON Schema
   *
   * The validator is compiled once and can be reused multiple times.
   * If the schema has an $id, it will be cached by AJV automatically.
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator(schema) {
    const ajvValidator = "$id" in schema && typeof schema.$id === "string" ? this._ajv.getSchema(schema.$id) ?? this._ajv.compile(schema) : this._ajv.compile(schema);
    return (input) => {
      const valid = ajvValidator(input);
      if (valid) {
        return {
          valid: true,
          data: input,
          errorMessage: void 0
        };
      } else {
        return {
          valid: false,
          data: void 0,
          errorMessage: this._ajv.errorsText(ajvValidator.errors)
        };
      }
    };
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/server.js
var ExperimentalServerTasks = class {
  constructor(_server) {
    this._server = _server;
  }
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * This method provides streaming access to request processing, allowing you to
   * observe intermediate task status updates for task-augmented requests.
   *
   * @param request - The request to send
   * @param resultSchema - Zod schema for validating the result
   * @param options - Optional request options (timeout, signal, task creation params, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  requestStream(request, resultSchema, options) {
    return this._server.requestStream(request, resultSchema, options);
  }
  /**
   * Sends a sampling request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * For task-augmented requests, yields 'taskCreated' and 'taskStatus' messages
   * before the final result.
   *
   * @example
   * ```typescript
   * const stream = server.experimental.tasks.createMessageStream({
   *     messages: [{ role: 'user', content: { type: 'text', text: 'Hello' } }],
   *     maxTokens: 100
   * }, {
   *     onprogress: (progress) => {
   *         // Handle streaming tokens via progress notifications
   *         console.log('Progress:', progress.message);
   *     }
   * });
   *
   * for await (const message of stream) {
   *     switch (message.type) {
   *         case 'taskCreated':
   *             console.log('Task created:', message.task.taskId);
   *             break;
   *         case 'taskStatus':
   *             console.log('Task status:', message.task.status);
   *             break;
   *         case 'result':
   *             console.log('Final result:', message.result);
   *             break;
   *         case 'error':
   *             console.error('Error:', message.error);
   *             break;
   *     }
   * }
   * ```
   *
   * @param params - The sampling request parameters
   * @param options - Optional request options (timeout, signal, task creation params, onprogress, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  createMessageStream(params, options) {
    const clientCapabilities = this._server.getClientCapabilities();
    if ((params.tools || params.toolChoice) && !clientCapabilities?.sampling?.tools) {
      throw new Error("Client does not support sampling tools capability.");
    }
    if (params.messages.length > 0) {
      const lastMessage = params.messages[params.messages.length - 1];
      const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
      const hasToolResults = lastContent.some((c) => c.type === "tool_result");
      const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
      const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
      const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some((c) => c.type !== "tool_result")) {
          throw new Error("The last message must contain only tool_result content if any is present");
        }
        if (!hasPreviousToolUse) {
          throw new Error("tool_result blocks are not matching any tool_use from the previous message");
        }
      }
      if (hasPreviousToolUse) {
        const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
        const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) {
          throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
        }
      }
    }
    return this.requestStream({
      method: "sampling/createMessage",
      params
    }, CreateMessageResultSchema, options);
  }
  /**
   * Sends an elicitation request and returns an AsyncGenerator that yields response messages.
   * The generator is guaranteed to end with either a 'result' or 'error' message.
   *
   * For task-augmented requests (especially URL-based elicitation), yields 'taskCreated'
   * and 'taskStatus' messages before the final result.
   *
   * @example
   * ```typescript
   * const stream = server.experimental.tasks.elicitInputStream({
   *     mode: 'url',
   *     message: 'Please authenticate',
   *     elicitationId: 'auth-123',
   *     url: 'https://example.com/auth'
   * }, {
   *     task: { ttl: 300000 } // Task-augmented for long-running auth flow
   * });
   *
   * for await (const message of stream) {
   *     switch (message.type) {
   *         case 'taskCreated':
   *             console.log('Task created:', message.task.taskId);
   *             break;
   *         case 'taskStatus':
   *             console.log('Task status:', message.task.status);
   *             break;
   *         case 'result':
   *             console.log('User action:', message.result.action);
   *             break;
   *         case 'error':
   *             console.error('Error:', message.error);
   *             break;
   *     }
   * }
   * ```
   *
   * @param params - The elicitation request parameters
   * @param options - Optional request options (timeout, signal, task creation params, etc.)
   * @returns AsyncGenerator that yields ResponseMessage objects
   *
   * @experimental
   */
  elicitInputStream(params, options) {
    const clientCapabilities = this._server.getClientCapabilities();
    const mode = params.mode ?? "form";
    switch (mode) {
      case "url": {
        if (!clientCapabilities?.elicitation?.url) {
          throw new Error("Client does not support url elicitation.");
        }
        break;
      }
      case "form": {
        if (!clientCapabilities?.elicitation?.form) {
          throw new Error("Client does not support form elicitation.");
        }
        break;
      }
    }
    const normalizedParams = mode === "form" && params.mode === void 0 ? { ...params, mode: "form" } : params;
    return this.requestStream({
      method: "elicitation/create",
      params: normalizedParams
    }, ElicitResultSchema, options);
  }
  /**
   * Gets the current status of a task.
   *
   * @param taskId - The task identifier
   * @param options - Optional request options
   * @returns The task status
   *
   * @experimental
   */
  async getTask(taskId, options) {
    return this._server.getTask({ taskId }, options);
  }
  /**
   * Retrieves the result of a completed task.
   *
   * @param taskId - The task identifier
   * @param resultSchema - Zod schema for validating the result
   * @param options - Optional request options
   * @returns The task result
   *
   * @experimental
   */
  async getTaskResult(taskId, resultSchema, options) {
    return this._server.getTaskResult({ taskId }, resultSchema, options);
  }
  /**
   * Lists tasks with optional pagination.
   *
   * @param cursor - Optional pagination cursor
   * @param options - Optional request options
   * @returns List of tasks with optional next cursor
   *
   * @experimental
   */
  async listTasks(cursor, options) {
    return this._server.listTasks(cursor ? { cursor } : void 0, options);
  }
  /**
   * Cancels a running task.
   *
   * @param taskId - The task identifier
   * @param options - Optional request options
   *
   * @experimental
   */
  async cancelTask(taskId, options) {
    return this._server.cancelTask({ taskId }, options);
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/helpers.js
function assertToolsCallTaskCapability(requests, method, entityName) {
  if (!requests) {
    throw new Error(`${entityName} does not support task creation (required for ${method})`);
  }
  switch (method) {
    case "tools/call":
      if (!requests.tools?.call) {
        throw new Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
      }
      break;
    default:
      break;
  }
}
function assertClientRequestTaskCapability(requests, method, entityName) {
  if (!requests) {
    throw new Error(`${entityName} does not support task creation (required for ${method})`);
  }
  switch (method) {
    case "sampling/createMessage":
      if (!requests.sampling?.createMessage) {
        throw new Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
      }
      break;
    case "elicitation/create":
      if (!requests.elicitation?.create) {
        throw new Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
      }
      break;
    default:
      break;
  }
}

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js
var Server = class extends Protocol {
  /**
   * Initializes this server with the given name and version information.
   */
  constructor(_serverInfo, options) {
    super(options);
    this._serverInfo = _serverInfo;
    this._loggingLevels = /* @__PURE__ */ new Map();
    this.LOG_LEVEL_SEVERITY = new Map(LoggingLevelSchema.options.map((level, index) => [level, index]));
    this.isMessageIgnored = (level, sessionId) => {
      const currentLevel = this._loggingLevels.get(sessionId);
      return currentLevel ? this.LOG_LEVEL_SEVERITY.get(level) < this.LOG_LEVEL_SEVERITY.get(currentLevel) : false;
    };
    this._capabilities = options?.capabilities ?? {};
    this._instructions = options?.instructions;
    this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
    this.setRequestHandler(InitializeRequestSchema, (request) => this._oninitialize(request));
    this.setNotificationHandler(InitializedNotificationSchema, () => this.oninitialized?.());
    if (this._capabilities.logging) {
      this.setRequestHandler(SetLevelRequestSchema, async (request, extra) => {
        const transportSessionId = extra.sessionId || extra.requestInfo?.headers["mcp-session-id"] || void 0;
        const { level } = request.params;
        const parseResult = LoggingLevelSchema.safeParse(level);
        if (parseResult.success) {
          this._loggingLevels.set(transportSessionId, parseResult.data);
        }
        return {};
      });
    }
  }
  /**
   * Access experimental features.
   *
   * WARNING: These APIs are experimental and may change without notice.
   *
   * @experimental
   */
  get experimental() {
    if (!this._experimental) {
      this._experimental = {
        tasks: new ExperimentalServerTasks(this)
      };
    }
    return this._experimental;
  }
  /**
   * Registers new capabilities. This can only be called before connecting to a transport.
   *
   * The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
   */
  registerCapabilities(capabilities) {
    if (this.transport) {
      throw new Error("Cannot register capabilities after connecting to transport");
    }
    this._capabilities = mergeCapabilities(this._capabilities, capabilities);
  }
  /**
   * Override request handler registration to enforce server-side validation for tools/call.
   */
  setRequestHandler(requestSchema, handler) {
    const shape = getObjectShape(requestSchema);
    const methodSchema = shape?.method;
    if (!methodSchema) {
      throw new Error("Schema is missing a method literal");
    }
    let methodValue;
    if (isZ4Schema(methodSchema)) {
      const v4Schema = methodSchema;
      const v4Def = v4Schema._zod?.def;
      methodValue = v4Def?.value ?? v4Schema.value;
    } else {
      const v3Schema = methodSchema;
      const legacyDef = v3Schema._def;
      methodValue = legacyDef?.value ?? v3Schema.value;
    }
    if (typeof methodValue !== "string") {
      throw new Error("Schema method literal must be a string");
    }
    const method = methodValue;
    if (method === "tools/call") {
      const wrappedHandler = async (request, extra) => {
        const validatedRequest = safeParse2(CallToolRequestSchema, request);
        if (!validatedRequest.success) {
          const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
          throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call request: ${errorMessage}`);
        }
        const { params } = validatedRequest.data;
        const result = await Promise.resolve(handler(request, extra));
        if (params.task) {
          const taskValidationResult = safeParse2(CreateTaskResultSchema, result);
          if (!taskValidationResult.success) {
            const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
            throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
          }
          return taskValidationResult.data;
        }
        const validationResult = safeParse2(CallToolResultSchema, result);
        if (!validationResult.success) {
          const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
          throw new McpError(ErrorCode.InvalidParams, `Invalid tools/call result: ${errorMessage}`);
        }
        return validationResult.data;
      };
      return super.setRequestHandler(requestSchema, wrappedHandler);
    }
    return super.setRequestHandler(requestSchema, handler);
  }
  assertCapabilityForMethod(method) {
    switch (method) {
      case "sampling/createMessage":
        if (!this._clientCapabilities?.sampling) {
          throw new Error(`Client does not support sampling (required for ${method})`);
        }
        break;
      case "elicitation/create":
        if (!this._clientCapabilities?.elicitation) {
          throw new Error(`Client does not support elicitation (required for ${method})`);
        }
        break;
      case "roots/list":
        if (!this._clientCapabilities?.roots) {
          throw new Error(`Client does not support listing roots (required for ${method})`);
        }
        break;
      case "ping":
        break;
    }
  }
  assertNotificationCapability(method) {
    switch (method) {
      case "notifications/message":
        if (!this._capabilities.logging) {
          throw new Error(`Server does not support logging (required for ${method})`);
        }
        break;
      case "notifications/resources/updated":
      case "notifications/resources/list_changed":
        if (!this._capabilities.resources) {
          throw new Error(`Server does not support notifying about resources (required for ${method})`);
        }
        break;
      case "notifications/tools/list_changed":
        if (!this._capabilities.tools) {
          throw new Error(`Server does not support notifying of tool list changes (required for ${method})`);
        }
        break;
      case "notifications/prompts/list_changed":
        if (!this._capabilities.prompts) {
          throw new Error(`Server does not support notifying of prompt list changes (required for ${method})`);
        }
        break;
      case "notifications/elicitation/complete":
        if (!this._clientCapabilities?.elicitation?.url) {
          throw new Error(`Client does not support URL elicitation (required for ${method})`);
        }
        break;
      case "notifications/cancelled":
        break;
      case "notifications/progress":
        break;
    }
  }
  assertRequestHandlerCapability(method) {
    if (!this._capabilities) {
      return;
    }
    switch (method) {
      case "completion/complete":
        if (!this._capabilities.completions) {
          throw new Error(`Server does not support completions (required for ${method})`);
        }
        break;
      case "logging/setLevel":
        if (!this._capabilities.logging) {
          throw new Error(`Server does not support logging (required for ${method})`);
        }
        break;
      case "prompts/get":
      case "prompts/list":
        if (!this._capabilities.prompts) {
          throw new Error(`Server does not support prompts (required for ${method})`);
        }
        break;
      case "resources/list":
      case "resources/templates/list":
      case "resources/read":
        if (!this._capabilities.resources) {
          throw new Error(`Server does not support resources (required for ${method})`);
        }
        break;
      case "tools/call":
      case "tools/list":
        if (!this._capabilities.tools) {
          throw new Error(`Server does not support tools (required for ${method})`);
        }
        break;
      case "tasks/get":
      case "tasks/list":
      case "tasks/result":
      case "tasks/cancel":
        if (!this._capabilities.tasks) {
          throw new Error(`Server does not support tasks capability (required for ${method})`);
        }
        break;
      case "ping":
      case "initialize":
        break;
    }
  }
  assertTaskCapability(method) {
    assertClientRequestTaskCapability(this._clientCapabilities?.tasks?.requests, method, "Client");
  }
  assertTaskHandlerCapability(method) {
    if (!this._capabilities) {
      return;
    }
    assertToolsCallTaskCapability(this._capabilities.tasks?.requests, method, "Server");
  }
  async _oninitialize(request) {
    const requestedVersion = request.params.protocolVersion;
    this._clientCapabilities = request.params.capabilities;
    this._clientVersion = request.params.clientInfo;
    const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requestedVersion) ? requestedVersion : LATEST_PROTOCOL_VERSION;
    return {
      protocolVersion,
      capabilities: this.getCapabilities(),
      serverInfo: this._serverInfo,
      ...this._instructions && { instructions: this._instructions }
    };
  }
  /**
   * After initialization has completed, this will be populated with the client's reported capabilities.
   */
  getClientCapabilities() {
    return this._clientCapabilities;
  }
  /**
   * After initialization has completed, this will be populated with information about the client's name and version.
   */
  getClientVersion() {
    return this._clientVersion;
  }
  getCapabilities() {
    return this._capabilities;
  }
  async ping() {
    return this.request({ method: "ping" }, EmptyResultSchema);
  }
  // Implementation
  async createMessage(params, options) {
    if (params.tools || params.toolChoice) {
      if (!this._clientCapabilities?.sampling?.tools) {
        throw new Error("Client does not support sampling tools capability.");
      }
    }
    if (params.messages.length > 0) {
      const lastMessage = params.messages[params.messages.length - 1];
      const lastContent = Array.isArray(lastMessage.content) ? lastMessage.content : [lastMessage.content];
      const hasToolResults = lastContent.some((c) => c.type === "tool_result");
      const previousMessage = params.messages.length > 1 ? params.messages[params.messages.length - 2] : void 0;
      const previousContent = previousMessage ? Array.isArray(previousMessage.content) ? previousMessage.content : [previousMessage.content] : [];
      const hasPreviousToolUse = previousContent.some((c) => c.type === "tool_use");
      if (hasToolResults) {
        if (lastContent.some((c) => c.type !== "tool_result")) {
          throw new Error("The last message must contain only tool_result content if any is present");
        }
        if (!hasPreviousToolUse) {
          throw new Error("tool_result blocks are not matching any tool_use from the previous message");
        }
      }
      if (hasPreviousToolUse) {
        const toolUseIds = new Set(previousContent.filter((c) => c.type === "tool_use").map((c) => c.id));
        const toolResultIds = new Set(lastContent.filter((c) => c.type === "tool_result").map((c) => c.toolUseId));
        if (toolUseIds.size !== toolResultIds.size || ![...toolUseIds].every((id) => toolResultIds.has(id))) {
          throw new Error("ids of tool_result blocks and tool_use blocks from previous message do not match");
        }
      }
    }
    if (params.tools) {
      return this.request({ method: "sampling/createMessage", params }, CreateMessageResultWithToolsSchema, options);
    }
    return this.request({ method: "sampling/createMessage", params }, CreateMessageResultSchema, options);
  }
  /**
   * Creates an elicitation request for the given parameters.
   * For backwards compatibility, `mode` may be omitted for form requests and will default to `'form'`.
   * @param params The parameters for the elicitation request.
   * @param options Optional request options.
   * @returns The result of the elicitation request.
   */
  async elicitInput(params, options) {
    const mode = params.mode ?? "form";
    switch (mode) {
      case "url": {
        if (!this._clientCapabilities?.elicitation?.url) {
          throw new Error("Client does not support url elicitation.");
        }
        const urlParams = params;
        return this.request({ method: "elicitation/create", params: urlParams }, ElicitResultSchema, options);
      }
      case "form": {
        if (!this._clientCapabilities?.elicitation?.form) {
          throw new Error("Client does not support form elicitation.");
        }
        const formParams = params.mode === "form" ? params : { ...params, mode: "form" };
        const result = await this.request({ method: "elicitation/create", params: formParams }, ElicitResultSchema, options);
        if (result.action === "accept" && result.content && formParams.requestedSchema) {
          try {
            const validator = this._jsonSchemaValidator.getValidator(formParams.requestedSchema);
            const validationResult = validator(result.content);
            if (!validationResult.valid) {
              throw new McpError(ErrorCode.InvalidParams, `Elicitation response content does not match requested schema: ${validationResult.errorMessage}`);
            }
          } catch (error2) {
            if (error2 instanceof McpError) {
              throw error2;
            }
            throw new McpError(ErrorCode.InternalError, `Error validating elicitation response: ${error2 instanceof Error ? error2.message : String(error2)}`);
          }
        }
        return result;
      }
    }
  }
  /**
   * Creates a reusable callback that, when invoked, will send a `notifications/elicitation/complete`
   * notification for the specified elicitation ID.
   *
   * @param elicitationId The ID of the elicitation to mark as complete.
   * @param options Optional notification options. Useful when the completion notification should be related to a prior request.
   * @returns A function that emits the completion notification when awaited.
   */
  createElicitationCompletionNotifier(elicitationId, options) {
    if (!this._clientCapabilities?.elicitation?.url) {
      throw new Error("Client does not support URL elicitation (required for notifications/elicitation/complete)");
    }
    return () => this.notification({
      method: "notifications/elicitation/complete",
      params: {
        elicitationId
      }
    }, options);
  }
  async listRoots(params, options) {
    return this.request({ method: "roots/list", params }, ListRootsResultSchema, options);
  }
  /**
   * Sends a logging message to the client, if connected.
   * Note: You only need to send the parameters object, not the entire JSON RPC message
   * @see LoggingMessageNotification
   * @param params
   * @param sessionId optional for stateless and backward compatibility
   */
  async sendLoggingMessage(params, sessionId) {
    if (this._capabilities.logging) {
      if (!this.isMessageIgnored(params.level, sessionId)) {
        return this.notification({ method: "notifications/message", params });
      }
    }
  }
  async sendResourceUpdated(params) {
    return this.notification({
      method: "notifications/resources/updated",
      params
    });
  }
  async sendResourceListChanged() {
    return this.notification({
      method: "notifications/resources/list_changed"
    });
  }
  async sendToolListChanged() {
    return this.notification({ method: "notifications/tools/list_changed" });
  }
  async sendPromptListChanged() {
    return this.notification({ method: "notifications/prompts/list_changed" });
  }
};

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js
var import_node_process = __toESM(require("node:process"), 1);

// node_modules/@modelcontextprotocol/sdk/dist/esm/shared/stdio.js
var ReadBuffer = class {
  append(chunk) {
    this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
  }
  readMessage() {
    if (!this._buffer) {
      return null;
    }
    const index = this._buffer.indexOf("\n");
    if (index === -1) {
      return null;
    }
    const line = this._buffer.toString("utf8", 0, index).replace(/\r$/, "");
    this._buffer = this._buffer.subarray(index + 1);
    return deserializeMessage(line);
  }
  clear() {
    this._buffer = void 0;
  }
};
function deserializeMessage(line) {
  return JSONRPCMessageSchema.parse(JSON.parse(line));
}
function serializeMessage(message) {
  return JSON.stringify(message) + "\n";
}

// node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js
var StdioServerTransport = class {
  constructor(_stdin = import_node_process.default.stdin, _stdout = import_node_process.default.stdout) {
    this._stdin = _stdin;
    this._stdout = _stdout;
    this._readBuffer = new ReadBuffer();
    this._started = false;
    this._ondata = (chunk) => {
      this._readBuffer.append(chunk);
      this.processReadBuffer();
    };
    this._onerror = (error2) => {
      this.onerror?.(error2);
    };
  }
  /**
   * Starts listening for messages on stdin.
   */
  async start() {
    if (this._started) {
      throw new Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
    }
    this._started = true;
    this._stdin.on("data", this._ondata);
    this._stdin.on("error", this._onerror);
  }
  processReadBuffer() {
    while (true) {
      try {
        const message = this._readBuffer.readMessage();
        if (message === null) {
          break;
        }
        this.onmessage?.(message);
      } catch (error2) {
        this.onerror?.(error2);
      }
    }
  }
  async close() {
    this._stdin.off("data", this._ondata);
    this._stdin.off("error", this._onerror);
    const remainingDataListeners = this._stdin.listenerCount("data");
    if (remainingDataListeners === 0) {
      this._stdin.pause();
    }
    this._readBuffer.clear();
    this.onclose?.();
  }
  send(message) {
    return new Promise((resolve) => {
      const json = serializeMessage(message);
      if (this._stdout.write(json)) {
        resolve();
      } else {
        this._stdout.once("drain", resolve);
      }
    });
  }
};

// dist/index.js
var import_evernote = __toESM(require_lib(), 1);
var authToken = process.env.YINXIANG_AUTH_TOKEN;
if (!authToken) {
  console.error("YINXIANG_AUTH_TOKEN \u672A\u8BBE\u7F6E");
  process.exit(1);
}
var sandbox = process.env.YINXIANG_SANDBOX === "true";
var client = new import_evernote.default.Client({
  token: authToken,
  sandbox,
  china: true
});
var noteStore = client.getNoteStore();
var userStore = client.getUserStore();
var server = new Server({
  name: "yinxiang-mcp-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_notebooks",
        description: "\u5217\u51FA\u6240\u6709\u7B14\u8BB0\u672C",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_default_notebook",
        description: "\u83B7\u53D6\u9ED8\u8BA4\u7B14\u8BB0\u672C",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "list_tags",
        description: "\u5217\u51FA\u6240\u6709\u6807\u7B7E",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "create_note",
        description: "\u521B\u5EFA\u65B0\u7B14\u8BB0",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "\u7B14\u8BB0\u6807\u9898" },
            content: { type: "string", description: "\u7B14\u8BB0\u5185\u5BB9\uFF08\u652F\u6301HTML\u683C\u5F0F\uFF09" },
            notebookGuid: {
              type: "string",
              description: "\u76EE\u6807\u7B14\u8BB0\u672CGUID\uFF08\u53EF\u9009\uFF0C\u4E0D\u4F20\u5219\u4FDD\u5B58\u5230\u9ED8\u8BA4\u7B14\u8BB0\u672C\uFF09"
            },
            tagNames: {
              type: "array",
              items: { type: "string" },
              description: "\u6807\u7B7E\u540D\u79F0\u5217\u8868\uFF08\u53EF\u9009\uFF09"
            }
          },
          required: ["title", "content"]
        }
      },
      {
        name: "search_notes",
        description: "\u641C\u7D22\u7B14\u8BB0",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "\u641C\u7D22\u5173\u952E\u8BCD" },
            maxResults: {
              type: "number",
              description: "\u6700\u5927\u8FD4\u56DE\u6570\u91CF\uFF08\u9ED8\u8BA420\uFF09"
            }
          },
          required: ["query"]
        }
      },
      {
        name: "get_note",
        description: "\u83B7\u53D6\u7B14\u8BB0\u8BE6\u60C5",
        inputSchema: {
          type: "object",
          properties: {
            guid: { type: "string", description: "\u7B14\u8BB0GUID" }
          },
          required: ["guid"]
        }
      },
      {
        name: "update_note",
        description: "\u66F4\u65B0\u7B14\u8BB0",
        inputSchema: {
          type: "object",
          properties: {
            guid: { type: "string", description: "\u7B14\u8BB0GUID" },
            title: { type: "string", description: "\u65B0\u6807\u9898\uFF08\u53EF\u9009\uFF09" },
            content: { type: "string", description: "\u65B0\u5185\u5BB9\uFF08\u53EF\u9009\uFF0C\u652F\u6301HTML\u683C\u5F0F\uFF09" }
          },
          required: ["guid"]
        }
      },
      {
        name: "delete_note",
        description: "\u5220\u9664\u7B14\u8BB0\uFF08\u79FB\u5230\u56DE\u6536\u7AD9\uFF09",
        inputSchema: {
          type: "object",
          properties: {
            guid: { type: "string", description: "\u7B14\u8BB0GUID" }
          },
          required: ["guid"]
        }
      },
      {
        name: "create_notebook",
        description: "\u521B\u5EFA\u7B14\u8BB0\u672C",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "\u7B14\u8BB0\u672C\u540D\u79F0" }
          },
          required: ["name"]
        }
      },
      {
        name: "create_tag",
        description: "\u521B\u5EFA\u6807\u7B7E",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "\u6807\u7B7E\u540D\u79F0" }
          },
          required: ["name"]
        }
      }
    ]
  };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args2 } = request.params;
  switch (name) {
    case "list_notebooks":
      return handleListNotebooks();
    case "get_default_notebook":
      return handleGetDefaultNotebook();
    case "list_tags":
      return handleListTags();
    case "create_note":
      return handleCreateNote(args2);
    case "search_notes":
      return handleSearchNotes(args2);
    case "get_note":
      return handleGetNote(args2);
    case "update_note":
      return handleUpdateNote(args2);
    case "delete_note":
      return handleDeleteNote(args2);
    case "create_notebook":
      return handleCreateNotebook(args2);
    case "create_tag":
      return handleCreateTag(args2);
    default:
      return {
        content: [{ type: "text", text: `\u672A\u77E5\u5DE5\u5177: ${name}` }],
        isError: true
      };
  }
});
async function handleListNotebooks() {
  try {
    const notebooks = await noteStore.listNotebooks();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(notebooks, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleGetDefaultNotebook() {
  try {
    const notebook = await noteStore.getDefaultNotebook();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(notebook, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleListTags() {
  try {
    const tags = await noteStore.listTags();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tags, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleCreateNote(args2) {
  try {
    const note = new import_evernote.default.Types.Note();
    note.title = args2.title;
    note.content = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>${args2.content}</en-note>`;
    if (args2.notebookGuid) {
      note.notebookGuid = args2.notebookGuid;
    }
    if (args2.tagNames && args2.tagNames.length > 0) {
      const allTags = await noteStore.listTags();
      const tagGuids = [];
      for (const tagName of args2.tagNames) {
        const existingTag = allTags.find((t) => t.name === tagName);
        if (existingTag && existingTag.guid) {
          tagGuids.push(existingTag.guid);
        } else {
          const newTag = await noteStore.createTag(new import_evernote.default.Types.Tag({ name: tagName }));
          if (newTag.guid) {
            tagGuids.push(newTag.guid);
          }
        }
      }
      note.tagGuids = tagGuids;
    }
    const created = await noteStore.createNote(note);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ guid: created.guid, title: created.title }, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleSearchNotes(args2) {
  try {
    const filter = new import_evernote.default.NoteStore.NoteFilter({
      words: args2.query
    });
    const spec = new import_evernote.default.NoteStore.NotesMetadataResultSpec({
      includeTitle: true,
      includeCreated: true,
      includeUpdated: true,
      includeNotebookGuid: true
    });
    const result = await noteStore.findNotesMetadata(filter, 0, args2.maxResults || 20, spec);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result.notes, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleGetNote(args2) {
  try {
    const note = await noteStore.getNote(args2.guid, true, true, true, true);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(note, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleUpdateNote(args2) {
  try {
    const existingNote = await noteStore.getNote(args2.guid, true, true, false, false);
    const updatedNote = new import_evernote.default.Types.Note();
    updatedNote.guid = args2.guid;
    updatedNote.title = args2.title || existingNote.title;
    updatedNote.content = args2.content ? `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>${args2.content}</en-note>` : existingNote.content;
    updatedNote.tagGuids = existingNote.tagGuids;
    await noteStore.updateNote(updatedNote);
    return {
      content: [
        {
          type: "text",
          text: `\u7B14\u8BB0\u5DF2\u66F4\u65B0: ${updatedNote.title}`
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleDeleteNote(args2) {
  try {
    await noteStore.deleteNote(args2.guid);
    return {
      content: [
        {
          type: "text",
          text: `\u7B14\u8BB0\u5DF2\u5220\u9664\uFF08\u79FB\u5230\u56DE\u6536\u7AD9\uFF09`
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleCreateNotebook(args2) {
  try {
    const notebook = new import_evernote.default.Types.Notebook({ name: args2.name });
    const created = await noteStore.createNotebook(notebook);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ guid: created.guid, name: created.name }, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
async function handleCreateTag(args2) {
  try {
    const tag = new import_evernote.default.Types.Tag({ name: args2.name });
    const created = await noteStore.createTag(tag);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ guid: created.guid, name: created.name }, null, 2)
        }
      ]
    };
  } catch (error2) {
    return {
      content: [{ type: "text", text: formatEdamError(error2) }],
      isError: true
    };
  }
}
var EDAM_ERROR_MAP = {
  1: "UNKNOWN - \u672A\u77E5\u9519\u8BEF",
  2: "BAD_DATA_FORMAT - \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
  3: "PERMISSION_DENIED - \u6743\u9650\u4E0D\u8DB3",
  4: "INTERNAL_ERROR - \u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF",
  5: "DATA_REQUIRED - \u7F3A\u5C11\u5FC5\u8981\u6570\u636E",
  6: "LIMIT_REACHED - \u8FBE\u5230\u9650\u5236",
  7: "QUOTA_REACHED - \u914D\u989D\u5DF2\u6EE1",
  8: "INVALID_AUTH - \u8BA4\u8BC1\u65E0\u6548",
  9: "AUTH_EXPIRED - \u8BA4\u8BC1\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6Developer Token",
  10: "DATA_CONFLICT - \u6570\u636E\u51B2\u7A81"
};
function formatEdamError(error2) {
  if (error2 && typeof error2 === "object") {
    const code = error2.errorCode;
    const param = error2.parameter;
    if (code !== void 0) {
      const desc = EDAM_ERROR_MAP[code] || `\u672A\u77E5\u9519\u8BEF\u7801(${code})`;
      return `\u5370\u8C61\u7B14\u8BB0API\u9519\u8BEF: ${desc}${param ? ` (\u53C2\u6570: ${param})` : ""}`;
    }
  }
  return `\u8BF7\u6C42\u5931\u8D25: ${error2?.message || error2}`;
}
async function main() {
  try {
    const user = await userStore.getUser();
    console.error(`\u5DF2\u8FDE\u63A5\u5230\u5370\u8C61\u7B14\u8BB0\u7528\u6237: ${user.username}`);
  } catch (error2) {
    console.error(`\u8B66\u544A: Token\u9A8C\u8BC1\u5931\u8D25 - ${formatEdamError(error2)}`);
    console.error(`\u63D0\u793A: \u8BF7\u8BBF\u95EE https://app.yinxiang.com/api/DeveloperToken.action \u91CD\u65B0\u83B7\u53D6Token`);
    console.error(`MCP Server\u4ECD\u5C06\u542F\u52A8\uFF0C\u4F46\u5DE5\u5177\u8C03\u7528\u53EF\u80FD\u5931\u8D25`);
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("\u5370\u8C61\u7B14\u8BB0 MCP Server \u8FD0\u884C\u4E2D");
}
main().catch((error2) => {
  console.error("\u542F\u52A8\u5931\u8D25:", error2);
  process.exit(1);
});
