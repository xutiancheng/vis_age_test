function D() {
    for (var a = document.getElementById("canvas_draw"), a = a.getContext("2d").getImageData(0, 0, a.width, a.height), f = a.data, d = 0; d < f.length; d += 4)
        f[d] = f[d + 3],
        f[d + 1] = f[d + 3],
        f[d + 2] = f[d + 3],
        f[d + 3] = 255;
    return a
}
function E(a, f, d, n) {
    var q = document.getElementById("canvas_draw")
      , k = q.getContext("2d");
    a = a.data;
    for (var q = k.getImageData(0, 0, q.width, q.height), h = q.data, l = 0; l < h.length; l += 4)
        h[l] = f,
        h[l + 1] = d,
        h[l + 2] = n,
        h[l + 3] = a[l];
    k.putImageData(q, 0, 0)
}
function F(a, f, d, n, q) {
    if ("reye" == a)
        var k = "rbrow"
          , h = G;
    else if ("leye" == a)
        k = "lbrow",
        h = H;
    else {
        console.log("Error: Unsupported type " + a);
        return
    }
    q *= Math.pow(2.5, 1 - (f + d + n) / 765 * 2);
    k = Math.round((featurecoords[k][0].y + featurecoords[k][1].y + featurecoords[k][2].y) / 3);
    if (0 == featurecoords[a].length)
        console.log("Error: " + a + " length is 0");
    else {
        for (var l = -1, m = -1, c = -1, g = -1, b = 0, e = featurecoords[a].length; b < e; b++)
            -1 == l ? l = featurecoords[a][b].x : l > featurecoords[a][b].x && (l = featurecoords[a][b].x),
            -1 == m ? m = featurecoords[a][b].x : m < featurecoords[a][b].x && (m = featurecoords[a][b].x),
            -1 == c ? c = featurecoords[a][b].y : c > featurecoords[a][b].y && (c = featurecoords[a][b].y),
            -1 == g ? g = featurecoords[a][b].y : g < featurecoords[a][b].y && (g = featurecoords[a][b].y);
        c > g ? console.log("Error: something wrong with " + a + " coords") : (c = Math.min(c, k),
        b = [l, c, m, g],
        l = b[2] - b[0],
        b[0] = Math.round(b[0] - .4 * l),
        b[2] = Math.round(b[2] + .4 * l),
        l = b[2] - b[0],
        c = Math.max(1, Math.round(.03 * l)),
        e = 2 * c,
        l = Math.max(0, b[0] - e),
        m = Math.max(0, b[1] - e),
        g = Math.min(canvas.width - 1, b[2] + e) - l,
        b = Math.min(canvas.height - 1, b[3] + e) - m,
        canvas_draw.width = g,
        canvas_draw.height = b,
        context_draw.clearRect(0, 0, g, b),
        h("canvas_draw", featurecoords[a][0].x - l, featurecoords[a][0].y - m, featurecoords[a][2].x - l, featurecoords[a][2].y - m, featurecoords[a][4].x - l, featurecoords[a][4].y - m, featurecoords[a][6].x - l, featurecoords[a][6].y - m, k - m, f, d, n, q),
        a = D(),
        a = boxBlurDataRGB(a, 0, 0, g, b, c, 1),
        h = document.getElementById("canvas_grey"),
        h.width = canvas_draw.width,
        h.height = canvas_draw.height,
        h.getContext("2d").putImageData(a, 0, 0),
        E(a, f, d, n),
        context.drawImage(canvas_draw, l, m))
    }
}
function I(a, f, d, n, q) {
    f = Math.round(f / 2);
    d = Math.round(d / 2);
    n = Math.round(n / 2);
    if ("reye" == a)
        var k = "rbrow"
          , h = J;
    else if ("leye" == a)
        k = "lbrow",
        h = K;
    else {
        console.log("Error: Unsupported type " + a);
        return
    }
    k = Math.round((featurecoords[k][0].y + featurecoords[k][1].y + featurecoords[k][2].y) / 3);
    if (0 == featurecoords[a].length)
        console.log("Error: " + a + " length is 0");
    else {
        for (var l = -1, m = -1, c = -1, g = -1, b = 0, e = featurecoords[a].length; b < e; b++)
            -1 == l ? l = featurecoords[a][b].x : l > featurecoords[a][b].x && (l = featurecoords[a][b].x),
            -1 == m ? m = featurecoords[a][b].x : m < featurecoords[a][b].x && (m = featurecoords[a][b].x),
            -1 == c ? c = featurecoords[a][b].y : c > featurecoords[a][b].y && (c = featurecoords[a][b].y),
            -1 == g ? g = featurecoords[a][b].y : g < featurecoords[a][b].y && (g = featurecoords[a][b].y);
        c > g ? console.log("Error: something wrong with " + a + " coords") : (c = Math.min(c, k),
        b = [l, c, m, g],
        l = b[2] - b[0],
        b[0] = Math.round(b[0] - .4 * l),
        b[2] = Math.round(b[2] + .4 * l),
        l = b[2] - b[0],
        l = Math.max(1, Math.round(.01 * l)),
        e = 2 * l,
        m = Math.max(0, b[0] - e),
        c = Math.max(0, b[1] - e),
        g = Math.min(canvas.width - 1, b[2] + e) - m,
        b = Math.min(canvas.height - 1, b[3] + e) - c,
        canvas_draw.width = g,
        canvas_draw.height = b,
        context_draw.clearRect(0, 0, g, b),
        h("canvas_draw", featurecoords[a][0].x - m, featurecoords[a][0].y - c, featurecoords[a][1].x - m, featurecoords[a][1].y - c, featurecoords[a][2].x - m, featurecoords[a][2].y - c, featurecoords[a][3].x - m, featurecoords[a][3].y - c, featurecoords[a][4].x - m, featurecoords[a][4].y - c, featurecoords[a][6].x - m, featurecoords[a][6].y - c, k - c, f, d, n, q),
        a = D(),
        a = boxBlurDataRGB(a, 0, 0, g, b, l, 1),
        E(a, f, d, n),
        context.drawImage(canvas_draw, m, c))
    }
}
new Image;
new Image;
function L(a, f, d, n) {
    if (0 != lashimgarray[f].loaded) {
        "undefined" == typeof n && (n = "NO");
        if ("reye" == a) {
            f = lashimgarray[f].obj;
            var q = 0
        } else if ("leye" == a)
            f = lashimgarray[f].obj,
            q = 1;
        else {
            console.log("Error: Unsupported type " + a);
            return
        }
        if (0 == featurecoords[a].length)
            console.log("Error: " + a + " length is 0");
        else {
            for (var k = -1, h = -1, l = -1, m = -1, c = 0, g = featurecoords[a].length; c < g; c++)
                -1 == k ? k = featurecoords[a][c].x : k > featurecoords[a][c].x && (k = featurecoords[a][c].x),
                -1 == h ? h = featurecoords[a][c].x : h < featurecoords[a][c].x && (h = featurecoords[a][c].x),
                -1 == l ? l = featurecoords[a][c].y : l > featurecoords[a][c].y && (l = featurecoords[a][c].y),
                -1 == m ? m = featurecoords[a][c].y : m < featurecoords[a][c].y && (m = featurecoords[a][c].y);
            if (l > m)
                console.log("Error: something wrong with " + a + " coords");
            else {
                c = h - k;
                g = m - l;
                if ("NO" == n)
                    var b = 1.57
                      , e = .73
                      , p = .77
                      , v = 0;
                else
                    b = .04,
                    e = 3.18,
                    p = .84,
                    v = -.08;
                h = "reye" == a ? [Math.round(k - v * c), l - g * b, Math.round(h + p * c), Math.round((m + l) / 2 + g * e)] : [Math.round(k - p * c), l - g * b, Math.round(h + v * c), Math.round((m + l) / 2 + g * e)];
                a = h[2] - h[0];
                k = h[3] - h[1];
                h = [Math.round(h[0] - (1.2 - 1) / 2 * a), Math.round(h[1] - (1.2 - 1) / 2 * k), Math.round(h[2] + (1.2 - 1) / 2 * a), Math.round(h[3] + (1.2 - 1) / 2 * k)];
                l = h[2] - h[0];
                m = h[3] - h[1];
                c = document.getElementById("canvas_draw");
                c.width = l;
                c.height = m;
                c = c.getContext("2d");
                c.clearRect(0, 0, l, m);
                "NO" == n ? (n = .33,
                g = .7) : (n = .23,
                g = .14);
                1 == q ? (c.translate(l, 0),
                c.scale(-1, 1),
                c.translate(l * n, m * g),
                c.rotate(-1 * d)) : (c.translate(l * n, m * g),
                c.rotate(d));
                p = f;
                d = (200 - a) / 5;
                f = (130 - k) / 5;
                q = Math.round(200 - d);
                b = Math.round(130 - f);
                e = document.createElement("canvas");
                e.width = q;
                e.height = b;
                e.getContext("2d").drawImage(p, 0, 0, q, b);
                for (var p = e, x = 1; 5 > x; x++) {
                    var C = Math.round(200 - d * x)
                      , B = Math.round(130 - f * x)
                      , q = Math.round(200 - d * (x + 1))
                      , b = Math.round(130 - f * (x + 1))
                      , e = p
                      , p = document.createElement("canvas");
                    p.width = q;
                    p.height = b;
                    v = p.getContext("2d");
                    v.drawImage(e, 0, 0, C, B, 0, 0, q, b)
                }
                c.drawImage(p, Math.round((l - a) / 2) - l * n, Math.round((m - k) / 2) - m * g, a, k);
                context.drawImage(canvas_draw, h[0], h[1])
            }
        }
    }
}
function G(a, f, d, n, q, k, h, l, m, c, g, b, e, p) {
    a = document.getElementById(a).getContext("2d");
    a.beginPath();
    a.moveTo(f, d);
    a.bezierCurveTo(n - (k - f) / 2, c - (q - c) / 2, n + 5 * (k - f) / 4, c - (q - c) / 4, k, h);
    a.bezierCurveTo(n + (k - f) / 5, q - ((h + d) / 2 - q) / 3, n - (k - f) / 5, q - ((h + d) / 2 - q) / 3, f, d);
    a.closePath();
    a.lineWidth = 0;
    f = a.createRadialGradient(n, (d + h) / 2, (k - f) / 6, n + (k - f) / 3, (d + h) / 2, 7 * (k - f) / 8);
    f.addColorStop(0, "rgba(" + g + "," + b + "," + e + "," + .6 * p + ")");
    f.addColorStop(.4, "rgba(" + g + "," + b + "," + e + "," + .3 * p + ")");
    f.addColorStop(.6, "rgba(" + g + "," + b + "," + e + "," + .1 * p + ")");
    f.addColorStop(.8, "rgba(" + g + "," + b + "," + e + "," + .02 * p + ")");
    f.addColorStop(1, "rgba(" + g + "," + b + "," + e + ",0)");
    a.fillStyle = f;
    a.fill()
}
function H(a, f, d, n, q, k, h, l, m, c, g, b, e, p) {
    a = document.getElementById(a).getContext("2d");
    a.beginPath();
    a.moveTo(k, h);
    a.bezierCurveTo(n + (k - f) / 2, c - (q - c) / 2, n - 5 * (k - f) / 4, c - (q - c) / 4, f, d);
    a.bezierCurveTo(n - (k - f) / 5, q - ((h + d) / 2 - q) / 3, n + (k - f) / 5, q - ((h + d) / 2 - q) / 3, k, h);
    a.closePath();
    a.lineWidth = 0;
    f = a.createRadialGradient(n, (d + h) / 2, (k - f) / 6, n - (k - f) / 3, (d + h) / 2, 7 * (k - f) / 8);
    f.addColorStop(0, "rgba(" + g + "," + b + "," + e + "," + .6 * p + ")");
    f.addColorStop(.4, "rgba(" + g + "," + b + "," + e + "," + .3 * p + ")");
    f.addColorStop(.6, "rgba(" + g + "," + b + "," + e + "," + .1 * p + ")");
    f.addColorStop(.8, "rgba(" + g + "," + b + "," + e + "," + .02 * p + ")");
    f.addColorStop(1, "rgba(" + g + "," + b + "," + e + ",0)");
    a.fillStyle = f;
    a.fill()
}
function J(a, f, d, n, q, k, h, l, m, c, g, b, e, p, v, x, C, B) {
    a = document.getElementById(a).getContext("2d");
    a.beginPath();
    a.moveTo(f, d);
    a.bezierCurveTo(n, q - (d - p) / 5, k, h - (d - p) / 5, c + (c - f) / 5, g - (d - p) / 20);
    a.bezierCurveTo(b, e + (d - p) / 8, b, e + (d - p) / 50, f, d);
    a.bezierCurveTo(b, e + (d - p) / 100, b, e + (d - p) / 100, c, g);
    h += (d - p) / 20;
    q += (d - p) / 30;
    var u = Math.sqrt((n - c) * (n - c) + (q - g) * (q - g));
    p = Math.sqrt((c - k) * (c - k) + (g - h) * (g - h));
    e = Math.sqrt((f - k) * (f - k) + (d - h) * (d - h));
    b = Math.sqrt((k - n) * (k - n) + (h - q) * (h - q));
    var r = Math.sqrt((n - f) * (n - f) + (q - d) * (q - d));
    c = (c - n) / u;
    g = (g - q) / u;
    var u = -1 * c
      , t = -1 * g
      , y = (k - f) / e
      , w = (h - d) / e
      , A = -1 * y
      , z = -1 * w;
    a.bezierCurveTo(l, m + (d - h) / 20, k + c * p * .2, h + g * p * .2, k, h);
    a.bezierCurveTo(k + u * e * .2, h + t * e * .2, n + y * b * .2, q + w * b * .2, n, q);
    a.bezierCurveTo(n + A * r * .2, q + z * r * .2, f, d, f, d);
    a.closePath();
    a.lineWidth = 0;
    a.fillStyle = "rgba(" + v + "," + x + "," + C + "," + B + ")";
    a.fill()
}
function K(a, f, d, n, q, k, h, l, m, c, g, b, e, p, v, x, C, B) {
    a = document.getElementById(a).getContext("2d");
    a.beginPath();
    a.moveTo(c, g);
    a.bezierCurveTo(l, m - (g - p) / 5, k, h - (g - p) / 5, f + (f - c) / 5, d - (g - p) / 20);
    a.bezierCurveTo(b, e + (g - p) / 8, b, e + (g - p) / 50, c, g);
    a.bezierCurveTo(b, e + (g - p) / 100, b, e + (g - p) / 100, f, d);
    h += (g - p) / 20;
    m += (g - p) / 30;
    var u = Math.sqrt((l - f) * (l - f) + (m - d) * (m - d));
    p = Math.sqrt((f - k) * (f - k) + (d - h) * (d - h));
    b = Math.sqrt((k - l) * (k - l) + (h - m) * (h - m));
    e = Math.sqrt((l - c) * (l - c) + (m - g) * (m - g));
    var r = Math.sqrt((c - k) * (c - k) + (g - h) * (g - h));
    f = (f - l) / u;
    d = (d - m) / u;
    var u = -1 * f
      , t = -1 * d
      , y = (k - c) / r
      , w = (h - g) / r
      , A = -1 * y
      , z = -1 * w;
    a.bezierCurveTo(n, q + (g - h) / 20, k + f * p * .2, h + d * p * .2, k, h);
    a.bezierCurveTo(k + u * r * .2, h + t * r * .2, l + y * b * .2, m + w * b * .2, l, m);
    a.bezierCurveTo(l + A * e * .2, m + z * e * .2, c, g, c, g);
    a.closePath();
    a.lineWidth = 0;
    a.fillStyle = "rgba(" + v + "," + x + "," + C + "," + B + ")";
    a.fill()
}
window.render = function() {
    for (var a = 0, f = 0, d = 0, n = 0, q = 0, k = featurecoords.reye.length; q < k; q++)
        a += featurecoords.reye[q].x,
        f += featurecoords.reye[q].y;
    q = 0;
    for (k = featurecoords.leye.length; q < k; q++)
        d += featurecoords.leye[q].x,
        n += featurecoords.leye[q].y;
    var a = a / featurecoords.reye.length, f = f / featurecoords.reye.length, d = d / featurecoords.leye.length, n = n / featurecoords.leye.length, a = Math.atan2(f - n, a - d), h;
    for (h in currentmakeover)
        if (0 != currentmakeover[h].apply) {
            var q = currentmakeover[h].r
              , k = currentmakeover[h].g
              , l = currentmakeover[h].b
              , f = currentmakeover[h].op;
            switch (h) {
            case "eyeshadow":
                F("reye", q, k, l, f);
                F("leye", q, k, l, f);
                break;
            case "eyeliner":
                I("reye", q, k, l, f);
                I("leye", q, k, l, f);
                break;
            case "lipcolor":
                d = featurecoords.outerlip;
                n = featurecoords.innerlip;
                q = Math.round(q / 6);
                k = Math.round(k / 6);
                l = Math.round(l / 6);
                if (0 == d.length)
                    console.log("Error: outerlip length is 0");
                else if (0 == n.length)
                    console.log("Error: innerlip length is 0");
                else {
                    for (var m = -1, c = -1, g = -1, b = -1, e = 0, p = d.length; e < p; e++)
                        -1 == m ? m = d[e].x : m > d[e].x && (m = d[e].x),
                        -1 == c ? c = d[e].x : c < d[e].x && (c = d[e].x),
                        -1 == g ? g = d[e].y : g > d[e].y && (g = d[e].y),
                        -1 == b ? b = d[e].y : b < d[e].y && (b = d[e].y);
                    if (g > b)
                        console.log("Error: something wrong with lip coords");
                    else {
                        for (var v = b - g, x = [m, g, c, b], b = g = -1, e = 0, p = n.length; e < p; e++)
                            -1 == g ? g = n[e].y : g > n[e].y && (g = n[e].y),
                            -1 == b ? b = n[e].y : b < n[e].y && (b = n[e].y);
                        if (g > b)
                            console.log("Error: something wrong with lip coords");
                        else {
                            g = b - g > .21 * v ? 1 : 0;
                            b = Math.round(.05 * (x[2] - x[0]));
                            e = 2 * b;
                            v = Math.max(0, x[0] - e);
                            m = Math.max(0, x[1] - e);
                            c = Math.min(canvas.width - 1, x[2] + e) - v;
                            x = Math.min(canvas.height - 1, x[3] + e) - m;
                            canvas_draw.width = c;
                            canvas_draw.height = x;
                            context_draw.clearRect(0, 0, c, x);
                            var C = .36
                              , B = 6;
                            context_draw.beginPath();
                            context_draw.moveTo(d[0].x - v, d[0].y - m);
                            e = 0;
                            for (p = d.length; e < p; e++) {
                                var u = (e - 1 + p) % p
                                  , r = e
                                  , t = (e + 1) % p
                                  , y = (e + 2) % p
                                  , u = [d[u].x - v, d[u].y - m]
                                  , r = [d[r].x - v, d[r].y - m]
                                  , t = [d[t].x - v, d[t].y - m]
                                  , w = [d[y].x - v, d[y].y - m]
                                  , A = Math.sqrt((t[0] - u[0]) * (t[0] - u[0]) + (t[1] - u[1]) * (t[1] - u[1]))
                                  , y = (t[0] - u[0]) / A
                                  , A = (t[1] - u[1]) / A
                                  , z = Math.sqrt((r[0] - w[0]) * (r[0] - w[0]) + (r[1] - w[1]) * (r[1] - w[1]))
                                  , u = (r[0] - w[0]) / z
                                  , w = (r[1] - w[1]) / z
                                  , z = Math.sqrt((r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1])) * C
                                  , r = 0 == e || e == B ? [r[0], r[1]] : [r[0] + z * y, r[1] + z * A]
                                  , y = e == B - 1 || e == p - 1 ? [t[0], t[1]] : [t[0] + z * u, t[1] + z * w];
                                context_draw.bezierCurveTo(r[0], r[1], y[0], y[1], t[0], t[1])
                            }
                            if (1 == g)
                                for (C = .36,
                                B = 4,
                                p = n.length,
                                context_draw.moveTo(n[p - 1].x - v, n[p - 1].y - m),
                                e = p - 1; 0 <= e; e--)
                                    u = (e + 1) % p,
                                    r = e,
                                    t = (e - 1 + p) % p,
                                    y = (e - 2 + p) % p,
                                    u = [n[u].x - v, n[u].y - m],
                                    r = [n[r].x - v, n[r].y - m],
                                    t = [n[t].x - v, n[t].y - m],
                                    w = [n[y].x - v, n[y].y - m],
                                    A = Math.sqrt((t[0] - u[0]) * (t[0] - u[0]) + (t[1] - u[1]) * (t[1] - u[1])),
                                    y = (t[0] - u[0]) / A,
                                    A = (t[1] - u[1]) / A,
                                    z = Math.sqrt((r[0] - w[0]) * (r[0] - w[0]) + (r[1] - w[1]) * (r[1] - w[1])),
                                    u = (r[0] - w[0]) / z,
                                    w = (r[1] - w[1]) / z,
                                    z = Math.sqrt((r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1])) * C,
                                    r = 0 == e || e == B ? [r[0], r[1]] : [r[0] + z * y, r[1] + z * A],
                                    y = e == B + 1 || 1 == e ? [t[0], t[1]] : [t[0] + z * u, t[1] + z * w],
                                    context_draw.bezierCurveTo(r[0], r[1], y[0], y[1], t[0], t[1]);
                            context_draw.closePath();
                            context_draw.fillStyle = "rgba(" + q + "," + k + "," + l + "," + f + ")";
                            context_draw.fill();
                            boxBlurCanvasRGBA("canvas_draw", 0, 0, c, x, b, 1);
                            context.drawImage(canvas_draw, v, m)
                        }
                    }
                }
                break;
            case "lash":
                f = currentmakeover[h].lashimg,
                d = currentmakeover[h].isBottom,
                L("reye", f, a, d),
                L("leye", f, a, d)
            }
        }
}
;
