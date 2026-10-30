const products = [
  { id: 'wave-01', name: '浪尖 · 探索者 380', category: 'WAVEFRONT / FISHING KAYAK', price: 12800, tag: '旗舰款', desc: '宽体稳行 · 模块化甲板 · 单人路亚艇', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85', alt: '湖面上的户外艇' }
];
const cart = new Map();
const productGrid = document.querySelector('#products');
const drawer = document.querySelector('#cart-drawer');
const overlay = document.querySelector('#overlay');
const toast = document.querySelector('#toast');
let toastTimer;

const money = value => `¥${value.toLocaleString('zh-CN')}`;
productGrid.innerHTML = products.map(product => `
  <article class="product-card">
    <div class="product-image"><img src="${product.image}" alt="${product.alt}" loading="lazy"><span class="product-tag">${product.tag}</span></div>
    <div class="product-info"><div class="product-category">${product.category}</div><h4 class="product-name">${product.name}</h4><p class="product-desc">${product.desc}</p><div class="product-bottom"><span class="price"><small>¥</small>${product.price.toLocaleString('zh-CN')}</span><button class="add-button" data-add="${product.id}" aria-label="将${product.name}加入购物车">+</button></div></div>
  </article>`).join('');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}
function openCart() {
  drawer.classList.add('open'); overlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}
function closeCart() {
  drawer.classList.remove('open'); overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
}
function changeQuantity(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id); else cart.set(id, next);
  renderCart();
}
function renderCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [id, quantity]) => sum + products.find(p => p.id === id).price * quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#drawer-count').textContent = `(${count})`;
  document.querySelector('#subtotal').textContent = money(total);
  const empty = count === 0;
  document.querySelector('#empty-cart').style.display = empty ? 'flex' : 'none';
  document.querySelector('#cart-footer').style.display = empty ? 'none' : 'block';
  document.querySelector('#cart-items').innerHTML = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return `<article class="cart-row"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><p>${product.tag} · ${money(product.price)}</p><div class="qty-control"><button data-quantity="${id}" data-delta="-1" aria-label="减少数量">−</button><span>${quantity}</span><button data-quantity="${id}" data-delta="1" aria-label="增加数量">+</button></div></div><div><div class="row-price">${money(product.price * quantity)}</div><button class="remove-item" data-remove="${id}">移除</button></div></article>`;
  }).join('');
}
productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  changeQuantity(button.dataset.add, 1);
  showToast('已加入购物车');
});
document.querySelector('#cart-items').addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (quantityButton) changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.delta));
  if (removeButton) { cart.delete(removeButton.dataset.remove); renderCart(); }
});
document.querySelector('#open-cart').addEventListener('click', openCart);
document.querySelector('#close-cart').addEventListener('click', closeCart);
document.querySelector('#continue-shopping').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.querySelector('#checkout').addEventListener('click', () => {
  if (!cart.size) return;
  cart.clear(); renderCart(); closeCart(); showToast('模拟结算完成，感谢体验！');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
renderCart();
