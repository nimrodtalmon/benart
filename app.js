// Ben's Art — loads art/gallery.json and renders the gallery + lightbox.
(async function () {
  const gallery = document.getElementById("gallery");
  const empty = document.getElementById("empty");
  const filters = document.getElementById("filters");
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  document.getElementById("year").textContent = new Date().getFullYear();

  let items = [];
  try {
    const res = await fetch("art/gallery.json", { cache: "no-cache" });
    items = await res.json();
  } catch (e) {
    console.error("Could not load art/gallery.json", e);
  }

  let visible = items;
  let current = 0;

  const caption = (it) => [it.title, it.year, it.medium].filter(Boolean).join(" · ");

  function render() {
    gallery.innerHTML = "";
    empty.hidden = visible.length > 0;
    visible.forEach((it, i) => {
      const fig = document.createElement("figure");
      fig.className = "piece";
      fig.tabIndex = 0;
      const img = document.createElement("img");
      img.src = "art/" + it.file;
      img.alt = it.title || "Artwork by Ben";
      img.loading = "lazy";
      const frame = document.createElement("div");
      frame.className = "frame";
      frame.appendChild(img);
      fig.appendChild(frame);
      if (it.title || it.year || it.medium) {
        const cap = document.createElement("figcaption");
        cap.innerHTML = `<span class="title"></span><span class="meta"></span>`;
        cap.querySelector(".title").textContent = it.title || "";
        cap.querySelector(".meta").textContent = [it.year, it.medium].filter(Boolean).join(" · ");
        fig.appendChild(cap);
      }
      fig.addEventListener("click", () => open(i));
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter") open(i); });
      gallery.appendChild(fig);
    });
  }

  function buildFilters() {
    const tags = [...new Set(items.flatMap((it) => it.tags || []))].sort();
    if (tags.length === 0) return;
    ["All", ...tags].forEach((tag) => {
      const b = document.createElement("button");
      b.textContent = tag;
      b.setAttribute("aria-pressed", tag === "All");
      b.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
        visible = tag === "All" ? items : items.filter((it) => (it.tags || []).includes(tag));
        render();
      });
      filters.appendChild(b);
    });
  }

  function show(i) {
    current = (i + visible.length) % visible.length;
    const it = visible[current];
    lbImg.src = "art/" + it.file;
    lbImg.alt = it.title || "Artwork by Ben";
    lbCap.textContent = caption(it);
  }
  function open(i) { show(i); lb.showModal(); }

  lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
  lb.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  buildFilters();
  render();
})();
