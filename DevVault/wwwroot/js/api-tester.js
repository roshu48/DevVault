/* =========================================================
   DEVVAULT API TESTER
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const methodSelect = document.getElementById("apiMethod");
    const urlInput = document.getElementById("apiUrl");
    const sendButton = document.getElementById("sendApiRequestBtn");

    const paramsContainer =
        document.getElementById("paramsContainer");

    const headersContainer =
        document.getElementById("headersContainer");

    const addParamButton =
        document.getElementById("addParamBtn");

    const addHeaderButton =
        document.getElementById("addHeaderBtn");

    const bodyType =
        document.getElementById("bodyType");

    const requestBody =
        document.getElementById("apiRequestBody");

    const authType =
        document.getElementById("authType");

    const authToken =
        document.getElementById("authToken");

    // Request preview
    const previewMethod =
        document.getElementById("previewMethod");

    const previewUrl =
        document.getElementById("previewUrl");

    // Response
    const responseStatus =
        document.getElementById("responseStatus");

    const responseTime =
        document.getElementById("responseTime");

    const responseSize =
        document.getElementById("responseSize");

    const responseOutput =
        document.getElementById("apiResponseOutput");

    const responseHeadersOutput =
        document.getElementById("apiResponseHeaders");

    const copyRequestButton =
        document.getElementById("copyRequestBtn");

    const copyResponseButton =
        document.getElementById("copyResponseBtn");


    // =====================================================
    // REQUEST TABS
    // =====================================================

    const apiTabs =
        document.querySelectorAll(".api-tab");

    const apiTabContents =
        document.querySelectorAll(".api-tab-content");


    apiTabs.forEach(function (tab) {

        tab.addEventListener("click", function (event) {

            event.preventDefault();

            const selectedTab =
                this.getAttribute("data-tab");


            // Remove active from all tabs
            apiTabs.forEach(function (item) {

                item.classList.remove("active");

            });


            // Remove active from all contents
            apiTabContents.forEach(function (content) {

                content.classList.remove("active");

            });


            // Activate clicked tab
            this.classList.add("active");


            // Activate corresponding content
            const selectedContent =
                document.getElementById(
                    selectedTab + "Tab"
                );


            if (selectedContent) {

                selectedContent.classList.add("active");

            }

        });

    });


    // =====================================================
    // RESPONSE TABS
    // =====================================================

    const responseTabs =
        document.querySelectorAll(".api-response-tab");

    const responseContents =
        document.querySelectorAll(
            ".api-response-content"
        );


    responseTabs.forEach(function (tab) {

        tab.addEventListener("click", function (event) {

            event.preventDefault();

            const selectedContentId =
                this.getAttribute(
                    "data-response-tab"
                );


            // Remove active from all response tabs
            responseTabs.forEach(function (item) {

                item.classList.remove("active");

            });


            // Remove active from all response contents
            responseContents.forEach(function (content) {

                content.classList.remove("active");

            });


            // Activate clicked response tab
            this.classList.add("active");


            // Activate corresponding content
            const selectedContent =
                document.getElementById(
                    selectedContentId
                );


            if (selectedContent) {

                selectedContent.classList.add("active");

            }

        });

    });


    // =====================================================
    // INITIALIZE
    // =====================================================

    updateRequestPreview();

    // =====================================================
// BUILD HEADERS
// =====================================================

function buildHeaders() {

    const headers =
        getKeyValueData(headersContainer);

    // Authentication
    const selectedAuth =
        authType
            ? authType.value
            : "none";

    const token =
        authToken
            ? authToken.value.trim()
            : "";

    // Bearer Token
    if (selectedAuth === "bearer" && token) {

        headers["Authorization"] =
            token.toLowerCase().startsWith("bearer ")
                ? token
                : `Bearer ${token}`;
    }

    // Basic Authentication
    if (selectedAuth === "basic" && token) {

        headers["Authorization"] =
            token.toLowerCase().startsWith("basic ")
                ? token
                : `Basic ${token}`;
    }

    // API Key
    if (selectedAuth === "apikey" && token) {

        headers["X-API-Key"] = token;
    }

    return headers;
}


// =====================================================
// BUILD REQUEST BODY
// =====================================================

function buildRequestBody(headers) {

    if (!requestBody) {
        return undefined;
    }

    const method =
        methodSelect
            ? methodSelect.value
            : "GET";

    // GET and DELETE don't normally need a body
    if (
        method === "GET" ||
        method === "DELETE"
    ) {
        return undefined;
    }

    const body =
        requestBody.value;

    if (!body.trim()) {
        return undefined;
    }

    const selectedType =
        bodyType
            ? bodyType.value
            : "json";


    // JSON
    if (selectedType === "json") {

        try {

            const json =
                JSON.parse(body);

            headers["Content-Type"] =
                headers["Content-Type"] ||
                "application/json";

            return JSON.stringify(json);

        }
        catch {

            throw new Error(
                "Invalid JSON body."
            );
        }
    }


    // XML
    if (selectedType === "xml") {

        headers["Content-Type"] =
            headers["Content-Type"] ||
            "application/xml";

        return body;
    }


    // Text
    headers["Content-Type"] =
        headers["Content-Type"] ||
        "text/plain";

    return body;
}


// =====================================================
// SEND API REQUEST
// =====================================================

async function sendApiRequest() {

    const method =
        methodSelect
            ? methodSelect.value
            : "GET";

    const url =
        buildRequestUrl();


    // =================================================
    // VALIDATE URL
    // =================================================

    if (!url) {

        showError(
            "Please enter an API URL."
        );

        return;
    }


    try {

        new URL(url);

    }
    catch {

        showError(
            "Please enter a valid URL."
        );

        return;
    }


    // =================================================
    // LOADING
    // =================================================

    setLoading(true);

    const startTime =
        performance.now();


    try {

        // =================================================
        // HEADERS
        // =================================================

        const headers =
            buildHeaders();


        // =================================================
        // BODY
        // =================================================

        const body =
            buildRequestBody(headers);


        // =================================================
        // FETCH OPTIONS
        // =================================================

        const options = {
            method: method,
            headers: headers
        };


        if (body !== undefined) {

            options.body = body;

        }


        console.log("Sending request:");
        console.log("Method:", method);
        console.log("URL:", url);
        console.log("Headers:", headers);
        console.log("Body:", body);


        // =================================================
        // SEND
        // =================================================

        const response =
            await fetch(
                url,
                options
            );


        // =================================================
        // RESPONSE TIME
        // =================================================

        const elapsed =
            Math.round(
                performance.now() - startTime
            );


        // =================================================
        // RESPONSE HEADERS
        // =================================================

        const responseHeaders = {};

        response.headers.forEach(
            function (value, key) {

                responseHeaders[key] =
                    value;

            }
        );


        // =================================================
        // RESPONSE BODY
        // =================================================

        const responseText =
            await response.text();


        // =================================================
        // RESPONSE SIZE
        // =================================================

        const sizeBytes =
            new Blob([
                responseText
            ]).size;


        // =================================================
        // DISPLAY RESPONSE
        // =================================================

        updateResponseStatus(
            response.status,
            response.statusText
        );


        if (responseTime) {

            responseTime.textContent =
                `Time: ${elapsed} ms`;

        }


        if (responseSize) {

            responseSize.textContent =
                `Size: ${formatBytes(sizeBytes)}`;

        }


        displayResponseBody(
            responseText
        );


        displayResponseHeaders(
            responseHeaders
        );


        console.log(
            "Response:",
            response.status,
            responseText
        );

    }
    catch (error) {

        console.error(
            "API request failed:",
            error
        );

        showError(
            getReadableError(error)
        );

    }
    finally {

        setLoading(false);

    }
    }

    // =====================================================
    // DISPLAY RESPONSE BODY
    // =====================================================

    function displayResponseBody(text) {

        if (!responseOutput) {
            return;
        }

        if (!text) {

            responseOutput.textContent =
                "(Empty response)";

            return;
        }

        try {

            const json =
                JSON.parse(text);

            responseOutput.textContent =
                JSON.stringify(
                    json,
                    null,
                    2
                );

        }
        catch {

            responseOutput.textContent =
                text;

        }
    }


    // =====================================================
    // DISPLAY RESPONSE HEADERS
    // =====================================================

    function displayResponseHeaders(headers) {

        if (!responseHeadersOutput) {
            return;
        }

        const lines =
            Object.entries(headers)
                .map(
                    ([key, value]) =>
                        `${key}: ${value}`
                );

        responseHeadersOutput.textContent =
            lines.length
                ? lines.join("\n")
                : "(No response headers)";
    }


    // =====================================================
    // RESPONSE STATUS
    // =====================================================

    function updateResponseStatus(
        status,
        statusText
    ) {

        if (!responseStatus) {
            return;
        }

        responseStatus.textContent =
            `Status: ${status} ${statusText || ""}`.trim();
    }


    // =====================================================
    // ERROR
    // =====================================================

    function showError(message) {

        if (responseStatus) {

            responseStatus.textContent =
                "Status: Request Failed";

        }

        if (responseTime) {

            responseTime.textContent =
                "Time: —";

        }

        if (responseSize) {

            responseSize.textContent =
                "Size: —";

        }

        if (responseOutput) {

            responseOutput.textContent =
                JSON.stringify(
                    {
                        error: message
                    },
                    null,
                    2
                );

        }

        if (responseHeadersOutput) {

            responseHeadersOutput.textContent =
                "(No response headers)";

        }
    }


    // =====================================================
    // READABLE ERROR
    // =====================================================

    function getReadableError(error) {

        if (!error) {

            return "Unknown error occurred.";

        }

        if (error.name === "TypeError") {

            return (
                "Unable to send the request. " +
                "The API may be unavailable or " +
                "the browser may have blocked the request because of CORS."
            );

        }

        return (
            error.message ||
            "An unknown error occurred."
        );
    }


    // =====================================================
    // LOADING
    // =====================================================

    function setLoading(isLoading) {

        if (!sendButton) {
            return;
        }

        if (isLoading) {

            sendButton.disabled = true;

            sendButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Sending...</span>
        `;

        }
        else {

            sendButton.disabled = false;

            sendButton.innerHTML = `
            <i class="fa-solid fa-paper-plane"></i>
            <span>Send</span>
        `;

        }
    }


    // =====================================================
    // FORMAT BYTES
    // =====================================================

    function formatBytes(bytes) {

        if (bytes === 0) {
            return "0 B";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB"
        ];

        const index =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        const value =
            bytes /
            Math.pow(
                1024,
                index
            );

        return (
            value.toFixed(
                index === 0
                    ? 0
                    : 2
            ) +
            " " +
            units[index]
        );
    }


    // =====================================================
    // METHOD CHANGE
    // =====================================================

    if (methodSelect) {

        methodSelect.addEventListener(
            "change",
            updateRequestPreview
        );

    }


    // =====================================================
    // URL CHANGE
    // =====================================================

    if (urlInput) {

        urlInput.addEventListener(
            "input",
            updateRequestPreview
        );

    }


    // =====================================================
    // ADD PARAMETER
    // =====================================================

    if (addParamButton) {

        addParamButton.addEventListener(
            "click",
            function () {

                addKeyValueRow(
                    paramsContainer,
                    "Parameter name",
                    "Parameter value"
                );

            }
        );

    }


    // =====================================================
    // ADD HEADER
    // =====================================================

    if (addHeaderButton) {

        addHeaderButton.addEventListener(
            "click",
            function () {

                addKeyValueRow(
                    headersContainer,
                    "Header name",
                    "Header value"
                );

            }
        );

    }


    // =====================================================
    // SEND
    // =====================================================

    if (sendButton) {
        sendButton.addEventListener(
            "click",
            sendApiRequest
        );
    }


    // =====================================================
    // COPY REQUEST
    // =====================================================

    if (copyRequestButton) {

        copyRequestButton.addEventListener(
            "click",
            copyRequest
        );

    }


    // =====================================================
    // COPY RESPONSE
    // =====================================================

    if (copyResponseButton) {

        copyResponseButton.addEventListener(
            "click",
            copyResponse
        );

    }


    // =====================================================
    // ADD PARAMETER / HEADER ROW
    // =====================================================

    function addKeyValueRow(
        container,
        keyPlaceholder,
        valuePlaceholder
    ) {
        if (!container) {
            return;
        }

        const row = document.createElement("div");
        row.className = "api-kv-row";

        row.innerHTML = `
        <input
            type="text"
            class="api-kv-input"
            placeholder="${keyPlaceholder}"
        />

        <input
            type="text"
            class="api-kv-input"
            placeholder="${valuePlaceholder}"
        />

        <button
            type="button"
            class="api-remove-btn"
            title="Remove"
        >
            <i class="bi bi-trash"></i>
        </button>
    `;

        container.appendChild(row);

        // =================================================
        // DELETE THIS ROW
        // =================================================

        const removeButton = row.querySelector(".api-remove-btn");

        if (removeButton) {

            removeButton.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                row.remove();

                updateRequestPreview();

            });
        }

        // =================================================
        // UPDATE PREVIEW WHEN INPUT CHANGES
        // =================================================

        row.querySelectorAll("input").forEach(function (input) {

            input.addEventListener(
                "input",
                updateRequestPreview
            );

        });
    }


    // =====================================================
    // REMOVE EXISTING ROWS
    // =====================================================

    // document.addEventListener("click", function (event) {

    //     const removeButton =
    //         event.target.closest(".api-remove-btn");

    //     if (!removeButton) {
    //         return;
    //     }

    //     event.preventDefault();
    //     event.stopPropagation();

    //     const row =
    //         removeButton.closest(".api-kv-row");

    //     if (!row) {
    //         return;
    //     }

    //     row.remove();

    //     updateRequestPreview();

    // });


    // =====================================================
    // GET KEY / VALUE DATA
    // =====================================================

    function getKeyValueData(container) {

        const result = {};


        if (!container) {
            return result;
        }


        const rows =
            container.querySelectorAll(
                ".api-kv-row"
            );


        rows.forEach(function (row) {

            const inputs =
                row.querySelectorAll("input");


            if (inputs.length < 2) {
                return;
            }


            const key =
                inputs[0].value.trim();

            const value =
                inputs[1].value;


            if (key) {

                result[key] = value;

            }

        });


        return result;
    }


    // =====================================================
    // BUILD REQUEST URL
    // =====================================================

    function buildRequestUrl() {

        let url =
            urlInput.value.trim();


        if (!url) {
            return "";
        }


        const params =
            getKeyValueData(
                paramsContainer
            );


        const queryParameters =
            new URLSearchParams();


        Object.entries(params)
            .forEach(function ([key, value]) {

                if (key.trim()) {

                    queryParameters.append(
                        key,
                        value
                    );

                }

            });


        const queryString =
            queryParameters.toString();


        if (!queryString) {

            return url;

        }


        if (url.includes("?")) {

            if (
                url.endsWith("?") ||
                url.endsWith("&")
            ) {

                return url + queryString;

            }

            return url + "&" + queryString;

        }


        return url + "?" + queryString;
    }


    // =====================================================
    // UPDATE REQUEST PREVIEW
    // =====================================================

    function updateRequestPreview() {

        if (previewMethod) {

            previewMethod.textContent =
                methodSelect
                    ? methodSelect.value
                    : "GET";

        }


        if (previewUrl) {

            previewUrl.textContent =
                buildRequestUrl() ||
                "https://api.example.com/users";

        }

    }


    // =====================================================
    // ... KEEP YOUR REMAINING API FUNCTIONS BELOW
    // =====================================================
});