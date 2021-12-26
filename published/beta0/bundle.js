// ==UserScript==
// @name        ganbarometer-svelte
// @description Svelte version of the GanbarOmeter for Wanikani
// @namespace   https://github.com/wrex/
// @version     0.0.2
// @homepage    https://github.com/wrex/ganbarometer-svelte#readme
// @author      Rex Walters -- rw [at] pobox.com
// @license     MIT-0
// @resource    css https://raw.githubusercontent.com/wrex/ganbarometer-svelte/main/published/beta0/bundle.css
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @connect     github.com
// @run-at      document-idle
// @downloadURL https://raw.githubusercontent.com/wrex/ganbarometer-svelte/main/published/beta0/bundle.js
// @updateURL   https://raw.githubusercontent.com/wrex/ganbarometer-svelte/main/published/beta0/bundle.js
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
  function s(t) {
    return "function" == typeof t;
  }
  function i(t, e) {
    return t != t
      ? e == e
      : t !== e || (t && "object" == typeof t) || "function" == typeof t;
  }
  function a(e, n, r) {
    e.$$.on_destroy.push(
      (function (e, ...n) {
        if (null == e) return t;
        const r = e.subscribe(...n);
        return r.unsubscribe ? () => r.unsubscribe() : r;
      })(n, r)
    );
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
  const l = "undefined" != typeof window;
  let f = l ? () => window.performance.now() : () => Date.now(),
    d = l ? (t) => requestAnimationFrame(t) : t;
  const g = new Set();
  function p(t) {
    g.forEach((e) => {
      e.c(t) || (g.delete(e), e.f());
    }),
      0 !== g.size && d(p);
  }
  function m(t, e) {
    t.appendChild(e);
  }
  function h(t) {
    if (!t) return document;
    const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
    return e && e.host ? e : t.ownerDocument;
  }
  function v(t) {
    const e = w("style");
    return (
      (function (t, e) {
        m(t.head || t, e);
      })(h(t), e),
      e
    );
  }
  function y(t, e, n) {
    t.insertBefore(e, n || null);
  }
  function b(t) {
    t.parentNode.removeChild(t);
  }
  function $(t, e) {
    for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
  }
  function w(t) {
    return document.createElement(t);
  }
  function C(t) {
    return document.createElementNS("http://www.w3.org/2000/svg", t);
  }
  function x(t) {
    return document.createTextNode(t);
  }
  function N() {
    return x(" ");
  }
  function E(t, e, n, r) {
    return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
  }
  function _(t) {
    return function (e) {
      return e.preventDefault(), t.call(this, e);
    };
  }
  function S(t) {
    return function (e) {
      return e.stopPropagation(), t.call(this, e);
    };
  }
  function j(t, e, n) {
    null == n
      ? t.removeAttribute(e)
      : t.getAttribute(e) !== n && t.setAttribute(e, n);
  }
  function k(t) {
    return "" === t ? null : +t;
  }
  function O(t, e) {
    (e = "" + e), t.wholeText !== e && (t.data = e);
  }
  function W(t, e) {
    t.value = null == e ? "" : e;
  }
  function T(t, e, n, r) {
    t.style.setProperty(e, n, r ? "important" : "");
  }
  function F(t, e, n) {
    t.classList[n ? "add" : "remove"](e);
  }
  const D = new Set();
  let q,
    R = 0;
  function A(t, e, n, r, o, s, i, a = 0) {
    const u = 16.666 / r;
    let c = "{\n";
    for (let t = 0; t <= 1; t += u) {
      const r = e + (n - e) * s(t);
      c += 100 * t + `%{${i(r, 1 - r)}}\n`;
    }
    const l = c + `100% {${i(n, 1 - n)}}\n}`,
      f = `__svelte_${(function (t) {
        let e = 5381,
          n = t.length;
        for (; n--; ) e = ((e << 5) - e) ^ t.charCodeAt(n);
        return e >>> 0;
      })(l)}_${a}`,
      d = h(t);
    D.add(d);
    const g = d.__svelte_stylesheet || (d.__svelte_stylesheet = v(t).sheet),
      p = d.__svelte_rules || (d.__svelte_rules = {});
    p[f] ||
      ((p[f] = !0), g.insertRule(`@keyframes ${f} ${l}`, g.cssRules.length));
    const m = t.style.animation || "";
    return (
      (t.style.animation = `${
        m ? `${m}, ` : ""
      }${f} ${r}ms linear ${o}ms 1 both`),
      (R += 1),
      f
    );
  }
  function I(t, e) {
    const n = (t.style.animation || "").split(", "),
      r = n.filter(
        e ? (t) => t.indexOf(e) < 0 : (t) => -1 === t.indexOf("__svelte")
      ),
      o = n.length - r.length;
    o &&
      ((t.style.animation = r.join(", ")),
      (R -= o),
      R ||
        d(() => {
          R ||
            (D.forEach((t) => {
              const e = t.__svelte_stylesheet;
              let n = e.cssRules.length;
              for (; n--; ) e.deleteRule(n);
              t.__svelte_rules = {};
            }),
            D.clear());
        }));
  }
  function P(t) {
    q = t;
  }
  function M(t) {
    (function () {
      if (!q)
        throw new Error("Function called outside component initialization");
      return q;
    })().$$.on_destroy.push(t);
  }
  function z(t, e) {
    const n = t.$$.callbacks[e.type];
    n && n.slice().forEach((t) => t.call(this, e));
  }
  const L = [],
    K = [],
    U = [],
    V = [],
    B = Promise.resolve();
  let G = !1;
  function H(t) {
    U.push(t);
  }
  let X = !1;
  const J = new Set();
  function Y() {
    if (!X) {
      X = !0;
      do {
        for (let t = 0; t < L.length; t += 1) {
          const e = L[t];
          P(e), Z(e.$$);
        }
        for (P(null), L.length = 0; K.length; ) K.pop()();
        for (let t = 0; t < U.length; t += 1) {
          const e = U[t];
          J.has(e) || (J.add(e), e());
        }
        U.length = 0;
      } while (L.length);
      for (; V.length; ) V.pop()();
      (G = !1), (X = !1), J.clear();
    }
  }
  function Z(t) {
    if (null !== t.fragment) {
      t.update(), o(t.before_update);
      const e = t.dirty;
      (t.dirty = [-1]),
        t.fragment && t.fragment.p(t.ctx, e),
        t.after_update.forEach(H);
    }
  }
  let Q;
  function tt(t, e, n) {
    t.dispatchEvent(
      (function (t, e, n = !1) {
        const r = document.createEvent("CustomEvent");
        return r.initCustomEvent(t, n, !1, e), r;
      })(`${e ? "intro" : "outro"}${n}`)
    );
  }
  const et = new Set();
  let nt;
  function rt() {
    nt = { r: 0, c: [], p: nt };
  }
  function ot() {
    nt.r || o(nt.c), (nt = nt.p);
  }
  function st(t, e) {
    t && t.i && (et.delete(t), t.i(e));
  }
  function it(t, e, n, r) {
    if (t && t.o) {
      if (et.has(t)) return;
      et.add(t),
        nt.c.push(() => {
          et.delete(t), r && (n && t.d(1), r());
        }),
        t.o(e);
    }
  }
  const at = { duration: 0 };
  function ut(n, r, i, a) {
    let u = r(n, i),
      c = a ? 0 : 1,
      l = null,
      m = null,
      h = null;
    function v() {
      h && I(n, h);
    }
    function y(t, e) {
      const n = t.b - c;
      return (
        (e *= Math.abs(n)),
        {
          a: c,
          b: t.b,
          d: n,
          duration: e,
          start: t.start,
          end: t.start + e,
          group: t.group,
        }
      );
    }
    function b(r) {
      const {
          delay: s = 0,
          duration: i = 300,
          easing: a = e,
          tick: b = t,
          css: $,
        } = u || at,
        w = { start: f() + s, b: r };
      r || ((w.group = nt), (nt.r += 1)),
        l || m
          ? (m = w)
          : ($ && (v(), (h = A(n, c, r, i, s, a, $))),
            r && b(0, 1),
            (l = y(w, i)),
            H(() => tt(n, r, "start")),
            (function (t) {
              let e;
              0 === g.size && d(p),
                new Promise((n) => {
                  g.add((e = { c: t, f: n }));
                });
            })((t) => {
              if (
                (m &&
                  t > m.start &&
                  ((l = y(m, i)),
                  (m = null),
                  tt(n, l.b, "start"),
                  $ && (v(), (h = A(n, c, l.b, l.duration, 0, a, u.css)))),
                l)
              )
                if (t >= l.end)
                  b((c = l.b), 1 - c),
                    tt(n, l.b, "end"),
                    m || (l.b ? v() : --l.group.r || o(l.group.c)),
                    (l = null);
                else if (t >= l.start) {
                  const e = t - l.start;
                  (c = l.a + l.d * a(e / l.duration)), b(c, 1 - c);
                }
              return !(!l && !m);
            }));
    }
    return {
      run(t) {
        s(u)
          ? (Q ||
              ((Q = Promise.resolve()),
              Q.then(() => {
                Q = null;
              })),
            Q).then(() => {
              (u = u()), b(t);
            })
          : b(t);
      },
      end() {
        v(), (l = m = null);
      },
    };
  }
  function ct(t) {
    t && t.c();
  }
  function lt(t, e, r, i) {
    const { fragment: a, on_mount: u, on_destroy: c, after_update: l } = t.$$;
    a && a.m(e, r),
      i ||
        H(() => {
          const e = u.map(n).filter(s);
          c ? c.push(...e) : o(e), (t.$$.on_mount = []);
        }),
      l.forEach(H);
  }
  function ft(t, e) {
    const n = t.$$;
    null !== n.fragment &&
      (o(n.on_destroy),
      n.fragment && n.fragment.d(e),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []));
  }
  function dt(t, e) {
    -1 === t.$$.dirty[0] &&
      (L.push(t), G || ((G = !0), B.then(Y)), t.$$.dirty.fill(0)),
      (t.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
  }
  function gt(e, n, s, i, a, u, c, l = [-1]) {
    const f = q;
    P(e);
    const d = (e.$$ = {
      fragment: null,
      ctx: null,
      props: u,
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
      dirty: l,
      skip_bound: !1,
      root: n.target || f.$$.root,
    });
    c && c(d.root);
    let g = !1;
    if (
      ((d.ctx = s
        ? s(e, n.props || {}, (t, n, ...r) => {
            const o = r.length ? r[0] : n;
            return (
              d.ctx &&
                a(d.ctx[t], (d.ctx[t] = o)) &&
                (!d.skip_bound && d.bound[t] && d.bound[t](o), g && dt(e, t)),
              n
            );
          })
        : []),
      d.update(),
      (g = !0),
      o(d.before_update),
      (d.fragment = !!i && i(d.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const t = (function (t) {
          return Array.from(t.childNodes);
        })(n.target);
        d.fragment && d.fragment.l(t), t.forEach(b);
      } else d.fragment && d.fragment.c();
      n.intro && st(e.$$.fragment),
        lt(e, n.target, n.anchor, n.customElement),
        Y();
    }
    P(f);
  }
  class pt {
    $destroy() {
      ft(this, 1), (this.$destroy = t);
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
  function mt(t) {
    let e,
      n,
      r,
      o = (100 * t[0]).toFixed() + "";
    return {
      c() {
        (e = w("div")),
          (n = x(o)),
          (r = x("%")),
          j(e, "class", "gauge__cover svelte-bgxsre");
      },
      m(t, o) {
        y(t, e, o), m(e, n), m(e, r);
      },
      p(t, e) {
        1 & e && o !== (o = (100 * t[0]).toFixed() + "") && O(n, o);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function ht(t) {
    let e, n;
    return {
      c() {
        (e = w("div")),
          (n = x(t[1])),
          j(e, "class", "gauge__cover svelte-bgxsre");
      },
      m(t, r) {
        y(t, e, r), m(e, n);
      },
      p(t, e) {
        2 & e && O(n, t[1]);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function vt(e) {
    let n, r, o, s;
    function i(t, e) {
      return null !== t[1] ? ht : mt;
    }
    let a = i(e),
      u = a(e);
    return {
      c() {
        (n = w("div")),
          (r = w("div")),
          (o = w("div")),
          (s = N()),
          u.c(),
          j(o, "class", "gauge__fill svelte-bgxsre"),
          j(o, "style", e[2]),
          j(r, "class", "gauge__body svelte-bgxsre"),
          j(n, "class", "gauge svelte-bgxsre"),
          j(n, "data-testid", "gauge");
      },
      m(t, e) {
        y(t, n, e), m(n, r), m(r, o), m(r, s), u.m(r, null);
      },
      p(t, [e]) {
        4 & e && j(o, "style", t[2]),
          a === (a = i(t)) && u
            ? u.p(t, e)
            : (u.d(1), (u = a(t)), u && (u.c(), u.m(r, null)));
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), u.d();
      },
    };
  }
  function yt(t, e, n) {
    let r,
      { value: o = 0.5 } = e,
      { label: s = null } = e;
    return (
      (t.$$set = (t) => {
        "value" in t && n(0, (o = t.value)),
          "label" in t && n(1, (s = t.label));
      }),
      (t.$$.update = () => {
        1 & t.$$.dirty && n(2, (r = `transform: rotate(${o / 2}turn)`));
      }),
      [o, s, r]
    );
  }
  class bt extends pt {
    constructor(t) {
      super(), gt(this, t, yt, vt, i, { value: 0, label: 1 });
    }
  }
  const $t = [];
  function wt(e, n = t) {
    let r;
    const o = new Set();
    function s(t) {
      if (i(e, t) && ((e = t), r)) {
        const t = !$t.length;
        for (const t of o) t[1](), $t.push(t, e);
        if (t) {
          for (let t = 0; t < $t.length; t += 2) $t[t][0]($t[t + 1]);
          $t.length = 0;
        }
      }
    }
    return {
      set: s,
      update: function (t) {
        s(t(e));
      },
      subscribe: function (i, a = t) {
        const u = [i, a];
        return (
          o.add(u),
          1 === o.size && (r = n(s) || t),
          i(e),
          () => {
            o.delete(u), 0 === o.size && (r(), (r = null));
          }
        );
      },
    };
  }
  var Ct;
  const xt = "gbSettings",
    Nt = wt("chart"),
    Et = localStorage.getItem("daysToReview"),
    _t = wt(Et ? JSON.parse(Et) : 4);
  _t.subscribe((t) => {
    localStorage.setItem("daysToReview", JSON.stringify(t));
  });
  const St = (t) =>
      JSON.parse(t).map((t) =>
        Object.assign(Object.assign({}, t), {
          start: new Date(t.start),
          end: new Date(t.end),
        })
      ),
    jt = localStorage.getItem("apprenticeCounts"),
    kt = wt(
      jt
        ? JSON.parse(jt)
        : {
            radicals: [0, 0, 0, 0],
            kanji: [0, 0, 0, 0],
            vocabulary: [0, 0, 0, 0],
          }
    );
  kt.subscribe((t) => {
    localStorage.setItem("apprenticeCounts", JSON.stringify(t));
  });
  const Ot = localStorage.getItem("sessionSummaries"),
    Wt = wt(Ot ? St(Ot) : []);
  Wt.subscribe((t) => {
    localStorage.setItem("sessionSummaries", JSON.stringify(t));
  });
  const Tt = localStorage.getItem("reviewCounts"),
    Ft = wt(Tt ? St(Tt) : []);
  Ft.subscribe((t) => {
    localStorage.setItem("reviewCounts", JSON.stringify(t));
  });
  const Dt = {
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
    qt = wt(
      null !== (Ct = JSON.parse(localStorage.getItem(xt))) && void 0 !== Ct
        ? Ct
        : Dt
    );
  let Rt;
  qt.subscribe((t) => localStorage.setItem(xt, JSON.stringify(t)));
  const At = async (t) => {
      if (!Rt || !Rt[t]) {
        wkof.include("ItemData"), await wkof.ready("ItemData");
        let t = await wkof.ItemData.get_items();
        Rt = await wkof.ItemData.get_index(t, "subject_id");
      }
      return Rt[t];
    },
    It = async () => {
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
  function Pt(e) {
    let n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      E,
      _,
      S,
      k,
      W,
      T,
      F,
      D,
      q,
      R,
      A,
      I,
      P,
      M,
      z,
      L,
      K,
      U,
      V,
      B,
      G,
      H,
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
      st,
      it,
      at,
      ut,
      ct,
      lt,
      ft,
      dt = (100 * e[5]).toFixed() + "",
      gt = e[4].targetApprentice + "",
      pt = e[4].newRWeight + "",
      mt = e[4].newKWeight + "",
      ht = e[4].newVWeight + "",
      vt = (100 * e[6]).toFixed() + "",
      yt = (100 * e[5]).toFixed() + "";
    return {
      c() {
        (n = w("h1")),
          (r = x("GanbarOmeter: ")),
          (o = x(dt)),
          (s = x("%")),
          (i = N()),
          (a = w("div")),
          (u = w("table")),
          (c = w("tr")),
          (l = w("th")),
          (l.textContent = "Apprentice"),
          (f = N()),
          (d = w("td")),
          (g = x(e[0])),
          (p = N()),
          (h = w("span")),
          (v = x("target: ")),
          ($ = x(gt)),
          (C = N()),
          (E = w("tr")),
          (_ = w("th")),
          (_.textContent = "New"),
          (S = N()),
          (k = w("td")),
          (W = x(e[3])),
          (T = w("span")),
          (T.textContent = "r"),
          (F = N()),
          (D = x(e[2])),
          (q = w("span")),
          (q.textContent = "k"),
          (R = N()),
          (A = x(e[1])),
          (I = w("span")),
          (I.textContent = "v"),
          (P = N()),
          (M = w("tr")),
          (z = w("th")),
          (z.textContent = "Weights"),
          (L = N()),
          (K = w("td")),
          (U = x(pt)),
          (V = w("span")),
          (V.textContent = "r"),
          (B = N()),
          (G = x(mt)),
          (H = w("span")),
          (H.textContent = "k"),
          (X = N()),
          (J = x(ht)),
          (Y = w("span")),
          (Y.textContent = "v"),
          (Z = N()),
          (Q = w("tr")),
          (tt = w("th")),
          (tt.textContent = "Unweighted"),
          (et = N()),
          (nt = w("td")),
          (rt = x(vt)),
          (ot = w("span")),
          (ot.textContent = "%"),
          (st = N()),
          (it = w("tr")),
          (at = w("th")),
          (at.textContent = "Weighted"),
          (ut = N()),
          (ct = w("td")),
          (lt = x(yt)),
          (ft = w("span")),
          (ft.textContent = "%"),
          j(n, "class", "gbHeader"),
          j(h, "class", "secondary"),
          j(T, "class", "secondary"),
          j(q, "class", "secondary"),
          j(I, "class", "secondary"),
          j(V, "class", "secondary"),
          j(H, "class", "secondary"),
          j(Y, "class", "secondary"),
          j(ot, "class", "secondary"),
          j(ft, "class", "secondary"),
          j(u, "class", "gbContent"),
          j(a, "data-testid", "ganbarometer-table");
      },
      m(t, e) {
        y(t, n, e),
          m(n, r),
          m(n, o),
          m(n, s),
          y(t, i, e),
          y(t, a, e),
          m(a, u),
          m(u, c),
          m(c, l),
          m(c, f),
          m(c, d),
          m(d, g),
          m(d, p),
          m(d, h),
          m(h, v),
          m(h, $),
          m(u, C),
          m(u, E),
          m(E, _),
          m(E, S),
          m(E, k),
          m(k, W),
          m(k, T),
          m(k, F),
          m(k, D),
          m(k, q),
          m(k, R),
          m(k, A),
          m(k, I),
          m(u, P),
          m(u, M),
          m(M, z),
          m(M, L),
          m(M, K),
          m(K, U),
          m(K, V),
          m(K, B),
          m(K, G),
          m(K, H),
          m(K, X),
          m(K, J),
          m(K, Y),
          m(u, Z),
          m(u, Q),
          m(Q, tt),
          m(Q, et),
          m(Q, nt),
          m(nt, rt),
          m(nt, ot),
          m(u, st),
          m(u, it),
          m(it, at),
          m(it, ut),
          m(it, ct),
          m(ct, lt),
          m(ct, ft);
      },
      p(t, e) {
        32 & e && dt !== (dt = (100 * t[5]).toFixed() + "") && O(o, dt),
          1 & e && O(g, t[0]),
          16 & e && gt !== (gt = t[4].targetApprentice + "") && O($, gt),
          8 & e && O(W, t[3]),
          4 & e && O(D, t[2]),
          2 & e && O(A, t[1]),
          16 & e && pt !== (pt = t[4].newRWeight + "") && O(U, pt),
          16 & e && mt !== (mt = t[4].newKWeight + "") && O(G, mt),
          16 & e && ht !== (ht = t[4].newVWeight + "") && O(J, ht),
          64 & e && vt !== (vt = (100 * t[6]).toFixed() + "") && O(rt, vt),
          32 & e && yt !== (yt = (100 * t[5]).toFixed() + "") && O(lt, yt);
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), t && b(i), t && b(a);
      },
    };
  }
  function Mt(t) {
    let e, n, r, o, s, i;
    return (
      (r = new bt({ props: { value: t[5] } })),
      {
        c() {
          (e = w("h1")),
            (e.textContent = "GanbarOmeter"),
            (n = N()),
            ct(r.$$.fragment),
            (o = N()),
            (s = w("div")),
            (s.textContent = "of max difficulty"),
            j(e, "class", "gbHeader"),
            j(s, "class", "units");
        },
        m(t, a) {
          y(t, e, a), y(t, n, a), lt(r, t, a), y(t, o, a), y(t, s, a), (i = !0);
        },
        p(t, e) {
          const n = {};
          32 & e && (n.value = t[5]), r.$set(n);
        },
        i(t) {
          i || (st(r.$$.fragment, t), (i = !0));
        },
        o(t) {
          it(r.$$.fragment, t), (i = !1);
        },
        d(t) {
          t && b(e), t && b(n), ft(r, t), t && b(o), t && b(s);
        },
      }
    );
  }
  function zt(t) {
    let e, n, r, o;
    const s = [Mt, Pt],
      i = [];
    function a(t, e) {
      return "chart" === t[7] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = i[n] = s[n](t)),
      {
        c() {
          (e = w("div")), r.c(), j(e, "class", "gbWidget");
        },
        m(t, r) {
          y(t, e, r), i[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let u = n;
          (n = a(t)),
            n === u
              ? i[n].p(t, o)
              : (rt(),
                it(i[u], 1, 1, () => {
                  i[u] = null;
                }),
                ot(),
                (r = i[n]),
                r ? r.p(t, o) : ((r = i[n] = s[n](t)), r.c()),
                st(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (st(r), (o = !0));
        },
        o(t) {
          it(r), (o = !1);
        },
        d(t) {
          t && b(e), i[n].d();
        },
      }
    );
  }
  function Lt(t, e, n) {
    let r, o, s, i, u, c, l, f, d, g;
    return (
      a(t, qt, (t) => n(4, (f = t))),
      a(t, kt, (t) => n(9, (d = t))),
      a(t, Nt, (t) => n(7, (g = t))),
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
            n(2, (s = d.kanji.slice(0, 2).reduce((t, e) => t + e, 0))),
          512 & t.$$.dirty &&
            n(1, (i = d.vocabulary.slice(0, 2).reduce((t, e) => t + e, 0))),
          t.$$.dirty,
          31 & t.$$.dirty &&
            n(
              8,
              (u =
                r -
                o -
                s -
                i +
                o * f.newRWeight +
                s * f.newKWeight +
                i * f.newVWeight)
            ),
          17 & t.$$.dirty && n(6, (c = r / (2 * f.targetApprentice))),
          272 & t.$$.dirty && n(5, (l = u / (2 * f.targetApprentice)));
      }),
      It().then((t) => kt.set(t)),
      [r, i, s, o, f, l, c, g, u, d]
    );
  }
  class Kt extends pt {
    constructor(t) {
      super(), gt(this, t, Lt, zt, i, {});
    }
  }
  function Ut(t, e, n) {
    const r = t.slice();
    return (r[13] = e[n]), (r[15] = n), r;
  }
  function Vt(e) {
    let n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      C = e[1].length + "",
      E = e[1],
      _ = [];
    for (let t = 0; t < E.length; t += 1) _[t] = Gt(Ut(e, E, t));
    return {
      c() {
        (n = w("h1")),
          (r = x("Speed: ")),
          (o = x(e[3])),
          (s = x(" s/q")),
          (i = N()),
          (a = w("div")),
          (u = w("div")),
          (c = w("h4")),
          (l = x(C)),
          (f = x(" sessions • ")),
          (d = x(e[4])),
          (g = x(" items • ")),
          (p = x(e[0])),
          (h = x(" questions")),
          (v = N());
        for (let t = 0; t < _.length; t += 1) _[t].c();
        j(n, "class", "gbHeader"),
          j(c, "class", "svelte-sxcuj8"),
          j(u, "class", "gbContent scrollbox svelte-sxcuj8"),
          j(a, "data-testid", "speed-table");
      },
      m(t, e) {
        y(t, n, e),
          m(n, r),
          m(n, o),
          m(n, s),
          y(t, i, e),
          y(t, a, e),
          m(a, u),
          m(u, c),
          m(c, l),
          m(c, f),
          m(c, d),
          m(c, g),
          m(c, p),
          m(c, h),
          m(u, v);
        for (let t = 0; t < _.length; t += 1) _[t].m(u, null);
      },
      p(t, e) {
        if (
          (8 & e && O(o, t[3]),
          2 & e && C !== (C = t[1].length + "") && O(l, C),
          16 & e && O(d, t[4]),
          1 & e && O(p, t[0]),
          962 & e)
        ) {
          let n;
          for (E = t[1], n = 0; n < E.length; n += 1) {
            const r = Ut(t, E, n);
            _[n] ? _[n].p(r, e) : ((_[n] = Gt(r)), _[n].c(), _[n].m(u, null));
          }
          for (; n < _.length; n += 1) _[n].d(1);
          _.length = E.length;
        }
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), t && b(i), t && b(a), $(_, t);
      },
    };
  }
  function Bt(t) {
    let e, n, r, o, s, i;
    return (
      (r = new bt({ props: { value: t[2], label: t[3] } })),
      {
        c() {
          (e = w("h1")),
            (e.textContent = "Speed"),
            (n = N()),
            ct(r.$$.fragment),
            (o = N()),
            (s = w("div")),
            (s.textContent = "seconds/question"),
            j(e, "class", "gbHeader"),
            j(s, "class", "units");
        },
        m(t, a) {
          y(t, e, a), y(t, n, a), lt(r, t, a), y(t, o, a), y(t, s, a), (i = !0);
        },
        p(t, e) {
          const n = {};
          4 & e && (n.value = t[2]), 8 & e && (n.label = t[3]), r.$set(n);
        },
        i(t) {
          i || (st(r.$$.fragment, t), (i = !0));
        },
        o(t) {
          it(r.$$.fragment, t), (i = !1);
        },
        d(t) {
          t && b(e), t && b(n), ft(r, t), t && b(o), t && b(s);
        },
      }
    );
  }
  function Gt(t) {
    let e,
      n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      E,
      _,
      S,
      k,
      W,
      T,
      F,
      D,
      q,
      R = t[15] + 1 + "",
      A = t[7](t[13].start) + "",
      I = t[8](t[13].end) + "",
      P = (t[6](t[13]) / 60).toFixed() + "",
      M = t[13].reviewCount + "",
      z = t[13].questionCount + "",
      L = (t[6](t[13]) / t[13].questionCount).toFixed(1) + "",
      K = t[13].correctAnswerCount + "",
      U = t[13].questionCount + "",
      V = t[9](t[13]) + "";
    return {
      c() {
        (e = w("article")),
          (n = w("h5")),
          (r = x(R)),
          (o = x(": ")),
          (s = x(A)),
          (i = x(" – ")),
          (a = x(I)),
          (u = x("\n            (")),
          (c = x(P)),
          (l = x("m)")),
          (f = N()),
          (d = w("p")),
          (g = x(M)),
          (p = x(" items • ")),
          (h = x(z)),
          (v = x(" questions •\n            ")),
          ($ = x(L)),
          (C = x(" s/q ")),
          (E = w("br")),
          (_ = N()),
          (S = x(K)),
          (k = x("/")),
          (W = x(U)),
          (T = x(" =\n            ")),
          (F = x(V)),
          (D = x("% correct")),
          (q = N()),
          j(n, "class", "svelte-sxcuj8"),
          j(d, "class", "svelte-sxcuj8"),
          j(e, "class", "svelte-sxcuj8");
      },
      m(t, b) {
        y(t, e, b),
          m(e, n),
          m(n, r),
          m(n, o),
          m(n, s),
          m(n, i),
          m(n, a),
          m(n, u),
          m(n, c),
          m(n, l),
          m(e, f),
          m(e, d),
          m(d, g),
          m(d, p),
          m(d, h),
          m(d, v),
          m(d, $),
          m(d, C),
          m(d, E),
          m(d, _),
          m(d, S),
          m(d, k),
          m(d, W),
          m(d, T),
          m(d, F),
          m(d, D),
          m(e, q);
      },
      p(t, e) {
        2 & e && A !== (A = t[7](t[13].start) + "") && O(s, A),
          2 & e && I !== (I = t[8](t[13].end) + "") && O(a, I),
          2 & e && P !== (P = (t[6](t[13]) / 60).toFixed() + "") && O(c, P),
          2 & e && M !== (M = t[13].reviewCount + "") && O(g, M),
          2 & e && z !== (z = t[13].questionCount + "") && O(h, z),
          2 & e &&
            L !== (L = (t[6](t[13]) / t[13].questionCount).toFixed(1) + "") &&
            O($, L),
          2 & e && K !== (K = t[13].correctAnswerCount + "") && O(S, K),
          2 & e && U !== (U = t[13].questionCount + "") && O(W, U),
          2 & e && V !== (V = t[9](t[13]) + "") && O(F, V);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function Ht(t) {
    let e, n, r, o;
    const s = [Bt, Vt],
      i = [];
    function a(t, e) {
      return "chart" === t[5] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = i[n] = s[n](t)),
      {
        c() {
          (e = w("div")),
            r.c(),
            j(e, "class", "gbWidget svelte-sxcuj8"),
            j(e, "data-testid", "speedWidget");
        },
        m(t, r) {
          y(t, e, r), i[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let u = n;
          (n = a(t)),
            n === u
              ? i[n].p(t, o)
              : (rt(),
                it(i[u], 1, 1, () => {
                  i[u] = null;
                }),
                ot(),
                (r = i[n]),
                r ? r.p(t, o) : ((r = i[n] = s[n](t)), r.c()),
                st(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (st(r), (o = !0));
        },
        o(t) {
          it(r), (o = !1);
        },
        d(t) {
          t && b(e), i[n].d();
        },
      }
    );
  }
  function Xt(t, e, n) {
    let r, o, s, i, u, c, l, f;
    a(t, qt, (t) => n(12, (c = t))),
      a(t, Wt, (t) => n(1, (l = t))),
      a(t, Nt, (t) => n(5, (f = t)));
    const d = (t) => (t.end - t.start) / 1e3;
    let g;
    return (
      (t.$$.update = () => {
        2 & t.$$.dirty && n(4, (r = l.reduce((t, e) => t + +e.reviewCount, 0))),
          2 & t.$$.dirty &&
            n(0, (o = l.reduce((t, e) => t + +e.questionCount, 0))),
          2 & t.$$.dirty && n(10, (g = l.reduce((t, e) => t + d(e), 0))),
          1025 & t.$$.dirty && n(11, (s = o > 0 ? g / o : 0)),
          2048 & t.$$.dirty && n(3, (i = `${s.toFixed(1)}`)),
          6144 & t.$$.dirty && n(2, (u = s / (2 * c.targetSpeed)));
      }),
      [
        o,
        l,
        u,
        i,
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
        g,
        s,
        c,
      ]
    );
  }
  class Jt extends pt {
    constructor(t) {
      super(), gt(this, t, Xt, Ht, i, {});
    }
  }
  function Yt(t, e, n) {
    const r = t.slice();
    return (r[7] = e[n]), (r[9] = n), r;
  }
  function Zt(t) {
    let e,
      n,
      r,
      o = (100 * t[1][t[9]]).toFixed() + "";
    return {
      c() {
        (e = w("br")), (n = x(o)), (r = x("%"));
      },
      m(t, o) {
        y(t, e, o), y(t, n, o), y(t, r, o);
      },
      p(t, e) {
        2 & e && o !== (o = (100 * t[1][t[9]]).toFixed() + "") && O(n, o);
      },
      d(t) {
        t && b(e), t && b(n), t && b(r);
      },
    };
  }
  function Qt(t) {
    let e;
    return {
      c() {
        (e = w("td")),
          j(e, "aria-label", "percents"),
          j(e, "class", "percents svelte-4dyt6f"),
          T(e, "height", (100 * t[1][t[9]]).toFixed(1) + "%");
      },
      m(t, n) {
        y(t, e, n);
      },
      p(t, n) {
        2 & n && T(e, "height", (100 * t[1][t[9]]).toFixed(1) + "%");
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function te(t) {
    let e,
      n,
      r,
      o,
      s,
      i,
      a,
      u,
      c = (t[2][t[9]] ? t[2][t[9]] : "") + "",
      l = t[7] + "",
      f = t[1].length && Zt(t),
      d = t[1].length && Qt(t);
    return {
      c() {
        (e = w("tr")),
          (n = w("th")),
          (r = x(c)),
          (o = N()),
          (s = w("td")),
          (i = w("span")),
          (a = x(l)),
          f && f.c(),
          (u = N()),
          d && d.c(),
          j(n, "scope", "row"),
          j(n, "aria-label", "label"),
          j(n, "class", "svelte-4dyt6f"),
          j(i, "class", "svelte-4dyt6f"),
          j(s, "aria-label", "value"),
          j(s, "class", "svelte-4dyt6f"),
          j(e, "aria-label", "values"),
          T(e, "height", t[5][t[9]] + "%"),
          j(e, "class", "svelte-4dyt6f");
      },
      m(t, c) {
        y(t, e, c),
          m(e, n),
          m(n, r),
          m(e, o),
          m(e, s),
          m(s, i),
          m(i, a),
          f && f.m(i, null),
          m(e, u),
          d && d.m(e, null);
      },
      p(t, n) {
        4 & n && c !== (c = (t[2][t[9]] ? t[2][t[9]] : "") + "") && O(r, c),
          1 & n && l !== (l = t[7] + "") && O(a, l),
          t[1].length
            ? f
              ? f.p(t, n)
              : ((f = Zt(t)), f.c(), f.m(i, null))
            : f && (f.d(1), (f = null)),
          t[1].length
            ? d
              ? d.p(t, n)
              : ((d = Qt(t)), d.c(), d.m(e, null))
            : d && (d.d(1), (d = null)),
          32 & n && T(e, "height", t[5][t[9]] + "%");
      },
      d(t) {
        t && b(e), f && f.d(), d && d.d();
      },
    };
  }
  function ee(e) {
    let n,
      r,
      o,
      s,
      i,
      a,
      u,
      c = e[0],
      l = [];
    for (let t = 0; t < c.length; t += 1) l[t] = te(Yt(e, c, t));
    return {
      c() {
        (n = w("table")),
          (r = w("thead")),
          (r.innerHTML =
            '<tr class="svelte-4dyt6f"><th scope="col" class="svelte-4dyt6f">Item</th> \n      <th scope="col" class="svelte-4dyt6f">Value</th></tr>'),
          (o = N()),
          (s = w("tbody"));
        for (let t = 0; t < l.length; t += 1) l[t].c();
        (i = N()),
          (a = w("div")),
          j(r, "class", "svelte-4dyt6f"),
          (a.hidden = u = 0 === e[4]),
          j(a, "class", "target svelte-4dyt6f"),
          T(a, "height", e[4] + "%"),
          j(s, "class", "svelte-4dyt6f"),
          j(n, "class", "graph svelte-4dyt6f"),
          j(n, "aria-label", "bar-chart"),
          T(n, "--max-label", e[3]);
      },
      m(t, e) {
        y(t, n, e), m(n, r), m(n, o), m(n, s);
        for (let t = 0; t < l.length; t += 1) l[t].m(s, null);
        m(s, i), m(s, a);
      },
      p(t, [e]) {
        if (39 & e) {
          let n;
          for (c = t[0], n = 0; n < c.length; n += 1) {
            const r = Yt(t, c, n);
            l[n] ? l[n].p(r, e) : ((l[n] = te(r)), l[n].c(), l[n].m(s, i));
          }
          for (; n < l.length; n += 1) l[n].d(1);
          l.length = c.length;
        }
        16 & e && u !== (u = 0 === t[4]) && (a.hidden = u),
          16 & e && T(a, "height", t[4] + "%"),
          8 & e && T(n, "--max-label", t[3]);
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), $(l, t);
      },
    };
  }
  function ne(t, e, n) {
    let r,
      o,
      s,
      { values: i } = e,
      { percents: a = [] } = e,
      { labels: u = [] } = e,
      { target: c = 0 } = e;
    return (
      (t.$$set = (t) => {
        "values" in t && n(0, (i = t.values)),
          "percents" in t && n(1, (a = t.percents)),
          "labels" in t && n(2, (u = t.labels)),
          "target" in t && n(6, (c = t.target));
      }),
      (t.$$.update = () => {
        1 & t.$$.dirty && n(3, (r = Math.max(...i))),
          9 & t.$$.dirty && n(5, (o = i.map((t) => Math.round((t / r) * 100)))),
          72 & t.$$.dirty && n(4, (s = Math.round((c / r) * 100)));
      }),
      [i, a, u, r, s, o, c]
    );
  }
  class re extends pt {
    constructor(t) {
      super(),
        gt(this, t, ne, ee, i, {
          values: 0,
          percents: 1,
          labels: 2,
          target: 6,
        });
    }
  }
  function oe(e) {
    let n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      E,
      _,
      S,
      k,
      W,
      T,
      F,
      D,
      q,
      R,
      A,
      I,
      P,
      M,
      z,
      L,
      K = e[4].toFixed() + "",
      U = e[4].toFixed() + "",
      V = e[9](e[2][e[2].length - 1]?.start) + "",
      B = e[2][e[2].length - 1]?.review_count + "",
      G = (100 * e[0][e[0].length - 1]).toFixed() + "";
    function H(t, e) {
      return t[2].length > 2 ? ae : 2 === t[2].length ? ie : void 0;
    }
    let X = H(e),
      J = X && X(e);
    return {
      c() {
        (n = w("h1")),
          (r = x(e[1])),
          (o = x(" Reviews @")),
          (s = x(K)),
          (i = x("%")),
          (a = N()),
          (u = w("div")),
          (c = w("table")),
          (l = w("tr")),
          (f = w("th")),
          (f.textContent = "Average:"),
          (d = N()),
          (g = w("td")),
          (p = x(e[6])),
          (h = N()),
          (v = w("span")),
          ($ = x("reviews @ ")),
          (C = x(U)),
          (E = x("%")),
          (_ = N()),
          (S = w("tr")),
          (k = w("th")),
          (W = x("Latest (")),
          (T = x(V)),
          (F = x("):")),
          (D = N()),
          (q = w("td")),
          (R = x(B)),
          (A = N()),
          (I = w("span")),
          (P = x("reviews @ ")),
          (M = x(G)),
          (z = x("%")),
          (L = N()),
          J && J.c(),
          j(n, "class", "gbHeader"),
          j(v, "class", "secondary"),
          j(I, "class", "secondary"),
          j(c, "class", "gbContent"),
          j(u, "data-testid", "reviews-per-day-table");
      },
      m(t, e) {
        y(t, n, e),
          m(n, r),
          m(n, o),
          m(n, s),
          m(n, i),
          y(t, a, e),
          y(t, u, e),
          m(u, c),
          m(c, l),
          m(l, f),
          m(l, d),
          m(l, g),
          m(g, p),
          m(g, h),
          m(g, v),
          m(v, $),
          m(v, C),
          m(v, E),
          m(c, _),
          m(c, S),
          m(S, k),
          m(k, W),
          m(k, T),
          m(k, F),
          m(S, D),
          m(S, q),
          m(q, R),
          m(q, A),
          m(q, I),
          m(I, P),
          m(I, M),
          m(I, z),
          m(c, L),
          J && J.m(c, null);
      },
      p(t, e) {
        2 & e && O(r, t[1]),
          16 & e && K !== (K = t[4].toFixed() + "") && O(s, K),
          64 & e && O(p, t[6]),
          16 & e && U !== (U = t[4].toFixed() + "") && O(C, U),
          4 & e &&
            V !== (V = t[9](t[2][t[2].length - 1]?.start) + "") &&
            O(T, V),
          4 & e &&
            B !== (B = t[2][t[2].length - 1]?.review_count + "") &&
            O(R, B),
          1 & e &&
            G !== (G = (100 * t[0][t[0].length - 1]).toFixed() + "") &&
            O(M, G),
          X === (X = H(t)) && J
            ? J.p(t, e)
            : (J && J.d(1), (J = X && X(t)), J && (J.c(), J.m(c, null)));
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), t && b(a), t && b(u), J && J.d();
      },
    };
  }
  function se(t) {
    let e, n, r, o;
    return (
      (r = new re({
        props: {
          values: t[5],
          labels: t[7],
          target: t[3].targetRevDay,
          percents: t[0],
        },
      })),
      {
        c() {
          (e = w("h1")),
            (e.textContent = "Accuracy"),
            (n = N()),
            ct(r.$$.fragment),
            j(e, "class", "gbHeader");
        },
        m(t, s) {
          y(t, e, s), y(t, n, s), lt(r, t, s), (o = !0);
        },
        p(t, e) {
          const n = {};
          32 & e && (n.values = t[5]),
            128 & e && (n.labels = t[7]),
            8 & e && (n.target = t[3].targetRevDay),
            1 & e && (n.percents = t[0]),
            r.$set(n);
        },
        i(t) {
          o || (st(r.$$.fragment, t), (o = !0));
        },
        o(t) {
          it(r.$$.fragment, t), (o = !1);
        },
        d(t) {
          t && b(e), t && b(n), ft(r, t);
        },
      }
    );
  }
  function ie(t) {
    let e,
      n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l = t[9](t[2][0].start) + "",
      f = t[2][0].review_count + "";
    return {
      c() {
        (e = w("tr")),
          (n = w("th")),
          (r = x(l)),
          (o = x(":")),
          (s = N()),
          (i = w("td")),
          (a = x(f)),
          (u = N()),
          (c = w("span")),
          (c.textContent = "reviews"),
          j(c, "class", "secondary");
      },
      m(t, l) {
        y(t, e, l),
          m(e, n),
          m(n, r),
          m(n, o),
          m(e, s),
          m(e, i),
          m(i, a),
          m(i, u),
          m(i, c);
      },
      p(t, e) {
        4 & e && l !== (l = t[9](t[2][0].start) + "") && O(r, l),
          4 & e && f !== (f = t[2][0].review_count + "") && O(a, f);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function ae(t) {
    let e,
      n,
      r,
      o,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      E,
      _ = t[9](t[2][0].start) + "",
      S = t[9](t[2][t[2].length - 2].start) + "",
      k = t[2].slice(0, -1).map(ce).join(" • ") + "",
      W = t[0].slice(0, -1).map(le).join("% • ") + "";
    return {
      c() {
        (e = w("tr")),
          (n = w("th")),
          (r = x(_)),
          (o = x(" – ")),
          (s = x(S)),
          (i = x(":")),
          (a = N()),
          (u = w("td")),
          (c = x(k)),
          (l = N()),
          (f = w("span")),
          (f.textContent = "reviews"),
          (d = N()),
          (g = w("tr")),
          (p = w("th")),
          (h = N()),
          (v = w("td")),
          ($ = x(W)),
          (C = x("% ")),
          (E = w("span")),
          (E.textContent = "accuracy"),
          j(f, "class", "secondary"),
          j(E, "class", "secondary");
      },
      m(t, b) {
        y(t, e, b),
          m(e, n),
          m(n, r),
          m(n, o),
          m(n, s),
          m(n, i),
          m(e, a),
          m(e, u),
          m(u, c),
          m(u, l),
          m(u, f),
          y(t, d, b),
          y(t, g, b),
          m(g, p),
          m(g, h),
          m(g, v),
          m(v, $),
          m(v, C),
          m(v, E);
      },
      p(t, e) {
        4 & e && _ !== (_ = t[9](t[2][0].start) + "") && O(r, _),
          4 & e &&
            S !== (S = t[9](t[2][t[2].length - 2].start) + "") &&
            O(s, S),
          4 & e &&
            k !== (k = t[2].slice(0, -1).map(ce).join(" • ") + "") &&
            O(c, k),
          1 & e &&
            W !== (W = t[0].slice(0, -1).map(le).join("% • ") + "") &&
            O($, W);
      },
      d(t) {
        t && b(e), t && b(d), t && b(g);
      },
    };
  }
  function ue(t) {
    let e, n, r, o;
    const s = [se, oe],
      i = [];
    function a(t, e) {
      return "chart" === t[8] ? 0 : 1;
    }
    return (
      (n = a(t)),
      (r = i[n] = s[n](t)),
      {
        c() {
          (e = w("div")),
            r.c(),
            j(e, "class", "gbWidget"),
            j(e, "data-testid", "reviews-per-day-gauge");
        },
        m(t, r) {
          y(t, e, r), i[n].m(e, null), (o = !0);
        },
        p(t, [o]) {
          let u = n;
          (n = a(t)),
            n === u
              ? i[n].p(t, o)
              : (rt(),
                it(i[u], 1, 1, () => {
                  i[u] = null;
                }),
                ot(),
                (r = i[n]),
                r ? r.p(t, o) : ((r = i[n] = s[n](t)), r.c()),
                st(r, 1),
                r.m(e, null));
        },
        i(t) {
          o || (st(r), (o = !0));
        },
        o(t) {
          it(r), (o = !1);
        },
        d(t) {
          t && b(e), i[n].d();
        },
      }
    );
  }
  const ce = (t) => t.review_count,
    le = (t) => (100 * t).toFixed();
  function fe(t, e, n) {
    let r, o, s, i, u, c, l, f, d, g;
    a(t, Ft, (t) => n(2, (l = t))),
      a(t, _t, (t) => n(10, (f = t))),
      a(t, qt, (t) => n(3, (d = t))),
      a(t, Nt, (t) => n(8, (g = t)));
    const p = (t) =>
      new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(t);
    return (
      (t.$$.update = () => {
        4 & t.$$.dirty && n(7, (r = l.map((t) => p(t.start)))),
          4 & t.$$.dirty &&
            n(1, (o = l.reduce((t, e) => t + e.review_count, 0))),
          1032 & t.$$.dirty && d.targetRevDay,
          1026 & t.$$.dirty && n(6, (s = (o / f).toFixed())),
          4 & t.$$.dirty && n(5, (i = l.map((t) => t.review_count))),
          4 & t.$$.dirty && n(0, (u = l.map((t) => t.accuracy))),
          1 & t.$$.dirty &&
            n(4, (c = (100 * u.reduce((t, e) => t + e, 0)) / u.length));
      }),
      [u, o, l, d, c, i, s, r, g, p, f]
    );
  }
  class de extends pt {
    constructor(t) {
      super(), gt(this, t, fe, ue, i, {});
    }
  }
  function ge(t) {
    let e, n, r, s, i, a, c, l, f, d, g;
    const p = t[5].default,
      h = (function (t, e, n, r) {
        if (t) {
          const o = u(t, e, n, r);
          return t[0](o);
        }
      })(p, t, t[4], null);
    return {
      c() {
        (e = w("div")),
          (n = w("div")),
          (r = C("svg")),
          (s = C("circle")),
          (i = C("line")),
          (a = C("line")),
          (c = N()),
          (l = w("div")),
          h && h.c(),
          j(s, "cx", "6"),
          j(s, "cy", "6"),
          j(s, "r", "6"),
          j(i, "x1", "3"),
          j(i, "y1", "3"),
          j(i, "x2", "9"),
          j(i, "y2", "9"),
          j(i, "class", "svelte-18s3qyj"),
          j(a, "x1", "9"),
          j(a, "y1", "3"),
          j(a, "x2", "3"),
          j(a, "y2", "9"),
          j(a, "class", "svelte-18s3qyj"),
          j(r, "id", "close"),
          j(r, "viewBox", "0 0 12 12"),
          j(r, "class", "svelte-18s3qyj"),
          j(l, "id", "modal-content"),
          j(l, "class", "svelte-18s3qyj"),
          j(n, "id", "modal"),
          j(n, "class", "svelte-18s3qyj"),
          j(e, "id", "topModal"),
          j(e, "class", "svelte-18s3qyj"),
          F(e, "visible", t[1]);
      },
      m(o, u) {
        y(o, e, u),
          m(e, n),
          m(n, r),
          m(r, s),
          m(r, i),
          m(r, a),
          m(n, c),
          m(n, l),
          h && h.m(l, null),
          t[7](e),
          (f = !0),
          d ||
            ((g = [
              E(r, "click", t[6]),
              E(n, "click", S(he)),
              E(e, "click", t[8]),
            ]),
            (d = !0));
      },
      p(t, [n]) {
        h &&
          h.p &&
          (!f || 16 & n) &&
          (function (t, e, n, r, o, s) {
            if (o) {
              const i = u(e, n, r, s);
              t.p(i, o);
            }
          })(
            h,
            p,
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
                })(p, t[4], n, null)
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
          2 & n && F(e, "visible", t[1]);
      },
      i(t) {
        f || (st(h, t), (f = !0));
      },
      o(t) {
        it(h, t), (f = !1);
      },
      d(n) {
        n && b(e), h && h.d(n), t[7](null), (d = !1), o(g);
      },
    };
  }
  let pe;
  const me = {};
  const he = () => {};
  function ve(t, e, n) {
    let r,
      o,
      s,
      { $$slots: i = {}, $$scope: a } = e,
      u = !1,
      { id: c = "" } = e;
    function l(t) {
      "Escape" == t.key && pe == r && f(null);
    }
    function f(t) {
      u &&
        (window.removeEventListener("keydown", l),
        (pe = o),
        null == pe && (document.body.style.overflow = ""),
        n(1, (u = !1)),
        s && s(t));
    }
    (me[c] = {
      open: function (t) {
        (s = t),
          u ||
            ((o = pe),
            (pe = r),
            window.addEventListener("keydown", l),
            (document.body.style.overflow = "hidden"),
            n(1, (u = !0)),
            document.body.appendChild(r));
      },
      close: f,
    }),
      M(() => {
        delete me[c], window.removeEventListener("keydown", l);
      });
    return (
      (t.$$set = (t) => {
        "id" in t && n(3, (c = t.id)), "$$scope" in t && n(4, (a = t.$$scope));
      }),
      [
        r,
        u,
        f,
        c,
        a,
        i,
        () => f(null),
        function (t) {
          K[t ? "unshift" : "push"](() => {
            (r = t), n(0, r);
          });
        },
        () => f(null),
      ]
    );
  }
  class ye extends pt {
    constructor(t) {
      super(), gt(this, t, ve, ge, i, { id: 3 });
    }
  }
  function be(t) {
    let e, n;
    return {
      c() {
        (e = w("span")), (n = x(t[0])), j(e, "class", "errors svelte-9nbcyp");
      },
      m(t, r) {
        y(t, e, r), m(e, n);
      },
      p(t, e) {
        1 & e && O(n, t[0]);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function $e(e) {
    let n,
      r = e[0] && be(e);
    return {
      c() {
        r && r.c(), (n = x(""));
      },
      m(t, e) {
        r && r.m(t, e), y(t, n, e);
      },
      p(t, [e]) {
        t[0]
          ? r
            ? r.p(t, e)
            : ((r = be(t)), r.c(), r.m(n.parentNode, n))
          : r && (r.d(1), (r = null));
      },
      i: t,
      o: t,
      d(t) {
        r && r.d(t), t && b(n);
      },
    };
  }
  function we(t, e, n) {
    let r,
      { errors: o = {} } = e,
      { path: s } = e;
    return (
      (t.$$set = (t) => {
        "errors" in t && n(1, (o = t.errors)),
          "path" in t && n(2, (s = t.path));
      }),
      (t.$$.update = () => {
        6 & t.$$.dirty && n(0, (r = o[s] && o[s].length ? o[s][0] : void 0));
      }),
      [r, o, s]
    );
  }
  class Ce extends pt {
    constructor(t) {
      super(), gt(this, t, we, $e, i, { errors: 1, path: 2 });
    }
  }
  function xe() {
    return (xe =
      Object.assign ||
      function (t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
          for (var o in (e = arguments[n]))
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        return t;
      }).apply(this, arguments);
  }
  function Ne(t, e, n) {
    if (n || 2 === arguments.length)
      for (var r, o = 0, s = e.length; o < s; o++)
        (!r && o in e) ||
          (r || (r = Array.prototype.slice.call(e, 0, o)), (r[o] = e[o]));
    return t.concat(r || e);
  }
  var Ee = Object.assign;
  function _e(t) {
    return "function" == typeof t;
  }
  function Se(t, e) {
    function n(t) {
      (r = !0), (o = t);
    }
    for (var r = !1, o = null, s = 0; s < t.length; s++)
      if ((e(t[s], n, s), r)) return o;
  }
  function je(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    return _e(t) ? t.apply(void 0, e) : t;
  }
  function ke(t, e) {
    var n;
    return null !== (n = je(t)) && void 0 !== n ? n : e;
  }
  function Oe(t, e) {
    return (t = { pass: t }), e && (t.message = e), t;
  }
  function We(t, e) {
    try {
      return t.run(e);
    } catch (t) {
      return Oe(!1);
    }
  }
  function Te(t) {
    return function () {
      for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
      return !t.apply(void 0, e);
    };
  }
  function Fe(t, e) {
    return t.length === Number(e);
  }
  var De = Te(Fe);
  function qe(t, e) {
    return t.length > Number(e);
  }
  function Re(t) {
    return null === t;
  }
  var Ae = Te(Re);
  function Ie(t) {
    return void 0 === t;
  }
  var Pe = Te(Ie);
  function Me(t) {
    return String(t) === t;
  }
  function ze(t, e) {
    return Me(t) && Me(e) && t.endsWith(e);
  }
  var Le = Te(ze);
  function Ke(t, e) {
    return t === e;
  }
  var Ue = Te(Ke);
  function Ve(t) {
    var e = Number(t);
    return !(isNaN(parseFloat(String(t))) || isNaN(Number(t)) || !isFinite(e));
  }
  var Be = Te(Ve);
  function Ge(t, e) {
    return Ve(t) && Ve(e) && Number(t) > Number(e);
  }
  function He(t, e) {
    return Ve(t) && Ve(e) && Number(t) >= Number(e);
  }
  function Xe(t) {
    return !!Array.isArray(t);
  }
  var Je = Te(Xe);
  function Ye(t, e) {
    return !!(Xe(e) || (Me(e) && Me(t))) && -1 !== e.indexOf(t);
  }
  var Ze = Te(Ye);
  function Qe(t, e) {
    return Ve(t) && Ve(e) && Number(t) <= Number(e);
  }
  function tn(t, e, n) {
    return He(t, e) && Qe(t, n);
  }
  var en = Te(tn);
  function nn(t) {
    return Me(t) && !t.trim();
  }
  var rn = Te(nn);
  function on(t) {
    return !!t === t;
  }
  var sn = Te(on);
  function an(t) {
    return "number" == typeof t;
  }
  var un = Te(an);
  function cn(t) {
    if (t) {
      if (an(t)) return 0 === t;
      if (Object.prototype.hasOwnProperty.call(t, "length")) return Fe(t, 0);
      if ("object" == typeof t) return Fe(Object.keys(t), 0);
    }
    return !0;
  }
  var ln = Te(cn);
  function fn(t) {
    return Number.isNaN(t);
  }
  var dn = Te(fn);
  function gn(t) {
    return !!Ve(t) && 0 > Number(t);
  }
  var pn = Te(gn),
    mn = Te(Me);
  function hn(t) {
    return !!t;
  }
  var vn = Te(hn);
  function yn(t, e) {
    return Ve(t) && Ve(e) && Number(t) < Number(e);
  }
  function bn(t, e) {
    return e instanceof RegExp ? e.test(t) : !!Me(e) && new RegExp(e).test(t);
  }
  var $n = Te(bn);
  function wn(t, e) {
    return Ve(t) && Ve(e) && Number(t) === Number(e);
  }
  var Cn = Te(wn);
  function xn(t, e) {
    return Me(t) && Me(e) && t.startsWith(e);
  }
  var Nn = Te(xn);
  function En(t, e) {
    throw Error(ke(e, t));
  }
  function _n(t) {
    function e(e, o) {
      var s,
        i,
        a = n();
      return (
        (e = Ee(
          {},
          a || {},
          null !== (s = je(t, e, a)) && void 0 !== s ? s : e
        )),
        (s = r.ctx = Object.freeze(e)),
        r.ancestry.unshift(s),
        (o = o(s)),
        r.ancestry.shift(),
        (r.ctx = null !== (i = r.ancestry[0]) && void 0 !== i ? i : null),
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
          : En(ke(t, "Context was used after it was closed"));
      },
    };
  }
  var Sn = _n(function (t, e) {
    var n = { value: t.value, meta: t.meta || {} };
    return e
      ? t.set
        ? Ee(n, {
            parent: function () {
              return e ? { value: e.value, meta: e.meta, parent: e.parent } : e;
            },
          })
        : e
      : Ee(n, { parent: jn });
  });
  function jn() {
    return null;
  }
  function kn(t, e) {
    function n(n) {
      var r = t[n],
        o = e[n];
      if (
        !(n = Sn.run({ value: r, set: !0, meta: { key: n } }, function () {
          return We(o, r);
        })).pass
      )
        return { value: n };
    }
    for (var r in e) {
      var o = n(r);
      if ("object" == typeof o) return o.value;
    }
    return Oe(!0);
  }
  var On = Ee(
    {
      condition: function (t, e) {
        try {
          return e(t);
        } catch (t) {
          return !1;
        }
      },
      doesNotEndWith: Le,
      doesNotStartWith: Nn,
      endsWith: ze,
      equals: Ke,
      greaterThan: Ge,
      greaterThanOrEquals: He,
      gt: Ge,
      gte: He,
      inside: Ye,
      isArray: Xe,
      isBetween: tn,
      isBlank: nn,
      isBoolean: on,
      isEmpty: cn,
      isEven: function (t) {
        return !!Ve(t) && 0 == t % 2;
      },
      isFalsy: vn,
      isNaN: fn,
      isNegative: gn,
      isNotArray: Je,
      isNotBetween: en,
      isNotBlank: rn,
      isNotBoolean: sn,
      isNotEmpty: ln,
      isNotNaN: dn,
      isNotNull: Ae,
      isNotNumber: un,
      isNotNumeric: Be,
      isNotString: mn,
      isNotUndefined: Pe,
      isNull: Re,
      isNumber: an,
      isNumeric: Ve,
      isOdd: function (t) {
        return !!Ve(t) && 0 != t % 2;
      },
      isPositive: pn,
      isString: Me,
      isTruthy: hn,
      isUndefined: Ie,
      lengthEquals: Fe,
      lengthNotEquals: De,
      lessThan: yn,
      lessThanOrEquals: Qe,
      longerThan: qe,
      longerThanOrEquals: function (t, e) {
        return t.length >= Number(e);
      },
      lt: yn,
      lte: Qe,
      matches: bn,
      notEquals: Ue,
      notInside: Ze,
      notMatches: $n,
      numberEquals: wn,
      numberNotEquals: Cn,
      shorterThan: function (t, e) {
        return t.length < Number(e);
      },
      shorterThanOrEquals: function (t, e) {
        return t.length <= Number(e);
      },
      startsWith: xn,
    },
    {
      allOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return ke(
          Se(e, function (e, n) {
            (e = We(e, t)).pass || n(e);
          }),
          Oe(!0)
        );
      },
      anyOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return ke(
          Se(e, function (e, n) {
            (e = We(e, t)).pass && n(e);
          }),
          Oe(!1)
        );
      },
      noneOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        return ke(
          Se(e, function (e, n) {
            We(e, t).pass && n(Oe(!1));
          }),
          Oe(!0)
        );
      },
      oneOf: function (t) {
        for (var e = [], n = 1; n < arguments.length; n++)
          e[n - 1] = arguments[n];
        var r = [];
        return (
          e.some(function (e) {
            if (qe(r, 1)) return !1;
            (e = We(e, t)).pass && r.push(e);
          }),
          Oe(Fe(r, 1))
        );
      },
      optional: function (t, e) {
        return Ie(t) || null === t ? Oe(!0) : We(e, t);
      },
    },
    {
      shape: function (t, e) {
        var n = kn(t, e);
        if (!n.pass) return n;
        for (var r in t)
          if (!Object.prototype.hasOwnProperty.call(e, r)) return Oe(!1);
        return Oe(!0);
      },
      loose: kn,
      isArrayOf: function (t, e) {
        return ke(
          Se(t, function (t, n, r) {
            (r = Sn.run({ value: t, set: !0, meta: { index: r } }, function () {
              return We(e, t);
            })).pass || n(r);
          }),
          Oe(!0)
        );
      },
    }
  );
  function Wn(t) {
    for (var e in On) {
      var n = On[e];
      _e(n) && t(e, n);
    }
  }
  function Tn() {
    try {
      return _e(Proxy);
    } catch (t) {
      return !1;
    }
  }
  function Fn(t, e, n) {
    for (var r = [], o = 3; o < arguments.length; o++) r[o - 3] = arguments[o];
    return (
      on(t) ||
        (t && on(t.pass)) ||
        En("Incorrect return value for rule: " + JSON.stringify(t)),
      on(t) ? Oe(t) : Oe(t.pass, je.apply(void 0, Ne([t.message, e, n], r)))
    );
  }
  function Dn(t) {
    var e,
      n = [];
    return (function t(r) {
      return function () {
        for (var o = [], s = 0; s < arguments.length; s++) o[s] = arguments[s];
        var i = On[r];
        n.push(function (t) {
          return Fn.apply(void 0, Ne([i.apply(void 0, Ne([t], o)), r, t], o));
        });
        var a = {
          run: function (t) {
            return ke(
              Se(n, function (n, r) {
                var o,
                  s = Sn.run({ value: t }, function () {
                    return n(t);
                  });
                s.pass ||
                  r(
                    Oe(
                      !!s.pass,
                      null !== (o = je(e, t, s.message)) && void 0 !== o
                        ? o
                        : s.message
                    )
                  );
              }),
              Oe(!0)
            );
          },
          test: function (t) {
            return a.run(t).pass;
          },
          message: function (t) {
            return t && (e = t), a;
          },
        };
        return Tn()
          ? (a = new Proxy(a, {
              get: function (e, n) {
                return On[n] ? t(n) : e[n];
              },
            }))
          : (Wn(function (e) {
              a[e] = t(e);
            }),
            a);
      };
    })(t);
  }
  var qn,
    Rn =
      ((qn = xe(
        {
          context: function () {
            return Sn.useX();
          },
          extend: function (t) {
            Ee(On, t);
          },
        },
        {
          partial: function (t) {
            var e,
              n = {};
            for (e in t) n[e] = Rn.optional(t[e]);
            return n;
          },
        }
      )),
      Tn()
        ? new Proxy(
            Ee(function (t) {
              function e(e, n, r) {
                return function () {
                  for (var o = [], s = 0; s < arguments.length; s++)
                    o[s] = arguments[s];
                  if (
                    !(s = Fn.apply(
                      void 0,
                      Ne(
                        [
                          Sn.run({ value: t }, function () {
                            return n.apply(void 0, Ne([t], o));
                          }),
                          r,
                          t,
                        ],
                        o
                      )
                    )).pass
                  ) {
                    if (!cn(s.message)) throw s.message;
                    En("enforce/" + r + " failed with " + JSON.stringify(t));
                  }
                  return e;
                };
              }
              var n = {};
              if (!Tn())
                return (
                  Wn(function (t, r) {
                    n[t] = e(n, r, t);
                  }),
                  n
                );
              var r = new Proxy(n, {
                get: function (t, n) {
                  if ((t = On[n])) return e(r, t, n);
                },
              });
              return r;
            }, qn),
            {
              get: function (t, e) {
                return e in t ? t[e] : On[e] ? Dn(e) : void 0;
              },
            }
          )
        : (Wn(function (t) {
            qn[t] = Dn(t);
          }),
          qn)),
    An = (function (t) {
      return function () {
        return "" + t++;
      };
    })(0);
  function In(t) {
    function e(t, e, o) {
      return (
        r.references.push(),
        n(t, je(e, o)),
        function () {
          return [
            r.references[t],
            function (e) {
              return n(t, je(e, r.references[t]));
            },
          ];
        }
      );
    }
    function n(e, n) {
      var s = r.references[e];
      (r.references[e] = n), _e((e = o[e][1])) && e(n, s), _e(t) && t();
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
  var Pn,
    Mn = Pn || (Pn = {});
  function zn(t, e) {
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
  function Ln(t) {
    return (t = [].concat(t))[t.length - 1];
  }
  function Kn() {
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
          return Ln(e);
        },
        getCursor: function () {
          return [].concat(e);
        },
        next: function () {
          return e[e.length - 1]++, Ln(e);
        },
        removeLevel: function () {
          e.pop();
        },
        reset: t,
      }
    );
  }
  (Mn[(Mn.DEFAULT = 0)] = "DEFAULT"),
    (Mn[(Mn.SUITE = 1)] = "SUITE"),
    (Mn[(Mn.EACH = 2)] = "EACH"),
    (Mn[(Mn.SKIP_WHEN = 3)] = "SKIP_WHEN"),
    (Mn[(Mn.GROUP = 4)] = "GROUP");
  var Un = _n(function (t, e) {
    return e
      ? null
      : Ee(
          {},
          {
            isolate: { type: Pn.DEFAULT },
            testCursor: Kn(),
            exclusion: { tests: {}, groups: {} },
          },
          t
        );
  });
  function Vn(t, e) {
    for (var n = [], r = 0; r < t.length; r++) {
      var o = t[r];
      Xe(o) ? n.push(Vn(o, e)) : ((o = e(o)), Ae(o) && n.push(o));
    }
    return n;
  }
  function Bn(t) {
    return [].concat(t).reduce(function (t, e) {
      return Xe(e) ? t.concat(Bn(e)) : [].concat(t).concat(e);
    }, []);
  }
  function Gn(t, e) {
    var n = 0;
    for (e = e.slice(0, -1); n < e.length; n++) {
      var r = e[n];
      (t[r] = ke(t[r], [])), (t = t[r]);
    }
    return t;
  }
  function Hn(t) {
    function e(r, o) {
      var s = e.get(r);
      return s
        ? s[1]
        : ((o = o()),
          n.unshift([r.concat(), o]),
          qe(n, t) && (n.length = t),
          o);
    }
    void 0 === t && (t = 1);
    var n = [];
    return (
      (e.invalidate = function (t) {
        var e = n.findIndex(function (e) {
          var n = e[0];
          return (
            Fe(t, n.length) &&
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
                Fe(t, n.length) &&
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
  function Xn() {
    return Un.useX().stateRef;
  }
  function Jn() {
    (0, Xn().testObjects()[1])(function (t) {
      return { prev: t.prev, current: [].concat(t.current) };
    });
  }
  function Yn(t) {
    (0, Xn().testObjects()[1])(function (e) {
      return { prev: e.prev, current: [].concat(t(e.current)) };
    });
  }
  function Zn() {
    return Bn(
      Vn(Xn().testObjects()[0].current, function (t) {
        return t.isPending() ? t : null;
      })
    );
  }
  var Qn = Hn();
  function tr() {
    var t = Xn().testObjects()[0].current;
    return Qn([t], function () {
      return Bn(t);
    });
  }
  function er() {
    return Un.useX().testCursor.getCursor();
  }
  function nr(t, e) {
    if (((t = void 0 === (t = t.type) ? Pn.DEFAULT : t), _e(e))) {
      var n = er();
      return Un.run({ isolate: { type: t } }, function () {
        Un.useX().testCursor.addLevel(),
          Yn(function (t) {
            return (Gn(t, n)[Ln(n)] = []), t;
          });
        var t = e();
        return (
          Un.useX().testCursor.removeLevel(), Un.useX().testCursor.next(), t
        );
      });
    }
  }
  function rr(t, e) {
    return !(!e || t.fieldName !== e);
  }
  function or(t) {
    var e = Zn();
    return (
      !cn(e) &&
      (t
        ? e.some(function (e) {
            return rr(e, t);
          })
        : ln(e))
    );
  }
  function sr(t, e) {
    function n(t, e) {
      s[t]++, o && (s[e] = (s[e] || []).concat(o));
    }
    var r = e.fieldName,
      o = e.message;
    t[r] = t[r] || { errorCount: 0, warnCount: 0, testCount: 0 };
    var s = t[r];
    return (
      e.isSkipped() ||
        (t[r].testCount++,
        e.isFailing()
          ? n("errorCount", "errors")
          : e.isWarning() && n("warnCount", "warnings")),
      s
    );
  }
  function ir(t, e, n) {
    var r;
    void 0 === n && (n = {});
    var o = (n = n || {}).group,
      s = n.fieldName;
    return e.reduce(function (e, n) {
      if (o && n.groupName !== o) var r = !0;
      else
        s && !rr(n, s)
          ? (r = !0)
          : ((r = n.warns()), (r = ("warnings" === t) != !!r));
      return (
        r ||
          !n.hasFailures() ||
          (e[n.fieldName] = (e[n.fieldName] || []).concat(n.message || [])),
        e
      );
    }, xe({}, s && (((r = {})[s] = []), r)));
  }
  function ar(t) {
    return cr("errors", t);
  }
  function ur(t) {
    return cr("warnings", t);
  }
  function cr(t, e) {
    return (t = ir(t, tr(), { fieldName: e })), e ? t[e] : t;
  }
  function lr(t, e) {
    return (t = dr("errors", t, e)), e ? t[e] : t;
  }
  function fr(t, e) {
    return (t = dr("warnings", t, e)), e ? t[e] : t;
  }
  function dr(t, e, n) {
    return (
      e ||
        En(
          "get" +
            t[0].toUpperCase() +
            t.slice(1) +
            "ByGroup requires a group name. Received `" +
            e +
            "` instead."
        ),
      ir(t, tr(), { group: e, fieldName: n })
    );
  }
  function gr(t, e, n) {
    return (
      (n = !t.hasFailures() || (n && !rr(t, n))) ||
        (n = ("warnings" === e) != !!(t = t.warns())),
      !n
    );
  }
  function pr(t) {
    return hr("errors", t);
  }
  function mr(t) {
    return hr("warnings", t);
  }
  function hr(t, e) {
    return tr().some(function (n) {
      return gr(n, t, e);
    });
  }
  function vr(t, e) {
    return br("errors", t, e);
  }
  function yr(t, e) {
    return br("warnings", t, e);
  }
  function br(t, e, n) {
    return tr().some(function (r) {
      return e === r.groupName && gr(r, t, n);
    });
  }
  var $r = Hn(20);
  function wr() {
    var t = tr(),
      e = { stateRef: Xn() };
    return $r(
      [t],
      Un.bind(e, function () {
        var t = Xn().suiteName()[0];
        return Ee(
          (function () {
            var t = {
              errorCount: 0,
              groups: {},
              testCount: 0,
              tests: {},
              warnCount: 0,
            };
            return (
              tr().forEach(function (e) {
                var n = e.fieldName,
                  r = e.groupName;
                (t.tests[n] = sr(t.tests, e)),
                  r &&
                    ((t.groups[r] = t.groups[r] || {}),
                    (t.groups[r][n] = sr(t.groups[r], e)));
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
            getErrors: Un.bind(e, ar),
            getErrorsByGroup: Un.bind(e, lr),
            getWarnings: Un.bind(e, ur),
            getWarningsByGroup: Un.bind(e, fr),
            hasErrors: Un.bind(e, pr),
            hasErrorsByGroup: Un.bind(e, vr),
            hasWarnings: Un.bind(e, mr),
            hasWarningsByGroup: Un.bind(e, yr),
            isValid: Un.bind(e, function (t) {
              var e = wr(),
                n = tr().reduce(function (t, e) {
                  return (
                    t[e.fieldName] || (e.isOmitted() && (t[e.fieldName] = !0)),
                    t
                  );
                }, {});
              return (t =
                (n = !!t && !!n[t]) ||
                (!e.hasErrors(t) &&
                  !(
                    cn((n = tr())) ||
                    (t && cn(e.tests[t])) ||
                    (function (t) {
                      var e = Xn().optionalFields()[0];
                      return ln(
                        Zn().filter(function (n) {
                          return !(t && !rr(n, t)) && !0 !== e[n.fieldName];
                        })
                      );
                    })(t)
                  ) &&
                  (function (t) {
                    var e = tr(),
                      n = Xn().optionalFields()[0];
                    return e.every(function (e) {
                      return (
                        !(!t || rr(e, t)) ||
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
  var Cr = Hn(20);
  function xr() {
    var t = tr(),
      e = { stateRef: Xn() };
    return Cr(
      [t],
      Un.bind(e, function () {
        return Ee({}, wr(), { done: Un.bind(e, _r) });
      })
    );
  }
  function Nr(t, e, n) {
    return !(_e(t) && (!e || (n.tests[e] && 0 !== n.tests[e].testCount)));
  }
  function Er(t) {
    return !(or() && (!t || or(t)));
  }
  function _r() {
    function t() {
      return r(wr());
    }
    for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
    var r = (e = e.reverse())[0];
    return (
      (e = e[1]), (n = xr()), Nr(r, e, n) ? n : Er(e) ? (t(), n) : (Sr(t, e), n)
    );
  }
  function Sr(t, e) {
    var n = Un.bind({}, t);
    (0, Xn().testCallbacks()[1])(function (t) {
      return (
        e
          ? (t.fieldCallbacks[e] = (t.fieldCallbacks[e] || []).concat(n))
          : t.doneCallbacks.push(n),
        t
      );
    });
  }
  function jr(t) {
    return t.forEach(function (t) {
      return t();
    });
  }
  function kr() {
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
      t.on(Wr.TEST_COMPLETED, function (t) {
        if (!t.isCanceled()) {
          t.done(), (t = t.fieldName);
          var e = Xn().testCallbacks()[0].fieldCallbacks;
          t && !or(t) && Xe(e[t]) && jr(e[t]),
            (t = Xn().testCallbacks()[0].doneCallbacks),
            or() || jr(t);
        }
      }),
      t.on(Wr.SUITE_COMPLETED, function () {
        !(function () {
          var t = Xn().optionalFields()[0];
          if (!cn(t)) {
            var e = {};
            Yn(function (n) {
              return Vn(n, function (n) {
                var r = n.fieldName;
                if (e.hasOwnProperty(r)) e[n.fieldName] && n.omit();
                else {
                  var o = t[r];
                  _e(o) && ((e[r] = o()), e[n.fieldName] && n.omit());
                }
                return n;
              });
            });
          }
        })();
      }),
      t.on(Wr.REMOVE_FIELD, function (t) {
        tr().forEach(function (e) {
          rr(e, t) &&
            (e.cancel(),
            (function (t) {
              Yn(function (e) {
                return Vn(e, function (e) {
                  return t !== e ? e : null;
                });
              });
            })(e));
        });
      }),
      t
    );
  }
  function Or() {
    var t = Un.useX();
    return t.bus || En(), t.bus;
  }
  var Wr,
    Tr = Wr || (Wr = {});
  function Fr(t) {
    return Dr(0, "tests", t);
  }
  function Dr(t, e, n) {
    var r = Un.useX("hook called outside of a running suite.");
    n &&
      [].concat(n).forEach(function (n) {
        Me(n) && (r.exclusion[e][n] = 0 === t);
      });
  }
  function qr(t) {
    for (var e in t) if (!0 === t[e]) return !0;
    return !1;
  }
  (Tr.TEST_COMPLETED = "test_completed"),
    (Tr.REMOVE_FIELD = "remove_field"),
    (Tr.SUITE_COMPLETED = "suite_completed"),
    (Fr.group = function (t) {
      return Dr(0, "groups", t);
    });
  var Rr,
    Ar = Rr || (Rr = {});
  (Ar.Error = "error"), (Ar.Warning = "warning");
  var Ir = (function () {
      function t(t, e, n) {
        var r = void 0 === n ? {} : n;
        (n = r.message),
          (r = r.groupName),
          (this.id = An()),
          (this.severity = Rr.Error),
          (this.status = Pr),
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
            (t = e), Ie(this.message) && Me(t) && (this.message = e), (t = !1);
          }
          return !1 === t && this.fail(), t;
        }),
        (t.prototype.setStatus = function (t) {
          (this.isFinalStatus() && t !== Br) || (this.status = t);
        }),
        (t.prototype.warns = function () {
          return this.severity === Rr.Warning;
        }),
        (t.prototype.setPending = function () {
          this.setStatus(Ur);
        }),
        (t.prototype.fail = function () {
          this.setStatus(this.warns() ? Lr : zr);
        }),
        (t.prototype.done = function () {
          this.isFinalStatus() || this.setStatus(Kr);
        }),
        (t.prototype.warn = function () {
          this.severity = Rr.Warning;
        }),
        (t.prototype.isFinalStatus = function () {
          return this.hasFailures() || this.isCanceled() || this.isPassing();
        }),
        (t.prototype.skip = function () {
          this.isPending() || this.setStatus(Mr);
        }),
        (t.prototype.cancel = function () {
          this.setStatus(Vr), Jn();
        }),
        (t.prototype.omit = function () {
          this.setStatus(Br);
        }),
        (t.prototype.valueOf = function () {
          return !this.isFailing();
        }),
        (t.prototype.hasFailures = function () {
          return this.isFailing() || this.isWarning();
        }),
        (t.prototype.isPending = function () {
          return this.status === Ur;
        }),
        (t.prototype.isTested = function () {
          return this.hasFailures() || this.isPassing();
        }),
        (t.prototype.isOmitted = function () {
          return this.status === Br;
        }),
        (t.prototype.isUntested = function () {
          return this.status === Pr;
        }),
        (t.prototype.isFailing = function () {
          return this.status === zr;
        }),
        (t.prototype.isCanceled = function () {
          return this.status === Vr;
        }),
        (t.prototype.isSkipped = function () {
          return this.status === Mr;
        }),
        (t.prototype.isPassing = function () {
          return this.status === Kr;
        }),
        (t.prototype.isWarning = function () {
          return this.status === Lr;
        }),
        t
      );
    })(),
    Pr = "UNTESTED",
    Mr = "SKIPPED",
    zr = "FAILED",
    Lr = "WARNING",
    Kr = "PASSING",
    Ur = "PENDING",
    Vr = "CANCELED",
    Br = "OMITTED";
  function Gr(t) {
    var e = t.asyncTest,
      n = t.message;
    if (e && _e(e.then)) {
      var r = Or().emit,
        o = Xn(),
        s = Un.bind({ stateRef: o }, function () {
          Jn(), r(Wr.TEST_COMPLETED, t);
        });
      o = Un.bind({ stateRef: o }, function (e) {
        t.isCanceled() || ((t.message = Me(e) ? e : n), t.fail(), s());
      });
      try {
        e.then(s, o);
      } catch (t) {
        o();
      }
    }
  }
  function Hr(t) {
    var e = er();
    Yn(function (n) {
      return (Gn(n, e)[Ln(e)] = t), n;
    });
  }
  function Xr(t) {
    var e = (function (t) {
      var e = Xn().testObjects(),
        n = e[1],
        r = e[0].prev;
      if (cn(r)) return Hr(t), t;
      if (
        (function (t, e) {
          return (
            ln(t) &&
            !(t.fieldName === e.fieldName && t.groupName === e.groupName)
          );
        })(
          (e = (function (t) {
            var e = er();
            return Gn(t, e)[Ln(e)];
          })(r)),
          t
        )
      ) {
        !(function (t, e) {
          Un.useX().isolate.type !== Pn.EACH &&
            (function (t, e) {
              setTimeout(function () {
                En(t, void 0);
              }, 0);
            })(
              "Vest Critical Error: Tests called in different order than previous run.\n    expected: " +
                t.fieldName +
                "\n    received: " +
                e.fieldName +
                "\n    This happens when you conditionally call your tests using if/else.\n    This might lead to incorrect validation results.\n    Replacing if/else with skipWhen solves these issues."
            );
        })(e, t),
          (e = Gn(r, er()));
        var o = Un.useX().testCursor.cursorAt();
        e.splice(o),
          n(function (t) {
            return { prev: r, current: t.current };
          }),
          (e = null);
      }
      return Hr((t = ke(e, t))), t;
    })(t);
    if (
      (function (t) {
        var e = t.fieldName;
        t = t.groupName;
        var n = Un.useX();
        if (n.skipped) return !0;
        var r = (n = n.exclusion).tests,
          o = r[e];
        if (!1 === o) return !0;
        if (((o = !0 === o), t)) {
          t: {
            var s = Un.useX().exclusion.groups;
            if (Object.prototype.hasOwnProperty.call(s, t)) var i = !1 === s[t];
            else {
              for (i in s)
                if (!0 === s[i]) {
                  i = !0;
                  break t;
                }
              i = !1;
            }
          }
          if (i) return !0;
          if (!0 === n.groups[t]) return !(o || (!qr(r) && !1 !== r[e]));
        }
        return !o && qr(r);
      })(t)
    )
      return t.skip(), Un.useX().testCursor.next(), e;
    if (
      (t !== e &&
        e.fieldName === t.fieldName &&
        e.groupName === t.groupName &&
        e.isPending() &&
        e.cancel(),
      Hr(t),
      Un.useX().testCursor.next(),
      t.isUntested())
    ) {
      e = Or();
      var n = (function (t) {
        return Un.run({ currentTest: t }, function () {
          try {
            var e = t.testFn();
          } catch (n) {
            (e = n), Ie(t.message) && Me(e) && (t.message = n), (e = !1);
          }
          return !1 === e && t.fail(), e;
        });
      })(t);
      try {
        n && _e(n.then)
          ? ((t.asyncTest = n), t.setPending(), Gr(t))
          : e.emit(Wr.TEST_COMPLETED, t);
      } catch (e) {
        En(
          "Your test function " +
            t.fieldName +
            ' returned a value. Only "false" or Promise returns are supported.'
        );
      }
    } else (e = t.asyncTest) && _e(e.then) && (t.setPending(), Gr(t));
    return t;
  }
  function Jr(t) {
    for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    (n = e.reverse()), (e = n[0]), (n = n[1]);
    var r = Un.useX();
    return Xr((e = new Ir(t, e, { message: n, groupName: r.groupName })));
  }
  var Yr = Ee(Jr, {
    each: (function (t) {
      return function (e) {
        return (
          Xe(e) || En("test.each: Expected table to be an array."),
          function (n) {
            for (var r = [], o = 1; o < arguments.length; o++)
              r[o - 1] = arguments[o];
            var s = (r = r.reverse())[0],
              i = r[1];
            return nr({ type: Pn.EACH }, function () {
              return e.map(function (e) {
                return (
                  (e = [].concat(e)),
                  t(
                    je.apply(void 0, Ne([n], e)),
                    je.apply(void 0, Ne([i], e)),
                    function () {
                      return s.apply(void 0, e);
                    }
                  )
                );
              });
            });
          }
        );
      };
    })(Jr),
    memo: (function (t) {
      var e = Hn(100);
      return function (n) {
        for (var r = [], o = 1; o < arguments.length; o++)
          r[o - 1] = arguments[o];
        o = Un.useX().testCursor.cursorAt();
        var s = (r = r.reverse())[0],
          i = r[1],
          a = r[2];
        return (
          (o = [Xn().suiteId()[0], n, o].concat(s)),
          null === (r = e.get(o))
            ? e(o, function () {
                return t(n, a, i);
              })
            : r[1].isCanceled()
            ? (e.invalidate(o),
              e(o, function () {
                return t(n, a, i);
              }))
            : Xr(r[1])
        );
      };
    })(Jr),
  });
  const Zr = (function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
    var n = (t = t.reverse())[0];
    (t = t[1]), _e(n) || En("vest.create: Expected callback to be a function.");
    var r = kr(),
      o = In();
    return (
      (t = { stateRef: zn(o, { suiteId: An(), suiteName: t }), bus: r }),
      Ee(
        Un.bind(t, function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return (
            o.reset(),
            nr({ type: Pn.SUITE }, function () {
              n.apply(void 0, t);
            }),
            r.emit(Wr.SUITE_COMPLETED),
            xr()
          );
        }),
        {
          get: Un.bind(t, wr),
          reset: o.reset,
          remove: Un.bind(t, function (t) {
            r.emit(Wr.REMOVE_FIELD, t);
          }),
        }
      )
    );
  })("Settings Form", (t = {}, e) => {
    Fr(e),
      Yr("newRWeight", "Must be between 0 and 3", () => {
        Rn(t.newRWeight).gte(0), Rn(t.newRWeight).lte(3);
      }),
      Yr("newKWeight", "Must be between 0 and 3", () => {
        Rn(t.newKWeight).gte(0), Rn(t.newKWeight).lte(3);
      }),
      Yr("newVWeight", "Must be between 0 and 3", () => {
        Rn(t.newVWeight).gte(0), Rn(t.newVWeight).lte(3);
      });
  });
  function Qr(t) {
    let e,
      n,
      r,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      S,
      F,
      D,
      q,
      R,
      A,
      I,
      P,
      M,
      z,
      L,
      K,
      U,
      V,
      B,
      G,
      H,
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
      at,
      ut,
      dt,
      gt,
      pt,
      mt,
      ht,
      vt,
      yt,
      bt,
      $t,
      wt,
      Ct,
      xt,
      Nt,
      Et,
      _t,
      St,
      jt,
      kt,
      Ot,
      Wt,
      Tt,
      Ft,
      Dt,
      qt,
      Rt,
      At,
      It,
      Pt,
      Mt,
      zt,
      Lt,
      Kt,
      Ut,
      Vt,
      Bt,
      Gt,
      Ht,
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
      se,
      ie,
      ae,
      ue,
      ce,
      le,
      fe,
      de,
      ge,
      pe,
      me,
      he,
      ve,
      ye,
      be,
      $e,
      we,
      xe,
      Ne,
      Ee,
      _e = t[0].targetApprentice + "",
      Se = t[0].targetSpeed + "",
      je = t[0].targetRevDay + "",
      ke = t[0].madCutoff + "",
      Oe = t[0].tzOffset + "";
    return (
      ($ = new Ce({ props: { errors: t[1], path: "newRWeight" } })),
      (R = new Ce({ props: { errors: t[1], path: "newKWeight" } })),
      (L = new Ce({ props: { errors: t[1], path: "newVWeight" } })),
      (ue = new Ce({ props: { errors: t[1], path: "madCutoff" } })),
      (ve = new Ce({ props: { errors: t[1], path: "tzOffset" } })),
      {
        c() {
          (e = w("form")),
            (n = w("fieldset")),
            (r = w("legend")),
            (r.textContent = "Behavior Settings"),
            (s = N()),
            (i = w("label")),
            (i.textContent = "Desired number of apprentice items"),
            (a = N()),
            (u = w("input")),
            (c = N()),
            (l = w("p")),
            (f = x(_e)),
            (d = N()),
            (g = w("label")),
            (g.textContent = "Weighting factor for new radicals"),
            (p = N()),
            (h = w("input")),
            (v = N()),
            ct($.$$.fragment),
            (C = N()),
            (S = w("label")),
            (S.textContent = "Weighting factor for new kanji"),
            (F = N()),
            (D = w("input")),
            (q = N()),
            ct(R.$$.fragment),
            (A = N()),
            (I = w("label")),
            (I.textContent = "Weighting factor for new vocabulary"),
            (P = N()),
            (M = w("input")),
            (z = N()),
            ct(L.$$.fragment),
            (K = N()),
            (U = w("hr")),
            (V = N()),
            (B = w("label")),
            (B.textContent = "Target speed (seconds-per-question)"),
            (G = N()),
            (H = w("input")),
            (X = N()),
            (J = w("p")),
            (Y = x(Se)),
            (Z = N()),
            (Q = w("label")),
            (Q.textContent = "Target reviews-per-day"),
            (tt = N()),
            (et = w("input")),
            (nt = N()),
            (rt = w("p")),
            (ot = x(je)),
            (at = N()),
            (ut = w("fieldset")),
            (dt = w("legend")),
            (dt.textContent = "General Settings"),
            (gt = N()),
            (pt = w("div")),
            (mt = w("h3")),
            (ht = x("Sample Text")),
            (vt = N()),
            (yt = w("div")),
            (bt = w("div")),
            ($t = w("div")),
            (wt = w("div")),
            (Ct = N()),
            (xt = w("label")),
            (xt.textContent = "Text"),
            (Nt = N()),
            (Et = w("input")),
            (_t = N()),
            (St = w("label")),
            (St.textContent = "Background"),
            (jt = N()),
            (kt = w("input")),
            (Ot = N()),
            (Wt = w("label")),
            (Wt.textContent = "Fill"),
            (Tt = N()),
            (Ft = w("input")),
            (Dt = N()),
            (qt = w("div")),
            (Rt = w("label")),
            (Rt.textContent = "Good"),
            (At = N()),
            (It = w("input")),
            (Pt = N()),
            (Mt = w("label")),
            (Mt.textContent = "Warning"),
            (zt = N()),
            (Lt = w("input")),
            (Kt = N()),
            (Ut = w("label")),
            (Ut.textContent = "Alert"),
            (Vt = N()),
            (Bt = w("input")),
            (Gt = x("\n    Theme:\n    \n    ")),
            (Ht = w("button")),
            (Ht.textContent = "Light"),
            (Xt = N()),
            (Jt = w("button")),
            (Jt.textContent = "dark"),
            (Yt = N()),
            (Zt = w("fieldset")),
            (Qt = w("legend")),
            (Qt.textContent = "Advanced Settings"),
            (te = N()),
            (ee = w("label")),
            (ee.textContent = "MAD cutoff"),
            (ne = N()),
            (re = w("input")),
            (oe = N()),
            (se = w("p")),
            (ie = x(ke)),
            (ae = N()),
            ct(ue.$$.fragment),
            (ce = N()),
            (le = w("label")),
            (le.textContent = "Time zone offset for start-of-day calculations"),
            (fe = N()),
            (de = w("input")),
            (ge = N()),
            (pe = w("p")),
            (me = x(Oe)),
            (he = N()),
            ct(ve.$$.fragment),
            (ye = N()),
            (be = w("button")),
            (be.textContent = "Save"),
            ($e = N()),
            (we = w("button")),
            (we.textContent = "Reset"),
            j(i, "for", "apprenticeItems"),
            j(i, "class", "svelte-1ljtm41"),
            j(u, "type", "range"),
            j(u, "name", "apprenticeItems"),
            j(u, "id", "apprenticeItems"),
            j(u, "min", "0"),
            j(u, "max", "200"),
            j(u, "step", "10"),
            j(g, "for", "newRWeight"),
            j(g, "class", "svelte-1ljtm41"),
            j(h, "type", "number"),
            j(h, "name", "newRWeight"),
            j(h, "id", "newRWeight"),
            j(h, "min", "0"),
            j(h, "max", "3"),
            j(h, "step", "0.25"),
            j(S, "for", "newKWeight"),
            j(S, "class", "svelte-1ljtm41"),
            j(D, "type", "number"),
            j(D, "name", "newKWeight"),
            j(D, "id", "newKWeight"),
            j(D, "min", "0"),
            j(D, "max", "3"),
            j(D, "step", "0.25"),
            j(I, "for", "newVWeight"),
            j(I, "class", "svelte-1ljtm41"),
            j(M, "type", "number"),
            j(M, "name", "newVWeight"),
            j(M, "id", "newVWeight"),
            j(M, "min", "0"),
            j(M, "max", "3"),
            j(M, "step", "0.25"),
            j(B, "for", "targetSpeed"),
            j(B, "class", "svelte-1ljtm41"),
            j(H, "type", "range"),
            j(H, "min", "3"),
            j(H, "max", "15"),
            j(H, "step", "0.5"),
            j(H, "name", "targetSpeed"),
            j(H, "id", "targetSpeed"),
            j(Q, "for", "targetRevDay"),
            j(Q, "class", "svelte-1ljtm41"),
            j(et, "type", "range"),
            j(et, "min", "1"),
            j(et, "max", "300"),
            j(et, "name", "targetRevDay"),
            j(et, "id", "targetRevDay"),
            T(mt, "color", t[0].textColor),
            j(bt, "class", "goodBar svelte-1ljtm41"),
            T(bt, "background-color", t[0].goodColor),
            j($t, "class", "warnBar svelte-1ljtm41"),
            T($t, "background-color", t[0].warnColor),
            j(wt, "class", "errorBar svelte-1ljtm41"),
            T(wt, "background-color", t[0].errorColor),
            j(yt, "class", "gaugeBar svelte-1ljtm41"),
            T(yt, "background-color", t[0].fillColor),
            j(pt, "class", "colorSample svelte-1ljtm41"),
            T(pt, "background-color", t[0].bgColor),
            j(xt, "for", "textColor"),
            j(xt, "class", "svelte-1ljtm41"),
            j(Et, "type", "color"),
            j(Et, "name", "textColor"),
            j(Et, "id", "textColor"),
            j(Et, "class", "svelte-1ljtm41"),
            j(St, "for", "bgColor"),
            j(St, "class", "svelte-1ljtm41"),
            j(kt, "type", "color"),
            j(kt, "name", "bgColor"),
            j(kt, "id", "bgColor"),
            j(kt, "class", "svelte-1ljtm41"),
            j(Wt, "for", "fillColor"),
            j(Wt, "class", "svelte-1ljtm41"),
            j(Ft, "type", "color"),
            j(Ft, "name", "fillColor"),
            j(Ft, "id", "fillColor"),
            j(Ft, "class", "svelte-1ljtm41"),
            j(Rt, "for", "goodColor"),
            j(Rt, "class", "svelte-1ljtm41"),
            j(It, "type", "color"),
            j(It, "name", "goodColor"),
            j(It, "id", "goodColor"),
            j(It, "class", "svelte-1ljtm41"),
            j(Mt, "for", "warnColor"),
            j(Mt, "class", "svelte-1ljtm41"),
            j(Lt, "type", "color"),
            j(Lt, "name", "warnColor"),
            j(Lt, "id", "warnColor"),
            j(Lt, "class", "svelte-1ljtm41"),
            j(Ut, "for", "alertColor"),
            j(Ut, "class", "svelte-1ljtm41"),
            j(Bt, "type", "color"),
            j(Bt, "name", "alertColor"),
            j(Bt, "id", "alertColor"),
            j(Bt, "class", "svelte-1ljtm41"),
            j(Ht, "class", "svelte-1ljtm41"),
            j(Jt, "class", "svelte-1ljtm41"),
            j(ee, "for", "madCutoff"),
            j(ee, "class", "svelte-1ljtm41"),
            j(re, "type", "range"),
            j(re, "min", "1"),
            j(re, "max", "20"),
            j(re, "step", "0.1"),
            j(re, "name", "madCutoff"),
            j(re, "id", "madCutoff"),
            j(le, "for", "tzOffset"),
            j(le, "class", "svelte-1ljtm41"),
            j(de, "type", "range"),
            j(de, "min", "-23"),
            j(de, "max", "23"),
            j(de, "name", "tzOffset"),
            j(de, "id", "tzOffset"),
            j(be, "type", "submit"),
            j(be, "class", "svelte-1ljtm41"),
            j(we, "type", "reset"),
            j(we, "class", "svelte-1ljtm41"),
            j(e, "aria-label", "Settings Form"),
            j(e, "class", "svelte-1ljtm41");
        },
        m(o, b) {
          y(o, e, b),
            m(e, n),
            m(n, r),
            m(n, s),
            m(n, i),
            m(n, a),
            m(n, u),
            W(u, t[0].targetApprentice),
            m(n, c),
            m(n, l),
            m(l, f),
            m(n, d),
            m(n, g),
            m(n, p),
            m(n, h),
            W(h, t[0].newRWeight),
            m(n, v),
            lt($, n, null),
            m(n, C),
            m(n, S),
            m(n, F),
            m(n, D),
            W(D, t[0].newKWeight),
            m(n, q),
            lt(R, n, null),
            m(n, A),
            m(n, I),
            m(n, P),
            m(n, M),
            W(M, t[0].newVWeight),
            m(n, z),
            lt(L, n, null),
            m(n, K),
            m(n, U),
            m(n, V),
            m(n, B),
            m(n, G),
            m(n, H),
            W(H, t[0].targetSpeed),
            m(n, X),
            m(n, J),
            m(J, Y),
            m(n, Z),
            m(n, Q),
            m(n, tt),
            m(n, et),
            W(et, t[0].targetRevDay),
            m(n, nt),
            m(n, rt),
            m(rt, ot),
            m(e, at),
            m(e, ut),
            m(ut, dt),
            m(ut, gt),
            m(ut, pt),
            m(pt, mt),
            m(mt, ht),
            m(pt, vt),
            m(pt, yt),
            m(yt, bt),
            m(yt, $t),
            m(yt, wt),
            m(ut, Ct),
            m(ut, xt),
            m(ut, Nt),
            m(ut, Et),
            W(Et, t[0].textColor),
            m(ut, _t),
            m(ut, St),
            m(ut, jt),
            m(ut, kt),
            W(kt, t[0].bgColor),
            m(ut, Ot),
            m(ut, Wt),
            m(ut, Tt),
            m(ut, Ft),
            W(Ft, t[0].fillColor),
            m(ut, Dt),
            m(ut, qt),
            m(qt, Rt),
            m(qt, At),
            m(qt, It),
            W(It, t[0].goodColor),
            m(qt, Pt),
            m(qt, Mt),
            m(qt, zt),
            m(qt, Lt),
            W(Lt, t[0].warnColor),
            m(qt, Kt),
            m(qt, Ut),
            m(qt, Vt),
            m(qt, Bt),
            W(Bt, t[0].alertColor),
            m(ut, Gt),
            m(ut, Ht),
            m(ut, Xt),
            m(ut, Jt),
            m(e, Yt),
            m(e, Zt),
            m(Zt, Qt),
            m(Zt, te),
            m(Zt, ee),
            m(Zt, ne),
            m(Zt, re),
            W(re, t[0].madCutoff),
            m(Zt, oe),
            m(Zt, se),
            m(se, ie),
            m(Zt, ae),
            lt(ue, Zt, null),
            m(Zt, ce),
            m(Zt, le),
            m(Zt, fe),
            m(Zt, de),
            W(de, t[0].tzOffset),
            m(Zt, ge),
            m(Zt, pe),
            m(pe, me),
            m(Zt, he),
            lt(ve, Zt, null),
            m(e, ye),
            m(e, be),
            m(e, $e),
            m(e, we),
            (xe = !0),
            Ne ||
              ((Ee = [
                E(u, "change", t[7]),
                E(u, "input", t[7]),
                E(h, "input", t[8]),
                E(h, "change", t[2]("newRWeight")),
                E(D, "input", t[9]),
                E(D, "change", t[2]("newKWeight")),
                E(M, "input", t[10]),
                E(M, "change", t[2]("newVWeight")),
                E(H, "change", t[11]),
                E(H, "input", t[11]),
                E(et, "change", t[12]),
                E(et, "input", t[12]),
                E(Et, "input", t[13]),
                E(kt, "input", t[14]),
                E(Ft, "input", t[15]),
                E(It, "input", t[16]),
                E(Lt, "input", t[17]),
                E(Bt, "input", t[18]),
                E(Ht, "click", t[5]),
                E(Jt, "click", t[6]),
                E(re, "change", t[19]),
                E(re, "input", t[19]),
                E(de, "change", t[20]),
                E(de, "input", t[20]),
                E(we, "click", t[4]),
                E(e, "submit", _(t[3])),
              ]),
              (Ne = !0));
        },
        p(t, [e]) {
          1 & e && W(u, t[0].targetApprentice),
            (!xe || 1 & e) &&
              _e !== (_e = t[0].targetApprentice + "") &&
              O(f, _e),
            1 & e && k(h.value) !== t[0].newRWeight && W(h, t[0].newRWeight);
          const n = {};
          2 & e && (n.errors = t[1]),
            $.$set(n),
            1 & e && k(D.value) !== t[0].newKWeight && W(D, t[0].newKWeight);
          const r = {};
          2 & e && (r.errors = t[1]),
            R.$set(r),
            1 & e && k(M.value) !== t[0].newVWeight && W(M, t[0].newVWeight);
          const o = {};
          2 & e && (o.errors = t[1]),
            L.$set(o),
            1 & e && W(H, t[0].targetSpeed),
            (!xe || 1 & e) && Se !== (Se = t[0].targetSpeed + "") && O(Y, Se),
            1 & e && W(et, t[0].targetRevDay),
            (!xe || 1 & e) && je !== (je = t[0].targetRevDay + "") && O(ot, je),
            (!xe || 1 & e) && T(mt, "color", t[0].textColor),
            (!xe || 1 & e) && T(bt, "background-color", t[0].goodColor),
            (!xe || 1 & e) && T($t, "background-color", t[0].warnColor),
            (!xe || 1 & e) && T(wt, "background-color", t[0].errorColor),
            (!xe || 1 & e) && T(yt, "background-color", t[0].fillColor),
            (!xe || 1 & e) && T(pt, "background-color", t[0].bgColor),
            1 & e && W(Et, t[0].textColor),
            1 & e && W(kt, t[0].bgColor),
            1 & e && W(Ft, t[0].fillColor),
            1 & e && W(It, t[0].goodColor),
            1 & e && W(Lt, t[0].warnColor),
            1 & e && W(Bt, t[0].alertColor),
            1 & e && W(re, t[0].madCutoff),
            (!xe || 1 & e) && ke !== (ke = t[0].madCutoff + "") && O(ie, ke);
          const s = {};
          2 & e && (s.errors = t[1]),
            ue.$set(s),
            1 & e && W(de, t[0].tzOffset),
            (!xe || 1 & e) && Oe !== (Oe = t[0].tzOffset + "") && O(me, Oe);
          const i = {};
          2 & e && (i.errors = t[1]), ve.$set(i);
        },
        i(t) {
          xe ||
            (st($.$$.fragment, t),
            st(R.$$.fragment, t),
            st(L.$$.fragment, t),
            st(ue.$$.fragment, t),
            st(ve.$$.fragment, t),
            (xe = !0));
        },
        o(t) {
          it($.$$.fragment, t),
            it(R.$$.fragment, t),
            it(L.$$.fragment, t),
            it(ue.$$.fragment, t),
            it(ve.$$.fragment, t),
            (xe = !1);
        },
        d(t) {
          t && b(e), ft($), ft(R), ft(L), ft(ue), ft(ve), (Ne = !1), o(Ee);
        },
      }
    );
  }
  function to(t, e, n) {
    let r;
    a(t, qt, (t) => n(21, (r = t)));
    let o = Object.assign({}, r),
      s = {};
    return [
      o,
      s,
      (t) => () => {
        const e = Zr(o, t);
        n(1, (s = e.getErrors()));
      },
      () => {
        const t = Zr(o);
        t.hasErrors()
          ? n(1, (s = t.getErrors()))
          : (n(1, (s = {})),
            c(qt, (r = Object.assign(Object.assign({}, r), o)), r));
      },
      () => {
        n(0, (o = Object.assign({}, Dt))), n(1, (s = {}));
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
        (o.targetApprentice = k(this.value)), n(0, o);
      },
      function () {
        (o.newRWeight = k(this.value)), n(0, o);
      },
      function () {
        (o.newKWeight = k(this.value)), n(0, o);
      },
      function () {
        (o.newVWeight = k(this.value)), n(0, o);
      },
      function () {
        (o.targetSpeed = k(this.value)), n(0, o);
      },
      function () {
        (o.targetRevDay = k(this.value)), n(0, o);
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
        (o.madCutoff = k(this.value)), n(0, o);
      },
      function () {
        (o.tzOffset = k(this.value)), n(0, o);
      },
    ];
  }
  class eo extends pt {
    constructor(t) {
      super(), gt(this, t, to, Qr, i, {});
    }
  }
  function no(e) {
    let n, r, o;
    return {
      c() {
        (n = w("button")),
          (n.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19.43 12.98c.04-.32.07-.64.07-.98\n      0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06\n      0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18\n      14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38\n      2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17\n      0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11\n      1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11\n      1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0\n      .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38\n      2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59\n      1.69-.98l2.49 1c.06.02.12.03.18.03.17 0\n      .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73\n      0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7\n      1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2\n      1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21\n      1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21\n      1.27.51 1.04.42.9-.68c.43-.32.84-.56\n      1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13\n      1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7\n      1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79\n      4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path></svg>'),
          j(n, "aria-label", "settings"),
          j(n, "class", "settings svelte-botxmp");
      },
      m(t, s) {
        y(t, n, s), r || ((o = E(n, "click", e[0])), (r = !0));
      },
      p: t,
      i: t,
      o: t,
      d(t) {
        t && b(n), (r = !1), o();
      },
    };
  }
  function ro(t) {
    return [
      function (e) {
        z.call(this, t, e);
      },
    ];
  }
  class oo extends pt {
    constructor(t) {
      super(), gt(this, t, ro, no, i, {});
    }
  }
  const so = (t) => {
      if (0 === t.length) return 0;
      const e = t.slice().sort((t, e) => t - e),
        n = Math.floor(e.length / 2);
      return e.length % 2 ? e[n] : (e[n - 1] + e[n]) / 2;
    },
    io = (t) => ({
      subject_id: t.data.subject_id,
      started: new Date(t.data.created_at),
      duration: 0,
      reading_incorrect: +t.data.incorrect_reading_answers,
      meaning_incorrect: +t.data.incorrect_meaning_answers,
      questions: 0,
    }),
    ao = (t, e, n) => {
      if (n[e + 1]) {
        const r = n[e + 1].started.getTime(),
          o = t.started.getTime();
        if (r < o) throw "Reviews not in sequential creation order!";
        return Object.assign(Object.assign({}, t), { duration: r - o });
      }
      return t;
    },
    uo = async (t) => {
      if (!(null == t ? void 0 : t.length)) return [];
      const e = t.map(io).map(ao),
        n = await (async (t) => {
          let e = t.slice();
          for (let t of e) {
            const e = await At(+t.subject_id);
            (t.questions = "radical" === e.object ? 1 : 2),
              (t.questions += t.meaning_incorrect + t.reading_incorrect);
          }
          return e;
        })(e);
      let r = n.slice(0, -1).map((t) => t.duration),
        o = so(r);
      return n.length && (n[n.length - 1].duration = o), n;
    },
    co = async (t) => {
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
      return uo(null == n ? void 0 : n.data);
    },
    lo = (t) => {
      if (0 === t.length) return [];
      const e = ((t) => {
          const e = t.map((t) => t.duration),
            n = Math.min(...e);
          if ((Math.max(...e), n > 6e5)) return e.map((t, e) => e);
          {
            const n = so(e),
              r = t.map((t) => Math.abs(t.duration - n)),
              o = 1.4826,
              s = so(r) * o,
              i = r.map((t) =>
                s > 0 ? Math.abs(t - n) / s : Math.abs(t - n) / n
              ),
              a = 10,
              u = i[i.length - 1] > a ? i : [...i.slice(0, -1), 999999],
              c = t.map((t, e) => e),
              l = c.filter((t, e) => u[e] > a);
            return l;
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
    };
  function fo(t, { delay: n = 0, duration: r = 400, easing: o = e } = {}) {
    const s = +getComputedStyle(t).opacity;
    return {
      delay: n,
      duration: r,
      easing: o,
      css: (t) => "opacity: " + t * s,
    };
  }
  const go = /[a-zA-Z]/,
    po = (t, e = 0) => [...Array(t).keys()].map((t) => t + e);
  function mo(t, e, n) {
    const r = t.slice();
    return (r[6] = e[n]), r;
  }
  function ho(t) {
    let e;
    return {
      c() {
        (e = w("div")),
          j(e, "class", "dot svelte-14w6xk7"),
          T(e, "--dotSize", 0.25 * +t[3] + t[1]),
          T(e, "--color", t[0]),
          T(e, "animation-delay", t[6] * (+t[5] / 10) + t[4]);
      },
      m(t, n) {
        y(t, e, n);
      },
      p(t, n) {
        10 & n && T(e, "--dotSize", 0.25 * +t[3] + t[1]),
          1 & n && T(e, "--color", t[0]);
      },
      d(t) {
        t && b(e);
      },
    };
  }
  function vo(e) {
    let n,
      r = po(3, 1),
      o = [];
    for (let t = 0; t < r.length; t += 1) o[t] = ho(mo(e, r, t));
    return {
      c() {
        n = w("div");
        for (let t = 0; t < o.length; t += 1) o[t].c();
        j(n, "class", "wrapper svelte-14w6xk7"),
          T(n, "--size", e[3] + e[1]),
          T(n, "--duration", e[2]);
      },
      m(t, e) {
        y(t, n, e);
        for (let t = 0; t < o.length; t += 1) o[t].m(n, null);
      },
      p(t, [e]) {
        if (59 & e) {
          let s;
          for (r = po(3, 1), s = 0; s < r.length; s += 1) {
            const i = mo(t, r, s);
            o[s] ? o[s].p(i, e) : ((o[s] = ho(i)), o[s].c(), o[s].m(n, null));
          }
          for (; s < o.length; s += 1) o[s].d(1);
          o.length = r.length;
        }
        10 & e && T(n, "--size", t[3] + t[1]),
          4 & e && T(n, "--duration", t[2]);
      },
      i: t,
      o: t,
      d(t) {
        t && b(n), $(o, t);
      },
    };
  }
  function yo(t, e, n) {
    let { color: r = "#FF3E00" } = e,
      { unit: o = "px" } = e,
      { duration: s = "0.6s" } = e,
      { size: i = "60" } = e,
      a = s.match(go)[0],
      u = s.replace(go, "");
    return (
      (t.$$set = (t) => {
        "color" in t && n(0, (r = t.color)),
          "unit" in t && n(1, (o = t.unit)),
          "duration" in t && n(2, (s = t.duration)),
          "size" in t && n(3, (i = t.size));
      }),
      [r, o, s, i, a, u]
    );
  }
  class bo extends pt {
    constructor(t) {
      super(),
        gt(this, t, yo, vo, i, { color: 0, unit: 1, duration: 2, size: 3 });
    }
  }
  function $o(t) {
    let e, n, r, o;
    return (
      (n = new bo({ props: { size: "25", unit: "px" } })),
      {
        c() {
          (e = w("div")),
            ct(n.$$.fragment),
            j(e, "class", "spinner svelte-13dja7q");
        },
        m(t, r) {
          y(t, e, r), lt(n, e, null), (o = !0);
        },
        i(t) {
          o ||
            (st(n.$$.fragment, t),
            H(() => {
              r || (r = ut(e, fo, {}, !0)), r.run(1);
            }),
            (o = !0));
        },
        o(t) {
          it(n.$$.fragment, t),
            r || (r = ut(e, fo, {}, !1)),
            r.run(0),
            (o = !1);
        },
        d(t) {
          t && b(e), ft(n), t && r && r.end();
        },
      }
    );
  }
  function wo(t) {
    let e, n;
    return (
      (e = new eo({})),
      {
        c() {
          ct(e.$$.fragment);
        },
        m(t, r) {
          lt(e, t, r), (n = !0);
        },
        i(t) {
          n || (st(e.$$.fragment, t), (n = !0));
        },
        o(t) {
          it(e.$$.fragment, t), (n = !1);
        },
        d(t) {
          ft(e, t);
        },
      }
    );
  }
  function Co(t) {
    let e,
      n,
      r,
      s,
      i,
      a,
      u,
      c,
      l,
      f,
      d,
      g,
      p,
      h,
      v,
      $,
      C,
      x,
      S,
      O,
      T,
      D,
      q,
      R,
      A,
      I = t[1] && $o();
    return (
      (p = new oo({})),
      p.$on("click", t[6]),
      ($ = new Kt({})),
      (x = new Jt({})),
      (O = new de({})),
      (D = new ye({
        props: { $$slots: { default: [wo] }, $$scope: { ctx: t } },
      })),
      {
        c() {
          (e = w("div")),
            (n = w("div")),
            (r = w("label")),
            (r.textContent = "Days to display:"),
            (s = N()),
            (i = w("input")),
            (a = N()),
            I && I.c(),
            (u = N()),
            (c = w("nav")),
            (l = w("li")),
            (l.textContent = "Graphs"),
            (f = N()),
            (d = w("li")),
            (d.textContent = "Data"),
            (g = N()),
            ct(p.$$.fragment),
            (h = N()),
            (v = w("div")),
            ct($.$$.fragment),
            (C = N()),
            ct(x.$$.fragment),
            (S = N()),
            ct(O.$$.fragment),
            (T = N()),
            ct(D.$$.fragment),
            j(r, "for", "review-days"),
            j(r, "class", "svelte-13dja7q"),
            j(i, "type", "number"),
            j(i, "id", "review-days"),
            j(i, "name", "review-days"),
            j(i, "min", "1"),
            j(i, "max", "7"),
            j(i, "class", "svelte-13dja7q"),
            j(n, "class", "retrieval svelte-13dja7q"),
            j(l, "class", "svelte-13dja7q"),
            F(l, "active", "chart" === t[2]),
            j(d, "class", "svelte-13dja7q"),
            F(d, "active", "data" === t[2]),
            j(c, "class", "navigation svelte-13dja7q"),
            j(e, "class", "controls svelte-13dja7q"),
            j(v, "data-testid", "gbwidgets"),
            j(v, "class", "gbwidgets svelte-13dja7q");
        },
        m(o, b) {
          y(o, e, b),
            m(e, n),
            m(n, r),
            m(n, s),
            m(n, i),
            W(i, t[0]),
            m(e, a),
            I && I.m(e, null),
            m(e, u),
            m(e, c),
            m(c, l),
            m(c, f),
            m(c, d),
            m(e, g),
            lt(p, e, null),
            y(o, h, b),
            y(o, v, b),
            lt($, v, null),
            m(v, C),
            lt(x, v, null),
            m(v, S),
            lt(O, v, null),
            y(o, T, b),
            lt(D, o, b),
            (q = !0),
            R ||
              ((A = [
                E(i, "input", t[3]),
                E(l, "click", _(t[4])),
                E(d, "click", _(t[5])),
              ]),
              (R = !0));
        },
        p(t, [n]) {
          1 & n && k(i.value) !== t[0] && W(i, t[0]),
            t[1]
              ? I
                ? 2 & n && st(I, 1)
                : ((I = $o()), I.c(), st(I, 1), I.m(e, u))
              : I &&
                (rt(),
                it(I, 1, 1, () => {
                  I = null;
                }),
                ot()),
            4 & n && F(l, "active", "chart" === t[2]),
            4 & n && F(d, "active", "data" === t[2]);
          const r = {};
          1024 & n && (r.$$scope = { dirty: n, ctx: t }), D.$set(r);
        },
        i(t) {
          q ||
            (st(I),
            st(p.$$.fragment, t),
            st($.$$.fragment, t),
            st(x.$$.fragment, t),
            st(O.$$.fragment, t),
            st(D.$$.fragment, t),
            (q = !0));
        },
        o(t) {
          it(I),
            it(p.$$.fragment, t),
            it($.$$.fragment, t),
            it(x.$$.fragment, t),
            it(O.$$.fragment, t),
            it(D.$$.fragment, t),
            (q = !1);
        },
        d(t) {
          t && b(e),
            I && I.d(),
            ft(p),
            t && b(h),
            t && b(v),
            ft($),
            ft(x),
            ft(O),
            t && b(T),
            ft(D, t),
            (R = !1),
            o(A);
        },
      }
    );
  }
  function xo(t, e, n) {
    let r, o, s;
    a(t, _t, (t) => n(0, (r = t))),
      a(t, Ft, (t) => n(7, (o = t))),
      a(t, Nt, (t) => n(2, (s = t)));
    let i = !1;
    const u = (t, e) =>
      t.getDate() === e.getDate() &&
      t.getMonth() === e.getMonth() &&
      t.getFullYear() === e.getFullYear();
    return (
      (t.$$.update = () => {
        1 & t.$$.dirty &&
          (async (t) => {
            let e;
            n(1, (i = !0));
            try {
              e = await co(t);
            } catch (t) {
              console.warn(t);
            }
            n(1, (i = !1));
            const r = e
              .filter((t, n) => !(n > 0 && u(t.started, e[n - 1].started)))
              .map((t) => t.started)
              .map((t) => e.filter((e) => u(e.started, t)));
            let s = [];
            r.forEach((t, e) => {
              const n = t
                  .filter((t) => 0 === t.reading_incorrect)
                  .reduce((t, e) => t + 1, 0),
                r = t
                  .filter((t) => 0 === t.meaning_incorrect)
                  .reduce((t, e) => t + 1, 0),
                o = t
                  .filter(
                    (t) => t.meaning_incorrect + t.reading_incorrect === 0
                  )
                  .reduce((t, e) => t + 1, 0),
                i = t.reduce((t, e) => t + e.questions, 0),
                a = t.length,
                u = {
                  start: t[0].started,
                  end: t[t.length - 1].started,
                  review_count: t.length,
                  question_count: i,
                  accuracy: o / a,
                  reading_accuracy: n / a,
                  meaning_accuracy: r / a,
                };
              s.push(u);
            }),
              c(Ft, (o = s), o);
            const a = lo(e);
            let l = [];
            a.forEach((t) => {
              const e = t.reviews.reduce((t, e) => t + e.questions, 0),
                n = t.reviews.reduce(
                  (t, e) => t + (e.meaning_incorrect + e.reading_incorrect),
                  0
                ),
                r = e - n,
                o = {
                  start: t.startTime,
                  end: t.endTime,
                  reviewCount: t.reviews.length,
                  questionCount: e,
                  correctAnswerCount: r,
                };
              l.push(o);
            }),
              Wt.set(l);
          })(+r);
      }),
      [
        r,
        i,
        s,
        function () {
          (r = k(this.value)), _t.set(r);
        },
        () => c(Nt, (s = "chart"), s),
        () => c(Nt, (s = "data"), s),
        () =>
          (function (t = "") {
            return me[t];
          })().open(),
      ]
    );
  }
  class No extends pt {
    constructor(t) {
      super(), gt(this, t, xo, Co, i, {});
    }
  }
  function Eo(e) {
    let n;
    return {
      c() {
        (n = w("div")),
          (n.innerHTML =
            '<h2>GanbarOmeter</h2>   \n    <p>The GanbarOmeter needs the Wankani Open Framework to be installed prior to use.</p>  \n    \n    <p>Please refer to the <a href="http://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549">WKOF\n    installation instructions.</a></p>'),
          j(n, "class", "placeholder svelte-1qlmed2");
      },
      m(t, e) {
        y(t, n, e);
      },
      i: t,
      o: t,
      d(t) {
        t && b(n);
      },
    };
  }
  function _o(t) {
    let e, n;
    return (
      (e = new No({})),
      {
        c() {
          ct(e.$$.fragment);
        },
        m(t, r) {
          lt(e, t, r), (n = !0);
        },
        i(t) {
          n || (st(e.$$.fragment, t), (n = !0));
        },
        o(t) {
          it(e.$$.fragment, t), (n = !1);
        },
        d(t) {
          ft(e, t);
        },
      }
    );
  }
  function So(e) {
    let n, r, o, s;
    const i = [_o, Eo],
      a = [];
    return (
      (r = (function (t, e) {
        return t[0] ? 0 : 1;
      })(e)),
      (o = a[r] = i[r](e)),
      {
        c() {
          (n = w("section")),
            o.c(),
            j(n, "data-testid", "ganbarometer"),
            j(n, "class", "svelte-1qlmed2");
        },
        m(t, e) {
          y(t, n, e), a[r].m(n, null), (s = !0);
        },
        p: t,
        i(t) {
          s || (st(o), (s = !0));
        },
        o(t) {
          it(o), (s = !1);
        },
        d(t) {
          t && b(n), a[r].d();
        },
      }
    );
  }
  function jo(t) {
    return [!!wkof];
  }
  let ko = document.querySelector(".dashboard .container .row .span12");
  return new (class extends pt {
    constructor(t) {
      super(), gt(this, t, jo, So, i, {});
    }
  })({ target: ko, anchor: ko.querySelector(".progress-and-forecast") });
})();
//# sourceMappingURL=bundle.js.map