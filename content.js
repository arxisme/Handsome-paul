console.log("Handsome Paul: Content script loaded.");

function getTitle() {
    const docTitle = document.title || "Paul Graham";
    return docTitle;
}

function buildNav() {
    // Hardcoded HTML string for robustness
    const html = `
    <nav id="handsome-paul-nav">
      <div class="hp-nav-inner">
        <a href="index.html" class="hp-logo">Paul Graham</a>
        <div class="hp-links">
          <a href="articles.html">Essays</a>
          <a href="https://news.ycombinator.com">Hacker News</a>
          <a href="rss.html">RSS</a>
          <button id="hp-theme-toggle">Dark Mode</button>
        </div>
      </div>
    </nav>
    <div id="handsome-paul-progress"></div>
  `;
    const div = document.createElement('div');
    div.innerHTML = html;

    // Theme Toggle Logic
    setTimeout(() => {
        const toggleBtn = document.getElementById('hp-theme-toggle');
        const root = document.documentElement;

        // Load saved preference
        const savedTheme = localStorage.getItem('hp-theme');
        if (savedTheme === 'dark') {
            root.classList.add('dark-theme');
            if (toggleBtn) toggleBtn.textContent = "Light Mode";
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isDark = root.classList.toggle('dark-theme');
                localStorage.setItem('hp-theme', isDark ? 'dark' : 'light');
                toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
            });
        }
    }, 100); // Small delay to ensure insertion into DOM

    return div;
}

function identifyMainContent() {
    const candidates = document.querySelectorAll("td, div, table");
    let winner = null;
    let maxScore = -Infinity;

    candidates.forEach((node) => {
        const textLen = node.textContent.trim().length;
        if (textLen < 200) return;

        const linkCount = node.querySelectorAll("a").length;
        const tableCount = node.querySelectorAll("table").length;
        const childCount = node.children.length;

        // Score based on text density vs structural clutter
        let score = textLen;
        score -= (tableCount * 500);
        score -= (childCount * 10);

        // Bonus for PG specific layout legacy width
        if (node.getAttribute('width') === "435") score += 1000;

        if (score > maxScore) {
            maxScore = score;
            winner = node;
        }
    });

    return winner;
}

function buildArticlePage(winnerNode) {
    const article = document.createElement("article");
    article.id = "handsome-paul-article";

    let titleText = document.title;
    let dateText = "";

    const clone = winnerNode.cloneNode(true);

    // Extract Image Title
    const imgTitle = clone.querySelector('img[alt][height="18"]');
    if (imgTitle && imgTitle.alt) {
        titleText = imgTitle.alt;
        imgTitle.remove();
    } else {
        const bigFont = clone.querySelector('font[size="+2"], h1');
        if (bigFont) {
            titleText = bigFont.textContent.trim();
            bigFont.remove();
        }
    }

    // Extract Date
    const dateFont = clone.querySelector('font[size="-1"]');
    if (dateFont && dateFont.textContent.length < 30) {
        dateText = dateFont.textContent.trim();
        dateFont.remove();
    }

    const h1 = document.createElement("h1");
    h1.textContent = titleText;
    article.appendChild(h1);

    if (dateText) {
        const dateSpan = document.createElement("span");
        dateSpan.className = "hp-date";
        dateSpan.textContent = dateText;
        article.appendChild(dateSpan);
    }

    // Cleanup garbage
    clone.querySelectorAll("script, style, map").forEach(el => el.remove());

    while (clone.firstChild) {
        article.appendChild(clone.firstChild);
    }

    return article;
}

function buildListPage(winnerNode) {
    const article = document.createElement("article");
    article.id = "handsome-paul-article";

    const h1 = document.createElement("h1");
    h1.textContent = document.title.replace("Paul Graham: ", "") || "Essays";
    article.appendChild(h1);

    const ul = document.createElement("ul");
    ul.className = "hp-list";

    const links = winnerNode.querySelectorAll("a");
    links.forEach(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute("href");

        if (text.length < 3) return;
        if (href && (href.includes("index.html") || href.includes("bio.html"))) return;

        const li = document.createElement("li");
        const newA = document.createElement("a");
        newA.href = href;
        newA.textContent = text;
        li.appendChild(newA);
        ul.appendChild(li);
    });

    article.appendChild(ul);
    return article;
}

function cleanupDOM(winnerNode) {
    if (!winnerNode) {
        console.warn("Handsome Paul: No main content found.");
        return;
    }

    const navDiv = buildNav();
    const mainWrapper = document.createElement("main");
    mainWrapper.id = "handsome-paul-main";

    let article;
    // Calculate link density: ratio of text inside links vs total text
    const allText = winnerNode.textContent.replace(/\s/g, "").length;
    let linkText = 0;
    winnerNode.querySelectorAll('a').forEach(a => {
        linkText += a.textContent.replace(/\s/g, "").length;
    });

    const linkDensity = allText > 0 ? (linkText / allText) : 0;
    const isListHeuristic = linkDensity > 0.5; // If > 50% of text is links, it's likely a list

    if (window.location.href.includes("articles.html") || isListHeuristic) {
        article = buildListPage(winnerNode);
    } else {
        article = buildArticlePage(winnerNode);
    }

    mainWrapper.appendChild(article);

    document.body.innerHTML = "";
    // Append children of navDiv (nav and progress) manually or just append div?
    // append styling is for #handsome-paul-nav, so appending the transparent wrapper div is fine if it doesn't break layout.
    // Actually Styles.css expects #handsome-paul-nav to be fixed.
    // So we should append the children.
    Array.from(navDiv.children).forEach(child => document.body.appendChild(child));

    document.body.appendChild(mainWrapper);

    // Progress Logic
    const progress = document.getElementById('handsome-paul-progress');
    if (progress) {
        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progress.style.width = scrollPercent + "%";
        });
    }
}

function runHeuristic() {
    console.log("Handsome Paul: Running heuristic...");
    const winner = identifyMainContent();
    cleanupDOM(winner);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runHeuristic);
} else {
    runHeuristic();
}
