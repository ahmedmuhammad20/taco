async function loadMenu() {
  const container = document.getElementById('menuContainer');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('assets/data/menu.json');
    if (!response.ok) {
      throw new Error('Failed to load menu');
    }

    const data = await response.json();

    const items = Array.isArray(data.items) ? data.items : [];
    const grouped = items.reduce((accumulator, item) => {
      const category = item.category || 'Menu';
      if (!accumulator[category]) {
        accumulator[category] = [];
      }
      accumulator[category].push(item);
      return accumulator;
    }, {});

    const categories = Object.entries(grouped);

    container.innerHTML = categories.map(([name, categoryItems], categoryIndex) => `
      <article class="menu-category reveal-up delay-${Math.min(categoryIndex, 2)} in">
        <h2>${name}</h2>
        ${categoryItems.map((item) => {
          const numericPrice = Number(item.price);
          const displayPrice = Number.isFinite(numericPrice) ? `$${numericPrice.toFixed(2)}` : String(item.price);

          return `
            <div class="menu-item">
              <div class="menu-item-main">
                <span class="menu-emoji" aria-hidden="true">${item.emoji || '🍽️'}</span>
                <div>
                  <strong>${item.name}</strong>
                  ${item.description ? `<p>${item.description}</p>` : ''}
                </div>
              </div>
              <span class="menu-price">${displayPrice}</span>
            </div>
          `;
        }).join('')}
      </article>
    `).join('');
  } catch {
    container.innerHTML = '<article class="menu-category"><h2>Menu not available</h2><p>Please update assets/data/menu.json.</p></article>';
  }
}

loadMenu();