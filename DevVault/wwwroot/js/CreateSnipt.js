const label = document.getElementById("selectedValue");
const languageSelect = document.getElementById("snippetLanguage");
label.textContent = "CSharp";

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

let snippetEditor = null;

require(["vs/editor/editor.main"], function () {

    if (!languageSelect) {
        return;
    }

    const selectedLanguage = languageSelect.value;

    snippetEditor = monaco.editor.create(
        document.getElementById("monacoEditor"),
        {
            value: getDefaultCode(selectedLanguage),

            language:
                getMonacoLanguage(selectedLanguage),


            theme: getMonacoTheme(),

            automaticLayout: true,

            fontSize: 14,

            minimap: {
                enabled: true
            },

            wordWrap: "on",

            scrollBeyondLastLine: false,

            lineNumbers: "on",

            roundedSelection: true,

            padding: {
                top: 12,
                bottom: 12
            },

            suggestOnTriggerCharacters: true,

            quickSuggestions: true,

            parameterHints: {
                enabled: true
            },

            formatOnPaste: true,

            formatOnType: true,
            fixedOverflowWidgets: true
        }
    );

    languageSelect.addEventListener(
        "change",
        function () {

            const selectedLanguage =
                this.value;

            if (selectedLanguage) {
                label.textContent = selectedLanguage;
                snippetEditor.setValue(
                    getDefaultCode(selectedLanguage)
                );
            }

            changeEditorLanguage(
                selectedLanguage
            );

        }
    );
    observeThemeChanges();

    function observeThemeChanges() {

        const observer = new MutationObserver(function () {

            if (!snippetEditor) {
                return;
            }

            const theme =
                getMonacoTheme();

            monaco.editor.setTheme(theme);

        });


        observer.observe(
            document.body,
            {
                attributes: true,
                attributeFilter: ["class"]
            }
        );


        observer.observe(
            document.documentElement,
            {
                attributes: true,
                attributeFilter: ["data-theme", "class"]
            }
        );
    }

    function getMonacoTheme() {
        console.log()

        if (localStorage.getItem("devvault-theme") === "light") {
            return "vs";
        }
        else {
            return "vs-dark";
        }
    }

    // =========================================================
    // SAVE SNIPPET
    // =========================================================

    // const form = document.querySelector(".snippet-create-card form");

    // form.addEventListener("submit", function (event) {

    //     STOP PAGE REFRESH
    //     event.preventDefault();

    //     Get values
    //     const title =
    //         document.getElementById("Title").value.trim();

    //     const language =
    //         document.getElementById("snippetLanguage").value;

    //     const description =
    //         document.getElementById("Description").value.trim();

    //     const code =
    //         snippetEditor.getValue();


    //     Create snippet
    //     const snippet = {

    //         id: crypto.randomUUID(),

    //         title: title,

    //         language: language,

    //         tags: [...tags],

    //         description: description,

    //         code: code,

    //         createdAt: new Date().toISOString()

    //     };


    //     Get old snippets
    //     const snippets =
    //         JSON.parse(
    //             localStorage.getItem("snippets")
    //         ) || [];


    //     Add new snippet
    //     snippets.push(snippet);


    //     Save
    //     localStorage.setItem(
    //         "snippets",
    //         JSON.stringify(snippets)
    //     );


    //     console.log("Snippet saved!");
    //     console.log(snippet);

    // });

});

function changeEditorLanguage(language) {

    if (!snippetEditor) {
        return;
    }

    const monacoLanguage =
        getMonacoLanguage(language);


    const model =
        snippetEditor.getModel();


    if (!model) {
        return;
    }


    monaco.editor.setModelLanguage(
        model,
        monacoLanguage
    );


    // Optional: change starter code
    const currentCode =
        snippetEditor.getValue();


    if (!currentCode.trim()) {



    }


    snippetEditor.focus();
}

function getDefaultCode(language) {

    console.log(language.toLowerCase())
    switch (language.toLowerCase()) {

        case "csharp":

            return `using System;
class Program
{
    static void Main()
    {
        Console.WriteLine("Hello World!");
    }
}`;


        case "java":

            return `public class Main
{
    public static void main(String[] args)
    {
        System.out.println("Hello World!");
    }
}`;


        case "javascript":

            return `function hello() {
    console.log("Hello World");
}

hello();`;


        case "react":

            return `import React from "react";
function App() {
    return (
        <div>
            <h1>Hello World</h1>
        </div>
    );
}

export default App;`;


        case "python":

            return `def hello():
    print("Hello World")

hello()`;


        case "sql":

            return `SELECT *
FROM Users
WHERE IsActive = 1
ORDER BY Id DESC;`;


        case "html":

            return `<div class="container">
    <h1>Hello World</h1>
</div>`;


        case "css":

            return `.container {
    display: flex;
    align-items: center;
    justify-content: center;
}`;


        default:

            return "";
    }
}

function getMonacoLanguage(formatterType) {

    switch (formatterType.toLowerCase()) {

        case "json":
            return "json";

        case "javascript":
            return "javascript";

        case "react":
            return "javascript";

        case "html":
            return "html";

        case "css":
            return "css";

        case "xml":
            return "xml";

        case "sql":
            return "sql";

        case "csharp":
            return "csharp";

        case "java":
            return "java";

        default:
            return "plaintext";
    }
}


const tagInput = document.getElementById("snippetTagInput");
const tagsContainer = document.getElementById("snippetTagsContainer");
const hiddenTagsContainer = document.getElementById("snippetHiddenTags");

let tags = [];


// =========================================================
// ADD TAG
// =========================================================

function addTag(value) {

    value = value.trim();

    // Remove # if user types it
    value = value.replace(/^#+/, "");

    if (!value) {
        return;
    }

    // Prevent duplicate tags
    const exists = tags.some(
        tag => tag.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
        tagInput.value = "";
        return;
    }

    tags.push(value);

    tagInput.value = "";

    renderTags();
}


// =========================================================
// REMOVE TAG
// =========================================================

function removeTag(index) {

    tags.splice(index, 1);

    renderTags();

    tagInput.focus();
}


// =========================================================
// RENDER TAGS
// =========================================================

function renderTags() {

    tagsContainer.innerHTML = "";
    hiddenTagsContainer.innerHTML = "";

    tags.forEach((tag, index) => {

        // Visual tag
        const tagElement = document.createElement("span");

        tagElement.className = "snippet-create-tag";

        tagElement.innerHTML = `
        <span>#${escapeHtml(tag)}</span>
        <button type="button"
        class="snippet-create-tag-remove"
        data-index="${index}"
        aria-label="Remove ${escapeHtml(tag)}">
        <i class="bi bi-x"></i>
        </button>
        `;

        tagsContainer.appendChild(tagElement);


        // Hidden input for ASP.NET
        const hiddenInput = document.createElement("input");

        hiddenInput.type = "hidden";
        hiddenInput.name = "Tags";
        hiddenInput.value = tag;

        hiddenTagsContainer.appendChild(hiddenInput);

    });


    // Remove buttons
    document.querySelectorAll(".snippet-create-tag-remove")
        .forEach(button => {

            button.addEventListener("click", function () {

                const index = parseInt(
                    this.dataset.index
                );

                removeTag(index);
            });

        });
}


// =========================================================
// ENTER = ADD TAG
// =========================================================

tagInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        addTag(this.value);

    }


    // Backspace on empty input removes last tag
    if (
        event.key === "Backspace" &&
        this.value === "" &&
        tags.length > 0
    ) {

        tags.pop();

        renderTags();
    }

});


// =========================================================
// COMMA = ADD TAG
// =========================================================

tagInput.addEventListener("input", function () {

    if (this.value.includes(",")) {

        const values = this.value.split(",");

        values.forEach(value => {

            if (value.trim()) {
                addTag(value);
            }

        });

        this.value = "";
    }

});


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


const form = document.getElementById('formid');

form.addEventListener('submit', function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // 3. Gather all form data automatically
    const formData = new FormData(form);

    // 4. Convert it into a clean JavaScript object
    const data = Object.fromEntries(formData.entries());

    // Use your data here
    let SnipData = null;
    if (localStorage.getItem("snipData")) {
        SnipData = JSON.parse(localStorage.getItem("snipData"));

        SnipData = [...SnipData, { ...data, Tags: [...tags], Code: snippetEditor.getValue(), SnipId: crypto.randomUUID(), createdAt: new Date() }];
    }
    else {
        SnipData = [{ ...data, Tags: [...tags], Code: snippetEditor.getValue(), SnipId: crypto.randomUUID(), createdAt: new Date() }];
    }

    localStorage.setItem("snipData", JSON.stringify(SnipData));
    window.location.href = "/Snippets/Index";    
});