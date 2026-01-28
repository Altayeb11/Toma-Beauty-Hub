document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("postForm");
    const list = document.getElementById("postsList");

    const render = () => {
        const posts = JSON.parse(localStorage.getItem("toma_articles") || "[]");
        list.innerHTML = posts
            .map(
                (p) => `
            <div class="post-item">
                <span>${p.titleAr}</span>
                <button onclick="deletePost(${p.id})" style="color:red; border:none; background:none; cursor:pointer;">حذف</button>
            </div>
        `,
            )
            .join("");
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
