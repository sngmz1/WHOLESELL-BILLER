// Products imported from provided list (parsed)
const rawProductText = `AMCHUR POWDER 50 GM PCS 50
BLACK PEPPER(BOX) 50GM BOX 78
CHAAT MASALA 100GM PCS 85
CHAAT MASALA 50GM PCS 44
CHAT 100GM JAR PCS 90
CHAT MASALA 10 GM BOX BOX 10
CHAT MASALA 7 GM PCS 5
CHATMASAL 12GM PCS 10
CHHOLA MASALA 7GM PCS 5
CHHOLE MASALA 100GM PCS 88
CHHOLE MASALA 50GM PCS 45
CHICKEN MASALA 7GMS PCS 5
CHIKEN MASALA 100 gm JAR BOX 99
CHIKEN MASALA 50 GM PCS 48
CHIKEN MASALA BOX 10GM BOX 10
CHILLFLAKES 30 PCS 79
CHOLE 100 GM JAR BOX 97
CORAINDER (POUCH) 10 GM PCS 5
CORIANDER (POUCH) 100GM PCS 42
CORIANDER (POUCH) 200GM PCS 84
CORIANDER (POUCH) 500GM PCS 190
CORIANDER POWDER [200]JAR PCS 90
CORIANDER POWDER [500] JAR PCS 202
CUMIN POWDER (BOX) 50GM BOX 53
CUMIN POWDER(BOX) 50GM BOX 53
DESI MEAT 50 GM BOX PCS 10
DESI MEAT 50 GM BOX BOX 53
DESI MEAT 50 GM BOX PCS 10
DRY GINGER (BOX) 50GM BOX 47
EGG CURRY 7GM BOX PCS 5
GARAM 100 JAR PCS 106
GARAM MASALA (200) JAR 60 PCS 204
GARAM MASALA 10 GM BOX PCS 10
GARAM MASALA 50 GM PCS 52
GARAM MASALA 7 GMS PCS 5
GINGER GARLIC PASTE 25 PCS 5
GINGER GARLIC PASTE 200 PCS 50
GINGER GARLIC PEST 100 PCS 25
HINGRAJ 100GM PCS 275
HINGRAJ 25GM(240PC) PCS 74
HINGRAJ 50GM PCS 143
HINGRAJ POWDER (10) (JAR3 PCS 33
JALJIRA POWDER 100GM PCS 66
JALJIRA POWDER 50GM PCS 35
JALJIRA POWDER 5GM PCS 2
KADAI MIRCH POWDER 100GM BOX 120
KASHMIRI CHILLY 10 GMS PCS 10
KASHMIRI LAL (BOX) 50GM BOX 57
KASHMIRI LAL 20GM PCS 25
KASURI METHI 25GM PCS 30
KITCHEN KING 100GM PCS 97
KITCHEN KING 12 GMS PCS 90
KITCHEN KING 50GM PCS 47
MEAT MASALA (JAR) 200GM 60 PCS 191
MEAT MASALA 100GM BOX 92
MEAT MASALA 200GM ( 80 PCS) PCS 180
MEAT MASALA 50GM PCS 48
MEAT MASALA BOX 10 BOX 10
MEAT MASALA P 12 GMS PCS 5
MEAT MASALA100JAR BOX 99
MEAT MASALA7GM PCS 5
MILK MASALA 20GMS PCS 87
MIXED HERB 12 PCS 79
OREGANO 10 GM PCS 63.2
PANIPURI MASALA 50GM PCS 40
PASTA MASALA POUCH 10GM PCS 5
PAV BHAJI MASALA 50 GM PCS 47
PAVBHAJI 7 PCS 5
SABJI BOX 10 GM BOX 10
SABJI MASALA (200) JAR 60 PCS 150
SABJI MASALA (BOX ) 100 GM BOX 72
SABJI MASALA 200GM ( 80 PCS) PCS 140
SABJI MASALA7 GM PCS 5
SAFFRON 0.5GM PCS 210
SAFFRON50MG PCS 210
SAFFRON 50MG PCS 210
SAHI BIRYANI 10 GM BOX BOX 10
SAHI PANEER BOX 10 GM BOX BOX 10
SAMBHAR 7GM PCS 5
SAMBHAR MASALA 50GM PCS 42
SHAHI BIRYANI 50GM PCS 83
SHAHI BIRYANI POUCH 8GM PCS 10
SHAHI PANEER BOX 50GM BOX 51
SHAHI PANEER POUCH 12 GM PCS 10
SUPER GARAM MASALA 1KG PCS 605
SUPER GARAM MASALA 1KG PCS 605
SUPER GARAM MASALA 200GM PCS 128
SUPER SAMBHAR 100GM PCS 67
SUPERGARAM 50GM PCS 32
TAE MASALA 25GMS PCS 33
TANDORI CHICKEN MASALA 50GM PCS 48
TEZ MATAN MASALA 7GMS PCS 5
TEZ MATAN MASALA POUCH 12 PCS 7
TIKHALAL (POUCH) 100GM PCS 62
TIKHALAL (POUCH) 200GM PCS 143
TIKHALAL (POUCH) 500GM PCS 290
TIKHALAL CHILLY POWDER 500GM JAR PCS 305
TIKHALAL POUCH 50GM PCS 30
TURMERIC (POUCH) 100GM PCS 46
TURMERIC (POUCH) 200GM PCS 92
TURMERIC (POUCH) 500GM PCS 220
TURMERIC (POUCH) 50GM PCS 23
TURMERIC (POUCH)10GM PCS 5
TURMERIC POWDER [200] JAR PCS 102
TURMERIC POWDER [500] JAR PCS 235
WHITE PAPPER (POUCH) 100GM PCS 115`;

const products = parseProductsFromText(rawProductText);

function parseProductsFromText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l && !/^name\b/i.test(l));

    return lines.map((line, idx) => {
        // Improved parsing: find the last number as MRP, the word before it as pack, rest as name
        const parts = line.split(/\s+/);
        let mrp = 0;
        let packRaw = '';
        let nameParts = [];

        // Find the MRP (last number in the line)
        for (let i = parts.length - 1; i >= 0; i--) {
            const num = parseFloat(parts[i].replace(/[^0-9.]/g, ''));
            if (!isNaN(num) && num > 0) {
                mrp = num;
                // The pack is likely the word before MRP
                if (i > 0) {
                    packRaw = parts[i - 1].replace(/[^a-zA-Z]/g, '').toUpperCase();
                }
                nameParts = parts.slice(0, i - 1);
                break;
            }
        }

        const name = nameParts.join(' ');

        // Try to extract weight in gm or kg from the name
        const weightMatch = name.match(/(\d+(?:\.\d+)?)\s*(kg|KG|Kg|g|G|gm|GM)/i);
        let weight = 0;
        if (weightMatch) {
            const val = parseFloat(weightMatch[1]);
            const unit = weightMatch[2].toLowerCase();
            weight = unit.startsWith('kg') ? val * 1000 : val;
        }

        // Normalize category to exactly one of: hanger, pouch, box, jar
        let category;
        if (packRaw.includes('BOX')) category = 'box';
        else if (packRaw.includes('POUCH')) category = 'pouch';
        else if (packRaw.includes('JAR')) category = 'jar';
        else if (packRaw.includes('HANGER')) category = 'hanger';
        else if (packRaw.includes('PCS') || packRaw === '' || packRaw === 'PC') category = 'pouch';
        else category = 'pouch';

        // Default piecesPerCase per category
        const defaultPiecesPerCategory = { pouch: 1, box: 10, jar: 10, hanger: 1200 };
        let piecesPerCase = defaultPiecesPerCategory[category] || 1;

        // Special rule: if weight is 5g, 7g or 10g and original pack wasn't BOX, treat as hanger
        const smallWeight = Math.round(weight);
        if ((smallWeight === 5 || smallWeight === 7 || smallWeight === 10) && category !== 'box') {
            category = 'hanger';
            piecesPerCase = defaultPiecesPerCategory['hanger'];
        }

        return {
            id: idx + 1,
            name,
            mrp,
            weight, // grams
            piecesPerCase,
            category
        };
    });
}

let cart = [];
let filteredProducts = [...products];

// Initialize the page
function init() {
    renderProducts();
    setupEventListeners();
    updateCart(); // Initialize cart display

    // Hide cart on mobile initially
    if (window.innerWidth <= 768) {
        const cartSection = document.querySelector('.cart-section');
        if (cartSection) cartSection.classList.add('hidden');
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Add listeners for filter changes
    document.getElementById('categoryFilter').addEventListener('change', searchProducts);
    document.getElementById('weightExact').addEventListener('input', searchProducts);
    document.getElementById('mrpUnder').addEventListener('input', searchProducts);

    // Handle window resize for cart visibility
    window.addEventListener('resize', function() {
        const toggleBtn = document.getElementById('cartToggleBtn');
        const cartSection = document.querySelector('.cart-section');

        if (window.innerWidth <= 768) {
            if (cart.length > 0) {
                toggleBtn.style.display = 'block';
                cartSection.classList.add('hidden');
            }
        } else {
            toggleBtn.style.display = 'none';
            cartSection.classList.remove('hidden');
        }
    });
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-name">${product.name}</div>
            <div class="product-details">
                <div class="detail-item">
                    <span class="detail-label">MRP:</span>
                    <span>₹${product.mrp}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Weight:</span>
                    <span>${product.weight >= 1000 ? (product.weight/1000)+ 'kg' : product.weight + 'g'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span>${product.category}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pieces/Case:</span>
                    <span>${product.piecesPerCase}</span>
                </div>
            </div>

            <div class="price-section">
                <div class="mrp-display">Price per unit: ₹${product.mrp}</div>
                <div class="case-total">Case Total: ₹${(product.mrp * product.piecesPerCase).toFixed(2)}</div>
                <div class="discount-info">After 30% discount: ₹${((product.mrp * product.piecesPerCase) * 0.7).toFixed(2)}</div>
            </div>

            <div class="quantity-section">
                <label for="cases-${product.id}">Cases:</label>
                <input
                    type="number"
                    id="cases-${product.id}"
                    min="0"
                    value="1"
                >

                <label for="pieces-${product.id}">Pieces:</label>
                <input
                    type="number"
                    id="pieces-${product.id}"
                    min="0"
                    value="0"
                >
            </div>

            <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const weightExact = parseFloat(document.getElementById('weightExact').value) || NaN;
    const mrpUnder = parseFloat(document.getElementById('mrpUnder').value) || Infinity;

    filteredProducts = products.filter(product => {
        // Name search
        const nameMatch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm);

        // Category filter
        const categoryMatch = categoryFilter === '' || product.category === categoryFilter;

        // Exact weight match (only if a value is entered)
        const weightMatch = isNaN(weightExact) || product.weight === weightExact;

        // MRP under
        const mrpMatch = product.mrp <= mrpUnder;

        return nameMatch && categoryMatch && weightMatch && mrpMatch;
    });

    renderProducts();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const casesQuantity = parseInt(document.getElementById(`cases-${productId}`).value) || 0;
    const piecesQuantity = parseInt(document.getElementById(`pieces-${productId}`).value) || 0;

    if ((casesQuantity <= 0 && piecesQuantity <= 0) || isNaN(casesQuantity) || isNaN(piecesQuantity)) {
        alert('Please enter a valid quantity for cases or pieces');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.cases = (existingItem.cases || 0) + (casesQuantity || 0);
        existingItem.pieces = (existingItem.pieces || 0) + (piecesQuantity || 0);
    } else {
        cart.unshift({
            ...product,
            cases: casesQuantity || 0,
            pieces: piecesQuantity || 0
        });
    }

    updateCart();
    document.getElementById(`cases-${productId}`).value = 1;
    document.getElementById(`pieces-${productId}`).value = 0;
}

// Update cart display and calculations
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const subtotalSpan = document.getElementById('subtotal');
    const discountSpan = document.getElementById('totalDiscount');
    const finalTotalSpan = document.getElementById('finalTotal');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        subtotalSpan.textContent = '0.00';
        discountSpan.textContent = '0.00';
        finalTotalSpan.textContent = '0.00';
        const toggleBtn = document.getElementById('cartToggleBtn');
        if (toggleBtn) toggleBtn.style.display = 'none';
        return;
    }

    const toggleBtn = document.getElementById('cartToggleBtn');
    if (toggleBtn) toggleBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;

    cartItemsDiv.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Cat.</th>
                    <th>MRP</th>
                    <th>Wt.</th>
                    <th>Qty</th>
                    <th>Total MRP</th>
                    <th>Disc.</th>
                    <th>Final</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map((item, index) => {
                    const caseTotal = item.mrp * item.piecesPerCase;
                    const discountedCaseTotal = caseTotal * 0.7;
                    const perPiecePrice = item.mrp;
                    const perPieceDiscounted = perPiecePrice * 0.7;

                    const casesQty = item.cases || 0;
                    const piecesQty = item.pieces || 0;

                    const preDiscount = (caseTotal * casesQty) + (perPiecePrice * piecesQty);
                    const discount = (caseTotal * 0.3 * casesQty) + (perPiecePrice * 0.3 * piecesQty);
                    const itemTotal = (discountedCaseTotal * casesQty) + (perPieceDiscounted * piecesQty);

                    subtotal += preDiscount;
                    totalDiscount += discount;

                    const quantityText = [];
                    if (casesQty > 0) quantityText.push(`${casesQty} Case${casesQty > 1 ? 's' : ''}`);
                    if (piecesQty > 0) quantityText.push(`${piecesQty} Piece${piecesQty > 1 ? 's' : ''}`);
                    const quantityDisplay = quantityText.join('<br>');

                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.category}</td>
                            <td>₹${item.mrp}</td>
                            <td>${item.weight >= 1000 ? (item.weight/1000) + 'kg' : item.weight + 'g'}</td>
                            <td>${quantityDisplay}</td>
                            <td>₹${preDiscount.toFixed(2)}</td>
                            <td>₹${discount.toFixed(2)}</td>
                            <td>₹${itemTotal.toFixed(2)}</td>
                            <td><button class="remove-btn" onclick="removeFromCart(${index})">Remove</button></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    const finalTotal = subtotal - totalDiscount;

    subtotalSpan.textContent = subtotal.toFixed(2);
    discountSpan.textContent = totalDiscount.toFixed(2);
    finalTotalSpan.textContent = finalTotal.toFixed(2);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        alert('Cart is already empty');
        return;
    }

    if (confirm('Are you sure you want to clear the entire cart?')) {
        cart = [];
        updateCart();
    }
}

// Toggle cart visibility on mobile
function toggleCart() {
    const cartSection = document.querySelector('.cart-section');
    const toggleBtn = document.getElementById('cartToggleBtn');

    if (window.innerWidth <= 768) {
        cartSection.classList.toggle('hidden');
        toggleBtn.textContent = cartSection.classList.contains('hidden') ? '🛒' : '✕';
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
