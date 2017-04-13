var myWidth = 640, myHeight = 480, mWidth = 0, mHeight = 0, m_Tracker, faceData, imageData, trackerStates = ["TRACK_STAT_OFF", "TRACK_STAT_OK", "TRACK_STAT_RECOVERING", "TRACK_STAT_INIT"], trackerReturnState = trackerStates[0], fps = 0, now = 0, lastUpdate = 0, fpsFilter = 10, ppixels, pixels, frameSample = [0, 0, 0, 0, 0], newSample = [0, 0, 0, 0, 0], canvas, context, video, IRIS_COLOR = "rgba(200,80,0,255)", GAZE_COLOR = "rgba(240,96,0,255)", BLACK_COLOR = "#000000", POINTS_COLOR = "rgba(0,255,255,255)", SPLINES_COLOR = "rgba(176,196,222,160)", X_AXIS_COLOR = "rgba(255,0,0,0.2)", Y_AXIS_COLOR = "rgba(0,255,0,0.2)", Z_AXIS_COLOR = "rgba(0,0,255,0.2)", styles = {
    LINE: 0,
    LINELOOP: 1,
    POINT: 2,
    SPLINE: 3
}, currentmakeover = {
    eyeshadow: {
        apply: 0
    },
    eyeliner: {
        apply: 0
    },
    lipcolor: {
        apply: 0
    },
    lash: {
        apply: 0
    }
}, lashimgarray = {};
function clear_makeup() {
    currentmakeover = {
        eyeshadow: {
            apply: 0
        },
        eyeliner: {
            apply: 0
        },
        lipcolor: {
            apply: 0
        },
        lash: {
            apply: 0
        }
    }
}
function load_lash_img(a) {
    var b = new Image;
    lashimgarray[a] = {
        obj: b,
        loaded: 0
    };
    b.onload = function() {
        lashimgarray[a].loaded = 1
    }
    ;
    b.src = "imageproxy.php?x=http://www40.modiface.com/mobile/sephora/lash/img/" + a
}
function handle_makeup(a, b) {
    if ("undefined" != typeof b.rgb) {
        var d = b.rgb.split(",");
        3 <= d.length && (currentmakeover[a].r = parseInt(d[0]),
        currentmakeover[a].g = parseInt(d[1]),
        currentmakeover[a].b = parseInt(d[2]))
    }
    "undefined" != typeof b.lashimg && (currentmakeover[a].lashimg = b.lashimg,
    load_lash_img(currentmakeover[a].lashimg));
    "undefined" != typeof b.isBottom && (currentmakeover[a].isBottom = b.isBottom);
    "undefined" != typeof b.op && (currentmakeover[a].op = parseFloat(b.op));
    if ("undefined" == typeof currentmakeover[a].op)
        switch (a) {
        case "eyeshadow":
            currentmakeover[a].op = .8;
            break;
        case "eyeliner":
            currentmakeover[a].op = .4;
            break;
        case "lipcolor":
            currentmakeover[a].op = .3;
            break;
        case "lash":
            currentmakeover[a].op = 1
        }
    if ("lash" == a && currentmakeover[a].lashimg || "undefined" != typeof currentmakeover[a].r && "undefined" != typeof currentmakeover[a].g && "undefined" != typeof currentmakeover[a].b)
        currentmakeover[a].apply = 1
}
function apply_makeup() {}
var warning_cb = "";
function showwarning(a, b) {
    show("msg_popup");
    document.getElementById("msg_txt").innerHTML = a;
    "undefined" != typeof b && (warning_cb = b)
}
function closewarning() {
    hide("msg_popup");
    "" != warning_cb && (warning_cb(),
    warning_cb = "")
}
function onModuleInitialized() {
    console.log('step-08');
    //debugger
    0 === mWidth ? setTimeout(onModuleInitialized, 100) : (ppixels = Module._malloc(mWidth * mHeight * 4),
    pixels = new Uint8Array(Module.HEAPU8.buffer,ppixels,mWidth * mHeight * 4),
    Module.initializeLicenseManager("./src/js/594-882-414-949-523-570-281-101-287-364-474.vlc"),
    m_Tracker = new Module.VisageTracker("./src/js/Facial Features Tracker - High.cfg"),
    faceData = new Module.FaceData)
}
function callbackDownload() {
    StartTracker()
}
var startTracking = !1;
function StartTracker() {
    frameinit();
    startTracking = !0;
    hide_loader()
}
var featurecoords = {};
function get_feature_coords(a, b, d, e) {
    featurecoords[a] = [];
    for (var c = 0; c < 2 * d; c += 2) {
        if ("iris" == a) {
            if (0 == c / 2 && !faceData.getEyeClosure()[0]) {
                featurecoords[a][parseInt(c / 2)] = {
                    x: -1,
                    y: -1
                };
                continue
            }
            if (1 == c / 2 && !faceData.getEyeClosure()[1]) {
                featurecoords[a][parseInt(c / 2)] = {
                    x: -1,
                    y: -1
                };
                continue
            }
        }
        if (!0 === e.FPIsDefined(b[c], b[c + 1])) {
            var f = Math.round(e.getFPPos(b[c], b[c + 1])[0] * canvas.width)
              , g = Math.round((1 - e.getFPPos(b[c], b[c + 1])[1]) * canvas.height);
            featurecoords[a][parseInt(c / 2)] = {
                x: f,
                y: g
            }
        }
    }
}
function parse_face_data(a) {
    get_feature_coords("chin", [2, 1], 1, a.getFeaturePoints2D());
    get_feature_coords("innerlip", [2, 5, 2, 7, 2, 2, 2, 6, 2, 4, 2, 8, 2, 3, 2, 9], 8, a.getFeaturePoints2D());
    get_feature_coords("outerlip", [8, 4, 8, 6, 8, 9, 8, 1, 8, 10, 8, 5, 8, 3, 8, 7, 8, 2, 8, 8], 10, a.getFeaturePoints2D());
    get_feature_coords("nose", [9, 1, 9, 3, 9, 2, 9, 15], 4, a.getFeaturePoints2D());
    get_feature_coords("iris", [3, 5, 3, 6], 2, a.getFeaturePoints2D());
    get_feature_coords("reye", [3, 11, 12, 9, 3, 1, 12, 5, 3, 7, 12, 7, 3, 3, 12, 11], 8, a.getFeaturePoints2D());
    get_feature_coords("leye", [3, 12, 12, 10, 3, 2, 12, 6, 3, 8, 12, 8, 3, 4, 12, 12], 8, a.getFeaturePoints2D());
    get_feature_coords("lbrow", [4, 6, 4, 4, 4, 2], 3, a.getFeaturePoints2D());
    get_feature_coords("rbrow", [4, 1, 4, 3, 4, 5], 3, a.getFeaturePoints2D())
}
function checkFrameDuplicate(a) {
    for (var b = 0; b < a.length; b += 2)
        if (a[b] !== frameSample[b])
            return !1;
    for (b = 1; b < a.length; b += 2)
        if (a[b] !== frameSample[b])
            return !1;
    return !0
}
function processFrame() {
    console.log('step-04-01',startTracking);
    try {
        // if (video.paused || video.ended)
        //     {
        //         return;
        //     } 
        if (!1 === startTracking) {
            setTimeout(processFrame, 100);
            return
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, mWidth, mHeight);
        imageData = context.getImageData(0, 0, mWidth, mHeight).data;
        for (b = 0; b < imageData.length; b += 1)
            pixels[b] = imageData[b];
        var a = !1;
        if (0 !== frameSample.length) {
            newSample = [];
            for (var b = 1; 4 > b; b++)
                newSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / 4]),
                newSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / 2]),
                newSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / (4 / 3)]);
            a = checkFrameDuplicate(newSample);
            frameSample = newSample.slice(0)
        } else{
            for (frameSample = [],
            b = 1; 4 > b; b++)
                {
                    frameSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / 4]),
                    frameSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / 2]),
                    frameSample.push(imageData[mHeight / (4 / b) + 4 * mWidth / (4 / 3)]);
                }
            }
        //console.log(mWidth, mHeight, ppixels, faceData, Module.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value, Module.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value)      
        !0 === startTracking && (trackerReturnState = m_Tracker.track(mWidth, mHeight, ppixels, faceData, Module.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value, Module.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value, 0, -1));        
        //console.log(startTracking,trackerReturnState,Module.VisageTrackerStatus.TRACK_STAT_OK.value);
        !0 === startTracking && trackerReturnState === Module.VisageTrackerStatus.TRACK_STAT_OK.value && (parse_face_data(faceData),render());//数据匹配render方法合并图像
    } catch (d) {}
    setTimeout(processFrame, 30);
    !1 === a && (a = 1E3 / ((now = new Date) - lastUpdate),
    fps += (a - fps) / fpsFilter,
    lastUpdate = now)
}
function addTracker() {
    console.log('step-05');
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.src = "./src/js/visageSDK.js";
    $("body").append(a)
}
function startStream(a) {
    console.log('step-04');
    if (1 > a.getVideoTracks().length)
        showwarning("No webcam device has been found.", start_dd);
    else {
        show_loader();
        video.addEventListener("canplay", function e() {
            video.removeEventListener("canplay", e, !0);
            setTimeout(function() {
                // video.play();
                // console.log('bbbb2')
                canvas.width = video.videoWidth;
                canvas.style.marginLeft = Math.round(-1 * video.videoWidth / 2) + "px";
                canvas.height = video.videoHeight;
                mWidth = video.videoWidth;
                mHeight = video.videoHeight
            }, 1E3)
        }, !0);
        var b = window.URL || window.webkitURL;
        video.src = b ? b.createObjectURL(a) : a;
        video.play();
        // console.log('bbbb1')
        addTracker()
    }
}
function show_loader() {
    $(".loader").show()
}
function hide_loader() {
    $(".loader").hide()
}
function show(a) {
    document.getElementById(a) && (document.getElementById(a).style.display = "block")
}
function hide(a) {
    document.getElementById(a) && (document.getElementById(a).style.display = "none")
}
;