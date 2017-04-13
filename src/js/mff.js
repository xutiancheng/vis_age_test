var e = null
  , f = null
  , h = 1
  , k = null
  , l = window.postMessage;
function m(a) {
    var b = parentdomain
      , c = parent;
    b && "string" === typeof a && (c = c || parent,
    l ? 0 : b && (c.location = b.replace(/#.*$/, "") + "#" + +new Date + h++ + "&" + a))
    //l ? c.postMessage(a, b.replace(/([^:]+:\/\/[^\/]+).*/, "$1")) : b && (c.location = b.replace(/#.*$/, "") + "#" + +new Date + h++ + "&" + a))
}
function p(a, b) {
    if (l)
        if (a && (k && p(),
        k = function(c) {
            if ("string" === typeof b && c.origin !== b || "function" === typeof b && !1 === b(c.origin))
                return !1;
            a(c)
        }
        ),
        window.addEventListener)
            window[a ? "addEventListener" : "removeEventListener"]("message", k, !1);
        else
            window[a ? "attachEvent" : "detachEvent"]("onmessage", k);
    else
        e && clearInterval(e),
        e = null,
        a && (e = setInterval(function() {
            var b = document.location.hash
              , d = /^#?\d+&/;
            b !== f && d.test(b) && (f = b,
            a({
                data: b.replace(d, "")
            }))
        }, "number" === typeof b ? b : 100))
}
window.addEvent = function(a, b, c) {
    null != a && "undefined" != typeof a && (a.addEventListener ? a.addEventListener(b, c) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c)
}
;
window.switchmode = function(a) {
    "" != frameid && m("switchmode~" + (frameid + "~" + a))
}
;
window.frameinit = function() {
    "" != frameid && m("frameready~" + frameid)
}
;
p(function(a) {
    a = a.data.split("~");
    switch (a[0]) {
    case "apply":
        clear_makeup();
        for (var b = 1, c = a.length; b < c; b++)
            if ("" != a[b]) {
                for (var d = a[b].split(":"), q = d[0], d = d[1].split("&"), n = {}, g = 0, r = d.length; g < r; g++)
                    n[d[g].split("=")[0]] = d[g].split("=")[1];
                handle_makeup(q, n)
            }
        apply_makeup()
    }
}, function(a) {
    switch (a) {
    default:
        return !0
    }
});
