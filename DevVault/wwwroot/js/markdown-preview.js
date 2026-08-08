/* =========================================================
   DEVVAULT - MARKDOWN PREVIEW
   EasyMDE + Marked + DOMPurify
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const markdownInput =
        document.getElementById("markdownInput");

    const markdownPreview =
        document.getElementById("markdownPreview");

    const newMarkdownBtn =
        document.getElementById("newMarkdownBtn");

    const copyMarkdownBtn =
        document.getElementById("copyMarkdownBtn");

    const downloadMarkdownBtn =
        document.getElementById("downloadMarkdownBtn");

    const clearMarkdownBtn =
        document.getElementById("clearMarkdownBtn");


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!markdownInput || !markdownPreview) {

        console.error(
            "Markdown Preview: Required elements not found."
        );

        return;
    }


    /* =====================================================
       DEFAULT MARKDOWN
    ===================================================== */

    const defaultMarkdown =
        `# DevVault

## Features

- JSON Formatter
- JWT Decoder
- Regex Tester

**Developer Tools**`;


    /* =====================================================
       MARKED CONFIGURATION
    ===================================================== */

    marked.setOptions({

        gfm: true,

        breaks: true,

        headerIds: false,

        mangle: false

    });


    /* =====================================================
       INITIALIZE EASYMDE
    ===================================================== */

    const easyMDE = new EasyMDE({

        element: markdownInput,

        autofocus: false,

        spellChecker: false,

        status: false,

        autosave: {
            enabled: false
        },

        placeholder:
            "Write your Markdown here...",

        toolbar: [

            "bold",
            "italic",
            "strikethrough",

            "|",

            "heading",

            "|",

            "quote",
            "unordered-list",
            "ordered-list",

            "|",

            "link",
            "image",
            "code",

            "|",

            "horizontal-rule",

            "|",

            "undo",
            "redo",

            "|",

            "clean-block"

        ]

    });


    /* =====================================================
       RENDER MARKDOWN
    ===================================================== */

    function renderMarkdown() {

        const markdown =
            easyMDE.value();


        /* ---------------------------------------------
           Empty state
        --------------------------------------------- */

        if (!markdown.trim()) {

            markdownPreview.innerHTML = `

                <div class="markdown-empty-state">

                    <div class="markdown-empty-icon">

                        <i class="bi bi-file-earmark-text"></i>

                    </div>

                    <h3>
                        No Markdown Yet
                    </h3>

                    <p>
                        Start writing Markdown in the
                        editor to see the preview here.
                    </p>

                </div>

            `;
            return;
        }


        /* ---------------------------------------------
           Markdown → HTML
        --------------------------------------------- */

        const rawHTML =
            marked.parse(markdown);


        /* ---------------------------------------------
           Sanitize HTML
        --------------------------------------------- */

        const safeHTML =
            DOMPurify.sanitize(rawHTML);


        /* ---------------------------------------------
           Update Preview
        --------------------------------------------- */

        markdownPreview.innerHTML =
            safeHTML;

    }


    /* =====================================================
       EASYMDE CHANGE EVENT
    ===================================================== */

    easyMDE.codemirror.on(
        "change",
        function () {

            renderMarkdown();

        }
    );


    /* =====================================================
       NEW BUTTON
    ===================================================== */

    if (newMarkdownBtn) {

        newMarkdownBtn.addEventListener(
            "click",
            function () {

                easyMDE.value(
                    defaultMarkdown
                );

                renderMarkdown();

                easyMDE.codemirror.focus();

                showButtonFeedback(
                    newMarkdownBtn,
                    "New"
                );

            }
        );

    }


    /* =====================================================
       COPY BUTTON
    ===================================================== */

    if (copyMarkdownBtn) {

        copyMarkdownBtn.addEventListener(
            "click",
            async function () {

                const markdown =
                    easyMDE.value();


                if (!markdown.trim()) {

                    showButtonFeedback(
                        copyMarkdownBtn,
                        "Nothing to Copy"
                    );

                    return;
                }


                try {

                    await navigator.clipboard.writeText(
                        markdown
                    );

                    showButtonFeedback(
                        copyMarkdownBtn,
                        "Copied!"
                    );

                }
                catch (error) {

                    console.error(
                        "Clipboard error:",
                        error
                    );


                    fallbackCopy(markdown);

                    showButtonFeedback(
                        copyMarkdownBtn,
                        "Copied!"
                    );

                }

            }
        );

    }


    /* =====================================================
       DOWNLOAD BUTTON
    ===================================================== */

    if (downloadMarkdownBtn) {

        downloadMarkdownBtn.addEventListener(
            "click",
            function () {

                const markdown =
                    easyMDE.value();


                if (!markdown.trim()) {

                    showButtonFeedback(
                        downloadMarkdownBtn,
                        "Nothing to Download"
                    );

                    return;
                }


                /* -----------------------------------------
                   Create Markdown file
                ----------------------------------------- */

                const blob =
                    new Blob(
                        [markdown],
                        {
                            type:
                                "text/markdown;charset=utf-8"
                        }
                    );


                const url =
                    URL.createObjectURL(blob);


                /* -----------------------------------------
                   Create download link
                ----------------------------------------- */

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "devvault-markdown.md";


                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);


                /* -----------------------------------------
                   Release object URL
                ----------------------------------------- */

                URL.revokeObjectURL(url);


                showButtonFeedback(
                    downloadMarkdownBtn,
                    "Downloaded!"
                );

            }
        );

    }


    /* =====================================================
       CLEAR BUTTON
    ===================================================== */

    if (clearMarkdownBtn) {

        clearMarkdownBtn.addEventListener(
            "click",
            function () {

                easyMDE.value("");

                renderMarkdown();

                easyMDE.codemirror.focus();

                showButtonFeedback(
                    clearMarkdownBtn,
                    "Cleared!"
                );

            }
        );

    }


    /* =====================================================
       FALLBACK COPY
    ===================================================== */

    function fallbackCopy(text) {

        const textarea =
            document.createElement("textarea");


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        try {

            document.execCommand("copy");

        }
        catch (error) {

            console.error(
                "Fallback copy failed:",
                error
            );

        }


        document.body.removeChild(
            textarea
        );

    }


    /* =====================================================
       BUTTON FEEDBACK
    ===================================================== */

    function showButtonFeedback(
        button,
        message
    ) {

        if (!button) {
            return;
        }


        const originalHTML =
            button.innerHTML;


        button.innerHTML = `
            <i class="bi bi-check2"></i>
            <span>${message}</span>
        `;


        button.disabled = true;


        setTimeout(
            function () {

                button.innerHTML =
                    originalHTML;

                button.disabled =
                    false;

            },
            1500
        );

    }


    /* =====================================================
       INITIAL CONTENT
    ===================================================== */

    easyMDE.value(
        defaultMarkdown
    );


    /* =====================================================
       INITIAL PREVIEW
    ===================================================== */

    renderMarkdown();

});