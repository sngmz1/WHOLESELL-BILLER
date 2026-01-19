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

let products = JSON.parse(localStorage.getItem('products')) || [];

if (products.length === 0) {
    products = parseProductsFromText(rawProductText);
    saveProductsToStorage();
}

function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

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

let cart = JSON.parse(localStorage.getItem('currentCart')) || [];
let filteredProducts = [...products];
let billHistory = JSON.parse(localStorage.getItem('billHistory')) || [];

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('currentCart', JSON.stringify(cart));
}

// Initialize the page
function init() {
    renderProducts();
    setupEventListeners();
    updateCart();
    renderHistory();
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

    // Close cart on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartSection = document.getElementById('cartSection');
            if (cartSection.classList.contains('visible')) {
                toggleCart();
            }
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
            <button class="edit-btn" onclick="openEditModal(${product.id})">Edit Details</button>
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
    saveCartToStorage();
    document.getElementById(`cases-${productId}`).value = 1;
    document.getElementById(`pieces-${productId}`).value = 0;
}

// Update cart display and calculations
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const subtotalSpan = document.getElementById('subtotal');
    const discountSpan = document.getElementById('totalDiscount');
    const finalTotalSpan = document.getElementById('finalTotal');
    const cartCount = document.getElementById('cartCount');

    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + (item.cases || 0) + (item.pieces || 0), 0);
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
            cartCount.textContent = totalItems > 99 ? '99+' : totalItems;
        } else {
            cartCount.style.display = 'none';
        }
    }

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        subtotalSpan.textContent = '0.00';
        discountSpan.textContent = '0.00';
        finalTotalSpan.textContent = '0.00';
        return;
    }

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

                    const categoryAbbr = item.category.charAt(0).toUpperCase();

                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td>${categoryAbbr}</td>
                            <td>₹${item.mrp}</td>
                            <td>${item.weight >= 1000 ? (item.weight/1000) + 'kg' : item.weight + 'g'}</td>
                            <td class="qty-cell">
                                <div class="qty-row">
                                    <span class="qty-label">C:</span>
                                    <input type="number" class="qty-input" value="${casesQty}" min="0" onchange="setQty(${index}, 'cases', this.value)">
                                </div>
                                <div class="qty-row">
                                    <span class="qty-label">P:</span>
                                    <input type="number" class="qty-input" value="${piecesQty}" min="0" onchange="setQty(${index}, 'pieces', this.value)">
                                </div>
                            </td>
                            <td>₹${preDiscount.toFixed(2)}</td>
                            <td>₹${discount.toFixed(2)}</td>
                            <td>₹${itemTotal.toFixed(2)}</td>
                            <td><button class="remove-btn" onclick="removeFromCart(${index})">✕</button></td>
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

// Set quantity in cart
function setQty(index, type, value) {
    const item = cart[index];
    if (!item) return;

    const qty = Math.max(0, parseInt(value) || 0);

    if (type === 'cases') {
        item.cases = qty;
    } else if (type === 'pieces') {
        item.pieces = qty;
    }

    // Remove item if both cases and pieces are 0
    if ((item.cases || 0) === 0 && (item.pieces || 0) === 0) {
        cart.splice(index, 1);
    }

    updateCart();
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToStorage();
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
        saveCartToStorage();
    }
}

// Toggle cart visibility
function toggleCart() {
    const cartSection = document.getElementById('cartSection');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSection.classList.toggle('visible');
    cartOverlay.classList.toggle('visible');
}

// Save current cart as a bill
function saveBill() {
    if (cart.length === 0) {
        alert('Cart is empty! Add items before saving a bill.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => {
        const caseTotal = item.mrp * item.piecesPerCase;
        const perPiecePrice = item.mrp;
        return sum + (caseTotal * (item.cases || 0)) + (perPiecePrice * (item.pieces || 0));
    }, 0);

    const discount = subtotal * 0.3;
    const finalTotal = subtotal - discount;

    const bill = {
        id: Date.now(),
        billNumber: 'BILL-' + String(billHistory.length + 1).padStart(4, '0'),
        date: new Date().toLocaleString(),
        items: cart.map(item => ({
            name: item.name,
            category: item.category,
            mrp: item.mrp,
            weight: item.weight,
            cases: item.cases || 0,
            pieces: item.pieces || 0,
            piecesPerCase: item.piecesPerCase
        })),
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        finalTotal: finalTotal.toFixed(2)
    };

    billHistory.unshift(bill);
    localStorage.setItem('billHistory', JSON.stringify(billHistory));
    renderHistory();

    alert(`Bill saved! Bill Number: ${bill.billNumber}\nTotal: ₹${bill.finalTotal}`);

    // Clear cart after saving
    cart = [];
    updateCart();
    saveCartToStorage();
    toggleCart();
}

// Export cart to Excel with proper formatting (A6 size with colors and borders)
async function exportToExcel() {
    if (cart.length === 0) {
        alert('Cart is empty! Add items before exporting.');
        return;
    }

    // Calculate totals for saving
    const subtotalVal = cart.reduce((sum, item) => {
        const caseTotal = item.mrp * item.piecesPerCase;
        const perPiecePrice = item.mrp;
        return sum + (caseTotal * (item.cases || 0)) + (perPiecePrice * (item.pieces || 0));
    }, 0);
    const discountVal = subtotalVal * 0.3;
    const finalTotalVal = subtotalVal - discountVal;

    // Create and save bill
    const bill = {
        id: Date.now(),
        billNumber: 'BILL-' + String(billHistory.length + 1).padStart(4, '0'),
        date: new Date().toLocaleString(),
        items: cart.map(item => ({
            name: item.name,
            category: item.category,
            mrp: item.mrp,
            weight: item.weight,
            cases: item.cases || 0,
            pieces: item.pieces || 0,
            piecesPerCase: item.piecesPerCase
        })),
        subtotal: subtotalVal.toFixed(2),
        discount: discountVal.toFixed(2),
        finalTotal: finalTotalVal.toFixed(2)
    };

    billHistory.unshift(bill);
    localStorage.setItem('billHistory', JSON.stringify(billHistory));
    renderHistory();

    const billNumber = bill.billNumber;
    const date = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric'
    });
    const time = new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    let totalCases = 0;
    let totalPieces = 0;

    const billItems = cart.map((item, index) => {
        const casesQty = item.cases || 0;
        const piecesQty = item.pieces || 0;
        const caseTotal = item.mrp * item.piecesPerCase;
        const perPiecePrice = item.mrp;
        
        const preDiscount = (caseTotal * casesQty) + (perPiecePrice * piecesQty);
        const discount = preDiscount * 0.3;
        const itemTotal = preDiscount - discount;

        subtotal += preDiscount;
        totalDiscount += discount;
        totalCases += casesQty;
        totalPieces += piecesQty;

        const weight = item.weight >= 1000 ? (item.weight/1000) + 'kg' : item.weight + 'g';

        return {
            sr: index + 1,
            name: item.name.length > 18 ? item.name.substring(0, 16) + '..' : item.name,
            cat: item.category.charAt(0).toUpperCase(),
            cases: casesQty,
            pcs: piecesQty,
            rate: item.mrp,
            amt: itemTotal
        };
    });

    const finalTotal = subtotal - totalDiscount;

    // Create workbook with ExcelJS
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bill', {
        pageSetup: {
            paperSize: 11, // A5 (closest to A6)
            orientation: 'portrait',
            fitToPage: true,
            margins: {
                left: 0.2, right: 0.2,
                top: 0.2, bottom: 0.2,
                header: 0, footer: 0
            }
        }
    });

    // Column widths for A6 (compact)
    sheet.columns = [
        { width: 3 },   // Sr
        { width: 18 },  // Product
        { width: 3 },   // Cat
        { width: 4 },   // C
        { width: 4 },   // P
        { width: 6 },   // Rate
        { width: 8 }    // Amt
    ];

    // Styles
    const headerStyle = {
        font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } },
        alignment: { horizontal: 'center', vertical: 'middle' }
    };

    const subHeaderStyle = {
        font: { bold: true, size: 9 },
        alignment: { horizontal: 'center' }
    };

    const colHeaderStyle = {
        font: { bold: true, size: 8, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF444444' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    const cellStyle = {
        font: { size: 8 },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
        }
    };

    const totalStyle = {
        font: { bold: true, size: 10, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF27AE60' } },
        alignment: { horizontal: 'right', vertical: 'middle' },
        border: {
            top: { style: 'medium' },
            bottom: { style: 'medium' },
            left: { style: 'medium' },
            right: { style: 'medium' }
        }
    };

    let row = 1;

    // Store Header
    sheet.mergeCells(`A${row}:G${row}`);
    const headerCell = sheet.getCell(`A${row}`);
    headerCell.value = '📦 WHOLESALE STORE';
    headerCell.font = headerStyle.font;
    headerCell.fill = headerStyle.fill;
    headerCell.alignment = headerStyle.alignment;
    sheet.getRow(row).height = 22;
    row++;

    // Bill Info Row
    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = `Bill: ${billNumber}`;
    sheet.getCell(`A${row}`).font = { bold: true, size: 9 };
    sheet.mergeCells(`E${row}:G${row}`);
    sheet.getCell(`E${row}`).value = `${date} ${time}`;
    sheet.getCell(`E${row}`).font = { size: 8 };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    row++;

    // Separator
    sheet.mergeCells(`A${row}:G${row}`);
    sheet.getCell(`A${row}`).border = { bottom: { style: 'medium', color: { argb: 'FF667EEA' } } };
    sheet.getRow(row).height = 5;
    row++;

    // Column Headers
    const headers = ['#', 'Product', 'C', 'Cs', 'Pc', 'Rate', 'Amount'];
    headers.forEach((header, idx) => {
        const cell = sheet.getCell(row, idx + 1);
        cell.value = header;
        cell.font = colHeaderStyle.font;
        cell.fill = colHeaderStyle.fill;
        cell.alignment = colHeaderStyle.alignment;
        cell.border = colHeaderStyle.border;
    });
    sheet.getRow(row).height = 16;
    row++;

    // Items
    billItems.forEach((item, idx) => {
        const rowData = [item.sr, item.name, item.cat, item.cases, item.pcs, item.rate, item.amt.toFixed(2)];
        rowData.forEach((val, colIdx) => {
            const cell = sheet.getCell(row, colIdx + 1);
            cell.value = val;
            cell.font = cellStyle.font;
            cell.border = cellStyle.border;
            cell.alignment = colIdx === 1 ? { horizontal: 'left' } : { horizontal: 'center' };
            if (colIdx === 6) cell.alignment = { horizontal: 'right' };
        });
        // Alternate row color
        if (idx % 2 === 0) {
            for (let c = 1; c <= 7; c++) {
                sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            }
        }
        sheet.getRow(row).height = 14;
        row++;
    });

    // Separator before totals
    sheet.mergeCells(`A${row}:G${row}`);
    sheet.getCell(`A${row}`).border = { top: { style: 'medium', color: { argb: 'FF444444' } } };
    sheet.getRow(row).height = 3;
    row++;

    // Summary section
    const summaryBg = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
    
    // Subtotal
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`A${row}`).value = `Items: ${cart.length} | Cases: ${totalCases} | Pcs: ${totalPieces}`;
    sheet.getCell(`A${row}`).font = { size: 7, italic: true };
    sheet.getCell(`F${row}`).value = 'Subtotal:';
    sheet.getCell(`F${row}`).font = { bold: true, size: 8 };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).value = subtotal.toFixed(2);
    sheet.getCell(`G${row}`).font = { size: 8 };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    for (let c = 1; c <= 7; c++) sheet.getCell(row, c).fill = summaryBg;
    row++;

    // Discount
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`F${row}`).value = 'Disc 30%:';
    sheet.getCell(`F${row}`).font = { bold: true, size: 8, color: { argb: 'FFE74C3C' } };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).value = '-' + totalDiscount.toFixed(2);
    sheet.getCell(`G${row}`).font = { size: 8, color: { argb: 'FFE74C3C' } };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    for (let c = 1; c <= 7; c++) sheet.getCell(row, c).fill = summaryBg;
    row++;

    // Grand Total
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`A${row}`).value = 'Thank You!';
    sheet.getCell(`A${row}`).font = { bold: true, size: 9 };
    sheet.getCell(`A${row}`).alignment = { horizontal: 'center' };
    sheet.mergeCells(`F${row}:G${row}`);
    sheet.getCell(`F${row}`).value = '₹ ' + finalTotal.toFixed(2);
    sheet.getCell(`F${row}`).font = totalStyle.font;
    sheet.getCell(`F${row}`).fill = totalStyle.fill;
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`F${row}`).border = totalStyle.border;
    sheet.getRow(row).height = 20;
    row++;

    // Generate and download
    const fileName = `Bill_${billNumber}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    alert(`✅ Bill exported and saved to history!\n\n📄 ${fileName}\n💰 Total: ₹${finalTotal.toFixed(2)}\n📏 A6 size - Ready to print!`);

    // Clear cart
    cart = [];
    updateCart();
    saveCartToStorage();
    toggleCart();
}

// Render bill history
function renderHistory() {
    const historyList = document.getElementById('historyList');

    if (billHistory.length === 0) {
        historyList.innerHTML = '<div class="cart-empty">No bills saved yet</div>';
        return;
    }

    historyList.innerHTML = billHistory.map((bill, index) => `
        <div class="bill-card">
            <div class="bill-header">
                <span class="bill-number">${bill.billNumber}</span>
                <span class="bill-date">${bill.date}</span>
            </div>
            <div class="bill-items">
                ${bill.items.map(item => {
                    const qty = [];
                    if (item.cases > 0) qty.push(`${item.cases}C`);
                    if (item.pieces > 0) qty.push(`${item.pieces}P`);
                    return `<div class="bill-item-row">
                        <span>${item.name} (${item.category.charAt(0).toUpperCase()})</span>
                        <span>${qty.join('+')}</span>
                    </div>`;
                }).join('')}
            </div>
            <div class="bill-totals">
                <span>Items: ${bill.items.length}</span>
                <span class="bill-total-amount">₹${bill.finalTotal}</span>
            </div>
            <div class="bill-actions">
                <button class="view-bill-btn" onclick="viewBill(${index})">View Details</button>
                <button class="delete-bill-btn" onclick="deleteBill(${index})">Delete</button>
            </div>
        </div>
    `).join('') + `
        <button class="clear-history-btn" onclick="clearHistory()">Clear All History</button>
    `;
}

// View bill details
function viewBill(index) {
    const bill = billHistory[index];
    if (!bill) return;

    const modal = document.getElementById('billDetailModal');
    const overlay = document.getElementById('billDetailOverlay');
    const title = document.getElementById('billDetailTitle');
    const content = document.getElementById('billDetailContent');
    const exportBtn = document.getElementById('billDetailExportBtn');
    const deleteBtn = document.getElementById('billDetailDeleteBtn');

    title.textContent = `Bill Details: ${bill.billNumber}`;
    
    // Generate table HTML
    let tableHtml = `
        <div class="bill-meta" style="margin-bottom: 15px; color: #666;">
            <strong>Date:</strong> ${bill.date}
        </div>
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
                </tr>
            </thead>
            <tbody>
    `;

    bill.items.forEach(item => {
        const caseTotal = item.mrp * item.piecesPerCase;
        const discountedCaseTotal = caseTotal * 0.7;
        const perPiecePrice = item.mrp;
        const perPieceDiscounted = perPiecePrice * 0.7;

        const casesQty = item.cases || 0;
        const piecesQty = item.pieces || 0;

        const preDiscount = (caseTotal * casesQty) + (perPiecePrice * piecesQty);
        const discount = (caseTotal * 0.3 * casesQty) + (perPiecePrice * 0.3 * piecesQty);
        const itemTotal = (discountedCaseTotal * casesQty) + (perPieceDiscounted * piecesQty);

        const categoryAbbr = item.category.charAt(0).toUpperCase();

        tableHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${categoryAbbr}</td>
                <td>₹${item.mrp}</td>
                <td>${item.weight >= 1000 ? (item.weight/1000) + 'kg' : item.weight + 'g'}</td>
                <td>
                    ${casesQty > 0 ? casesQty + 'C' : ''} 
                    ${piecesQty > 0 ? piecesQty + 'P' : ''}
                </td>
                <td>₹${preDiscount.toFixed(2)}</td>
                <td>₹${discount.toFixed(2)}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${bill.subtotal}</span>
            </div>
            <div class="summary-row discount">
                <span>Discount (30%):</span>
                <span>-₹${bill.discount}</span>
            </div>
            <div class="summary-row total">
                <span>Final Total:</span>
                <span>₹${bill.finalTotal}</span>
            </div>
        </div>
    `;

    content.innerHTML = tableHtml;

    // Setup buttons
    exportBtn.onclick = () => exportSingleBill(index);
    deleteBtn.onclick = () => {
        deleteBill(index);
        closeBillDetailModal();
    };

    modal.classList.add('visible');
    overlay.classList.add('visible');
}

function closeBillDetailModal() {
    document.getElementById('billDetailModal').classList.remove('visible');
    document.getElementById('billDetailOverlay').classList.remove('visible');
}

async function exportSingleBill(index) {
    const bill = billHistory[index];
    if (!bill) return;

    // Reconstruct cart-like structure for export function
    // We can reuse the logic but we need to adapt it since exportToExcel uses global 'cart'
    // Instead, let's create a specific export function for history bills
    
    const billNumber = bill.billNumber;
    const dateObj = new Date(bill.date); // Parse date string back to object if possible, or just use current
    // Note: bill.date is a locale string, might be hard to parse exactly. 
    // For simplicity in this context, we'll use current date for file generation or try to parse.
    
    const date = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric'
    });
    const time = new Date().toLocaleTimeString('en-IN', { 
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    let totalCases = 0;
    let totalPieces = 0;

    const billItems = bill.items.map((item, idx) => {
        const casesQty = item.cases || 0;
        const piecesQty = item.pieces || 0;
        const caseTotal = item.mrp * item.piecesPerCase;
        const perPiecePrice = item.mrp;
        
        const preDiscount = (caseTotal * casesQty) + (perPiecePrice * piecesQty);
        const discount = preDiscount * 0.3;
        const itemTotal = preDiscount - discount;

        subtotal += preDiscount;
        totalDiscount += discount;
        totalCases += casesQty;
        totalPieces += piecesQty;

        return {
            sr: idx + 1,
            name: item.name.length > 18 ? item.name.substring(0, 16) + '..' : item.name,
            cat: item.category.charAt(0).toUpperCase(),
            cases: casesQty,
            pcs: piecesQty,
            rate: item.mrp,
            amt: itemTotal
        };
    });

    const finalTotal = subtotal - totalDiscount;

    // Create workbook with ExcelJS
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bill', {
        pageSetup: {
            paperSize: 11, // A5 (closest to A6)
            orientation: 'portrait',
            fitToPage: true,
            margins: {
                left: 0.2, right: 0.2,
                top: 0.2, bottom: 0.2,
                header: 0, footer: 0
            }
        }
    });

    // Column widths for A6 (compact)
    sheet.columns = [
        { width: 3 },   // Sr
        { width: 18 },  // Product
        { width: 3 },   // Cat
        { width: 4 },   // C
        { width: 4 },   // P
        { width: 6 },   // Rate
        { width: 8 }    // Amt
    ];

    // Styles (Same as before)
    const headerStyle = {
        font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667EEA' } },
        alignment: { horizontal: 'center', vertical: 'middle' }
    };

    const colHeaderStyle = {
        font: { bold: true, size: 8, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF444444' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
        }
    };

    const cellStyle = {
        font: { size: 8 },
        alignment: { horizontal: 'left', vertical: 'middle' },
        border: {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
        }
    };

    const totalStyle = {
        font: { bold: true, size: 10, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF27AE60' } },
        alignment: { horizontal: 'right', vertical: 'middle' },
        border: {
            top: { style: 'medium' },
            bottom: { style: 'medium' },
            left: { style: 'medium' },
            right: { style: 'medium' }
        }
    };

    let row = 1;

    // Store Header
    sheet.mergeCells(`A${row}:G${row}`);
    const headerCell = sheet.getCell(`A${row}`);
    headerCell.value = '📦 WHOLESALE STORE';
    headerCell.font = headerStyle.font;
    headerCell.fill = headerStyle.fill;
    headerCell.alignment = headerStyle.alignment;
    sheet.getRow(row).height = 22;
    row++;

    // Bill Info Row
    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = `Bill: ${billNumber}`;
    sheet.getCell(`A${row}`).font = { bold: true, size: 9 };
    sheet.mergeCells(`E${row}:G${row}`);
    sheet.getCell(`E${row}`).value = `${date} ${time}`;
    sheet.getCell(`E${row}`).font = { size: 8 };
    sheet.getCell(`E${row}`).alignment = { horizontal: 'right' };
    row++;

    // Separator
    sheet.mergeCells(`A${row}:G${row}`);
    sheet.getCell(`A${row}`).border = { bottom: { style: 'medium', color: { argb: 'FF667EEA' } } };
    sheet.getRow(row).height = 5;
    row++;

    // Column Headers
    const headers = ['#', 'Product', 'C', 'Cs', 'Pc', 'Rate', 'Amount'];
    headers.forEach((header, idx) => {
        const cell = sheet.getCell(row, idx + 1);
        cell.value = header;
        cell.font = colHeaderStyle.font;
        cell.fill = colHeaderStyle.fill;
        cell.alignment = colHeaderStyle.alignment;
        cell.border = colHeaderStyle.border;
    });
    sheet.getRow(row).height = 16;
    row++;

    // Items
    billItems.forEach((item, idx) => {
        const rowData = [item.sr, item.name, item.cat, item.cases, item.pcs, item.rate, item.amt.toFixed(2)];
        rowData.forEach((val, colIdx) => {
            const cell = sheet.getCell(row, colIdx + 1);
            cell.value = val;
            cell.font = cellStyle.font;
            cell.border = cellStyle.border;
            cell.alignment = colIdx === 1 ? { horizontal: 'left' } : { horizontal: 'center' };
            if (colIdx === 6) cell.alignment = { horizontal: 'right' };
        });
        // Alternate row color
        if (idx % 2 === 0) {
            for (let c = 1; c <= 7; c++) {
                sheet.getCell(row, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            }
        }
        sheet.getRow(row).height = 14;
        row++;
    });

    // Separator before totals
    sheet.mergeCells(`A${row}:G${row}`);
    sheet.getCell(`A${row}`).border = { top: { style: 'medium', color: { argb: 'FF444444' } } };
    sheet.getRow(row).height = 3;
    row++;

    // Summary section
    const summaryBg = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
    
    // Subtotal
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`A${row}`).value = `Items: ${bill.items.length} | Cases: ${totalCases} | Pcs: ${totalPieces}`;
    sheet.getCell(`A${row}`).font = { size: 7, italic: true };
    sheet.getCell(`F${row}`).value = 'Subtotal:';
    sheet.getCell(`F${row}`).font = { bold: true, size: 8 };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).value = subtotal.toFixed(2);
    sheet.getCell(`G${row}`).font = { size: 8 };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    for (let c = 1; c <= 7; c++) sheet.getCell(row, c).fill = summaryBg;
    row++;

    // Discount
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`F${row}`).value = 'Disc 30%:';
    sheet.getCell(`F${row}`).font = { bold: true, size: 8, color: { argb: 'FFE74C3C' } };
    sheet.getCell(`F${row}`).alignment = { horizontal: 'right' };
    sheet.getCell(`G${row}`).value = '-' + totalDiscount.toFixed(2);
    sheet.getCell(`G${row}`).font = { size: 8, color: { argb: 'FFE74C3C' } };
    sheet.getCell(`G${row}`).alignment = { horizontal: 'right' };
    for (let c = 1; c <= 7; c++) sheet.getCell(row, c).fill = summaryBg;
    row++;

    // Grand Total
    sheet.mergeCells(`A${row}:E${row}`);
    sheet.getCell(`A${row}`).value = 'Thank You!';
    sheet.getCell(`A${row}`).font = { bold: true, size: 9 };
    sheet.getCell(`A${row}`).alignment = { horizontal: 'center' };
    sheet.mergeCells(`F${row}:G${row}`);
    sheet.getCell(`F${row}`).value = '₹ ' + finalTotal.toFixed(2);
    sheet.getCell(`F${row}`).font = totalStyle.font;
    sheet.getCell(`F${row}`).fill = totalStyle.fill;
    sheet.getCell(`F${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getCell(`F${row}`).border = totalStyle.border;
    sheet.getRow(row).height = 20;
    row++;

    // Generate and download
    const fileName = `Bill_${billNumber}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    alert(`✅ Bill exported!\n\n📄 ${fileName}\n💰 Total: ₹${finalTotal.toFixed(2)}\n📏 A6 size - Ready to print!`);
}

// Delete a bill
function deleteBill(index) {
    if (confirm('Are you sure you want to delete this bill?')) {
        billHistory.splice(index, 1);
        localStorage.setItem('billHistory', JSON.stringify(billHistory));
        renderHistory();
    }
}

// Clear all history
function clearHistory() {
    if (billHistory.length === 0) {
        alert('History is already empty');
        return;
    }

    if (confirm('Are you sure you want to delete ALL bill history? This cannot be undone.')) {
        billHistory = [];
        localStorage.setItem('billHistory', JSON.stringify(billHistory));
        renderHistory();
    }
}

// Toggle history visibility
function toggleHistory() {
    const historySection = document.getElementById('historySection');
    const historyOverlay = document.getElementById('historyOverlay');

    historySection.classList.toggle('visible');
    historyOverlay.classList.toggle('visible');
}

// Product Management Functions

function openAddModal() {
    document.getElementById('productModal').classList.add('visible');
    document.getElementById('productModalOverlay').classList.add('visible');
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('deleteProductBtn').style.display = 'none';
}

function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productModal').classList.add('visible');
    document.getElementById('productModalOverlay').classList.add('visible');
    document.getElementById('modalTitle').textContent = 'Edit Product';
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editMrp').value = product.mrp;
    document.getElementById('editWeight').value = product.weight;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editPieces').value = product.piecesPerCase;
    
    document.getElementById('deleteProductBtn').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('visible');
    document.getElementById('productModalOverlay').classList.remove('visible');
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editName').value;
    const mrp = parseFloat(document.getElementById('editMrp').value);
    const weight = parseFloat(document.getElementById('editWeight').value);
    const category = document.getElementById('editCategory').value;
    const piecesPerCase = parseInt(document.getElementById('editPieces').value);

    if (id) {
        // Edit existing
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                mrp,
                weight,
                category,
                piecesPerCase
            };
        }
    } else {
        // Add new
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.unshift({
            id: newId,
            name,
            mrp,
            weight,
            category,
            piecesPerCase
        });
    }

    saveProductsToStorage();
    
    // Update filtered products if search is active, otherwise reset
    searchProducts();
    
    closeProductModal();
    alert(id ? 'Product updated successfully!' : 'Product added successfully!');
}

function deleteCurrentProduct() {
    const id = document.getElementById('editProductId').value;
    if (!id) return;

    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products.splice(index, 1);
            saveProductsToStorage();
            searchProducts();
            closeProductModal();
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
