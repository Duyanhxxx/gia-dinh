// Thêm trạng thái lightbox và nguồn gallery ở cấp file
let GALLERY_SOURCES = [];
let currentIndex = 0;

function createImgOrPlaceholder(src, alt, className = "") {
  const hasSrc = src && typeof src === "string";
  if (hasSrc) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.className = className;
    return img;
  }
  const div = document.createElement("div");
  div.className = className + " cover";
  div.textContent = "Chưa có ảnh";
  return div;
}

function renderGrandparents(list) {
  const grid = document.getElementById("grandparentsGrid");
  grid.innerHTML = "";
  list.forEach(person => {
    const card = document.createElement("div");
    card.className = "card";

    const media = createImgOrPlaceholder(person.photo, person.name);
    media.classList.add("cover");
    card.appendChild(media);

    const body = document.createElement("div");
    body.className = "body";

    const title = document.createElement("p");
    title.className = "title";
    title.textContent = person.name;

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = person.role || "";

    body.appendChild(title);
    body.appendChild(meta);
    card.appendChild(body);

    grid.appendChild(card);
  });
}

function renderFamilies(families) {
  const list = document.getElementById("familiesList");
  list.innerHTML = "";

  families.forEach(family => {
    const wrap = document.createElement("div");
    wrap.className = "family";

    const header = document.createElement("div");
    header.className = "family-header";

    const cover = document.createElement("div");
    cover.className = "family-cover";
    const coverMedia = createImgOrPlaceholder(family.cover, family.name);
    cover.appendChild(coverMedia);

    const title = document.createElement("h3");
    title.className = "family-title";
    title.textContent = family.name;

    header.appendChild(cover);
    header.appendChild(title);

    wrap.appendChild(header);
    list.appendChild(wrap);
  });
}

function renderGallery(items) {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";
  GALLERY_SOURCES = [];

  if (!items || items.length === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "item";
    placeholder.textContent = "Thêm ảnh vào thư mục images/ để hiển thị";
    grid.appendChild(placeholder);
    return;
  }

  items.forEach((item, idx) => {
    const cfg = typeof item === "string" ? { src: item } : (item || {});
    GALLERY_SOURCES[idx] = cfg.src;

    const it = document.createElement("div");
    it.className = "item";
    if (cfg.ratio) {
      it.style.aspectRatio = cfg.ratio; // ví dụ: "4 / 3", "3 / 4"
    }

    const media = createImgOrPlaceholder(cfg.src, "Khoảnh khắc yêu thương");
    if (media.tagName === "IMG") {
      media.style.objectFit = cfg.fit || "cover";
      media.style.objectPosition = cfg.position || "center top";
    }

    it.appendChild(media);

    // Mở lightbox khi click
    it.addEventListener("click", () => openLightbox(idx));

    grid.appendChild(it);
  });
}

// Lightbox helpers
function openLightbox(index) {
  currentIndex = index;
  const overlay = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  img.src = GALLERY_SOURCES[currentIndex];
  overlay.classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

function nextImage() {
  currentIndex = (currentIndex + 1) % GALLERY_SOURCES.length;
  document.getElementById("lightboxImg").src = GALLERY_SOURCES[currentIndex];
}

function prevImage() {
  currentIndex = (currentIndex - 1 + GALLERY_SOURCES.length) % GALLERY_SOURCES.length;
  document.getElementById("lightboxImg").src = GALLERY_SOURCES[currentIndex];
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrandparents(FAMILY_DATA.grandparents || []);
  renderFamilies(FAMILY_DATA.families || []);
  renderGallery(FAMILY_DATA.gallery || []);

  // Gắn event cho lightbox
  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("nextBtn")?.addEventListener("click", nextImage);
  document.getElementById("prevBtn")?.addEventListener("click", prevImage);

  // Chia sẻ
  document.getElementById("btnShare")?.addEventListener("click", async () => {
    const shareData = {
      title: FAMILY_DATA.eventTitle || document.title,
      text: "Chúc mừng 20/10 ❤️ Cả nhà yêu thương nhau mỗi ngày!",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Đã sao chép liên kết. Hãy dán để chia sẻ!");
      }
    } catch (e) {
      console.error(e);
    }
  });

  // Confetti chúc mừng
  document.getElementById("btnCelebrate")?.addEventListener("click", () => {
    if (window.confetti) {
      const end = Date.now() + 1200;
      const colors = ["#e91e63", "#ff9ec7", "#ffd1e6", "#d81b60"];
      (function frame() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  });
});