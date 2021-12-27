// ==UserScript==
// @name        ganbarometer-svelte
// @description Svelte version of the GanbarOmeter for Wanikani
// @namespace   https://github.com/wrex/
// @version     0.0.3
// @homepage    https://github.com/wrex/ganbarometer-svelte#readme
// @author      Rex Walters -- rw [at] pobox.com
// @license     MIT-0
// @resource    css file:///Users/rex/Public/repos/ganbarometer-svelte/https:/github.com/wrex/ganbarometer-svelte/dist/bundle.css
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @connect     github.com
// @run-at      document-idle
// @downloadURL file:///Users/rex/Public/repos/ganbarometer-svelte/https:/github.com/wrex/ganbarometer-svelte/dist/bundle.js
// @updateURL   file:///Users/rex/Public/repos/ganbarometer-svelte/https:/github.com/wrex/ganbarometer-svelte/dist/bundle.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==
GM_addStyle(GM_getResourceText("css"));
var app = (function () {
  "use strict";
  function t() {}
  const e = (t) => t;
  function n(t) {
    return t();
  }
  function r() {
    return Object.create(null);
  }
  function o(t) {
    t.forEach(n);
  }
  function i(t) {
    return "function" == typeof t;
  }
  function s(t, e) {
    return t != t
      ? e == e
      : t !== e || (t && "object" == typeof t) || "function" == typeof t;
  }
  function a(e, ...n) {
    if (null == e) return t;
    const r = e.subscribe(...n);
    return r.unsubscribe ? () => r.unsubscribe() : r;
  }
  function l(t, e, n) {
    t.$$.on_destroy.push(a(e, n));
  }
  function u(t, e, n, r) {
    return t[1] && r
      ? (function (t, e) {
          for (const n in e) t[n] = e[n];
          return t;
        })(n.ctx.slice(), t[1](r(e)))
      : n.ctx;
  }
  function c(t, e, n) {
    return t.set(n), e;
  }
  const f = "undefined" != typeof window;
  let d = f ? () => window.performance.now() : () => Date.now(),
    p = f ? (t) => requestAnimationFrame(t) : t;
  const g = new Set();
  function m(t) {
    g.forEach((e) => {
      e.c(t) || (g.delete(e), e.f());
    }),
      0 !== g.size && p(m);
  }
  function h(t) {
    let e;
    return (
      0 === g.size && p(m),
      {
        promise: new Promise((n) => {
          g.add((e = { c: t, f: n }));
        }),
        abort() {
          g.delete(e);
        },
      }
    );
  }
  function v(t, e) {
    t.appendChild(e);
  }
  function y(t) {
    if (!t) return document;
    const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
    return e && e.host ? e : t.ownerDocument;
  }
  function b(t) {
    const e = C("style");
    return (
      (function (t, e) {
        v(t.head || t, e);
      })(y(t), e),
      e
    );
  }
  function $(t, e, n) {
    t.insertBefore(e, n || null);
  }
  function w(t) {
    t.parentNode.removeChild(t);
  }
  function x(t, e) {
    for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
  }
  function C(t) {
    return document.createElement(t);
  }
  function _(t) {
    return document.createElementNS("http://www.w3.org/2000/svg", t);
  }
  function N(t) {
    return document.createTextNode(t);
  }
  function S() {
    return N(" ");
  }
  function k() {
    return N("");
  }
  function E(t, e, n, r) {
    return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
  }
  function j(t) {
    return function (e) {
      return e.preventDefault(), t.call(this, e);
    };
  }
  function O(t) {
    return function (e) {
      return e.stopPropagation(), t.call(this, e);
    };
  }
  function F(t, e, n) {
    null == n
      ? t.removeAttribute(e)
      : t.getAttribute(e) !== n && t.setAttribute(e, n);
  }
  function T(t) {
    return "" === t ? null : +t;
  }
  function W(t, e) {
    (e = "" + e), t.wholeText !== e && (t.data = e);
  }
  function A(t, e) {
    t.value = null == e ? "" : e;
  }
  function R(t, e, n, r) {
    t.style.setProperty(e, n, r ? "important" : "");
  }
  function D(t, e) {
    for (let n = 0; n < t.options.length; n += 1) {
      const r = t.options[n];
      if (r.__value === e) return void (r.selected = !0);
    }
    t.selectedIndex = -1;
  }
  function q(t, e, n) {
    t.classList[n ? "add" : "remove"](e);
  }
  function P(t, e, n = !1) {
    const r = document.createEvent("CustomEvent");
    return r.initCustomEvent(t, n, !1, e), r;
  }
  const z = new Set();
  let I,
    M = 0;
  function V(t, e, n, r, o, i, s, a = 0) {
    const l = 16.666 / r;
    let u = "{\n";
    for (let t = 0; t <= 1; t += l) {
      const r = e + (n - e) * i(t);
      u += 100 * t + `%{${s(r, 1 - r)}}\n`;
    }
    const c = u + `100% {${s(n, 1 - n)}}\n}`,
      f = `__svelte_${(function (t) {
        let e = 5381,
          n = t.length;
        for (; n--; ) e = ((e << 5) - e) ^ t.charCodeAt(n);
        return e >>> 0;
      })(c)}_${a}`,
      d = y(t);
    z.add(d);
    const p = d.__svelte_stylesheet || (d.__svelte_stylesheet = b(t).sheet),
      g = d.__svelte_rules || (d.__svelte_rules = {});
    g[f] ||
      ((g[f] = !0), p.insertRule(`@keyframes ${f} ${c}`, p.cssRules.length));
    const m = t.style.animation || "";
    return (
      (t.style.animation = `${
        m ? `${m}, ` : ""
      }${f} ${r}ms linear ${o}ms 1 both`),
      (M += 1),
      f
    );
  }
  function B(t, e) {
    const n = (t.style.animation || "").split(", "),
      r = n.filter(
        e ? (t) => t.indexOf(e) < 0 : (t) => -1 === t.indexOf("__svelte")
      ),
      o = n.length - r.length;
    o &&
      ((t.style.animation = r.join(", ")),
      (M -= o),
      M ||
        p(() => {
          M ||
            (z.forEach((t) => {
              const e = t.__svelte_stylesheet;
              let n = e.cssRules.length;
              for (; n--; ) e.deleteRule(n);
              t.__svelte_rules = {};
            }),
            z.clear());
        }));
  }
  function L(t) {
    I = t;
  }
  function K() {
    if (!I) throw new Error("Function called outside component initialization");
    return I;
  }
  function H(t, e) {
    const n = t.$$.callbacks[e.type];
    n && n.slice().forEach((t) => t.call(this, e));
  }
  const U = [],
    G = [],
    X = [],
    J = [],
    Y = Promise.resolve();
  let Z = !1;
  function Q(t) {
    X.push(t);
  }
  let tt = !1;
  const et = new Set();
  function nt() {
    if (!tt) {
      tt = !0;
      do {
        for (let t = 0; t < U.length; t += 1) {
          const e = U[t];
          L(e), rt(e.$$);
        }
        for (L(null), U.length = 0; G.length; ) G.pop()();
        for (let t = 0; t < X.length; t += 1) {
          const e = X[t];
          et.has(e) || (et.add(e), e());
        }
        X.length = 0;
      } while (U.length);
      for (; J.length; ) J.pop()();
      (Z = !1), (tt = !1), et.clear();
    }
  }
  function rt(t) {
    if (null !== t.fragment) {
      t.update(), o(t.before_update);
      const e = t.dirty;
      (t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, e),
        t.after_update.forEach(Q);
    }
  }
  let ot;
  function it(t, e, n) {
    t.dispatchEvent(P(`${e ? "intro" : "outro"}${n}`));
  }
  const st = new Set();
  let at;
  function lt() {
    at = { r: 0, c: [], p: at };
  }
  function ut() {
    at.r || o(at.c), (at = at.p);
  }
  function ct(t, e) {
    t && t.i && (st.delete(t), t.i(e));
  }
  function ft(t, e, n, r) {
    if (t && t.o) {
      if (st.has(t)) return;
      st.add(t),
        at.c.push(() => {
          st.delete(t), r && (n && t.d(1), r());
        }),
        t.o(e);
    }
  }
  const dt = { duration: 0 };
  function pt(n, r, s, a) {
    let l = r(n, s),
      u = a ? 0 : 1,
      c = null,
      f = null,
      p = null;
    function g() {
      p && B(n, p);
    }
    function m(t, e) {
      const n = t.b - u;
      return (
        (e *= Math.abs(n)),
        {
          a: u,
          b: t.b,
          d: n,
          duration: e,
          start: t.start,
          end: t.start + e,
          group: t.group,
        }
      );
    }
    function v(r) {
      const {
          delay: i = 0,
          duration: s = 300,
          easing: a = e,
          tick: v = t,
          css: y,
        } = l || dt,
        b = { start: d() + i, b: r };
      r || ((b.group = at), (at.r += 1)),
        c || f
          ? (f = b)
          : (y && (g(), (p = V(n, u, r, s, i, a, y))),
            r && v(0, 1),
            (c = m(b, s)),
            Q(() => it(n, r, "start")),
            h((t) => {
              if (
                (f &&
                  t > f.start &&
                  ((c = m(f, s)),
                  (f = null),
                  it(n, c.b, "start"),
                  y && (g(), (p = V(n, u, c.b, c.duration, 0, a, l.css)))),
                c)
              )
                if (t >= c.end)
                  v((u = c.b), 1 - u),
                    it(n, c.b, "end"),
                    f || (c.b ? g() : --c.group.r || o(c.group.c)),
                    (c = null);
                else if (t >= c.start) {
                  const e = t - c.start;
                  (u = c.a + c.d * a(e / c.duration)), v(u, 1 - u);
                }
              return !(!c && !f);
            }));
    }
    return {
      run(t) {
        i(l)
          ? (ot ||
              ((ot = Promise.resolve()),
              ot.then(() => {
                ot = null;
              })),
            ot).then(() => {
              (l = l()), v(t);
            })
          : v(t);
      },
      end() {
        g(), (c = f = null);
      },
    };
  }
  function gt(t) {
    t && t.c();
  }
  function mt(t, e, r, s) {
    const { fragment: a, on_mount: l, on_destroy: u, after_update: c } = t.$$;
    a && a.m(e, r),
      s ||
        Q(() => {
          const e = l.map(n).filter(i);
          u ? u.push(...e) : o(e), (t.$$.on_mount = []);
        }),
      c.forEach(Q);
  }
  function ht(t, e) {
    const n = t.$$;
    null !== n.fragment &&
      (o(n.on_destroy),
      n.fragment && n.fragment.d(e),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []));
  }
  function vt(t, e) {
    -1 === t.$$.dirty[0] &&
      (U.push(t), Z || ((Z = !0), Y.then(nt)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
  }
  function yt(e, n, i, s, a, l, u, c = [-1]) {
    const f = I;
    L(e);
    const d = (e.$$ = {
      fragment: null,
      ctx: null,
      props: l,
      update: t,
      not_equal: a,
      bound: r(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(n.context || (f ? f.$$.context : [])),
      callbacks: r(),
      dirty: c,
      skip_bound: !1,
      root: n.target || f.$$.root,
    });
    u && u(d.root);
    let p = !1;
    if (
      ((d.ctx = i
        ? i(e, n.props || {}, (t, n, ...r) => {
            const o = r.length ? r[0] : n;
            return (
              d.ctx &&
                a(d.ctx[t], (d.ctx[t] = o)) &&
                (!d.skip_bound && d.bound[t] && d.bound[t](o), p && vt(e, t)),
              n
            );
          })
        : []),
      d.update(),
      (p = !0),
      o(d.before_update),
      (d.fragment = !!s && s(d.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const t = (function (t) {
          return Array.from(t.childNodes);
        })(n.target);
        d.fragment && d.fragment.l(t), t.forEach(w);
      } else d.fragment && d.fragment.c();
      n.intro && ct(e.$$.fragment),
        mt(e, n.target, n.anchor, n.customElement),
        nt();
    }
    L(f);
  }
  class bt {
    $destroy() {
      ht(this, 1), (this.$destroy = t);
    }
    $on(t, e) {
      const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
      return (
        n.push(e),
        () => {
          const t = n.indexOf(e);
          -1 !== t && n.splice(t, 1);
        }
      );
    }
    $set(t) {
      var e;
      this.$$set &&
        ((e = t), 0 !== Object.keys(e).length) &&
        ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
    }
  }
  const $t = [];
  function wt(e, n = t) {
    let r;
    const o = new Set();
    function i(t) {
      if (s(e, t) && ((e = t), r)) {
        const t = !$t.length;
        for (const t of o) t[1](), $t.push(t, e);
        if (t) {
          for (let t = 0; t < $t.length; t += 2) $t[t][0]($t[t + 1]);
          $t.length = 0;
        }
      }
    }
    return {
      set: i,
      update: function (t) {
        i(t(e));
      },
      subscribe: function (s, a = t) {
        const l = [s, a];
        return (
          o.add(l),
          1 === o.size && (r = n(i) || t),
          s(e),
          () => {
            o.delete(l), 0 === o.size && (r(), (r = null));
          }
        );
      },
    };
  }
  function xt(t) {
    return "[object Date]" === Object.prototype.toString.call(t);
  }
  function Ct(t, e, n, r) {
    if ("number" == typeof n || xt(n)) {
      const o = r - n,
        i = (n - e) / (t.dt || 1 / 60),
        s =
          (i + (t.opts.stiffness * o - t.opts.damping * i) * t.inv_mass) * t.dt;
      return Math.abs(s) < t.opts.precision && Math.abs(o) < t.opts.precision
        ? r
        : ((t.settled = !1), xt(n) ? new Date(n.getTime() + s) : n + s);
    }
    if (Array.isArray(n)) return n.map((o, i) => Ct(t, e[i], n[i], r[i]));
    if ("object" == typeof n) {
      const o = {};
      for (const i in n) o[i] = Ct(t, e[i], n[i], r[i]);
      return o;
    }
    throw new Error(`Cannot spring ${typeof n} values`);
  }
  function _t(t, e = {}) {
    const n = wt(t),
      { stiffness: r = 0.15, damping: o = 0.8, precision: i = 0.01 } = e;
    let s,
      a,
      l,
      u = t,
      c = t,
      f = 1,
      p = 0,
      g = !1;
    function m(e, r = {}) {
      c = e;
      const o = (l = {});
      if (null == t || r.hard || (v.stiffness >= 1 && v.damping >= 1))
        return (g = !0), (s = d()), (u = e), n.set((t = c)), Promise.resolve();
      if (r.soft) {
        const t = !0 === r.soft ? 0.5 : +r.soft;
        (p = 1 / (60 * t)), (f = 0);
      }
      return (
        a ||
          ((s = d()),
          (g = !1),
          (a = h((e) => {
            if (g) return (g = !1), (a = null), !1;
            f = Math.min(f + p, 1);
            const r = {
                inv_mass: f,
                opts: v,
                settled: !0,
                dt: (60 * (e - s)) / 1e3,
              },
              o = Ct(r, u, t, c);
            return (
              (s = e),
              (u = t),
              n.set((t = o)),
              r.settled && (a = null),
              !r.settled
            );
          }))),
        new Promise((t) => {
          a.promise.then(() => {
            o === l && t();
          });
        })
      );
    }
    const v = {
      set: m,
      update: (e, n) => m(e(c, t), n),
      subscribe: n.subscribe,
      stiffness: r,
      damping: o,
      precision: i,
    };
    return v;
  }
  function Nt(t, e, n) {
    const r = t.slice();
    return (r[27] = e[n]), (r[29] = n), r;
  }
  function St(t) {
    let e,
      n,
      r,
      s,
      a = ("label" === t[6] || "label" === t[7]) && kt(t);
    return {
      c() {
        (e = C("span")),
          a && a.c(),
          F(e, "class", "pip first"),
          F(e, "style", (n = t[14] + ": 0%;")),
          q(e, "selected", t[17](t[0])),
          q(e, "in-range", t[16](t[0]));
      },
      m(n, o) {
        $(n, e, o),
          a && a.m(e, null),
          r ||
            ((s = [
              E(e, "click", function () {
                i(t[20](t[0])) && t[20](t[0]).apply(this, arguments);
              }),
              E(
                e,
                "touchend",
                j(function () {
                  i(t[20](t[0])) && t[20](t[0]).apply(this, arguments);
                })
              ),
            ]),
            (r = !0));
      },
      p(r, o) {
        "label" === (t = r)[6] || "label" === t[7]
          ? a
            ? a.p(t, o)
            : ((a = kt(t)), a.c(), a.m(e, null))
          : a && (a.d(1), (a = null)),
          16384 & o && n !== (n = t[14] + ": 0%;") && F(e, "style", n),
          131073 & o && q(e, "selected", t[17](t[0])),
          65537 & o && q(e, "in-range", t[16](t[0]));
      },
      d(t) {
        t && w(e), a && a.d(), (r = !1), o(s);
      },
    };
  }
  function kt(t) {
    let e,
      n,
      r = t[12](t[0], 0, 0) + "",
      o = t[10] && Et(t),
      i = t[11] && jt(t);
    return {
      c() {
        (e = C("span")),
          o && o.c(),
          (n = N(r)),
          i && i.c(),
          F(e, "class", "pipVal");
      },
      m(t, r) {
        $(t, e, r), o && o.m(e, null), v(e, n), i && i.m(e, null);
      },
      p(t, s) {
        t[10]
          ? o
            ? o.p(t, s)
            : ((o = Et(t)), o.c(), o.m(e, n))
          : o && (o.d(1), (o = null)),
          4097 & s && r !== (r = t[12](t[0], 0, 0) + "") && W(n, r),
          t[11]
            ? i
              ? i.p(t, s)
              : ((i = jt(t)), i.c(), i.m(e, null))
            : i && (i.d(1), (i = null));
      },
      d(t) {
        t && w(e), o && o.d(), i && i.d();
      },
    };
  }
  function Et(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[10])), F(e, "class", "pipVal-prefix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        1024 & e && W(n, t[10]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function jt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[11])), F(e, "class", "pipVal-suffix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        2048 & e && W(n, t[11]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Ot(t) {
    let e,
      n = Array(t[19] + 1),
      r = [];
    for (let e = 0; e < n.length; e += 1) r[e] = Rt(Nt(t, n, e));
    return {
      c() {
        for (let t = 0; t < r.length; t += 1) r[t].c();
        e = k();
      },
      m(t, n) {
        for (let e = 0; e < r.length; e += 1) r[e].m(t, n);
        $(t, e, n);
      },
      p(t, o) {
        if (2088515 & o) {
          let i;
          for (n = Array(t[19] + 1), i = 0; i < n.length; i += 1) {
            const s = Nt(t, n, i);
            r[i]
              ? r[i].p(s, o)
              : ((r[i] = Rt(s)), r[i].c(), r[i].m(e.parentNode, e));
          }
          for (; i < r.length; i += 1) r[i].d(1);
          r.length = n.length;
        }
      },
      d(t) {
        x(r, t), t && w(e);
      },
    };
  }
  function Ft(t) {
    let e,
      n,
      r,
      s,
      a,
      l = ("label" === t[6] || "label" === t[9]) && Tt(t);
    return {
      c() {
        (e = C("span")),
          l && l.c(),
          (n = S()),
          F(e, "class", "pip"),
          F(e, "style", (r = t[14] + ": " + t[15](t[18](t[29])) + "%;")),
          q(e, "selected", t[17](t[18](t[29]))),
          q(e, "in-range", t[16](t[18](t[29])));
      },
      m(r, o) {
        $(r, e, o),
          l && l.m(e, null),
          v(e, n),
          s ||
            ((a = [
              E(e, "click", function () {
                i(t[20](t[18](t[29]))) &&
                  t[20](t[18](t[29])).apply(this, arguments);
              }),
              E(
                e,
                "touchend",
                j(function () {
                  i(t[20](t[18](t[29]))) &&
                    t[20](t[18](t[29])).apply(this, arguments);
                })
              ),
            ]),
            (s = !0));
      },
      p(o, i) {
        "label" === (t = o)[6] || "label" === t[9]
          ? l
            ? l.p(t, i)
            : ((l = Tt(t)), l.c(), l.m(e, n))
          : l && (l.d(1), (l = null)),
          311296 & i &&
            r !== (r = t[14] + ": " + t[15](t[18](t[29])) + "%;") &&
            F(e, "style", r),
          393216 & i && q(e, "selected", t[17](t[18](t[29]))),
          327680 & i && q(e, "in-range", t[16](t[18](t[29])));
      },
      d(t) {
        t && w(e), l && l.d(), (s = !1), o(a);
      },
    };
  }
  function Tt(t) {
    let e,
      n,
      r = t[12](t[18](t[29]), t[29], t[15](t[18](t[29]))) + "",
      o = t[10] && Wt(t),
      i = t[11] && At(t);
    return {
      c() {
        (e = C("span")),
          o && o.c(),
          (n = N(r)),
          i && i.c(),
          F(e, "class", "pipVal");
      },
      m(t, r) {
        $(t, e, r), o && o.m(e, null), v(e, n), i && i.m(e, null);
      },
      p(t, s) {
        t[10]
          ? o
            ? o.p(t, s)
            : ((o = Wt(t)), o.c(), o.m(e, n))
          : o && (o.d(1), (o = null)),
          299008 & s &&
            r !== (r = t[12](t[18](t[29]), t[29], t[15](t[18](t[29]))) + "") &&
            W(n, r),
          t[11]
            ? i
              ? i.p(t, s)
              : ((i = At(t)), i.c(), i.m(e, null))
            : i && (i.d(1), (i = null));
      },
      d(t) {
        t && w(e), o && o.d(), i && i.d();
      },
    };
  }
  function Wt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[10])), F(e, "class", "pipVal-prefix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        1024 & e && W(n, t[10]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function At(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[11])), F(e, "class", "pipVal-suffix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        2048 & e && W(n, t[11]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Rt(t) {
    let e,
      n = t[18](t[29]) !== t[0] && t[18](t[29]) !== t[1],
      r = n && Ft(t);
    return {
      c() {
        r && r.c(), (e = k());
      },
      m(t, n) {
        r && r.m(t, n), $(t, e, n);
      },
      p(t, o) {
        262147 & o && (n = t[18](t[29]) !== t[0] && t[18](t[29]) !== t[1]),
          n
            ? r
              ? r.p(t, o)
              : ((r = Ft(t)), r.c(), r.m(e.parentNode, e))
            : r && (r.d(1), (r = null));
      },
      d(t) {
        r && r.d(t), t && w(e);
      },
    };
  }
  function Dt(t) {
    let e,
      n,
      r,
      s,
      a = ("label" === t[6] || "label" === t[8]) && qt(t);
    return {
      c() {
        (e = C("span")),
          a && a.c(),
          F(e, "class", "pip last"),
          F(e, "style", (n = t[14] + ": 100%;")),
          q(e, "selected", t[17](t[1])),
          q(e, "in-range", t[16](t[1]));
      },
      m(n, o) {
        $(n, e, o),
          a && a.m(e, null),
          r ||
            ((s = [
              E(e, "click", function () {
                i(t[20](t[1])) && t[20](t[1]).apply(this, arguments);
              }),
              E(
                e,
                "touchend",
                j(function () {
                  i(t[20](t[1])) && t[20](t[1]).apply(this, arguments);
                })
              ),
            ]),
            (r = !0));
      },
      p(r, o) {
        "label" === (t = r)[6] || "label" === t[8]
          ? a
            ? a.p(t, o)
            : ((a = qt(t)), a.c(), a.m(e, null))
          : a && (a.d(1), (a = null)),
          16384 & o && n !== (n = t[14] + ": 100%;") && F(e, "style", n),
          131074 & o && q(e, "selected", t[17](t[1])),
          65538 & o && q(e, "in-range", t[16](t[1]));
      },
      d(t) {
        t && w(e), a && a.d(), (r = !1), o(s);
      },
    };
  }
  function qt(t) {
    let e,
      n,
      r = t[12](t[1], t[19], 100) + "",
      o = t[10] && Pt(t),
      i = t[11] && zt(t);
    return {
      c() {
        (e = C("span")),
          o && o.c(),
          (n = N(r)),
          i && i.c(),
          F(e, "class", "pipVal");
      },
      m(t, r) {
        $(t, e, r), o && o.m(e, null), v(e, n), i && i.m(e, null);
      },
      p(t, s) {
        t[10]
          ? o
            ? o.p(t, s)
            : ((o = Pt(t)), o.c(), o.m(e, n))
          : o && (o.d(1), (o = null)),
          528386 & s && r !== (r = t[12](t[1], t[19], 100) + "") && W(n, r),
          t[11]
            ? i
              ? i.p(t, s)
              : ((i = zt(t)), i.c(), i.m(e, null))
            : i && (i.d(1), (i = null));
      },
      d(t) {
        t && w(e), o && o.d(), i && i.d();
      },
    };
  }
  function Pt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[10])), F(e, "class", "pipVal-prefix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        1024 & e && W(n, t[10]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function zt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[11])), F(e, "class", "pipVal-suffix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        2048 & e && W(n, t[11]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function It(e) {
    let n,
      r,
      o,
      i = ((e[6] && !1 !== e[7]) || e[7]) && St(e),
      s = ((e[6] && !1 !== e[9]) || e[9]) && Ot(e),
      a = ((e[6] && !1 !== e[8]) || e[8]) && Dt(e);
    return {
      c() {
        (n = C("div")),
          i && i.c(),
          (r = S()),
          s && s.c(),
          (o = S()),
          a && a.c(),
          F(n, "class", "rangePips"),
          q(n, "disabled", e[5]),
          q(n, "hoverable", e[4]),
          q(n, "vertical", e[2]),
          q(n, "reversed", e[3]),
          q(n, "focus", e[13]);
      },
      m(t, e) {
        $(t, n, e),
          i && i.m(n, null),
          v(n, r),
          s && s.m(n, null),
          v(n, o),
          a && a.m(n, null);
      },
      p(t, [e]) {
        (t[6] && !1 !== t[7]) || t[7]
          ? i
            ? i.p(t, e)
            : ((i = St(t)), i.c(), i.m(n, r))
          : i && (i.d(1), (i = null)),
          (t[6] && !1 !== t[9]) || t[9]
            ? s
              ? s.p(t, e)
              : ((s = Ot(t)), s.c(), s.m(n, o))
            : s && (s.d(1), (s = null)),
          (t[6] && !1 !== t[8]) || t[8]
            ? a
              ? a.p(t, e)
              : ((a = Dt(t)), a.c(), a.m(n, null))
            : a && (a.d(1), (a = null)),
          32 & e && q(n, "disabled", t[5]),
          16 & e && q(n, "hoverable", t[4]),
          4 & e && q(n, "vertical", t[2]),
          8 & e && q(n, "reversed", t[3]),
          8192 & e && q(n, "focus", t[13]);
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), i && i.d(), s && s.d(), a && a.d();
      },
    };
  }
  function Mt(t, e, n) {
    let r,
      o,
      i,
      s,
      a,
      { range: l = !1 } = e,
      { min: u = 0 } = e,
      { max: c = 100 } = e,
      { step: f = 1 } = e,
      { values: d = [(c + u) / 2] } = e,
      { vertical: p = !1 } = e,
      { reversed: g = !1 } = e,
      { hoverable: m = !0 } = e,
      { disabled: h = !1 } = e,
      { pipstep: v } = e,
      { all: y = !0 } = e,
      { first: b } = e,
      { last: $ } = e,
      { rest: w } = e,
      { prefix: x = "" } = e,
      { suffix: C = "" } = e,
      { formatter: _ = (t, e) => t } = e,
      { focus: N } = e,
      { orientationStart: S } = e,
      { percentOf: k } = e,
      { moveHandle: E } = e;
    return (
      (t.$$set = (t) => {
        "range" in t && n(21, (l = t.range)),
          "min" in t && n(0, (u = t.min)),
          "max" in t && n(1, (c = t.max)),
          "step" in t && n(22, (f = t.step)),
          "values" in t && n(23, (d = t.values)),
          "vertical" in t && n(2, (p = t.vertical)),
          "reversed" in t && n(3, (g = t.reversed)),
          "hoverable" in t && n(4, (m = t.hoverable)),
          "disabled" in t && n(5, (h = t.disabled)),
          "pipstep" in t && n(24, (v = t.pipstep)),
          "all" in t && n(6, (y = t.all)),
          "first" in t && n(7, (b = t.first)),
          "last" in t && n(8, ($ = t.last)),
          "rest" in t && n(9, (w = t.rest)),
          "prefix" in t && n(10, (x = t.prefix)),
          "suffix" in t && n(11, (C = t.suffix)),
          "formatter" in t && n(12, (_ = t.formatter)),
          "focus" in t && n(13, (N = t.focus)),
          "orientationStart" in t && n(14, (S = t.orientationStart)),
          "percentOf" in t && n(15, (k = t.percentOf)),
          "moveHandle" in t && n(25, (E = t.moveHandle));
      }),
      (t.$$.update = () => {
        20971527 & t.$$.dirty &&
          n(
            26,
            (r =
              v ||
              ((c - u) / f >= (p ? 50 : 100) ? (c - u) / (p ? 10 : 20) : 1))
          ),
          71303171 & t.$$.dirty && n(19, (o = parseInt((c - u) / (f * r), 10))),
          71303169 & t.$$.dirty &&
            n(
              18,
              (i = function (t) {
                return u + t * f * r;
              })
            ),
          8388608 & t.$$.dirty &&
            n(
              17,
              (s = function (t) {
                return d.some((e) => e === t);
              })
            ),
          10485760 & t.$$.dirty &&
            n(
              16,
              (a = function (t) {
                return "min" === l
                  ? d[0] > t
                  : "max" === l
                  ? d[0] < t
                  : l
                  ? d[0] < t && d[1] > t
                  : void 0;
              })
            );
      }),
      [
        u,
        c,
        p,
        g,
        m,
        h,
        y,
        b,
        $,
        w,
        x,
        C,
        _,
        N,
        S,
        k,
        a,
        s,
        i,
        o,
        function (t) {
          E(void 0, t);
        },
        l,
        f,
        d,
        v,
        E,
        r,
      ]
    );
  }
  class Vt extends bt {
    constructor(t) {
      super(),
        yt(this, t, Mt, It, s, {
          range: 21,
          min: 0,
          max: 1,
          step: 22,
          values: 23,
          vertical: 2,
          reversed: 3,
          hoverable: 4,
          disabled: 5,
          pipstep: 24,
          all: 6,
          first: 7,
          last: 8,
          rest: 9,
          prefix: 10,
          suffix: 11,
          formatter: 12,
          focus: 13,
          orientationStart: 14,
          percentOf: 15,
          moveHandle: 25,
        });
    }
  }
  function Bt(t, e, n) {
    const r = t.slice();
    return (r[63] = e[n]), (r[65] = n), r;
  }
  function Lt(t) {
    let e,
      n,
      r = t[20](t[63], t[65], t[22](t[63])) + "",
      o = t[17] && Kt(t),
      i = t[18] && Ht(t);
    return {
      c() {
        (e = C("span")),
          o && o.c(),
          (n = N(r)),
          i && i.c(),
          F(e, "class", "rangeFloat");
      },
      m(t, r) {
        $(t, e, r), o && o.m(e, null), v(e, n), i && i.m(e, null);
      },
      p(t, s) {
        t[17]
          ? o
            ? o.p(t, s)
            : ((o = Kt(t)), o.c(), o.m(e, n))
          : o && (o.d(1), (o = null)),
          5242881 & s[0] &&
            r !== (r = t[20](t[63], t[65], t[22](t[63])) + "") &&
            W(n, r),
          t[18]
            ? i
              ? i.p(t, s)
              : ((i = Ht(t)), i.c(), i.m(e, null))
            : i && (i.d(1), (i = null));
      },
      d(t) {
        t && w(e), o && o.d(), i && i.d();
      },
    };
  }
  function Kt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[17])), F(e, "class", "rangeFloat-prefix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        131072 & e[0] && W(n, t[17]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Ht(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[18])), F(e, "class", "rangeFloat-suffix");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        262144 & e[0] && W(n, t[18]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Ut(t) {
    let e,
      n,
      r,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m = t[6] && Lt(t);
    return {
      c() {
        (e = C("span")),
          (n = C("span")),
          (r = S()),
          m && m.c(),
          F(n, "class", "rangeNub"),
          F(e, "role", "slider"),
          F(e, "class", "rangeHandle"),
          F(e, "data-handle", (i = t[65])),
          F(
            e,
            "style",
            (s =
              t[28] +
              ": " +
              t[29][t[65]] +
              "%; z-index: " +
              (t[26] === t[65] ? 3 : 2) +
              ";")
          ),
          F(
            e,
            "aria-valuemin",
            (a = !0 === t[1] && 1 === t[65] ? t[0][0] : t[2])
          ),
          F(
            e,
            "aria-valuemax",
            (l = !0 === t[1] && 0 === t[65] ? t[0][1] : t[3])
          ),
          F(e, "aria-valuenow", (u = t[63])),
          F(
            e,
            "aria-valuetext",
            (c = "" + (t[17] + t[20](t[63], t[65], t[22](t[63])) + t[18]))
          ),
          F(e, "aria-orientation", (f = t[5] ? "vertical" : "horizontal")),
          F(e, "aria-disabled", t[9]),
          F(e, "disabled", t[9]),
          F(e, "tabindex", (d = t[9] ? -1 : 0)),
          q(e, "active", t[24] && t[26] === t[65]),
          q(e, "press", t[25] && t[26] === t[65]);
      },
      m(o, i) {
        $(o, e, i),
          v(e, n),
          v(e, r),
          m && m.m(e, null),
          p ||
            ((g = [
              E(e, "blur", t[33]),
              E(e, "focus", t[34]),
              E(e, "keydown", t[35]),
            ]),
            (p = !0));
      },
      p(t, n) {
        t[6]
          ? m
            ? m.p(t, n)
            : ((m = Lt(t)), m.c(), m.m(e, null))
          : m && (m.d(1), (m = null)),
          872415232 & n[0] &&
            s !==
              (s =
                t[28] +
                ": " +
                t[29][t[65]] +
                "%; z-index: " +
                (t[26] === t[65] ? 3 : 2) +
                ";") &&
            F(e, "style", s),
          7 & n[0] &&
            a !== (a = !0 === t[1] && 1 === t[65] ? t[0][0] : t[2]) &&
            F(e, "aria-valuemin", a),
          11 & n[0] &&
            l !== (l = !0 === t[1] && 0 === t[65] ? t[0][1] : t[3]) &&
            F(e, "aria-valuemax", l),
          1 & n[0] && u !== (u = t[63]) && F(e, "aria-valuenow", u),
          5636097 & n[0] &&
            c !==
              (c = "" + (t[17] + t[20](t[63], t[65], t[22](t[63])) + t[18])) &&
            F(e, "aria-valuetext", c),
          32 & n[0] &&
            f !== (f = t[5] ? "vertical" : "horizontal") &&
            F(e, "aria-orientation", f),
          512 & n[0] && F(e, "aria-disabled", t[9]),
          512 & n[0] && F(e, "disabled", t[9]),
          512 & n[0] && d !== (d = t[9] ? -1 : 0) && F(e, "tabindex", d),
          83886080 & n[0] && q(e, "active", t[24] && t[26] === t[65]),
          100663296 & n[0] && q(e, "press", t[25] && t[26] === t[65]);
      },
      d(t) {
        t && w(e), m && m.d(), (p = !1), o(g);
      },
    };
  }
  function Gt(t) {
    let e, n;
    return {
      c() {
        (e = C("span")),
          F(e, "class", "rangeBar"),
          F(
            e,
            "style",
            (n =
              t[28] +
              ": " +
              t[31](t[29]) +
              "%; " +
              t[27] +
              ": " +
              t[32](t[29]) +
              "%;")
          );
      },
      m(t, n) {
        $(t, e, n);
      },
      p(t, r) {
        939524096 & r[0] &&
          n !==
            (n =
              t[28] +
              ": " +
              t[31](t[29]) +
              "%; " +
              t[27] +
              ": " +
              t[32](t[29]) +
              "%;") &&
          F(e, "style", n);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Xt(t) {
    let e, n;
    return (
      (e = new Vt({
        props: {
          values: t[0],
          min: t[2],
          max: t[3],
          step: t[4],
          range: t[1],
          vertical: t[5],
          reversed: t[7],
          orientationStart: t[28],
          hoverable: t[8],
          disabled: t[9],
          all: t[12],
          first: t[13],
          last: t[14],
          rest: t[15],
          pipstep: t[11],
          prefix: t[17],
          suffix: t[18],
          formatter: t[19],
          focus: t[24],
          percentOf: t[22],
          moveHandle: t[30],
        },
      })),
      {
        c() {
          gt(e.$$.fragment);
        },
        m(t, r) {
          mt(e, t, r), (n = !0);
        },
        p(t, n) {
          const r = {};
          1 & n[0] && (r.values = t[0]),
            4 & n[0] && (r.min = t[2]),
            8 & n[0] && (r.max = t[3]),
            16 & n[0] && (r.step = t[4]),
            2 & n[0] && (r.range = t[1]),
            32 & n[0] && (r.vertical = t[5]),
            128 & n[0] && (r.reversed = t[7]),
            268435456 & n[0] && (r.orientationStart = t[28]),
            256 & n[0] && (r.hoverable = t[8]),
            512 & n[0] && (r.disabled = t[9]),
            4096 & n[0] && (r.all = t[12]),
            8192 & n[0] && (r.first = t[13]),
            16384 & n[0] && (r.last = t[14]),
            32768 & n[0] && (r.rest = t[15]),
            2048 & n[0] && (r.pipstep = t[11]),
            131072 & n[0] && (r.prefix = t[17]),
            262144 & n[0] && (r.suffix = t[18]),
            524288 & n[0] && (r.formatter = t[19]),
            16777216 & n[0] && (r.focus = t[24]),
            4194304 & n[0] && (r.percentOf = t[22]),
            e.$set(r);
        },
        i(t) {
          n || (ct(e.$$.fragment, t), (n = !0));
        },
        o(t) {
          ft(e.$$.fragment, t), (n = !1);
        },
        d(t) {
          ht(e, t);
        },
      }
    );
  }
  function Jt(t) {
    let e,
      n,
      r,
      i,
      s,
      a,
      l = t[0],
      u = [];
    for (let e = 0; e < l.length; e += 1) u[e] = Ut(Bt(t, l, e));
    let c = t[1] && Gt(t),
      f = t[10] && Xt(t);
    return {
      c() {
        e = C("div");
        for (let t = 0; t < u.length; t += 1) u[t].c();
        (n = S()),
          c && c.c(),
          (r = S()),
          f && f.c(),
          F(e, "id", t[16]),
          F(e, "class", "rangeSlider"),
          q(e, "range", t[1]),
          q(e, "disabled", t[9]),
          q(e, "hoverable", t[8]),
          q(e, "vertical", t[5]),
          q(e, "reversed", t[7]),
          q(e, "focus", t[24]),
          q(e, "min", "min" === t[1]),
          q(e, "max", "max" === t[1]),
          q(e, "pips", t[10]),
          q(
            e,
            "pip-labels",
            "label" === t[12] ||
              "label" === t[13] ||
              "label" === t[14] ||
              "label" === t[15]
          );
      },
      m(o, l) {
        $(o, e, l);
        for (let t = 0; t < u.length; t += 1) u[t].m(e, null);
        v(e, n),
          c && c.m(e, null),
          v(e, r),
          f && f.m(e, null),
          t[49](e),
          (i = !0),
          s ||
            ((a = [
              E(window, "mousedown", t[38]),
              E(window, "touchstart", t[38]),
              E(window, "mousemove", t[39]),
              E(window, "touchmove", t[39]),
              E(window, "mouseup", t[40]),
              E(window, "touchend", t[41]),
              E(window, "keydown", t[42]),
              E(e, "mousedown", t[36]),
              E(e, "mouseup", t[37]),
              E(e, "touchstart", j(t[36])),
              E(e, "touchend", j(t[37])),
            ]),
            (s = !0));
      },
      p(t, o) {
        if ((928383599 & o[0]) | (28 & o[1])) {
          let r;
          for (l = t[0], r = 0; r < l.length; r += 1) {
            const i = Bt(t, l, r);
            u[r] ? u[r].p(i, o) : ((u[r] = Ut(i)), u[r].c(), u[r].m(e, n));
          }
          for (; r < u.length; r += 1) u[r].d(1);
          u.length = l.length;
        }
        t[1]
          ? c
            ? c.p(t, o)
            : ((c = Gt(t)), c.c(), c.m(e, r))
          : c && (c.d(1), (c = null)),
          t[10]
            ? f
              ? (f.p(t, o), 1024 & o[0] && ct(f, 1))
              : ((f = Xt(t)), f.c(), ct(f, 1), f.m(e, null))
            : f &&
              (lt(),
              ft(f, 1, 1, () => {
                f = null;
              }),
              ut()),
          (!i || 65536 & o[0]) && F(e, "id", t[16]),
          2 & o[0] && q(e, "range", t[1]),
          512 & o[0] && q(e, "disabled", t[9]),
          256 & o[0] && q(e, "hoverable", t[8]),
          32 & o[0] && q(e, "vertical", t[5]),
          128 & o[0] && q(e, "reversed", t[7]),
          16777216 & o[0] && q(e, "focus", t[24]),
          2 & o[0] && q(e, "min", "min" === t[1]),
          2 & o[0] && q(e, "max", "max" === t[1]),
          1024 & o[0] && q(e, "pips", t[10]),
          61440 & o[0] &&
            q(
              e,
              "pip-labels",
              "label" === t[12] ||
                "label" === t[13] ||
                "label" === t[14] ||
                "label" === t[15]
            );
      },
      i(t) {
        i || (ct(f), (i = !0));
      },
      o(t) {
        ft(f), (i = !1);
      },
      d(n) {
        n && w(e), x(u, n), c && c.d(), f && f.d(), t[49](null), (s = !1), o(a);
      },
    };
  }
  function Yt(t) {
    if (!t) return -1;
    for (var e = 0; (t = t.previousElementSibling); ) e++;
    return e;
  }
  function Zt(t) {
    return t.type.includes("touch") ? t.touches[0] : t;
  }
  function Qt(e, n, r) {
    let o,
      i,
      s,
      l,
      u,
      c,
      f = t;
    e.$$.on_destroy.push(() => f());
    let { range: d = !1 } = n,
      { pushy: p = !1 } = n,
      { min: g = 0 } = n,
      { max: m = 100 } = n,
      { step: h = 1 } = n,
      { values: v = [(m + g) / 2] } = n,
      { vertical: y = !1 } = n,
      { float: b = !1 } = n,
      { reversed: $ = !1 } = n,
      { hoverable: w = !0 } = n,
      { disabled: x = !1 } = n,
      { pips: C = !1 } = n,
      { pipstep: _ } = n,
      { all: N } = n,
      { first: S } = n,
      { last: k } = n,
      { rest: E } = n,
      { id: j } = n,
      { prefix: O = "" } = n,
      { suffix: F = "" } = n,
      { formatter: T = (t, e, n) => t } = n,
      { handleFormatter: W = T } = n,
      { precision: A = 2 } = n,
      { springValues: R = { stiffness: 0.15, damping: 0.4 } } = n;
    const D = (function () {
      const t = K();
      return (e, n) => {
        const r = t.$$.callbacks[e];
        if (r) {
          const o = P(e, n);
          r.slice().forEach((e) => {
            e.call(t, o);
          });
        }
      };
    })();
    let q,
      z,
      I,
      M,
      V = 0,
      B = !1,
      L = !1,
      H = !1,
      U = !1,
      X = v.length - 1;
    function J() {
      return q.getBoundingClientRect();
    }
    function Y(t) {
      const e = J();
      let n = 0,
        r = 0,
        o = 0;
      y
        ? ((n = t.clientY - e.top),
          (r = (n / e.height) * 100),
          (r = $ ? r : 100 - r))
        : ((n = t.clientX - e.left),
          (r = (n / e.width) * 100),
          (r = $ ? 100 - r : r)),
        (o = ((m - g) / 100) * r + g),
        Z(X, o);
    }
    function Z(t, e) {
      return (
        (e = s(e)),
        void 0 === t && (t = X),
        d &&
          (0 === t && e > v[1]
            ? p
              ? r(0, (v[1] = e), v)
              : (e = v[1])
            : 1 === t && e < v[0] && (p ? r(0, (v[0] = e), v) : (e = v[0]))),
        v[t] !== e && r(0, (v[t] = e), v),
        I !== e &&
          (!x &&
            D("change", {
              activeHandle: X,
              startValue: z,
              previousValue: void 0 === I ? z : I,
              value: v[X],
              values: v.map((t) => s(t)),
            }),
          (I = e)),
        e
      );
    }
    function Q() {
      !x &&
        D("stop", {
          activeHandle: X,
          startValue: z,
          value: v[X],
          values: v.map((t) => s(t)),
        });
    }
    return (
      (e.$$set = (t) => {
        "range" in t && r(1, (d = t.range)),
          "pushy" in t && r(43, (p = t.pushy)),
          "min" in t && r(2, (g = t.min)),
          "max" in t && r(3, (m = t.max)),
          "step" in t && r(4, (h = t.step)),
          "values" in t && r(0, (v = t.values)),
          "vertical" in t && r(5, (y = t.vertical)),
          "float" in t && r(6, (b = t.float)),
          "reversed" in t && r(7, ($ = t.reversed)),
          "hoverable" in t && r(8, (w = t.hoverable)),
          "disabled" in t && r(9, (x = t.disabled)),
          "pips" in t && r(10, (C = t.pips)),
          "pipstep" in t && r(11, (_ = t.pipstep)),
          "all" in t && r(12, (N = t.all)),
          "first" in t && r(13, (S = t.first)),
          "last" in t && r(14, (k = t.last)),
          "rest" in t && r(15, (E = t.rest)),
          "id" in t && r(16, (j = t.id)),
          "prefix" in t && r(17, (O = t.prefix)),
          "suffix" in t && r(18, (F = t.suffix)),
          "formatter" in t && r(19, (T = t.formatter)),
          "handleFormatter" in t && r(20, (W = t.handleFormatter)),
          "precision" in t && r(44, (A = t.precision)),
          "springValues" in t && r(45, (R = t.springValues));
      }),
      (e.$$.update = () => {
        12 & e.$$.dirty[0] &&
          r(
            48,
            (i = function (t) {
              return t <= g ? g : t >= m ? m : t;
            })
          ),
          (28 & e.$$.dirty[0]) | (139264 & e.$$.dirty[1]) &&
            r(
              47,
              (s = function (t) {
                if (t <= g) return g;
                if (t >= m) return m;
                let e = (t - g) % h,
                  n = t - e;
                return (
                  2 * Math.abs(e) >= h && (n += e > 0 ? h : -h),
                  (n = i(n)),
                  parseFloat(n.toFixed(A))
                );
              })
            ),
          (12 & e.$$.dirty[0]) | (8192 & e.$$.dirty[1]) &&
            r(
              22,
              (o = function (t) {
                let e = ((t - g) / (m - g)) * 100;
                return isNaN(e) || e <= 0
                  ? 0
                  : e >= 100
                  ? 100
                  : parseFloat(e.toFixed(A));
              })
            ),
          (6291469 & e.$$.dirty[0]) | (114688 & e.$$.dirty[1]) &&
            (Array.isArray(v) ||
              (r(0, (v = [(m + g) / 2])),
              console.error(
                "'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)"
              )),
            r(
              0,
              (v = (function (t) {
                return "min" === d || "max" === d
                  ? t.slice(0, 1)
                  : d
                  ? t.slice(0, 2)
                  : t;
              })(v.map((t) => s(t))))
            ),
            V !== v.length
              ? (r(
                  21,
                  (M = _t(
                    v.map((t) => o(t)),
                    R
                  ))
                ),
                f(),
                (f = a(M, (t) => r(29, (c = t)))))
              : M.set(v.map((t) => o(t))),
            r(46, (V = v.length))),
          160 & e.$$.dirty[0] &&
            r(28, (l = y ? ($ ? "top" : "bottom") : $ ? "right" : "left")),
          160 & e.$$.dirty[0] &&
            r(27, (u = y ? ($ ? "bottom" : "top") : $ ? "left" : "right"));
      }),
      [
        v,
        d,
        g,
        m,
        h,
        y,
        b,
        $,
        w,
        x,
        C,
        _,
        N,
        S,
        k,
        E,
        j,
        O,
        F,
        T,
        W,
        M,
        o,
        q,
        B,
        H,
        X,
        u,
        l,
        c,
        Z,
        function (t) {
          return "min" === d ? 0 : t[0];
        },
        function (t) {
          return "max" === d ? 0 : "min" === d ? 100 - t[0] : 100 - t[1];
        },
        function (t) {
          U && (r(24, (B = !1)), (L = !1), r(25, (H = !1)));
        },
        function (t) {
          x || (r(26, (X = Yt(t.target))), r(24, (B = !0)));
        },
        function (t) {
          if (!x) {
            const e = Yt(t.target);
            let n = t.ctrlKey || t.metaKey || t.shiftKey ? 10 * h : h,
              r = !1;
            switch (t.key) {
              case "PageDown":
                n *= 10;
              case "ArrowRight":
              case "ArrowUp":
                Z(e, v[e] + n), (r = !0);
                break;
              case "PageUp":
                n *= 10;
              case "ArrowLeft":
              case "ArrowDown":
                Z(e, v[e] - n), (r = !0);
                break;
              case "Home":
                Z(e, g), (r = !0);
                break;
              case "End":
                Z(e, m), (r = !0);
            }
            r && (t.preventDefault(), t.stopPropagation());
          }
        },
        function (t) {
          if (!x) {
            const e = t.target,
              n = Zt(t);
            r(24, (B = !0)),
              (L = !0),
              r(25, (H = !0)),
              r(
                26,
                (X = (function (t) {
                  const e = J();
                  let n,
                    r = 0,
                    o = 0,
                    i = 0;
                  return (
                    y
                      ? ((r = t.clientY - e.top),
                        (o = (r / e.height) * 100),
                        (o = $ ? o : 100 - o))
                      : ((r = t.clientX - e.left),
                        (o = (r / e.width) * 100),
                        (o = $ ? 100 - o : o)),
                    (i = ((m - g) / 100) * o + g),
                    !0 === d && v[0] === v[1]
                      ? i > v[1]
                        ? 1
                        : 0
                      : ((n = v.indexOf(
                          [...v].sort(
                            (t, e) => Math.abs(i - t) - Math.abs(i - e)
                          )[0]
                        )),
                        n)
                  );
                })(n))
              ),
              (z = I = s(v[X])),
              !x &&
                D("start", {
                  activeHandle: X,
                  value: z,
                  values: v.map((t) => s(t)),
                }),
              "touchstart" !== t.type || e.matches(".pipVal") || Y(n);
          }
        },
        function (t) {
          "touchend" === t.type && Q(), r(25, (H = !1));
        },
        function (t) {
          (U = !1),
            B && t.target !== q && !q.contains(t.target) && r(24, (B = !1));
        },
        function (t) {
          x || (L && Y(Zt(t)));
        },
        function (t) {
          if (!x) {
            const e = t.target;
            L &&
              ((e === q || q.contains(e)) &&
                (r(24, (B = !0)),
                (function (t) {
                  const e = q.querySelectorAll(".handle"),
                    n = Array.prototype.includes.call(e, t),
                    r = Array.prototype.some.call(e, (e) => e.contains(t));
                  return n || r;
                })(e) ||
                  e.matches(".pipVal") ||
                  Y(Zt(t))),
              Q());
          }
          (L = !1), r(25, (H = !1));
        },
        function (t) {
          (L = !1), r(25, (H = !1));
        },
        function (t) {
          x || ((t.target === q || q.contains(t.target)) && (U = !0));
        },
        p,
        A,
        R,
        V,
        s,
        i,
        function (t) {
          G[t ? "unshift" : "push"](() => {
            (q = t), r(23, q);
          });
        },
      ]
    );
  }
  class te extends bt {
    constructor(t) {
      super(),
        yt(
          this,
          t,
          Qt,
          Jt,
          s,
          {
            range: 1,
            pushy: 43,
            min: 2,
            max: 3,
            step: 4,
            values: 0,
            vertical: 5,
            float: 6,
            reversed: 7,
            hoverable: 8,
            disabled: 9,
            pips: 10,
            pipstep: 11,
            all: 12,
            first: 13,
            last: 14,
            rest: 15,
            id: 16,
            prefix: 17,
            suffix: 18,
            formatter: 19,
            handleFormatter: 20,
            precision: 44,
            springValues: 45,
          },
          null,
          [-1, -1, -1]
        );
    }
  }
  function ee(t) {
    let e,
      n,
      r,
      o = (100 * t[0]).toFixed() + "";
    return {
      c() {
        (e = C("div")),
          (n = N(o)),
          (r = N("%")),
          F(e, "class", "gauge__cover svelte-bgxsre");
      },
      m(t, o) {
        $(t, e, o), v(e, n), v(e, r);
      },
      p(t, e) {
        1 & e && o !== (o = (100 * t[0]).toFixed() + "") && W(n, o);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function ne(t) {
    let e, n;
    return {
      c() {
        (e = C("div")),
          (n = N(t[1])),
          F(e, "class", "gauge__cover svelte-bgxsre");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        2 & e && W(n, t[1]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function re(e) {
    let n, r, o, i;
    function s(t, e) {
      return null !== t[1] ? ne : ee;
    }
    let a = s(e),
      l = a(e);
    return {
      c() {
        (n = C("div")),
          (r = C("div")),
          (o = C("div")),
          (i = S()),
          l.c(),
          F(o, "class", "gauge__fill svelte-bgxsre"),
          F(o, "style", e[2]),
          F(r, "class", "gauge__body svelte-bgxsre"),
          F(n, "class", "gauge svelte-bgxsre"),
          F(n, "data-testid", "gauge");
      },
      m(t, e) {
        $(t, n, e), v(n, r), v(r, o), v(r, i), l.m(r, null);
      },
      p(t, [e]) {
        4 & e && F(o, "style", t[2]),
          a === (a = s(t)) && l
            ? l.p(t, e)
            : (l.d(1), (l = a(t)), l && (l.c(), l.m(r, null)));
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), l.d();
      },
    };
  }
  function oe(t, e, n) {
    let r,
      { value: o = 0.5 } = e,
      { label: i = null } = e;
    return (
      (t.$$set = (t) => {
        "value" in t && n(0, (o = t.value)),
          "label" in t && n(1, (i = t.label));
      }),
      (t.$$.update = () => {
        1 & t.$$.dirty && n(2, (r = `transform: rotate(${o / 2}turn)`));
      }),
      [o, i, r]
    );
  }
  class ie extends bt {
    constructor(t) {
      super(), yt(this, t, oe, re, s, { value: 0, label: 1 });
    }
  }
  var se;
  const ae = "gbSettings",
    le = wt("chart"),
    ue = localStorage.getItem("daysToReview"),
    ce = wt(ue ? JSON.parse(ue) : [4]);
  ce.subscribe((t) => {
    localStorage.setItem("daysToReview", JSON.stringify(t));
  });
  const fe = (t) =>
      JSON.parse(t).map((t) =>
        Object.assign(Object.assign({}, t), {
          start: new Date(t.start),
          end: new Date(t.end),
        })
      ),
    de = localStorage.getItem("apprenticeCounts"),
    pe = wt(
      de
        ? JSON.parse(de)
        : {
            radicals: [0, 0, 0, 0],
            kanji: [0, 0, 0, 0],
            vocabulary: [0, 0, 0, 0],
          }
    );
  pe.subscribe((t) => {
    localStorage.setItem("apprenticeCounts", JSON.stringify(t));
  });
  const ge = localStorage.getItem("sessionSummaries"),
    me = wt(ge ? fe(ge) : []);
  me.subscribe((t) => {
    localStorage.setItem("sessionSummaries", JSON.stringify(t));
  });
  const he = localStorage.getItem("reviewCounts"),
    ve = wt(he ? fe(he) : []);
  ve.subscribe((t) => {
    localStorage.setItem("reviewCounts", JSON.stringify(t));
  });
  const ye = {
      position: "Top",
      textColor: "#333333",
      bgColor: "#f4f4f4",
      fillColor: "#b4c0be",
      goodColor: "#59c273",
      warnColor: "#fbb623",
      alertColor: "#ff00aa",
      targetApprentice: 100,
      newRWeight: 0.75,
      newKWeight: 3,
      newVWeight: 1,
      targetSpeed: 7,
      madCutoff: 10,
      targetRevDay: 150,
      tzOffset: 0,
    },
    be = wt(
      null !== (se = JSON.parse(localStorage.getItem(ae))) && void 0 !== se
        ? se
        : ye
    );
  let $e;
  be.subscribe((t) => localStorage.setItem(ae, JSON.stringify(t)));
  const we = async (t) => {
      if (!$e || !$e[t]) {
        wkof.include("ItemData"), await wkof.ready("ItemData");
        let t = await wkof.ItemData.get_items();
        $e = await wkof.ItemData.get_index(t, "subject_id");
      }
      return $e[t];
    },
    xe = async () => {
      let t;
      try {
        t = await (async () => (
          wkof.include("ItemData"),
          await wkof.ready("ItemData"),
          wkof.ItemData.get_items({
            wk_items: {
              options: { assignments: !0 },
              filters: { srs: "appr1, appr2, appr3, appr4" },
            },
          })
        ))();
      } catch (t) {
        console.warn(t);
      }
      const e = {
        radicals: [0, 0, 0, 0],
        kanji: [0, 0, 0, 0],
        vocabulary: [0, 0, 0, 0],
      };
      return (
        t.forEach((t) => {
          var n;
          const r =
            null === (n = t.assignments) || void 0 === n ? void 0 : n.srs_stage;
          "radical" === t.object
            ? (e.radicals[r - 1] += 1)
            : "kanji" === t.object
            ? (e.kanji[r - 1] += 1)
            : "vocabulary" === t.object
            ? (e.vocabulary[r - 1] += 1)
            : (console.warn(`Unrecognized subject type ${t.object}`),
              console.warn(t));
        }),
        e
      );
    };
  function Ce(e) {
    let n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _,
      k,
      E,
      j,
      O,
      T,
      A,
      R,
      D,
      q,
      P,
      z,
      I,
      M,
      V,
      B,
      L,
      K,
      H,
      U,
      G,
      X,
      J,
      Y,
      Z,
      Q,
      tt,
      et,
      nt,
      rt,
      ot,
      it,
      st,
      at,
      lt,
      ut,
      ct,
      ft,
      dt = (100 * e[5]).toFixed() + "",
      pt = e[4].targetApprentice + "",
      gt = e[4].newRWeight + "",
      mt = e[4].newKWeight + "",
      ht = e[4].newVWeight + "",
      vt = (100 * e[6]).toFixed() + "",
      yt = (100 * e[5]).toFixed() + "";
    return {
      c() {
        (n = C("h1")),
          (r = N("GanbarOmeter: ")),
          (o = N(dt)),
          (i = N("%")),
          (s = S()),
          (a = C("div")),
          (l = C("table")),
          (u = C("tr")),
          (c = C("th")),
          (c.textContent = "Apprentice"),
          (f = S()),
          (d = C("td")),
          (p = N(e[0])),
          (g = S()),
          (m = C("span")),
          (h = N("target: ")),
          (y = N(pt)),
          (b = S()),
          (x = C("tr")),
          (_ = C("th")),
          (_.textContent = "New"),
          (k = S()),
          (E = C("td")),
          (j = N(e[3])),
          (O = C("span")),
          (O.textContent = "r"),
          (T = S()),
          (A = N(e[2])),
          (R = C("span")),
          (R.textContent = "k"),
          (D = S()),
          (q = N(e[1])),
          (P = C("span")),
          (P.textContent = "v"),
          (z = S()),
          (I = C("tr")),
          (M = C("th")),
          (M.textContent = "Weights"),
          (V = S()),
          (B = C("td")),
          (L = N(gt)),
          (K = C("span")),
          (K.textContent = "r"),
          (H = S()),
          (U = N(mt)),
          (G = C("span")),
          (G.textContent = "k"),
          (X = S()),
          (J = N(ht)),
          (Y = C("span")),
          (Y.textContent = "v"),
          (Z = S()),
          (Q = C("tr")),
          (tt = C("th")),
          (tt.textContent = "Unweighted"),
          (et = S()),
          (nt = C("td")),
          (rt = N(vt)),
          (ot = C("span")),
          (ot.textContent = "%"),
          (it = S()),
          (st = C("tr")),
          (at = C("th")),
          (at.textContent = "Weighted"),
          (lt = S()),
          (ut = C("td")),
          (ct = N(yt)),
          (ft = C("span")),
          (ft.textContent = "%"),
          F(n, "class", "gbHeader"),
          F(m, "class", "secondary"),
          F(O, "class", "secondary"),
          F(R, "class", "secondary"),
          F(P, "class", "secondary"),
          F(K, "class", "secondary"),
          F(G, "class", "secondary"),
          F(Y, "class", "secondary"),
          F(ot, "class", "secondary"),
          F(ft, "class", "secondary"),
          F(l, "class", "gbContent"),
          F(a, "data-testid", "ganbarometer-table");
      },
      m(t, e) {
        $(t, n, e),
          v(n, r),
          v(n, o),
          v(n, i),
          $(t, s, e),
          $(t, a, e),
          v(a, l),
          v(l, u),
          v(u, c),
          v(u, f),
          v(u, d),
          v(d, p),
          v(d, g),
          v(d, m),
          v(m, h),
          v(m, y),
          v(l, b),
          v(l, x),
          v(x, _),
          v(x, k),
          v(x, E),
          v(E, j),
          v(E, O),
          v(E, T),
          v(E, A),
          v(E, R),
          v(E, D),
          v(E, q),
          v(E, P),
          v(l, z),
          v(l, I),
          v(I, M),
          v(I, V),
          v(I, B),
          v(B, L),
          v(B, K),
          v(B, H),
          v(B, U),
          v(B, G),
          v(B, X),
          v(B, J),
          v(B, Y),
          v(l, Z),
          v(l, Q),
          v(Q, tt),
          v(Q, et),
          v(Q, nt),
          v(nt, rt),
          v(nt, ot),
          v(l, it),
          v(l, st),
          v(st, at),
          v(st, lt),
          v(st, ut),
          v(ut, ct),
          v(ut, ft);
      },
      p(t, e) {
        32 & e && dt !== (dt = (100 * t[5]).toFixed() + "") && W(o, dt),
          1 & e && W(p, t[0]),
          16 & e && pt !== (pt = t[4].targetApprentice + "") && W(y, pt),
          8 & e && W(j, t[3]),
          4 & e && W(A, t[2]),
          2 & e && W(q, t[1]),
          16 & e && gt !== (gt = t[4].newRWeight + "") && W(L, gt),
          16 & e && mt !== (mt = t[4].newKWeight + "") && W(U, mt),
          16 & e && ht !== (ht = t[4].newVWeight + "") && W(J, ht),
          64 & e && vt !== (vt = (100 * t[6]).toFixed() + "") && W(rt, vt),
          32 & e && yt !== (yt = (100 * t[5]).toFixed() + "") && W(ct, yt);
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), t && w(s), t && w(a);
      },
    };
  }
  function _e(t) {
    let e, n, r, o, i, s;
    return (
      (r = new ie({ props: { value: t[5] } })),
      {
        c() {
          (e = C("h1")),
            (e.textContent = "GanbarOmeter"),
            (n = S()),
            gt(r.$$.fragment),
            (o = S()),
            (i = C("div")),
            (i.textContent = "of max difficulty"),
            F(e, "class", "gbHeader"),
            F(i, "class", "units");
        },
        m(t, a) {
          $(t, e, a), $(t, n, a), mt(r, t, a), $(t, o, a), $(t, i, a), (s = !0);
        },
        p(t, e) {
          const n = {};
          32 & e && (n.value = t[5]), r.$set(n);
        },
        i(t) {
          s || (ct(r.$$.fragment, t), (s = !0));
        },
        o(t) {
          ft(r.$$.fragment, t), (s = !1);
        },
        d(t) {
          t && w(e), t && w(n), ht(r, t), t && w(o), t && w(i);
        },
      }
    );
  }
  function Ne(t) {
    let e, n, r, o;
    const i = [_e, Ce],
      s = [];
    function a(t, e) {
      return "chart" === t[7] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = s[n] = i[n](t)),
      {
        c() {
          (e = C("div")), r.c(), F(e, "class", "gbWidget");
        },
        m(t, r) {
          $(t, e, r), s[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let l = n;
          (n = a(t)),
            n === l
              ? s[n].p(t, o)
              : (lt(),
                ft(s[l], 1, 1, () => {
                  s[l] = null;
                }),
                ut(),
                (r = s[n]),
                r ? r.p(t, o) : ((r = s[n] = i[n](t)), r.c()),
                ct(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (ct(r), (o = !0));
        },
        o(t) {
          ft(r), (o = !1);
        },
        d(t) {
          t && w(e), s[n].d();
        },
      }
    );
  }
  function Se(t, e, n) {
    let r, o, i, s, a, u, c, f, d, p;
    return (
      l(t, be, (t) => n(4, (f = t))),
      l(t, pe, (t) => n(9, (d = t))),
      l(t, le, (t) => n(7, (p = t))),
      (t.$$.update = () => {
        512 & t.$$.dirty &&
          n(
            0,
            (r =
              d.radicals.reduce((t, e) => t + e, 0) +
              d.kanji.reduce((t, e) => t + e, 0) +
              d.vocabulary.reduce((t, e) => t + e, 0))
          ),
          512 & t.$$.dirty &&
            n(3, (o = d.radicals.slice(0, 2).reduce((t, e) => t + e, 0))),
          512 & t.$$.dirty &&
            n(2, (i = d.kanji.slice(0, 2).reduce((t, e) => t + e, 0))),
          512 & t.$$.dirty &&
            n(1, (s = d.vocabulary.slice(0, 2).reduce((t, e) => t + e, 0))),
          t.$$.dirty,
          31 & t.$$.dirty &&
            n(
              8,
              (a =
                r -
                o -
                i -
                s +
                o * f.newRWeight +
                i * f.newKWeight +
                s * f.newVWeight)
            ),
          17 & t.$$.dirty && n(6, (u = r / (2 * f.targetApprentice))),
          272 & t.$$.dirty && n(5, (c = a / (2 * f.targetApprentice)));
      }),
      xe().then((t) => pe.set(t)),
      [r, s, i, o, f, c, u, p, a, d]
    );
  }
  class ke extends bt {
    constructor(t) {
      super(), yt(this, t, Se, Ne, s, {});
    }
  }
  function Ee(t, e, n) {
    const r = t.slice();
    return (r[13] = e[n]), (r[15] = n), r;
  }
  function je(e) {
    let n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y = e[1].length + "",
      b = e[1],
      _ = [];
    for (let t = 0; t < b.length; t += 1) _[t] = Fe(Ee(e, b, t));
    return {
      c() {
        (n = C("h1")),
          (r = N("Speed: ")),
          (o = N(e[3])),
          (i = N(" s/q")),
          (s = S()),
          (a = C("div")),
          (l = C("div")),
          (u = C("h4")),
          (c = N(y)),
          (f = N(" sessions • ")),
          (d = N(e[4])),
          (p = N(" items • ")),
          (g = N(e[0])),
          (m = N(" questions")),
          (h = S());
        for (let t = 0; t < _.length; t += 1) _[t].c();
        F(n, "class", "gbHeader"),
          F(u, "class", "svelte-sxcuj8"),
          F(l, "class", "gbContent scrollbox svelte-sxcuj8"),
          F(a, "data-testid", "speed-table");
      },
      m(t, e) {
        $(t, n, e),
          v(n, r),
          v(n, o),
          v(n, i),
          $(t, s, e),
          $(t, a, e),
          v(a, l),
          v(l, u),
          v(u, c),
          v(u, f),
          v(u, d),
          v(u, p),
          v(u, g),
          v(u, m),
          v(l, h);
        for (let t = 0; t < _.length; t += 1) _[t].m(l, null);
      },
      p(t, e) {
        if (
          (8 & e && W(o, t[3]),
          2 & e && y !== (y = t[1].length + "") && W(c, y),
          16 & e && W(d, t[4]),
          1 & e && W(g, t[0]),
          962 & e)
        ) {
          let n;
          for (b = t[1], n = 0; n < b.length; n += 1) {
            const r = Ee(t, b, n);
            _[n] ? _[n].p(r, e) : ((_[n] = Fe(r)), _[n].c(), _[n].m(l, null));
          }
          for (; n < _.length; n += 1) _[n].d(1);
          _.length = b.length;
        }
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), t && w(s), t && w(a), x(_, t);
      },
    };
  }
  function Oe(t) {
    let e, n, r, o, i, s;
    return (
      (r = new ie({ props: { value: t[2], label: t[3] } })),
      {
        c() {
          (e = C("h1")),
            (e.textContent = "Speed"),
            (n = S()),
            gt(r.$$.fragment),
            (o = S()),
            (i = C("div")),
            (i.textContent = "seconds/question"),
            F(e, "class", "gbHeader"),
            F(i, "class", "units");
        },
        m(t, a) {
          $(t, e, a), $(t, n, a), mt(r, t, a), $(t, o, a), $(t, i, a), (s = !0);
        },
        p(t, e) {
          const n = {};
          4 & e && (n.value = t[2]), 8 & e && (n.label = t[3]), r.$set(n);
        },
        i(t) {
          s || (ct(r.$$.fragment, t), (s = !0));
        },
        o(t) {
          ft(r.$$.fragment, t), (s = !1);
        },
        d(t) {
          t && w(e), t && w(n), ht(r, t), t && w(o), t && w(i);
        },
      }
    );
  }
  function Fe(t) {
    let e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _,
      k,
      E,
      j,
      O,
      T,
      A,
      R,
      D = t[15] + 1 + "",
      q = t[7](t[13].start) + "",
      P = t[8](t[13].end) + "",
      z = (t[6](t[13]) / 60).toFixed() + "",
      I = t[13].reviewCount + "",
      M = t[13].questionCount + "",
      V = (t[6](t[13]) / t[13].questionCount).toFixed(1) + "",
      B = t[13].correctAnswerCount + "",
      L = t[13].questionCount + "",
      K = t[9](t[13]) + "";
    return {
      c() {
        (e = C("article")),
          (n = C("h5")),
          (r = N(D)),
          (o = N(": ")),
          (i = N(q)),
          (s = N(" – ")),
          (a = N(P)),
          (l = N("\n            (")),
          (u = N(z)),
          (c = N("m)")),
          (f = S()),
          (d = C("p")),
          (p = N(I)),
          (g = N(" items • ")),
          (m = N(M)),
          (h = N(" questions •\n            ")),
          (y = N(V)),
          (b = N(" s/q ")),
          (x = C("br")),
          (_ = S()),
          (k = N(B)),
          (E = N("/")),
          (j = N(L)),
          (O = N(" =\n            ")),
          (T = N(K)),
          (A = N("% correct")),
          (R = S()),
          F(n, "class", "svelte-sxcuj8"),
          F(d, "class", "svelte-sxcuj8"),
          F(e, "class", "svelte-sxcuj8");
      },
      m(t, w) {
        $(t, e, w),
          v(e, n),
          v(n, r),
          v(n, o),
          v(n, i),
          v(n, s),
          v(n, a),
          v(n, l),
          v(n, u),
          v(n, c),
          v(e, f),
          v(e, d),
          v(d, p),
          v(d, g),
          v(d, m),
          v(d, h),
          v(d, y),
          v(d, b),
          v(d, x),
          v(d, _),
          v(d, k),
          v(d, E),
          v(d, j),
          v(d, O),
          v(d, T),
          v(d, A),
          v(e, R);
      },
      p(t, e) {
        2 & e && q !== (q = t[7](t[13].start) + "") && W(i, q),
          2 & e && P !== (P = t[8](t[13].end) + "") && W(a, P),
          2 & e && z !== (z = (t[6](t[13]) / 60).toFixed() + "") && W(u, z),
          2 & e && I !== (I = t[13].reviewCount + "") && W(p, I),
          2 & e && M !== (M = t[13].questionCount + "") && W(m, M),
          2 & e &&
            V !== (V = (t[6](t[13]) / t[13].questionCount).toFixed(1) + "") &&
            W(y, V),
          2 & e && B !== (B = t[13].correctAnswerCount + "") && W(k, B),
          2 & e && L !== (L = t[13].questionCount + "") && W(j, L),
          2 & e && K !== (K = t[9](t[13]) + "") && W(T, K);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Te(t) {
    let e, n, r, o;
    const i = [Oe, je],
      s = [];
    function a(t, e) {
      return "chart" === t[5] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = s[n] = i[n](t)),
      {
        c() {
          (e = C("div")),
            r.c(),
            F(e, "class", "gbWidget svelte-sxcuj8"),
            F(e, "data-testid", "speedWidget");
        },
        m(t, r) {
          $(t, e, r), s[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let l = n;
          (n = a(t)),
            n === l
              ? s[n].p(t, o)
              : (lt(),
                ft(s[l], 1, 1, () => {
                  s[l] = null;
                }),
                ut(),
                (r = s[n]),
                r ? r.p(t, o) : ((r = s[n] = i[n](t)), r.c()),
                ct(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (ct(r), (o = !0));
        },
        o(t) {
          ft(r), (o = !1);
        },
        d(t) {
          t && w(e), s[n].d();
        },
      }
    );
  }
  function We(t, e, n) {
    let r, o, i, s, a, u, c, f;
    l(t, be, (t) => n(12, (u = t))),
      l(t, me, (t) => n(1, (c = t))),
      l(t, le, (t) => n(5, (f = t)));
    const d = (t) => (t.end - t.start) / 1e3;
    let p;
    return (
      (t.$$.update = () => {
        2 & t.$$.dirty && n(4, (r = c.reduce((t, e) => t + +e.reviewCount, 0))),
          2 & t.$$.dirty &&
            n(0, (o = c.reduce((t, e) => t + +e.questionCount, 0))),
          2 & t.$$.dirty && n(10, (p = c.reduce((t, e) => t + d(e), 0))),
          1025 & t.$$.dirty && n(11, (i = o > 0 ? p / o : 0)),
          2048 & t.$$.dirty && n(3, (s = `${i.toFixed(1)}`)),
          6144 & t.$$.dirty && n(2, (a = i / (2 * u.targetSpeed)));
      }),
      [
        o,
        c,
        a,
        s,
        r,
        f,
        d,
        (t) =>
          Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(t),
        (t) => Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(t),
        (t) => ((100 * t.correctAnswerCount) / t.questionCount).toFixed(1),
        p,
        i,
        u,
      ]
    );
  }
  class Ae extends bt {
    constructor(t) {
      super(), yt(this, t, We, Te, s, {});
    }
  }
  function Re(t, e, n) {
    const r = t.slice();
    return (r[7] = e[n]), (r[9] = n), r;
  }
  function De(t) {
    let e;
    return {
      c() {
        (e = C("td")),
          F(e, "aria-label", "percents"),
          F(e, "class", "percents svelte-15ehjgs"),
          R(e, "height", (100 * t[1][t[9]]).toFixed(1) + "%");
      },
      m(t, n) {
        $(t, e, n);
      },
      p(t, n) {
        2 & n && R(e, "height", (100 * t[1][t[9]]).toFixed(1) + "%");
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function qe(t) {
    let e,
      n,
      r,
      o = (100 * t[1][t[9]]).toFixed() + "";
    return {
      c() {
        (e = C("br")), (n = N(o)), (r = N("%"));
      },
      m(t, o) {
        $(t, e, o), $(t, n, o), $(t, r, o);
      },
      p(t, e) {
        2 & e && o !== (o = (100 * t[1][t[9]]).toFixed() + "") && W(n, o);
      },
      d(t) {
        t && w(e), t && w(n), t && w(r);
      },
    };
  }
  function Pe(t) {
    let e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c = (t[2][t[9]] ? t[2][t[9]] : "") + "",
      f = t[7] + "",
      d = t[1].length && De(t),
      p = t[1].length && qe(t);
    return {
      c() {
        (e = C("tr")),
          (n = C("th")),
          (r = N(c)),
          (o = S()),
          (i = C("td")),
          (s = S()),
          d && d.c(),
          (a = S()),
          (l = C("span")),
          (u = N(f)),
          p && p.c(),
          F(n, "scope", "row"),
          F(n, "aria-label", "label"),
          F(n, "class", "svelte-15ehjgs"),
          F(i, "aria-label", "value"),
          F(i, "class", "svelte-15ehjgs"),
          F(l, "class", "displayBox svelte-15ehjgs"),
          F(l, "data-testid", "displayBox"),
          F(e, "aria-label", "values"),
          R(e, "height", t[5][t[9]] + "%"),
          F(e, "class", "svelte-15ehjgs");
      },
      m(t, c) {
        $(t, e, c),
          v(e, n),
          v(n, r),
          v(e, o),
          v(e, i),
          v(e, s),
          d && d.m(e, null),
          v(e, a),
          v(e, l),
          v(l, u),
          p && p.m(l, null);
      },
      p(t, n) {
        4 & n && c !== (c = (t[2][t[9]] ? t[2][t[9]] : "") + "") && W(r, c),
          t[1].length
            ? d
              ? d.p(t, n)
              : ((d = De(t)), d.c(), d.m(e, a))
            : d && (d.d(1), (d = null)),
          1 & n && f !== (f = t[7] + "") && W(u, f),
          t[1].length
            ? p
              ? p.p(t, n)
              : ((p = qe(t)), p.c(), p.m(l, null))
            : p && (p.d(1), (p = null)),
          32 & n && R(e, "height", t[5][t[9]] + "%");
      },
      d(t) {
        t && w(e), d && d.d(), p && p.d();
      },
    };
  }
  function ze(e) {
    let n,
      r,
      o,
      i,
      s,
      a,
      l,
      u = e[0],
      c = [];
    for (let t = 0; t < u.length; t += 1) c[t] = Pe(Re(e, u, t));
    return {
      c() {
        (n = C("table")),
          (r = C("thead")),
          (r.innerHTML =
            '<tr class="svelte-15ehjgs"><th scope="col" class="svelte-15ehjgs">Item</th> \n      <th scope="col" class="svelte-15ehjgs">Value</th></tr>'),
          (o = S()),
          (i = C("tbody"));
        for (let t = 0; t < c.length; t += 1) c[t].c();
        (s = S()),
          (a = C("div")),
          F(r, "class", "svelte-15ehjgs"),
          (a.hidden = l = 0 === e[4]),
          F(a, "class", "target svelte-15ehjgs"),
          R(a, "height", e[4] + "%"),
          F(i, "class", "svelte-15ehjgs"),
          F(n, "class", "graph svelte-15ehjgs"),
          F(n, "aria-label", "bar-chart"),
          R(n, "--max-label", e[3]);
      },
      m(t, e) {
        $(t, n, e), v(n, r), v(n, o), v(n, i);
        for (let t = 0; t < c.length; t += 1) c[t].m(i, null);
        v(i, s), v(i, a);
      },
      p(t, [e]) {
        if (39 & e) {
          let n;
          for (u = t[0], n = 0; n < u.length; n += 1) {
            const r = Re(t, u, n);
            c[n] ? c[n].p(r, e) : ((c[n] = Pe(r)), c[n].c(), c[n].m(i, s));
          }
          for (; n < c.length; n += 1) c[n].d(1);
          c.length = u.length;
        }
        16 & e && l !== (l = 0 === t[4]) && (a.hidden = l),
          16 & e && R(a, "height", t[4] + "%"),
          8 & e && R(n, "--max-label", t[3]);
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), x(c, t);
      },
    };
  }
  function Ie(t, e, n) {
    let r,
      o,
      i,
      { values: s } = e,
      { percents: a = [] } = e,
      { labels: l = [] } = e,
      { target: u = 0 } = e;
    return (
      (t.$$set = (t) => {
        "values" in t && n(0, (s = t.values)),
          "percents" in t && n(1, (a = t.percents)),
          "labels" in t && n(2, (l = t.labels)),
          "target" in t && n(6, (u = t.target));
      }),
      (t.$$.update = () => {
        1 & t.$$.dirty && n(3, (r = Math.max(...s))),
          9 & t.$$.dirty && n(5, (o = s.map((t) => Math.round((t / r) * 100)))),
          72 & t.$$.dirty && n(4, (i = Math.round((u / r) * 100)));
      }),
      [s, a, l, r, i, o, u]
    );
  }
  class Me extends bt {
    constructor(t) {
      super(),
        yt(this, t, Ie, ze, s, {
          values: 0,
          percents: 1,
          labels: 2,
          target: 6,
        });
    }
  }
  function Ve(e) {
    let n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _,
      k,
      E,
      j,
      O,
      T,
      A,
      R,
      D,
      q,
      P,
      z,
      I,
      M,
      V,
      B = e[3].toFixed() + "",
      L = e[3].toFixed() + "",
      K = e[9](e[2][e[2].length - 1]?.start) + "",
      H = e[2][e[2].length - 1]?.review_count + "",
      U = (100 * e[0][e[0].length - 1]).toFixed() + "";
    function G(t, e) {
      return t[2].length > 2 ? Ke : 2 === t[2].length ? Le : void 0;
    }
    let X = G(e),
      J = X && X(e);
    return {
      c() {
        (n = C("h1")),
          (r = N(e[1])),
          (o = N(" Reviews @")),
          (i = N(B)),
          (s = N("%")),
          (a = S()),
          (l = C("div")),
          (u = C("table")),
          (c = C("tr")),
          (f = C("th")),
          (f.textContent = "Average:"),
          (d = S()),
          (p = C("td")),
          (g = N(e[5])),
          (m = S()),
          (h = C("span")),
          (y = N("reviews @ ")),
          (b = N(L)),
          (x = N("%")),
          (_ = S()),
          (k = C("tr")),
          (E = C("th")),
          (j = N("Latest (")),
          (O = N(K)),
          (T = N("):")),
          (A = S()),
          (R = C("td")),
          (D = N(H)),
          (q = S()),
          (P = C("span")),
          (z = N("reviews @ ")),
          (I = N(U)),
          (M = N("%")),
          (V = S()),
          J && J.c(),
          F(n, "class", "gbHeader"),
          F(h, "class", "secondary"),
          F(P, "class", "secondary"),
          F(u, "class", "gbContent"),
          F(l, "data-testid", "reviews-per-day-table");
      },
      m(t, e) {
        $(t, n, e),
          v(n, r),
          v(n, o),
          v(n, i),
          v(n, s),
          $(t, a, e),
          $(t, l, e),
          v(l, u),
          v(u, c),
          v(c, f),
          v(c, d),
          v(c, p),
          v(p, g),
          v(p, m),
          v(p, h),
          v(h, y),
          v(h, b),
          v(h, x),
          v(u, _),
          v(u, k),
          v(k, E),
          v(E, j),
          v(E, O),
          v(E, T),
          v(k, A),
          v(k, R),
          v(R, D),
          v(R, q),
          v(R, P),
          v(P, z),
          v(P, I),
          v(P, M),
          v(u, V),
          J && J.m(u, null);
      },
      p(t, e) {
        2 & e && W(r, t[1]),
          8 & e && B !== (B = t[3].toFixed() + "") && W(i, B),
          32 & e && W(g, t[5]),
          8 & e && L !== (L = t[3].toFixed() + "") && W(b, L),
          4 & e &&
            K !== (K = t[9](t[2][t[2].length - 1]?.start) + "") &&
            W(O, K),
          4 & e &&
            H !== (H = t[2][t[2].length - 1]?.review_count + "") &&
            W(D, H),
          1 & e &&
            U !== (U = (100 * t[0][t[0].length - 1]).toFixed() + "") &&
            W(I, U),
          X === (X = G(t)) && J
            ? J.p(t, e)
            : (J && J.d(1), (J = X && X(t)), J && (J.c(), J.m(u, null)));
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), t && w(a), t && w(l), J && J.d();
      },
    };
  }
  function Be(t) {
    let e, n, r, o;
    return (
      (r = new Me({
        props: {
          values: t[4],
          labels: t[6],
          target: t[8].targetRevDay,
          percents: t[0],
        },
      })),
      {
        c() {
          (e = C("h1")),
            (e.textContent = "Accuracy"),
            (n = S()),
            gt(r.$$.fragment),
            F(e, "class", "gbHeader");
        },
        m(t, i) {
          $(t, e, i), $(t, n, i), mt(r, t, i), (o = !0);
        },
        p(t, e) {
          const n = {};
          16 & e && (n.values = t[4]),
            64 & e && (n.labels = t[6]),
            256 & e && (n.target = t[8].targetRevDay),
            1 & e && (n.percents = t[0]),
            r.$set(n);
        },
        i(t) {
          o || (ct(r.$$.fragment, t), (o = !0));
        },
        o(t) {
          ft(r.$$.fragment, t), (o = !1);
        },
        d(t) {
          t && w(e), t && w(n), ht(r, t);
        },
      }
    );
  }
  function Le(t) {
    let e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c = t[9](t[2][0].start) + "",
      f = t[2][0].review_count + "";
    return {
      c() {
        (e = C("tr")),
          (n = C("th")),
          (r = N(c)),
          (o = N(":")),
          (i = S()),
          (s = C("td")),
          (a = N(f)),
          (l = S()),
          (u = C("span")),
          (u.textContent = "reviews"),
          F(u, "class", "secondary");
      },
      m(t, c) {
        $(t, e, c),
          v(e, n),
          v(n, r),
          v(n, o),
          v(e, i),
          v(e, s),
          v(s, a),
          v(s, l),
          v(s, u);
      },
      p(t, e) {
        4 & e && c !== (c = t[9](t[2][0].start) + "") && W(r, c),
          4 & e && f !== (f = t[2][0].review_count + "") && W(a, f);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function Ke(t) {
    let e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _ = t[9](t[2][0].start) + "",
      k = t[9](t[2][t[2].length - 2].start) + "",
      E = t[2].slice(0, -1).map(Ue).join(" • ") + "",
      j = t[0].slice(0, -1).map(Ge).join("% • ") + "";
    return {
      c() {
        (e = C("tr")),
          (n = C("th")),
          (r = N(_)),
          (o = N(" – ")),
          (i = N(k)),
          (s = N(":")),
          (a = S()),
          (l = C("td")),
          (u = N(E)),
          (c = S()),
          (f = C("span")),
          (f.textContent = "reviews"),
          (d = S()),
          (p = C("tr")),
          (g = C("th")),
          (m = S()),
          (h = C("td")),
          (y = N(j)),
          (b = N("% ")),
          (x = C("span")),
          (x.textContent = "accuracy"),
          F(f, "class", "secondary"),
          F(x, "class", "secondary");
      },
      m(t, w) {
        $(t, e, w),
          v(e, n),
          v(n, r),
          v(n, o),
          v(n, i),
          v(n, s),
          v(e, a),
          v(e, l),
          v(l, u),
          v(l, c),
          v(l, f),
          $(t, d, w),
          $(t, p, w),
          v(p, g),
          v(p, m),
          v(p, h),
          v(h, y),
          v(h, b),
          v(h, x);
      },
      p(t, e) {
        4 & e && _ !== (_ = t[9](t[2][0].start) + "") && W(r, _),
          4 & e &&
            k !== (k = t[9](t[2][t[2].length - 2].start) + "") &&
            W(i, k),
          4 & e &&
            E !== (E = t[2].slice(0, -1).map(Ue).join(" • ") + "") &&
            W(u, E),
          1 & e &&
            j !== (j = t[0].slice(0, -1).map(Ge).join("% • ") + "") &&
            W(y, j);
      },
      d(t) {
        t && w(e), t && w(d), t && w(p);
      },
    };
  }
  function He(t) {
    let e, n, r, o;
    const i = [Be, Ve],
      s = [];
    function a(t, e) {
      return "chart" === t[7] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = s[n] = i[n](t)),
      {
        c() {
          (e = C("div")),
            r.c(),
            F(e, "class", "gbWidget"),
            F(e, "data-testid", "reviews-per-day-gauge");
        },
        m(t, r) {
          $(t, e, r), s[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let l = n;
          (n = a(t)),
            n === l
              ? s[n].p(t, o)
              : (lt(),
                ft(s[l], 1, 1, () => {
                  s[l] = null;
                }),
                ut(),
                (r = s[n]),
                r ? r.p(t, o) : ((r = s[n] = i[n](t)), r.c()),
                ct(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (ct(r), (o = !0));
        },
        o(t) {
          ft(r), (o = !1);
        },
        d(t) {
          t && w(e), s[n].d();
        },
      }
    );
  }
  const Ue = (t) => t.review_count,
    Ge = (t) => (100 * t).toFixed();
  function Xe(t, e, n) {
    let r, o, i, s, a, u, c, f, d, p;
    l(t, ve, (t) => n(2, (c = t))),
      l(t, ce, (t) => n(10, (f = t))),
      l(t, le, (t) => n(7, (d = t))),
      l(t, be, (t) => n(8, (p = t)));
    const g = (t) =>
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(t);
    return (
      (t.$$.update = () => {
        4 & t.$$.dirty && n(6, (r = c.map((t) => g(t.start)))),
          4 & t.$$.dirty &&
            n(1, (o = c.reduce((t, e) => t + e.review_count, 0))),
          1026 & t.$$.dirty && n(5, (i = (o / f[0]).toFixed())),
          4 & t.$$.dirty && n(4, (s = c.map((t) => t.review_count))),
          4 & t.$$.dirty && n(0, (a = c.map((t) => t.accuracy))),
          1 & t.$$.dirty &&
            n(3, (u = (100 * a.reduce((t, e) => t + e, 0)) / a.length));
      }),
      [a, o, c, u, s, i, r, d, p, g, f]
    );
  }
  class Je extends bt {
    constructor(t) {
      super(), yt(this, t, Xe, He, s, {});
    }
  }
  function Ye(t) {
    let e, n, r, i, s, a, l, c, f, d, p;
    const g = t[5].default,
      m = (function (t, e, n, r) {
        if (t) {
          const o = u(t, e, n, r);
          return t[0](o);
        }
      })(g, t, t[4], null);
    return {
      c() {
        (e = C("div")),
          (n = C("div")),
          (r = _("svg")),
          (i = _("circle")),
          (s = _("line")),
          (a = _("line")),
          (l = S()),
          (c = C("div")),
          m && m.c(),
          F(i, "cx", "6"),
          F(i, "cy", "6"),
          F(i, "r", "6"),
          F(s, "x1", "3"),
          F(s, "y1", "3"),
          F(s, "x2", "9"),
          F(s, "y2", "9"),
          F(s, "class", "svelte-18s3qyj"),
          F(a, "x1", "9"),
          F(a, "y1", "3"),
          F(a, "x2", "3"),
          F(a, "y2", "9"),
          F(a, "class", "svelte-18s3qyj"),
          F(r, "id", "close"),
          F(r, "viewBox", "0 0 12 12"),
          F(r, "class", "svelte-18s3qyj"),
          F(c, "id", "modal-content"),
          F(c, "class", "svelte-18s3qyj"),
          F(n, "id", "modal"),
          F(n, "class", "svelte-18s3qyj"),
          F(e, "id", "topModal"),
          F(e, "class", "svelte-18s3qyj"),
          q(e, "visible", t[1]);
      },
      m(o, u) {
        $(o, e, u),
          v(e, n),
          v(n, r),
          v(r, i),
          v(r, s),
          v(r, a),
          v(n, l),
          v(n, c),
          m && m.m(c, null),
          t[7](e),
          (f = !0),
          d ||
            ((p = [
              E(r, "click", t[6]),
              E(n, "click", O(tn)),
              E(e, "click", t[8]),
            ]),
            (d = !0));
      },
      p(t, [n]) {
        m &&
          m.p &&
          (!f || 16 & n) &&
          (function (t, e, n, r, o, i) {
            if (o) {
              const s = u(e, n, r, i);
              t.p(s, o);
            }
          })(
            m,
            g,
            t,
            t[4],
            f
              ? (function (t, e, n, r) {
                  if (t[2] && r) {
                    const o = t[2](r(n));
                    if (void 0 === e.dirty) return o;
                    if ("object" == typeof o) {
                      const t = [],
                        n = Math.max(e.dirty.length, o.length);
                      for (let r = 0; r < n; r += 1) t[r] = e.dirty[r] | o[r];
                      return t;
                    }
                    return e.dirty | o;
                  }
                  return e.dirty;
                })(g, t[4], n, null)
              : (function (t) {
                  if (t.ctx.length > 32) {
                    const e = [],
                      n = t.ctx.length / 32;
                    for (let t = 0; t < n; t++) e[t] = -1;
                    return e;
                  }
                  return -1;
                })(t[4]),
            null
          ),
          2 & n && q(e, "visible", t[1]);
      },
      i(t) {
        f || (ct(m, t), (f = !0));
      },
      o(t) {
        ft(m, t), (f = !1);
      },
      d(n) {
        n && w(e), m && m.d(n), t[7](null), (d = !1), o(p);
      },
    };
  }
  let Ze;
  const Qe = {};
  const tn = () => {};
  function en(t, e, n) {
    let r,
      o,
      i,
      { $$slots: s = {}, $$scope: a } = e,
      l = !1,
      { id: u = "" } = e;
    function c(t) {
      "Escape" == t.key && Ze == r && f(null);
    }
    function f(t) {
      l &&
        (window.removeEventListener("keydown", c),
        (Ze = o),
        null == Ze && (document.body.style.overflow = ""),
        n(1, (l = !1)),
        i && i(t));
    }
    (Qe[u] = {
      open: function (t) {
        (i = t),
          l ||
            ((o = Ze),
            (Ze = r),
            window.addEventListener("keydown", c),
            (document.body.style.overflow = "hidden"),
            n(1, (l = !0)),
            document.body.appendChild(r));
      },
      close: f,
    }),
      (function (t) {
        K().$$.on_destroy.push(t);
      })(() => {
        delete Qe[u], window.removeEventListener("keydown", c);
      });
    return (
      (t.$$set = (t) => {
        "id" in t && n(3, (u = t.id)), "$$scope" in t && n(4, (a = t.$$scope));
      }),
      [
        r,
        l,
        f,
        u,
        a,
        s,
        () => f(null),
        function (t) {
          G[t ? "unshift" : "push"](() => {
            (r = t), n(0, r);
          });
        },
        () => f(null),
      ]
    );
  }
  class nn extends bt {
    constructor(t) {
      super(), yt(this, t, en, Ye, s, { id: 3 });
    }
  }
  function rn(t) {
    let e, n;
    return {
      c() {
        (e = C("span")), (n = N(t[0])), F(e, "class", "errors svelte-9nbcyp");
      },
      m(t, r) {
        $(t, e, r), v(e, n);
      },
      p(t, e) {
        1 & e && W(n, t[0]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function on(e) {
    let n,
      r = e[0] && rn(e);
    return {
      c() {
        r && r.c(), (n = k());
      },
      m(t, e) {
        r && r.m(t, e), $(t, n, e);
      },
      p(t, [e]) {
        t[0]
          ? r
            ? r.p(t, e)
            : ((r = rn(t)), r.c(), r.m(n.parentNode, n))
          : r && (r.d(1), (r = null));
      },
      i: t,
      o: t,
      d(t) {
        r && r.d(t), t && w(n);
      },
    };
  }
  function sn(t, e, n) {
    let r,
      { errors: o = {} } = e,
      { path: i } = e;
    return (
      (t.$$set = (t) => {
        "errors" in t && n(1, (o = t.errors)),
          "path" in t && n(2, (i = t.path));
      }),
      (t.$$.update = () => {
        6 & t.$$.dirty && n(0, (r = o[i] && o[i].length ? o[i][0] : void 0));
      }),
      [r, o, i]
    );
  }
  class an extends bt {
    constructor(t) {
      super(), yt(this, t, sn, on, s, { errors: 1, path: 2 });
    }
  }
  function ln() {
    return (ln =
      Object.assign ||
      function (t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
          for (var o in (e = arguments[n]))
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        return t;
      }).apply(this, arguments);
  }
  function un(t, e, n) {
    if (n || 2 === arguments.length)
      for (var r, o = 0, i = e.length; o < i; o++)
        (!r && o in e) ||
          (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
    return t.concat(r || e);
  }
  var cn = Object.assign;
  function fn(t) {
    return "function" == typeof t;
  }
  function dn(t, e) {
    function n(t) {
      (r = !0), (o = t);
    }
    for (var r = !1, o = null, i = 0; i < t.length; i++)
      if ((e(t[i], n, i), r)) return o;
  }
  function pn(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    return fn(t) ? t.apply(void 0, e) : t;
  }
  function gn(t, e) {
    var n;
    return null !== (n = pn(t)) && void 0 !== n ? n : e;
  }
  function mn(t, e) {
    return (t = { pass: t }), e && (t.message = e), t;
  }
  function hn(t, e) {
    try {
      return t.run(e);
    } catch (t) {
      return mn(!1);
    }
  }
  function vn(t) {
    return function () {
      for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
      return !t.apply(void 0, e);
    };
  }
  function yn(t, e) {
    return t.length === Number(e);
  }
  var bn = vn(yn);
  function $n(t, e) {
    return t.length > Number(e);
  }
  function wn(t) {
    return null === t;
  }
  var xn = vn(wn);
  function Cn(t) {
    return void 0 === t;
  }
  var _n = vn(Cn);
  function Nn(t) {
    return String(t) === t;
  }
  function Sn(t, e) {
    return Nn(t) && Nn(e) && t.endsWith(e);
  }
  var kn = vn(Sn);
  function En(t, e) {
    return t === e;
  }
  var jn = vn(En);
  function On(t) {
    var e = Number(t);
    return !(isNaN(parseFloat(String(t))) || isNaN(Number(t)) || !isFinite(e));
  }
  var Fn = vn(On);
  function Tn(t, e) {
    return On(t) && On(e) && Number(t) > Number(e);
  }
  function Wn(t, e) {
    return On(t) && On(e) && Number(t) >= Number(e);
  }
  function An(t) {
    return !!Array.isArray(t);
  }
  var Rn = vn(An);
  function Dn(t, e) {
    return !!(An(e) || (Nn(e) && Nn(t))) && -1 !== e.indexOf(t);
  }
  var qn = vn(Dn);
  function Pn(t, e) {
    return On(t) && On(e) && Number(t) <= Number(e);
  }
  function zn(t, e, n) {
    return Wn(t, e) && Pn(t, n);
  }
  var In = vn(zn);
  function Mn(t) {
    return Nn(t) && !t.trim();
  }
  var Vn = vn(Mn);
  function Bn(t) {
    return !!t === t;
  }
  var Ln = vn(Bn);
  function Kn(t) {
    return "number" == typeof t;
  }
  var Hn = vn(Kn);
  function Un(t) {
    if (t) {
      if (Kn(t)) return 0 === t;
      if (Object.prototype.hasOwnProperty.call(t, "length")) return yn(t, 0);
      if ("object" == typeof t) return yn(Object.keys(t), 0);
    }
    return !0;
  }
  var Gn = vn(Un);
  function Xn(t) {
    return Number.isNaN(t);
  }
  var Jn = vn(Xn);
  function Yn(t) {
    return !!On(t) && 0 > Number(t);
  }
  var Zn = vn(Yn),
    Qn = vn(Nn);
  function tr(t) {
    return !!t;
  }
  var er = vn(tr);
  function nr(t, e) {
    return On(t) && On(e) && Number(t) < Number(e);
  }
  function rr(t, e) {
    return e instanceof RegExp ? e.test(t) : !!Nn(e) && new RegExp(e).test(t);
  }
  var or = vn(rr);
  function ir(t, e) {
    return On(t) && On(e) && Number(t) === Number(e);
  }
  var sr = vn(ir);
  function ar(t, e) {
    return Nn(t) && Nn(e) && t.startsWith(e);
  }
  var lr = vn(ar);
  function ur(t, e) {
    throw Error(gn(e, t));
  }
  function cr(t) {
    function e(e, o) {
      var i,
        s,
        a = n();
      return (
        (e = cn(
          {},
          a || {},
          null !== (i = pn(t, e, a)) && void 0 !== i ? i : e
        )),
        (i = r.ctx = Object.freeze(e)),
        r.ancestry.unshift(i),
        (o = o(i)),
        r.ancestry.shift(),
        (r.ctx = null !== (s = r.ancestry[0]) && void 0 !== s ? s : null),
        o
      );
    }
    function n() {
      return r.ctx;
    }
    var r = { ancestry: [] };
    return {
      bind: function (t, n) {
        return function () {
          for (var r = [], o = 0; o < arguments.length; o++)
            r[o] = arguments[o];
          return e(t, function () {
            return n.apply(void 0, r);
          });
        };
      },
      run: e,
      use: n,
      useX: function (t) {
        var e;
        return null !== (e = r.ctx) && void 0 !== e
          ? e
          : ur(gn(t, "Context was used after it was closed"));
      },
    };
  }
  var fr = cr(function (t, e) {
    var n = { value: t.value, meta: t.meta || {} };
    return e
      ? t.set
        ? cn(n, {
            parent: function () {
              return e ? { value: e.value, meta: e.meta, parent: e.parent } : e;
            },
          })
        : e
      : cn(n, { parent: dr });
  });
  function dr() {
    return null;
  }
  function pr(t, e) {
    function n(n) {
      var r = t[n],
        o = e[n];
      if (
        !(n = fr.run({ value: r, set: !0, meta: { key: n } }, function () {
          return hn(o, r);
        })).pass
      )
        return { value: n };
    }
    for (var r in e) {
      var o = n(r);
      if ("object" == typeof o) return o.value;
    }
    return mn(!0);
  }
  var gr = cn(
    {
      condition: function (t, e) {
        try {
          return e(t);
        } catch (t) {
          return !1;
        }
      },
      doesNotEndWith: kn,
      doesNotStartWith: lr,
      endsWith: Sn,
      equals: En,
      greaterThan: Tn,
      greaterThanOrEquals: Wn,
      gt: Tn,
      gte: Wn,
      inside: Dn,
      isArray: An,
      isBetween: zn,
      isBlank: Mn,
      isBoolean: Bn,
      isEmpty: Un,
      isEven: function (t) {
        return !!On(t) && 0 == t % 2;
      },
      isFalsy: er,
      isNaN: Xn,
      isNegative: Yn,
      isNotArray: Rn,
      isNotBetween: In,
      isNotBlank: Vn,
      isNotBoolean: Ln,
      isNotEmpty: Gn,
      isNotNaN: Jn,
      isNotNull: xn,
      isNotNumber: Hn,
      isNotNumeric: Fn,
      isNotString: Qn,
      isNotUndefined: _n,
      isNull: wn,
      isNumber: Kn,
      isNumeric: On,
      isOdd: function (t) {
        return !!On(t) && 0 != t % 2;
      },
      isPositive: Zn,
      isString: Nn,
      isTruthy: tr,
      isUndefined: Cn,
      lengthEquals: yn,
      lengthNotEquals: bn,
      lessThan: nr,
      lessThanOrEquals: Pn,
      longerThan: $n,
      longerThanOrEquals: function (t, e) {
        return t.length >= Number(e);
      },
      lt: nr,
      lte: Pn,
      matches: rr,
      notEquals: jn,
      notInside: qn,
      notMatches: or,
      numberEquals: ir,
      numberNotEquals: sr,
      shorterThan: function (t, e) {
        return t.length < Number(e);
      },
      shorterThanOrEquals: function (t, e) {
        return t.length <= Number(e);
      },
      startsWith: ar,
    },
    {
      allOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return gn(
          dn(e, function (e, n) {
            (e = hn(e, t)).pass || n(e);
          }),
          mn(!0)
        );
      },
      anyOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return gn(
          dn(e, function (e, n) {
            (e = hn(e, t)).pass && n(e);
          }),
          mn(!1)
        );
      },
      noneOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return gn(
          dn(e, function (e, n) {
            hn(e, t).pass && n(mn(!1));
          }),
          mn(!0)
        );
      },
      oneOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        var r = [];
        return (
          e.some(function (e) {
            if ($n(r, 1)) return !1;
            (e = hn(e, t)).pass && r.push(e);
          }),
          mn(yn(r, 1))
        );
      },
      optional: function (t, e) {
        return Cn(t) || null === t ? mn(!0) : hn(e, t);
      },
    },
    {
      shape: function (t, e) {
        var n = pr(t, e);
        if (!n.pass) return n;
        for (var r in t)
          if (!Object.prototype.hasOwnProperty.call(e, r)) return mn(!1);
        return mn(!0);
      },
      loose: pr,
      isArrayOf: function (t, e) {
        return gn(
          dn(t, function (t, n, r) {
            (r = fr.run({ value: t, set: !0, meta: { index: r } }, function () {
              return hn(e, t);
            })).pass || n(r);
          }),
          mn(!0)
        );
      },
    }
  );
  function mr(t) {
    for (var e in gr) {
      var n = gr[e];
      fn(n) && t(e, n);
    }
  }
  function hr() {
    try {
      return fn(Proxy);
    } catch (t) {
      return !1;
    }
  }
  function vr(t, e, n) {
    for (var r = [], o = 3; o < arguments.length; o++) r[o - 3] = arguments[o];
    return (
      Bn(t) ||
        (t && Bn(t.pass)) ||
        ur("Incorrect return value for rule: " + JSON.stringify(t)),
      Bn(t) ? mn(t) : mn(t.pass, pn.apply(void 0, un([t.message, e, n], r)))
    );
  }
  function yr(t) {
    var e,
      n = [];
    return (function t(r) {
      return function () {
        for (var o = [], i = 0; i < arguments.length; i++) o[i] = arguments[i];
        var s = gr[r];
        n.push(function (t) {
          return vr.apply(void 0, un([s.apply(void 0, un([t], o)), r, t], o));
        });
        var a = {
          run: function (t) {
            return gn(
              dn(n, function (n, r) {
                var o,
                  i = fr.run({ value: t }, function () {
                    return n(t);
                  });
                i.pass ||
                  r(
                    mn(
                      !!i.pass,
                      null !== (o = pn(e, t, i.message)) && void 0 !== o
                        ? o
                        : i.message
                    )
                  );
              }),
              mn(!0)
            );
          },
          test: function (t) {
            return a.run(t).pass;
          },
          message: function (t) {
            return t && (e = t), a;
          },
        };
        return hr()
          ? (a = new Proxy(a, {
              get: function (e, n) {
                return gr[n] ? t(n) : e[n];
              },
            }))
          : (mr(function (e) {
              a[e] = t(e);
            }),
            a);
      };
    })(t);
  }
  var br,
    $r =
      ((br = ln(
        {
          context: function () {
            return fr.useX();
          },
          extend: function (t) {
            cn(gr, t);
          },
        },
        {
          partial: function (t) {
            var e,
              n = {};
            for (e in t) n[e] = $r.optional(t[e]);
            return n;
          },
        }
      )),
      hr()
        ? new Proxy(
            cn(function (t) {
              function e(e, n, r) {
                return function () {
                  for (var o = [], i = 0; i < arguments.length; i++)
                    o[i] = arguments[i];
                  if (
                    !(i = vr.apply(
                      void 0,
                      un(
                        [
                          fr.run({ value: t }, function () {
                            return n.apply(void 0, un([t], o));
                          }),
                          r,
                          t,
                        ],
                        o
                      )
                    )).pass
                  ) {
                    if (!Un(i.message)) throw i.message;
                    ur("enforce/" + r + " failed with " + JSON.stringify(t));
                  }
                  return e;
                };
              }
              var n = {};
              if (!hr())
                return (
                  mr(function (t, r) {
                    n[t] = e(n, r, t);
                  }),
                  n
                );
              var r = new Proxy(n, {
                get: function (t, n) {
                  if ((t = gr[n])) return e(r, t, n);
                },
              });
              return r;
            }, br),
            {
              get: function (t, e) {
                return e in t ? t[e] : gr[e] ? yr(e) : void 0;
              },
            }
          )
        : (mr(function (t) {
            br[t] = yr(t);
          }),
          br)),
    wr = (function (t) {
      return function () {
        return "" + t++;
      };
    })(0);
  function xr(t) {
    function e(t, e, o) {
      return (
        r.references.push(),
        n(t, pn(e, o)),
        function () {
          return [
            r.references[t],
            function (e) {
              return n(t, pn(e, r.references[t]));
            },
          ];
        }
      );
    }
    function n(e, n) {
      var i = r.references[e];
      (r.references[e] = n), fn((e = o[e][1])) && e(n, i), fn(t) && t();
    }
    var r = { references: [] },
      o = [];
    return {
      registerStateKey: function (t, n) {
        var r = o.length;
        return o.push([t, n]), e(r, t);
      },
      reset: function () {
        var t = r.references;
        (r.references = []),
          o.forEach(function (n, r) {
            return e(r, n[0], t[r]);
          });
      },
    };
  }
  var Cr,
    _r = Cr || (Cr = {});
  function Nr(t, e) {
    var n = e.suiteId;
    return (
      (e = e.suiteName),
      {
        optionalFields: t.registerStateKey(function () {
          return {};
        }),
        suiteId: t.registerStateKey(n),
        suiteName: t.registerStateKey(e),
        testCallbacks: t.registerStateKey(function () {
          return { fieldCallbacks: {}, doneCallbacks: [] };
        }),
        testObjects: t.registerStateKey(function (t) {
          return { prev: t ? t.current : [], current: [] };
        }),
      }
    );
  }
  function Sr(t) {
    return (t = [].concat(t))[t.length - 1];
  }
  function kr() {
    function t() {
      e = [0];
    }
    var e = [];
    return (
      t(),
      {
        addLevel: function () {
          e.push(0);
        },
        cursorAt: function () {
          return Sr(e);
        },
        getCursor: function () {
          return [].concat(e);
        },
        next: function () {
          return e[e.length - 1]++, Sr(e);
        },
        removeLevel: function () {
          e.pop();
        },
        reset: t,
      }
    );
  }
  (_r[(_r.DEFAULT = 0)] = "DEFAULT"),
    (_r[(_r.SUITE = 1)] = "SUITE"),
    (_r[(_r.EACH = 2)] = "EACH"),
    (_r[(_r.SKIP_WHEN = 3)] = "SKIP_WHEN"),
    (_r[(_r.GROUP = 4)] = "GROUP");
  var Er = cr(function (t, e) {
    return e
      ? null
      : cn(
          {},
          {
            isolate: { type: Cr.DEFAULT },
            testCursor: kr(),
            exclusion: { tests: {}, groups: {} },
          },
          t
        );
  });
  function jr(t, e) {
    for (var n = [], r = 0; r < t.length; r++) {
      var o = t[r];
      An(o) ? n.push(jr(o, e)) : ((o = e(o)), xn(o) && n.push(o));
    }
    return n;
  }
  function Or(t) {
    return [].concat(t).reduce(function (t, e) {
      return An(e) ? t.concat(Or(e)) : [].concat(t).concat(e);
    }, []);
  }
  function Fr(t, e) {
    var n = 0;
    for (e = e.slice(0, -1); n < e.length; n++) {
      var r = e[n];
      (t[r] = gn(t[r], [])), (t = t[r]);
    }
    return t;
  }
  function Tr(t) {
    function e(r, o) {
      var i = e.get(r);
      return i
        ? i[1]
        : ((o = o()),
          n.unshift([r.concat(), o]),
          $n(n, t) && (n.length = t),
          o);
    }
    void 0 === t && (t = 1);
    var n = [];
    return (
      (e.invalidate = function (t) {
        var e = n.findIndex(function (e) {
          var n = e[0];
          return (
            yn(t, n.length) &&
            t.every(function (t, e) {
              return t === n[e];
            })
          );
        });
        -1 < e && n.splice(e, 1);
      }),
      (e.get = function (t) {
        return (
          n[
            n.findIndex(function (e) {
              var n = e[0];
              return (
                yn(t, n.length) &&
                t.every(function (t, e) {
                  return t === n[e];
                })
              );
            })
          ] || null
        );
      }),
      e
    );
  }
  function Wr() {
    return Er.useX().stateRef;
  }
  function Ar() {
    (0, Wr().testObjects()[1])(function (t) {
      return { prev: t.prev, current: [].concat(t.current) };
    });
  }
  function Rr(t) {
    (0, Wr().testObjects()[1])(function (e) {
      return { prev: e.prev, current: [].concat(t(e.current)) };
    });
  }
  function Dr() {
    return Or(
      jr(Wr().testObjects()[0].current, function (t) {
        return t.isPending() ? t : null;
      })
    );
  }
  var qr = Tr();
  function Pr() {
    var t = Wr().testObjects()[0].current;
    return qr([t], function () {
      return Or(t);
    });
  }
  function zr() {
    return Er.useX().testCursor.getCursor();
  }
  function Ir(t, e) {
    if (((t = void 0 === (t = t.type) ? Cr.DEFAULT : t), fn(e))) {
      var n = zr();
      return Er.run({ isolate: { type: t } }, function () {
        Er.useX().testCursor.addLevel(),
          Rr(function (t) {
            return (Fr(t, n)[Sr(n)] = []), t;
          });
        var t = e();
        return (
          Er.useX().testCursor.removeLevel(), Er.useX().testCursor.next(), t
        );
      });
    }
  }
  function Mr(t, e) {
    return !(!e || t.fieldName !== e);
  }
  function Vr(t) {
    var e = Dr();
    return (
      !Un(e) &&
      (t
        ? e.some(function (e) {
            return Mr(e, t);
          })
        : Gn(e))
    );
  }
  function Br(t, e) {
    function n(t, e) {
      i[t]++, o && (i[e] = (i[e] || []).concat(o));
    }
    var r = e.fieldName,
      o = e.message;
    t[r] = t[r] || { errorCount: 0, warnCount: 0, testCount: 0 };
    var i = t[r];
    return (
      e.isSkipped() ||
        (t[r].testCount++,
        e.isFailing()
          ? n("errorCount", "errors")
          : e.isWarning() && n("warnCount", "warnings")),
      i
    );
  }
  function Lr(t, e, n) {
    var r;
    void 0 === n && (n = {});
    var o = (n = n || {}).group,
      i = n.fieldName;
    return e.reduce(function (e, n) {
      if (o && n.groupName !== o) var r = !0;
      else
        i && !Mr(n, i)
          ? (r = !0)
          : ((r = n.warns()), (r = ("warnings" === t) != !!r));
      return (
        r ||
          !n.hasFailures() ||
          (e[n.fieldName] = (e[n.fieldName] || []).concat(n.message || [])),
        e
      );
    }, ln({}, i && (((r = {})[i] = []), r)));
  }
  function Kr(t) {
    return Ur("errors", t);
  }
  function Hr(t) {
    return Ur("warnings", t);
  }
  function Ur(t, e) {
    return (t = Lr(t, Pr(), { fieldName: e })), e ? t[e] : t;
  }
  function Gr(t, e) {
    return (t = Jr("errors", t, e)), e ? t[e] : t;
  }
  function Xr(t, e) {
    return (t = Jr("warnings", t, e)), e ? t[e] : t;
  }
  function Jr(t, e, n) {
    return (
      e ||
        ur(
          "get" +
            t[0].toUpperCase() +
            t.slice(1) +
            "ByGroup requires a group name. Received `" +
            e +
            "` instead."
        ),
      Lr(t, Pr(), { group: e, fieldName: n })
    );
  }
  function Yr(t, e, n) {
    return (
      (n = !t.hasFailures() || (n && !Mr(t, n))) ||
        (n = ("warnings" === e) != !!(t = t.warns())),
      !n
    );
  }
  function Zr(t) {
    return to("errors", t);
  }
  function Qr(t) {
    return to("warnings", t);
  }
  function to(t, e) {
    return Pr().some(function (n) {
      return Yr(n, t, e);
    });
  }
  function eo(t, e) {
    return ro("errors", t, e);
  }
  function no(t, e) {
    return ro("warnings", t, e);
  }
  function ro(t, e, n) {
    return Pr().some(function (r) {
      return e === r.groupName && Yr(r, t, n);
    });
  }
  var oo = Tr(20);
  function io() {
    var t = Pr(),
      e = { stateRef: Wr() };
    return oo(
      [t],
      Er.bind(e, function () {
        var t = Wr().suiteName()[0];
        return cn(
          (function () {
            var t = {
              errorCount: 0,
              groups: {},
              testCount: 0,
              tests: {},
              warnCount: 0,
            };
            return (
              Pr().forEach(function (e) {
                var n = e.fieldName,
                  r = e.groupName;
                (t.tests[n] = Br(t.tests, e)),
                  r &&
                    ((t.groups[r] = t.groups[r] || {}),
                    (t.groups[r][n] = Br(t.groups[r], e)));
              }),
              (function (t) {
                for (var e in t.tests)
                  (t.errorCount += t.tests[e].errorCount),
                    (t.warnCount += t.tests[e].warnCount),
                    (t.testCount += t.tests[e].testCount);
                return t;
              })(t)
            );
          })(),
          {
            getErrors: Er.bind(e, Kr),
            getErrorsByGroup: Er.bind(e, Gr),
            getWarnings: Er.bind(e, Hr),
            getWarningsByGroup: Er.bind(e, Xr),
            hasErrors: Er.bind(e, Zr),
            hasErrorsByGroup: Er.bind(e, eo),
            hasWarnings: Er.bind(e, Qr),
            hasWarningsByGroup: Er.bind(e, no),
            isValid: Er.bind(e, function (t) {
              var e = io(),
                n = Pr().reduce(function (t, e) {
                  return (
                    t[e.fieldName] || (e.isOmitted() && (t[e.fieldName] = !0)),
                    t
                  );
                }, {});
              return (t =
                (n = !!t && !!n[t]) ||
                (!e.hasErrors(t) &&
                  !(
                    Un((n = Pr())) ||
                    (t && Un(e.tests[t])) ||
                    (function (t) {
                      var e = Wr().optionalFields()[0];
                      return Gn(
                        Dr().filter(function (n) {
                          return !(t && !Mr(n, t)) && !0 !== e[n.fieldName];
                        })
                      );
                    })(t)
                  ) &&
                  (function (t) {
                    var e = Pr(),
                      n = Wr().optionalFields()[0];
                    return e.every(function (e) {
                      return (
                        !(!t || Mr(e, t)) ||
                        !0 === n[e.fieldName] ||
                        e.isTested() ||
                        e.isOmitted()
                      );
                    });
                  })(t)));
            }),
            suiteName: t,
          }
        );
      })
    );
  }
  var so = Tr(20);
  function ao() {
    var t = Pr(),
      e = { stateRef: Wr() };
    return so(
      [t],
      Er.bind(e, function () {
        return cn({}, io(), { done: Er.bind(e, co) });
      })
    );
  }
  function lo(t, e, n) {
    return !(fn(t) && (!e || (n.tests[e] && 0 !== n.tests[e].testCount)));
  }
  function uo(t) {
    return !(Vr() && (!t || Vr(t)));
  }
  function co() {
    function t() {
      return r(io());
    }
    for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
    var r = (e = e.reverse())[0];
    return (
      (e = e[1]), (n = ao()), lo(r, e, n) ? n : uo(e) ? (t(), n) : (fo(t, e), n)
    );
  }
  function fo(t, e) {
    var n = Er.bind({}, t);
    (0, Wr().testCallbacks()[1])(function (t) {
      return (
        e
          ? (t.fieldCallbacks[e] = (t.fieldCallbacks[e] || []).concat(n))
          : t.doneCallbacks.push(n),
        t
      );
    });
  }
  function po(t) {
    return t.forEach(function (t) {
      return t();
    });
  }
  function go() {
    var t = (function () {
      var t = {};
      return {
        emit: function (e, n) {
          t[e] &&
            t[e].forEach(function (t) {
              t(n);
            });
        },
        on: function (e, n) {
          return (
            t[e] || (t[e] = []),
            t[e].push(n),
            {
              off: function () {
                t[e] = t[e].filter(function (t) {
                  return t !== n;
                });
              },
            }
          );
        },
      };
    })();
    return (
      t.on(ho.TEST_COMPLETED, function (t) {
        if (!t.isCanceled()) {
          t.done(), (t = t.fieldName);
          var e = Wr().testCallbacks()[0].fieldCallbacks;
          t && !Vr(t) && An(e[t]) && po(e[t]),
            (t = Wr().testCallbacks()[0].doneCallbacks),
            Vr() || po(t);
        }
      }),
      t.on(ho.SUITE_COMPLETED, function () {
        !(function () {
          var t = Wr().optionalFields()[0];
          if (!Un(t)) {
            var e = {};
            Rr(function (n) {
              return jr(n, function (n) {
                var r = n.fieldName;
                if (e.hasOwnProperty(r)) e[n.fieldName] && n.omit();
                else {
                  var o = t[r];
                  fn(o) && ((e[r] = o()), e[n.fieldName] && n.omit());
                }
                return n;
              });
            });
          }
        })();
      }),
      t.on(ho.REMOVE_FIELD, function (t) {
        Pr().forEach(function (e) {
          Mr(e, t) &&
            (e.cancel(),
            (function (t) {
              Rr(function (e) {
                return jr(e, function (e) {
                  return t !== e ? e : null;
                });
              });
            })(e));
        });
      }),
      t
    );
  }
  function mo() {
    var t = Er.useX();
    return t.bus || ur(), t.bus;
  }
  var ho,
    vo = ho || (ho = {});
  function yo(t) {
    return bo(0, "tests", t);
  }
  function bo(t, e, n) {
    var r = Er.useX("hook called outside of a running suite.");
    n &&
      [].concat(n).forEach(function (n) {
        Nn(n) && (r.exclusion[e][n] = 0 === t);
      });
  }
  function $o(t) {
    for (var e in t) if (!0 === t[e]) return !0;
    return !1;
  }
  (vo.TEST_COMPLETED = "test_completed"),
    (vo.REMOVE_FIELD = "remove_field"),
    (vo.SUITE_COMPLETED = "suite_completed"),
    (yo.group = function (t) {
      return bo(0, "groups", t);
    });
  var wo,
    xo = wo || (wo = {});
  (xo.Error = "error"), (xo.Warning = "warning");
  var Co = (function () {
      function t(t, e, n) {
        var r = void 0 === n ? {} : n;
        (n = r.message),
          (r = r.groupName),
          (this.id = wr()),
          (this.severity = wo.Error),
          (this.status = _o),
          (this.fieldName = t),
          (this.testFn = e),
          r && (this.groupName = r),
          n && (this.message = n);
      }
      return (
        (t.prototype.run = function () {
          try {
            var t = this.testFn();
          } catch (e) {
            (t = e), Cn(this.message) && Nn(t) && (this.message = e), (t = !1);
          }
          return !1 === t && this.fail(), t;
        }),
        (t.prototype.setStatus = function (t) {
          (this.isFinalStatus() && t !== Fo) || (this.status = t);
        }),
        (t.prototype.warns = function () {
          return this.severity === wo.Warning;
        }),
        (t.prototype.setPending = function () {
          this.setStatus(jo);
        }),
        (t.prototype.fail = function () {
          this.setStatus(this.warns() ? ko : So);
        }),
        (t.prototype.done = function () {
          this.isFinalStatus() || this.setStatus(Eo);
        }),
        (t.prototype.warn = function () {
          this.severity = wo.Warning;
        }),
        (t.prototype.isFinalStatus = function () {
          return this.hasFailures() || this.isCanceled() || this.isPassing();
        }),
        (t.prototype.skip = function () {
          this.isPending() || this.setStatus(No);
        }),
        (t.prototype.cancel = function () {
          this.setStatus(Oo), Ar();
        }),
        (t.prototype.omit = function () {
          this.setStatus(Fo);
        }),
        (t.prototype.valueOf = function () {
          return !this.isFailing();
        }),
        (t.prototype.hasFailures = function () {
          return this.isFailing() || this.isWarning();
        }),
        (t.prototype.isPending = function () {
          return this.status === jo;
        }),
        (t.prototype.isTested = function () {
          return this.hasFailures() || this.isPassing();
        }),
        (t.prototype.isOmitted = function () {
          return this.status === Fo;
        }),
        (t.prototype.isUntested = function () {
          return this.status === _o;
        }),
        (t.prototype.isFailing = function () {
          return this.status === So;
        }),
        (t.prototype.isCanceled = function () {
          return this.status === Oo;
        }),
        (t.prototype.isSkipped = function () {
          return this.status === No;
        }),
        (t.prototype.isPassing = function () {
          return this.status === Eo;
        }),
        (t.prototype.isWarning = function () {
          return this.status === ko;
        }),
        t
      );
    })(),
    _o = "UNTESTED",
    No = "SKIPPED",
    So = "FAILED",
    ko = "WARNING",
    Eo = "PASSING",
    jo = "PENDING",
    Oo = "CANCELED",
    Fo = "OMITTED";
  function To(t) {
    var e = t.asyncTest,
      n = t.message;
    if (e && fn(e.then)) {
      var r = mo().emit,
        o = Wr(),
        i = Er.bind({ stateRef: o }, function () {
          Ar(), r(ho.TEST_COMPLETED, t);
        });
      o = Er.bind({ stateRef: o }, function (e) {
        t.isCanceled() || ((t.message = Nn(e) ? e : n), t.fail(), i());
      });
      try {
        e.then(i, o);
      } catch (t) {
        o();
      }
    }
  }
  function Wo(t) {
    var e = zr();
    Rr(function (n) {
      return (Fr(n, e)[Sr(e)] = t), n;
    });
  }
  function Ao(t) {
    var e = (function (t) {
      var e = Wr().testObjects(),
        n = e[1],
        r = e[0].prev;
      if (Un(r)) return Wo(t), t;
      if (
        (function (t, e) {
          return (
            Gn(t) &&
            !(t.fieldName === e.fieldName && t.groupName === e.groupName)
          );
        })(
          (e = (function (t) {
            var e = zr();
            return Fr(t, e)[Sr(e)];
          })(r)),
          t
        )
      ) {
        !(function (t, e) {
          Er.useX().isolate.type !== Cr.EACH &&
            (function (t, e) {
              setTimeout(function () {
                ur(t, void 0);
              }, 0);
            })(
              "Vest Critical Error: Tests called in different order than previous run.\n    expected: " +
                t.fieldName +
                "\n    received: " +
                e.fieldName +
                "\n    This happens when you conditionally call your tests using if/else.\n    This might lead to incorrect validation results.\n    Replacing if/else with skipWhen solves these issues."
            );
        })(e, t),
          (e = Fr(r, zr()));
        var o = Er.useX().testCursor.cursorAt();
        e.splice(o),
          n(function (t) {
            return { prev: r, current: t.current };
          }),
          (e = null);
      }
      return Wo((t = gn(e, t))), t;
    })(t);
    if (
      (function (t) {
        var e = t.fieldName;
        t = t.groupName;
        var n = Er.useX();
        if (n.skipped) return !0;
        var r = (n = n.exclusion).tests,
          o = r[e];
        if (!1 === o) return !0;
        if (((o = !0 === o), t)) {
          t: {
            var i = Er.useX().exclusion.groups;
            if (Object.prototype.hasOwnProperty.call(i, t)) var s = !1 === i[t];
            else {
              for (s in i)
                if (!0 === i[s]) {
                  s = !0;
                  break t;
                }
              s = !1;
            }
          }
          if (s) return !0;
          if (!0 === n.groups[t]) return !(o || (!$o(r) && !1 !== r[e]));
        }
        return !o && $o(r);
      })(t)
    )
      return t.skip(), Er.useX().testCursor.next(), e;
    if (
      (t !== e &&
        e.fieldName === t.fieldName &&
        e.groupName === t.groupName &&
        e.isPending() &&
        e.cancel(),
      Wo(t),
      Er.useX().testCursor.next(),
      t.isUntested())
    ) {
      e = mo();
      var n = (function (t) {
        return Er.run({ currentTest: t }, function () {
          try {
            var e = t.testFn();
          } catch (n) {
            (e = n), Cn(t.message) && Nn(e) && (t.message = n), (e = !1);
          }
          return !1 === e && t.fail(), e;
        });
      })(t);
      try {
        n && fn(n.then)
          ? ((t.asyncTest = n), t.setPending(), To(t))
          : e.emit(ho.TEST_COMPLETED, t);
      } catch (e) {
        ur(
          "Your test function " +
            t.fieldName +
            ' returned a value. Only "false" or Promise returns are supported.'
        );
      }
    } else (e = t.asyncTest) && fn(e.then) && (t.setPending(), To(t));
    return t;
  }
  function Ro(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    (n = e.reverse()), (e = n[0]), (n = n[1]);
    var r = Er.useX();
    return Ao((e = new Co(t, e, { message: n, groupName: r.groupName })));
  }
  var Do = cn(Ro, {
    each: (function (t) {
      return function (e) {
        return (
          An(e) || ur("test.each: Expected table to be an array."),
          function (n) {
            for (var r = [], o = 1; o < arguments.length; o++)
              r[o - 1] = arguments[o];
            var i = (r = r.reverse())[0],
              s = r[1];
            return Ir({ type: Cr.EACH }, function () {
              return e.map(function (e) {
                return (
                  (e = [].concat(e)),
                  t(
                    pn.apply(void 0, un([n], e)),
                    pn.apply(void 0, un([s], e)),
                    function () {
                      return i.apply(void 0, e);
                    }
                  )
                );
              });
            });
          }
        );
      };
    })(Ro),
    memo: (function (t) {
      var e = Tr(100);
      return function (n) {
        for (var r = [], o = 1; o < arguments.length; o++)
          r[o - 1] = arguments[o];
        o = Er.useX().testCursor.cursorAt();
        var i = (r = r.reverse())[0],
          s = r[1],
          a = r[2];
        return (
          (o = [Wr().suiteId()[0], n, o].concat(i)),
          null === (r = e.get(o))
            ? e(o, function () {
                return t(n, a, s);
              })
            : r[1].isCanceled()
            ? (e.invalidate(o),
              e(o, function () {
                return t(n, a, s);
              }))
            : Ao(r[1])
        );
      };
    })(Ro),
  });
  const qo = (function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    var n = (t = t.reverse())[0];
    (t = t[1]), fn(n) || ur("vest.create: Expected callback to be a function.");
    var r = go(),
      o = xr();
    return (
      (t = { stateRef: Nr(o, { suiteId: wr(), suiteName: t }), bus: r }),
      cn(
        Er.bind(t, function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return (
            o.reset(),
            Ir({ type: Cr.SUITE }, function () {
              n.apply(void 0, t);
            }),
            r.emit(ho.SUITE_COMPLETED),
            ao()
          );
        }),
        {
          get: Er.bind(t, io),
          reset: o.reset,
          remove: Er.bind(t, function (t) {
            r.emit(ho.REMOVE_FIELD, t);
          }),
        }
      )
    );
  })("Settings Form", (t = {}, e) => {
    yo(e),
      Do("newRWeight", "Must be between 0 and 3", () => {
        $r(t.newRWeight).gte(0), $r(t.newRWeight).lte(3);
      }),
      Do("newKWeight", "Must be between 0 and 3", () => {
        $r(t.newKWeight).gte(0), $r(t.newKWeight).lte(3);
      }),
      Do("newVWeight", "Must be between 0 and 3", () => {
        $r(t.newVWeight).gte(0), $r(t.newVWeight).lte(3);
      });
  });
  function Po(t) {
    let e,
      n,
      r,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _,
      k,
      O,
      q,
      P,
      z,
      I,
      M,
      V,
      B,
      L,
      K,
      H,
      U,
      G,
      X,
      J,
      Y,
      Z,
      tt,
      et,
      nt,
      rt,
      ot,
      it,
      st,
      at,
      lt,
      ut,
      dt,
      pt,
      vt,
      yt,
      bt,
      $t,
      wt,
      xt,
      Ct,
      _t,
      Nt,
      St,
      kt,
      Et,
      jt,
      Ot,
      Ft,
      Tt,
      Wt,
      At,
      Rt,
      Dt,
      qt,
      Pt,
      zt,
      It,
      Mt,
      Vt,
      Bt,
      Lt,
      Kt,
      Ht,
      Ut,
      Gt,
      Xt,
      Jt,
      Yt,
      Zt,
      Qt,
      te,
      ee,
      ne,
      re,
      oe,
      ie,
      se,
      ae,
      le,
      ue,
      ce,
      fe,
      de,
      pe,
      ge,
      me,
      he,
      ve,
      ye,
      be,
      $e,
      we,
      xe,
      Ce,
      _e,
      Ne,
      Se,
      ke,
      Ee,
      je,
      Oe,
      Fe,
      Te,
      We,
      Ae,
      Re,
      De,
      qe = t[0].targetApprentice + "",
      Pe = t[0].targetSpeed + "",
      ze = t[0].targetRevDay + "",
      Ie = t[0].madCutoff + "",
      Me = t[0].tzOffset + "";
    return (
      (y = new an({ props: { errors: t[1], path: "newRWeight" } })),
      (q = new an({ props: { errors: t[1], path: "newKWeight" } })),
      (B = new an({ props: { errors: t[1], path: "newVWeight" } })),
      ($e = new an({ props: { errors: t[1], path: "madCutoff" } })),
      (je = new an({ props: { errors: t[1], path: "tzOffset" } })),
      {
        c() {
          (e = C("form")),
            (n = C("fieldset")),
            (r = C("legend")),
            (r.textContent = "Behavior Settings"),
            (i = S()),
            (s = C("label")),
            (s.textContent = "Desired number of apprentice items"),
            (a = S()),
            (l = C("input")),
            (u = S()),
            (c = C("p")),
            (f = N(qe)),
            (d = S()),
            (p = C("label")),
            (p.textContent = "Weighting factor for new radicals"),
            (g = S()),
            (m = C("input")),
            (h = S()),
            gt(y.$$.fragment),
            (b = S()),
            (x = C("label")),
            (x.textContent = "Weighting factor for new kanji"),
            (_ = S()),
            (k = C("input")),
            (O = S()),
            gt(q.$$.fragment),
            (P = S()),
            (z = C("label")),
            (z.textContent = "Weighting factor for new vocabulary"),
            (I = S()),
            (M = C("input")),
            (V = S()),
            gt(B.$$.fragment),
            (L = S()),
            (K = C("hr")),
            (H = S()),
            (U = C("label")),
            (U.textContent = "Target speed (seconds-per-question)"),
            (G = S()),
            (X = C("input")),
            (J = S()),
            (Y = C("p")),
            (Z = N(Pe)),
            (tt = S()),
            (et = C("label")),
            (et.textContent = "Target reviews-per-day"),
            (nt = S()),
            (rt = C("input")),
            (ot = S()),
            (it = C("p")),
            (st = N(ze)),
            (at = S()),
            (lt = C("fieldset")),
            (ut = C("legend")),
            (ut.textContent = "General Settings"),
            (dt = S()),
            (pt = C("label")),
            (pt.textContent = "Position:"),
            (vt = S()),
            (yt = C("select")),
            (bt = N(
              '// position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom"\n      '
            )),
            ($t = C("option")),
            ($t.textContent = "Top"),
            (wt = C("option")),
            (wt.textContent = "Below Forecast"),
            (xt = C("option")),
            (xt.textContent = "Below SRS"),
            (Ct = C("option")),
            (Ct.textContent = "Below Panels"),
            (_t = C("option")),
            (_t.textContent = "Bottom"),
            (Nt = S()),
            (St = C("div")),
            (kt = C("h3")),
            (Et = N("Sample Text")),
            (jt = S()),
            (Ot = C("div")),
            (Ft = C("div")),
            (Tt = C("div")),
            (Wt = C("div")),
            (At = S()),
            (Rt = C("label")),
            (Rt.textContent = "Text"),
            (Dt = S()),
            (qt = C("input")),
            (Pt = S()),
            (zt = C("label")),
            (zt.textContent = "Background"),
            (It = S()),
            (Mt = C("input")),
            (Vt = S()),
            (Bt = C("label")),
            (Bt.textContent = "Fill"),
            (Lt = S()),
            (Kt = C("input")),
            (Ht = S()),
            (Ut = C("div")),
            (Gt = C("label")),
            (Gt.textContent = "Good"),
            (Xt = S()),
            (Jt = C("input")),
            (Yt = S()),
            (Zt = C("label")),
            (Zt.textContent = "Warning"),
            (Qt = S()),
            (te = C("input")),
            (ee = S()),
            (ne = C("label")),
            (ne.textContent = "Alert"),
            (re = S()),
            (oe = C("input")),
            (ie = N("\n    Theme:\n    \n    ")),
            (se = C("button")),
            (se.textContent = "Light"),
            (ae = S()),
            (le = C("button")),
            (le.textContent = "dark"),
            (ue = S()),
            (ce = C("fieldset")),
            (fe = C("legend")),
            (fe.textContent = "Advanced Settings"),
            (de = S()),
            (pe = C("label")),
            (pe.textContent = "MAD cutoff"),
            (ge = S()),
            (me = C("input")),
            (he = S()),
            (ve = C("p")),
            (ye = N(Ie)),
            (be = S()),
            gt($e.$$.fragment),
            (we = S()),
            (xe = C("label")),
            (xe.textContent = "Time zone offset for start-of-day calculations"),
            (Ce = S()),
            (_e = C("input")),
            (Ne = S()),
            (Se = C("p")),
            (ke = N(Me)),
            (Ee = S()),
            gt(je.$$.fragment),
            (Oe = S()),
            (Fe = C("button")),
            (Fe.textContent = "Save"),
            (Te = S()),
            (We = C("button")),
            (We.textContent = "Reset"),
            F(s, "for", "apprenticeItems"),
            F(s, "class", "svelte-1ljtm41"),
            F(l, "type", "range"),
            F(l, "name", "apprenticeItems"),
            F(l, "id", "apprenticeItems"),
            F(l, "min", "0"),
            F(l, "max", "200"),
            F(l, "step", "10"),
            F(p, "for", "newRWeight"),
            F(p, "class", "svelte-1ljtm41"),
            F(m, "type", "number"),
            F(m, "name", "newRWeight"),
            F(m, "id", "newRWeight"),
            F(m, "min", "0"),
            F(m, "max", "3"),
            F(m, "step", "0.25"),
            F(x, "for", "newKWeight"),
            F(x, "class", "svelte-1ljtm41"),
            F(k, "type", "number"),
            F(k, "name", "newKWeight"),
            F(k, "id", "newKWeight"),
            F(k, "min", "0"),
            F(k, "max", "3"),
            F(k, "step", "0.25"),
            F(z, "for", "newVWeight"),
            F(z, "class", "svelte-1ljtm41"),
            F(M, "type", "number"),
            F(M, "name", "newVWeight"),
            F(M, "id", "newVWeight"),
            F(M, "min", "0"),
            F(M, "max", "3"),
            F(M, "step", "0.25"),
            F(U, "for", "targetSpeed"),
            F(U, "class", "svelte-1ljtm41"),
            F(X, "type", "range"),
            F(X, "min", "3"),
            F(X, "max", "15"),
            F(X, "step", "0.5"),
            F(X, "name", "targetSpeed"),
            F(X, "id", "targetSpeed"),
            F(et, "for", "targetRevDay"),
            F(et, "class", "svelte-1ljtm41"),
            F(rt, "type", "range"),
            F(rt, "min", "1"),
            F(rt, "max", "300"),
            F(rt, "name", "targetRevDay"),
            F(rt, "id", "targetRevDay"),
            F(pt, "for", "gbPosition"),
            F(pt, "class", "svelte-1ljtm41"),
            ($t.__value = "Top"),
            ($t.value = $t.__value),
            (wt.__value = "Below Forecast"),
            (wt.value = wt.__value),
            (xt.__value = "Below SRS"),
            (xt.value = xt.__value),
            (Ct.__value = "Below Panels"),
            (Ct.value = Ct.__value),
            (_t.__value = "Bottom"),
            (_t.value = _t.__value),
            F(yt, "name", "position"),
            F(yt, "id", "gbPosition"),
            void 0 === t[0].position && Q(() => t[13].call(yt)),
            R(kt, "color", t[0].textColor),
            F(Ft, "class", "goodBar svelte-1ljtm41"),
            R(Ft, "background-color", t[0].goodColor),
            F(Tt, "class", "warnBar svelte-1ljtm41"),
            R(Tt, "background-color", t[0].warnColor),
            F(Wt, "class", "errorBar svelte-1ljtm41"),
            R(Wt, "background-color", t[0].errorColor),
            F(Ot, "class", "gaugeBar svelte-1ljtm41"),
            R(Ot, "background-color", t[0].fillColor),
            F(St, "class", "colorSample svelte-1ljtm41"),
            R(St, "background-color", t[0].bgColor),
            F(Rt, "for", "textColor"),
            F(Rt, "class", "svelte-1ljtm41"),
            F(qt, "type", "color"),
            F(qt, "name", "textColor"),
            F(qt, "id", "textColor"),
            F(qt, "class", "svelte-1ljtm41"),
            F(zt, "for", "bgColor"),
            F(zt, "class", "svelte-1ljtm41"),
            F(Mt, "type", "color"),
            F(Mt, "name", "bgColor"),
            F(Mt, "id", "bgColor"),
            F(Mt, "class", "svelte-1ljtm41"),
            F(Bt, "for", "fillColor"),
            F(Bt, "class", "svelte-1ljtm41"),
            F(Kt, "type", "color"),
            F(Kt, "name", "fillColor"),
            F(Kt, "id", "fillColor"),
            F(Kt, "class", "svelte-1ljtm41"),
            F(Gt, "for", "goodColor"),
            F(Gt, "class", "svelte-1ljtm41"),
            F(Jt, "type", "color"),
            F(Jt, "name", "goodColor"),
            F(Jt, "id", "goodColor"),
            F(Jt, "class", "svelte-1ljtm41"),
            F(Zt, "for", "warnColor"),
            F(Zt, "class", "svelte-1ljtm41"),
            F(te, "type", "color"),
            F(te, "name", "warnColor"),
            F(te, "id", "warnColor"),
            F(te, "class", "svelte-1ljtm41"),
            F(ne, "for", "alertColor"),
            F(ne, "class", "svelte-1ljtm41"),
            F(oe, "type", "color"),
            F(oe, "name", "alertColor"),
            F(oe, "id", "alertColor"),
            F(oe, "class", "svelte-1ljtm41"),
            F(se, "class", "svelte-1ljtm41"),
            F(le, "class", "svelte-1ljtm41"),
            F(pe, "for", "madCutoff"),
            F(pe, "class", "svelte-1ljtm41"),
            F(me, "type", "range"),
            F(me, "min", "1"),
            F(me, "max", "20"),
            F(me, "step", "0.1"),
            F(me, "name", "madCutoff"),
            F(me, "id", "madCutoff"),
            F(xe, "for", "tzOffset"),
            F(xe, "class", "svelte-1ljtm41"),
            F(_e, "type", "range"),
            F(_e, "min", "-23"),
            F(_e, "max", "23"),
            F(_e, "name", "tzOffset"),
            F(_e, "id", "tzOffset"),
            F(Fe, "type", "submit"),
            F(Fe, "class", "svelte-1ljtm41"),
            F(We, "type", "reset"),
            F(We, "class", "svelte-1ljtm41"),
            F(e, "aria-label", "Settings Form"),
            F(e, "class", "svelte-1ljtm41");
        },
        m(o, w) {
          $(o, e, w),
            v(e, n),
            v(n, r),
            v(n, i),
            v(n, s),
            v(n, a),
            v(n, l),
            A(l, t[0].targetApprentice),
            v(n, u),
            v(n, c),
            v(c, f),
            v(n, d),
            v(n, p),
            v(n, g),
            v(n, m),
            A(m, t[0].newRWeight),
            v(n, h),
            mt(y, n, null),
            v(n, b),
            v(n, x),
            v(n, _),
            v(n, k),
            A(k, t[0].newKWeight),
            v(n, O),
            mt(q, n, null),
            v(n, P),
            v(n, z),
            v(n, I),
            v(n, M),
            A(M, t[0].newVWeight),
            v(n, V),
            mt(B, n, null),
            v(n, L),
            v(n, K),
            v(n, H),
            v(n, U),
            v(n, G),
            v(n, X),
            A(X, t[0].targetSpeed),
            v(n, J),
            v(n, Y),
            v(Y, Z),
            v(n, tt),
            v(n, et),
            v(n, nt),
            v(n, rt),
            A(rt, t[0].targetRevDay),
            v(n, ot),
            v(n, it),
            v(it, st),
            v(e, at),
            v(e, lt),
            v(lt, ut),
            v(lt, dt),
            v(lt, pt),
            v(lt, vt),
            v(lt, yt),
            v(yt, bt),
            v(yt, $t),
            v(yt, wt),
            v(yt, xt),
            v(yt, Ct),
            v(yt, _t),
            D(yt, t[0].position),
            v(lt, Nt),
            v(lt, St),
            v(St, kt),
            v(kt, Et),
            v(St, jt),
            v(St, Ot),
            v(Ot, Ft),
            v(Ot, Tt),
            v(Ot, Wt),
            v(lt, At),
            v(lt, Rt),
            v(lt, Dt),
            v(lt, qt),
            A(qt, t[0].textColor),
            v(lt, Pt),
            v(lt, zt),
            v(lt, It),
            v(lt, Mt),
            A(Mt, t[0].bgColor),
            v(lt, Vt),
            v(lt, Bt),
            v(lt, Lt),
            v(lt, Kt),
            A(Kt, t[0].fillColor),
            v(lt, Ht),
            v(lt, Ut),
            v(Ut, Gt),
            v(Ut, Xt),
            v(Ut, Jt),
            A(Jt, t[0].goodColor),
            v(Ut, Yt),
            v(Ut, Zt),
            v(Ut, Qt),
            v(Ut, te),
            A(te, t[0].warnColor),
            v(Ut, ee),
            v(Ut, ne),
            v(Ut, re),
            v(Ut, oe),
            A(oe, t[0].alertColor),
            v(lt, ie),
            v(lt, se),
            v(lt, ae),
            v(lt, le),
            v(e, ue),
            v(e, ce),
            v(ce, fe),
            v(ce, de),
            v(ce, pe),
            v(ce, ge),
            v(ce, me),
            A(me, t[0].madCutoff),
            v(ce, he),
            v(ce, ve),
            v(ve, ye),
            v(ce, be),
            mt($e, ce, null),
            v(ce, we),
            v(ce, xe),
            v(ce, Ce),
            v(ce, _e),
            A(_e, t[0].tzOffset),
            v(ce, Ne),
            v(ce, Se),
            v(Se, ke),
            v(ce, Ee),
            mt(je, ce, null),
            v(e, Oe),
            v(e, Fe),
            v(e, Te),
            v(e, We),
            (Ae = !0),
            Re ||
              ((De = [
                E(l, "change", t[7]),
                E(l, "input", t[7]),
                E(m, "input", t[8]),
                E(m, "change", t[2]("newRWeight")),
                E(k, "input", t[9]),
                E(k, "change", t[2]("newKWeight")),
                E(M, "input", t[10]),
                E(M, "change", t[2]("newVWeight")),
                E(X, "change", t[11]),
                E(X, "input", t[11]),
                E(rt, "change", t[12]),
                E(rt, "input", t[12]),
                E(yt, "change", t[13]),
                E(qt, "input", t[14]),
                E(Mt, "input", t[15]),
                E(Kt, "input", t[16]),
                E(Jt, "input", t[17]),
                E(te, "input", t[18]),
                E(oe, "input", t[19]),
                E(se, "click", t[5]),
                E(le, "click", t[6]),
                E(me, "change", t[20]),
                E(me, "input", t[20]),
                E(_e, "change", t[21]),
                E(_e, "input", t[21]),
                E(We, "click", t[4]),
                E(e, "submit", j(t[3])),
              ]),
              (Re = !0));
        },
        p(t, [e]) {
          1 & e && A(l, t[0].targetApprentice),
            (!Ae || 1 & e) &&
              qe !== (qe = t[0].targetApprentice + "") &&
              W(f, qe),
            1 & e && T(m.value) !== t[0].newRWeight && A(m, t[0].newRWeight);
          const n = {};
          2 & e && (n.errors = t[1]),
            y.$set(n),
            1 & e && T(k.value) !== t[0].newKWeight && A(k, t[0].newKWeight);
          const r = {};
          2 & e && (r.errors = t[1]),
            q.$set(r),
            1 & e && T(M.value) !== t[0].newVWeight && A(M, t[0].newVWeight);
          const o = {};
          2 & e && (o.errors = t[1]),
            B.$set(o),
            1 & e && A(X, t[0].targetSpeed),
            (!Ae || 1 & e) && Pe !== (Pe = t[0].targetSpeed + "") && W(Z, Pe),
            1 & e && A(rt, t[0].targetRevDay),
            (!Ae || 1 & e) && ze !== (ze = t[0].targetRevDay + "") && W(st, ze),
            1 & e && D(yt, t[0].position),
            (!Ae || 1 & e) && R(kt, "color", t[0].textColor),
            (!Ae || 1 & e) && R(Ft, "background-color", t[0].goodColor),
            (!Ae || 1 & e) && R(Tt, "background-color", t[0].warnColor),
            (!Ae || 1 & e) && R(Wt, "background-color", t[0].errorColor),
            (!Ae || 1 & e) && R(Ot, "background-color", t[0].fillColor),
            (!Ae || 1 & e) && R(St, "background-color", t[0].bgColor),
            1 & e && A(qt, t[0].textColor),
            1 & e && A(Mt, t[0].bgColor),
            1 & e && A(Kt, t[0].fillColor),
            1 & e && A(Jt, t[0].goodColor),
            1 & e && A(te, t[0].warnColor),
            1 & e && A(oe, t[0].alertColor),
            1 & e && A(me, t[0].madCutoff),
            (!Ae || 1 & e) && Ie !== (Ie = t[0].madCutoff + "") && W(ye, Ie);
          const i = {};
          2 & e && (i.errors = t[1]),
            $e.$set(i),
            1 & e && A(_e, t[0].tzOffset),
            (!Ae || 1 & e) && Me !== (Me = t[0].tzOffset + "") && W(ke, Me);
          const s = {};
          2 & e && (s.errors = t[1]), je.$set(s);
        },
        i(t) {
          Ae ||
            (ct(y.$$.fragment, t),
            ct(q.$$.fragment, t),
            ct(B.$$.fragment, t),
            ct($e.$$.fragment, t),
            ct(je.$$.fragment, t),
            (Ae = !0));
        },
        o(t) {
          ft(y.$$.fragment, t),
            ft(q.$$.fragment, t),
            ft(B.$$.fragment, t),
            ft($e.$$.fragment, t),
            ft(je.$$.fragment, t),
            (Ae = !1);
        },
        d(t) {
          t && w(e), ht(y), ht(q), ht(B), ht($e), ht(je), (Re = !1), o(De);
        },
      }
    );
  }
  function zo(t, e, n) {
    let r;
    l(t, be, (t) => n(22, (r = t)));
    let o = Object.assign({}, r),
      i = {};
    return [
      o,
      i,
      (t) => () => {
        const e = qo(o, t);
        n(1, (i = e.getErrors()));
      },
      () => {
        const t = qo(o);
        t.hasErrors()
          ? n(1, (i = t.getErrors()))
          : (n(1, (i = {})),
            c(be, (r = Object.assign(Object.assign({}, r), o)), r));
      },
      () => {
        n(0, (o = Object.assign({}, ye))), n(1, (i = {}));
      },
      () => {
        n(0, (o.textColor = "#333333"), o),
          n(0, (o.bgColor = "#f4f4f4"), o),
          n(0, (o.fillColor = "#b4c0be"), o),
          n(0, (o.goodColor = "#59c273"), o),
          n(0, (o.warnColor = "#fbb623"), o),
          n(0, (o.alertColor = "#ff00aa"), o);
      },
      () => {
        n(0, (o.textColor = "#ffffff"), o),
          n(0, (o.bgColor = "#232629"), o),
          n(0, (o.fillColor = "#747474"), o),
          n(0, (o.goodColor = "#59c273"), o),
          n(0, (o.warnColor = "#fcbd4b"), o),
          n(0, (o.alertColor = "#d94353"), o);
      },
      function () {
        (o.targetApprentice = T(this.value)), n(0, o);
      },
      function () {
        (o.newRWeight = T(this.value)), n(0, o);
      },
      function () {
        (o.newKWeight = T(this.value)), n(0, o);
      },
      function () {
        (o.newVWeight = T(this.value)), n(0, o);
      },
      function () {
        (o.targetSpeed = T(this.value)), n(0, o);
      },
      function () {
        (o.targetRevDay = T(this.value)), n(0, o);
      },
      function () {
        (o.position = (function (t) {
          const e = t.querySelector(":checked") || t.options[0];
          return e && e.__value;
        })(this)),
          n(0, o);
      },
      function () {
        (o.textColor = this.value), n(0, o);
      },
      function () {
        (o.bgColor = this.value), n(0, o);
      },
      function () {
        (o.fillColor = this.value), n(0, o);
      },
      function () {
        (o.goodColor = this.value), n(0, o);
      },
      function () {
        (o.warnColor = this.value), n(0, o);
      },
      function () {
        (o.alertColor = this.value), n(0, o);
      },
      function () {
        (o.madCutoff = T(this.value)), n(0, o);
      },
      function () {
        (o.tzOffset = T(this.value)), n(0, o);
      },
    ];
  }
  class Io extends bt {
    constructor(t) {
      super(), yt(this, t, zo, Po, s, {});
    }
  }
  function Mo(e) {
    let n, r, o;
    return {
      c() {
        (n = C("button")),
          (n.innerHTML =
            '<svg width="24px" height="24px" id="beea6ffe-a105-470c-9273-c0dac16a9de6" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><rect x="0.4" y="1.8" width="10.8" height="15.8" style="fill: #fff;stroke: #000;stroke-linecap: round;stroke-linejoin: round;stroke-width: 1.75px"></rect><rect x="2.5" y="3.9" width="10.8" height="15.8" style="fill: #fff;stroke: #000;stroke-linecap: round;stroke-linejoin: round;stroke-width: 1.75px"></rect><g><rect x="8.1" y="3.4" width="10.8" height="15.8" transform="translate(-5.3 1.3) rotate(-12.8)" style="fill: #fff;stroke: #000;stroke-linecap: round;stroke-linejoin: round;stroke-width: 1.75px"></rect><path d="M17.5,8.8l-3.8.9c1.2,2.2,2.8,3.7,5.1,4a2.5,2.5,0,0,0-.4.7c-2.2-.4-3.8-1.8-5.1-4a6.7,6.7,0,0,1-2.9,5.8l-.6-.4a6.2,6.2,0,0,0,2.8-5.9l-3.8.9v-.7l3.9-.9c-.2-1-.4-2-.6-2.8l1-.2-.2.2c.1.8.3,1.7.4,2.7l4.1-.9Z" transform="translate(-3.1 -2)"></path></g></g></svg>'),
          F(n, "class", "quiz-button svelte-7dsgmq");
      },
      m(t, i) {
        $(t, n, i), r || ((o = E(n, "click", e[0])), (r = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && w(n), (r = !1), o();
      },
    };
  }
  function Vo(t) {
    return [
      function (e) {
        H.call(this, t, e);
      },
    ];
  }
  class Bo extends bt {
    constructor(t) {
      super(), yt(this, t, Vo, Mo, s, {});
    }
  }
  function Lo(e) {
    let n, r, o;
    return {
      c() {
        (n = C("button")),
          (n.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19.43 12.98c.04-.32.07-.64.07-.98\n      0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06\n      0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18\n      14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38\n      2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17\n      0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11\n      1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11\n      1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0\n      .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38\n      2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59\n      1.69-.98l2.49 1c.06.02.12.03.18.03.17 0\n      .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73\n      0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7\n      1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2\n      1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21\n      1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21\n      1.27.51 1.04.42.9-.68c.43-.32.84-.56\n      1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13\n      1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7\n      1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79\n      4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></svg>'),
          F(n, "aria-label", "settings"),
          F(n, "class", "settings svelte-botxmp");
      },
      m(t, i) {
        $(t, n, i), r || ((o = E(n, "click", e[0])), (r = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && w(n), (r = !1), o();
      },
    };
  }
  function Ko(t) {
    return [
      function (e) {
        H.call(this, t, e);
      },
    ];
  }
  class Ho extends bt {
    constructor(t) {
      super(), yt(this, t, Ko, Lo, s, {});
    }
  }
  const Uo = (t, e) =>
      t.getDate() === e.getDate() &&
      t.getMonth() === e.getMonth() &&
      t.getFullYear() === e.getFullYear(),
    Go = (t) => {
      if (0 === t.length) return 0;
      const e = t.slice().sort((t, e) => t - e),
        n = Math.floor(e.length / 2);
      return e.length % 2 ? e[n] : (e[n - 1] + e[n]) / 2;
    },
    Xo = (t) => {
      if (0 === t.length) return [];
      const e = ((t) => {
          const e = t.map((t) => t.duration),
            n = Math.min(...e);
          if ((Math.max(...e), n > 6e5)) return e.map((t, e) => e);
          {
            const n = Go(e),
              r = t.map((t) => Math.abs(t.duration - n)),
              o = 1.4826,
              i = Go(r) * o,
              s = r.map((t) =>
                i > 0 ? Math.abs(t - n) / i : Math.abs(t - n) / n
              ),
              a = 10,
              l = s[s.length - 1] > a ? s : [...s.slice(0, -1), 999999],
              u = t.map((t, e) => e),
              c = u.filter((t, e) => l[e] > a);
            return c;
          }
        })(t),
        n = [0, ...e.map((t) => t + 1)].slice(0, -1),
        r = e.map((e, r) => ({ reviews: t.slice(n[r], e + 1) }));
      return r.map((t) => ({
        questions: t.reviews.reduce((t, e) => t + e.questions, 0),
        reading_incorrect: t.reviews.reduce(
          (t, e) => t + e.reading_incorrect,
          0
        ),
        meaning_incorrect: t.reviews.reduce(
          (t, e) => t + e.meaning_incorrect,
          0
        ),
        startTime: t.reviews[0].started,
        endTime: t.reviews[t.reviews.length - 1].started,
        reviews: t.reviews,
      }));
    },
    Jo = (t) => ({
      subject_id: t.data.subject_id,
      started: new Date(t.data.created_at),
      duration: 0,
      reading_incorrect: +t.data.incorrect_reading_answers,
      meaning_incorrect: +t.data.incorrect_meaning_answers,
      questions: 0,
    }),
    Yo = (t, e, n) => {
      if (n[e + 1]) {
        const r = n[e + 1].started.getTime(),
          o = t.started.getTime();
        if (r < o) throw "Reviews not in sequential creation order!";
        return Object.assign(Object.assign({}, t), { duration: r - o });
      }
      return t;
    },
    Zo = async (t) => {
      if (!(null == t ? void 0 : t.length)) return [];
      const e = t.map(Jo).map(Yo),
        n = await (async (t) => {
          let e = t.slice();
          for (let t of e) {
            const e = await we(+t.subject_id);
            (t.questions = "radical" === e.object ? 1 : 2),
              (t.questions += t.meaning_incorrect + t.reading_incorrect);
          }
          return e;
        })(e);
      let r = n.slice(0, -1).map((t) => t.duration),
        o = Go(r);
      return n.length && (n[n.length - 1].duration = o), n;
    },
    Qo = async (t) => {
      const e = ((t = 0) => {
        const e = new Date();
        let n,
          r =
            e.getTime() -
            3600 * e.getHours() * 1e3 -
            60 * e.getMinutes() * 1e3 -
            1e3 * e.getSeconds() -
            e.getMilliseconds();
        return (
          (n = t > 1 ? new Date(r - 24 * (t - 1) * 3600 * 1e3) : new Date(r)), n
        );
      })(t);
      wkof.include("Apiv2"), await wkof.ready("Apiv2");
      const n = await wkof.Apiv2.fetch_endpoint("reviews", {
        last_update: e.toISOString(),
      });
      return Zo(null == n ? void 0 : n.data);
    };
  function ti(t, { delay: n = 0, duration: r = 400, easing: o = e } = {}) {
    const i = +getComputedStyle(t).opacity;
    return {
      delay: n,
      duration: r,
      easing: o,
      css: (t) => "opacity: " + t * i,
    };
  }
  const ei = /[a-zA-Z]/,
    ni = (t, e = 0) => [...Array(t).keys()].map((t) => t + e);
  function ri(t, e, n) {
    const r = t.slice();
    return (r[6] = e[n]), r;
  }
  function oi(t) {
    let e;
    return {
      c() {
        (e = C("div")),
          F(e, "class", "dot svelte-14w6xk7"),
          R(e, "--dotSize", 0.25 * +t[3] + t[1]),
          R(e, "--color", t[0]),
          R(e, "animation-delay", t[6] * (+t[5] / 10) + t[4]);
      },
      m(t, n) {
        $(t, e, n);
      },
      p(t, n) {
        10 & n && R(e, "--dotSize", 0.25 * +t[3] + t[1]),
          1 & n && R(e, "--color", t[0]);
      },
      d(t) {
        t && w(e);
      },
    };
  }
  function ii(e) {
    let n,
      r = ni(3, 1),
      o = [];
    for (let t = 0; t < r.length; t += 1) o[t] = oi(ri(e, r, t));
    return {
      c() {
        n = C("div");
        for (let t = 0; t < o.length; t += 1) o[t].c();
        F(n, "class", "wrapper svelte-14w6xk7"),
          R(n, "--size", e[3] + e[1]),
          R(n, "--duration", e[2]);
      },
      m(t, e) {
        $(t, n, e);
        for (let t = 0; t < o.length; t += 1) o[t].m(n, null);
      },
      p(t, [e]) {
        if (59 & e) {
          let i;
          for (r = ni(3, 1), i = 0; i < r.length; i += 1) {
            const s = ri(t, r, i);
            o[i] ? o[i].p(s, e) : ((o[i] = oi(s)), o[i].c(), o[i].m(n, null));
          }
          for (; i < o.length; i += 1) o[i].d(1);
          o.length = r.length;
        }
        10 & e && R(n, "--size", t[3] + t[1]),
          4 & e && R(n, "--duration", t[2]);
      },
      i: t,
      o: t,
      d(t) {
        t && w(n), x(o, t);
      },
    };
  }
  function si(t, e, n) {
    let { color: r = "#FF3E00" } = e,
      { unit: o = "px" } = e,
      { duration: i = "0.6s" } = e,
      { size: s = "60" } = e,
      a = i.match(ei)[0],
      l = i.replace(ei, "");
    return (
      (t.$$set = (t) => {
        "color" in t && n(0, (r = t.color)),
          "unit" in t && n(1, (o = t.unit)),
          "duration" in t && n(2, (i = t.duration)),
          "size" in t && n(3, (s = t.size));
      }),
      [r, o, i, s, a, l]
    );
  }
  class ai extends bt {
    constructor(t) {
      super(),
        yt(this, t, si, ii, s, { color: 0, unit: 1, duration: 2, size: 3 });
    }
  }
  function li(t) {
    let e, n, r, o;
    return (
      (n = new ai({ props: { size: "25", unit: "px" } })),
      {
        c() {
          (e = C("div")),
            gt(n.$$.fragment),
            F(e, "class", "spinner svelte-zdyued");
        },
        m(t, r) {
          $(t, e, r), mt(n, e, null), (o = !0);
        },
        i(t) {
          o ||
            (ct(n.$$.fragment, t),
            Q(() => {
              r || (r = pt(e, ti, {}, !0)), r.run(1);
            }),
            (o = !0));
        },
        o(t) {
          ft(n.$$.fragment, t),
            r || (r = pt(e, ti, {}, !1)),
            r.run(0),
            (o = !1);
        },
        d(t) {
          t && w(e), ht(n), t && r && r.end();
        },
      }
    );
  }
  function ui(e) {
    let n, r;
    return (
      (n = new Bo({})),
      n.$on("click", e[5]),
      {
        c() {
          gt(n.$$.fragment);
        },
        m(t, e) {
          mt(n, t, e), (r = !0);
        },
        p: t,
        i(t) {
          r || (ct(n.$$.fragment, t), (r = !0));
        },
        o(t) {
          ft(n.$$.fragment, t), (r = !1);
        },
        d(t) {
          ht(n, t);
        },
      }
    );
  }
  function ci(t) {
    let e, n;
    return (
      (e = new Io({})),
      {
        c() {
          gt(e.$$.fragment);
        },
        m(t, r) {
          mt(e, t, r), (n = !0);
        },
        i(t) {
          n || (ct(e.$$.fragment, t), (n = !0));
        },
        o(t) {
          ft(e.$$.fragment, t), (n = !1);
        },
        d(t) {
          ht(e, t);
        },
      }
    );
  }
  function fi(t) {
    let e,
      n,
      r,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      d,
      p,
      g,
      m,
      h,
      y,
      b,
      x,
      _,
      N,
      k,
      O,
      T,
      W,
      A,
      R,
      D = t[1] && li();
    function P(e) {
      t[8](e);
    }
    let z = { float: !0, pips: !0, suffix: t[3], min: 1, max: 7 };
    void 0 !== t[0] && (z.values = t[0]),
      (c = new te({ props: z })),
      G.push(() =>
        (function (t, e, n) {
          const r = t.$$.props[e];
          void 0 !== r && ((t.$$.bound[r] = n), n(t.$$.ctx[r]));
        })(c, "values", P)
      );
    let I = t[2] && ui(t);
    return (
      (m = new Ho({})),
      m.$on("click", t[9]),
      (b = new ke({})),
      (_ = new Ae({})),
      (k = new Je({})),
      (T = new nn({
        props: { $$slots: { default: [ci] }, $$scope: { ctx: t } },
      })),
      {
        c() {
          (e = C("div")),
            (n = C("nav")),
            (r = C("li")),
            (r.textContent = "Graphs"),
            (i = S()),
            (s = C("li")),
            (s.textContent = "Data"),
            (a = S()),
            D && D.c(),
            (l = S()),
            (u = C("div")),
            gt(c.$$.fragment),
            (d = S()),
            (p = C("div")),
            I && I.c(),
            (g = S()),
            gt(m.$$.fragment),
            (h = S()),
            (y = C("div")),
            gt(b.$$.fragment),
            (x = S()),
            gt(_.$$.fragment),
            (N = S()),
            gt(k.$$.fragment),
            (O = S()),
            gt(T.$$.fragment),
            F(r, "class", "svelte-zdyued"),
            q(r, "active", "chart" === t[4]),
            F(s, "class", "svelte-zdyued"),
            q(s, "active", "data" === t[4]),
            F(n, "class", "chart-data-nav svelte-zdyued"),
            F(u, "class", "dayRange svelte-zdyued"),
            F(u, "data-testid", "daySlider"),
            F(p, "class", "action-buttons svelte-zdyued"),
            F(e, "class", "controls svelte-zdyued"),
            F(y, "data-testid", "gbwidgets"),
            F(y, "class", "gbwidgets svelte-zdyued");
        },
        m(o, f) {
          $(o, e, f),
            v(e, n),
            v(n, r),
            v(n, i),
            v(n, s),
            v(e, a),
            D && D.m(e, null),
            v(e, l),
            v(e, u),
            mt(c, u, null),
            v(e, d),
            v(e, p),
            I && I.m(p, null),
            v(p, g),
            mt(m, p, null),
            $(o, h, f),
            $(o, y, f),
            mt(b, y, null),
            v(y, x),
            mt(_, y, null),
            v(y, N),
            mt(k, y, null),
            $(o, O, f),
            mt(T, o, f),
            (W = !0),
            A ||
              ((R = [E(r, "click", j(t[6])), E(s, "click", j(t[7]))]),
              (A = !0));
        },
        p(t, [n]) {
          16 & n && q(r, "active", "chart" === t[4]),
            16 & n && q(s, "active", "data" === t[4]),
            t[1]
              ? D
                ? 2 & n && ct(D, 1)
                : ((D = li()), D.c(), ct(D, 1), D.m(e, l))
              : D &&
                (lt(),
                ft(D, 1, 1, () => {
                  D = null;
                }),
                ut());
          const o = {};
          8 & n && (o.suffix = t[3]),
            !f &&
              1 & n &&
              ((f = !0),
              (o.values = t[0]),
              (function (t) {
                J.push(t);
              })(() => (f = !1))),
            c.$set(o),
            t[2]
              ? I
                ? (I.p(t, n), 4 & n && ct(I, 1))
                : ((I = ui(t)), I.c(), ct(I, 1), I.m(p, g))
              : I &&
                (lt(),
                ft(I, 1, 1, () => {
                  I = null;
                }),
                ut());
          const i = {};
          8192 & n && (i.$$scope = { dirty: n, ctx: t }), T.$set(i);
        },
        i(t) {
          W ||
            (ct(D),
            ct(c.$$.fragment, t),
            ct(I),
            ct(m.$$.fragment, t),
            ct(b.$$.fragment, t),
            ct(_.$$.fragment, t),
            ct(k.$$.fragment, t),
            ct(T.$$.fragment, t),
            (W = !0));
        },
        o(t) {
          ft(D),
            ft(c.$$.fragment, t),
            ft(I),
            ft(m.$$.fragment, t),
            ft(b.$$.fragment, t),
            ft(_.$$.fragment, t),
            ft(k.$$.fragment, t),
            ft(T.$$.fragment, t),
            (W = !1);
        },
        d(t) {
          t && w(e),
            D && D.d(),
            ht(c),
            I && I.d(),
            ht(m),
            t && w(h),
            t && w(y),
            ht(b),
            ht(_),
            ht(k),
            t && w(O),
            ht(T, t),
            (A = !1),
            o(R);
        },
      }
    );
  }
  function di(t, e, n) {
    let r, o, i, s, a;
    l(t, ce, (t) => n(0, (o = t))),
      l(t, me, (t) => n(10, (i = t))),
      l(t, ve, (t) => n(11, (s = t))),
      l(t, le, (t) => n(4, (a = t)));
    let u = !1;
    const f = async (t) => {
      let e;
      n(1, (u = !0));
      try {
        e = await Qo(t);
      } catch (t) {
        console.warn(t);
      }
      c(
        ve,
        (s = ((t) => {
          const e = t
            .filter((e, n) => !(n > 0 && Uo(e.started, t[n - 1].started)))
            .map((t) => t.started)
            .map((e) => t.filter((t) => Uo(t.started, e)));
          let n = [];
          return (
            e.forEach((t, e) => {
              const r = t
                  .filter((t) => 0 === t.reading_incorrect)
                  .reduce((t, e) => t + 1, 0),
                o = t
                  .filter((t) => 0 === t.meaning_incorrect)
                  .reduce((t, e) => t + 1, 0),
                i = t
                  .filter(
                    (t) => t.meaning_incorrect + t.reading_incorrect === 0
                  )
                  .reduce((t, e) => t + 1, 0),
                s = t.reduce((t, e) => t + e.questions, 0),
                a = t.length,
                l = {
                  start: t[0].started,
                  end: t[t.length - 1].started,
                  review_count: t.length,
                  question_count: s,
                  accuracy: i / a,
                  reading_accuracy: r / a,
                  meaning_accuracy: o / a,
                };
              n.push(l);
            }),
            n
          );
        })(e)),
        s
      ),
        c(
          me,
          (i = ((t) => {
            const e = Xo(t);
            let n = [];
            return (
              e.forEach((t) => {
                const e = t.reviews.reduce((t, e) => t + e.questions, 0),
                  r = t.reviews.reduce(
                    (t, e) => t + (e.meaning_incorrect + e.reading_incorrect),
                    0
                  ),
                  o = e - r,
                  i = {
                    start: t.startTime,
                    end: t.endTime,
                    reviewCount: t.reviews.length,
                    questionCount: e,
                    correctAnswerCount: o,
                  };
                n.push(i);
              }),
              n
            );
          })(e)),
          i
        ),
        n(1, (u = !1));
    };
    let d = !1;
    wkof.wait_state("ss_quiz", "ready").then(() => {
      "function" ==
        typeof (null === ss_quiz || void 0 === ss_quiz
          ? void 0
          : ss_quiz.open) && n(2, (d = !0));
    });
    return (
      (t.$$.update = () => {
        1 & t.$$.dirty && f(o[0]),
          1 & t.$$.dirty && n(3, (r = o[0] > 1 ? " days" : " day"));
      }),
      [
        o,
        u,
        d,
        r,
        a,
        async () => {
          await wkof.wait_state("ss_quiz", "ready"),
            ss_quiz.open({
              ipreset: {
                name: "New Kanji",
                content: {
                  wk_items: {
                    enabled: !0,
                    filters: {
                      srs: { enabled: !0, value: { appr1: !0, appr2: !0 } },
                      item_type: { enabled: !0, value: "kan" },
                    },
                  },
                },
              },
            });
        },
        () => c(le, (a = "chart"), a),
        () => c(le, (a = "data"), a),
        function (t) {
          (o = t), ce.set(o);
        },
        () =>
          (function (t = "") {
            return Qe[t];
          })().open(),
      ]
    );
  }
  class pi extends bt {
    constructor(t) {
      super(), yt(this, t, di, fi, s, {});
    }
  }
  function gi(e) {
    let n;
    return {
      c() {
        (n = C("div")),
          (n.innerHTML =
            '<h2>GanbarOmeter</h2>   \n    <p>The GanbarOmeter needs the Wankani Open Framework to be installed prior to use.</p>  \n    \n    <p>Please refer to the <a href="http://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549">WKOF\n    installation instructions.</a></p>'),
          F(n, "class", "placeholder svelte-1qlmed2");
      },
      m(t, e) {
        $(t, n, e);
      },
      i: t,
      o: t,
      d(t) {
        t && w(n);
      },
    };
  }
  function mi(t) {
    let e, n;
    return (
      (e = new pi({})),
      {
        c() {
          gt(e.$$.fragment);
        },
        m(t, r) {
          mt(e, t, r), (n = !0);
        },
        i(t) {
          n || (ct(e.$$.fragment, t), (n = !0));
        },
        o(t) {
          ft(e.$$.fragment, t), (n = !1);
        },
        d(t) {
          ht(e, t);
        },
      }
    );
  }
  function hi(e) {
    let n, r, o, i;
    const s = [mi, gi],
      a = [];
    return (
      (r = (function (t, e) {
        return t[0] ? 0 : 1;
      })(e)),
      (o = a[r] = s[r](e)),
      {
        c() {
          (n = C("section")),
            o.c(),
            F(n, "data-testid", "ganbarometer"),
            F(n, "class", "svelte-1qlmed2");
        },
        m(t, e) {
          $(t, n, e), a[r].m(n, null), (i = !0);
        },
        p: t,
        i(t) {
          i || (ct(o), (i = !0));
        },
        o(t) {
          ft(o), (i = !1);
        },
        d(t) {
          t && w(n), a[r].d();
        },
      }
    );
  }
  function vi(t) {
    return [!!wkof];
  }
  let yi;
  be.subscribe((t) => (yi = t.position));
  const bi = document.querySelector(".dashboard .span12");
  let $i = { target: bi, anchor: null };
  switch (yi) {
    case "Top":
      $i.anchor = bi.querySelector(".progress-and-forecast");
      break;
    case "Below Forecast":
      $i.anchor = bi.querySelector(".srs-progress");
      break;
    case "Below SRS":
      $i.anchor = bi.querySelector(".row");
      break;
    case "Below Panels":
      $i.anchor = bi.querySelector(".row:last-of-type");
      break;
    default:
      $i.anchor = null;
  }
  const wi = new (class extends bt {
    constructor(t) {
      super(), yt(this, t, vi, hi, s, {});
    }
  })($i);
  return wi;
})();
//# sourceMappingURL=bundle.js.map
