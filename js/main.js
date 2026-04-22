// js/main.js

// ----- CART MANAGEMENT (sessionStorage for frontend demo) -----
function getCart() {
  const cart = sessionStorage.getItem('jevikraft_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  sessionStorage.setItem('jevikraft_cart', JSON.stringify(cart));
  updateCartCountDisplay();
}

function addToCart(productId, name, price, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, name, price, quantity });
  }
  saveCart(cart);
  alert(`Added ${quantity} x ${name} to cart!`);
}

function updateCartCountDisplay() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBtns = document.querySelectorAll('.cart-btn');
  cartBtns.forEach(btn => {
    btn.innerHTML = `🛒 Cart (${totalItems})`;
  });
}

// ----- Hero Slider (only on pages where .hero exists) -----
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;
  let current = 0;
  function goSlide(n) {
    slides[current].classList.remove('active');
    if (dots.length) dots[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    if (dots.length) dots[current].classList.add('active');
  }
  window.goSlide = goSlide;
  setInterval(() => goSlide((current + 1) % slides.length), 5000);
}

// ----- Shop Filtering (if on shop page) -----
function initShopFilters() {
  const bedroomFilter = document.getElementById('bedroom-filter');
  const budgetFilter = document.getElementById('budget-filter');
  const clearBtn = document.getElementById('clear-filters');
  const planCards = document.querySelectorAll('.plan-card');
  if (!bedroomFilter || !budgetFilter) return;

  function filterPlans() {
    const selectedBedroom = bedroomFilter.value;
    const selectedBudget = budgetFilter.value;
    planCards.forEach(card => {
      const bedrooms = card.getAttribute('data-bedrooms');
      const price = parseFloat(card.getAttribute('data-price'));
      let budgetMatch = true;
      if (selectedBudget !== 'all') {
        switch (selectedBudget) {
          case 'under100': budgetMatch = price < 100; break;
          case '100-300': budgetMatch = price >= 100 && price <= 300; break;
          case '300-500': budgetMatch = price > 300 && price <= 500; break;
          case '500-700': budgetMatch = price > 500 && price <= 700; break;
          case '700plus': budgetMatch = price > 700; break;
          default: budgetMatch = true;
        }
      }
      const bedroomMatch = selectedBedroom === 'all' || bedrooms === selectedBedroom;
      if (bedroomMatch && budgetMatch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  bedroomFilter.addEventListener('change', filterPlans);
  budgetFilter.addEventListener('change', filterPlans);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      bedroomFilter.value = 'all';
      budgetFilter.value = 'all';
      filterPlans();
    });
  }
}

// ----- Product detail add to cart -----
function initProductDetail() {
  const addBtn = document.getElementById('add-to-cart-detail');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const productId = addBtn.getAttribute('data-id');
      const productName = addBtn.getAttribute('data-name');
      const productPrice = parseFloat(addBtn.getAttribute('data-price'));
      const qtyInput = document.getElementById('product-quantity');
      const qty = qtyInput ? parseInt(qtyInput.value) : 1;
      addToCart(productId, productName, productPrice, qty);
    });
  }
}

// ----- Cost Calculator Logic -----
function initCostCalculator() {
  const areaInput = document.getElementById('area-sqm');
  const costPerSqmInput = document.getElementById('cost-per-sqm');
  const resultSpan = document.getElementById('estimated-cost');
  const updateBtn = document.getElementById('calculate-btn');
  if (!areaInput || !costPerSqmInput) return;
  function updateCost() {
    const area = parseFloat(areaInput.value) || 0;
    const costPer = parseFloat(costPerSqmInput.value) || 0;
    const total = area * costPer;
    if (resultSpan) resultSpan.textContent = total.toLocaleString() + ' USD';
  }
  if (updateBtn) updateBtn.addEventListener('click', updateCost);
  updateCost();
}

// ----- Custom Plan Form Submission (demo) -----
function initCustomPlanForm() {
  const form = document.getElementById('custom-plan-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your custom plan request has been received. We’ll contact you within 24 hours.');
      form.reset();
    });
  }
}

// ----- Cookie banner -----
function initCookieBanner() {
  const banner = document.getElementById('cookie');
  if (banner && !localStorage.getItem('cookieAccepted')) {
    banner.style.display = 'flex';
    const acceptBtn = banner.querySelector('.btn-accept');
    const declineBtn = banner.querySelector('.btn-decline');
    if (acceptBtn) acceptBtn.onclick = () => {
      localStorage.setItem('cookieAccepted', 'true');
      banner.style.display = 'none';
    };
    if (declineBtn) declineBtn.onclick = () => {
      banner.style.display = 'none';
    };
  } else if (banner) {
    banner.style.display = 'none';
  }
}

// ----- Initialize on page load -----
document.addEventListener('DOMContentLoaded', () => {
  updateCartCountDisplay();
  initHeroSlider();
  initShopFilters();
  initProductDetail();
  initCostCalculator();
  initCustomPlanForm();
  initCookieBanner();
});