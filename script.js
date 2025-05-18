const products = [
  {
    id: 'jersey',
    name: "Team Asha Jersey '23 or '24",
    image: './images/jersey.jpg',
    sizes: ['SM', 'MD', 'LG', 'XL', 'XXL'],
    soldOutSizes: ['SM'],
    unitCost: 40
  },
  {
    id: 'jacket',
    name: "Team Asha Jacket '24",
    image: './images/jacket.jpg',
    sizes: ['SM', 'MD', 'LG', 'XL', 'XXL'],
    soldOutSizes: ['XXL'],
    unitCost: 45
  },
  {
    id: 'bottle',
    name: "Team Asha Waterbottle '24",
    image: './images/bottle.jpg',
    sizes: ['One Size'],
    soldOutSizes: [],
    unitCost: 10
  }
];

const cart = [];

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="portrait-img">
      <h3>${product.name}</h3>
      <div style="margin-bottom: 0.5rem; font-weight: 500; color: #003366;">Unit Cost: $${product.unitCost}</div>
      <div class="product-controls-row">
        ${product.id !== 'bottle' ? `
        <label for="size-${product.id}" class="inline-label">Size:</label>
        <select id="size-${product.id}">
          ${product.sizes.map(size => `
            <option value="${size}" ${product.soldOutSizes.includes(size) ? 'disabled' : ''}>
              ${size}${product.soldOutSizes.includes(size) ? ' (Sold Out)' : ''}
            </option>`).join('')}
        </select>
        <label for="gender-${product.id}" class="inline-label">Gender:</label>
        <select id="gender-${product.id}">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        ` : `
        <div class='flex-placeholder'></div>
        <div class='flex-placeholder'></div>
        `}
        <label for="qty-${product.id}" class="inline-label">Qty:</label>
        <input type="number" id="qty-${product.id}" min="1" value="1">
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  let size = '';
  let gender = '';
  if (product.id !== 'bottle') {
    size = document.getElementById(`size-${product.id}`).value;
    gender = document.getElementById(`gender-${product.id}`).value;
  }
  const qty = parseInt(document.getElementById(`qty-${product.id}`).value, 10) || 1;
  cart.push({ name: product.name, size, gender, qty, unitCost: product.unitCost });
  renderCart();
  document.getElementById('cart-count').innerText = cart.length;
}

function renderCart() {
  const cartList = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartList.innerHTML = '<div style="padding:1em; color:#888;">Your cart is empty.</div>';
    return;
  }
  let total = 0;
  let table = `<table style="width:100%; border-collapse:collapse; margin-bottom:1em;">
    <thead>
      <tr style="background:#f0f6ff;">
        <th style="padding:8px; border-bottom:1px solid #cce; text-align:left;">Item</th>
        <th style="padding:8px; border-bottom:1px solid #cce; text-align:right;">Qty</th>
        <th style="padding:8px; border-bottom:1px solid #cce; text-align:right;">Unit Cost</th>
        <th style="padding:8px; border-bottom:1px solid #cce; text-align:right;">Item Cost</th>
      </tr>
    </thead>
    <tbody>`;
  cart.forEach(item => {
    const itemCost = item.unitCost * item.qty;
    total += itemCost;
    table += `<tr>
      <td style="padding:8px; border-bottom:1px solid #eef;">${item.name}${item.size ? ' - ' + item.size : ''}${item.gender ? ' - ' + item.gender : ''}</td>
      <td style="padding:8px; border-bottom:1px solid #eef; text-align:right;">${item.qty}</td>
      <td style="padding:8px; border-bottom:1px solid #eef; text-align:right;">$${item.unitCost}</td>
      <td style="padding:8px; border-bottom:1px solid #eef; text-align:right;">$${itemCost}</td>
    </tr>`;
  });
  table += `</tbody><tfoot>
    <tr style="font-weight:bold; background:#f7fbff;">
      <td colspan="3" style="padding:8px; text-align:right; border-top:2px solid #003366;">Total</td>
      <td style="padding:8px; text-align:right; border-top:2px solid #003366;">$${total}</td>
    </tr>
  </tfoot></table>`;
  cartList.innerHTML = table;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  const buyerName = document.getElementById('buyer-name').value.trim();
  const buyerEmail = document.getElementById('buyer-email').value.trim();
  if (!buyerName || !buyerEmail) {
    alert('Please enter your name and email before checking out.');
    return;
  }
  const body = [
    `Name: ${buyerName}`,
    `Email: ${buyerEmail}`,
    '',
    'Order:',
    ...cart.map(item => `- ${item.name}${item.size ? ' (Size: ' + item.size + ')' : ''}${item.gender ? ' (Gender: ' + item.gender + ')' : ''} (Qty: ${item.qty}) (Unit Cost: $${item.unitCost}) (Total: $${item.unitCost * item.qty})`)
  ].join('%0D%0A');
  const mailto = `mailto:vijayanands@gmail.com?subject=Team Asha Order&cc=${encodeURIComponent(buyerEmail)}&body=${body}`;
  window.location.href = mailto;
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.classList.toggle('hidden');
}

renderProducts();