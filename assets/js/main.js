const defaultSiteSettings = {
  restaurantName: 'Taco and Grill',
  phone: '3802616218',
  phoneDisplay: '(380) 261-6218',
  address: '2864 N High Street, Columbus, Ohio 43202',
  hours: 'Everyday • 3:00 PM – 12:00 AM',
  orderNowUrl: 'https://www.clover.com/'
};

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setHref(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.setAttribute('href', value);
  });
}

function applySiteSettings(settings) {
  const merged = { ...defaultSiteSettings, ...settings };
  const telLink = `tel:+1${merged.phone}`;

  setText('[data-restaurant-address]', merged.address);
  setText('[data-restaurant-hours]', merged.hours);
  setText('[data-restaurant-phone]', merged.phoneDisplay);
  setHref('[data-restaurant-phone-link]', telLink);
  setHref('#orderNowLink', merged.orderNowUrl);
  setHref('#heroOrderLink', merged.orderNowUrl);
  setHref('#homeOrderLink', merged.orderNowUrl);
  setHref('#footerOrderLink', merged.orderNowUrl);
}

function initMenuToggle() {
  const toggleButton = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleButton || !navLinks) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');
  if (!revealElements.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach((element) => observer.observe(element));
}

async function loadSettings() {
  try {
    const response = await fetch('assets/data/site.json');
    if (!response.ok) {
      throw new Error('Unable to load site settings');
    }
    const settings = await response.json();
    applySiteSettings(settings);
  } catch {
    applySiteSettings(defaultSiteSettings);
  }
}

function initDealsPage() {
  const container = document.getElementById('dealsContainer');
  if (!container) {
    return;
  }

  fetch('assets/data/deals.json')
    .then((response) => response.json())
    .then((deals) => {
      container.innerHTML = deals.map((deal, index) => {
        const detailText = `${deal.description || ''} ${deal.validity || ''}`.toLowerCase();
        const isCallOnly = detailText.includes('call') || detailText.includes('call-in');

        return `
        <article class="card deal-card reveal-up delay-${Math.min(index, 2)} in">
          <div class="deal-card-top">
            <span class="deal-badge">${deal.badge}</span>
            ${isCallOnly ? '<span class="deal-callout">Call-In Only</span>' : ''}
          </div>
          <h3>${deal.title}</h3>
          <p>${deal.description}</p>
          <p class="deal-validity"><strong>${deal.validity}</strong></p>
          <a class="text-link" href="tel:+13802616218">Call to Claim Deal →</a>
        </article>
      `;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<article class="card"><p>Add your deals in assets/data/deals.json</p></article>';
    });
}

function initBlogsPage() {
  const featuredContainer = document.getElementById('blogsFeatured');
  const container = document.getElementById('blogsContainer');
  if (!container && !featuredContainer) {
    return;
  }

  fetch('assets/data/blogs.json')
    .then((response) => response.json())
    .then((posts) => {
      if (!Array.isArray(posts) || !posts.length) {
        throw new Error('No posts found');
      }

      const [featuredPost, ...otherPosts] = posts;

      if (featuredContainer && featuredPost) {
        featuredContainer.innerHTML = `
          <article class="blog-feature card reveal-up in">
            <div class="blog-feature-media">${featuredPost.coverEmoji || '🌮'}</div>
            <div>
              <p class="kicker">Featured Post • ${featuredPost.date}</p>
              <h2>${featuredPost.title}</h2>
              <p>${featuredPost.excerpt}</p>
              <div class="blog-meta">
                <span>${featuredPost.author || 'Taco and Grill Team'}</span>
                <span>•</span>
                <span>${featuredPost.readTime || '3 min read'}</span>
              </div>
              <a class="btn btn-primary" href="blog-detail.html?slug=${encodeURIComponent(featuredPost.slug || '')}">Read Full Story</a>
            </div>
          </article>
        `;
      }

      if (container) {
        const cards = (otherPosts.length ? otherPosts : posts).map((post, index) => `
          <article class="card blog-card reveal-up delay-${Math.min(index, 2)} in">
            <p class="kicker">${post.date}</p>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-meta">
              <span>${post.author || 'Taco and Grill Team'}</span>
              <span>•</span>
              <span>${post.readTime || '3 min read'}</span>
            </div>
            <a class="text-link" href="blog-detail.html?slug=${encodeURIComponent(post.slug || '')}">Read More →</a>
          </article>
        `).join('');

        container.innerHTML = cards;
      }
    })
    .catch(() => {
      if (featuredContainer) {
        featuredContainer.innerHTML = '';
      }
      if (container) {
        container.innerHTML = '<article class="card"><p>Add blog posts in assets/data/blogs.json</p></article>';
      }
    });
}

function initBlogDetailPage() {
  const detailContainer = document.getElementById('blogDetailContainer');
  if (!detailContainer) {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const slug = query.get('slug');

  fetch('assets/data/blogs.json')
    .then((response) => response.json())
    .then((posts) => {
      const post = Array.isArray(posts)
        ? posts.find((entry) => entry.slug === slug) || posts[0]
        : null;

      if (!post) {
        throw new Error('Post not found');
      }

      document.title = `${post.title} | Taco and Grill`;

      const paragraphs = Array.isArray(post.content)
        ? post.content.map((paragraph) => `<p>${paragraph}</p>`).join('')
        : `<p>${post.excerpt || ''}</p>`;

      detailContainer.innerHTML = `
        <article class="blog-detail card reveal-up in">
          <a class="text-link" href="blogs.html">← Back to Blogs</a>
          <p class="kicker">${post.date}</p>
          <h1>${post.title}</h1>
          <div class="blog-meta">
            <span>${post.author || 'Taco and Grill Team'}</span>
            <span>•</span>
            <span>${post.readTime || '3 min read'}</span>
          </div>
          <div class="blog-detail-cover">${post.coverEmoji || '🌮'}</div>
          <div class="blog-content">
            ${paragraphs}
          </div>
          <div class="blog-cta">
            <p>Craving something now? View our menu or place your order on Clover.</p>
            <a class="btn btn-secondary" href="menu.html">View Menu</a>
          </div>
        </article>
      `;
    })
    .catch(() => {
      detailContainer.innerHTML = `
        <article class="card blog-detail">
          <h2>Post not found</h2>
          <p>Please go back to the blogs page to choose another post.</p>
          <a class="btn btn-primary" href="blogs.html">Back to Blogs</a>
        </article>
      `;
    });
}

function initFooterYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

initMenuToggle();
initReveal();
initFooterYear();
loadSettings();
initDealsPage();
initBlogsPage();
initBlogDetailPage();