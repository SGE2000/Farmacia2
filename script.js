// ============================================
// DATOS DE PRODUCTOS CON CATEGORÍAS
// ============================================

const productos = [
    { codigo: "405227.5", descripcion: "PACK SUBLIME 40 DIA + NOCHE PHARMA B. AURORA", precio: "38,50 €", categoria: "dermocosmetic" },
    { codigo: "008565", descripcion: "PROMO 365 DIAS SESDERMA", precio: "36,46 €", categoria: "promo" },
    { codigo: "000032", descripcion: "PROMO PREMIUM NAV 2024", precio: "77,40 €", categoria: "promo" },
    { codigo: "207530.6", descripcion: "DRYSES DESODORANTE ANTITRANSPIRANTE MUJER 1 ROLL ON 75 ML", precio: "12,45 €", categoria: "dermocosmetic" },
    { codigo: "657552.9", descripcion: "PROMOCION DUPLO SESDERMA DRYSES MEN", precio: "12,50 €", categoria: "promo" },
    { codigo: "217611.9", descripcion: "PENFERULAC CREMA 50ML SESDERMA", precio: "56,27 €", categoria: "dermocosmetic" },
    { codigo: "256859.4", descripcion: "ACGLICOLIC CLASSIC FORTE CREMA GEL HIDRATANTE 1 ENVASE 50 ML", precio: "39,98 €", categoria: "dermocosmetic" },
    { codigo: "192519.0", descripcion: "SUBLIME CONT OJO ANTIEDAD 15ML", precio: "23,27 €", categoria: "dermocosmetic" },
    { codigo: "153901.4", descripcion: "BE+ LECHE LIMPIADORA LIMPIEZA FACIAL 1 ENVASE 200 ML", precio: "16,98 €", categoria: "dermocosmetic" },
    { codigo: "213164.4", descripcion: "INDIBA SERUM ILUMINADOR CON EFECTO LIFTING 30ML", precio: "61,65 €", categoria: "dermocosmetic" },
    { codigo: "213168.2", descripcion: "INDIBA CREMA EFECTI LIPOFILLING 50ML", precio: "61,65 €", categoria: "dermocosmetic" },
    { codigo: "842064.3", descripcion: "CAMALEON STICK SOLAR SPF50", precio: "16,14 €", categoria: "pharmacy" },
    { codigo: "209041.5", descripcion: "SALISES CREMA ESPUMOSA SIN JABON 1 ENVASE 250 ML", precio: "17,99 €", categoria: "dermocosmetic" },
    { codigo: "306274.9", descripcion: "SEBOVALIS CHAMPU 1 ENVASE 200 ML", precio: "18,77 €", categoria: "dermocosmetic" }
];

// ============================================
// VARIABLES GLOBALES
// ============================================

let productosFiltrados = [...productos];
let ordenActual = { columna: "descripcion", direccion: "asc" };
let filtroActual = "all";
let vistaActual = "grid";
let animacionesEjecutadas = new Set();

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

/**
 * Inicializa la página cuando el DOM está completamente cargado
 */
function init() {
    // Preloader
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('fade-out');
        setTimeout(() => {
            document.querySelector('.preloader').style.display = 'none';
        }, 500);
    }, 1000);
    
    // Cargar productos
    cargarProductos();
    
    // Configurar funcionalidades
    configurarBusqueda();
    configurarFiltros();
    configurarOrdenamiento();
    configurarVista();
    configurarMenuMovil();
    configurarScroll();
    configurarAnimaciones();
    configurarBotonesFlotantes();
    
    // Eventos adicionales
    configurarEventos();
    
    console.log("Farmacia Alcubilla - Página web cargada correctamente");
    console.log(`${productos.length} productos cargados`);
}

/**
 * Carga los productos en la vista actual
 */
function cargarProductos() {
    const gridContainer = document.getElementById("productsGrid");
    const tableBody = document.getElementById("productsTableBody");
    
    // Limpiar contenedores
    gridContainer.innerHTML = "";
    tableBody.innerHTML = "";
    
    // Actualizar contador de resultados
    document.getElementById("resultsCount").textContent = productosFiltrados.length;
    
    // Si no hay productos
    if (productosFiltrados.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-medium); margin-bottom: 1rem;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o cambia el filtro</p>
            </div>
        `;
        
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 2rem; color: var(--gray-medium); margin-bottom: 1rem;"></i>
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Cargar productos en grid
    productosFiltrados.forEach(producto => {
        const categoriaClase = producto.categoria || "pharmacy";
        const categoriaNombre = obtenerNombreCategoria(producto.categoria);
        
        const card = document.createElement("div");
        card.className = `product-card-grid ${categoriaClase}`;
        card.innerHTML = `
            <div class="product-card-header">
                <div class="product-code">${producto.codigo}</div>
                <div class="product-price">${producto.precio}</div>
            </div>
            <div class="product-card-body">
                <div class="product-description">${producto.descripcion}</div>
                <span class="product-category">${categoriaNombre}</span>
            </div>
        `;
        gridContainer.appendChild(card);
    });
    
    // Cargar productos en tabla
    productosFiltrados.forEach(producto => {
        const categoriaNombre = obtenerNombreCategoria(producto.categoria);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio}</td>
            <td>${categoriaNombre}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Mostrar/ocultar vistas según selección
    actualizarVista();
}

/**
 * Obtiene el nombre legible de la categoría
 */
function obtenerNombreCategoria(codigo) {
    const categorias = {
        "dermocosmetic": "Dermocosmética",
        "pharmacy": "Farmacia",
        "promo": "Promoción"
    };
    return categorias[codigo] || "General";
}

/**
 * Configura la funcionalidad de búsqueda
 */
function configurarBusqueda() {
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearch");
    
    searchInput.addEventListener("input", function() {
        const termino = this.value.toLowerCase().trim();
        
        clearSearchBtn.style.display = termino.length > 0 ? "block" : "none";
        
        productosFiltrados = productos.filter(producto => {
            if (filtroActual !== "all" && producto.categoria !== filtroActual) {
                return false;
            }
            
            return producto.codigo.toLowerCase().includes(termino) || 
                   producto.descripcion.toLowerCase().includes(termino);
        });
        
        aplicarOrdenamiento();
        cargarProductos();
    });
    
    clearSearchBtn.addEventListener("click", function() {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        productosFiltrados = [...productos].filter(p => 
            filtroActual === "all" || p.categoria === filtroActual
        );
        aplicarOrdenamiento();
        cargarProductos();
        searchInput.focus();
    });
}

/**
 * Configura los filtros por categoría
 */
function configurarFiltros() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Aplicar filtro
            filtroActual = this.dataset.filter;
            const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
            
            productosFiltrados = productos.filter(producto => {
                const coincideFiltro = filtroActual === "all" || producto.categoria === filtroActual;
                const coincideBusqueda = producto.codigo.toLowerCase().includes(searchTerm) || 
                                        producto.descripcion.toLowerCase().includes(searchTerm);
                
                return coincideFiltro && coincideBusqueda;
            });
            
            aplicarOrdenamiento();
            cargarProductos();
        });
    });
}

/**
 * Configura el ordenamiento de productos
 */
function configurarOrdenamiento() {
    const headers = document.querySelectorAll(".products-table th[data-sort]");
    
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const columna = this.getAttribute("data-sort");
            
            if (ordenActual.columna === columna) {
                ordenActual.direccion = ordenActual.direccion === "asc" ? "desc" : "asc";
            } else {
                ordenActual.columna = columna;
                ordenActual.direccion = "asc";
            }
            
            actualizarIndicadoresOrdenamiento(columna, ordenActual.direccion);
            aplicarOrdenamiento();
            cargarProductos();
        });
    });
}

/**
 * Aplica el ordenamiento actual
 */
function aplicarOrdenamiento() {
    productosFiltrados.sort((a, b) => {
        let valorA, valorB;
        
        switch (ordenActual.columna) {
            case "code":
                valorA = a.codigo;
                valorB = b.codigo;
                break;
            case "price":
                valorA = parseFloat(a.precio.replace("€", "").replace(",", ".").trim());
                valorB = parseFloat(b.precio.replace("€", "").replace(",", ".").trim());
                break;
            case "category":
                valorA = a.categoria;
                valorB = b.categoria;
                break;
            case "description":
            default:
                valorA = a.descripcion.toLowerCase();
                valorB = b.descripcion.toLowerCase();
                break;
        }
        
        if (valorA < valorB) return ordenActual.direccion === "asc" ? -1 : 1;
        if (valorA > valorB) return ordenActual.direccion === "asc" ? 1 : -1;
        return 0;
    });
}

/**
 * Actualiza los indicadores de ordenamiento
 */
function actualizarIndicadoresOrdenamiento(columnaActiva, direccion) {
    const headers = document.querySelectorAll(".products-table th[data-sort]");
    
    headers.forEach(header => {
        const icon = header.querySelector("i");
        const columna = header.getAttribute("data-sort");
        
        header.classList.remove("active");
        if (icon) icon.className = "fas fa-sort";
        
        if (columna === columnaActiva) {
            header.classList.add("active");
            if (icon) {
                icon.className = direccion === "asc" ? "fas fa-sort-down" : "fas fa-sort-up";
            }
        }
    });
}

/**
 * Configura el toggle entre vista grid y lista
 */
function configurarVista() {
    const viewButtons = document.querySelectorAll(".view-btn");
    
    viewButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Actualizar botones activos
            viewButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Cambiar vista
            vistaActual = this.dataset.view;
            actualizarVista();
        });
    });
}

/**
 * Actualiza la vista visible (grid o tabla)
 */
function actualizarVista() {
    const gridContainer = document.getElementById("productsGrid");
    const tableContainer = document.querySelector(".table-container");
    
    if (vistaActual === "grid") {
        gridContainer.style.display = "grid";
        tableContainer.style.display = "none";
    } else {
        gridContainer.style.display = "none";
        tableContainer.style.display = "block";
    }
}

/**
 * Configura el menú móvil
 */
function configurarMenuMovil() {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function() {
            this.classList.toggle("active");
            nav.classList.toggle("active");
            document.body.style.overflow = nav.classList.contains("active") ? "hidden" : "";
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                nav.classList.remove("active");
                document.body.style.overflow = "";
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", function(event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                menuToggle.classList.remove("active");
                nav.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }
}

/**
 * Configura efectos de scroll
 */
function configurarScroll() {
    // Header al hacer scroll
    window.addEventListener("scroll", function() {
        const header = document.querySelector(".header");
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Botón volver arriba
        const backToTop = document.querySelector(".back-to-top");
        if (scrollTop > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
        
        // Actualizar enlace activo en navegación
        actualizarNavegacionActiva();
    });
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });
}

/**
 * Actualiza el enlace activo en la navegación
 */
function actualizarNavegacionActiva() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    
    let currentSection = "";
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute("id");
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

/**
 * Configura animaciones al hacer scroll
 */
function configurarAnimaciones() {
    // Observador de intersección para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animacionesEjecutadas.has(entry.target)) {
                const animation = entry.target.getAttribute("data-animation");
                
                if (animation) {
                    entry.target.classList.add("animate__animated", `animate__${animation}`);
                    animacionesEjecutadas.add(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos con animaciones
    document.querySelectorAll("[data-animation]").forEach(el => observer.observe(el));
}

/**
 * Configura botones flotantes
 */
function configurarBotonesFlotantes() {
    // Botón volver arriba
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

/**
 * Configura eventos adicionales
 */
function configurarEventos() {
    // Efecto hover en tarjetas de producto
    document.addEventListener("mouseover", function(e) {
        if (e.target.closest(".product-card-grid")) {
            const card = e.target.closest(".product-card-grid");
            card.style.transform = "translateY(-5px)";
        }
    });
    
    document.addEventListener("mouseout", function(e) {
        if (e.target.closest(".product-card-grid")) {
            const card = e.target.closest(".product-card-grid");
            card.style.transform = "translateY(0)";
        }
    });
    
    // Actualizar año en copyright
    const yearElement = document.querySelector(".copyright");
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace("2024", currentYear);
    }
    
    // Efecto de escritura en título (opcional)
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && window.innerWidth > 768) {
        const text = heroTitle.textContent;
        heroTitle.textContent = "";
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Iniciar después de 1.5 segundos
        setTimeout(typeWriter, 1500);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", init);