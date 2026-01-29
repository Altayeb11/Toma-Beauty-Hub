document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("postForm");
    const list = document.getElementById("postsList");

    const render = () => {
        const posts = JSON.parse(localStorage.getItem("toma_articles") || "[]");
        list.innerHTML = "";
        posts.forEach((p) => {
            const div = document.createElement("div");
            div.className = "post-item";

            const span = document.createElement("span");
            span.textContent = p.titleAr;

            const btn = document.createElement("button");
            btn.textContent = "حذف";
            btn.style.cssText = "color:red; border:none; background:none; cursor:pointer;";
            btn.addEventListener("click", () => deletePost(p.id));

            div.appendChild(span);
            div.appendChild(btn);
            list.appendChild(div);
        });
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        const posts = JSON.parse(localStorage.getItem("toma_articles") || "[]");
        const img = document.getElementById("imgUrl").value.trim();

        posts.push({
            id: Date.now(),
            titleAr: document.getElementById("titleAr").value,
            titleEn: document.getElementById("titleEn").value,
            descAr: document.getElementById("descAr").value,
            descEn: document.getElementById("descEn").value,
            image: img !== "" ? img : null, // هنا يتم التحقق من وجود صورة
        });

        localStorage.setItem("toma_articles", JSON.stringify(posts));
        form.reset();
        render();
    };

    window.deletePost = (id) => {
        const posts = JSON.parse(localStorage.getItem("toma_articles") || "[]");
        localStorage.setItem(
            "toma_articles",
            JSON.stringify(posts.filter((p) => p.id !== id)),
        );
        render();
    };

    render();
});
