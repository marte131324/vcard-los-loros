let menuData = [];
let isEmergencyClosed = false;
const BIN_ID = "69c4caffb7ec241ddca4897f";
const API_KEY = "$2a$10$q9Z//Fah.V6UxECh9kojoORPHn.xNOOWqZR1wiL05zK.7SB2jWp.W";

let bankDetails = {
    bankName: "BBVA",
    holderName: "La Casa de los Loros",
    clabe: "012345678901234567"
};

// Parches para productos específicos que requieren selección (Variantes)
const PRODUCT_VARIANTS = {
    "Ensalada de la Casa": {
        title: "Selecciona tu preferencia",
        options: ["Pollo Natural", "Pollo revuelto c/ Aderezo Mango Hab.", "Pollo revuelto c/ Aderezo BBQ", "Pollo revuelto c/ Aderezo Ajo Hab.", "Atún"],
        required: true
    },
    "Filete de Pollo": {
        title: "Selecciona tu Guarnición (Elige 2)",
        options: ["Verduras", "Pasta", "Ensalada"],
        max: 2,
        required: true
    },
    "Milanesa de Pollo": {
        title: "Selecciona tu Guarnición (Elige 2)",
        options: ["Verduras", "Papas", "Ensalada"],
        max: 2,
        required: true
    },
    "Huevos al Gusto": {
        title: "¿Cómo los prefieres?",
        options: ["Jamón", "Tocino", "A la Mexicana", "Estrellados", "Divorciados", "Chorizo", "Longaniza", "Salchicha"],
        required: true
    },
    "Omelette": {
        title: "Ingrediente Principal",
        options: ["Jamón", "Champiñón"],
        required: true   
    },
    "Chilaquiles Preparados": [
        {
            title: "Elige tu proteína",
            options: ["Pollo", "Huevo", "Bistec", "Longaniza"],
            required: true
        },
        {
            title: "Elige tu salsa",
            options: ["Salsa Verde", "Salsa Roja"],
            required: true
        }
    ],
    "Entomatadas, Enchiladas Preparadas": {
        title: "Elige el ingrediente principal",
        options: ["Pollo", "Picadillo", "Huevo"],
        required: true
    },
    "Enfrijoladas Preparadas": {
        title: "Elige el ingrediente principal",
        options: ["Pollo", "Picadillo", "Huevo"],
        required: true
    },
    "Enmoladas Preparadas": {
        title: "Elige el ingrediente principal",
        options: ["Pollo", "Picadillo", "Huevo"],
        required: true
    },
    "Quesadilla Preparada Chica": {
        title: "Elige el ingrediente principal",
        options: ["Bistec", "Pollo", "Picadillo", "Chorizo", "Longaniza", "Champiñón"],
        required: true
    },
    "Quesadilla Preparada Grande": {
        title: "Elige el ingrediente principal",
        options: ["Bistec", "Pollo", "Picadillo", "Chorizo", "Longaniza", "Champiñón"],
        required: true
    },
    "Tacos Dorados": {
        title: "Relleno",
        options: ["Pollo", "Papa con Chorizo"],
        required: true
    },
    "Picada Preparada": [
        {
            title: "Ingrediente Principal",
            options: ["Pollo", "Huevo", "Chorizo", "Bistec", "Longaniza"],
            required: true
        },
        {
            title: "Tipo de Salsa",
            options: ["Ranchera", "Verde", "Tomate", "Frijol", "Chipotle"],
            required: true
        }
    ],
    "Empanada Preparada": [
        {
            title: "Relleno",
            options: ["Pollo", "Picadillo", "Queso"],
            required: true
        },
        {
            title: "Tipo de Salsa",
            options: ["Ranchera", "Verde", "Tomate", "Frijol", "Chipotle"],
            required: true
        }
    ],
    "Tostada": [
        {
            title: "Ingrediente Principal",
            options: ["Pollo", "Picadillo", "Queso"],
            required: true
        },
        {
            title: "Tipo de Salsa",
            options: ["Ranchera", "Verde", "Tomate", "Frijol", "Chipotle"],
            required: true
        }
    ],
    "Aguas Frescas": {
        title: "Sabor",
        options: ["Jamaica", "Horchata", "Limón"],
        required: true
    },
    "Chocomilk, Licuado": {
        title: "Sabor",
        options: ["Chocomilk", "Licuado de Fresa", "Licuado de Plátano"],
        required: true
    },
    // Casos especiales que tienen "Sencilla" o "Preparada" en el nombre pero no llevan variaciones extra o llevan diferentes
    "Picada de Mole Sencilla": {
        title: "Nota del menú",
        options: ["De Mole Sencilla"],
        required: true
    },
    "Empanada Deshebrada": [
        {
            title: "Nota del menú",
            options: ["De Deshebrada"],
            required: true
        },
        {
            title: "Tipo de Salsa",
            options: ["Ranchera", "Verde", "Tomate", "Frijol", "Chipotle"],
            required: true
        }
    ]
    // NOTA: Eliminadas "Sencillas", "Entomatadas Sencillas", "Picada Sencilla", etc.
    // Porque no deben llevar cuadro de opciones extra.
};

async function loadMenuData() {
    const cacheKey = "loroMenuCache";
    const cacheTimeKey = "loroMenuCacheTime";
    const cacheDuration = 30 * 1000; // 30 segundos para mayor respuesta a cambios manuales
    
    const now = Date.now();
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const cachedData = localStorage.getItem(cacheKey);

    // Si hay cache y no ha expirado, usarlo
    if (cachedData && cachedTime && (now - cachedTime < cacheDuration)) {
        const parsed = JSON.parse(cachedData);
        menuData = parsed.record.menuData;
        isEmergencyClosed = parsed.record.isEmergencyClosed;
        if(parsed.record.bankDetails) bankDetails = parsed.record.bankDetails;
        updateBankUI();
        console.log("Menu loaded from cache");
        return;
    }

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        menuData = data.record.menuData;
        isEmergencyClosed = data.record.isEmergencyClosed;
        if(data.record.bankDetails) bankDetails = data.record.bankDetails;
        updateBankUI();
        
        // Guardar en cache
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, now.toString());
        console.log("Menu loaded from cloud");
    } catch (error) {
        console.error("Error loading menu:", error);
        // Fallback simple si falla
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            menuData = parsed.record.menuData;
            isEmergencyClosed = parsed.record.isEmergencyClosed;
            if(parsed.record.bankDetails) bankDetails = parsed.record.bankDetails;
            updateBankUI();
        }
    }
}

function updateBankUI() {
    if(document.getElementById("bank-name-text")) {
        document.getElementById("bank-name-text").textContent = bankDetails.bankName || "BBVA";
    }
    if(document.getElementById("bank-holder-text")) {
        document.getElementById("bank-holder-text").textContent = bankDetails.holderName || "La Casa de los Loros";
    }
    if(document.getElementById("bank-clabe-text")) {
        document.getElementById("bank-clabe-text").textContent = bankDetails.clabe || "012345678901234567";
    }
}

let cart = [];
const WNUMBER = "522295076655";

// Modal State
let currentModalItem = null;
let modalQty = 1;
let pulseTimeout;

document.addEventListener("DOMContentLoaded", async () => {
    // Show splash, then load data in background
    const splashPromise = new Promise(resolve => setTimeout(resolve, 5000));
    
    // Load menu data
    await loadMenuData();

    // Wait for splash to finish if it hasn't
    await splashPromise;

    document.getElementById("splash-screen").classList.add("fade-out");
    document.getElementById("main-content").classList.remove("hidden");
    initScrollReveal();
    
    renderMenu("all");
    checkOperatingHours(); // Inicial con cache o vacio
    
    // Refresh status frequently
    setInterval(checkOperatingHours, 30000);

    // Auto Start Tour feature
    if(!localStorage.getItem("loroTourDone")) {
        setTimeout(startTour, 800);
        localStorage.setItem("loroTourDone", "true");
    }


    // Fast Filtering
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderMenu(e.target.dataset.filter);
        });
    });

    // Parallax & Glassmorphism Header
    const headerContent = document.querySelector('.header-content');
    const headerParallax = document.getElementById('header-parallax');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        // Parallax background
        if(headerParallax) {
            headerParallax.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
        
        // Dynamic Glass Effect
        if(scrollY > 50) {
            headerContent.style.background = `rgba(27, 94, 32, 0.95)`;
            headerContent.style.backdropFilter = `blur(15px)`;
        } else {
            headerContent.style.background = `rgba(27, 94, 32, 0.85)`;
            headerContent.style.backdropFilter = `blur(12px)`;
        }
    });

    // Checkout Form listeners
    document.getElementById('delivery-zone').addEventListener('change', updateCartTotals);
    document.getElementById('client-name').addEventListener('input', validateCheckoutBtn);
    document.getElementById('client-address').addEventListener('input', validateCheckoutBtn);
});

// Animations on Scroll
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .menu-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Menu Render
function renderMenu(filter) {
    const list = document.getElementById("menu-list");
    list.innerHTML = "";

    const filtered = filter === "all" ? menuData : menuData.filter(i => i.category === filter);

    filtered.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "menu-item reveal";
        div.style.transitionDelay = `${index * 0.05}s`;
        
        // Make the entire div clickable for the modal
        div.onclick = (e) => {
            openItemModal(item.id);
        };

        div.innerHTML = `
            <div class="item-header">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    ${item.desc ? `<p class="item-desc">${item.desc}</p>` : ''}
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <!-- ID is attached to the button to calculate fly animation origin -->
                <button class="add-btn" id="btn-add-${item.id}" onclick="event.stopPropagation(); openItemModal('${item.id}', this)">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `;
        list.appendChild(div);
        
        // Small delay to trigger animation
        setTimeout(() => div.classList.add('active'), 50);
    });
}

// ------------------------------------
// MODAL LOGIC (Product Customization)
// ------------------------------------
let lastClickedBtn = null;

function openItemModal(id, btnElement = null) {
    const item = menuData.find(i => i.id === id);
    if(!item) return;

    currentModalItem = item;
    modalQty = 1;
    lastClickedBtn = btnElement || document.getElementById(`btn-add-${id}`);

    // Update Modal UI
    document.getElementById("modal-item-name").textContent = item.name;
    document.getElementById("modal-item-desc").textContent = item.desc || "Platillo fresco y delicioso a la puerta de tu casa.";
    document.getElementById("modal-pref").value = "";
    document.getElementById("modal-extra").checked = false;
    document.getElementById("modal-tortillas").checked = false;

    // Adapt modal text based on category
    const modalInputLabel = document.getElementById("modal-pref-label");
    const modalInput = document.getElementById("modal-pref");
    const extraCheckboxGroup = document.getElementById("modal-extra-group");
    const tortillasCheckboxGroup = document.getElementById("modal-tortillas-group");

    if (item.category === "bebidas") {
        modalInputLabel.textContent = "Especificaciones de Bebida";
        modalInput.placeholder = "Ej: Sin azúcar, Poca hielo, Deslactosada...";
        extraCheckboxGroup.style.display = "none";
        tortillasCheckboxGroup.style.display = "none";
    } else {
        modalInputLabel.textContent = "Especificaciones Generales / Aderezos";
        modalInput.placeholder = "Ej: Salsa verde, Sin cebolla, Ranch...";
        extraCheckboxGroup.style.display = "block";
        
        // Hide tortillas for salads maybe?
        if (item.name.toLowerCase().includes("ensalada")) {
             tortillasCheckboxGroup.style.display = "none";
        } else {
             tortillasCheckboxGroup.style.display = "block";
        }
    }
    
    updateModalPriceUI();

    // Render Dynamic Variants
    const variantsContainer = document.getElementById("modal-variants-container");
    variantsContainer.innerHTML = "";
    
    // Check if this item (or its simplified name) has variants
    let variantTemplate = null;
    
    // Sort keys by length descending to match most specific first (e.g. "Picada de Mole Sencilla" before "Picada")
    const sortedKeys = Object.keys(PRODUCT_VARIANTS).sort((a,b) => b.length - a.length);
    
    for (const key of sortedKeys) {
        if (item.name.toLowerCase().includes(key.toLowerCase())) {
            variantTemplate = PRODUCT_VARIANTS[key];
            break;
        }
    }
    if (variantTemplate || (item.variants && item.variants.length > 0)) {
        let templates = [];
        if (variantTemplate) {
            templates = Array.isArray(variantTemplate) ? variantTemplate : [variantTemplate];
        } else {
            templates = [{ title: "Selecciona una opción", options: item.variants, required: true }];
        }
        
        templates.forEach((v, groupIdx) => {
            const group = document.createElement("div");
            group.className = "option-group variants-group";
            
            let html = `<label class="variant-title">${v.title}</label><div class="variants-grid">`;
            
            v.options.forEach((opt, idx) => {
                const type = v.max && v.max > 1 ? "checkbox" : "radio";
                html += `
                    <label class="variant-option">
                        <input type="${type}" name="item-variant-${groupIdx}" data-max="${v.max || 0}" value="${opt}" ${idx === 0 && type === "radio" ? "checked" : ""}>
                        <span>${opt}</span>
                    </label>
                `;
            });
            
            html += `</div>`;
            group.innerHTML = html;
            variantsContainer.appendChild(group);

            // Limit checkboxes if needed
            if (v.max) {
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    cb.addEventListener('change', () => {
                        const checkedCount = group.querySelectorAll('input[type="checkbox"]:checked').length;
                        if (checkedCount > v.max) {
                            cb.checked = false;
                            alert(`Solo puedes seleccionar hasta ${v.max} opciones en ${v.title}`);
                        }
                    });
                });
            }
        });
    }

    document.getElementById("item-modal").classList.add("open");
}

function closeItemModal() {
    document.getElementById("item-modal").classList.remove("open");
    currentModalItem = null;
}

function changeModalQty(delta) {
    if(modalQty + delta > 0) {
        modalQty += delta;
        updateModalPriceUI();
    }
}

function updateModalPriceUI() {
    if(!currentModalItem) return;
    
    let base = currentModalItem.price;
    if(document.getElementById("modal-extra").checked) base += 15;
    if(document.getElementById("modal-tortillas").checked) base += 20;

    const unitPriceDOM = document.getElementById("modal-item-price");
    const totalBtnDOM = document.getElementById("modal-total-btn");

    unitPriceDOM.textContent = `$${base.toFixed(2)} c/u`;
    totalBtnDOM.textContent = `$${(base * modalQty).toFixed(2)}`;
}

// Attach listeners to checkboxes to update price live
document.getElementById("modal-extra").addEventListener('change', updateModalPriceUI);
document.getElementById("modal-tortillas").addEventListener('change', updateModalPriceUI);

function confirmAddToCart() {
    if(!currentModalItem) return;

    let basePrice = currentModalItem.price;
    let extrasList = [];

    if(document.getElementById("modal-extra").checked) {
        basePrice += 15;
        extrasList.push("+ Ingte. Extra");
    }
    if(document.getElementById("modal-tortillas").checked) {
        basePrice += 20;
        extrasList.push("+ Orden de Tortillas");
    }

    // Get Selected Variants
    const selectedVariants = [];
    document.querySelectorAll('#modal-variants-container input[type="radio"]:checked, #modal-variants-container input[type="checkbox"]:checked').forEach(input => {
        selectedVariants.push(input.value);
    });

    // Check required variants (max count for checkboxes)
    const variantsContainer = document.getElementById("modal-variants-container");
    let isValid = true;
    const groups = variantsContainer.querySelectorAll('.variants-group');
    groups.forEach((group) => {
         const requiredCb = group.querySelector('input[type="checkbox"]');
         if (requiredCb) {
             const max = parseInt(requiredCb.getAttribute('data-max') || "0");
             const checkedCount = group.querySelectorAll('input[type="checkbox"]:checked').length;
             if (max > 0 && checkedCount !== max) {
                 isValid = false;
                 alert(`Por favor, completa correctamente las opciones (Selecciona exactamente ${max} cuando aplicable).`);
             }
         }
    });

    if (!isValid) return;

    const unparsedPref = document.getElementById("modal-pref").value.trim();
    let finalPrefs = unparsedPref !== "" ? unparsedPref : null;

    // We build a unique signature so things with different specs don't merge
    const cartId = currentModalItem.id + "-" + Date.now().toString(36);

    const cartItem = {
        cartId: cartId,
        itemId: currentModalItem.id,
        name: currentModalItem.name,
        price: basePrice, // Updated computed price
        qty: modalQty,
        prefs: finalPrefs,
        selectedVariants: selectedVariants,
        extrasList: extrasList
    };

    const existing = cart.find(i => i.cartId === cartId);
    if(existing) {
        existing.qty += modalQty;
    } else {
        cart.push(cartItem);
    }

    closeItemModal();
    updateCartUI();
    
    // Trigger animations
    if(lastClickedBtn) {
        flyToCart(lastClickedBtn);
    }
    triggerCartPulse();
}

// ------------------------------------
// FLY TO CART ANIMATION
// ------------------------------------
function flyToCart(startElement) {
    const floatingCart = document.getElementById("floating-cart");
    if(!startElement || !floatingCart) return;

    const startRect = startElement.getBoundingClientRect();
    const targetRect = floatingCart.getBoundingClientRect();

    const flier = document.createElement("div");
    flier.className = "flying-item";
    
    // Set initial position
    flier.style.top = `${startRect.top + 10}px`;
    flier.style.left = `${startRect.left + 10}px`;
    
    document.body.appendChild(flier);

    // Give browser time to paint
    requestAnimationFrame(() => {
        // Compute translate offsets
        const diffX = (targetRect.left + 25) - (startRect.left + 10);
        const diffY = (targetRect.top + 25) - (startRect.top + 10);

        flier.style.transform = `translate(${diffX}px, ${diffY}px) scale(0.2)`;
        flier.style.opacity = "0";
    });

    // Cleanup
    setTimeout(() => {
        if(document.body.contains(flier)) document.body.removeChild(flier);
    }, 600);
}

// Pulse animation for urgency
function triggerCartPulse() {
    const cartEl = document.getElementById("floating-cart");
    
    // Clear previous timeout so it doesn't pulse forever or overlap
    clearTimeout(pulseTimeout);
    
    // Start pulse
    cartEl.classList.add("pulse");
    
    // Remove pulse after 4 seconds
    pulseTimeout = setTimeout(() => {
        cartEl.classList.remove("pulse");
    }, 4000);
}


// ------------------------------------
// CART LOGIC & CHECKOUT
// ------------------------------------

function updateCartUI() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    
    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-total-float").textContent = `$${subtotal.toFixed(2)}`;
    
    if(count > 0) {
        document.getElementById("floating-cart").classList.remove("hidden");
        document.getElementById("delivery-form").style.display = "block";
    } else {
        document.getElementById("floating-cart").classList.add("hidden");
        document.getElementById("cart-modal").classList.remove("open");
        document.getElementById("delivery-form").style.display = "none";
    }

    const cartList = document.getElementById("cart-items-list");
    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    
    if(count === 0) {
        cartList.innerHTML = `
            <div class="empty-cart-msg">
                <video src="assets/mascota.webm" autoplay loop muted playsinline alt="Loro esperando" class="mascot-cart" style="background:transparent;"></video>
                <p>¡El Loro sigue esperando en la cocina! Agrega los ingredientes para tu espectacular pedido.</p>
            </div>`;
        updateCartTotals(); // Reset totals
        return;
    }

    cartList.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        
        let descHtml = "";
        if(item.selectedVariants && item.selectedVariants.length > 0) {
            descHtml += `<span class="cart-variant">✓ ${item.selectedVariants.join(', ')}</span><br>`;
        }
        if(item.prefs) descHtml += `<i>*${item.prefs}</i><br>`;
        if(item.extrasList.length > 0) descHtml += `<small>${item.extrasList.join(', ')}</small>`;

        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                ${descHtml ? `<div class="cart-item-desc">${descHtml}</div>` : ''}
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="changeCartQty('${item.cartId}', -1)">-</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="qty-btn" onclick="changeCartQty('${item.cartId}', 1)">+</button>
            </div>
        `;
        cartList.appendChild(div);
    });

    updateCartTotals();
}

function changeCartQty(cartId, delta) {
    const idx = cart.findIndex(i => i.cartId === cartId);
    if(idx > -1) {
        cart[idx].qty += delta;
        if(cart[idx].qty <= 0) {
            cart.splice(idx, 1);
        }
        updateCartUI();
    }
}

function toggleCart() {
    if(cart.length > 0 || document.getElementById("cart-modal").classList.contains("open")) {
        document.getElementById("cart-modal").classList.toggle("open");
        validateCheckoutBtn();
    }
}

// Calculates Form, Shipping logic
function updateCartTotals() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const zoneSelect = document.getElementById("delivery-zone");
    
    if(cart.length === 0) {
        document.getElementById("cart-grand-total").textContent = "$0.00";
        document.getElementById("shipping-row").style.display = "none";
        return;
    }

    let shipping = 0;
    if(zoneSelect.value && zoneSelect.value !== "0" && zoneSelect.value !== "999") {
        shipping = parseFloat(zoneSelect.value);
        document.getElementById("shipping-row").style.display = "flex";
        document.getElementById("cart-shipping").textContent = `+$${shipping.toFixed(2)}`;
    } else if (zoneSelect.value === "999") {
        document.getElementById("shipping-row").style.display = "flex";
        document.getElementById("cart-shipping").textContent = "A Confirmar";
    } else {
        document.getElementById("shipping-row").style.display = "none";
    }

    const grandTotal = subtotal + shipping;
    document.getElementById("cart-grand-total").textContent = zoneSelect.value === "999" ? `$${grandTotal.toFixed(2)} (Más Envío)` : `$${grandTotal.toFixed(2)}`;
    
    validateCheckoutBtn();
}

function validateCheckoutBtn() {
    const btn = document.getElementById("checkout-btn");
    const zone = document.getElementById("delivery-zone").value;
    const name = document.getElementById("client-name").value.trim();
    const address = document.getElementById("client-address").value.trim();
    const btnText = document.getElementById("btn-text-checkout");

    if(cart.length === 0) {
        btn.disabled = true;
        btnText.textContent = "Tu carrito está vacío";
        return;
    }

    if(zone === "0" || zone === null || zone === "") {
        // Pasará a recogerlo OR hasn't selected a zone
        if(!zone) {
            btn.disabled = true;
            btnText.textContent = "Selecciona Zona";
            return;
        }
    } else {
        // Needs delivery info
        if(name.length < 2 || address.length < 4) {
            btn.disabled = true;
            btnText.textContent = "Ingresa tu Envío para continuar";
            return;
        }
    }

    btn.disabled = false;
    btnText.textContent = "Pedir por WhatsApp";
}

function processCheckout() {
    const name = document.getElementById("client-name").value.trim();
    const zoneSelect = document.getElementById("delivery-zone");
    const address = document.getElementById("client-address").value.trim();
    const refs = document.getElementById("client-refs").value.trim();

    const isPickup = (zoneSelect.value === "0" && zoneSelect.options[zoneSelect.selectedIndex].text.includes("recoger"));

    let msg = `*¡Hola La Casa de los Loros!*\nMe gustaría hacer un pedido:\n\n`;
    let subtotal = 0;

    cart.forEach(item => {
        msg += `- *${item.qty}x ${item.name}* : $${(item.price * item.qty).toFixed(2)}\n`;
        if(item.selectedVariants && item.selectedVariants.length > 0) msg += `   [Opción]: _${item.selectedVariants.join(', ')}_\n`;
        if(item.prefs) msg += `   [Nota]: _${item.prefs}_\n`;
        if(item.extrasList.length > 0) msg += `   [+]: _${item.extrasList.join(', ')}_\n`;
        subtotal += item.price * item.qty;
    });

    msg += `\n*Subtotal:* $${subtotal.toFixed(2)}\n`;

    let shipping = 0;
    let isOutOfRange = false;
    if(!isPickup) {
        if(zoneSelect.value === "999") {
            isOutOfRange = true;
            msg += `*Envío:* A confirmar (${zoneSelect.options[zoneSelect.selectedIndex].text})\n`;
        } else {
            shipping = parseFloat(zoneSelect.value);
            msg += `*Envío:* $${shipping.toFixed(2)} (${zoneSelect.options[zoneSelect.selectedIndex].text})\n`;
        }
    }

    const total = subtotal + shipping;
    if (isOutOfRange) {
        msg += `*TOTAL APROX. (Sin contar envío): $${total.toFixed(2)}*\n\n`;
    } else {
        msg += `*TOTAL A PAGAR: $${total.toFixed(2)}*\n\n`;
    }

    msg += `--- *DATOS DEL CLIENTE* ---\n`;
    msg += `*Nombre:* ${name || "Cliente"}\n`;
    
    if(isPickup) {
        msg += `*Tipo de Orden:* Pasaré a recoger mi pedido\n`;
    } else {
        msg += `*Dirección:* ${address}\n`;
        if(refs) msg += `*Referencia:* ${refs}\n`;
    }

    // Convert string to URL-safe format (handles \n flawlessly)
    msg = encodeURIComponent(msg);

    const url = `https://wa.me/${WNUMBER}?text=${msg}`;
    window.open(url, "_blank");
}

// ------------------------------------
// STORE BUSINESS HOURS / BLOCK TICKER
// ------------------------------------
function checkOperatingHours() {
    // Requirements:
    // Mon-Fri: 8:00 - 14:30
    // Sat: 8:00 - 12:00
    // Sun: Closed

    const date = new Date(); // Local time for user
    const day = date.getDay(); // 0 = Sun, 1 = Mon...
    const hours = date.getHours();
    const mins = date.getMinutes();
    const timeFloat = hours + (mins / 60);

    let isClosed = false;

    // Emergency Close override
    if(isEmergencyClosed) {
        isClosed = true;
    } else if(day === 0) {
        // Sunday
        isClosed = true;
    } else if (day >= 1 && day <= 5) {
        // Mon-Fri
        if(timeFloat < 8 || timeFloat >= 14.5) { // 14:30
            isClosed = true;
        }
    } else if (day === 6) {
        // Saturday
        if(timeFloat < 8 || timeFloat >= 12) {
            isClosed = true;
        }
    }

    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');

    if(isClosed) {
        if(text) {
             text.textContent = isEmergencyClosed ? "Cerrado por el momento" : "Cerrado ahora";
        }
        if(dot) dot.className = "status-dot offline";
        document.getElementById('closed-overlay').classList.remove('hidden');
        // Let's block the cart and Add to cart buttons
        document.querySelectorAll('.add-btn').forEach(b => {
            b.style.pointerEvents = "none";
            b.style.opacity = "0.3";
        });
        
        document.querySelectorAll('.menu-item').forEach(m => {
            m.onclick = (e) => { e.stopPropagation(); alertClosed(); };
        });
    } else {
        if(text) text.textContent = "Abierto ahora";
        if(dot) dot.className = "status-dot online";
    }
}

function alertClosed() {
    document.getElementById('closed-overlay').classList.remove('hidden');
}

function closeStoreMessage() {
    document.getElementById('closed-overlay').classList.add('hidden');
}

function scrollToMenu() {
    const section = document.getElementById("menu-section");
    const yOffset = -70; 
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
}

function startTour() {
    // Hide help button during tour
    document.querySelector('.floating-help').classList.add('hide');
    document.getElementById('closed-overlay').classList.add('hidden');
    // Ensure we reset scrolling to top so first steps are visible
    window.scrollTo({top: 0, behavior: 'smooth'});

    const tour = introJs();
    tour.setOptions({
        nextLabel: 'Siguiente &rarr;',
        prevLabel: '&larr; Regresar',
        doneLabel: '¡A pedir!',
        showProgress: true,
        scrollToElement: true,
        showBullets: false,
        exitOnOverlayClick: false,
        tooltipClass: 'custom-intro-balloon'
    });

    tour.oncomplete(() => {
        document.querySelector('.floating-help').classList.remove('hide');
        checkOperatingHours(); // Re-check if we need to show the closed popup
    });

    tour.onexit(() => {
        document.querySelector('.floating-help').classList.remove('hide');
        checkOperatingHours(); // Re-check if we need to show the closed popup
    });

    setTimeout(() => {
        tour.start();
    }, 300);
}

function toggleBankModal() {
    document.getElementById("bank-modal").classList.toggle("open");
}

function copyToClipboard(elementId, btn) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalHtml = btn.innerHTML;
        btn.classList.add("copied");
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        
        setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = originalHtml;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}
