const id = localStorage.getItem("selectedSnippetId");

const snippets =
    JSON.parse(localStorage.getItem("snipData")) || [];

const snippet =
    snippets.find(x => String(x.SnipId) === String(id));

const notFound =
    document.getElementById("snippetNotFound");


if (!snippet) {

    notFound.classList.remove("d-none");

}
else {

    loadSnippet();

    // =====================================================
    // COPY CODE
    // =====================================================

    document.getElementById("copyCode")
        .addEventListener("click", function () {

            navigator.clipboard.writeText(snippet.Code);

            this.innerHTML =
                `<i class="bi bi-check2 me-1"></i>
                 Copied`;

            setTimeout(() => {

                this.innerHTML =
                    `<i class="bi bi-copy me-1"></i>
                     Copy Code`;

            }, 1500);

        });


    // =====================================================
    // EDIT BUTTON
    // =====================================================

    document.getElementById("editSnippet")
        .addEventListener("click", function () {

            enableEditMode();

        });

}


// =========================================================
// LOAD SNIPPET
// =========================================================

function loadSnippet() {

    document.getElementById("snippetTitle")
        .textContent = snippet.Title;

    document.getElementById("breadcrumbTitle")
        .textContent = snippet.Title;

    document.getElementById("snippetLanguage")
        .textContent = snippet.Language;

    document.getElementById("codeLanguage")
        .textContent = snippet.Language;

    document.getElementById("snippetDescription")
        .textContent = snippet.Description;

    document.getElementById("snippetCode")
        .textContent = snippet.Code;


    // TAGS

    document.getElementById("snippetTags")
        .innerHTML =
        snippet.Tags.map(tag =>
            `<span class="badge snippet-tag">
                #${escapeHtml(tag)}
            </span>`
        ).join("");


    // DATE

    document.getElementById("snippetDate")
        .textContent =
        new Date(snippet.createdAt)
            .toLocaleDateString();
}


// =========================================================
// ENABLE EDIT MODE
// =========================================================

function enableEditMode() {

    const title =
        document.getElementById("snippetTitle");

    const language =
        document.getElementById("snippetLanguage");

    const description =
        document.getElementById("snippetDescription");

    const tags =
        document.getElementById("snippetTags");

    const code =
        document.getElementById("snippetCode");

    const editButton =
        document.getElementById("editSnippet");


    // =====================================================
    // EDIT INPUT STYLE
    // =====================================================

    const inputStyle = `
        width: 100%;
        box-sizing: border-box;
        height: 42px;
        padding: 0 12px;
        border: 1px solid #273449;
        border-radius: 7px;
        outline: none;
        background: #111827;
        color: #f1f5f9;
        font-size: 13px;
        font-family: inherit;
    `;


    const textareaStyle = `
        width: 100%;
        box-sizing: border-box;
        min-height: 90px;
        padding: 11px 12px;
        border: 1px solid #273449;
        border-radius: 7px;
        outline: none;
        resize: vertical;
        background: #111827;
        color: #f1f5f9;
        font-size: 13px;
        line-height: 1.5;
        font-family: inherit;
    `;


    const codeStyle = `
        width: 100%;
        box-sizing: border-box;
        min-height: 350px;
        padding: 16px;
        border: 0;
        outline: none;
        resize: vertical;
        background: #09111f;
        color: #dbeafe;
        font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre;
        tab-size: 4;
    `;


    // =====================================================
    // TITLE
    // =====================================================

    title.outerHTML = `
        <input
            type="text"
            id="snippetTitle"
            value="${escapeAttribute(snippet.Title)}"
            style="${inputStyle}">
    `;


    // =====================================================
    // LANGUAGE
    // =====================================================

    language.outerHTML = `
        <input
            type="text"
            id="snippetLanguage"
            value="${escapeAttribute(snippet.Language)}"
            style="${inputStyle} max-width: 220px;">
    `;


    // =====================================================
    // DESCRIPTION
    // =====================================================

    description.outerHTML = `
        <textarea
            id="snippetDescription"
            rows="3"
            style="${textareaStyle} margin-top: 12px;">${escapeHtml(snippet.Description)}</textarea>
    `;


    // =====================================================
    // TAGS
    // =====================================================

    tags.innerHTML = `
        <input
            type="text"
            id="snippetTagsInput"
            value="${escapeAttribute(snippet.Tags.join(", "))}"
            placeholder="javascript, array, function"
            style="${inputStyle}">
    `;


    // =====================================================
    // CODE
    // =====================================================

    code.outerHTML = `
        <textarea
            id="snippetCode"
            rows="18"
            style="${codeStyle}">${escapeHtml(snippet.Code)}</textarea>
    `;


    // =====================================================
    // EDIT → SAVE
    // =====================================================

    editButton.innerHTML =
        `<i class="bi bi-check-lg me-1"></i>
         Save`;

    editButton.classList.remove(
        "btn-outline-secondary"
    );

    editButton.classList.add(
        "btn-primary"
    );


    // =====================================================
    // REMOVE OLD EVENT
    // =====================================================

    const newEditButton =
        editButton.cloneNode(true);

    editButton.parentNode.replaceChild(
        newEditButton,
        editButton
    );


    newEditButton.addEventListener(
        "click",
        saveSnippet
    );
}

// =========================================================
// SAVE EDITED SNIPPET
// =========================================================

function saveSnippet() {

    const title =
        document.getElementById("snippetTitle")
            .value.trim();

    const language =
        document.getElementById("snippetLanguage")
            .value.trim();

    const description =
        document.getElementById("snippetDescription")
            .value.trim();

    const tagsValue =
        document.getElementById("snippetTagsInput")
            .value.trim();

    const code =
        document.getElementById("snippetCode")
            .value;


    // =====================================================
    // VALIDATION
    // =====================================================

    if (!title) {
        alert("Please enter snippet title.");
        return;
    }

    if (!language) {
        alert("Please enter programming language.");
        return;
    }

    if (!code.trim()) {
        alert("Please enter code.");
        return;
    }


    // =====================================================
    // TAGS
    // =====================================================

    const tags =
        tagsValue
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");


    // =====================================================
    // UPDATE OBJECT
    // =====================================================

    snippet.Title = title;
    snippet.Language = language;
    snippet.Description = description;
    snippet.Tags = tags;
    snippet.Code = code;


    // =====================================================
    // SAVE TO LOCAL STORAGE
    // =====================================================

    localStorage.setItem(
        "snipData",
        JSON.stringify(snippets)
    );


    // =====================================================
    // RELOAD VIEW
    // =====================================================

    loadSnippet();


    // Restore breadcrumb
    document.getElementById("breadcrumbTitle")
        .textContent = snippet.Title;


    // Restore code language
    document.getElementById("codeLanguage")
        .textContent = snippet.Language;


    // Restore edit button
    const oldButton =
        document.getElementById("editSnippet");

    const newButton =
        oldButton.cloneNode(false);

    newButton.id = "editSnippet";
    newButton.type = "button";
    newButton.className =
        "btn btn-outline-secondary";

    newButton.innerHTML =
        `<i class="bi bi-pencil me-1"></i>
         Edit`;

    oldButton.parentNode.replaceChild(
        newButton,
        oldButton
    );


    newButton.addEventListener(
        "click",
        enableEditMode
    );


    alert("Snippet updated successfully.");
    window.location.reload();
}


// =========================================================
// DELETE
// =========================================================

function DelSnippets() {

    const conform =
        confirm(
            "Are you sure you want to delete this snippet?"
        );

    if (conform) {

        const data =
            snippets.filter(
                x => String(x.SnipId) !== String(id)
            );

        localStorage.setItem(
            "snipData",
            JSON.stringify(data)
        );

        window.location.href =
            "/Snippets";

    }
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// =========================================================
// ESCAPE ATTRIBUTE
// =========================================================

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}