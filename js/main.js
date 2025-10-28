/* global AOS, gsap, ScrollTrigger, emailjs, grecaptcha */
const SiteApp = (() => {
  const state = {
    products: null,
    calculatorRows: 1
  };

  const select = (selector, scope = document) => scope.querySelector(selector);
  const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const initNavigation = () => {
    const toggle = select('.nav-toggle');
    const links = select('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });

    selectAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  };

  const initFooterYear = () => {
    const yearEl = select('#year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  const highlightActiveMenu = () => {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    selectAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === current || (current === 'index.html' && href === './')) {
        link.classList.add('active');
      }
    });
  };

  const initScrollTop = () => {
    const btn = select('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const initSmoothAnchors = () => {
    selectAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId.length > 1) {
          const target = select(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  };

  const initHeroAnimation = () => {
    const heroHeadline = select('.hero-text h1');
    if (!heroHeadline || typeof gsap === 'undefined') return;

    const words = heroHeadline.innerHTML.split('<br>').join(' ').split(' ');
    heroHeadline.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');

    gsap.set('.hero-text .word', { opacity: 0, y: 30 });
    gsap.to('.hero-text .word', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out'
    });
  };

  const loadProducts = async () => {
    if (state.products) return state.products;
    try {
      const res = await fetch('data/products.json');
      if (!res.ok) throw new Error('Gagal memuat data produk');
      const data = await res.json();
      state.products = data;
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const formatNumber = number => new Intl.NumberFormat('id-ID').format(number);

  const renderFeaturedProducts = async () => {
    const container = select('#featuredProducts');
    if (!container) return;

    const data = await loadProducts();
    if (!data) {
      container.innerHTML = '<p>Tidak dapat memuat produk saat ini.</p>';
      return;
    }

    const items = [];
    data.categories.forEach(category => {
      category.products.filter(item => item.featured).forEach(product => {
        items.push({ ...product, category: category.name });
      });
    });

    container.innerHTML = items
      .map(product => `
        <article class="card product-card" data-aos="fade-up">
          <div class="product-image">
            <span class="badge">Garansi Resmi Bluetti</span>
            <img src="${product.image}" alt="${product.name}" loading="lazy" width="320" height="240">
          </div>
          <div>
            <h3>${product.name}</h3>
            <p class="badge-pill">${product.category}</p>
            <ul>
              <li><strong>Kapasitas:</strong> ${formatNumber(product.capacityWh)} Wh</li>
              <li><strong>Output:</strong> ${formatNumber(product.outputW)} W | Surge ${formatNumber(product.surgeW)} W</li>
              <li><strong>Port:</strong> ${product.ports}</li>
              <li><strong>Isi Ulang:</strong> ${product.recharge}</li>
              <li><strong>Waktu Isi:</strong> ${product.rechargeTime}</li>
              <li><strong>Berat & Dimensi:</strong> ${product.weight} • ${product.dimension}</li>
            </ul>
            <p>${product.highlights.slice(0, 2).join(' • ')}</p>
            <div class="product-actions">
              <a class="btn" href="${product.ctaBuy}" target="_blank" rel="noopener">Beli Sekarang</a>
              <a class="btn btn-outline" href="${product.ctaConsult}" target="_blank" rel="noopener">Konsultasi Daya</a>
            </div>
          </div>
        </article>
      `)
      .join('');
  };

  const renderProductsPage = async () => {
    const tabsContainer = select('#productTabs');
    const listContainer = select('#productsList');
    if (!tabsContainer || !listContainer) return;

    const data = await loadProducts();
    if (!data) {
      listContainer.innerHTML = '<p>Tidak dapat memuat produk.</p>';
      return;
    }

    tabsContainer.innerHTML = data.categories
      .map((category, index) => `
        <button class="tab${index === 0 ? ' active' : ''}" data-category="${category.id}">${category.name}</button>
      `)
      .join('');

    const renderList = categoryId => {
      const category = data.categories.find(cat => cat.id === categoryId) || data.categories[0];
      listContainer.innerHTML = `
        <div class="section-title" data-aos="fade-up">
          <h2>${category.name}</h2>
          <p>${category.description}</p>
        </div>
        <div class="products-grid">
          ${category.products
            .map(product => `
              <article class="card product-card" data-aos="fade-up" data-aos-delay="100">
                <div class="product-image">
                  <span class="badge">Garansi Resmi Bluetti</span>
                  <img src="${product.image}" alt="${product.name}" loading="lazy" width="320" height="240">
                </div>
                <div>
                  <h3>${product.name}</h3>
                  <ul>
                    <li><strong>Kapasitas:</strong> ${formatNumber(product.capacityWh)} Wh</li>
                    <li><strong>Output:</strong> ${formatNumber(product.outputW)} W</li>
                    <li><strong>Surge:</strong> ${formatNumber(product.surgeW)} W</li>
                    <li><strong>Port:</strong> ${product.ports}</li>
                    <li><strong>Pengisian:</strong> ${product.recharge}</li>
                    <li><strong>Waktu Isi:</strong> ${product.rechargeTime}</li>
                    <li><strong>Berat:</strong> ${product.weight}</li>
                    <li><strong>Dimensi:</strong> ${product.dimension}</li>
                  </ul>
                  <p><strong>Keunggulan:</strong> ${product.highlights.join(' • ')}</p>
                  <p><strong>Skenario:</strong> ${product.scenarios}</p>
                  <div class="product-actions">
                    <a class="btn" href="${product.ctaBuy}" target="_blank" rel="noopener">Beli Sekarang</a>
                    <a class="btn btn-outline" href="${product.ctaConsult}" target="_blank" rel="noopener">Konsultasi Daya</a>
                  </div>
                </div>
              </article>
            `)
            .join('')}
        </div>
      `;
    };

    renderList(data.categories[0].id);

    selectAll('.tab', tabsContainer).forEach(tab => {
      tab.addEventListener('click', () => {
        selectAll('.tab', tabsContainer).forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        renderList(tab.dataset.category);
      });
    });

    const bundlesContainer = select('#bundleList');
    if (bundlesContainer) {
      bundlesContainer.innerHTML = data.bundles
        .map(bundle => `
          <article class="card" data-aos="fade-up">
            <h3>${bundle.name}</h3>
            <p>${bundle.description}</p>
            <p><strong>Termasuk:</strong> ${bundle.includes.join(', ')}</p>
            <p><strong>Benefit:</strong> ${bundle.benefit}</p>
            <div class="product-actions">
              <a class="btn" href="${bundle.cta}" target="_blank" rel="noopener">Pesan Paket</a>
              <a class="btn btn-outline" href="https://wa.me/6281234567890?text=Halo%20Jevindo%2C%20saya%20ingin%20konsultasi%20bundle" target="_blank" rel="noopener">Konsultasi</a>
            </div>
          </article>
        `)
        .join('');
    }

    const comparisonTable = select('#comparisonTable tbody');
    if (comparisonTable) {
      comparisonTable.innerHTML = data.comparison
        .map(row => `
          <tr>
            <td>${row.model}</td>
            <td>${row.capacity}</td>
            <td>${row.output}</td>
            <td>${row.solar}</td>
            <td>${row.weight}</td>
          </tr>
        `)
        .join('');
    }
  };

  const initCalculator = async () => {
    const calculator = select('#powerCalculator');
    if (!calculator) return;

    const rowsContainer = select('#deviceRows');
    const addRowBtn = select('#addDeviceRow');
    const resultContainer = select('#calculatorResult');

    const createRow = () => {
      const rowId = `device-row-${state.calculatorRows++}`;
      const row = document.createElement('div');
      row.className = 'calculator-row';
      row.innerHTML = `
        <label for="${rowId}-name">Perangkat</label>
        <input id="${rowId}-name" type="text" name="devices[${rowId}][name]" placeholder="Misal: Kulkas" required>
        <label for="${rowId}-watt">Daya (Watt)</label>
        <input id="${rowId}-watt" type="number" min="1" name="devices[${rowId}][watt]" placeholder="100" required>
        <label for="${rowId}-qty">Jumlah</label>
        <input id="${rowId}-qty" type="number" min="1" name="devices[${rowId}][qty]" value="1" required>
        <label for="${rowId}-hours">Jam Pakai per Hari</label>
        <input id="${rowId}-hours" type="number" min="0.1" step="0.1" name="devices[${rowId}][hours]" placeholder="3" required>
      `;
      rowsContainer.appendChild(row);
    };

    createRow();

    addRowBtn?.addEventListener('click', e => {
      e.preventDefault();
      createRow();
    });

    calculator.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(calculator);
      const devices = [];
      formData.forEach((value, key) => {
        const match = key.match(/devices\[(.*)\]\[(.*)\]/);
        if (match) {
          const [, rowKey, field] = match;
          let device = devices.find(item => item.key === rowKey);
          if (!device) {
            device = { key: rowKey };
            devices.push(device);
          }
          device[field] = value;
        }
      });

      const requiredWh = devices.reduce((total, device) => {
        const watt = parseFloat(device.watt) || 0;
        const qty = parseFloat(device.qty) || 0;
        const hours = parseFloat(device.hours) || 0;
        return total + watt * qty * hours;
      }, 0);

      const bufferWh = requiredWh * 1.25;
      let recommended = 'Hubungi tim Jevindo untuk rekomendasi personal.';

      const data = await loadProducts();
      if (data) {
        const sorted = data.categories
          .find(cat => cat.id === 'power-station')
          ?.products.sort((a, b) => a.capacityWh - b.capacityWh);
        if (sorted) {
          const match = sorted.find(product => product.capacityWh >= bufferWh);
          if (match) {
            recommended = `${match.name} (${formatNumber(match.capacityWh)} Wh)`;
          }
        }
      }

      resultContainer.innerHTML = `
        <strong>Estimasi Kebutuhan:</strong>
        <p>Total konsumsi harian: <strong>${formatNumber(Math.round(requiredWh))} Wh</strong></p>
        <p>Dengan buffer 25%: <strong>${formatNumber(Math.round(bufferWh))} Wh</strong></p>
        <p>Rekomendasi Bluetti: <strong>${recommended}</strong></p>
        <p>Kontak tim Jevindo untuk konfigurasi panel surya dan instalasi.</p>
      `;
    });
  };

  const initAccordion = () => {
    selectAll('.accordion').forEach(item => {
      const header = select('.accordion-header', item);
      if (!header) return;
      header.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    });
  };

  const initUseCaseFilters = () => {
    const filterButtons = selectAll('[data-filter]');
    const items = selectAll('.use-case-item');
    if (!filterButtons.length || !items.length) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        items.forEach(item => {
          const match = category === 'all' || item.dataset.category === category;
          item.style.display = match ? 'block' : 'none';
        });
      });
    });
  };

  const initLightbox = () => {
    const lightbox = select('.lightbox');
    if (!lightbox) return;
    const lightboxImg = select('img', lightbox);
    const closeBtn = select('.lightbox-close', lightbox);

    const open = src => {
      lightboxImg.src = src;
      lightbox.classList.add('open');
    };

    selectAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => open(item.dataset.lightbox));
    });

    closeBtn?.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });
  };

  const initContactForm = () => {
    const form = select('#contactForm');
    if (!form) return;

    const submitButton = select('button[type="submit"]', form);
    const status = select('#formStatus');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);

      const sendEmail = token => {
        if (typeof emailjs === 'undefined') {
          status.textContent = 'EmailJS belum dikonfigurasi. Mohon isi Service ID & Template ID.';
          status.className = 'form-error';
          return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Mengirim...';

        emailjs
          .sendForm(form.dataset.service, form.dataset.template, form)
          .then(() => {
            status.textContent = 'Terima kasih! Kami akan menghubungi Anda dalam 1x24 jam.';
            status.className = 'form-success';
            form.reset();
          })
          .catch(() => {
            status.textContent = 'Maaf, terjadi kendala. Silakan coba lagi atau hubungi via WhatsApp.';
            status.className = 'form-error';
          })
          .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim Pesan';
          });
      };

      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(form.dataset.recaptcha, { action: 'submit' })
            .then(sendEmail)
            .catch(() => {
              status.textContent = 'Validasi reCAPTCHA gagal. Mohon ulangi.';
              status.className = 'form-error';
            });
        });
      } else {
        sendEmail();
      }
    });
  };

  const initAOS = () => {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 800,
      once: true,
      offset: 120
    });
  };

  const initParallax = () => {
    const parallaxElements = selectAll('[data-parallax]');
    if (!parallaxElements.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray(parallaxElements).forEach(el => {
      gsap.to(el, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          scrub: true
        }
      });
    });
  };

  const init = () => {
    initNavigation();
    initFooterYear();
    highlightActiveMenu();
    initScrollTop();
    initSmoothAnchors();
    initHeroAnimation();
    renderFeaturedProducts();
    renderProductsPage();
    initCalculator();
    initAccordion();
    initUseCaseFilters();
    initLightbox();
    initContactForm();
    initAOS();
    initParallax();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  SiteApp.init();
});
