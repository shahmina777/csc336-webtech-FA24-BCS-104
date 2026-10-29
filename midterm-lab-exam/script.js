document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  const MAX_LIMIT = 2; // (4 mod 4) + 2 = 2 for Roll No 104

  const cartIconBtn = document.getElementById("cartIconBtn");
  const miniCartDropdown = document.getElementById("miniCartDropdown");
  const cartBadge = document.getElementById("cartBadge");
  const miniCartItems = document.getElementById("miniCartItems");
  const miniCartTotal = document.getElementById("miniCartTotal");


  cartIconBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    miniCartDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!miniCartDropdown.contains(e.target) && !cartIconBtn.contains(e.target)) {
      miniCartDropdown.classList.remove("show");
    }
  });


  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const titleEl = card.querySelector(".card-title");
    const priceEl = card.querySelector(".fw-bold.fs-6.mb-2.text-dark");
    const addBtn = card.querySelector(".add-to-cart-btn");

    if (!titleEl || !priceEl || !addBtn) return;

    const productName = titleEl.textContent.trim();
    const productPrice = parseFloat(priceEl.textContent.replace("$", "").trim());

    addBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const currentCount = cart.filter(item => item.name === productName).length;

      if (currentCount < MAX_LIMIT) {
        cart.push({ id: Date.now() + Math.random(), name: productName, price: productPrice });
        updateCartUI();

        const newCount = cart.filter(item => item.name === productName).length;
        if (newCount >= MAX_LIMIT) {
          addBtn.textContent = "Limit reached";
          addBtn.classList.add("disabled", "btn-secondary");
          addBtn.classList.remove("btn-dark");
        }
      }
    });
  });

  function updateCartUI() {
    // 1. Update Badge Counter
    cartBadge.textContent = cart.length;

    // 2. Render Mini Cart Items
    if (cart.length === 0) {
      miniCartItems.innerHTML = "Cart is empty";
      miniCartTotal.textContent = "$0.00";
      return;
    }

    miniCartItems.innerHTML = "";
    cart.forEach((item, index) => {
      const itemRow = document.createElement("div");
      itemRow.className = "d-flex justify-content-between align-items-center mb-2 border-bottom pb-1";
      itemRow.innerHTML = `
        <span class="text-dark">${item.name} ($${item.price.toFixed(2)})</span>
        <button class="btn btn-sm btn-outline-danger py-0 px-2 rounded-pill remove-item-btn" data-index="${index}">Remove</button>
      `;
      miniCartItems.appendChild(itemRow);
    });

  
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    miniCartTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll(".remove-item-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        const removedItemName = cart[index].name;
        
        cart.splice(index, 1);
        updateCartUI();


        productCards.forEach((card) => {
          const titleEl = card.querySelector(".card-title");
          const addBtn = card.querySelector(".add-to-cart-btn, .btn-secondary");
          if (titleEl && titleEl.textContent.trim() === removedItemName && addBtn) {
            const currentCount = cart.filter(item => item.name === removedItemName).length;
            if (currentCount < MAX_LIMIT) {
              addBtn.textContent = "Add to Cart";
              addBtn.classList.remove("disabled", "btn-secondary");
              addBtn.classList.add("btn-dark");
            }
          }
        });
      });
    });
  }
});