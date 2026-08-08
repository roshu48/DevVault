document.addEventListener("DOMContentLoaded", function () {

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    if (!themeToggle || !themeIcon) {
        return;
    }


    // =================================
    // APPLY SAVED THEME
    // =================================

    const savedTheme = localStorage.getItem("devvault-theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");

        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-fill");

    }


    // =================================
    // TOGGLE THEME
    // =================================

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-theme");

        const isDark =
            document.body.classList.contains("dark-theme");


        if (isDark) {

            // Dark Mode

            themeIcon.classList.remove("bi-sun-fill");
            themeIcon.classList.add("bi-moon-fill");

            localStorage.setItem(
                "devvault-theme",
                "dark"
            );

        }
        else {

            // Light Mode

            themeIcon.classList.remove("bi-moon-fill");
            themeIcon.classList.add("bi-sun-fill");

            localStorage.setItem(
                "devvault-theme",
                "light"
            );

        }

    });

});