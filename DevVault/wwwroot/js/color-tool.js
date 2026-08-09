/* =========================================================
DEVVAULT - COLOR TOOL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const colorPicker =
        document.getElementById("colorPicker");

    const colorPreview =
        document.getElementById("colorPreview");

    const hueSlider =
        document.getElementById("hueSlider");

    const saturationSlider =
        document.getElementById("saturationSlider");

    const lightnessSlider =
        document.getElementById("lightnessSlider");

    const hueValue =
        document.getElementById("hueValue");

    const saturationValue =
        document.getElementById("saturationValue");

    const lightnessValue =
        document.getElementById("lightnessValue");

    const hexValue =
        document.getElementById("hexValue");

    const rgbValue =
        document.getElementById("rgbValue");

    const hslValue =
        document.getElementById("hslValue");


    let currentColor = {
        h: 239,
        s: 84,
        l: 67
    };


    /* =====================================================
       COLOR PREVIEW
    ===================================================== */

    colorPreview?.addEventListener(
        "click",
        () => colorPicker?.click()
    );


    /* =====================================================
       NATIVE COLOR PICKER
    ===================================================== */

    colorPicker?.addEventListener(
        "input",
        function () {

            setColorFromHex(
                colorPicker.value
            );

        }
    );


    /* =====================================================
       HEX
    ===================================================== */

    hexValue?.addEventListener(
        "input",
        function () {

            let value =
                hexValue.value.trim();

            if (!value.startsWith("#")) {

                value =
                    "#" + value;

            }

            if (
                /^#[0-9A-Fa-f]{6}$/
                    .test(value)
            ) {

                setColorFromHex(value);

            }

        }
    );


    /* =====================================================
       HUE
    ===================================================== */

    hueSlider?.addEventListener(
        "input",
        function () {

            currentColor.h =
                Number(hueSlider.value);

            updateColor();

        }
    );


    /* =====================================================
       SATURATION
    ===================================================== */

    saturationSlider?.addEventListener(
        "input",
        function () {

            currentColor.s =
                Number(saturationSlider.value);

            updateColor();

        }
    );


    /* =====================================================
       LIGHTNESS
    ===================================================== */

    lightnessSlider?.addEventListener(
        "input",
        function () {

            currentColor.l =
                Number(lightnessSlider.value);

            updateColor();

        }
    );


    /* =====================================================
       SET COLOR FROM HEX
    ===================================================== */

    function setColorFromHex(hex) {

        const rgb =
            hexToRgb(hex);

        if (!rgb) {
            return;
        }

        const hsl =
            rgbToHsl(
                rgb.r,
                rgb.g,
                rgb.b
            );

        currentColor = {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l
        };

        updateColor();

    }


    /* =====================================================
       UPDATE EVERYTHING
    ===================================================== */

    function updateColor() {

        const rgb =
            hslToRgb(
                currentColor.h,
                currentColor.s,
                currentColor.l
            );


        const hex =
            rgbToHex(
                rgb.r,
                rgb.g,
                rgb.b
            );


        /* ---------------------------------------------
           EXISTING COLOR TOOL
        --------------------------------------------- */

        const rgbString =
            `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        const hslString =
            `hsl(${Math.round(currentColor.h)}, ${Math.round(currentColor.s)}%, ${Math.round(currentColor.l)}%)`;


        hexValue.value =
            hex;

        rgbValue.value =
            rgbString;

        hslValue.value =
            hslString;


        colorPreview.style.backgroundColor =
            hex;


        colorPicker.value =
            hex;


        hueSlider.value =
            currentColor.h;

        saturationSlider.value =
            currentColor.s;

        lightnessSlider.value =
            currentColor.l;


        hueValue.textContent =
            `${Math.round(currentColor.h)}°`;

        saturationValue.textContent =
            `${Math.round(currentColor.s)}%`;

        lightnessValue.textContent =
            `${Math.round(currentColor.l)}%`;


        updateSliderBackgrounds();


        /* ---------------------------------------------
           ADVANCED FEATURES
        --------------------------------------------- */

        updateFormats(rgb, hex);

        generatePalette();

        generateShades();

        updateContrast(hex);

        generateHarmony();

    }


    /* =====================================================
       COLOR FORMATS
    ===================================================== */

    function updateFormats(rgb, hex) {

        const hsv =
            rgbToHsv(
                rgb.r,
                rgb.g,
                rgb.b
            );

        const cmyk =
            rgbToCmyk(
                rgb.r,
                rgb.g,
                rgb.b
            );


        document.getElementById(
            "formatHex"
        ).textContent = hex;


        document.getElementById(
            "formatRgb"
        ).textContent =
            `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;


        document.getElementById(
            "formatHsl"
        ).textContent =
            `hsl(${Math.round(currentColor.h)}, ${Math.round(currentColor.s)}%, ${Math.round(currentColor.l)}%)`;


        document.getElementById(
            "formatHsv"
        ).textContent =
            `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)`;


        document.getElementById(
            "formatCmyk"
        ).textContent =
            `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;


        document.getElementById(
            "formatOklch"
        ).textContent =
            rgbToOklch(
                rgb.r,
                rgb.g,
                rgb.b
            );

    }


    /* =====================================================
       PALETTE GENERATOR
    ===================================================== */

    function generatePalette() {

        const paletteGrid =
            document.getElementById(
                "paletteGrid"
            );

        if (!paletteGrid) {
            return;
        }


        const h =
            currentColor.h;

        const s =
            currentColor.s;

        const l =
            currentColor.l;


        const colors = [

            {
                name: "Base",
                h: h,
                s: s,
                l: l
            },

            {
                name: "Complementary",
                h: (h + 180) % 360,
                s: s,
                l: l
            },

            {
                name: "Analogous",
                h: (h + 30) % 360,
                s: s,
                l: l
            },

            {
                name: "Analogous",
                h: (h + 330) % 360,
                s: s,
                l: l
            },

            {
                name: "Triadic",
                h: (h + 120) % 360,
                s: s,
                l: l
            },

            {
                name: "Triadic",
                h: (h + 240) % 360,
                s: s,
                l: l
            }

        ];


        paletteGrid.innerHTML =
            colors.map(function (color) {

                const rgb =
                    hslToRgb(
                        color.h,
                        color.s,
                        color.l
                    );

                const hex =
                    rgbToHex(
                        rgb.r,
                        rgb.g,
                        rgb.b
                    );


                return `

                    <div class="palette-color"
                         data-color="${hex}">

                        <div
                            class="palette-color-preview"
                            style="background:${hex}">
                        </div>

                        <div class="palette-color-info">

                            <span class="palette-color-name">
                                ${color.name}
                            </span>

                            <span class="palette-color-value">
                                ${hex}
                            </span>

                        </div>

                    </div>

                `;

            }).join("");


        addPaletteClickEvents();

    }


    /* =====================================================
       PALETTE CLICK
    ===================================================== */

    function addPaletteClickEvents() {

        document
            .querySelectorAll(".palette-color")
            .forEach(function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        setColorFromHex(
                            item.dataset.color
                        );

                    }
                );

            });

    }


    /* =====================================================
       SHADES
    ===================================================== */

    function generateShades() {

        const grid =
            document.getElementById(
                "shadesGrid"
            );

        if (!grid) {
            return;
        }


        const shades = [];


        for (let i = 0; i <= 10; i++) {

            const lightness =
                i * 10;


            const rgb =
                hslToRgb(
                    currentColor.h,
                    currentColor.s,
                    lightness
                );


            const hex =
                rgbToHex(
                    rgb.r,
                    rgb.g,
                    rgb.b
                );


            shades.push({

                name: `${lightness}%`,

                hex: hex

            });

        }


        grid.innerHTML =
            shades.map(function (shade) {

                return `

                    <div class="shade-card"
                         data-color="${shade.hex}">

                        <div
                            class="shade-preview"
                            style="background:${shade.hex}">
                        </div>

                        <div class="shade-info">

                            <span class="shade-name">
                                ${shade.name}
                            </span>

                            <span class="shade-value">
                                ${shade.hex}
                            </span>

                        </div>

                    </div>

                `;

            }).join("");


        addShadeClickEvents();

    }


    /* =====================================================
       SHADE CLICK
    ===================================================== */

    function addShadeClickEvents() {

        document
            .querySelectorAll(".shade-card")
            .forEach(function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        setColorFromHex(
                            item.dataset.color
                        );

                    }
                );

            });

    }

    /* =====================================================
       CONTRAST
    ===================================================== */

    function updateContrast(hex) {

        const background =
            "#FFFFFF";


        const ratio =
            getContrastRatio(
                hex,
                background
            );


        document.getElementById(
            "contrastForeground"
        ).textContent = hex;


        document.getElementById(
            "contrastBackground"
        ).textContent = background;


        document.getElementById(
            "contrastForegroundPreview"
        ).style.backgroundColor =
            hex;


        document.getElementById(
            "contrastBackgroundPreview"
        ).style.backgroundColor =
            background;


        document.getElementById(
            "contrastRatio"
        ).textContent =
            `${ratio.toFixed(2)} : 1`;


        updateWcagResults(ratio);

    }


    /* =====================================================
       WCAG
    ===================================================== */

    function updateWcagResults(ratio) {

        const normal =
            document.getElementById(
                "normalTextResult"
            );

        const large =
            document.getElementById(
                "largeTextResult"
            );

        const aaa =
            document.getElementById(
                "aaaTextResult"
            );


        setWcagStatus(
            normal,
            ratio >= 4.5
        );


        setWcagStatus(
            large,
            ratio >= 3
        );


        setWcagStatus(
            aaa,
            ratio >= 7
        );


        const rating =
            document.getElementById(
                "contrastRating"
            );


        if (ratio >= 7) {

            rating.textContent =
                "AAA";

        }
        else if (ratio >= 4.5) {

            rating.textContent =
                "AA";

        }
        else if (ratio >= 3) {

            rating.textContent =
                "Large Text AA";

        }
        else {

            rating.textContent =
                "Fail";

        }

    }


    /* =====================================================
       WCAG STATUS
    ===================================================== */

    function setWcagStatus(
        element,
        passed
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "pass",
            "fail"
        );


        const icon =
            element.querySelector("i");


        if (passed) {

            element.classList.add(
                "pass"
            );

            icon.className =
                "bi bi-check-circle-fill";

        }
        else {

            element.classList.add(
                "fail"
            );

            icon.className =
                "bi bi-x-circle-fill";

        }

    }


    /* =====================================================
       COPY BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".color-copy-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const target =
                        document.getElementById(
                            button.dataset.copyTarget
                        );


                    if (!target) {
                        return;
                    }


                    try {

                        await navigator.clipboard.writeText(
                            target.value
                        );

                    }
                    catch {

                        fallbackCopy(
                            target.value
                        );

                    }


                    const original =
                        button.innerHTML;


                    button.innerHTML = `
                        <i class="bi bi-check2"></i>
                        <span>Copied</span>
                    `;


                    button.disabled = true;


                    setTimeout(function () {

                        button.innerHTML =
                            original;

                        button.disabled =
                            false;

                    }, 1200);

                }
            );

        });


    /* =====================================================
       TABS
    ===================================================== */

    document
        .querySelectorAll(".color-tool-tab")
        .forEach(function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    const target =
                        tab.dataset.tab;


                    document
                        .querySelectorAll(
                            ".color-tool-tab"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "active"
                            );

                        });


                    document
                        .querySelectorAll(
                            ".color-tab-panel"
                        )
                        .forEach(function (panel) {

                            panel.classList.remove(
                                "active"
                            );

                        });


                    tab.classList.add(
                        "active"
                    );


                    const panel =
                        document.getElementById(
                            target + "Tab"
                        );


                    panel?.classList.add(
                        "active"
                    );

                }
            );

        });


    /* =====================================================
       HEX → RGB
    ===================================================== */

    function hexToRgb(hex) {

        hex =
            hex.replace("#", "");


        const number =
            parseInt(hex, 16);


        return {

            r:
                (number >> 16) & 255,

            g:
                (number >> 8) & 255,

            b:
                number & 255

        };

    }


    /* =====================================================
       RGB → HEX
    ===================================================== */

    function rgbToHex(r, g, b) {

        return "#" +

            [r, g, b]

                .map(function (value) {

                    return Math
                        .round(value)
                        .toString(16)
                        .padStart(2, "0");

                })

                .join("")

                .toUpperCase();

    }


    /* =====================================================
       RGB → HSL
    ===================================================== */

    function rgbToHsl(r, g, b) {

        r /= 255;
        g /= 255;
        b /= 255;


        const max =
            Math.max(r, g, b);

        const min =
            Math.min(r, g, b);


        let h = 0;
        let s = 0;


        const l =
            (max + min) / 2;


        if (max !== min) {

            const d =
                max - min;


            s =
                l > 0.5
                    ? d / (2 - max - min)
                    : d / (max + min);


            switch (max) {

                case r:

                    h =
                        (g - b) / d +
                        (g < b ? 6 : 0);

                    break;

                case g:

                    h =
                        (b - r) / d + 2;

                    break;

                case b:

                    h =
                        (r - g) / d + 4;

                    break;

            }


            h /= 6;

        }


        return {

            h:
                Math.round(h * 360),

            s:
                Math.round(s * 100),

            l:
                Math.round(l * 100)

        };

    }


    /* =====================================================
       HSL → RGB
    ===================================================== */

    function hslToRgb(h, s, l) {

        h /= 360;
        s /= 100;
        l /= 100;


        if (s === 0) {

            const value =
                Math.round(l * 255);

            return {
                r: value,
                g: value,
                b: value
            };

        }


        const q =
            l < 0.5
                ? l * (1 + s)
                : l + s - l * s;


        const p =
            2 * l - q;


        const hue =
            function (t) {

                if (t < 0) {
                    t += 1;
                }

                if (t > 1) {
                    t -= 1;
                }

                if (t < 1 / 6) {
                    return p +
                        (q - p) *
                        6 * t;
                }

                if (t < 1 / 2) {
                    return q;
                }

                if (t < 2 / 3) {
                    return p +
                        (q - p) *
                        (2 / 3 - t) *
                        6;
                }

                return p;

            };


        return {

            r:
                Math.round(
                    hue(h + 1 / 3) * 255
                ),

            g:
                Math.round(
                    hue(h) * 255
                ),

            b:
                Math.round(
                    hue(h - 1 / 3) * 255
                )

        };

    }


    /* =====================================================
       RGB → HSV
    ===================================================== */

    function rgbToHsv(r, g, b) {

        r /= 255;
        g /= 255;
        b /= 255;


        const max =
            Math.max(r, g, b);

        const min =
            Math.min(r, g, b);

        const difference =
            max - min;


        let h = 0;


        if (difference !== 0) {

            if (max === r) {

                h =
                    ((g - b) /
                        difference) %
                    6;

            }
            else if (max === g) {

                h =
                    (b - r) /
                    difference +
                    2;

            }
            else {

                h =
                    (r - g) /
                    difference +
                    4;

            }

            h *= 60;

            if (h < 0) {
                h += 360;
            }

        }


        const s =
            max === 0
                ? 0
                : difference / max;


        return {

            h: Math.round(h),

            s: Math.round(s * 100),

            v: Math.round(max * 100)

        };

    }


    /* =====================================================
       RGB → CMYK
    ===================================================== */

    function rgbToCmyk(r, g, b) {

        r /= 255;
        g /= 255;
        b /= 255;


        const k =
            1 -
            Math.max(r, g, b);


        if (k === 1) {

            return {
                c: 0,
                m: 0,
                y: 0,
                k: 100
            };

        }


        return {

            c:
                Math.round(
                    ((1 - r - k) /
                        (1 - k)) *
                    100
                ),

            m:
                Math.round(
                    ((1 - g - k) /
                        (1 - k)) *
                    100
                ),

            y:
                Math.round(
                    ((1 - b - k) /
                        (1 - k)) *
                    100
                ),

            k:
                Math.round(k * 100)

        };

    }


    /* =====================================================
       RGB → OKLCH
       Browser Color Conversion
    ===================================================== */

    function rgbToOklch(r, g, b) {

        const srgb = [
            r / 255,
            g / 255,
            b / 255
        ];


        const linear =
            srgb.map(function (value) {

                return value <= 0.04045

                    ? value / 12.92

                    : Math.pow(
                        (value + 0.055) /
                        1.055,
                        2.4
                    );

            });


        const l =
            0.4122214708 * linear[0] +
            0.5363325363 * linear[1] +
            0.0514459929 * linear[2];


        const m =
            0.2119034982 * linear[0] +
            0.6806995451 * linear[1] +
            0.1073969566 * linear[2];


        const s =
            0.0883024619 * linear[0] +
            0.2817188376 * linear[1] +
            0.6299787005 * linear[2];


        const lRoot =
            Math.cbrt(l);

        const mRoot =
            Math.cbrt(m);

        const sRoot =
            Math.cbrt(s);


        const L =
            0.2104542553 * lRoot +
            0.793617785 * mRoot -
            0.0040720468 * sRoot;


        const A =
            1.9779984951 * lRoot -
            2.428592205 * mRoot +
            0.4505937099 * sRoot;


        const B =
            0.0259040371 * lRoot +
            0.7827717662 * mRoot -
            0.808675766 * sRoot;


        const C =
            Math.sqrt(
                A * A +
                B * B
            );


        let H =
            Math.atan2(B, A) *
            180 /
            Math.PI;


        if (H < 0) {
            H += 360;
        }


        return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`;

    }


    /* =====================================================
       CONTRAST RATIO
    ===================================================== */

    function getContrastRatio(
        foreground,
        background
    ) {

        const fg =
            hexToRgb(foreground);

        const bg =
            hexToRgb(background);


        const fgLum =
            getRelativeLuminance(fg);

        const bgLum =
            getRelativeLuminance(bg);


        const lighter =
            Math.max(
                fgLum,
                bgLum
            );

        const darker =
            Math.min(
                fgLum,
                bgLum
            );


        return (
            (lighter + 0.05) /
            (darker + 0.05)
        );

    }


    /* =====================================================
       RELATIVE LUMINANCE
    ===================================================== */

    function getRelativeLuminance(rgb) {

        const values = [
            rgb.r,
            rgb.g,
            rgb.b
        ].map(function (value) {

            value /= 255;

            return value <= 0.03928

                ? value / 12.92

                : Math.pow(
                    (value + 0.055) /
                    1.055,
                    2.4
                );

        });


        return (
            0.2126 * values[0] +
            0.7152 * values[1] +
            0.0722 * values[2]
        );

    }


    /* =====================================================
       SLIDER BACKGROUNDS
    ===================================================== */

    function updateSliderBackgrounds() {

        hueSlider.style.background =
            "linear-gradient(90deg," +
            "#ff0000 0%," +
            "#ffff00 17%," +
            "#00ff00 33%," +
            "#00ffff 50%," +
            "#0000ff 67%," +
            "#ff00ff 83%," +
            "#ff0000 100%)";


        const h =
            currentColor.h;

        const l =
            currentColor.l;

        saturationSlider.style.background =
            `linear-gradient(
                90deg,
                hsl(${h}, 0%, ${l}%),
                hsl(${h}, 100%, ${l}%)
            )`;


        const s =
            currentColor.s;


        lightnessSlider.style.background =
            `linear-gradient(
                90deg,
                hsl(${h}, ${s}%, 0%),
                hsl(${h}, ${s}%, 50%),
                hsl(${h}, ${s}%, 100%)
            )`;

    }


    /* =====================================================
       FALLBACK COPY
    ===================================================== */

    function fallbackCopy(value) {

        const textarea =
            document.createElement("textarea");

        textarea.value =
            value;

        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand(
            "copy"
        );

        textarea.remove();

    }

    /* =========================================================
   COLOR HARMONY
========================================================= */
    const harmonyDescriptions = {

        complementary:
            "Colors positioned opposite each other on the color wheel.",

        analogous:
            "Colors positioned next to each other on the color wheel.",

        triadic:
            "Three colors evenly spaced around the color wheel.",

        split:
            "A base color combined with the two colors beside its complement.",

        tetradic:
            "Four colors arranged as two complementary pairs.",

        square:
            "Four colors evenly spaced around the color wheel.",

        monochromatic:
            "Different lightness variations of the same hue."

    };

    const harmonyType =
        document.getElementById("harmonyType");

    const harmonyColors =
        document.getElementById("harmonyColors");

    const harmonyDescription =
        document.getElementById("harmonyDescription");

    const copyHarmonyBtn =
        document.getElementById("copyHarmonyBtn");


    let currentHarmonyColors = [];

    function generateHarmony() {

        if (!harmonyColors) {
            return;
        }


        const type =
            harmonyType?.value || "complementary";


        const h =
            currentColor.h;

        const s =
            currentColor.s;

        const l =
            currentColor.l;


        let colors = [];


        switch (type) {

            case "complementary":

                colors = [

                    createHarmonyColor(
                        "Base",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Complement",
                        h + 180,
                        s,
                        l
                    )

                ];

                break;


            case "analogous":

                colors = [

                    createHarmonyColor(
                        "Left",
                        h - 30,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Base",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Right",
                        h + 30,
                        s,
                        l
                    )

                ];

                break;


            case "triadic":

                colors = [

                    createHarmonyColor(
                        "Base",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Triad 1",
                        h + 120,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Triad 2",
                        h + 240,
                        s,
                        l
                    )

                ];

                break;


            case "split":

                colors = [

                    createHarmonyColor(
                        "Base",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Split 1",
                        h + 150,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Split 2",
                        h + 210,
                        s,
                        l
                    )

                ];

                break;


            case "tetradic":

                colors = [

                    createHarmonyColor(
                        "Color 1",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 2",
                        h + 60,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 3",
                        h + 180,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 4",
                        h + 240,
                        s,
                        l
                    )

                ];

                break;


            case "square":

                colors = [

                    createHarmonyColor(
                        "Color 1",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 2",
                        h + 90,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 3",
                        h + 180,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Color 4",
                        h + 270,
                        s,
                        l
                    )

                ];

                break;


            case "monochromatic":

                colors = [

                    createHarmonyColor(
                        "Dark",
                        h,
                        s,
                        Math.max(5, l - 35)
                    ),

                    createHarmonyColor(
                        "Base",
                        h,
                        s,
                        l
                    ),

                    createHarmonyColor(
                        "Light",
                        h,
                        s,
                        Math.min(95, l + 20)
                    ),

                    createHarmonyColor(
                        "Lighter",
                        h,
                        Math.min(100, s + 5),
                        Math.min(98, l + 35)
                    )

                ];

                break;

        }


        currentHarmonyColors =
            colors;


        harmonyDescription.textContent =
            harmonyDescriptions[type];


        renderHarmonyColors();

    }

    function createHarmonyColor(
        name,
        hue,
        saturation,
        lightness
    ) {

        hue =
            ((hue % 360) + 360) % 360;


        const rgb =
            hslToRgb(
                hue,
                saturation,
                lightness
            );


        const hex =
            rgbToHex(
                rgb.r,
                rgb.g,
                rgb.b
            );


        return {

            name: name,

            hex: hex,

            h: hue,

            s: saturation,

            l: lightness

        };

    }

    function renderHarmonyColors() {

        harmonyColors.innerHTML =
            currentHarmonyColors
                .map(function (color, index) {

                    return `

                    <div class="harmony-color-card"
                         data-color="${color.hex}">

                        <div
                            class="harmony-color-preview"
                            style="background-color:${color.hex};">

                            <div class="harmony-color-number">
                                ${index + 1}
                            </div>

                        </div>


                        <div class="harmony-color-info">

                            <span class="harmony-color-name">
                                ${color.name}
                            </span>

                            <span class="harmony-color-value">
                                ${color.hex}
                            </span>

                        </div>

                    </div>

                `;

                })
                .join("");


        addHarmonyClickEvents();

    }

    function addHarmonyClickEvents() {

        document
            .querySelectorAll(
                ".harmony-color-card"
            )
            .forEach(function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        const hex =
                            card.dataset.color;


                        setColorFromHex(hex);

                    }
                );

            });

    }


    copyHarmonyBtn?.addEventListener(
        "click",
        async function () {

            if (
                !currentHarmonyColors.length
            ) {
                return;
            }


            const text =
                currentHarmonyColors
                    .map(function (color) {

                        return `${color.name}: ${color.hex}`;

                    })
                    .join("\n");


            try {

                await navigator.clipboard.writeText(
                    text
                );

            }
            catch {

                fallbackCopy(text);

            }


            const original =
                copyHarmonyBtn.innerHTML;


            copyHarmonyBtn.innerHTML = `

            <i class="fa-solid fa-check"></i>

            <span>
                Copied
            </span>

        `;


            copyHarmonyBtn.disabled =
                true;


            setTimeout(function () {

                copyHarmonyBtn.innerHTML =
                    original;

                copyHarmonyBtn.disabled =
                    false;

            }, 1200);

        }
    );



    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateColor();

    
});

