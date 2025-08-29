// Données des produits (simulées)
const products = [
    {
        id: 1,
        name: "Smartphone Galaxy X",
        price: 150000,
        category: "smartphone",
        image: "./assets/galaxy.png",
        featured: true
    },
    {
        id: 2,
        name: "Laptop Pro 15\"",
        price: 450000,
        category: "laptop",
        image: "./assets/laptop.jpg",
        featured: true
    },
    {
        id: 3,
        name: "Écouteurs Sans Fil",
        price: 35000,
        category: "accessory",
        image: "./assets/ecouteur.jpg",
        featured: true
    },
    {
        id: 4,
        name: "Smartphone Budget",
        price: 80000,
        category: "smartphone",
        image: "./assets/smarthom.jpeg",
        featured: false
    },
    {
        id: 5,
        name: "Tablette Lite",
        price: 120000,
        category: "tablet",
        image: "./assets/tablettelite.jpeg",
        featured: false
    },
    {
        id: 6,
        name: "Montre Connectée",
        price: 60000,
        category: "accessory",
        image: "./assets/connecté.jpeg",
        featured: false
    },
    {
        id: 7,
        name: "Installation Domotique",
        price: 200000,
        category: "service",
        image: "./assets/installationhom.jpeg",
        featured: true
    },
    {
        id: 8,
        name: "Maintenance Informatique",
        price: 50000,
        category: "service",
        image: "./assets/maintenance.png",
        featured: false
    }
];

// Panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Éléments DOM
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.querySelector('nav ul');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Charger les produits sur la page d'accueil
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    
    // Charger les produits sur la page catalogue
    if (document.getElementById('catalogue-products')) {
        loadCatalogueProducts();
        setupFilters();
    }
    
    // Configurer la galerie
    if (document.querySelector('.gallery-filters')) {
        setupGalleryFilters();
    }
    
    // Configurer le formulaire de contact
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    
    // Configurer le menu mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Initialiser les animations au défilement
    initScrollAnimations();
});

// Fonctions du panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    showAddedToCartMessage(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        cartTotalAmount.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} FCFA</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-from-cart" onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
    
    cartTotalAmount.textContent = formatPrice(total);
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

function showAddedToCartMessage(productName) {
    // Créer un élément de message toast
    const toast = document.createElement('div');
    toast.classList.add('toast-message');
    toast.textContent = `${productName} ajouté au panier`;
    
    document.body.appendChild(toast);
    
    // Animation d'entrée
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Gestion de l'interface du panier
if (cartIcon && closeCart && overlay) {
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
}

function openCart() {
    renderCartItems();
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Chargement des produits
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productElement = createProductElement(product);
        featuredProductsContainer.appendChild(productElement);
    });
}

function loadCatalogueProducts() {
    const catalogueProductsContainer = document.getElementById('catalogue-products');
    if (!catalogueProductsContainer) return;
    
    catalogueProductsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = createProductElement(product);
        catalogueProductsContainer.appendChild(productElement);
    });
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product-card', 'fade-in');
    
    productElement.innerHTML = `
        <div class="product-image" style="background-image: url('${product.image}');">
            <img src="${product.image}" alt="${product.name}" style="display: none;">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)} FCFA</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Ajouter au panier</button>
        </div>
    `;
    
    return productElement;
}

// Filtres du catalogue
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const searchInput = document.getElementById('search-input');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function filterProducts() {
    const categoryValue = document.getElementById('category-filter').value;
    const priceValue = document.getElementById('price-filter').value;
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    
    const filteredProducts = products.filter(product => {
        // Filtre par catégorie
        if (categoryValue !== 'all' && product.category !== categoryValue) {
            return false;
        }
        
        // Filtre par prix
        if (priceValue !== 'all') {
            let minPrice, maxPrice;
            
            switch(priceValue) {
                case '0-50000':
                    minPrice = 0;
                    maxPrice = 50000;
                    break;
                case '50000-150000':
                    minPrice = 50000;
                    maxPrice = 150000;
                    break;
                case '150000-300000':
                    minPrice = 150000;
                    maxPrice = 300000;
                    break;
                case '300000+':
                    minPrice = 300000;
                    maxPrice = Infinity;
                    break;
            }
            
            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }
        }
        
        // Filtre par recherche
        if (searchValue && !product.name.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        return true;
    });
    
    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(filteredProducts) {
    const catalogueProductsContainer = document.getElementById('catalogue-products');
    if (!catalogueProductsContainer) return;
    
    catalogueProductsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        catalogueProductsContainer.innerHTML = '<p class="no-products">Aucun produit ne correspond à vos critères</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productElement = createProductElement(product);
        catalogueProductsContainer.appendChild(productElement);
    });
}

// Filtres de la galerie
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les éléments de la galerie
            const filterValue = this.getAttribute('data-filter');
            filterGalleryItems(filterValue);
        });
    });
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filter === 'all' || filter === itemCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Formulaire de contact
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Ici, vous enverriez normalement ces données à un serveur
            // Pour cet exemple, nous allons simplement afficher un message de confirmation
            
            alert(`Merci ${name} pour votre message! Nous vous répondrons à ${email} sous peu.`);
            contactForm.reset();
        });
    }
}

// Menu mobile
function toggleMobileMenu() {
    if (navMenu) {
        navMenu.classList.toggle('show');
    }
}

// Navigation fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Ajuster pour l'en-tête fixe
                behavior: 'smooth'
            });
        }
    });
});

// Animation au défilement
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}