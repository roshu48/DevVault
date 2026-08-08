require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

import {
    format as prettierFormat
} from "https://cdn.jsdelivr.net/npm/prettier@3.9.6/+esm";

import postcssPlugin from "https://cdn.jsdelivr.net/npm/prettier@3.9.6/plugins/postcss.mjs";

import babelPlugin from "https://cdn.jsdelivr.net/npm/prettier@3.9.6/plugins/babel.mjs";
import estreePlugin from "https://cdn.jsdelivr.net/npm/prettier@3.9.6/plugins/estree.mjs";
import htmlPlugin from "https://cdn.jsdelivr.net/npm/prettier@3.9.6/plugins/html.mjs";

import {
    formatJava
} from "./formatter/java-formatter.mjs";

import { format as formatSqlQuery } from "https://cdn.jsdelivr.net/npm/sql-formatter@15.8.2/+esm";
import xmlFormatter from "https://cdn.jsdelivr.net/npm/xml-formatter@3.7.0/+esm";


let editor = null;

const formatBtn = document.getElementById("formatBtn");

if (formatBtn) {

    formatBtn.addEventListener("click", async function () {

        await formatCode();

    });

}

async function formatCode() {

    if (!editor) {
        return;
    }


    const code = editor.getValue();


    if (!code.trim()) {

        showMessage(
            "Please enter some code first.",
            "warning"
        );

        return;
    }


    const editorElement =
        document.getElementById("editor");

    if (!editorElement) {
        return;
    }


    const formatterType =
        editorElement.dataset.formatterType;


    try {

        formatBtn.disabled = true;

        formatBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
            Formatting...
        `;


        let formattedCode;


        // C#
        if (formatterType === "csharp") {

            formattedCode =
                await formatCSharp(code);

        }
        else if (formatterType === "json")
        {
            formattedCode = await formatJson(code)
        }
        else if (formatterType === "javascript") {
            formattedCode = await formatJavaScript(code)
        }
        else if (formatterType === "html")
        {
            formattedCode = await formatHtml(code);
        }
        else if (formatterType === "css") {
            formattedCode = await formatCss(code);
        }
        else if (formatterType === "xml") {
            formattedCode = formatXml(code);
        }
        else if (formatterType === "sql") {
            formattedCode = formatSql(code);
        }  
        else if (formatterType === "java") {

            formattedCode = await formatJava(code);

        }
        else {

            throw new Error(
                `${formatterType} formatter is not implemented yet.`
            );
        }
        editor.setValue(formattedCode);

        const output =
            document.getElementById("formatterOutput");

        output.textContent = formattedCode;

        const status =
            document.getElementById("formatterStatus");

        status.textContent = "Formatted";

        showMessage(
            "Code formatted successfully.",
            "success"
        );
    }
    catch (error) {

        console.error("Formatting error:", error);

        showMessage(
            error.message || "Unable to format code.",
            "error"
        );

    }
    finally {

        formatBtn.disabled = false;

        formatBtn.innerHTML = `
            <i class="bi bi-magic"></i>
            Format
        `;

    }
}

async function formatCSharp(code) {

    const response = await fetch(
        "/Formatter/FormatCSharp",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                code: code
            })
        }
    );


    const result =
        await response.json();


    if (!response.ok || !result.success) {

        throw new Error(
            result.message ||
            "C# formatting failed."
        );

    }


    return result.code;
}

function formatJson(code) {

    try {

        // Convert text -> JSON object
        const jsonObject = JSON.parse(code);

        // Convert JSON object -> formatted JSON
        return JSON.stringify(
            jsonObject,
            null,
            4
        );

    }
    catch (error) {

        throw new Error(
            "Invalid JSON: " + error.message
        );

    }
}

async function formatJavaScript(code) {

    try {

        return await prettierFormat(code, {

            parser: "babel",

            plugins: [
                babelPlugin,
                estreePlugin
            ]

        });

    }
    catch (error) {

        throw new Error(
            "Invalid JavaScript: " +
            error.message
        );

    }
}

async function formatHtml(code) {

    try {

        return await prettierFormat(code, {

            parser: "html",

            plugins: [
                htmlPlugin
            ]

        });

    }
    catch (error) {

        throw new Error(
            "Invalid HTML: " +
            error.message
        );

    }
}

async function formatCss(code) {

    try {

        return await prettierFormat(code, {

            parser: "css",

            plugins: [
                postcssPlugin
            ]

        });

    }
    catch (error) {

        throw new Error(
            "Invalid CSS: " +
            error.message
        );

    }
}

function formatXml(code) {

    try {

        if (!code || !code.trim()) {
            throw new Error("XML code cannot be empty.");
        }

        return xmlFormatter(code, {
            indentation: "    ",
            collapseContent: false
        });

    }
    catch (error) {

        throw new Error(
            "Invalid XML: " + error.message
        );

    }
}

function formatSql(code) {

    try {

        if (!code || !code.trim()) {
            throw new Error("SQL code cannot be empty.");
        }

        return formatSqlQuery(code, {
            language: "transactsql",
            tabWidth: 4,
            keywordCase: "upper"
        });

    }
    catch (error) {

        throw new Error(
            "Invalid SQL: " + error.message
        );

    }
}

require(["vs/editor/editor.main"], function () {

    const editorElement = document.getElementById("editor");
    const formatterType = editorElement.dataset.formatterType;
    console.log(formatterType);

    if (!editorElement) {
        return;
    }

    editor = monaco.editor.create(editorElement, {

        value: getDefaultCode(formatterType),

        language: getMonacoLanguage(formatterType),

        theme: "vs-dark",

        automaticLayout: true,

        fontSize: 16,

        minimap: {
            enabled: true
        },

        wordWrap: "on",

        scrollBeyondLastLine: false
    });
    initializeButtons();

    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("click", function () {

        // Check current theme
        if (document.body.classList.contains("light-theme")) {

            // Change to dark
            document.body.classList.remove("light-theme");

            monaco.editor.setTheme("vs-dark");          
        } else {

            // Change to light
            document.body.classList.add("light-theme");

            monaco.editor.setTheme("vs");
        }
    });   
    
});

function initializeButtons() {
    const pasteBtn = document.getElementById("pasteBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyBtn = document.getElementById("copyBtn"); 
    const copyOutputBtn  = document.getElementById("copyOutputBtn"); 
    

    pasteBtn.addEventListener("click", async function () {
        try {
            const text = await navigator.clipboard.readText();
            if (!text) {
                return;
            }

            editor.setValue(text);
            editor.focus();
        }
        catch (error) {

            console.error("Unable to paste:", error);

        }

    });

    clearBtn.addEventListener("click", function () {

        editor.setValue("");

        editor.focus();

    });

    copyBtn.addEventListener("click", async function () {
        try {            

            if (!editor) {
                return;
            }

            const code = editor.getValue();            

            if (!code.trim()) {
                showMessage(
                    "There is no code to copy.",
                    "warning"
                );

                return;
            }

            await navigator.clipboard.writeText(code);

            showMessage(
                "Code copied to clipboard.",
                "success"
            );

        }
        catch (error) {

            console.error("Unable to copy:", error);

            showMessage(
                "Unable to copy code.",
                "error"
            );

        }
    })

    copyOutputBtn.addEventListener("click",async function () {
        try {

            const output =
                document.getElementById("formatterOutput");
           
            const code = output.textContent
           
            await navigator.clipboard.writeText(code);

            showMessage(
                "Code copied to clipboard.",
                "success"
            );
        }
        catch (error) {

            console.error("Unable to copy:", error);

            showMessage(
                "Unable to copy code.",
                "error"
            );

        }
    })
}



function getMonacoLanguage(formatterType) {

    switch (formatterType.toLowerCase()) {

        case "json":
            return "json";

        case "javascript":
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


function getDefaultCode(formatterType) {

    switch (formatterType.toLowerCase()) {

        case "json":
            return `{
    "name": "DevVault",
    "version": "1.0.0"
}`;

        case "csharp":
            return `using System;

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello World!");
    }
}`;

        case "javascript":
            return `function hello() {
    console.log("Hello World");
}`;

        default:
            return "";
    }
}

function showMessage(message, type = "info") {

    const messageElement =
        document.getElementById("formatterMessage");

    const textElement =
        document.getElementById("formatterMessageText");


    if (!messageElement || !textElement) {
        return;
    }


    textElement.textContent = message;


    messageElement.classList.remove(
        "success",
        "error",
        "warning"
    );

    messageElement.classList.add(type);
}