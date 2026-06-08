const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

const WHATSAPP_NUMBER = "5511999999999";

const cart = [];

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const orderForm = document.getElementById("orderForm");

function formatPrice(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Nenhum item adicionado ainda.</p>`;
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cart.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");

    itemElement.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.quantity}x ${item.name}</strong>
        <span>${formatPrice(item.price)} cada</span>
      </div>

      <div class="cart-controls">
        <button class="qty-btn" onclick="decreaseItem(${index})">-</button>
        <button class="qty-btn" onclick="increaseItem(${index})">+</button>
        <button class="remove-btn" onclick="removeItem(${index})">Remover</button>
      </div>
    `;

    cartItems.appendChild(itemElement);
  });

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  cartTotal.textContent = formatPrice(total);
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  renderCart();

  document.getElementById("pedido").scrollIntoView({
    behavior: "smooth"
  });
}

function increaseItem(index) {
  cart[index].quantity += 1;
  renderCart();
}

function decreaseItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    addToCart(name, price);
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Adicione pelo menos um item ao pedido.");
    return;
  }

  const clientName = document.getElementById("clientName").value.trim();
  const clientAddress = document.getElementById("clientAddress").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const orderNotes = document.getElementById("orderNotes").value.trim();

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const itemsText = cart.map((item) => {
    const subtotal = item.price * item.quantity;
    return `• ${item.quantity}x ${item.name} - ${formatPrice(subtotal)}`;
  }).join("\n");

  const message = `
🍕 NOVO PEDIDO

👤 Cliente:
${clientName}

📍 Endereço:
${clientAddress}

🍕 Itens:
${itemsText}

📝 Observações:
${orderNotes || "Nenhuma observação."}

💳 Pagamento:
${paymentMethod}

💰 Total:
${formatPrice(total)}
`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
});

renderCart();