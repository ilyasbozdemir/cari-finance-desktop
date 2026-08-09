var Ei = Object.defineProperty;
var _i = (n, e, t) => e in n ? Ei(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var o = (n, e, t) => _i(n, typeof e != "symbol" ? e + "" : e, t);
import { app as he, ipcMain as x, dialog as _t, BrowserWindow as Es } from "electron";
import Qe from "node:path";
import Li from "node:fs";
import { fileURLToPath as Ai } from "node:url";
import _e from "better-sqlite3";
import tt from "path";
import ue from "fs";
const p = Symbol.for("drizzle:entityKind");
function m(n, e) {
  if (!n || typeof n != "object")
    return !1;
  if (n instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, p))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let t = Object.getPrototypeOf(n).constructor;
  if (t)
    for (; t; ) {
      if (p in t && t[p] === e[p])
        return !0;
      t = Object.getPrototypeOf(t);
    }
  return !1;
}
var Bt;
Bt = p;
class _s {
  write(e) {
    console.log(e);
  }
}
o(_s, Bt, "ConsoleLogWriter");
var xt;
xt = p;
class Ls {
  constructor(e) {
    o(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new _s();
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
o(Ls, xt, "DefaultLogger");
var Qt;
Qt = p;
class As {
  logQuery() {
  }
}
o(As, Qt, "NoopLogger");
const ce = Symbol.for("drizzle:Name"), xe = Symbol.for("drizzle:Schema"), rt = Symbol.for("drizzle:Columns"), Lt = Symbol.for("drizzle:ExtraConfigColumns"), He = Symbol.for("drizzle:OriginalName"), Ze = Symbol.for("drizzle:BaseName"), nt = Symbol.for("drizzle:IsAlias"), At = Symbol.for("drizzle:ExtraConfigBuilder"), vi = Symbol.for("drizzle:IsDrizzleTable");
var qt, Dt, kt, jt, Pt, Ut, Mt, Ft, Rt, Kt;
Kt = p, Rt = ce, Ft = He, Mt = xe, Ut = rt, Pt = Lt, jt = Ze, kt = nt, Dt = vi, qt = At;
class S {
  constructor(e, t, r) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    o(this, Rt);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    o(this, Ft);
    /** @internal */
    o(this, Mt);
    /** @internal */
    o(this, Ut);
    /** @internal */
    o(this, Pt);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    o(this, jt);
    /** @internal */
    o(this, kt, !1);
    /** @internal */
    o(this, Dt, !0);
    /** @internal */
    o(this, qt);
    this[ce] = this[He] = e, this[xe] = t, this[Ze] = r;
  }
}
o(S, Kt, "Table"), /** @internal */
o(S, "Symbol", {
  Name: ce,
  Schema: xe,
  OriginalName: He,
  Columns: rt,
  ExtraConfigColumns: Lt,
  BaseName: Ze,
  IsAlias: nt,
  ExtraConfigBuilder: At
});
function Ee(n) {
  return n[ce];
}
function ve(n) {
  return `${n[xe] ?? "public"}.${n[ce]}`;
}
var zt;
zt = p;
class D {
  constructor(e, t) {
    o(this, "name");
    o(this, "keyAsName");
    o(this, "primary");
    o(this, "notNull");
    o(this, "default");
    o(this, "defaultFn");
    o(this, "onUpdateFn");
    o(this, "hasDefault");
    o(this, "isUnique");
    o(this, "uniqueName");
    o(this, "uniqueType");
    o(this, "dataType");
    o(this, "columnType");
    o(this, "enumValues");
    o(this, "generated");
    o(this, "generatedIdentity");
    o(this, "config");
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
o(D, zt, "Column");
var Vt;
Vt = p;
class vs {
  constructor(e, t, r) {
    o(this, "config");
    /**
     * Alias for {@link $defaultFn}.
     */
    o(this, "$default", this.$defaultFn);
    /**
     * Alias for {@link $onUpdateFn}.
     */
    o(this, "$onUpdate", this.$onUpdateFn);
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
o(vs, Vt, "ColumnBuilder");
const vt = Symbol.for("drizzle:isPgEnum");
function Ci(n) {
  return !!n && typeof n == "function" && vt in n && n[vt] === !0;
}
var Xt;
Xt = p;
class J {
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
o(J, Xt, "Subquery");
var Jt, Gt;
class gt extends (Gt = J, Jt = p, Gt) {
}
o(gt, Jt, "WithSubquery");
const Ii = {
  startActiveSpan(n, e) {
    return e();
  }
}, F = Symbol.for("drizzle:ViewBaseConfig");
function Cs(n) {
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
Yt = p;
class k {
  constructor(e) {
    o(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new L([this]);
  }
}
o(k, Yt, "StringChunk");
var Wt;
Wt = p;
const de = class de {
  constructor(e) {
    /** @internal */
    o(this, "decoder", Is);
    o(this, "shouldInlineParams", !1);
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
      escapeParam: c,
      prepareTyping: a,
      inlineParams: u,
      paramStartIndex: g
    } = r;
    return $i(e.map((d) => {
      var C;
      if (m(d, k))
        return { sql: d.value.join(""), params: [] };
      if (m(d, qe))
        return { sql: i(d.value), params: [] };
      if (d === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(d)) {
        const N = [new k("(")];
        for (const [A, _] of d.entries())
          N.push(_), A < d.length - 1 && N.push(new k(", "));
        return N.push(new k(")")), this.buildQueryFromSourceParams(N, r);
      }
      if (m(d, de))
        return this.buildQueryFromSourceParams(d.queryChunks, {
          ...r,
          inlineParams: u || d.shouldInlineParams
        });
      if (m(d, S)) {
        const N = d[S.Symbol.Schema], A = d[S.Symbol.Name];
        return {
          sql: N === void 0 ? i(A) : i(N) + "." + i(A),
          params: []
        };
      }
      if (m(d, D)) {
        const N = s.getColumnCasing(d);
        if (t.invokeSource === "indexes")
          return { sql: i(N), params: [] };
        const A = d.table[S.Symbol.Schema];
        return {
          sql: d.table[nt] || A === void 0 ? i(d.table[S.Symbol.Name]) + "." + i(N) : i(A) + "." + i(d.table[S.Symbol.Name]) + "." + i(N),
          params: []
        };
      }
      if (m(d, be)) {
        const N = d[F].schema, A = d[F].name;
        return {
          sql: N === void 0 ? i(A) : i(N) + "." + i(A),
          params: []
        };
      }
      if (m(d, se)) {
        if (m(d.value, me))
          return { sql: c(g.value++, d), params: [d], typings: ["none"] };
        const N = d.value === null ? null : d.encoder.mapToDriverValue(d.value);
        if (m(N, de))
          return this.buildQueryFromSourceParams([N], r);
        if (u)
          return { sql: this.mapInlineParam(N, r), params: [] };
        let A = ["none"];
        return a && (A = [a(d.encoder)]), { sql: c(g.value++, N), params: [N], typings: A };
      }
      return m(d, me) ? { sql: c(g.value++, d), params: [d], typings: ["none"] } : m(d, de.Aliased) && d.fieldAlias !== void 0 ? { sql: i(d.fieldAlias), params: [] } : m(d, J) ? d._.isWith ? { sql: i(d._.alias), params: [] } : this.buildQueryFromSourceParams([
        new k("("),
        d._.sql,
        new k(") "),
        new qe(d._.alias)
      ], r) : Ci(d) ? d.schema ? { sql: i(d.schema) + "." + i(d.enumName), params: [] } : { sql: i(d.enumName), params: [] } : Cs(d) ? (C = d.shouldOmitSQLParens) != null && C.call(d) ? this.buildQueryFromSourceParams([d.getSQL()], r) : this.buildQueryFromSourceParams([
        new k("("),
        d.getSQL(),
        new k(")")
      ], r) : u ? { sql: this.mapInlineParam(d, r), params: [] } : { sql: c(g.value++, d), params: [d], typings: ["none"] };
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
o(de, Wt, "SQL");
let L = de;
var Ht;
Ht = p;
class qe {
  constructor(e) {
    o(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new L([this]);
  }
}
o(qe, Ht, "Name");
function Oi(n) {
  return typeof n == "object" && n !== null && "mapToDriverValue" in n && typeof n.mapToDriverValue == "function";
}
const Is = {
  mapFromDriverValue: (n) => n
}, $s = {
  mapToDriverValue: (n) => n
};
({
  ...Is,
  ...$s
});
var Zt;
Zt = p;
class se {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, t = $s) {
    o(this, "brand");
    this.value = e, this.encoder = t;
  }
  getSQL() {
    return new L([this]);
  }
}
o(se, Zt, "Param");
function l(n, ...e) {
  const t = [];
  (e.length > 0 || n.length > 0 && n[0] !== "") && t.push(new k(n[0]));
  for (const [r, s] of e.entries())
    t.push(s, new k(n[r + 1]));
  return new L(t);
}
((n) => {
  function e() {
    return new L([]);
  }
  n.empty = e;
  function t(u) {
    return new L(u);
  }
  n.fromList = t;
  function r(u) {
    return new L([new k(u)]);
  }
  n.raw = r;
  function s(u, g) {
    const d = [];
    for (const [C, N] of u.entries())
      C > 0 && g !== void 0 && d.push(g), d.push(N);
    return new L(d);
  }
  n.join = s;
  function i(u) {
    return new qe(u);
  }
  n.identifier = i;
  function c(u) {
    return new me(u);
  }
  n.placeholder = c;
  function a(u, g) {
    return new se(u, g);
  }
  n.param = a;
})(l || (l = {}));
((n) => {
  var t;
  t = p;
  const r = class r {
    constructor(i, c) {
      /** @internal */
      o(this, "isSelectionField", !1);
      this.sql = i, this.fieldAlias = c;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new r(this.sql, this.fieldAlias);
    }
  };
  o(r, t, "SQL.Aliased");
  let e = r;
  n.Aliased = e;
})(L || (L = {}));
var er;
er = p;
class me {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new L([this]);
  }
}
o(me, er, "Placeholder");
function Oe(n, e) {
  return n.map((t) => {
    if (m(t, me)) {
      if (!(t.name in e))
        throw new Error(`No value for placeholder "${t.name}" was provided`);
      return e[t.name];
    }
    if (m(t, se) && m(t.value, me)) {
      if (!(t.value.name in e))
        throw new Error(`No value for placeholder "${t.value.name}" was provided`);
      return t.encoder.mapToDriverValue(e[t.value.name]);
    }
    return t;
  });
}
var tr, rr;
rr = p, tr = F;
class be {
  constructor({ name: e, schema: t, selectedFields: r, query: s }) {
    /** @internal */
    o(this, tr);
    this[F] = {
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
    return new L([this]);
  }
}
o(be, rr, "View");
D.prototype.getSQL = function() {
  return new L([this]);
};
S.prototype.getSQL = function() {
  return new L([this]);
};
J.prototype.getSQL = function() {
  return new L([this]);
};
function Ct(n, e, t) {
  const r = {}, s = n.reduce(
    (i, { path: c, field: a }, u) => {
      let g;
      m(a, D) ? g = a : m(a, L) ? g = a.decoder : g = a.sql.decoder;
      let d = i;
      for (const [C, N] of c.entries())
        if (C < c.length - 1)
          N in d || (d[N] = {}), d = d[N];
        else {
          const A = e[u], _ = d[N] = A === null ? null : g.mapFromDriverValue(A);
          if (t && m(a, D) && c.length === 2) {
            const T = c[0];
            T in r ? typeof r[T] == "string" && r[T] !== Ee(a.table) && (r[T] = !1) : r[T] = _ === null ? Ee(a.table) : !1;
          }
        }
      return i;
    },
    {}
  );
  if (t && Object.keys(r).length > 0)
    for (const [i, c] of Object.entries(r))
      typeof c == "string" && !t[c] && (s[i] = null);
  return s;
}
function fe(n, e) {
  return Object.entries(n).reduce((t, [r, s]) => {
    if (typeof r != "string")
      return t;
    const i = e ? [...e, r] : [r];
    return m(s, D) || m(s, L) || m(s, L.Aliased) ? t.push({ path: i, field: s }) : m(s, S) ? t.push(...fe(s[S.Symbol.Columns], i)) : t.push(...fe(s, i)), t;
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
function Os(n, e) {
  const t = Object.entries(e).filter(([, r]) => r !== void 0).map(([r, s]) => m(s, L) || m(s, D) ? [r, s] : [r, new se(s, n[S.Symbol.Columns][r])]);
  if (t.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(t);
}
function Bi(n, e) {
  for (const t of e)
    for (const r of Object.getOwnPropertyNames(t.prototype))
      r !== "constructor" && Object.defineProperty(
        n.prototype,
        r,
        Object.getOwnPropertyDescriptor(t.prototype, r) || /* @__PURE__ */ Object.create(null)
      );
}
function xi(n) {
  return n[S.Symbol.Columns];
}
function st(n) {
  return m(n, J) ? n._.alias : m(n, be) ? n[F].name : m(n, L) ? void 0 : n[S.Symbol.IsAlias] ? n[S.Symbol.Name] : n[S.Symbol.BaseName];
}
function Ke(n, e) {
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
const It = Symbol.for("drizzle:PgInlineForeignKeys"), $t = Symbol.for("drizzle:EnableRLS");
var nr, sr, ir, ar, or;
class it extends (or = S, ar = p, ir = It, sr = $t, nr = S.Symbol.ExtraConfigBuilder, or) {
  constructor() {
    super(...arguments);
    /**@internal */
    o(this, ir, []);
    /** @internal */
    o(this, sr, !1);
    /** @internal */
    o(this, nr);
  }
}
o(it, ar, "PgTable"), /** @internal */
o(it, "Symbol", Object.assign({}, S.Symbol, {
  InlineForeignKeys: It,
  EnableRLS: $t
}));
var cr;
cr = p;
class Bs {
  constructor(e, t) {
    /** @internal */
    o(this, "columns");
    /** @internal */
    o(this, "name");
    this.columns = e, this.name = t;
  }
  /** @internal */
  build(e) {
    return new xs(e, this.columns, this.name);
  }
}
o(Bs, cr, "PgPrimaryKeyBuilder");
var lr;
lr = p;
class xs {
  constructor(e, t, r) {
    o(this, "columns");
    o(this, "name");
    this.table = e, this.columns = t, this.name = r;
  }
  getName() {
    return this.name ?? `${this.table[it.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
o(xs, lr, "PgPrimaryKey");
function R(n, e) {
  return Oi(e) && !Cs(n) && !m(n, se) && !m(n, me) && !m(n, D) && !m(n, S) && !m(n, be) ? new se(n, e) : n;
}
const h = (n, e) => l`${n} = ${R(e, n)}`, qi = (n, e) => l`${n} <> ${R(e, n)}`;
function U(...n) {
  const e = n.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new L(e) : new L([
      new k("("),
      l.join(e, new k(" and ")),
      new k(")")
    ]);
}
function Di(...n) {
  const e = n.filter(
    (t) => t !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new L(e) : new L([
      new k("("),
      l.join(e, new k(" or ")),
      new k(")")
    ]);
}
function ki(n) {
  return l`not ${n}`;
}
const ji = (n, e) => l`${n} > ${R(e, n)}`, Pi = (n, e) => l`${n} >= ${R(e, n)}`, Ui = (n, e) => l`${n} < ${R(e, n)}`, Mi = (n, e) => l`${n} <= ${R(e, n)}`;
function Fi(n, e) {
  return Array.isArray(e) ? e.length === 0 ? l`false` : l`${n} in ${e.map((t) => R(t, n))}` : l`${n} in ${R(e, n)}`;
}
function Ri(n, e) {
  return Array.isArray(e) ? e.length === 0 ? l`true` : l`${n} not in ${e.map((t) => R(t, n))}` : l`${n} not in ${R(e, n)}`;
}
function Ki(n) {
  return l`${n} is null`;
}
function zi(n) {
  return l`${n} is not null`;
}
function Vi(n) {
  return l`exists ${n}`;
}
function Xi(n) {
  return l`not exists ${n}`;
}
function Ji(n, e, t) {
  return l`${n} between ${R(e, n)} and ${R(
    t,
    n
  )}`;
}
function Gi(n, e, t) {
  return l`${n} not between ${R(
    e,
    n
  )} and ${R(t, n)}`;
}
function Yi(n, e) {
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
function pe(n) {
  return l`${n} desc`;
}
var ur;
ur = p;
class wt {
  constructor(e, t, r) {
    o(this, "referencedTableName");
    o(this, "fieldName");
    this.sourceTable = e, this.referencedTable = t, this.relationName = r, this.referencedTableName = t[S.Symbol.Name];
  }
}
o(wt, ur, "Relation");
var dr;
dr = p;
class Qs {
  constructor(e, t) {
    this.table = e, this.config = t;
  }
}
o(Qs, dr, "Relations");
var hr, mr;
const Ue = class Ue extends (mr = wt, hr = p, mr) {
  constructor(e, t, r, s) {
    super(e, t, r == null ? void 0 : r.relationName), this.config = r, this.isNullable = s;
  }
  withFieldName(e) {
    const t = new Ue(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return t.fieldName = e, t;
  }
};
o(Ue, hr, "One");
let ye = Ue;
var fr, pr;
const Me = class Me extends (pr = wt, fr = p, pr) {
  constructor(e, t, r) {
    super(e, t, r == null ? void 0 : r.relationName), this.config = r;
  }
  withFieldName(e) {
    const t = new Me(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return t.fieldName = e, t;
  }
};
o(Me, fr, "Many");
let De = Me;
function ta() {
  return {
    and: U,
    between: Ji,
    eq: h,
    exists: Vi,
    gt: ji,
    gte: Pi,
    ilike: Hi,
    inArray: Fi,
    isNull: Ki,
    isNotNull: zi,
    like: Yi,
    lt: Ui,
    lte: Mi,
    ne: qi,
    not: ki,
    notBetween: Gi,
    notExists: Xi,
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
    desc: pe
  };
}
function na(n, e) {
  var i;
  Object.keys(n).length === 1 && "default" in n && !m(n.default, S) && (n = n.default);
  const t = {}, r = {}, s = {};
  for (const [c, a] of Object.entries(n))
    if (m(a, S)) {
      const u = ve(a), g = r[u];
      t[u] = c, s[c] = {
        tsName: c,
        dbName: a[S.Symbol.Name],
        schema: a[S.Symbol.Schema],
        columns: a[S.Symbol.Columns],
        relations: (g == null ? void 0 : g.relations) ?? {},
        primaryKey: (g == null ? void 0 : g.primaryKey) ?? []
      };
      for (const C of Object.values(
        a[S.Symbol.Columns]
      ))
        C.primary && s[c].primaryKey.push(C);
      const d = (i = a[S.Symbol.ExtraConfigBuilder]) == null ? void 0 : i.call(a, a[S.Symbol.ExtraConfigColumns]);
      if (d)
        for (const C of Object.values(d))
          m(C, Bs) && s[c].primaryKey.push(...C.columns);
    } else if (m(a, Qs)) {
      const u = ve(a.table), g = t[u], d = a.config(
        e(a.table)
      );
      let C;
      for (const [N, A] of Object.entries(d))
        if (g) {
          const _ = s[g];
          _.relations[N] = A;
        } else
          u in r || (r[u] = {
            relations: {},
            primaryKey: C
          }), r[u].relations[N] = A;
    }
  return { tables: s, tableNamesMap: t };
}
function sa(n) {
  return function(t, r) {
    return new ye(
      n,
      t,
      r,
      (r == null ? void 0 : r.fields.reduce((s, i) => s && i.notNull, !0)) ?? !1
    );
  };
}
function ia(n) {
  return function(t, r) {
    return new De(n, t, r);
  };
}
function aa(n, e, t) {
  if (m(t, ye) && t.config)
    return {
      fields: t.config.fields,
      references: t.config.references
    };
  const r = e[ve(t.referencedTable)];
  if (!r)
    throw new Error(
      `Table "${t.referencedTable[S.Symbol.Name]}" not found in schema`
    );
  const s = n[r];
  if (!s)
    throw new Error(`Table "${r}" not found in schema`);
  const i = t.sourceTable, c = e[ve(i)];
  if (!c)
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
  if (a[0] && m(a[0], ye) && a[0].config)
    return {
      fields: a[0].config.references,
      references: a[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${c}.${t.fieldName}"`
  );
}
function oa(n) {
  return {
    one: sa(n),
    many: ia(n)
  };
}
function at(n, e, t, r, s = (i) => i) {
  const i = {};
  for (const [
    c,
    a
  ] of r.entries())
    if (a.isJson) {
      const u = e.relations[a.tsKey], g = t[c], d = typeof g == "string" ? JSON.parse(g) : g;
      i[a.tsKey] = m(u, ye) ? d && at(
        n,
        n[a.relationTableTsKey],
        d,
        a.selection,
        s
      ) : d.map(
        (C) => at(
          n,
          n[a.relationTableTsKey],
          C,
          a.selection,
          s
        )
      );
    } else {
      const u = s(t[c]), g = a.field;
      let d;
      m(g, D) ? d = g : m(g, L) ? d = g.decoder : d = g.sql.decoder, i[a.tsKey] = u === null ? null : d.mapFromDriverValue(u);
    }
  return i;
}
var yr;
yr = p;
class Ce {
  constructor(e) {
    this.table = e;
  }
  get(e, t) {
    return t === "table" ? this.table : e[t];
  }
}
o(Ce, yr, "ColumnAliasProxyHandler");
var gr;
gr = p;
class ze {
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
    if (t === F)
      return {
        ...e[F],
        name: this.alias,
        isAlias: !0
      };
    if (t === S.Symbol.Columns) {
      const s = e[S.Symbol.Columns];
      if (!s)
        return s;
      const i = {};
      return Object.keys(s).map((c) => {
        i[c] = new Proxy(
          s[c],
          new Ce(new Proxy(e, this))
        );
      }), i;
    }
    const r = e[t];
    return m(r, D) ? new Proxy(r, new Ce(new Proxy(e, this))) : r;
  }
}
o(ze, gr, "TableAliasProxyHandler");
function et(n, e) {
  return new Proxy(n, new ze(e, !1));
}
function re(n, e) {
  return new Proxy(
    n,
    new Ce(new Proxy(n.table, new ze(e, !1)))
  );
}
function qs(n, e) {
  return new L.Aliased(ke(n.sql, e), n.fieldAlias);
}
function ke(n, e) {
  return l.join(n.queryChunks.map((t) => m(t, D) ? re(t, e) : m(t, L) ? ke(t, e) : m(t, L.Aliased) ? qs(t, e) : t));
}
var br;
br = p;
const Fe = class Fe {
  constructor(e) {
    o(this, "config");
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
    if (t === F)
      return {
        ...e[F],
        selectedFields: new Proxy(
          e[F].selectedFields,
          this
        )
      };
    if (typeof t == "symbol")
      return e[t];
    const s = (m(e, J) ? e._.selectedFields : m(e, be) ? e[F].selectedFields : e)[t];
    if (m(s, L.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !s.isSelectionField)
        return s.sql;
      const i = s.clone();
      return i.isSelectionField = !0, i;
    }
    if (m(s, L)) {
      if (this.config.sqlBehavior === "sql")
        return s;
      throw new Error(
        `You tried to reference "${t}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return m(s, D) ? this.config.alias ? new Proxy(
      s,
      new Ce(
        new Proxy(
          s.table,
          new ze(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : s : typeof s != "object" || s === null ? s : new Proxy(s, new Fe(this.config));
  }
};
o(Fe, br, "SelectionProxyHandler");
let M = Fe;
var wr, Sr;
Sr = p, wr = Symbol.toStringTag;
class le {
  constructor() {
    o(this, wr, "QueryPromise");
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
o(le, Sr, "QueryPromise");
var Tr;
Tr = p;
class Ds {
  constructor(e, t) {
    /** @internal */
    o(this, "reference");
    /** @internal */
    o(this, "_onUpdate");
    /** @internal */
    o(this, "_onDelete");
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
    return new ks(e, this);
  }
}
o(Ds, Tr, "SQLiteForeignKeyBuilder");
var Nr;
Nr = p;
class ks {
  constructor(e, t) {
    o(this, "reference");
    o(this, "onUpdate");
    o(this, "onDelete");
    this.table = e, this.reference = t.reference, this.onUpdate = t._onUpdate, this.onDelete = t._onDelete;
  }
  getName() {
    const { name: e, columns: t, foreignColumns: r } = this.reference(), s = t.map((a) => a.name), i = r.map((a) => a.name), c = [
      this.table[ce],
      ...s,
      r[0].table[ce],
      ...i
    ];
    return e ?? `${c.join("_")}_fk`;
  }
}
o(ks, Nr, "SQLiteForeignKey");
function ca(n, e) {
  return `${n[ce]}_${e.join("_")}_unique`;
}
var Er, _r;
class te extends (_r = vs, Er = p, _r) {
  constructor() {
    super(...arguments);
    o(this, "foreignKeyConfigs", []);
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
    return this.foreignKeyConfigs.map(({ ref: s, actions: i }) => ((c, a) => {
      const u = new Ds(() => {
        const g = c();
        return { columns: [t], foreignColumns: [g] };
      });
      return a.onUpdate && u.onUpdate(a.onUpdate), a.onDelete && u.onDelete(a.onDelete), u.build(r);
    })(s, i));
  }
}
o(te, Er, "SQLiteColumnBuilder");
var Lr, Ar;
class K extends (Ar = D, Lr = p, Ar) {
  constructor(e, t) {
    t.uniqueName || (t.uniqueName = ca(e, [t.name])), super(e, t), this.table = e;
  }
}
o(K, Lr, "SQLiteColumn");
var vr, Cr;
class js extends (Cr = te, vr = p, Cr) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Ps(e, this.config);
  }
}
o(js, vr, "SQLiteBigIntBuilder");
var Ir, $r;
class Ps extends ($r = K, Ir = p, $r) {
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
o(Ps, Ir, "SQLiteBigInt");
var Or, Br;
class Us extends (Br = te, Or = p, Br) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Ms(
      e,
      this.config
    );
  }
}
o(Us, Or, "SQLiteBlobJsonBuilder");
var xr, Qr;
class Ms extends (Qr = K, xr = p, Qr) {
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
o(Ms, xr, "SQLiteBlobJson");
var qr, Dr;
class Fs extends (Dr = te, qr = p, Dr) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new Rs(e, this.config);
  }
}
o(Fs, qr, "SQLiteBlobBufferBuilder");
var kr, jr;
class Rs extends (jr = K, kr = p, jr) {
  getSQLType() {
    return "blob";
  }
}
o(Rs, kr, "SQLiteBlobBuffer");
function la(n, e) {
  const { name: t, config: r } = Ke(n, e);
  return (r == null ? void 0 : r.mode) === "json" ? new Us(t) : (r == null ? void 0 : r.mode) === "bigint" ? new js(t) : new Fs(t);
}
var Pr, Ur;
class Ks extends (Ur = te, Pr = p, Ur) {
  constructor(e, t, r) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = t, this.config.customTypeParams = r;
  }
  /** @internal */
  build(e) {
    return new zs(
      e,
      this.config
    );
  }
}
o(Ks, Pr, "SQLiteCustomColumnBuilder");
var Mr, Fr;
class zs extends (Fr = K, Mr = p, Fr) {
  constructor(t, r) {
    super(t, r);
    o(this, "sqlName");
    o(this, "mapTo");
    o(this, "mapFrom");
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
o(zs, Mr, "SQLiteCustomColumn");
function ua(n) {
  return (e, t) => {
    const { name: r, config: s } = Ke(e, t);
    return new Ks(
      r,
      s,
      n
    );
  };
}
var Rr, Kr;
class Ve extends (Kr = te, Rr = p, Kr) {
  constructor(e, t, r) {
    super(e, t, r), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
o(Ve, Rr, "SQLiteBaseIntegerBuilder");
var zr, Vr;
class Xe extends (Vr = K, zr = p, Vr) {
  constructor() {
    super(...arguments);
    o(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
o(Xe, zr, "SQLiteBaseInteger");
var Xr, Jr;
class Vs extends (Jr = Ve, Xr = p, Jr) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new Xs(
      e,
      this.config
    );
  }
}
o(Vs, Xr, "SQLiteIntegerBuilder");
var Gr, Yr;
class Xs extends (Yr = Xe, Gr = p, Yr) {
}
o(Xs, Gr, "SQLiteInteger");
var Wr, Hr;
class Js extends (Hr = Ve, Wr = p, Hr) {
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
    return new Gs(
      e,
      this.config
    );
  }
}
o(Js, Wr, "SQLiteTimestampBuilder");
var Zr, en;
class Gs extends (en = Xe, Zr = p, en) {
  constructor() {
    super(...arguments);
    o(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return this.config.mode === "timestamp" ? new Date(t * 1e3) : new Date(t);
  }
  mapToDriverValue(t) {
    const r = t.getTime();
    return this.config.mode === "timestamp" ? Math.floor(r / 1e3) : r;
  }
}
o(Gs, Zr, "SQLiteTimestamp");
var tn, rn;
class Ys extends (rn = Ve, tn = p, rn) {
  constructor(e, t) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = t;
  }
  build(e) {
    return new Ws(
      e,
      this.config
    );
  }
}
o(Ys, tn, "SQLiteBooleanBuilder");
var nn, sn;
class Ws extends (sn = Xe, nn = p, sn) {
  constructor() {
    super(...arguments);
    o(this, "mode", this.config.mode);
  }
  mapFromDriverValue(t) {
    return Number(t) === 1;
  }
  mapToDriverValue(t) {
    return t ? 1 : 0;
  }
}
o(Ws, nn, "SQLiteBoolean");
function ge(n, e) {
  const { name: t, config: r } = Ke(n, e);
  return (r == null ? void 0 : r.mode) === "timestamp" || (r == null ? void 0 : r.mode) === "timestamp_ms" ? new Js(t, r.mode) : (r == null ? void 0 : r.mode) === "boolean" ? new Ys(t, r.mode) : new Vs(t);
}
var an, on;
class Hs extends (on = te, an = p, on) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new Zs(
      e,
      this.config
    );
  }
}
o(Hs, an, "SQLiteNumericBuilder");
var cn, ln;
class Zs extends (ln = K, cn = p, ln) {
  getSQLType() {
    return "numeric";
  }
}
o(Zs, cn, "SQLiteNumeric");
function da(n) {
  return new Hs(n ?? "");
}
var un, dn;
class ei extends (dn = te, un = p, dn) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new ti(e, this.config);
  }
}
o(ei, un, "SQLiteRealBuilder");
var hn, mn;
class ti extends (mn = K, hn = p, mn) {
  getSQLType() {
    return "real";
  }
}
o(ti, hn, "SQLiteReal");
function W(n) {
  return new ei(n ?? "");
}
var fn, pn;
class ri extends (pn = te, fn = p, pn) {
  constructor(e, t) {
    super(e, "string", "SQLiteText"), this.config.enumValues = t.enum, this.config.length = t.length;
  }
  /** @internal */
  build(e) {
    return new ni(e, this.config);
  }
}
o(ri, fn, "SQLiteTextBuilder");
var yn, gn;
class ni extends (gn = K, yn = p, gn) {
  constructor(t, r) {
    super(t, r);
    o(this, "enumValues", this.config.enumValues);
    o(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
o(ni, yn, "SQLiteText");
var bn, wn;
class si extends (wn = te, bn = p, wn) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new ii(
      e,
      this.config
    );
  }
}
o(si, bn, "SQLiteTextJsonBuilder");
var Sn, Tn;
class ii extends (Tn = K, Sn = p, Tn) {
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
o(ii, Sn, "SQLiteTextJson");
function E(n, e = {}) {
  const { name: t, config: r } = Ke(n, e);
  return r.mode === "json" ? new si(t) : new ri(t, r);
}
function ha() {
  return {
    blob: la,
    customType: ua,
    integer: ge,
    numeric: da,
    real: W,
    text: E
  };
}
const ot = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Nn, En, _n, Ln, An;
class X extends (An = S, Ln = p, _n = S.Symbol.Columns, En = ot, Nn = S.Symbol.ExtraConfigBuilder, An) {
  constructor() {
    super(...arguments);
    /** @internal */
    o(this, _n);
    /** @internal */
    o(this, En, []);
    /** @internal */
    o(this, Nn);
  }
}
o(X, Ln, "SQLiteTable"), /** @internal */
o(X, "Symbol", Object.assign({}, S.Symbol, {
  InlineForeignKeys: ot
}));
function ma(n, e, t, r, s = n) {
  const i = new X(n, r, s), c = typeof e == "function" ? e(ha()) : e, a = Object.fromEntries(
    Object.entries(c).map(([g, d]) => {
      const C = d;
      C.setName(g);
      const N = C.build(i);
      return i[ot].push(...C.buildForeignKeys(N, i)), [g, N];
    })
  ), u = Object.assign(i, a);
  return u[S.Symbol.Columns] = a, u[S.Symbol.ExtraConfigColumns] = a, u;
}
const ie = (n, e, t) => ma(n, e);
var vn, Cn;
class ct extends (Cn = le, vn = p, Cn) {
  constructor(t, r, s, i) {
    super();
    /** @internal */
    o(this, "config");
    o(this, "run", (t) => this._prepare().run(t));
    o(this, "all", (t) => this._prepare().all(t));
    o(this, "get", (t) => this._prepare().get(t));
    o(this, "values", (t) => this._prepare().values(t));
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
          new M({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
  returning(t = this.table[X.Symbol.Columns]) {
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
o(ct, vn, "SQLiteDelete");
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
var In;
In = p;
class ai {
  constructor(e) {
    /** @internal */
    o(this, "cache", {});
    o(this, "cachedTables", {});
    o(this, "convert");
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
        const c = `${s}.${i.name}`;
        this.cache[c] = this.convert(i.name);
      }
      this.cachedTables[s] = !0;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
}
o(ai, In, "CasingCache");
var $n, On;
class Je extends (On = Error, $n = p, On) {
  constructor({ message: e, cause: t }) {
    super(e), this.name = "DrizzleError", this.cause = t;
  }
}
o(Je, $n, "DrizzleError");
var Bn, xn;
class oi extends (xn = Je, Bn = p, xn) {
  constructor() {
    super({ message: "Rollback" });
  }
}
o(oi, Bn, "TransactionRollbackError");
var Qn, qn;
class Ge extends (qn = be, Qn = p, qn) {
}
o(Ge, Qn, "SQLiteViewBase");
var Dn;
Dn = p;
class je {
  constructor(e) {
    /** @internal */
    o(this, "casing");
    this.casing = new ai(e == null ? void 0 : e.casing);
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
  buildDeleteQuery({ table: e, where: t, returning: r, withList: s, limit: i, orderBy: c }) {
    const a = this.buildWithCTE(s), u = r ? l` returning ${this.buildSelection(r, { isSingleTable: !0 })}` : void 0, g = t ? l` where ${t}` : void 0, d = this.buildOrderBy(c), C = this.buildLimit(i);
    return l`${a}delete from ${e}${g}${u}${d}${C}`;
  }
  buildUpdateSet(e, t) {
    const r = e[S.Symbol.Columns], s = Object.keys(r).filter(
      (c) => {
        var a;
        return t[c] !== void 0 || ((a = r[c]) == null ? void 0 : a.onUpdateFn) !== void 0;
      }
    ), i = s.length;
    return l.join(s.flatMap((c, a) => {
      const u = r[c], g = t[c] ?? l.param(u.onUpdateFn(), u), d = l`${l.identifier(this.casing.getColumnCasing(u))} = ${g}`;
      return a < i - 1 ? [d, l.raw(", ")] : [d];
    }));
  }
  buildUpdateQuery({ table: e, set: t, where: r, returning: s, withList: i, joins: c, from: a, limit: u, orderBy: g }) {
    const d = this.buildWithCTE(i), C = this.buildUpdateSet(e, t), N = a && l.join([l.raw(" from "), this.buildFromTable(a)]), A = this.buildJoins(c), _ = s ? l` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, T = r ? l` where ${r}` : void 0, $ = this.buildOrderBy(g), Q = this.buildLimit(u);
    return l`${d}update ${e} set ${C}${N}${A}${T}${_}${$}${Q}`;
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
    const r = e.length, s = e.flatMap(({ field: i }, c) => {
      const a = [];
      if (m(i, L.Aliased) && i.isSelectionField)
        a.push(l.identifier(i.fieldAlias));
      else if (m(i, L.Aliased) || m(i, L)) {
        const u = m(i, L.Aliased) ? i.sql : i;
        t ? a.push(
          new L(
            u.queryChunks.map((g) => m(g, D) ? l.identifier(this.casing.getColumnCasing(g)) : g)
          )
        ) : a.push(u), m(i, L.Aliased) && a.push(l` as ${l.identifier(i.fieldAlias)}`);
      } else if (m(i, D)) {
        const u = i.table[S.Symbol.Name];
        t ? a.push(l.identifier(this.casing.getColumnCasing(i))) : a.push(l`${l.identifier(u)}.${l.identifier(this.casing.getColumnCasing(i))}`);
      }
      return c < r - 1 && a.push(l`, `), a;
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
        if (m(i, X)) {
          const c = i[X.Symbol.Name], a = i[X.Symbol.Schema], u = i[X.Symbol.OriginalName], g = c === u ? void 0 : s.alias;
          t.push(
            l`${l.raw(s.joinType)} join ${a ? l`${l.identifier(a)}.` : void 0}${l.identifier(u)}${g && l` ${l.identifier(g)}`} on ${s.on}`
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
    return m(e, S) && e[S.Symbol.OriginalName] !== e[S.Symbol.Name] ? l`${l.identifier(e[S.Symbol.OriginalName])} ${l.identifier(e[S.Symbol.Name])}` : e;
  }
  buildSelectQuery({
    withList: e,
    fields: t,
    fieldsFlat: r,
    where: s,
    having: i,
    table: c,
    joins: a,
    orderBy: u,
    groupBy: g,
    limit: d,
    offset: C,
    distinct: N,
    setOperators: A
  }) {
    const _ = r ?? fe(t);
    for (const Y of _)
      if (m(Y.field, D) && Ee(Y.field.table) !== (m(c, J) ? c._.alias : m(c, Ge) ? c[F].name : m(c, L) ? void 0 : Ee(c)) && !((H) => a == null ? void 0 : a.some(
        ({ alias: $e }) => $e === (H[S.Symbol.IsAlias] ? Ee(H) : H[S.Symbol.BaseName])
      ))(Y.field.table)) {
        const H = Ee(Y.field.table);
        throw new Error(
          `Your "${Y.path.join("->")}" field references a column "${H}"."${Y.field.name}", but the table "${H}" is not part of the query! Did you forget to join it?`
        );
      }
    const T = !a || a.length === 0, $ = this.buildWithCTE(e), Q = N ? l` distinct` : void 0, j = this.buildSelection(_, { isSingleTable: T }), P = this.buildFromTable(c), B = this.buildJoins(a), G = s ? l` where ${s}` : void 0, v = i ? l` having ${i}` : void 0, b = [];
    if (g)
      for (const [Y, H] of g.entries())
        b.push(H), Y < g.length - 1 && b.push(l`, `);
    const q = b.length > 0 ? l` group by ${l.join(b)}` : void 0, z = this.buildOrderBy(u), Ie = this.buildLimit(d), We = C ? l` offset ${C}` : void 0, we = l`${$}select${Q} ${j} from ${P}${B}${G}${q}${v}${z}${Ie}${We}`;
    return A.length > 0 ? this.buildSetOperations(we, A) : we;
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
    setOperator: { type: t, isAll: r, rightSelect: s, limit: i, orderBy: c, offset: a }
  }) {
    const u = l`${e.getSQL()} `, g = l`${s.getSQL()}`;
    let d;
    if (c && c.length > 0) {
      const _ = [];
      for (const T of c)
        if (m(T, K))
          _.push(l.identifier(T.name));
        else if (m(T, L)) {
          for (let $ = 0; $ < T.queryChunks.length; $++) {
            const Q = T.queryChunks[$];
            m(Q, K) && (T.queryChunks[$] = l.identifier(this.casing.getColumnCasing(Q)));
          }
          _.push(l`${T}`);
        } else
          _.push(l`${T}`);
      d = l` order by ${l.join(_, l`, `)}`;
    }
    const C = typeof i == "object" || typeof i == "number" && i >= 0 ? l` limit ${i}` : void 0, N = l.raw(`${t} ${r ? "all " : ""}`), A = a ? l` offset ${a}` : void 0;
    return l`${u}${N}${g}${d}${C}${A}`;
  }
  buildInsertQuery({ table: e, values: t, onConflict: r, returning: s, withList: i, select: c }) {
    const a = [], u = e[S.Symbol.Columns], g = Object.entries(u).filter(
      ([T, $]) => !$.shouldDisableInsert()
    ), d = g.map(([, T]) => l.identifier(this.casing.getColumnCasing(T)));
    if (c) {
      const T = t;
      m(T, L) ? a.push(T) : a.push(T.getSQL());
    } else {
      const T = t;
      a.push(l.raw("values "));
      for (const [$, Q] of T.entries()) {
        const j = [];
        for (const [P, B] of g) {
          const G = Q[P];
          if (G === void 0 || m(G, se) && G.value === void 0) {
            let v;
            if (B.default !== null && B.default !== void 0)
              v = m(B.default, L) ? B.default : l.param(B.default, B);
            else if (B.defaultFn !== void 0) {
              const b = B.defaultFn();
              v = m(b, L) ? b : l.param(b, B);
            } else if (!B.default && B.onUpdateFn !== void 0) {
              const b = B.onUpdateFn();
              v = m(b, L) ? b : l.param(b, B);
            } else
              v = l`null`;
            j.push(v);
          } else
            j.push(G);
        }
        a.push(j), $ < T.length - 1 && a.push(l`, `);
      }
    }
    const C = this.buildWithCTE(i), N = l.join(a), A = s ? l` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, _ = r ? l` on conflict ${r}` : void 0;
    return l`${C}insert into ${e} ${d} ${N}${_}${A}`;
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
    queryConfig: c,
    tableAlias: a,
    nestedQueryRelation: u,
    joinOn: g
  }) {
    let d = [], C, N, A = [], _;
    const T = [];
    if (c === !0)
      d = Object.entries(i.columns).map(([j, P]) => ({
        dbKey: P.name,
        tsKey: j,
        field: re(P, a),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const Q = Object.fromEntries(
        Object.entries(i.columns).map(([b, q]) => [b, re(q, a)])
      );
      if (c.where) {
        const b = typeof c.where == "function" ? c.where(Q, ta()) : c.where;
        _ = b && ke(b, a);
      }
      const j = [];
      let P = [];
      if (c.columns) {
        let b = !1;
        for (const [q, z] of Object.entries(c.columns))
          z !== void 0 && q in i.columns && (!b && z === !0 && (b = !0), P.push(q));
        P.length > 0 && (P = b ? P.filter((q) => {
          var z;
          return ((z = c.columns) == null ? void 0 : z[q]) === !0;
        }) : Object.keys(i.columns).filter((q) => !P.includes(q)));
      } else
        P = Object.keys(i.columns);
      for (const b of P) {
        const q = i.columns[b];
        j.push({ tsKey: b, value: q });
      }
      let B = [];
      c.with && (B = Object.entries(c.with).filter((b) => !!b[1]).map(([b, q]) => ({ tsKey: b, queryConfig: q, relation: i.relations[b] })));
      let G;
      if (c.extras) {
        G = typeof c.extras == "function" ? c.extras(Q, { sql: l }) : c.extras;
        for (const [b, q] of Object.entries(G))
          j.push({
            tsKey: b,
            value: qs(q, a)
          });
      }
      for (const { tsKey: b, value: q } of j)
        d.push({
          dbKey: m(q, L.Aliased) ? q.fieldAlias : i.columns[b].name,
          tsKey: b,
          field: m(q, D) ? re(q, a) : q,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let v = typeof c.orderBy == "function" ? c.orderBy(Q, ra()) : c.orderBy ?? [];
      Array.isArray(v) || (v = [v]), A = v.map((b) => m(b, D) ? re(b, a) : ke(b, a)), C = c.limit, N = c.offset;
      for (const {
        tsKey: b,
        queryConfig: q,
        relation: z
      } of B) {
        const Ie = aa(t, r, z), We = ve(z.referencedTable), we = r[We], Y = `${a}_${b}`, H = U(
          ...Ie.fields.map(
            (Ti, Ni) => h(
              re(Ie.references[Ni], Y),
              re(Ti, a)
            )
          )
        ), $e = this.buildRelationalQuery({
          fullSchema: e,
          schema: t,
          tableNamesMap: r,
          table: e[we],
          tableConfig: t[we],
          queryConfig: m(z, ye) ? q === !0 ? { limit: 1 } : { ...q, limit: 1 } : q,
          tableAlias: Y,
          joinOn: H,
          nestedQueryRelation: z
        }), Si = l`(${$e.sql})`.as(b);
        d.push({
          dbKey: b,
          tsKey: b,
          field: Si,
          relationTableTsKey: we,
          isJson: !0,
          selection: $e.selection
        });
      }
    }
    if (d.length === 0)
      throw new Je({
        message: `No fields selected for table "${i.tsName}" ("${a}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let $;
    if (_ = U(g, _), u) {
      let Q = l`json_array(${l.join(
        d.map(
          ({ field: B }) => m(B, K) ? l.identifier(this.casing.getColumnCasing(B)) : m(B, L.Aliased) ? B.sql : B
        ),
        l`, `
      )})`;
      m(u, De) && (Q = l`coalesce(json_group_array(${Q}), json_array())`);
      const j = [{
        dbKey: "data",
        tsKey: "data",
        field: Q.as("data"),
        isJson: !0,
        relationTableTsKey: i.tsName,
        selection: d
      }];
      C !== void 0 || N !== void 0 || A.length > 0 ? ($ = this.buildSelectQuery({
        table: et(s, a),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: l.raw("*")
          }
        ],
        where: _,
        limit: C,
        offset: N,
        orderBy: A,
        setOperators: []
      }), _ = void 0, C = void 0, N = void 0, A = void 0) : $ = et(s, a), $ = this.buildSelectQuery({
        table: m($, X) ? $ : new J($, {}, a),
        fields: {},
        fieldsFlat: j.map(({ field: B }) => ({
          path: [],
          field: m(B, D) ? re(B, a) : B
        })),
        joins: T,
        where: _,
        limit: C,
        offset: N,
        orderBy: A,
        setOperators: []
      });
    } else
      $ = this.buildSelectQuery({
        table: et(s, a),
        fields: {},
        fieldsFlat: d.map(({ field: Q }) => ({
          path: [],
          field: m(Q, D) ? re(Q, a) : Q
        })),
        joins: T,
        where: _,
        limit: C,
        offset: N,
        orderBy: A,
        setOperators: []
      });
    return {
      tableTsKey: i.tsName,
      sql: $,
      selection: d
    };
  }
}
o(je, Dn, "SQLiteDialect");
var kn, jn;
class St extends (jn = je, kn = p, jn) {
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
          for (const g of u.sql)
            t.run(l.raw(g));
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
o(St, kn, "SQLiteSyncDialect");
var Pn;
Pn = p;
class ci {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
o(ci, Pn, "TypedQueryBuilder");
var Un;
Un = p;
class ne {
  constructor(e) {
    o(this, "fields");
    o(this, "session");
    o(this, "dialect");
    o(this, "withList");
    o(this, "distinct");
    this.fields = e.fields, this.session = e.session, this.dialect = e.dialect, this.withList = e.withList, this.distinct = e.distinct;
  }
  from(e) {
    const t = !!this.fields;
    let r;
    return this.fields ? r = this.fields : m(e, J) ? r = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : m(e, Ge) ? r = e[F].selectedFields : m(e, L) ? r = {} : r = xi(e), new Tt({
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
o(ne, Un, "SQLiteSelectBuilder");
var Mn, Fn;
class li extends (Fn = ci, Mn = p, Fn) {
  constructor({ table: t, fields: r, isPartialSelect: s, session: i, dialect: c, withList: a, distinct: u }) {
    super();
    o(this, "_");
    /** @internal */
    o(this, "config");
    o(this, "joinsNotNullableMap");
    o(this, "tableName");
    o(this, "isPartialSelect");
    o(this, "session");
    o(this, "dialect");
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
    o(this, "leftJoin", this.createJoin("left"));
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
    o(this, "rightJoin", this.createJoin("right"));
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
    o(this, "innerJoin", this.createJoin("inner"));
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
    o(this, "fullJoin", this.createJoin("full"));
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
    o(this, "union", this.createSetOperator("union", !1));
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
    o(this, "unionAll", this.createSetOperator("union", !0));
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
    o(this, "intersect", this.createSetOperator("intersect", !1));
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
    o(this, "except", this.createSetOperator("except", !1));
    this.config = {
      withList: a,
      table: t,
      fields: { ...r },
      distinct: u,
      setOperators: []
    }, this.isPartialSelect = s, this.session = i, this.dialect = c, this._ = {
      selectedFields: r
    }, this.tableName = st(t), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
  }
  createJoin(t) {
    return (r, s) => {
      var a;
      const i = this.tableName, c = st(r);
      if (typeof c == "string" && ((a = this.config.joins) != null && a.some((u) => u.alias === c)))
        throw new Error(`Alias "${c}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof i == "string" && (this.config.fields = {
        [i]: this.config.fields
      }), typeof c == "string" && !m(r, L))) {
        const u = m(r, J) ? r._.selectedFields : m(r, be) ? r[F].selectedFields : r[S.Symbol.Columns];
        this.config.fields[c] = u;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new M({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      )), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: s, table: r, joinType: t, alias: c }), typeof c == "string")
        switch (t) {
          case "left": {
            this.joinsNotNullableMap[c] = !1;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([u]) => [u, !1])
            ), this.joinsNotNullableMap[c] = !0;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[c] = !0;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([u]) => [u, !1])
            ), this.joinsNotNullableMap[c] = !1;
            break;
          }
        }
      return this;
    };
  }
  createSetOperator(t, r) {
    return (s) => {
      const i = typeof s == "function" ? s(ga()) : s;
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
        new M({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
        new M({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = t, this;
  }
  groupBy(...t) {
    if (typeof t[0] == "function") {
      const r = t[0](
        new Proxy(
          this.config.fields,
          new M({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
          new M({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
      new J(this.getSQL(), this.config.fields, t),
      new M({ alias: t, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new M({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
o(li, Mn, "SQLiteSelectQueryBuilder");
var Rn, Kn;
class Tt extends (Kn = li, Rn = p, Kn) {
  constructor() {
    super(...arguments);
    o(this, "run", (t) => this._prepare().run(t));
    o(this, "all", (t) => this._prepare().all(t));
    o(this, "get", (t) => this._prepare().get(t));
    o(this, "values", (t) => this._prepare().values(t));
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
o(Tt, Rn, "SQLiteSelect");
Bi(Tt, [le]);
function Ye(n, e) {
  return (t, r, ...s) => {
    const i = [r, ...s].map((c) => ({
      type: n,
      isAll: e,
      rightSelect: c
    }));
    for (const c of i)
      if (!bt(t.getSelectedFields(), c.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return t.addSetOperators(i);
  };
}
const ga = () => ({
  union: ba,
  unionAll: wa,
  intersect: Sa,
  except: Ta
}), ba = Ye("union", !1), wa = Ye("union", !0), Sa = Ye("intersect", !1), Ta = Ye("except", !1);
var zn;
zn = p;
class Nt {
  constructor(e) {
    o(this, "dialect");
    o(this, "dialectConfig");
    this.dialect = m(e, je) ? e : void 0, this.dialectConfig = m(e, je) ? void 0 : e;
  }
  $with(e) {
    const t = this;
    return {
      as(r) {
        return typeof r == "function" && (r = r(t)), new Proxy(
          new gt(r.getSQL(), r.getSelectedFields(), e, !0),
          new M({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
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
    return this.dialect || (this.dialect = new St(this.dialectConfig)), this.dialect;
  }
}
o(Nt, zn, "SQLiteQueryBuilder");
var Vn;
Vn = p;
class lt {
  constructor(e, t, r, s) {
    this.table = e, this.session = t, this.dialect = r, this.withList = s;
  }
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const t = e.map((r) => {
      const s = {}, i = this.table[S.Symbol.Columns];
      for (const c of Object.keys(r)) {
        const a = r[c];
        s[c] = m(a, L) ? a : new se(a, i[c]);
      }
      return s;
    });
    return new ut(this.table, t, this.session, this.dialect, this.withList);
  }
  select(e) {
    const t = typeof e == "function" ? e(new Nt()) : e;
    if (!m(t, L) && !bt(this.table[rt], t._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new ut(this.table, t, this.session, this.dialect, this.withList, !0);
  }
}
o(lt, Vn, "SQLiteInsertBuilder");
var Xn, Jn;
class ut extends (Jn = le, Xn = p, Jn) {
  constructor(t, r, s, i, c, a) {
    super();
    /** @internal */
    o(this, "config");
    o(this, "run", (t) => this._prepare().run(t));
    o(this, "all", (t) => this._prepare().all(t));
    o(this, "get", (t) => this._prepare().get(t));
    o(this, "values", (t) => this._prepare().values(t));
    this.session = s, this.dialect = i, this.config = { table: t, values: r, withList: c, select: a };
  }
  returning(t = this.config.table[X.Symbol.Columns]) {
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
    const r = t.where ? l` where ${t.where}` : void 0, s = t.targetWhere ? l` where ${t.targetWhere}` : void 0, i = t.setWhere ? l` where ${t.setWhere}` : void 0, c = Array.isArray(t.target) ? l`${t.target}` : l`${[t.target]}`, a = this.dialect.buildUpdateSet(this.config.table, Os(this.config.table, t.set));
    return this.config.onConflict = l`${c}${s} do update set ${a}${r}${i}`, this;
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
o(ut, Xn, "SQLiteInsert");
var Gn;
Gn = p;
class dt {
  constructor(e, t, r, s) {
    this.table = e, this.session = t, this.dialect = r, this.withList = s;
  }
  set(e) {
    return new ui(
      this.table,
      Os(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
o(dt, Gn, "SQLiteUpdateBuilder");
var Yn, Wn;
class ui extends (Wn = le, Yn = p, Wn) {
  constructor(t, r, s, i, c) {
    super();
    /** @internal */
    o(this, "config");
    o(this, "leftJoin", this.createJoin("left"));
    o(this, "rightJoin", this.createJoin("right"));
    o(this, "innerJoin", this.createJoin("inner"));
    o(this, "fullJoin", this.createJoin("full"));
    o(this, "run", (t) => this._prepare().run(t));
    o(this, "all", (t) => this._prepare().all(t));
    o(this, "get", (t) => this._prepare().get(t));
    o(this, "values", (t) => this._prepare().values(t));
    this.session = s, this.dialect = i, this.config = { set: r, table: t, withList: c, joins: [] };
  }
  from(t) {
    return this.config.from = t, this;
  }
  createJoin(t) {
    return (r, s) => {
      const i = st(r);
      if (typeof i == "string" && this.config.joins.some((c) => c.alias === i))
        throw new Error(`Alias "${i}" is already used in this query`);
      if (typeof s == "function") {
        const c = this.config.from ? m(r, X) ? r[S.Symbol.Columns] : m(r, J) ? r._.selectedFields : m(r, Ge) ? r[F].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[S.Symbol.Columns],
            new M({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          c && new Proxy(
            c,
            new M({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
          new M({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
  returning(t = this.config.table[X.Symbol.Columns]) {
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
o(ui, Yn, "SQLiteUpdate");
var Hn, Zn, es;
const Ae = class Ae extends (es = L, Zn = p, Hn = Symbol.toStringTag, es) {
  constructor(t) {
    super(Ae.buildEmbeddedCount(t.source, t.filters).queryChunks);
    o(this, "sql");
    o(this, Hn, "SQLiteCountBuilderAsync");
    o(this, "session");
    this.params = t, this.session = t.session, this.sql = Ae.buildCount(
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
o(Ae, Zn, "SQLiteCountBuilderAsync");
let ht = Ae;
var ts;
ts = p;
class di {
  constructor(e, t, r, s, i, c, a, u) {
    this.mode = e, this.fullSchema = t, this.schema = r, this.tableNamesMap = s, this.table = i, this.tableConfig = c, this.dialect = a, this.session = u;
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
o(di, ts, "SQLiteAsyncRelationalQueryBuilder");
var rs, ns;
class Pe extends (ns = le, rs = p, ns) {
  constructor(t, r, s, i, c, a, u, g, d) {
    super();
    /** @internal */
    o(this, "mode");
    this.fullSchema = t, this.schema = r, this.tableNamesMap = s, this.table = i, this.tableConfig = c, this.dialect = a, this.session = u, this.config = g, this.mode = d;
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
      (i, c) => {
        const a = i.map(
          (u) => at(this.schema, this.tableConfig, u, r.selection, c)
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
o(Pe, rs, "SQLiteAsyncRelationalQuery");
var ss, is;
class mt extends (is = Pe, ss = p, is) {
  sync() {
    return this.executeRaw();
  }
}
o(mt, ss, "SQLiteSyncRelationalQuery");
var as, os;
class Le extends (os = le, as = p, os) {
  constructor(t, r, s, i, c) {
    super();
    /** @internal */
    o(this, "config");
    this.execute = t, this.getSQL = r, this.dialect = i, this.mapBatchResult = c, this.config = { action: s };
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
o(Le, as, "SQLiteRaw");
var cs;
cs = p;
class Et {
  constructor(e, t, r, s) {
    o(this, "query");
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
      for (const [c, a] of Object.entries(this._.schema))
        i[c] = new di(
          e,
          s.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          s.fullSchema[c],
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
        return typeof r == "function" && (r = r(new Nt(t.dialect))), new Proxy(
          new gt(r.getSQL(), r.getSelectedFields(), e, !0),
          new M({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  $count(e, t) {
    return new ht({ source: e, filters: t, session: this.session });
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
      return new dt(u, t.session, t.dialect, e);
    }
    function c(u) {
      return new lt(u, t.session, t.dialect, e);
    }
    function a(u) {
      return new ct(u, t.session, t.dialect, e);
    }
    return { select: r, selectDistinct: s, update: i, insert: c, delete: a };
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
    return new dt(e, this.session, this.dialect);
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
    return new lt(e, this.session, this.dialect);
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
    return new ct(e, this.session, this.dialect);
  }
  run(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Le(
      async () => this.session.run(t),
      () => t,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(t);
  }
  all(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Le(
      async () => this.session.all(t),
      () => t,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(t);
  }
  get(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Le(
      async () => this.session.get(t),
      () => t,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(t);
  }
  values(e) {
    const t = typeof e == "string" ? l.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Le(
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
o(Et, cs, "BaseSQLiteDatabase");
var ls, us;
class hi extends (us = le, ls = p, us) {
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
o(hi, ls, "ExecuteResultSync");
var ds;
ds = p;
class mi {
  constructor(e, t, r) {
    /** @internal */
    o(this, "joinsNotNullableMap");
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
    return this.mode === "async" ? this[this.executeMethod](e) : new hi(() => this[this.executeMethod](e));
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
o(mi, ds, "PreparedQuery");
var hs;
hs = p;
class fi {
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
      throw new Je({ cause: r, message: `Failed to run the query '${t.sql}'` });
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
o(fi, hs, "SQLiteSession");
var ms, fs;
class pi extends (fs = Et, ms = p, fs) {
  constructor(e, t, r, s, i = 0) {
    super(e, t, r, s), this.schema = s, this.nestedIndex = i;
  }
  rollback() {
    throw new oi();
  }
}
o(pi, ms, "SQLiteTransaction");
var ps, ys;
class yi extends (ys = fi, ps = p, ys) {
  constructor(t, r, s, i = {}) {
    super(r);
    o(this, "logger");
    this.client = t, this.schema = s, this.logger = i.logger ?? new As();
  }
  prepareQuery(t, r, s, i, c) {
    const a = this.client.prepare(t.sql);
    return new gi(
      a,
      t,
      this.logger,
      r,
      s,
      i,
      c
    );
  }
  transaction(t, r = {}) {
    const s = new ft("sync", this.dialect, this, this.schema);
    return this.client.transaction(t)[r.behavior ?? "deferred"](s);
  }
}
o(yi, ps, "BetterSQLiteSession");
var gs, bs;
const Re = class Re extends (bs = pi, gs = p, bs) {
  transaction(e) {
    const t = `sp${this.nestedIndex}`, r = new Re("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(l.raw(`savepoint ${t}`));
    try {
      const s = e(r);
      return this.session.run(l.raw(`release savepoint ${t}`)), s;
    } catch (s) {
      throw this.session.run(l.raw(`rollback to savepoint ${t}`)), s;
    }
  }
};
o(Re, gs, "BetterSQLiteTransaction");
let ft = Re;
var ws, Ss;
class gi extends (Ss = mi, ws = p, Ss) {
  constructor(e, t, r, s, i, c, a) {
    super("sync", i, t), this.stmt = e, this.logger = r, this.fields = s, this._isResponseInArrayMode = c, this.customResultMapper = a;
  }
  run(e) {
    const t = Oe(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.run(...t);
  }
  all(e) {
    const { fields: t, joinsNotNullableMap: r, query: s, logger: i, stmt: c, customResultMapper: a } = this;
    if (!t && !a) {
      const g = Oe(s.params, e ?? {});
      return i.logQuery(s.sql, g), c.all(...g);
    }
    const u = this.values(e);
    return a ? a(u) : u.map((g) => Ct(t, g, r));
  }
  get(e) {
    const t = Oe(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, t);
    const { fields: r, stmt: s, joinsNotNullableMap: i, customResultMapper: c } = this;
    if (!r && !c)
      return s.get(...t);
    const a = s.raw().get(...t);
    if (a)
      return c ? c([a]) : Ct(r, a, i);
  }
  values(e) {
    const t = Oe(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, t), this.stmt.raw().all(...t);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
o(gi, ws, "BetterSQLitePreparedQuery");
var Ts, Ns;
class bi extends (Ns = Et, Ts = p, Ns) {
}
o(bi, Ts, "BetterSQLite3Database");
function Se(n, e = {}) {
  const t = new St({ casing: e.casing });
  let r;
  e.logger === !0 ? r = new Ls() : e.logger !== !1 && (r = e.logger);
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
  const i = new yi(n, t, s, { logger: r }), c = new bi("sync", t, i, s);
  return c.$client = n, c;
}
function pt(...n) {
  if (n[0] === void 0 || typeof n[0] == "string") {
    const e = n[0] === void 0 ? new _e() : new _e(n[0]);
    return Se(e, n[1]);
  }
  if (Qi(n[0])) {
    const { connection: e, client: t, ...r } = n[0];
    if (t)
      return Se(t, r);
    if (typeof e == "object") {
      const { source: i, ...c } = e, a = new _e(i, c);
      return Se(a, r);
    }
    const s = new _e(e);
    return Se(s, r);
  }
  return Se(n[0], n[1]);
}
((n) => {
  function e(t) {
    return Se({}, t);
  }
  n.mock = e;
})(pt || (pt = {}));
const ee = ie("accounts", {
  id: E("id").primaryKey(),
  code: E("code").notNull().unique(),
  // e.g. "100", "100.001", "120.001", "600.001"
  name: E("name").notNull(),
  // e.g. "Merkez Kasa", "ABC Mobilya"
  type: E("type", {
    enum: ["asset", "liability", "equity", "revenue", "expense"]
  }).notNull(),
  parentCode: E("parent_code"),
  // e.g. "100" for "100.001"
  isActive: ge("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: E("created_at").notNull()
}), w = ie("entities", {
  id: E("id").primaryKey(),
  name: E("name").notNull(),
  type: E("type", {
    enum: ["customer", "supplier", "bank", "cash", "partner"]
  }).notNull(),
  accountId: E("account_id").notNull(),
  // Link to 120.xxx, 320.xxx, 102.xxx, 100.xxx, 500.xxx
  phone: E("phone"),
  taxNumber: E("tax_number"),
  address: E("address"),
  notes: E("notes"),
  isActive: ge("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: E("created_at").notNull()
}), ae = ie("categories", {
  id: E("id").primaryKey(),
  name: E("name").notNull(),
  type: E("type", { enum: ["income", "expense"] }).notNull(),
  accountId: E("account_id").notNull(),
  // Link to revenue/expense account
  isActive: ge("is_active", { mode: "boolean" }).default(!0).notNull()
}), I = ie("documents", {
  id: E("id").primaryKey(),
  docNumber: E("doc_number").notNull().unique(),
  // e.g. SAT-2026-00001
  type: E("type", {
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
  date: E("date").notNull(),
  // ISO YYYY-MM-DD
  description: E("description"),
  totalAmount: W("total_amount").notNull(),
  createdAt: E("created_at").notNull()
}), f = ie("journal_entries", {
  id: E("id").primaryKey(),
  entryNumber: E("entry_number").notNull().unique(),
  // Fiş No e.g. YEV-2026-00001
  documentId: E("document_id"),
  date: E("date").notNull(),
  description: E("description").notNull(),
  status: E("status", { enum: ["active", "cancelled"] }).default("active").notNull(),
  createdAt: E("created_at").notNull()
}), y = ie("journal_items", {
  id: E("id").primaryKey(),
  journalEntryId: E("journal_entry_id").notNull().references(() => f.id, { onDelete: "cascade" }),
  accountId: E("account_id").notNull(),
  entityId: E("entity_id"),
  // Optional link to specific customer/supplier/bank/cash/partner entity
  debit: W("debit").default(0).notNull(),
  // Borç tutarı
  credit: W("credit").default(0).notNull(),
  // Alacak tutarı
  description: E("description")
}), Z = ie("settings", {
  id: E("id").primaryKey(),
  // 'app_settings'
  companyName: E("company_name").default("ABC Mobilya İmalat A.Ş.").notNull(),
  taxNumber: E("tax_number"),
  address: E("address"),
  phone: E("phone"),
  pinCode: E("pin_code"),
  // App lock pin code (e.g. '1234' or null)
  autoBackupEnabled: ge("auto_backup_enabled", { mode: "boolean" }).default(!0).notNull(),
  backupIntervalDays: ge("backup_interval_days").default(7).notNull(),
  lastBackupAt: E("last_backup_at"),
  updatedAt: E("updated_at").notNull()
}), V = ie("products", {
  id: E("id").primaryKey(),
  code: E("code").notNull().unique(),
  name: E("name").notNull(),
  category: E("category").default("Genel").notNull(),
  unit: E("unit").default("Adet").notNull(),
  purchasePrice: W("purchase_price").default(0).notNull(),
  salePrice: W("sale_price").default(0).notNull(),
  stockQuantity: W("stock_quantity").default(0).notNull(),
  minStockLevel: W("min_stock_level").default(5).notNull(),
  isActive: ge("is_active", { mode: "boolean" }).default(!0).notNull(),
  createdAt: E("created_at").notNull()
}), Te = ie("stock_movements", {
  id: E("id").primaryKey(),
  productId: E("product_id").notNull().references(() => V.id, { onDelete: "cascade" }),
  documentId: E("document_id"),
  type: E("type", { enum: ["in", "out"] }).notNull(),
  quantity: W("quantity").notNull(),
  unitPrice: W("unit_price").default(0).notNull(),
  totalPrice: W("total_price").default(0).notNull(),
  description: E("description"),
  date: E("date").notNull(),
  createdAt: E("created_at").notNull()
}), Na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accounts: ee,
  categories: ae,
  documents: I,
  entities: w,
  journalEntries: f,
  journalItems: y,
  products: V,
  settings: Z,
  stockMovements: Te
}, Symbol.toStringTag, { value: "Module" }));
async function Ea(n) {
  if (n.select().from(ee).all().length > 0)
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
  n.insert(ee).values(r).run();
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
  n.insert(w).values(s).run();
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
  n.insert(ae).values(i).run(), n.insert(Z).values({
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
let Ne = null, oe = null;
function O() {
  if (Ne)
    return Ne;
  const n = he.getPath("userData"), e = tt.join(n, "cari_finance.db");
  return console.log("[SQLite DB Path]:", e), oe = new _e(e), oe.pragma("journal_mode = WAL"), oe.pragma("foreign_keys = ON"), Ne = pt(oe, { schema: Na }), _a(oe), Ea(Ne).catch((t) => {
    console.error("[Database Seed Error]:", t);
  }), Ne;
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
  oe && (oe.close(), oe = null, Ne = null);
}
function La() {
  x.handle("transactions:create", async (n, e) => {
    const t = O();
    if (e.amount <= 0)
      throw new Error("İşlem tutarı 0 veya negatif olamaz.");
    const r = (/* @__PURE__ */ new Date()).toISOString(), s = "doc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7), i = "yev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7), c = {
      sale: "SAT",
      customer_payment: "TAH",
      purchase: "ALIM",
      supplier_payment: "ODE",
      partner_draw: "ORT-CEK",
      partner_deposit: "ORT-YAT",
      transfer: "VIR",
      expense: "GID"
    }, a = t.select({ count: l`count(*)` }).from(I).get(), u = (((a == null ? void 0 : a.count) || 0) + 1).toString().padStart(5, "0"), g = new Date(e.date || Date.now()).getFullYear(), d = `${c[e.type] || "ISL"}-${g}-${u}`, C = `YEV-${g}-${u}`;
    let N = "", A = "", _, T;
    if (e.type === "sale") {
      if (!e.entityId) throw new Error("Satış işlemi için müşteri seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get();
      if (!v) throw new Error("Müşteri bulunamadı.");
      N = v.accountId, _ = v.id;
      let b = e.categoryId ? t.select().from(ae).where(h(ae.id, e.categoryId)).get() : null;
      A = b ? b.accountId : "acc_600";
    } else if (e.type === "customer_payment") {
      if (!e.entityId) throw new Error("Tahsilat için müşteri seçilmelidir.");
      if (!e.targetEntityId) throw new Error("Tahsilatın aktarılacağı Kasa/Banka seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get(), b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!v || !b) throw new Error("Müşteri veya Kasa/Banka kaydı bulunamadı.");
      N = b.accountId, _ = b.id, A = v.accountId, T = v.id;
    } else if (e.type === "purchase") {
      if (!e.entityId) throw new Error("Satınalma için satıcı/tedarikçi seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get();
      if (!v) throw new Error("Tedarikçi bulunamadı.");
      let b = e.categoryId ? t.select().from(ae).where(h(ae.id, e.categoryId)).get() : null;
      N = b ? b.accountId : "acc_153", A = v.accountId, T = v.id;
    } else if (e.type === "supplier_payment") {
      if (!e.entityId) throw new Error("Ödeme yapılan satıcı seçilmelidir.");
      if (!e.targetEntityId) throw new Error("Ödemenin yapıldığı Kasa/Banka seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get(), b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!v || !b) throw new Error("Satıcı veya Kasa/Banka kaydı bulunamadı.");
      N = v.accountId, _ = v.id, A = b.accountId, T = b.id;
    } else if (e.type === "partner_draw") {
      if (!e.entityId) throw new Error("Para çeken ortak seçilmelidir.");
      if (!e.targetEntityId) throw new Error("Paranın çekildiği Kasa/Banka seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get(), b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!v || !b) throw new Error("Ortak veya Kasa/Banka kaydı bulunamadı.");
      N = v.accountId, _ = v.id, A = b.accountId, T = b.id;
    } else if (e.type === "partner_deposit") {
      if (!e.entityId) throw new Error("Para yatıran ortak seçilmelidir.");
      if (!e.targetEntityId) throw new Error("Paranın yatırıldığı Kasa/Banka seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get(), b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!v || !b) throw new Error("Ortak veya Kasa/Banka kaydı bulunamadı.");
      N = b.accountId, _ = b.id, A = v.accountId, T = v.id;
    } else if (e.type === "transfer") {
      if (!e.entityId) throw new Error("Kaynak Kasa/Banka seçilmelidir.");
      if (!e.targetEntityId) throw new Error("Hedef Kasa/Banka seçilmelidir.");
      const v = t.select().from(w).where(h(w.id, e.entityId)).get(), b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!v || !b) throw new Error("Virman hesapları bulunamadı.");
      N = b.accountId, _ = b.id, A = v.accountId, T = v.id;
    } else if (e.type === "expense") {
      if (!e.targetEntityId) throw new Error("Giderin ödendiği Kasa/Banka seçilmelidir.");
      let v = e.categoryId ? t.select().from(ae).where(h(ae.id, e.categoryId)).get() : null;
      N = v ? v.accountId : "acc_770";
      const b = t.select().from(w).where(h(w.id, e.targetEntityId)).get();
      if (!b) throw new Error("Ödeme yapılan Kasa/Banka kaydı bulunamadı.");
      A = b.accountId, T = b.id;
    }
    const $ = e.amount, Q = e.amount;
    if (Math.abs($ - Q) > 1e-3)
      throw new Error(`Muhasebe Kayıt Hatası: Toplam Borç (${$}) !== Toplam Alacak (${Q}). Fiş kaydedilemez.`);
    const j = {
      id: s,
      docNumber: d,
      type: e.type,
      date: e.date,
      description: e.description,
      totalAmount: e.amount,
      createdAt: r
    }, P = {
      id: i,
      entryNumber: C,
      documentId: s,
      date: e.date,
      description: e.description,
      status: "active",
      createdAt: r
    }, B = {
      id: "ji_" + Date.now() + "_1",
      journalEntryId: i,
      accountId: N,
      entityId: _ || null,
      debit: e.amount,
      credit: 0,
      description: e.description
    }, G = {
      id: "ji_" + Date.now() + "_2",
      journalEntryId: i,
      accountId: A,
      entityId: T || null,
      debit: 0,
      credit: e.amount,
      description: e.description
    };
    return t.insert(I).values(j).run(), t.insert(f).values(P).run(), t.insert(y).values([B, G]).run(), { success: !0, docNumber: d, entryNumber: C };
  }), x.handle("transactions:list", async (n, e) => {
    const t = O(), r = (e == null ? void 0 : e.limit) || 100;
    return t.select({
      id: f.id,
      entryNumber: f.entryNumber,
      docNumber: I.docNumber,
      docType: I.type,
      date: f.date,
      description: f.description,
      totalAmount: I.totalAmount,
      status: f.status
    }).from(f).leftJoin(I, h(f.documentId, I.id)).where(h(f.status, "active")).orderBy(pe(f.date), pe(f.createdAt)).limit(r).all();
  }), x.handle("transactions:cancel", async (n, e) => {
    const t = O(), r = t.select().from(f).where(h(f.id, e)).get();
    if (!r) throw new Error("İşlem kaydı bulunamadı.");
    if (r.status === "cancelled")
      throw new Error("İşlem zaten iptal edilmiş.");
    return t.update(f).set({ status: "cancelled" }).where(h(f.id, e)).run(), { success: !0 };
  });
}
function Aa() {
  x.handle("customers:list", async () => {
    const n = O();
    return n.select().from(w).where(h(w.type, "customer")).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${y.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, c = (s == null ? void 0 : s.totalCredit) || 0, a = i - c;
      return {
        ...r,
        totalDebit: i,
        totalCredit: c,
        balance: a
      };
    });
  }), x.handle("customers:getStatement", async (n, e) => {
    const t = O(), r = t.select().from(w).where(h(w.id, e)).get();
    if (!r) throw new Error("Müşteri bulunamadı.");
    const s = t.select({
      id: y.id,
      date: f.date,
      docNumber: I.docNumber,
      docType: I.type,
      description: y.description,
      debit: y.debit,
      credit: y.credit
    }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).leftJoin(I, h(f.documentId, I.id)).where(
      U(
        h(y.entityId, e),
        h(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const c = s.map((a) => (i += a.debit - a.credit, {
      ...a,
      runningBalance: i
    }));
    return {
      customer: r,
      movements: c,
      currentBalance: i
    };
  }), x.handle("customers:create", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = "cust_" + Date.now(), i = t.select({ count: l`count(*)` }).from(w).where(h(w.type, "customer")).get(), c = (((i == null ? void 0 : i.count) || 0) + 1).toString().padStart(3, "0"), a = `120.${c}`, u = `acc_120_${c}`;
    return t.insert(ee).values({
      id: u,
      code: a,
      name: e.name,
      type: "asset",
      parentCode: "120",
      createdAt: r
    }).run(), t.insert(w).values({
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
  x.handle("suppliers:list", async () => {
    const n = O();
    return n.select().from(w).where(h(w.type, "supplier")).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${y.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, c = (s == null ? void 0 : s.totalCredit) || 0, a = c - i;
      return {
        ...r,
        totalDebit: i,
        totalCredit: c,
        balance: a
      };
    });
  }), x.handle("suppliers:getStatement", async (n, e) => {
    const t = O(), r = t.select().from(w).where(h(w.id, e)).get();
    if (!r) throw new Error("Tedarikçi bulunamadı.");
    const s = t.select({
      id: y.id,
      date: f.date,
      docNumber: I.docNumber,
      docType: I.type,
      description: y.description,
      debit: y.debit,
      credit: y.credit
    }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).leftJoin(I, h(f.documentId, I.id)).where(
      U(
        h(y.entityId, e),
        h(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const c = s.map((a) => (i += a.credit - a.debit, {
      ...a,
      runningBalance: i
    }));
    return {
      supplier: r,
      movements: c,
      currentBalance: i
    };
  }), x.handle("suppliers:create", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = "supp_" + Date.now(), i = t.select({ count: l`count(*)` }).from(w).where(h(w.type, "supplier")).get(), c = (((i == null ? void 0 : i.count) || 0) + 1).toString().padStart(3, "0"), a = `320.${c}`, u = `acc_320_${c}`;
    return t.insert(ee).values({
      id: u,
      code: a,
      name: e.name,
      type: "liability",
      parentCode: "320",
      createdAt: r
    }).run(), t.insert(w).values({
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
  x.handle("cash:list", async () => {
    const n = O();
    return n.select().from(w).where(h(w.type, "cash")).all().map((r) => {
      const s = n.select({
        totalIncome: l`COALESCE(SUM(${y.debit}), 0)`,
        totalExpense: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalIncome) || 0, c = (s == null ? void 0 : s.totalExpense) || 0, a = i - c;
      return {
        ...r,
        totalIncome: i,
        totalExpense: c,
        balance: a
      };
    });
  }), x.handle("cash:getMovements", async (n, e) => {
    const t = O(), r = t.select().from(w).where(h(w.id, e)).get();
    if (!r) throw new Error("Kasa bulunamadı.");
    const s = t.select({
      id: y.id,
      date: f.date,
      docNumber: I.docNumber,
      docType: I.type,
      description: y.description,
      income: y.debit,
      expense: y.credit
    }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).leftJoin(I, h(f.documentId, I.id)).where(
      U(
        h(y.entityId, e),
        h(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const c = s.map((a) => (i += a.income - a.expense, {
      ...a,
      runningBalance: i
    }));
    return {
      cashDesk: r,
      movements: c,
      currentBalance: i
    };
  }), x.handle("cash:create", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(w).where(h(w.type, "cash")).get(), i = (((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(3, "0"), c = `100.${i}`, a = `acc_100_${i}`;
    return t.insert(ee).values({
      id: a,
      code: c,
      name: e,
      type: "asset",
      parentCode: "100",
      createdAt: r
    }).run(), t.insert(w).values({
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
  x.handle("banks:list", async () => {
    const n = O();
    return n.select().from(w).where(h(w.type, "bank")).all().map((r) => {
      const s = n.select({
        totalIncoming: l`COALESCE(SUM(${y.debit}), 0)`,
        totalOutgoing: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalIncoming) || 0, c = (s == null ? void 0 : s.totalOutgoing) || 0, a = i - c;
      return {
        ...r,
        totalIncoming: i,
        totalOutgoing: c,
        balance: a
      };
    });
  }), x.handle("banks:getMovements", async (n, e) => {
    const t = O(), r = t.select().from(w).where(h(w.id, e)).get();
    if (!r) throw new Error("Banka kaydı bulunamadı.");
    const s = t.select({
      id: y.id,
      date: f.date,
      docNumber: I.docNumber,
      docType: I.type,
      description: y.description,
      incoming: y.debit,
      outgoing: y.credit
    }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).leftJoin(I, h(f.documentId, I.id)).where(
      U(
        h(y.entityId, e),
        h(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const c = s.map((a) => (i += a.incoming - a.outgoing, {
      ...a,
      runningBalance: i
    }));
    return {
      bank: r,
      movements: c,
      currentBalance: i
    };
  }), x.handle("banks:create", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(w).where(h(w.type, "bank")).get(), i = (((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(3, "0"), c = `102.${i}`, a = `acc_102_${i}`;
    return t.insert(ee).values({
      id: a,
      code: c,
      name: e.name,
      type: "asset",
      parentCode: "102",
      createdAt: r
    }).run(), t.insert(w).values({
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
  x.handle("partners:list", async () => {
    const n = O();
    return n.select().from(w).where(h(w.type, "partner")).all().map((r) => {
      const s = n.select({
        totalDraws: l`COALESCE(SUM(${y.debit}), 0)`,
        // Para Çekme (Borç)
        totalDeposits: l`COALESCE(SUM(${y.credit}), 0)`
        // Para Yatırma (Alacak)
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDraws) || 0, c = (s == null ? void 0 : s.totalDeposits) || 0, a = c - i;
      return {
        ...r,
        totalDraws: i,
        totalDeposits: c,
        balance: a
      };
    });
  }), x.handle("partners:getStatement", async (n, e) => {
    const t = O(), r = t.select().from(w).where(h(w.id, e)).get();
    if (!r) throw new Error("Ortak kaydı bulunamadı.");
    const s = t.select({
      id: y.id,
      date: f.date,
      docNumber: I.docNumber,
      docType: I.type,
      description: y.description,
      drawAmount: y.debit,
      // Çekilen
      depositAmount: y.credit
      // Yatırılan
    }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).leftJoin(I, h(f.documentId, I.id)).where(
      U(
        h(y.entityId, e),
        h(f.status, "active")
      )
    ).orderBy(f.date, f.createdAt).all();
    let i = 0;
    const c = s.map((a) => (i += a.depositAmount - a.drawAmount, {
      ...a,
      runningBalance: i
    }));
    return {
      partner: r,
      movements: c,
      currentBalance: i
    };
  });
}
function Oa() {
  x.handle("accounts:list", async () => {
    const n = O();
    return n.select().from(ee).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${y.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        h(y.accountId, r.id)
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, c = (s == null ? void 0 : s.totalCredit) || 0;
      let a = 0;
      return r.type === "asset" || r.type === "expense" ? a = i - c : a = c - i, {
        ...r,
        totalDebit: i,
        totalCredit: c,
        balance: a
      };
    });
  });
}
function Ba() {
  x.handle("reports:getDashboard", async () => {
    const n = O(), e = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], t = n.select().from(w).where(l`${w.type} IN ('cash', 'bank')`).all();
    let r = 0;
    for (const _ of t) {
      const T = n.select({
        debit: l`COALESCE(SUM(${y.debit}), 0)`,
        credit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, _.id),
          h(f.status, "active")
        )
      ).get();
      r += ((T == null ? void 0 : T.debit) || 0) - ((T == null ? void 0 : T.credit) || 0);
    }
    const s = n.select().from(w).where(h(w.type, "customer")).all();
    let i = 0;
    const c = [];
    for (const _ of s) {
      const T = n.select({
        debit: l`COALESCE(SUM(${y.debit}), 0)`,
        credit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, _.id),
          h(f.status, "active")
        )
      ).get(), $ = ((T == null ? void 0 : T.debit) || 0) - ((T == null ? void 0 : T.credit) || 0);
      $ > 0 && (i += $), c.push({
        id: _.id,
        name: _.name,
        phone: _.phone,
        balance: $
      });
    }
    const a = c.filter((_) => _.balance > 0).sort((_, T) => T.balance - _.balance).slice(0, 5), u = n.select({
      docType: I.type,
      amount: I.totalAmount
    }).from(I).where(h(I.date, e)).all();
    let g = 0, d = 0;
    for (const _ of u)
      _.docType === "sale" || _.docType === "customer_payment" || _.docType === "partner_deposit" ? g += _.amount : (_.docType === "purchase" || _.docType === "supplier_payment" || _.docType === "expense" || _.docType === "partner_draw") && (d += _.amount);
    const N = n.select().from(w).where(h(w.type, "partner")).all().map((_) => {
      const T = n.select({
        draws: l`COALESCE(SUM(${y.debit}), 0)`,
        deposits: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.entityId, _.id),
          h(f.status, "active")
        )
      ).get(), $ = (T == null ? void 0 : T.draws) || 0, Q = (T == null ? void 0 : T.deposits) || 0, j = Q - $;
      return {
        id: _.id,
        name: _.name,
        draws: $,
        deposits: Q,
        balance: j
      };
    }), A = n.select({
      id: f.id,
      entryNumber: f.entryNumber,
      docNumber: I.docNumber,
      docType: I.type,
      date: f.date,
      description: f.description,
      totalAmount: I.totalAmount
    }).from(f).leftJoin(I, h(f.documentId, I.id)).where(h(f.status, "active")).orderBy(pe(f.date), pe(f.createdAt)).limit(6).all();
    return {
      totalCashBalance: r,
      totalCustomerReceivables: i,
      todayIncome: g,
      todayExpense: d,
      topDebtors: a,
      partnerBalances: N,
      recentTransactions: A
    };
  }), x.handle("reports:getTrialBalance", async () => {
    const n = O();
    return n.select().from(ee).orderBy(ee.code).all().map((r) => {
      const s = n.select({
        totalDebit: l`COALESCE(SUM(${y.debit}), 0)`,
        totalCredit: l`COALESCE(SUM(${y.credit}), 0)`
      }).from(y).innerJoin(f, h(y.journalEntryId, f.id)).where(
        U(
          h(y.accountId, r.id),
          h(f.status, "active")
        )
      ).get(), i = (s == null ? void 0 : s.totalDebit) || 0, c = (s == null ? void 0 : s.totalCredit) || 0, a = i > c ? i - c : 0, u = c > i ? c - i : 0;
      return {
        code: r.code,
        name: r.name,
        type: r.type,
        totalDebit: i,
        totalCredit: c,
        debitBalance: a,
        creditBalance: u
      };
    }).filter((r) => r.totalDebit > 0 || r.totalCredit > 0);
  });
}
function xa() {
  x.handle("backup:export", async () => {
    const n = he.getPath("userData"), e = tt.join(n, "cari_finance.db");
    if (!ue.existsSync(e))
      throw new Error("Veritabanı dosyası bulunamadı.");
    const r = `abc_mobilya_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.cari`, { filePath: s } = await _t.showSaveDialog({
      title: "Cari Finance Şirket Dosyasını (.cari) Kaydet",
      defaultPath: r,
      filters: [
        { name: "Cari Finance Şirket Dosyası (*.cari)", extensions: ["cari"] },
        { name: "SQLite Veritabanı (*.db)", extensions: ["db", "sqlite"] }
      ]
    });
    return s ? (ue.copyFileSync(e, s), O().update(Z).set({ lastBackupAt: (/* @__PURE__ */ new Date()).toISOString() }).where(h(Z.id, "app_settings")).run(), { success: !0, filePath: s }) : { success: !1, cancelled: !0 };
  }), x.handle("backup:import", async () => {
    const { filePaths: n } = await _t.showOpenDialog({
      title: "Cari Finance Şirket Dosyası (.cari) Aç",
      properties: ["openFile"],
      filters: [
        { name: "Cari Finance Şirket Dosyası (*.cari, *.db)", extensions: ["cari", "db", "sqlite"] }
      ]
    });
    if (!n || n.length === 0)
      return { success: !1, cancelled: !0 };
    const e = n[0], t = he.getPath("userData"), r = tt.join(t, "cari_finance.db");
    wi();
    const s = r + ".bak";
    ue.existsSync(r) && ue.copyFileSync(r, s);
    try {
      return ue.copyFileSync(e, r), O(), { success: !0 };
    } catch (i) {
      throw ue.existsSync(s) && ue.copyFileSync(s, r), O(), new Error("Şirket dosyası (.cari) geri yüklenirken hata oluştu: " + i.message);
    }
  });
}
function Qa() {
  x.handle("settings:get", async () => O().select().from(Z).where(h(Z.id, "app_settings")).get() || null), x.handle("settings:update", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString();
    return t.update(Z).set({
      ...e,
      updatedAt: r
    }).where(h(Z.id, "app_settings")).run(), { success: !0 };
  }), x.handle("auth:verifyPin", async (n, e) => {
    const r = O().select().from(Z).where(h(Z.id, "app_settings")).get();
    return r != null && r.pinCode ? r.pinCode === e ? { success: !0 } : { success: !1, message: "Hatalı PIN Kodu." } : { success: !0 };
  });
}
function qa() {
  x.handle("inventory:list", async () => O().select().from(V).orderBy(pe(V.createdAt)).all().map((t) => ({
    ...t,
    totalStockValue: t.stockQuantity * t.purchasePrice
  }))), x.handle("inventory:create", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select({ count: l`count(*)` }).from(V).get(), c = `STK-${(((s == null ? void 0 : s.count) || 0) + 1).toString().padStart(4, "0")}`, a = `prod_${Date.now()}`;
    return t.insert(V).values({
      id: a,
      code: c,
      name: e.name,
      category: e.category || "Genel",
      unit: e.unit || "Adet",
      purchasePrice: e.purchasePrice || 0,
      salePrice: e.salePrice || 0,
      stockQuantity: e.stockQuantity || 0,
      minStockLevel: e.minStockLevel ?? 5,
      isActive: !0,
      createdAt: r
    }).run(), e.stockQuantity && e.stockQuantity > 0 && t.insert(Te).values({
      id: `stk_mov_${Date.now()}`,
      productId: a,
      type: "in",
      quantity: e.stockQuantity,
      unitPrice: e.purchasePrice || 0,
      totalPrice: e.stockQuantity * (e.purchasePrice || 0),
      description: "Açılış / Devir Stok Miktarı",
      date: r.split("T")[0],
      createdAt: r
    }).run(), { success: !0, productId: a, code: c };
  }), x.handle("inventory:updateStock", async (n, e) => {
    const t = O(), r = (/* @__PURE__ */ new Date()).toISOString(), s = t.select().from(V).where(h(V.id, e.productId)).get();
    if (!s) throw new Error("Ürün bulunamadı.");
    if (e.quantity <= 0)
      throw new Error("Stok hareket miktarı 0'dan büyük olmalıdır.");
    const i = s.stockQuantity, c = e.type === "in" ? i + e.quantity : i - e.quantity;
    if (e.type === "out" && c < 0)
      throw new Error(`Yetersiz stok! Mevcut stok: ${i} ${s.unit}`);
    const a = e.unitPrice ?? (e.type === "in" ? s.purchasePrice : s.salePrice), u = e.quantity * a;
    return t.update(V).set({ stockQuantity: c }).where(h(V.id, e.productId)).run(), t.insert(Te).values({
      id: `stk_mov_${Date.now()}`,
      productId: e.productId,
      type: e.type,
      quantity: e.quantity,
      unitPrice: a,
      totalPrice: u,
      description: e.description || (e.type === "in" ? "Stok Girişi" : "Stok Çıkışı"),
      date: r.split("T")[0],
      createdAt: r
    }).run(), { success: !0, newStockQuantity: c };
  }), x.handle("inventory:getMovements", async (n, e) => {
    const t = O(), r = t.select().from(V).where(h(V.id, e)).get();
    if (!r) throw new Error("Ürün bulunamadı.");
    const s = t.select().from(Te).where(h(Te.productId, e)).orderBy(pe(Te.createdAt)).all();
    return {
      product: r,
      movements: s
    };
  });
}
function Da() {
  La(), Aa(), va(), Ca(), Ia(), $a(), Oa(), Ba(), xa(), Qa(), qa();
}
const ka = Ai(import.meta.url), yt = Qe.dirname(ka);
let Be = null;
function ja() {
  const n = Qe.join(yt, "preload.mjs");
  return Li.existsSync(n) ? n : Qe.join(yt, "preload.js");
}
function Ot() {
  Be = new Es({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "Cari & Kasa Finance Desktop - Mobilya İmalat Takip",
    backgroundColor: "#090d16",
    webPreferences: {
      preload: ja(),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), Be.setMenu(null), process.env.VITE_DEV_SERVER_URL ? Be.loadURL(process.env.VITE_DEV_SERVER_URL) : Be.loadFile(Qe.join(yt, "../dist/index.html"));
}
he.whenReady().then(() => {
  O(), Da(), Ot(), he.on("activate", () => {
    Es.getAllWindows().length === 0 && Ot();
  });
});
he.on("window-all-closed", () => {
  wi(), process.platform !== "darwin" && he.quit();
});
