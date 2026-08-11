
const container = document.getElementById("snippetsContainer");
const noSnippets = document.getElementById("noSnippets");

const snippets =
    JSON.parse(localStorage.getItem("snipData")) || [];


if (snippets.length === 0) {

    noSnippets.classList.remove("d-none");

}
else {

    noSnippets.classList.add("d-none");

    snippets.forEach(snippet => {

        const col = document.createElement("div");

        col.className = "col-12 col-md-6 col-xl-4";

        col.innerHTML = `
            <div class="card snippet-card h-100">
                <div class="card-body d-flex flex-column">

                    <h5 class="snippet-name">
                        ${escapeHtml(snippet.Title)}
                    </h5>

                    <span class="badge snippet-language">
                        ${escapeHtml(snippet.Language)}
                    </span>

                    <div class="snippet-tags my-3">
                        ${snippet.Tags.map(tag =>
            `<span class="badge snippet-tag">
                                #${escapeHtml(tag)}
                            </span>`
        ).join("")}
                    </div>

                    <div class="snippet-preview mb-3">
                        <pre><code>${escapeHtml(snippet.Code)}</code></pre>
                    </div>

                    <div class="mt-auto">

                        <div class="snippet-date mb-3">
                            <i class="bi bi-clock me-1"></i>
                            ${new Date(snippet.createdAt)
                .toLocaleDateString()}
                        </div>

                        <div class="d-flex gap-2">

                            <button
                                class="btn btn-sm btn-primary flex-fill open-snippet"
                                data-id="${snippet.SnipId}">
                                <i class="bi bi-box-arrow-up-right me-1"></i>
                                Open
                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-danger delete-snippet"                                
                                data-id="${escapeHtml(snippet.SnipId)}">
                                <i class="bi bi-trash"></i>
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        `;

        container.appendChild(col);

    });

}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.querySelectorAll(".open-snippet")
    .forEach(button => {

        button.addEventListener("click", function () {

            const id = this.dataset.id;

            localStorage.setItem(
                "selectedSnippetId",
                id
            );

            window.location.href =
                "/Snippets/ViewSnippet";

        });

    });

document.querySelectorAll(".delete-snippet")
    .forEach(button => {

        button.addEventListener("click", function () {

            const id = this.dataset.id;

            DelSnippets(id);

        });

    });

function DelSnippets(id) {
    let conform = confirm("Are you sure you want to delete this snippets? ");
    if (conform) {
        let data = snippets.filter(x => x.SnipId !== id);
        localStorage.setItem("snipData", JSON.stringify(data))
        window.location.href =
            "/Snippets";
    }
    else {
        alert("Snippets not deleted");
    }
}
