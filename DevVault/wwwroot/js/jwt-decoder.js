"use strict";

const jwtInput = document.getElementById("jwtInput");
const decodeJwtBtn = document.getElementById("decodeJwtBtn");
const clearJwtBtn = document.getElementById("clearJwtBtn");

const jwtResult = document.getElementById("jwtResult");
const jwtError = document.getElementById("jwtError");
const jwtErrorMessage = document.getElementById("jwtErrorMessage");

const jwtHeaderOutput = document.getElementById("jwtHeaderOutput");
const jwtPayloadOutput = document.getElementById("jwtPayloadOutput");
const jwtSignatureOutput = document.getElementById("jwtSignatureOutput");

function base64UrlDecode(value) {

    // Base64URL → Base64
    value = value
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    // Add padding
    while (value.length % 4 !== 0) {
        value += "=";
    }

    try {

        const binary = atob(value);

        const bytes = Uint8Array.from(
            binary,
            char => char.charCodeAt(0)
        );

        return new TextDecoder("utf-8").decode(bytes);

    } catch {
        throw new Error("Invalid Base64URL data.");
    }
}


function decodeJwt(token) {

    token = token.trim();

    if (!token) {
        throw new Error("Please enter a JWT token.");
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
        throw new Error(
            "Invalid JWT format. A JWT must contain three parts."
        );
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    if (!encodedHeader || !encodedPayload || !signature) {
        throw new Error("Invalid JWT token.");
    }

    let header;
    let payload;

    try {

        header = JSON.parse(
            base64UrlDecode(encodedHeader)
        );

    } catch {
        throw new Error("Unable to decode JWT header.");
    }

    try {

        payload = JSON.parse(
            base64UrlDecode(encodedPayload)
        );

    } catch {
        throw new Error("Unable to decode JWT payload.");
    }

    return {
        header,
        payload,
        signature
    };
}

decodeJwtBtn.addEventListener("click", () => {

    hideError();

    try {

        const token = jwtInput.value;

        const result = decodeJwt(token);

        displayJwt(result);

    } catch (error) {

        showError(error.message);

    }

});

function displayJwt(result) {
    console.log(result);

    jwtHeaderOutput.textContent =
        JSON.stringify(result.header, null, 4);

    jwtPayloadOutput.textContent =
        JSON.stringify(result.payload, null, 4);

    jwtSignatureOutput.textContent = JSON.stringify(result.signature, null, 4);    
    // jwtResult.style.display = "block";
}

function showError(message) {

    jwtErrorMessage.textContent = message;

    jwtError.style.display = "flex";
    jwtResult.style.display = "none";
}


function hideError() {

    jwtError.style.display = "none";
}

clearJwtBtn.addEventListener("click", () => {

    jwtInput.value = "";

    jwtHeaderOutput.textContent = "";
    jwtPayloadOutput.textContent = "";

    hideError();

    jwtInput.focus();
});

const btnHeaderCopy = document.getElementById("btnHeaderCopy");

btnHeaderCopy.addEventListener("click", async () => {
    if (jwtHeaderOutput.textContent) {
        await navigator.clipboard.writeText(jwtHeaderOutput.textContent);
    }    
});


const btnPayLoadCopy = document.getElementById("btnPayLoadCopy");

btnPayLoadCopy.addEventListener("click", async () => {
    if (jwtPayloadOutput.textContent) {
        await navigator.clipboard.writeText(jwtPayloadOutput.textContent);
    }
});


const btnSignatureCopy = document.getElementById("btnSignatureCopy");

btnSignatureCopy.addEventListener("click", async () => {
    if (jwtSignatureOutput.textContent) {
        await navigator.clipboard.writeText(jwtSignatureOutput.textContent);
    }
});






