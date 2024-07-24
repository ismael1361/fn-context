"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
exports.default = void 0;
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var kContextIdFunctionPrefix = "_context_id_";
var kContextIdRegex = new RegExp("_".concat(kContextIdFunctionPrefix, "_([0-9a-zA-Z]{32})_([0-9a-zA-Z]{32})_(\\d+)__"));
var randomUUID = function randomUUID() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c == "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
var runCallback = function runCallback(callback, data) {
  try {
    callback(data);
  } catch (err) {
    console.error("Error in subscription callback", err);
  }
};
var cloneValue = function cloneValue(obj) {
  var seen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();
  // Handle the 3 simple types, and null or undefined
  if (obj === null || _typeof(obj) !== "object") return obj;
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  // Handle previously seen objects to avoid circular references
  if (seen.has(obj)) {
    return seen.get(obj);
  }
  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    seen.set(obj, copy); // Add to seen map
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = cloneValue(obj[i], seen);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    var _copy = {};
    seen.set(obj, _copy); // Add to seen map
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        _copy[attr] = cloneValue(obj[attr], seen);
      }
    }
    return _copy;
  }
  return obj;
};
var SimpleEventEmitter = /*#__PURE__*/function () {
  function SimpleEventEmitter() {
    _classCallCheck(this, SimpleEventEmitter);
    _defineProperty(this, "subscriptions", void 0);
    _defineProperty(this, "oneTimeEvents", void 0);
    this.subscriptions = [];
    this.oneTimeEvents = new Map();
  }
  return _createClass(SimpleEventEmitter, [{
    key: "on",
    value: function on(event, callback) {
      if (this.oneTimeEvents.has(event)) {
        runCallback(callback, this.oneTimeEvents.get(event));
      } else {
        this.subscriptions.push({
          event: event,
          callback: callback,
          once: false
        });
      }
      var self = this;
      return {
        stop: function stop() {
          self.off(event, callback);
        }
      };
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      this.subscriptions = this.subscriptions.filter(function (s) {
        return s.event !== event || callback && s.callback !== callback;
      });
      return this;
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      var _this = this;
      return new Promise(function (resolve) {
        var ourCallback = function ourCallback(data) {
          resolve(data);
          callback === null || callback === void 0 ? void 0 : callback(data);
        };
        if (_this.oneTimeEvents.has(event)) {
          runCallback(ourCallback, _this.oneTimeEvents.get(event));
        } else {
          _this.subscriptions.push({
            event: event,
            callback: ourCallback,
            once: true
          });
        }
      });
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      if (this.oneTimeEvents.has(event)) {
        throw new Error("Event \"".concat(event, "\" was supposed to be emitted only once"));
      }
      for (var i = 0; i < this.subscriptions.length; i++) {
        var s = this.subscriptions[i];
        if (s.event !== event) {
          continue;
        }
        runCallback(s.callback, data);
        if (s.once) {
          this.subscriptions.splice(i, 1);
          i--;
        }
      }
      return this;
    }
  }, {
    key: "emitOnce",
    value: function emitOnce(event, data) {
      if (this.oneTimeEvents.has(event)) {
        throw new Error("Event \"".concat(event, "\" was supposed to be emitted only once"));
      }
      this.emit(event, data);
      this.oneTimeEvents.set(event, data); // Mark event as being emitted once for future subscribers
      this.off(event); // Remove all listeners for this event, they won't fire again
      return this;
    }
  }]);
}();
var ContextValue = /*#__PURE__*/function () {
  function ContextValue(value) {
    _classCallCheck(this, ContextValue);
    _defineProperty(this, "_value", void 0);
    _defineProperty(this, "_cache", void 0);
    this._value = cloneValue(value);
    this._cache = {};
  }
  return _createClass(ContextValue, [{
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this._value = value;
    }
  }, {
    key: "cache",
    get: function get() {
      var self = this;
      return {
        get: function get(id) {
          return id in self._cache ? self._cache[id] : undefined;
        },
        set: function set(id, value) {
          return self._cache[id] = value;
        },
        delete: function _delete(id) {
          return delete self._cache[id];
        },
        clear: function clear() {
          return self._cache = {};
        },
        has: function has(id) {
          return id in self._cache;
        }
      };
    }
  }]);
}();
var joinObject = function joinObject(obj, partial) {
  var newObj = _objectSpread({}, obj);
  for (var key in partial) {
    if (partial.hasOwnProperty(key)) {
      var _partial$key;
      newObj[key] = (_partial$key = partial[key]) !== null && _partial$key !== void 0 ? _partial$key : obj[key];
    }
  }
  return newObj;
};
var Context = /*#__PURE__*/function (_SimpleEventEmitter2) {
  function Context(_defaultValue) {
    var _this2;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Context);
    _this2 = _callSuper(this, Context);
    _defineProperty(_this2, "_defaultValue", void 0);
    _defineProperty(_this2, "constextId", randomUUID());
    _defineProperty(_this2, "processLength", new Map());
    _defineProperty(_this2, "contexts", new Map());
    _defineProperty(_this2, "events", {});
    _defineProperty(_this2, "options", void 0);
    _this2._defaultValue = _defaultValue;
    _this2.options = joinObject({
      individual: false
    }, options);
    return _this2;
  }
  _inherits(Context, _SimpleEventEmitter2);
  return _createClass(Context, [{
    key: "defaultValue",
    get: function get() {
      return cloneValue(this._defaultValue);
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      var id = this.getContextId();
      var evn = _get(_getPrototypeOf(Context.prototype), "on", this).call(this, event, callback);
      if (this.contexts.has(id)) {
        if (!Array.isArray(this.events[id])) {
          this.events[id] = [];
        }
        this.events[id].push({
          event: event,
          callback: callback
        });
        return evn;
      } else {
        evn.stop();
        return evn;
      }
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      var id = this.getContextId();
      if (this.contexts.has(id)) {
        if (!Array.isArray(this.events[id])) {
          this.events[id] = [];
        }
        this.events[id].push({
          event: event,
          callback: callback
        });
        return _get(_getPrototypeOf(Context.prototype), "once", this).call(this, event, callback);
      } else {
        return Promise.reject();
      }
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      _get(_getPrototypeOf(Context.prototype), "off", this).call(this, event, callback);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      _get(_getPrototypeOf(Context.prototype), "emit", this).call(this, event, data);
      return this;
    }
  }, {
    key: "emitOnce",
    value: function emitOnce(event, data) {
      _get(_getPrototypeOf(Context.prototype), "emitOnce", this).call(this, event, data);
      return this;
    }
  }, {
    key: "provider",
    value: function provider(target) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultValue;
      var self = this;
      return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _self$processLength$g, _self$processLength$g2;
        var contextId,
          fnName,
          proxy,
          result,
          error,
          _len,
          args,
          _key,
          length,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              contextId = self.options.individual ? randomUUID() : self.getContextId();
              if (!self.contexts.has(contextId)) {
                self.contexts.set(contextId, new ContextValue(defaultValue !== null && defaultValue !== void 0 ? defaultValue : this._defaultValue));
              }
              self.processLength.set(contextId, ((_self$processLength$g = self.processLength.get(contextId)) !== null && _self$processLength$g !== void 0 ? _self$processLength$g : 0) + 1);
              fnName = "_".concat(kContextIdFunctionPrefix, "_").concat(self.constextId, "_").concat(contextId, "_").concat(Date.now(), "__");
              proxy = new Function("return function ".concat(fnName, "(self, target) {\n                    return Promise.race([target.apply(self, Array.from(arguments).slice(2))]);\n                };"))();
              result = undefined, error = undefined;
              _context.prev = 6;
              for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args[_key];
              }
              _context.next = 10;
              return proxy.apply(void 0, [this, target].concat(args));
            case 10:
              result = _context.sent;
              _context.next = 16;
              break;
            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](6);
              error = new Error(_context.t0);
            case 16:
              length = (_self$processLength$g2 = self.processLength.get(contextId)) !== null && _self$processLength$g2 !== void 0 ? _self$processLength$g2 : 0;
              if (length <= 1) {
                setTimeout(function () {
                  var _self$events$contextI;
                  self.contexts.delete(contextId);
                  self.processLength.delete(contextId);
                  ((_self$events$contextI = self.events[contextId]) !== null && _self$events$contextI !== void 0 ? _self$events$contextI : []).splice(0).forEach(function (_ref2) {
                    var event = _ref2.event,
                      callback = _ref2.callback;
                    self.off(event, callback);
                  });
                }, 15000);
              } else {
                self.processLength.set(contextId, length - 1);
              }
              return _context.abrupt("return", error instanceof Error ? Promise.reject(error) : result);
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[6, 13]]);
      }));
    }
  }, {
    key: "value",
    get: function get() {
      var _this$contexts$get$va, _this$contexts$get;
      var id = this.getContextId();
      return (_this$contexts$get$va = (_this$contexts$get = this.contexts.get(id)) === null || _this$contexts$get === void 0 ? void 0 : _this$contexts$get.value) !== null && _this$contexts$get$va !== void 0 ? _this$contexts$get$va : this.defaultValue;
    },
    set: function set(value) {
      this.set(value);
    }
  }, {
    key: "id",
    get: function get() {
      return this.getId();
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.getContextId();
    }
  }, {
    key: "cache",
    get: function get() {
      var id = this.getContextId();
      var context = this.contexts.get(id);
      if (!context) {
        return new ContextValue(this.defaultValue).cache;
      }
      return context.cache;
    }
  }, {
    key: "getContextId",
    value: function getContextId() {
      var _Error$stack;
      Error.stackTraceLimit = Infinity;
      var stack = ((_Error$stack = new Error().stack) !== null && _Error$stack !== void 0 ? _Error$stack : "").split("\n");
      var _iterator = _createForOfIteratorHelper(stack),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var frame = _step.value;
          var match = frame.match(kContextIdRegex);
          if (!match) {
            continue;
          }
          var contextId = match[1],
            id = match[2];
          if (typeof contextId !== "string" || contextId.trim() === "") {
            continue;
          }
          if (contextId !== this.constextId) {
            continue;
          }
          if (typeof id !== "string" || id.trim() === "") {
            continue;
          }
          return id;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return randomUUID();
    }
  }, {
    key: "get",
    value: function get() {
      var _this$contexts$get$va2, _this$contexts$get2;
      var id = this.getContextId();
      return (_this$contexts$get$va2 = (_this$contexts$get2 = this.contexts.get(id)) === null || _this$contexts$get2 === void 0 ? void 0 : _this$contexts$get2.value) !== null && _this$contexts$get$va2 !== void 0 ? _this$contexts$get$va2 : this.defaultValue;
    }
  }, {
    key: "set",
    value: function set(value) {
      var _this$contexts$get$va3, _this$contexts$get3;
      var id = this.getContextId();
      var context = this.contexts.get(id);
      if (context) {
        context.value = value;
      }
      this.emit("context", {
        contextId: id,
        value: value
      });
      return (_this$contexts$get$va3 = (_this$contexts$get3 = this.contexts.get(id)) === null || _this$contexts$get3 === void 0 ? void 0 : _this$contexts$get3.value) !== null && _this$contexts$get$va3 !== void 0 ? _this$contexts$get$va3 : value;
    }
  }, {
    key: "assignValue",
    value: function assignValue(value) {
      var context = this.get();
      if (!context) {
        return this.set(value);
      }
      var a_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(context));
      var b_is_obj = ["[object Object]", "[object Array]"].includes(Object.prototype.toString.call(value));
      if (a_is_obj && !b_is_obj || !a_is_obj && !b_is_obj) {
        return context;
      } else if (!a_is_obj && b_is_obj) {
        return this.set(value);
      }
      return this.set(Object.assign(context, value));
    }
  }, {
    key: "proxyValue",
    value: function proxyValue() {
      var _this$get;
      var context = (_this$get = this.get()) !== null && _this$get !== void 0 ? _this$get : {};
      if (!context || _typeof(context) !== "object" || context === null) {
        throw new Error("Context is not an object");
      }
      var self = this;
      return new Proxy(context, {
        get: function get(target, prop) {
          return target[prop];
        },
        set: function set(target, prop, value) {
          target[prop] = value;
          self.set(target);
          return true;
        },
        deleteProperty: function deleteProperty(target, prop) {
          delete target[prop];
          self.set(target);
          return true;
        }
      });
    }
  }]);
}(SimpleEventEmitter);
/**
 * Cria um novo contexto com um valor padrão.
 *
 * @template T - O tipo do valor padrão do contexto.
 * @template C - O tipo do escopo cache do contexto, que deve ser um objeto. Por padrão, é um objeto genérico com chaves do tipo string e valores de qualquer tipo. Útil apenas em casos específicos onde você deseja armazenar valores em cache no contexto.
 *
 * @param {T} defaultValue - O valor padrão do contexto.
 * @param {Partial<ContextOptions>} options - Opções para o contexto.
 * @returns {Context<T, C>} Uma nova instância de `Context` com o valor padrão fornecido.
 
 * @example
 * const context = createContext(0);
 *
 * const someFunction = async ()=>{
 *    context.value += 1;
 * };
 *
 * const initialize = context.provider(async function(){
 *     someFunction();
 *     someFunction();
 *     someFunction();
 *     someFunction();
 *     console.log(context.value); // 4
 * });
 *
 * initialize();
 */
function createContext(defaultValue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Context(defaultValue, options);
}
var _default = exports.default = createContext;