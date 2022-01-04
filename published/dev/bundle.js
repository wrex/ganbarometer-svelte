// ==UserScript==
// @name        ganbarometer-svelte -> dev
// @description The GanbarOmeter (Wanikani dashboard widgets)
// @namespace   https://github.com/wrex/
// @version     4.0.1
// @homepage    https://github.com/wrex/ganbarometer-svelte#readme
// @author      Rex Walters -- rw [at] pobox.com
// @license     MIT-0
// @resource    css https://github.com/wrex/ganbarometer-svelte/published/dev/bundle.css
// @include     /^https://(www|preview).wanikani.com/(dashboard)?$/
// @connect     github.com
// @run-at      document-idle
// @require     https://github.com/wrex/ganbarometer-svelte/published/dev/bundle.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==
GM_addStyle(GM_getResourceText("css"));
var app = (function () {
  "use strict";

  function noop() {}
  const identity = (x) => x;
  function assign(tar, src) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k];
    return tar;
  }
  function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: { file, line, column, char },
    };
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === "object") || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== "function") {
      throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
      ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
      : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === undefined) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(
    slot,
    slot_definition,
    ctx,
    $$scope,
    slot_changes,
    get_slot_context_fn
  ) {
    if (slot_changes) {
      const slot_context = get_slot_context(
        slot_definition,
        ctx,
        $$scope,
        get_slot_context_fn
      );
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
  }

  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;

  const tasks = new Set();
  function run_tasks(now) {
    tasks.forEach((task) => {
      if (!task.c(now)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0) raf(run_tasks);
  }
  /**
   * Creates a new task that runs on each raf frame
   * until it returns a falsy value or is aborted
   */
  function loop(callback) {
    let task;
    if (tasks.size === 0) raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add((task = { c: callback, f: fulfill }));
      }),
      abort() {
        tasks.delete(task);
      },
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function get_root_for_style(node) {
    if (!node) return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    node.parentNode.removeChild(node);
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
    return function (event) {
      event.preventDefault();
      // @ts-ignore
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }
  function children(element) {
    return Array.from(element.childNodes);
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? "important" : "");
  }
  function select_option(select, value) {
    for (let i = 0; i < select.options.length; i += 1) {
      const option = select.options[i];
      if (option.__value === value) {
        option.selected = true;
        return;
      }
    }
    select.selectedIndex = -1; // no option should be selected
  }
  function select_value(select) {
    const selected_option =
      select.querySelector(":checked") || select.options[0];
    return selected_option && selected_option.__value;
  }
  function toggle_class(element, name, toggle) {
    element.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
  }

  const active_docs = new Set();
  let active = 0;
  // https://github.com/darkskyapp/string-hash/blob/master/index.js
  function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    active_docs.add(doc);
    const stylesheet =
      doc.__svelte_stylesheet ||
      (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
      current_rules[name] = true;
      stylesheet.insertRule(
        `@keyframes ${name} ${rule}`,
        stylesheet.cssRules.length
      );
    }
    const animation = node.style.animation || "";
    node.style.animation = `${
      animation ? `${animation}, ` : ""
    }${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name
        ? (anim) => anim.indexOf(name) < 0 // remove specific animation
        : (anim) => anim.indexOf("__svelte") === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active) clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active) return;
      active_docs.forEach((doc) => {
        const stylesheet = doc.__svelte_stylesheet;
        let i = stylesheet.cssRules.length;
        while (i--) stylesheet.deleteRule(i);
        doc.__svelte_rules = {};
      });
      active_docs.clear();
    });
  }

  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        // TODO are there situations where events could be dispatched
        // in a server (non-DOM) environment?
        const event = custom_event(type, detail);
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
      }
    };
  }
  // TODO figure out if we still want to support
  // shorthand events, or if we want to implement
  // a real bubbling mechanism
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      // @ts-ignore
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }

  const dirty_components = [];
  const binding_callbacks = [];
  const render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  function add_flush_callback(fn) {
    flush_callbacks.push(fn);
  }
  let flushing = false;
  const seen_callbacks = new Set();
  function flush() {
    if (flushing) return;
    flushing = true;
    do {
      // first, call beforeUpdate functions
      // and update components
      for (let i = 0; i < dirty_components.length; i += 1) {
        const component = dirty_components[i];
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }

  let promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros, // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }
  const null_transition = { duration: 0 };
  function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
      if (animation_name) delete_rule(node, animation_name);
    }
    function go() {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css,
      } = config || null_transition;
      if (css)
        animation_name = create_rule(
          node,
          0,
          1,
          duration,
          delay,
          easing,
          css,
          uid++
        );
      tick(0, 1);
      const start_time = now() + delay;
      const end_time = start_time + duration;
      if (task) task.abort();
      running = true;
      add_render_callback(() => dispatch(node, true, "start"));
      task = loop((now) => {
        if (running) {
          if (now >= end_time) {
            tick(1, 0);
            dispatch(node, true, "end");
            cleanup();
            return (running = false);
          }
          if (now >= start_time) {
            const t = easing((now - start_time) / duration);
            tick(t, 1 - t);
          }
        }
        return running;
      });
    }
    let started = false;
    return {
      start() {
        if (started) return;
        started = true;
        delete_rule(node);
        if (is_function(config)) {
          config = config();
          wait().then(go);
        } else {
          go();
        }
      },
      invalidate() {
        started = false;
      },
      end() {
        if (running) {
          cleanup();
          running = false;
        }
      },
    };
  }
  function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
      if (animation_name) delete_rule(node, animation_name);
    }
    function init(program, duration) {
      const d = program.b - t;
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group,
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css,
      } = config || null_transition;
      const program = {
        start: now() + delay,
        b,
      };
      if (!b) {
        // @ts-ignore todo: improve typings
        program.group = outros;
        outros.r += 1;
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        // if this is an intro, and there's a delay, we need to do
        // an initial tick and/or apply CSS animation immediately
        if (css) {
          clear_animation();
          animation_name = create_rule(
            node,
            t,
            b,
            duration,
            delay,
            easing,
            css
          );
        }
        if (b) tick(0, 1);
        running_program = init(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now) => {
          if (pending_program && now > pending_program.start) {
            running_program = init(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config.css
              );
            }
          }
          if (running_program) {
            if (now >= running_program.end) {
              tick((t = running_program.b), 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                // we're done
                if (running_program.b) {
                  // intro — we can tidy up immediately
                  clear_animation();
                } else {
                  // outro — needs to be coordinated
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now >= running_program.start) {
              const p = now - running_program.start;
              t =
                running_program.a +
                running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait().then(() => {
            // @ts-ignore
            config = config();
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      },
    };
  }

  const globals =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? globalThis
      : global;

  function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
      component.$$.bound[index] = callback;
      callback(component.$$.ctx[index]);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
          on_destroy.push(...new_on_destroy);
        } else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
  }
  function init(
    component,
    options,
    instance,
    create_fragment,
    not_equal,
    props,
    append_styles,
    dirty = [-1]
  ) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = (component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(
        options.context || (parent_component ? parent_component.$$.context : [])
      ),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root,
    });
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
      ? instance(component, options.props || {}, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret;
          if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
            if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
            if (ready) make_dirty(component, i);
          }
          return ret;
        })
      : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(
        component,
        options.target,
        options.anchor,
        options.customElement
      );
      flush();
    }
    set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }

  function dispatch_dev(type, detail) {
    document.dispatchEvent(
      custom_event(type, Object.assign({ version: "3.44.2" }, detail), true)
    );
  }
  function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
  }
  function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
  }
  function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
  }
  function listen_dev(
    node,
    event,
    handler,
    options,
    has_prevent_default,
    has_stop_propagation
  ) {
    const modifiers =
      options === true
        ? ["capture"]
        : options
        ? Array.from(Object.keys(options))
        : [];
    if (has_prevent_default) modifiers.push("preventDefault");
    if (has_stop_propagation) modifiers.push("stopPropagation");
    dispatch_dev("SvelteDOMAddEventListener", {
      node,
      event,
      handler,
      modifiers,
    });
    const dispose = listen(node, event, handler, options);
    return () => {
      dispatch_dev("SvelteDOMRemoveEventListener", {
        node,
        event,
        handler,
        modifiers,
      });
      dispose();
    };
  }
  function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
      dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
  }
  function set_data_dev(text, data) {
    data = "" + data;
    if (text.wholeText === data) return;
    dispatch_dev("SvelteDOMSetData", { node: text, data });
    text.data = data;
  }
  function validate_each_argument(arg) {
    if (
      typeof arg !== "string" &&
      !(arg && typeof arg === "object" && "length" in arg)
    ) {
      let msg = "{#each} only iterates over array-like objects.";
      if (typeof Symbol === "function" && arg && Symbol.iterator in arg) {
        msg += " You can use a spread to convert this iterable into an array.";
      }
      throw new Error(msg);
    }
  }
  function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
      if (!~keys.indexOf(slot_key)) {
        console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
      }
    }
  }
  /**
   * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
   */
  class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
      if (!options || (!options.target && !options.$$inline)) {
        throw new Error("'target' is a required option");
      }
      super();
    }
    $destroy() {
      super.$destroy();
      this.$destroy = () => {
        console.warn("Component was already destroyed"); // eslint-disable-line no-console
      };
    }
    $capture_state() {}
    $inject_state() {}
  }

  const subscriber_queue = [];
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          // store is ready
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update(fn) {
      set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
      const subscriber = [run, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      run(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe };
  }

  function is_date(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
  }

  function tick_spring(ctx, last_value, current_value, target_value) {
    if (typeof current_value === "number" || is_date(current_value)) {
      // @ts-ignore
      const delta = target_value - current_value;
      // @ts-ignore
      const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
      const spring = ctx.opts.stiffness * delta;
      const damper = ctx.opts.damping * velocity;
      const acceleration = (spring - damper) * ctx.inv_mass;
      const d = (velocity + acceleration) * ctx.dt;
      if (
        Math.abs(d) < ctx.opts.precision &&
        Math.abs(delta) < ctx.opts.precision
      ) {
        return target_value; // settled
      } else {
        ctx.settled = false; // signal loop to keep ticking
        // @ts-ignore
        return is_date(current_value)
          ? new Date(current_value.getTime() + d)
          : current_value + d;
      }
    } else if (Array.isArray(current_value)) {
      // @ts-ignore
      return current_value.map((_, i) =>
        tick_spring(ctx, last_value[i], current_value[i], target_value[i])
      );
    } else if (typeof current_value === "object") {
      const next_value = {};
      for (const k in current_value) {
        // @ts-ignore
        next_value[k] = tick_spring(
          ctx,
          last_value[k],
          current_value[k],
          target_value[k]
        );
      }
      // @ts-ignore
      return next_value;
    } else {
      throw new Error(`Cannot spring ${typeof current_value} values`);
    }
  }
  function spring(value, opts = {}) {
    const store = writable(value);
    const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
    let last_time;
    let task;
    let current_token;
    let last_value = value;
    let target_value = value;
    let inv_mass = 1;
    let inv_mass_recovery_rate = 0;
    let cancel_task = false;
    function set(new_value, opts = {}) {
      target_value = new_value;
      const token = (current_token = {});
      if (
        value == null ||
        opts.hard ||
        (spring.stiffness >= 1 && spring.damping >= 1)
      ) {
        cancel_task = true; // cancel any running animation
        last_time = now();
        last_value = new_value;
        store.set((value = target_value));
        return Promise.resolve();
      } else if (opts.soft) {
        const rate = opts.soft === true ? 0.5 : +opts.soft;
        inv_mass_recovery_rate = 1 / (rate * 60);
        inv_mass = 0; // infinite mass, unaffected by spring forces
      }
      if (!task) {
        last_time = now();
        cancel_task = false;
        task = loop((now) => {
          if (cancel_task) {
            cancel_task = false;
            task = null;
            return false;
          }
          inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
          const ctx = {
            inv_mass,
            opts: spring,
            settled: true,
            dt: ((now - last_time) * 60) / 1000,
          };
          const next_value = tick_spring(ctx, last_value, value, target_value);
          last_time = now;
          last_value = value;
          store.set((value = next_value));
          if (ctx.settled) {
            task = null;
          }
          return !ctx.settled;
        });
      }
      return new Promise((fulfil) => {
        task.promise.then(() => {
          if (token === current_token) fulfil();
        });
      });
    }
    const spring = {
      set,
      update: (fn, opts) => set(fn(target_value, value), opts),
      subscribe: store.subscribe,
      stiffness,
      damping,
      precision,
    };
    return spring;
  }

  /* src/components/RangePips.svelte generated by Svelte v3.44.2 */

  const file$j = "src/components/RangePips.svelte";

  function get_each_context$4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[27] = list[i];
    child_ctx[29] = i;
    return child_ctx;
  }

  // (174:2) {#if ( all && first !== false ) || first }
  function create_if_block_9(ctx) {
    let span;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*first*/ ctx[7] === "label") &&
      create_if_block_10(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        attr_dev(span, "class", "pip first");
        attr_dev(
          span,
          "style",
          (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 0%;"))
        );
        toggle_class(span, "selected", /*isSelected*/ ctx[17](/*min*/ ctx[0]));
        toggle_class(span, "in-range", /*inRange*/ ctx[16](/*min*/ ctx[0]));
        add_location(span, file$j, 174, 4, 4340);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (is_function(/*labelClick*/ ctx[20](/*min*/ ctx[0])))
                  /*labelClick*/ ctx[20](/*min*/ ctx[0]).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (is_function(/*labelClick*/ ctx[20](/*min*/ ctx[0])))
                  /*labelClick*/ ctx[20](/*min*/ ctx[0]).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*first*/ ctx[7] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_10(ctx);
            if_block.c();
            if_block.m(span, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart*/ 16384 &&
          span_style_value !==
            (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 0%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, min*/ 131073) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[17](/*min*/ ctx[0])
          );
        }

        if (dirty & /*inRange, min*/ 65537) {
          toggle_class(span, "in-range", /*inRange*/ ctx[16](/*min*/ ctx[0]));
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_9.name,
      type: "if",
      source: "(174:2) {#if ( all && first !== false ) || first }",
      ctx,
    });

    return block;
  }

  // (183:6) {#if all === 'label' || first === 'label'}
  function create_if_block_10(ctx) {
    let span;
    let t_value = /*formatter*/ ctx[12](/*min*/ ctx[0], 0, 0) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_12(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_11(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$j, 183, 8, 4630);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_12(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, min*/ 4097 &&
          t_value !==
            (t_value = /*formatter*/ ctx[12](/*min*/ ctx[0], 0, 0) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_11(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_10.name,
      type: "if",
      source: "(183:6) {#if all === 'label' || first === 'label'}",
      ctx,
    });

    return block;
  }

  // (185:10) {#if prefix}
  function create_if_block_12(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$j, 184, 22, 4674);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_12.name,
      type: "if",
      source: "(185:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (185:90) {#if suffix}
  function create_if_block_11(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$j, 184, 102, 4754);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_11.name,
      type: "if",
      source: "(185:90) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (191:2) {#if ( all && rest !== false ) || rest}
  function create_if_block_4$2(ctx) {
    let each_1_anchor;
    let each_value = Array(/*pipCount*/ ctx[19] + 1);
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$4(
        get_each_context$4(ctx, each_value, i)
      );
    }

    const block = {
      c: function create() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(target, anchor);
        }

        insert_dev(target, each_1_anchor, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty &
          /*orientationStart, percentOf, pipVal, isSelected, inRange, labelClick, suffix, formatter, prefix, all, rest, min, max, pipCount*/ 2088515
        ) {
          each_value = Array(/*pipCount*/ ctx[19] + 1);
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$4(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$4(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      d: function destroy(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching) detach_dev(each_1_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4$2.name,
      type: "if",
      source: "(191:2) {#if ( all && rest !== false ) || rest}",
      ctx,
    });

    return block;
  }

  // (193:6) {#if pipVal(i) !== min && pipVal(i) !== max}
  function create_if_block_5(ctx) {
    let span;
    let t;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*rest*/ ctx[9] === "label") &&
      create_if_block_6(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        t = space();
        attr_dev(span, "class", "pip");
        attr_dev(
          span,
          "style",
          (span_style_value =
            "" +
            /*orientationStart*/ (ctx[14] +
              ": " +
              /*percentOf*/ ctx[15](/*pipVal*/ ctx[18](/*i*/ ctx[29])) +
              "%;"))
        );
        toggle_class(
          span,
          "selected",
          /*isSelected*/ ctx[17](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
        );
        toggle_class(
          span,
          "in-range",
          /*inRange*/ ctx[16](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
        );
        add_location(span, file$j, 193, 8, 4993);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);
        append_dev(span, t);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (
                  is_function(
                    /*labelClick*/ ctx[20](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
                  )
                )
                  /*labelClick*/ ctx[20](
                    /*pipVal*/ ctx[18](/*i*/ ctx[29])
                  ).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (
                  is_function(
                    /*labelClick*/ ctx[20](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
                  )
                )
                  /*labelClick*/ ctx[20](
                    /*pipVal*/ ctx[18](/*i*/ ctx[29])
                  ).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*rest*/ ctx[9] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_6(ctx);
            if_block.c();
            if_block.m(span, t);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart, percentOf, pipVal*/ 311296 &&
          span_style_value !==
            (span_style_value =
              "" +
              /*orientationStart*/ (ctx[14] +
                ": " +
                /*percentOf*/ ctx[15](/*pipVal*/ ctx[18](/*i*/ ctx[29])) +
                "%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, pipVal*/ 393216) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[17](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
          );
        }

        if (dirty & /*inRange, pipVal*/ 327680) {
          toggle_class(
            span,
            "in-range",
            /*inRange*/ ctx[16](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_5.name,
      type: "if",
      source: "(193:6) {#if pipVal(i) !== min && pipVal(i) !== max}",
      ctx,
    });

    return block;
  }

  // (202:10) {#if all === 'label' || rest === 'label'}
  function create_if_block_6(ctx) {
    let span;
    let t_value =
      /*formatter*/ ctx[12](
        /*pipVal*/ ctx[18](/*i*/ ctx[29]),
        /*i*/ ctx[29],
        /*percentOf*/ ctx[15](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
      ) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_8(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_7(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$j, 202, 12, 5357);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_8(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, pipVal, percentOf*/ 299008 &&
          t_value !==
            (t_value =
              /*formatter*/ ctx[12](
                /*pipVal*/ ctx[18](/*i*/ ctx[29]),
                /*i*/ ctx[29],
                /*percentOf*/ ctx[15](/*pipVal*/ ctx[18](/*i*/ ctx[29]))
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_7(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_6.name,
      type: "if",
      source: "(202:10) {#if all === 'label' || rest === 'label'}",
      ctx,
    });

    return block;
  }

  // (204:14) {#if prefix}
  function create_if_block_8(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$j, 203, 26, 5405);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_8.name,
      type: "if",
      source: "(204:14) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (204:119) {#if suffix}
  function create_if_block_7(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$j, 203, 131, 5510);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_7.name,
      type: "if",
      source: "(204:119) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (192:4) {#each Array(pipCount + 1) as _, i}
  function create_each_block$4(ctx) {
    let show_if =
      /*pipVal*/ ctx[18](/*i*/ ctx[29]) !== /*min*/ ctx[0] &&
      /*pipVal*/ ctx[18](/*i*/ ctx[29]) !== /*max*/ ctx[1];
    let if_block_anchor;
    let if_block = show_if && create_if_block_5(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*pipVal, min, max*/ 262147)
          show_if =
            /*pipVal*/ ctx[18](/*i*/ ctx[29]) !== /*min*/ ctx[0] &&
            /*pipVal*/ ctx[18](/*i*/ ctx[29]) !== /*max*/ ctx[1];

        if (show_if) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_5(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$4.name,
      type: "each",
      source: "(192:4) {#each Array(pipCount + 1) as _, i}",
      ctx,
    });

    return block;
  }

  // (212:2) {#if ( all && last !== false ) || last}
  function create_if_block$b(ctx) {
    let span;
    let span_style_value;
    let mounted;
    let dispose;
    let if_block =
      /*all*/ (ctx[6] === "label" || /*last*/ ctx[8] === "label") &&
      create_if_block_1$6(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block) if_block.c();
        attr_dev(span, "class", "pip last");
        attr_dev(
          span,
          "style",
          (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 100%;"))
        );
        toggle_class(span, "selected", /*isSelected*/ ctx[17](/*max*/ ctx[1]));
        toggle_class(span, "in-range", /*inRange*/ ctx[16](/*max*/ ctx[1]));
        add_location(span, file$j, 212, 4, 5690);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block) if_block.m(span, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span,
              "click",
              function () {
                if (is_function(/*labelClick*/ ctx[20](/*max*/ ctx[1])))
                  /*labelClick*/ ctx[20](/*max*/ ctx[1]).apply(this, arguments);
              },
              false,
              false,
              false
            ),
            listen_dev(
              span,
              "touchend",
              prevent_default(function () {
                if (is_function(/*labelClick*/ ctx[20](/*max*/ ctx[1])))
                  /*labelClick*/ ctx[20](/*max*/ ctx[1]).apply(this, arguments);
              }),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;

        if (/*all*/ ctx[6] === "label" || /*last*/ ctx[8] === "label") {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_1$6(ctx);
            if_block.c();
            if_block.m(span, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty & /*orientationStart*/ 16384 &&
          span_style_value !==
            (span_style_value = "" + /*orientationStart*/ (ctx[14] + ": 100%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }

        if (dirty & /*isSelected, max*/ 131074) {
          toggle_class(
            span,
            "selected",
            /*isSelected*/ ctx[17](/*max*/ ctx[1])
          );
        }

        if (dirty & /*inRange, max*/ 65538) {
          toggle_class(span, "in-range", /*inRange*/ ctx[16](/*max*/ ctx[1]));
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$b.name,
      type: "if",
      source: "(212:2) {#if ( all && last !== false ) || last}",
      ctx,
    });

    return block;
  }

  // (221:6) {#if all === 'label' || last === 'label'}
  function create_if_block_1$6(ctx) {
    let span;
    let t_value =
      /*formatter*/ ctx[12](/*max*/ ctx[1], /*pipCount*/ ctx[19], 100) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[10] && create_if_block_3$3(ctx);
    let if_block1 = /*suffix*/ ctx[11] && create_if_block_2$4(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "pipVal");
        add_location(span, file$j, 221, 8, 5980);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[10]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_3$3(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*formatter, max, pipCount*/ 528386 &&
          t_value !==
            (t_value =
              /*formatter*/ ctx[12](/*max*/ ctx[1], /*pipCount*/ ctx[19], 100) +
              "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[11]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_2$4(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$6.name,
      type: "if",
      source: "(221:6) {#if all === 'label' || last === 'label'}",
      ctx,
    });

    return block;
  }

  // (223:10) {#if prefix}
  function create_if_block_3$3(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[10]);
        attr_dev(span, "class", "pipVal-prefix");
        add_location(span, file$j, 222, 22, 6024);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*prefix*/ 1024) set_data_dev(t, /*prefix*/ ctx[10]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3$3.name,
      type: "if",
      source: "(223:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (223:99) {#if suffix}
  function create_if_block_2$4(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[11]);
        attr_dev(span, "class", "pipVal-suffix");
        add_location(span, file$j, 222, 111, 6113);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*suffix*/ 2048) set_data_dev(t, /*suffix*/ ctx[11]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$4.name,
      type: "if",
      source: "(223:99) {#if suffix}",
      ctx,
    });

    return block;
  }

  function create_fragment$j(ctx) {
    let div;
    let t0;
    let t1;
    let if_block0 =
      /*all*/ ((ctx[6] && /*first*/ ctx[7] !== false) || /*first*/ ctx[7]) &&
      create_if_block_9(ctx);
    let if_block1 =
      /*all*/ ((ctx[6] && /*rest*/ ctx[9] !== false) || /*rest*/ ctx[9]) &&
      create_if_block_4$2(ctx);
    let if_block2 =
      /*all*/ ((ctx[6] && /*last*/ ctx[8] !== false) || /*last*/ ctx[8]) &&
      create_if_block$b(ctx);

    const block = {
      c: function create() {
        div = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        if (if_block1) if_block1.c();
        t1 = space();
        if (if_block2) if_block2.c();
        attr_dev(div, "class", "rangePips");
        toggle_class(div, "disabled", /*disabled*/ ctx[5]);
        toggle_class(div, "hoverable", /*hoverable*/ ctx[4]);
        toggle_class(div, "vertical", /*vertical*/ ctx[2]);
        toggle_class(div, "reversed", /*reversed*/ ctx[3]);
        toggle_class(div, "focus", /*focus*/ ctx[13]);
        add_location(div, file$j, 165, 0, 4175);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t0);
        if (if_block1) if_block1.m(div, null);
        append_dev(div, t1);
        if (if_block2) if_block2.m(div, null);
      },
      p: function update(ctx, [dirty]) {
        if (
          /*all*/ (ctx[6] && /*first*/ ctx[7] !== false) ||
          /*first*/ ctx[7]
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_9(ctx);
            if_block0.c();
            if_block0.m(div, t0);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*all*/ (ctx[6] && /*rest*/ ctx[9] !== false) || /*rest*/ ctx[9]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_4$2(ctx);
            if_block1.c();
            if_block1.m(div, t1);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (/*all*/ (ctx[6] && /*last*/ ctx[8] !== false) || /*last*/ ctx[8]) {
          if (if_block2) {
            if_block2.p(ctx, dirty);
          } else {
            if_block2 = create_if_block$b(ctx);
            if_block2.c();
            if_block2.m(div, null);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (dirty & /*disabled*/ 32) {
          toggle_class(div, "disabled", /*disabled*/ ctx[5]);
        }

        if (dirty & /*hoverable*/ 16) {
          toggle_class(div, "hoverable", /*hoverable*/ ctx[4]);
        }

        if (dirty & /*vertical*/ 4) {
          toggle_class(div, "vertical", /*vertical*/ ctx[2]);
        }

        if (dirty & /*reversed*/ 8) {
          toggle_class(div, "reversed", /*reversed*/ ctx[3]);
        }

        if (dirty & /*focus*/ 8192) {
          toggle_class(div, "focus", /*focus*/ ctx[13]);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$j.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$j($$self, $$props, $$invalidate) {
    let pipStep;
    let pipCount;
    let pipVal;
    let isSelected;
    let inRange;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("RangePips", slots, []);
    let { range = false } = $$props;
    let { min = 0 } = $$props;
    let { max = 100 } = $$props;
    let { step = 1 } = $$props;
    let { values = [(max + min) / 2] } = $$props;
    let { vertical = false } = $$props;
    let { reversed = false } = $$props;
    let { hoverable = true } = $$props;
    let { disabled = false } = $$props;
    let { pipstep = undefined } = $$props;
    let { all = true } = $$props;
    let { first = undefined } = $$props;
    let { last = undefined } = $$props;
    let { rest = undefined } = $$props;
    let { prefix = "" } = $$props;
    let { suffix = "" } = $$props;
    let { formatter = (v, i) => v } = $$props;
    let { focus = undefined } = $$props;
    let { orientationStart = undefined } = $$props;
    let { percentOf = undefined } = $$props;
    let { moveHandle = undefined } = $$props;

    function labelClick(val) {
      moveHandle(undefined, val);
    }

    const writable_props = [
      "range",
      "min",
      "max",
      "step",
      "values",
      "vertical",
      "reversed",
      "hoverable",
      "disabled",
      "pipstep",
      "all",
      "first",
      "last",
      "rest",
      "prefix",
      "suffix",
      "formatter",
      "focus",
      "orientationStart",
      "percentOf",
      "moveHandle",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<RangePips> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("range" in $$props) $$invalidate(21, (range = $$props.range));
      if ("min" in $$props) $$invalidate(0, (min = $$props.min));
      if ("max" in $$props) $$invalidate(1, (max = $$props.max));
      if ("step" in $$props) $$invalidate(22, (step = $$props.step));
      if ("values" in $$props) $$invalidate(23, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(2, (vertical = $$props.vertical));
      if ("reversed" in $$props) $$invalidate(3, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(4, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(5, (disabled = $$props.disabled));
      if ("pipstep" in $$props) $$invalidate(24, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(6, (all = $$props.all));
      if ("first" in $$props) $$invalidate(7, (first = $$props.first));
      if ("last" in $$props) $$invalidate(8, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(9, (rest = $$props.rest));
      if ("prefix" in $$props) $$invalidate(10, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(11, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(12, (formatter = $$props.formatter));
      if ("focus" in $$props) $$invalidate(13, (focus = $$props.focus));
      if ("orientationStart" in $$props)
        $$invalidate(14, (orientationStart = $$props.orientationStart));
      if ("percentOf" in $$props)
        $$invalidate(15, (percentOf = $$props.percentOf));
      if ("moveHandle" in $$props)
        $$invalidate(25, (moveHandle = $$props.moveHandle));
    };

    $$self.$capture_state = () => ({
      range,
      min,
      max,
      step,
      values,
      vertical,
      reversed,
      hoverable,
      disabled,
      pipstep,
      all,
      first,
      last,
      rest,
      prefix,
      suffix,
      formatter,
      focus,
      orientationStart,
      percentOf,
      moveHandle,
      labelClick,
      inRange,
      isSelected,
      pipStep,
      pipVal,
      pipCount,
    });

    $$self.$inject_state = ($$props) => {
      if ("range" in $$props) $$invalidate(21, (range = $$props.range));
      if ("min" in $$props) $$invalidate(0, (min = $$props.min));
      if ("max" in $$props) $$invalidate(1, (max = $$props.max));
      if ("step" in $$props) $$invalidate(22, (step = $$props.step));
      if ("values" in $$props) $$invalidate(23, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(2, (vertical = $$props.vertical));
      if ("reversed" in $$props) $$invalidate(3, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(4, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(5, (disabled = $$props.disabled));
      if ("pipstep" in $$props) $$invalidate(24, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(6, (all = $$props.all));
      if ("first" in $$props) $$invalidate(7, (first = $$props.first));
      if ("last" in $$props) $$invalidate(8, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(9, (rest = $$props.rest));
      if ("prefix" in $$props) $$invalidate(10, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(11, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(12, (formatter = $$props.formatter));
      if ("focus" in $$props) $$invalidate(13, (focus = $$props.focus));
      if ("orientationStart" in $$props)
        $$invalidate(14, (orientationStart = $$props.orientationStart));
      if ("percentOf" in $$props)
        $$invalidate(15, (percentOf = $$props.percentOf));
      if ("moveHandle" in $$props)
        $$invalidate(25, (moveHandle = $$props.moveHandle));
      if ("inRange" in $$props) $$invalidate(16, (inRange = $$props.inRange));
      if ("isSelected" in $$props)
        $$invalidate(17, (isSelected = $$props.isSelected));
      if ("pipStep" in $$props) $$invalidate(26, (pipStep = $$props.pipStep));
      if ("pipVal" in $$props) $$invalidate(18, (pipVal = $$props.pipVal));
      if ("pipCount" in $$props)
        $$invalidate(19, (pipCount = $$props.pipCount));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*pipstep, max, min, step, vertical*/ 20971527) {
        $$invalidate(
          26,
          (pipStep =
            pipstep ||
            ((max - min) / step >= (vertical ? 50 : 100)
              ? (max - min) / (vertical ? 10 : 20)
              : 1))
        );
      }

      if ($$self.$$.dirty & /*max, min, step, pipStep*/ 71303171) {
        $$invalidate(
          19,
          (pipCount = parseInt((max - min) / (step * pipStep), 10))
        );
      }

      if ($$self.$$.dirty & /*min, step, pipStep*/ 71303169) {
        $$invalidate(
          18,
          (pipVal = function (val) {
            return min + val * step * pipStep;
          })
        );
      }

      if ($$self.$$.dirty & /*values*/ 8388608) {
        $$invalidate(
          17,
          (isSelected = function (val) {
            return values.some((v) => v === val);
          })
        );
      }

      if ($$self.$$.dirty & /*range, values*/ 10485760) {
        $$invalidate(
          16,
          (inRange = function (val) {
            if (range === "min") {
              return values[0] > val;
            } else if (range === "max") {
              return values[0] < val;
            } else if (range) {
              return values[0] < val && values[1] > val;
            }
          })
        );
      }
    };

    return [
      min,
      max,
      vertical,
      reversed,
      hoverable,
      disabled,
      all,
      first,
      last,
      rest,
      prefix,
      suffix,
      formatter,
      focus,
      orientationStart,
      percentOf,
      inRange,
      isSelected,
      pipVal,
      pipCount,
      labelClick,
      range,
      step,
      values,
      pipstep,
      moveHandle,
      pipStep,
    ];
  }

  class RangePips extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$j, create_fragment$j, safe_not_equal, {
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

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "RangePips",
        options,
        id: create_fragment$j.name,
      });
    }

    get range() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set range(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get min() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set min(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get max() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set max(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get step() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set step(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get values() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get vertical() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set vertical(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get reversed() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set reversed(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hoverable() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set hoverable(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get disabled() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set disabled(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pipstep() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pipstep(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get all() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set all(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get first() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set first(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get last() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set last(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get rest() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set rest(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get prefix() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set prefix(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get suffix() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set suffix(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get formatter() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set formatter(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get focus() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set focus(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get orientationStart() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set orientationStart(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get percentOf() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set percentOf(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get moveHandle() {
      throw new Error(
        "<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set moveHandle(value) {
      throw new Error(
        "<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/RangeSlider.svelte generated by Svelte v3.44.2 */

  const { console: console_1$1 } = globals;
  const file$i = "src/components/RangeSlider.svelte";

  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[63] = list[i];
    child_ctx[65] = i;
    return child_ctx;
  }

  // (821:6) {#if float}
  function create_if_block_2$3(ctx) {
    let span;
    let t_value =
      /*handleFormatter*/ ctx[20](
        /*value*/ ctx[63],
        /*index*/ ctx[65],
        /*percentOf*/ ctx[22](/*value*/ ctx[63])
      ) + "";
    let t;
    let if_block0 = /*prefix*/ ctx[17] && create_if_block_4$1(ctx);
    let if_block1 = /*suffix*/ ctx[18] && create_if_block_3$2(ctx);

    const block = {
      c: function create() {
        span = element("span");
        if (if_block0) if_block0.c();
        t = text(t_value);
        if (if_block1) if_block1.c();
        attr_dev(span, "class", "rangeFloat");
        add_location(span, file$i, 821, 8, 24394);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        if (if_block0) if_block0.m(span, null);
        append_dev(span, t);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (/*prefix*/ ctx[17]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_4$1(ctx);
            if_block0.c();
            if_block0.m(span, t);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty[0] & /*handleFormatter, values, percentOf*/ 5242881 &&
          t_value !==
            (t_value =
              /*handleFormatter*/ ctx[20](
                /*value*/ ctx[63],
                /*index*/ ctx[65],
                /*percentOf*/ ctx[22](/*value*/ ctx[63])
              ) + "")
        )
          set_data_dev(t, t_value);

        if (/*suffix*/ ctx[18]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block_3$2(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$3.name,
      type: "if",
      source: "(821:6) {#if float}",
      ctx,
    });

    return block;
  }

  // (823:10) {#if prefix}
  function create_if_block_4$1(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*prefix*/ ctx[17]);
        attr_dev(span, "class", "rangeFloat-prefix");
        add_location(span, file$i, 822, 22, 24442);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty[0] & /*prefix*/ 131072) set_data_dev(t, /*prefix*/ ctx[17]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4$1.name,
      type: "if",
      source: "(823:10) {#if prefix}",
      ctx,
    });

    return block;
  }

  // (823:121) {#if suffix}
  function create_if_block_3$2(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*suffix*/ ctx[18]);
        attr_dev(span, "class", "rangeFloat-suffix");
        add_location(span, file$i, 822, 133, 24553);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty[0] & /*suffix*/ 262144) set_data_dev(t, /*suffix*/ ctx[18]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3$2.name,
      type: "if",
      source: "(823:121) {#if suffix}",
      ctx,
    });

    return block;
  }

  // (800:2) {#each values as value, index}
  function create_each_block$3(ctx) {
    let span1;
    let span0;
    let t;
    let span1_style_value;
    let span1_aria_valuemin_value;
    let span1_aria_valuemax_value;
    let span1_aria_valuenow_value;
    let span1_aria_valuetext_value;
    let span1_aria_orientation_value;
    let span1_tabindex_value;
    let mounted;
    let dispose;
    let if_block = /*float*/ ctx[6] && create_if_block_2$3(ctx);

    const block = {
      c: function create() {
        span1 = element("span");
        span0 = element("span");
        t = space();
        if (if_block) if_block.c();
        attr_dev(span0, "class", "rangeNub");
        add_location(span0, file$i, 819, 6, 24342);
        attr_dev(span1, "role", "slider");
        attr_dev(span1, "class", "rangeHandle");
        attr_dev(span1, "data-handle", /*index*/ ctx[65]);
        attr_dev(
          span1,
          "style",
          (span1_style_value =
            "" +
            /*orientationStart*/ (ctx[28] +
              ": " +
              /*$springPositions*/ ctx[29][/*index*/ ctx[65]] +
              "%; z-index: " +
              /*activeHandle*/ (ctx[26] === /*index*/ ctx[65] ? 3 : 2) +
              ";"))
        );

        attr_dev(
          span1,
          "aria-valuemin",
          (span1_aria_valuemin_value =
            /*range*/ ctx[1] === true && /*index*/ ctx[65] === 1
              ? /*values*/ ctx[0][0]
              : /*min*/ ctx[2])
        );

        attr_dev(
          span1,
          "aria-valuemax",
          (span1_aria_valuemax_value =
            /*range*/ ctx[1] === true && /*index*/ ctx[65] === 0
              ? /*values*/ ctx[0][1]
              : /*max*/ ctx[3])
        );

        attr_dev(
          span1,
          "aria-valuenow",
          (span1_aria_valuenow_value = /*value*/ ctx[63])
        );
        attr_dev(
          span1,
          "aria-valuetext",
          (span1_aria_valuetext_value =
            "" +
            /*prefix*/ (ctx[17] +
              /*handleFormatter*/ ctx[20](
                /*value*/ ctx[63],
                /*index*/ ctx[65],
                /*percentOf*/ ctx[22](/*value*/ ctx[63])
              ) +
              /*suffix*/ ctx[18]))
        );
        attr_dev(
          span1,
          "aria-orientation",
          (span1_aria_orientation_value = /*vertical*/ ctx[5]
            ? "vertical"
            : "horizontal")
        );
        attr_dev(span1, "aria-disabled", /*disabled*/ ctx[9]);
        attr_dev(span1, "disabled", /*disabled*/ ctx[9]);
        attr_dev(
          span1,
          "tabindex",
          (span1_tabindex_value = /*disabled*/ ctx[9] ? -1 : 0)
        );
        toggle_class(
          span1,
          "active",
          /*focus*/ ctx[24] && /*activeHandle*/ ctx[26] === /*index*/ ctx[65]
        );
        toggle_class(
          span1,
          "press",
          /*handlePressed*/ ctx[25] &&
            /*activeHandle*/ ctx[26] === /*index*/ ctx[65]
        );
        add_location(span1, file$i, 800, 4, 23529);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span1, anchor);
        append_dev(span1, span0);
        append_dev(span1, t);
        if (if_block) if_block.m(span1, null);

        if (!mounted) {
          dispose = [
            listen_dev(
              span1,
              "blur",
              /*sliderBlurHandle*/ ctx[33],
              false,
              false,
              false
            ),
            listen_dev(
              span1,
              "focus",
              /*sliderFocusHandle*/ ctx[34],
              false,
              false,
              false
            ),
            listen_dev(
              span1,
              "keydown",
              /*sliderKeydown*/ ctx[35],
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (/*float*/ ctx[6]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block_2$3(ctx);
            if_block.c();
            if_block.m(span1, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          dirty[0] &
            /*orientationStart, $springPositions, activeHandle*/ 872415232 &&
          span1_style_value !==
            (span1_style_value =
              "" +
              /*orientationStart*/ (ctx[28] +
                ": " +
                /*$springPositions*/ ctx[29][/*index*/ ctx[65]] +
                "%; z-index: " +
                /*activeHandle*/ (ctx[26] === /*index*/ ctx[65] ? 3 : 2) +
                ";"))
        ) {
          attr_dev(span1, "style", span1_style_value);
        }

        if (
          dirty[0] & /*range, values, min*/ 7 &&
          span1_aria_valuemin_value !==
            (span1_aria_valuemin_value =
              /*range*/ ctx[1] === true && /*index*/ ctx[65] === 1
                ? /*values*/ ctx[0][0]
                : /*min*/ ctx[2])
        ) {
          attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value);
        }

        if (
          dirty[0] & /*range, values, max*/ 11 &&
          span1_aria_valuemax_value !==
            (span1_aria_valuemax_value =
              /*range*/ ctx[1] === true && /*index*/ ctx[65] === 0
                ? /*values*/ ctx[0][1]
                : /*max*/ ctx[3])
        ) {
          attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value);
        }

        if (
          dirty[0] & /*values*/ 1 &&
          span1_aria_valuenow_value !==
            (span1_aria_valuenow_value = /*value*/ ctx[63])
        ) {
          attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value);
        }

        if (
          dirty[0] &
            /*prefix, handleFormatter, values, percentOf, suffix*/ 5636097 &&
          span1_aria_valuetext_value !==
            (span1_aria_valuetext_value =
              "" +
              /*prefix*/ (ctx[17] +
                /*handleFormatter*/ ctx[20](
                  /*value*/ ctx[63],
                  /*index*/ ctx[65],
                  /*percentOf*/ ctx[22](/*value*/ ctx[63])
                ) +
                /*suffix*/ ctx[18]))
        ) {
          attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value);
        }

        if (
          dirty[0] & /*vertical*/ 32 &&
          span1_aria_orientation_value !==
            (span1_aria_orientation_value = /*vertical*/ ctx[5]
              ? "vertical"
              : "horizontal")
        ) {
          attr_dev(span1, "aria-orientation", span1_aria_orientation_value);
        }

        if (dirty[0] & /*disabled*/ 512) {
          attr_dev(span1, "aria-disabled", /*disabled*/ ctx[9]);
        }

        if (dirty[0] & /*disabled*/ 512) {
          attr_dev(span1, "disabled", /*disabled*/ ctx[9]);
        }

        if (
          dirty[0] & /*disabled*/ 512 &&
          span1_tabindex_value !==
            (span1_tabindex_value = /*disabled*/ ctx[9] ? -1 : 0)
        ) {
          attr_dev(span1, "tabindex", span1_tabindex_value);
        }

        if (dirty[0] & /*focus, activeHandle*/ 83886080) {
          toggle_class(
            span1,
            "active",
            /*focus*/ ctx[24] && /*activeHandle*/ ctx[26] === /*index*/ ctx[65]
          );
        }

        if (dirty[0] & /*handlePressed, activeHandle*/ 100663296) {
          toggle_class(
            span1,
            "press",
            /*handlePressed*/ ctx[25] &&
              /*activeHandle*/ ctx[26] === /*index*/ ctx[65]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span1);
        if (if_block) if_block.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$3.name,
      type: "each",
      source: "(800:2) {#each values as value, index}",
      ctx,
    });

    return block;
  }

  // (828:2) {#if range}
  function create_if_block_1$5(ctx) {
    let span;
    let span_style_value;

    const block = {
      c: function create() {
        span = element("span");
        attr_dev(span, "class", "rangeBar");
        attr_dev(
          span,
          "style",
          (span_style_value =
            "" +
            /*orientationStart*/ (ctx[28] +
              ": " +
              /*rangeStart*/ ctx[31](/*$springPositions*/ ctx[29]) +
              "%; " +
              /*orientationEnd*/ ctx[27] +
              ": " +
              /*rangeEnd*/ ctx[32](/*$springPositions*/ ctx[29]) +
              "%;"))
        );
        add_location(span, file$i, 828, 4, 24674);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty[0] &
            /*orientationStart, $springPositions, orientationEnd*/ 939524096 &&
          span_style_value !==
            (span_style_value =
              "" +
              /*orientationStart*/ (ctx[28] +
                ": " +
                /*rangeStart*/ ctx[31](/*$springPositions*/ ctx[29]) +
                "%; " +
                /*orientationEnd*/ ctx[27] +
                ": " +
                /*rangeEnd*/ ctx[32](/*$springPositions*/ ctx[29]) +
                "%;"))
        ) {
          attr_dev(span, "style", span_style_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$5.name,
      type: "if",
      source: "(828:2) {#if range}",
      ctx,
    });

    return block;
  }

  // (834:2) {#if pips}
  function create_if_block$a(ctx) {
    let rangepips;
    let current;

    rangepips = new RangePips({
      props: {
        values: /*values*/ ctx[0],
        min: /*min*/ ctx[2],
        max: /*max*/ ctx[3],
        step: /*step*/ ctx[4],
        range: /*range*/ ctx[1],
        vertical: /*vertical*/ ctx[5],
        reversed: /*reversed*/ ctx[7],
        orientationStart: /*orientationStart*/ ctx[28],
        hoverable: /*hoverable*/ ctx[8],
        disabled: /*disabled*/ ctx[9],
        all: /*all*/ ctx[12],
        first: /*first*/ ctx[13],
        last: /*last*/ ctx[14],
        rest: /*rest*/ ctx[15],
        pipstep: /*pipstep*/ ctx[11],
        prefix: /*prefix*/ ctx[17],
        suffix: /*suffix*/ ctx[18],
        formatter: /*formatter*/ ctx[19],
        focus: /*focus*/ ctx[24],
        percentOf: /*percentOf*/ ctx[22],
        moveHandle: /*moveHandle*/ ctx[30],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(rangepips.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(rangepips, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const rangepips_changes = {};
        if (dirty[0] & /*values*/ 1)
          rangepips_changes.values = /*values*/ ctx[0];
        if (dirty[0] & /*min*/ 4) rangepips_changes.min = /*min*/ ctx[2];
        if (dirty[0] & /*max*/ 8) rangepips_changes.max = /*max*/ ctx[3];
        if (dirty[0] & /*step*/ 16) rangepips_changes.step = /*step*/ ctx[4];
        if (dirty[0] & /*range*/ 2) rangepips_changes.range = /*range*/ ctx[1];
        if (dirty[0] & /*vertical*/ 32)
          rangepips_changes.vertical = /*vertical*/ ctx[5];
        if (dirty[0] & /*reversed*/ 128)
          rangepips_changes.reversed = /*reversed*/ ctx[7];
        if (dirty[0] & /*orientationStart*/ 268435456)
          rangepips_changes.orientationStart = /*orientationStart*/ ctx[28];
        if (dirty[0] & /*hoverable*/ 256)
          rangepips_changes.hoverable = /*hoverable*/ ctx[8];
        if (dirty[0] & /*disabled*/ 512)
          rangepips_changes.disabled = /*disabled*/ ctx[9];
        if (dirty[0] & /*all*/ 4096) rangepips_changes.all = /*all*/ ctx[12];
        if (dirty[0] & /*first*/ 8192)
          rangepips_changes.first = /*first*/ ctx[13];
        if (dirty[0] & /*last*/ 16384)
          rangepips_changes.last = /*last*/ ctx[14];
        if (dirty[0] & /*rest*/ 32768)
          rangepips_changes.rest = /*rest*/ ctx[15];
        if (dirty[0] & /*pipstep*/ 2048)
          rangepips_changes.pipstep = /*pipstep*/ ctx[11];
        if (dirty[0] & /*prefix*/ 131072)
          rangepips_changes.prefix = /*prefix*/ ctx[17];
        if (dirty[0] & /*suffix*/ 262144)
          rangepips_changes.suffix = /*suffix*/ ctx[18];
        if (dirty[0] & /*formatter*/ 524288)
          rangepips_changes.formatter = /*formatter*/ ctx[19];
        if (dirty[0] & /*focus*/ 16777216)
          rangepips_changes.focus = /*focus*/ ctx[24];
        if (dirty[0] & /*percentOf*/ 4194304)
          rangepips_changes.percentOf = /*percentOf*/ ctx[22];
        rangepips.$set(rangepips_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(rangepips.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(rangepips.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(rangepips, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$a.name,
      type: "if",
      source: "(834:2) {#if pips}",
      ctx,
    });

    return block;
  }

  function create_fragment$i(ctx) {
    let div;
    let t0;
    let t1;
    let current;
    let mounted;
    let dispose;
    let each_value = /*values*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$3(
        get_each_context$3(ctx, each_value, i)
      );
    }

    let if_block0 = /*range*/ ctx[1] && create_if_block_1$5(ctx);
    let if_block1 = /*pips*/ ctx[10] && create_if_block$a(ctx);

    const block = {
      c: function create() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t0 = space();
        if (if_block0) if_block0.c();
        t1 = space();
        if (if_block1) if_block1.c();
        attr_dev(div, "id", /*id*/ ctx[16]);
        attr_dev(div, "class", "rangeSlider");
        toggle_class(div, "range", /*range*/ ctx[1]);
        toggle_class(div, "disabled", /*disabled*/ ctx[9]);
        toggle_class(div, "hoverable", /*hoverable*/ ctx[8]);
        toggle_class(div, "vertical", /*vertical*/ ctx[5]);
        toggle_class(div, "reversed", /*reversed*/ ctx[7]);
        toggle_class(div, "focus", /*focus*/ ctx[24]);
        toggle_class(div, "min", /*range*/ ctx[1] === "min");
        toggle_class(div, "max", /*range*/ ctx[1] === "max");
        toggle_class(div, "pips", /*pips*/ ctx[10]);
        toggle_class(
          div,
          "pip-labels",
          /*all*/ ctx[12] === "label" ||
            /*first*/ ctx[13] === "label" ||
            /*last*/ ctx[14] === "label" ||
            /*rest*/ ctx[15] === "label"
        );
        add_location(div, file$i, 780, 0, 22995);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }

        append_dev(div, t0);
        if (if_block0) if_block0.m(div, null);
        append_dev(div, t1);
        if (if_block1) if_block1.m(div, null);
        /*div_binding*/ ctx[49](div);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              window,
              "mousedown",
              /*bodyInteractStart*/ ctx[38],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchstart",
              /*bodyInteractStart*/ ctx[38],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "mousemove",
              /*bodyInteract*/ ctx[39],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchmove",
              /*bodyInteract*/ ctx[39],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "mouseup",
              /*bodyMouseUp*/ ctx[40],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "touchend",
              /*bodyTouchEnd*/ ctx[41],
              false,
              false,
              false
            ),
            listen_dev(
              window,
              "keydown",
              /*bodyKeyDown*/ ctx[42],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "mousedown",
              /*sliderInteractStart*/ ctx[36],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "mouseup",
              /*sliderInteractEnd*/ ctx[37],
              false,
              false,
              false
            ),
            listen_dev(
              div,
              "touchstart",
              prevent_default(/*sliderInteractStart*/ ctx[36]),
              false,
              true,
              false
            ),
            listen_dev(
              div,
              "touchend",
              prevent_default(/*sliderInteractEnd*/ ctx[37]),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (
          (dirty[0] &
            /*orientationStart, $springPositions, activeHandle, range, values, min, max, prefix, handleFormatter, percentOf, suffix, vertical, disabled, focus, handlePressed, float*/ 928383599) |
          (dirty[1] & /*sliderBlurHandle, sliderFocusHandle, sliderKeydown*/ 28)
        ) {
          each_value = /*values*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$3(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$3(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, t0);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (/*range*/ ctx[1]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1$5(ctx);
            if_block0.c();
            if_block0.m(div, t1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*pips*/ ctx[10]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);

            if (dirty[0] & /*pips*/ 1024) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$a(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          group_outros();

          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });

          check_outros();
        }

        if (!current || dirty[0] & /*id*/ 65536) {
          attr_dev(div, "id", /*id*/ ctx[16]);
        }

        if (dirty[0] & /*range*/ 2) {
          toggle_class(div, "range", /*range*/ ctx[1]);
        }

        if (dirty[0] & /*disabled*/ 512) {
          toggle_class(div, "disabled", /*disabled*/ ctx[9]);
        }

        if (dirty[0] & /*hoverable*/ 256) {
          toggle_class(div, "hoverable", /*hoverable*/ ctx[8]);
        }

        if (dirty[0] & /*vertical*/ 32) {
          toggle_class(div, "vertical", /*vertical*/ ctx[5]);
        }

        if (dirty[0] & /*reversed*/ 128) {
          toggle_class(div, "reversed", /*reversed*/ ctx[7]);
        }

        if (dirty[0] & /*focus*/ 16777216) {
          toggle_class(div, "focus", /*focus*/ ctx[24]);
        }

        if (dirty[0] & /*range*/ 2) {
          toggle_class(div, "min", /*range*/ ctx[1] === "min");
        }

        if (dirty[0] & /*range*/ 2) {
          toggle_class(div, "max", /*range*/ ctx[1] === "max");
        }

        if (dirty[0] & /*pips*/ 1024) {
          toggle_class(div, "pips", /*pips*/ ctx[10]);
        }

        if (dirty[0] & /*all, first, last, rest*/ 61440) {
          toggle_class(
            div,
            "pip-labels",
            /*all*/ ctx[12] === "label" ||
              /*first*/ ctx[13] === "label" ||
              /*last*/ ctx[14] === "label" ||
              /*rest*/ ctx[15] === "label"
          );
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block1);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block1);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_each(each_blocks, detaching);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        /*div_binding*/ ctx[49](null);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$i.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function index(el) {
    if (!el) return -1;
    var i = 0;

    while ((el = el.previousElementSibling)) {
      i++;
    }

    return i;
  }

  /**
   * normalise a mouse or touch event to return the
   * client (x/y) object for that event
   * @param {event} e a mouse/touch event to normalise
   * @returns {object} normalised event client object (x,y)
   **/
  function normalisedClient(e) {
    if (e.type.includes("touch")) {
      return e.touches[0];
    } else {
      return e;
    }
  }

  function instance$i($$self, $$props, $$invalidate) {
    let percentOf;
    let clampValue;
    let alignValueToStep;
    let orientationStart;
    let orientationEnd;

    let $springPositions,
      $$unsubscribe_springPositions = noop,
      $$subscribe_springPositions = () => (
        $$unsubscribe_springPositions(),
        ($$unsubscribe_springPositions = subscribe(springPositions, ($$value) =>
          $$invalidate(29, ($springPositions = $$value))
        )),
        springPositions
      );

    $$self.$$.on_destroy.push(() => $$unsubscribe_springPositions());
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("RangeSlider", slots, []);
    let { range = false } = $$props;
    let { pushy = false } = $$props;
    let { min = 0 } = $$props;
    let { max = 100 } = $$props;
    let { step = 1 } = $$props;
    let { values = [(max + min) / 2] } = $$props;
    let { vertical = false } = $$props;
    let { float = false } = $$props;
    let { reversed = false } = $$props;
    let { hoverable = true } = $$props;
    let { disabled = false } = $$props;
    let { pips = false } = $$props;
    let { pipstep = undefined } = $$props;
    let { all = undefined } = $$props;
    let { first = undefined } = $$props;
    let { last = undefined } = $$props;
    let { rest = undefined } = $$props;
    let { id = undefined } = $$props;
    let { prefix = "" } = $$props;
    let { suffix = "" } = $$props;
    let { formatter = (v, i, p) => v } = $$props;
    let { handleFormatter = formatter } = $$props;
    let { precision = 2 } = $$props;
    let { springValues = { stiffness: 0.15, damping: 0.4 } } = $$props;

    // prepare dispatched events
    const dispatch = createEventDispatcher();

    // dom references
    let slider;

    // state management
    let valueLength = 0;

    let focus = false;
    let handleActivated = false;
    let handlePressed = false;
    let keyboardActive = false;
    let activeHandle = values.length - 1;
    let startValue;
    let previousValue;

    // copy the initial values in to a spring function which
    // will update every time the values array is modified
    let springPositions;

    /**
     * check if an element is a handle on the slider
     * @param {object} el dom object reference we want to check
     * @returns {boolean}
     **/
    function targetIsHandle(el) {
      const handles = slider.querySelectorAll(".handle");
      const isHandle = Array.prototype.includes.call(handles, el);
      const isChild = Array.prototype.some.call(handles, (e) => e.contains(el));
      return isHandle || isChild;
    }

    /**
     * trim the values array based on whether the property
     * for 'range' is 'min', 'max', or truthy. This is because we
     * do not want more than one handle for a min/max range, and we do
     * not want more than two handles for a true range.
     * @param {array} values the input values for the rangeSlider
     * @return {array} the range array for creating a rangeSlider
     **/
    function trimRange(values) {
      if (range === "min" || range === "max") {
        return values.slice(0, 1);
      } else if (range) {
        return values.slice(0, 2);
      } else {
        return values;
      }
    }

    /**
     * helper to return the slider dimensions for finding
     * the closest handle to user interaction
     * @return {object} the range slider DOM client rect
     **/
    function getSliderDimensions() {
      return slider.getBoundingClientRect();
    }

    /**
     * helper to return closest handle to user interaction
     * @param {object} clientPos the client{x,y} positions to check against
     * @return {number} the index of the closest handle to clientPos
     **/
    function getClosestHandle(clientPos) {
      // first make sure we have the latest dimensions
      // of the slider, as it may have changed size
      const dims = getSliderDimensions();

      // calculate the interaction position, percent and value
      let handlePos = 0;

      let handlePercent = 0;
      let handleVal = 0;

      if (vertical) {
        handlePos = clientPos.clientY - dims.top;
        handlePercent = (handlePos / dims.height) * 100;
        handlePercent = reversed ? handlePercent : 100 - handlePercent;
      } else {
        handlePos = clientPos.clientX - dims.left;
        handlePercent = (handlePos / dims.width) * 100;
        handlePercent = reversed ? 100 - handlePercent : handlePercent;
      }

      handleVal = ((max - min) / 100) * handlePercent + min;
      let closest;

      // if we have a range, and the handles are at the same
      // position, we want a simple check if the interaction
      // value is greater than return the second handle
      if (range === true && values[0] === values[1]) {
        if (handleVal > values[1]) {
          return 1;
        } else {
          return 0;
        }
      } // we sort the handles values, and return the first one closest
      // to the interaction value
      else {
        closest = values.indexOf(
          [...values].sort(
            (a, b) => Math.abs(handleVal - a) - Math.abs(handleVal - b)
          )[0]
        ); // if there are multiple handles, and not a range, then
      }

      return closest;
    }

    /**
     * take the interaction position on the slider, convert
     * it to a value on the range, and then send that value
     * through to the moveHandle() method to set the active
     * handle's position
     * @param {object} clientPos the client{x,y} of the interaction
     **/
    function handleInteract(clientPos) {
      // first make sure we have the latest dimensions
      // of the slider, as it may have changed size
      const dims = getSliderDimensions();

      // calculate the interaction position, percent and value
      let handlePos = 0;

      let handlePercent = 0;
      let handleVal = 0;

      if (vertical) {
        handlePos = clientPos.clientY - dims.top;
        handlePercent = (handlePos / dims.height) * 100;
        handlePercent = reversed ? handlePercent : 100 - handlePercent;
      } else {
        handlePos = clientPos.clientX - dims.left;
        handlePercent = (handlePos / dims.width) * 100;
        handlePercent = reversed ? 100 - handlePercent : handlePercent;
      }

      handleVal = ((max - min) / 100) * handlePercent + min;

      // move handle to the value
      moveHandle(activeHandle, handleVal);
    }

    /**
     * move a handle to a specific value, respecting the clamp/align rules
     * @param {number} index the index of the handle we want to move
     * @param {number} value the value to move the handle to
     * @return {number} the value that was moved to (after alignment/clamping)
     **/
    function moveHandle(index, value) {
      // align & clamp the value so we're not doing extra
      // calculation on an out-of-range value down below
      value = alignValueToStep(value);

      // use the active handle if handle index is not provided
      if (typeof index === "undefined") {
        index = activeHandle;
      }

      // if this is a range slider perform special checks
      if (range) {
        // restrict the handles of a range-slider from
        // going past one-another unless "pushy" is true
        if (index === 0 && value > values[1]) {
          if (pushy) {
            $$invalidate(0, (values[1] = value), values);
          } else {
            value = values[1];
          }
        } else if (index === 1 && value < values[0]) {
          if (pushy) {
            $$invalidate(0, (values[0] = value), values);
          } else {
            value = values[0];
          }
        }
      }

      // if the value has changed, update it
      if (values[index] !== value) {
        $$invalidate(0, (values[index] = value), values);
      }

      // fire the change event when the handle moves,
      // and store the previous value for the next time
      if (previousValue !== value) {
        eChange();
        previousValue = value;
      }

      return value;
    }

    /**
     * helper to find the beginning range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the beginning of the range
     **/
    function rangeStart(values) {
      if (range === "min") {
        return 0;
      } else {
        return values[0];
      }
    }

    /**
     * helper to find the ending range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the end of the range
     **/
    function rangeEnd(values) {
      if (range === "max") {
        return 0;
      } else if (range === "min") {
        return 100 - values[0];
      } else {
        return 100 - values[1];
      }
    }

    /**
     * when the user has unfocussed (blurred) from the
     * slider, deactivate all handles
     * @param {event} e the event from browser
     **/
    function sliderBlurHandle(e) {
      if (keyboardActive) {
        $$invalidate(24, (focus = false));
        handleActivated = false;
        $$invalidate(25, (handlePressed = false));
      }
    }

    /**
     * when the user focusses the handle of a slider
     * set it to be active
     * @param {event} e the event from browser
     **/
    function sliderFocusHandle(e) {
      if (!disabled) {
        $$invalidate(26, (activeHandle = index(e.target)));
        $$invalidate(24, (focus = true));
      }
    }

    /**
     * handle the keyboard accessible features by checking the
     * input type, and modfier key then moving handle by appropriate amount
     * @param {event} e the event from browser
     **/
    function sliderKeydown(e) {
      if (!disabled) {
        const handle = index(e.target);
        let jump = e.ctrlKey || e.metaKey || e.shiftKey ? step * 10 : step;
        let prevent = false;

        switch (e.key) {
          case "PageDown":
            jump *= 10;
          case "ArrowRight":
          case "ArrowUp":
            moveHandle(handle, values[handle] + jump);
            prevent = true;
            break;
          case "PageUp":
            jump *= 10;
          case "ArrowLeft":
          case "ArrowDown":
            moveHandle(handle, values[handle] - jump);
            prevent = true;
            break;
          case "Home":
            moveHandle(handle, min);
            prevent = true;
            break;
          case "End":
            moveHandle(handle, max);
            prevent = true;
            break;
        }

        if (prevent) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }

    /**
     * function to run when the user touches
     * down on the slider element anywhere
     * @param {event} e the event from browser
     **/
    function sliderInteractStart(e) {
      if (!disabled) {
        const el = e.target;
        const clientPos = normalisedClient(e);

        // set the closest handle as active
        $$invalidate(24, (focus = true));

        handleActivated = true;
        $$invalidate(25, (handlePressed = true));
        $$invalidate(26, (activeHandle = getClosestHandle(clientPos)));

        // fire the start event
        startValue = previousValue = alignValueToStep(values[activeHandle]);

        eStart();

        // for touch devices we want the handle to instantly
        // move to the position touched for more responsive feeling
        if (e.type === "touchstart" && !el.matches(".pipVal")) {
          handleInteract(clientPos);
        }
      }
    }

    /**
     * function to run when the user stops touching
     * down on the slider element anywhere
     * @param {event} e the event from browser
     **/
    function sliderInteractEnd(e) {
      // fire the stop event for touch devices
      if (e.type === "touchend") {
        eStop();
      }

      $$invalidate(25, (handlePressed = false));
    }

    /**
     * unfocus the slider if the user clicked off of
     * it, somewhere else on the screen
     * @param {event} e the event from browser
     **/
    function bodyInteractStart(e) {
      keyboardActive = false;

      if (focus && e.target !== slider && !slider.contains(e.target)) {
        $$invalidate(24, (focus = false));
      }
    }

    /**
     * send the clientX through to handle the interaction
     * whenever the user moves acros screen while active
     * @param {event} e the event from browser
     **/
    function bodyInteract(e) {
      if (!disabled) {
        if (handleActivated) {
          handleInteract(normalisedClient(e));
        }
      }
    }

    /**
     * if user triggers mouseup on the body while
     * a handle is active (without moving) then we
     * trigger an interact event there
     * @param {event} e the event from browser
     **/
    function bodyMouseUp(e) {
      if (!disabled) {
        const el = e.target;

        // this only works if a handle is active, which can
        // only happen if there was sliderInteractStart triggered
        // on the slider, already
        if (handleActivated) {
          if (el === slider || slider.contains(el)) {
            $$invalidate(24, (focus = true));

            // don't trigger interact if the target is a handle (no need) or
            // if the target is a label (we want to move to that value from rangePips)
            if (!targetIsHandle(el) && !el.matches(".pipVal")) {
              handleInteract(normalisedClient(e));
            }
          }

          // fire the stop event for mouse device
          // when the body is triggered with an active handle
          eStop();
        }
      }

      handleActivated = false;
      $$invalidate(25, (handlePressed = false));
    }

    /**
     * if user triggers touchend on the body then we
     * defocus the slider completely
     * @param {event} e the event from browser
     **/
    function bodyTouchEnd(e) {
      handleActivated = false;
      $$invalidate(25, (handlePressed = false));
    }

    function bodyKeyDown(e) {
      if (!disabled) {
        if (e.target === slider || slider.contains(e.target)) {
          keyboardActive = true;
        }
      }
    }

    function eStart() {
      !disabled &&
        dispatch("start", {
          activeHandle,
          value: startValue,
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    function eStop() {
      !disabled &&
        dispatch("stop", {
          activeHandle,
          startValue,
          value: values[activeHandle],
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    function eChange() {
      !disabled &&
        dispatch("change", {
          activeHandle,
          startValue,
          previousValue:
            typeof previousValue === "undefined" ? startValue : previousValue,
          value: values[activeHandle],
          values: values.map((v) => alignValueToStep(v)),
        });
    }

    const writable_props = [
      "range",
      "pushy",
      "min",
      "max",
      "step",
      "values",
      "vertical",
      "float",
      "reversed",
      "hoverable",
      "disabled",
      "pips",
      "pipstep",
      "all",
      "first",
      "last",
      "rest",
      "id",
      "prefix",
      "suffix",
      "formatter",
      "handleFormatter",
      "precision",
      "springValues",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console_1$1.warn(
          `<RangeSlider> was created with unknown prop '${key}'`
        );
    });

    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        slider = $$value;
        $$invalidate(23, slider);
      });
    }

    $$self.$$set = ($$props) => {
      if ("range" in $$props) $$invalidate(1, (range = $$props.range));
      if ("pushy" in $$props) $$invalidate(43, (pushy = $$props.pushy));
      if ("min" in $$props) $$invalidate(2, (min = $$props.min));
      if ("max" in $$props) $$invalidate(3, (max = $$props.max));
      if ("step" in $$props) $$invalidate(4, (step = $$props.step));
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(5, (vertical = $$props.vertical));
      if ("float" in $$props) $$invalidate(6, (float = $$props.float));
      if ("reversed" in $$props) $$invalidate(7, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(8, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(9, (disabled = $$props.disabled));
      if ("pips" in $$props) $$invalidate(10, (pips = $$props.pips));
      if ("pipstep" in $$props) $$invalidate(11, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(12, (all = $$props.all));
      if ("first" in $$props) $$invalidate(13, (first = $$props.first));
      if ("last" in $$props) $$invalidate(14, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(15, (rest = $$props.rest));
      if ("id" in $$props) $$invalidate(16, (id = $$props.id));
      if ("prefix" in $$props) $$invalidate(17, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(18, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(19, (formatter = $$props.formatter));
      if ("handleFormatter" in $$props)
        $$invalidate(20, (handleFormatter = $$props.handleFormatter));
      if ("precision" in $$props)
        $$invalidate(44, (precision = $$props.precision));
      if ("springValues" in $$props)
        $$invalidate(45, (springValues = $$props.springValues));
    };

    $$self.$capture_state = () => ({
      spring,
      createEventDispatcher,
      RangePips,
      range,
      pushy,
      min,
      max,
      step,
      values,
      vertical,
      float,
      reversed,
      hoverable,
      disabled,
      pips,
      pipstep,
      all,
      first,
      last,
      rest,
      id,
      prefix,
      suffix,
      formatter,
      handleFormatter,
      precision,
      springValues,
      dispatch,
      slider,
      valueLength,
      focus,
      handleActivated,
      handlePressed,
      keyboardActive,
      activeHandle,
      startValue,
      previousValue,
      springPositions,
      index,
      normalisedClient,
      targetIsHandle,
      trimRange,
      getSliderDimensions,
      getClosestHandle,
      handleInteract,
      moveHandle,
      rangeStart,
      rangeEnd,
      sliderBlurHandle,
      sliderFocusHandle,
      sliderKeydown,
      sliderInteractStart,
      sliderInteractEnd,
      bodyInteractStart,
      bodyInteract,
      bodyMouseUp,
      bodyTouchEnd,
      bodyKeyDown,
      eStart,
      eStop,
      eChange,
      alignValueToStep,
      orientationEnd,
      orientationStart,
      clampValue,
      percentOf,
      $springPositions,
    });

    $$self.$inject_state = ($$props) => {
      if ("range" in $$props) $$invalidate(1, (range = $$props.range));
      if ("pushy" in $$props) $$invalidate(43, (pushy = $$props.pushy));
      if ("min" in $$props) $$invalidate(2, (min = $$props.min));
      if ("max" in $$props) $$invalidate(3, (max = $$props.max));
      if ("step" in $$props) $$invalidate(4, (step = $$props.step));
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("vertical" in $$props) $$invalidate(5, (vertical = $$props.vertical));
      if ("float" in $$props) $$invalidate(6, (float = $$props.float));
      if ("reversed" in $$props) $$invalidate(7, (reversed = $$props.reversed));
      if ("hoverable" in $$props)
        $$invalidate(8, (hoverable = $$props.hoverable));
      if ("disabled" in $$props) $$invalidate(9, (disabled = $$props.disabled));
      if ("pips" in $$props) $$invalidate(10, (pips = $$props.pips));
      if ("pipstep" in $$props) $$invalidate(11, (pipstep = $$props.pipstep));
      if ("all" in $$props) $$invalidate(12, (all = $$props.all));
      if ("first" in $$props) $$invalidate(13, (first = $$props.first));
      if ("last" in $$props) $$invalidate(14, (last = $$props.last));
      if ("rest" in $$props) $$invalidate(15, (rest = $$props.rest));
      if ("id" in $$props) $$invalidate(16, (id = $$props.id));
      if ("prefix" in $$props) $$invalidate(17, (prefix = $$props.prefix));
      if ("suffix" in $$props) $$invalidate(18, (suffix = $$props.suffix));
      if ("formatter" in $$props)
        $$invalidate(19, (formatter = $$props.formatter));
      if ("handleFormatter" in $$props)
        $$invalidate(20, (handleFormatter = $$props.handleFormatter));
      if ("precision" in $$props)
        $$invalidate(44, (precision = $$props.precision));
      if ("springValues" in $$props)
        $$invalidate(45, (springValues = $$props.springValues));
      if ("slider" in $$props) $$invalidate(23, (slider = $$props.slider));
      if ("valueLength" in $$props)
        $$invalidate(46, (valueLength = $$props.valueLength));
      if ("focus" in $$props) $$invalidate(24, (focus = $$props.focus));
      if ("handleActivated" in $$props)
        handleActivated = $$props.handleActivated;
      if ("handlePressed" in $$props)
        $$invalidate(25, (handlePressed = $$props.handlePressed));
      if ("keyboardActive" in $$props) keyboardActive = $$props.keyboardActive;
      if ("activeHandle" in $$props)
        $$invalidate(26, (activeHandle = $$props.activeHandle));
      if ("startValue" in $$props) startValue = $$props.startValue;
      if ("previousValue" in $$props) previousValue = $$props.previousValue;
      if ("springPositions" in $$props)
        $$subscribe_springPositions(
          $$invalidate(21, (springPositions = $$props.springPositions))
        );
      if ("alignValueToStep" in $$props)
        $$invalidate(47, (alignValueToStep = $$props.alignValueToStep));
      if ("orientationEnd" in $$props)
        $$invalidate(27, (orientationEnd = $$props.orientationEnd));
      if ("orientationStart" in $$props)
        $$invalidate(28, (orientationStart = $$props.orientationStart));
      if ("clampValue" in $$props)
        $$invalidate(48, (clampValue = $$props.clampValue));
      if ("percentOf" in $$props)
        $$invalidate(22, (percentOf = $$props.percentOf));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*min, max*/ 12) {
        /**
         * clamp a value from the range so that it always
         * falls within the min/max values
         * @param {number} val the value to clamp
         * @return {number} the value after it's been clamped
         **/
        $$invalidate(
          48,
          (clampValue = function (val) {
            // return the min/max if outside of that range
            return val <= min ? min : val >= max ? max : val;
          })
        );
      }

      if (
        ($$self.$$.dirty[0] & /*min, max, step*/ 28) |
        ($$self.$$.dirty[1] & /*clampValue, precision*/ 139264)
      ) {
        /**
         * align the value with the steps so that it
         * always sits on the closest (above/below) step
         * @param {number} val the value to align
         * @return {number} the value after it's been aligned
         **/
        $$invalidate(
          47,
          (alignValueToStep = function (val) {
            // sanity check for performance
            if (val <= min) {
              return min;
            } else if (val >= max) {
              return max;
            }

            // find the middle-point between steps
            // and see if the value is closer to the
            // next step, or previous step
            let remainder = (val - min) % step;

            let aligned = val - remainder;

            if (Math.abs(remainder) * 2 >= step) {
              aligned += remainder > 0 ? step : -step;
            }

            // make sure the value is within acceptable limits
            aligned = clampValue(aligned);

            // make sure the returned value is set to the precision desired
            // this is also because javascript often returns weird floats
            // when dealing with odd numbers and percentages
            return parseFloat(aligned.toFixed(precision));
          })
        );
      }

      if (
        ($$self.$$.dirty[0] & /*min, max*/ 12) |
        ($$self.$$.dirty[1] & /*precision*/ 8192)
      ) {
        /**
         * take in a value, and then calculate that value's percentage
         * of the overall range (min-max);
         * @param {number} val the value we're getting percent for
         * @return {number} the percentage value
         **/
        $$invalidate(
          22,
          (percentOf = function (val) {
            let perc = ((val - min) / (max - min)) * 100;

            if (isNaN(perc) || perc <= 0) {
              return 0;
            } else if (perc >= 100) {
              return 100;
            } else {
              return parseFloat(perc.toFixed(precision));
            }
          })
        );
      }

      if (
        ($$self.$$.dirty[0] &
          /*values, max, min, percentOf, springPositions*/ 6291469) |
        ($$self.$$.dirty[1] &
          /*alignValueToStep, valueLength, springValues*/ 114688)
      ) {
        {
          // check that "values" is an array, or set it as array
          // to prevent any errors in springs, or range trimming
          if (!Array.isArray(values)) {
            $$invalidate(0, (values = [(max + min) / 2]));
            console.error(
              "'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)"
            );
          }

          // trim the range so it remains as a min/max (only 2 handles)
          // and also align the handles to the steps
          $$invalidate(
            0,
            (values = trimRange(values.map((v) => alignValueToStep(v))))
          );

          // check if the valueLength (length of values[]) has changed,
          // because if so we need to re-seed the spring function with the
          // new values array.
          if (valueLength !== values.length) {
            // set the initial spring values when the slider initialises,
            // or when values array length has changed
            $$subscribe_springPositions(
              $$invalidate(
                21,
                (springPositions = spring(
                  values.map((v) => percentOf(v)),
                  springValues
                ))
              )
            );
          } else {
            // update the value of the spring function for animated handles
            // whenever the values has updated
            springPositions.set(values.map((v) => percentOf(v)));
          }

          // set the valueLength for the next check
          $$invalidate(46, (valueLength = values.length));
        }
      }

      if ($$self.$$.dirty[0] & /*vertical, reversed*/ 160) {
        /**
         * the orientation of the handles/pips based on the
         * input values of vertical and reversed
         **/
        $$invalidate(
          28,
          (orientationStart = vertical
            ? reversed
              ? "top"
              : "bottom"
            : reversed
            ? "right"
            : "left")
        );
      }

      if ($$self.$$.dirty[0] & /*vertical, reversed*/ 160) {
        $$invalidate(
          27,
          (orientationEnd = vertical
            ? reversed
              ? "bottom"
              : "top"
            : reversed
            ? "left"
            : "right")
        );
      }
    };

    return [
      values,
      range,
      min,
      max,
      step,
      vertical,
      float,
      reversed,
      hoverable,
      disabled,
      pips,
      pipstep,
      all,
      first,
      last,
      rest,
      id,
      prefix,
      suffix,
      formatter,
      handleFormatter,
      springPositions,
      percentOf,
      slider,
      focus,
      handlePressed,
      activeHandle,
      orientationEnd,
      orientationStart,
      $springPositions,
      moveHandle,
      rangeStart,
      rangeEnd,
      sliderBlurHandle,
      sliderFocusHandle,
      sliderKeydown,
      sliderInteractStart,
      sliderInteractEnd,
      bodyInteractStart,
      bodyInteract,
      bodyMouseUp,
      bodyTouchEnd,
      bodyKeyDown,
      pushy,
      precision,
      springValues,
      valueLength,
      alignValueToStep,
      clampValue,
      div_binding,
    ];
  }

  class RangeSlider extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(
        this,
        options,
        instance$i,
        create_fragment$i,
        safe_not_equal,
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

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "RangeSlider",
        options,
        id: create_fragment$i.name,
      });
    }

    get range() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set range(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pushy() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pushy(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get min() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set min(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get max() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set max(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get step() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set step(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get values() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get vertical() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set vertical(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get float() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set float(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get reversed() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set reversed(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hoverable() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set hoverable(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get disabled() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set disabled(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pips() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pips(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get pipstep() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set pipstep(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get all() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set all(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get first() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set first(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get last() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set last(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get rest() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set rest(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get id() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set id(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get prefix() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set prefix(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get suffix() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set suffix(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get formatter() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set formatter(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get handleFormatter() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set handleFormatter(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get precision() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set precision(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get springValues() {
      throw new Error(
        "<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set springValues(value) {
      throw new Error(
        "<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/Gauge.svelte generated by Svelte v3.44.2 */

  const file$h = "src/components/Gauge.svelte";

  // (12:4) {#if needle}
  function create_if_block_3$1(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "gauge__fill centerMark svelte-141x32p");
        add_location(div, file$h, 12, 6, 377);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3$1.name,
      type: "if",
      source: "(12:4) {#if needle}",
      ctx,
    });

    return block;
  }

  // (15:4) {#if lowZone}
  function create_if_block_2$2(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "gauge__fill lowZone svelte-141x32p");
        add_location(div, file$h, 15, 6, 454);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$2.name,
      type: "if",
      source: "(15:4) {#if lowZone}",
      ctx,
    });

    return block;
  }

  // (18:4) {#if hiZone}
  function create_if_block_1$4(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "gauge__fill hiZone svelte-141x32p");
        add_location(div, file$h, 18, 6, 527);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$4.name,
      type: "if",
      source: "(18:4) {#if hiZone}",
      ctx,
    });

    return block;
  }

  // (23:4) {:else}
  function create_else_block$4(ctx) {
    let div;
    let t0_value = /*value*/ (ctx[0] * 100).toFixed() + "";
    let t0;
    let t1;

    const block = {
      c: function create() {
        div = element("div");
        t0 = text(t0_value);
        t1 = text("%");
        attr_dev(div, "class", "gauge__cover svelte-141x32p");
        add_location(div, file$h, 23, 6, 665);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, t0);
        append_dev(div, t1);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*value*/ 1 &&
          t0_value !== (t0_value = /*value*/ (ctx[0] * 100).toFixed() + "")
        )
          set_data_dev(t0, t0_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$4.name,
      type: "else",
      source: "(23:4) {:else}",
      ctx,
    });

    return block;
  }

  // (21:4) {#if label !== null}
  function create_if_block$9(ctx) {
    let div;
    let t;

    const block = {
      c: function create() {
        div = element("div");
        t = text(/*label*/ ctx[1]);
        attr_dev(div, "class", "gauge__cover svelte-141x32p");
        add_location(div, file$h, 21, 6, 607);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*label*/ 2) set_data_dev(t, /*label*/ ctx[1]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$9.name,
      type: "if",
      source: "(21:4) {#if label !== null}",
      ctx,
    });

    return block;
  }

  function create_fragment$h(ctx) {
    let div2;
    let div1;
    let div0;
    let t0;
    let t1;
    let t2;
    let t3;
    let if_block0 = /*needle*/ ctx[2] && create_if_block_3$1(ctx);
    let if_block1 = /*lowZone*/ ctx[3] && create_if_block_2$2(ctx);
    let if_block2 = /*hiZone*/ ctx[4] && create_if_block_1$4(ctx);

    function select_block_type(ctx, dirty) {
      if (/*label*/ ctx[1] !== null) return create_if_block$9;
      return create_else_block$4;
    }

    let current_block_type = select_block_type(ctx);
    let if_block3 = current_block_type(ctx);

    const block = {
      c: function create() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        t0 = space();
        if (if_block0) if_block0.c();
        t1 = space();
        if (if_block1) if_block1.c();
        t2 = space();
        if (if_block2) if_block2.c();
        t3 = space();
        if_block3.c();
        attr_dev(div0, "class", "gauge__fill svelte-141x32p");
        attr_dev(div0, "style", /*rotate*/ ctx[5]);
        toggle_class(div0, "needle", /*needle*/ ctx[2]);
        add_location(div0, file$h, 10, 4, 283);
        attr_dev(div1, "class", "gauge__body svelte-141x32p");
        add_location(div1, file$h, 9, 2, 253);
        attr_dev(div2, "class", "gauge svelte-141x32p");
        attr_dev(div2, "data-testid", "gauge");
        add_location(div2, file$h, 8, 0, 211);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, div1);
        append_dev(div1, div0);
        append_dev(div1, t0);
        if (if_block0) if_block0.m(div1, null);
        append_dev(div1, t1);
        if (if_block1) if_block1.m(div1, null);
        append_dev(div1, t2);
        if (if_block2) if_block2.m(div1, null);
        append_dev(div1, t3);
        if_block3.m(div1, null);
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*rotate*/ 32) {
          attr_dev(div0, "style", /*rotate*/ ctx[5]);
        }

        if (dirty & /*needle*/ 4) {
          toggle_class(div0, "needle", /*needle*/ ctx[2]);
        }

        if (/*needle*/ ctx[2]) {
          if (if_block0);
          else {
            if_block0 = create_if_block_3$1(ctx);
            if_block0.c();
            if_block0.m(div1, t1);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (/*lowZone*/ ctx[3]) {
          if (if_block1);
          else {
            if_block1 = create_if_block_2$2(ctx);
            if_block1.c();
            if_block1.m(div1, t2);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (/*hiZone*/ ctx[4]) {
          if (if_block2);
          else {
            if_block2 = create_if_block_1$4(ctx);
            if_block2.c();
            if_block2.m(div1, t3);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }

        if (
          current_block_type ===
            (current_block_type = select_block_type(ctx)) &&
          if_block3
        ) {
          if_block3.p(ctx, dirty);
        } else {
          if_block3.d(1);
          if_block3 = current_block_type(ctx);

          if (if_block3) {
            if_block3.c();
            if_block3.m(div1, null);
          }
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
        if_block3.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$h.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$h($$self, $$props, $$invalidate) {
    let rotate;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Gauge", slots, []);
    let { value = 0.5 } = $$props;
    let { label = null } = $$props;
    let { needle = false } = $$props;
    let { lowZone = false } = $$props;
    let { hiZone = false } = $$props;
    const writable_props = ["value", "label", "needle", "lowZone", "hiZone"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Gauge> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("value" in $$props) $$invalidate(0, (value = $$props.value));
      if ("label" in $$props) $$invalidate(1, (label = $$props.label));
      if ("needle" in $$props) $$invalidate(2, (needle = $$props.needle));
      if ("lowZone" in $$props) $$invalidate(3, (lowZone = $$props.lowZone));
      if ("hiZone" in $$props) $$invalidate(4, (hiZone = $$props.hiZone));
    };

    $$self.$capture_state = () => ({
      value,
      label,
      needle,
      lowZone,
      hiZone,
      rotate,
    });

    $$self.$inject_state = ($$props) => {
      if ("value" in $$props) $$invalidate(0, (value = $$props.value));
      if ("label" in $$props) $$invalidate(1, (label = $$props.label));
      if ("needle" in $$props) $$invalidate(2, (needle = $$props.needle));
      if ("lowZone" in $$props) $$invalidate(3, (lowZone = $$props.lowZone));
      if ("hiZone" in $$props) $$invalidate(4, (hiZone = $$props.hiZone));
      if ("rotate" in $$props) $$invalidate(5, (rotate = $$props.rotate));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*value*/ 1) {
        $$invalidate(5, (rotate = `transform: rotate(${value / 2}turn)`));
      }
    };

    return [value, label, needle, lowZone, hiZone, rotate];
  }

  class Gauge extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$h, create_fragment$h, safe_not_equal, {
        value: 0,
        label: 1,
        needle: 2,
        lowZone: 3,
        hiZone: 4,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Gauge",
        options,
        id: create_fragment$h.name,
      });
    }

    get value() {
      throw new Error(
        "<Gauge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set value(value) {
      throw new Error(
        "<Gauge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get label() {
      throw new Error(
        "<Gauge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set label(value) {
      throw new Error(
        "<Gauge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get needle() {
      throw new Error(
        "<Gauge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set needle(value) {
      throw new Error(
        "<Gauge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get lowZone() {
      throw new Error(
        "<Gauge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set lowZone(value) {
      throw new Error(
        "<Gauge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hiZone() {
      throw new Error(
        "<Gauge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set hiZone(value) {
      throw new Error(
        "<Gauge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`,
    };
  }

  var _a;
  // Keys/indexes into localstorage
  const SETTINGSKEY = "gbSettings";
  const display = writable("chart");
  const daysToReviewString = localStorage.getItem("daysToReview");
  const daysToReview = writable(
    daysToReviewString ? JSON.parse(daysToReviewString) : [4]
  );
  daysToReview.subscribe((val) => {
    localStorage.setItem("daysToReview", JSON.stringify(val));
  });
  // Grr. JSON.stringify() is NOT reversible with JSON.parse()
  // because Dates get turned into strings
  const unStringify = (summaries) => {
    let withStringDates = JSON.parse(summaries);
    return withStringDates.map((s) => {
      return Object.assign(Object.assign({}, s), {
        start: new Date(s.start),
        end: new Date(s.end),
      });
    });
  };
  const countString = localStorage.getItem("srsCounts");
  const srsCounts = writable(
    countString
      ? JSON.parse(countString)
      : {
          expectedDaily: 0,
          new: {
            radicals: 0,
            kanji: 0,
            vocabulary: 0,
            total: 0,
          },
          apprentice: {
            early: 0,
            late: 0,
            total: 0,
          },
          lesson: 0,
          guru: 0,
          master: 0,
          enlightened: 0,
          burned: 0,
        }
  );
  srsCounts.subscribe((val) => {
    localStorage.setItem("srsCounts", JSON.stringify(val));
  });
  const ssString = localStorage.getItem("sessionSummaries");
  const sessionSummaries = writable(ssString ? unStringify(ssString) : []);
  sessionSummaries.subscribe((val) => {
    localStorage.setItem("sessionSummaries", JSON.stringify(val));
  });
  const rcString = localStorage.getItem("reviewCounts");
  const reviewCounts = writable(rcString ? unStringify(rcString) : []);
  reviewCounts.subscribe((val) => {
    localStorage.setItem("reviewCounts", JSON.stringify(val));
  });
  const defaultSettings = {
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
    newKWeight: 3.0,
    newVWeight: 1.0,
    apprWeight: 1.0,
    guruWeight: 0.1,
    masterWeight: 0,
    enlightenedWeight: 0,
    targetSpeed: 7.0,
    speedMin: 6,
    speedMax: 8,
    madCutoff: 10.0,
    rpdMin: 120,
    rpdMax: 180,
    tzOffset: 0,
    rQuiz: false,
    kQuiz: true,
    vQuiz: false,
  };
  // Store #2: the user settings for Ganbarometer
  const gbSettings = writable(
    (_a = JSON.parse(localStorage.getItem(SETTINGSKEY))) !== null &&
      _a !== void 0
      ? _a
      : defaultSettings
  );
  gbSettings.subscribe((val) =>
    localStorage.setItem(SETTINGSKEY, JSON.stringify(val))
  );

  const getSrsCounts = async () => {
    wkof.include("ItemData");
    await wkof.ready("ItemData");
    const allItems = await wkof.ItemData.get_items("subjects,assignments");
    const bySRS = await wkof.ItemData.get_index(allItems, "srs_stage");
    let newItems;
    if (bySRS[1] && bySRS[2]) {
      newItems = [...bySRS[1], ...bySRS[2]];
    } else if (bySRS[1]) {
      newItems = [...bySRS[1]];
    }
    const newRadicals = newItems.filter((s) => s.object == "radicals");
    const newKanji = newItems.filter((s) => s.object == "kanji");
    const newVocabulary = newItems.filter((s) => s.object == "vocabulary");
    //This list means that for each SRS level this is how many days it takes until the item comes back
    //For example: only 1/30 of master items are expected to be reviewed in any given day
    //Notable figures
    //Lessons: 0 days (they are not accounted for)
    //Apprentice 1: 0.5 days (they come back as Apprentice 2 and will count as two reviews)
    //Burned: 0 days
    const srs_intervals = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0];
    const allStages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const reviewingStages = [1, 2, 3, 4, 5, 6, 7, 8];
    let counts = [];
    allStages.forEach((stage) => {
      var _a, _b;
      counts[stage] =
        (_b =
          (_a = bySRS[stage]) === null || _a === void 0
            ? void 0
            : _a.length) !== null && _b !== void 0
          ? _b
          : 0;
    });
    const expectedCount = reviewingStages
      .map((stage) => counts[stage] / srs_intervals[stage])
      .reduce((acc, count) => (acc += count));
    return {
      expectedDaily: expectedCount,
      new: {
        radicals: newRadicals.length,
        kanji: newKanji.length,
        vocabulary: newVocabulary.length,
        total: newItems.length,
      },
      apprentice: {
        early: counts[1] + counts[2],
        late: counts[3] + counts[4],
        total: counts[1] + counts[2] + counts[3] + counts[4],
      },
      lesson: counts[0],
      guru: counts[5] + counts[6],
      master: counts[7],
      enlightened: counts[8],
      burned: counts[9],
    };
  };

  /* src/components/GbWidget.svelte generated by Svelte v3.44.2 */
  const file$g = "src/components/GbWidget.svelte";

  // (39:4) {:else}
  function create_else_block$3(ctx) {
    let h1;
    let t0;
    let t1;
    let h1_intro;
    let t2;
    let div;
    let table;
    let tr0;
    let th0;
    let t4;
    let td0;
    let t5_value = /*$srsCounts*/ ctx[3].new.radicals + "";
    let t5;
    let span0;
    let t7;
    let t8_value = /*$srsCounts*/ ctx[3].new.kanji + "";
    let t8;
    let span1;
    let t10;
    let t11_value = /*$srsCounts*/ ctx[3].new.vocabulary + "";
    let t11;
    let span2;
    let t13;
    let tr1;
    let th1;
    let t15;
    let td1;
    let t16_value = /*$srsCounts*/ ctx[3].apprentice.total + "";
    let t16;
    let t17;
    let span3;
    let t18;
    let t19_value = /*$srsCounts*/ ctx[3].apprentice.early + "";
    let t19;
    let t20;
    let t21;
    let tr2;
    let th2;
    let t23;
    let td2;
    let t24_value = /*$srsCounts*/ ctx[3].guru + "";
    let t24;
    let span4;
    let t26;
    let t27_value = /*$srsCounts*/ ctx[3].master + "";
    let t27;
    let span5;
    let t29;
    let t30_value = /*$srsCounts*/ ctx[3].enlightened + "";
    let t30;
    let span6;
    let t32;
    let tr3;
    let th3;
    let t34;
    let td3;
    let t35_value = /*weightedCount*/ ctx[0].toFixed() + "";
    let t35;
    let t36;
    let span7;
    let t37;
    let t38_value = /*$gbSettings*/ ctx[2].gbMinTarget + "";
    let t38;
    let t39;
    let t40_value = /*$gbSettings*/ ctx[2].gbMaxTarget + "";
    let t40;
    let t41;
    let div_intro;

    const block = {
      c: function create() {
        h1 = element("h1");
        t0 = text("GanbarOmeter: ");
        t1 = text(/*numericLabel*/ ctx[5]);
        t2 = space();
        div = element("div");
        table = element("table");
        tr0 = element("tr");
        th0 = element("th");
        th0.textContent = "Early Apprentice";
        t4 = space();
        td0 = element("td");
        t5 = text(t5_value);
        span0 = element("span");
        span0.textContent = "r";
        t7 = space();
        t8 = text(t8_value);
        span1 = element("span");
        span1.textContent = "k";
        t10 = space();
        t11 = text(t11_value);
        span2 = element("span");
        span2.textContent = "v";
        t13 = space();
        tr1 = element("tr");
        th1 = element("th");
        th1.textContent = "Apprentice";
        t15 = space();
        td1 = element("td");
        t16 = text(t16_value);
        t17 = space();
        span3 = element("span");
        t18 = text("items\n            (");
        t19 = text(t19_value);
        t20 = text(" early-stage)");
        t21 = space();
        tr2 = element("tr");
        th2 = element("th");
        th2.textContent = "Guru'd";
        t23 = space();
        td2 = element("td");
        t24 = text(t24_value);
        span4 = element("span");
        span4.textContent = "g";
        t26 = space();
        t27 = text(t27_value);
        span5 = element("span");
        span5.textContent = "m";
        t29 = space();
        t30 = text(t30_value);
        span6 = element("span");
        span6.textContent = "e";
        t32 = space();
        tr3 = element("tr");
        th3 = element("th");
        th3.textContent = "Weighted count";
        t34 = space();
        td3 = element("td");
        t35 = text(t35_value);
        t36 = space();
        span7 = element("span");
        t37 = text("(target ");
        t38 = text(t38_value);
        t39 = text("–");
        t40 = text(t40_value);
        t41 = text(")");
        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$g, 39, 6, 1793);
        add_location(th0, file$g, 43, 12, 1972);
        attr_dev(span0, "class", "secondary");
        add_location(span0, file$g, 44, 41, 2039);
        attr_dev(span1, "class", "secondary");
        add_location(span1, file$g, 45, 36, 2109);
        attr_dev(span2, "class", "secondary");
        add_location(span2, file$g, 46, 41, 2184);
        add_location(td0, file$g, 44, 12, 2010);
        add_location(tr0, file$g, 42, 10, 1955);
        add_location(th1, file$g, 50, 12, 2278);
        attr_dev(span3, "class", "secondary");
        add_location(span3, file$g, 51, 46, 2344);
        add_location(td1, file$g, 51, 12, 2310);
        add_location(tr1, file$g, 49, 10, 2261);
        add_location(th2, file$g, 56, 10, 2492);
        attr_dev(span4, "class", "secondary");
        add_location(span4, file$g, 57, 31, 2539);
        attr_dev(span5, "class", "secondary");
        add_location(span5, file$g, 58, 31, 2603);
        attr_dev(span6, "class", "secondary");
        add_location(span6, file$g, 59, 36, 2672);
        add_location(td2, file$g, 57, 10, 2518);
        add_location(tr2, file$g, 55, 8, 2477);
        add_location(th3, file$g, 63, 10, 2758);
        attr_dev(span7, "class", "secondary");
        add_location(span7, file$g, 64, 40, 2822);
        add_location(td3, file$g, 64, 10, 2792);
        add_location(tr3, file$g, 62, 8, 2743);
        attr_dev(table, "class", "gbContent");
        add_location(table, file$g, 41, 8, 1919);
        attr_dev(div, "data-testid", "ganbarometer-table");
        add_location(div, file$g, 40, 6, 1863);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        append_dev(h1, t0);
        append_dev(h1, t1);
        insert_dev(target, t2, anchor);
        insert_dev(target, div, anchor);
        append_dev(div, table);
        append_dev(table, tr0);
        append_dev(tr0, th0);
        append_dev(tr0, t4);
        append_dev(tr0, td0);
        append_dev(td0, t5);
        append_dev(td0, span0);
        append_dev(td0, t7);
        append_dev(td0, t8);
        append_dev(td0, span1);
        append_dev(td0, t10);
        append_dev(td0, t11);
        append_dev(td0, span2);
        append_dev(table, t13);
        append_dev(table, tr1);
        append_dev(tr1, th1);
        append_dev(tr1, t15);
        append_dev(tr1, td1);
        append_dev(td1, t16);
        append_dev(td1, t17);
        append_dev(td1, span3);
        append_dev(span3, t18);
        append_dev(span3, t19);
        append_dev(span3, t20);
        append_dev(table, t21);
        append_dev(table, tr2);
        append_dev(tr2, th2);
        append_dev(tr2, t23);
        append_dev(tr2, td2);
        append_dev(td2, t24);
        append_dev(td2, span4);
        append_dev(td2, t26);
        append_dev(td2, t27);
        append_dev(td2, span5);
        append_dev(td2, t29);
        append_dev(td2, t30);
        append_dev(td2, span6);
        append_dev(table, t32);
        append_dev(table, tr3);
        append_dev(tr3, th3);
        append_dev(tr3, t34);
        append_dev(tr3, td3);
        append_dev(td3, t35);
        append_dev(td3, t36);
        append_dev(td3, span7);
        append_dev(span7, t37);
        append_dev(span7, t38);
        append_dev(span7, t39);
        append_dev(span7, t40);
        append_dev(span7, t41);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*numericLabel*/ 32)
          set_data_dev(t1, /*numericLabel*/ ctx[5]);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t5_value !== (t5_value = /*$srsCounts*/ ctx[3].new.radicals + "")
        )
          set_data_dev(t5, t5_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t8_value !== (t8_value = /*$srsCounts*/ ctx[3].new.kanji + "")
        )
          set_data_dev(t8, t8_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t11_value !== (t11_value = /*$srsCounts*/ ctx[3].new.vocabulary + "")
        )
          set_data_dev(t11, t11_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t16_value !==
            (t16_value = /*$srsCounts*/ ctx[3].apprentice.total + "")
        )
          set_data_dev(t16, t16_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t19_value !==
            (t19_value = /*$srsCounts*/ ctx[3].apprentice.early + "")
        )
          set_data_dev(t19, t19_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t24_value !== (t24_value = /*$srsCounts*/ ctx[3].guru + "")
        )
          set_data_dev(t24, t24_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t27_value !== (t27_value = /*$srsCounts*/ ctx[3].master + "")
        )
          set_data_dev(t27, t27_value);
        if (
          dirty & /*$srsCounts*/ 8 &&
          t30_value !== (t30_value = /*$srsCounts*/ ctx[3].enlightened + "")
        )
          set_data_dev(t30, t30_value);
        if (
          dirty & /*weightedCount*/ 1 &&
          t35_value !== (t35_value = /*weightedCount*/ ctx[0].toFixed() + "")
        )
          set_data_dev(t35, t35_value);
        if (
          dirty & /*$gbSettings*/ 4 &&
          t38_value !== (t38_value = /*$gbSettings*/ ctx[2].gbMinTarget + "")
        )
          set_data_dev(t38, t38_value);
        if (
          dirty & /*$gbSettings*/ 4 &&
          t40_value !== (t40_value = /*$gbSettings*/ ctx[2].gbMaxTarget + "")
        )
          set_data_dev(t40, t40_value);
      },
      i: function intro(local) {
        if (!h1_intro) {
          add_render_callback(() => {
            h1_intro = create_in_transition(h1, fade, {});
            h1_intro.start();
          });
        }

        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fade, {});
            div_intro.start();
          });
        }
      },
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t2);
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$3.name,
      type: "else",
      source: "(39:4) {:else}",
      ctx,
    });

    return block;
  }

  // (35:4) {#if $display === "chart" }
  function create_if_block$8(ctx) {
    let h1;
    let t1;
    let gauge;
    let t2;
    let div;
    let span0;
    let span1;
    let current;

    gauge = new Gauge({
      props: {
        value: /*rotValue*/ ctx[1],
        label: /*label*/ ctx[4],
        needle: true,
        lowZone: true,
        hiZone: true,
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "GanbarOmeter";
        t1 = space();
        create_component(gauge.$$.fragment);
        t2 = space();
        div = element("div");
        span0 = element("span");
        span0.textContent = "遅";
        span1 = element("span");
        span1.textContent = "早";
        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$g, 35, 6, 1572);
        attr_dev(span0, "class", "left-aligned svelte-1rtibr8");
        add_location(span0, file$g, 37, 25, 1699);
        attr_dev(span1, "class", "right-aligned svelte-1rtibr8");
        add_location(span1, file$g, 37, 60, 1734);
        attr_dev(div, "class", "units svelte-1rtibr8");
        add_location(div, file$g, 37, 6, 1680);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        insert_dev(target, t1, anchor);
        mount_component(gauge, target, anchor);
        insert_dev(target, t2, anchor);
        insert_dev(target, div, anchor);
        append_dev(div, span0);
        append_dev(div, span1);
        current = true;
      },
      p: function update(ctx, dirty) {
        const gauge_changes = {};
        if (dirty & /*rotValue*/ 2) gauge_changes.value = /*rotValue*/ ctx[1];
        if (dirty & /*label*/ 16) gauge_changes.label = /*label*/ ctx[4];
        gauge.$set(gauge_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(gauge.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(gauge.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t1);
        destroy_component(gauge, detaching);
        if (detaching) detach_dev(t2);
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$8.name,
      type: "if",
      source: '(35:4) {#if $display === \\"chart\\" }',
      ctx,
    });

    return block;
  }

  function create_fragment$g(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block$8, create_else_block$3];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*$display*/ ctx[6] === "chart") return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        div = element("div");
        if_block.c();
        attr_dev(div, "class", "gbWidget");
        set_style(div, "--trackColor", /*$gbSettings*/ ctx[2].hlTrackColor);
        set_style(div, "--hlTrackColor", /*$gbSettings*/ ctx[2].trackColor);
        add_location(div, file$g, 33, 2, 1419);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(div, null);
        }

        if (!current || dirty & /*$gbSettings*/ 4) {
          set_style(div, "--trackColor", /*$gbSettings*/ ctx[2].hlTrackColor);
        }

        if (!current || dirty & /*$gbSettings*/ 4) {
          set_style(div, "--hlTrackColor", /*$gbSettings*/ ctx[2].trackColor);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if_blocks[current_block_type_index].d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$g.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$g($$self, $$props, $$invalidate) {
    let weightedCount;
    let scaling;
    let rawValue;
    let rotValue;
    let rawLabel;
    let numericLabel;
    let label;
    let $gbSettings;
    let $srsCounts;
    let $display;
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(2, ($gbSettings = $$value))
    );
    validate_store(srsCounts, "srsCounts");
    component_subscribe($$self, srsCounts, ($$value) =>
      $$invalidate(3, ($srsCounts = $$value))
    );
    validate_store(display, "display");
    component_subscribe($$self, display, ($$value) =>
      $$invalidate(6, ($display = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("GbWidget", slots, []);
    const lowTurns = (2 / 3) * 0.5;
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<GbWidget> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      Gauge,
      fade,
      display,
      gbSettings,
      srsCounts,
      getSrsCounts,
      lowTurns,
      weightedCount,
      label,
      rawLabel,
      rotValue,
      numericLabel,
      rawValue,
      scaling,
      $gbSettings,
      $srsCounts,
      $display,
    });

    $$self.$inject_state = ($$props) => {
      if ("weightedCount" in $$props)
        $$invalidate(0, (weightedCount = $$props.weightedCount));
      if ("label" in $$props) $$invalidate(4, (label = $$props.label));
      if ("rawLabel" in $$props) $$invalidate(7, (rawLabel = $$props.rawLabel));
      if ("rotValue" in $$props) $$invalidate(1, (rotValue = $$props.rotValue));
      if ("numericLabel" in $$props)
        $$invalidate(5, (numericLabel = $$props.numericLabel));
      if ("rawValue" in $$props) $$invalidate(8, (rawValue = $$props.rawValue));
      if ("scaling" in $$props) $$invalidate(9, (scaling = $$props.scaling));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$srsCounts, $gbSettings*/ 12) {
        $$invalidate(
          0,
          (weightedCount =
            $srsCounts.new.radicals * $gbSettings.newRWeight +
            $srsCounts.new.kanji * $gbSettings.newKWeight +
            $srsCounts.new.vocabulary * $gbSettings.newVWeight +
            $srsCounts.apprentice.late * $gbSettings.apprWeight +
            $srsCounts.guru * $gbSettings.guruWeight +
            $srsCounts.master * $gbSettings.masterWeight +
            $srsCounts.enlightened * $gbSettings.enlightenedWeight)
        );
      }

      if ($$self.$$.dirty & /*$gbSettings*/ 4) {
        $$invalidate(
          9,
          (scaling =
            lowTurns / ($gbSettings.gbMaxTarget - $gbSettings.gbMinTarget))
        );
      }

      if ($$self.$$.dirty & /*weightedCount, $gbSettings, scaling*/ 517) {
        $$invalidate(
          8,
          (rawValue =
            lowTurns + (weightedCount - $gbSettings.gbMinTarget) * scaling)
        );
      }

      if ($$self.$$.dirty & /*rawValue*/ 256) {
        $$invalidate(
          1,
          (rotValue = rawValue < 0 ? 0 : rawValue > 1 ? 1 : rawValue)
        );
      }

      if ($$self.$$.dirty & /*rotValue*/ 2) {
        // rotValue is between 0 and 1
        // want the label to be +/- from 0.5
        $$invalidate(7, (rawLabel = (rotValue - 0.5).toFixed(2)));
      }

      if ($$self.$$.dirty & /*rotValue, rawLabel*/ 130) {
        $$invalidate(
          5,
          (numericLabel = rotValue > 0.5 ? "+" + rawLabel : rawLabel)
        );
      }

      if ($$self.$$.dirty & /*weightedCount, $gbSettings*/ 5) {
        $$invalidate(
          4,
          (label =
            weightedCount < $gbSettings.gbMinTarget
              ? $gbSettings.belowTerm
              : weightedCount > $gbSettings.gbMaxTarget
              ? $gbSettings.aboveTerm
              : $gbSettings.inRangeTerm)
        );
      }
    };

    getSrsCounts().then((counts) => srsCounts.set(counts));

    return [
      weightedCount,
      rotValue,
      $gbSettings,
      $srsCounts,
      label,
      numericLabel,
      $display,
      rawLabel,
      rawValue,
      scaling,
    ];
  }

  class GbWidget extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "GbWidget",
        options,
        id: create_fragment$g.name,
      });
    }
  }

  /* src/components/SpeedWidget.svelte generated by Svelte v3.44.2 */
  const file$f = "src/components/SpeedWidget.svelte";

  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[18] = list[i];
    child_ctx[20] = i;
    return child_ctx;
  }

  // (36:2) {:else}
  function create_else_block$2(ctx) {
    let h1;
    let t0;
    let t1_value = /*secondsPerQ*/ ctx[0].toFixed(1) + "";
    let t1;
    let t2;
    let t3_value = /*qPerMinute*/ ctx[1].toFixed(1) + "";
    let t3;
    let t4;
    let h1_intro;
    let t5;
    let div1;
    let div0;
    let h4;
    let t6_value = /*$sessionSummaries*/ ctx[3].length + "";
    let t6;
    let t7;
    let t8;
    let t9;
    let t10;
    let t11;
    let t12;
    let div1_intro;
    let each_value = /*$sessionSummaries*/ ctx[3];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$2(
        get_each_context$2(ctx, each_value, i)
      );
    }

    const block = {
      c: function create() {
        h1 = element("h1");
        t0 = text("Speed: ");
        t1 = text(t1_value);
        t2 = text(" s/q • ");
        t3 = text(t3_value);
        t4 = text(" q/m");
        t5 = space();
        div1 = element("div");
        div0 = element("div");
        h4 = element("h4");
        t6 = text(t6_value);
        t7 = text(" sessions • ");
        t8 = text(/*totalReviews*/ ctx[7]);
        t9 = text(" items • ");
        t10 = text(/*totalQuestions*/ ctx[2]);
        t11 = text(" questions");
        t12 = space();

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$f, 36, 4, 1792);
        attr_dev(h4, "class", "svelte-ziwm73");
        add_location(h4, file$f, 39, 8, 1984);
        attr_dev(div0, "class", "gbContent scrollbox svelte-ziwm73");
        add_location(div0, file$f, 38, 6, 1942);
        attr_dev(div1, "data-testid", "speed-table");
        add_location(div1, file$f, 37, 4, 1896);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        append_dev(h1, t0);
        append_dev(h1, t1);
        append_dev(h1, t2);
        append_dev(h1, t3);
        append_dev(h1, t4);
        insert_dev(target, t5, anchor);
        insert_dev(target, div1, anchor);
        append_dev(div1, div0);
        append_dev(div0, h4);
        append_dev(h4, t6);
        append_dev(h4, t7);
        append_dev(h4, t8);
        append_dev(h4, t9);
        append_dev(h4, t10);
        append_dev(h4, t11);
        append_dev(div0, t12);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div0, null);
        }
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*secondsPerQ*/ 1 &&
          t1_value !== (t1_value = /*secondsPerQ*/ ctx[0].toFixed(1) + "")
        )
          set_data_dev(t1, t1_value);
        if (
          dirty & /*qPerMinute*/ 2 &&
          t3_value !== (t3_value = /*qPerMinute*/ ctx[1].toFixed(1) + "")
        )
          set_data_dev(t3, t3_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t6_value !== (t6_value = /*$sessionSummaries*/ ctx[3].length + "")
        )
          set_data_dev(t6, t6_value);
        if (dirty & /*totalReviews*/ 128)
          set_data_dev(t8, /*totalReviews*/ ctx[7]);
        if (dirty & /*totalQuestions*/ 4)
          set_data_dev(t10, /*totalQuestions*/ ctx[2]);

        if (
          dirty &
          /*percentCorrect, $sessionSummaries, qpm, durationS, spq, fmtTime, fmtDayTime*/ 32264
        ) {
          each_value = /*$sessionSummaries*/ ctx[3];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$2(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      i: function intro(local) {
        if (!h1_intro) {
          add_render_callback(() => {
            h1_intro = create_in_transition(h1, fade, {});
            h1_intro.start();
          });
        }

        if (!div1_intro) {
          add_render_callback(() => {
            div1_intro = create_in_transition(div1, fade, {});
            div1_intro.start();
          });
        }
      },
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t5);
        if (detaching) detach_dev(div1);
        destroy_each(each_blocks, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$2.name,
      type: "else",
      source: "(36:2) {:else}",
      ctx,
    });

    return block;
  }

  // (32:2) {#if $display === "chart"}
  function create_if_block$7(ctx) {
    let h1;
    let t1;
    let gauge;
    let t2;
    let div;
    let current;

    gauge = new Gauge({
      props: {
        value: /*gauge_value*/ ctx[5],
        label: /*gauge_label*/ ctx[6],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "Speed";
        t1 = space();
        create_component(gauge.$$.fragment);
        t2 = space();
        div = element("div");
        div.textContent = "questions/min";
        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$f, 32, 4, 1649);
        attr_dev(div, "class", "units");
        add_location(div, file$f, 34, 4, 1739);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        insert_dev(target, t1, anchor);
        mount_component(gauge, target, anchor);
        insert_dev(target, t2, anchor);
        insert_dev(target, div, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const gauge_changes = {};
        if (dirty & /*gauge_value*/ 32)
          gauge_changes.value = /*gauge_value*/ ctx[5];
        if (dirty & /*gauge_label*/ 64)
          gauge_changes.label = /*gauge_label*/ ctx[6];
        gauge.$set(gauge_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(gauge.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(gauge.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t1);
        destroy_component(gauge, detaching);
        if (detaching) detach_dev(t2);
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$7.name,
      type: "if",
      source: '(32:2) {#if $display === \\"chart\\"}',
      ctx,
    });

    return block;
  }

  // (41:8) {#each $sessionSummaries as summary, i}
  function create_each_block$2(ctx) {
    let article;
    let h5;
    let t0_value = /*i*/ ctx[20] + 1 + "";
    let t0;
    let t1;
    let t2_value = /*fmtDayTime*/ ctx[10](/*summary*/ ctx[18].start) + "";
    let t2;
    let t3;
    let t4_value = /*fmtTime*/ ctx[11](/*summary*/ ctx[18].end) + "";
    let t4;
    let t5;
    let t6_value =
      /*durationS*/ (ctx[9](/*summary*/ ctx[18]) / 60).toFixed() + "";
    let t6;
    let t7;
    let t8;
    let p;
    let t9_value = /*summary*/ ctx[18].reviewCount + "";
    let t9;
    let t10;
    let t11_value = /*summary*/ ctx[18].questionCount + "";
    let t11;
    let t12;
    let t13_value =
      /*spq*/ ctx[13](
        /*durationS*/ ctx[9](/*summary*/ ctx[18]),
        /*summary*/ ctx[18].questionCount
      ) + "";
    let t13;
    let t14;
    let t15_value =
      /*qpm*/ ctx[14](
        /*durationS*/ ctx[9](/*summary*/ ctx[18]),
        /*summary*/ ctx[18].questionCount
      ) + "";
    let t15;
    let t16;
    let br;
    let t17;
    let t18_value = /*summary*/ ctx[18].correctAnswerCount + "";
    let t18;
    let t19;
    let t20_value = /*summary*/ ctx[18].questionCount + "";
    let t20;
    let t21;
    let t22_value = /*percentCorrect*/ ctx[12](/*summary*/ ctx[18]) + "";
    let t22;
    let t23;
    let t24;

    const block = {
      c: function create() {
        article = element("article");
        h5 = element("h5");
        t0 = text(t0_value);
        t1 = text(": ");
        t2 = text(t2_value);
        t3 = text(" – ");
        t4 = text(t4_value);
        t5 = text("\n            (");
        t6 = text(t6_value);
        t7 = text("m)");
        t8 = space();
        p = element("p");
        t9 = text(t9_value);
        t10 = text(" items • ");
        t11 = text(t11_value);
        t12 = text(" questions •\n            ");
        t13 = text(t13_value);
        t14 = text(" s/q •\n            ");
        t15 = text(t15_value);
        t16 = text(" q/m");
        br = element("br");
        t17 = space();
        t18 = text(t18_value);
        t19 = text("/");
        t20 = text(t20_value);
        t21 = text(" =\n            ");
        t22 = text(t22_value);
        t23 = text("% correct");
        t24 = space();
        attr_dev(h5, "class", "svelte-ziwm73");
        add_location(h5, file$f, 42, 12, 2161);
        add_location(br, file$f, 46, 64, 2501);
        attr_dev(p, "class", "svelte-ziwm73");
        add_location(p, file$f, 44, 12, 2301);
        attr_dev(article, "class", "svelte-ziwm73");
        add_location(article, file$f, 41, 10, 2139);
      },
      m: function mount(target, anchor) {
        insert_dev(target, article, anchor);
        append_dev(article, h5);
        append_dev(h5, t0);
        append_dev(h5, t1);
        append_dev(h5, t2);
        append_dev(h5, t3);
        append_dev(h5, t4);
        append_dev(h5, t5);
        append_dev(h5, t6);
        append_dev(h5, t7);
        append_dev(article, t8);
        append_dev(article, p);
        append_dev(p, t9);
        append_dev(p, t10);
        append_dev(p, t11);
        append_dev(p, t12);
        append_dev(p, t13);
        append_dev(p, t14);
        append_dev(p, t15);
        append_dev(p, t16);
        append_dev(p, br);
        append_dev(p, t17);
        append_dev(p, t18);
        append_dev(p, t19);
        append_dev(p, t20);
        append_dev(p, t21);
        append_dev(p, t22);
        append_dev(p, t23);
        append_dev(article, t24);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t2_value !==
            (t2_value = /*fmtDayTime*/ ctx[10](/*summary*/ ctx[18].start) + "")
        )
          set_data_dev(t2, t2_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t4_value !==
            (t4_value = /*fmtTime*/ ctx[11](/*summary*/ ctx[18].end) + "")
        )
          set_data_dev(t4, t4_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t6_value !==
            (t6_value =
              /*durationS*/ (ctx[9](/*summary*/ ctx[18]) / 60).toFixed() + "")
        )
          set_data_dev(t6, t6_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t9_value !== (t9_value = /*summary*/ ctx[18].reviewCount + "")
        )
          set_data_dev(t9, t9_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t11_value !== (t11_value = /*summary*/ ctx[18].questionCount + "")
        )
          set_data_dev(t11, t11_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t13_value !==
            (t13_value =
              /*spq*/ ctx[13](
                /*durationS*/ ctx[9](/*summary*/ ctx[18]),
                /*summary*/ ctx[18].questionCount
              ) + "")
        )
          set_data_dev(t13, t13_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t15_value !==
            (t15_value =
              /*qpm*/ ctx[14](
                /*durationS*/ ctx[9](/*summary*/ ctx[18]),
                /*summary*/ ctx[18].questionCount
              ) + "")
        )
          set_data_dev(t15, t15_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t18_value !==
            (t18_value = /*summary*/ ctx[18].correctAnswerCount + "")
        )
          set_data_dev(t18, t18_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t20_value !== (t20_value = /*summary*/ ctx[18].questionCount + "")
        )
          set_data_dev(t20, t20_value);
        if (
          dirty & /*$sessionSummaries*/ 8 &&
          t22_value !==
            (t22_value = /*percentCorrect*/ ctx[12](/*summary*/ ctx[18]) + "")
        )
          set_data_dev(t22, t22_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(article);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$2.name,
      type: "each",
      source: "(41:8) {#each $sessionSummaries as summary, i}",
      ctx,
    });

    return block;
  }

  function create_fragment$f(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block$7, create_else_block$2];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*$display*/ ctx[8] === "chart") return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        div = element("div");
        if_block.c();
        attr_dev(div, "class", "gbWidget svelte-ziwm73");
        attr_dev(div, "data-testid", "speedWidget");
        set_style(div, "--fillColor", /*dialColor*/ ctx[4]);
        add_location(div, file$f, 30, 0, 1532);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(div, null);
        }

        if (!current || dirty & /*dialColor*/ 16) {
          set_style(div, "--fillColor", /*dialColor*/ ctx[4]);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if_blocks[current_block_type_index].d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$f.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$f($$self, $$props, $$invalidate) {
    let totalReviews;
    let totalQuestions;
    let secondsPerQ;
    let qPerMinute;
    let targetQperMin;
    let gauge_label;
    let gauge_value;
    let dialColor;
    let $gbSettings;
    let $sessionSummaries;
    let $display;
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(17, ($gbSettings = $$value))
    );
    validate_store(sessionSummaries, "sessionSummaries");
    component_subscribe($$self, sessionSummaries, ($$value) =>
      $$invalidate(3, ($sessionSummaries = $$value))
    );
    validate_store(display, "display");
    component_subscribe($$self, display, ($$value) =>
      $$invalidate(8, ($display = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SpeedWidget", slots, []);

    const durationS = (sess) => {
      return (sess.end - sess.start) / 1000;
    };

    let totalDuration;
    const fmtDayTime = (date) =>
      Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    const fmtTime = (date) =>
      Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(date);

    const percentCorrect = (summary) => {
      let percent = (100 * summary.correctAnswerCount) / summary.questionCount;
      return percent.toFixed(1);
    };

    const spq = (duration, count) => (duration / count).toFixed(1);
    const qpm = (duration, count) => ((60 * count) / duration).toFixed(1);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SpeedWidget> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      Gauge,
      fade,
      display,
      sessionSummaries,
      gbSettings,
      durationS,
      totalDuration,
      fmtDayTime,
      fmtTime,
      percentCorrect,
      spq,
      qpm,
      secondsPerQ,
      dialColor,
      targetQperMin,
      qPerMinute,
      gauge_value,
      gauge_label,
      totalQuestions,
      totalReviews,
      $gbSettings,
      $sessionSummaries,
      $display,
    });

    $$self.$inject_state = ($$props) => {
      if ("totalDuration" in $$props)
        $$invalidate(15, (totalDuration = $$props.totalDuration));
      if ("secondsPerQ" in $$props)
        $$invalidate(0, (secondsPerQ = $$props.secondsPerQ));
      if ("dialColor" in $$props)
        $$invalidate(4, (dialColor = $$props.dialColor));
      if ("targetQperMin" in $$props)
        $$invalidate(16, (targetQperMin = $$props.targetQperMin));
      if ("qPerMinute" in $$props)
        $$invalidate(1, (qPerMinute = $$props.qPerMinute));
      if ("gauge_value" in $$props)
        $$invalidate(5, (gauge_value = $$props.gauge_value));
      if ("gauge_label" in $$props)
        $$invalidate(6, (gauge_label = $$props.gauge_label));
      if ("totalQuestions" in $$props)
        $$invalidate(2, (totalQuestions = $$props.totalQuestions));
      if ("totalReviews" in $$props)
        $$invalidate(7, (totalReviews = $$props.totalReviews));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$sessionSummaries*/ 8) {
        $$invalidate(
          7,
          (totalReviews = $sessionSummaries.reduce(
            (acc, s) => (acc += +s.reviewCount),
            0
          ))
        );
      }

      if ($$self.$$.dirty & /*$sessionSummaries*/ 8) {
        $$invalidate(
          2,
          (totalQuestions = $sessionSummaries.reduce(
            (acc, s) => (acc += +s.questionCount),
            0
          ))
        );
      }

      if ($$self.$$.dirty & /*$sessionSummaries*/ 8) {
        $$invalidate(
          15,
          (totalDuration = $sessionSummaries.reduce(
            (acc, s) => (acc += durationS(s)),
            0
          ))
        );
      }

      if ($$self.$$.dirty & /*totalQuestions, totalDuration*/ 32772) {
        $$invalidate(
          0,
          (secondsPerQ =
            totalQuestions > 0 ? totalDuration / totalQuestions : 0)
        );
      }

      if ($$self.$$.dirty & /*secondsPerQ*/ 1) {
        $$invalidate(1, (qPerMinute = 60 / secondsPerQ));
      }

      if ($$self.$$.dirty & /*$gbSettings*/ 131072) {
        $$invalidate(16, (targetQperMin = 60 / $gbSettings.targetSpeed));
      }

      if ($$self.$$.dirty & /*qPerMinute*/ 2) {
        // $: gauge_label = `${secondsPerQ.toFixed(1)}`;
        // $: gauge_value = secondsPerQ / (2 * $gbSettings.targetSpeed);
        $$invalidate(6, (gauge_label = `${qPerMinute.toFixed(1)}`));
      }

      if ($$self.$$.dirty & /*qPerMinute, targetQperMin*/ 65538) {
        $$invalidate(5, (gauge_value = qPerMinute / (2 * targetQperMin)));
      }

      if ($$self.$$.dirty & /*secondsPerQ, $gbSettings*/ 131073) {
        $$invalidate(
          4,
          (dialColor =
            secondsPerQ < $gbSettings.speedMin ||
            secondsPerQ > $gbSettings.speedMax
              ? $gbSettings.warnColor
              : $gbSettings.fillColor)
        );
      }
    };

    return [
      secondsPerQ,
      qPerMinute,
      totalQuestions,
      $sessionSummaries,
      dialColor,
      gauge_value,
      gauge_label,
      totalReviews,
      $display,
      durationS,
      fmtDayTime,
      fmtTime,
      percentCorrect,
      spq,
      qpm,
      totalDuration,
      targetQperMin,
      $gbSettings,
    ];
  }

  class SpeedWidget extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SpeedWidget",
        options,
        id: create_fragment$f.name,
      });
    }
  }

  /* src/components/BarChart.svelte generated by Svelte v3.44.2 */

  const file$e = "src/components/BarChart.svelte";

  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[11] = list[i];
    child_ctx[13] = i;
    return child_ctx;
  }

  // (26:3) {#if (percents.length)}
  function create_if_block_1$3(ctx) {
    let td;

    const block = {
      c: function create() {
        td = element("td");
        attr_dev(td, "aria-label", "percents");
        attr_dev(td, "class", "percents svelte-qotrzq");
        set_style(
          td,
          "height",
          /*percents*/ (ctx[1][/*i*/ ctx[13]] * 100).toFixed(1) + "%"
        );
        add_location(td, file$e, 26, 4, 873);
      },
      m: function mount(target, anchor) {
        insert_dev(target, td, anchor);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*percents*/ 2) {
          set_style(
            td,
            "height",
            /*percents*/ (ctx[1][/*i*/ ctx[13]] * 100).toFixed(1) + "%"
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(td);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$3.name,
      type: "if",
      source: "(26:3) {#if (percents.length)}",
      ctx,
    });

    return block;
  }

  // (29:58) {#if (percents.length)}
  function create_if_block$6(ctx) {
    let br;
    let t0_value = /*percents*/ (ctx[1][/*i*/ ctx[13]] * 100).toFixed() + "";
    let t0;
    let t1;

    const block = {
      c: function create() {
        br = element("br");
        t0 = text(t0_value);
        t1 = text("%");
        add_location(br, file$e, 28, 81, 1060);
      },
      m: function mount(target, anchor) {
        insert_dev(target, br, anchor);
        insert_dev(target, t0, anchor);
        insert_dev(target, t1, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*percents*/ 2 &&
          t0_value !==
            (t0_value =
              /*percents*/ (ctx[1][/*i*/ ctx[13]] * 100).toFixed() + "")
        )
          set_data_dev(t0, t0_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(br);
        if (detaching) detach_dev(t0);
        if (detaching) detach_dev(t1);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$6.name,
      type: "if",
      source: "(29:58) {#if (percents.length)}",
      ctx,
    });

    return block;
  }

  // (22:4) {#each values as val, i}
  function create_each_block$1(ctx) {
    let tr;
    let th;

    let t0_value =
      /*labels*/ (ctx[2][/*i*/ ctx[13]]
        ? /*labels*/ ctx[2][/*i*/ ctx[13]]
        : "") + "";

    let t0;
    let t1;
    let td;
    let t2;
    let t3;
    let span;
    let t4_value = /*val*/ ctx[11] + "";
    let t4;
    let if_block0 = /*percents*/ ctx[1].length && create_if_block_1$3(ctx);
    let if_block1 = /*percents*/ ctx[1].length && create_if_block$6(ctx);

    const block = {
      c: function create() {
        tr = element("tr");
        th = element("th");
        t0 = text(t0_value);
        t1 = space();
        td = element("td");
        t2 = space();
        if (if_block0) if_block0.c();
        t3 = space();
        span = element("span");
        t4 = text(t4_value);
        if (if_block1) if_block1.c();
        attr_dev(th, "scope", "row");
        attr_dev(th, "aria-label", "label");
        attr_dev(th, "class", "svelte-qotrzq");
        add_location(th, file$e, 23, 6, 741);
        attr_dev(td, "aria-label", "value");
        attr_dev(td, "class", "svelte-qotrzq");
        add_location(td, file$e, 24, 3, 813);
        attr_dev(span, "class", "displayBox svelte-qotrzq");
        attr_dev(span, "data-testid", "displayBox");
        add_location(span, file$e, 28, 3, 982);
        attr_dev(tr, "aria-label", "values");
        set_style(tr, "height", /*heights*/ ctx[10][/*i*/ ctx[13]] + "%");
        attr_dev(tr, "class", "svelte-qotrzq");
        add_location(tr, file$e, 22, 4, 680);
      },
      m: function mount(target, anchor) {
        insert_dev(target, tr, anchor);
        append_dev(tr, th);
        append_dev(th, t0);
        append_dev(tr, t1);
        append_dev(tr, td);
        append_dev(tr, t2);
        if (if_block0) if_block0.m(tr, null);
        append_dev(tr, t3);
        append_dev(tr, span);
        append_dev(span, t4);
        if (if_block1) if_block1.m(span, null);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*labels*/ 4 &&
          t0_value !==
            (t0_value =
              /*labels*/ (ctx[2][/*i*/ ctx[13]]
                ? /*labels*/ ctx[2][/*i*/ ctx[13]]
                : "") + "")
        )
          set_data_dev(t0, t0_value);

        if (/*percents*/ ctx[1].length) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_1$3(ctx);
            if_block0.c();
            if_block0.m(tr, t3);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (
          dirty & /*values*/ 1 &&
          t4_value !== (t4_value = /*val*/ ctx[11] + "")
        )
          set_data_dev(t4, t4_value);

        if (/*percents*/ ctx[1].length) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
          } else {
            if_block1 = create_if_block$6(ctx);
            if_block1.c();
            if_block1.m(span, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }

        if (dirty & /*heights*/ 1024) {
          set_style(tr, "height", /*heights*/ ctx[10][/*i*/ ctx[13]] + "%");
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(tr);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$1.name,
      type: "each",
      source: "(22:4) {#each values as val, i}",
      ctx,
    });

    return block;
  }

  function create_fragment$e(ctx) {
    let table;
    let thead;
    let tr;
    let th0;
    let t1;
    let th1;
    let t3;
    let tbody;
    let t4;
    let div0;
    let div0_hidden_value;
    let t5;
    let div1;
    let div1_hidden_value;
    let t6;
    let p;
    let t7;
    let t8;
    let t9;
    let t10;
    let t11;
    let each_value = /*values*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(
        get_each_context$1(ctx, each_value, i)
      );
    }

    const block = {
      c: function create() {
        table = element("table");
        thead = element("thead");
        tr = element("tr");
        th0 = element("th");
        th0.textContent = "Item";
        t1 = space();
        th1 = element("th");
        th1.textContent = "Value";
        t3 = space();
        tbody = element("tbody");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t4 = space();
        div0 = element("div");
        t5 = space();
        div1 = element("div");
        t6 = space();
        p = element("p");
        t7 = text(/*minTarget*/ ctx[4]);
        t8 = space();
        t9 = text(/*maxTarget*/ ctx[5]);
        t10 = space();
        t11 = text(/*expected*/ ctx[3]);
        attr_dev(th0, "scope", "col");
        attr_dev(th0, "class", "svelte-qotrzq");
        add_location(th0, file$e, 16, 6, 557);
        attr_dev(th1, "scope", "col");
        attr_dev(th1, "class", "svelte-qotrzq");
        add_location(th1, file$e, 17, 6, 589);
        attr_dev(tr, "class", "svelte-qotrzq");
        add_location(tr, file$e, 15, 4, 546);
        attr_dev(thead, "class", "svelte-qotrzq");
        add_location(thead, file$e, 14, 2, 534);
        attr_dev(div0, "class", "minmax svelte-qotrzq");
        div0.hidden = div0_hidden_value =
          /*minTarget*/ ctx[4] + /*maxTarget*/ ctx[5] === 0;
        set_style(div0, "bottom", /*targetBottom*/ ctx[7] + "%");
        set_style(div0, "height", /*targetHeight*/ ctx[8] + "%");
        add_location(div0, file$e, 31, 2, 1129);
        div1.hidden = div1_hidden_value = /*expectedHeight*/ ctx[9] === 0;
        attr_dev(div1, "class", "expected svelte-qotrzq");
        set_style(div1, "height", /*expectedHeight*/ ctx[9] + "%");
        add_location(div1, file$e, 35, 2, 1264);
        attr_dev(tbody, "class", "svelte-qotrzq");
        add_location(tbody, file$e, 20, 2, 639);
        attr_dev(table, "class", "graph svelte-qotrzq");
        attr_dev(table, "aria-label", "bar-chart");
        set_style(table, "--max-label", /*max*/ ctx[6]);
        add_location(table, file$e, 13, 0, 459);
        p.hidden = true;
        add_location(p, file$e, 38, 0, 1376);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, table, anchor);
        append_dev(table, thead);
        append_dev(thead, tr);
        append_dev(tr, th0);
        append_dev(tr, t1);
        append_dev(tr, th1);
        append_dev(table, t3);
        append_dev(table, tbody);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(tbody, null);
        }

        append_dev(tbody, t4);
        append_dev(tbody, div0);
        append_dev(tbody, t5);
        append_dev(tbody, div1);
        insert_dev(target, t6, anchor);
        insert_dev(target, p, anchor);
        append_dev(p, t7);
        append_dev(p, t8);
        append_dev(p, t9);
        append_dev(p, t10);
        append_dev(p, t11);
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*heights, percents, values, labels*/ 1031) {
          each_value = /*values*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(tbody, t4);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (
          dirty & /*minTarget, maxTarget*/ 48 &&
          div0_hidden_value !==
            (div0_hidden_value =
              /*minTarget*/ ctx[4] + /*maxTarget*/ ctx[5] === 0)
        ) {
          prop_dev(div0, "hidden", div0_hidden_value);
        }

        if (dirty & /*targetBottom*/ 128) {
          set_style(div0, "bottom", /*targetBottom*/ ctx[7] + "%");
        }

        if (dirty & /*targetHeight*/ 256) {
          set_style(div0, "height", /*targetHeight*/ ctx[8] + "%");
        }

        if (
          dirty & /*expectedHeight*/ 512 &&
          div1_hidden_value !==
            (div1_hidden_value = /*expectedHeight*/ ctx[9] === 0)
        ) {
          prop_dev(div1, "hidden", div1_hidden_value);
        }

        if (dirty & /*expectedHeight*/ 512) {
          set_style(div1, "height", /*expectedHeight*/ ctx[9] + "%");
        }

        if (dirty & /*max*/ 64) {
          set_style(table, "--max-label", /*max*/ ctx[6]);
        }

        if (dirty & /*minTarget*/ 16) set_data_dev(t7, /*minTarget*/ ctx[4]);
        if (dirty & /*maxTarget*/ 32) set_data_dev(t9, /*maxTarget*/ ctx[5]);
        if (dirty & /*expected*/ 8) set_data_dev(t11, /*expected*/ ctx[3]);
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(table);
        destroy_each(each_blocks, detaching);
        if (detaching) detach_dev(t6);
        if (detaching) detach_dev(p);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$e.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$e($$self, $$props, $$invalidate) {
    let max;
    let heights;
    let expectedHeight;
    let targetHeight;
    let targetBottom;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("BarChart", slots, []);
    let { values } = $$props;
    let { percents = [] } = $$props;
    let { labels = [] } = $$props;
    let { expected = 0 } = $$props;
    let { minTarget = 0 } = $$props;
    let { maxTarget = 0 } = $$props;
    const writable_props = [
      "values",
      "percents",
      "labels",
      "expected",
      "minTarget",
      "maxTarget",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<BarChart> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("percents" in $$props) $$invalidate(1, (percents = $$props.percents));
      if ("labels" in $$props) $$invalidate(2, (labels = $$props.labels));
      if ("expected" in $$props) $$invalidate(3, (expected = $$props.expected));
      if ("minTarget" in $$props)
        $$invalidate(4, (minTarget = $$props.minTarget));
      if ("maxTarget" in $$props)
        $$invalidate(5, (maxTarget = $$props.maxTarget));
    };

    $$self.$capture_state = () => ({
      values,
      percents,
      labels,
      expected,
      minTarget,
      maxTarget,
      max,
      targetBottom,
      targetHeight,
      expectedHeight,
      heights,
    });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("percents" in $$props) $$invalidate(1, (percents = $$props.percents));
      if ("labels" in $$props) $$invalidate(2, (labels = $$props.labels));
      if ("expected" in $$props) $$invalidate(3, (expected = $$props.expected));
      if ("minTarget" in $$props)
        $$invalidate(4, (minTarget = $$props.minTarget));
      if ("maxTarget" in $$props)
        $$invalidate(5, (maxTarget = $$props.maxTarget));
      if ("max" in $$props) $$invalidate(6, (max = $$props.max));
      if ("targetBottom" in $$props)
        $$invalidate(7, (targetBottom = $$props.targetBottom));
      if ("targetHeight" in $$props)
        $$invalidate(8, (targetHeight = $$props.targetHeight));
      if ("expectedHeight" in $$props)
        $$invalidate(9, (expectedHeight = $$props.expectedHeight));
      if ("heights" in $$props) $$invalidate(10, (heights = $$props.heights));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*values, expected, maxTarget*/ 41) {
        $$invalidate(6, (max = Math.max(...values, expected, maxTarget)));
      }

      if ($$self.$$.dirty & /*values, max*/ 65) {
        $$invalidate(
          10,
          (heights = values.map((v) => Math.round((v / max) * 100)))
        );
      }

      if ($$self.$$.dirty & /*expected, max*/ 72) {
        $$invalidate(9, (expectedHeight = Math.round((expected / max) * 100)));
      }

      if ($$self.$$.dirty & /*maxTarget, minTarget, max*/ 112) {
        $$invalidate(
          8,
          (targetHeight = Math.round(((maxTarget - minTarget) / max) * 100))
        );
      }

      if ($$self.$$.dirty & /*minTarget, max*/ 80) {
        $$invalidate(7, (targetBottom = Math.round((minTarget / max) * 100)));
      }
    };

    return [
      values,
      percents,
      labels,
      expected,
      minTarget,
      maxTarget,
      max,
      targetBottom,
      targetHeight,
      expectedHeight,
      heights,
    ];
  }

  class BarChart extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(this, options, instance$e, create_fragment$e, safe_not_equal, {
        values: 0,
        percents: 1,
        labels: 2,
        expected: 3,
        minTarget: 4,
        maxTarget: 5,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "BarChart",
        options,
        id: create_fragment$e.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn("<BarChart> was created without expected prop 'values'");
      }
    }

    get values() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get percents() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set percents(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get labels() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set labels(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get expected() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set expected(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get minTarget() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set minTarget(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get maxTarget() {
      throw new Error(
        "<BarChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set maxTarget(value) {
      throw new Error(
        "<BarChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/ReviewsWidget.svelte generated by Svelte v3.44.2 */

  const file$d = "src/components/ReviewsWidget.svelte";

  // (26:2) {:else}
  function create_else_block$1(ctx) {
    let h1;
    let t0;
    let t1;
    let t2_value = /*overallAccuracy*/ ctx[3].toFixed() + "";
    let t2;
    let t3;
    let h1_intro;
    let t4;
    let div;
    let table;
    let tr0;
    let th0;
    let t6;
    let td0;
    let t7_value = /*$srsCounts*/ ctx[8].expectedDaily.toFixed() + "";
    let t7;
    let t8;
    let span0;
    let t9;
    let t10;
    let t11;
    let t12_value = /*$gbSettings*/ ctx[9].rpdMin + "";
    let t12;
    let t13;
    let t14_value = /*$gbSettings*/ ctx[9].rpdMax + "";
    let t14;
    let t15;
    let t16;
    let tr1;
    let th1;
    let t17;
    let t18_value =
      /*dowString*/ ctx[10](
        /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 1]?.start
      ) + "";
    let t18;
    let t19;
    let t20;
    let td1;
    let t21_value =
      /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 1]
        ?.review_count + "";
    let t21;
    let t22;
    let span1;
    let t23;
    let t24_value =
      (
        100 * /*accuracyValues*/ ctx[0][/*accuracyValues*/ ctx[0].length - 1]
      ).toFixed() + "";
    let t24;
    let t25;
    let t26;
    let div_intro;

    function select_block_type_1(ctx, dirty) {
      if (/*$reviewCounts*/ ctx[2].length > 2) return create_if_block_1$2;
      if (/*$reviewCounts*/ ctx[2].length === 2) return create_if_block_2$1;
    }

    let current_block_type = select_block_type_1(ctx);
    let if_block = current_block_type && current_block_type(ctx);

    const block = {
      c: function create() {
        h1 = element("h1");
        t0 = text(/*totalReviews*/ ctx[1]);
        t1 = text(" Reviews @");
        t2 = text(t2_value);
        t3 = text("%");
        t4 = space();
        div = element("div");
        table = element("table");
        tr0 = element("tr");
        th0 = element("th");
        th0.textContent = "Expected Daily:";
        t6 = space();
        td0 = element("td");
        t7 = text(t7_value);
        t8 = space();
        span0 = element("span");
        t9 = text("(avg.: ");
        t10 = text(/*avgReviewsPerDay*/ ctx[5]);
        t11 = text(", target: ");
        t12 = text(t12_value);
        t13 = text("–");
        t14 = text(t14_value);
        t15 = text(")");
        t16 = space();
        tr1 = element("tr");
        th1 = element("th");
        t17 = text("Latest (");
        t18 = text(t18_value);
        t19 = text("):");
        t20 = space();
        td1 = element("td");
        t21 = text(t21_value);
        t22 = space();
        span1 = element("span");
        t23 = text("reviews @ ");
        t24 = text(t24_value);
        t25 = text("%");
        t26 = space();
        if (if_block) if_block.c();
        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$d, 26, 4, 1117);
        add_location(th0, file$d, 30, 10, 1313);
        attr_dev(span0, "class", "secondary");
        add_location(span0, file$d, 32, 12, 1403);
        add_location(td0, file$d, 31, 10, 1348);
        add_location(tr0, file$d, 29, 8, 1298);
        add_location(th1, file$d, 36, 10, 1572);
        attr_dev(span1, "class", "secondary");
        add_location(span1, file$d, 37, 72, 1723);
        add_location(td1, file$d, 37, 10, 1661);
        add_location(tr1, file$d, 35, 8, 1557);
        attr_dev(table, "class", "gbContent");
        add_location(table, file$d, 28, 6, 1264);
        attr_dev(div, "data-testid", "reviews-per-day-table");
        add_location(div, file$d, 27, 4, 1208);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        append_dev(h1, t0);
        append_dev(h1, t1);
        append_dev(h1, t2);
        append_dev(h1, t3);
        insert_dev(target, t4, anchor);
        insert_dev(target, div, anchor);
        append_dev(div, table);
        append_dev(table, tr0);
        append_dev(tr0, th0);
        append_dev(tr0, t6);
        append_dev(tr0, td0);
        append_dev(td0, t7);
        append_dev(td0, t8);
        append_dev(td0, span0);
        append_dev(span0, t9);
        append_dev(span0, t10);
        append_dev(span0, t11);
        append_dev(span0, t12);
        append_dev(span0, t13);
        append_dev(span0, t14);
        append_dev(span0, t15);
        append_dev(table, t16);
        append_dev(table, tr1);
        append_dev(tr1, th1);
        append_dev(th1, t17);
        append_dev(th1, t18);
        append_dev(th1, t19);
        append_dev(tr1, t20);
        append_dev(tr1, td1);
        append_dev(td1, t21);
        append_dev(td1, t22);
        append_dev(td1, span1);
        append_dev(span1, t23);
        append_dev(span1, t24);
        append_dev(span1, t25);
        append_dev(table, t26);
        if (if_block) if_block.m(table, null);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*totalReviews*/ 2)
          set_data_dev(t0, /*totalReviews*/ ctx[1]);
        if (
          dirty & /*overallAccuracy*/ 8 &&
          t2_value !== (t2_value = /*overallAccuracy*/ ctx[3].toFixed() + "")
        )
          set_data_dev(t2, t2_value);
        if (
          dirty & /*$srsCounts*/ 256 &&
          t7_value !==
            (t7_value = /*$srsCounts*/ ctx[8].expectedDaily.toFixed() + "")
        )
          set_data_dev(t7, t7_value);
        if (dirty & /*avgReviewsPerDay*/ 32)
          set_data_dev(t10, /*avgReviewsPerDay*/ ctx[5]);
        if (
          dirty & /*$gbSettings*/ 512 &&
          t12_value !== (t12_value = /*$gbSettings*/ ctx[9].rpdMin + "")
        )
          set_data_dev(t12, t12_value);
        if (
          dirty & /*$gbSettings*/ 512 &&
          t14_value !== (t14_value = /*$gbSettings*/ ctx[9].rpdMax + "")
        )
          set_data_dev(t14, t14_value);
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t18_value !==
            (t18_value =
              /*dowString*/ ctx[10](
                /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 1]
                  ?.start
              ) + "")
        )
          set_data_dev(t18, t18_value);
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t21_value !==
            (t21_value =
              /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 1]
                ?.review_count + "")
        )
          set_data_dev(t21, t21_value);
        if (
          dirty & /*accuracyValues*/ 1 &&
          t24_value !==
            (t24_value =
              (
                100 *
                /*accuracyValues*/ ctx[0][/*accuracyValues*/ ctx[0].length - 1]
              ).toFixed() + "")
        )
          set_data_dev(t24, t24_value);

        if (
          current_block_type ===
            (current_block_type = select_block_type_1(ctx)) &&
          if_block
        ) {
          if_block.p(ctx, dirty);
        } else {
          if (if_block) if_block.d(1);
          if_block = current_block_type && current_block_type(ctx);

          if (if_block) {
            if_block.c();
            if_block.m(table, null);
          }
        }
      },
      i: function intro(local) {
        if (!h1_intro) {
          add_render_callback(() => {
            h1_intro = create_in_transition(h1, fade, {});
            h1_intro.start();
          });
        }

        if (!div_intro) {
          add_render_callback(() => {
            div_intro = create_in_transition(div, fade, {});
            div_intro.start();
          });
        }
      },
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t4);
        if (detaching) detach_dev(div);

        if (if_block) {
          if_block.d();
        }
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block$1.name,
      type: "else",
      source: "(26:2) {:else}",
      ctx,
    });

    return block;
  }

  // (16:2) {#if ($display === "chart")}
  function create_if_block$5(ctx) {
    let h1;
    let t1;
    let barchart;
    let current;

    barchart = new BarChart({
      props: {
        values: /*displayValues*/ ctx[4],
        labels: /*startDayOfWeeks*/ ctx[6],
        expected: /*$srsCounts*/ ctx[8].expectedDaily,
        minTarget: /*$gbSettings*/ ctx[9].rpdMin,
        maxTarget: /*$gbSettings*/ ctx[9].rpdMax,
        percents: /*accuracyValues*/ ctx[0],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        h1 = element("h1");
        h1.textContent = "Reviews";
        t1 = space();
        create_component(barchart.$$.fragment);
        attr_dev(h1, "class", "gbHeader");
        add_location(h1, file$d, 16, 4, 838);
      },
      m: function mount(target, anchor) {
        insert_dev(target, h1, anchor);
        insert_dev(target, t1, anchor);
        mount_component(barchart, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const barchart_changes = {};
        if (dirty & /*displayValues*/ 16)
          barchart_changes.values = /*displayValues*/ ctx[4];
        if (dirty & /*startDayOfWeeks*/ 64)
          barchart_changes.labels = /*startDayOfWeeks*/ ctx[6];
        if (dirty & /*$srsCounts*/ 256)
          barchart_changes.expected = /*$srsCounts*/ ctx[8].expectedDaily;
        if (dirty & /*$gbSettings*/ 512)
          barchart_changes.minTarget = /*$gbSettings*/ ctx[9].rpdMin;
        if (dirty & /*$gbSettings*/ 512)
          barchart_changes.maxTarget = /*$gbSettings*/ ctx[9].rpdMax;
        if (dirty & /*accuracyValues*/ 1)
          barchart_changes.percents = /*accuracyValues*/ ctx[0];
        barchart.$set(barchart_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(barchart.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(barchart.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(h1);
        if (detaching) detach_dev(t1);
        destroy_component(barchart, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$5.name,
      type: "if",
      source: '(16:2) {#if ($display === \\"chart\\")}',
      ctx,
    });

    return block;
  }

  // (50:47)
  function create_if_block_2$1(ctx) {
    let tr;
    let th;
    let t0_value =
      /*dowString*/ ctx[10](/*$reviewCounts*/ ctx[2][0].start) + "";
    let t0;
    let t1;
    let t2;
    let td;
    let t3_value = /*$reviewCounts*/ ctx[2][0].review_count + "";
    let t3;
    let t4;
    let span;

    const block = {
      c: function create() {
        tr = element("tr");
        th = element("th");
        t0 = text(t0_value);
        t1 = text(":");
        t2 = space();
        td = element("td");
        t3 = text(t3_value);
        t4 = space();
        span = element("span");
        span.textContent = "reviews";
        add_location(th, file$d, 51, 12, 2440);
        attr_dev(span, "class", "secondary");
        add_location(span, file$d, 52, 48, 2534);
        add_location(td, file$d, 52, 12, 2498);
        add_location(tr, file$d, 50, 10, 2423);
      },
      m: function mount(target, anchor) {
        insert_dev(target, tr, anchor);
        append_dev(tr, th);
        append_dev(th, t0);
        append_dev(th, t1);
        append_dev(tr, t2);
        append_dev(tr, td);
        append_dev(td, t3);
        append_dev(td, t4);
        append_dev(td, span);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t0_value !==
            (t0_value =
              /*dowString*/ ctx[10](/*$reviewCounts*/ ctx[2][0].start) + "")
        )
          set_data_dev(t0, t0_value);
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t3_value !==
            (t3_value = /*$reviewCounts*/ ctx[2][0].review_count + "")
        )
          set_data_dev(t3, t3_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(tr);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$1.name,
      type: "if",
      source: "(50:47) ",
      ctx,
    });

    return block;
  }

  // (41:8) {#if ($reviewCounts.length > 2)}
  function create_if_block_1$2(ctx) {
    let tr0;
    let th0;
    let t0_value =
      /*dowString*/ ctx[10](/*$reviewCounts*/ ctx[2][0].start) + "";
    let t0;
    let t1;
    let t2_value =
      /*dowString*/ ctx[10](
        /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 2].start
      ) + "";
    let t2;
    let t3;
    let t4;
    let td0;
    let t5_value =
      /*$reviewCounts*/ ctx[2].slice(0, -1).map(func).join(" • ") + "";
    let t5;
    let t6;
    let span0;
    let t8;
    let tr1;
    let th1;
    let t9;
    let td1;
    let t10_value =
      /*accuracyValues*/ ctx[0].slice(0, -1).map(func_1).join("% • ") + "";
    let t10;
    let t11;
    let span1;

    const block = {
      c: function create() {
        tr0 = element("tr");
        th0 = element("th");
        t0 = text(t0_value);
        t1 = text(" – ");
        t2 = text(t2_value);
        t3 = text(":");
        t4 = space();
        td0 = element("td");
        t5 = text(t5_value);
        t6 = space();
        span0 = element("span");
        span0.textContent = "reviews";
        t8 = space();
        tr1 = element("tr");
        th1 = element("th");
        t9 = space();
        td1 = element("td");
        t10 = text(t10_value);
        t11 = text("% ");
        span1 = element("span");
        span1.textContent = "accuracy";
        add_location(th0, file$d, 42, 12, 1924);
        attr_dev(span0, "class", "secondary");
        add_location(span0, file$d, 43, 82, 2119);
        add_location(td0, file$d, 43, 12, 2049);
        add_location(tr0, file$d, 41, 10, 1907);
        add_location(th1, file$d, 46, 12, 2206);
        attr_dev(span1, "class", "secondary");
        add_location(span1, file$d, 47, 88, 2304);
        add_location(td1, file$d, 47, 12, 2228);
        add_location(tr1, file$d, 45, 10, 2189);
      },
      m: function mount(target, anchor) {
        insert_dev(target, tr0, anchor);
        append_dev(tr0, th0);
        append_dev(th0, t0);
        append_dev(th0, t1);
        append_dev(th0, t2);
        append_dev(th0, t3);
        append_dev(tr0, t4);
        append_dev(tr0, td0);
        append_dev(td0, t5);
        append_dev(td0, t6);
        append_dev(td0, span0);
        insert_dev(target, t8, anchor);
        insert_dev(target, tr1, anchor);
        append_dev(tr1, th1);
        append_dev(tr1, t9);
        append_dev(tr1, td1);
        append_dev(td1, t10);
        append_dev(td1, t11);
        append_dev(td1, span1);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t0_value !==
            (t0_value =
              /*dowString*/ ctx[10](/*$reviewCounts*/ ctx[2][0].start) + "")
        )
          set_data_dev(t0, t0_value);
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t2_value !==
            (t2_value =
              /*dowString*/ ctx[10](
                /*$reviewCounts*/ ctx[2][/*$reviewCounts*/ ctx[2].length - 2]
                  .start
              ) + "")
        )
          set_data_dev(t2, t2_value);
        if (
          dirty & /*$reviewCounts*/ 4 &&
          t5_value !==
            (t5_value =
              /*$reviewCounts*/ ctx[2].slice(0, -1).map(func).join(" • ") + "")
        )
          set_data_dev(t5, t5_value);
        if (
          dirty & /*accuracyValues*/ 1 &&
          t10_value !==
            (t10_value =
              /*accuracyValues*/ ctx[0].slice(0, -1).map(func_1).join("% • ") +
              "")
        )
          set_data_dev(t10, t10_value);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(tr0);
        if (detaching) detach_dev(t8);
        if (detaching) detach_dev(tr1);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$2.name,
      type: "if",
      source: "(41:8) {#if ($reviewCounts.length > 2)}",
      ctx,
    });

    return block;
  }

  function create_fragment$d(ctx) {
    let div;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block$5, create_else_block$1];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*$display*/ ctx[7] === "chart") return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        div = element("div");
        if_block.c();
        attr_dev(div, "class", "gbWidget");
        attr_dev(div, "data-testid", "reviews-per-day-gauge");
        add_location(div, file$d, 14, 0, 744);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        if_blocks[current_block_type_index].m(div, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        } else {
          group_outros();

          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });

          check_outros();
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] =
              if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        if_blocks[current_block_type_index].d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$d.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const func = (r) => r.review_count;
  const func_1 = (a) => (100 * a).toFixed();

  function instance$d($$self, $$props, $$invalidate) {
    let startDayOfWeeks;
    let totalReviews;
    let avgReviewsPerDay;
    let displayValues;
    let accuracyValues;
    let overallAccuracy;
    let $reviewCounts;
    let $daysToReview;
    let $display;
    let $srsCounts;
    let $gbSettings;
    validate_store(reviewCounts, "reviewCounts");
    component_subscribe($$self, reviewCounts, ($$value) =>
      $$invalidate(2, ($reviewCounts = $$value))
    );
    validate_store(daysToReview, "daysToReview");
    component_subscribe($$self, daysToReview, ($$value) =>
      $$invalidate(11, ($daysToReview = $$value))
    );
    validate_store(display, "display");
    component_subscribe($$self, display, ($$value) =>
      $$invalidate(7, ($display = $$value))
    );
    validate_store(srsCounts, "srsCounts");
    component_subscribe($$self, srsCounts, ($$value) =>
      $$invalidate(8, ($srsCounts = $$value))
    );
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(9, ($gbSettings = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("ReviewsWidget", slots, []);

    const dowString = (date) => {
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        date
      );
    };

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<ReviewsWidget> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      BarChart,
      fade,
      display,
      gbSettings,
      daysToReview,
      srsCounts,
      reviewCounts,
      dowString,
      accuracyValues,
      overallAccuracy,
      displayValues,
      totalReviews,
      avgReviewsPerDay,
      startDayOfWeeks,
      $reviewCounts,
      $daysToReview,
      $display,
      $srsCounts,
      $gbSettings,
    });

    $$self.$inject_state = ($$props) => {
      if ("accuracyValues" in $$props)
        $$invalidate(0, (accuracyValues = $$props.accuracyValues));
      if ("overallAccuracy" in $$props)
        $$invalidate(3, (overallAccuracy = $$props.overallAccuracy));
      if ("displayValues" in $$props)
        $$invalidate(4, (displayValues = $$props.displayValues));
      if ("totalReviews" in $$props)
        $$invalidate(1, (totalReviews = $$props.totalReviews));
      if ("avgReviewsPerDay" in $$props)
        $$invalidate(5, (avgReviewsPerDay = $$props.avgReviewsPerDay));
      if ("startDayOfWeeks" in $$props)
        $$invalidate(6, (startDayOfWeeks = $$props.startDayOfWeeks));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$reviewCounts*/ 4) {
        $$invalidate(
          6,
          (startDayOfWeeks = $reviewCounts.map((r) => dowString(r.start)))
        );
      }

      if ($$self.$$.dirty & /*$reviewCounts*/ 4) {
        $$invalidate(
          1,
          (totalReviews = $reviewCounts.reduce(
            (acc, r) => (acc += r.review_count),
            0
          ))
        );
      }

      if ($$self.$$.dirty & /*totalReviews, $daysToReview*/ 2050) {
        $$invalidate(
          5,
          (avgReviewsPerDay = (totalReviews / $daysToReview[0]).toFixed())
        );
      }

      if ($$self.$$.dirty & /*$reviewCounts*/ 4) {
        $$invalidate(
          4,
          (displayValues = $reviewCounts.map((r) => r.review_count))
        );
      }

      if ($$self.$$.dirty & /*$reviewCounts*/ 4) {
        $$invalidate(
          0,
          (accuracyValues = $reviewCounts.map((r) => r.accuracy))
        );
      }

      if ($$self.$$.dirty & /*accuracyValues*/ 1) {
        $$invalidate(
          3,
          (overallAccuracy =
            (100 * accuracyValues.reduce((acc, v) => (acc += v), 0)) /
            accuracyValues.length)
        );
      }
    };

    return [
      accuracyValues,
      totalReviews,
      $reviewCounts,
      overallAccuracy,
      displayValues,
      avgReviewsPerDay,
      startDayOfWeeks,
      $display,
      $srsCounts,
      $gbSettings,
      dowString,
      $daysToReview,
    ];
  }

  class ReviewsWidget extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "ReviewsWidget",
        options,
        id: create_fragment$d.name,
      });
    }
  }

  /* src/components/Modal.svelte generated by Svelte v3.44.2 */

  const file$c = "src/components/Modal.svelte";

  // (18:0) {#if shown}
  function create_if_block$4(ctx) {
    let div1;
    let div0;
    let svg;
    let circle;
    let line0;
    let line1;
    let t;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = /*#slots*/ ctx[4].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[3],
      null
    );

    const block = {
      c: function create() {
        div1 = element("div");
        div0 = element("div");
        svg = svg_element("svg");
        circle = svg_element("circle");
        line0 = svg_element("line");
        line1 = svg_element("line");
        t = space();
        if (default_slot) default_slot.c();
        attr_dev(circle, "cx", "6");
        attr_dev(circle, "cy", "6");
        attr_dev(circle, "r", "6");
        add_location(circle, file$c, 21, 4, 375);
        attr_dev(line0, "x1", "3");
        attr_dev(line0, "y1", "3");
        attr_dev(line0, "x2", "9");
        attr_dev(line0, "y2", "9");
        attr_dev(line0, "class", "svelte-12qk02z");
        add_location(line0, file$c, 22, 4, 404);
        attr_dev(line1, "x1", "9");
        attr_dev(line1, "y1", "3");
        attr_dev(line1, "x2", "3");
        attr_dev(line1, "y2", "9");
        attr_dev(line1, "class", "svelte-12qk02z");
        add_location(line1, file$c, 23, 4, 437);
        attr_dev(svg, "class", "closeIcon svelte-12qk02z");
        attr_dev(svg, "viewBox", "0 0 12 12");
        add_location(svg, file$c, 20, 3, 303);
        attr_dev(div0, "class", "modal svelte-12qk02z");
        add_location(div0, file$c, 19, 4, 280);
        attr_dev(div1, "class", "modal-wrapper svelte-12qk02z");
        add_location(div1, file$c, 18, 2, 248);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div1, anchor);
        append_dev(div1, div0);
        append_dev(div0, svg);
        append_dev(svg, circle);
        append_dev(svg, line0);
        append_dev(svg, line1);
        append_dev(div0, t);

        if (default_slot) {
          default_slot.m(div0, null);
        }

        current = true;

        if (!mounted) {
          dispose = listen_dev(
            svg,
            "click",
            /*click_handler*/ ctx[6],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[3],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[3],
                    dirty,
                    null
                  ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div1);
        if (default_slot) default_slot.d(detaching);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$4.name,
      type: "if",
      source: "(18:0) {#if shown}",
      ctx,
    });

    return block;
  }

  function create_fragment$c(ctx) {
    let if_block_anchor;
    let current;
    let mounted;
    let dispose;
    let if_block = /*shown*/ ctx[1] && create_if_block$4(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
        current = true;

        if (!mounted) {
          dispose = listen_dev(
            window,
            "keydown",
            /*keydown_handler*/ ctx[5],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (/*shown*/ ctx[1]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*shown*/ 2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$4(ctx);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();

          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$c.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$c($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Modal", slots, ["default"]);
    let shown = false;

    function show() {
      $$invalidate(1, (shown = true));
    }

    function hide() {
      $$invalidate(1, (shown = false));
    }

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Modal> was created with unknown prop '${key}'`);
    });

    const keydown_handler = (e) => {
      if (e.key == "Escape") {
        hide();
      }
    };

    const click_handler = () => hide();

    $$self.$$set = ($$props) => {
      if ("$$scope" in $$props) $$invalidate(3, ($$scope = $$props.$$scope));
    };

    $$self.$capture_state = () => ({ shown, show, hide });

    $$self.$inject_state = ($$props) => {
      if ("shown" in $$props) $$invalidate(1, (shown = $$props.shown));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [hide, shown, show, $$scope, slots, keydown_handler, click_handler];
  }

  class Modal extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$c, create_fragment$c, safe_not_equal, {
        show: 2,
        hide: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Modal",
        options,
        id: create_fragment$c.name,
      });
    }

    get show() {
      return this.$$.ctx[2];
    }

    set show(value) {
      throw new Error(
        "<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get hide() {
      return this.$$.ctx[0];
    }

    set hide(value) {
      throw new Error(
        "<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  function n() {
    return (n =
      Object.assign ||
      function (n) {
        for (var t, r = 1, e = arguments.length; r < e; r++)
          for (var u in (t = arguments[r]))
            Object.prototype.hasOwnProperty.call(t, u) && (n[u] = t[u]);
        return n;
      }).apply(this, arguments);
  }
  function t(n, t, r) {
    if (r || 2 === arguments.length)
      for (var e, u = 0, i = t.length; u < i; u++)
        (!e && u in t) ||
          (e || (e = Array.prototype.slice.call(t, 0, u)), (e[u] = t[u]));
    return n.concat(e || t);
  }
  var r = Object.assign;
  function e(n) {
    return "function" == typeof n;
  }
  function u(n, t) {
    function r(n) {
      (e = !0), (u = n);
    }
    for (var e = !1, u = null, i = 0; i < n.length; i++)
      if ((t(n[i], r, i), e)) return u;
  }
  function i(n) {
    for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
    return e(n) ? n.apply(void 0, t) : n;
  }
  function o(n, t) {
    var r;
    return null !== (r = i(n)) && void 0 !== r ? r : t;
  }
  function s(n, t) {
    return (n = { pass: n }), t && (n.message = t), n;
  }
  function a(n, t) {
    try {
      return n.run(t);
    } catch (n) {
      return s(!1);
    }
  }
  function c(n) {
    return function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return !n.apply(void 0, t);
    };
  }
  function f(n, t) {
    return n.length === Number(t);
  }
  var l = c(f);
  function v(n, t) {
    return n.length > Number(t);
  }
  function p(n) {
    return null === n;
  }
  var d = c(p);
  function g(n) {
    return void 0 === n;
  }
  var h = c(g);
  function m(n) {
    return String(n) === n;
  }
  function y(n, t) {
    return m(n) && m(t) && n.endsWith(t);
  }
  var N = c(y);
  function E(n, t) {
    return n === t;
  }
  var b = c(E);
  function C(n) {
    var t = Number(n);
    return !(isNaN(parseFloat(String(n))) || isNaN(Number(n)) || !isFinite(t));
  }
  var O = c(C);
  function T(n, t) {
    return C(n) && C(t) && Number(n) > Number(t);
  }
  function S(n, t) {
    return C(n) && C(t) && Number(n) >= Number(t);
  }
  function w(n) {
    return !!Array.isArray(n);
  }
  var P = c(w);
  function F(n, t) {
    return !!(w(t) || (m(t) && m(n))) && -1 !== t.indexOf(n);
  }
  var x = c(F);
  function k(n, t) {
    return C(n) && C(t) && Number(n) <= Number(t);
  }
  function I(n, t, r) {
    return S(n, t) && k(n, r);
  }
  var W = c(I);
  function A(n) {
    return m(n) && !n.trim();
  }
  var D = c(A);
  function L(n) {
    return !!n === n;
  }
  var U = c(L);
  function X(n) {
    return "number" == typeof n;
  }
  var R = c(X);
  function j(n) {
    if (n) {
      if (X(n)) return 0 === n;
      if (Object.prototype.hasOwnProperty.call(n, "length")) return f(n, 0);
      if ("object" == typeof n) return f(Object.keys(n), 0);
    }
    return !0;
  }
  var _ = c(j);
  function G(n) {
    return Number.isNaN(n);
  }
  var M = c(G);
  function q(n) {
    return !!C(n) && 0 > Number(n);
  }
  var B = c(q),
    K = c(m);
  function H(n) {
    return !!n;
  }
  var V = c(H);
  function J(n, t) {
    return C(n) && C(t) && Number(n) < Number(t);
  }
  function z(n, t) {
    return t instanceof RegExp ? t.test(n) : !!m(t) && new RegExp(t).test(n);
  }
  var Y = c(z);
  function Q(n, t) {
    return C(n) && C(t) && Number(n) === Number(t);
  }
  var Z = c(Q);
  function $(n, t) {
    return m(n) && m(t) && n.startsWith(t);
  }
  var nn = c($);
  function tn(n, t) {
    throw Error(o(t, n));
  }
  function rn(n) {
    function t(t, o) {
      var s,
        a,
        c = e();
      return (
        (t = r({}, c || {}, null !== (s = i(n, t, c)) && void 0 !== s ? s : t)),
        (s = u.ctx = Object.freeze(t)),
        u.ancestry.unshift(s),
        (o = o(s)),
        u.ancestry.shift(),
        (u.ctx = null !== (a = u.ancestry[0]) && void 0 !== a ? a : null),
        o
      );
    }
    function e() {
      return u.ctx;
    }
    var u = { ancestry: [] };
    return {
      bind: function (n, r) {
        return function () {
          for (var e = [], u = 0; u < arguments.length; u++)
            e[u] = arguments[u];
          return t(n, function () {
            return r.apply(void 0, e);
          });
        };
      },
      run: t,
      use: e,
      useX: function (n) {
        var t;
        return null !== (t = u.ctx) && void 0 !== t
          ? t
          : tn(o(n, "Context was used after it was closed"));
      },
    };
  }
  var en = rn(function (n, t) {
    var e = { value: n.value, meta: n.meta || {} };
    return t
      ? n.set
        ? r(e, {
            parent: function () {
              return t ? { value: t.value, meta: t.meta, parent: t.parent } : t;
            },
          })
        : t
      : r(e, { parent: un });
  });
  function un() {
    return null;
  }
  function on(n, t) {
    function r(r) {
      var e = n[r],
        u = t[r];
      if (
        !(r = en.run({ value: e, set: !0, meta: { key: r } }, function () {
          return a(u, e);
        })).pass
      )
        return { value: r };
    }
    for (var e in t) {
      var u = r(e);
      if ("object" == typeof u) return u.value;
    }
    return s(!0);
  }
  var sn = r(
    {
      condition: function (n, t) {
        try {
          return t(n);
        } catch (n) {
          return !1;
        }
      },
      doesNotEndWith: N,
      doesNotStartWith: nn,
      endsWith: y,
      equals: E,
      greaterThan: T,
      greaterThanOrEquals: S,
      gt: T,
      gte: S,
      inside: F,
      isArray: w,
      isBetween: I,
      isBlank: A,
      isBoolean: L,
      isEmpty: j,
      isEven: function (n) {
        return !!C(n) && 0 == n % 2;
      },
      isFalsy: V,
      isNaN: G,
      isNegative: q,
      isNotArray: P,
      isNotBetween: W,
      isNotBlank: D,
      isNotBoolean: U,
      isNotEmpty: _,
      isNotNaN: M,
      isNotNull: d,
      isNotNumber: R,
      isNotNumeric: O,
      isNotString: K,
      isNotUndefined: h,
      isNull: p,
      isNumber: X,
      isNumeric: C,
      isOdd: function (n) {
        return !!C(n) && 0 != n % 2;
      },
      isPositive: B,
      isString: m,
      isTruthy: H,
      isUndefined: g,
      lengthEquals: f,
      lengthNotEquals: l,
      lessThan: J,
      lessThanOrEquals: k,
      longerThan: v,
      longerThanOrEquals: function (n, t) {
        return n.length >= Number(t);
      },
      lt: J,
      lte: k,
      matches: z,
      notEquals: b,
      notInside: x,
      notMatches: Y,
      numberEquals: Q,
      numberNotEquals: Z,
      shorterThan: function (n, t) {
        return n.length < Number(t);
      },
      shorterThanOrEquals: function (n, t) {
        return n.length <= Number(t);
      },
      startsWith: $,
    },
    {
      allOf: function (n) {
        for (var t = [], r = 1; r < arguments.length; r++)
          t[r - 1] = arguments[r];
        return o(
          u(t, function (t, r) {
            (t = a(t, n)).pass || r(t);
          }),
          s(!0)
        );
      },
      anyOf: function (n) {
        for (var t = [], r = 1; r < arguments.length; r++)
          t[r - 1] = arguments[r];
        return o(
          u(t, function (t, r) {
            (t = a(t, n)).pass && r(t);
          }),
          s(!1)
        );
      },
      noneOf: function (n) {
        for (var t = [], r = 1; r < arguments.length; r++)
          t[r - 1] = arguments[r];
        return o(
          u(t, function (t, r) {
            a(t, n).pass && r(s(!1));
          }),
          s(!0)
        );
      },
      oneOf: function (n) {
        for (var t = [], r = 1; r < arguments.length; r++)
          t[r - 1] = arguments[r];
        var e = [];
        return (
          t.some(function (t) {
            if (v(e, 1)) return !1;
            (t = a(t, n)).pass && e.push(t);
          }),
          s(f(e, 1))
        );
      },
      optional: function (n, t) {
        return g(n) || null === n ? s(!0) : a(t, n);
      },
    },
    {
      shape: function (n, t) {
        var r = on(n, t);
        if (!r.pass) return r;
        for (var e in n)
          if (!Object.prototype.hasOwnProperty.call(t, e)) return s(!1);
        return s(!0);
      },
      loose: on,
      isArrayOf: function (n, t) {
        return o(
          u(n, function (n, r, e) {
            (e = en.run({ value: n, set: !0, meta: { index: e } }, function () {
              return a(t, n);
            })).pass || r(e);
          }),
          s(!0)
        );
      },
    }
  );
  function an(n) {
    for (var t in sn) {
      var r = sn[t];
      e(r) && n(t, r);
    }
  }
  function cn() {
    try {
      return e(Proxy);
    } catch (n) {
      return !1;
    }
  }
  function fn(n, r, e) {
    for (var u = [], o = 3; o < arguments.length; o++) u[o - 3] = arguments[o];
    return (
      L(n) ||
        (n && L(n.pass)) ||
        tn("Incorrect return value for rule: " + JSON.stringify(n)),
      L(n) ? s(n) : s(n.pass, i.apply(void 0, t([n.message, r, e], u)))
    );
  }
  function ln(n) {
    function r(r, e, u) {
      return function () {
        for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o];
        if (
          !(o = fn.apply(
            void 0,
            t(
              [
                en.run({ value: n }, function () {
                  return e.apply(void 0, t([n], i));
                }),
                u,
                n,
              ],
              i
            )
          )).pass
        ) {
          if (!j(o.message)) throw o.message;
          tn("enforce/" + u + " failed with " + JSON.stringify(n));
        }
        return r;
      };
    }
    var e = {};
    if (!cn())
      return (
        an(function (n, t) {
          e[n] = r(e, t, n);
        }),
        e
      );
    var u = new Proxy(e, {
      get: function (n, t) {
        if ((n = sn[t])) return r(u, n, t);
      },
    });
    return u;
  }
  function vn(n) {
    var r,
      e = [];
    return (function n(a) {
      return function () {
        for (var c = [], f = 0; f < arguments.length; f++) c[f] = arguments[f];
        var l = sn[a];
        e.push(function (n) {
          return fn.apply(void 0, t([l.apply(void 0, t([n], c)), a, n], c));
        });
        var v = {
          run: function (n) {
            return o(
              u(e, function (t, e) {
                var u,
                  o = en.run({ value: n }, function () {
                    return t(n);
                  });
                o.pass ||
                  e(
                    s(
                      !!o.pass,
                      null !== (u = i(r, n, o.message)) && void 0 !== u
                        ? u
                        : o.message
                    )
                  );
              }),
              s(!0)
            );
          },
          test: function (n) {
            return v.run(n).pass;
          },
          message: function (n) {
            return n && (r = n), v;
          },
        };
        return cn()
          ? (v = new Proxy(v, {
              get: function (t, r) {
                return sn[r] ? n(r) : t[r];
              },
            }))
          : (an(function (t) {
              v[t] = n(t);
            }),
            v);
      };
    })(n);
  }
  function pn(n) {
    var t,
      r = {};
    for (t in n) r[t] = gn.optional(n[t]);
    return r;
  }
  var dn,
    gn =
      ((dn = n(
        {
          context: function () {
            return en.useX();
          },
          extend: function (n) {
            r(sn, n);
          },
        },
        { partial: pn }
      )),
      cn()
        ? new Proxy(r(ln, dn), {
            get: function (n, t) {
              return t in n ? n[t] : sn[t] ? vn(t) : void 0;
            },
          })
        : (an(function (n) {
            dn[n] = vn(n);
          }),
          dn)),
    hn = (function (n) {
      return function () {
        return "" + n++;
      };
    })(0);
  function mn(n) {
    function t(n, t, e) {
      return (
        u.references.push(),
        r(n, i(t, e)),
        function () {
          return [
            u.references[n],
            function (t) {
              return r(n, i(t, u.references[n]));
            },
          ];
        }
      );
    }
    function r(t, r) {
      var i = u.references[t];
      (u.references[t] = r), e((t = o[t][1])) && t(r, i), e(n) && n();
    }
    var u = { references: [] },
      o = [];
    return {
      registerStateKey: function (n, r) {
        var e = o.length;
        return o.push([n, r]), t(e, n);
      },
      reset: function () {
        var n = u.references;
        (u.references = []),
          o.forEach(function (r, e) {
            return t(e, r[0], n[e]);
          });
      },
    };
  }
  var yn,
    Nn = yn || (yn = {});
  function En(n, t) {
    var r = t.suiteId;
    return (
      (t = t.suiteName),
      {
        optionalFields: n.registerStateKey(function () {
          return {};
        }),
        suiteId: n.registerStateKey(r),
        suiteName: n.registerStateKey(t),
        testCallbacks: n.registerStateKey(function () {
          return { fieldCallbacks: {}, doneCallbacks: [] };
        }),
        testObjects: n.registerStateKey(function (n) {
          return { prev: n ? n.current : [], current: [] };
        }),
      }
    );
  }
  function bn(n) {
    return (n = [].concat(n))[n.length - 1];
  }
  function Cn() {
    function n() {
      t = [0];
    }
    var t = [];
    return (
      n(),
      {
        addLevel: function () {
          t.push(0);
        },
        cursorAt: function () {
          return bn(t);
        },
        getCursor: function () {
          return [].concat(t);
        },
        next: function () {
          return t[t.length - 1]++, bn(t);
        },
        removeLevel: function () {
          t.pop();
        },
        reset: n,
      }
    );
  }
  (Nn[(Nn.DEFAULT = 0)] = "DEFAULT"),
    (Nn[(Nn.SUITE = 1)] = "SUITE"),
    (Nn[(Nn.EACH = 2)] = "EACH"),
    (Nn[(Nn.SKIP_WHEN = 3)] = "SKIP_WHEN"),
    (Nn[(Nn.GROUP = 4)] = "GROUP");
  var On = rn(function (n, t) {
    return t
      ? null
      : r(
          {},
          {
            isolate: { type: yn.DEFAULT },
            testCursor: Cn(),
            exclusion: { tests: {}, groups: {} },
          },
          n
        );
  });
  function Tn(n, t) {
    for (var r = [], e = 0; e < n.length; e++) {
      var u = n[e];
      w(u) ? r.push(Tn(u, t)) : ((u = t(u)), d(u) && r.push(u));
    }
    return r;
  }
  function Sn(n) {
    return [].concat(n).reduce(function (n, t) {
      return w(t) ? n.concat(Sn(t)) : [].concat(n).concat(t);
    }, []);
  }
  function wn(n, t) {
    var r = 0;
    for (t = t.slice(0, -1); r < t.length; r++) {
      var e = t[r];
      (n[e] = o(n[e], [])), (n = n[e]);
    }
    return n;
  }
  function Pn(n) {
    function t(e, u) {
      var i = t.get(e);
      return i
        ? i[1]
        : ((u = u()), r.unshift([e.concat(), u]), v(r, n) && (r.length = n), u);
    }
    void 0 === n && (n = 1);
    var r = [];
    return (
      (t.invalidate = function (n) {
        var t = r.findIndex(function (t) {
          var r = t[0];
          return (
            f(n, r.length) &&
            n.every(function (n, t) {
              return n === r[t];
            })
          );
        });
        -1 < t && r.splice(t, 1);
      }),
      (t.get = function (n) {
        return (
          r[
            r.findIndex(function (t) {
              var r = t[0];
              return (
                f(n, r.length) &&
                n.every(function (n, t) {
                  return n === r[t];
                })
              );
            })
          ] || null
        );
      }),
      t
    );
  }
  function Fn() {
    return On.useX().stateRef;
  }
  function xn() {
    (0, Fn().testObjects()[1])(function (n) {
      return { prev: n.prev, current: [].concat(n.current) };
    });
  }
  function kn(n) {
    (0, Fn().testObjects()[1])(function (t) {
      return { prev: t.prev, current: [].concat(n(t.current)) };
    });
  }
  function In() {
    return Sn(
      Tn(Fn().testObjects()[0].current, function (n) {
        return n.isPending() ? n : null;
      })
    );
  }
  var Wn = Pn();
  function An() {
    var n = Fn().testObjects()[0].current;
    return Wn([n], function () {
      return Sn(n);
    });
  }
  function Dn() {
    return On.useX().testCursor.getCursor();
  }
  function Ln(n, t) {
    if (((n = void 0 === (n = n.type) ? yn.DEFAULT : n), e(t))) {
      var r = Dn();
      return On.run({ isolate: { type: n } }, function () {
        On.useX().testCursor.addLevel(),
          kn(function (n) {
            return (wn(n, r)[bn(r)] = []), n;
          });
        var n = t();
        return (
          On.useX().testCursor.removeLevel(), On.useX().testCursor.next(), n
        );
      });
    }
  }
  function Un(n, t) {
    return !(!t || n.fieldName !== t);
  }
  function Xn(n) {
    var t = In();
    return (
      !j(t) &&
      (n
        ? t.some(function (t) {
            return Un(t, n);
          })
        : _(t))
    );
  }
  function Rn(n, t) {
    function r(n, t) {
      i[n]++, u && (i[t] = (i[t] || []).concat(u));
    }
    var e = t.fieldName,
      u = t.message;
    n[e] = n[e] || { errorCount: 0, warnCount: 0, testCount: 0 };
    var i = n[e];
    return (
      t.isSkipped() ||
        (n[e].testCount++,
        t.isFailing()
          ? r("errorCount", "errors")
          : t.isWarning() && r("warnCount", "warnings")),
      i
    );
  }
  function jn(t, r, e) {
    var u;
    void 0 === e && (e = {});
    var i = (e = e || {}).group,
      o = e.fieldName;
    return r.reduce(function (n, r) {
      if (i && r.groupName !== i) var e = !0;
      else
        o && !Un(r, o)
          ? (e = !0)
          : ((e = r.warns()), (e = ("warnings" === t) != !!e));
      return (
        e ||
          !r.hasFailures() ||
          (n[r.fieldName] = (n[r.fieldName] || []).concat(r.message || [])),
        n
      );
    }, n({}, o && (((u = {})[o] = []), u)));
  }
  function _n(n) {
    return Mn("errors", n);
  }
  function Gn(n) {
    return Mn("warnings", n);
  }
  function Mn(n, t) {
    return (n = jn(n, An(), { fieldName: t })), t ? n[t] : n;
  }
  function qn(n, t) {
    return (n = Kn("errors", n, t)), t ? n[t] : n;
  }
  function Bn(n, t) {
    return (n = Kn("warnings", n, t)), t ? n[t] : n;
  }
  function Kn(n, t, r) {
    return (
      t ||
        tn(
          "get" +
            n[0].toUpperCase() +
            n.slice(1) +
            "ByGroup requires a group name. Received `" +
            t +
            "` instead."
        ),
      jn(n, An(), { group: t, fieldName: r })
    );
  }
  function Hn(n, t, r) {
    return (
      (r = !n.hasFailures() || (r && !Un(n, r))) ||
        (r = ("warnings" === t) != !!(n = n.warns())),
      !r
    );
  }
  function Vn(n) {
    return zn("errors", n);
  }
  function Jn(n) {
    return zn("warnings", n);
  }
  function zn(n, t) {
    return An().some(function (r) {
      return Hn(r, n, t);
    });
  }
  function Yn(n, t) {
    return Zn("errors", n, t);
  }
  function Qn(n, t) {
    return Zn("warnings", n, t);
  }
  function Zn(n, t, r) {
    return An().some(function (e) {
      return t === e.groupName && Hn(e, n, r);
    });
  }
  var $n = Pn(20);
  function nt() {
    var n = An(),
      t = { stateRef: Fn() };
    return $n(
      [n],
      On.bind(t, function () {
        var n = Fn().suiteName()[0];
        return r(
          (function () {
            var n = {
              errorCount: 0,
              groups: {},
              testCount: 0,
              tests: {},
              warnCount: 0,
            };
            return (
              An().forEach(function (t) {
                var r = t.fieldName,
                  e = t.groupName;
                (n.tests[r] = Rn(n.tests, t)),
                  e &&
                    ((n.groups[e] = n.groups[e] || {}),
                    (n.groups[e][r] = Rn(n.groups[e], t)));
              }),
              (function (n) {
                for (var t in n.tests)
                  (n.errorCount += n.tests[t].errorCount),
                    (n.warnCount += n.tests[t].warnCount),
                    (n.testCount += n.tests[t].testCount);
                return n;
              })(n)
            );
          })(),
          {
            getErrors: On.bind(t, _n),
            getErrorsByGroup: On.bind(t, qn),
            getWarnings: On.bind(t, Gn),
            getWarningsByGroup: On.bind(t, Bn),
            hasErrors: On.bind(t, Vn),
            hasErrorsByGroup: On.bind(t, Yn),
            hasWarnings: On.bind(t, Jn),
            hasWarningsByGroup: On.bind(t, Qn),
            isValid: On.bind(t, function (n) {
              var t = nt(),
                r = An().reduce(function (n, t) {
                  return (
                    n[t.fieldName] || (t.isOmitted() && (n[t.fieldName] = !0)),
                    n
                  );
                }, {});
              return (
                (r = !!n && !!r[n])
                  ? (n = !0)
                  : t.hasErrors(n)
                  ? (n = !1)
                  : (n =
                      !(
                        j((r = An())) ||
                        (n && j(t.tests[n])) ||
                        (function (n) {
                          var t = Fn().optionalFields()[0];
                          return _(
                            In().filter(function (r) {
                              return !(n && !Un(r, n)) && !0 !== t[r.fieldName];
                            })
                          );
                        })(n)
                      ) &&
                      (function (n) {
                        var t = An(),
                          r = Fn().optionalFields()[0];
                        return t.every(function (t) {
                          return (
                            !(!n || Un(t, n)) ||
                            !0 === r[t.fieldName] ||
                            t.isTested() ||
                            t.isOmitted()
                          );
                        });
                      })(n)),
                n
              );
            }),
            suiteName: n,
          }
        );
      })
    );
  }
  var tt = Pn(20);
  function rt() {
    var n = An(),
      t = { stateRef: Fn() };
    return tt(
      [n],
      On.bind(t, function () {
        return r({}, nt(), { done: On.bind(t, it) });
      })
    );
  }
  function et(n, t, r) {
    return !(e(n) && (!t || (r.tests[t] && 0 !== r.tests[t].testCount)));
  }
  function ut(n) {
    return !(Xn() && (!n || Xn(n)));
  }
  function it() {
    function n() {
      return e(nt());
    }
    for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
    var e = (t = t.reverse())[0];
    return (
      (t = t[1]), (r = rt()), et(e, t, r) ? r : ut(t) ? (n(), r) : (ot(n, t), r)
    );
  }
  function ot(n, t) {
    var r = On.bind({}, n);
    (0, Fn().testCallbacks()[1])(function (n) {
      return (
        t
          ? (n.fieldCallbacks[t] = (n.fieldCallbacks[t] || []).concat(r))
          : n.doneCallbacks.push(r),
        n
      );
    });
  }
  function st(n) {
    return n.forEach(function (n) {
      return n();
    });
  }
  function at() {
    var n = (function () {
      var n = {};
      return {
        emit: function (t, r) {
          n[t] &&
            n[t].forEach(function (n) {
              n(r);
            });
        },
        on: function (t, r) {
          return (
            n[t] || (n[t] = []),
            n[t].push(r),
            {
              off: function () {
                n[t] = n[t].filter(function (n) {
                  return n !== r;
                });
              },
            }
          );
        },
      };
    })();
    return (
      n.on(ft.TEST_COMPLETED, function (n) {
        if (!n.isCanceled()) {
          n.done(), (n = n.fieldName);
          var t = Fn().testCallbacks()[0].fieldCallbacks;
          n && !Xn(n) && w(t[n]) && st(t[n]),
            (n = Fn().testCallbacks()[0].doneCallbacks),
            Xn() || st(n);
        }
      }),
      n.on(ft.SUITE_COMPLETED, function () {
        !(function () {
          var n = Fn().optionalFields()[0];
          if (!j(n)) {
            var t = {};
            kn(function (r) {
              return Tn(r, function (r) {
                var u = r.fieldName;
                if (t.hasOwnProperty(u)) t[r.fieldName] && r.omit();
                else {
                  var i = n[u];
                  e(i) && ((t[u] = i()), t[r.fieldName] && r.omit());
                }
                return r;
              });
            });
          }
        })();
      }),
      n.on(ft.REMOVE_FIELD, function (n) {
        An().forEach(function (t) {
          Un(t, n) &&
            (t.cancel(),
            (function (n) {
              kn(function (t) {
                return Tn(t, function (t) {
                  return n !== t ? t : null;
                });
              });
            })(t));
        });
      }),
      n
    );
  }
  function ct() {
    var n = On.useX();
    return n.bus || tn(), n.bus;
  }
  var ft,
    lt = ft || (ft = {});
  function vt(n) {
    return dt(0, "tests", n);
  }
  function dt(n, t, r) {
    var e = On.useX("hook called outside of a running suite.");
    r &&
      [].concat(r).forEach(function (r) {
        m(r) && (e.exclusion[t][r] = 0 === n);
      });
  }
  function gt(n) {
    for (var t in n) if (!0 === n[t]) return !0;
    return !1;
  }
  (lt.TEST_COMPLETED = "test_completed"),
    (lt.REMOVE_FIELD = "remove_field"),
    (lt.SUITE_COMPLETED = "suite_completed"),
    (vt.group = function (n) {
      return dt(0, "groups", n);
    });
  var mt,
    yt = mt || (mt = {});
  (yt.Error = "error"), (yt.Warning = "warning");
  var Nt = (function () {
      function n(n, t, r) {
        var e = void 0 === r ? {} : r;
        (r = e.message),
          (e = e.groupName),
          (this.id = hn()),
          (this.severity = mt.Error),
          (this.status = Et),
          (this.fieldName = n),
          (this.testFn = t),
          e && (this.groupName = e),
          r && (this.message = r);
      }
      return (
        (n.prototype.run = function () {
          try {
            var n = this.testFn();
          } catch (t) {
            (n = t), g(this.message) && m(n) && (this.message = t), (n = !1);
          }
          return !1 === n && this.fail(), n;
        }),
        (n.prototype.setStatus = function (n) {
          (this.isFinalStatus() && n !== Pt) || (this.status = n);
        }),
        (n.prototype.warns = function () {
          return this.severity === mt.Warning;
        }),
        (n.prototype.setPending = function () {
          this.setStatus(St);
        }),
        (n.prototype.fail = function () {
          this.setStatus(this.warns() ? Ot : Ct);
        }),
        (n.prototype.done = function () {
          this.isFinalStatus() || this.setStatus(Tt);
        }),
        (n.prototype.warn = function () {
          this.severity = mt.Warning;
        }),
        (n.prototype.isFinalStatus = function () {
          return this.hasFailures() || this.isCanceled() || this.isPassing();
        }),
        (n.prototype.skip = function () {
          this.isPending() || this.setStatus(bt);
        }),
        (n.prototype.cancel = function () {
          this.setStatus(wt), xn();
        }),
        (n.prototype.omit = function () {
          this.setStatus(Pt);
        }),
        (n.prototype.valueOf = function () {
          return !this.isFailing();
        }),
        (n.prototype.hasFailures = function () {
          return this.isFailing() || this.isWarning();
        }),
        (n.prototype.isPending = function () {
          return this.status === St;
        }),
        (n.prototype.isTested = function () {
          return this.hasFailures() || this.isPassing();
        }),
        (n.prototype.isOmitted = function () {
          return this.status === Pt;
        }),
        (n.prototype.isUntested = function () {
          return this.status === Et;
        }),
        (n.prototype.isFailing = function () {
          return this.status === Ct;
        }),
        (n.prototype.isCanceled = function () {
          return this.status === wt;
        }),
        (n.prototype.isSkipped = function () {
          return this.status === bt;
        }),
        (n.prototype.isPassing = function () {
          return this.status === Tt;
        }),
        (n.prototype.isWarning = function () {
          return this.status === Ot;
        }),
        n
      );
    })(),
    Et = "UNTESTED",
    bt = "SKIPPED",
    Ct = "FAILED",
    Ot = "WARNING",
    Tt = "PASSING",
    St = "PENDING",
    wt = "CANCELED",
    Pt = "OMITTED";
  function Ft(n) {
    var t = n.asyncTest,
      r = n.message;
    if (t && e(t.then)) {
      var u = ct().emit,
        i = Fn(),
        o = On.bind({ stateRef: i }, function () {
          xn(), u(ft.TEST_COMPLETED, n);
        });
      i = On.bind({ stateRef: i }, function (t) {
        n.isCanceled() || ((n.message = m(t) ? t : r), n.fail(), o());
      });
      try {
        t.then(o, i);
      } catch (n) {
        i();
      }
    }
  }
  function xt(n) {
    var t = Fn().testObjects(),
      r = t[1],
      e = t[0].prev;
    if (j(e)) return kt(n), n;
    if (
      (function (n, t) {
        return (
          _(n) && !(n.fieldName === t.fieldName && n.groupName === t.groupName)
        );
      })(
        (t = (function (n) {
          var t = Dn();
          return wn(n, t)[bn(t)];
        })(e)),
        n
      )
    ) {
      !(function (n, t) {
        On.useX().isolate.type !== yn.EACH &&
          (function (n, t) {
            setTimeout(function () {
              tn(n, t);
            }, 0);
          })(
            "Vest Critical Error: Tests called in different order than previous run.\n    expected: " +
              n.fieldName +
              "\n    received: " +
              t.fieldName +
              "\n    This happens when you conditionally call your tests using if/else.\n    This might lead to incorrect validation results.\n    Replacing if/else with skipWhen solves these issues."
          );
      })(t, n),
        (t = wn(e, Dn()));
      var u = On.useX().testCursor.cursorAt();
      t.splice(u),
        r(function (n) {
          return { prev: e, current: n.current };
        }),
        (t = null);
    }
    return kt((n = o(t, n))), n;
  }
  function kt(n) {
    var t = Dn();
    kn(function (r) {
      return (wn(r, t)[bn(t)] = n), r;
    });
  }
  function It(n) {
    var t = xt(n);
    if (
      (function (n) {
        var t = n.fieldName;
        n = n.groupName;
        var r = On.useX();
        if (r.skipped) return !0;
        var e = (r = r.exclusion).tests,
          u = e[t];
        if (!1 === u) return !0;
        if (((u = !0 === u), n)) {
          n: {
            var i = On.useX().exclusion.groups;
            if (Object.prototype.hasOwnProperty.call(i, n)) var o = !1 === i[n];
            else {
              for (o in i)
                if (!0 === i[o]) {
                  o = !0;
                  break n;
                }
              o = !1;
            }
          }
          if (o) return !0;
          if (!0 === r.groups[n]) return !(u || (!gt(e) && !1 !== e[t]));
        }
        return !u && gt(e);
      })(n)
    )
      return n.skip(), On.useX().testCursor.next(), t;
    if (
      (n !== t &&
        t.fieldName === n.fieldName &&
        t.groupName === n.groupName &&
        t.isPending() &&
        t.cancel(),
      kt(n),
      On.useX().testCursor.next(),
      n.isUntested())
    ) {
      t = ct();
      var r = (function (n) {
        return On.run({ currentTest: n }, function () {
          try {
            var t = n.testFn();
          } catch (r) {
            (t = r), g(n.message) && m(t) && (n.message = r), (t = !1);
          }
          return !1 === t && n.fail(), t;
        });
      })(n);
      try {
        r && e(r.then)
          ? ((n.asyncTest = r), n.setPending(), Ft(n))
          : t.emit(ft.TEST_COMPLETED, n);
      } catch (t) {
        tn(
          "Your test function " +
            n.fieldName +
            ' returned a value. Only "false" or Promise returns are supported.'
        );
      }
    } else (t = n.asyncTest) && e(t.then) && (n.setPending(), Ft(n));
    return n;
  }
  function Wt(n) {
    for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
    (r = t.reverse()), (t = r[0]), (r = r[1]);
    var e = On.useX();
    return It((t = new Nt(n, t, { message: r, groupName: e.groupName })));
  }
  var At = r(Wt, {
    each: (function (n) {
      return function (r) {
        return (
          w(r) || tn("test.each: Expected table to be an array."),
          function (e) {
            for (var u = [], o = 1; o < arguments.length; o++)
              u[o - 1] = arguments[o];
            var s = (u = u.reverse())[0],
              a = u[1];
            return Ln({ type: yn.EACH }, function () {
              return r.map(function (r) {
                return (
                  (r = [].concat(r)),
                  n(
                    i.apply(void 0, t([e], r)),
                    i.apply(void 0, t([a], r)),
                    function () {
                      return s.apply(void 0, r);
                    }
                  )
                );
              });
            });
          }
        );
      };
    })(Wt),
    memo: (function (n) {
      var t = Pn(100);
      return function (r) {
        for (var e = [], u = 1; u < arguments.length; u++)
          e[u - 1] = arguments[u];
        u = On.useX().testCursor.cursorAt();
        var i = (e = e.reverse())[0],
          o = e[1],
          s = e[2];
        return (
          (u = [Fn().suiteId()[0], r, u].concat(i)),
          null === (e = t.get(u))
            ? t(u, function () {
                return n(r, s, o);
              })
            : e[1].isCanceled()
            ? (t.invalidate(u),
              t(u, function () {
                return n(r, s, o);
              }))
            : It(e[1])
        );
      };
    })(Wt),
  });
  function Lt() {
    for (var n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
    var u = (n = n.reverse())[0];
    (n = n[1]), e(u) || tn("vest.create: Expected callback to be a function.");
    var i = at(),
      o = mn();
    return (
      (n = { stateRef: En(o, { suiteId: hn(), suiteName: n }), bus: i }),
      r(
        On.bind(n, function () {
          for (var n = [], t = 0; t < arguments.length; t++)
            n[t] = arguments[t];
          return (
            o.reset(),
            Ln({ type: yn.SUITE }, function () {
              u.apply(void 0, n);
            }),
            i.emit(ft.SUITE_COMPLETED),
            rt()
          );
        }),
        {
          get: On.bind(n, nt),
          reset: o.reset,
          remove: On.bind(n, function (n) {
            i.emit(ft.REMOVE_FIELD, n);
          }),
        }
      )
    );
  }

  const validate = Lt("Settings Form", (data = {}, field = undefined) => {
    vt(field);
    At("gbMinTarget", "Min can't exceed max", () => {
      gn(data.gbMinTarget).lt(data.gbMaxTarget);
    });
    At("gbMaxTarget", "Min can't exceed max", () => {
      gn(data.gbMinTarget).lt(data.gbMaxTarget);
    });
    At("targetSpeed", "Not between min&max", () => {
      gn(data.targetSpeed).gt(data.speedMin);
      gn(data.targetSpeed).lt(data.speedMax);
    });
    At("speedMin", "Min can't exceed target", () => {
      gn(data.speedMin).lt(data.targetSpeed);
    });
    At("speedMin", "Min can't exceed max", () => {
      gn(data.speedMin).lt(data.speedMax);
    });
    At("speedMax", "Target can't exceed max", () => {
      gn(data.speedMax).gt(data.targetSpeed);
    });
    At("speedMax", "Min can't exceed max", () => {
      gn(data.speedMax).gt(data.targetSpeed);
    });
    At("rpdMin", "Min can't exceed max", () => {
      gn(data.rpdMin).lt(data.rpdMax);
    });
    At("rpdMax", "Min can't exceed max", () => {
      gn(data.rpdMin).lt(data.rpdMax);
    });
  });

  /* src/components/Errors.svelte generated by Svelte v3.44.2 */

  const file$b = "src/components/Errors.svelte";

  // (8:0) {#if message }
  function create_if_block$3(ctx) {
    let span;
    let t;

    const block = {
      c: function create() {
        span = element("span");
        t = text(/*message*/ ctx[0]);
        attr_dev(span, "class", "errors svelte-szr21l");
        add_location(span, file$b, 8, 2, 181);
      },
      m: function mount(target, anchor) {
        insert_dev(target, span, anchor);
        append_dev(span, t);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(span);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$3.name,
      type: "if",
      source: "(8:0) {#if message }",
      ctx,
    });

    return block;
  }

  function create_fragment$b(ctx) {
    let if_block_anchor;
    let if_block = /*message*/ ctx[0] && create_if_block$3(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
      },
      p: function update(ctx, [dirty]) {
        if (/*message*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$3(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$b.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$b($$self, $$props, $$invalidate) {
    let message;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Errors", slots, []);
    let { errors = {} } = $$props;
    let { path = undefined } = $$props;
    const writable_props = ["errors", "path"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Errors> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("path" in $$props) $$invalidate(2, (path = $$props.path));
    };

    $$self.$capture_state = () => ({ errors, path, message });

    $$self.$inject_state = ($$props) => {
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("path" in $$props) $$invalidate(2, (path = $$props.path));
      if ("message" in $$props) $$invalidate(0, (message = $$props.message));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*errors, path*/ 6) {
        $$invalidate(
          0,
          (message =
            errors[path] && errors[path].length ? errors[path][0] : undefined)
        );
      }
    };

    return [message, errors, path];
  }

  class Errors extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        errors: 1,
        path: 2,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Errors",
        options,
        id: create_fragment$b.name,
      });
    }

    get errors() {
      throw new Error(
        "<Errors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set errors(value) {
      throw new Error(
        "<Errors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get path() {
      throw new Error(
        "<Errors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set path(value) {
      throw new Error(
        "<Errors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/GanbarometerSettings.svelte generated by Svelte v3.44.2 */
  const file$a = "src/components/GanbarometerSettings.svelte";

  function create_fragment$a(ctx) {
    let div;
    let h40;
    let t1;
    let input0;
    let t2;
    let label0;
    let t3_value = /*values*/ ctx[0].gbMinTarget + "";
    let t3;
    let t4;
    let errors0;
    let t5;
    let h41;
    let t7;
    let input1;
    let t8;
    let label1;
    let t9_value = /*values*/ ctx[0].gbMaxTarget + "";
    let t9;
    let t10;
    let errors1;
    let t11;
    let hr0;
    let t12;
    let table0;
    let tbody0;
    let tr0;
    let th0;
    let t14;
    let td0;
    let input2;
    let t15;
    let td1;
    let input3;
    let t16;
    let td2;
    let input4;
    let t17;
    let thead0;
    let tr1;
    let td3;
    let t18;
    let th1;
    let t20;
    let th2;
    let t22;
    let th3;
    let t24;
    let hr1;
    let t25;
    let table1;
    let thead1;
    let tr2;
    let th4;
    let t26;
    let th5;
    let t28;
    let th6;
    let t29;
    let th7;
    let t31;
    let tbody1;
    let tr3;
    let th8;
    let t33;
    let td4;
    let input5;
    let t34;
    let th9;
    let t36;
    let td5;
    let input6;
    let t37;
    let tr4;
    let th10;
    let t39;
    let td6;
    let input7;
    let t40;
    let th11;
    let t42;
    let td7;
    let input8;
    let t43;
    let tr5;
    let th12;
    let t45;
    let td8;
    let input9;
    let t46;
    let th13;
    let t48;
    let td9;
    let input10;
    let t49;
    let tr6;
    let td10;
    let t50;
    let td11;
    let t51;
    let th14;
    let t53;
    let td12;
    let input11;
    let t54;
    let hr2;
    let t55;
    let table2;
    let thead2;
    let tr7;
    let td13;
    let t56;
    let th15;
    let t58;
    let th16;
    let t60;
    let th17;
    let t62;
    let tbody2;
    let tr8;
    let th18;
    let t64;
    let td14;
    let input12;
    let t65;
    let td15;
    let input13;
    let t66;
    let td16;
    let input14;
    let current;
    let mounted;
    let dispose;

    errors0 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "gbMinTarget",
      },
      $$inline: true,
    });

    errors1 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "gbMaxTarget",
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        h40 = element("h4");
        h40.textContent = "Target minimum";
        t1 = space();
        input0 = element("input");
        t2 = space();
        label0 = element("label");
        t3 = text(t3_value);
        t4 = space();
        create_component(errors0.$$.fragment);
        t5 = space();
        h41 = element("h4");
        h41.textContent = "Target maximum";
        t7 = space();
        input1 = element("input");
        t8 = space();
        label1 = element("label");
        t9 = text(t9_value);
        t10 = space();
        create_component(errors1.$$.fragment);
        t11 = space();
        hr0 = element("hr");
        t12 = space();
        table0 = element("table");
        tbody0 = element("tbody");
        tr0 = element("tr");
        th0 = element("th");
        th0.textContent = "Labels";
        t14 = space();
        td0 = element("td");
        input2 = element("input");
        t15 = space();
        td1 = element("td");
        input3 = element("input");
        t16 = space();
        td2 = element("td");
        input4 = element("input");
        t17 = space();
        thead0 = element("thead");
        tr1 = element("tr");
        td3 = element("td");
        t18 = space();
        th1 = element("th");
        th1.textContent = "Below";
        t20 = space();
        th2 = element("th");
        th2.textContent = "In range";
        t22 = space();
        th3 = element("th");
        th3.textContent = "Above";
        t24 = space();
        hr1 = element("hr");
        t25 = space();
        table1 = element("table");
        thead1 = element("thead");
        tr2 = element("tr");
        th4 = element("th");
        t26 = space();
        th5 = element("th");
        th5.textContent = "Weight";
        t28 = space();
        th6 = element("th");
        t29 = space();
        th7 = element("th");
        th7.textContent = "Weight";
        t31 = space();
        tbody1 = element("tbody");
        tr3 = element("tr");
        th8 = element("th");
        th8.textContent = "Radicals12";
        t33 = space();
        td4 = element("td");
        input5 = element("input");
        t34 = space();
        th9 = element("th");
        th9.textContent = "Appr34";
        t36 = space();
        td5 = element("td");
        input6 = element("input");
        t37 = space();
        tr4 = element("tr");
        th10 = element("th");
        th10.textContent = "Kanji12";
        t39 = space();
        td6 = element("td");
        input7 = element("input");
        t40 = space();
        th11 = element("th");
        th11.textContent = "Guru";
        t42 = space();
        td7 = element("td");
        input8 = element("input");
        t43 = space();
        tr5 = element("tr");
        th12 = element("th");
        th12.textContent = "Vocabulary12";
        t45 = space();
        td8 = element("td");
        input9 = element("input");
        t46 = space();
        th13 = element("th");
        th13.textContent = "Master";
        t48 = space();
        td9 = element("td");
        input10 = element("input");
        t49 = space();
        tr6 = element("tr");
        td10 = element("td");
        t50 = space();
        td11 = element("td");
        t51 = space();
        th14 = element("th");
        th14.textContent = "Enlightened";
        t53 = space();
        td12 = element("td");
        input11 = element("input");
        t54 = space();
        hr2 = element("hr");
        t55 = space();
        table2 = element("table");
        thead2 = element("thead");
        tr7 = element("tr");
        td13 = element("td");
        t56 = space();
        th15 = element("th");
        th15.textContent = "Radicals12";
        t58 = space();
        th16 = element("th");
        th16.textContent = "Kanji12";
        t60 = space();
        th17 = element("th");
        th17.textContent = "Vocabulary12";
        t62 = space();
        tbody2 = element("tbody");
        tr8 = element("tr");
        th18 = element("th");
        th18.textContent = "Quiz?";
        t64 = space();
        td14 = element("td");
        input12 = element("input");
        t65 = space();
        td15 = element("td");
        input13 = element("input");
        t66 = space();
        td16 = element("td");
        input14 = element("input");
        attr_dev(h40, "class", "svelte-mmoi2z");
        add_location(h40, file$a, 16, 2, 323);
        attr_dev(input0, "id", "targetMin");
        attr_dev(input0, "type", "range");
        attr_dev(input0, "min", 10);
        attr_dev(input0, "max", 300);
        attr_dev(input0, "step", 10);
        attr_dev(input0, "class", "svelte-mmoi2z");
        add_location(input0, file$a, 17, 2, 349);
        attr_dev(label0, "for", "targetMin");
        attr_dev(label0, "class", "svelte-mmoi2z");
        add_location(label0, file$a, 25, 2, 519);
        attr_dev(h41, "class", "svelte-mmoi2z");
        add_location(h41, file$a, 28, 2, 615);
        attr_dev(input1, "id", "targetMax");
        attr_dev(input1, "type", "range");
        attr_dev(input1, "min", 10);
        attr_dev(input1, "max", 300);
        attr_dev(input1, "step", 10);
        attr_dev(input1, "class", "svelte-mmoi2z");
        add_location(input1, file$a, 29, 2, 641);
        attr_dev(label1, "for", "targetMax");
        attr_dev(label1, "class", "svelte-mmoi2z");
        add_location(label1, file$a, 37, 2, 811);
        attr_dev(hr0, "class", "svelte-mmoi2z");
        add_location(hr0, file$a, 40, 2, 907);
        attr_dev(th0, "class", "col2 svelte-mmoi2z");
        add_location(th0, file$a, 45, 8, 954);
        attr_dev(input2, "type", "text");
        attr_dev(input2, "class", "svelte-mmoi2z");
        add_location(input2, file$a, 46, 12, 995);
        attr_dev(td0, "class", "svelte-mmoi2z");
        add_location(td0, file$a, 46, 8, 991);
        attr_dev(input3, "type", "text");
        attr_dev(input3, "class", "svelte-mmoi2z");
        add_location(input3, file$a, 50, 12, 1093);
        attr_dev(td1, "class", "svelte-mmoi2z");
        add_location(td1, file$a, 50, 8, 1089);
        attr_dev(input4, "type", "text");
        attr_dev(input4, "class", "svelte-mmoi2z");
        add_location(input4, file$a, 54, 12, 1193);
        attr_dev(td2, "class", "svelte-mmoi2z");
        add_location(td2, file$a, 54, 8, 1189);
        attr_dev(tr0, "class", "svelte-mmoi2z");
        add_location(tr0, file$a, 44, 6, 941);
        attr_dev(tbody0, "class", "svelte-mmoi2z");
        add_location(tbody0, file$a, 43, 4, 927);
        attr_dev(td3, "class", "svelte-mmoi2z");
        add_location(td3, file$a, 62, 8, 1335);
        attr_dev(th1, "class", "secondary center col3 svelte-mmoi2z");
        add_location(th1, file$a, 63, 8, 1353);
        attr_dev(th2, "class", "secondary center svelte-mmoi2z");
        add_location(th2, file$a, 64, 8, 1406);
        attr_dev(th3, "class", "secondary center svelte-mmoi2z");
        add_location(th3, file$a, 65, 8, 1457);
        attr_dev(tr1, "class", "svelte-mmoi2z");
        add_location(tr1, file$a, 61, 6, 1322);
        attr_dev(thead0, "class", "svelte-mmoi2z");
        add_location(thead0, file$a, 60, 4, 1308);
        attr_dev(table0, "class", "svelte-mmoi2z");
        add_location(table0, file$a, 42, 2, 915);
        attr_dev(hr1, "class", "svelte-mmoi2z");
        add_location(hr1, file$a, 70, 2, 1536);
        add_location(th4, file$a, 75, 8, 1583);
        attr_dev(th5, "class", "col3 svelte-mmoi2z");
        add_location(th5, file$a, 76, 8, 1601);
        add_location(th6, file$a, 77, 8, 1638);
        attr_dev(th7, "class", "col5 svelte-mmoi2z");
        add_location(th7, file$a, 78, 8, 1656);
        attr_dev(tr2, "class", "svelte-mmoi2z");
        add_location(tr2, file$a, 74, 6, 1570);
        attr_dev(thead1, "class", "svelte-mmoi2z");
        add_location(thead1, file$a, 73, 4, 1556);
        attr_dev(th8, "class", "secondary right-align col2 svelte-mmoi2z");
        add_location(th8, file$a, 83, 8, 1741);
        attr_dev(input5, "class", "col3 svelte-mmoi2z");
        attr_dev(input5, "type", "number");
        attr_dev(input5, "min", 0);
        attr_dev(input5, "max", 5);
        attr_dev(input5, "step", 0.1);
        add_location(input5, file$a, 84, 12, 1808);
        attr_dev(td4, "class", "svelte-mmoi2z");
        add_location(td4, file$a, 84, 8, 1804);
        attr_dev(th9, "class", "secondary right-align col4 svelte-mmoi2z");
        add_location(th9, file$a, 92, 8, 1984);
        attr_dev(input6, "class", "col5 svelte-mmoi2z");
        attr_dev(input6, "type", "number");
        attr_dev(input6, "min", 0);
        attr_dev(input6, "max", 5);
        attr_dev(input6, "step", 0.1);
        add_location(input6, file$a, 93, 12, 2047);
        attr_dev(td5, "class", "svelte-mmoi2z");
        add_location(td5, file$a, 93, 8, 2043);
        attr_dev(tr3, "class", "svelte-mmoi2z");
        add_location(tr3, file$a, 82, 6, 1728);
        attr_dev(th10, "class", "secondary right-align col2 svelte-mmoi2z");
        add_location(th10, file$a, 103, 8, 2246);
        attr_dev(input7, "class", "col3 svelte-mmoi2z");
        attr_dev(input7, "type", "number");
        attr_dev(input7, "min", 0);
        attr_dev(input7, "max", 5);
        attr_dev(input7, "step", 0.1);
        add_location(input7, file$a, 104, 12, 2310);
        attr_dev(td6, "class", "svelte-mmoi2z");
        add_location(td6, file$a, 104, 8, 2306);
        attr_dev(th11, "class", "secondary right-align col4 svelte-mmoi2z");
        add_location(th11, file$a, 112, 8, 2486);
        attr_dev(input8, "class", "col5 svelte-mmoi2z");
        attr_dev(input8, "type", "number");
        attr_dev(input8, "min", 0);
        attr_dev(input8, "max", 5);
        attr_dev(input8, "step", 0.1);
        add_location(input8, file$a, 113, 12, 2547);
        attr_dev(td7, "class", "svelte-mmoi2z");
        add_location(td7, file$a, 113, 8, 2543);
        attr_dev(tr4, "class", "svelte-mmoi2z");
        add_location(tr4, file$a, 102, 6, 2233);
        attr_dev(th12, "class", "secondary right-align col2 svelte-mmoi2z");
        add_location(th12, file$a, 123, 8, 2746);
        attr_dev(input9, "class", "col3 svelte-mmoi2z");
        attr_dev(input9, "type", "number");
        attr_dev(input9, "min", 0);
        attr_dev(input9, "max", 5);
        attr_dev(input9, "step", 0.1);
        add_location(input9, file$a, 124, 12, 2815);
        attr_dev(td8, "class", "svelte-mmoi2z");
        add_location(td8, file$a, 124, 8, 2811);
        attr_dev(th13, "class", "secondary right-align col4 svelte-mmoi2z");
        add_location(th13, file$a, 132, 8, 2991);
        attr_dev(input10, "class", "col4 svelte-mmoi2z");
        attr_dev(input10, "type", "number");
        attr_dev(input10, "min", 0);
        attr_dev(input10, "max", 5);
        attr_dev(input10, "step", 0.1);
        add_location(input10, file$a, 133, 12, 3054);
        attr_dev(td9, "class", "svelte-mmoi2z");
        add_location(td9, file$a, 133, 8, 3050);
        attr_dev(tr5, "class", "svelte-mmoi2z");
        add_location(tr5, file$a, 122, 6, 2733);
        attr_dev(td10, "class", "svelte-mmoi2z");
        add_location(td10, file$a, 143, 8, 3255);
        attr_dev(td11, "class", "svelte-mmoi2z");
        add_location(td11, file$a, 144, 8, 3273);
        attr_dev(th14, "class", "secondary right-align col4 svelte-mmoi2z");
        add_location(th14, file$a, 145, 8, 3291);
        attr_dev(input11, "class", "col5 svelte-mmoi2z");
        attr_dev(input11, "type", "number");
        attr_dev(input11, "min", 0);
        attr_dev(input11, "max", 5);
        attr_dev(input11, "step", 0.1);
        add_location(input11, file$a, 146, 12, 3359);
        attr_dev(td12, "class", "svelte-mmoi2z");
        add_location(td12, file$a, 146, 8, 3355);
        attr_dev(tr6, "class", "svelte-mmoi2z");
        add_location(tr6, file$a, 142, 6, 3242);
        attr_dev(tbody1, "class", "svelte-mmoi2z");
        add_location(tbody1, file$a, 81, 4, 1714);
        attr_dev(table1, "class", "svelte-mmoi2z");
        add_location(table1, file$a, 72, 2, 1544);
        attr_dev(hr2, "class", "svelte-mmoi2z");
        add_location(hr2, file$a, 158, 2, 3573);
        attr_dev(td13, "class", "svelte-mmoi2z");
        add_location(td13, file$a, 163, 8, 3620);
        attr_dev(th15, "class", "secondary center col3 svelte-mmoi2z");
        add_location(th15, file$a, 164, 8, 3638);
        attr_dev(th16, "class", "secondary center svelte-mmoi2z");
        add_location(th16, file$a, 165, 8, 3696);
        attr_dev(th17, "class", "secondary center svelte-mmoi2z");
        add_location(th17, file$a, 166, 8, 3746);
        attr_dev(tr7, "class", "svelte-mmoi2z");
        add_location(tr7, file$a, 162, 6, 3607);
        attr_dev(thead2, "class", "svelte-mmoi2z");
        add_location(thead2, file$a, 161, 4, 3593);
        attr_dev(th18, "class", "col2 svelte-mmoi2z");
        add_location(th18, file$a, 171, 8, 3849);
        attr_dev(input12, "type", "checkbox");
        attr_dev(input12, "name", "quizTypes");
        add_location(input12, file$a, 172, 12, 3889);
        attr_dev(td14, "class", "svelte-mmoi2z");
        add_location(td14, file$a, 172, 8, 3885);
        attr_dev(input13, "type", "checkbox");
        attr_dev(input13, "name", "quizTypes");
        add_location(input13, file$a, 177, 12, 4016);
        attr_dev(td15, "class", "svelte-mmoi2z");
        add_location(td15, file$a, 177, 8, 4012);
        attr_dev(input14, "type", "checkbox");
        attr_dev(input14, "name", "quizTypes");
        add_location(input14, file$a, 182, 12, 4143);
        attr_dev(td16, "class", "svelte-mmoi2z");
        add_location(td16, file$a, 182, 8, 4139);
        attr_dev(tr8, "class", "svelte-mmoi2z");
        add_location(tr8, file$a, 170, 6, 3836);
        attr_dev(tbody2, "class", "svelte-mmoi2z");
        add_location(tbody2, file$a, 169, 4, 3822);
        attr_dev(table2, "class", "svelte-mmoi2z");
        add_location(table2, file$a, 160, 2, 3581);
        attr_dev(div, "class", "settingsComp");
        add_location(div, file$a, 15, 0, 294);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h40);
        append_dev(div, t1);
        append_dev(div, input0);
        set_input_value(input0, /*values*/ ctx[0].gbMinTarget);
        append_dev(div, t2);
        append_dev(div, label0);
        append_dev(label0, t3);
        append_dev(div, t4);
        mount_component(errors0, div, null);
        append_dev(div, t5);
        append_dev(div, h41);
        append_dev(div, t7);
        append_dev(div, input1);
        set_input_value(input1, /*values*/ ctx[0].gbMaxTarget);
        append_dev(div, t8);
        append_dev(div, label1);
        append_dev(label1, t9);
        append_dev(div, t10);
        mount_component(errors1, div, null);
        append_dev(div, t11);
        append_dev(div, hr0);
        append_dev(div, t12);
        append_dev(div, table0);
        append_dev(table0, tbody0);
        append_dev(tbody0, tr0);
        append_dev(tr0, th0);
        append_dev(tr0, t14);
        append_dev(tr0, td0);
        append_dev(td0, input2);
        set_input_value(input2, /*values*/ ctx[0].belowTerm);
        append_dev(tr0, t15);
        append_dev(tr0, td1);
        append_dev(td1, input3);
        set_input_value(input3, /*values*/ ctx[0].inRangeTerm);
        append_dev(tr0, t16);
        append_dev(tr0, td2);
        append_dev(td2, input4);
        set_input_value(input4, /*values*/ ctx[0].aboveTerm);
        append_dev(table0, t17);
        append_dev(table0, thead0);
        append_dev(thead0, tr1);
        append_dev(tr1, td3);
        append_dev(tr1, t18);
        append_dev(tr1, th1);
        append_dev(tr1, t20);
        append_dev(tr1, th2);
        append_dev(tr1, t22);
        append_dev(tr1, th3);
        append_dev(div, t24);
        append_dev(div, hr1);
        append_dev(div, t25);
        append_dev(div, table1);
        append_dev(table1, thead1);
        append_dev(thead1, tr2);
        append_dev(tr2, th4);
        append_dev(tr2, t26);
        append_dev(tr2, th5);
        append_dev(tr2, t28);
        append_dev(tr2, th6);
        append_dev(tr2, t29);
        append_dev(tr2, th7);
        append_dev(table1, t31);
        append_dev(table1, tbody1);
        append_dev(tbody1, tr3);
        append_dev(tr3, th8);
        append_dev(tr3, t33);
        append_dev(tr3, td4);
        append_dev(td4, input5);
        set_input_value(input5, /*values*/ ctx[0].newRWeight);
        append_dev(tr3, t34);
        append_dev(tr3, th9);
        append_dev(tr3, t36);
        append_dev(tr3, td5);
        append_dev(td5, input6);
        set_input_value(input6, /*values*/ ctx[0].apprWeight);
        append_dev(tbody1, t37);
        append_dev(tbody1, tr4);
        append_dev(tr4, th10);
        append_dev(tr4, t39);
        append_dev(tr4, td6);
        append_dev(td6, input7);
        set_input_value(input7, /*values*/ ctx[0].newKWeight);
        append_dev(tr4, t40);
        append_dev(tr4, th11);
        append_dev(tr4, t42);
        append_dev(tr4, td7);
        append_dev(td7, input8);
        set_input_value(input8, /*values*/ ctx[0].guruWeight);
        append_dev(tbody1, t43);
        append_dev(tbody1, tr5);
        append_dev(tr5, th12);
        append_dev(tr5, t45);
        append_dev(tr5, td8);
        append_dev(td8, input9);
        set_input_value(input9, /*values*/ ctx[0].newVWeight);
        append_dev(tr5, t46);
        append_dev(tr5, th13);
        append_dev(tr5, t48);
        append_dev(tr5, td9);
        append_dev(td9, input10);
        set_input_value(input10, /*values*/ ctx[0].masterWeight);
        append_dev(tbody1, t49);
        append_dev(tbody1, tr6);
        append_dev(tr6, td10);
        append_dev(tr6, t50);
        append_dev(tr6, td11);
        append_dev(tr6, t51);
        append_dev(tr6, th14);
        append_dev(tr6, t53);
        append_dev(tr6, td12);
        append_dev(td12, input11);
        set_input_value(input11, /*values*/ ctx[0].enlightenedWeight);
        append_dev(div, t54);
        append_dev(div, hr2);
        append_dev(div, t55);
        append_dev(div, table2);
        append_dev(table2, thead2);
        append_dev(thead2, tr7);
        append_dev(tr7, td13);
        append_dev(tr7, t56);
        append_dev(tr7, th15);
        append_dev(tr7, t58);
        append_dev(tr7, th16);
        append_dev(tr7, t60);
        append_dev(tr7, th17);
        append_dev(table2, t62);
        append_dev(table2, tbody2);
        append_dev(tbody2, tr8);
        append_dev(tr8, th18);
        append_dev(tr8, t64);
        append_dev(tr8, td14);
        append_dev(td14, input12);
        input12.checked = /*values*/ ctx[0].rQuiz;
        append_dev(tr8, t65);
        append_dev(tr8, td15);
        append_dev(td15, input13);
        input13.checked = /*values*/ ctx[0].kQuiz;
        append_dev(tr8, t66);
        append_dev(tr8, td16);
        append_dev(td16, input14);
        input14.checked = /*values*/ ctx[0].vQuiz;
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              input0,
              "change",
              /*input0_change_input_handler*/ ctx[4]
            ),
            listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[4]),
            listen_dev(
              input0,
              "change",
              /*validateField*/ ctx[2]("gbMinTarget"),
              false,
              false,
              false
            ),
            listen_dev(
              input1,
              "change",
              /*input1_change_input_handler*/ ctx[5]
            ),
            listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[5]),
            listen_dev(
              input1,
              "change",
              /*validateField*/ ctx[2]("gbMaxTarget"),
              false,
              false,
              false
            ),
            listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
            listen_dev(input3, "input", /*input3_input_handler*/ ctx[7]),
            listen_dev(input4, "input", /*input4_input_handler*/ ctx[8]),
            listen_dev(input5, "input", /*input5_input_handler*/ ctx[9]),
            listen_dev(input6, "input", /*input6_input_handler*/ ctx[10]),
            listen_dev(input7, "input", /*input7_input_handler*/ ctx[11]),
            listen_dev(input8, "input", /*input8_input_handler*/ ctx[12]),
            listen_dev(input9, "input", /*input9_input_handler*/ ctx[13]),
            listen_dev(input10, "input", /*input10_input_handler*/ ctx[14]),
            listen_dev(input11, "input", /*input11_input_handler*/ ctx[15]),
            listen_dev(input12, "change", /*input12_change_handler*/ ctx[16]),
            listen_dev(input13, "change", /*input13_change_handler*/ ctx[17]),
            listen_dev(input14, "change", /*input14_change_handler*/ ctx[18]),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*values*/ 1) {
          set_input_value(input0, /*values*/ ctx[0].gbMinTarget);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t3_value !== (t3_value = /*values*/ ctx[0].gbMinTarget + "")
        )
          set_data_dev(t3, t3_value);
        const errors0_changes = {};
        if (dirty & /*errors*/ 2) errors0_changes.errors = /*errors*/ ctx[1];
        errors0.$set(errors0_changes);

        if (dirty & /*values*/ 1) {
          set_input_value(input1, /*values*/ ctx[0].gbMaxTarget);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t9_value !== (t9_value = /*values*/ ctx[0].gbMaxTarget + "")
        )
          set_data_dev(t9, t9_value);
        const errors1_changes = {};
        if (dirty & /*errors*/ 2) errors1_changes.errors = /*errors*/ ctx[1];
        errors1.$set(errors1_changes);

        if (
          dirty & /*values*/ 1 &&
          input2.value !== /*values*/ ctx[0].belowTerm
        ) {
          set_input_value(input2, /*values*/ ctx[0].belowTerm);
        }

        if (
          dirty & /*values*/ 1 &&
          input3.value !== /*values*/ ctx[0].inRangeTerm
        ) {
          set_input_value(input3, /*values*/ ctx[0].inRangeTerm);
        }

        if (
          dirty & /*values*/ 1 &&
          input4.value !== /*values*/ ctx[0].aboveTerm
        ) {
          set_input_value(input4, /*values*/ ctx[0].aboveTerm);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input5.value) !== /*values*/ ctx[0].newRWeight
        ) {
          set_input_value(input5, /*values*/ ctx[0].newRWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input6.value) !== /*values*/ ctx[0].apprWeight
        ) {
          set_input_value(input6, /*values*/ ctx[0].apprWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input7.value) !== /*values*/ ctx[0].newKWeight
        ) {
          set_input_value(input7, /*values*/ ctx[0].newKWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input8.value) !== /*values*/ ctx[0].guruWeight
        ) {
          set_input_value(input8, /*values*/ ctx[0].guruWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input9.value) !== /*values*/ ctx[0].newVWeight
        ) {
          set_input_value(input9, /*values*/ ctx[0].newVWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input10.value) !== /*values*/ ctx[0].masterWeight
        ) {
          set_input_value(input10, /*values*/ ctx[0].masterWeight);
        }

        if (
          dirty & /*values*/ 1 &&
          to_number(input11.value) !== /*values*/ ctx[0].enlightenedWeight
        ) {
          set_input_value(input11, /*values*/ ctx[0].enlightenedWeight);
        }

        if (dirty & /*values*/ 1) {
          input12.checked = /*values*/ ctx[0].rQuiz;
        }

        if (dirty & /*values*/ 1) {
          input13.checked = /*values*/ ctx[0].kQuiz;
        }

        if (dirty & /*values*/ 1) {
          input14.checked = /*values*/ ctx[0].vQuiz;
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(errors0.$$.fragment, local);
        transition_in(errors1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(errors0.$$.fragment, local);
        transition_out(errors1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(errors0);
        destroy_component(errors1);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$a.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$a($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("GanbarometerSettings", slots, []);
    let { values } = $$props;
    let { errors } = $$props;
    let { result } = $$props;

    const validateField = (path) => () => {
      $$invalidate(3, (result = validate(values, path)));
      $$invalidate(1, (errors = result.getErrors()));
    };

    const writable_props = ["values", "errors", "result"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<GanbarometerSettings> was created with unknown prop '${key}'`
        );
    });

    function input0_change_input_handler() {
      values.gbMinTarget = to_number(this.value);
      $$invalidate(0, values);
    }

    function input1_change_input_handler() {
      values.gbMaxTarget = to_number(this.value);
      $$invalidate(0, values);
    }

    function input2_input_handler() {
      values.belowTerm = this.value;
      $$invalidate(0, values);
    }

    function input3_input_handler() {
      values.inRangeTerm = this.value;
      $$invalidate(0, values);
    }

    function input4_input_handler() {
      values.aboveTerm = this.value;
      $$invalidate(0, values);
    }

    function input5_input_handler() {
      values.newRWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input6_input_handler() {
      values.apprWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input7_input_handler() {
      values.newKWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input8_input_handler() {
      values.guruWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input9_input_handler() {
      values.newVWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input10_input_handler() {
      values.masterWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input11_input_handler() {
      values.enlightenedWeight = to_number(this.value);
      $$invalidate(0, values);
    }

    function input12_change_handler() {
      values.rQuiz = this.checked;
      $$invalidate(0, values);
    }

    function input13_change_handler() {
      values.kQuiz = this.checked;
      $$invalidate(0, values);
    }

    function input14_change_handler() {
      values.vQuiz = this.checked;
      $$invalidate(0, values);
    }

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    $$self.$capture_state = () => ({
      validate,
      Errors,
      values,
      errors,
      result,
      validateField,
    });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      values,
      errors,
      validateField,
      result,
      input0_change_input_handler,
      input1_change_input_handler,
      input2_input_handler,
      input3_input_handler,
      input4_input_handler,
      input5_input_handler,
      input6_input_handler,
      input7_input_handler,
      input8_input_handler,
      input9_input_handler,
      input10_input_handler,
      input11_input_handler,
      input12_change_handler,
      input13_change_handler,
      input14_change_handler,
    ];
  }

  class GanbarometerSettings extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$a, create_fragment$a, safe_not_equal, {
        values: 0,
        errors: 1,
        result: 3,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "GanbarometerSettings",
        options,
        id: create_fragment$a.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn(
          "<GanbarometerSettings> was created without expected prop 'values'"
        );
      }

      if (/*errors*/ ctx[1] === undefined && !("errors" in props)) {
        console.warn(
          "<GanbarometerSettings> was created without expected prop 'errors'"
        );
      }

      if (/*result*/ ctx[3] === undefined && !("result" in props)) {
        console.warn(
          "<GanbarometerSettings> was created without expected prop 'result'"
        );
      }
    }

    get values() {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get errors() {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set errors(value) {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get result() {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set result(value) {
      throw new Error(
        "<GanbarometerSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/SpeedSettings.svelte generated by Svelte v3.44.2 */
  const file$9 = "src/components/SpeedSettings.svelte";

  function create_fragment$9(ctx) {
    let div;
    let h40;
    let t1;
    let input0;
    let t2;
    let label0;
    let t3_value = /*values*/ ctx[0].targetSpeed + "";
    let t3;
    let t4;
    let t5;
    let errors0;
    let t6;
    let hr;
    let t7;
    let h41;
    let t9;
    let input1;
    let t10;
    let label1;
    let t11;
    let t12_value = /*values*/ ctx[0].speedMin + "";
    let t12;
    let t13;
    let t14;
    let errors1;
    let t15;
    let input2;
    let t16;
    let label2;
    let t17;
    let t18_value = /*values*/ ctx[0].speedMax + "";
    let t18;
    let t19;
    let t20;
    let errors2;
    let current;
    let mounted;
    let dispose;

    errors0 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "targetSpeed",
      },
      $$inline: true,
    });

    errors1 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "speedMin",
      },
      $$inline: true,
    });

    errors2 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "speedMax",
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        h40 = element("h4");
        h40.textContent = "Speed Target";
        t1 = space();
        input0 = element("input");
        t2 = space();
        label0 = element("label");
        t3 = text(t3_value);
        t4 = text(" seconds");
        t5 = space();
        create_component(errors0.$$.fragment);
        t6 = space();
        hr = element("hr");
        t7 = space();
        h41 = element("h4");
        h41.textContent = "Warnings";
        t9 = space();
        input1 = element("input");
        t10 = space();
        label1 = element("label");
        t11 = text("below ");
        t12 = text(t12_value);
        t13 = text(" seconds");
        t14 = space();
        create_component(errors1.$$.fragment);
        t15 = space();
        input2 = element("input");
        t16 = space();
        label2 = element("label");
        t17 = text("above ");
        t18 = text(t18_value);
        t19 = text(" seconds");
        t20 = space();
        create_component(errors2.$$.fragment);
        attr_dev(h40, "class", "svelte-62sb6n");
        add_location(h40, file$9, 17, 2, 324);
        attr_dev(input0, "id", "speedTarget");
        attr_dev(input0, "type", "range");
        attr_dev(input0, "min", "1");
        attr_dev(input0, "max", "15");
        attr_dev(input0, "step", "0.2");
        attr_dev(input0, "class", "svelte-62sb6n");
        add_location(input0, file$9, 18, 2, 348);
        attr_dev(label0, "for", "speedTarget");
        attr_dev(label0, "class", "svelte-62sb6n");
        add_location(label0, file$9, 26, 2, 519);
        attr_dev(hr, "class", "svelte-62sb6n");
        add_location(hr, file$9, 29, 2, 625);
        attr_dev(h41, "class", "svelte-62sb6n");
        add_location(h41, file$9, 31, 2, 633);
        attr_dev(input1, "id", "minWarning");
        attr_dev(input1, "type", "range");
        attr_dev(input1, "min", 1);
        attr_dev(input1, "max", 15);
        attr_dev(input1, "step", 0.1);
        attr_dev(input1, "class", "svelte-62sb6n");
        add_location(input1, file$9, 32, 2, 653);
        attr_dev(label1, "for", "minWarning");
        attr_dev(label1, "class", "svelte-62sb6n");
        add_location(label1, file$9, 40, 2, 817);
        attr_dev(input2, "id", "maxWarning");
        attr_dev(input2, "type", "range");
        attr_dev(input2, "min", 1);
        attr_dev(input2, "max", 15);
        attr_dev(input2, "step", 0.1);
        attr_dev(input2, "class", "svelte-62sb6n");
        add_location(input2, file$9, 43, 2, 922);
        attr_dev(label2, "for", "maxWarning");
        attr_dev(label2, "class", "svelte-62sb6n");
        add_location(label2, file$9, 51, 2, 1086);
        attr_dev(div, "class", "settingsComp");
        add_location(div, file$9, 15, 0, 294);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h40);
        append_dev(div, t1);
        append_dev(div, input0);
        set_input_value(input0, /*values*/ ctx[0].targetSpeed);
        append_dev(div, t2);
        append_dev(div, label0);
        append_dev(label0, t3);
        append_dev(label0, t4);
        append_dev(div, t5);
        mount_component(errors0, div, null);
        append_dev(div, t6);
        append_dev(div, hr);
        append_dev(div, t7);
        append_dev(div, h41);
        append_dev(div, t9);
        append_dev(div, input1);
        set_input_value(input1, /*values*/ ctx[0].speedMin);
        append_dev(div, t10);
        append_dev(div, label1);
        append_dev(label1, t11);
        append_dev(label1, t12);
        append_dev(label1, t13);
        append_dev(div, t14);
        mount_component(errors1, div, null);
        append_dev(div, t15);
        append_dev(div, input2);
        set_input_value(input2, /*values*/ ctx[0].speedMax);
        append_dev(div, t16);
        append_dev(div, label2);
        append_dev(label2, t17);
        append_dev(label2, t18);
        append_dev(label2, t19);
        append_dev(div, t20);
        mount_component(errors2, div, null);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              input0,
              "change",
              /*input0_change_input_handler*/ ctx[4]
            ),
            listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[4]),
            listen_dev(
              input0,
              "change",
              /*validateField*/ ctx[2]("targetSpeed"),
              false,
              false,
              false
            ),
            listen_dev(
              input1,
              "change",
              /*input1_change_input_handler*/ ctx[5]
            ),
            listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[5]),
            listen_dev(
              input1,
              "change",
              /*validateField*/ ctx[2]("speedMin"),
              false,
              false,
              false
            ),
            listen_dev(
              input2,
              "change",
              /*input2_change_input_handler*/ ctx[6]
            ),
            listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[6]),
            listen_dev(
              input2,
              "change",
              /*validateField*/ ctx[2]("speedMax"),
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*values*/ 1) {
          set_input_value(input0, /*values*/ ctx[0].targetSpeed);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t3_value !== (t3_value = /*values*/ ctx[0].targetSpeed + "")
        )
          set_data_dev(t3, t3_value);
        const errors0_changes = {};
        if (dirty & /*errors*/ 2) errors0_changes.errors = /*errors*/ ctx[1];
        errors0.$set(errors0_changes);

        if (dirty & /*values*/ 1) {
          set_input_value(input1, /*values*/ ctx[0].speedMin);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t12_value !== (t12_value = /*values*/ ctx[0].speedMin + "")
        )
          set_data_dev(t12, t12_value);
        const errors1_changes = {};
        if (dirty & /*errors*/ 2) errors1_changes.errors = /*errors*/ ctx[1];
        errors1.$set(errors1_changes);

        if (dirty & /*values*/ 1) {
          set_input_value(input2, /*values*/ ctx[0].speedMax);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t18_value !== (t18_value = /*values*/ ctx[0].speedMax + "")
        )
          set_data_dev(t18, t18_value);
        const errors2_changes = {};
        if (dirty & /*errors*/ 2) errors2_changes.errors = /*errors*/ ctx[1];
        errors2.$set(errors2_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(errors0.$$.fragment, local);
        transition_in(errors1.$$.fragment, local);
        transition_in(errors2.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(errors0.$$.fragment, local);
        transition_out(errors1.$$.fragment, local);
        transition_out(errors2.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(errors0);
        destroy_component(errors1);
        destroy_component(errors2);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$9.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SpeedSettings", slots, []);
    let { values } = $$props;
    let { errors } = $$props;
    let { result } = $$props;

    const validateField = (path) => () => {
      $$invalidate(3, (result = validate(values, path)));
      $$invalidate(1, (errors = result.getErrors()));
    };

    const writable_props = ["values", "errors", "result"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SpeedSettings> was created with unknown prop '${key}'`);
    });

    function input0_change_input_handler() {
      values.targetSpeed = to_number(this.value);
      $$invalidate(0, values);
    }

    function input1_change_input_handler() {
      values.speedMin = to_number(this.value);
      $$invalidate(0, values);
    }

    function input2_change_input_handler() {
      values.speedMax = to_number(this.value);
      $$invalidate(0, values);
    }

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    $$self.$capture_state = () => ({
      validate,
      Errors,
      values,
      errors,
      result,
      validateField,
    });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      values,
      errors,
      validateField,
      result,
      input0_change_input_handler,
      input1_change_input_handler,
      input2_change_input_handler,
    ];
  }

  class SpeedSettings extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$9, create_fragment$9, safe_not_equal, {
        values: 0,
        errors: 1,
        result: 3,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SpeedSettings",
        options,
        id: create_fragment$9.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn(
          "<SpeedSettings> was created without expected prop 'values'"
        );
      }

      if (/*errors*/ ctx[1] === undefined && !("errors" in props)) {
        console.warn(
          "<SpeedSettings> was created without expected prop 'errors'"
        );
      }

      if (/*result*/ ctx[3] === undefined && !("result" in props)) {
        console.warn(
          "<SpeedSettings> was created without expected prop 'result'"
        );
      }
    }

    get values() {
      throw new Error(
        "<SpeedSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<SpeedSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get errors() {
      throw new Error(
        "<SpeedSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set errors(value) {
      throw new Error(
        "<SpeedSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get result() {
      throw new Error(
        "<SpeedSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set result(value) {
      throw new Error(
        "<SpeedSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/ReviewSettings.svelte generated by Svelte v3.44.2 */
  const file$8 = "src/components/ReviewSettings.svelte";

  function create_fragment$8(ctx) {
    let div;
    let h4;
    let t1;
    let input0;
    let t2;
    let label0;
    let t3_value = /*values*/ ctx[0].rpdMin + "";
    let t3;
    let t4;
    let t5;
    let errors0;
    let t6;
    let input1;
    let t7;
    let label1;
    let t8_value = /*values*/ ctx[0].rpdMax + "";
    let t8;
    let t9;
    let t10;
    let errors1;
    let current;
    let mounted;
    let dispose;

    errors0 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "rpdMin",
      },
      $$inline: true,
    });

    errors1 = new Errors({
      props: {
        errors: /*errors*/ ctx[1],
        path: "rpdMax",
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        h4 = element("h4");
        h4.textContent = "Target Reviews-per-day";
        t1 = space();
        input0 = element("input");
        t2 = space();
        label0 = element("label");
        t3 = text(t3_value);
        t4 = text(" reviews min");
        t5 = space();
        create_component(errors0.$$.fragment);
        t6 = space();
        input1 = element("input");
        t7 = space();
        label1 = element("label");
        t8 = text(t8_value);
        t9 = text(" reviews max");
        t10 = space();
        create_component(errors1.$$.fragment);
        attr_dev(h4, "class", "svelte-164pmcj");
        add_location(h4, file$8, 16, 2, 324);
        attr_dev(input0, "id", "rpdMin");
        attr_dev(input0, "type", "range");
        attr_dev(input0, "min", 10);
        attr_dev(input0, "max", 290);
        attr_dev(input0, "step", 10);
        attr_dev(input0, "class", "svelte-164pmcj");
        add_location(input0, file$8, 17, 2, 358);
        attr_dev(label0, "for", "rpdTarget");
        attr_dev(label0, "class", "svelte-164pmcj");
        add_location(label0, file$8, 25, 2, 515);
        attr_dev(input1, "id", "rpdMax");
        attr_dev(input1, "type", "range");
        attr_dev(input1, "min", 20);
        attr_dev(input1, "max", 300);
        attr_dev(input1, "step", 10);
        attr_dev(input1, "class", "svelte-164pmcj");
        add_location(input1, file$8, 28, 2, 613);
        attr_dev(label1, "for", "rpdTarget");
        attr_dev(label1, "class", "svelte-164pmcj");
        add_location(label1, file$8, 36, 2, 770);
        attr_dev(div, "class", "settingsComp");
        add_location(div, file$8, 14, 0, 294);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h4);
        append_dev(div, t1);
        append_dev(div, input0);
        set_input_value(input0, /*values*/ ctx[0].rpdMin);
        append_dev(div, t2);
        append_dev(div, label0);
        append_dev(label0, t3);
        append_dev(label0, t4);
        append_dev(div, t5);
        mount_component(errors0, div, null);
        append_dev(div, t6);
        append_dev(div, input1);
        set_input_value(input1, /*values*/ ctx[0].rpdMax);
        append_dev(div, t7);
        append_dev(div, label1);
        append_dev(label1, t8);
        append_dev(label1, t9);
        append_dev(div, t10);
        mount_component(errors1, div, null);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              input0,
              "change",
              /*input0_change_input_handler*/ ctx[4]
            ),
            listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[4]),
            listen_dev(
              input0,
              "change",
              /*validateField*/ ctx[2]("rpdMin"),
              false,
              false,
              false
            ),
            listen_dev(
              input1,
              "change",
              /*input1_change_input_handler*/ ctx[5]
            ),
            listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[5]),
            listen_dev(
              input1,
              "change",
              /*validateField*/ ctx[2]("rpdMax"),
              false,
              false,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*values*/ 1) {
          set_input_value(input0, /*values*/ ctx[0].rpdMin);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t3_value !== (t3_value = /*values*/ ctx[0].rpdMin + "")
        )
          set_data_dev(t3, t3_value);
        const errors0_changes = {};
        if (dirty & /*errors*/ 2) errors0_changes.errors = /*errors*/ ctx[1];
        errors0.$set(errors0_changes);

        if (dirty & /*values*/ 1) {
          set_input_value(input1, /*values*/ ctx[0].rpdMax);
        }

        if (
          (!current || dirty & /*values*/ 1) &&
          t8_value !== (t8_value = /*values*/ ctx[0].rpdMax + "")
        )
          set_data_dev(t8, t8_value);
        const errors1_changes = {};
        if (dirty & /*errors*/ 2) errors1_changes.errors = /*errors*/ ctx[1];
        errors1.$set(errors1_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(errors0.$$.fragment, local);
        transition_in(errors1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(errors0.$$.fragment, local);
        transition_out(errors1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(errors0);
        destroy_component(errors1);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$8.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$8($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("ReviewSettings", slots, []);
    let { values } = $$props;
    let { errors } = $$props;
    let { result } = $$props;

    const validateField = (path) => () => {
      $$invalidate(3, (result = validate(values, path)));
      $$invalidate(1, (errors = result.getErrors()));
    };

    const writable_props = ["values", "errors", "result"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<ReviewSettings> was created with unknown prop '${key}'`);
    });

    function input0_change_input_handler() {
      values.rpdMin = to_number(this.value);
      $$invalidate(0, values);
    }

    function input1_change_input_handler() {
      values.rpdMax = to_number(this.value);
      $$invalidate(0, values);
    }

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    $$self.$capture_state = () => ({
      validate,
      Errors,
      values,
      errors,
      result,
      validateField,
    });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(1, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(3, (result = $$props.result));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      values,
      errors,
      validateField,
      result,
      input0_change_input_handler,
      input1_change_input_handler,
    ];
  }

  class ReviewSettings extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$8, create_fragment$8, safe_not_equal, {
        values: 0,
        errors: 1,
        result: 3,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "ReviewSettings",
        options,
        id: create_fragment$8.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn(
          "<ReviewSettings> was created without expected prop 'values'"
        );
      }

      if (/*errors*/ ctx[1] === undefined && !("errors" in props)) {
        console.warn(
          "<ReviewSettings> was created without expected prop 'errors'"
        );
      }

      if (/*result*/ ctx[3] === undefined && !("result" in props)) {
        console.warn(
          "<ReviewSettings> was created without expected prop 'result'"
        );
      }
    }

    get values() {
      throw new Error(
        "<ReviewSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<ReviewSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get errors() {
      throw new Error(
        "<ReviewSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set errors(value) {
      throw new Error(
        "<ReviewSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get result() {
      throw new Error(
        "<ReviewSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set result(value) {
      throw new Error(
        "<ReviewSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/AppearanceSettings.svelte generated by Svelte v3.44.2 */
  const file$7 = "src/components/AppearanceSettings.svelte";

  function create_fragment$7(ctx) {
    let div5;
    let div1;
    let div0;
    let t1;
    let gauge;
    let t2;
    let barchart;
    let div1_style_value;
    let t3;
    let div2;
    let label0;
    let t4;
    let input0;
    let t5;
    let label1;
    let t6;
    let input1;
    let t7;
    let label2;
    let t8;
    let input2;
    let t9;
    let label3;
    let t10;
    let input3;
    let t11;
    let div3;
    let label4;
    let t12;
    let input4;
    let t13;
    let label5;
    let t14;
    let input5;
    let t15;
    let label6;
    let t16;
    let input6;
    let t17;
    let button0;
    let t19;
    let button1;
    let t21;
    let hr;
    let t22;
    let div4;
    let label7;
    let t24;
    let select;
    let option0;
    let option1;
    let option2;
    let option3;
    let option4;
    let current;
    let mounted;
    let dispose;

    gauge = new Gauge({
      props: {
        value: 0.4,
        label: "Sample",
        needle: true,
        lowZone: true,
        hiZone: true,
      },
      $$inline: true,
    });

    barchart = new BarChart({
      props: {
        values: [7, 10, 8],
        labels: ["Mon", "Tue", "Wed"],
        expected: 7,
        minTarget: 2,
        maxTarget: 9,
        percents: [0.66, 0.8, 0.75],
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div5 = element("div");
        div1 = element("div");
        div0 = element("div");
        div0.textContent = "Warning Color";
        t1 = space();
        create_component(gauge.$$.fragment);
        t2 = space();
        create_component(barchart.$$.fragment);
        t3 = space();
        div2 = element("div");
        label0 = element("label");
        t4 = text("Bgnd\n      ");
        input0 = element("input");
        t5 = space();
        label1 = element("label");
        t6 = text("Track\n    ");
        input1 = element("input");
        t7 = space();
        label2 = element("label");
        t8 = text("Text\n      ");
        input2 = element("input");
        t9 = space();
        label3 = element("label");
        t10 = text("hlText\n      ");
        input3 = element("input");
        t11 = space();
        div3 = element("div");
        label4 = element("label");
        t12 = text("Fill\n      ");
        input4 = element("input");
        t13 = space();
        label5 = element("label");
        t14 = text("Warn\n      ");
        input5 = element("input");
        t15 = space();
        label6 = element("label");
        t16 = text("hlTrack\n      ");
        input6 = element("input");
        t17 = space();
        button0 = element("button");
        button0.textContent = "Set light";
        t19 = space();
        button1 = element("button");
        button1.textContent = "Set dark";
        t21 = space();
        hr = element("hr");
        t22 = space();
        div4 = element("div");
        label7 = element("label");
        label7.textContent = "Position";
        t24 = space();
        select = element("select");
        option0 = element("option");
        option0.textContent = "Top";
        option1 = element("option");
        option1.textContent = "Below Forecast";
        option2 = element("option");
        option2.textContent = "Below SRS";
        option3 = element("option");
        option3.textContent = "Below Panels";
        option4 = element("option");
        option4.textContent = "Bottom";
        attr_dev(div0, "class", "warnBox svelte-i87jv8");
        add_location(div0, file$7, 37, 4, 1135);
        attr_dev(div1, "class", "colorSample svelte-i87jv8");

        attr_dev(
          div1,
          "style",
          (div1_style_value = ` 
      background-color: ${/*values*/ ctx[0].bgColor};
      --bgColor: ${/*values*/ ctx[0].bgColor}; 
      --trackColor: ${/*values*/ ctx[0].hlTrackColor}; 
      --textColor: ${/*values*/ ctx[0].textColor}; 
      --hlTextColor: ${/*values*/ ctx[0].hlTextColor}; 
      --fillColor: ${/*values*/ ctx[0].fillColor}; 
      --warnColor: ${/*values*/ ctx[0].warnColor}; 
      --hlTrackColor: ${/*values*/ ctx[0].trackColor};`)
        );

        add_location(div1, file$7, 27, 2, 750);
        attr_dev(input0, "type", "color");
        attr_dev(input0, "class", "svelte-i87jv8");
        add_location(input0, file$7, 51, 6, 1485);
        attr_dev(label0, "class", "svelte-i87jv8");
        add_location(label0, file$7, 49, 4, 1460);
        attr_dev(input1, "type", "color");
        attr_dev(input1, "class", "svelte-i87jv8");
        add_location(input1, file$7, 55, 4, 1575);
        attr_dev(label1, "class", "svelte-i87jv8");
        add_location(label1, file$7, 53, 4, 1551);
        attr_dev(input2, "type", "color");
        attr_dev(input2, "class", "svelte-i87jv8");
        add_location(input2, file$7, 59, 6, 1669);
        attr_dev(label2, "class", "svelte-i87jv8");
        add_location(label2, file$7, 57, 4, 1644);
        attr_dev(input3, "type", "color");
        attr_dev(input3, "class", "svelte-i87jv8");
        add_location(input3, file$7, 63, 6, 1764);
        attr_dev(label3, "class", "svelte-i87jv8");
        add_location(label3, file$7, 61, 4, 1737);
        attr_dev(div2, "class", "colorInputs svelte-i87jv8");
        add_location(div2, file$7, 48, 2, 1430);
        attr_dev(input4, "type", "color");
        attr_dev(input4, "class", "svelte-i87jv8");
        add_location(input4, file$7, 69, 6, 1896);
        attr_dev(label4, "class", "svelte-i87jv8");
        add_location(label4, file$7, 67, 4, 1871);
        attr_dev(input5, "type", "color");
        attr_dev(input5, "class", "svelte-i87jv8");
        add_location(input5, file$7, 73, 6, 1989);
        attr_dev(label5, "class", "svelte-i87jv8");
        add_location(label5, file$7, 71, 4, 1964);
        attr_dev(input6, "type", "color");
        attr_dev(input6, "class", "svelte-i87jv8");
        add_location(input6, file$7, 77, 6, 2085);
        attr_dev(label6, "class", "svelte-i87jv8");
        add_location(label6, file$7, 75, 4, 2057);
        attr_dev(div3, "class", "colorInputs svelte-i87jv8");
        add_location(div3, file$7, 66, 2, 1841);
        attr_dev(button0, "class", "light svelte-i87jv8");
        add_location(button0, file$7, 81, 2, 2164);
        attr_dev(button1, "class", "dark svelte-i87jv8");
        add_location(button1, file$7, 82, 2, 2247);
        attr_dev(hr, "class", "svelte-i87jv8");
        add_location(hr, file$7, 84, 2, 2332);
        attr_dev(label7, "for", "position-select");
        attr_dev(label7, "class", "svelte-i87jv8");
        add_location(label7, file$7, 88, 4, 2455);
        option0.__value = "Top";
        option0.value = option0.__value;
        add_location(option0, file$7, 90, 6, 2587);
        option1.__value = "Below Forecast";
        option1.value = option1.__value;
        add_location(option1, file$7, 91, 6, 2626);
        option2.__value = "Below SRS";
        option2.value = option2.__value;
        add_location(option2, file$7, 92, 6, 2687);
        option3.__value = "Below Panels";
        option3.value = option3.__value;
        add_location(option3, file$7, 93, 6, 2738);
        option4.__value = "Bottom";
        option4.value = option4.__value;
        add_location(option4, file$7, 94, 6, 2795);
        attr_dev(select, "name", "positions");
        attr_dev(select, "id", "position-select");
        attr_dev(select, "class", "svelte-i87jv8");
        if (/*values*/ ctx[0].position === void 0)
          add_render_callback(() =>
            /*select_change_handler*/ ctx[10].call(select)
          );
        add_location(select, file$7, 89, 4, 2505);
        attr_dev(div4, "class", "position svelte-i87jv8");
        add_location(div4, file$7, 87, 2, 2428);
        attr_dev(div5, "class", "settingsComp");
        add_location(div5, file$7, 26, 0, 721);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div5, anchor);
        append_dev(div5, div1);
        append_dev(div1, div0);
        append_dev(div1, t1);
        mount_component(gauge, div1, null);
        append_dev(div1, t2);
        mount_component(barchart, div1, null);
        append_dev(div5, t3);
        append_dev(div5, div2);
        append_dev(div2, label0);
        append_dev(label0, t4);
        append_dev(label0, input0);
        set_input_value(input0, /*values*/ ctx[0].bgColor);
        append_dev(div2, t5);
        append_dev(div2, label1);
        append_dev(label1, t6);
        append_dev(label1, input1);
        set_input_value(input1, /*values*/ ctx[0].trackColor);
        append_dev(div2, t7);
        append_dev(div2, label2);
        append_dev(label2, t8);
        append_dev(label2, input2);
        set_input_value(input2, /*values*/ ctx[0].textColor);
        append_dev(div2, t9);
        append_dev(div2, label3);
        append_dev(label3, t10);
        append_dev(label3, input3);
        set_input_value(input3, /*values*/ ctx[0].hlTextColor);
        append_dev(div5, t11);
        append_dev(div5, div3);
        append_dev(div3, label4);
        append_dev(label4, t12);
        append_dev(label4, input4);
        set_input_value(input4, /*values*/ ctx[0].fillColor);
        append_dev(div3, t13);
        append_dev(div3, label5);
        append_dev(label5, t14);
        append_dev(label5, input5);
        set_input_value(input5, /*values*/ ctx[0].warnColor);
        append_dev(div3, t15);
        append_dev(div3, label6);
        append_dev(label6, t16);
        append_dev(label6, input6);
        set_input_value(input6, /*values*/ ctx[0].hlTrackColor);
        append_dev(div5, t17);
        append_dev(div5, button0);
        append_dev(div5, t19);
        append_dev(div5, button1);
        append_dev(div5, t21);
        append_dev(div5, hr);
        append_dev(div5, t22);
        append_dev(div5, div4);
        append_dev(div4, label7);
        append_dev(div4, t24);
        append_dev(div4, select);
        append_dev(select, option0);
        append_dev(select, option1);
        append_dev(select, option2);
        append_dev(select, option3);
        append_dev(select, option4);
        select_option(select, /*values*/ ctx[0].position);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
            listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
            listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
            listen_dev(input3, "input", /*input3_input_handler*/ ctx[6]),
            listen_dev(input4, "input", /*input4_input_handler*/ ctx[7]),
            listen_dev(input5, "input", /*input5_input_handler*/ ctx[8]),
            listen_dev(input6, "input", /*input6_input_handler*/ ctx[9]),
            listen_dev(
              button0,
              "click",
              prevent_default(/*setLightTheme*/ ctx[1]),
              false,
              true,
              false
            ),
            listen_dev(
              button1,
              "click",
              prevent_default(/*setDarkTheme*/ ctx[2]),
              false,
              true,
              false
            ),
            listen_dev(select, "change", /*select_change_handler*/ ctx[10]),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (
          !current ||
          (dirty & /*values*/ 1 &&
            div1_style_value !==
              (div1_style_value = ` 
      background-color: ${/*values*/ ctx[0].bgColor};
      --bgColor: ${/*values*/ ctx[0].bgColor}; 
      --trackColor: ${/*values*/ ctx[0].hlTrackColor}; 
      --textColor: ${/*values*/ ctx[0].textColor}; 
      --hlTextColor: ${/*values*/ ctx[0].hlTextColor}; 
      --fillColor: ${/*values*/ ctx[0].fillColor}; 
      --warnColor: ${/*values*/ ctx[0].warnColor}; 
      --hlTrackColor: ${/*values*/ ctx[0].trackColor};`))
        ) {
          attr_dev(div1, "style", div1_style_value);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input0, /*values*/ ctx[0].bgColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input1, /*values*/ ctx[0].trackColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input2, /*values*/ ctx[0].textColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input3, /*values*/ ctx[0].hlTextColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input4, /*values*/ ctx[0].fillColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input5, /*values*/ ctx[0].warnColor);
        }

        if (dirty & /*values*/ 1) {
          set_input_value(input6, /*values*/ ctx[0].hlTrackColor);
        }

        if (dirty & /*values*/ 1) {
          select_option(select, /*values*/ ctx[0].position);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(gauge.$$.fragment, local);
        transition_in(barchart.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(gauge.$$.fragment, local);
        transition_out(barchart.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div5);
        destroy_component(gauge);
        destroy_component(barchart);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$7.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$7($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("AppearanceSettings", slots, []);
    let { values } = $$props;

    const setLightTheme = () => {
      $$invalidate(0, (values.bgColor = "#f4f4f4"), values);
      $$invalidate(0, (values.trackColor = "#d1e8d4"), values),
        $$invalidate(0, (values.textColor = "#333333"), values);
      $$invalidate(0, (values.hlTextColor = "#fbb623"), values);
      $$invalidate(0, (values.fillColor = "#59c273"), values);
      $$invalidate(0, (values.warnColor = "#fbb623"), values);
      $$invalidate(0, (values.hlTrackColor = "#d1e8d4"), values);
    };

    const setDarkTheme = () => {
      $$invalidate(0, (values.bgColor = "#232629"), values);
      $$invalidate(0, (values.trackColor = "#e0e0e0"), values),
        $$invalidate(0, (values.textColor = "#bcbcbc"), values);
      $$invalidate(0, (values.hlTextColor = "#fcbd4b"), values);
      $$invalidate(0, (values.fillColor = "#59c273"), values);
      $$invalidate(0, (values.warnColor = "#fcbd4b"), values);
      $$invalidate(0, (values.hlTrackColor = "#aad4b0"), values);
    };

    const writable_props = ["values"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<AppearanceSettings> was created with unknown prop '${key}'`
        );
    });

    function input0_input_handler() {
      values.bgColor = this.value;
      $$invalidate(0, values);
    }

    function input1_input_handler() {
      values.trackColor = this.value;
      $$invalidate(0, values);
    }

    function input2_input_handler() {
      values.textColor = this.value;
      $$invalidate(0, values);
    }

    function input3_input_handler() {
      values.hlTextColor = this.value;
      $$invalidate(0, values);
    }

    function input4_input_handler() {
      values.fillColor = this.value;
      $$invalidate(0, values);
    }

    function input5_input_handler() {
      values.warnColor = this.value;
      $$invalidate(0, values);
    }

    function input6_input_handler() {
      values.hlTrackColor = this.value;
      $$invalidate(0, values);
    }

    function select_change_handler() {
      values.position = select_value(this);
      $$invalidate(0, values);
    }

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
    };

    $$self.$capture_state = () => ({
      Gauge,
      BarChart,
      values,
      setLightTheme,
      setDarkTheme,
    });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [
      values,
      setLightTheme,
      setDarkTheme,
      input0_input_handler,
      input1_input_handler,
      input2_input_handler,
      input3_input_handler,
      input4_input_handler,
      input5_input_handler,
      input6_input_handler,
      select_change_handler,
    ];
  }

  class AppearanceSettings extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {
        values: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "AppearanceSettings",
        options,
        id: create_fragment$7.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn(
          "<AppearanceSettings> was created without expected prop 'values'"
        );
      }
    }

    get values() {
      throw new Error(
        "<AppearanceSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<AppearanceSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/AdvancedSettings.svelte generated by Svelte v3.44.2 */

  const file$6 = "src/components/AdvancedSettings.svelte";

  function create_fragment$6(ctx) {
    let div;
    let h40;
    let t1;
    let input0;
    let t2;
    let label0;
    let t3_value = /*values*/ ctx[0].madCutoff + "";
    let t3;
    let t4;
    let hr;
    let t5;
    let h41;
    let t7;
    let input1;
    let t8;
    let label1;
    let t9_value = /*values*/ ctx[0].tzOffset + "";
    let t9;
    let t10;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        div = element("div");
        h40 = element("h4");
        h40.textContent = "MAD cutoff";
        t1 = space();
        input0 = element("input");
        t2 = space();
        label0 = element("label");
        t3 = text(t3_value);
        t4 = space();
        hr = element("hr");
        t5 = space();
        h41 = element("h4");
        h41.textContent = "Timezone Offset";
        t7 = space();
        input1 = element("input");
        t8 = space();
        label1 = element("label");
        t9 = text(t9_value);
        t10 = text(" hours");
        attr_dev(h40, "class", "svelte-62sb6n");
        add_location(h40, file$6, 6, 2, 82);
        attr_dev(input0, "id", "madCutoff");
        attr_dev(input0, "type", "range");
        attr_dev(input0, "min", "2");
        attr_dev(input0, "max", "15");
        attr_dev(input0, "class", "svelte-62sb6n");
        add_location(input0, file$6, 7, 2, 104);
        attr_dev(label0, "for", "madCutoff");
        attr_dev(label0, "class", "svelte-62sb6n");
        add_location(label0, file$6, 13, 2, 213);
        attr_dev(hr, "class", "svelte-62sb6n");
        add_location(hr, file$6, 15, 2, 266);
        attr_dev(h41, "class", "svelte-62sb6n");
        add_location(h41, file$6, 18, 2, 353);
        input1.disabled = true;
        attr_dev(input1, "id", "tzOffset");
        attr_dev(input1, "type", "range");
        attr_dev(input1, "min", "-23");
        attr_dev(input1, "max", "23");
        attr_dev(input1, "class", "svelte-62sb6n");
        add_location(input1, file$6, 19, 2, 380);
        attr_dev(label1, "for", "tzOffset");
        attr_dev(label1, "class", "svelte-62sb6n");
        add_location(label1, file$6, 26, 2, 501);
        attr_dev(div, "class", "settingsComp");
        add_location(div, file$6, 4, 0, 52);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h40);
        append_dev(div, t1);
        append_dev(div, input0);
        set_input_value(input0, /*values*/ ctx[0].madCutoff);
        append_dev(div, t2);
        append_dev(div, label0);
        append_dev(label0, t3);
        append_dev(div, t4);
        append_dev(div, hr);
        append_dev(div, t5);
        append_dev(div, h41);
        append_dev(div, t7);
        append_dev(div, input1);
        set_input_value(input1, /*values*/ ctx[0].tzOffset);
        append_dev(div, t8);
        append_dev(div, label1);
        append_dev(label1, t9);
        append_dev(label1, t10);

        if (!mounted) {
          dispose = [
            listen_dev(
              input0,
              "change",
              /*input0_change_input_handler*/ ctx[1]
            ),
            listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[1]),
            listen_dev(
              input1,
              "change",
              /*input1_change_input_handler*/ ctx[2]
            ),
            listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[2]),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*values*/ 1) {
          set_input_value(input0, /*values*/ ctx[0].madCutoff);
        }

        if (
          dirty & /*values*/ 1 &&
          t3_value !== (t3_value = /*values*/ ctx[0].madCutoff + "")
        )
          set_data_dev(t3, t3_value);

        if (dirty & /*values*/ 1) {
          set_input_value(input1, /*values*/ ctx[0].tzOffset);
        }

        if (
          dirty & /*values*/ 1 &&
          t9_value !== (t9_value = /*values*/ ctx[0].tzOffset + "")
        )
          set_data_dev(t9, t9_value);
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$6.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$6($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("AdvancedSettings", slots, []);
    let { values } = $$props;
    const writable_props = ["values"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(
          `<AdvancedSettings> was created with unknown prop '${key}'`
        );
    });

    function input0_change_input_handler() {
      values.madCutoff = to_number(this.value);
      $$invalidate(0, values);
    }

    function input1_change_input_handler() {
      values.tzOffset = to_number(this.value);
      $$invalidate(0, values);
    }

    $$self.$$set = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
    };

    $$self.$capture_state = () => ({ values });

    $$self.$inject_state = ($$props) => {
      if ("values" in $$props) $$invalidate(0, (values = $$props.values));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [values, input0_change_input_handler, input1_change_input_handler];
  }

  class AdvancedSettings extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {
        values: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "AdvancedSettings",
        options,
        id: create_fragment$6.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*values*/ ctx[0] === undefined && !("values" in props)) {
        console.warn(
          "<AdvancedSettings> was created without expected prop 'values'"
        );
      }
    }

    get values() {
      throw new Error(
        "<AdvancedSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set values(value) {
      throw new Error(
        "<AdvancedSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/SettingsForm.svelte generated by Svelte v3.44.2 */

  const { Object: Object_1 } = globals;
  const file$5 = "src/components/SettingsForm.svelte";

  // (57:36)
  function create_if_block_4(ctx) {
    let advancedsettings;
    let current;

    advancedsettings = new AdvancedSettings({
      props: { values: /*values*/ ctx[1] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(advancedsettings.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(advancedsettings, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const advancedsettings_changes = {};
        if (dirty & /*values*/ 2)
          advancedsettings_changes.values = /*values*/ ctx[1];
        advancedsettings.$set(advancedsettings_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(advancedsettings.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(advancedsettings.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(advancedsettings, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4.name,
      type: "if",
      source: "(57:36) ",
      ctx,
    });

    return block;
  }

  // (55:38)
  function create_if_block_3(ctx) {
    let appearancesettings;
    let current;

    appearancesettings = new AppearanceSettings({
      props: { values: /*values*/ ctx[1] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(appearancesettings.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(appearancesettings, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const appearancesettings_changes = {};
        if (dirty & /*values*/ 2)
          appearancesettings_changes.values = /*values*/ ctx[1];
        appearancesettings.$set(appearancesettings_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(appearancesettings.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(appearancesettings.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(appearancesettings, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3.name,
      type: "if",
      source: "(55:38) ",
      ctx,
    });

    return block;
  }

  // (53:35)
  function create_if_block_2(ctx) {
    let reviewsettings;
    let updating_result;
    let current;

    function reviewsettings_result_binding(value) {
      /*reviewsettings_result_binding*/ ctx[11](value);
    }

    let reviewsettings_props = {
      values: /*values*/ ctx[1],
      errors: /*errors*/ ctx[2],
    };

    if (/*result*/ ctx[0] !== void 0) {
      reviewsettings_props.result = /*result*/ ctx[0];
    }

    reviewsettings = new ReviewSettings({
      props: reviewsettings_props,
      $$inline: true,
    });

    binding_callbacks.push(() =>
      bind(reviewsettings, "result", reviewsettings_result_binding)
    );

    const block = {
      c: function create() {
        create_component(reviewsettings.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(reviewsettings, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const reviewsettings_changes = {};
        if (dirty & /*values*/ 2)
          reviewsettings_changes.values = /*values*/ ctx[1];
        if (dirty & /*errors*/ 4)
          reviewsettings_changes.errors = /*errors*/ ctx[2];

        if (!updating_result && dirty & /*result*/ 1) {
          updating_result = true;
          reviewsettings_changes.result = /*result*/ ctx[0];
          add_flush_callback(() => (updating_result = false));
        }

        reviewsettings.$set(reviewsettings_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(reviewsettings.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(reviewsettings.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(reviewsettings, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2.name,
      type: "if",
      source: "(53:35) ",
      ctx,
    });

    return block;
  }

  // (51:33)
  function create_if_block_1$1(ctx) {
    let speedsettings;
    let updating_result;
    let current;

    function speedsettings_result_binding(value) {
      /*speedsettings_result_binding*/ ctx[10](value);
    }

    let speedsettings_props = {
      values: /*values*/ ctx[1],
      errors: /*errors*/ ctx[2],
    };

    if (/*result*/ ctx[0] !== void 0) {
      speedsettings_props.result = /*result*/ ctx[0];
    }

    speedsettings = new SpeedSettings({
      props: speedsettings_props,
      $$inline: true,
    });

    binding_callbacks.push(() =>
      bind(speedsettings, "result", speedsettings_result_binding)
    );

    const block = {
      c: function create() {
        create_component(speedsettings.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(speedsettings, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const speedsettings_changes = {};
        if (dirty & /*values*/ 2)
          speedsettings_changes.values = /*values*/ ctx[1];
        if (dirty & /*errors*/ 4)
          speedsettings_changes.errors = /*errors*/ ctx[2];

        if (!updating_result && dirty & /*result*/ 1) {
          updating_result = true;
          speedsettings_changes.result = /*result*/ ctx[0];
          add_flush_callback(() => (updating_result = false));
        }

        speedsettings.$set(speedsettings_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(speedsettings.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(speedsettings.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(speedsettings, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$1.name,
      type: "if",
      source: "(51:33) ",
      ctx,
    });

    return block;
  }

  // (49:4) {#if current == "Ganbarometer"}
  function create_if_block$2(ctx) {
    let ganbarometersettings;
    let updating_result;
    let current;

    function ganbarometersettings_result_binding(value) {
      /*ganbarometersettings_result_binding*/ ctx[9](value);
    }

    let ganbarometersettings_props = {
      values: /*values*/ ctx[1],
      errors: /*errors*/ ctx[2],
    };

    if (/*result*/ ctx[0] !== void 0) {
      ganbarometersettings_props.result = /*result*/ ctx[0];
    }

    ganbarometersettings = new GanbarometerSettings({
      props: ganbarometersettings_props,
      $$inline: true,
    });

    binding_callbacks.push(() =>
      bind(ganbarometersettings, "result", ganbarometersettings_result_binding)
    );

    const block = {
      c: function create() {
        create_component(ganbarometersettings.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(ganbarometersettings, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const ganbarometersettings_changes = {};
        if (dirty & /*values*/ 2)
          ganbarometersettings_changes.values = /*values*/ ctx[1];
        if (dirty & /*errors*/ 4)
          ganbarometersettings_changes.errors = /*errors*/ ctx[2];

        if (!updating_result && dirty & /*result*/ 1) {
          updating_result = true;
          ganbarometersettings_changes.result = /*result*/ ctx[0];
          add_flush_callback(() => (updating_result = false));
        }

        ganbarometersettings.$set(ganbarometersettings_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(ganbarometersettings.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(ganbarometersettings.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(ganbarometersettings, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$2.name,
      type: "if",
      source: '(49:4) {#if current == \\"Ganbarometer\\"}',
      ctx,
    });

    return block;
  }

  function create_fragment$5(ctx) {
    let form;
    let h1;
    let t1;
    let div1;
    let nav;
    let li0;
    let t3;
    let li1;
    let t5;
    let li2;
    let t7;
    let li3;
    let t9;
    let li4;
    let t11;
    let div0;
    let button0;
    let t13;
    let button1;
    let t14;
    let t15;
    let div2;
    let current_block_type_index;
    let if_block;
    let current;
    let mounted;
    let dispose;

    const if_block_creators = [
      create_if_block$2,
      create_if_block_1$1,
      create_if_block_2,
      create_if_block_3,
      create_if_block_4,
    ];

    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*current*/ ctx[3] == "Ganbarometer") return 0;
      if (/*current*/ ctx[3] == "Speed") return 1;
      if (/*current*/ ctx[3] == "Reviews") return 2;
      if (/*current*/ ctx[3] == "Appearance") return 3;
      if (/*current*/ ctx[3] == "Advanced") return 4;
      return -1;
    }

    if (~(current_block_type_index = select_block_type(ctx))) {
      if_block = if_blocks[current_block_type_index] =
        if_block_creators[current_block_type_index](ctx);
    }

    const block = {
      c: function create() {
        form = element("form");
        h1 = element("h1");
        h1.textContent = "Ganbarometer Settings";
        t1 = space();
        div1 = element("div");
        nav = element("nav");
        li0 = element("li");
        li0.textContent = "Ganbarometer";
        t3 = space();
        li1 = element("li");
        li1.textContent = "Speed";
        t5 = space();
        li2 = element("li");
        li2.textContent = "Reviews";
        t7 = space();
        li3 = element("li");
        li3.textContent = "Appearance";
        t9 = space();
        li4 = element("li");
        li4.textContent = "Advanced";
        t11 = space();
        div0 = element("div");
        button0 = element("button");
        button0.textContent = "Defaults";
        t13 = space();
        button1 = element("button");
        t14 = text("Save");
        t15 = space();
        div2 = element("div");
        if (if_block) if_block.c();
        attr_dev(h1, "class", "title svelte-133aw75");
        add_location(h1, file$5, 33, 2, 1178);
        attr_dev(li0, "class", "svelte-133aw75");
        toggle_class(li0, "active", /*current*/ ctx[3] === "Ganbarometer");
        add_location(li0, file$5, 36, 8, 1274);
        attr_dev(li1, "class", "svelte-133aw75");
        toggle_class(li1, "active", /*current*/ ctx[3] === "Speed");
        add_location(li1, file$5, 37, 8, 1382);
        attr_dev(li2, "class", "svelte-133aw75");
        toggle_class(li2, "active", /*current*/ ctx[3] === "Reviews");
        add_location(li2, file$5, 38, 8, 1469);
        attr_dev(li3, "class", "svelte-133aw75");
        toggle_class(li3, "active", /*current*/ ctx[3] === "Appearance");
        add_location(li3, file$5, 39, 8, 1562);
        attr_dev(li4, "class", "svelte-133aw75");
        toggle_class(li4, "active", /*current*/ ctx[3] === "Advanced");
        add_location(li4, file$5, 40, 8, 1664);
        attr_dev(nav, "class", "nav svelte-133aw75");
        add_location(nav, file$5, 35, 4, 1248);
        attr_dev(button0, "class", "defaultButton svelte-133aw75");
        add_location(button0, file$5, 43, 6, 1795);
        attr_dev(button1, "type", "submit");
        button1.disabled = /*disabled*/ ctx[4];
        attr_dev(button1, "class", "svelte-133aw75");
        add_location(button1, file$5, 44, 6, 1887);
        attr_dev(div0, "class", "actions");
        add_location(div0, file$5, 42, 4, 1767);
        attr_dev(div1, "class", "menu svelte-133aw75");
        add_location(div1, file$5, 34, 2, 1225);
        attr_dev(div2, "class", "formInputs svelte-133aw75");
        add_location(div2, file$5, 47, 2, 1956);
        attr_dev(form, "aria-label", "Settings Form");
        attr_dev(form, "class", "settingsForm svelte-133aw75");
        add_location(form, file$5, 32, 0, 1087);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, form, anchor);
        append_dev(form, h1);
        append_dev(form, t1);
        append_dev(form, div1);
        append_dev(div1, nav);
        append_dev(nav, li0);
        append_dev(nav, t3);
        append_dev(nav, li1);
        append_dev(nav, t5);
        append_dev(nav, li2);
        append_dev(nav, t7);
        append_dev(nav, li3);
        append_dev(nav, t9);
        append_dev(nav, li4);
        append_dev(div1, t11);
        append_dev(div1, div0);
        append_dev(div0, button0);
        append_dev(div0, t13);
        append_dev(div0, button1);
        append_dev(button1, t14);
        append_dev(form, t15);
        append_dev(form, div2);

        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(div2, null);
        }

        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              li0,
              "click",
              /*switchTo*/ ctx[7]("Ganbarometer"),
              false,
              false,
              false
            ),
            listen_dev(
              li1,
              "click",
              /*switchTo*/ ctx[7]("Speed"),
              false,
              false,
              false
            ),
            listen_dev(
              li2,
              "click",
              /*switchTo*/ ctx[7]("Reviews"),
              false,
              false,
              false
            ),
            listen_dev(
              li3,
              "click",
              /*switchTo*/ ctx[7]("Appearance"),
              false,
              false,
              false
            ),
            listen_dev(
              li4,
              "click",
              /*switchTo*/ ctx[7]("Advanced"),
              false,
              false,
              false
            ),
            listen_dev(
              button0,
              "click",
              prevent_default(/*setDefaults*/ ctx[6]),
              false,
              true,
              false
            ),
            listen_dev(
              form,
              "submit",
              prevent_default(/*submit*/ ctx[5]),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*current*/ 8) {
          toggle_class(li0, "active", /*current*/ ctx[3] === "Ganbarometer");
        }

        if (dirty & /*current*/ 8) {
          toggle_class(li1, "active", /*current*/ ctx[3] === "Speed");
        }

        if (dirty & /*current*/ 8) {
          toggle_class(li2, "active", /*current*/ ctx[3] === "Reviews");
        }

        if (dirty & /*current*/ 8) {
          toggle_class(li3, "active", /*current*/ ctx[3] === "Appearance");
        }

        if (dirty & /*current*/ 8) {
          toggle_class(li4, "active", /*current*/ ctx[3] === "Advanced");
        }

        if (!current || dirty & /*disabled*/ 16) {
          prop_dev(button1, "disabled", /*disabled*/ ctx[4]);
        }

        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx);

        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx, dirty);
          }
        } else {
          if (if_block) {
            group_outros();

            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });

            check_outros();
          }

          if (~current_block_type_index) {
            if_block = if_blocks[current_block_type_index];

            if (!if_block) {
              if_block = if_blocks[current_block_type_index] =
                if_block_creators[current_block_type_index](ctx);
              if_block.c();
            } else {
              if_block.p(ctx, dirty);
            }

            transition_in(if_block, 1);
            if_block.m(div2, null);
          } else {
            if_block = null;
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(form);

        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d();
        }

        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$5.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$5($$self, $$props, $$invalidate) {
    let disabled;
    let $gbSettings;
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(12, ($gbSettings = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SettingsForm", slots, []);
    let { modal } = $$props;
    let values = Object.assign({}, $gbSettings);
    let errors = {};
    let result = validate.get(); // initialize empty validation state

    const submit = () => {
      $$invalidate(0, (result = validate(values)));

      if (result.hasErrors()) {
        // flatten all errors messages to one array
        $$invalidate(2, (errors = result.getErrors()));

        return;
      }

      $$invalidate(2, (errors = {}));
      set_store_value(
        gbSettings,
        ($gbSettings = Object.assign(Object.assign({}, $gbSettings), values)),
        $gbSettings
      );
      modal.hide();
    };

    const setDefaults = () => {
      $$invalidate(1, (values = Object.assign({}, defaultSettings)));
    };

    let current = "Ganbarometer";

    const switchTo = (comp) => {
      return () => $$invalidate(3, (current = comp));
    };

    const writable_props = ["modal"];

    Object_1.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SettingsForm> was created with unknown prop '${key}'`);
    });

    function ganbarometersettings_result_binding(value) {
      result = value;
      $$invalidate(0, result);
    }

    function speedsettings_result_binding(value) {
      result = value;
      $$invalidate(0, result);
    }

    function reviewsettings_result_binding(value) {
      result = value;
      $$invalidate(0, result);
    }

    $$self.$$set = ($$props) => {
      if ("modal" in $$props) $$invalidate(8, (modal = $$props.modal));
    };

    $$self.$capture_state = () => ({
      GanbarometerSettings,
      SpeedSettings,
      ReviewSettings,
      AppearanceSettings,
      AdvancedSettings,
      defaultSettings,
      gbSettings,
      validate,
      modal,
      values,
      errors,
      result,
      submit,
      setDefaults,
      current,
      switchTo,
      disabled,
      $gbSettings,
    });

    $$self.$inject_state = ($$props) => {
      if ("modal" in $$props) $$invalidate(8, (modal = $$props.modal));
      if ("values" in $$props) $$invalidate(1, (values = $$props.values));
      if ("errors" in $$props) $$invalidate(2, (errors = $$props.errors));
      if ("result" in $$props) $$invalidate(0, (result = $$props.result));
      if ("current" in $$props) $$invalidate(3, (current = $$props.current));
      if ("disabled" in $$props) $$invalidate(4, (disabled = $$props.disabled));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*result*/ 1) {
        $$invalidate(4, (disabled = result.hasErrors()));
      }
    };

    return [
      result,
      values,
      errors,
      current,
      disabled,
      submit,
      setDefaults,
      switchTo,
      modal,
      ganbarometersettings_result_binding,
      speedsettings_result_binding,
      reviewsettings_result_binding,
    ];
  }

  class SettingsForm extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
        modal: 8,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SettingsForm",
        options,
        id: create_fragment$5.name,
      });

      const { ctx } = this.$$;
      const props = options.props || {};

      if (/*modal*/ ctx[8] === undefined && !("modal" in props)) {
        console.warn(
          "<SettingsForm> was created without expected prop 'modal'"
        );
      }
    }

    get modal() {
      throw new Error(
        "<SettingsForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set modal(value) {
      throw new Error(
        "<SettingsForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/QuizButton.svelte generated by Svelte v3.44.2 */

  const file$4 = "src/components/QuizButton.svelte";

  function create_fragment$4(ctx) {
    let button;
    let svg;
    let path0;
    let path1;
    let path2;
    let path3;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        button = element("button");
        svg = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        path2 = svg_element("path");
        path3 = svg_element("path");
        attr_dev(
          path0,
          "d",
          "M200.9,314.2l-43.7,27.5a15.4,15.4,0,0,1-21.2-4.8L31,169.9a15.4,15.4,0,0,1,4.8-21.2l57.1-35.9L144,80.7"
        );
        attr_dev(path0, "transform", "translate(-23.6 -51.3)");
        set_style(path0, "fill", "none");
        set_style(path0, "stroke", "var(--textColor)");
        set_style(path0, "stroke-linecap", "round");
        set_style(path0, "stroke-linejoin", "round");
        set_style(path0, "stroke-width", "10px");
        add_location(path0, file$4, 2, 4, 173);
        attr_dev(
          path1,
          "d",
          "M197.2,286.8,147.9,284a15.4,15.4,0,0,1-14.5-16.2l9.9-170.3.9-16.3.6-10.4a15.4,15.4,0,0,1,16.3-14.4l132,7.6a15.4,15.4,0,0,1,14.5,16.2l-.6,10"
        );
        attr_dev(path1, "transform", "translate(-23.6 -51.3)");
        set_style(path1, "fill", "none");
        set_style(path1, "stroke", "var(--textColor)");
        set_style(path1, "stroke-linecap", "round");
        set_style(path1, "stroke-linejoin", "round");
        set_style(path1, "stroke-width", "10px");
        add_location(path1, file$4, 3, 4, 434);
        attr_dev(
          path2,
          "d",
          "M200.9,314.2l.7,5.1a15.3,15.3,0,0,0,17.3,13.1L350,314.5a15.3,15.3,0,0,0,13.1-17.3L336.4,101.7a15.3,15.3,0,0,0-17.3-13.1L307,90.2,188,106.5a15.3,15.3,0,0,0-13.1,17.3l22.3,163Z"
        );
        attr_dev(path2, "transform", "translate(-23.6 -51.3)");
        set_style(path2, "fill", "none");
        set_style(path2, "stroke", "var(--textColor)");
        set_style(path2, "stroke-linecap", "round");
        set_style(path2, "stroke-linejoin", "round");
        set_style(path2, "stroke-width", "10px");
        add_location(path2, file$4, 4, 4, 733);
        set_style(path3, "fill", "var(--textColor)");
        set_style(path3, "stroke", "none");
        set_style(path3, "stroke-linecap", "round");
        set_style(path3, "stroke-linejoin", "round");
        set_style(path3, "stroke-width", "10px");
        attr_dev(
          path3,
          "d",
          "M306.6,155.8c7.9-1.8,12.3.4,14.1,7.8l3.8,16.2c.6,2.5-.8,4.5-4.2,5.2s-5.3-.3-5.9-2.8L311,167.9c-.7-3.1-2.1-3.5-5.1-2.7l-90.6,21.4c-2.8.6-4,1.6-3.3,4.7l3.4,14.3c.6,2.5-1.1,4.5-4.1,5.2s-5.4-.3-5.9-2.8l-3.9-16.3c-1.7-7.3,1.1-11.3,9.1-13.2l14.6-3.5a151.7,151.7,0,0,0-11.7-10.7,3.8,3.8,0,0,1-1.3-1.9c-.4-1.5.4-3.2,2.2-4.3a10,10,0,0,1,2.5-1,5.2,5.2,0,0,1,4.6.8,144.6,144.6,0,0,1,14.9,14.5l19.7-4.7a110.2,110.2,0,0,0-10.9-12.4,3.6,3.6,0,0,1-1.2-1.7c-.4-1.7.6-3.4,2.6-4.6l2.1-.9a5,5,0,0,1,5,1.6,87.1,87.1,0,0,1,12.9,15.6l14.6-3.5a80.5,80.5,0,0,0,6.4-19.3,4.7,4.7,0,0,1,3.6-3.6,8.6,8.6,0,0,1,2.8-.1c2.5.2,3.9,1.3,4.3,3a2.8,2.8,0,0,1-.1,2,71.7,71.7,0,0,1-5.8,15.4Zm-60.2,94.6c-7.4,1.8-11.6-.4-13.2-7.3l-9.1-38.5c-1.7-7.2,1.2-10.8,9.2-12.7L292,178c8-1.9,12.3.1,14,7.2l9.1,38.5c1.6,6.9-1.1,10.7-8.6,12.5l-12.7,3,4,16.7c.7,3,2.1,3.9,4.2,3.7s6.5-1,13.1-2.6,9.9-2.3,12.1-3.5a6,6,0,0,0,3.7-4.1c.5-2.2.2-6-.6-11.4-.5-2.3.7-4.2,3.6-4.9l1.1-.3c3.4-.5,5.3,1.1,6,3.7v.3c1,6.2,1.2,13.7,0,17s-4,5.9-8,7.7-7.9,2.9-16.1,4.9-15.1,3.4-18.6,3.5c-5.1,0-8.9-2.1-10.4-8.3l-4.7-19.9-17.5,4.2c.3,19.7-14,33.8-37.1,43.2a3.1,3.1,0,0,1-1.2.5,5.2,5.2,0,0,1-6.4-3.2,3.5,3.5,0,0,1-.5-1.3c-.6-2.6.7-4.7,3.2-5.7,20-7.7,30.7-17.5,31.1-31Zm51.5-56.1-1.3-5.8c-.6-2.5-2-2.9-4.5-2.3l-55.2,13c-2.5.6-3.5,1.6-3,4.1l1.4,5.8Zm3.9,16.5-2.1-8.9-62.6,14.8,2.1,8.9ZM241,233.2l1.6,6.6c.6,2.5,2,2.9,4.5,2.3l55.1-13c2.5-.6,3.6-1.6,3-4.1l-1.6-6.6Z"
        );
        attr_dev(path3, "transform", "translate(-23.6 -51.3)");
        add_location(path3, file$4, 5, 4, 1067);
        attr_dev(svg, "id", "b76ee484-33fd-42f4-92f5-780eb817404e");
        attr_dev(svg, "data-name", "Layer 1");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 344.6 297.7");
        add_location(svg, file$4, 1, 2, 40);
        attr_dev(button, "class", "quiz-button svelte-o42zy6");
        add_location(button, file$4, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, button, anchor);
        append_dev(button, svg);
        append_dev(svg, path0);
        append_dev(svg, path1);
        append_dev(svg, path2);
        append_dev(svg, path3);

        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/ ctx[0],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(button);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$4.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$4($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("QuizButton", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<QuizButton> was created with unknown prop '${key}'`);
    });

    function click_handler(event) {
      bubble.call(this, $$self, event);
    }

    return [click_handler];
  }

  class QuizButton extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "QuizButton",
        options,
        id: create_fragment$4.name,
      });
    }
  }

  /* src/components/SettingsButton.svelte generated by Svelte v3.44.2 */

  const file$3 = "src/components/SettingsButton.svelte";

  function create_fragment$3(ctx) {
    let button;
    let svg;
    let path;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        button = element("button");
        svg = svg_element("svg");
        path = svg_element("path");
        attr_dev(
          path,
          "d",
          "M163.5,98h180m-287,0h30m226,102h31m-287,0h179m-72,102h180m-287,0h30m77-204.5A38.5,38.5,0,1,0,125,136,38.5,38.5,0,0,0,163.5,97.5ZM125,264a38.5,38.5,0,1,0,38.5,38.5A38.5,38.5,0,0,0,125,264ZM274,161a38.5,38.5,0,1,0,38.5,38.5A38.5,38.5,0,0,0,274,161Z"
        );
        attr_dev(path, "transform", "translate(-51.5 -54)");
        set_style(path, "fill", "none");
        set_style(path, "stroke", "var(--textColor)");
        set_style(path, "stroke-linecap", "round");
        set_style(path, "stroke-linejoin", "round");
        set_style(path, "stroke-width", "10px");
        add_location(path, file$3, 2, 4, 189);
        attr_dev(svg, "id", "edd52277-873a-4c78-9f5a-11032a27aff1");
        attr_dev(svg, "data-name", "Layer 1");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 297 292");
        add_location(svg, file$3, 1, 2, 60);
        attr_dev(button, "aria-label", "settings");
        attr_dev(button, "class", "settings svelte-1jfd1ka");
        add_location(button, file$3, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, button, anchor);
        append_dev(button, svg);
        append_dev(svg, path);

        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/ ctx[0],
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(button);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$3.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$3($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SettingsButton", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SettingsButton> was created with unknown prop '${key}'`);
    });

    function click_handler(event) {
      bubble.call(this, $$self, event);
    }

    return [click_handler];
  }

  class SettingsButton extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SettingsButton",
        options,
        id: create_fragment$3.name,
      });
    }
  }

  /* nDaysAgo() returns date object for 00:00:00 local time, n full days before now
   *
   * e.g. if now is 11/5/2021 01:02:03 local time,
   * then dayStartDaysAgo(3) returns a Date object for
   * 11/2/2021 00:00:00 local time
   */
  const nDaysAgo = (n = 0) => {
    const now = new Date();
    let midnight =
      now.getTime() -
      now.getHours() * 3600 * 1000 -
      now.getMinutes() * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();
    let retval;
    if (n > 1) {
      retval = new Date(midnight - (n - 1) * 24 * 3600 * 1000);
    } else {
      retval = new Date(midnight);
    }
    return retval;
  };
  const inSameDay = (x, ref) => {
    return (
      x.getDate() === ref.getDate() &&
      x.getMonth() === ref.getMonth() &&
      x.getFullYear() === ref.getFullYear()
    );
  };
  // find the median in an array of numbers
  const median = (array) => {
    if (array.length === 0) {
      return 0;
    }
    const sorted = array.slice().sort((a, b) => a - b);
    const half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) {
      return sorted[half];
    }
    return (sorted[half - 1] + sorted[half]) / 2.0;
  };

  const findSessionEnds = (reviews) => {
    const durations = reviews.map((r) => r.duration);
    const min_duration = Math.min(...durations);
    Math.max(...durations);
    // Heuristic: no duration > 10min means single-review sessions
    if (min_duration > 1000 * 60 * 10) {
      return durations.map((r, i) => i);
    } else {
      // Use the "Median absolute deviation" to find outlier durations that
      // indicate the start of a new session.
      // See this blog post for an excellent description of MAD:
      // https://hausetutorials.netlify.app/posts/2019-10-07-outlier-detection-with-median-absolute-deviation/
      // first find the deviations from the median
      const median_duration = median(durations);
      const duration_deviations = reviews.map((r) =>
        Math.abs(r.duration - median_duration)
      );
      // Assume normal distribution
      const MAD_K = 1.4826;
      // Next, find the median of the deviations (assume normal distribution of
      // durations within a session -- this is where 1.4826 comes from)
      const median_absolute_deviation = median(duration_deviations) * MAD_K;
      // Now, calculate the MAD for each duration
      const initial_mads = duration_deviations.map((d) => {
        return median_absolute_deviation > 0
          ? Math.abs(d - median_duration) / median_absolute_deviation
          : Math.abs(d - median_duration) / median_duration;
      });
      // Cutoff value: MAD values greater than the cuttoff indicate the start of a
      // new session, lower values find more sessions
      const MAD_CUTOFF = 10.0;
      // Force final duration MAD to be huge if it isn't already since the last
      // review is always the end of a session
      const duration_mads =
        initial_mads[initial_mads.length - 1] > MAD_CUTOFF
          ? initial_mads
          : [...initial_mads.slice(0, -1), 999999];
      // Say 3 sessions in 12 reviews: reviews 0-3, 4-5, and 6-12
      // Want to reate arrays of start and end indices such that:
      //   starts = [0, 4, 6]
      //   ends   = [3, 5, 12]
      // Note that reviews 3, 5, and 12 will have a duration MAD > MAD_CUTOFF
      const indices = reviews.map((r, i) => i);
      const filtered = indices.filter((r, i) => duration_mads[i] > MAD_CUTOFF);
      return filtered;
    }
  };
  // Get sessions from n days ago
  const parseSessions = (reviews) => {
    if (reviews.length === 0) {
      return [];
    }
    // Find the indices of reviews with long durations (indicating the end of a
    // session)
    const session_ends = findSessionEnds(reviews);
    // First start is always index 0, then the index after the end of each
    // session (slice off the last start to keep ends[] and starts[] the
    // same length)
    const session_starts = [0, ...session_ends.map((i) => i + 1)].slice(0, -1);
    // Create some "proto Sessions" objects for these review sequences
    const sessionSlices = session_ends.map((end, i) => {
      return {
        reviews: reviews.slice(session_starts[i], end + 1),
      };
    });
    // Finally, flesh out the rest of the session object
    return sessionSlices.map((reviewSlice) => {
      return {
        questions: reviewSlice.reviews.reduce(
          (acc, review) => acc + review.questions,
          0
        ),
        reading_incorrect: reviewSlice.reviews.reduce(
          (acc, review) => acc + review.reading_incorrect,
          0
        ),
        meaning_incorrect: reviewSlice.reviews.reduce(
          (acc, review) => acc + review.meaning_incorrect,
          0
        ),
        startTime: reviewSlice.reviews[0].started,
        endTime: reviewSlice.reviews[reviewSlice.reviews.length - 1].started,
        reviews: reviewSlice.reviews,
      };
    });
  };
  const findSessSummaries = (reviews) => {
    const sessions = parseSessions(reviews);
    let summaries = [];
    sessions.forEach((s) => {
      const totalQuestions = s.reviews.reduce(
        (acc, r) => (acc += r.questions),
        0
      );
      const incorrectAnswers = s.reviews.reduce(
        (acc, r) => (acc += r.meaning_incorrect + r.reading_incorrect),
        0
      );
      const correctAnswers = totalQuestions - incorrectAnswers;
      const summary = {
        start: s.startTime,
        end: s.endTime,
        reviewCount: s.reviews.length,
        questionCount: totalQuestions,
        correctAnswerCount: correctAnswers,
      };
      summaries.push(summary);
    });
    return summaries;
  };

  let subjectIndex;
  const getSubject = async (id) => {
    if (!subjectIndex || !subjectIndex[id]) {
      wkof.include("ItemData");
      await wkof.ready("ItemData");
      let subjects = await wkof.ItemData.get_items(); // retrieve all subjects
      subjectIndex = await wkof.ItemData.get_index(subjects, "subject_id");
    }
    return subjectIndex[id];
  };

  // create a processed review from the raw review JSON returned from server
  // (populates everything except the duration)
  const initializeReview = (r) => {
    return {
      subject_id: r.data.subject_id,
      started: new Date(r.data.created_at),
      duration: 0,
      reading_incorrect: +r.data.incorrect_reading_answers,
      meaning_incorrect: +r.data.incorrect_meaning_answers,
      questions: 0,
    };
  };
  // calculate duration of reviews by peeking at next in sequence
  // (duration is review-start to review-start)
  // NOTE: doesn't change duration of final review in array
  const calculateDuration = (r, i, array) => {
    if (array[i + 1]) {
      const nextms = array[i + 1].started.getTime();
      const thisms = r.started.getTime();
      if (nextms < thisms) {
        throw "Reviews not in sequential creation order!";
      }
      return Object.assign(Object.assign({}, r), { duration: nextms - thisms });
    } else {
      return r; // final review unchanged
    }
  };
  const calculateQuestions = async (reviews) => {
    let reviewsCopy = reviews.slice();
    for (let review of reviewsCopy) {
      const subject = await getSubject(+review.subject_id);
      review.questions = subject.object === "radical" ? 1 : 2;
      review.questions += review.meaning_incorrect + review.reading_incorrect;
    }
    return reviewsCopy;
  };
  const compareReviewDates = (a, b) => {
    var _a, _b;
    const a_date = new Date(
      (_a = a === null || a === void 0 ? void 0 : a.data) === null ||
      _a === void 0
        ? void 0
        : _a.created_at
    ).getTime();
    const b_date = new Date(
      (_b = b === null || b === void 0 ? void 0 : b.data) === null ||
      _b === void 0
        ? void 0
        : _b.created_at
    ).getTime();
    return a_date - b_date;
  };
  // Turn array of RawReviews into array processed reviews
  const processReviews = async (reviews) => {
    if (!(reviews === null || reviews === void 0 ? void 0 : reviews.length)) {
      return [];
    }
    const converted = reviews.map(initializeReview).map(calculateDuration);
    const processed = await calculateQuestions(converted);
    // Just assume the final review duration was the median of the prior reviews
    // (no way to know actual duration)
    let durations = processed.slice(0, -1).map((r) => r.duration);
    let medianInterval = median(durations);
    if (processed.length) {
      processed[processed.length - 1].duration = medianInterval;
    }
    return processed;
  };
  const getReviews = async (n) => {
    const fromDate = nDaysAgo(n);
    // First retrieve raw reviews
    wkof.include("Apiv2");
    await wkof.ready("Apiv2");
    const collection = await wkof.Apiv2.fetch_endpoint("reviews", {
      last_update: fromDate.toISOString(),
    });
    // Need to filter and sort reviews in case they are using an offline review app
    const sortedReviews =
      collection === null || collection === void 0
        ? void 0
        : collection.data
            .filter((r) => {
              var _a;
              return (
                new Date(
                  (_a = r === null || r === void 0 ? void 0 : r.data) ===
                    null || _a === void 0
                    ? void 0
                    : _a.created_at
                ).getTime() >= fromDate.getTime()
              );
            })
            .sort(compareReviewDates);
    return processReviews(sortedReviews);
  };
  const calculateCounts = (reviews) => {
    const reviewsEachDay = reviews
      // first filter to one review per unique day
      .filter((r, i) =>
        i > 0 ? !inSameDay(r.started, reviews[i - 1].started) : true
      )
      // convert those reviews to just a date
      .map((r) => r.started)
      // finally, convert those dates to array of reviews on that date
      .map((date) => reviews.filter((r) => inSameDay(r.started, date)));
    let counts = [];
    reviewsEachDay.forEach((reviewAry, i) => {
      const readingCorrect = reviewAry
        .filter((r) => r.reading_incorrect === 0)
        .reduce((acc, r) => (acc += 1), 0);
      const meaningCorrect = reviewAry
        .filter((r) => r.meaning_incorrect === 0)
        .reduce((acc, r) => (acc += 1), 0);
      const bothCorrect = reviewAry
        .filter((r) => r.meaning_incorrect + r.reading_incorrect === 0)
        .reduce((acc, r) => (acc += 1), 0);
      const questionCount = reviewAry.reduce(
        (acc, r) => (acc += r.questions),
        0
      );
      const itemCount = reviewAry.length;
      const count = {
        start: reviewAry[0].started,
        end: reviewAry[reviewAry.length - 1].started,
        review_count: reviewAry.length,
        question_count: questionCount,
        accuracy: bothCorrect / itemCount,
        reading_accuracy: readingCorrect / itemCount,
        meaning_accuracy: meaningCorrect / itemCount,
      };
      counts.push(count);
    });
    return counts;
  };

  const durationUnitRegex = /[a-zA-Z]/;
  const range = (size, startAt = 0) =>
    [...Array(size).keys()].map((i) => i + startAt);
  // export const characterRange = (startChar, endChar) =>
  //   String.fromCharCode(
  //     ...range(
  //       endChar.charCodeAt(0) - startChar.charCodeAt(0),
  //       startChar.charCodeAt(0)
  //     )
  //   );
  // export const zip = (arr, ...arrs) =>
  //   arr.map((val, i) => arrs.reduce((list, curr) => [...list, curr[i]], [val]));

  /* node_modules/svelte-loading-spinners/dist/SyncLoader.svelte generated by Svelte v3.44.2 */
  const file$2 = "node_modules/svelte-loading-spinners/dist/SyncLoader.svelte";

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }

  // (61:2) {#each range(3, 1) as i}
  function create_each_block(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "dot svelte-14w6xk7");
        set_style(
          div,
          "--dotSize",
          +(/*size*/ ctx[3]) * 0.25 + /*unit*/ ctx[1]
        );
        set_style(div, "--color", /*color*/ ctx[0]);
        set_style(
          div,
          "animation-delay",
          /*i*/ ctx[6] * (+(/*durationNum*/ ctx[5]) / 10) +
            /*durationUnit*/ ctx[4]
        );
        add_location(div, file$2, 61, 4, 1491);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      p: function update(ctx, dirty) {
        if (dirty & /*size, unit*/ 10) {
          set_style(
            div,
            "--dotSize",
            +(/*size*/ ctx[3]) * 0.25 + /*unit*/ ctx[1]
          );
        }

        if (dirty & /*color*/ 1) {
          set_style(div, "--color", /*color*/ ctx[0]);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block.name,
      type: "each",
      source: "(61:2) {#each range(3, 1) as i}",
      ctx,
    });

    return block;
  }

  function create_fragment$2(ctx) {
    let div;
    let each_value = range(3, 1);
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }

    const block = {
      c: function create() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr_dev(div, "class", "wrapper svelte-14w6xk7");
        set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
        set_style(div, "--duration", /*duration*/ ctx[2]);
        add_location(div, file$2, 59, 0, 1383);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
      },
      p: function update(ctx, [dirty]) {
        if (
          dirty & /*size, unit, color, range, durationNum, durationUnit*/ 59
        ) {
          each_value = range(3, 1);
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }

        if (dirty & /*size, unit*/ 10) {
          set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
        }

        if (dirty & /*duration*/ 4) {
          set_style(div, "--duration", /*duration*/ ctx[2]);
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_each(each_blocks, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$2.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SyncLoader", slots, []);
    let { color = "#FF3E00" } = $$props;
    let { unit = "px" } = $$props;
    let { duration = "0.6s" } = $$props;
    let { size = "60" } = $$props;
    let durationUnit = duration.match(durationUnitRegex)[0];
    let durationNum = duration.replace(durationUnitRegex, "");
    const writable_props = ["color", "unit", "duration", "size"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SyncLoader> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("color" in $$props) $$invalidate(0, (color = $$props.color));
      if ("unit" in $$props) $$invalidate(1, (unit = $$props.unit));
      if ("duration" in $$props) $$invalidate(2, (duration = $$props.duration));
      if ("size" in $$props) $$invalidate(3, (size = $$props.size));
    };

    $$self.$capture_state = () => ({
      range,
      durationUnitRegex,
      color,
      unit,
      duration,
      size,
      durationUnit,
      durationNum,
    });

    $$self.$inject_state = ($$props) => {
      if ("color" in $$props) $$invalidate(0, (color = $$props.color));
      if ("unit" in $$props) $$invalidate(1, (unit = $$props.unit));
      if ("duration" in $$props) $$invalidate(2, (duration = $$props.duration));
      if ("size" in $$props) $$invalidate(3, (size = $$props.size));
      if ("durationUnit" in $$props)
        $$invalidate(4, (durationUnit = $$props.durationUnit));
      if ("durationNum" in $$props)
        $$invalidate(5, (durationNum = $$props.durationNum));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [color, unit, duration, size, durationUnit, durationNum];
  }

  class SyncLoader extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
        color: 0,
        unit: 1,
        duration: 2,
        size: 3,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SyncLoader",
        options,
        id: create_fragment$2.name,
      });
    }

    get color() {
      throw new Error(
        "<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set color(value) {
      throw new Error(
        "<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get unit() {
      throw new Error(
        "<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set unit(value) {
      throw new Error(
        "<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get duration() {
      throw new Error(
        "<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set duration(value) {
      throw new Error(
        "<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    get size() {
      throw new Error(
        "<SyncLoader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }

    set size(value) {
      throw new Error(
        "<SyncLoader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
      );
    }
  }

  /* src/components/Ganbarometer.svelte generated by Svelte v3.44.2 */

  const { console: console_1 } = globals;
  const file$1 = "src/components/Ganbarometer.svelte";

  // (73:2) {#if loading}
  function create_if_block_1(ctx) {
    let div;
    let syncloader;
    let div_transition;
    let current;

    syncloader = new SyncLoader({
      props: {
        color: /*$gbSettings*/ ctx[0].warnColor,
        size: "25",
        unit: "px",
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        create_component(syncloader.$$.fragment);
        attr_dev(div, "class", "spinner svelte-omqo3m");
        add_location(div, file$1, 73, 4, 2907);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(syncloader, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        const syncloader_changes = {};
        if (dirty & /*$gbSettings*/ 1)
          syncloader_changes.color = /*$gbSettings*/ ctx[0].warnColor;
        syncloader.$set(syncloader_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(syncloader.$$.fragment, local);

        add_render_callback(() => {
          if (!div_transition)
            div_transition = create_bidirectional_transition(
              div,
              fade,
              {},
              true
            );
          div_transition.run(1);
        });

        current = true;
      },
      o: function outro(local) {
        transition_out(syncloader.$$.fragment, local);
        if (!div_transition)
          div_transition = create_bidirectional_transition(
            div,
            fade,
            {},
            false
          );
        div_transition.run(0);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(syncloader);
        if (detaching && div_transition) div_transition.end();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1.name,
      type: "if",
      source: "(73:2) {#if loading}",
      ctx,
    });

    return block;
  }

  // (84:4) {#if ssQuizPresent}
  function create_if_block$1(ctx) {
    let quizbutton;
    let current;
    quizbutton = new QuizButton({ $$inline: true });
    quizbutton.$on("click", /*ssQuizLauncher*/ ctx[6]);

    const block = {
      c: function create() {
        create_component(quizbutton.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(quizbutton, target, anchor);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(quizbutton.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(quizbutton.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(quizbutton, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$1.name,
      type: "if",
      source: "(84:4) {#if ssQuizPresent}",
      ctx,
    });

    return block;
  }

  // (97:0) <Modal bind:this={modal} >
  function create_default_slot(ctx) {
    let settingsform;
    let current;
    settingsform = new SettingsForm({ props: { modal }, $$inline: true });

    const block = {
      c: function create() {
        create_component(settingsform.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(settingsform, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const settingsform_changes = {};
        if (dirty & /*modal*/ 0) settingsform_changes.modal = modal;
        settingsform.$set(settingsform_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(settingsform.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(settingsform.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(settingsform, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot.name,
      type: "slot",
      source: "(97:0) <Modal bind:this={modal} >",
      ctx,
    });

    return block;
  }

  function create_fragment$1(ctx) {
    let div2;
    let nav;
    let li0;
    let t1;
    let li1;
    let t3;
    let t4;
    let div0;
    let rangeslider;
    let updating_values;
    let t5;
    let div1;
    let t6;
    let settingsbutton;
    let t7;
    let div3;
    let gbwidget;
    let t8;
    let speedwidget;
    let t9;
    let reviewswidget;
    let t10;
    let modal_1;
    let current;
    let mounted;
    let dispose;
    let if_block0 = /*loading*/ ctx[2] && create_if_block_1(ctx);

    function rangeslider_values_binding(value) {
      /*rangeslider_values_binding*/ ctx[9](value);
    }

    let rangeslider_props = {
      float: true,
      pips: true,
      suffix: /*suffix*/ ctx[4],
      min: 1,
      max: 7,
    };

    if (/*$daysToReview*/ ctx[1] !== void 0) {
      rangeslider_props.values = /*$daysToReview*/ ctx[1];
    }

    rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    binding_callbacks.push(() =>
      bind(rangeslider, "values", rangeslider_values_binding)
    );
    let if_block1 = /*ssQuizPresent*/ ctx[3] && create_if_block$1(ctx);
    settingsbutton = new SettingsButton({ $$inline: true });
    settingsbutton.$on("click", /*click_handler_2*/ ctx[10]);
    gbwidget = new GbWidget({ $$inline: true });
    speedwidget = new SpeedWidget({ $$inline: true });
    reviewswidget = new ReviewsWidget({ $$inline: true });

    let modal_1_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx },
    };

    modal_1 = new Modal({ props: modal_1_props, $$inline: true });
    /*modal_1_binding*/ ctx[11](modal_1);

    const block = {
      c: function create() {
        div2 = element("div");
        nav = element("nav");
        li0 = element("li");
        li0.textContent = "Graphs";
        t1 = space();
        li1 = element("li");
        li1.textContent = "Data";
        t3 = space();
        if (if_block0) if_block0.c();
        t4 = space();
        div0 = element("div");
        create_component(rangeslider.$$.fragment);
        t5 = space();
        div1 = element("div");
        if (if_block1) if_block1.c();
        t6 = space();
        create_component(settingsbutton.$$.fragment);
        t7 = space();
        div3 = element("div");
        create_component(gbwidget.$$.fragment);
        t8 = space();
        create_component(speedwidget.$$.fragment);
        t9 = space();
        create_component(reviewswidget.$$.fragment);
        t10 = space();
        create_component(modal_1.$$.fragment);
        attr_dev(li0, "class", "svelte-omqo3m");
        toggle_class(li0, "active", /*$display*/ ctx[5] === "chart");
        add_location(li0, file$1, 68, 4, 2663);
        attr_dev(li1, "class", "svelte-omqo3m");
        toggle_class(li1, "active", /*$display*/ ctx[5] === "data");
        add_location(li1, file$1, 69, 4, 2774);
        attr_dev(nav, "class", "chart-data-nav svelte-omqo3m");
        add_location(nav, file$1, 67, 2, 2630);
        attr_dev(div0, "class", "dayRange svelte-omqo3m");
        attr_dev(div0, "data-testid", "daySlider");
        add_location(div0, file$1, 78, 2, 3038);
        attr_dev(div1, "class", "action-buttons svelte-omqo3m");
        add_location(div1, file$1, 82, 2, 3181);
        attr_dev(div2, "class", "controls svelte-omqo3m");
        add_location(div2, file$1, 66, 0, 2605);
        attr_dev(div3, "data-testid", "gbwidgets");
        attr_dev(div3, "class", "gbwidgets svelte-omqo3m");
        add_location(div3, file$1, 90, 0, 3363);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div2, anchor);
        append_dev(div2, nav);
        append_dev(nav, li0);
        append_dev(nav, t1);
        append_dev(nav, li1);
        append_dev(div2, t3);
        if (if_block0) if_block0.m(div2, null);
        append_dev(div2, t4);
        append_dev(div2, div0);
        mount_component(rangeslider, div0, null);
        append_dev(div2, t5);
        append_dev(div2, div1);
        if (if_block1) if_block1.m(div1, null);
        append_dev(div1, t6);
        mount_component(settingsbutton, div1, null);
        insert_dev(target, t7, anchor);
        insert_dev(target, div3, anchor);
        mount_component(gbwidget, div3, null);
        append_dev(div3, t8);
        mount_component(speedwidget, div3, null);
        append_dev(div3, t9);
        mount_component(reviewswidget, div3, null);
        insert_dev(target, t10, anchor);
        mount_component(modal_1, target, anchor);
        current = true;

        if (!mounted) {
          dispose = [
            listen_dev(
              li0,
              "click",
              prevent_default(/*click_handler*/ ctx[7]),
              false,
              true,
              false
            ),
            listen_dev(
              li1,
              "click",
              prevent_default(/*click_handler_1*/ ctx[8]),
              false,
              true,
              false
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*$display*/ 32) {
          toggle_class(li0, "active", /*$display*/ ctx[5] === "chart");
        }

        if (dirty & /*$display*/ 32) {
          toggle_class(li1, "active", /*$display*/ ctx[5] === "data");
        }

        if (/*loading*/ ctx[2]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);

            if (dirty & /*loading*/ 4) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_1(ctx);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div2, t4);
          }
        } else if (if_block0) {
          group_outros();

          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });

          check_outros();
        }

        const rangeslider_changes = {};
        if (dirty & /*suffix*/ 16)
          rangeslider_changes.suffix = /*suffix*/ ctx[4];

        if (!updating_values && dirty & /*$daysToReview*/ 2) {
          updating_values = true;
          rangeslider_changes.values = /*$daysToReview*/ ctx[1];
          add_flush_callback(() => (updating_values = false));
        }

        rangeslider.$set(rangeslider_changes);

        if (/*ssQuizPresent*/ ctx[3]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);

            if (dirty & /*ssQuizPresent*/ 8) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$1(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, t6);
          }
        } else if (if_block1) {
          group_outros();

          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });

          check_outros();
        }

        const modal_1_changes = {};

        if (dirty & /*$$scope, modal*/ 65536) {
          modal_1_changes.$$scope = { dirty, ctx };
        }

        modal_1.$set(modal_1_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block0);
        transition_in(rangeslider.$$.fragment, local);
        transition_in(if_block1);
        transition_in(settingsbutton.$$.fragment, local);
        transition_in(gbwidget.$$.fragment, local);
        transition_in(speedwidget.$$.fragment, local);
        transition_in(reviewswidget.$$.fragment, local);
        transition_in(modal_1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block0);
        transition_out(rangeslider.$$.fragment, local);
        transition_out(if_block1);
        transition_out(settingsbutton.$$.fragment, local);
        transition_out(gbwidget.$$.fragment, local);
        transition_out(speedwidget.$$.fragment, local);
        transition_out(reviewswidget.$$.fragment, local);
        transition_out(modal_1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div2);
        if (if_block0) if_block0.d();
        destroy_component(rangeslider);
        if (if_block1) if_block1.d();
        destroy_component(settingsbutton);
        if (detaching) detach_dev(t7);
        if (detaching) detach_dev(div3);
        destroy_component(gbwidget);
        destroy_component(speedwidget);
        destroy_component(reviewswidget);
        if (detaching) detach_dev(t10);
        /*modal_1_binding*/ ctx[11](null);
        destroy_component(modal_1, detaching);
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$1.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  let modal;

  function instance$1($$self, $$props, $$invalidate) {
    let suffix;
    let filter;
    let $gbSettings;
    let $daysToReview;
    let $sessionSummaries;
    let $reviewCounts;
    let $display;
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(0, ($gbSettings = $$value))
    );
    validate_store(daysToReview, "daysToReview");
    component_subscribe($$self, daysToReview, ($$value) =>
      $$invalidate(1, ($daysToReview = $$value))
    );
    validate_store(sessionSummaries, "sessionSummaries");
    component_subscribe($$self, sessionSummaries, ($$value) =>
      $$invalidate(13, ($sessionSummaries = $$value))
    );
    validate_store(reviewCounts, "reviewCounts");
    component_subscribe($$self, reviewCounts, ($$value) =>
      $$invalidate(14, ($reviewCounts = $$value))
    );
    validate_store(display, "display");
    component_subscribe($$self, display, ($$value) =>
      $$invalidate(5, ($display = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Ganbarometer", slots, []);
    let loading = false;

    const updateSummaries = async (days) => {
      $$invalidate(2, (loading = true));
      let reviews;

      try {
        reviews = await getReviews(days);
      } catch (error) {
        console.warn(error);
      }

      set_store_value(
        reviewCounts,
        ($reviewCounts = calculateCounts(reviews)),
        $reviewCounts
      );
      set_store_value(
        sessionSummaries,
        ($sessionSummaries = findSessSummaries(reviews)),
        $sessionSummaries
      );
      $$invalidate(2, (loading = false));
    };

    let ssQuizPresent = false;

    wkof.wait_state("ss_quiz", "ready").then(() => {
      if (
        typeof (ss_quiz === null || ss_quiz === void 0
          ? void 0
          : ss_quiz.open) === "function"
      )
        $$invalidate(3, (ssQuizPresent = true));
    });

    const ssQuizLauncher = async () => {
      await wkof.wait_state("ss_quiz", "ready");

      ss_quiz.open({
        ipreset: {
          name: `New ${filter}`,
          content: {
            wk_items: {
              enabled: true,
              filters: {
                srs: {
                  enabled: true,
                  value: { appr1: true, appr2: true },
                },
                item_type: { enabled: true, value: filter },
              },
            },
          },
        },
      });
    };

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console_1.warn(`<Ganbarometer> was created with unknown prop '${key}'`);
    });

    const click_handler = () =>
      set_store_value(display, ($display = "chart"), $display);
    const click_handler_1 = () =>
      set_store_value(display, ($display = "data"), $display);

    function rangeslider_values_binding(value) {
      $daysToReview = value;
      daysToReview.set($daysToReview);
    }

    const click_handler_2 = () => modal.show();

    function modal_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        modal = $$value;
      });
    }

    $$self.$capture_state = () => ({
      modal,
      RangeSlider,
      GbWidget,
      SpeedWidget,
      ReviewsWidget,
      Modal,
      SettingsForm,
      QuizButton,
      SettingsButton,
      findSessSummaries,
      getReviews,
      calculateCounts,
      gbSettings,
      display,
      daysToReview,
      sessionSummaries,
      reviewCounts,
      fade,
      SyncLoader,
      loading,
      updateSummaries,
      ssQuizPresent,
      ssQuizLauncher,
      filter,
      suffix,
      $gbSettings,
      $daysToReview,
      $sessionSummaries,
      $reviewCounts,
      $display,
    });

    $$self.$inject_state = ($$props) => {
      if ("loading" in $$props) $$invalidate(2, (loading = $$props.loading));
      if ("ssQuizPresent" in $$props)
        $$invalidate(3, (ssQuizPresent = $$props.ssQuizPresent));
      if ("filter" in $$props) filter = $$props.filter;
      if ("suffix" in $$props) $$invalidate(4, (suffix = $$props.suffix));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*$daysToReview*/ 2) {
        updateSummaries($daysToReview[0]);
      }

      if ($$self.$$.dirty & /*$daysToReview*/ 2) {
        $$invalidate(4, (suffix = $daysToReview[0] > 1 ? " days" : " day"));
      }

      if ($$self.$$.dirty & /*$gbSettings*/ 1) {
        filter =
          $gbSettings.rQuiz && $gbSettings.kQuiz && $gbSettings.vQuiz
            ? "rad,kan,voc"
            : $gbSettings.rQuiz && $gbSettings.kQuiz && !$gbSettings.vQuiz
            ? "rad,kan"
            : $gbSettings.rQuiz && !$gbSettings.kQuiz && $gbSettings.vQuiz
            ? "rad,voc"
            : $gbSettings.rQuiz && !$gbSettings.kQuiz && !$gbSettings.vQuiz
            ? "rad"
            : !$gbSettings.rQuiz && $gbSettings.kQuiz && $gbSettings.vQuiz
            ? "kan,voc"
            : !$gbSettings.rQuiz && $gbSettings.kQuiz && !$gbSettings.vQuiz
            ? "kan"
            : !$gbSettings.rQuiz && !$gbSettings.kQuiz && $gbSettings.vQuiz
            ? "voc"
            : "rad,kan,voc";
      }
    };

    return [
      $gbSettings,
      $daysToReview,
      loading,
      ssQuizPresent,
      suffix,
      $display,
      ssQuizLauncher,
      click_handler,
      click_handler_1,
      rangeslider_values_binding,
      click_handler_2,
      modal_1_binding,
    ];
  }

  class Ganbarometer extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Ganbarometer",
        options,
        id: create_fragment$1.name,
      });
    }
  }

  /* src/App.svelte generated by Svelte v3.44.2 */
  const file = "src/App.svelte";

  // (20:2) {:else}
  function create_else_block(ctx) {
    let div;
    let h2;
    let t1;
    let p0;
    let t3;
    let p1;
    let t4;
    let a;

    const block = {
      c: function create() {
        div = element("div");
        h2 = element("h2");
        h2.textContent = "GanbarOmeter";
        t1 = space();
        p0 = element("p");
        p0.textContent =
          "The GanbarOmeter needs the Wankani Open Framework to be installed prior to use.";
        t3 = space();
        p1 = element("p");
        t4 = text("Please refer to the ");
        a = element("a");
        a.textContent = "WKOF\r\n    installation instructions.";
        add_location(h2, file, 21, 4, 707);
        add_location(p0, file, 22, 4, 736);
        attr_dev(
          a,
          "href",
          "http://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549"
        );
        add_location(a, file, 26, 27, 872);
        add_location(p1, file, 26, 4, 849);
        attr_dev(div, "class", "placeholder svelte-3pkdxk");
        add_location(div, file, 20, 2, 676);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        append_dev(div, h2);
        append_dev(div, t1);
        append_dev(div, p0);
        append_dev(div, t3);
        append_dev(div, p1);
        append_dev(p1, t4);
        append_dev(p1, a);
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block.name,
      type: "else",
      source: "(20:2) {:else}",
      ctx,
    });

    return block;
  }

  // (18:2) {#if wkofLoaded }
  function create_if_block(ctx) {
    let ganbarometer;
    let current;
    ganbarometer = new Ganbarometer({ $$inline: true });

    const block = {
      c: function create() {
        create_component(ganbarometer.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(ganbarometer, target, anchor);
        current = true;
      },
      i: function intro(local) {
        if (current) return;
        transition_in(ganbarometer.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(ganbarometer.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(ganbarometer, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block.name,
      type: "if",
      source: "(18:2) {#if wkofLoaded }",
      ctx,
    });

    return block;
  }

  function create_fragment(ctx) {
    let section;
    let current_block_type_index;
    let if_block;
    let section_style_value;
    let current;
    const if_block_creators = [create_if_block, create_else_block];
    const if_blocks = [];

    function select_block_type(ctx, dirty) {
      if (/*wkofLoaded*/ ctx[1]) return 0;
      return 1;
    }

    current_block_type_index = select_block_type(ctx);
    if_block = if_blocks[current_block_type_index] =
      if_block_creators[current_block_type_index](ctx);

    const block = {
      c: function create() {
        section = element("section");
        if_block.c();
        attr_dev(section, "data-testid", "ganbarometer");
        attr_dev(section, "class", "ganbarometer svelte-3pkdxk");

        attr_dev(
          section,
          "style",
          (section_style_value = ` 
    --bgColor: ${/*$gbSettings*/ ctx[0].bgColor}; 
    --trackColor: ${/*$gbSettings*/ ctx[0].trackColor}; 
    --textColor: ${/*$gbSettings*/ ctx[0].textColor}; 
    --hlTextColor: ${/*$gbSettings*/ ctx[0].hlTextColor}; 
    --fillColor: ${/*$gbSettings*/ ctx[0].fillColor}; 
    --warnColor: ${/*$gbSettings*/ ctx[0].warnColor}; 
    --lTrackColor: ${/*$gbSettings*/ ctx[0].lTrackColor}; 
    --hTrackColor: ${/*$gbSettings*/ ctx[0].hTrackColor};`)
        );

        add_location(section, file, 7, 0, 176);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option"
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, section, anchor);
        if_blocks[current_block_type_index].m(section, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (
          !current ||
          (dirty & /*$gbSettings*/ 1 &&
            section_style_value !==
              (section_style_value = ` 
    --bgColor: ${/*$gbSettings*/ ctx[0].bgColor}; 
    --trackColor: ${/*$gbSettings*/ ctx[0].trackColor}; 
    --textColor: ${/*$gbSettings*/ ctx[0].textColor}; 
    --hlTextColor: ${/*$gbSettings*/ ctx[0].hlTextColor}; 
    --fillColor: ${/*$gbSettings*/ ctx[0].fillColor}; 
    --warnColor: ${/*$gbSettings*/ ctx[0].warnColor}; 
    --lTrackColor: ${/*$gbSettings*/ ctx[0].lTrackColor}; 
    --hTrackColor: ${/*$gbSettings*/ ctx[0].hTrackColor};`))
        ) {
          attr_dev(section, "style", section_style_value);
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(section);
        if_blocks[current_block_type_index].d();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance($$self, $$props, $$invalidate) {
    let $gbSettings;
    validate_store(gbSettings, "gbSettings");
    component_subscribe($$self, gbSettings, ($$value) =>
      $$invalidate(0, ($gbSettings = $$value))
    );
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("App", slots, []);
    let wkofLoaded = wkof ? true : false;
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<App> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      Ganbarometer,
      gbSettings,
      wkofLoaded,
      $gbSettings,
    });

    $$self.$inject_state = ($$props) => {
      if ("wkofLoaded" in $$props)
        $$invalidate(1, (wkofLoaded = $$props.wkofLoaded));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [$gbSettings, wkofLoaded];
  }

  class App extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance, create_fragment, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "App",
        options,
        id: create_fragment.name,
      });
    }
  }

  let position;
  gbSettings.subscribe((val) => (position = val.position));
  // let progressDivParent = document.querySelector(".dashboard .container .row .span12");
  // let progressDivParent = document.querySelector(
  //   ".dashboard .container .row .span12"
  // );
  const targetElement = document.querySelector(".dashboard .span12");
  let options = { target: targetElement, anchor: null };
  switch (position) {
    // position: "Top" | "Below Forecast" | "Below SRS" | "Below Panels" | "Bottom"
    case "Top":
      options.anchor = targetElement.querySelector(".progress-and-forecast");
      break;
    case "Below Forecast":
      options.anchor = targetElement.querySelector(".srs-progress");
      break;
    case "Below SRS":
      options.anchor = targetElement.querySelector(".row");
      break;
    case "Below Panels":
      options.anchor = targetElement.querySelector(".row:last-of-type");
      break;
    default:
      // Bottom
      options.anchor = null;
  }
  const app = new App(options);

  return app;
})();
//# sourceMappingURL=bundle.js.map
