var Ei = Object.defineProperty;
var _i = (n, e, t) => e in n ? Ei(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e, t) => _i(n, typeof e != "symbol" ? e + "" : e, t);
import { app as me, ipcMain as q, dialog as Et, BrowserWindow as Ns } from "electron";
import Be from "node:path";
import Li from "node:fs";
import { fileURLToPath as Ai } from "node:url";
import Ee from "better-sqlite3";
import et from "path";
import ue from "fs";
const b = Symbol.for("drizzle:entityKind");
function p(n, e) {
  if (!n || typeof n != "object")
    return !1;
  if (n instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, b))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let t = Object.getPrototypeOf(n).constructor;
  if (t)
    for (; t; ) {
      if (b in t && t[b] === e[b])
        return !0;
      t = Object.getPrototypeOf(t);
    }
  return !1;
}
var Ot;
Ot = b;
class Es {
  write(e) {
    console.log(e);
  }
}
c(Es, Ot, "ConsoleLogWriter");
var xt;
xt = b;
class _s {
  constructor(e) {
    c(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new Es();
  }
  logQuery(e, t) {
    const r = t.map((i) => {
      try {
        return JSON.stringify(i);
      } catch {
        return String(i);
      }
    }), s = r.length ? ` -- params: [${r.join(", ")}]` : "";
    this.writer.write(`Query: ${e}${s}`);
  }
}
c(_s, xt, "DefaultLogger");
var Bt;
Bt = b;
class Ls {
  logQuery() {
  }
}
c(Ls, Bt, "NoopLogger");
const ce = Symbol.for("drizzle:Name"), xe = Symbol.for("drizzle:Schema"), tt = Symbol.for("drizzle:Columns"), _t = Symbol.for("drizzle:ExtraConfigColumns"), We = Symbol.for("drizzle:OriginalName"), He = Symbol.for("drizzle:BaseName"), rt = Symbol.for("drizzle:IsAlias"), Lt = Symbol.for("drizzle:ExtraConfigBuilder"), vi = Symbol.for("drizzle:IsDrizzleTable");
var Qt, qt, Dt, jt, Pt, kt, Ut, Mt, Ft, Rt;
Rt = b, Ft = ce, Mt = We, Ut = xe, kt = tt, Pt = _t, jt = He, Dt = rt, qt = vi, Qt = Lt;
class S {
  constructor(e, t, r) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    c(this, Ft);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    c(this, Mt);
    /** @internal */
    c(this, Ut);
    /** @internal */
    c(this, kt);
    /** @internal */
    c(this, Pt);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    c(this, jt);
    /** @internal */
    c(this, Dt, !1);
    /** @internal */
    c(this, qt, !0);
    /** @internal */
    c(this, Qt);
    this[ce] = this[We] = e, this[xe] = t, this[He] = r;
  }
}
c(S, Rt, "Table"), /** @internal */
c(S, "Symbol", {
  Name: ce,
  Schema: xe,
  OriginalName: We,
  Columns: tt,
  ExtraConfigColumns: _t,
  BaseName: He,
  IsAlias: rt,
  ExtraConfigBuilder: Lt
});
function Ne(n) {
  return n[ce];
}
function Ae(n) {
  return `${n[xe] ?? "public"}.${n[ce]}`;
}
var Kt;
Kt = b;
class j {
  constructor(e, t) {
    c(this, "name");
    c(this, "keyAsName");
    c(this, "primary");
    c(this, "notNull");
    c(this, "default");
    c(this, "defaultFn");
    c(this, "onUpdateFn");
    c(this, "hasDefault");
    c(this, "isUnique");
    c(this, "uniqueName");
    c(this, "uniqueType");
    c(this, "dataType");
    c(this, "columnType");
    c(this, "enumValues");
    c(this, "generated");
    c(this, "generatedIdentity");
    c(this, "config");
    this.table = e, this.config = t, this.name = t.name, this.keyAsName = t.keyAsName, this.notNull = t.notNull, this.default = t.default, this.defaultFn = t.defaultFn, this.onUpdateFn = t.onUpdateFn, this.hasDefault = t.hasDefault, this.primary = t.primaryKey, this.isUnique = t.isUnique, this.uniqueName = t.uniqueName, this.uniqueType = t.uniqueType, this.dataType = t.dataType, this.columnType = t.columnType, this.generated = t.generated, this.generatedIdentity = t.generatedIdentity;
  }
  mapFromDriverValue(e) {
    return e;
  }
  mapToDriverValue(e) {
    return e;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
}
c(j, Kt, "Column");
var zt;
zt = b;
class As {
  constructor(e, t, r) {
    c(this, "config");
    /**
     * Alias for {@link $defaultFn}.
     */
    c(this, "$default", this.$defaultFn);
    /**
     * Alias for {@link $onUpdateFn}.
     */
    c(this, "$onUpdate", this.$onUpdateFn);
    this.config = {
      name: e,
      keyAsName: e === "",
      notNull: !1,
      default: void 0,
      hasDefault: !1,
      primaryKey: !1,
      isUnique: !1,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType: t,
      columnType: r,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    return this.config.notNull = !0, this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(e) {
    return this.config.default = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(e) {
    return this.config.defaultFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(e) {
    return this.config.onUpdateFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    return this.config.primaryKey = !0, this.config.notNull = !0, this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(e) {
    this.config.name === "" && (this.config.name = e);
  }
}
c(As, zt, "ColumnBuilder");
const At = Symbol.for("drizzle:isPgEnum");
function Ci(n) {
  return !!n && typeof n == "function" && At in n && n[At] === !0;
}
var Jt;
Jt = b;
class G {
  constructor(e, t, r, s = !1) {
    this._ = {
      brand: "Subquery",
      sql: e,
      selectedFields: t,
      alias: r,
      isWith: s
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
c(G, Jt, "Subquery");
var Vt, Xt;
class yt extends (Xt = G, Vt = b, Xt) {
}
c(yt, Vt, "WithSubquery");
const Ii = {
  startActiveSpan(n, e) {
    return e();
  }
}, K = Symbol.for("drizzle:ViewBaseConfig");
function vs(n) {
  return n != null && typeof n.getSQL == "function";
}
function $i(n) {
  var t;
  const e = { sql: "", params: [] };
  for (const r of n)
    e.sql += r.sql, e.params.push(...r.params), (t = r.typings) != null && t.length && (e.typings || (e.typings = []), e.typings.push(...r.typings));
  return e;
}
var Yt;
Yt = b;
class U {
  constructor(e) {
    c(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new v([this]);
  }
}
c(U, Yt, "StringChunk");
var Gt;
Gt = b;
const de = class de {
  constructor(e) {
    /** @internal */
    c(this, "decoder", Cs);
    c(this, "shouldInlineParams", !1);
    this.queryChunks = e;
  }
  append(e) {
    return this.queryChunks.push(...e.queryChunks), this;
  }
  toQuery(e) {
    return Ii.startActiveSpan("drizzle.buildSQL", (t) => {
      const r = this.buildQueryFromSourceParams(this.queryChunks, e);
      return t == null || t.setAttributes({
        "drizzle.query.text": r.sql,
        "drizzle.query.params": JSON.stringify(r.params)
      }), r;
    });
  }
  buildQueryFromSourceParams(e, t) {
    const r = Object.assign({}, t, {
      inlineParams: t.inlineParams || this.shouldInlineParams,
      paramStartIndex: t.paramStartIndex || { value: 0 }
    }), {
      casing: s,
      escapeName: i,
      escapeParam: o,
      prepareTyping: a,
      inlineParams: u,
      paramStartIndex: y
    } = r;
    return $i(e.map((d) => {
      var L;
      if (p(d, U))
        return { sql: d.value.join(""), params: [] };
      if (p(d, Qe))
        return { sql: i(d.value), params: [] };
      if (d === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(d)) {
        const w = [new U("(")];
        for (const [A, N] of d.entries())
          w.push(N), A < d.length - 1 && w.push(new U(", "));
        return w.push(new U(")")), this.buildQueryFromSourceParams(w, r);
      }
      if (p(d, de))
        return this.buildQueryFromSourceParams(d.queryChunks, {
          ...r,
          inlineParams: u || d.shouldInlineParams
        });
      if (p(d, S)) {
        const w = d[S.Symbol.Schema], A = d[S.Symbol.Name];
        return {
          sql: w === void 0 ? i(A) : i(w) + "." + i(A),
          params: []
        };
      }
      if (p(d, j)) {
        const w = s.getColumnCasing(d);
        if (t.invokeSource === "indexes")
          return { sql: i(w), params: [] };
        const A = d.table[S.Symbol.Schema];
        return {
          sql: d.table[rt] || A === void 0 ? i(d.table[S.Symbol.Name]) + "." + i(w) : i(A) + "." + i(d.table[S.Symbol.Name]) + "." + i(w),
          params: []
        };
      }
      if (p(d, be)) {
        const w = d[K].schema, A = d[K].name;
        return {
          sql: w === void 0 ? i(A) : i(w) + "." + i(A),
          params: []
        };
      }
      if (p(d, se)) {
        if (p(d.value, he))
          return { sql: o(y.value++, d), params: [d], typings: ["none"] };
        const w = d.value === null ? null : d.encoder.mapToDriverValue(d.value);
        if (p(w, de))
          return this.buildQueryFromSourceParams([w], r);
        if (u)
          return { sql: this.mapInlineParam(w, r), params: [] };
        let A = ["none"];
        return a && (A = [a(d.encoder)]), { sql: o(y.value++, w), params: [w], typings: A };
      }
      return p(d, he) ? { sql: o(y.value++, d), params: [d], typings: ["none"] } : p(d, de.Aliased) && d.fieldAlias !== void 0 ? { sql: i(d.fieldAlias), params: [] } : p(d, G) ? d._.isWith ? { sql: i(d._.alias), params: [] } : this.buildQueryFromSourceParams([
        new U("("),
        d._.sql,
        new U(") "),
        new Qe(d._.alias)
      ], r) : Ci(d) ? d.schema ? { sql: i(d.schema) + "." + i(d.enumName), params: [] } : { sql: i(d.enumName), params: [] } : vs(d) ? (L = d.shouldOmitSQLParens) != null && L.call(d) ? this.buildQueryFromSourceParams([d.getSQL()], r) : this.buildQueryFromSourceParams([
        new U("("),
        d.getSQL(),
        new U(")")
      ], r) : u ? { sql: this.mapInlineParam(d, r), params: [] } : { sql: o(y.value++, d), params: [d], typings: ["none"] };
    }));
  }
  mapInlineParam(e, { escapeString: t }) {
    if (e === null)
      return "null";
    if (typeof e == "number" || typeof e == "boolean")
      return e.toString();
    if (typeof e == "string")
      return t(e);
    if (typeof e == "object") {
      const r = e.toString();
      return t(r === "[object Object]" ? JSON.stringify(e) : r);
    }
    throw new Error("Unexpected param value: " + e);
  }
  getSQL() {
    return this;
  }
  as(e) {
    return e === void 0 ? this : new de.Aliased(this, e);
  }
  mapWith(e) {
    return this.decoder = typeof e == "function" ? { mapFromDriverValue: e } : e, this;
  }
  inlineParams() {
    return this.shouldInlineParams = !0, this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(e) {
    return e ? this : void 0;
  }
};
c(de, Gt, "SQL");
let v = de;
var Wt;
Wt = b;
class Qe {
  constructor(e) {
    c(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new v([this]);
  }
}
c(Qe, Wt, "Name");
function Oi(n) {
  return typeof n == "object" && n !== null && "mapToDriverValue" in n && typeof n.mapToDriverValue == "function";
}
const Cs = {
  mapFromDriverValue: (n) => n
}, Is = {
  mapToDriverValue: (n) => n
};
({
  ...Cs,
  ...Is
});
var Ht;
Ht = b;
class se {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, t = Is) {
    c(this, "brand");
    this.value = e, this.encoder = t;
  }
  getSQL() {
    return new v([this]);
  }
}
c(se, Ht, "Param");
function l(n, ...e) {
  const t = [];
  (e.length > 0 || n.length > 0 && n[0] !== "") && t.push(new U(n[0]));
  for (const [r, s] of e.entries())
    t.push(s, new U(n[r + 1]));
  return new v(t);
}
((n) => {
  function e() {
    return new v([]);
  }
  n.empty = e;
  function t(u) {
    return new v(u);
  }
  n.fromList = t;
  function r(u) {
    return new v([new U(u)]);
  }
  n.raw = r;
  function s(u, y) {
    const d = [];
    for (const [L, w] of u.entries())
      L > 0 && y !== void 0 && d.push(y), d.push(w);
    return new v(d);
  }
  n.join = s;
  function i(u) {
    return new Qe(u);
  }
  n.identifier = i;
  function o(u) {
    return new he(u);
  }
  n.placeholder = o;
  function a(u, y) {
    return new se(u, y);
  }
  n.param = a;
})(l || (l = {}));
((n) => {
  var t;
  t = b;
  const r = class r {
    constructor(i, o) {
      /** @internal */
      c(this, "isSelectionField", !1);
      this.sql = i, this.fieldAlias = o;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new r(this.sql, this.fieldAlias);
    }
  };
  c(r, t, "SQL.Aliased");
  let e = r;
  n.Aliased = e;
})(v || (v = {}));
var Zt;
Zt = b;
class he {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new v([this]);
  }
}
c(he, Zt, "Placeholder");
function $e(n, e) {
  return n.map((t) => {
    if (p(t, he)) {
      if (!(t.name in e))
        throw new Error(`No value for placeholder "${t.name}" was provided`);
      return e[t.name];
    }
    if (p(t, se) && p(t.value, he)) {
      if (!(t.value.name in e))
        throw new Error(`No value for placeholder "${t.value.name}" was provided`);
      return t.encoder.mapToDriverValue(e[t.value.name]);
    }
    return t;
  });
}
var er, tr;
tr = b, er = K;
class be {
  constructor({ name: e, schema: t, selectedFields: r, query: s }) {
    /** @internal */
    c(this, er);
    this[K] = {
      name: e,
      originalName: e,
      schema: t,
      selectedFields: r,
      query: s,
      isExisting: !s,
      isAlias: !1
    };
  }
  getSQL() {
    return new v([this]);
  }
}
c(be, tr, "View");
j.prototype.getSQL = function() {
  return new v([this]);
};
S.prototype.getSQL = function() {
  return new v([this]);
};
G.prototype.getSQL = function() {
  return new v([this]);
};
function vt(n, e, t) {
  const r = {}, s = n.reduce(
    (i, { path: o, field: a }, u) => {
      let y;
      p(a, j) ? y = a : p(a, v) ? y = a.decoder : y = a.sql.decoder;
      let d = i;
      for (const [L, w] of o.entries())
        if (L < o.length - 1)
          w in d || (d[w] = {}), d = d[w];
        else {
          const A = e[u], N = d[w] = A === null ? null : y.mapFromDriverValue(A);
          if (t && p(a, j) && o.length === 2) {
            const T = o[0];
            T in r ? typeof r[T] == "string" && r[T] !== Ne(a.table) && (r[T] = !1) : r[T] = N === null ? Ne(a.table) : !1;
          }
        }
      return i;
    },
    {}
  );
  if (t && Object.keys(r).length > 0)
    for (const [i, o] of Object.entries(r))
      typeof o == "string" && !t[o] && (s[i] = null);
  return s;
}
function fe(n, e) {
  return Object.entries(n).reduce((t, [r, s]) => {
    if (typeof r != "string")
      return t;
    const i = e ? [...e, r] : [r];
    return p(s, j) || p(s, v) || p(s, v.Aliased) ? t.push({ path: i, field: s }) : p(s, S) ? t.push(...fe(s[S.Symbol.Columns], i)) : t.push(...fe(s, i)), t;
  }, []);
}
function bt(n, e) {
  const t = Object.keys(n), r = Object.keys(e);
  if (t.length !== r.length)
    return !1;
  for (const [s, i] of t.entries())
    if (i !== r[s])
      return !1;
  return !0;
}
function $s(n, e) {
  const t = Object.entries(e).filter(([, r]) => r !== void 0).map(([r, s]) => p(s, v) || p(s, j) ? [r, s] : [r, new se(s, n[S.Symbol.Columns][r])]);
  if (t.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(t);
}
function xi(n, e) {
  for (const t of e)
    for (const r of Object.getOwnPropertyNames(t.prototype))
      r !== "constructor" && Object.defineProperty(
        n.prototype,
        r,
        Object.getOwnPropertyDescriptor(t.prototype, r) || /* @__PURE__ */ Object.create(null)
      );
}
function Bi(n) {
  return n[S.Symbol.Columns];
}
function nt(n) {
  return p(n, G) ? n._.alias : p(n, be) ? n[K].name : p(n, v) ? void 0 : n[S.Symbol.IsAlias] ? n[S.Symbol.Name] : n[S.Symbol.BaseName];
}
function Re(n, e) {
  return {
    name: typeof n == "string" && n.length > 0 ? n : "",
    config: typeof n == "object" ? n : e
  };
}
function Qi(n) {
  if (typeof n != "object" || n === null || n.constructor.name !== "Object")
    return !1;
  if ("logger" in n) {
    const e = typeof n.logger;
    return !(e !== "boolean" && (e !== "object" || typeof n.logger.logQuery != "function") && e !== "undefined");
  }
  if ("schema" in n) {
    const e = typeof n.logger;
    return !(e !== "object" && e !== "undefined");
  }
  if ("casing" in n) {
    const e = typeof n.logger;
    return !(e !== "string" && e !== "undefined");
  }
  if ("mode" in n)
    return !(n.mode !== "default" || n.mode !== "planetscale" || n.mode !== void 0);
  if ("connection" in n) {
    const e = typeof n.connection;
    return !(e !== "string" && e !== "object" && e !== "undefined");
  }
  if ("client" in n) {
    const e = typeof n.client;
    return !(e !== "object" && e !== "function" && e !== "undefined");
  }
  return Object.keys(n).length === 0;
}
const Ct = Symbol.for("drizzle:PgInlineForeignKeys"), It = Symbol.for("drizzle:EnableRLS");
var rr, nr, sr, ir, ar;
class st extends (ar = S, ir = b, sr = Ct, nr = It, rr = S.Symbol.ExtraConfigBuilder, ar) {
  constructor() {
    super(...arguments);
    /**@internal */
    c(this, sr, []);
    /** @internal */
    c(this, nr, !1);
    /** @internal */
    c(this, rr);
  }
}
c(st, ir, "PgTable"), /** @internal */
c(st, "Symbol", Object.assign({}, S.Symbol, {
  InlineForeignKeys: Ct,
  EnableRLS: It
}));
var or;
or = b;
class Os {
  constructor(e, t) {
    /** @internal */
    c(this, "columns");
    /** @internal */
    c(this, "name");
    this.columns = e, this.name = t;
  }
  /** @internal */
  build(e) {
    return new xs(e, this.columns, this.name);
  }
}
c(Os, or, "PgPrimaryKeyBuilder");
var cr;
cr = b;
class xs {
  constructor(e, t, r) {
    c(this, "columns");
    c(this, "name");
    this.table = e, this.columns = t, this.name = r;
  }
  getName() {
    return this.name ?? `${this.table[st.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
c(xs, cr, "PgPrimaryKey");
function z(n, e) {
  return Oi(e) && !vs(n) && !p(n, se) && !p(n, he) && !p(n, j) && !p(n, S) && !p(n, be) ? new se(n, e) : n;
}
const m = (n, e) => l`${n} = ${z(e, n)}`, qi = (n, e) => l`${n} <> ${z(e, n)}`;
function k(...n) {
  const e = n.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new v(e) : new v([
      new U("("),
      l.join(e, new U(" and ")),
      new U(")")
    ]);
}
function Di(...n) {
  const e = n.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new v(e) : new v([
      new U("("),
      l.join(e, new U(" or ")),
      new U(")")
    ]);
}
function ji(n) {
  return l`not ${n}`;
}
const Pi = (n, e) => l`${n} > ${z(e, n)}`, ki = (n, e) => l`${n} >= ${z(e, n)}`, Ui = (n, e) => l`${n} < ${z(e, n)}`, Mi = (n, e) => l`${n} <= ${z(e, n)}`;
function Fi(n, e) {
  return Array.isArray(e) ? e.length === 0 ? l`false` : l`${n} in ${e.map((t) => z(t, n))}` : l`${n} in ${z(e, n)}`;
}
function Ri(n, e) {
  return Array.isArray(e) ? e.length === 0 ? l`true` : l`${n} not in ${e.map((t) => z(t, n))}` : l`${n} not in ${z(e, n)}`;
}
function Ki(n) {
  return l`${n} is null`;
}
function zi(n) {
  return l`${n} is not null`;
}
function Ji(n) {
  return l`exists ${n}`;
}
function Vi(n) {
  return l`not exists ${n}`;
}
function Xi(n, e, t) {
  return l`${n} between ${z(e, n)} and ${z(
    t,
    n
  )}`;
}
function Yi(n, e, t) {
  return l`${n} not between ${z(
    e,
    n
  )} and ${z(t, n)}`;
}
function Gi(n, e) {
  return l`${n} like ${e}`;
}
function Wi(n, e) {
  return l`${n} not like ${e}`;
}
function Hi(n, e) {
  return l`${n} ilike ${e}`;
}
function Zi(n, e) {
  return l`${n} not ilike ${e}`;
}
function ea(n) {
  return l`${n} asc`;
}
function ie(n) {
  return l`${n} desc`;
}
var lr;
lr = b;
class gt {
  constructor(e, t, r) {
    c(this, "referencedTableName");
    c(this, "fieldName");
    this.sourceTable = e, this.referencedTable = t, this.relationName = r, this.referencedTableName = t[S.Symbol.Name];
  }
}
c(gt, lr, "Relation");
var ur;
ur = b;
class Bs {
  constructor(e, t) {
    this.table = e, this.config = t;
  }
}
c(Bs, ur, "Relations");
var dr, mr;
const ke = class ke extends (mr = gt, dr = b, mr) {
  constructor(e, t, r, s) {
    super(e, t, r == null ? void 0 : r.relationName), this.config = r, this.isNullable = s;
  }
  withFieldName(e) {
    const t = new ke(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return t.fieldName = e, t;
  }
};
c(ke, dr, "One");
let pe = ke;
var hr, fr;
const Ue = class Ue extends (fr = gt, hr = b, fr) {
  constructor(e, t, r) {
    super(e, t, r == null ? void 0 : r.relationName), this.config = r;
  }
  withFieldName(e) {
    const t = new Ue(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return t.fieldName = e, t;
  }
};
c(Ue, hr, "Many");
let qe = Ue;
function ta() {
  return {
    and: k,
    between: Xi,
    eq: m,
    exists: Ji,
    gt: Pi,
    gte: ki,
    ilike: Hi,
    inArray: Fi,
    isNull: Ki,
    isNotNull: zi,
    like: Gi,
    lt: Ui,
    lte: Mi,
    ne: qi,
    not: ji,
    notBetween: Yi,
    notExists: Vi,
    notLike: Wi,
    notIlike: Zi,
    notInArray: Ri,
    or: Di,
    sql: l
  };
}
function ra() {
  return {
    sql: l,
    asc: ea,
    desc: ie
  };
}
function na(n, e) {
  var i;
  Object.keys(n).length === 1 && "default" in n && !p(n.default, S) && (n = n.default);
  const t = {}, r = {}, s = {};
  for (const [o, a] of Object.entries(n))
    if (p(a, S)) {
      const u = Ae(a), y = r[u];
      t[u] = o, s[o] = {
        tsName: o,
        dbName: a[S.Symbol.Name],
        schema: a[S.Symbol.Schema],
        columns: a[S.Symbol.Columns],
        relations: (y == null ? void 0 : y.relations) ?? {},
        primaryKey: (y == null ? void 0 : y.primaryKey) ?? []
      };
      for (const L of Object.values(
        a[S.Symbol.Columns]
      ))
        L.primary && s[o].primaryKey.push(L);
      const d = (i = a[S.Symbol.ExtraConfigBuilder]) == null ? void 0 : i.call(a, a[S.Symbol.ExtraConfigColumns]);
      if (d)
        for (const L of Object.values(d))
          p(L, Os) && s[o].primaryKey.push(...L.columns);
    } else if (p(a, Bs)) {
      const u = Ae(a.table), y = t[u], d = a.config(
        e(a.table)
      );
      let L;
      for (const [w, A] of Object.entries(d))
        if (y) {
          const N = s[y];
          N.relations[w] = A;
        } else
          u in r || (r[u] = {
            relations: {},
            primaryKey: L
          }), r[u].relations[w] = A;
    }
  return { tables: s, tableNamesMap: t };
}
function sa(n) {
  return function(t, r) {
    return new pe(
      n,
      t,
      r,
      (r == null ? void 0 : r.fields.reduce((s, i) => s && i.notNull, !0)) ?? !1
    );
  };
}
function ia(n) {
  return function(t, r) {
    return new qe(n, t, r);
  };
}
function aa(n, e, t) {
  if (p(t, pe) && t.config)
    return {
      fields: t.config.fields,
      references: t.config.references
    };
  const r = e[Ae(t.referencedTable)];
  if (!r)
    throw new Error(
      `Table "${t.referencedTable[S.Symbol.Name]}" not found in schema`
    );
  const s = n[r];
  if (!s)
    throw new Error(`Table "${r}" not found in schema`);
  const i = t.sourceTable, o = e[Ae(i)];
  if (!o)
    throw new Error(
      `Table "${i[S.Symbol.Name]}" not found in schema`
    );
  const a = [];
  for (const u of Object.values(
    s.relations
  ))
    (t.relationName && t !== u && u.relationName === t.relationName || !t.relationName && u.referencedTable === t.sourceTable) && a.push(u);
  if (a.length > 1)
    throw t.relationName ? new Error(
      `There are multiple relations with name "${t.relationName}" in table "${r}"`
    ) : new Error(
      `There are multiple relations between "${r}" and "${t.sourceTable[S.Symbol.Name]}". Please specify relation name`
    );
  if (a[0] && p(a[0], pe) && a[0].config)
    return {
      fields: a[0].config.references,
      references: a[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${o}.${t.fieldName}"`
  );
}
function oa(n) {
  return {
    one: sa(n),
    many: ia(n)
  };
}
function it(n, e, t, r, s = (i) => i) {
  const i = {};
  for (const [
    o,
    a
  ] of r.entries())
    if (a.isJson) {
      const u = e.relations[a.tsKey], y = t[o], d = typeof y == "string" ? JSON.parse(y) : y;
      i[a.tsKey] = p(u, pe) ? d && it(
        n,
        n[a.relationTableTsKey],
        d,
        a.selection,
        s
      ) : d.map(
        (L) => it(
          n,
          n[a.relationTableTsKey],
          L,
          a.selection,
          s
        )
      );
    } else {
      const u = s(t[o]), y = a.field;
      let d;
      p(y, j) ? d = y : p(y, v) ? d = y.decoder : d = y.sql.decoder, i[a.tsKey] = u === null ? null : d.mapFromDriverValue(u);
    }
  return i;
}
var pr;
pr = b;
class ve {
  constructor(e) {
    this.table = e;
  }
  get(e, t) {
    return t === "table" ? this.table : e[t];
  }
}
c(ve, pr, "ColumnAliasProxyHandler");
var yr;
yr = b;
class Ke {
  constructor(e, t) {
    this.alias = e, this.replaceOriginalName = t;
  }
  get(e, t) {
    if (t === S.Symbol.IsAlias)
      return !0;
    if (t === S.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && t === S.Symbol.OriginalName)
      return this.alias;
    if (t === K)
      return {
        ...e[K],
        name: this.alias,
        isAlias: !0
      };
    if (t === S.Symbol.Columns) {
      const s = e[S.Symbol.Columns];
      if (!s)
        return s;
      const i = {};
      return Object.keys(s).map((o) => {
        i[o] = new Proxy(
          s[o],
          new ve(new Proxy(e, this))
        );
      }), i;
    }
    const r = e[t];
    return p(r, j) ? new Proxy(r, new ve(new Proxy(e, this))) : r;
  }
}
c(Ke, yr, "TableAliasProxyHandler");
function Ze(n, e) {
  return new Proxy(n, new Ke(e, !1));
}
function re(n, e) {
  return new Proxy(
    n,
    new ve(new Proxy(n.table, new Ke(e, !1)))
  );
}
function Qs(n, e) {
  return new v.Aliased(De(n.sql, e), n.fieldAlias);
}
function De(n, e) {
  return l.join(n.queryChunks.map((t) => p(t, j) ? re(t, e) : p(t, v) ? De(t, e) : p(t, v.Aliased) ? Qs(t, e) : t));
}
var br;
br = b;
const Me = class Me {
  constructor(e) {
    c(this, "config");
    this.config = { ...e };
  }
  get(e, t) {
    if (t === "_")
      return {
        ...e._,
        selectedFields: new Proxy(
          e._.selectedFields,
          this
        )
      };
    if (t === K)
      return {
        ...e[K],
        selectedFields: new Proxy(
          e[K].selectedFields,
          this
        )
      };
    if (typeof t == "symbol")
      return e[t];
    const s = (p(e, G) ? e._.selectedFields : p(e, be) ? e[K].selectedFields : e)[t];
    if (p(s, v.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !s.isSelectionField)
        return s.sql;
      const i = s.clone();
      return i.isSelectionField = !0, i;
    }
    if (p(s, v)) {
      if (this.config.sqlBehavior === "sql")
        return s;
      throw new Error(
        `You tried to reference "${t}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return p(s, j) ? this.config.alias ? new Proxy(
      s,
      new ve(
        new Proxy(
          s.table,
          new Ke(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : s : typeof s != "object" || s === null ? s : new Proxy(s, new Me(this.config));
  }
};
c(Me, br, "SelectionProxyHandler");
let R = Me;
var gr, wr;
wr = b, gr = Symbol.toStringTag;
class le {
  constructor() {
    c(this, gr, "QueryPromise");
  }
  catch(e) {
    return this.then(void 0, e);
  }
  finally(e) {
    return this.then(
      (t) => (e == null || e(), t),
      (t) => {
        throw e == null || e(), t;
      }
    );
  }
  then(e, t) {
    return this.execute().then(e, t);
  }
}
c(le, wr, "QueryPromise");
var Sr;
Sr = b;
class qs {
  constructor(e, t) {
    /** @internal */
    c(this, "reference");
    /** @internal */
    c(this, "_onUpdate");
    /** @internal */
    c(this, "_onDelete");
    this.reference = () => {
      const { name: r, columns: s, foreignColumns: i } = e();
      return { name: r, columns: s, foreignTable: i[0].table, foreignColumns: i };
    }, t && (this._onUpdate = t.onUpdate, this._onDelete = t.onDelete);
  }
  onUpdate(e) {
    return this._onUpdate = e, this;
  }
  onDelete(e) {
    return this._onDelete = e, this;
  }
  /** @internal */
  build(e) {
    return new Ds(e, this);
  }
}
c(qs, Sr, "SQLiteForeignKeyBuilder");
var Tr;
Tr = b;
class Ds {
  constructor(e, t) {
    c(this, "reference");
    c(this, "onUpdate");
    c(this, "onDelete");
    this.table = e, this.reference = t.reference, this.onUpdate = t._onUpdate, this.onDelete = t._onDelete;
  }
  getName() {
    const { name: e, columns: t, foreignColumns: r } = this.reference(), s = t.map((a) => a.name), i = r.map((a) => a.name), o = [
      this.table[ce],
      ...s,
      r[0].table[ce],
      ...i
    ];
    return e ?? `${o.join("_")}_fk`;
  }
}
c(Ds, Tr, "SQLiteForeignKey");
function ca(n, e) {
  return `${n[ce]}_${e.join("_")}_unique`;
}
var Nr, Er;
class te extends (Er = As, Nr = b, Er) {
  constructor() {
    super(...arguments);
    c(this, "foreignKeyConfigs", []);
  }
  references(t, r = {}) {
    return this.foreignKeyConfigs.push({ ref: t, actions: r }), this;
  }
  unique(t) {
    return this.config.isUnique = !0, this.config.uniqueName = t, this;
  }
  generatedAlwaysAs(t, r) {
    return this.config.generated = {
      as: t,
      type: "always",
      mode: (r == null ? void 0 : r.mode) ?? "virtual"
    }, this;
  }
  /** @internal */
  buildForeignKeys(t, r) {
    return this.foreignKeyConfigs.map(({ ref: s, actions: i }) => ((o, a) => {
      const u = new qs(() => {
        const y = o();
        return { columns: [t], foreignColumns: [y] };
      });
      return a.onUpdate && u.onUpdate(a.onUpdate), a.onDelete && u.onDelete(a.onDelete), u.build(r);
    })(s, i));
  }
}
c(te, Nr, "SQLiteColumnBuilder");
var _r, Lr;
class J extends (Lr = j, _r = b, Lr) {
  constructor(e, t) {
    t.uniqueName || (t.uniqueName = ca(e, [t.name])), super(e, t), this.table = e;
  }
}
c(J, _r, "SQLiteColumn");
var Ar, vr;
class js extends (vr = te, Ar = b, vr) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Ps(e, this.config);
  }
}
c(js, Ar, "SQLiteBigIntBuilder");
var Cr, Ir;
class Ps extends (Ir = J, Cr = b, Ir) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    return BigInt(Buffer.isBuffer(e) ? e.toString() : String.fromCodePoint(...e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
c(Ps, Cr, "SQLiteBigInt");
var $r, Or;
class ks extends (Or = te, $r = b, Or) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Us(
      e,
      this.config
    );
  }
}
c(ks, $r, "SQLiteBlobJsonBuilder");
var xr, Br;
class Us extends (Br = J, xr = b, Br) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    return JSON.parse(Buffer.isBuffer(e) ? e.toString() : String.fromCodePoint(...e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
c(Us, xr, "SQLiteBlobJson");
var Qr, qr;
class Ms extends (qr = te, Qr = b, qr) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new Fs(e, this.config);
  }
}
c(Ms, Qr, "SQLiteBlobBufferBuilder");
var Dr, jr;
class Fs extends (jr = J, Dr = b, jr) {
  getSQLType() {
    return "blob";
  }
}
c(Fs, Dr, "SQLiteBlobBuffer");
function la(n, e) {
  const { name: t, config: r } = Re(n, e);
  return (r == null ? void 0 : r.mode) === "json" ? new ks(t) : (r == null ? void 0 : r.mode) === "bigint" ? new js(t) : new Ms(t);
}
var Pr, kr;
class Rs extends (kr = te, Pr = b, kr) {
  constructor(e, t, r) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = t, this.config.customTypeParams = r;
  }
  /** @internal */
  build(e) {
    return new Ks(
      e,
      this.config
    );
  }
}
c(Rs, Pr, "SQLiteCustomColumnBuilder");
var Ur, Mr;
class Ks extends (Mr = J, Ur = b, Mr) {
  constructor(t, r) {
    super(t, r);
    c(this, "sqlName");
    c(this, "mapTo");
    c(this, "mapFrom");
    this.sqlName = r.customTypeParams.dataType(r.fieldConfig), this.mapTo = r.customTypeParams.toDriver, this.mapFrom = r.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(t) {
    return typeof this.mapFrom == "function" ? this.mapFrom(t) : t;
  }
  mapToDriverValue(t) {
    return typeof this.mapTo == "function" ? this.mapTo(t) : t;
  }
}
c(Ks, Ur, "SQLiteCustomColumn");
function ua(n) {
  return (e, t) => {
    const { name: r, config: s } = Re(e, t);
    return new Rs(
      r,
      s,
      n
    );
  };
}
var Fr, Rr;
class ze extends (Rr = te, Fr = b, Rr) {
  constructor(e, t, r) {
    super(e, t, r), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
c(ze, Fr, "SQLiteBaseIntegerBuilder");
var Kr, zr;
class Je extends (zr = J, Kr = b, zr) {
  constructor() {
    super(...arguments);
    c(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
c(Je, Kr, "SQLiteBaseInteger");
var Jr, Vr;
class zs extends (Vr = ze, Jr = b, Vr) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new Js(
      e,
      this.config
    );
  }
}
c(zs, Jr, "SQLiteIntegerBuilder");
var Xr, Yr;
class Js extends (Yr = Je, Xr = b, Yr) {
}
c(Js, Xr, "SQLiteInteger");
var Gr, Wr;
class Vs extends (Wr = ze, Gr = b, Wr) {
  constructor(e, t) {
    super(e, "date", "SQLiteTimestamp"), this.config.mode = t;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(l`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e) {
    return new Xs(
      e,
      this.config
    );
  }
}
c(Vs, Gr, "SQLiteTimestampBuilder");
var Hr, Zr;
class Xs extends (Zr = Je, Hr = b, Zr) {
  constructor() {
    super(...arguments);
    c(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return this.config.mode === "timestamp" ? new Date(t * 1e3) : new Date(t);
  }
  mapToDriverValue(t) {
    const r = t.getTime();
    return this.config.mode === "timestamp" ? Math.floor(r / 1e3) : r;
  }
}
c(Xs, Hr, "SQLiteTimestamp");
var en, tn;
class Ys extends (tn = ze, en = b, tn) {
  constructor(e, t) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = t;
  }
  build(e) {
    return new Gs(
      e,
      this.config
    );
  }
}
c(Ys, en, "SQLiteBooleanBuilder");
var rn, nn;
class Gs extends (nn = Je, rn = b, nn) {
  constructor() {
    super(...arguments);
    c(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return Number(t) === 1;
  }
  mapToDriverValue(t) {
    return t ? 1 : 0;
  }
}
c(Gs, rn, "SQLiteBoolean");
function ye(n, e) {
  const { name: t, config: r } = Re(n, e);
  return (r == null ? void 0 : r.mode) === "timestamp" || (r == null ? void 0 : r.mode) === "timestamp_ms" ? new Vs(t, r.mode) : (r == null ? void 0 : r.mode) === "boolean" ? new Ys(t, r.mode) : new zs(t);
}
var sn, an;
class Ws extends (an = te, sn = b, an) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new Hs(
      e,
      this.config
    );
  }
}
c(Ws, sn, "SQLiteNumericBuilder");
var on, cn;
class Hs extends (cn = J, on = b, cn) {
  getSQLType() {
    return "numeric";
  }
}
c(Hs, on, "SQLiteNumeric");
function da(n) {
  return new Ws(n ?? "");
}
var ln, un;
class Zs extends (un = te, ln = b, un) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new ei(e, this.config);
  }
}
c(Zs, ln, "SQLiteRealBuilder");
var dn, mn;
class ei extends (mn = J, dn = b, mn) {
  getSQLType() {
    return "real";
  }
}
c(ei, dn, "SQLiteReal");
function H(n) {
  return new Zs(n ?? "");
}
var hn, fn;
class ti extends (fn = te, hn = b, fn) {
  constructor(e, t) {
    super(e, "string", "SQLiteText"), this.config.enumValues = t.enum, this.config.length = t.length;
  }
  /** @internal */
  build(e) {
    return new ri(e, this.config);
  }
}
c(ti, hn, "SQLiteTextBuilder");
var pn, yn;
class ri extends (yn = J, pn = b, yn) {
  constructor(t, r) {
    super(t, r);
    c(this, "enumValues", this.config.enumValues);
    c(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
c(ri, pn, "SQLiteText");
var bn, gn;
class ni extends (gn = te, bn = b, gn) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new si(
      e,
      this.config
    );
  }
}
c(ni, bn, "SQLiteTextJsonBuilder");
var wn, Sn;
class si extends (Sn = J, wn = b, Sn) {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(e) {
    return JSON.parse(e);
  }
  mapToDriverValue(e) {
    return JSON.stringify(e);
  }
}
c(si, wn, "SQLiteTextJson");
function _(n, e = {}) {
  const { name: t, config: r } = Re(n, e);
  return r.mode === "json" ? new ni(t) : new ti(t, r);
}
function ma() {
  return {
    blob: la,
    customType: ua,
    integer: ye,
    numeric: da,
    real: H,
    text: _
  };
}
const at = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Tn, Nn, En, _n, Ln;
class Y extends (Ln = S, _n = b, En = S.Symbol.Columns, Nn = at, Tn = S.Symbol.ExtraConfigBuilder, Ln) {
  constructor() {
    super(...arguments);
    /** @internal */
    c(this, En);
    /** @internal */
    c(this, Nn, []);
    /** @internal */
    c(this, Tn);
  }
}
c(Y, _n, "SQLiteTable"), /** @internal */
c(Y, "Symbol", Object.assign({}, S.Symbol, {
  InlineForeignKeys: at
}));
function ha(n, e, t, r, s = n) {
  const i = new Y(n, r, s), o = typeof e == "function" ? e(ma()) : e, a = Object.fromEntries(
    Object.entries(o).map(([y, d]) => {
      const L = d;
      L.setName(y);
      const w = L.build(i);
      return i[at].push(...L.buildForeignKeys(w, i)), [y, w];
    })
  ), u = Object.assign(i, a);
  return u[S.Symbol.Columns] = a, u[S.Symbol.ExtraConfigColumns] = a, u;
}
const ae = (n, e, t) => ha(n, e);
var An, vn;
class ot extends (vn = le, An = b, vn) {
  constructor(t, r, s, i) {
    super();
    /** @internal */
    c(this, "config");
    c(this, "run", (t) => this._prepare().run(t));
    c(this, "all", (t) => this._prepare().all(t));
    c(this, "get", (t) => this._prepare().get(t));
    c(this, "values", (t) => this._prepare().values(t));
    this.table = t, this.session = r, this.dialect = s, this.config = { table: t, withList: i };
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return this.config.where = t, this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const r = t[0](
        new Proxy(
          this.config.table[S.Symbol.Columns],
          new R({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(r) ? r : [r];
      this.config.orderBy = s;
    } else {
      const r = t;
      this.config.orderBy = r;
    }
    return this;
  }
  limit(t) {
    return this.config.limit = t, this;
  }
  returning(t = this.table[Y.Symbol.Columns]) {
    return this.config.returning = fe(t), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...r } = this.dialect.sqlToQuery(this.getSQL());
    return r;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute(t) {
    return this._prepare().execute(t);
  }
  $dynamic() {
    return this;
  }
}
c(ot, An, "SQLiteDelete");
function fa(n) {
  return (n.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((t) => t.toLowerCase()).join("_");
}
function pa(n) {
  return (n.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((t, r, s) => {
    const i = s === 0 ? r.toLowerCase() : `${r[0].toUpperCase()}${r.slice(1)}`;
    return t + i;
  }, "");
}
function ya(n) {
  return n;
}
var Cn;
Cn = b;
class ii {
  constructor(e) {
    /** @internal */
    c(this, "cache", {});
    c(this, "cachedTables", {});
    c(this, "convert");
    this.convert = e === "snake_case" ? fa : e === "camelCase" ? pa : ya;
  }
  getColumnCasing(e) {
    if (!e.keyAsName)
      return e.name;
    const t = e.table[S.Symbol.Schema] ?? "public", r = e.table[S.Symbol.OriginalName], s = `${t}.${r}.${e.name}`;
    return this.cache[s] || this.cacheTable(e.table), this.cache[s];
  }
  cacheTable(e) {
    const t = e[S.Symbol.Schema] ?? "public", r = e[S.Symbol.OriginalName], s = `${t}.${r}`;
    if (!this.cachedTables[s]) {
      for (const i of Object.values(e[S.Symbol.Columns])) {
        const o = `${s}.${i.name}`;
        this.cache[o] = this.convert(i.name);
      }
      this.cachedTables[s] = !0;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
}
c(ii, Cn, "CasingCache");
var In, $n;
class Ve extends ($n = Error, In = b, $n) {
  constructor({ message: e, cause: t }) {
    super(e), this.name = "DrizzleError", this.cause = t;
  }
}
c(Ve, In, "DrizzleError");
var On, xn;
class ai extends (xn = Ve, On = b, xn) {
  constructor() {
    super({ message: "Rollback" });
  }
}
c(ai, On, "TransactionRollbackError");
var Bn, Qn;
class Xe extends (Qn = be, Bn = b, Qn) {
}
c(Xe, Bn, "SQLiteViewBase");
var qn;
qn = b;
class je {
  constructor(e) {
    /** @internal */
    c(this, "casing");
    this.casing = new ii(e == null ? void 0 : e.casing);
  }
  escapeName(e) {
    return `"${e}"`;
  }
  escapeParam(e) {
    return "?";
  }
  escapeString(e) {
    return `'${e.replace(/'/g, "''")}'`;
  }
  buildWithCTE(e) {
    if (!(e != null && e.length))
      return;
    const t = [l`with `];
    for (const [r, s] of e.entries())
      t.push(l`${l.identifier(s._.alias)} as (${s._.sql})`), r < e.length - 1 && t.push(l`, `);
    return t.push(l` `), l.join(t);
  }
  buildDeleteQuery({ table: e, where: t, returning: r, withList: s, limit: i, orderBy: o }) {
    const a = this.buildWithCTE(s), u = r ? l` returning ${this.buildSelection(r, { isSingleTable: !0 })}` : void 0, y = t ? l` where ${t}` : void 0, d = this.buildOrderBy(o), L = this.buildLimit(i);
    return l`${a}delete from ${e}${y}${u}${d}${L}`;
  }
  buildUpdateSet(e, t) {
    const r = e[S.Symbol.Columns], s = Object.keys(r).filter(
      (o) => {
        var a;
        return t[o] !== void 0 || ((a = r[o]) == null ? void 0 : a.onUpdateFn) !== void 0;
      }
    ), i = s.length;
    return l.join(s.flatMap((o, a) => {
      const u = r[o], y = t[o] ?? l.param(u.onUpdateFn(), u), d = l`${l.identifier(this.casing.getColumnCasing(u))} = ${y}`;
      return a < i - 1 ? [d, l.raw(", ")] : [d];
    }));
  }
  buildUpdateQuery({ table: e, set: t, where: r, returning: s, withList: i, joins: o, from: a, limit: u, orderBy: y }) {
    const d = this.buildWithCTE(i), L = this.buildUpdateSet(e, t), w = a && l.join([l.raw(" from "), this.buildFromTable(a)]), A = this.buildJoins(o), N = s ? l` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, T = r ? l` where ${r}` : void 0, B = this.buildOrderBy(y), Q = this.buildLimit(u);
    return l`${d}update ${e} set ${L}${w}${A}${T}${N}${B}${Q}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(e, { isSingleTable: t = !1 } = {}) {
    const r = e.length, s = e.flatMap(({ field: i }, o) => {
      const a = [];
      if (p(i, v.Aliased) && i.isSelectionField)
        a.push(l.identifier(i.fieldAlias));
      else if (p(i, v.Aliased) || p(i, v)) {
        const u = p(i, v.Aliased) ? i.sql : i;
        t ? a.push(
          new v(
            u.queryChunks.map((y) => p(y, j) ? l.identifier(this.casing.getColumnCasing(y)) : y)
          )
        ) : a.push(u), p(i, v.Aliased) && a.push(l` as ${l.identifier(i.fieldAlias)}`);
      } else if (p(i, j)) {
        const u = i.table[S.Symbol.Name];
        t ? a.push(l.identifier(this.casing.getColumnCasing(i))) : a.push(l`${l.identifier(u)}.${l.identifier(this.casing.getColumnCasing(i))}`);
      }
      return o < r - 1 && a.push(l`, `), a;
    });
    return l.join(s);
  }
  buildJoins(e) {
    if (!e || e.length === 0)
      return;
    const t = [];
    if (e)
      for (const [r, s] of e.entries()) {
        r === 0 && t.push(l` `);
        const i = s.table;
        if (p(i, Y)) {
          const o = i[Y.Symbol.Name], a = i[Y.Symbol.Schema], u = i[Y.Symbol.OriginalName], y = o === u ? void 0 : s.alias;
          t.push(
            l`${l.raw(s.joinType)} join ${a ? l`${l.identifier(a)}.` : void 0}${l.identifier(u)}${y && l` ${l.identifier(y)}`} on ${s.on}`
          );
        } else
          t.push(
            l`${l.raw(s.joinType)} join ${i} on ${s.on}`
          );
        r < e.length - 1 && t.push(l` `);
      }
    return l.join(t);
  }
  buildLimit(e) {
    return typeof e == "object" || typeof e == "number" && e >= 0 ? l` limit ${e}` : void 0;
  }
  buildOrderBy(e) {
    const t = [];
    if (e)
      for (const [r, s] of e.entries())
        t.push(s), r < e.length - 1 && t.push(l`, `);
    return t.length > 0 ? l` order by ${l.join(t)}` : void 0;
  }
  buildFromTable(e) {
    return p(e, S) && e[S.Symbol.OriginalName] !== e[S.Symbol.Name] ? l`${l.identifier(e[S.Symbol.OriginalName])} ${l.identifier(e[S.Symbol.Name])}` : e;
  }
  buildSelectQuery({
    withList: e,
    fields: t,
    fieldsFlat: r,
    where: s,
    having: i,
    table: o,
    joins: a,
    orderBy: u,
    groupBy: y,
    limit: d,
    offset: L,
    distinct: w,
    setOperators: A
  }) {
    const N = r ?? fe(t);
    for (const W of N)
      if (p(W.field, j) && Ne(W.field.table) !== (p(o, G) ? o._.alias : p(o, Xe) ? o[K].name : p(o, v) ? void 0 : Ne(o)) && !((Z) => a == null ? void 0 : a.some(
        ({ alias: Ie }) => Ie === (Z[S.Symbol.IsAlias] ? Ne(Z) : Z[S.Symbol.BaseName])
      ))(W.field.table)) {
        const Z = Ne(W.field.table);
        throw new Error(
          `Your "${W.path.join("->")}" field references a column "${Z}"."${W.field.name}", but the table "${Z}" is not part of the query! Did you forget to join it?`
        );
      }
    const T = !a || a.length === 0, B = this.buildWithCTE(e), Q = w ? l` distinct` : void 0, P = this.buildSelection(N, { isSingleTable: T }), M = this.buildFromTable(o), E = this.buildJoins(a), O = s ? l` where ${s}` : void 0, F = i ? l` having ${i}` : void 0, I = [];
    if (y)
      for (const [W, Z] of y.entries())
        I.push(Z), W < y.length - 1 && I.push(l`, `);
    const D = I.length > 0 ? l` group by ${l.join(I)}` : void 0, V = this.buildOrderBy(u), Ce = this.buildLimit(d), Ge = L ? l` offset ${L}` : void 0, ge = l`${B}select${Q} ${P} from ${M}${E}${O}${D}${F}${V}${Ce}${Ge}`;
    return A.length > 0 ? this.buildSetOperations(ge, A) : ge;
  }
  buildSetOperations(e, t) {
    const [r, ...s] = t;
    if (!r)
      throw new Error("Cannot pass undefined values to any set operator");
    return s.length === 0 ? this.buildSetOperationQuery({ leftSelect: e, setOperator: r }) : this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect: e, setOperator: r }),
      s
    );
  }
  buildSetOperationQuery({
    leftSelect: e,
    setOperator: { type: t, isAll: r, rightSelect: s, limit: i, orderBy: o, offset: a }
  }) {
    const u = l`${e.getSQL()} `, y = l`${s.getSQL()}`;
    let d;
    if (o && o.length > 0) {
      const N = [];
      for (const T of o)
        if (p(T, J))
          N.push(l.identifier(T.name));
        else if (p(T, v)) {
          for (let B = 0; B < T.queryChunks.length; B++) {
            const Q = T.queryChunks[B];
            p(Q, J) && (T.queryChunks[B] = l.identifier(this.casing.getColumnCasing(Q)));
          }
          N.push(l`${T}`);
        } else
          N.push(l`${T}`);
      d = l` order by ${l.join(N, l`, `)}`;
    }
    const L = typeof i == "object" || typeof i == "number" && i >= 0 ? l` limit ${i}` : void 0, w = l.raw(`${t} ${r ? "all " : ""}`), A = a ? l` offset ${a}` : void 0;
    return l`${u}${w}${y}${d}${L}${A}`;
  }
  buildInsertQuery({ table: e, values: t, onConflict: r, returning: s, withList: i, select: o }) {
    const a = [], u = e[S.Symbol.Columns], y = Object.entries(u).filter(
      ([T, B]) => !B.shouldDisableInsert()
    ), d = y.map(([, T]) => l.identifier(this.casing.getColumnCasing(T)));
    if (o) {
      const T = t;
      p(T, v) ? a.push(T) : a.push(T.getSQL());
    } else {
      const T = t;
      a.push(l.raw("values "));
      for (const [B, Q] of T.entries()) {
        const P = [];
        for (const [M, E] of y) {
          const O = Q[M];
          if (O === void 0 || p(O, se) && O.value === void 0) {
            let F;
            if (E.default !== null && E.default !== void 0)
              F = p(E.default, v) ? E.default : l.param(E.default, E);
            else if (E.defaultFn !== void 0) {
              const I = E.defaultFn();
              F = p(I, v) ? I : l.param(I, E);
            } else if (!E.default && E.onUpdateFn !== void 0) {
              const I = E.onUpdateFn();
              F = p(I, v) ? I : l.param(I, E);
            } else
              F = l`null`;
            P.push(F);
          } else
            P.push(O);
        }
        a.push(P), B < T.length - 1 && a.push(l`, `);
      }
    }
    const L = this.buildWithCTE(i), w = l.join(a), A = s ? l` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, N = r ? l` on conflict ${r}` : void 0;
    return l`${L}insert into ${e} ${d} ${w}${N}${A}`;
  }
  sqlToQuery(e, t) {
    return e.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource: t
    });
  }
  buildRelationalQuery({
    fullSchema: e,
    schema: t,
    tableNamesMap: r,
    table: s,
    tableConfig: i,
    queryConfig: o,
    tableAlias: a,
    nestedQueryRelation: u,
    joinOn: y
  }) {
    let d = [], L, w, A = [], N;
    const T = [];
    if (o === !0)
      d = Object.entries(i.columns).map(([P, M]) => ({
        dbKey: M.name,
        tsKey: P,
        field: re(M, a),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const Q = Object.fromEntries(
        Object.entries(i.columns).map(([I, D]) => [I, re(D, a)])
      );
      if (o.where) {
        const I = typeof o.where == "function" ? o.where(Q, ta()) : o.where;
        N = I && De(I, a);
      }
      const P = [];
      let M = [];
      if (o.columns) {
        let I = !1;
        for (const [D, V] of Object.entries(o.columns))
          V !== void 0 && D in i.columns && (!I && V === !0 && (I = !0), M.push(D));
        M.length > 0 && (M = I ? M.filter((D) => {
          var V;
          return ((V = o.columns) == null ? void 0 : V[D]) === !0;
        }) : Object.keys(i.columns).filter((D) => !M.includes(D)));
      } else
        M = Object.keys(i.columns);
      for (const I of M) {
        const D = i.columns[I];
        P.push({ tsKey: I, value: D });
      }
      let E = [];
      o.with && (E = Object.entries(o.with).filter((I) => !!I[1]).map(([I, D]) => ({ tsKey: I, queryConfig: D, relation: i.relations[I] })));
      let O;
      if (o.extras) {
        O = typeof o.extras == "function" ? o.extras(Q, { sql: l }) : o.extras;
        for (const [I, D] of Object.entries(O))
          P.push({
            tsKey: I,
            value: Qs(D, a)
          });
      }
      for (const { tsKey: I, value: D } of P)
        d.push({
          dbKey: p(D, v.Aliased) ? D.fieldAlias : i.columns[I].name,
          tsKey: I,
          field: p(D, j) ? re(D, a) : D,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let F = typeof o.orderBy == "function" ? o.orderBy(Q, ra()) : o.orderBy ?? [];
      Array.isArray(F) || (F = [F]), A = F.map((I) => p(I, j) ? re(I, a) : De(I, a)), L = o.limit, w = o.offset;
      for (const {
        tsKey: I,
        queryConfig: D,
        relation: V
      } of E) {
        const Ce = aa(t, r, V), Ge = Ae(V.referencedTable), ge = r[Ge], W = `${a}_${I}`, Z = k(
          ...Ce.fields.map(
            (Ti, Ni) => m(
              re(Ce.references[Ni], W),
              re(Ti, a)
            )
          )
        ), Ie = this.buildRelationalQuery({
          fullSchema: e,
          schema: t,
          tableNamesMap: r,
          table: e[ge],
          tableConfig: t[ge],
          queryConfig: p(V, pe) ? D === !0 ? { limit: 1 } : { ...D, limit: 1 } : D,
          tableAlias: W,
          joinOn: Z,
          nestedQueryRelation: V
        }), Si = l`(${Ie.sql})`.as(I);
        d.push({
          dbKey: I,
          tsKey: I,
          field: Si,
          relationTableTsKey: ge,
          isJson: !0,
          selection: Ie.selection
        });
      }
    }
    if (d.length === 0)
      throw new Ve({
        message: `No fields selected for table "${i.tsName}" ("${a}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let B;
    if (N = k(y, N), u) {
      let Q = l`json_array(${l.join(
        d.map(
          ({ field: E }) => p(E, J) ? l.identifier(this.casing.getColumnCasing(E)) : p(E, v.Aliased) ? E.sql : E
        ),
        l`, `
      )})`;
      p(u, qe) && (Q = l`coalesce(json_group_array(${Q}), json_array())`);
      const P = [{
        dbKey: "data",
        tsKey: "data",
        field: Q.as("data"),
        isJson: !0,
        relationTableTsKey: i.tsName,
        selection: d
      }];
      L !== void 0 || w !== void 0 || A.length > 0 ? (B = this.buildSelectQuery({
        table: Ze(s, a),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: l.raw("*")
          }
        ],
        where: N,
        limit: L,
        offset: w,
        orderBy: A,
        setOperators: []
      }), N = void 0, L = void 0, w = void 0, A = void 0) : B = Ze(s, a), B = this.buildSelectQuery({
        table: p(B, Y) ? B : new G(B, {}, a),
        fields: {},
        fieldsFlat: P.map(({ field: E }) => ({
          path: [],
          field: p(E, j) ? re(E, a) : E
        })),
        joins: T,
        where: N,
        limit: L,
        offset: w,
        orderBy: A,
        setOperators: []
      });
    } else
      B = this.buildSelectQuery({
        table: Ze(s, a),
        fields: {},
        fieldsFlat: d.map(({ field: Q }) => ({
          path: [],
          field: p(Q, j) ? re(Q, a) : Q
        })),
        joins: T,
        where: N,
        limit: L,
        offset: w,
        orderBy: A,
        setOperators: []
      });
    return {
      tableTsKey: i.tsName,
      sql: B,
      selection: d
    };
  }
}
c(je, qn, "SQLiteDialect");
var Dn, jn;
class wt extends (jn = je, Dn = b, jn) {
  migrate(e, t, r) {
    const s = r === void 0 || typeof r == "string" ? "__drizzle_migrations" : r.migrationsTable ?? "__drizzle_migrations", i = l`
			CREATE TABLE IF NOT EXISTS ${l.identifier(s)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    t.run(i);
    const a = t.values(
      l`SELECT id, hash, created_at FROM ${l.identifier(s)} ORDER BY created_at DESC LIMIT 1`
    )[0] ?? void 0;
    t.run(l`BEGIN`);
    try {
      for (const u of e)
        if (!a || Number(a[2]) < u.folderMillis) {
          for (const y of u.sql)
            t.run(l.raw(y));
          t.run(
            l`INSERT INTO ${l.identifier(s)} ("hash", "created_at") VALUES(${u.hash}, ${u.folderMillis})`
          );
        }
      t.run(l`COMMIT`);
    } catch (u) {
      throw t.run(l`ROLLBACK`), u;
    }
  }
}
c(wt, Dn, "SQLiteSyncDialect");
var Pn;
Pn = b;
class oi {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
c(oi, Pn, "TypedQueryBuilder");
var kn;
kn = b;
class ne {
  constructor(e) {
    c(this, "fields");
    c(this, "session");
    c(this, "dialect");
    c(this, "withList");
    c(this, "distinct");
    this.fields = e.fields, this.session = e.session, this.dialect = e.dialect, this.withList = e.withList, this.distinct = e.distinct;
  }
  from(e) {
    const t = !!this.fields;
    let r;
    return this.fields ? r = this.fields : p(e, G) ? r = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : p(e, Xe) ? r = e[K].selectedFields : p(e, v) ? r = {} : r = Bi(e), new St({
      table: e,
      fields: r,
      isPartialSelect: t,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}
c(ne, kn, "SQLiteSelectBuilder");
var Un, Mn;
class ci extends (Mn = oi, Un = b, Mn) {
  constructor({ table: t, fields: r, isPartialSelect: s, session: i, dialect: o, withList: a, distinct: u }) {
    super();
    c(this, "_");
    /** @internal */
    c(this, "config");
    c(this, "joinsNotNullableMap");
    c(this, "tableName");
    c(this, "isPartialSelect");
    c(this, "session");
    c(this, "dialect");
    /**
     * Executes a `left join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    c(this, "leftJoin", this.createJoin("left"));
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    c(this, "rightJoin", this.createJoin("right"));
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    c(this, "innerJoin", this.createJoin("inner"));
    /**
     * Executes a `full join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    c(this, "fullJoin", this.createJoin("full"));
    /**
     * Adds `union` set operator to the query.
     *
     * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
     *
     * @example
     *
     * ```ts
     * // Select all unique names from customers and users tables
     * await db.select({ name: users.name })
     *   .from(users)
     *   .union(
     *     db.select({ name: customers.name }).from(customers)
     *   );
     * // or
     * import { union } from 'drizzle-orm/sqlite-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    c(this, "union", this.createSetOperator("union", !1));
    /**
     * Adds `union all` set operator to the query.
     *
     * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
     *
     * @example
     *
     * ```ts
     * // Select all transaction ids from both online and in-store sales
     * await db.select({ transaction: onlineSales.transactionId })
     *   .from(onlineSales)
     *   .unionAll(
     *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     *   );
     * // or
     * import { unionAll } from 'drizzle-orm/sqlite-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    c(this, "unionAll", this.createSetOperator("union", !0));
    /**
     * Adds `intersect` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
     *
     * @example
     *
     * ```ts
     * // Select course names that are offered in both departments A and B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .intersect(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { intersect } from 'drizzle-orm/sqlite-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    c(this, "intersect", this.createSetOperator("intersect", !1));
    /**
     * Adds `except` set operator to the query.
     *
     * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
     *
     * @example
     *
     * ```ts
     * // Select all courses offered in department A but not in department B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .except(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { except } from 'drizzle-orm/sqlite-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    c(this, "except", this.createSetOperator("except", !1));
    this.config = {
      withList: a,
      table: t,
      fields: { ...r },
      distinct: u,
      setOperators: []
    }, this.isPartialSelect = s, this.session = i, this.dialect = o, this._ = {
      selectedFields: r
    }, this.tableName = nt(t), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
  }
  createJoin(t) {
    return (r, s) => {
      var a;
      const i = this.tableName, o = nt(r);
      if (typeof o == "string" && ((a = this.config.joins) != null && a.some((u) => u.alias === o)))
        throw new Error(`Alias "${o}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof i == "string" && (this.config.fields = {
        [i]: this.config.fields
      }), typeof o == "string" && !p(r, v))) {
        const u = p(r, G) ? r._.selectedFields : p(r, be) ? r[K].selectedFields : r[S.Symbol.Columns];
        this.config.fields[o] = u;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new R({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      )), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: s, table: r, joinType: t, alias: o }), typeof o == "string")
        switch (t) {
          case "left": {
            this.joinsNotNullableMap[o] = !1;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([u]) => [u, !1])
            ), this.joinsNotNullableMap[o] = !0;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[o] = !0;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([u]) => [u, !1])
            ), this.joinsNotNullableMap[o] = !1;
            break;
          }
        }
      return this;
    };
  }
  createSetOperator(t, r) {
    return (s) => {
      const i = typeof s == "function" ? s(ba()) : s;
      if (!bt(this.getSelectedFields(), i.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      return this.config.setOperators.push({ type: t, isAll: r, rightSelect: i }), this;
    };
  }
  /** @internal */
  addSetOperators(t) {
    return this.config.setOperators.push(...t), this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return typeof t == "function" && (t = t(
      new Proxy(
        this.config.fields,
        new R({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.where = t, this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(t) {
    return typeof t == "function" && (t = t(
      new Proxy(
        this.config.fields,
        new R({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = t, this;
  }
  groupBy(...t) {
    if (typeof t[0] == "function") {
      const r = t[0](
        new Proxy(
          this.config.fields,
          new R({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(r) ? r : [r];
    } else
      this.config.groupBy = t;
    return this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const r = t[0](
        new Proxy(
          this.config.fields,
          new R({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(r) ? r : [r];
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = s : this.config.orderBy = s;
    } else {
      const r = t;
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = r : this.config.orderBy = r;
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(t) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = t : this.config.limit = t, this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(t) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = t : this.config.offset = t, this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...r } = this.dialect.sqlToQuery(this.getSQL());
    return r;
  }
  as(t) {
    return new Proxy(
      new G(this.getSQL(), this.config.fields, t),
      new R({ alias: t, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new R({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
c(ci, Un, "SQLiteSelectQueryBuilder");
var Fn, Rn;
class St extends (Rn = ci, Fn = b, Rn) {
  constructor() {
    super(...arguments);
    c(this, "run", (t) => this._prepare().run(t));
    c(this, "all", (t) => this._prepare().all(t));
    c(this, "get", (t) => this._prepare().get(t));
    c(this, "values", (t) => this._prepare().values(t));
  }
  /** @internal */
  _prepare(t = !0) {
    if (!this.session)
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    const r = fe(this.config.fields), s = this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      r,
      "all",
      !0
    );
    return s.joinsNotNullableMap = this.joinsNotNullableMap, s;
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.all();
  }
}
c(St, Fn, "SQLiteSelect");
xi(St, [le]);
function Ye(n, e) {
  return (t, r, ...s) => {
    const i = [r, ...s].map((o) => ({
      type: n,
      isAll: e,
      rightSelect: o
    }));
    for (const o of i)
      if (!bt(t.getSelectedFields(), o.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return t.addSetOperators(i);
  };
}
const ba = () => ({
  union: ga,
  unionAll: wa,
  intersect: Sa,
  except: Ta
}), ga = Ye("union", !1), wa = Ye("union", !0), Sa = Ye("intersect", !1), Ta = Ye("except", !1);
var Kn;
Kn = b;
class Tt {
  constructor(e) {
    c(this, "dialect");
    c(this, "dialectConfig");
    this.dialect = p(e, je) ? e : void 0, this.dialectConfig = p(e, je) ? void 0 : e;
  }
  $with(e) {
    const t = this;
    return {
      as(r) {
        return typeof r == "function" && (r = r(t)), new Proxy(
          new yt(r.getSQL(), r.getSelectedFields(), e, !0),
          new R({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  with(...e) {
    const t = this;
    function r(i) {
      return new ne({
        fields: i ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e
      });
    }
    function s(i) {
      return new ne({
        fields: i ?? void 0,
        session: void 0,
        dialect: t.getDialect(),
        withList: e,
        distinct: !0
      });
    }
    return { select: r, selectDistinct: s };
  }
  select(e) {
    return new ne({ fields: e ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(e) {
    return new ne({
      fields: e ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: !0
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    return this.dialect || (this.dialect = new wt(this.dialectConfig)), this.dialect;
  }
}
c(Tt, Kn, "SQLiteQueryBuilder");
var zn;
zn = b;
class ct {
  constructor(e, t, r, s) {
    this.table = e, this.session = t, this.dialect = r, this.withList = s;
  }
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const t = e.map((r) => {
      const s = {}, i = this.table[S.Symbol.Columns];
      for (const o of Object.keys(r)) {
        const a = r[o];
        s[o] = p(a, v) ? a : new se(a, i[o]);
      }
      return s;
    });
    return new lt(this.table, t, this.session, this.dialect, this.withList);
  }
  select(e) {
    const t = typeof e == "function" ? e(new Tt()) : e;
    if (!p(t, v) && !bt(this.table[tt], t._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new lt(this.table, t, this.session, this.dialect, this.withList, !0);
  }
}
c(ct, zn, "SQLiteInsertBuilder");
var Jn, Vn;
class lt extends (Vn = le, Jn = b, Vn) {
  constructor(t, r, s, i, o, a) {
    super();
    /** @internal */
    c(this, "config");
    c(this, "run", (t) => this._prepare().run(t));
    c(this, "all", (t) => this._prepare().all(t));
    c(this, "get", (t) => this._prepare().get(t));
    c(this, "values", (t) => this._prepare().values(t));
    this.session = s, this.dialect = i, this.config = { table: t, values: r, withList: o, select: a };
  }
  returning(t = this.config.table[Y.Symbol.Columns]) {
    return this.config.returning = fe(t), this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(t = {}) {
    if (t.target === void 0)
      this.config.onConflict = l`do nothing`;
    else {
      const r = Array.isArray(t.target) ? l`${t.target}` : l`${[t.target]}`, s = t.where ? l` where ${t.where}` : l``;
      this.config.onConflict = l`${r} do nothing${s}`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(t) {
    if (t.where && (t.targetWhere || t.setWhere))
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    const r = t.where ? l` where ${t.where}` : void 0, s = t.targetWhere ? l` where ${t.targetWhere}` : void 0, i = t.setWhere ? l` where ${t.setWhere}` : void 0, o = Array.isArray(t.target) ? l`${t.target}` : l`${[t.target]}`, a = this.dialect.buildUpdateSet(this.config.table, $s(this.config.table, t.set));
    return this.config.onConflict = l`${o}${s} do update set ${a}${r}${i}`, this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...r } = this.dialect.sqlToQuery(this.getSQL());
    return r;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
c(lt, Jn, "SQLiteInsert");
var Xn;
Xn = b;
class ut {
  constructor(e, t, r, s) {
    this.table = e, this.session = t, this.dialect = r, this.withList = s;
  }
  set(e) {
    return new li(
      this.table,
      $s(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
c(ut, Xn, "SQLiteUpdateBuilder");
var Yn, Gn;
class li extends (Gn = le, Yn = b, Gn) {
  constructor(t, r, s, i, o) {
    super();
    /** @internal */
    c(this, "config");
    c(this, "leftJoin", this.createJoin("left"));
    c(this, "rightJoin", this.createJoin("right"));
    c(this, "innerJoin", this.createJoin("inner"));
    c(this, "fullJoin", this.createJoin("full"));
    c(this, "run", (t) => this._prepare().run(t));
    c(this, "all", (t) => this._prepare().all(t));
    c(this, "get", (t) => this._prepare().get(t));
    c(this, "values", (t) => this._prepare().values(t));
    this.session = s, this.dialect = i, this.config = { set: r, table: t, withList: o, joins: [] };
  }
  from(t) {
    return this.config.from = t, this;
  }
  createJoin(t) {
    return (r, s) => {
      const i = nt(r);
      if (typeof i == "string" && this.config.joins.some((o) => o.alias === i))
        throw new Error(`Alias "${i}" is already used in this query`);
      if (typeof s == "function") {
        const o = this.config.from ? p(r, Y) ? r[S.Symbol.Columns] : p(r, G) ? r._.selectedFields : p(r, Xe) ? r[K].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[S.Symbol.Columns],
            new R({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          o && new Proxy(
            o,
            new R({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      return this.config.joins.push({ on: s, table: r, joinType: t, alias: i }), this;
    };
  }
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(t) {
    return this.config.where = t, this;
  }
  orderBy(...t) {
    if (typeof t[0] == "function") {
      const r = t[0](
        new Proxy(
          this.config.table[S.Symbol.Columns],
          new R({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(r) ? r : [r];
      this.config.orderBy = s;
    } else {
      const r = t;
      this.config.orderBy = r;
    }
    return this;
  }
  limit(t) {
    return this.config.limit = t, this;
  }
  returning(t = this.config.table[Y.Symbol.Columns]) {
    return this.config.returning = fe(t), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: t, ...r } = this.dialect.sqlToQuery(this.getSQL());
    return r;
  }
  /** @internal */
  _prepare(t = !0) {
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
c(li, Yn, "SQLiteUpdate");
var Wn, Hn, Zn;
const Le = class Le extends (Zn = v, Hn = b, Wn = Symbol.toStringTag, Zn) {
  constructor(t) {
    super(Le.buildEmbeddedCount(t.source, t.filters).queryChunks);
    c(this, "sql");
    c(this, Wn, "SQLiteCountBuilderAsync");
    c(this, "session");
    this.params = t, this.session = t.session, this.sql = Le.buildCount(
      t.source,
      t.filters
    );
  }
  static buildEmbeddedCount(t, r) {
    return l`(select count(*) from ${t}${l.raw(" where ").if(r)}${r})`;
  }
  static buildCount(t, r) {
    return l`select count(*) from ${t}${l.raw(" where ").if(r)}${r}`;
  }
  then(t, r) {
    return Promise.resolve(this.session.count(this.sql)).then(
      t,
      r
    );
  }
  catch(t) {
    return this.then(void 0, t);
  }
  finally(t) {
    return this.then(
      (r) => (t == null || t(), r),
      (r) => {
        throw t == null || t(), r;
      }
    );
  }
};
c(Le, Hn, "SQLiteCountBuilderAsync");
let dt = Le;
var es;
es = b;
class ui {
  constructor(e, t, r, s, i, o, a, u) {
    this.mode = e, this.fullSchema = t, this.schema = r, this.tableNamesMap = s, this.table = i, this.tableConfig = o, this.dialect = a, this.session = u;
  }
  findMany(e) {
    return this.mode === "sync" ? new mt(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new Pe(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    );
  }
  findFirst(e) {
    return this.mode === "sync" ? new mt(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new Pe(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    );
  }
}
c(ui, es, "SQLiteAsyncRelationalQueryBuilder");
var ts, rs;
class Pe extends (rs = le, ts = b, rs) {
  constructor(t, r, s, i, o, a, u, y, d) {
    super();
    /** @internal */
    c(this, "mode");
    this.fullSchema = t, this.schema = r, this.tableNamesMap = s, this.table = i, this.tableConfig = o, this.dialect = a, this.session = u, this.config = y, this.mode = d;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(t = !1) {
    const { query: r, builtQuery: s } = this._toSQL();
    return this.session[t ? "prepareOneTimeQuery" : "prepareQuery"](
      s,
      void 0,
      this.mode === "first" ? "get" : "all",
      !0,
      (i, o) => {
        const a = i.map(
          (u) => it(this.schema, this.tableConfig, u, r.selection, o)
        );
        return this.mode === "first" ? a[0] : a;
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  _toSQL() {
    const t = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }), r = this.dialect.sqlToQuery(t.sql);
    return { query: t, builtQuery: r };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    return this.mode === "first" ? this._prepare(!1).get() : this._prepare(!1).all();
  }
  async execute() {
    return this.executeRaw();
  }
}
c(Pe, ts, "SQLiteAsyncRelationalQuery");
var ns, ss;
class mt extends (ss = Pe, ns = b, ss) {
  sync() {
    return this.executeRaw();
  }
}
c(mt, ns, "SQLiteSyncRelationalQuery");
var is, as;
class _e extends (as = le, is = b, as) {
  constructor(t, r, s, i, o) {
    super();
    /** @internal */
    c(this, "config");
    this.execute = t, this.getSQL = r, this.dialect = i, this.mapBatchResult = o, this.config = { action: s };
  }
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(t, r) {
    return r ? this.mapBatchResult(t) : t;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return !1;
  }
}
c(_e, is, "SQLiteRaw");
var os;
os = b;
class Nt {
  constructor(e, t, r, s) {
    c(this, "query");
    this.resultKind = e, this.dialect = t, this.session = r, this._ = s ? {
      schema: s.schema,
      fullSchema: s.fullSchema,
      tableNamesMap: s.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    }, this.query = {};
    const i = this.query;
    if (this._.schema)
      for (const [o, a] of Object.entries(this._.schema))
        i[o] = new ui(
          e,
          s.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          s.fullSchema[o],
          a,
          t,
          r
        );
  }
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with(e) {
    const t = this;
    return {
      as(r) {
        return typeof r == "function" && (r = r(new Tt(t.dialect))), new Proxy(
          new yt(r.getSQL(), r.getSelectedFields(), e, !0),
          new R({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  $count(e, t) {
    return new dt({ source: e, filters: t, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...e) {
    const t = this;
    function r(u) {
      return new ne({
        fields: u ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e
      });
    }
    function s(u) {
      return new ne({
        fields: u ?? void 0,
        session: t.session,
        dialect: t.dialect,
        withList: e,
        distinct: !0
      });
    }
    function i(u) {
      return new ut(u, t.session, t.dialect, e);
    }
    function o(u) {
      return new ct(u, t.session, t.dialect, e);
    }
    function a(u) {
      return new ot(u, t.session, t.dialect, e);
    }
    return { select: r, selectDistinct: s, update: i, insert: o, delete: a };
  }
  select(e) {
    return new ne({ fields: e ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(e) {
    return new ne({
      fields: e ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: !0
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(e) {
    return new ut(e, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(e) {
    return new ct(e, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(e) {
    return new ot(e, this.session, this.dialect);
  }
  run(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new _e(
      async () => this.session.run(t),
      () => t,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(t);
  }
  all(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new _e(
      async () => this.session.all(t),
      () => t,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(t);
  }
  get(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new _e(
      async () => this.session.get(t),
      () => t,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(t);
  }
  values(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new _e(
      async () => this.session.values(t),
      () => t,
      "values",
      this.dialect,
      this.session.extractRawValuesValueFromBatchResult.bind(this.session)
    ) : this.session.values(t);
  }
  transaction(e, t) {
    return this.session.transaction(e, t);
  }
}
c(Nt, os, "BaseSQLiteDatabase");
var cs, ls;
class di extends (ls = le, cs = b, ls) {
  constructor(e) {
    super(), this.resultCb = e;
  }
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
}
c(di, cs, "ExecuteResultSync");
var us;
us = b;
class mi {
  constructor(e, t, r) {
    /** @internal */
    c(this, "joinsNotNullableMap");
    this.mode = e, this.executeMethod = t, this.query = r;
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(e, t) {
    return e;
  }
  mapAllResult(e, t) {
    throw new Error("Not implemented");
  }
  mapGetResult(e, t) {
    throw new Error("Not implemented");
  }
  execute(e) {
    return this.mode === "async" ? this[this.executeMethod](e) : new di(() => this[this.executeMethod](e));
  }
  mapResult(e, t) {
    switch (this.executeMethod) {
      case "run":
        return this.mapRunResult(e, t);
      case "all":
        return this.mapAllResult(e, t);
      case "get":
        return this.mapGetResult(e, t);
    }
  }
}
c(mi, us, "PreparedQuery");
var ds;
ds = b;
class hi {
  constructor(e) {
    this.dialect = e;
  }
  prepareOneTimeQuery(e, t, r, s) {
    return this.prepareQuery(e, t, r, s);
  }
  run(e) {
    const t = this.dialect.sqlToQuery(e);
    try {
      return this.prepareOneTimeQuery(t, void 0, "run", !1).run();
    } catch (r) {
      throw new Ve({ cause: r, message: `Failed to run the query '${t.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(e) {
    return e;
  }
  all(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  get(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  values(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).values();
  }
  async count(e) {
    return (await this.values(e))[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
}
c(hi, ds, "SQLiteSession");
var ms, hs;
class fi extends (hs = Nt, ms = b, hs) {
  constructor(e, t, r, s, i = 0) {
    super(e, t, r, s), this.schema = s, this.nestedIndex = i;
  }
  rollback() {
    throw new ai();
  }
}
c(fi, ms, "SQLiteTransaction");
var fs, ps;
class pi extends (ps = hi, fs = b, ps) {
  constructor(t, r, s, i = {}) {
    super(r);
    c(this, "logger");
    this.client = t, this.schema = s, this.logger = i.logger ?? new Ls();
  }
  prepareQuery(t, r, s, i, o) {
    const a = this.client.prepare(t.sql);
    return new yi(
      a,
      t,
      this.logger,
      r,
      s,
      i,
      o
    );
  }
  transaction(t, r = {}) {
    const s = new ht("sync", this.dialect, this, this.schema);
    return this.client.transaction(t)[r.behavior ?? "deferred"](s);
  }
}
c(pi, fs, "BetterSQLiteSession");
var ys, bs;
const Fe = class Fe extends (bs = fi, ys = b, bs) {
  transaction(e) {
    const t = `sp${this.nestedIndex}`, r = new Fe("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(l.raw(`savepoint ${t}`));
    try {
      const s = e(r);
      return this.session.run(l.raw(`release savepoint ${t}`)), s;
    } catch (s) {
      throw this.session.run(l.raw(`rollback to savepoint ${t}`)), s;
    }
  }
};
c(Fe, ys, "BetterSQLiteTransaction");
let ht = Fe;
var gs, ws;
class yi extends (ws = mi, gs = b, ws) {
  constructor(e, t, r, s, i, o, a) {
    super("sync", i, t), this.stmt = e, this.logger = r, this.fields = s, this._isResponseInArrayMode = o, this.customResultMapper = a;
  }
  run(e) {
    const t = $e(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.run(...t);
  }
  all(e) {
    const { fields: t, joinsNotNullableMap: r, query: s, logger: i, stmt: o, customResultMapper: a } = this;
    if (!t && !a) {
      const y = $e(s.params, e ?? {});
      return i.logQuery(s.sql, y), o.all(...y);
    }
    const u = this.values(e);
    return a ? a(u) : u.map((y) => vt(t, y, r));
  }
  get(e) {
    const t = $e(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, t);
    const { fields: r, stmt: s, joinsNotNullableMap: i, customResultMapper: o } = this;
    if (!r && !o)
      return s.get(...t);
    const a = s.raw().get(...t);
    if (a)
      return o ? o([a]) : vt(r, a, i);
  }
  values(e) {
    const t = $e(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.raw().all(...t);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
c(yi, gs, "BetterSQLitePreparedQuery");
var Ss, Ts;
class bi extends (Ts = Nt, Ss = b, Ts) {
}
c(bi, Ss, "BetterSQLite3Database");
function we(n, e = {}) {
  const t = new wt({ casing: e.casing });
  let r;
  e.logger === !0 ? r = new _s() : e.logger !== !1 && (r = e.logger);
  let s;
  if (e.schema) {
    const a = na(
      e.schema,
      oa
    );
    s = {
      fullSchema: e.schema,
      schema: a.tables,
      tableNamesMap: a.tableNamesMap
    };
  }
  const i = new pi(n, t, s, { logger: r }), o = new bi("sync", t, i, s);
  return o.$client = n, o;
}
function ft(...n) {
  if (n[0] === void 0 || typeof n[0] == "string") {
    const e = n[0] === void 0 ? new Ee() : new Ee(n[0]);
    return we(e, n[1]);
  }
  if (Qi(n[0])) {
    const { connection: e, client: t, ...r } = n[0];
    if (t)
      return we(t, r);
    if (typeof e == "object") {
      const { source: i, ...o } = e, a = new Ee(i, o);
      return we(a, r);
    }
    const s = new Ee(e);
    return we(s, r);
  }
  return we(n[0], n[1]);
}
((n) => {
  function e(t) {
    return we({}, t);
  }
  n.mock = e;
})(ft || (ft = {}));
const $ = ae("accounts", {
  id: _("id").primaryKey(),
  code: _("code").notNull().unique(),
  // e.g. "100", "100.001", "120.001", "600.001"
  name: _("name").notNull(),
  // e.g. "Merkez Kasa", "ABC Mobilya"
  type: _("type", {
    enum: ["asset", "liability", "equity", "revenue", "expense"]
  }).notNull(),
  parentCode: _("parent_code"),
  // e.g. "100" for "100.001"
  isActive: ye("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: _("created_at").notNull()
}), g = ae("entities", {
  id: _("id").primaryKey(),
  name: _("name").notNull(),
  type: _("type", {
    enum: ["customer", "supplier", "bank", "cash", "partner"]
  }).notNull(),
  accountId: _("account_id").notNull(),
  // Link to 120.xxx, 320.xxx, 102.xxx, 100.xxx, 500.xxx
  phone: _("phone"),
  taxNumber: _("tax_number"),
  address: _("address"),
  notes: _("notes"),
  isActive: ye("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: _("created_at").notNull()
}), gi = ae("categories", {
  id: _("id").primaryKey(),
  name: _("name").notNull(),
  type: _("type", { enum: ["income", "expense"] }).notNull(),
  accountId: _("account_id").notNull(),
  // Link to revenue/expense account
  isActive: ye("is_active", { mode: "boolean" }).default(!0).notNull()
}), C = ae("documents", {
  id: _("id").primaryKey(),
  docNumber: _("doc_number").notNull().unique(),
  // e.g. SAT-2026-00001
  type: _("type", {
    enum: [
      "sale",
      // Satış Belgesi
      "customer_payment",
      // Tahsilat Belgesi
      "purchase",
      // Satınalma Belgesi
      "supplier_payment",
      // Ödeme Belgesi
      "partner_draw",
      // Ortak Para Çekme
      "partner_deposit",
      // Ortak Para Yatırma
      "transfer",
      // Virman / Transfer (Kasa-Banka)
      "expense"
      // Gider Belgesi
    ]
  }).notNull(),
  date: _("date").notNull(),
  // ISO YYYY-MM-DD
  description: _("description"),
  totalAmount: H("total_amount").notNull(),
  createdAt: _("created_at").notNull()
}), f = ae("journal_entries", {
  id: _("id").primaryKey(),
  entryNumber: _("entry_number").notNull().unique(),
  // Fiş No e.g. YEV-2026-00001
  documentId: _("document_id"),
  date: _("date").notNull(),
  description: _("description").notNull(),
  status: _("status", { enum: ["active", "cancelled"] }).default("active").notNull(),
  createdAt: _("created_at").notNull()
}), h = ae("journal_items", {
  id: _("id").primaryKey(),
  journalEntryId: _("journal_entry_id").notNull().references(() => f.id, { onDelete: "cascade" }),
  accountId: _("account_id").notNull(),
  entityId: _("entity_id"),
  // Optional link to specific customer/supplier/bank/cash/partner entity
  debit: H("debit").default(0).notNull(),
  // Borç tutarı
  credit: H("credit").default(0).notNull(),
  // Alacak tutarı
  description: _("description")
}), ee = ae("settings", {
  id: _("id").primaryKey(),
  // 'app_settings'
  companyName: _("company_name").default("ABC Mobilya İmalat A.Ş.").notNull(),
  taxNumber: _("tax_number"),
  address: _("address"),
  phone: _("phone"),
  pinCode: _("pin_code"),
  // App lock pin code (e.g. '1234' or null)
  autoBackupEnabled: ye("auto_backup_enabled", { mode: "boolean" }).default(!0).notNull(),
  backupIntervalDays: ye("backup_interval_days").default(7).notNull(),
  lastBackupAt: _("last_backup_at"),
  updatedAt: _("updated_at").notNull()
}), X = ae("products", {
  id: _("id").primaryKey(),
  code: _("code").notNull().unique(),
  name: _("name").notNull(),
  category: _("category").default("Genel").notNull(),
  unit: _("unit").default("Adet").notNull(),
  purchasePrice: H("purchase_price").default(0).notNull(),
  salePrice: H("sale_price").default(0).notNull(),
  stockQuantity: H("stock_quantity").default(0).notNull(),
  minStockLevel: H("min_stock_level").default(5).notNull(),
  isActive: ye("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: _("created_at").notNull()
}), Se = ae("stock_movements", {
  id: _("id").primaryKey(),
  productId: _("product_id").notNull().references(() => X.id, { onDelete: "cascade" }),
  documentId: _("document_id"),
  type: _("type", { enum: ["in", "out"] }).notNull(),
  quantity: H("quantity").notNull(),
  unitPrice: H("unit_price").default(0).notNull(),
  totalPrice: H("total_price").default(0).notNull(),
  description: _("description"),
  date: _("date").notNull(),
  createdAt: _("created_at").notNull()
}), Na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accounts: $,
  categories: gi,
  documents: C,
  entities: g,
  journalEntries: f,
  journalItems: h,
  products: X,
  settings: ee,
  stockMovements: Se
}, Symbol.toStringTag, { value: "Module" }));
async function Ea(n) {
  if (n.select().from($).all().length > 0)
    return;
  const t = (/* @__PURE__ */ new Date()).toISOString(), r = [
    // 1 DÖNEN VARLIKLAR
    { id: "acc_100", code: "100", name: "Kasa", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_102", code: "102", name: "Bankalar", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_120", code: "120", name: "Alıcılar (Müşteriler)", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_121", code: "121", name: "Alacak Senetleri", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_150", code: "150", name: "İlk Madde ve Malzeme", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_153", code: "153", name: "Ticari Mallar", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_159", code: "159", name: "Verilen Sipariş Avansları", type: "asset", parentCode: null, createdAt: t },
    // 2 DURAN VARLIKLAR
    { id: "acc_252", code: "252", name: "Binalar", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_253", code: "253", name: "Tesis, Makine ve Cihazlar", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_254", code: "254", name: "Taşıtlar", type: "asset", parentCode: null, createdAt: t },
    { id: "acc_255", code: "255", name: "Demirbaşlar", type: "asset", parentCode: null, createdAt: t },
    // 3 KISA VADELİ YABANCI KAYNAKLAR
    { id: "acc_320", code: "320", name: "Satıcılar (Tedarikçiler)", type: "liability", parentCode: null, createdAt: t },
    { id: "acc_321", code: "321", name: "Borç Senetleri", type: "liability", parentCode: null, createdAt: t },
    { id: "acc_335", code: "335", name: "Personele Borçlar", type: "liability", parentCode: null, createdAt: t },
    { id: "acc_360", code: "360", name: "Ödenecek Vergiler ve Fonlar", type: "liability", parentCode: null, createdAt: t },
    { id: "acc_361", code: "361", name: "Ödenecek Sosyal Güvenlik Kesintileri", type: "liability", parentCode: null, createdAt: t },
    // 5 ÖZ KAYNAKLAR
    { id: "acc_500", code: "500", name: "Sermaye / Ortak Hesapları", type: "equity", parentCode: null, createdAt: t },
    // 6 GELİRLER
    { id: "acc_600", code: "600", name: "Mobilya Satış Gelirleri", type: "revenue", parentCode: null, createdAt: t },
    { id: "acc_601", code: "601", name: "Montaj ve Hizmet Gelirleri", type: "revenue", parentCode: null, createdAt: t },
    { id: "acc_602", code: "602", name: "Diğer Gelirler", type: "revenue", parentCode: null, createdAt: t },
    // 7 MALİYET & GİDERLER
    { id: "acc_710", code: "710", name: "Direkt İlk Madde ve Malzeme Giderleri", type: "expense", parentCode: null, createdAt: t },
    { id: "acc_720", code: "720", name: "Direkt İşçilik Giderleri", type: "expense", parentCode: null, createdAt: t },
    { id: "acc_730", code: "730", name: "Genel Üretim Giderleri", type: "expense", parentCode: null, createdAt: t },
    { id: "acc_760", code: "760", name: "Pazarlama Satış Dağıtım Giderleri", type: "expense", parentCode: null, createdAt: t },
    { id: "acc_770", code: "770", name: "Genel Yönetim Giderleri", type: "expense", parentCode: null, createdAt: t },
    // Sub-accounts
    { id: "acc_100_001", code: "100.001", name: "Merkez TL Kasa", type: "asset", parentCode: "100", createdAt: t },
    { id: "acc_102_001", code: "102.001", name: "Ziraat Bankası", type: "asset", parentCode: "102", createdAt: t },
    { id: "acc_102_002", code: "102.002", name: "Garanti BBVA", type: "asset", parentCode: "102", createdAt: t },
    { id: "acc_120_001", code: "120.001", name: "ABC Mobilya Sanayi", type: "asset", parentCode: "120", createdAt: t },
    { id: "acc_120_002", code: "120.002", name: "Stil İç Dekorasyon", type: "asset", parentCode: "120", createdAt: t },
    { id: "acc_320_001", code: "320.001", name: "MDF Ahşap A.Ş.", type: "liability", parentCode: "320", createdAt: t },
    { id: "acc_320_002", code: "320.002", name: "Orman Ürünleri Ltd.", type: "liability", parentCode: "320", createdAt: t },
    { id: "acc_500_001", code: "500.001", name: "Ortak Ahmet Yılmaz", type: "equity", parentCode: "500", createdAt: t },
    { id: "acc_500_002", code: "500.002", name: "Ortak Mehmet Kaya", type: "equity", parentCode: "500", createdAt: t },
    { id: "acc_500_003", code: "500.003", name: "Ortak Mustafa Demir", type: "equity", parentCode: "500", createdAt: t }
  ];
  n.insert($).values(r).run();
  const s = [
    {
      id: "ent_cash_001",
      name: "Merkez TL Kasa",
      type: "cash",
      accountId: "acc_100_001",
      phone: "",
      taxNumber: "",
      address: "Fabrika İçi Kasa",
      notes: "Ana Şirket Kasası",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_bank_001",
      name: "Ziraat Bankası - Ticari Hesabı",
      type: "bank",
      accountId: "acc_102_001",
      phone: "0850 220 0000",
      taxNumber: "TR9900001000022334455",
      address: "Organize Sanayi Şubesi",
      notes: "TR99 0001 0000 2233 4455 6677 88",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_bank_002",
      name: "Garanti BBVA - Kurumsal",
      type: "bank",
      accountId: "acc_102_002",
      phone: "0850 222 0333",
      taxNumber: "TR1100006200055443322",
      address: "Sanayi Şubesi",
      notes: "TR11 0006 2000 5544 3322 1100 99",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_cust_001",
      name: "ABC Mobilya Sanayi",
      type: "customer",
      accountId: "acc_120_001",
      phone: "0532 111 22 33",
      taxNumber: "1234567890",
      address: "Mobilyacılar Sitesi No: 45 İnegöl / Bursa",
      notes: "Mutfak Dolabı ve Masa Siparişi Müşterisi",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_cust_002",
      name: "Stil İç Dekorasyon",
      type: "customer",
      accountId: "acc_120_002",
      phone: "0533 444 55 66",
      taxNumber: "9876543210",
      address: "Siteler Karacakaya Cad. No: 12 Ankara",
      notes: "Villa Mutfak Ve Vestiyer Projesi",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_supp_001",
      name: "MDF Ahşap A.Ş.",
      type: "supplier",
      accountId: "acc_320_001",
      phone: "0224 888 77 66",
      taxNumber: "5554443332",
      address: "Keresteciler Sanayi Sitesi No: 100 Bursa",
      notes: "MDF Lam ve Sunta Tedarikçisi",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_supp_002",
      name: "Orman Ürünleri Ltd.",
      type: "supplier",
      accountId: "acc_320_002",
      phone: "0212 333 22 11",
      taxNumber: "7778889991",
      address: "İkitelli OSB Keresteciler Sit. No: 4 Istanbul",
      notes: "Aksesuar, Ray ve Menteşe Tedariği",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_partner_001",
      name: "Ahmet Yılmaz (Ortak %40)",
      type: "partner",
      accountId: "acc_500_001",
      phone: "0532 000 00 01",
      taxNumber: "11111111111",
      address: "Kurucu Ortak",
      notes: "%40 Şirket Hissedarı",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_partner_002",
      name: "Mehmet Kaya (Ortak %35)",
      type: "partner",
      accountId: "acc_500_002",
      phone: "0532 000 00 02",
      taxNumber: "22222222222",
      address: "Üretimden Sorumlu Ortak",
      notes: "%35 Şirket Hissedarı",
      isActive: !0,
      createdAt: t
    },
    {
      id: "ent_partner_003",
      name: "Mustafa Demir (Ortak %25)",
      type: "partner",
      accountId: "acc_500_003",
      phone: "0532 000 00 03",
      taxNumber: "33333333333",
      address: "Finans ve Pazarlama Sorumlusu",
      notes: "%25 Şirket Hissedarı",
      isActive: !0,
      createdAt: t
    }
  ];
  n.insert(g).values(s).run();
  const i = [
    { id: "cat_001", name: "Mobilya Satışı", type: "income", accountId: "acc_600", isActive: !0 },
    { id: "cat_002", name: "Montaj Geliri", type: "income", accountId: "acc_601", isActive: !0 },
    { id: "cat_003", name: "Diğer Gelirler", type: "income", accountId: "acc_602", isActive: !0 },
    { id: "cat_004", name: "MDF & Sunta Alımı", type: "expense", accountId: "acc_710", isActive: !0 },
    { id: "cat_005", name: "İşçilik & Maaş Ödemesi", type: "expense", accountId: "acc_720", isActive: !0 },
    { id: "cat_006", name: "Fabrika Elektrik & Su", type: "expense", accountId: "acc_730", isActive: !0 },
    { id: "cat_007", name: "Nakliye & Benzin Gideri", type: "expense", accountId: "acc_760", isActive: !0 },
    { id: "cat_008", name: "Ofis & Yemek Gideri", type: "expense", accountId: "acc_770", isActive: !0 }
  ];
  n.insert(gi).values(i).run(), n.insert(ee).values({
    id: "app_settings",
    companyName: "ABC Mobilya İmalat & Dekorasyon",
    taxNumber: "1234567890",
    address: "Organize Sanayi Bölgesi 4. Cadde No: 18 İnegöl / BURSA",
    phone: "0224 715 00 00",
    pinCode: null,
    autoBackupEnabled: !0,
    backupIntervalDays: 7,
    lastBackupAt: null,
    updatedAt: t
  }).run();
}
let Te = null, oe = null;
function x() {
  if (Te)
    return Te;
  const n = me.getPath("userData"), e = et.join(n, "cari_finance.db");
  return console.log("[SQLite DB Path]:", e), oe = new Ee(e), oe.pragma("journal_mode = WAL"), oe.pragma("foreign_keys = ON"), Te = ft(oe, { schema: Na }), _a(oe), Ea(Te).catch((t) => {
    console.error("[Database Seed Error]:", t);
  }), Te;
}
function _a(n) {
  n.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      parent_code TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      account_id TEXT NOT NULL,
      phone TEXT,
      tax_number TEXT,
      address TEXT,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      account_id TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      doc_number TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      total_amount REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      entry_number TEXT NOT NULL UNIQUE,
      document_id TEXT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_items (
      id TEXT PRIMARY KEY,
      journal_entry_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      entity_id TEXT,
      debit REAL NOT NULL DEFAULT 0,
      credit REAL NOT NULL DEFAULT 0,
      description TEXT,
      FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL DEFAULT 'Genel Cari & Kasa Takibi (Demo/Beta)',
      tax_number TEXT,
      address TEXT,
      phone TEXT,
      pin_code TEXT,
      auto_backup_enabled INTEGER NOT NULL DEFAULT 1,
      backup_interval_days INTEGER NOT NULL DEFAULT 7,
      last_backup_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Genel',
      unit TEXT NOT NULL DEFAULT 'Adet',
      purchase_price REAL NOT NULL DEFAULT 0,
      sale_price REAL NOT NULL DEFAULT 0,
      stock_quantity REAL NOT NULL DEFAULT 0,
      min_stock_level REAL NOT NULL DEFAULT 5,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      document_id TEXT,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL DEFAULT 0,
      total_price REAL NOT NULL DEFAULT 0,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
}
function wi() {
  oe && (oe.close(), oe = null, Te = null);
}
function La() {
  q.handle("transactions:create", async (n, e) => {
    const t = x();
    if (e.amount <= 0)
      throw new Error("İşlem tutarı 0 veya negatif olamaz.");
    const r = (/* @__PURE__ */ new Date()).toISOString(), s = "doc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7), i = "yev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7), o = {
      sale: "SAT",
      customer_payment: "TAH",
      purchase: "ALIM",
      supplier_payment: "ODE",
      partner_draw: "ORT-CEK",
      partner_deposit: "ORT-YAT",
      transfer: "VIR",
      expense: "GID"
    }, a = t.select({ count: l`count(*)` }).from(C).get(), u = (((a == null ? void 0 : a.count) || 0) + 1).toString().padStart(5, "0"), y = new Date(e.date || Date.now()).getFullYear(), d = `${o[e.type] || "ISL"}-${y}-${u}`, L = `YEV-${y}-${u}`;
    let w = "", A = "", N, T;
    if (e.type === "sale") {
      if (!e.entityId) throw new Error("Satış işlemi için müşteri seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Müşteri bulunamadı.");
      w = E.accountId, N = E.id;
      const O = t.select().from($).where(m($.code, "600")).get();
      if (!O) throw new Error("600 Satış Gelirleri hesabı bulunamadı.");
      A = O.id;
    } else if (e.type === "customer_payment") {
      if (!e.entityId) throw new Error("Tahsilat için müşteri seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Müşteri bulunamadı.");
      const O = t.select().from($).where(m($.code, "100")).get();
      if (!O) throw new Error("100 Kasa hesabı bulunamadı.");
      if (w = O.id, e.targetEntityId) {
        const F = t.select().from(g).where(m(g.id, e.targetEntityId)).get();
        F && (N = F.id);
      }
      A = E.accountId, T = E.id;
    } else if (e.type === "purchase") {
      if (!e.entityId) throw new Error("Alım için tedarikçi seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Tedarikçi bulunamadı.");
      const O = t.select().from($).where(m($.code, "153")).get();
      if (!O) throw new Error("153 Ticari Mallar hesabı bulunamadı.");
      w = O.id, A = E.accountId, T = E.id;
    } else if (e.type === "supplier_payment") {
      if (!e.entityId) throw new Error("Ödeme için tedarikçi seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Tedarikçi bulunamadı.");
      const O = t.select().from($).where(m($.code, "100")).get();
      if (!O) throw new Error("100 Kasa hesabı bulunamadı.");
      w = E.accountId, N = E.id, A = O.id;
    } else if (e.type === "partner_draw") {
      if (!e.entityId) throw new Error("Ortak seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Ortak bulunamadı.");
      const O = t.select().from($).where(m($.code, "100")).get();
      if (!O) throw new Error("100 Kasa hesabı bulunamadı.");
      w = E.accountId, N = E.id, A = O.id;
    } else if (e.type === "partner_deposit") {
      if (!e.entityId) throw new Error("Ortak seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get();
      if (!E) throw new Error("Ortak bulunamadı.");
      const O = t.select().from($).where(m($.code, "100")).get();
      if (!O) throw new Error("100 Kasa hesabı bulunamadı.");
      w = O.id, A = E.accountId, T = E.id;
    } else if (e.type === "transfer") {
      if (!e.entityId || !e.targetEntityId)
        throw new Error("Virman için kaynak ve hedef hesap seçilmelidir.");
      const E = t.select().from(g).where(m(g.id, e.entityId)).get(), O = t.select().from(g).where(m(g.id, e.targetEntityId)).get();
      if (!E || !O) throw new Error("Kaynak veya hedef hesap bulunamadı.");
      w = O.accountId, N = O.id, A = E.accountId, T = E.id;
    } else if (e.type === "expense") {
      const E = t.select().from($).where(m($.code, "770")).get();
      if (!E) throw new Error("770 Gider hesabı bulunamadı.");
      const O = t.select().from($).where(m($.code, "100")).get();
      if (!O) throw new Error("100 Kasa hesabı bulunamadı.");
      w = E.id, A = O.id;
    }
    const B = {
      id: s,
      docNumber: d,
      type: e.type,
      date: e.date,
      description: e.description,
      totalAmount: e.amount,
      createdAt: r
    }, Q = {
      id: i,
      entryNumber: L,
      documentId: s,
      date: e.date,
      description: e.description,
      status: "active",
      createdAt: r
    }, P = {
      id: "ji_" + Date.now() + "_1",
      journalEntryId: i,
      accountId: w,
      entityId: N || null,
      debit: e.amount,
      credit: 0,
      description: e.description
    }, M = {
      id: "ji_" + Date.now() + "_2",
      journalEntryId: i,
      accountId: A,
      entityId: T || null,
      debit: 0,
      credit: e.amount,
      description: e.description
    };
    return t.insert(C).values(B).run(), t.insert(f).values(Q).run(), t.insert(h).values([P, M]).run(), { success: !0, docNumber: d, entryNumber: L };
  }), q.handle("transactions:list", async (n, e) => {
    const t = x(), r = (e == null ? void 0 : e.limit) || 100;
    return t.select({
      id: f.id,
      entryNumber: f.entryNumber,
      docNumber: C.docNumber,
      docType: C.type,
      date: f.date,
      description: f.description,
      totalAmount: C.totalAmount,
      status: f.status
    }).from(f).leftJoin(C, m(f.documentId, C.id)).orderBy(ie(f.date), ie(f.createdAt)).limit(r).all();
  }), q.handle("transactions:cancel", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select().from(f).where(m(f.id, e)).get();
    if (!s) throw new Error("İşlem kaydı bulunamadı.");
    if (s.status === "cancelled")
      throw new Error("Bu işlem zaten ters kayıt ile düzeltilmiş.");
    const i = t.select().from(h).where(m(h.journalEntryId, e)).all();
    if (i.length === 0)
      throw new Error("İşlem detay satırları bulunamadı.");
    t.update(f).set({ status: "cancelled" }).where(m(f.id, e)).run();
    const o = "doc_rev_" + Date.now(), a = "yev_rev_" + Date.now(), u = t.select({ count: l`count(*)` }).from(C).get(), y = (((u == null ? void 0 : u.count) || 0) + 1).toString().padStart(5, "0"), d = (/* @__PURE__ */ new Date()).getFullYear(), L = `TRS-${d}-${y}`, w = `TRS-YEV-${d}-${y}`, A = s.documentId ? t.select().from(C).where(m(C.id, s.documentId)).get() : null, N = (A == null ? void 0 : A.totalAmount) || 0, T = `TERS DÜZELTME KAYDI (${s.entryNumber} / ${s.description})`;
    t.insert(C).values({
      id: o,
      docNumber: L,
      type: (A == null ? void 0 : A.type) || "transfer",
      date: r.split("T")[0],
      description: T,
      totalAmount: N,
      createdAt: r
    }).run(), t.insert(f).values({
      id: a,
      entryNumber: w,
      documentId: o,
      date: r.split("T")[0],
      description: T,
      status: "active",
      createdAt: r
    }).run();
    const B = i.map((Q, P) => ({
      id: `ji_rev_${Date.now()}_${P}`,
      journalEntryId: a,
      accountId: Q.accountId,
      entityId: Q.entityId,
      debit: Q.credit,
      // FLIPPED
      credit: Q.debit,
      // FLIPPED
      description: `TERS KAYIT: ${Q.description || ""}`
    }));
    return t.insert(h).values(B).run(), { success: !0, revDocNumber: L, revEntryNumber: w };
  });
}
function Aa() {
  q.handle("customers:list", async () => {
    const n = x();
    return n.select().from(g).where(m(g.type, "customer")).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${h.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, r.id),
          m(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, o = (s == null ? void 0 : s.totalCredit) || 0, a = i - o;
      return {
        ...r,
        totalDebit: i,
        totalCredit: o,
        balance: a
      };
    });
  }), q.handle("customers:getStatement", async (n, e) => {
    const t = x(), r = t.select().from(g).where(m(g.id, e)).get();
    if (!r) throw new Error("Müşteri bulunamadı.");
    const s = t.select({
      id: h.id,
      date: f.date,
      docNumber: C.docNumber,
      docType: C.type,
      description: h.description,
      debit: h.debit,
      credit: h.credit
    }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
      k(
        m(h.entityId, e),
        m(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const o = s.map((a) => (i += a.debit - a.credit, {
      ...a,
      runningBalance: i
    }));
    return {
      customer: r,
      movements: o,
      currentBalance: i
    };
  }), q.handle("customers:create", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = "cust_" + Date.now(), i = t.select({ count: l`count(*)` }).from(g).where(m(g.type, "customer")).get(), o = (((i == null ? void 0 : i.count) || 0) + 1).toString().padStart(3, "0"), a = `120.${o}`, u = `acc_120_${o}`;
    return t.insert($).values({
      id: u,
      code: a,
      name: e.name,
      type: "asset",
      parentCode: "120",
      createdAt: r
    }).run(), t.insert(g).values({
      id: s,
      name: e.name,
      type: "customer",
      accountId: u,
      phone: e.phone || null,
      taxNumber: e.taxNumber || null,
      address: e.address || null,
      notes: e.notes || null,
      isActive: !0,
      createdAt: r
    }).run(), { success: !0, customerId: s, accountCode: a };
  });
}
function va() {
  q.handle("suppliers:list", async () => {
    const n = x();
    return n.select().from(g).where(m(g.type, "supplier")).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${h.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, r.id),
          m(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, o = (s == null ? void 0 : s.totalCredit) || 0, a = o - i;
      return {
        ...r,
        totalDebit: i,
        totalCredit: o,
        balance: a
      };
    });
  }), q.handle("suppliers:getStatement", async (n, e) => {
    const t = x(), r = t.select().from(g).where(m(g.id, e)).get();
    if (!r) throw new Error("Tedarikçi bulunamadı.");
    const s = t.select({
      id: h.id,
      date: f.date,
      docNumber: C.docNumber,
      docType: C.type,
      description: h.description,
      debit: h.debit,
      credit: h.credit
    }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
      k(
        m(h.entityId, e),
        m(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const o = s.map((a) => (i += a.credit - a.debit, {
      ...a,
      runningBalance: i
    }));
    return {
      supplier: r,
      movements: o,
      currentBalance: i
    };
  }), q.handle("suppliers:create", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = "supp_" + Date.now(), i = t.select({ count: l`count(*)` }).from(g).where(m(g.type, "supplier")).get(), o = (((i == null ? void 0 : i.count) || 0) + 1).toString().padStart(3, "0"), a = `320.${o}`, u = `acc_320_${o}`;
    return t.insert($).values({
      id: u,
      code: a,
      name: e.name,
      type: "liability",
      parentCode: "320",
      createdAt: r
    }).run(), t.insert(g).values({
      id: s,
      name: e.name,
      type: "supplier",
      accountId: u,
      phone: e.phone || null,
      taxNumber: e.taxNumber || null,
      address: e.address || null,
      notes: e.notes || null,
      isActive: !0,
      createdAt: r
    }).run(), { success: !0, supplierId: s, accountCode: a };
  });
}
function Ca() {
  q.handle("cash:list", async () => {
    const n = x();
    return n.select().from(g).where(m(g.type, "cash")).all().map((r) => {
      const s = n.select({
        totalIncome: l`COALESCE(SUM(${h.debit}), 0)`,
        totalExpense: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, r.id),
          m(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalIncome) || 0, o = (s == null ? void 0 : s.totalExpense) || 0, a = i - o;
      return {
        ...r,
        totalIncome: i,
        totalExpense: o,
        balance: a
      };
    });
  }), q.handle("cash:getMovements", async (n, e) => {
    const t = x(), r = t.select().from(g).where(m(g.id, e)).get();
    if (!r) throw new Error("Kasa bulunamadı.");
    const s = t.select({
      id: h.id,
      date: f.date,
      docNumber: C.docNumber,
      docType: C.type,
      description: h.description,
      income: h.debit,
      expense: h.credit
    }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
      k(
        m(h.entityId, e),
        m(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const o = s.map((a) => (i += a.income - a.expense, {
      ...a,
      runningBalance: i
    }));
    return {
      cashDesk: r,
      movements: o,
      currentBalance: i
    };
  }), q.handle("cash:create", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(g).where(m(g.type, "cash")).get(), i = (((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(3, "0"), o = `100.${i}`, a = `acc_100_${i}`;
    return t.insert($).values({
      id: a,
      code: o,
      name: e,
      type: "asset",
      parentCode: "100",
      createdAt: r
    }).run(), t.insert(g).values({
      id: "cash_" + Date.now(),
      name: e,
      type: "cash",
      accountId: a,
      isActive: !0,
      createdAt: r
    }).run(), { success: !0 };
  });
}
function Ia() {
  q.handle("banks:list", async () => {
    const n = x();
    return n.select({
      id: g.id,
      name: g.name,
      type: g.type,
      accountId: g.accountId,
      accountCode: $.code,
      phone: g.phone,
      taxNumber: g.taxNumber,
      address: g.address,
      notes: g.notes,
      isActive: g.isActive,
      createdAt: g.createdAt
    }).from(g).leftJoin($, m(g.accountId, $.id)).where(m(g.type, "bank")).all().map((r) => {
      const s = n.select({
        totalIncoming: l`COALESCE(SUM(${h.debit}), 0)`,
        totalOutgoing: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, r.id),
          m(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalIncoming) || 0, o = (s == null ? void 0 : s.totalOutgoing) || 0, a = i - o;
      return {
        ...r,
        accountCode: r.accountCode || "102.001",
        totalIncoming: i,
        totalOutgoing: o,
        balance: a
      };
    });
  }), q.handle("banks:getMovements", async (n, e) => {
    const t = x(), r = t.select({
      id: g.id,
      name: g.name,
      type: g.type,
      accountId: g.accountId,
      accountCode: $.code,
      phone: g.phone,
      taxNumber: g.taxNumber,
      address: g.address,
      notes: g.notes
    }).from(g).leftJoin($, m(g.accountId, $.id)).where(m(g.id, e)).get();
    if (!r) throw new Error("Banka kaydı bulunamadı.");
    const s = t.select({
      id: h.id,
      date: f.date,
      docNumber: C.docNumber,
      docType: C.type,
      description: h.description,
      incoming: h.debit,
      outgoing: h.credit
    }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
      k(
        m(h.entityId, e),
        m(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const o = s.map((a) => (i += a.incoming - a.outgoing, {
      ...a,
      runningBalance: i
    }));
    return {
      bank: r,
      movements: o,
      currentBalance: i
    };
  }), q.handle("banks:create", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(g).where(m(g.type, "bank")).get(), i = (((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(3, "0"), o = `102.${i}`, a = `acc_102_${i}`;
    return t.insert($).values({
      id: a,
      code: o,
      name: e.name,
      type: "asset",
      parentCode: "102",
      createdAt: r
    }).run(), t.insert(g).values({
      id: "bank_" + Date.now(),
      name: e.name,
      type: "bank",
      accountId: a,
      address: e.branch || null,
      notes: e.iban || null,
      phone: e.phone || null,
      isActive: !0,
      createdAt: r
    }).run(), { success: !0 };
  });
}
function $a() {
  q.handle("partners:list", async () => {
    const n = x();
    return n.select().from(g).where(m(g.type, "partner")).all().map((r) => {
      const s = n.select({
        totalDraws: l`COALESCE(SUM(${h.debit}), 0)`,
        // Para Çekme (Borç)
        totalDeposits: l`COALESCE(SUM(${h.credit}), 0)`
        // Para Yatırma (Alacak)
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, r.id),
          m(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDraws) || 0, o = (s == null ? void 0 : s.totalDeposits) || 0, a = o - i;
      return {
        ...r,
        totalDraws: i,
        totalDeposits: o,
        balance: a
      };
    });
  }), q.handle("partners:getStatement", async (n, e) => {
    const t = x(), r = t.select().from(g).where(m(g.id, e)).get();
    if (!r) throw new Error("Ortak kaydı bulunamadı.");
    const s = t.select({
      id: h.id,
      date: f.date,
      docNumber: C.docNumber,
      docType: C.type,
      description: h.description,
      drawAmount: h.debit,
      // Çekilen
      depositAmount: h.credit
      // Yatırılan
    }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
      k(
        m(h.entityId, e),
        m(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const o = s.map((a) => (i += a.depositAmount - a.drawAmount, {
      ...a,
      runningBalance: i
    }));
    return {
      partner: r,
      movements: o,
      currentBalance: i
    };
  });
}
function Oa() {
  q.handle("accounts:list", async () => {
    const n = x();
    return n.select().from($).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${h.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        m(h.accountId, r.id)
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, o = (s == null ? void 0 : s.totalCredit) || 0;
      let a = 0;
      return r.type === "asset" || r.type === "expense" ? a = i - o : a = o - i, {
        ...r,
        totalDebit: i,
        totalCredit: o,
        balance: a
      };
    });
  }), q.handle("accounts:getJournalEntries", async () => {
    const n = x();
    return n.select({
      id: f.id,
      entryNumber: f.entryNumber,
      date: f.date,
      description: f.description,
      status: f.status
    }).from(f).orderBy(ie(f.date), ie(f.createdAt)).limit(200).all().map((r) => {
      const s = n.select({
        id: h.id,
        debit: h.debit,
        credit: h.credit,
        description: h.description,
        accountCode: $.code,
        accountName: $.name
      }).from(h).innerJoin($, m(h.accountId, $.id)).where(m(h.journalEntryId, r.id)).all();
      return {
        ...r,
        items: s
      };
    });
  });
}
function xa() {
  q.handle("reports:getDashboard", async () => {
    const n = x(), e = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], t = n.select().from(g).where(l`${g.type} IN ('cash', 'bank')`).all();
    let r = 0;
    for (const N of t) {
      const T = n.select({
        debit: l`COALESCE(SUM(${h.debit}), 0)`,
        credit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, N.id),
          m(f.status, "active")
        )
      ).get();
      r += ((T == null ? void 0 : T.debit) || 0) - ((T == null ? void 0 : T.credit) || 0);
    }
    const s = n.select().from(g).where(m(g.type, "customer")).all();
    let i = 0;
    const o = [];
    for (const N of s) {
      const T = n.select({
        debit: l`COALESCE(SUM(${h.debit}), 0)`,
        credit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, N.id),
          m(f.status, "active")
        )
      ).get(), B = ((T == null ? void 0 : T.debit) || 0) - ((T == null ? void 0 : T.credit) || 0);
      B > 0 && (i += B), o.push({
        id: N.id,
        name: N.name,
        phone: N.phone,
        balance: B
      });
    }
    const a = o.filter((N) => N.balance > 0).sort((N, T) => T.balance - N.balance).slice(0, 5), u = n.select({
      docType: C.type,
      amount: C.totalAmount
    }).from(C).where(m(C.date, e)).all();
    let y = 0, d = 0;
    for (const N of u)
      N.docType === "sale" || N.docType === "customer_payment" || N.docType === "partner_deposit" ? y += N.amount : (N.docType === "purchase" || N.docType === "supplier_payment" || N.docType === "expense" || N.docType === "partner_draw") && (d += N.amount);
    const w = n.select().from(g).where(m(g.type, "partner")).all().map((N) => {
      const T = n.select({
        draws: l`COALESCE(SUM(${h.debit}), 0)`,
        deposits: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.entityId, N.id),
          m(f.status, "active")
        )
      ).get(), B = (T == null ? void 0 : T.draws) || 0, Q = (T == null ? void 0 : T.deposits) || 0, P = Q - B;
      return {
        id: N.id,
        name: N.name,
        draws: B,
        deposits: Q,
        balance: P
      };
    }), A = n.select({
      id: f.id,
      entryNumber: f.entryNumber,
      docNumber: C.docNumber,
      docType: C.type,
      date: f.date,
      description: f.description,
      totalAmount: C.totalAmount
    }).from(f).leftJoin(C, m(f.documentId, C.id)).where(m(f.status, "active")).orderBy(ie(f.date), ie(f.createdAt)).limit(6).all();
    return {
      totalCashBalance: r,
      totalCustomerReceivables: i,
      todayIncome: y,
      todayExpense: d,
      topDebtors: a,
      partnerBalances: w,
      recentTransactions: A
    };
  }), q.handle("reports:getTrialBalance", async (n, e) => {
    const t = x(), r = (e == null ? void 0 : e.type) || "gecici";
    return t.select().from($).orderBy($.code).all().map((o) => {
      const a = t.select({
        totalDebit: l`COALESCE(SUM(${h.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${h.credit}), 0)`
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).where(
        k(
          m(h.accountId, o.id),
          m(f.status, "active")
        )
      ).get(), u = (a == null ? void 0 : a.totalDebit) || 0, y = (a == null ? void 0 : a.totalCredit) || 0, d = u > y ? u - y : 0, L = y > u ? y - u : 0;
      return {
        code: o.code,
        name: o.name,
        type: o.type,
        totalDebit: u,
        totalCredit: y,
        debitBalance: d,
        creditBalance: L,
        isClosed: r === "kesin" && o.code.startsWith("6")
        // 600 Gelir hesapları kesin mizanda sıfırlanır
      };
    }).filter((o) => o.totalDebit > 0 || o.totalCredit > 0);
  }), q.handle("reports:getKebir", async () => {
    const n = x();
    return n.select().from($).orderBy($.code).all().map((r) => {
      const s = n.select({
        id: h.id,
        date: f.date,
        docNumber: C.docNumber,
        description: h.description,
        debit: h.debit,
        credit: h.credit
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
        k(
          m(h.accountId, r.id),
          m(f.status, "active")
        )
      ).orderBy(f.date).all(), i = s.reduce((a, u) => a + u.debit, 0), o = s.reduce((a, u) => a + u.credit, 0);
      return {
        accountId: r.id,
        code: r.code,
        name: r.name,
        type: r.type,
        totalDebit: i,
        totalCredit: o,
        balance: i - o,
        items: s
      };
    }).filter((r) => r.items.length > 0);
  }), q.handle("reports:getMuavin", async (n, e) => {
    const t = x();
    return t.select().from(g).orderBy(g.name).all().map((i) => {
      const o = t.select({
        id: h.id,
        date: f.date,
        docNumber: C.docNumber,
        description: h.description,
        debit: h.debit,
        credit: h.credit
      }).from(h).innerJoin(f, m(h.journalEntryId, f.id)).leftJoin(C, m(f.documentId, C.id)).where(
        k(
          m(h.entityId, i.id),
          m(f.status, "active")
        )
      ).orderBy(f.date).all();
      let a = 0;
      const u = o.map((L) => (a += L.debit - L.credit, { ...L, runningBalance: a })), y = o.reduce((L, w) => L + w.debit, 0), d = o.reduce((L, w) => L + w.credit, 0);
      return {
        entityId: i.id,
        name: i.name,
        type: i.type,
        totalDebit: y,
        totalCredit: d,
        balance: a,
        items: u
      };
    }).filter((i) => i.items.length > 0);
  });
}
function Ba() {
  q.handle("backup:export", async () => {
    const n = me.getPath("userData"), e = et.join(n, "cari_finance.db");
    if (!ue.existsSync(e))
      throw new Error("Veritabanı dosyası bulunamadı.");
    const r = `abc_mobilya_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.cari`, { filePath: s } = await Et.showSaveDialog({
      title: "Cari Finance Şirket Dosyasını (.cari) Kaydet",
      defaultPath: r,
      filters: [
        { name: "Cari Finance Şirket Dosyası (*.cari)", extensions: ["cari"] },
        { name: "SQLite Veritabanı (*.db)", extensions: ["db", "sqlite"] }
      ]
    });
    return s ? (ue.copyFileSync(e, s), x().update(ee).set({ lastBackupAt: (/* @__PURE__ */ new Date()).toISOString() }).where(m(ee.id, "app_settings")).run(), { success: !0, filePath: s }) : { success: !1, cancelled: !0 };
  }), q.handle("backup:import", async () => {
    const { filePaths: n } = await Et.showOpenDialog({
      title: "Cari Finance Şirket Dosyası (.cari) Aç",
      properties: ["openFile"],
      filters: [
        { name: "Cari Finance Şirket Dosyası (*.cari, *.db)", extensions: ["cari", "db", "sqlite"] }
      ]
    });
    if (!n || n.length === 0)
      return { success: !1, cancelled: !0 };
    const e = n[0], t = me.getPath("userData"), r = et.join(t, "cari_finance.db");
    wi();
    const s = r + ".bak";
    ue.existsSync(r) && ue.copyFileSync(r, s);
    try {
      return ue.copyFileSync(e, r), x(), { success: !0 };
    } catch (i) {
      throw ue.existsSync(s) && ue.copyFileSync(s, r), x(), new Error("Şirket dosyası (.cari) geri yüklenirken hata oluştu: " + i.message);
    }
  });
}
function Qa() {
  q.handle("settings:get", async () => x().select().from(ee).where(m(ee.id, "app_settings")).get() || null), q.handle("settings:update", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString();
    return t.update(ee).set({
      ...e,
      updatedAt: r
    }).where(m(ee.id, "app_settings")).run(), { success: !0 };
  }), q.handle("auth:verifyPin", async (n, e) => {
    const r = x().select().from(ee).where(m(ee.id, "app_settings")).get();
    return r != null && r.pinCode ? r.pinCode === e ? { success: !0 } : { success: !1, message: "Hatalı PIN Kodu." } : { success: !0 };
  });
}
function qa() {
  q.handle("inventory:list", async () => x().select().from(X).orderBy(ie(X.createdAt)).all().map((t) => ({
    ...t,
    totalStockValue: t.stockQuantity * t.purchasePrice
  }))), q.handle("inventory:create", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(X).get(), o = `STK-${(((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(4, "0")}`, a = `prod_${Date.now()}`;
    return t.insert(X).values({
      id: a,
      code: o,
      name: e.name,
      category: e.category || "Genel",
      unit: e.unit || "Adet",
      purchasePrice: e.purchasePrice || 0,
      salePrice: e.salePrice || 0,
      stockQuantity: e.stockQuantity || 0,
      minStockLevel: e.minStockLevel ?? 5,
      isActive: !0,
      createdAt: r
    }).run(), e.stockQuantity && e.stockQuantity > 0 && t.insert(Se).values({
      id: `stk_mov_${Date.now()}`,
      productId: a,
      type: "in",
      quantity: e.stockQuantity,
      unitPrice: e.purchasePrice || 0,
      totalPrice: e.stockQuantity * (e.purchasePrice || 0),
      description: "Açılış / Devir Stok Miktarı",
      date: r.split("T")[0],
      createdAt: r
    }).run(), { success: !0, productId: a, code: o };
  }), q.handle("inventory:updateStock", async (n, e) => {
    const t = x(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select().from(X).where(m(X.id, e.productId)).get();
    if (!s) throw new Error("Ürün bulunamadı.");
    if (e.quantity <= 0)
      throw new Error("Stok hareket miktarı 0'dan büyük olmalıdır.");
    const i = s.stockQuantity, o = e.type === "in" ? i + e.quantity : i - e.quantity;
    if (e.type === "out" && o < 0)
      throw new Error(`Yetersiz stok! Mevcut stok: ${i} ${s.unit}`);
    const a = e.unitPrice ?? (e.type === "in" ? s.purchasePrice : s.salePrice), u = e.quantity * a;
    return t.update(X).set({ stockQuantity: o }).where(m(X.id, e.productId)).run(), t.insert(Se).values({
      id: `stk_mov_${Date.now()}`,
      productId: e.productId,
      type: e.type,
      quantity: e.quantity,
      unitPrice: a,
      totalPrice: u,
      description: e.description || (e.type === "in" ? "Stok Girişi" : "Stok Çıkışı"),
      date: r.split("T")[0],
      createdAt: r
    }).run(), { success: !0, newStockQuantity: o };
  }), q.handle("inventory:getMovements", async (n, e) => {
    const t = x(), r = t.select().from(X).where(m(X.id, e)).get();
    if (!r) throw new Error("Ürün bulunamadı.");
    const s = t.select().from(Se).where(m(Se.productId, e)).orderBy(ie(Se.createdAt)).all();
    return {
      product: r,
      movements: s
    };
  });
}
function Da() {
  La(), Aa(), va(), Ca(), Ia(), $a(), Oa(), xa(), Ba(), Qa(), qa();
}
const ja = Ai(import.meta.url), pt = Be.dirname(ja);
let Oe = null;
function Pa() {
  const n = Be.join(pt, "preload.mjs");
  return Li.existsSync(n) ? n : Be.join(pt, "preload.js");
}
function $t() {
  Oe = new Ns({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "Cari & Kasa Finance Desktop - Mobilya İmalat Takip",
    backgroundColor: "#090d16",
    webPreferences: {
      preload: Pa(),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), Oe.setMenu(null), process.env.VITE_DEV_SERVER_URL ? Oe.loadURL(process.env.VITE_DEV_SERVER_URL) : Oe.loadFile(Be.join(pt, "../dist/index.html"));
}
me.whenReady().then(() => {
  x(), Da(), $t(), me.on("activate", () => {
    Ns.getAllWindows().length === 0 && $t();
  });
});
me.on("window-all-closed", () => {
  wi(), process.platform !== "darwin" && me.quit();
});
