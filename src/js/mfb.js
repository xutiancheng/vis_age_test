var Module = {
    onRuntimeInitialized: function() {
        console.log('step-07');
        onModuleInitialized()
    }
};
console.log('step-01');
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
canvas_draw = document.getElementById("canvas_draw");
context_draw = canvas_draw.getContext("2d");
function start_dd() {
    // console.log("Starting dd");
    // hide("webcam_ffb");
    // switchmode("dd")
}
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
if (navigator.getUserMedia) {
    video = document.getElementById("video");
    console.log('step-02');
    addEvent(video, "play", processFrame);
    var errorCallback = function(c) {
        showwarning("No webcam device has been found.", start_dd);
        console.log("getUserMedia error", c)
    };
    try {
        console.log('step-03');
        navigator.getUserMedia({
            video: {
                width: myWidth,
                height: myHeight
            }
        }, startStream, errorCallback)
    } catch (c) {
        navigator.getUserMedia({
            video: !0
        }, startStream, errorCallback)
    }
} else {
    var hasFlash = !1;
    try {
        var fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
          , hasFlash = !0
    } catch (c) {
        navigator.mimeTypes && void 0 != navigator.mimeTypes["application/x-shockwave-flash"] && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && (hasFlash = !0)
    }
    if (!1 === hasFlash)
        showwarning("For an ideal experience we recommend you use a desktop <b>Chrome</b> or <b>Firefox</b> browser.", start_dd);
    else {
        var error_ffb = function() {
            console.log("ffb error");
            showwarning("No webcam device has been found.", start_dd)
        }
          , success_ffb = function() {
            console.log("ffb success");
            window.webcam_ffb.capture()
        }
          , load_webcam_ffb = function() {
            addTracker();
            document.getElementById("webcam_ffb").style.left = "50%";
            options.play()
        }
          , webcam = {
            pixelloc: 0,
            notready: 1,
            hideflash: 0,
            prevpixel: -1,
            nowebcam: 0,
            onLoad: function() {
                document.getElementById("webcam_ffb").style.left = "-99999px";
                showwarning("For an ideal experience we recommend you use a desktop <b>Chrome</b> or <b>Firefox</b> browser.", load_webcam_ffb);
                mWidth = options.width;
                mHeight = options.height;
                canvas.width = options.width;
                canvas.style.marginLeft = Math.round(-1 * options.width / 2) + "px";
                document.getElementById("webcam_ffb").style.marginLeft = Math.round(-1 * options.width / 2) + "px";
                canvas.height = options.height
            },
            onError: function(c) {
                switch (c) {
                case "nocamera":
                    document.getElementById("webcam_ffb").style.left = "-99999px",
                    showwarning("No webcam device has been found.", start_dd),
                    webcam.nowebcam = 1
                }
            },
            startFrame: function() {
                webcam.pixelloc = 0;
                webcam.hideflash = 0
            },
            updateData: function(c) {
                c = c.split("-");
                for (var a = 0, e = c.length - 1; a < e; a++) {
                    var d = parseInt(c[a]);
                    -1 != webcam.prevpixel && webcam.prevpixel != d && (1 == webcam.notready && (webcam.hideflash = 1),
                    webcam.notready = 0);
                    webcam.prevpixel = d;
                    r = d >> 16 & 255;
                    g = d >> 8 & 255;
                    b = d & 255;
                    pixels[webcam.pixelloc] = r;
                    pixels[webcam.pixelloc + 1] = g;
                    pixels[webcam.pixelloc + 2] = b;
                    pixels[webcam.pixelloc + 3] = 255;
                    webcam.pixelloc += 4
                }
            },
            processFrame: function() {
                webcam.pixelloc = 0;
                if (1 == webcam.notready)
                    setTimeout(options.play, 500);
                else {
                    1 == webcam.hideflash && (document.getElementById("webcam_ffb").style.left = "-999999px");
                    try {
                        if (!1 === startTracking)
                            return;
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        for (var c = context.createImageData(canvas.width, canvas.height), a = 0; a < c.data.length; a++)
                            c.data[a] = pixels[a];
                        context.putImageData(c, 0, 0);
                        var e = !1;
                        if (0 !== frameSample.length) {
                            newSample = [];
                            for (a = 1; 4 > a; a++)
                                newSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / 4]),
                                newSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / 2]),
                                newSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / (4 / 3)]);
                            e = checkFrameDuplicate(newSample);
                            frameSample = newSample.slice(0)
                        } else
                            for (frameSample = [],
                            a = 1; 4 > a; a++)
                                frameSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / 4]),
                                frameSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / 2]),
                                frameSample.push(pixels[mHeight / (4 / a) + 4 * mWidth / (4 / 3)]);
                        !0 === startTracking && (trackerReturnState = m_Tracker.track(mWidth, mHeight, ppixels, faceData, Module.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value, Module.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value, 0, -1));
                        !0 === startTracking && trackerReturnState === Module.VisageTrackerStatus.TRACK_STAT_OK.value && (parse_face_data(faceData),
                        render())
                    } catch (d) {
                        console.log("error out")
                    }
                    setTimeout(options.play, 10);
                    !1 === e && (c = 1E3 / ((now = new Date) - lastUpdate),
                    fps += (c - fps) / fpsFilter,
                    lastUpdate = now,
                    document.getElementById("fpsOut").innerHTML = fps.toFixed(1) + "fps")
                }
            }
        }
          , options = {
            el: "webcam_ffb",
            extern: null,
            append: !0,
            width: myWidth,
            height: myHeight,
            mode: "callback_ffb",
            swffile: "ffb/jQuery-webcam/jscam.swf?25",
            quality: 85,
            maxpixel: 1280,
            debug: function() {},
            onCapture: function() {},
            onSave: function(c) {},
            onLoad: function() {}
        };
        webcam_ffb(options, success_ffb, error_ffb)
    }
}
;