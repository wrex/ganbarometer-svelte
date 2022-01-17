// ==UserScript==
// @name        ganbarometer-svelte
// @description The GanbarOmeter (Wanikani dashboard widgets)
// @namespace   https://github.com/wrex/
// @version     4.0.9
// @homepage    https://github.com/wrex/ganbarometer-svelte#readme
// @author      Rex Walters -- rw [at] pobox.com
// @license     MIT-0
// @resource    css https://github.com/wrex/ganbarometer-svelte/raw/v4.0/published/v4/bundle.css
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @connect     github.com
// @run-at      document-idle
// @downloadURL https://github.com/wrex/ganbarometer-svelte/raw/v4.0/published/v4/bundle.user.js
// @updateURL   https://github.com/wrex/ganbarometer-svelte/raw/v4.0/published/v4/bundle.user.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==
GM_addStyle(GM_getResourceText("css"));
var app = (function () {
  "use strict";
  function e() {}
  const t = (e) => e;
  function n(e, t) {
    for (const n in t) e[n] = t[n];
    return e;
  }
  function s(e) {
    return e();
  }
  function a() {
    return Object.create(null);
  }
  function l(e) {
    e.forEach(s);
  }
  function r(e) {
    return "function" == typeof e;
  }
  function o(e, t) {
    return e != e
      ? t == t
      : e !== t || (e && "object" == typeof e) || "function" == typeof e;
  }
  function i(t, ...n) {
    if (null == t) return e;
    const s = t.subscribe(...n);
    return s.unsubscribe ? () => s.unsubscribe() : s;
  }
  function c(e) {
    let t;
    return i(e, (e) => (t = e))(), t;
  }
  function u(e, t, n) {
    e.$$.on_destroy.push(i(t, n));
  }
  function d(e, t, s, a) {
    return e[1] && a ? n(s.ctx.slice(), e[1](a(t))) : s.ctx;
  }
  function p(e) {
    const t = {};
    for (const n in e) "$" !== n[0] && (t[n] = e[n]);
    return t;
  }
  function h(e) {
    return null == e ? "" : e;
  }
  function m(e, t, n) {
    return e.set(n), t;
  }
  const g = "undefined" != typeof window;
  let f = g ? () => window.performance.now() : () => Date.now(),
    v = g ? (e) => requestAnimationFrame(e) : e;
  const y = new Set();
  function w(e) {
    y.forEach((t) => {
      t.c(e) || (y.delete(t), t.f());
    }),
      0 !== y.size && v(w);
  }
  function $(e) {
    let t;
    return (
      0 === y.size && v(w),
      {
        promise: new Promise((n) => {
          y.add((t = { c: e, f: n }));
        }),
        abort() {
          y.delete(t);
        },
      }
    );
  }
  function b(e, t) {
    e.appendChild(t);
  }
  function x(e) {
    if (!e) return document;
    const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
    return t && t.host ? t : e.ownerDocument;
  }
  function k(e) {
    const t = M("style");
    return (
      (function (e, t) {
        b(e.head || e, t);
      })(x(e), t),
      t
    );
  }
  function C(e, t, n) {
    e.insertBefore(t, n || null);
  }
  function T(e) {
    e.parentNode.removeChild(e);
  }
  function S(e, t) {
    for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t);
  }
  function M(e) {
    return document.createElement(e);
  }
  function q(e) {
    return document.createElementNS("http://www.w3.org/2000/svg", e);
  }
  function _(e) {
    return document.createTextNode(e);
  }
  function j() {
    return _(" ");
  }
  function z() {
    return _("");
  }
  function I(e, t, n, s) {
    return e.addEventListener(t, n, s), () => e.removeEventListener(t, n, s);
  }
  function L(e) {
    return function (t) {
      return t.preventDefault(), e.call(this, t);
    };
  }
  function H(e) {
    return function (t) {
      return t.stopPropagation(), e.call(this, t);
    };
  }
  function F(e, t, n) {
    null == n
      ? e.removeAttribute(t)
      : e.getAttribute(t) !== n && e.setAttribute(t, n);
  }
  function R(e, t) {
    (t = "" + t), e.wholeText !== t && (e.data = t);
  }
  function W(e, t) {
    e.value = null == t ? "" : t;
  }
  function A(e, t, n, s) {
    e.style.setProperty(t, n, s ? "important" : "");
  }
  function O(e, t) {
    for (let n = 0; n < e.options.length; n += 1) {
      const s = e.options[n];
      if (s.__value === t) return void (s.selected = !0);
    }
    e.selectedIndex = -1;
  }
  function D(e, t, n) {
    e.classList[n ? "add" : "remove"](t);
  }
  function Q(e, t, n = !1) {
    const s = document.createEvent("CustomEvent");
    return s.initCustomEvent(e, n, !1, t), s;
  }
  const E = new Set();
  let G,
    N = 0;
  function P(e, t, n, s, a, l, r, o = 0) {
    const i = 16.666 / s;
    let c = "{\n";
    for (let e = 0; e <= 1; e += i) {
      const s = t + (n - t) * l(e);
      c += 100 * e + `%{${r(s, 1 - s)}}\n`;
    }
    const u = c + `100% {${r(n, 1 - n)}}\n}`,
      d = `__svelte_${(function (e) {
        let t = 5381,
          n = e.length;
        for (; n--; ) t = ((t << 5) - t) ^ e.charCodeAt(n);
        return t >>> 0;
      })(u)}_${o}`,
      p = x(e);
    E.add(p);
    const h = p.__svelte_stylesheet || (p.__svelte_stylesheet = k(e).sheet),
      m = p.__svelte_rules || (p.__svelte_rules = {});
    m[d] ||
      ((m[d] = !0), h.insertRule(`@keyframes ${d} ${u}`, h.cssRules.length));
    const g = e.style.animation || "";
    return (
      (e.style.animation = `${
        g ? `${g}, ` : ""
      }${d} ${s}ms linear ${a}ms 1 both`),
      (N += 1),
      d
    );
  }
  function V(e, t) {
    const n = (e.style.animation || "").split(", "),
      s = n.filter(
        t ? (e) => e.indexOf(t) < 0 : (e) => -1 === e.indexOf("__svelte")
      ),
      a = n.length - s.length;
    a &&
      ((e.style.animation = s.join(", ")),
      (N -= a),
      N ||
        v(() => {
          N ||
            (E.forEach((e) => {
              const t = e.__svelte_stylesheet;
              let n = t.cssRules.length;
              for (; n--; ) t.deleteRule(n);
              e.__svelte_rules = {};
            }),
            E.clear());
        }));
  }
  function B(e) {
    G = e;
  }
  function Z() {
    if (!G) throw new Error("Function called outside component initialization");
    return G;
  }
  function Y() {
    const e = Z();
    return (t, n) => {
      const s = e.$$.callbacks[t];
      if (s) {
        const a = Q(t, n);
        s.slice().forEach((t) => {
          t.call(e, a);
        });
      }
    };
  }
  function K(e, t) {
    const n = e.$$.callbacks[t.type];
    n && n.slice().forEach((e) => e.call(this, t));
  }
  const U = [],
    J = [],
    X = [],
    ee = [],
    te = Promise.resolve();
  let ne = !1;
  function se() {
    ne || ((ne = !0), te.then(ue));
  }
  function ae() {
    return se(), te;
  }
  function le(e) {
    X.push(e);
  }
  function re(e) {
    ee.push(e);
  }
  const oe = new Set();
  let ie,
    ce = 0;
  function ue() {
    const e = G;
    do {
      for (; ce < U.length; ) {
        const e = U[ce];
        ce++, B(e), de(e.$$);
      }
      for (B(null), U.length = 0, ce = 0; J.length; ) J.pop()();
      for (let e = 0; e < X.length; e += 1) {
        const t = X[e];
        oe.has(t) || (oe.add(t), t());
      }
      X.length = 0;
    } while (U.length);
    for (; ee.length; ) ee.pop()();
    (ne = !1), oe.clear(), B(e);
  }
  function de(e) {
    if (null !== e.fragment) {
      e.update(), l(e.before_update);
      const t = e.dirty;
      (e.dirty = [-1]),
        e.fragment && e.fragment.p(e.ctx, t),
        e.after_update.forEach(le);
    }
  }
  function pe() {
    return (
      ie ||
        ((ie = Promise.resolve()),
        ie.then(() => {
          ie = null;
        })),
      ie
    );
  }
  function he(e, t, n) {
    e.dispatchEvent(Q(`${t ? "intro" : "outro"}${n}`));
  }
  const me = new Set();
  let ge;
  function fe() {
    ge = { r: 0, c: [], p: ge };
  }
  function ve() {
    ge.r || l(ge.c), (ge = ge.p);
  }
  function ye(e, t) {
    e && e.i && (me.delete(e), e.i(t));
  }
  function we(e, t, n, s) {
    if (e && e.o) {
      if (me.has(e)) return;
      me.add(e),
        ge.c.push(() => {
          me.delete(e), s && (n && e.d(1), s());
        }),
        e.o(t);
    }
  }
  const $e = { duration: 0 };
  function be(n, s, a) {
    let l,
      o,
      i = s(n, a),
      c = !1,
      u = 0;
    function d() {
      l && V(n, l);
    }
    function p() {
      const {
        delay: s = 0,
        duration: a = 300,
        easing: r = t,
        tick: p = e,
        css: h,
      } = i || $e;
      h && (l = P(n, 0, 1, a, s, r, h, u++)), p(0, 1);
      const m = f() + s,
        g = m + a;
      o && o.abort(),
        (c = !0),
        le(() => he(n, !0, "start")),
        (o = $((e) => {
          if (c) {
            if (e >= g) return p(1, 0), he(n, !0, "end"), d(), (c = !1);
            if (e >= m) {
              const t = r((e - m) / a);
              p(t, 1 - t);
            }
          }
          return c;
        }));
    }
    let h = !1;
    return {
      start() {
        h || ((h = !0), V(n), r(i) ? ((i = i()), pe().then(p)) : p());
      },
      invalidate() {
        h = !1;
      },
      end() {
        c && (d(), (c = !1));
      },
    };
  }
  function xe(n, s, a, o) {
    let i = s(n, a),
      c = o ? 0 : 1,
      u = null,
      d = null,
      p = null;
    function h() {
      p && V(n, p);
    }
    function m(e, t) {
      const n = e.b - c;
      return (
        (t *= Math.abs(n)),
        {
          a: c,
          b: e.b,
          d: n,
          duration: t,
          start: e.start,
          end: e.start + t,
          group: e.group,
        }
      );
    }
    function g(s) {
      const {
          delay: a = 0,
          duration: r = 300,
          easing: o = t,
          tick: g = e,
          css: v,
        } = i || $e,
        y = { start: f() + a, b: s };
      s || ((y.group = ge), (ge.r += 1)),
        u || d
          ? (d = y)
          : (v && (h(), (p = P(n, c, s, r, a, o, v))),
            s && g(0, 1),
            (u = m(y, r)),
            le(() => he(n, s, "start")),
            $((e) => {
              if (
                (d &&
                  e > d.start &&
                  ((u = m(d, r)),
                  (d = null),
                  he(n, u.b, "start"),
                  v && (h(), (p = P(n, c, u.b, u.duration, 0, o, i.css)))),
                u)
              )
                if (e >= u.end)
                  g((c = u.b), 1 - c),
                    he(n, u.b, "end"),
                    d || (u.b ? h() : --u.group.r || l(u.group.c)),
                    (u = null);
                else if (e >= u.start) {
                  const t = e - u.start;
                  (c = u.a + u.d * o(t / u.duration)), g(c, 1 - c);
                }
              return !(!u && !d);
            }));
    }
    return {
      run(e) {
        r(i)
          ? pe().then(() => {
              (i = i()), g(e);
            })
          : g(e);
      },
      end() {
        h(), (u = d = null);
      },
    };
  }
  function ke(e, t, n) {
    const s = e.$$.props[t];
    void 0 !== s && ((e.$$.bound[s] = n), n(e.$$.ctx[s]));
  }
  function Ce(e) {
    e && e.c();
  }
  function Te(e, t, n, a) {
    const { fragment: o, on_mount: i, on_destroy: c, after_update: u } = e.$$;
    o && o.m(t, n),
      a ||
        le(() => {
          const t = i.map(s).filter(r);
          c ? c.push(...t) : l(t), (e.$$.on_mount = []);
        }),
      u.forEach(le);
  }
  function Se(e, t) {
    const n = e.$$;
    null !== n.fragment &&
      (l(n.on_destroy),
      n.fragment && n.fragment.d(t),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []));
  }
  function Me(t, n, s, r, o, i, c, u = [-1]) {
    const d = G;
    B(t);
    const p = (t.$$ = {
      fragment: null,
      ctx: null,
      props: i,
      update: e,
      not_equal: o,
      bound: a(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(n.context || (d ? d.$$.context : [])),
      callbacks: a(),
      dirty: u,
      skip_bound: !1,
      root: n.target || d.$$.root,
    });
    c && c(p.root);
    let h = !1;
    if (
      ((p.ctx = s
        ? s(t, n.props || {}, (e, n, ...s) => {
            const a = s.length ? s[0] : n;
            return (
              p.ctx &&
                o(p.ctx[e], (p.ctx[e] = a)) &&
                (!p.skip_bound && p.bound[e] && p.bound[e](a),
                h &&
                  (function (e, t) {
                    -1 === e.$$.dirty[0] &&
                      (U.push(e), se(), e.$$.dirty.fill(0)),
                      (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
                  })(t, e)),
              n
            );
          })
        : []),
      p.update(),
      (h = !0),
      l(p.before_update),
      (p.fragment = !!r && r(p.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const e = (function (e) {
          return Array.from(e.childNodes);
        })(n.target);
        p.fragment && p.fragment.l(e), e.forEach(T);
      } else p.fragment && p.fragment.c();
      n.intro && ye(t.$$.fragment),
        Te(t, n.target, n.anchor, n.customElement),
        ue();
    }
    B(d);
  }
  class qe {
    $destroy() {
      Se(this, 1), (this.$destroy = e);
    }
    $on(e, t) {
      const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
      return (
        n.push(t),
        () => {
          const e = n.indexOf(t);
          -1 !== e && n.splice(e, 1);
        }
      );
    }
    $set(e) {
      var t;
      this.$$set &&
        ((t = e), 0 !== Object.keys(t).length) &&
        ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
    }
  }
  function _e(e) {
    let t;
    return {
      c() {
        (t = M("div")), F(t, "class", "gauge__fill centerMark svelte-141x32p");
      },
      m(e, n) {
        C(e, t, n);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function je(e) {
    let t;
    return {
      c() {
        (t = M("div")), F(t, "class", "gauge__fill lowZone svelte-141x32p");
      },
      m(e, n) {
        C(e, t, n);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function ze(e) {
    let t;
    return {
      c() {
        (t = M("div")), F(t, "class", "gauge__fill hiZone svelte-141x32p");
      },
      m(e, n) {
        C(e, t, n);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Ie(e) {
    let t,
      n,
      s,
      a = (100 * e[0]).toFixed() + "";
    return {
      c() {
        (t = M("div")),
          (n = _(a)),
          (s = _("%")),
          F(t, "class", "gauge__cover svelte-141x32p");
      },
      m(e, a) {
        C(e, t, a), b(t, n), b(t, s);
      },
      p(e, t) {
        1 & t && a !== (a = (100 * e[0]).toFixed() + "") && R(n, a);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Le(e) {
    let t, n;
    return {
      c() {
        (t = M("div")),
          (n = _(e[1])),
          F(t, "class", "gauge__cover svelte-141x32p");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        2 & t && R(n, e[1]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function He(t) {
    let n,
      s,
      a,
      l,
      r,
      o,
      i,
      c = t[2] && _e(),
      u = t[3] && je(),
      d = t[4] && ze();
    function p(e, t) {
      return null !== e[1] ? Le : Ie;
    }
    let h = p(t),
      m = h(t);
    return {
      c() {
        (n = M("div")),
          (s = M("div")),
          (a = M("div")),
          (l = j()),
          c && c.c(),
          (r = j()),
          u && u.c(),
          (o = j()),
          d && d.c(),
          (i = j()),
          m.c(),
          F(a, "class", "gauge__fill svelte-141x32p"),
          F(a, "style", t[5]),
          D(a, "needle", t[2]),
          F(s, "class", "gauge__body svelte-141x32p"),
          F(n, "class", "gauge svelte-141x32p"),
          F(n, "data-testid", "gauge");
      },
      m(e, t) {
        C(e, n, t),
          b(n, s),
          b(s, a),
          b(s, l),
          c && c.m(s, null),
          b(s, r),
          u && u.m(s, null),
          b(s, o),
          d && d.m(s, null),
          b(s, i),
          m.m(s, null);
      },
      p(e, [t]) {
        32 & t && F(a, "style", e[5]),
          4 & t && D(a, "needle", e[2]),
          e[2]
            ? c || ((c = _e()), c.c(), c.m(s, r))
            : c && (c.d(1), (c = null)),
          e[3]
            ? u || ((u = je()), u.c(), u.m(s, o))
            : u && (u.d(1), (u = null)),
          e[4]
            ? d || ((d = ze()), d.c(), d.m(s, i))
            : d && (d.d(1), (d = null)),
          h === (h = p(e)) && m
            ? m.p(e, t)
            : (m.d(1), (m = h(e)), m && (m.c(), m.m(s, null)));
      },
      i: e,
      o: e,
      d(e) {
        e && T(n), c && c.d(), u && u.d(), d && d.d(), m.d();
      },
    };
  }
  function Fe(e, t, n) {
    let s,
      a,
      { value: l = 0.5 } = t,
      { label: r = null } = t,
      { needle: o = !1 } = t,
      { lowZone: i = !1 } = t,
      { hiZone: c = !1 } = t;
    return (
      (e.$$set = (e) => {
        "value" in e && n(0, (l = e.value)),
          "label" in e && n(1, (r = e.label)),
          "needle" in e && n(2, (o = e.needle)),
          "lowZone" in e && n(3, (i = e.lowZone)),
          "hiZone" in e && n(4, (c = e.hiZone));
      }),
      (e.$$.update = () => {
        1 & e.$$.dirty && n(6, (s = +l <= 0 ? 0.02 : +l >= 1 ? 0.98 : +l)),
          64 & e.$$.dirty &&
            n(5, (a = `transform: rotate(${(s / 2).toFixed(4)}turn)`));
      }),
      [l, r, o, i, c, a, s]
    );
  }
  class Re extends qe {
    constructor(e) {
      super(),
        Me(this, e, Fe, He, o, {
          value: 0,
          label: 1,
          needle: 2,
          lowZone: 3,
          hiZone: 4,
        });
    }
  }
  function We(e, { delay: n = 0, duration: s = 400, easing: a = t } = {}) {
    const l = +getComputedStyle(e).opacity;
    return {
      delay: n,
      duration: s,
      easing: a,
      css: (e) => "opacity: " + e * l,
    };
  }
  const Ae = [];
  function Oe(t, n = e) {
    let s;
    const a = new Set();
    function l(e) {
      if (o(t, e) && ((t = e), s)) {
        const e = !Ae.length;
        for (const e of a) e[1](), Ae.push(e, t);
        if (e) {
          for (let e = 0; e < Ae.length; e += 2) Ae[e][0](Ae[e + 1]);
          Ae.length = 0;
        }
      }
    }
    return {
      set: l,
      update: function (e) {
        l(e(t));
      },
      subscribe: function (r, o = e) {
        const i = [r, o];
        return (
          a.add(i),
          1 === a.size && (s = n(l) || e),
          r(t),
          () => {
            a.delete(i), 0 === a.size && (s(), (s = null));
          }
        );
      },
    };
  }
  var De;
  const Qe = "gbSettings",
    Ee = "4.0.9",
    Ge = Oe("chart"),
    Ne = {
      srsCounts: {
        expectedDaily: 0,
        new: { radicals: 0, kanji: 0, vocabulary: 0, total: 0 },
        apprentice: { early: 0, late: 0, total: 0 },
        lesson: 0,
        guru: 0,
        master: 0,
        enlightened: 0,
        burned: 0,
      },
      sessionSummaries: [],
      reviewCounts: [],
      gbSettings: {
        version: Ee,
        daysToReview: 4,
        position: "Top",
        bgColor: "#f4f4f4",
        trackColor: "#e0e0e0",
        textColor: "#333333",
        hlTextColor: "#fbb623",
        fillColor: "#59c273",
        warnColor: "#fbb623",
        hlTrackColor: "#d1e8d4",
        gbMinTarget: 130,
        gbMaxTarget: 170,
        aboveTerm: "休",
        belowTerm: "努力",
        inRangeTerm: "良",
        newRWeight: 0.6,
        newKWeight: 3,
        newVWeight: 1,
        apprWeight: 1,
        guruWeight: 0.1,
        masterWeight: 0,
        enlightenedWeight: 0,
        minQPM: 7,
        maxQPM: 10,
        madCutoff: 10,
        rpdMin: 120,
        rpdMax: 180,
        tzOffset: 0,
        rQuiz: !1,
        kQuiz: !0,
        vQuiz: !1,
      },
    },
    Pe = (e) =>
      JSON.parse(e).map((e) =>
        Object.assign(Object.assign({}, e), {
          start: new Date(e.start),
          end: new Date(e.end),
        })
      ),
    Ve = localStorage.getItem("srsCounts"),
    Be = Oe(Ve ? JSON.parse(Ve) : Ne.srsCounts);
  Be.subscribe((e) => {
    localStorage.setItem("srsCounts", JSON.stringify(e));
  });
  const Ze = localStorage.getItem("sessionSummaries"),
    Ye = Oe(Ze ? Pe(Ze) : Ne.sessionSummaries);
  Ye.subscribe((e) => {
    localStorage.setItem("sessionSummaries", JSON.stringify(e));
  });
  const Ke = localStorage.getItem("reviewCounts"),
    Ue = Oe(Ke ? Pe(Ke) : Ne.reviewCounts);
  Ue.subscribe((e) => {
    localStorage.setItem("reviewCounts", JSON.stringify(e));
  });
  const Je = Ne.gbSettings,
    Xe = (e) => {
      const t = e.version;
      ((e) => {
        var t;
        if (
          !(null === (t = null == e ? void 0 : e.version) || void 0 === t
            ? void 0
            : t.match(/^4\.0/))
        )
          return void et.set(Ne.gbSettings);
        let n = Ne.gbSettings;
        Object.keys(Ne.gbSettings).forEach((t) => {
          var s;
          n[t] = null !== (s = e[t]) && void 0 !== s ? s : Ne.gbSettings[t];
        }),
          (n.version = Ee),
          et.set(n);
      })(e),
        ((e) => {
          if (!e.match(/^4\.0/)) return void Be.set(Ne.srsCounts);
          const t = c(Be);
          let n = Ne.srsCounts;
          Object.keys(Ne.srsCounts).forEach((e) => {
            var s;
            n[e] = null !== (s = t[e]) && void 0 !== s ? s : Ne.srsCounts[e];
          }),
            Be.set(n);
        })(t),
        ((e) => {
          if (!e.match(/^4\.0/)) return void Ye.set(Ne.sessionSummaries);
          const t = c(Ye);
          let n = Ne.sessionSummaries;
          Object.keys(Ne.sessionSummaries).forEach((e) => {
            var s;
            n[e] =
              null !== (s = t[e]) && void 0 !== s ? s : Ne.sessionSummaries[e];
          }),
            Ye.set(n);
        })(t),
        ((e) => {
          if (!e.match(/^4\.0/)) return void Ue.set(Ne.reviewCounts);
          const t = c(Ue);
          let n = Ne.reviewCounts;
          Object.keys(Ne.reviewCounts).forEach((e) => {
            var s;
            n[e] = null !== (s = t[e]) && void 0 !== s ? s : Ne.reviewCounts[e];
          }),
            Ue.set(n);
        })(t);
    },
    et = Oe(
      null !== (De = JSON.parse(localStorage.getItem(Qe))) && void 0 !== De
        ? De
        : Je
    );
  et.subscribe((e) => {
    (null == e ? void 0 : e.version) === Ee
      ? localStorage.setItem(Qe, JSON.stringify(e))
      : Xe(e);
  });
  function tt(t) {
    let n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      I,
      L,
      H,
      W,
      A,
      O,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y,
      K,
      U,
      J,
      X,
      ee,
      te,
      ne,
      se,
      ae,
      re,
      oe,
      ie,
      ce,
      ue,
      de,
      pe,
      he,
      me = t[3].new.radicals + "",
      ge = t[3].new.kanji + "",
      fe = t[3].new.vocabulary + "",
      ve = t[3].apprentice.total + "",
      ye = t[3].apprentice.early + "",
      we = t[3].guru + "",
      $e = t[3].master + "",
      xe = t[3].enlightened + "",
      ke = t[0].toFixed() + "",
      Ce = t[2].gbMinTarget + "",
      Te = t[2].gbMaxTarget + "";
    return {
      c() {
        (n = M("h1")),
          (s = _("GanbarOmeter: ")),
          (a = _(t[5])),
          (r = j()),
          (o = M("div")),
          (i = M("table")),
          (c = M("tr")),
          (u = M("th")),
          (u.textContent = "Early Apprentice"),
          (d = j()),
          (p = M("td")),
          (h = _(me)),
          (m = M("span")),
          (m.textContent = "r"),
          (g = j()),
          (f = _(ge)),
          (v = M("span")),
          (v.textContent = "k"),
          (y = j()),
          (w = _(fe)),
          ($ = M("span")),
          ($.textContent = "v"),
          (x = j()),
          (k = M("tr")),
          (S = M("th")),
          (S.textContent = "Apprentice"),
          (q = j()),
          (z = M("td")),
          (I = _(ve)),
          (L = j()),
          (H = M("span")),
          (W = _("items\n            (")),
          (A = _(ye)),
          (O = _(" early-stage)")),
          (D = j()),
          (Q = M("tr")),
          (E = M("th")),
          (E.textContent = "Learned"),
          (G = j()),
          (N = M("td")),
          (P = _(we)),
          (V = M("span")),
          (V.textContent = "g"),
          (B = j()),
          (Z = _($e)),
          (Y = M("span")),
          (Y.textContent = "m"),
          (K = j()),
          (U = _(xe)),
          (J = M("span")),
          (J.textContent = "e"),
          (X = j()),
          (ee = M("tr")),
          (te = M("th")),
          (te.textContent = "Weighted count"),
          (ne = j()),
          (se = M("td")),
          (ae = _(ke)),
          (re = j()),
          (oe = M("span")),
          (ie = _("(target ")),
          (ce = _(Ce)),
          (ue = _("–")),
          (de = _(Te)),
          (pe = _(")")),
          F(n, "class", "gbHeader"),
          F(m, "class", "secondary"),
          F(v, "class", "secondary"),
          F($, "class", "secondary"),
          F(H, "class", "secondary"),
          F(V, "class", "secondary"),
          F(Y, "class", "secondary"),
          F(J, "class", "secondary"),
          F(oe, "class", "secondary"),
          F(i, "class", "gbContent"),
          F(o, "data-testid", "ganbarometer-table");
      },
      m(e, t) {
        C(e, n, t),
          b(n, s),
          b(n, a),
          C(e, r, t),
          C(e, o, t),
          b(o, i),
          b(i, c),
          b(c, u),
          b(c, d),
          b(c, p),
          b(p, h),
          b(p, m),
          b(p, g),
          b(p, f),
          b(p, v),
          b(p, y),
          b(p, w),
          b(p, $),
          b(i, x),
          b(i, k),
          b(k, S),
          b(k, q),
          b(k, z),
          b(z, I),
          b(z, L),
          b(z, H),
          b(H, W),
          b(H, A),
          b(H, O),
          b(i, D),
          b(i, Q),
          b(Q, E),
          b(Q, G),
          b(Q, N),
          b(N, P),
          b(N, V),
          b(N, B),
          b(N, Z),
          b(N, Y),
          b(N, K),
          b(N, U),
          b(N, J),
          b(i, X),
          b(i, ee),
          b(ee, te),
          b(ee, ne),
          b(ee, se),
          b(se, ae),
          b(se, re),
          b(se, oe),
          b(oe, ie),
          b(oe, ce),
          b(oe, ue),
          b(oe, de),
          b(oe, pe);
      },
      p(e, t) {
        32 & t && R(a, e[5]),
          8 & t && me !== (me = e[3].new.radicals + "") && R(h, me),
          8 & t && ge !== (ge = e[3].new.kanji + "") && R(f, ge),
          8 & t && fe !== (fe = e[3].new.vocabulary + "") && R(w, fe),
          8 & t && ve !== (ve = e[3].apprentice.total + "") && R(I, ve),
          8 & t && ye !== (ye = e[3].apprentice.early + "") && R(A, ye),
          8 & t && we !== (we = e[3].guru + "") && R(P, we),
          8 & t && $e !== ($e = e[3].master + "") && R(Z, $e),
          8 & t && xe !== (xe = e[3].enlightened + "") && R(U, xe),
          1 & t && ke !== (ke = e[0].toFixed() + "") && R(ae, ke),
          4 & t && Ce !== (Ce = e[2].gbMinTarget + "") && R(ce, Ce),
          4 & t && Te !== (Te = e[2].gbMaxTarget + "") && R(de, Te);
      },
      i(e) {
        l ||
          le(() => {
            (l = be(n, We, {})), l.start();
          }),
          he ||
            le(() => {
              (he = be(o, We, {})), he.start();
            });
      },
      o: e,
      d(e) {
        e && T(n), e && T(r), e && T(o);
      },
    };
  }
  function nt(e) {
    let t, n, s, a, l, r;
    return (
      (s = new Re({
        props: {
          value: e[1],
          label: e[4],
          needle: !0,
          lowZone: !0,
          hiZone: !0,
        },
      })),
      {
        c() {
          (t = M("h1")),
            (t.textContent = "GanbarOmeter"),
            (n = j()),
            Ce(s.$$.fragment),
            (a = j()),
            (l = M("div")),
            (l.innerHTML =
              '<span class="left-aligned svelte-1rtibr8">少</span><span class="right-aligned svelte-1rtibr8">多</span>'),
            F(t, "class", "gbHeader"),
            F(l, "class", "units svelte-1rtibr8");
        },
        m(e, o) {
          C(e, t, o), C(e, n, o), Te(s, e, o), C(e, a, o), C(e, l, o), (r = !0);
        },
        p(e, t) {
          const n = {};
          2 & t && (n.value = e[1]), 16 & t && (n.label = e[4]), s.$set(n);
        },
        i(e) {
          r || (ye(s.$$.fragment, e), (r = !0));
        },
        o(e) {
          we(s.$$.fragment, e), (r = !1);
        },
        d(e) {
          e && T(t), e && T(n), Se(s, e), e && T(a), e && T(l);
        },
      }
    );
  }
  function st(e) {
    let t, n, s, a;
    const l = [nt, tt],
      r = [];
    function o(e, t) {
      return "chart" === e[6] ? 0 : 1;
    }
    return (
      (n = o(e)),
      (s = r[n] = l[n](e)),
      {
        c() {
          (t = M("div")),
            s.c(),
            F(t, "class", "gbWidget"),
            A(t, "--trackColor", e[2].hlTrackColor),
            A(t, "--hlTrackColor", e[2].trackColor);
        },
        m(e, s) {
          C(e, t, s), r[n].m(t, null), (a = !0);
        },
        p(e, [i]) {
          let c = n;
          (n = o(e)),
            n === c
              ? r[n].p(e, i)
              : (fe(),
                we(r[c], 1, 1, () => {
                  r[c] = null;
                }),
                ve(),
                (s = r[n]),
                s ? s.p(e, i) : ((s = r[n] = l[n](e)), s.c()),
                ye(s, 1),
                s.m(t, null)),
            (!a || 4 & i) && A(t, "--trackColor", e[2].hlTrackColor),
            (!a || 4 & i) && A(t, "--hlTrackColor", e[2].trackColor);
        },
        i(e) {
          a || (ye(s), (a = !0));
        },
        o(e) {
          we(s), (a = !1);
        },
        d(e) {
          e && T(t), r[n].d();
        },
      }
    );
  }
  function at(e, t, n) {
    let s, a, l, r, o, i, c, d, p, h;
    u(e, et, (e) => n(2, (d = e))),
      u(e, Be, (e) => n(3, (p = e))),
      u(e, Ge, (e) => n(6, (h = e)));
    const m = (2 / 3) * 0.5;
    return (
      (e.$$.update = () => {
        12 & e.$$.dirty &&
          n(
            0,
            (s =
              p.new.radicals * d.newRWeight +
              p.new.kanji * d.newKWeight +
              p.new.vocabulary * d.newVWeight +
              p.apprentice.late * d.apprWeight +
              p.guru * d.guruWeight +
              p.master * d.masterWeight +
              p.enlightened * d.enlightenedWeight)
          ),
          4 & e.$$.dirty && n(9, (a = m / (d.gbMaxTarget - d.gbMinTarget))),
          517 & e.$$.dirty && n(8, (l = m + (s - d.gbMinTarget) * a)),
          256 & e.$$.dirty && n(1, (r = l < 0 ? 0 : l > 1 ? 1 : l)),
          2 & e.$$.dirty && n(7, (o = (r - 0.5).toFixed(2))),
          130 & e.$$.dirty && n(5, (i = r > 0.5 ? "+" + o : o)),
          5 & e.$$.dirty &&
            n(
              4,
              (c =
                s < d.gbMinTarget
                  ? d.belowTerm
                  : s > d.gbMaxTarget
                  ? d.aboveTerm
                  : d.inRangeTerm)
            );
      }),
      (async () => {
        wkof.include("ItemData"), await wkof.ready("ItemData");
        const e = await wkof.ItemData.get_items("subjects,assignments"),
          t = await wkof.ItemData.get_index(e, "srs_stage"),
          n = Object.assign(
            {
              0: [],
              1: [],
              2: [],
              3: [],
              4: [],
              5: [],
              6: [],
              7: [],
              8: [],
              9: [],
              "-1": [],
            },
            t
          ),
          s = [...n[1], ...n[2]],
          a = s.filter((e) => "radical" === e.object),
          l = s.filter((e) => "kanji" === e.object),
          r = s.filter((e) => "vocabulary" === e.object),
          o = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0];
        let i = [];
        return (
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1].forEach((e) => {
            i[e] = n[e].length;
          }),
          {
            expectedDaily: [1, 2, 3, 4, 5, 6, 7, 8]
              .map((e) => i[e] / o[e])
              .reduce((e, t) => e + t),
            new: {
              radicals: a.length,
              kanji: l.length,
              vocabulary: r.length,
              total: s.length,
            },
            apprentice: {
              early: i[1] + i[2],
              late: i[3] + i[4],
              total: i[1] + i[2] + i[3] + i[4],
            },
            lesson: i[0],
            guru: i[5] + i[6],
            master: i[7],
            enlightened: i[8],
            burned: i[9],
          }
        );
      })().then((e) => Be.set(e)),
      [s, r, d, p, c, i, h, o, l, a]
    );
  }
  class lt extends qe {
    constructor(e) {
      super(), Me(this, e, at, st, o, {});
    }
  }
  function rt(e, t, n) {
    const s = e.slice();
    return (s[18] = t[n]), (s[20] = n), s;
  }
  function ot(t) {
    let n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x = t[1].toFixed(1) + "",
      k = t[0].toFixed(1) + "",
      q = t[4].length + "",
      z = t[4].reverse(),
      I = [];
    for (let e = 0; e < z.length; e += 1) I[e] = ct(rt(t, z, e));
    return {
      c() {
        (n = M("h1")),
          (s = _("Speed: ")),
          (a = _(x)),
          (l = _(" spq • ")),
          (r = _(k)),
          (o = _(" qpm")),
          (c = j()),
          (u = M("div")),
          (d = M("div")),
          (p = M("h4")),
          (h = _(q)),
          (m = _(" sessions • ")),
          (g = _(t[7])),
          (f = _(" items • ")),
          (v = _(t[2])),
          (y = _(" questions")),
          (w = j());
        for (let e = 0; e < I.length; e += 1) I[e].c();
        F(n, "class", "gbHeader"),
          F(p, "class", "svelte-8r8u75"),
          F(d, "class", "gbContent scrollbox svelte-8r8u75"),
          F(u, "data-testid", "speed-table");
      },
      m(e, t) {
        C(e, n, t),
          b(n, s),
          b(n, a),
          b(n, l),
          b(n, r),
          b(n, o),
          C(e, c, t),
          C(e, u, t),
          b(u, d),
          b(d, p),
          b(p, h),
          b(p, m),
          b(p, g),
          b(p, f),
          b(p, v),
          b(p, y),
          b(d, w);
        for (let e = 0; e < I.length; e += 1) I[e].m(d, null);
      },
      p(e, t) {
        if (
          (2 & t && x !== (x = e[1].toFixed(1) + "") && R(a, x),
          1 & t && k !== (k = e[0].toFixed(1) + "") && R(r, k),
          16 & t && q !== (q = e[4].length + "") && R(h, q),
          128 & t && R(g, e[7]),
          4 & t && R(v, e[2]),
          15888 & t)
        ) {
          let n;
          for (z = e[4].reverse(), n = 0; n < z.length; n += 1) {
            const s = rt(e, z, n);
            I[n] ? I[n].p(s, t) : ((I[n] = ct(s)), I[n].c(), I[n].m(d, null));
          }
          for (; n < I.length; n += 1) I[n].d(1);
          I.length = z.length;
        }
      },
      i(e) {
        i ||
          le(() => {
            (i = be(n, We, {})), i.start();
          }),
          $ ||
            le(() => {
              ($ = be(u, We, {})), $.start();
            });
      },
      o: e,
      d(e) {
        e && T(n), e && T(c), e && T(u), S(I, e);
      },
    };
  }
  function it(e) {
    let t, n, s, a, l, r;
    return (
      (s = new Re({
        props: {
          value: e[5],
          label: e[6],
          needle: !0,
          lowZone: !0,
          hiZone: !0,
        },
      })),
      {
        c() {
          (t = M("h1")),
            (t.textContent = "Speed"),
            (n = j()),
            Ce(s.$$.fragment),
            (a = j()),
            (l = M("div")),
            (l.textContent = "qpm"),
            F(t, "class", "gbHeader"),
            F(l, "class", "units");
        },
        m(e, o) {
          C(e, t, o), C(e, n, o), Te(s, e, o), C(e, a, o), C(e, l, o), (r = !0);
        },
        p(e, t) {
          const n = {};
          32 & t && (n.value = e[5]), 64 & t && (n.label = e[6]), s.$set(n);
        },
        i(e) {
          r || (ye(s.$$.fragment, e), (r = !0));
        },
        o(e) {
          we(s.$$.fragment, e), (r = !1);
        },
        d(e) {
          e && T(t), e && T(n), Se(s, e), e && T(a), e && T(l);
        },
      }
    );
  }
  function ct(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      I,
      L,
      H,
      W,
      A = e[20] + 1 + "",
      O = e[9](e[18].start) + "",
      D = e[10](e[18].end) + "",
      Q = (e[18].duration / 6e4).toFixed(2) + "",
      E = e[18].reviewCount + "",
      G = e[18].questionCount + "",
      N = e[12](e[18].duration / 1e3, e[18].questionCount) + "",
      P = e[13](e[18].duration / 1e3, e[18].questionCount) + "",
      V = e[18].correctAnswerCount + "",
      B = e[18].questionCount + "",
      Z = e[11](e[18]) + "";
    return {
      c() {
        (t = M("article")),
          (n = M("h5")),
          (s = _(A)),
          (a = _(": ")),
          (l = _(O)),
          (r = _(" – ")),
          (o = _(D)),
          (i = _("\n            (")),
          (c = _(Q)),
          (u = _("m)")),
          (d = j()),
          (p = M("p")),
          (h = _(E)),
          (m = _(" items • ")),
          (g = _(G)),
          (f = _(" questions •\n            ")),
          (v = _(N)),
          (y = _(" spq •\n            ")),
          (w = _(P)),
          ($ = _(" qpm")),
          (x = M("br")),
          (k = j()),
          (S = _(V)),
          (q = _("/")),
          (z = _(B)),
          (I = _(" =\n            ")),
          (L = _(Z)),
          (H = _("% correct")),
          (W = j()),
          F(n, "class", "svelte-8r8u75"),
          F(p, "class", "svelte-8r8u75"),
          F(t, "class", "svelte-8r8u75");
      },
      m(e, T) {
        C(e, t, T),
          b(t, n),
          b(n, s),
          b(n, a),
          b(n, l),
          b(n, r),
          b(n, o),
          b(n, i),
          b(n, c),
          b(n, u),
          b(t, d),
          b(t, p),
          b(p, h),
          b(p, m),
          b(p, g),
          b(p, f),
          b(p, v),
          b(p, y),
          b(p, w),
          b(p, $),
          b(p, x),
          b(p, k),
          b(p, S),
          b(p, q),
          b(p, z),
          b(p, I),
          b(p, L),
          b(p, H),
          b(t, W);
      },
      p(e, t) {
        16 & t && O !== (O = e[9](e[18].start) + "") && R(l, O),
          16 & t && D !== (D = e[10](e[18].end) + "") && R(o, D),
          16 & t &&
            Q !== (Q = (e[18].duration / 6e4).toFixed(2) + "") &&
            R(c, Q),
          16 & t && E !== (E = e[18].reviewCount + "") && R(h, E),
          16 & t && G !== (G = e[18].questionCount + "") && R(g, G),
          16 & t &&
            N !== (N = e[12](e[18].duration / 1e3, e[18].questionCount) + "") &&
            R(v, N),
          16 & t &&
            P !== (P = e[13](e[18].duration / 1e3, e[18].questionCount) + "") &&
            R(w, P),
          16 & t && V !== (V = e[18].correctAnswerCount + "") && R(S, V),
          16 & t && B !== (B = e[18].questionCount + "") && R(z, B),
          16 & t && Z !== (Z = e[11](e[18]) + "") && R(L, Z);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function ut(e) {
    let t, n, s, a;
    const l = [it, ot],
      r = [];
    function o(e, t) {
      return "chart" === e[8] ? 0 : 1;
    }
    return (
      (n = o(e)),
      (s = r[n] = l[n](e)),
      {
        c() {
          (t = M("div")),
            s.c(),
            F(t, "class", "gbWidget svelte-8r8u75"),
            F(t, "data-testid", "speedWidget"),
            A(t, "--trackColor", e[3].hlTrackColor),
            A(t, "--hlTrackColor", e[3].trackColor);
        },
        m(e, s) {
          C(e, t, s), r[n].m(t, null), (a = !0);
        },
        p(e, [i]) {
          let c = n;
          (n = o(e)),
            n === c
              ? r[n].p(e, i)
              : (fe(),
                we(r[c], 1, 1, () => {
                  r[c] = null;
                }),
                ve(),
                (s = r[n]),
                s ? s.p(e, i) : ((s = r[n] = l[n](e)), s.c()),
                ye(s, 1),
                s.m(t, null)),
            (!a || 8 & i) && A(t, "--trackColor", e[3].hlTrackColor),
            (!a || 8 & i) && A(t, "--hlTrackColor", e[3].trackColor);
        },
        i(e) {
          a || (ye(s), (a = !0));
        },
        o(e) {
          we(s), (a = !1);
        },
        d(e) {
          e && T(t), r[n].d();
        },
      }
    );
  }
  function dt(e, t, n) {
    let s, a, l, r, o, i, c, d, p, h, m;
    u(e, et, (e) => n(3, (d = e))),
      u(e, Ye, (e) => n(4, (p = e))),
      u(e, Ge, (e) => n(8, (h = e)));
    const g = (2 / 3) * 0.5;
    return (
      (e.$$.update = () => {
        16 & e.$$.dirty &&
          n(7, (s = p.reduce((e, t) => e + +t.reviewCount, 0))),
          16 & e.$$.dirty &&
            n(2, (a = p.reduce((e, t) => e + +t.questionCount, 0))),
          16 & e.$$.dirty &&
            n(14, (m = p.reduce((e, t) => e + t.duration, 0) / 1e3)),
          16388 & e.$$.dirty && n(1, (l = a > 0 ? m / a : 0)),
          2 & e.$$.dirty && n(0, (r = 60 / l)),
          1 & e.$$.dirty && n(6, (o = `${r.toFixed(1)}`)),
          8 & e.$$.dirty && n(15, (i = g / (d.maxQPM - d.minQPM))),
          32777 & e.$$.dirty && n(5, (c = g + (r - d.minQPM) * i));
      }),
      [
        r,
        l,
        a,
        d,
        p,
        c,
        o,
        s,
        h,
        (e) =>
          Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(e),
        (e) => Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(e),
        (e) => ((100 * e.correctAnswerCount) / e.questionCount).toFixed(1),
        (e, t) => (e / t).toFixed(1),
        (e, t) => ((60 * t) / e).toFixed(1),
        m,
        i,
      ]
    );
  }
  class pt extends qe {
    constructor(e) {
      super(), Me(this, e, dt, ut, o, {});
    }
  }
  function ht(e, t, n) {
    const s = e.slice();
    return (s[11] = t[n]), (s[13] = n), s;
  }
  function mt(e) {
    let t;
    return {
      c() {
        (t = M("td")),
          F(t, "aria-label", "percents"),
          F(t, "class", "percents svelte-n6ktwh"),
          A(t, "height", (100 * e[1][e[13]]).toFixed(1) + "%");
      },
      m(e, n) {
        C(e, t, n);
      },
      p(e, n) {
        2 & n && A(t, "height", (100 * e[1][e[13]]).toFixed(1) + "%");
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function gt(e) {
    let t,
      n,
      s,
      a = (100 * e[1][e[13]]).toFixed() + "";
    return {
      c() {
        (t = M("br")), (n = _(a)), (s = _("%"));
      },
      m(e, a) {
        C(e, t, a), C(e, n, a), C(e, s, a);
      },
      p(e, t) {
        2 & t && a !== (a = (100 * e[1][e[13]]).toFixed() + "") && R(n, a);
      },
      d(e) {
        e && T(t), e && T(n), e && T(s);
      },
    };
  }
  function ft(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u = (e[2][e[13]] ? e[2][e[13]] : "") + "",
      d = e[11] + "",
      p = e[1].length && mt(e),
      h = e[1].length && gt(e);
    return {
      c() {
        (t = M("tr")),
          (n = M("th")),
          (s = _(u)),
          (a = j()),
          (l = M("td")),
          (r = j()),
          p && p.c(),
          (o = j()),
          (i = M("span")),
          (c = _(d)),
          h && h.c(),
          F(n, "scope", "row"),
          F(n, "aria-label", "label"),
          F(n, "class", "svelte-n6ktwh"),
          F(l, "aria-label", "value"),
          F(l, "class", "svelte-n6ktwh"),
          F(i, "class", "displayBox svelte-n6ktwh"),
          F(i, "data-testid", "displayBox"),
          F(t, "aria-label", "values"),
          A(t, "height", e[10][e[13]] + "%"),
          F(t, "class", "svelte-n6ktwh");
      },
      m(e, u) {
        C(e, t, u),
          b(t, n),
          b(n, s),
          b(t, a),
          b(t, l),
          b(t, r),
          p && p.m(t, null),
          b(t, o),
          b(t, i),
          b(i, c),
          h && h.m(i, null);
      },
      p(e, n) {
        4 & n && u !== (u = (e[2][e[13]] ? e[2][e[13]] : "") + "") && R(s, u),
          e[1].length
            ? p
              ? p.p(e, n)
              : ((p = mt(e)), p.c(), p.m(t, o))
            : p && (p.d(1), (p = null)),
          1 & n && d !== (d = e[11] + "") && R(c, d),
          e[1].length
            ? h
              ? h.p(e, n)
              : ((h = gt(e)), h.c(), h.m(i, null))
            : h && (h.d(1), (h = null)),
          1024 & n && A(t, "height", e[10][e[13]] + "%");
      },
      d(e) {
        e && T(t), p && p.d(), h && h.d();
      },
    };
  }
  function vt(t) {
    let n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w = t[0],
      $ = [];
    for (let e = 0; e < w.length; e += 1) $[e] = ft(ht(t, w, e));
    return {
      c() {
        (n = M("table")),
          (s = M("thead")),
          (s.innerHTML =
            '<tr class="svelte-n6ktwh"><th scope="col" class="svelte-n6ktwh">Item</th> \n      <th scope="col" class="svelte-n6ktwh">Value</th></tr>'),
          (a = j()),
          (l = M("tbody"));
        for (let e = 0; e < $.length; e += 1) $[e].c();
        (r = j()),
          (o = M("div")),
          (c = j()),
          (u = M("div")),
          (p = j()),
          (h = M("p")),
          (m = _(t[4])),
          (g = j()),
          (f = _(t[5])),
          (v = j()),
          (y = _(t[3])),
          F(s, "class", "svelte-n6ktwh"),
          F(o, "class", "minmax svelte-n6ktwh"),
          (o.hidden = i = t[4] + t[5] === 0),
          A(o, "bottom", t[7] + "%"),
          A(o, "height", t[8] + "%"),
          (u.hidden = d = 0 === t[9]),
          F(u, "class", "expected svelte-n6ktwh"),
          A(u, "height", t[9] + "%"),
          F(l, "class", "svelte-n6ktwh"),
          F(n, "class", "graph svelte-n6ktwh"),
          F(n, "aria-label", "bar-chart"),
          A(n, "--max-label", t[6].toFixed()),
          (h.hidden = !0);
      },
      m(e, t) {
        C(e, n, t), b(n, s), b(n, a), b(n, l);
        for (let e = 0; e < $.length; e += 1) $[e].m(l, null);
        b(l, r),
          b(l, o),
          b(l, c),
          b(l, u),
          C(e, p, t),
          C(e, h, t),
          b(h, m),
          b(h, g),
          b(h, f),
          b(h, v),
          b(h, y);
      },
      p(e, [t]) {
        if (1031 & t) {
          let n;
          for (w = e[0], n = 0; n < w.length; n += 1) {
            const s = ht(e, w, n);
            $[n] ? $[n].p(s, t) : (($[n] = ft(s)), $[n].c(), $[n].m(l, r));
          }
          for (; n < $.length; n += 1) $[n].d(1);
          $.length = w.length;
        }
        48 & t && i !== (i = e[4] + e[5] === 0) && (o.hidden = i),
          128 & t && A(o, "bottom", e[7] + "%"),
          256 & t && A(o, "height", e[8] + "%"),
          512 & t && d !== (d = 0 === e[9]) && (u.hidden = d),
          512 & t && A(u, "height", e[9] + "%"),
          64 & t && A(n, "--max-label", e[6].toFixed()),
          16 & t && R(m, e[4]),
          32 & t && R(f, e[5]),
          8 & t && R(y, e[3]);
      },
      i: e,
      o: e,
      d(e) {
        e && T(n), S($, e), e && T(p), e && T(h);
      },
    };
  }
  function yt(e, t, n) {
    let s,
      a,
      l,
      r,
      o,
      { values: i } = t,
      { percents: c = [] } = t,
      { labels: u = [] } = t,
      { expected: d = 0 } = t,
      { minTarget: p = 0 } = t,
      { maxTarget: h = 0 } = t;
    return (
      (e.$$set = (e) => {
        "values" in e && n(0, (i = e.values)),
          "percents" in e && n(1, (c = e.percents)),
          "labels" in e && n(2, (u = e.labels)),
          "expected" in e && n(3, (d = e.expected)),
          "minTarget" in e && n(4, (p = e.minTarget)),
          "maxTarget" in e && n(5, (h = e.maxTarget));
      }),
      (e.$$.update = () => {
        41 & e.$$.dirty && n(6, (s = Math.max(...i, d, h))),
          65 & e.$$.dirty &&
            n(10, (a = i.map((e) => Math.round((e / s) * 100)))),
          72 & e.$$.dirty && n(9, (l = Math.round((d / s) * 100))),
          112 & e.$$.dirty && n(8, (r = Math.round(((h - p) / s) * 100))),
          80 & e.$$.dirty && n(7, (o = Math.round((p / s) * 100)));
      }),
      [i, c, u, d, p, h, s, o, r, l, a]
    );
  }
  class wt extends qe {
    constructor(e) {
      super(),
        Me(this, e, yt, vt, o, {
          values: 0,
          percents: 1,
          labels: 2,
          expected: 3,
          minTarget: 4,
          maxTarget: 5,
        });
    }
  }
  function $t(t) {
    let n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      I,
      L,
      H,
      W,
      A,
      O,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y = t[4].toFixed() + "",
      K = t[9].expectedDaily.toFixed() + "",
      U = t[3].rpdMin + "",
      J = t[3].rpdMax + "",
      X = t[10](t[2][t[2].length - 1]?.start) + "",
      ee = t[2][t[2].length - 1]?.review_count + "",
      te = (100 * t[0][t[0].length - 1]).toFixed() + "";
    function ne(e, t) {
      return e[2].length > 2 ? kt : 2 === e[2].length ? xt : void 0;
    }
    let se = ne(t),
      ae = se && se(t);
    return {
      c() {
        (n = M("h1")),
          (s = _(t[1])),
          (a = _(" Reviews @")),
          (l = _(Y)),
          (r = _("%")),
          (i = j()),
          (c = M("div")),
          (u = M("table")),
          (d = M("tr")),
          (p = M("th")),
          (p.textContent = "Expected Daily:"),
          (h = j()),
          (m = M("td")),
          (g = _(K)),
          (f = j()),
          (v = M("span")),
          (y = _("(avg.: ")),
          (w = _(t[6])),
          ($ = _(", target: ")),
          (x = _(U)),
          (k = _("–")),
          (S = _(J)),
          (q = _(")")),
          (z = j()),
          (I = M("tr")),
          (L = M("th")),
          (H = _("Latest (")),
          (W = _(X)),
          (A = _("):")),
          (O = j()),
          (D = M("td")),
          (Q = _(ee)),
          (E = j()),
          (G = M("span")),
          (N = _("reviews @ ")),
          (P = _(te)),
          (V = _("%")),
          (B = j()),
          ae && ae.c(),
          F(n, "class", "gbHeader"),
          F(v, "class", "secondary"),
          F(G, "class", "secondary"),
          F(u, "class", "gbContent"),
          F(c, "data-testid", "reviews-per-day-table");
      },
      m(e, t) {
        C(e, n, t),
          b(n, s),
          b(n, a),
          b(n, l),
          b(n, r),
          C(e, i, t),
          C(e, c, t),
          b(c, u),
          b(u, d),
          b(d, p),
          b(d, h),
          b(d, m),
          b(m, g),
          b(m, f),
          b(m, v),
          b(v, y),
          b(v, w),
          b(v, $),
          b(v, x),
          b(v, k),
          b(v, S),
          b(v, q),
          b(u, z),
          b(u, I),
          b(I, L),
          b(L, H),
          b(L, W),
          b(L, A),
          b(I, O),
          b(I, D),
          b(D, Q),
          b(D, E),
          b(D, G),
          b(G, N),
          b(G, P),
          b(G, V),
          b(u, B),
          ae && ae.m(u, null);
      },
      p(e, t) {
        2 & t && R(s, e[1]),
          16 & t && Y !== (Y = e[4].toFixed() + "") && R(l, Y),
          512 & t && K !== (K = e[9].expectedDaily.toFixed() + "") && R(g, K),
          64 & t && R(w, e[6]),
          8 & t && U !== (U = e[3].rpdMin + "") && R(x, U),
          8 & t && J !== (J = e[3].rpdMax + "") && R(S, J),
          4 & t &&
            X !== (X = e[10](e[2][e[2].length - 1]?.start) + "") &&
            R(W, X),
          4 & t &&
            ee !== (ee = e[2][e[2].length - 1]?.review_count + "") &&
            R(Q, ee),
          1 & t &&
            te !== (te = (100 * e[0][e[0].length - 1]).toFixed() + "") &&
            R(P, te),
          se === (se = ne(e)) && ae
            ? ae.p(e, t)
            : (ae && ae.d(1),
              (ae = se && se(e)),
              ae && (ae.c(), ae.m(u, null)));
      },
      i(e) {
        o ||
          le(() => {
            (o = be(n, We, {})), o.start();
          }),
          Z ||
            le(() => {
              (Z = be(c, We, {})), Z.start();
            });
      },
      o: e,
      d(e) {
        e && T(n), e && T(i), e && T(c), ae && ae.d();
      },
    };
  }
  function bt(e) {
    let t, n, s, a;
    return (
      (s = new wt({
        props: {
          values: e[5],
          labels: e[7],
          expected: e[9].expectedDaily,
          minTarget: e[3].rpdMin,
          maxTarget: e[3].rpdMax,
          percents: e[0],
        },
      })),
      {
        c() {
          (t = M("h1")),
            (t.textContent = "Reviews"),
            (n = j()),
            Ce(s.$$.fragment),
            F(t, "class", "gbHeader");
        },
        m(e, l) {
          C(e, t, l), C(e, n, l), Te(s, e, l), (a = !0);
        },
        p(e, t) {
          const n = {};
          32 & t && (n.values = e[5]),
            128 & t && (n.labels = e[7]),
            512 & t && (n.expected = e[9].expectedDaily),
            8 & t && (n.minTarget = e[3].rpdMin),
            8 & t && (n.maxTarget = e[3].rpdMax),
            1 & t && (n.percents = e[0]),
            s.$set(n);
        },
        i(e) {
          a || (ye(s.$$.fragment, e), (a = !0));
        },
        o(e) {
          we(s.$$.fragment, e), (a = !1);
        },
        d(e) {
          e && T(t), e && T(n), Se(s, e);
        },
      }
    );
  }
  function xt(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u = e[10](e[2][0].start) + "",
      d = e[2][0].review_count + "";
    return {
      c() {
        (t = M("tr")),
          (n = M("th")),
          (s = _(u)),
          (a = _(":")),
          (l = j()),
          (r = M("td")),
          (o = _(d)),
          (i = j()),
          (c = M("span")),
          (c.textContent = "reviews"),
          F(c, "class", "secondary");
      },
      m(e, u) {
        C(e, t, u),
          b(t, n),
          b(n, s),
          b(n, a),
          b(t, l),
          b(t, r),
          b(r, o),
          b(r, i),
          b(r, c);
      },
      p(e, t) {
        4 & t && u !== (u = e[10](e[2][0].start) + "") && R(s, u),
          4 & t && d !== (d = e[2][0].review_count + "") && R(o, d);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function kt(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $ = e[10](e[2][0].start) + "",
      x = e[10](e[2][e[2].length - 2].start) + "",
      k = e[2].slice(0, -1).map(Tt).join(" • ") + "",
      S = e[0].slice(0, -1).map(St).join("% • ") + "";
    return {
      c() {
        (t = M("tr")),
          (n = M("th")),
          (s = _($)),
          (a = _(" – ")),
          (l = _(x)),
          (r = _(":")),
          (o = j()),
          (i = M("td")),
          (c = _(k)),
          (u = j()),
          (d = M("span")),
          (d.textContent = "reviews"),
          (p = j()),
          (h = M("tr")),
          (m = M("th")),
          (g = j()),
          (f = M("td")),
          (v = _(S)),
          (y = _("% ")),
          (w = M("span")),
          (w.textContent = "accuracy"),
          F(d, "class", "secondary"),
          F(w, "class", "secondary");
      },
      m(e, $) {
        C(e, t, $),
          b(t, n),
          b(n, s),
          b(n, a),
          b(n, l),
          b(n, r),
          b(t, o),
          b(t, i),
          b(i, c),
          b(i, u),
          b(i, d),
          C(e, p, $),
          C(e, h, $),
          b(h, m),
          b(h, g),
          b(h, f),
          b(f, v),
          b(f, y),
          b(f, w);
      },
      p(e, t) {
        4 & t && $ !== ($ = e[10](e[2][0].start) + "") && R(s, $),
          4 & t &&
            x !== (x = e[10](e[2][e[2].length - 2].start) + "") &&
            R(l, x),
          4 & t &&
            k !== (k = e[2].slice(0, -1).map(Tt).join(" • ") + "") &&
            R(c, k),
          1 & t &&
            S !== (S = e[0].slice(0, -1).map(St).join("% • ") + "") &&
            R(v, S);
      },
      d(e) {
        e && T(t), e && T(p), e && T(h);
      },
    };
  }
  function Ct(e) {
    let t, n, s, a;
    const l = [bt, $t],
      r = [];
    function o(e, t) {
      return "chart" === e[8] ? 0 : 1;
    }
    return (
      (n = o(e)),
      (s = r[n] = l[n](e)),
      {
        c() {
          (t = M("div")),
            s.c(),
            F(t, "class", "gbWidget"),
            F(t, "data-testid", "reviews-per-day-gauge");
        },
        m(e, s) {
          C(e, t, s), r[n].m(t, null), (a = !0);
        },
        p(e, [a]) {
          let i = n;
          (n = o(e)),
            n === i
              ? r[n].p(e, a)
              : (fe(),
                we(r[i], 1, 1, () => {
                  r[i] = null;
                }),
                ve(),
                (s = r[n]),
                s ? s.p(e, a) : ((s = r[n] = l[n](e)), s.c()),
                ye(s, 1),
                s.m(t, null));
        },
        i(e) {
          a || (ye(s), (a = !0));
        },
        o(e) {
          we(s), (a = !1);
        },
        d(e) {
          e && T(t), r[n].d();
        },
      }
    );
  }
  const Tt = (e) => e.review_count,
    St = (e) => (100 * e).toFixed();
  function Mt(e, t, n) {
    let s, a, l, r, o, i, c, d, p, h;
    u(e, Ue, (e) => n(2, (c = e))),
      u(e, et, (e) => n(3, (d = e))),
      u(e, Ge, (e) => n(8, (p = e))),
      u(e, Be, (e) => n(9, (h = e)));
    const m = (e) =>
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(e);
    return (
      (e.$$.update = () => {
        4 & e.$$.dirty && n(7, (s = c.map((e) => m(e.start)))),
          4 & e.$$.dirty &&
            n(1, (a = c.reduce((e, t) => e + t.review_count, 0))),
          10 & e.$$.dirty && n(6, (l = (a / d.daysToReview).toFixed())),
          4 & e.$$.dirty && n(5, (r = c.map((e) => e.review_count))),
          4 & e.$$.dirty && n(0, (o = c.map((e) => e.accuracy))),
          1 & e.$$.dirty &&
            n(4, (i = (100 * o.reduce((e, t) => e + t, 0)) / o.length));
      }),
      [o, a, c, d, i, r, l, s, p, h, m]
    );
  }
  class qt extends qe {
    constructor(e) {
      super(), Me(this, e, Mt, Ct, o, {});
    }
  }
  function _t(e) {
    let t, n, s, a, l, r, o, i, c, u;
    const p = e[5].default,
      h = (function (e, t, n, s) {
        if (e) {
          const a = d(e, t, n, s);
          return e[0](a);
        }
      })(p, e, e[4], null);
    return {
      c() {
        (t = M("div")),
          (n = M("div")),
          (s = q("svg")),
          (a = q("circle")),
          (l = q("line")),
          (r = q("line")),
          (o = j()),
          h && h.c(),
          F(a, "cx", "6"),
          F(a, "cy", "6"),
          F(a, "r", "6"),
          F(l, "x1", "3"),
          F(l, "y1", "3"),
          F(l, "x2", "9"),
          F(l, "y2", "9"),
          F(l, "class", "svelte-1dwe8l1"),
          F(r, "x1", "9"),
          F(r, "y1", "3"),
          F(r, "x2", "3"),
          F(r, "y2", "9"),
          F(r, "class", "svelte-1dwe8l1"),
          F(s, "class", "closeIcon svelte-1dwe8l1"),
          F(s, "viewBox", "0 0 12 12"),
          F(n, "class", "modal svelte-1dwe8l1"),
          F(t, "class", "modal-wrapper svelte-1dwe8l1");
      },
      m(d, p) {
        C(d, t, p),
          b(t, n),
          b(n, s),
          b(s, a),
          b(s, l),
          b(s, r),
          b(n, o),
          h && h.m(n, null),
          (i = !0),
          c || ((u = I(s, "click", e[6])), (c = !0));
      },
      p(e, t) {
        h &&
          h.p &&
          (!i || 16 & t) &&
          (function (e, t, n, s, a, l) {
            if (a) {
              const r = d(t, n, s, l);
              e.p(r, a);
            }
          })(
            h,
            p,
            e,
            e[4],
            i
              ? (function (e, t, n, s) {
                  if (e[2] && s) {
                    const a = e[2](s(n));
                    if (void 0 === t.dirty) return a;
                    if ("object" == typeof a) {
                      const e = [],
                        n = Math.max(t.dirty.length, a.length);
                      for (let s = 0; s < n; s += 1) e[s] = t.dirty[s] | a[s];
                      return e;
                    }
                    return t.dirty | a;
                  }
                  return t.dirty;
                })(p, e[4], t, null)
              : (function (e) {
                  if (e.ctx.length > 32) {
                    const t = [],
                      n = e.ctx.length / 32;
                    for (let e = 0; e < n; e++) t[e] = -1;
                    return t;
                  }
                  return -1;
                })(e[4]),
            null
          );
      },
      i(e) {
        i || (ye(h, e), (i = !0));
      },
      o(e) {
        we(h, e), (i = !1);
      },
      d(e) {
        e && T(t), h && h.d(e), (c = !1), u();
      },
    };
  }
  function jt(e) {
    let t,
      n,
      s = e[1] && _t(e);
    return {
      c() {
        s && s.c(), (t = z());
      },
      m(e, a) {
        s && s.m(e, a), C(e, t, a), (n = !0);
      },
      p(e, [n]) {
        e[1]
          ? s
            ? (s.p(e, n), 2 & n && ye(s, 1))
            : ((s = _t(e)), s.c(), ye(s, 1), s.m(t.parentNode, t))
          : s &&
            (fe(),
            we(s, 1, 1, () => {
              s = null;
            }),
            ve());
      },
      i(e) {
        n || (ye(s), (n = !0));
      },
      o(e) {
        we(s), (n = !1);
      },
      d(e) {
        s && s.d(e), e && T(t);
      },
    };
  }
  function zt(e, t, n) {
    let { $$slots: s = {}, $$scope: a } = t,
      l = !1;
    function r() {
      n(1, (l = !1));
    }
    return (
      (e.$$set = (e) => {
        "$$scope" in e && n(4, (a = e.$$scope));
      }),
      [
        r,
        l,
        function () {
          n(1, (l = !0));
        },
        function () {
          n(1, (l = !l));
        },
        a,
        s,
        () => r(),
      ]
    );
  }
  class It extends qe {
    constructor(e) {
      super(), Me(this, e, zt, jt, o, { show: 2, hide: 0, toggle: 3 });
    }
    get show() {
      return this.$$.ctx[2];
    }
    get hide() {
      return this.$$.ctx[0];
    }
    get toggle() {
      return this.$$.ctx[3];
    }
  }
  function Lt(e) {
    return "[object Date]" === Object.prototype.toString.call(e);
  }
  function Ht(e, t, n, s) {
    if ("number" == typeof n || Lt(n)) {
      const a = s - n,
        l = (n - t) / (e.dt || 1 / 60),
        r =
          (l + (e.opts.stiffness * a - e.opts.damping * l) * e.inv_mass) * e.dt;
      return Math.abs(r) < e.opts.precision && Math.abs(a) < e.opts.precision
        ? s
        : ((e.settled = !1), Lt(n) ? new Date(n.getTime() + r) : n + r);
    }
    if (Array.isArray(n)) return n.map((a, l) => Ht(e, t[l], n[l], s[l]));
    if ("object" == typeof n) {
      const a = {};
      for (const l in n) a[l] = Ht(e, t[l], n[l], s[l]);
      return a;
    }
    throw new Error(`Cannot spring ${typeof n} values`);
  }
  function Ft(e, t = {}) {
    const n = Oe(e),
      { stiffness: s = 0.15, damping: a = 0.8, precision: l = 0.01 } = t;
    let r,
      o,
      i,
      c = e,
      u = e,
      d = 1,
      p = 0,
      h = !1;
    function m(t, s = {}) {
      u = t;
      const a = (i = {});
      if (null == e || s.hard || (g.stiffness >= 1 && g.damping >= 1))
        return (h = !0), (r = f()), (c = t), n.set((e = u)), Promise.resolve();
      if (s.soft) {
        const e = !0 === s.soft ? 0.5 : +s.soft;
        (p = 1 / (60 * e)), (d = 0);
      }
      return (
        o ||
          ((r = f()),
          (h = !1),
          (o = $((t) => {
            if (h) return (h = !1), (o = null), !1;
            d = Math.min(d + p, 1);
            const s = {
                inv_mass: d,
                opts: g,
                settled: !0,
                dt: (60 * (t - r)) / 1e3,
              },
              a = Ht(s, c, e, u);
            return (
              (r = t),
              (c = e),
              n.set((e = a)),
              s.settled && (o = null),
              !s.settled
            );
          }))),
        new Promise((e) => {
          o.promise.then(() => {
            a === i && e();
          });
        })
      );
    }
    const g = {
      set: m,
      update: (t, n) => m(t(u, e), n),
      subscribe: n.subscribe,
      stiffness: s,
      damping: a,
      precision: l,
    };
    return g;
  }
  function Rt(e, t, n) {
    const s = e.slice();
    return (s[27] = t[n]), (s[29] = n), s;
  }
  function Wt(e) {
    let t,
      n,
      s,
      a,
      o = ("label" === e[6] || "label" === e[7]) && At(e);
    return {
      c() {
        (t = M("span")),
          o && o.c(),
          F(t, "class", "pip first"),
          F(t, "style", (n = e[14] + ": 0%;")),
          D(t, "selected", e[17](e[0])),
          D(t, "in-range", e[16](e[0]));
      },
      m(n, l) {
        C(n, t, l),
          o && o.m(t, null),
          s ||
            ((a = [
              I(t, "click", function () {
                r(e[20](e[0])) && e[20](e[0]).apply(this, arguments);
              }),
              I(
                t,
                "touchend",
                L(function () {
                  r(e[20](e[0])) && e[20](e[0]).apply(this, arguments);
                })
              ),
            ]),
            (s = !0));
      },
      p(s, a) {
        "label" === (e = s)[6] || "label" === e[7]
          ? o
            ? o.p(e, a)
            : ((o = At(e)), o.c(), o.m(t, null))
          : o && (o.d(1), (o = null)),
          16384 & a && n !== (n = e[14] + ": 0%;") && F(t, "style", n),
          131073 & a && D(t, "selected", e[17](e[0])),
          65537 & a && D(t, "in-range", e[16](e[0]));
      },
      d(e) {
        e && T(t), o && o.d(), (s = !1), l(a);
      },
    };
  }
  function At(e) {
    let t,
      n,
      s = e[12](e[0], 0, 0) + "",
      a = e[10] && Ot(e),
      l = e[11] && Dt(e);
    return {
      c() {
        (t = M("span")),
          a && a.c(),
          (n = _(s)),
          l && l.c(),
          F(t, "class", "pipVal");
      },
      m(e, s) {
        C(e, t, s), a && a.m(t, null), b(t, n), l && l.m(t, null);
      },
      p(e, r) {
        e[10]
          ? a
            ? a.p(e, r)
            : ((a = Ot(e)), a.c(), a.m(t, n))
          : a && (a.d(1), (a = null)),
          4097 & r && s !== (s = e[12](e[0], 0, 0) + "") && R(n, s),
          e[11]
            ? l
              ? l.p(e, r)
              : ((l = Dt(e)), l.c(), l.m(t, null))
            : l && (l.d(1), (l = null));
      },
      d(e) {
        e && T(t), a && a.d(), l && l.d();
      },
    };
  }
  function Ot(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[10])), F(t, "class", "pipVal-prefix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        1024 & t && R(n, e[10]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Dt(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[11])), F(t, "class", "pipVal-suffix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        2048 & t && R(n, e[11]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Qt(e) {
    let t,
      n = Array(e[19] + 1),
      s = [];
    for (let t = 0; t < n.length; t += 1) s[t] = Vt(Rt(e, n, t));
    return {
      c() {
        for (let e = 0; e < s.length; e += 1) s[e].c();
        t = z();
      },
      m(e, n) {
        for (let t = 0; t < s.length; t += 1) s[t].m(e, n);
        C(e, t, n);
      },
      p(e, a) {
        if (2088515 & a) {
          let l;
          for (n = Array(e[19] + 1), l = 0; l < n.length; l += 1) {
            const r = Rt(e, n, l);
            s[l]
              ? s[l].p(r, a)
              : ((s[l] = Vt(r)), s[l].c(), s[l].m(t.parentNode, t));
          }
          for (; l < s.length; l += 1) s[l].d(1);
          s.length = n.length;
        }
      },
      d(e) {
        S(s, e), e && T(t);
      },
    };
  }
  function Et(e) {
    let t,
      n,
      s,
      a,
      o,
      i = ("label" === e[6] || "label" === e[9]) && Gt(e);
    return {
      c() {
        (t = M("span")),
          i && i.c(),
          (n = j()),
          F(t, "class", "pip"),
          F(t, "style", (s = e[14] + ": " + e[15](e[18](e[29])) + "%;")),
          D(t, "selected", e[17](e[18](e[29]))),
          D(t, "in-range", e[16](e[18](e[29])));
      },
      m(s, l) {
        C(s, t, l),
          i && i.m(t, null),
          b(t, n),
          a ||
            ((o = [
              I(t, "click", function () {
                r(e[20](e[18](e[29]))) &&
                  e[20](e[18](e[29])).apply(this, arguments);
              }),
              I(
                t,
                "touchend",
                L(function () {
                  r(e[20](e[18](e[29]))) &&
                    e[20](e[18](e[29])).apply(this, arguments);
                })
              ),
            ]),
            (a = !0));
      },
      p(a, l) {
        "label" === (e = a)[6] || "label" === e[9]
          ? i
            ? i.p(e, l)
            : ((i = Gt(e)), i.c(), i.m(t, n))
          : i && (i.d(1), (i = null)),
          311296 & l &&
            s !== (s = e[14] + ": " + e[15](e[18](e[29])) + "%;") &&
            F(t, "style", s),
          393216 & l && D(t, "selected", e[17](e[18](e[29]))),
          327680 & l && D(t, "in-range", e[16](e[18](e[29])));
      },
      d(e) {
        e && T(t), i && i.d(), (a = !1), l(o);
      },
    };
  }
  function Gt(e) {
    let t,
      n,
      s = e[12](e[18](e[29]), e[29], e[15](e[18](e[29]))) + "",
      a = e[10] && Nt(e),
      l = e[11] && Pt(e);
    return {
      c() {
        (t = M("span")),
          a && a.c(),
          (n = _(s)),
          l && l.c(),
          F(t, "class", "pipVal");
      },
      m(e, s) {
        C(e, t, s), a && a.m(t, null), b(t, n), l && l.m(t, null);
      },
      p(e, r) {
        e[10]
          ? a
            ? a.p(e, r)
            : ((a = Nt(e)), a.c(), a.m(t, n))
          : a && (a.d(1), (a = null)),
          299008 & r &&
            s !== (s = e[12](e[18](e[29]), e[29], e[15](e[18](e[29]))) + "") &&
            R(n, s),
          e[11]
            ? l
              ? l.p(e, r)
              : ((l = Pt(e)), l.c(), l.m(t, null))
            : l && (l.d(1), (l = null));
      },
      d(e) {
        e && T(t), a && a.d(), l && l.d();
      },
    };
  }
  function Nt(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[10])), F(t, "class", "pipVal-prefix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        1024 & t && R(n, e[10]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Pt(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[11])), F(t, "class", "pipVal-suffix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        2048 & t && R(n, e[11]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Vt(e) {
    let t,
      n = e[18](e[29]) !== e[0] && e[18](e[29]) !== e[1],
      s = n && Et(e);
    return {
      c() {
        s && s.c(), (t = z());
      },
      m(e, n) {
        s && s.m(e, n), C(e, t, n);
      },
      p(e, a) {
        262147 & a && (n = e[18](e[29]) !== e[0] && e[18](e[29]) !== e[1]),
          n
            ? s
              ? s.p(e, a)
              : ((s = Et(e)), s.c(), s.m(t.parentNode, t))
            : s && (s.d(1), (s = null));
      },
      d(e) {
        s && s.d(e), e && T(t);
      },
    };
  }
  function Bt(e) {
    let t,
      n,
      s,
      a,
      o = ("label" === e[6] || "label" === e[8]) && Zt(e);
    return {
      c() {
        (t = M("span")),
          o && o.c(),
          F(t, "class", "pip last"),
          F(t, "style", (n = e[14] + ": 100%;")),
          D(t, "selected", e[17](e[1])),
          D(t, "in-range", e[16](e[1]));
      },
      m(n, l) {
        C(n, t, l),
          o && o.m(t, null),
          s ||
            ((a = [
              I(t, "click", function () {
                r(e[20](e[1])) && e[20](e[1]).apply(this, arguments);
              }),
              I(
                t,
                "touchend",
                L(function () {
                  r(e[20](e[1])) && e[20](e[1]).apply(this, arguments);
                })
              ),
            ]),
            (s = !0));
      },
      p(s, a) {
        "label" === (e = s)[6] || "label" === e[8]
          ? o
            ? o.p(e, a)
            : ((o = Zt(e)), o.c(), o.m(t, null))
          : o && (o.d(1), (o = null)),
          16384 & a && n !== (n = e[14] + ": 100%;") && F(t, "style", n),
          131074 & a && D(t, "selected", e[17](e[1])),
          65538 & a && D(t, "in-range", e[16](e[1]));
      },
      d(e) {
        e && T(t), o && o.d(), (s = !1), l(a);
      },
    };
  }
  function Zt(e) {
    let t,
      n,
      s = e[12](e[1], e[19], 100) + "",
      a = e[10] && Yt(e),
      l = e[11] && Kt(e);
    return {
      c() {
        (t = M("span")),
          a && a.c(),
          (n = _(s)),
          l && l.c(),
          F(t, "class", "pipVal");
      },
      m(e, s) {
        C(e, t, s), a && a.m(t, null), b(t, n), l && l.m(t, null);
      },
      p(e, r) {
        e[10]
          ? a
            ? a.p(e, r)
            : ((a = Yt(e)), a.c(), a.m(t, n))
          : a && (a.d(1), (a = null)),
          528386 & r && s !== (s = e[12](e[1], e[19], 100) + "") && R(n, s),
          e[11]
            ? l
              ? l.p(e, r)
              : ((l = Kt(e)), l.c(), l.m(t, null))
            : l && (l.d(1), (l = null));
      },
      d(e) {
        e && T(t), a && a.d(), l && l.d();
      },
    };
  }
  function Yt(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[10])), F(t, "class", "pipVal-prefix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        1024 & t && R(n, e[10]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Kt(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[11])), F(t, "class", "pipVal-suffix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        2048 & t && R(n, e[11]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function Ut(t) {
    let n,
      s,
      a,
      l = ((t[6] && !1 !== t[7]) || t[7]) && Wt(t),
      r = ((t[6] && !1 !== t[9]) || t[9]) && Qt(t),
      o = ((t[6] && !1 !== t[8]) || t[8]) && Bt(t);
    return {
      c() {
        (n = M("div")),
          l && l.c(),
          (s = j()),
          r && r.c(),
          (a = j()),
          o && o.c(),
          F(n, "class", "rangePips"),
          D(n, "disabled", t[5]),
          D(n, "hoverable", t[4]),
          D(n, "vertical", t[2]),
          D(n, "reversed", t[3]),
          D(n, "focus", t[13]);
      },
      m(e, t) {
        C(e, n, t),
          l && l.m(n, null),
          b(n, s),
          r && r.m(n, null),
          b(n, a),
          o && o.m(n, null);
      },
      p(e, [t]) {
        (e[6] && !1 !== e[7]) || e[7]
          ? l
            ? l.p(e, t)
            : ((l = Wt(e)), l.c(), l.m(n, s))
          : l && (l.d(1), (l = null)),
          (e[6] && !1 !== e[9]) || e[9]
            ? r
              ? r.p(e, t)
              : ((r = Qt(e)), r.c(), r.m(n, a))
            : r && (r.d(1), (r = null)),
          (e[6] && !1 !== e[8]) || e[8]
            ? o
              ? o.p(e, t)
              : ((o = Bt(e)), o.c(), o.m(n, null))
            : o && (o.d(1), (o = null)),
          32 & t && D(n, "disabled", e[5]),
          16 & t && D(n, "hoverable", e[4]),
          4 & t && D(n, "vertical", e[2]),
          8 & t && D(n, "reversed", e[3]),
          8192 & t && D(n, "focus", e[13]);
      },
      i: e,
      o: e,
      d(e) {
        e && T(n), l && l.d(), r && r.d(), o && o.d();
      },
    };
  }
  function Jt(e, t, n) {
    let s,
      a,
      l,
      r,
      o,
      { range: i = !1 } = t,
      { min: c = 0 } = t,
      { max: u = 100 } = t,
      { step: d = 1 } = t,
      { values: p = [(u + c) / 2] } = t,
      { vertical: h = !1 } = t,
      { reversed: m = !1 } = t,
      { hoverable: g = !0 } = t,
      { disabled: f = !1 } = t,
      { pipstep: v } = t,
      { all: y = !0 } = t,
      { first: w } = t,
      { last: $ } = t,
      { rest: b } = t,
      { prefix: x = "" } = t,
      { suffix: k = "" } = t,
      { formatter: C = (e, t) => e } = t,
      { focus: T } = t,
      { orientationStart: S } = t,
      { percentOf: M } = t,
      { moveHandle: q } = t;
    return (
      (e.$$set = (e) => {
        "range" in e && n(21, (i = e.range)),
          "min" in e && n(0, (c = e.min)),
          "max" in e && n(1, (u = e.max)),
          "step" in e && n(22, (d = e.step)),
          "values" in e && n(23, (p = e.values)),
          "vertical" in e && n(2, (h = e.vertical)),
          "reversed" in e && n(3, (m = e.reversed)),
          "hoverable" in e && n(4, (g = e.hoverable)),
          "disabled" in e && n(5, (f = e.disabled)),
          "pipstep" in e && n(24, (v = e.pipstep)),
          "all" in e && n(6, (y = e.all)),
          "first" in e && n(7, (w = e.first)),
          "last" in e && n(8, ($ = e.last)),
          "rest" in e && n(9, (b = e.rest)),
          "prefix" in e && n(10, (x = e.prefix)),
          "suffix" in e && n(11, (k = e.suffix)),
          "formatter" in e && n(12, (C = e.formatter)),
          "focus" in e && n(13, (T = e.focus)),
          "orientationStart" in e && n(14, (S = e.orientationStart)),
          "percentOf" in e && n(15, (M = e.percentOf)),
          "moveHandle" in e && n(25, (q = e.moveHandle));
      }),
      (e.$$.update = () => {
        20971527 & e.$$.dirty &&
          n(
            26,
            (s =
              v ||
              ((u - c) / d >= (h ? 50 : 100) ? (u - c) / (h ? 10 : 20) : 1))
          ),
          71303171 & e.$$.dirty && n(19, (a = parseInt((u - c) / (d * s), 10))),
          71303169 & e.$$.dirty &&
            n(
              18,
              (l = function (e) {
                return c + e * d * s;
              })
            ),
          8388608 & e.$$.dirty &&
            n(
              17,
              (r = function (e) {
                return p.some((t) => t === e);
              })
            ),
          10485760 & e.$$.dirty &&
            n(
              16,
              (o = function (e) {
                return "min" === i
                  ? p[0] > e
                  : "max" === i
                  ? p[0] < e
                  : i
                  ? p[0] < e && p[1] > e
                  : void 0;
              })
            );
      }),
      [
        c,
        u,
        h,
        m,
        g,
        f,
        y,
        w,
        $,
        b,
        x,
        k,
        C,
        T,
        S,
        M,
        o,
        r,
        l,
        a,
        function (e) {
          q(void 0, e);
        },
        i,
        d,
        p,
        v,
        q,
        s,
      ]
    );
  }
  class Xt extends qe {
    constructor(e) {
      super(),
        Me(this, e, Jt, Ut, o, {
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
  function en(e, t, n) {
    const s = e.slice();
    return (s[63] = t[n]), (s[65] = n), s;
  }
  function tn(e) {
    let t,
      n,
      s = e[20](e[63], e[65], e[22](e[63])) + "",
      a = e[17] && nn(e),
      l = e[18] && sn(e);
    return {
      c() {
        (t = M("span")),
          a && a.c(),
          (n = _(s)),
          l && l.c(),
          F(t, "class", "rangeFloat");
      },
      m(e, s) {
        C(e, t, s), a && a.m(t, null), b(t, n), l && l.m(t, null);
      },
      p(e, r) {
        e[17]
          ? a
            ? a.p(e, r)
            : ((a = nn(e)), a.c(), a.m(t, n))
          : a && (a.d(1), (a = null)),
          5242881 & r[0] &&
            s !== (s = e[20](e[63], e[65], e[22](e[63])) + "") &&
            R(n, s),
          e[18]
            ? l
              ? l.p(e, r)
              : ((l = sn(e)), l.c(), l.m(t, null))
            : l && (l.d(1), (l = null));
      },
      d(e) {
        e && T(t), a && a.d(), l && l.d();
      },
    };
  }
  function nn(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[17])), F(t, "class", "rangeFloat-prefix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        131072 & t[0] && R(n, e[17]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function sn(e) {
    let t, n;
    return {
      c() {
        (t = M("span")), (n = _(e[18])), F(t, "class", "rangeFloat-suffix");
      },
      m(e, s) {
        C(e, t, s), b(t, n);
      },
      p(e, t) {
        262144 & t[0] && R(n, e[18]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function an(e) {
    let t,
      n,
      s,
      a,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g = e[6] && tn(e);
    return {
      c() {
        (t = M("span")),
          (n = M("span")),
          (s = j()),
          g && g.c(),
          F(n, "class", "rangeNub"),
          F(t, "role", "slider"),
          F(t, "class", "rangeHandle"),
          F(t, "data-handle", (a = e[65])),
          F(
            t,
            "style",
            (r =
              e[28] +
              ": " +
              e[29][e[65]] +
              "%; z-index: " +
              (e[26] === e[65] ? 3 : 2) +
              ";")
          ),
          F(
            t,
            "aria-valuemin",
            (o = !0 === e[1] && 1 === e[65] ? e[0][0] : e[2])
          ),
          F(
            t,
            "aria-valuemax",
            (i = !0 === e[1] && 0 === e[65] ? e[0][1] : e[3])
          ),
          F(t, "aria-valuenow", (c = e[63])),
          F(
            t,
            "aria-valuetext",
            (u = "" + (e[17] + e[20](e[63], e[65], e[22](e[63])) + e[18]))
          ),
          F(t, "aria-orientation", (d = e[5] ? "vertical" : "horizontal")),
          F(t, "aria-disabled", e[9]),
          F(t, "disabled", e[9]),
          F(t, "tabindex", (p = e[9] ? -1 : 0)),
          D(t, "active", e[24] && e[26] === e[65]),
          D(t, "press", e[25] && e[26] === e[65]);
      },
      m(a, l) {
        C(a, t, l),
          b(t, n),
          b(t, s),
          g && g.m(t, null),
          h ||
            ((m = [
              I(t, "blur", e[33]),
              I(t, "focus", e[34]),
              I(t, "keydown", e[35]),
            ]),
            (h = !0));
      },
      p(e, n) {
        e[6]
          ? g
            ? g.p(e, n)
            : ((g = tn(e)), g.c(), g.m(t, null))
          : g && (g.d(1), (g = null)),
          872415232 & n[0] &&
            r !==
              (r =
                e[28] +
                ": " +
                e[29][e[65]] +
                "%; z-index: " +
                (e[26] === e[65] ? 3 : 2) +
                ";") &&
            F(t, "style", r),
          7 & n[0] &&
            o !== (o = !0 === e[1] && 1 === e[65] ? e[0][0] : e[2]) &&
            F(t, "aria-valuemin", o),
          11 & n[0] &&
            i !== (i = !0 === e[1] && 0 === e[65] ? e[0][1] : e[3]) &&
            F(t, "aria-valuemax", i),
          1 & n[0] && c !== (c = e[63]) && F(t, "aria-valuenow", c),
          5636097 & n[0] &&
            u !==
              (u = "" + (e[17] + e[20](e[63], e[65], e[22](e[63])) + e[18])) &&
            F(t, "aria-valuetext", u),
          32 & n[0] &&
            d !== (d = e[5] ? "vertical" : "horizontal") &&
            F(t, "aria-orientation", d),
          512 & n[0] && F(t, "aria-disabled", e[9]),
          512 & n[0] && F(t, "disabled", e[9]),
          512 & n[0] && p !== (p = e[9] ? -1 : 0) && F(t, "tabindex", p),
          83886080 & n[0] && D(t, "active", e[24] && e[26] === e[65]),
          100663296 & n[0] && D(t, "press", e[25] && e[26] === e[65]);
      },
      d(e) {
        e && T(t), g && g.d(), (h = !1), l(m);
      },
    };
  }
  function ln(e) {
    let t, n;
    return {
      c() {
        (t = M("span")),
          F(t, "class", "rangeBar"),
          F(
            t,
            "style",
            (n =
              e[28] +
              ": " +
              e[31](e[29]) +
              "%; " +
              e[27] +
              ": " +
              e[32](e[29]) +
              "%;")
          );
      },
      m(e, n) {
        C(e, t, n);
      },
      p(e, s) {
        939524096 & s[0] &&
          n !==
            (n =
              e[28] +
              ": " +
              e[31](e[29]) +
              "%; " +
              e[27] +
              ": " +
              e[32](e[29]) +
              "%;") &&
          F(t, "style", n);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function rn(e) {
    let t, n;
    return (
      (t = new Xt({
        props: {
          values: e[0],
          min: e[2],
          max: e[3],
          step: e[4],
          range: e[1],
          vertical: e[5],
          reversed: e[7],
          orientationStart: e[28],
          hoverable: e[8],
          disabled: e[9],
          all: e[12],
          first: e[13],
          last: e[14],
          rest: e[15],
          pipstep: e[11],
          prefix: e[17],
          suffix: e[18],
          formatter: e[19],
          focus: e[24],
          percentOf: e[22],
          moveHandle: e[30],
        },
      })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          1 & n[0] && (s.values = e[0]),
            4 & n[0] && (s.min = e[2]),
            8 & n[0] && (s.max = e[3]),
            16 & n[0] && (s.step = e[4]),
            2 & n[0] && (s.range = e[1]),
            32 & n[0] && (s.vertical = e[5]),
            128 & n[0] && (s.reversed = e[7]),
            268435456 & n[0] && (s.orientationStart = e[28]),
            256 & n[0] && (s.hoverable = e[8]),
            512 & n[0] && (s.disabled = e[9]),
            4096 & n[0] && (s.all = e[12]),
            8192 & n[0] && (s.first = e[13]),
            16384 & n[0] && (s.last = e[14]),
            32768 & n[0] && (s.rest = e[15]),
            2048 & n[0] && (s.pipstep = e[11]),
            131072 & n[0] && (s.prefix = e[17]),
            262144 & n[0] && (s.suffix = e[18]),
            524288 & n[0] && (s.formatter = e[19]),
            16777216 & n[0] && (s.focus = e[24]),
            4194304 & n[0] && (s.percentOf = e[22]),
            t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function on(e) {
    let t,
      n,
      s,
      a,
      r,
      o,
      i = e[0],
      c = [];
    for (let t = 0; t < i.length; t += 1) c[t] = an(en(e, i, t));
    let u = e[1] && ln(e),
      d = e[10] && rn(e);
    return {
      c() {
        t = M("div");
        for (let e = 0; e < c.length; e += 1) c[e].c();
        (n = j()),
          u && u.c(),
          (s = j()),
          d && d.c(),
          F(t, "id", e[16]),
          F(t, "class", "rangeSlider"),
          D(t, "range", e[1]),
          D(t, "disabled", e[9]),
          D(t, "hoverable", e[8]),
          D(t, "vertical", e[5]),
          D(t, "reversed", e[7]),
          D(t, "focus", e[24]),
          D(t, "min", "min" === e[1]),
          D(t, "max", "max" === e[1]),
          D(t, "pips", e[10]),
          D(
            t,
            "pip-labels",
            "label" === e[12] ||
              "label" === e[13] ||
              "label" === e[14] ||
              "label" === e[15]
          );
      },
      m(l, i) {
        C(l, t, i);
        for (let e = 0; e < c.length; e += 1) c[e].m(t, null);
        b(t, n),
          u && u.m(t, null),
          b(t, s),
          d && d.m(t, null),
          e[49](t),
          (a = !0),
          r ||
            ((o = [
              I(window, "mousedown", e[38]),
              I(window, "touchstart", e[38]),
              I(window, "mousemove", e[39]),
              I(window, "touchmove", e[39]),
              I(window, "mouseup", e[40]),
              I(window, "touchend", e[41]),
              I(window, "keydown", e[42]),
              I(t, "mousedown", e[36]),
              I(t, "mouseup", e[37]),
              I(t, "touchstart", L(e[36])),
              I(t, "touchend", L(e[37])),
            ]),
            (r = !0));
      },
      p(e, l) {
        if ((928383599 & l[0]) | (28 & l[1])) {
          let s;
          for (i = e[0], s = 0; s < i.length; s += 1) {
            const a = en(e, i, s);
            c[s] ? c[s].p(a, l) : ((c[s] = an(a)), c[s].c(), c[s].m(t, n));
          }
          for (; s < c.length; s += 1) c[s].d(1);
          c.length = i.length;
        }
        e[1]
          ? u
            ? u.p(e, l)
            : ((u = ln(e)), u.c(), u.m(t, s))
          : u && (u.d(1), (u = null)),
          e[10]
            ? d
              ? (d.p(e, l), 1024 & l[0] && ye(d, 1))
              : ((d = rn(e)), d.c(), ye(d, 1), d.m(t, null))
            : d &&
              (fe(),
              we(d, 1, 1, () => {
                d = null;
              }),
              ve()),
          (!a || 65536 & l[0]) && F(t, "id", e[16]),
          2 & l[0] && D(t, "range", e[1]),
          512 & l[0] && D(t, "disabled", e[9]),
          256 & l[0] && D(t, "hoverable", e[8]),
          32 & l[0] && D(t, "vertical", e[5]),
          128 & l[0] && D(t, "reversed", e[7]),
          16777216 & l[0] && D(t, "focus", e[24]),
          2 & l[0] && D(t, "min", "min" === e[1]),
          2 & l[0] && D(t, "max", "max" === e[1]),
          1024 & l[0] && D(t, "pips", e[10]),
          61440 & l[0] &&
            D(
              t,
              "pip-labels",
              "label" === e[12] ||
                "label" === e[13] ||
                "label" === e[14] ||
                "label" === e[15]
            );
      },
      i(e) {
        a || (ye(d), (a = !0));
      },
      o(e) {
        we(d), (a = !1);
      },
      d(n) {
        n && T(t), S(c, n), u && u.d(), d && d.d(), e[49](null), (r = !1), l(o);
      },
    };
  }
  function cn(e) {
    if (!e) return -1;
    for (var t = 0; (e = e.previousElementSibling); ) t++;
    return t;
  }
  function un(e) {
    return e.type.includes("touch") ? e.touches[0] : e;
  }
  function dn(t, n, s) {
    let a,
      l,
      r,
      o,
      c,
      u,
      d = e;
    t.$$.on_destroy.push(() => d());
    let { range: p = !1 } = n,
      { pushy: h = !1 } = n,
      { min: m = 0 } = n,
      { max: g = 100 } = n,
      { step: f = 1 } = n,
      { values: v = [(g + m) / 2] } = n,
      { vertical: y = !1 } = n,
      { float: w = !1 } = n,
      { reversed: $ = !1 } = n,
      { hoverable: b = !0 } = n,
      { disabled: x = !1 } = n,
      { pips: k = !1 } = n,
      { pipstep: C } = n,
      { all: T } = n,
      { first: S } = n,
      { last: M } = n,
      { rest: q } = n,
      { id: _ } = n,
      { prefix: j = "" } = n,
      { suffix: z = "" } = n,
      { formatter: I = (e, t, n) => e } = n,
      { handleFormatter: L = I } = n,
      { precision: H = 2 } = n,
      { springValues: F = { stiffness: 0.15, damping: 0.4 } } = n;
    const R = Y();
    let W,
      A,
      O,
      D,
      Q = 0,
      E = !1,
      G = !1,
      N = !1,
      P = !1,
      V = v.length - 1;
    function B() {
      return W.getBoundingClientRect();
    }
    function Z(e) {
      const t = B();
      let n = 0,
        s = 0,
        a = 0;
      y
        ? ((n = e.clientY - t.top),
          (s = (n / t.height) * 100),
          (s = $ ? s : 100 - s))
        : ((n = e.clientX - t.left),
          (s = (n / t.width) * 100),
          (s = $ ? 100 - s : s)),
        (a = ((g - m) / 100) * s + m),
        K(V, a);
    }
    function K(e, t) {
      return (
        (t = r(t)),
        void 0 === e && (e = V),
        p &&
          (0 === e && t > v[1]
            ? h
              ? s(0, (v[1] = t), v)
              : (t = v[1])
            : 1 === e && t < v[0] && (h ? s(0, (v[0] = t), v) : (t = v[0]))),
        v[e] !== t && s(0, (v[e] = t), v),
        O !== t &&
          (!x &&
            R("change", {
              activeHandle: V,
              startValue: A,
              previousValue: void 0 === O ? A : O,
              value: v[V],
              values: v.map((e) => r(e)),
            }),
          (O = t)),
        t
      );
    }
    function U() {
      !x &&
        R("stop", {
          activeHandle: V,
          startValue: A,
          value: v[V],
          values: v.map((e) => r(e)),
        });
    }
    return (
      (t.$$set = (e) => {
        "range" in e && s(1, (p = e.range)),
          "pushy" in e && s(43, (h = e.pushy)),
          "min" in e && s(2, (m = e.min)),
          "max" in e && s(3, (g = e.max)),
          "step" in e && s(4, (f = e.step)),
          "values" in e && s(0, (v = e.values)),
          "vertical" in e && s(5, (y = e.vertical)),
          "float" in e && s(6, (w = e.float)),
          "reversed" in e && s(7, ($ = e.reversed)),
          "hoverable" in e && s(8, (b = e.hoverable)),
          "disabled" in e && s(9, (x = e.disabled)),
          "pips" in e && s(10, (k = e.pips)),
          "pipstep" in e && s(11, (C = e.pipstep)),
          "all" in e && s(12, (T = e.all)),
          "first" in e && s(13, (S = e.first)),
          "last" in e && s(14, (M = e.last)),
          "rest" in e && s(15, (q = e.rest)),
          "id" in e && s(16, (_ = e.id)),
          "prefix" in e && s(17, (j = e.prefix)),
          "suffix" in e && s(18, (z = e.suffix)),
          "formatter" in e && s(19, (I = e.formatter)),
          "handleFormatter" in e && s(20, (L = e.handleFormatter)),
          "precision" in e && s(44, (H = e.precision)),
          "springValues" in e && s(45, (F = e.springValues));
      }),
      (t.$$.update = () => {
        12 & t.$$.dirty[0] &&
          s(
            48,
            (l = function (e) {
              return e <= m ? m : e >= g ? g : e;
            })
          ),
          (28 & t.$$.dirty[0]) | (139264 & t.$$.dirty[1]) &&
            s(
              47,
              (r = function (e) {
                if (e <= m) return m;
                if (e >= g) return g;
                let t = (e - m) % f,
                  n = e - t;
                return (
                  2 * Math.abs(t) >= f && (n += t > 0 ? f : -f),
                  (n = l(n)),
                  parseFloat(n.toFixed(H))
                );
              })
            ),
          (12 & t.$$.dirty[0]) | (8192 & t.$$.dirty[1]) &&
            s(
              22,
              (a = function (e) {
                let t = ((e - m) / (g - m)) * 100;
                return isNaN(t) || t <= 0
                  ? 0
                  : t >= 100
                  ? 100
                  : parseFloat(t.toFixed(H));
              })
            ),
          (6291469 & t.$$.dirty[0]) | (114688 & t.$$.dirty[1]) &&
            (Array.isArray(v) ||
              (s(0, (v = [(g + m) / 2])),
              console.error(
                "'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)"
              )),
            s(
              0,
              (v = (function (e) {
                return "min" === p || "max" === p
                  ? e.slice(0, 1)
                  : p
                  ? e.slice(0, 2)
                  : e;
              })(v.map((e) => r(e))))
            ),
            Q !== v.length
              ? (s(
                  21,
                  (D = Ft(
                    v.map((e) => a(e)),
                    F
                  ))
                ),
                d(),
                (d = i(D, (e) => s(29, (u = e)))))
              : D.set(v.map((e) => a(e))),
            s(46, (Q = v.length))),
          160 & t.$$.dirty[0] &&
            s(28, (o = y ? ($ ? "top" : "bottom") : $ ? "right" : "left")),
          160 & t.$$.dirty[0] &&
            s(27, (c = y ? ($ ? "bottom" : "top") : $ ? "left" : "right"));
      }),
      [
        v,
        p,
        m,
        g,
        f,
        y,
        w,
        $,
        b,
        x,
        k,
        C,
        T,
        S,
        M,
        q,
        _,
        j,
        z,
        I,
        L,
        D,
        a,
        W,
        E,
        N,
        V,
        c,
        o,
        u,
        K,
        function (e) {
          return "min" === p ? 0 : e[0];
        },
        function (e) {
          return "max" === p ? 0 : "min" === p ? 100 - e[0] : 100 - e[1];
        },
        function (e) {
          P && (s(24, (E = !1)), (G = !1), s(25, (N = !1)));
        },
        function (e) {
          x || (s(26, (V = cn(e.target))), s(24, (E = !0)));
        },
        function (e) {
          if (!x) {
            const t = cn(e.target);
            let n = e.ctrlKey || e.metaKey || e.shiftKey ? 10 * f : f,
              s = !1;
            switch (e.key) {
              case "PageDown":
                n *= 10;
              case "ArrowRight":
              case "ArrowUp":
                K(t, v[t] + n), (s = !0);
                break;
              case "PageUp":
                n *= 10;
              case "ArrowLeft":
              case "ArrowDown":
                K(t, v[t] - n), (s = !0);
                break;
              case "Home":
                K(t, m), (s = !0);
                break;
              case "End":
                K(t, g), (s = !0);
            }
            s && (e.preventDefault(), e.stopPropagation());
          }
        },
        function (e) {
          if (!x) {
            const t = e.target,
              n = un(e);
            s(24, (E = !0)),
              (G = !0),
              s(25, (N = !0)),
              s(
                26,
                (V = (function (e) {
                  const t = B();
                  let n,
                    s = 0,
                    a = 0,
                    l = 0;
                  return (
                    y
                      ? ((s = e.clientY - t.top),
                        (a = (s / t.height) * 100),
                        (a = $ ? a : 100 - a))
                      : ((s = e.clientX - t.left),
                        (a = (s / t.width) * 100),
                        (a = $ ? 100 - a : a)),
                    (l = ((g - m) / 100) * a + m),
                    !0 === p && v[0] === v[1]
                      ? l > v[1]
                        ? 1
                        : 0
                      : ((n = v.indexOf(
                          [...v].sort(
                            (e, t) => Math.abs(l - e) - Math.abs(l - t)
                          )[0]
                        )),
                        n)
                  );
                })(n))
              ),
              (A = O = r(v[V])),
              !x &&
                R("start", {
                  activeHandle: V,
                  value: A,
                  values: v.map((e) => r(e)),
                }),
              "touchstart" !== e.type || t.matches(".pipVal") || Z(n);
          }
        },
        function (e) {
          "touchend" === e.type && U(), s(25, (N = !1));
        },
        function (e) {
          (P = !1),
            E && e.target !== W && !W.contains(e.target) && s(24, (E = !1));
        },
        function (e) {
          x || (G && Z(un(e)));
        },
        function (e) {
          if (!x) {
            const t = e.target;
            G &&
              ((t === W || W.contains(t)) &&
                (s(24, (E = !0)),
                (function (e) {
                  const t = W.querySelectorAll(".handle"),
                    n = Array.prototype.includes.call(t, e),
                    s = Array.prototype.some.call(t, (t) => t.contains(e));
                  return n || s;
                })(t) ||
                  t.matches(".pipVal") ||
                  Z(un(e))),
              U());
          }
          (G = !1), s(25, (N = !1));
        },
        function (e) {
          (G = !1), s(25, (N = !1));
        },
        function (e) {
          x || ((e.target === W || W.contains(e.target)) && (P = !0));
        },
        h,
        H,
        F,
        Q,
        r,
        l,
        function (e) {
          J[e ? "unshift" : "push"](() => {
            (W = e), s(23, W);
          });
        },
      ]
    );
  }
  class pn extends qe {
    constructor(e) {
      super(),
        Me(
          this,
          e,
          dn,
          on,
          o,
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
  const hn = {
    gbRange:
      "\n<p>This controls the desired range of GanbarOmeter values. This is the highlighted area on the dial.</p>\n  ",
    gbLabel:
      "\n<p>These three settings control what is displayed in the center when the needle is <em>below</em>\nthe target range, <em>in range</em>, or <em>above<em> the range</p>\n  ",
    gbWeight:
      '\n<p>These weights calculate a <em>figure of merit</em> based on the composition of your assignment\nqueue. Your assingments are indexed by SRS stage: Stages 1 & 2 are called "early apprentice," 3 & 4 are \n"late apprentice," 5 & 6 are "guru," stage 7 is "master," and lastly, stage 8 is "enlightened."</p>\n\n<p> The default values basically calculate:</p>\n<pre>\nApprentice-items + guru-items/10\n</pre>\n\n<p>The only extra wrinkle is that you can weight items in the early apprentice stages separately.\nThe default values make kanji in stages1-2 count 3 times as much as other items, and radicals 0.75 times as much.</p>\n  ',
    gbQuiz:
      "\n<p>These three checkboxes control which <em>types</em> (radical/kanji/vocabulary) of items in \napprentice stages 1 and two are quizzed by the self-study quiz script (if installed) tests</p>\n  ",
    retrieveDays:
      "\n<p>How many days of reviews to retrieve to calculate speed/session, and review information.</p>\n<p>Setting this to 1 will retrieve just the current day (from midnight last night). Setting it to 7 will \nsix full days of reviews plus whatever reviews were performed today.</p>\n  ",
    answerSpeed:
      "\n<p>The desired range of answer speeds (in questions per minute). This is the highlighred area on the dial.</p>\n  ",
    rpd: "\n<p>The desired range of reviews per day. This is the highlighted area on the Reviews bar chart.\n  ",
    color:
      '\n<p>Color pickers to override the default theme. Click the "Light theme" or "Dark theme" buttons to set all colors\nsimultaneously, or click on any individual color picker to override just that color<p>\n<p>The color sample at the top of this dialog will reflect your choices.</p>\n  ',
    position:
      "\n<p>This controls where on the Wanikani dashboard you would like the GanbarOmeter gauges to display.</p>\n  ",
    MAD: '\n<p>You should <strong>not</strong> need to adjust this value, but lower values will cause more sessions to be found.</p>\n<p>The Wanikani API creates a review record after answering all parts for that item correctly (reading and meaning).\nEach review record contains a timestamp for when the review was started.</p>\n<p>A session is a string of consecutive reviews. Since only the interval between review records is known, this script \nuses a statistical technique called the <a href="https://en.wikipedia.org/wiki/Median_absolute_deviation">Median Absolute \nDeviation</a> to determine "outlier" intervals between review records (indicating the start of a new session).</p>\n  ',
  };
  function mn(e) {
    let t,
      n = hn[e[0]] + "";
    return {
      c() {
        (t = M("div")), F(t, "class", "content svelte-1jnmp0l");
      },
      m(e, s) {
        C(e, t, s), (t.innerHTML = n);
      },
      p(e, s) {
        1 & s && n !== (n = hn[e[0]] + "") && (t.innerHTML = n);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function gn(e) {
    let t, n, s, a, r, o, i, c;
    return (
      (r = new It({
        props: { $$slots: { default: [mn] }, $$scope: { ctx: e } },
      })),
      e[4](r),
      {
        c() {
          (t = q("svg")),
            (n = q("circle")),
            (s = q("path")),
            (a = j()),
            Ce(r.$$.fragment),
            F(n, "cx", "148"),
            F(n, "cy", "148"),
            F(n, "r", "143"),
            A(n, "fill", "none"),
            A(n, "stroke-linecap", "round"),
            A(n, "stroke-linejoin", "round"),
            A(n, "stroke-width", "10px"),
            F(n, "class", "svelte-1jnmp0l"),
            F(
              s,
              "d",
              "M216.2,121a16.2,16.2,0,1,1-16.1-16A16,16,0,0,1,216.2,121Zm-27.1,47.6c0-6.3,4.1-9.4,10.8-9.4s11,3.1,11,9.4V285.4c0,6.5-4.5,9.6-11,9.6s-10.8-3.1-10.8-9.6Z"
            ),
            F(s, "transform", "translate(-52 -52)"),
            F(s, "class", "svelte-1jnmp0l"),
            F(t, "class", "icon svelte-1jnmp0l"),
            F(t, "id", "e8de67ab-69e8-4dd2-9e7e-08244f53c8b3"),
            F(t, "data-name", "Layer 1"),
            F(t, "xmlns", "http://www.w3.org/2000/svg"),
            F(t, "viewBox", "0 0 296 296");
        },
        m(l, u) {
          C(l, t, u),
            b(t, n),
            b(t, s),
            C(l, a, u),
            Te(r, l, u),
            (o = !0),
            i ||
              ((c = [I(window, "keydown", e[2]), I(t, "click", L(e[3]))]),
              (i = !0));
        },
        p(e, [t]) {
          const n = {};
          33 & t && (n.$$scope = { dirty: t, ctx: e }), r.$set(n);
        },
        i(e) {
          o || (ye(r.$$.fragment, e), (o = !0));
        },
        o(e) {
          we(r.$$.fragment, e), (o = !1);
        },
        d(n) {
          n && T(t), n && T(a), e[4](null), Se(r, n), (i = !1), l(c);
        },
      }
    );
  }
  function fn(e, t, n) {
    let s,
      { type: a } = t;
    return (
      (e.$$set = (e) => {
        "type" in e && n(0, (a = e.type));
      }),
      [
        a,
        s,
        (e) => {
          "Escape" === e.key && s.hide();
        },
        () => s.toggle(),
        function (e) {
          J[e ? "unshift" : "push"](() => {
            (s = e), n(1, s);
          });
        },
      ]
    );
  }
  class vn extends qe {
    constructor(e) {
      super(), Me(this, e, fn, gn, o, { type: 0 });
    }
  }
  function yn(t) {
    let n, s, a, o, i, c, u, d;
    return {
      c() {
        (n = M("input")),
          (a = j()),
          (o = M("input")),
          F(n, "type", "text"),
          F(n, "style", t[10]),
          F(n, "class", (s = h(t[24].class) + " svelte-xg45mw")),
          (n.readOnly = !0),
          F(n, "contenteditable", !1),
          F(n, "tabindex", "0"),
          D(n, "default", !t[24].class),
          D(n, "drag", !0),
          D(n, "dragging", t[6]),
          D(n, "fast", t[7] > 1 ? "fast" : ""),
          D(n, "slow", t[7] < 1 ? "slow" : ""),
          D(n, "focus", t[4]),
          D(n, "inactive", t[8]),
          F(o, "style", t[10]),
          F(o, "class", (i = h(t[24].class) + " svelte-xg45mw")),
          F(o, "type", "text"),
          F(
            o,
            "inputmode",
            (c = $n(t[1]) && $n(t[0]) && t[0] >= 0 ? "numeric" : "text")
          ),
          D(o, "default", !t[24].class),
          D(o, "edit", !0),
          D(o, "editing", t[8]),
          D(o, "focus", t[5]),
          D(o, "inactive", !t[8]);
      },
      m(e, s) {
        C(e, n, s),
          t[57](n),
          W(n, t[9]),
          C(e, a, s),
          C(e, o, s),
          t[59](o),
          W(o, t[9]),
          u ||
            ((d = [
              I(window, "mousemove", function () {
                r(t[6] ? t[14] : "") &&
                  (t[6] ? t[14] : "").apply(this, arguments);
              }),
              I(window, "touchmove", function () {
                r(t[6] ? t[13] : "") &&
                  (t[6] ? t[13] : "").apply(this, arguments);
              }),
              I(
                window,
                "mouseup",
                H(function () {
                  r(t[6] ? t[16] : t[20]) &&
                    (t[6] ? t[16] : t[20]).apply(this, arguments);
                })
              ),
              I(
                window,
                "touchend",
                H(function () {
                  r(t[6] ? t[15] : t[20]) &&
                    (t[6] ? t[15] : t[20]).apply(this, arguments);
                })
              ),
              I(window, "keydown", t[21]),
              I(window, "keyup", t[22]),
              I(n, "mousedown", H(t[12])),
              I(n, "touchstart", H(L(t[11]))),
              I(n, "dblclick", H(wn)),
              I(n, "focus", t[17]),
              I(n, "blur", t[18]),
              I(n, "keydown", t[54]),
              I(n, "keypress", t[55]),
              I(n, "keyup", t[56]),
              I(n, "input", t[58]),
              I(o, "mouseup", H(bn)),
              I(o, "touchend", H(xn)),
              I(o, "focus", t[19]),
              I(o, "blur", t[20]),
              I(o, "input", t[23]),
              I(o, "keydown", t[51]),
              I(o, "keypress", t[52]),
              I(o, "keyup", t[53]),
              I(o, "input", t[60]),
            ]),
            (u = !0));
      },
      p(e, a) {
        (t = e),
          1024 & a[0] && F(n, "style", t[10]),
          16777216 & a[0] &&
            s !== (s = h(t[24].class) + " svelte-xg45mw") &&
            F(n, "class", s),
          512 & a[0] && n.value !== t[9] && W(n, t[9]),
          16777216 & a[0] && D(n, "default", !t[24].class),
          16777216 & a[0] && D(n, "drag", !0),
          16777280 & a[0] && D(n, "dragging", t[6]),
          16777344 & a[0] && D(n, "fast", t[7] > 1 ? "fast" : ""),
          16777344 & a[0] && D(n, "slow", t[7] < 1 ? "slow" : ""),
          16777232 & a[0] && D(n, "focus", t[4]),
          16777472 & a[0] && D(n, "inactive", t[8]),
          1024 & a[0] && F(o, "style", t[10]),
          16777216 & a[0] &&
            i !== (i = h(t[24].class) + " svelte-xg45mw") &&
            F(o, "class", i),
          3 & a[0] &&
            c !==
              (c = $n(t[1]) && $n(t[0]) && t[0] >= 0 ? "numeric" : "text") &&
            F(o, "inputmode", c),
          512 & a[0] && o.value !== t[9] && W(o, t[9]),
          16777216 & a[0] && D(o, "default", !t[24].class),
          16777216 & a[0] && D(o, "edit", !0),
          16777472 & a[0] && D(o, "editing", t[8]),
          16777248 & a[0] && D(o, "focus", t[5]),
          16777472 & a[0] && D(o, "inactive", !t[8]);
      },
      i: e,
      o: e,
      d(e) {
        e && T(n),
          t[57](null),
          e && T(a),
          e && T(o),
          t[59](null),
          (u = !1),
          l(d);
      },
    };
  }
  function wn(e) {}
  function $n(e) {
    return e == Math.round(e);
  }
  const bn = (e) => {},
    xn = (e) => {};
  function kn(e, t, s) {
    const a = Y();
    let { options: l = {} } = t,
      { value: r = l.value ?? 0 } = t;
    r = parseFloat(r);
    let { min: o = l.min ?? -1e12 } = t;
    o = parseFloat(o);
    let { max: i = l.max ?? 1e12 } = t;
    i = parseFloat(i);
    let { step: c = l.step ?? 1 } = t;
    c = parseFloat(c);
    let { precision: u = l.precision ?? c } = t;
    u = parseFloat(u);
    let { speed: d = l.speed ?? 1 } = t;
    d = parseFloat(d);
    let { keyStep: h = l.keyStep ?? 10 * c } = t;
    h = parseFloat(h);
    let { keyStepSlow: m = l.keyStepSlow ?? c } = t;
    m = parseFloat(m);
    let { keyStepFast: g = l.keyStepFast ?? 100 * c } = t;
    g = parseFloat(g);
    let { decimals: f = l.decimals ?? 0 } = t;
    f = parseFloat(f);
    let v,
      y,
      w,
      $,
      b,
      x,
      k,
      C,
      T,
      S,
      M,
      { format: q = l.format ?? void 0 } = t,
      { parse: _ = l.parse ?? void 0 } = t,
      { horizontal: j = l.horizontal ?? !0 } = t,
      { vertical: z = l.vertical ?? !1 } = t,
      { circular: I = l.circular ?? !1 } = t,
      { mainStyle: L = l.mainStyle ?? void 0 } = t,
      { fastStyle: H = l.fastStyle ?? void 0 } = t,
      { slowStyle: F = l.slowStyle ?? void 0 } = t,
      { focusStyle: R = l.focusStyle ?? void 0 } = t,
      { draggingStyle: W = l.draggingStyle ?? void 0 } = t,
      { editingStyle: A = l.editingStyle ?? void 0 } = t,
      { cursor: O = l.cursor ?? void 0 } = t,
      D = !1,
      Q = !1,
      E = !1,
      G = !1,
      N = !1,
      P = 1,
      V = !1,
      B = !1,
      U = !1,
      X = null,
      ee = null;
    var te;
    function ne(e) {
      a("consoleLog", e.type),
        (x = document.activeElement === $),
        s(6, (N = !0)),
        $.focus(),
        (k = !1),
        (C = D ? e.touches[0].clientX : e.clientX),
        (T = D ? e.touches[0].clientY : e.clientY),
        s(6, (N = !0)),
        ue(r);
    }
    function se(e) {
      let t = D ? e.touches[0].clientX : e.clientX,
        n = D ? e.touches[0].clientY : e.clientY,
        s = j ? t - C : 0,
        l = z ? -(n - T) : 0,
        r = Math.abs(s) > Math.abs(l) ? s : l;
      var o;
      0 == r || k || ((k = !0), a("dragstart")),
        (o = r * P),
        (v = v ?? parseFloat(y)),
        (v += o * c * d),
        ue(v),
        (C = t),
        (T = n);
    }
    function le(e) {
      a("consoleLog", e.type),
        N && k && a("dragend"),
        s(6, (N = !1)),
        x && !k && oe();
    }
    async function re() {
      await ae(),
        document.activeElement == $ || document.activeElement == b
          ? G || ((G = !0), a("focus"))
          : G && ((G = !1), a("blur"));
    }
    async function oe() {
      s(8, (U = !0)),
        await ae(),
        b.focus(),
        w ? s(9, (y = w)) : b.select(),
        a("editstart");
    }
    function ie() {
      if (U) {
        if ((s(8, (U = !1)), (w = void 0), _)) (v = _(y)), ue(v);
        else {
          let e = parseFloat(b.value);
          isNaN(e) || ((v = parseFloat(y)), ue(v));
        }
        document.activeElement === b &&
          setTimeout(() => {
            $.focus();
          }, 0),
          a("editend");
      }
    }
    function ce(e) {
      (v = v ?? parseFloat(y)), (v += e), ue(v);
    }
    function ue(e) {
      (v = parseFloat(e)),
        (v = de(v)),
        s(9, (y = Math.round((v - o) / c) * c + o)),
        s(9, (y = q ? q(y) : y.toFixed(f))),
        s(25, (r = pe(v))),
        a("input", parseFloat(r)),
        a("change", parseFloat(r));
    }
    function de(e) {
      if ((s(0, (o = parseFloat(o))), s(26, (i = parseFloat(i))), I)) {
        let t = i - o;
        if (0 === t) return o;
        let n = e < o ? Math.ceil((o - e) / t) : 0;
        e = ((e - o + t * n) % t) + o;
      } else e = Math.min(Math.max(e, o), i);
      return e;
    }
    function pe(e) {
      let t;
      e = Math.round((parseFloat(e) - o) / u) * u + o;
      let n = u < 1 ? Math.ceil(-Math.log10(u)) : 0;
      return (
        (t = c.toString().split(".")[1]),
        t && (n = Math.max(n, t.length)),
        (t = o.toString().split(".")[1]),
        t && (n = Math.max(n, t.length)),
        parseFloat(e.toFixed(n))
      );
    }
    return (
      (te = () => (
        s(48, (X = document.querySelector("html"))),
        s(49, (ee = X.style.cursor)),
        () => {
          s(48, (X.style.cursor = ee), X);
        }
      )),
      Z().$$.on_mount.push(te),
      ue(r),
      (e.$$set = (e) => {
        s(24, (t = n(n({}, t), p(e)))),
          "options" in e && s(33, (l = e.options)),
          "value" in e && s(25, (r = e.value)),
          "min" in e && s(0, (o = e.min)),
          "max" in e && s(26, (i = e.max)),
          "step" in e && s(1, (c = e.step)),
          "precision" in e && s(27, (u = e.precision)),
          "speed" in e && s(28, (d = e.speed)),
          "keyStep" in e && s(29, (h = e.keyStep)),
          "keyStepSlow" in e && s(30, (m = e.keyStepSlow)),
          "keyStepFast" in e && s(31, (g = e.keyStepFast)),
          "decimals" in e && s(32, (f = e.decimals)),
          "format" in e && s(34, (q = e.format)),
          "parse" in e && s(35, (_ = e.parse)),
          "horizontal" in e && s(36, (j = e.horizontal)),
          "vertical" in e && s(37, (z = e.vertical)),
          "circular" in e && s(38, (I = e.circular)),
          "mainStyle" in e && s(39, (L = e.mainStyle)),
          "fastStyle" in e && s(40, (H = e.fastStyle)),
          "slowStyle" in e && s(41, (F = e.slowStyle)),
          "focusStyle" in e && s(42, (R = e.focusStyle)),
          "draggingStyle" in e && s(43, (W = e.draggingStyle)),
          "editingStyle" in e && s(44, (A = e.editingStyle)),
          "cursor" in e && s(45, (O = e.cursor));
      }),
      (e.$$.update = () => {
        12 & e.$$.dirty[0] && $ && b && re(),
          33554752 & e.$$.dirty[0] && (U || N || ue(r)),
          (272 & e.$$.dirty[0]) | (98304 & e.$$.dirty[1]) &&
            (s(7, (P = 1)),
            Q && !U && (V && B ? s(7, (P = 10)) : V && s(7, (P = 0.1)))),
          (64 & e.$$.dirty[0]) | (933984 & e.$$.dirty[1]) &&
            (s(50, (M = j ? (z ? "move" : "ew-resize") : "ns-resize")),
            X && s(48, (X.style.cursor = N ? O ?? M : ee), X)),
          (1520 & e.$$.dirty[0]) | (556800 & e.$$.dirty[1]) &&
            (s(10, (S = L ?? "")),
            s(10, (S += (Q || E) && R ? ";" + R : "")),
            s(10, (S += !U && P > 1 && H ? ";" + H : "")),
            s(10, (S += !U && P < 1 && F ? ";" + F : "")),
            s(10, (S += N && W ? ";" + W : "")),
            s(10, (S += U && A ? ";" + A : "")),
            s(10, (S += U ? "" : ";cursor:" + (O ?? M))));
      }),
      (t = p(t)),
      [
        o,
        c,
        $,
        b,
        Q,
        E,
        N,
        P,
        U,
        y,
        S,
        function (e) {
          a("consoleLog", e.type), (D = !0), ne(e);
        },
        ne,
        function (e) {
          (D = !0), se(e);
        },
        se,
        function (e) {
          a("consoleLog", e.type), le(e);
        },
        le,
        function (e) {
          a("consoleLog", e.type), s(4, (Q = !0)), re();
        },
        function (e) {
          a("consoleLog", e.type), s(4, (Q = !1)), re();
        },
        function (e) {
          a("consoleLog", e.type), s(5, (E = !0)), re();
        },
        function (e) {
          a("consoleLog", e.type), s(5, (E = !1)), re(), ie();
        },
        function (e) {
          "Enter" != e.key ||
            (e.target != $ && e.target != b) ||
            e.preventDefault(),
            (e.target != $ && e.target != b) ||
              (a("consoleLog", e.type),
              1 == e.key.length && (w = w ? w + e.key : e.key)),
            "Shift" == e.key && s(47, (B = !0)),
            "Alt" == e.key && s(46, (V = !0));
        },
        function (e) {
          if (
            ((e.target != $ && e.target != b) || a("consoleLog", e.type),
            "Shift" == e.key && s(47, (B = !1)),
            "Alt" == e.key && s(46, (V = !1)),
            Q && !U)
          ) {
            let t = h;
            P < 1 && (t = m),
              P > 1 && (t = g),
              ("ArrowUp" != e.key && "ArrowRight" != e.key) || ce(t),
              ("ArrowDown" != e.key && "ArrowLeft" != e.key) || ce(-t),
              "Enter" == e.key && oe(),
              1 == e.key.length && oe();
          } else E && U && (("Enter" != e.key && "Escape" != e.key) || ie());
        },
        function (e) {
          let t = parseFloat(b.value);
          isNaN(t) || ((v = t), (v = de(v)), a("input", parseFloat(pe(v))));
        },
        t,
        r,
        i,
        u,
        d,
        h,
        m,
        g,
        f,
        l,
        q,
        _,
        j,
        z,
        I,
        L,
        H,
        F,
        R,
        W,
        A,
        O,
        V,
        B,
        X,
        ee,
        M,
        function (t) {
          K.call(this, e, t);
        },
        function (t) {
          K.call(this, e, t);
        },
        function (t) {
          K.call(this, e, t);
        },
        function (t) {
          K.call(this, e, t);
        },
        function (t) {
          K.call(this, e, t);
        },
        function (t) {
          K.call(this, e, t);
        },
        function (e) {
          J[e ? "unshift" : "push"](() => {
            ($ = e), s(2, $);
          });
        },
        function () {
          (y = this.value), s(9, y);
        },
        function (e) {
          J[e ? "unshift" : "push"](() => {
            (b = e), s(3, b);
          });
        },
        function () {
          (y = this.value), s(9, y);
        },
      ]
    );
  }
  class Cn extends qe {
    constructor(e) {
      super(),
        Me(
          this,
          e,
          kn,
          yn,
          o,
          {
            options: 33,
            value: 25,
            min: 0,
            max: 26,
            step: 1,
            precision: 27,
            speed: 28,
            keyStep: 29,
            keyStepSlow: 30,
            keyStepFast: 31,
            decimals: 32,
            format: 34,
            parse: 35,
            horizontal: 36,
            vertical: 37,
            circular: 38,
            mainStyle: 39,
            fastStyle: 40,
            slowStyle: 41,
            focusStyle: 42,
            draggingStyle: 43,
            editingStyle: 44,
            cursor: 45,
          },
          null,
          [-1, -1, -1]
        );
    }
  }
  function Tn(e) {
    let t,
      n,
      s,
      a,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      L,
      H,
      A,
      O,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y,
      K,
      U,
      X,
      ee,
      te,
      ne,
      se,
      ae,
      le,
      oe,
      ie,
      ce,
      ue,
      de,
      pe,
      he,
      me,
      ge,
      fe,
      ve,
      $e,
      be,
      xe,
      Me,
      qe,
      _e,
      je,
      ze,
      Ie,
      Le,
      He,
      Fe,
      Re,
      We,
      Ae,
      Oe,
      De,
      Qe,
      Ee,
      Ge,
      Ne,
      Pe,
      Ve,
      Be,
      Ze,
      Ye,
      Ke,
      Ue,
      Je,
      Xe,
      et,
      tt,
      nt,
      st,
      at,
      lt,
      rt,
      ot,
      it,
      ct,
      ut,
      dt,
      pt,
      ht,
      mt,
      gt,
      ft,
      vt,
      yt,
      wt,
      $t,
      bt,
      xt,
      kt,
      Ct,
      Tt,
      St,
      Mt,
      qt,
      _t = e[0].gbMinTarget + "",
      jt = e[0].gbMaxTarget + "";
    function zt(t) {
      e[2](t);
    }
    let It = {
      id: "gbRange",
      range: !0,
      pushy: !0,
      float: !0,
      min: 5,
      max: 300,
      step: 5,
    };
    function Lt(t) {
      e[6](t);
    }
    void 0 !== e[1] && (It.values = e[1]),
      (a = new pn({ props: It })),
      J.push(() => ke(a, "values", zt)),
      (c = new vn({ props: { type: "gbRange" } })),
      (G = new vn({ props: { type: "gbLabel" } }));
    let Ht = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Ft(t) {
      e[7](t);
    }
    void 0 !== e[0].newRWeight && (Ht.value = e[0].newRWeight),
      (ae = new Cn({ props: Ht })),
      J.push(() => ke(ae, "value", Lt));
    let Rt = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Wt(t) {
      e[8](t);
    }
    void 0 !== e[0].apprWeight && (Rt.value = e[0].apprWeight),
      (de = new Cn({ props: Rt })),
      J.push(() => ke(de, "value", Ft));
    let At = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Ot(t) {
      e[9](t);
    }
    void 0 !== e[0].newKWeight && (At.value = e[0].newKWeight),
      ($e = new Cn({ props: At })),
      J.push(() => ke($e, "value", Wt));
    let Dt = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Qt(t) {
      e[10](t);
    }
    void 0 !== e[0].guruWeight && (Dt.value = e[0].guruWeight),
      (je = new Cn({ props: Dt })),
      J.push(() => ke(je, "value", Ot)),
      (He = new vn({ props: { type: "gbWeight" } }));
    let Et = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Gt(t) {
      e[11](t);
    }
    void 0 !== e[0].newVWeight && (Et.value = e[0].newVWeight),
      (De = new Cn({ props: Et })),
      J.push(() => ke(De, "value", Qt));
    let Nt = { min: 0, max: 5, step: 0.001, decimals: 3 };
    function Pt(t) {
      e[12](t);
    }
    void 0 !== e[0].masterWeight && (Nt.value = e[0].masterWeight),
      (Ve = new Cn({ props: Nt })),
      J.push(() => ke(Ve, "value", Gt));
    let Vt = { min: 0, max: 5, step: 0.001, decimals: 3 };
    return (
      void 0 !== e[0].enlightenedWeight && (Vt.value = e[0].enlightenedWeight),
      (st = new Cn({ props: Vt })),
      J.push(() => ke(st, "value", Pt)),
      (Tt = new vn({ props: { type: "gbQuiz" } })),
      {
        c() {
          (t = M("div")),
            (n = M("h4")),
            (n.textContent = "Target range"),
            (s = j()),
            Ce(a.$$.fragment),
            (o = j()),
            (i = M("div")),
            Ce(c.$$.fragment),
            (u = j()),
            (d = M("div")),
            (p = _(_t)),
            (h = _(" – ")),
            (m = _(jt)),
            (g = j()),
            (f = M("hr")),
            (v = j()),
            (y = M("table")),
            (w = M("tbody")),
            ($ = M("tr")),
            (x = M("th")),
            (x.textContent = "Labels"),
            (k = j()),
            (S = M("td")),
            (q = M("input")),
            (z = j()),
            (L = M("td")),
            (H = M("input")),
            (A = j()),
            (O = M("td")),
            (D = M("input")),
            (Q = j()),
            (E = M("div")),
            Ce(G.$$.fragment),
            (N = j()),
            (P = M("thead")),
            (P.innerHTML =
              '<tr class="svelte-1l51jyl"><td class="svelte-1l51jyl"></td> \n        <th class="secondary center col3 svelte-1l51jyl">Below</th> \n        <th class="secondary center svelte-1l51jyl">In range</th> \n        <th class="secondary center svelte-1l51jyl">Above</th></tr>'),
            (V = j()),
            (B = M("hr")),
            (Z = j()),
            (Y = M("table")),
            (K = M("thead")),
            (K.innerHTML =
              '<tr class="svelte-1l51jyl"><th></th> \n        <th class="col3 svelte-1l51jyl">Weight</th> \n        <th></th> \n        <th class="col5 svelte-1l51jyl">Weight</th></tr>'),
            (U = j()),
            (X = M("tbody")),
            (ee = M("tr")),
            (te = M("th")),
            (te.textContent = "Radical1-2"),
            (ne = j()),
            (se = M("td")),
            Ce(ae.$$.fragment),
            (oe = j()),
            (ie = M("th")),
            (ie.textContent = "Appr3-4"),
            (ce = j()),
            (ue = M("td")),
            Ce(de.$$.fragment),
            (he = j()),
            (me = M("tr")),
            (ge = M("th")),
            (ge.textContent = "Kanji1-2"),
            (fe = j()),
            (ve = M("td")),
            Ce($e.$$.fragment),
            (xe = j()),
            (Me = M("th")),
            (Me.textContent = "Guru"),
            (qe = j()),
            (_e = M("td")),
            Ce(je.$$.fragment),
            (Ie = j()),
            (Le = M("div")),
            Ce(He.$$.fragment),
            (Fe = j()),
            (Re = M("tr")),
            (We = M("th")),
            (We.textContent = "Vocab1-2"),
            (Ae = j()),
            (Oe = M("td")),
            Ce(De.$$.fragment),
            (Ee = j()),
            (Ge = M("th")),
            (Ge.textContent = "Master"),
            (Ne = j()),
            (Pe = M("td")),
            Ce(Ve.$$.fragment),
            (Ze = j()),
            (Ye = M("tr")),
            (Ke = M("td")),
            (Ue = j()),
            (Je = M("td")),
            (Xe = j()),
            (et = M("th")),
            (et.textContent = "Enlightened"),
            (tt = j()),
            (nt = M("td")),
            Ce(st.$$.fragment),
            (lt = j()),
            (rt = M("hr")),
            (ot = j()),
            (it = M("table")),
            (ct = M("thead")),
            (ct.innerHTML =
              '<tr class="svelte-1l51jyl"><td class="svelte-1l51jyl"></td> \n        <th aria-label="Radical1-2 Quiz" class="secondary center col3 svelte-1l51jyl">Radical1-2</th> \n        <th aria-label="Kanji1-2 Quiz" class="secondary center svelte-1l51jyl">Kanji1-2</th> \n        <th aria-label="Vocab1-2 Quiz" class="secondary center svelte-1l51jyl">Vocab1-2</th></tr>'),
            (ut = j()),
            (dt = M("tbody")),
            (pt = M("tr")),
            (ht = M("th")),
            (ht.textContent = "Quiz?"),
            (mt = j()),
            (gt = M("td")),
            (ft = M("input")),
            (vt = j()),
            (yt = M("td")),
            (wt = M("input")),
            ($t = j()),
            (bt = M("td")),
            (xt = M("input")),
            (kt = j()),
            (Ct = M("div")),
            Ce(Tt.$$.fragment),
            F(n, "class", "svelte-1l51jyl"),
            F(i, "class", "infoIcon svelte-1l51jyl"),
            F(i, "data-testid", "gbRangeInfo"),
            F(d, "data-testid", "gbRangeLabel"),
            F(d, "class", "rangeLabel svelte-1l51jyl"),
            F(f, "class", "svelte-1l51jyl"),
            F(x, "class", "col2 svelte-1l51jyl"),
            F(q, "type", "text"),
            F(q, "data-testid", "belowInput"),
            F(q, "class", "svelte-1l51jyl"),
            F(S, "class", "svelte-1l51jyl"),
            F(H, "type", "text"),
            F(H, "data-testid", "inRangeInput"),
            F(H, "class", "svelte-1l51jyl"),
            F(L, "class", "svelte-1l51jyl"),
            F(D, "type", "text"),
            F(D, "data-testid", "aboveInput"),
            F(D, "class", "svelte-1l51jyl"),
            F(O, "class", "svelte-1l51jyl"),
            F($, "class", "svelte-1l51jyl"),
            F(E, "class", "infoIcon svelte-1l51jyl"),
            F(E, "data-testid", "gbLabelInfo"),
            F(w, "class", "svelte-1l51jyl"),
            F(P, "class", "svelte-1l51jyl"),
            F(y, "class", "svelte-1l51jyl"),
            F(B, "class", "svelte-1l51jyl"),
            F(K, "class", "svelte-1l51jyl"),
            F(te, "aria-label", "Radical1-2 Weight"),
            F(te, "class", "secondary right-align col2 svelte-1l51jyl"),
            F(se, "class", "svelte-1l51jyl"),
            F(ie, "class", "secondary right-align col4 svelte-1l51jyl"),
            F(ue, "class", "svelte-1l51jyl"),
            F(ee, "class", "svelte-1l51jyl"),
            F(ge, "aria-label", "Kanji1-2 Weight"),
            F(ge, "class", "secondary right-align col2 svelte-1l51jyl"),
            F(ve, "class", "svelte-1l51jyl"),
            F(Me, "class", "secondary right-align col4 svelte-1l51jyl"),
            F(_e, "class", "svelte-1l51jyl"),
            F(me, "class", "svelte-1l51jyl"),
            F(Le, "class", "infoIcon svelte-1l51jyl"),
            F(Le, "data-testid", "gbWeightInfo"),
            F(We, "aria-label", "Vocab1-2 Weight"),
            F(We, "class", "secondary right-align col2 svelte-1l51jyl"),
            F(Oe, "class", "svelte-1l51jyl"),
            F(Ge, "class", "secondary right-align col4 svelte-1l51jyl"),
            F(Pe, "class", "svelte-1l51jyl"),
            F(Re, "class", "svelte-1l51jyl"),
            F(Ke, "class", "svelte-1l51jyl"),
            F(Je, "class", "svelte-1l51jyl"),
            F(et, "class", "secondary right-align col4 svelte-1l51jyl"),
            F(nt, "class", "svelte-1l51jyl"),
            F(Ye, "class", "svelte-1l51jyl"),
            F(X, "class", "svelte-1l51jyl"),
            F(Y, "class", "svelte-1l51jyl"),
            F(rt, "class", "svelte-1l51jyl"),
            F(ct, "class", "svelte-1l51jyl"),
            F(ht, "class", "col2 svelte-1l51jyl"),
            F(ft, "type", "checkbox"),
            F(ft, "name", "quizTypes"),
            F(gt, "class", "svelte-1l51jyl"),
            F(wt, "type", "checkbox"),
            F(wt, "name", "quizTypes"),
            F(yt, "class", "svelte-1l51jyl"),
            F(xt, "type", "checkbox"),
            F(xt, "name", "quizTypes"),
            F(bt, "class", "svelte-1l51jyl"),
            F(pt, "class", "svelte-1l51jyl"),
            F(Ct, "class", "infoIcon svelte-1l51jyl"),
            F(Ct, "data-testid", "gbQuizInfo"),
            F(dt, "class", "svelte-1l51jyl"),
            F(it, "class", "svelte-1l51jyl"),
            F(t, "class", "gbSettingsComp");
        },
        m(l, r) {
          C(l, t, r),
            b(t, n),
            b(t, s),
            Te(a, t, null),
            b(t, o),
            b(t, i),
            Te(c, i, null),
            b(t, u),
            b(t, d),
            b(d, p),
            b(d, h),
            b(d, m),
            b(t, g),
            b(t, f),
            b(t, v),
            b(t, y),
            b(y, w),
            b(w, $),
            b($, x),
            b($, k),
            b($, S),
            b(S, q),
            W(q, e[0].belowTerm),
            b($, z),
            b($, L),
            b(L, H),
            W(H, e[0].inRangeTerm),
            b($, A),
            b($, O),
            b(O, D),
            W(D, e[0].aboveTerm),
            b(w, Q),
            b(w, E),
            Te(G, E, null),
            b(y, N),
            b(y, P),
            b(t, V),
            b(t, B),
            b(t, Z),
            b(t, Y),
            b(Y, K),
            b(Y, U),
            b(Y, X),
            b(X, ee),
            b(ee, te),
            b(ee, ne),
            b(ee, se),
            Te(ae, se, null),
            b(ee, oe),
            b(ee, ie),
            b(ee, ce),
            b(ee, ue),
            Te(de, ue, null),
            b(X, he),
            b(X, me),
            b(me, ge),
            b(me, fe),
            b(me, ve),
            Te($e, ve, null),
            b(me, xe),
            b(me, Me),
            b(me, qe),
            b(me, _e),
            Te(je, _e, null),
            b(X, Ie),
            b(X, Le),
            Te(He, Le, null),
            b(X, Fe),
            b(X, Re),
            b(Re, We),
            b(Re, Ae),
            b(Re, Oe),
            Te(De, Oe, null),
            b(Re, Ee),
            b(Re, Ge),
            b(Re, Ne),
            b(Re, Pe),
            Te(Ve, Pe, null),
            b(X, Ze),
            b(X, Ye),
            b(Ye, Ke),
            b(Ye, Ue),
            b(Ye, Je),
            b(Ye, Xe),
            b(Ye, et),
            b(Ye, tt),
            b(Ye, nt),
            Te(st, nt, null),
            b(t, lt),
            b(t, rt),
            b(t, ot),
            b(t, it),
            b(it, ct),
            b(it, ut),
            b(it, dt),
            b(dt, pt),
            b(pt, ht),
            b(pt, mt),
            b(pt, gt),
            b(gt, ft),
            (ft.checked = e[0].rQuiz),
            b(pt, vt),
            b(pt, yt),
            b(yt, wt),
            (wt.checked = e[0].kQuiz),
            b(pt, $t),
            b(pt, bt),
            b(bt, xt),
            (xt.checked = e[0].vQuiz),
            b(dt, kt),
            b(dt, Ct),
            Te(Tt, Ct, null),
            (St = !0),
            Mt ||
              ((qt = [
                I(q, "input", e[3]),
                I(H, "input", e[4]),
                I(D, "input", e[5]),
                I(ft, "change", e[13]),
                I(wt, "change", e[14]),
                I(xt, "change", e[15]),
              ]),
              (Mt = !0));
        },
        p(e, [t]) {
          const n = {};
          !r && 2 & t && ((r = !0), (n.values = e[1]), re(() => (r = !1))),
            a.$set(n),
            (!St || 1 & t) && _t !== (_t = e[0].gbMinTarget + "") && R(p, _t),
            (!St || 1 & t) && jt !== (jt = e[0].gbMaxTarget + "") && R(m, jt),
            1 & t && q.value !== e[0].belowTerm && W(q, e[0].belowTerm),
            1 & t && H.value !== e[0].inRangeTerm && W(H, e[0].inRangeTerm),
            1 & t && D.value !== e[0].aboveTerm && W(D, e[0].aboveTerm);
          const s = {};
          !le &&
            1 & t &&
            ((le = !0), (s.value = e[0].newRWeight), re(() => (le = !1))),
            ae.$set(s);
          const l = {};
          !pe &&
            1 & t &&
            ((pe = !0), (l.value = e[0].apprWeight), re(() => (pe = !1))),
            de.$set(l);
          const o = {};
          !be &&
            1 & t &&
            ((be = !0), (o.value = e[0].newKWeight), re(() => (be = !1))),
            $e.$set(o);
          const i = {};
          !ze &&
            1 & t &&
            ((ze = !0), (i.value = e[0].guruWeight), re(() => (ze = !1))),
            je.$set(i);
          const c = {};
          !Qe &&
            1 & t &&
            ((Qe = !0), (c.value = e[0].newVWeight), re(() => (Qe = !1))),
            De.$set(c);
          const u = {};
          !Be &&
            1 & t &&
            ((Be = !0), (u.value = e[0].masterWeight), re(() => (Be = !1))),
            Ve.$set(u);
          const d = {};
          !at &&
            1 & t &&
            ((at = !0),
            (d.value = e[0].enlightenedWeight),
            re(() => (at = !1))),
            st.$set(d),
            1 & t && (ft.checked = e[0].rQuiz),
            1 & t && (wt.checked = e[0].kQuiz),
            1 & t && (xt.checked = e[0].vQuiz);
        },
        i(e) {
          St ||
            (ye(a.$$.fragment, e),
            ye(c.$$.fragment, e),
            ye(G.$$.fragment, e),
            ye(ae.$$.fragment, e),
            ye(de.$$.fragment, e),
            ye($e.$$.fragment, e),
            ye(je.$$.fragment, e),
            ye(He.$$.fragment, e),
            ye(De.$$.fragment, e),
            ye(Ve.$$.fragment, e),
            ye(st.$$.fragment, e),
            ye(Tt.$$.fragment, e),
            (St = !0));
        },
        o(e) {
          we(a.$$.fragment, e),
            we(c.$$.fragment, e),
            we(G.$$.fragment, e),
            we(ae.$$.fragment, e),
            we(de.$$.fragment, e),
            we($e.$$.fragment, e),
            we(je.$$.fragment, e),
            we(He.$$.fragment, e),
            we(De.$$.fragment, e),
            we(Ve.$$.fragment, e),
            we(st.$$.fragment, e),
            we(Tt.$$.fragment, e),
            (St = !1);
        },
        d(e) {
          e && T(t),
            Se(a),
            Se(c),
            Se(G),
            Se(ae),
            Se(de),
            Se($e),
            Se(je),
            Se(He),
            Se(De),
            Se(Ve),
            Se(st),
            Se(Tt),
            (Mt = !1),
            l(qt);
        },
      }
    );
  }
  function Sn(e, t, n) {
    let { values: s } = t,
      a = [s.gbMinTarget, s.gbMaxTarget];
    return (
      (e.$$set = (e) => {
        "values" in e && n(0, (s = e.values));
      }),
      (e.$$.update = () => {
        2 & e.$$.dirty && n(0, ([s.gbMinTarget, s.gbMaxTarget] = a), s);
      }),
      [
        s,
        a,
        function (e) {
          (a = e), n(1, a);
        },
        function () {
          (s.belowTerm = this.value), n(0, s), n(1, a);
        },
        function () {
          (s.inRangeTerm = this.value), n(0, s), n(1, a);
        },
        function () {
          (s.aboveTerm = this.value), n(0, s), n(1, a);
        },
        function (t) {
          e.$$.not_equal(s.newRWeight, t) &&
            ((s.newRWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.apprWeight, t) &&
            ((s.apprWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.newKWeight, t) &&
            ((s.newKWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.guruWeight, t) &&
            ((s.guruWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.newVWeight, t) &&
            ((s.newVWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.masterWeight, t) &&
            ((s.masterWeight = t), n(0, s), n(1, a));
        },
        function (t) {
          e.$$.not_equal(s.enlightenedWeight, t) &&
            ((s.enlightenedWeight = t), n(0, s), n(1, a));
        },
        function () {
          (s.rQuiz = this.checked), n(0, s), n(1, a);
        },
        function () {
          (s.kQuiz = this.checked), n(0, s), n(1, a);
        },
        function () {
          (s.vQuiz = this.checked), n(0, s), n(1, a);
        },
      ]
    );
  }
  class Mn extends qe {
    constructor(e) {
      super(), Me(this, e, Sn, Tn, o, { values: 0 });
    }
  }
  function qn(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      I,
      L,
      H,
      W,
      A,
      O,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y,
      K,
      U,
      X,
      ee,
      te,
      ne,
      se = e[0].daysToReview + "",
      ae = e[0].daysToReview > 1 ? "s" : "",
      le = e[0].minQPM + "",
      oe = e[0].maxQPM + "",
      ie = e[0].rpdMin + "",
      ce = e[0].rpdMax + "";
    function ue(t) {
      e[4](t);
    }
    let de = { id: "daysToRetrieve", float: !0, min: 1, max: 7 };
    function pe(t) {
      e[5](t);
    }
    void 0 !== e[3] && (de.values = e[3]),
      (a = new pn({ props: de })),
      J.push(() => ke(a, "values", ue)),
      (i = new vn({ props: { type: "retrieveDays" } }));
    let he = {
      id: "speedRange",
      range: !0,
      pushy: !0,
      float: !0,
      min: 1,
      max: 30,
    };
    function me(t) {
      e[6](t);
    }
    void 0 !== e[2] && (he.values = e[2]),
      ($ = new pn({ props: he })),
      J.push(() => ke($, "values", pe)),
      (q = new vn({ props: { type: "answerSpeed" } }));
    let ge = {
      id: "rpdRange",
      range: !0,
      pushy: !0,
      float: !0,
      min: 2,
      max: 300,
    };
    return (
      void 0 !== e[1] && (ge.values = e[1]),
      (N = new pn({ props: ge })),
      J.push(() => ke(N, "values", me)),
      (Z = new vn({ props: { type: "rpd" } })),
      {
        c() {
          (t = M("div")),
            (n = M("h4")),
            (n.textContent = "Reviews to examine"),
            (s = j()),
            Ce(a.$$.fragment),
            (r = j()),
            (o = M("div")),
            Ce(i.$$.fragment),
            (c = j()),
            (u = M("div")),
            (d = _("past ")),
            (p = _(se)),
            (h = _(" day")),
            (m = _(ae)),
            (g = j()),
            (f = M("hr")),
            (v = j()),
            (y = M("h4")),
            (y.textContent = "Target answer speed"),
            (w = j()),
            Ce($.$$.fragment),
            (k = j()),
            (S = M("div")),
            Ce(q.$$.fragment),
            (z = j()),
            (I = M("div")),
            (L = _(le)),
            (H = _(" – ")),
            (W = _(oe)),
            (A = _(" qpm")),
            (O = j()),
            (D = M("hr")),
            (Q = j()),
            (E = M("h4")),
            (E.textContent = "Target daily load"),
            (G = j()),
            Ce(N.$$.fragment),
            (V = j()),
            (B = M("div")),
            Ce(Z.$$.fragment),
            (Y = j()),
            (K = M("div")),
            (U = _(ie)),
            (X = _(" – ")),
            (ee = _(ce)),
            (te = _(" rpd")),
            F(n, "class", "svelte-bt164k"),
            F(o, "class", "infoIcon svelte-bt164k"),
            F(o, "data-testid", "retrieveDaysInfo"),
            F(u, "class", "rangeLabel svelte-bt164k"),
            F(f, "class", "svelte-bt164k"),
            F(y, "class", "svelte-bt164k"),
            F(S, "class", "infoIcon svelte-bt164k"),
            F(S, "data-testid", "answerSpeedInfo"),
            F(I, "class", "rangeLabel svelte-bt164k"),
            F(D, "class", "svelte-bt164k"),
            F(E, "class", "svelte-bt164k"),
            F(B, "class", "infoIcon svelte-bt164k"),
            F(B, "data-testid", "rpdInfo"),
            F(K, "class", "rangeLabel svelte-bt164k"),
            F(t, "class", "gbSettingsComp");
        },
        m(e, l) {
          C(e, t, l),
            b(t, n),
            b(t, s),
            Te(a, t, null),
            b(t, r),
            b(t, o),
            Te(i, o, null),
            b(t, c),
            b(t, u),
            b(u, d),
            b(u, p),
            b(u, h),
            b(u, m),
            b(t, g),
            b(t, f),
            b(t, v),
            b(t, y),
            b(t, w),
            Te($, t, null),
            b(t, k),
            b(t, S),
            Te(q, S, null),
            b(t, z),
            b(t, I),
            b(I, L),
            b(I, H),
            b(I, W),
            b(I, A),
            b(t, O),
            b(t, D),
            b(t, Q),
            b(t, E),
            b(t, G),
            Te(N, t, null),
            b(t, V),
            b(t, B),
            Te(Z, B, null),
            b(t, Y),
            b(t, K),
            b(K, U),
            b(K, X),
            b(K, ee),
            b(K, te),
            (ne = !0);
        },
        p(e, [t]) {
          const n = {};
          !l && 8 & t && ((l = !0), (n.values = e[3]), re(() => (l = !1))),
            a.$set(n),
            (!ne || 1 & t) && se !== (se = e[0].daysToReview + "") && R(p, se),
            (!ne || 1 & t) &&
              ae !== (ae = e[0].daysToReview > 1 ? "s" : "") &&
              R(m, ae);
          const s = {};
          !x && 4 & t && ((x = !0), (s.values = e[2]), re(() => (x = !1))),
            $.$set(s),
            (!ne || 1 & t) && le !== (le = e[0].minQPM + "") && R(L, le),
            (!ne || 1 & t) && oe !== (oe = e[0].maxQPM + "") && R(W, oe);
          const r = {};
          !P && 2 & t && ((P = !0), (r.values = e[1]), re(() => (P = !1))),
            N.$set(r),
            (!ne || 1 & t) && ie !== (ie = e[0].rpdMin + "") && R(U, ie),
            (!ne || 1 & t) && ce !== (ce = e[0].rpdMax + "") && R(ee, ce);
        },
        i(e) {
          ne ||
            (ye(a.$$.fragment, e),
            ye(i.$$.fragment, e),
            ye($.$$.fragment, e),
            ye(q.$$.fragment, e),
            ye(N.$$.fragment, e),
            ye(Z.$$.fragment, e),
            (ne = !0));
        },
        o(e) {
          we(a.$$.fragment, e),
            we(i.$$.fragment, e),
            we($.$$.fragment, e),
            we(q.$$.fragment, e),
            we(N.$$.fragment, e),
            we(Z.$$.fragment, e),
            (ne = !1);
        },
        d(e) {
          e && T(t), Se(a), Se(i), Se($), Se(q), Se(N), Se(Z);
        },
      }
    );
  }
  function _n(e, t, n) {
    let { values: s } = t,
      a = [s.rpdMin, s.rpdMax],
      l = [s.minQPM, s.maxQPM],
      r = [s.daysToReview];
    return (
      (e.$$set = (e) => {
        "values" in e && n(0, (s = e.values));
      }),
      (e.$$.update = () => {
        14 & e.$$.dirty &&
          n(
            0,
            ([s.daysToReview, s.rpdMin, s.rpdMax, s.minQPM, s.maxQPM] = [
              ...r,
              ...a,
              ...l,
            ]),
            s
          );
      }),
      [
        s,
        a,
        l,
        r,
        function (e) {
          (r = e), n(3, r);
        },
        function (e) {
          (l = e), n(2, l);
        },
        function (e) {
          (a = e), n(1, a);
        },
      ]
    );
  }
  class jn extends qe {
    constructor(e) {
      super(), Me(this, e, _n, qn, o, { values: 0 });
    }
  }
  function zn(e) {
    let t,
      n,
      s,
      a,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      z,
      H,
      R,
      A,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y,
      K,
      U,
      J,
      X,
      ee,
      te,
      ne,
      se,
      ae,
      re,
      oe,
      ie,
      ce,
      ue,
      de,
      pe,
      he,
      me,
      ge,
      fe,
      ve,
      $e,
      be,
      xe,
      ke,
      Me,
      qe,
      _e;
    return (
      (r = new Re({
        props: {
          value: 0.4,
          label: "Sample",
          needle: !0,
          lowZone: !0,
          hiZone: !0,
        },
      })),
      (i = new wt({
        props: {
          values: [7, 10, 8],
          labels: ["Mon", "Tue", "Wed"],
          expected: 7,
          minTarget: 2,
          maxTarget: 9,
          percents: [0.66, 0.8, 0.75],
        },
      })),
      (V = new vn({ props: { type: "color" } })),
      (ke = new vn({ props: { type: "position" } })),
      {
        c() {
          (t = M("div")),
            (n = M("div")),
            (s = M("div")),
            (s.textContent = "Warning Color"),
            (a = j()),
            Ce(r.$$.fragment),
            (o = j()),
            Ce(i.$$.fragment),
            (u = j()),
            (d = M("button")),
            (d.textContent = "Light theme"),
            (p = j()),
            (h = M("button")),
            (h.textContent = "Dark theme"),
            (m = j()),
            (g = M("h3")),
            (g.textContent = "Individual overrides"),
            (f = j()),
            (v = M("div")),
            (y = M("label")),
            (w = _("Bgnd\n      ")),
            ($ = M("input")),
            (x = j()),
            (k = M("label")),
            (S = _("Track\n    ")),
            (q = M("input")),
            (z = j()),
            (H = M("label")),
            (R = _("Text\n      ")),
            (A = M("input")),
            (D = j()),
            (Q = M("label")),
            (E = _("hlText\n      ")),
            (G = M("input")),
            (N = j()),
            (P = M("div")),
            Ce(V.$$.fragment),
            (B = j()),
            (Z = M("div")),
            (Y = M("label")),
            (K = _("Fill\n      ")),
            (U = M("input")),
            (J = j()),
            (X = M("label")),
            (ee = _("Warn\n      ")),
            (te = M("input")),
            (ne = j()),
            (se = M("label")),
            (ae = _("hlTrack\n      ")),
            (re = M("input")),
            (oe = j()),
            (ie = M("hr")),
            (ce = j()),
            (ue = M("div")),
            (de = M("label")),
            (de.textContent = "Position"),
            (pe = j()),
            (he = M("select")),
            (me = M("option")),
            (me.textContent = "Top"),
            (ge = M("option")),
            (ge.textContent = "Below Forecast"),
            (fe = M("option")),
            (fe.textContent = "Below SRS"),
            (ve = M("option")),
            (ve.textContent = "Below Panels"),
            ($e = M("option")),
            ($e.textContent = "Bottom"),
            (be = j()),
            (xe = M("div")),
            Ce(ke.$$.fragment),
            F(s, "class", "warnBox svelte-5msqoy"),
            F(n, "data-testid", "colorSample"),
            F(n, "class", "colorSample svelte-5msqoy"),
            F(
              n,
              "style",
              (c = ` \n      background-color: ${e[0].bgColor};\n      --bgColor: ${e[0].bgColor}; \n      --trackColor: ${e[0].hlTrackColor}; \n      --textColor: ${e[0].textColor}; \n      --hlTextColor: ${e[0].hlTextColor}; \n      --fillColor: ${e[0].fillColor}; \n      --warnColor: ${e[0].warnColor}; \n      --hlTrackColor: ${e[0].trackColor};`)
            ),
            F(d, "class", "light svelte-5msqoy"),
            F(h, "class", "dark svelte-5msqoy"),
            F(g, "class", "svelte-5msqoy"),
            F($, "type", "color"),
            F($, "class", "svelte-5msqoy"),
            F(y, "class", "svelte-5msqoy"),
            F(q, "type", "color"),
            F(q, "class", "svelte-5msqoy"),
            F(k, "class", "svelte-5msqoy"),
            F(A, "type", "color"),
            F(A, "class", "svelte-5msqoy"),
            F(H, "class", "svelte-5msqoy"),
            F(G, "type", "color"),
            F(G, "class", "svelte-5msqoy"),
            F(Q, "class", "svelte-5msqoy"),
            F(v, "class", "colorInputs svelte-5msqoy"),
            F(P, "class", "infoIcon svelte-5msqoy"),
            F(P, "data-testid", "colorInfo"),
            F(U, "type", "color"),
            F(U, "class", "svelte-5msqoy"),
            F(Y, "class", "svelte-5msqoy"),
            F(te, "type", "color"),
            F(te, "class", "svelte-5msqoy"),
            F(X, "class", "svelte-5msqoy"),
            F(re, "type", "color"),
            F(re, "class", "svelte-5msqoy"),
            F(se, "class", "svelte-5msqoy"),
            F(Z, "class", "colorInputs svelte-5msqoy"),
            F(ie, "class", "svelte-5msqoy"),
            F(de, "for", "position-select"),
            F(de, "class", "svelte-5msqoy"),
            (me.__value = "Top"),
            (me.value = me.__value),
            (ge.__value = "Below Forecast"),
            (ge.value = ge.__value),
            (fe.__value = "Below SRS"),
            (fe.value = fe.__value),
            (ve.__value = "Below Panels"),
            (ve.value = ve.__value),
            ($e.__value = "Bottom"),
            ($e.value = $e.__value),
            F(he, "name", "positions"),
            F(he, "id", "position-select"),
            F(he, "class", "svelte-5msqoy"),
            void 0 === e[0].position && le(() => e[10].call(he)),
            F(ue, "class", "position svelte-5msqoy"),
            F(xe, "class", "infoIcon svelte-5msqoy"),
            F(xe, "data-testid", "positionInfo"),
            F(t, "class", "gbSettingsComp");
        },
        m(l, c) {
          C(l, t, c),
            b(t, n),
            b(n, s),
            b(n, a),
            Te(r, n, null),
            b(n, o),
            Te(i, n, null),
            b(t, u),
            b(t, d),
            b(t, p),
            b(t, h),
            b(t, m),
            b(t, g),
            b(t, f),
            b(t, v),
            b(v, y),
            b(y, w),
            b(y, $),
            W($, e[0].bgColor),
            b(v, x),
            b(v, k),
            b(k, S),
            b(k, q),
            W(q, e[0].trackColor),
            b(v, z),
            b(v, H),
            b(H, R),
            b(H, A),
            W(A, e[0].textColor),
            b(v, D),
            b(v, Q),
            b(Q, E),
            b(Q, G),
            W(G, e[0].hlTextColor),
            b(t, N),
            b(t, P),
            Te(V, P, null),
            b(t, B),
            b(t, Z),
            b(Z, Y),
            b(Y, K),
            b(Y, U),
            W(U, e[0].fillColor),
            b(Z, J),
            b(Z, X),
            b(X, ee),
            b(X, te),
            W(te, e[0].warnColor),
            b(Z, ne),
            b(Z, se),
            b(se, ae),
            b(se, re),
            W(re, e[0].hlTrackColor),
            b(t, oe),
            b(t, ie),
            b(t, ce),
            b(t, ue),
            b(ue, de),
            b(ue, pe),
            b(ue, he),
            b(he, me),
            b(he, ge),
            b(he, fe),
            b(he, ve),
            b(he, $e),
            O(he, e[0].position),
            b(t, be),
            b(t, xe),
            Te(ke, xe, null),
            (Me = !0),
            qe ||
              ((_e = [
                I(d, "click", L(e[1])),
                I(h, "click", L(e[2])),
                I($, "input", e[3]),
                I(q, "input", e[4]),
                I(A, "input", e[5]),
                I(G, "input", e[6]),
                I(U, "input", e[7]),
                I(te, "input", e[8]),
                I(re, "input", e[9]),
                I(he, "change", e[10]),
              ]),
              (qe = !0));
        },
        p(e, [t]) {
          (!Me ||
            (1 & t &&
              c !==
                (c = ` \n      background-color: ${e[0].bgColor};\n      --bgColor: ${e[0].bgColor}; \n      --trackColor: ${e[0].hlTrackColor}; \n      --textColor: ${e[0].textColor}; \n      --hlTextColor: ${e[0].hlTextColor}; \n      --fillColor: ${e[0].fillColor}; \n      --warnColor: ${e[0].warnColor}; \n      --hlTrackColor: ${e[0].trackColor};`))) &&
            F(n, "style", c),
            1 & t && W($, e[0].bgColor),
            1 & t && W(q, e[0].trackColor),
            1 & t && W(A, e[0].textColor),
            1 & t && W(G, e[0].hlTextColor),
            1 & t && W(U, e[0].fillColor),
            1 & t && W(te, e[0].warnColor),
            1 & t && W(re, e[0].hlTrackColor),
            1 & t && O(he, e[0].position);
        },
        i(e) {
          Me ||
            (ye(r.$$.fragment, e),
            ye(i.$$.fragment, e),
            ye(V.$$.fragment, e),
            ye(ke.$$.fragment, e),
            (Me = !0));
        },
        o(e) {
          we(r.$$.fragment, e),
            we(i.$$.fragment, e),
            we(V.$$.fragment, e),
            we(ke.$$.fragment, e),
            (Me = !1);
        },
        d(e) {
          e && T(t), Se(r), Se(i), Se(V), Se(ke), (qe = !1), l(_e);
        },
      }
    );
  }
  function In(e, t, n) {
    let { values: s } = t;
    return (
      (e.$$set = (e) => {
        "values" in e && n(0, (s = e.values));
      }),
      [
        s,
        () => {
          n(0, (s.bgColor = "#f4f4f4"), s),
            n(0, (s.hlTrackColor = "#d1e8d4"), s),
            n(0, (s.trackColor = "#e0e0e0"), s),
            n(0, (s.textColor = "#333333"), s),
            n(0, (s.hlTextColor = "#fbb623"), s),
            n(0, (s.fillColor = "#59c273"), s),
            n(0, (s.warnColor = "#fbb623"), s);
        },
        () => {
          n(0, (s.bgColor = "#232629"), s),
            n(0, (s.trackColor = "#e0e0e0"), s),
            n(0, (s.textColor = "#bcbcbc"), s),
            n(0, (s.hlTextColor = "#fcbd4b"), s),
            n(0, (s.fillColor = "#59c273"), s),
            n(0, (s.warnColor = "#fcbd4b"), s),
            n(0, (s.hlTrackColor = "#aad4b0"), s);
        },
        function () {
          (s.bgColor = this.value), n(0, s);
        },
        function () {
          (s.trackColor = this.value), n(0, s);
        },
        function () {
          (s.textColor = this.value), n(0, s);
        },
        function () {
          (s.hlTextColor = this.value), n(0, s);
        },
        function () {
          (s.fillColor = this.value), n(0, s);
        },
        function () {
          (s.warnColor = this.value), n(0, s);
        },
        function () {
          (s.hlTrackColor = this.value), n(0, s);
        },
        function () {
          (s.position = (function (e) {
            const t = e.querySelector(":checked") || e.options[0];
            return t && t.__value;
          })(this)),
            n(0, s);
        },
      ]
    );
  }
  class Ln extends qe {
    constructor(e) {
      super(), Me(this, e, In, zn, o, { values: 0 });
    }
  }
  function Hn(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h = e[0].madCutoff + "";
    function m(t) {
      e[2](t);
    }
    let g = { id: "madRange", float: !0, min: 1, max: 15 };
    return (
      void 0 !== e[1] && (g.values = e[1]),
      (a = new pn({ props: g })),
      J.push(() => ke(a, "values", m)),
      (i = new vn({ props: { type: "MAD" } })),
      {
        c() {
          (t = M("div")),
            (n = M("h4")),
            (n.textContent = "MAD cutoff"),
            (s = j()),
            Ce(a.$$.fragment),
            (r = j()),
            (o = M("div")),
            Ce(i.$$.fragment),
            (c = j()),
            (u = M("div")),
            (d = _(h)),
            F(n, "class", "svelte-1db7zzs"),
            F(o, "class", "infoIcon svelte-1db7zzs"),
            F(o, "data-testid", "madInfo"),
            F(u, "class", "rangeLabel svelte-1db7zzs"),
            F(t, "class", "gbSettingsComp");
        },
        m(e, l) {
          C(e, t, l),
            b(t, n),
            b(t, s),
            Te(a, t, null),
            b(t, r),
            b(t, o),
            Te(i, o, null),
            b(t, c),
            b(t, u),
            b(u, d),
            (p = !0);
        },
        p(e, [t]) {
          const n = {};
          !l && 2 & t && ((l = !0), (n.values = e[1]), re(() => (l = !1))),
            a.$set(n),
            (!p || 1 & t) && h !== (h = e[0].madCutoff + "") && R(d, h);
        },
        i(e) {
          p || (ye(a.$$.fragment, e), ye(i.$$.fragment, e), (p = !0));
        },
        o(e) {
          we(a.$$.fragment, e), we(i.$$.fragment, e), (p = !1);
        },
        d(e) {
          e && T(t), Se(a), Se(i);
        },
      }
    );
  }
  function Fn(e, t, n) {
    let { values: s } = t,
      a = [s.madCutoff];
    return (
      (e.$$set = (e) => {
        "values" in e && n(0, (s = e.values));
      }),
      (e.$$.update = () => {
        2 & e.$$.dirty && n(0, ([s.madCutoff] = a), s);
      }),
      [
        s,
        a,
        function (e) {
          (a = e), n(1, a);
        },
      ]
    );
  }
  class Rn extends qe {
    constructor(e) {
      super(), Me(this, e, Fn, Hn, o, { values: 0 });
    }
  }
  function Wn(e) {
    let t, n;
    return (
      (t = new Rn({ props: { values: e[0] } })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          1 & n && (s.values = e[0]), t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function An(e) {
    let t, n;
    return (
      (t = new Ln({ props: { values: e[0] } })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          1 & n && (s.values = e[0]), t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function On(e) {
    let t, n;
    return (
      (t = new jn({ props: { values: e[0] } })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          1 & n && (s.values = e[0]), t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function Dn(e) {
    let t, n;
    return (
      (t = new Mn({ props: { values: e[0] } })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          1 & n && (s.values = e[0]), t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function Qn(e) {
    let t, n, s, a, r, o, i, c, u, d, p, h, m, g, f, v, y, w, $, x, k, S, q, _;
    const z = [Dn, On, An, Wn],
      H = [];
    function R(e, t) {
      return "Ganbarometer" === e[1]
        ? 0
        : "Reviews" === e[1]
        ? 1
        : "Appearance" === e[1]
        ? 2
        : "Advanced" === e[1]
        ? 3
        : -1;
    }
    return (
      ~(x = R(e)) && (k = H[x] = z[x](e)),
      {
        c() {
          (t = M("form")),
            (n = M("h1")),
            (n.textContent = "Ganbarometer Settings"),
            (s = j()),
            (a = M("div")),
            (r = M("nav")),
            (o = M("li")),
            (o.textContent = "Ganbarometer"),
            (i = j()),
            (c = M("li")),
            (c.textContent = "Speed/Reviews"),
            (u = j()),
            (d = M("li")),
            (d.textContent = "Appearance"),
            (p = j()),
            (h = M("li")),
            (h.textContent = "Advanced"),
            (m = j()),
            (g = M("div")),
            (f = M("button")),
            (f.textContent = "Defaults"),
            (v = j()),
            (y = M("button")),
            (y.textContent = "Save"),
            (w = j()),
            ($ = M("div")),
            k && k.c(),
            F(n, "class", "title svelte-1pcd8t0"),
            F(o, "aria-label", "Ganbarometer"),
            F(o, "class", "svelte-1pcd8t0"),
            D(o, "active", "Ganbarometer" === e[1]),
            F(c, "aria-label", "Speed/Reviews"),
            F(c, "class", "svelte-1pcd8t0"),
            D(c, "active", "Reviews" === e[1]),
            F(d, "aria-label", "Appearance"),
            F(d, "class", "svelte-1pcd8t0"),
            D(d, "active", "Appearance" === e[1]),
            F(h, "aria-label", "Advanced"),
            F(h, "class", "svelte-1pcd8t0"),
            D(h, "active", "Advanced" === e[1]),
            F(r, "class", "nav svelte-1pcd8t0"),
            F(f, "class", "defaultButton svelte-1pcd8t0"),
            F(y, "type", "submit"),
            F(y, "class", "svelte-1pcd8t0"),
            F(g, "class", "actions"),
            F(a, "class", "menu svelte-1pcd8t0"),
            F($, "class", "formInputs svelte-1pcd8t0"),
            F(t, "aria-label", "Settings Form"),
            F(t, "class", "settingsForm svelte-1pcd8t0");
        },
        m(l, k) {
          C(l, t, k),
            b(t, n),
            b(t, s),
            b(t, a),
            b(a, r),
            b(r, o),
            b(r, i),
            b(r, c),
            b(r, u),
            b(r, d),
            b(r, p),
            b(r, h),
            b(a, m),
            b(a, g),
            b(g, f),
            b(g, v),
            b(g, y),
            b(t, w),
            b(t, $),
            ~x && H[x].m($, null),
            (S = !0),
            q ||
              ((_ = [
                I(o, "click", e[4]("Ganbarometer")),
                I(c, "click", e[4]("Reviews")),
                I(d, "click", e[4]("Appearance")),
                I(h, "click", e[4]("Advanced")),
                I(f, "click", L(e[3])),
                I(t, "submit", L(e[2])),
              ]),
              (q = !0));
        },
        p(e, [t]) {
          2 & t && D(o, "active", "Ganbarometer" === e[1]),
            2 & t && D(c, "active", "Reviews" === e[1]),
            2 & t && D(d, "active", "Appearance" === e[1]),
            2 & t && D(h, "active", "Advanced" === e[1]);
          let n = x;
          (x = R(e)),
            x === n
              ? ~x && H[x].p(e, t)
              : (k &&
                  (fe(),
                  we(H[n], 1, 1, () => {
                    H[n] = null;
                  }),
                  ve()),
                ~x
                  ? ((k = H[x]),
                    k ? k.p(e, t) : ((k = H[x] = z[x](e)), k.c()),
                    ye(k, 1),
                    k.m($, null))
                  : (k = null));
        },
        i(e) {
          S || (ye(k), (S = !0));
        },
        o(e) {
          we(k), (S = !1);
        },
        d(e) {
          e && T(t), ~x && H[x].d(), (q = !1), l(_);
        },
      }
    );
  }
  function En(e, t, n) {
    let s;
    u(e, et, (e) => n(6, (s = e)));
    let { modal: a } = t,
      l = Object.assign({}, s);
    let r = "Ganbarometer";
    return (
      (e.$$set = (e) => {
        "modal" in e && n(5, (a = e.modal));
      }),
      [
        l,
        r,
        () => {
          m(et, (s = Object.assign(Object.assign({}, s), l)), s), a.hide();
        },
        () => {
          n(0, (l = Object.assign({}, Je)));
        },
        (e) => () => n(1, (r = e)),
        a,
      ]
    );
  }
  class Gn extends qe {
    constructor(e) {
      super(), Me(this, e, En, Qn, o, { modal: 5 });
    }
  }
  function Nn(t) {
    let n, s, a;
    return {
      c() {
        (n = M("button")),
          (n.innerHTML =
            '<svg id="b76ee484-33fd-42f4-92f5-780eb817404e" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.6 297.7"><path d="M200.9,314.2l-43.7,27.5a15.4,15.4,0,0,1-21.2-4.8L31,169.9a15.4,15.4,0,0,1,4.8-21.2l57.1-35.9L144,80.7" transform="translate(-23.6 -51.3)" style="fill: none;stroke: var(--textColor);stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"></path><path d="M197.2,286.8,147.9,284a15.4,15.4,0,0,1-14.5-16.2l9.9-170.3.9-16.3.6-10.4a15.4,15.4,0,0,1,16.3-14.4l132,7.6a15.4,15.4,0,0,1,14.5,16.2l-.6,10" transform="translate(-23.6 -51.3)" style="fill: none;stroke: var(--textColor);stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"></path><path d="M200.9,314.2l.7,5.1a15.3,15.3,0,0,0,17.3,13.1L350,314.5a15.3,15.3,0,0,0,13.1-17.3L336.4,101.7a15.3,15.3,0,0,0-17.3-13.1L307,90.2,188,106.5a15.3,15.3,0,0,0-13.1,17.3l22.3,163Z" transform="translate(-23.6 -51.3)" style="fill: none;stroke: var(--textColor);stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"></path><path style="fill: var(--textColor); stroke: none;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px" d="M306.6,155.8c7.9-1.8,12.3.4,14.1,7.8l3.8,16.2c.6,2.5-.8,4.5-4.2,5.2s-5.3-.3-5.9-2.8L311,167.9c-.7-3.1-2.1-3.5-5.1-2.7l-90.6,21.4c-2.8.6-4,1.6-3.3,4.7l3.4,14.3c.6,2.5-1.1,4.5-4.1,5.2s-5.4-.3-5.9-2.8l-3.9-16.3c-1.7-7.3,1.1-11.3,9.1-13.2l14.6-3.5a151.7,151.7,0,0,0-11.7-10.7,3.8,3.8,0,0,1-1.3-1.9c-.4-1.5.4-3.2,2.2-4.3a10,10,0,0,1,2.5-1,5.2,5.2,0,0,1,4.6.8,144.6,144.6,0,0,1,14.9,14.5l19.7-4.7a110.2,110.2,0,0,0-10.9-12.4,3.6,3.6,0,0,1-1.2-1.7c-.4-1.7.6-3.4,2.6-4.6l2.1-.9a5,5,0,0,1,5,1.6,87.1,87.1,0,0,1,12.9,15.6l14.6-3.5a80.5,80.5,0,0,0,6.4-19.3,4.7,4.7,0,0,1,3.6-3.6,8.6,8.6,0,0,1,2.8-.1c2.5.2,3.9,1.3,4.3,3a2.8,2.8,0,0,1-.1,2,71.7,71.7,0,0,1-5.8,15.4Zm-60.2,94.6c-7.4,1.8-11.6-.4-13.2-7.3l-9.1-38.5c-1.7-7.2,1.2-10.8,9.2-12.7L292,178c8-1.9,12.3.1,14,7.2l9.1,38.5c1.6,6.9-1.1,10.7-8.6,12.5l-12.7,3,4,16.7c.7,3,2.1,3.9,4.2,3.7s6.5-1,13.1-2.6,9.9-2.3,12.1-3.5a6,6,0,0,0,3.7-4.1c.5-2.2.2-6-.6-11.4-.5-2.3.7-4.2,3.6-4.9l1.1-.3c3.4-.5,5.3,1.1,6,3.7v.3c1,6.2,1.2,13.7,0,17s-4,5.9-8,7.7-7.9,2.9-16.1,4.9-15.1,3.4-18.6,3.5c-5.1,0-8.9-2.1-10.4-8.3l-4.7-19.9-17.5,4.2c.3,19.7-14,33.8-37.1,43.2a3.1,3.1,0,0,1-1.2.5,5.2,5.2,0,0,1-6.4-3.2,3.5,3.5,0,0,1-.5-1.3c-.6-2.6.7-4.7,3.2-5.7,20-7.7,30.7-17.5,31.1-31Zm51.5-56.1-1.3-5.8c-.6-2.5-2-2.9-4.5-2.3l-55.2,13c-2.5.6-3.5,1.6-3,4.1l1.4,5.8Zm3.9,16.5-2.1-8.9-62.6,14.8,2.1,8.9ZM241,233.2l1.6,6.6c.6,2.5,2,2.9,4.5,2.3l55.1-13c2.5-.6,3.6-1.6,3-4.1l-1.6-6.6Z" transform="translate(-23.6 -51.3)"></path></svg>'),
          F(n, "class", "quiz-button svelte-o42zy6");
      },
      m(e, l) {
        C(e, n, l), s || ((a = I(n, "click", t[0])), (s = !0));
      },
      p: e,
      i: e,
      o: e,
      d(e) {
        e && T(n), (s = !1), a();
      },
    };
  }
  function Pn(e) {
    return [
      function (t) {
        K.call(this, e, t);
      },
    ];
  }
  class Vn extends qe {
    constructor(e) {
      super(), Me(this, e, Pn, Nn, o, {});
    }
  }
  function Bn(t) {
    let n, s, a;
    return {
      c() {
        (n = M("button")),
          (n.innerHTML =
            '<svg id="edd52277-873a-4c78-9f5a-11032a27aff1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297 292"><path d="M163.5,98h180m-287,0h30m226,102h31m-287,0h179m-72,102h180m-287,0h30m77-204.5A38.5,38.5,0,1,0,125,136,38.5,38.5,0,0,0,163.5,97.5ZM125,264a38.5,38.5,0,1,0,38.5,38.5A38.5,38.5,0,0,0,125,264ZM274,161a38.5,38.5,0,1,0,38.5,38.5A38.5,38.5,0,0,0,274,161Z" transform="translate(-51.5 -54)" style="fill: none;stroke: var(--textColor);stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"></path></svg>'),
          F(n, "aria-label", "settings"),
          F(n, "class", "settings svelte-1jfd1ka");
      },
      m(e, l) {
        C(e, n, l), s || ((a = I(n, "click", t[0])), (s = !0));
      },
      p: e,
      i: e,
      o: e,
      d(e) {
        e && T(n), (s = !1), a();
      },
    };
  }
  function Zn(e) {
    return [
      function (t) {
        K.call(this, e, t);
      },
    ];
  }
  class Yn extends qe {
    constructor(e) {
      super(), Me(this, e, Zn, Bn, o, {});
    }
  }
  function Kn(e) {
    let t,
      n,
      s,
      a,
      l,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      _,
      z,
      I,
      L,
      H,
      R,
      W,
      A,
      O,
      D,
      Q,
      E,
      G,
      N,
      P,
      V,
      B,
      Z,
      Y,
      K,
      U,
      J,
      X,
      ee,
      te,
      ne,
      se,
      ae,
      le,
      re,
      oe,
      ie,
      ce,
      ue,
      de,
      pe,
      he,
      me,
      ge,
      fe,
      ve,
      $e,
      be,
      xe,
      ke,
      Me,
      qe,
      _e,
      je,
      ze,
      Ie,
      Le,
      He,
      Fe,
      Re,
      We,
      Ae,
      Oe,
      De,
      Qe,
      Ee,
      Ge,
      Ne,
      Pe,
      Ve,
      Be,
      Ze,
      Ye,
      Ke,
      Ue,
      Je,
      Xe,
      et,
      tt,
      nt,
      st,
      at,
      rt,
      ot,
      it,
      ct,
      ut,
      dt,
      ht,
      mt,
      gt,
      ft,
      vt,
      yt,
      wt,
      $t,
      bt,
      xt,
      kt,
      Ct,
      Tt,
      St,
      Mt,
      _t,
      jt,
      zt,
      It,
      Lt,
      Ht,
      Ft,
      Rt,
      Wt,
      At,
      Ot,
      Dt,
      Qt,
      Et,
      Gt,
      Nt,
      Pt,
      Vt,
      Bt,
      Zt,
      Yt,
      Kt,
      Ut,
      Jt,
      Xt,
      en,
      tn,
      nn,
      sn,
      an,
      ln,
      rn,
      on,
      cn,
      un,
      dn,
      pn,
      hn,
      mn,
      gn,
      fn,
      vn,
      yn,
      wn,
      $n,
      bn,
      xn,
      kn,
      Cn,
      Tn,
      Sn,
      Mn,
      qn,
      _n,
      jn,
      zn,
      In,
      Ln,
      Hn,
      Fn,
      Rn,
      Wn,
      An,
      On,
      Dn,
      Qn,
      En,
      Gn,
      Nn,
      Pn,
      Vn,
      Bn,
      Zn,
      Yn,
      Kn,
      Un,
      Jn,
      Xn,
      es,
      ts,
      ns,
      ss,
      as,
      ls,
      rs,
      os,
      is,
      cs,
      us,
      ds,
      ps,
      hs,
      ms,
      gs,
      fs,
      vs,
      ys,
      ws,
      $s,
      bs,
      xs,
      ks,
      Cs,
      Ts,
      Ss,
      Ms,
      qs,
      _s,
      js,
      zs,
      Is,
      Ls,
      Hs,
      Fs,
      Rs,
      Ws,
      As,
      Os;
    return (
      (v = new lt({})),
      (y = new pt({})),
      (w = new qt({})),
      (K = new lt({})),
      (Ze = new pt({})),
      (hn = new qt({})),
      {
        c() {
          (t = M("div")),
            (n = M("h1")),
            (n.textContent = "GanbarOmeter Help"),
            (s = j()),
            (a = M("hr")),
            (l = j()),
            (r = M("h2")),
            (r.textContent = "Table of contents"),
            (o = j()),
            (i = M("ul")),
            (i.innerHTML =
              '<li><a href="#Overview">Overview</a></li> \n<li><a href="#Navigation">Navigation</a></li> \n<li><a href="#GanbarOmeter">The GanbarOmeter</a></li> \n<li><a href="#Speed">The Speed gauge</a></li> \n<li><a href="#Reviews">The Reviews chart</a></li> \n<li><a href="#SRS">Wanikani’s Spaced Repetition System</a></li> \n<li><a href="#Howto">How the author uses this</a></li>'),
            (c = j()),
            (u = M("hr")),
            (d = j()),
            (p = M("h2")),
            (p.innerHTML = '<a name="Overview">Overview</a>'),
            (h = j()),
            (m = M("p")),
            (m.innerHTML =
              'This script displays two dial gauges and a bar chart on your Wanikani dashboard.\nThese “widgets” display distilled information from the <a href="https://docs.api.wanikani.com" rel="nofollow">Wanikani\nAPI</a> to help you manage your workload as you\nprogress through the levels.'),
            (g = j()),
            (f = M("div")),
            Ce(v.$$.fragment),
            Ce(y.$$.fragment),
            Ce(w.$$.fragment),
            ($ = j()),
            (x = M("p")),
            (x.textContent =
              "The widgets distill information from two data sources:"),
            (k = j()),
            (S = M("ol")),
            (S.innerHTML =
              '<li><p class="svelte-1c5a18w">Your queue of <em>assignments</em> (upcoming <em>reviews</em> already available or\nscheduled to become available up to 120 days in the future). Each assignment is\nfor an item in one of 8 possible SRS stages (stages 1-4 are named the “Apprentice”\nstages, stages 5-6 the “guru” stages, stage 7 the “master” stage, and stage 8 the\n“enlightened” stage).</p></li> \n<li><p class="svelte-1c5a18w"><em>Reviews</em> you’ve actually performed over the past few days. Review records\nare created whenever you’ve answered all questions (meaning and reading)\ncorrectly for an item. They contain the start time of the review (when the first\nquestion was displayed) as well as the number of incorrect answers.</p></li>'),
            (q = j()),
            (_ = M("p")),
            (_.innerHTML =
              "These displays help you better understand how well you’re meeting your\ngoals with respect to effort, speed, and accuracy. For those of us that <em>haven’t</em>\nyet reached level 60, they especially help you make better decisions regarding\nhow many <em>lessons</em> to perform each day."),
            (z = j()),
            (I = M("hr")),
            (L = j()),
            (H = M("h2")),
            (H.innerHTML = '<a name="Navigation">Navigation</a>'),
            (R = j()),
            (W = M("p")),
            (W.innerHTML =
              "Along the top-left you will see the <strong>Graphs</strong>, <strong>Data</strong>, and <strong>Help</strong> menu items. Since\nyou’re reading this, you’ve already discovered what the <strong>Help</strong> menu item does. The\n<strong>Data</strong> menu item replaces the graphical display with a text display of the\nunderlying data that the calculated values derive from. <strong>Graphs</strong> returns you to\nthe graphical display."),
            (A = j()),
            (O = M("p")),
            (O.innerHTML =
              'At the top-right you’ll see one or possibly two icons. The rightmost icon\nlaunches the <strong>Settings</strong> dialog. If you’ve installed the <a href="https://community.wanikani.com/t/userscript-self-study-quiz/13191" rel="nofollow">Self-study\nQuiz</a>,\nyou will also see an icon to launch it pre-configured to quiz you on\nitems in SRS stages 1 or 2 (the first half of the “Apprentice” category).'),
            (D = j()),
            (Q = M("p")),
            (Q.innerHTML =
              "You can specify in <strong>Settings</strong> whether you want to be quizzed on just one or\nany combination of radicals, kanji, or vocabulary items in the early apprentice\nstages."),
            (E = j()),
            (G = M("p")),
            (G.innerHTML =
              "The <strong>Settings</strong> dialog also lets you control the appearance: you can override\nthe colors for most of the design elements. Use the sample widgets at the top to\nevaluate your choices.  There is also a setting to indicate where you would like the\nwidgets to appear on your dashboard."),
            (N = j()),
            (P = M("hr")),
            (V = j()),
            (B = M("h2")),
            (B.innerHTML = '<a name="GanbarOmeter">The GanbarOmeter</a>'),
            (Z = j()),
            (Y = M("div")),
            Ce(K.$$.fragment),
            (U = j()),
            (J = M("p")),
            (J.innerHTML =
              "The GanbarOmeter displays a visual indication of the makeup of your assignment\nqueue. This gauge is most useful to users between, say, levels 5 and 55. It\ntries to tell you whether to do <em>more</em> or <em>fewer</em> lessons each day."),
            (X = j()),
            (ee = M("div")),
            (ee.innerHTML =
              '<p class="svelte-1c5a18w">Users on levels 1-5 should find it relatively easy to do all their lessons every day without\ncreating a huge number of reviews for themselves.  Users on advanced levels will\nalready know how to manage their workload.</p> \n<p class="svelte-1c5a18w">In particular, users who’ve reached level 60 will no longer see <em>any</em> new\nlessons (ignoring the new characters that Wanikani adds periodically) — they’ll\nonly be performing reviews, not lessons.  Level-60 users usually still have\nplenty of assignments for months in the future. The display may still prove\nuseful to them, but it won’t mean speed-up/slow-down on lessons!</p>'),
            (te = j()),
            (ne = M("h3")),
            (ne.textContent = "Reading the dial"),
            (se = j()),
            (ae = M("p")),
            (ae.textContent =
              "If you have a lot of items to study, the needle will move toward the\nright (多). If you have fewer assignments, the needle moves to the left (少)."),
            (le = j()),
            (re = M("p")),
            (re.innerHTML =
              "When the needle is within the highlighted area (between the target minimum and\ntarget maximum values from the <strong>Settings</strong> dialog) the center area displays the\n“Good” marker (良 by default). When it’s to the left of the green zone, it\ndisplays a “more lesson effort required” indication (努力). When it’s to the right, it\nsays to “take a break” from lessons (休)."),
            (oe = j()),
            (ie = M("h3")),
            (ie.textContent = "The data view"),
            (ce = j()),
            (ue = M("p")),
            (ue.innerHTML =
              "When you click the <strong>Data</strong> menu item, the GanbarOmeter displays the number of\nassignments in each category of SRS stages, as well as the weighted total after\nperforming the complete calculation."),
            (de = j()),
            (pe = M("p")),
            (pe.textContent =
              "It also displays the GanbarOmeter value numerically (it can vary between -0.5\nand +0.5)."),
            (he = j()),
            (me = M("h3")),
            (me.textContent = "The calculation"),
            (ge = j()),
            (fe = M("p")),
            (fe.innerHTML =
              "The specific value displayed (from 0 to 100%) depends on the <strong>Settings</strong> a user\nhas stored. By default, it uses a variation of this common strategy:"),
            (ve = j()),
            ($e = M("blockquote")),
            ($e.innerHTML =
              '<p class="svelte-1c5a18w">Try to keep the sum of your apprentice items + 1/10 of guru items below 150.</p>'),
            (be = j()),
            (xe = M("h3")),
            (xe.textContent = "Configuring the target range"),
            (ke = j()),
            (Me = M("p")),
            (Me.innerHTML =
              "In the <strong>Settings</strong> dialog you can specify the desired target value (150 above).\nYou specify a target <em>range</em> of values (default: 130 to 170). This is a\nreasonable range for most people, but if you’re finding your daily reviews too\ndifficult, you might choose to lower the range (perhaps 80 to 120). Ambitious\nusers wanting to progress faster might choose to increase the range (at the risk\nof more difficult review sessions and potentially worse accuracy and retention)."),
            (qe = j()),
            (_e = M("h3")),
            (_e.textContent = "Configuring the weighting"),
            (je = j()),
            (ze = M("p")),
            (ze.textContent =
              "Advanced users may choose to modify how the value is calculated in addition to\nchanging the target range."),
            (Ie = j()),
            (Le = M("p")),
            (Le.textContent =
              "You accomplish this by assigning “weights” to items in various stages. The\ndefault settings assign a weight of 0.1 (1/10) to “guru” items per the common\nstrategy above, and ignore “master” and “enlightened” items by assigning them a\nweight of 0. A weight of 1 indicates an item should be treated normally, neither\nheavier nor lighter than any other."),
            (He = j()),
            (Fe = M("p")),
            (Fe.textContent =
              "One additional wrinkle is that “apprentice” items are further segregated into\n“early apprentice” (stages 1-2) and “late apprentice” (stages 3-4). Further, items in\nthe early apprentice stages can also be broken down by type: radical, kanji, or\nvocabulary."),
            (Re = j()),
            (We = M("p")),
            (We.textContent =
              "By default, early apprentice radicals only count as 0.6 of a “normal” item\nbecause they are easier to memorize (they only have a meaning, without\nany additional reading to memorize)."),
            (Ae = j()),
            (Oe = M("p")),
            (Oe.innerHTML =
              "Similarly, by default, early stage vocabulary items count normally (weight: 1.0)\nwhile early stage <em>kanji</em> count <strong>three times</strong> as heavily (weight: 3.0). This\nis because you won’t review vocabulary items until you’ve already “learned” the\nunderlying kanji (i.e. progressed them to guru stages or higher) while\nearly-stage kanji are mostly brand new and are much harder to memorize\n(requiring frequent, repeated reviews)."),
            (De = j()),
            (Qe = M("p")),
            (Qe.textContent =
              "It can quickly become overwhelming if you have too many early-stage kanji in\nyour assignment queue!"),
            (Ee = j()),
            (Ge = M("hr")),
            (Ne = j()),
            (Pe = M("h2")),
            (Pe.innerHTML = '<a name="Speed">The Speed gauge</a>'),
            (Ve = j()),
            (Be = M("div")),
            Ce(Ze.$$.fragment),
            (Ye = j()),
            (Ke = M("p")),
            (Ke.innerHTML =
              "The <strong>Graphs</strong> view of the speed gauge is <em>much</em> easier to explain. It displays how quickly you\nanswered every question on average in units of questions-per-minute (qpm). The\n<strong>Data</strong> view also shows units of seconds-per-question (spq)."),
            (Ue = j()),
            (Je = M("p")),
            (Je.textContent =
              "The graphic dial gauge is probably less useful than the Ganbarometer, but if,\nsay, you’ve noticed your accuracy dropping and the Speed gauge creeping higher\nand higher, you may want to consciously slow down during your reviews.\nAlternately, if your reviews seem to take forever you may want to push this dial\nhigher."),
            (Xe = j()),
            (et = M("p")),
            (et.innerHTML =
              "The data behind this single figure-of-merit is what’s most interesting. Click\nthe <strong>Data</strong> view and you’ll be presented with all sorts of useful information\nabout recent review sessions."),
            (tt = j()),
            (nt = M("h3")),
            (nt.textContent = "Data View"),
            (st = j()),
            (at = M("p")),
            (at.innerHTML =
              "The data view for the <strong>Speed</strong> widget displays <em>session</em> information: the\nnumber of items (or “subjects”) studied in each session, the total number of\nquestions asked (both meaning and reading, as well as repeated questions for\nincorrect answers), and the overall accuracy (the percentage of questions\nanswered correctly)."),
            (rt = j()),
            (ot = M("p")),
            (ot.innerHTML =
              "A <em>session</em> is defined as a string of consecutive reviews. It’s common to do a\nstring of reviews in the morning and more in the afternoon or evening. Others\n(like the author) only do their reviews in one marathon session per day."),
            (it = j()),
            (ct = M("p")),
            (ct.innerHTML =
              "Unfortunately, the Wanikani API only logs the <em>start</em> time of each review (as\nwell as what radical/kanji/vocabulary was reviewed and the number of incorrect\nanswers). This means that it’s surprisingly difficult to know which reviews\nbelong together in a single session: was that 2.3 minute gap between reviews\nbecause you were thinking hard trying to recall an item, or was it because you\ntook a phone call or made a cup of tea?"),
            (ut = j()),
            (dt = M("p")),
            (dt.innerHTML =
              "Worse, review records are only created when all questions (meaning and reading)\nare answered correctly. This means there might be a significant gap between\nstarting a review for an item and completing that review: <em>several questions\nfrom unrelated items might be asked between the meaning and reading questions\nfor the original item!</em>"),
            (ht = j()),
            (mt = M("p")),
            (mt.innerHTML =
              'This script uses a statistical technique called the <a href="https://en.wikipedia.org/wiki/Median_absolute_deviation" rel="nofollow">Median Absolute\nDeviation</a> to determine\nwhich reviews are part of the same session. Basically, the script determines the\ninterval between the start times of each review, and uses the MAD algorithm to\nfind “outliers” indicating the start of a new session.'),
            (gt = j()),
            (ft = M("p")),
            (ft.textContent =
              "The more reviews there are, the better this algorithm performs at correctly\nfinding sessions."),
            (vt = j()),
            (yt = M("h3")),
            (yt.textContent =
              "Note about questions vs. items (speed and accuracy)"),
            (wt = j()),
            ($t = M("p")),
            ($t.innerHTML =
              "This data section displays the speed and accuracy with answering <em>questions</em>."),
            (bt = j()),
            (xt = M("p")),
            (xt.innerHTML =
              "Each radical review record indicates at least one question plus repeated\nquestions for each incorrect answer. Kanji and vocabulary reviews involve at\nleast <em>two</em> questions (reading and meaning) plus additional questions for each\nincorrect answer."),
            (kt = j()),
            (Ct = M("p")),
            (Ct.textContent =
              "The total session duration is the time in seconds between the first and last\nreviews in a session. The speed (in seconds-per-question) is that number divided\nby the total number of questions in the session."),
            (Tt = j()),
            (St = M("p")),
            (St.textContent =
              "The questions-per-minute value is 60 divided by the seconds-per-question value."),
            (Mt = j()),
            (_t = M("p")),
            (_t.textContent =
              "Similarly, accuracy is the total number of correct answers in the session\ndivided by the total number of questions."),
            (jt = j()),
            (zt = M("p")),
            (zt.innerHTML =
              "Note that <em>item</em> accuracy (as reported in the Reviews section) is quite\ndifferent. Item accuracy is the ratio of items where all questions (reading and\nmeaning) were answered correctly <em>the first time</em> divided by the total number of\nitems."),
            (It = j()),
            (Lt = M("p")),
            (Lt.textContent =
              "Question accuracy is always a larger percentage than item accuracy."),
            (Ht = j()),
            (Ft = M("h3")),
            (Ft.textContent = "Note about the last review in a session"),
            (Rt = j()),
            (Wt = M("p")),
            (Wt.innerHTML =
              "Because the Wanikani API only logs <em>start</em> times of each review, there is no way\nto estimate the duration of the last review in each session. In particular, a\nsession with only one review has an indeterminate duration."),
            (At = j()),
            (Ot = M("p")),
            (Ot.textContent =
              "Say, for example, you started a review session one morning and:"),
            (Dt = j()),
            (Qt = M("ol")),
            (Qt.innerHTML =
              '<li><p class="svelte-1c5a18w">Correctly answered the reading for 大</p></li> \n<li><p class="svelte-1c5a18w">Missed the meaning of 小</p></li> \n<li><p class="svelte-1c5a18w">Correctly gave the reading for 小</p></li> \n<li><p class="svelte-1c5a18w">Correctly supplied the meaning for 大</p></li>'),
            (Et = j()),
            (Gt = M("p")),
            (Gt.textContent =
              "Then you were pulled away for some reason and unable to get back to your reviews\nfor several hours."),
            (Nt = j()),
            (Pt = M("p")),
            (Pt.textContent =
              "This would create exactly one review record for 大 (no record for 小 would be\ncreated because both questions haven’t been answered correctly yet)."),
            (Vt = j()),
            (Bt = M("p")),
            (Bt.textContent =
              "It might be hours or even days before you finish another review, but it wouldn’t\nbe sensible to say the duration of that review was hours or days."),
            (Zt = j()),
            (Yt = M("p")),
            (Yt.innerHTML =
              "Instead the script sets the duration of the last review in each session to the\n<strong>median</strong> duration between all review records. The median is a much better\nguess than the average since outlier values (minutes, hours, and days between\nsessions) will be ignored."),
            (Kt = j()),
            (Ut = M("p")),
            (Ut.textContent =
              "This works well in practice as long as dozens or hundreds of reviews are retrieved."),
            (Jt = j()),
            (Xt = M("h3")),
            (Xt.textContent = "Settings"),
            (en = j()),
            (tn = M("p")),
            (tn.innerHTML =
              "The first setting is the how far back (in days) you want to retrieve reviews for\nanalysis. This setting is shared with the <strong>Reviews</strong> widget. The minimum value\nis 1 day: all reviews performed since midnight yesterday. The maximum value is\n7: six full days plus any reviews performed today. The default value is 4."),
            (nn = j()),
            (sn = M("p")),
            (sn.textContent =
              "You can also specify your target speed range (from 1 question-per-minute at\nthe slow end, to 60 questions per minute or 1 question-per-second for\nstenographers). The default is 7 to 10 questions-per-minute (8.6 seconds per\nquestion to 6 seconds-per-question)."),
            (an = j()),
            (ln = M("p")),
            (ln.textContent =
              "Finally, there is an advanced setting for the MAD cutoff value (default: 10).\nYou should not need to change this, but lower values will likely find more sessions."),
            (rn = j()),
            (on = M("hr")),
            (cn = j()),
            (un = M("h2")),
            (un.innerHTML = '<a name="Reviews">Reviews</a>'),
            (dn = j()),
            (pn = M("div")),
            Ce(hn.$$.fragment),
            (mn = j()),
            (gn = M("p")),
            (gn.innerHTML =
              "The <strong>Reviews</strong> widget displays a bar graph of reviews over the retrieval\ninterval."),
            (fn = j()),
            (vn = M("p")),
            (vn.textContent =
              "For each day, it displays the total number of reviews performed, as well as the\npercentage of those reviews answered correctly the first time. (See the note\nabove about question vs. item accuracy.)"),
            (yn = j()),
            (wn = M("p")),
            (wn.textContent =
              "Hovering your mouse pointer over any of the bars will display the number of\nreviews and item accuracy for that day."),
            ($n = j()),
            (bn = M("p")),
            (bn.innerHTML =
              "The light green area in the background indicates the target range of\nreviews-per-day (rpd) as specified in the <strong>Settings</strong> (default: 120-180 rpd)."),
            (xn = j()),
            (kn = M("p")),
            (kn.innerHTML =
              'The dashed golden line indicate the “expected daily reviews” based on the\nassignment breakdown by SRS stage. It uses exactly the same heuristic as the\n<a href="https://community.wanikani.com/t/userscript-expected-daily-reviews/29206" rel="nofollow">Expected Daily\nReviews</a>\nscript.'),
            (Cn = j()),
            (Tn = M("p")),
            (Tn.textContent =
              "The “expected daily” heuristic assumes correct answers and an equal probability of\nseeing an item on a given day based on the intervals between SRS stages. An item\nin the “enlightened” stage, has an equal chance of being seen on any of the next\n120 days (since a correctly answered master item gets schedule 120 days in the future)."),
            (Sn = j()),
            (Mn = M("h3")),
            (Mn.textContent = "Data view"),
            (qn = j()),
            (_n = M("p")),
            (_n.textContent = "The data view is pretty simple."),
            (jn = j()),
            (zn = M("p")),
            (zn.textContent =
              "It shows the expected daily number of reviews (assuming correct answers and the\nsame SRS distribution as discussed above)."),
            (In = j()),
            (Ln = M("p")),
            (Ln.textContent =
              "It also shows the numeric values and accuracy percentages for each day retrieved."),
            (Hn = j()),
            (Fn = M("h3")),
            (Fn.textContent = "Settings"),
            (Rn = j()),
            (Wn = M("p")),
            (Wn.textContent =
              "The review gauge uses the same setting for the number of days worth of reviews\nto retrieve."),
            (An = j()),
            (On = M("p")),
            (On.textContent =
              "It also has a setting for the target range of daily review counts (the light\ngreen section on the graphical display)."),
            (Dn = j()),
            (Qn = M("hr")),
            (En = j()),
            (Gn = M("h2")),
            (Gn.innerHTML = '<a name="SRS">Thoughts about Wanikani’s SRS</a>'),
            (Nn = j()),
            (Pn = M("p")),
            (Pn.innerHTML =
              'Wanikani is a <a href="https://knowledge.wanikani.com/wanikani/srs/" rel="nofollow">Spaced Repetition\nSystem</a>. Most people tend to think\nthe <strong>main</strong> point of an SRS is to quiz you just before you’re about to forget something\n(the so-called “spacing effect”).'),
            (Vn = j()),
            (Bn = M("p")),
            (Bn.innerHTML =
              "That’s definitely part of it, but I’d argue the main point is even simpler: <strong>An\nSRS quizzes you on things you find <em>difficult</em> more often than items you find <em>easy.</em></strong>"),
            (Zn = j()),
            (Yn = M("p")),
            (Yn.innerHTML =
              "Not wasting time quizzing yourself on stuff you already know makes the process\n<em>much</em> more efficient. You want more reviews of the hard stuff, and fewer (and\nwider spaced) reviews of stuff you find easy."),
            (Kn = j()),
            (Un = M("p")),
            (Un.innerHTML =
              "There is one <em>extremely</em> important point about Wanikani’s SRS in particular that\npeople tend to forget, though:"),
            (Jn = j()),
            (Xn = M("p")),
            (Xn.innerHTML =
              "<strong>Wanikani only knows what you find difficult if you answer incorrectly!</strong>"),
            (es = j()),
            (ts = M("p")),
            (ts.textContent =
              "It’s human nature to feel bad about wrong answers, but it’s important to remind\nyourself that wrong answers are far more important than correct ones! Seriously:\nUsers above level 3 are literally paying for a service (more quizzes of\ndifficult items) that’s only activated by wrong answers."),
            (ns = j()),
            (ss = M("p")),
            (ss.innerHTML =
              'As you answer an item correctly <a href="https://knowledge.wanikani.com/wanikani/srs-stages/" rel="nofollow">it moves to later and later\nstages</a> and you’ll start to\nsee that item less frequently until it’s “burned” and you won’t see it (on\nWanikani!) again (so sad). Early stage items, though, show up every or almost\nevery day.'),
            (as = j()),
            (ls = M("p")),
            (ls.innerHTML =
              "The best way to use Wanikani is to perform two or three review sessions every\nsingle day. At a minimum, you <em>really</em> must try to get your available reviews\n(assignments) down to zero at least once every day."),
            (rs = j()),
            (os = M("p")),
            (os.innerHTML =
              "Since you must do your <em>reviews</em> every day, there are really only two things\nthat control how long it will take to get to level 60:"),
            (is = j()),
            (cs = M("ol")),
            (cs.innerHTML =
              '<li><p class="svelte-1c5a18w">How many <em>lessons</em> you do each day. This controls how many items will be made\navailable for <em>reviews</em>. Each lesson you complete adds an item you will be\nreviewing for months if not years in the future.</p></li> \n<li><p class="svelte-1c5a18w">How well you memorize and retain each item. The better you remember an item,\nthe less frequently you’ll have to review it. The minimum is 8\ncorrect-the-first-time answers for both meaning and reading in a row. Do that,\nand you’ll “burn” the item in a little over five months, but that is <strong>NOT</strong> the\ngoal unless you already know the item!</p></li>'),
            (us = j()),
            (ds = M("p")),
            (ds.textContent =
              "Some people find memorization easy. Most of us find it difficult. Regardless, #2\nis mostly out of our control. It can only be improved with sufficient sleep, no\nalcohol, proper attitude, focus, quiet and interruption-free workplaces, and\nother obviously impossible things like that."),
            (ps = j()),
            (hs = M("p")),
            (hs.innerHTML =
              "That means that <strong>the single most important “knob” under your control is how\nmany lessons you perform each day</strong>. The GanbarOmeter attempts to help you\nfigure out a pace that’s most appropriate for you personally."),
            (ms = j()),
            (gs = M("p")),
            (gs.innerHTML =
              "Some users want to get to level 60 as quickly and efficiently as possible. While\nthere is nothing wrong with this, the author is much more interested in learning\nto read all the items <em>well</em>, and without too much pain, no matter how long it\ntakes. I still seem to be on a roughly 3-or-so-years-to-60 pace which seems\namazingly quick and efficient to me."),
            (fs = j()),
            (vs = M("p")),
            (vs.textContent =
              "Since I wrote this script mostly for my own use, it will probably prove less\nuseful to speed demons, but the stats should be interesting regardless."),
            (ys = j()),
            (ws = M("hr")),
            ($s = j()),
            (bs = M("h2")),
            (bs.innerHTML = '<a name="Howto">How the author uses this</a>'),
            (xs = j()),
            (ks = M("p")),
            (ks.textContent =
              "I’ve made it a habit to do my reviews just once-per-day with my morning coffee."),
            (Cs = j()),
            (Ts = M("p")),
            (Ts.innerHTML =
              "The coffee is a trigger, a productivity hack. I’ve associated something I\nenjoy and do every day with my reviews. After just the first few weeks of\nreligiously doing my reviews as soon as I have my first a sip of coffee, I\nquickly reached the point where I couldn’t drink coffee without at least\n<em>thinking</em> about my daily reviews. This has made it much easier to keep up with\nmy reviews."),
            (Ss = j()),
            (Ms = M("p")),
            (Ms.innerHTML =
              "Because I only do one review session each day, though, I miss the reviews\nscheduled on 4-hour and 8-hour intervals (items in stages 1 and 2). In other\nwords, like many, <strong>I don’t get nearly enough reviews for early-stage items.</strong>"),
            (qs = j()),
            (_s = M("p")),
            (_s.innerHTML =
              'My solution was to install the <a href="https://community.wanikani.com/t/userscript-self-study-quiz/13191" rel="nofollow">Self-Study\nQuiz</a> and\nperform “extra” reviews each morning before doing my “real” reviews.'),
            (js = j()),
            (zs = M("h3")),
            (zs.textContent = "My routine"),
            (Is = j()),
            (Ls = M("p")),
            (Ls.textContent =
              "The default settings are, unsurprisingly, geared to my personal usage as\ndescribed below:"),
            (Hs = j()),
            (Fs = M("ol")),
            (Fs.innerHTML =
              '<li><p class="svelte-1c5a18w">Each morning I open up my dashboard (it’s usually still open in my browser, so I\njust refresh the page). I mostly ignore the widgets at this point, but I do at\nleast glance at it to see if anything jumps out.</p></li> \n<li><p class="svelte-1c5a18w">If I’m still early on a level and learning new kanji, I’ll click the self-study\nquiz icon before doing anything else. Once I’m toward the end of a level, I’m\nonly doing lessons for vocabulary items, so the early apprentice levels are\nalmost entirely vocabulary. I personally find vocabulary easier, so I don’t\nbother with self-study: once-per-day reviews for vocabulary seems to suffice for\nme.</p></li> \n<li><p class="svelte-1c5a18w">I really blast through the self-study quiz. If I don’t know an answer I give\nup quickly and easily, but I always press F1 to show the correct answer (trying\nto remember it for next time).</p></li> \n<li><p class="svelte-1c5a18w">At the end of the first pass through all the early stage items I’ll\ninvariably have missed several (it shows them on a summary page at the end of\nthe quiz). Next, I just hit the enter key and start another pass through all the\nitems (in a different random order).</p></li> \n<li><p class="svelte-1c5a18w">I’ll keep iterating, quizzing myself on all early stage items until I score\n100%. This usually takes between two and four passes, depending on how many\nitems there are. The default settings only quiz me on early-stage kanji because\nthat’s what I need the most extra reviews for.</p></li> \n<li><p class="svelte-1c5a18w">After several iterations of out-of-band self-study, I’ll finally start my\nproper reviews. I try hard to get through all my available reviews every single\nmorning.</p></li> \n<li><p class="svelte-1c5a18w">It usually takes me about 30 minutes to an hour to get through all 100 to 200\nor so available review items each day. Once I’ve completed my review session, I\nnavigate back to the dashboard and wait for the most recent reviews to load.</p></li> \n<li><p class="svelte-1c5a18w">Only now do I look at the graphical widgets, especially the GanbarOmeter and\nthe Reviews bar chart (my Speed stays pretty consistent these days). As long as\nthe GanbarOmeter is well under the right edge of the green zone I’ll then do at least\n5 <strong>lessons</strong>. If its below the minimum or well to the left of the target zone I\nmight do 10, 15, or even 20 lessons (almost never more).</p></li> \n<li><p class="svelte-1c5a18w">I also keep an eye on the “expected daily reviews” dashed line on my Reviews\nbar chart. If that starts creeping up too high, I’ll pull up the <a href="https://community.wanikani.com/t/userscript-wanikani-ultimate-timeline/10516" rel="nofollow">Ultimate\nTimeline</a>\nand look at assignments by SRS stage for the next 120 days to figure out what’s\ngoing on. The goal is to keep the average number of reviews scheduled each day\nwithin a reasonable range, without any huge peaks and valleys.</p></li> \n<li><p class="svelte-1c5a18w">Finally, after finishing both my reviews and my lessons, I’ll sometimes take\na peak at the Data view to see if there is anything interesting going on with my\nquestion accuracy during sessions.</p></li>'),
            (Rs = j()),
            (Ws = M("p")),
            (Ws.innerHTML =
              "All of this is <strong>much</strong> easier to do in practice than to write about!"),
            F(a, "class", "svelte-1c5a18w"),
            F(r, "class", "svelte-1c5a18w"),
            F(i, "class", "svelte-1c5a18w"),
            F(u, "class", "svelte-1c5a18w"),
            F(p, "class", "svelte-1c5a18w"),
            F(m, "class", "svelte-1c5a18w"),
            F(f, "class", "gbSample svelte-1c5a18w"),
            F(x, "class", "svelte-1c5a18w"),
            F(S, "class", "svelte-1c5a18w"),
            F(_, "class", "svelte-1c5a18w"),
            F(I, "class", "svelte-1c5a18w"),
            F(H, "class", "svelte-1c5a18w"),
            F(W, "class", "svelte-1c5a18w"),
            F(O, "class", "svelte-1c5a18w"),
            F(Q, "class", "svelte-1c5a18w"),
            F(G, "class", "svelte-1c5a18w"),
            F(P, "class", "svelte-1c5a18w"),
            F(B, "class", "svelte-1c5a18w"),
            F(Y, "class", "gbSample svelte-1c5a18w"),
            F(J, "class", "svelte-1c5a18w"),
            F(ee, "class", "aside svelte-1c5a18w"),
            F(ne, "class", "svelte-1c5a18w"),
            F(ae, "class", "svelte-1c5a18w"),
            F(re, "class", "svelte-1c5a18w"),
            F(ie, "class", "svelte-1c5a18w"),
            F(ue, "class", "svelte-1c5a18w"),
            F(pe, "class", "svelte-1c5a18w"),
            F(me, "class", "svelte-1c5a18w"),
            F(fe, "class", "svelte-1c5a18w"),
            F($e, "class", "svelte-1c5a18w"),
            F(xe, "class", "svelte-1c5a18w"),
            F(Me, "class", "svelte-1c5a18w"),
            F(_e, "class", "svelte-1c5a18w"),
            F(ze, "class", "svelte-1c5a18w"),
            F(Le, "class", "svelte-1c5a18w"),
            F(Fe, "class", "svelte-1c5a18w"),
            F(We, "class", "svelte-1c5a18w"),
            F(Oe, "class", "svelte-1c5a18w"),
            F(Qe, "class", "svelte-1c5a18w"),
            F(Ge, "class", "svelte-1c5a18w"),
            F(Pe, "class", "svelte-1c5a18w"),
            F(Be, "class", "gbSample svelte-1c5a18w"),
            F(Ke, "class", "svelte-1c5a18w"),
            F(Je, "class", "svelte-1c5a18w"),
            F(et, "class", "svelte-1c5a18w"),
            F(nt, "class", "svelte-1c5a18w"),
            F(at, "class", "svelte-1c5a18w"),
            F(ot, "class", "svelte-1c5a18w"),
            F(ct, "class", "svelte-1c5a18w"),
            F(dt, "class", "svelte-1c5a18w"),
            F(mt, "class", "svelte-1c5a18w"),
            F(ft, "class", "svelte-1c5a18w"),
            F(yt, "class", "svelte-1c5a18w"),
            F($t, "class", "svelte-1c5a18w"),
            F(xt, "class", "svelte-1c5a18w"),
            F(Ct, "class", "svelte-1c5a18w"),
            F(St, "class", "svelte-1c5a18w"),
            F(_t, "class", "svelte-1c5a18w"),
            F(zt, "class", "svelte-1c5a18w"),
            F(Lt, "class", "svelte-1c5a18w"),
            F(Ft, "class", "svelte-1c5a18w"),
            F(Wt, "class", "svelte-1c5a18w"),
            F(Ot, "class", "svelte-1c5a18w"),
            F(Qt, "class", "svelte-1c5a18w"),
            F(Gt, "class", "svelte-1c5a18w"),
            F(Pt, "class", "svelte-1c5a18w"),
            F(Bt, "class", "svelte-1c5a18w"),
            F(Yt, "class", "svelte-1c5a18w"),
            F(Ut, "class", "svelte-1c5a18w"),
            F(Xt, "class", "svelte-1c5a18w"),
            F(tn, "class", "svelte-1c5a18w"),
            F(sn, "class", "svelte-1c5a18w"),
            F(ln, "class", "svelte-1c5a18w"),
            F(on, "class", "svelte-1c5a18w"),
            F(un, "class", "svelte-1c5a18w"),
            F(pn, "class", "gbSample svelte-1c5a18w"),
            F(gn, "class", "svelte-1c5a18w"),
            F(vn, "class", "svelte-1c5a18w"),
            F(wn, "class", "svelte-1c5a18w"),
            F(bn, "class", "svelte-1c5a18w"),
            F(kn, "class", "svelte-1c5a18w"),
            F(Tn, "class", "svelte-1c5a18w"),
            F(Mn, "class", "svelte-1c5a18w"),
            F(_n, "class", "svelte-1c5a18w"),
            F(zn, "class", "svelte-1c5a18w"),
            F(Ln, "class", "svelte-1c5a18w"),
            F(Fn, "class", "svelte-1c5a18w"),
            F(Wn, "class", "svelte-1c5a18w"),
            F(On, "class", "svelte-1c5a18w"),
            F(Qn, "class", "svelte-1c5a18w"),
            F(Gn, "class", "svelte-1c5a18w"),
            F(Pn, "class", "svelte-1c5a18w"),
            F(Bn, "class", "svelte-1c5a18w"),
            F(Yn, "class", "svelte-1c5a18w"),
            F(Un, "class", "svelte-1c5a18w"),
            F(Xn, "class", "svelte-1c5a18w"),
            F(ts, "class", "svelte-1c5a18w"),
            F(ss, "class", "svelte-1c5a18w"),
            F(ls, "class", "svelte-1c5a18w"),
            F(os, "class", "svelte-1c5a18w"),
            F(cs, "class", "svelte-1c5a18w"),
            F(ds, "class", "svelte-1c5a18w"),
            F(hs, "class", "svelte-1c5a18w"),
            F(gs, "class", "svelte-1c5a18w"),
            F(vs, "class", "svelte-1c5a18w"),
            F(ws, "class", "svelte-1c5a18w"),
            F(bs, "class", "svelte-1c5a18w"),
            F(ks, "class", "svelte-1c5a18w"),
            F(Ts, "class", "svelte-1c5a18w"),
            F(Ms, "class", "svelte-1c5a18w"),
            F(_s, "class", "svelte-1c5a18w"),
            F(zs, "class", "svelte-1c5a18w"),
            F(Ls, "class", "svelte-1c5a18w"),
            F(Fs, "class", "svelte-1c5a18w"),
            F(Ws, "class", "svelte-1c5a18w"),
            F(t, "class", "helpWindow svelte-1c5a18w"),
            F(t, "data-testid", "help-window"),
            F(
              t,
              "style",
              (As = ` \n  --bgColor: ${e[0].bgColor}; \n  --trackColor: ${e[0].hlTrackColor}; \n  --textColor: ${e[0].textColor}; \n  --hlTextColor: ${e[0].hlTextColor}; \n  --fillColor: ${e[0].fillColor}; \n  --warnColor: ${e[0].warnColor}; \n  --hlTrackColor: ${e[0].trackColor}; \n`)
            );
        },
        m(e, T) {
          C(e, t, T),
            b(t, n),
            b(t, s),
            b(t, a),
            b(t, l),
            b(t, r),
            b(t, o),
            b(t, i),
            b(t, c),
            b(t, u),
            b(t, d),
            b(t, p),
            b(t, h),
            b(t, m),
            b(t, g),
            b(t, f),
            Te(v, f, null),
            Te(y, f, null),
            Te(w, f, null),
            b(t, $),
            b(t, x),
            b(t, k),
            b(t, S),
            b(t, q),
            b(t, _),
            b(t, z),
            b(t, I),
            b(t, L),
            b(t, H),
            b(t, R),
            b(t, W),
            b(t, A),
            b(t, O),
            b(t, D),
            b(t, Q),
            b(t, E),
            b(t, G),
            b(t, N),
            b(t, P),
            b(t, V),
            b(t, B),
            b(t, Z),
            b(t, Y),
            Te(K, Y, null),
            b(t, U),
            b(t, J),
            b(t, X),
            b(t, ee),
            b(t, te),
            b(t, ne),
            b(t, se),
            b(t, ae),
            b(t, le),
            b(t, re),
            b(t, oe),
            b(t, ie),
            b(t, ce),
            b(t, ue),
            b(t, de),
            b(t, pe),
            b(t, he),
            b(t, me),
            b(t, ge),
            b(t, fe),
            b(t, ve),
            b(t, $e),
            b(t, be),
            b(t, xe),
            b(t, ke),
            b(t, Me),
            b(t, qe),
            b(t, _e),
            b(t, je),
            b(t, ze),
            b(t, Ie),
            b(t, Le),
            b(t, He),
            b(t, Fe),
            b(t, Re),
            b(t, We),
            b(t, Ae),
            b(t, Oe),
            b(t, De),
            b(t, Qe),
            b(t, Ee),
            b(t, Ge),
            b(t, Ne),
            b(t, Pe),
            b(t, Ve),
            b(t, Be),
            Te(Ze, Be, null),
            b(t, Ye),
            b(t, Ke),
            b(t, Ue),
            b(t, Je),
            b(t, Xe),
            b(t, et),
            b(t, tt),
            b(t, nt),
            b(t, st),
            b(t, at),
            b(t, rt),
            b(t, ot),
            b(t, it),
            b(t, ct),
            b(t, ut),
            b(t, dt),
            b(t, ht),
            b(t, mt),
            b(t, gt),
            b(t, ft),
            b(t, vt),
            b(t, yt),
            b(t, wt),
            b(t, $t),
            b(t, bt),
            b(t, xt),
            b(t, kt),
            b(t, Ct),
            b(t, Tt),
            b(t, St),
            b(t, Mt),
            b(t, _t),
            b(t, jt),
            b(t, zt),
            b(t, It),
            b(t, Lt),
            b(t, Ht),
            b(t, Ft),
            b(t, Rt),
            b(t, Wt),
            b(t, At),
            b(t, Ot),
            b(t, Dt),
            b(t, Qt),
            b(t, Et),
            b(t, Gt),
            b(t, Nt),
            b(t, Pt),
            b(t, Vt),
            b(t, Bt),
            b(t, Zt),
            b(t, Yt),
            b(t, Kt),
            b(t, Ut),
            b(t, Jt),
            b(t, Xt),
            b(t, en),
            b(t, tn),
            b(t, nn),
            b(t, sn),
            b(t, an),
            b(t, ln),
            b(t, rn),
            b(t, on),
            b(t, cn),
            b(t, un),
            b(t, dn),
            b(t, pn),
            Te(hn, pn, null),
            b(t, mn),
            b(t, gn),
            b(t, fn),
            b(t, vn),
            b(t, yn),
            b(t, wn),
            b(t, $n),
            b(t, bn),
            b(t, xn),
            b(t, kn),
            b(t, Cn),
            b(t, Tn),
            b(t, Sn),
            b(t, Mn),
            b(t, qn),
            b(t, _n),
            b(t, jn),
            b(t, zn),
            b(t, In),
            b(t, Ln),
            b(t, Hn),
            b(t, Fn),
            b(t, Rn),
            b(t, Wn),
            b(t, An),
            b(t, On),
            b(t, Dn),
            b(t, Qn),
            b(t, En),
            b(t, Gn),
            b(t, Nn),
            b(t, Pn),
            b(t, Vn),
            b(t, Bn),
            b(t, Zn),
            b(t, Yn),
            b(t, Kn),
            b(t, Un),
            b(t, Jn),
            b(t, Xn),
            b(t, es),
            b(t, ts),
            b(t, ns),
            b(t, ss),
            b(t, as),
            b(t, ls),
            b(t, rs),
            b(t, os),
            b(t, is),
            b(t, cs),
            b(t, us),
            b(t, ds),
            b(t, ps),
            b(t, hs),
            b(t, ms),
            b(t, gs),
            b(t, fs),
            b(t, vs),
            b(t, ys),
            b(t, ws),
            b(t, $s),
            b(t, bs),
            b(t, xs),
            b(t, ks),
            b(t, Cs),
            b(t, Ts),
            b(t, Ss),
            b(t, Ms),
            b(t, qs),
            b(t, _s),
            b(t, js),
            b(t, zs),
            b(t, Is),
            b(t, Ls),
            b(t, Hs),
            b(t, Fs),
            b(t, Rs),
            b(t, Ws),
            (Os = !0);
        },
        p(e, [n]) {
          (!Os ||
            (1 & n &&
              As !==
                (As = ` \n  --bgColor: ${e[0].bgColor}; \n  --trackColor: ${e[0].hlTrackColor}; \n  --textColor: ${e[0].textColor}; \n  --hlTextColor: ${e[0].hlTextColor}; \n  --fillColor: ${e[0].fillColor}; \n  --warnColor: ${e[0].warnColor}; \n  --hlTrackColor: ${e[0].trackColor}; \n`))) &&
            F(t, "style", As);
        },
        i(e) {
          Os ||
            (ye(v.$$.fragment, e),
            ye(y.$$.fragment, e),
            ye(w.$$.fragment, e),
            ye(K.$$.fragment, e),
            ye(Ze.$$.fragment, e),
            ye(hn.$$.fragment, e),
            (Os = !0));
        },
        o(e) {
          we(v.$$.fragment, e),
            we(y.$$.fragment, e),
            we(w.$$.fragment, e),
            we(K.$$.fragment, e),
            we(Ze.$$.fragment, e),
            we(hn.$$.fragment, e),
            (Os = !1);
        },
        d(e) {
          e && T(t), Se(v), Se(y), Se(w), Se(K), Se(Ze), Se(hn);
        },
      }
    );
  }
  function Un(e, t, n) {
    let s;
    return u(e, et, (e) => n(0, (s = e))), [s];
  }
  class Jn extends qe {
    constructor(e) {
      super(), Me(this, e, Un, Kn, o, {});
    }
  }
  const Xn = (e, t) =>
      e.getDate() === t.getDate() &&
      e.getMonth() === t.getMonth() &&
      e.getFullYear() === t.getFullYear(),
    es = (e) => {
      if (0 === e.length) return 0;
      const t = e.slice().sort((e, t) => e - t),
        n = Math.floor(t.length / 2);
      return t.length % 2 ? t[n] : (t[n - 1] + t[n]) / 2;
    },
    ts = (e) => {
      if (0 === e.length) return [];
      const t = es(e.map((e) => e.duration)),
        n = ((e) => {
          const t = e.map((e) => e.duration),
            n = Math.min(...t);
          if ((Math.max(...t), n > 6e5)) return t.map((e, t) => t);
          {
            const n = es(t),
              s = e.map((e) => Math.abs(e.duration - n)),
              a = 1.4826,
              l = es(s) * a,
              r = s.map((e) =>
                l > 0 ? Math.abs(e - n) / l : Math.abs(e - n) / n
              ),
              o = 10,
              i = r[r.length - 1] > o ? r : [...r.slice(0, -1), 999999];
            return e.map((e, t) => t).filter((e, t) => i[t] > o);
          }
        })(e),
        s = [0, ...n.map((e) => e + 1)].slice(0, -1),
        a = n.map((t, n) => ({ reviews: e.slice(s[n], t + 1) }));
      return (
        a.forEach((e) => {
          e.reviews[e.reviews.length - 1].duration = t;
        }),
        a.map((e) => ({
          questions: e.reviews.reduce((e, t) => e + t.questions, 0),
          reading_incorrect: e.reviews.reduce(
            (e, t) => e + t.reading_incorrect,
            0
          ),
          meaning_incorrect: e.reviews.reduce(
            (e, t) => e + t.meaning_incorrect,
            0
          ),
          startTime: e.reviews[0].started,
          endTime: e.reviews[e.reviews.length - 1].started,
          reviews: e.reviews,
        }))
      );
    };
  let ns;
  const ss = async (e) => {
      if (!ns || !ns[e]) {
        wkof.include("ItemData"), await wkof.ready("ItemData");
        let e = await wkof.ItemData.get_items();
        ns = await wkof.ItemData.get_index(e, "subject_id");
      }
      return ns[e];
    },
    as = (e) => ({
      subject_id: e.data.subject_id,
      started: new Date(e.data.created_at),
      duration: 0,
      reading_incorrect: +e.data.incorrect_reading_answers,
      meaning_incorrect: +e.data.incorrect_meaning_answers,
      questions: 0,
    }),
    ls = (e, t, n) => {
      if (n[t + 1]) {
        const s = n[t + 1].started.getTime(),
          a = e.started.getTime();
        if (s < a) throw "Reviews not in sequential creation order!";
        return Object.assign(Object.assign({}, e), { duration: s - a });
      }
      return e;
    },
    rs = (e, t) => {
      var n, s;
      return (
        new Date(
          null === (n = null == e ? void 0 : e.data) || void 0 === n
            ? void 0
            : n.created_at
        ).getTime() -
        new Date(
          null === (s = null == t ? void 0 : t.data) || void 0 === s
            ? void 0
            : s.created_at
        ).getTime()
      );
    },
    os = async (e) => {
      if (!(null == e ? void 0 : e.length)) return [];
      const t = e.map(as).map(ls),
        n = await (async (e) => {
          let t = e.slice();
          for (let e of t) {
            const t = await ss(+e.subject_id);
            (e.questions = "radical" === t.object ? 1 : 2),
              (e.questions += e.meaning_incorrect + e.reading_incorrect);
          }
          return t;
        })(t);
      let s = n.slice(0, -1).map((e) => e.duration),
        a = es(s);
      return n.length && (n[n.length - 1].duration = a), n;
    },
    is = async (e) => {
      const t = ((e = 0) => {
        const t = new Date();
        let n,
          s =
            t.getTime() -
            3600 * t.getHours() * 1e3 -
            60 * t.getMinutes() * 1e3 -
            1e3 * t.getSeconds() -
            t.getMilliseconds();
        return (
          (n = e > 1 ? new Date(s - 24 * (e - 1) * 3600 * 1e3) : new Date(s)), n
        );
      })(e);
      wkof.include("Apiv2"), await wkof.ready("Apiv2");
      const n = await wkof.Apiv2.fetch_endpoint("reviews", {
          last_update: t.toISOString(),
        }),
        s =
          null == n
            ? void 0
            : n.data
                .filter((e) => {
                  var n;
                  return (
                    new Date(
                      null === (n = null == e ? void 0 : e.data) || void 0 === n
                        ? void 0
                        : n.created_at
                    ).getTime() >= t.getTime()
                  );
                })
                .sort(rs);
      return os(s);
    },
    cs = /[a-zA-Z]/,
    us = (e, t = 0) => [...Array(e).keys()].map((e) => e + t);
  function ds(e, t, n) {
    const s = e.slice();
    return (s[6] = t[n]), s;
  }
  function ps(e) {
    let t;
    return {
      c() {
        (t = M("div")),
          F(t, "class", "dot svelte-14w6xk7"),
          A(t, "--dotSize", 0.25 * +e[3] + e[1]),
          A(t, "--color", e[0]),
          A(t, "animation-delay", e[6] * (+e[5] / 10) + e[4]);
      },
      m(e, n) {
        C(e, t, n);
      },
      p(e, n) {
        10 & n && A(t, "--dotSize", 0.25 * +e[3] + e[1]),
          1 & n && A(t, "--color", e[0]);
      },
      d(e) {
        e && T(t);
      },
    };
  }
  function hs(t) {
    let n,
      s = us(3, 1),
      a = [];
    for (let e = 0; e < s.length; e += 1) a[e] = ps(ds(t, s, e));
    return {
      c() {
        n = M("div");
        for (let e = 0; e < a.length; e += 1) a[e].c();
        F(n, "class", "wrapper svelte-14w6xk7"),
          A(n, "--size", t[3] + t[1]),
          A(n, "--duration", t[2]);
      },
      m(e, t) {
        C(e, n, t);
        for (let e = 0; e < a.length; e += 1) a[e].m(n, null);
      },
      p(e, [t]) {
        if (59 & t) {
          let l;
          for (s = us(3, 1), l = 0; l < s.length; l += 1) {
            const r = ds(e, s, l);
            a[l] ? a[l].p(r, t) : ((a[l] = ps(r)), a[l].c(), a[l].m(n, null));
          }
          for (; l < a.length; l += 1) a[l].d(1);
          a.length = s.length;
        }
        10 & t && A(n, "--size", e[3] + e[1]),
          4 & t && A(n, "--duration", e[2]);
      },
      i: e,
      o: e,
      d(e) {
        e && T(n), S(a, e);
      },
    };
  }
  function ms(e, t, n) {
    let { color: s = "#FF3E00" } = t,
      { unit: a = "px" } = t,
      { duration: l = "0.6s" } = t,
      { size: r = "60" } = t,
      o = l.match(cs)[0],
      i = l.replace(cs, "");
    return (
      (e.$$set = (e) => {
        "color" in e && n(0, (s = e.color)),
          "unit" in e && n(1, (a = e.unit)),
          "duration" in e && n(2, (l = e.duration)),
          "size" in e && n(3, (r = e.size));
      }),
      [s, a, l, r, o, i]
    );
  }
  class gs extends qe {
    constructor(e) {
      super(),
        Me(this, e, ms, hs, o, { color: 0, unit: 1, duration: 2, size: 3 });
    }
  }
  function fs(e) {
    let t, n, s, a;
    return (
      (n = new gs({
        props: { color: e[0].warnColor, size: "25", unit: "px" },
      })),
      {
        c() {
          (t = M("div")),
            Ce(n.$$.fragment),
            F(t, "class", "spinner svelte-gz2cid");
        },
        m(e, s) {
          C(e, t, s), Te(n, t, null), (a = !0);
        },
        p(e, t) {
          const s = {};
          1 & t && (s.color = e[0].warnColor), n.$set(s);
        },
        i(e) {
          a ||
            (ye(n.$$.fragment, e),
            le(() => {
              s || (s = xe(t, We, {}, !0)), s.run(1);
            }),
            (a = !0));
        },
        o(e) {
          we(n.$$.fragment, e),
            s || (s = xe(t, We, {}, !1)),
            s.run(0),
            (a = !1);
        },
        d(e) {
          e && T(t), Se(n), e && s && s.end();
        },
      }
    );
  }
  function vs(t) {
    let n, s;
    return (
      (n = new Vn({})),
      n.$on("click", t[4]),
      {
        c() {
          Ce(n.$$.fragment);
        },
        m(e, t) {
          Te(n, e, t), (s = !0);
        },
        p: e,
        i(e) {
          s || (ye(n.$$.fragment, e), (s = !0));
        },
        o(e) {
          we(n.$$.fragment, e), (s = !1);
        },
        d(e) {
          Se(n, e);
        },
      }
    );
  }
  function ys(e) {
    let t, n;
    return (
      (t = new Gn({ props: { modal: bs } })),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        p(e, n) {
          const s = {};
          0 & n && (s.modal = bs), t.$set(s);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function ws(e) {
    let t, n;
    return (
      (t = new Jn({})),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function $s(e) {
    let t,
      n,
      s,
      a,
      r,
      o,
      i,
      c,
      u,
      d,
      p,
      h,
      m,
      g,
      f,
      v,
      y,
      w,
      $,
      x,
      k,
      S,
      q,
      _,
      z,
      H,
      R = e[1] && fs(e),
      W = e[2] && vs(e);
    return (
      (h = new Yn({})),
      h.$on("click", e[8]),
      (f = new lt({})),
      (y = new pt({})),
      ($ = new qt({})),
      (k = new It({
        props: { $$slots: { default: [ys] }, $$scope: { ctx: e } },
      })),
      e[9](k),
      (q = new It({
        props: { $$slots: { default: [ws] }, $$scope: { ctx: e } },
      })),
      e[10](q),
      {
        c() {
          (t = M("div")),
            (n = M("nav")),
            (s = M("li")),
            (s.textContent = "Graphs"),
            (a = j()),
            (r = M("li")),
            (r.textContent = "Data"),
            (o = j()),
            (i = M("li")),
            (i.textContent = "Help"),
            (c = j()),
            R && R.c(),
            (u = j()),
            (d = M("div")),
            W && W.c(),
            (p = j()),
            Ce(h.$$.fragment),
            (m = j()),
            (g = M("div")),
            Ce(f.$$.fragment),
            (v = j()),
            Ce(y.$$.fragment),
            (w = j()),
            Ce($.$$.fragment),
            (x = j()),
            Ce(k.$$.fragment),
            (S = j()),
            Ce(q.$$.fragment),
            F(s, "class", "svelte-gz2cid"),
            D(s, "active", "chart" === e[3]),
            F(r, "class", "svelte-gz2cid"),
            D(r, "active", "data" === e[3]),
            F(i, "class", "svelte-gz2cid"),
            F(n, "class", "chart-data-nav svelte-gz2cid"),
            F(d, "class", "action-buttons svelte-gz2cid"),
            F(t, "class", "controls svelte-gz2cid"),
            F(g, "data-testid", "gbwidgets"),
            F(g, "class", "gbwidgets svelte-gz2cid");
        },
        m(l, T) {
          C(l, t, T),
            b(t, n),
            b(n, s),
            b(n, a),
            b(n, r),
            b(n, o),
            b(n, i),
            b(t, c),
            R && R.m(t, null),
            b(t, u),
            b(t, d),
            W && W.m(d, null),
            b(d, p),
            Te(h, d, null),
            C(l, m, T),
            C(l, g, T),
            Te(f, g, null),
            b(g, v),
            Te(y, g, null),
            b(g, w),
            Te($, g, null),
            C(l, x, T),
            Te(k, l, T),
            C(l, S, T),
            Te(q, l, T),
            (_ = !0),
            z ||
              ((H = [
                I(s, "click", L(e[5])),
                I(r, "click", L(e[6])),
                I(i, "click", L(e[7])),
              ]),
              (z = !0));
        },
        p(e, [n]) {
          8 & n && D(s, "active", "chart" === e[3]),
            8 & n && D(r, "active", "data" === e[3]),
            e[1]
              ? R
                ? (R.p(e, n), 2 & n && ye(R, 1))
                : ((R = fs(e)), R.c(), ye(R, 1), R.m(t, u))
              : R &&
                (fe(),
                we(R, 1, 1, () => {
                  R = null;
                }),
                ve()),
            e[2]
              ? W
                ? (W.p(e, n), 4 & n && ye(W, 1))
                : ((W = vs(e)), W.c(), ye(W, 1), W.m(d, p))
              : W &&
                (fe(),
                we(W, 1, 1, () => {
                  W = null;
                }),
                ve());
          const a = {};
          32768 & n && (a.$$scope = { dirty: n, ctx: e }), k.$set(a);
          const l = {};
          32768 & n && (l.$$scope = { dirty: n, ctx: e }), q.$set(l);
        },
        i(e) {
          _ ||
            (ye(R),
            ye(W),
            ye(h.$$.fragment, e),
            ye(f.$$.fragment, e),
            ye(y.$$.fragment, e),
            ye($.$$.fragment, e),
            ye(k.$$.fragment, e),
            ye(q.$$.fragment, e),
            (_ = !0));
        },
        o(e) {
          we(R),
            we(W),
            we(h.$$.fragment, e),
            we(f.$$.fragment, e),
            we(y.$$.fragment, e),
            we($.$$.fragment, e),
            we(k.$$.fragment, e),
            we(q.$$.fragment, e),
            (_ = !1);
        },
        d(n) {
          n && T(t),
            R && R.d(),
            W && W.d(),
            Se(h),
            n && T(m),
            n && T(g),
            Se(f),
            Se(y),
            Se($),
            n && T(x),
            e[9](null),
            Se(k, n),
            n && T(S),
            e[10](null),
            Se(q, n),
            (z = !1),
            l(H);
        },
      }
    );
  }
  let bs, xs, ks;
  function Cs(e, t, n) {
    let s, a, l, r, o;
    u(e, et, (e) => n(0, (a = e))),
      u(e, Ye, (e) => n(12, (l = e))),
      u(e, Ue, (e) => n(13, (r = e))),
      u(e, Ge, (e) => n(3, (o = e)));
    let i = !1;
    const c = async (e) => {
      let t;
      n(1, (i = !0));
      try {
        t = await is(e);
      } catch (e) {
        console.warn(e);
      }
      m(
        Ue,
        (r = ((e) => {
          const t = e
            .filter((t, n) => !(n > 0 && Xn(t.started, e[n - 1].started)))
            .map((e) => e.started)
            .map((t) => e.filter((e) => Xn(e.started, t)));
          let n = [];
          return (
            t.forEach((e, t) => {
              const s = e
                  .filter((e) => 0 === e.reading_incorrect)
                  .reduce((e, t) => e + 1, 0),
                a = e
                  .filter((e) => 0 === e.meaning_incorrect)
                  .reduce((e, t) => e + 1, 0),
                l = e
                  .filter(
                    (e) => e.meaning_incorrect + e.reading_incorrect === 0
                  )
                  .reduce((e, t) => e + 1, 0),
                r = e.reduce((e, t) => e + t.questions, 0),
                o = e.length,
                i = {
                  start: e[0].started,
                  end: e[e.length - 1].started,
                  review_count: e.length,
                  question_count: r,
                  accuracy: l / o,
                  reading_accuracy: s / o,
                  meaning_accuracy: a / o,
                };
              n.push(i);
            }),
            n
          );
        })(t)),
        r
      ),
        m(
          Ye,
          (l = ((e) => {
            const t = ts(e);
            let n = [];
            return (
              t.forEach((e) => {
                const t = e.reviews.reduce((e, t) => e + t.questions, 0),
                  s =
                    t -
                    e.reviews.reduce(
                      (e, t) => e + (t.meaning_incorrect + t.reading_incorrect),
                      0
                    ),
                  a = {
                    start: e.startTime,
                    end: e.endTime,
                    reviewCount: e.reviews.length,
                    questionCount: t,
                    correctAnswerCount: s,
                    duration: e.reviews.reduce((e, t) => e + t.duration, 0),
                  };
                n.push(a);
              }),
              n
            );
          })(t)),
          l
        ),
        n(1, (i = !1));
    };
    let d = !1;
    wkof.wait_state("ss_quiz", "ready").then(() => {
      "function" ==
        typeof (null === ss_quiz || void 0 === ss_quiz
          ? void 0
          : ss_quiz.open) && n(2, (d = !0));
    });
    return (
      (e.$$.update = () => {
        1 & e.$$.dirty && c(a.daysToReview),
          1 & e.$$.dirty &&
            (s =
              a.rQuiz && a.kQuiz && a.vQuiz
                ? "rad,kan,voc"
                : a.rQuiz && a.kQuiz && !a.vQuiz
                ? "rad,kan"
                : a.rQuiz && !a.kQuiz && a.vQuiz
                ? "rad,voc"
                : !a.rQuiz || a.kQuiz || a.vQuiz
                ? !a.rQuiz && a.kQuiz && a.vQuiz
                  ? "kan,voc"
                  : a.rQuiz || !a.kQuiz || a.vQuiz
                  ? a.rQuiz || a.kQuiz || !a.vQuiz
                    ? "rad,kan,voc"
                    : "voc"
                  : "kan"
                : "rad");
      }),
      [
        a,
        i,
        d,
        o,
        async () => {
          await wkof.wait_state("ss_quiz", "ready"),
            ss_quiz.open({
              ipreset: {
                name: `New ${s}`,
                content: {
                  wk_items: {
                    enabled: !0,
                    filters: {
                      srs: { enabled: !0, value: { appr1: !0, appr2: !0 } },
                      item_type: { enabled: !0, value: s },
                    },
                  },
                },
              },
            });
        },
        () => m(Ge, (o = "chart"), o),
        () => m(Ge, (o = "data"), o),
        () => xs.show(),
        () => bs.show(),
        function (e) {
          J[e ? "unshift" : "push"](() => {
            bs = e;
          });
        },
        function (e) {
          J[e ? "unshift" : "push"](() => {
            xs = e;
          });
        },
      ]
    );
  }
  class Ts extends qe {
    constructor(e) {
      super(), Me(this, e, Cs, $s, o, {});
    }
  }
  function Ss(t) {
    let n;
    return {
      c() {
        (n = M("div")),
          (n.innerHTML =
            '<h2>GanbarOmeter</h2>   \n    <p>The GanbarOmeter needs the Wankani Open Framework to be installed prior to use.</p>  \n    \n    <p>Please refer to the <a href="http://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549">WKOF\n    installation instructions.</a></p>'),
          F(n, "class", "placeholder svelte-3pkdxk");
      },
      m(e, t) {
        C(e, n, t);
      },
      i: e,
      o: e,
      d(e) {
        e && T(n);
      },
    };
  }
  function Ms(e) {
    let t, n;
    return (
      (t = new Ts({})),
      {
        c() {
          Ce(t.$$.fragment);
        },
        m(e, s) {
          Te(t, e, s), (n = !0);
        },
        i(e) {
          n || (ye(t.$$.fragment, e), (n = !0));
        },
        o(e) {
          we(t.$$.fragment, e), (n = !1);
        },
        d(e) {
          Se(t, e);
        },
      }
    );
  }
  function qs(e) {
    let t, n, s, a, l;
    const r = [Ms, Ss],
      o = [];
    return (
      (n = (function (e, t) {
        return e[1] ? 0 : 1;
      })(e)),
      (s = o[n] = r[n](e)),
      {
        c() {
          (t = M("section")),
            s.c(),
            F(t, "data-testid", "ganbarometer"),
            F(t, "class", "ganbarometer svelte-3pkdxk"),
            F(
              t,
              "style",
              (a = ` \n    --bgColor: ${e[0].bgColor}; \n    --trackColor: ${e[0].trackColor}; \n    --textColor: ${e[0].textColor}; \n    --hlTextColor: ${e[0].hlTextColor}; \n    --fillColor: ${e[0].fillColor}; \n    --warnColor: ${e[0].warnColor}; \n    --hlTrackColor: ${e[0].hlTrackColor}; \n  `)
            );
        },
        m(e, s) {
          C(e, t, s), o[n].m(t, null), (l = !0);
        },
        p(e, [n]) {
          (!l ||
            (1 & n &&
              a !==
                (a = ` \n    --bgColor: ${e[0].bgColor}; \n    --trackColor: ${e[0].trackColor}; \n    --textColor: ${e[0].textColor}; \n    --hlTextColor: ${e[0].hlTextColor}; \n    --fillColor: ${e[0].fillColor}; \n    --warnColor: ${e[0].warnColor}; \n    --hlTrackColor: ${e[0].hlTrackColor}; \n  `))) &&
            F(t, "style", a);
        },
        i(e) {
          l || (ye(s), (l = !0));
        },
        o(e) {
          we(s), (l = !1);
        },
        d(e) {
          e && T(t), o[n].d();
        },
      }
    );
  }
  function _s(e, t, n) {
    let s;
    u(e, et, (e) => n(0, (s = e)));
    let a = !!wkof;
    return [s, a];
  }
  et.subscribe((e) => (ks = e.position));
  const js = document.querySelector(".dashboard .span12");
  let zs = { target: js, anchor: null };
  switch (ks) {
    case "Top":
      zs.anchor = js.querySelector(".progress-and-forecast");
      break;
    case "Below Forecast":
      zs.anchor = js.querySelector(".srs-progress");
      break;
    case "Below SRS":
      zs.anchor = js.querySelector(".row");
      break;
    case "Below Panels":
      zs.anchor = js.querySelector(".row:last-of-type");
      break;
    default:
      zs.anchor = null;
  }
  const Is = new (class extends qe {
    constructor(e) {
      super(), Me(this, e, _s, qs, o, {});
    }
  })(zs);
  return Is;
})();
//# sourceMappingURL=bundle.user.js.map
