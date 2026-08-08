import init, {
    format
} from "@wasm-fmt/clang-format/web";

let initialized = false;

async function initializeJavaFormatter() {

    if (!initialized) {

        await init();

        initialized = true;
    }
}


export async function formatJava(code) {

    if (!code || !code.trim()) {

        throw new Error(
            "Java code cannot be empty."
        );
    }


    try {

        await initializeJavaFormatter();


        const formattedCode = format(
            code,
            "Main.java",
            "Google"
        );


        return formattedCode;

    }
    catch (error) {

        console.error(
            "Java formatter error:",
            error
        );


        throw new Error(
            "Unable to format Java: " +
            error.message
        );
    }
}