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

  if (!items || items.length === 0) {
    const placeholder = document.createElement("div");
    placeholder.className = "item";
    placeholder.textContent = "Thêm ảnh vào thư mục images/ để hiển thị";
    grid.appendChild(placeholder);
    return;
  }

  items.forEach(item => {
    const cfg = typeof item === "string" ? { src: item } : (item || {});
    const it = document.createElement("div");
    it.className = "item";
    if (cfg.ratio) {
      it.style.aspectRatio = cfg.ratio; // ví dụ: "4 / 3", "3 / 4"
    }

    const media = createImgOrPlaceholder(cfg.src, "Khoảnh khắc yêu thương");
    if (media.tagName === "IMG") {
      media.style.objectFit = cfg.fit || "cover"; // hoặc "contain" để không che
      media.style.objectPosition = cfg.position || "center top"; // đẩy khung lên trên cho rõ mặt
    }

    it.appendChild(media);
    grid.appendChild(it);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrandparents(FAMILY_DATA.grandparents || []);
  renderFamilies(FAMILY_DATA.families || []);
  renderGallery(FAMILY_DATA.gallery || []);
});