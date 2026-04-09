/*Inicial*/ 
fetch("http://18.216.4.55:8000/products")
  .then(res => res.json())
  .then(data => {
    const cont = document.getElementById("productos");

    // mostramos los últimos 4 productos (tipo "new")
    const latest = data.slice(-4);

    latest.forEach(p => {
      cont.innerHTML += `
        <div class="card">
          <img src="${p.image_url}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p class="price">$${p.price}</p>
        </div>
      `;
    });
  });

/*General*/ 
const API = "http://18.216.4.55:8000/products";

let productosGlobal = [];
let editId = null;

function abrirModal() {
  document.getElementById("modal").style.display = "flex";

  document.getElementById("formProducto").reset();
  document.getElementById("tituloModal").innerText = "Agregar producto";
  document.getElementById("btnGuardar").innerText = "Agregar producto";

  editId = null;
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

// Productos Registrados
function cargarProductos() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      const categoriaActual = document.body.dataset.category;

      productosGlobal = data.filter(p => p.category === categoriaActual);

      mostrarProductos(productosGlobal); // 🔥 ESTO FALTABA
    });
}

function mostrarProductos(lista) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";

  lista.forEach(p => {

    let precioFinal = p.price;
    let tieneDescuento = p.discount && p.discount > 0;

    if (tieneDescuento) {
      precioFinal = p.price - (p.price * p.discount / 100);
    }

    cont.innerHTML += `
      <div class="card">

        ${tieneDescuento ? `<div class="badge">-${p.discount}%</div>` : ""}

        <img src="${p.image_url}">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>

        ${
          tieneDescuento
            ? `
              <p class="old-price">$${p.price}</p>
              <p class="price">$${precioFinal.toFixed(2)}</p>
            `
            : `<p class="price">$${p.price}</p>`
        }

        <p>Stock: ${p.stock}</p>

        <div class="acciones">
          <button onclick="editar(${p.id})">✏️</button>
          <button onclick="eliminar(${p.id})">🗑️</button>
        </div>

      </div>
    `;
  });
}

// Buscar
document.getElementById("search").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();

  const filtrados = productosGlobal.filter(p =>
    p.name.toLowerCase().includes(texto)
  );

  mostrarProductos(filtrados);
});

// Crear o Actualizar
function guardarProducto(e) {
  e.preventDefault();

  const categoriaActual = document.body.dataset.category; // ✅ AQUÍ VA

  const data = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    discount: parseInt(document.getElementById("discount").value) || 0,
    stock: parseInt(document.getElementById("stock").value),
    category: categoriaActual, // ✅ FIX
    image_url: document.getElementById("image_url").value
  };

  if (editId) {
    fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(() => {
      cerrarModal();
      cargarProductos();
    });
  } else {
    fetch(API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    }).then(() => {
      cerrarModal();
      cargarProductos();
    });
  }
}

// Editar
function editar(id) {
  const p = productosGlobal.find(x => x.id === id);

  abrirModal();

  document.getElementById("tituloModal").innerText = "Editar producto";
  document.getElementById("btnGuardar").innerText = "Actualizar producto";

  document.getElementById("name").value = p.name;
  document.getElementById("description").value = p.description;
  document.getElementById("price").value = p.price;
  document.getElementById("discount").value = p.discount || 0;
  document.getElementById("stock").value = p.stock;
  document.getElementById("image_url").value = p.image_url;

  editId = id;
}

// Eliminar
function eliminar(id) {
  if (confirm("¿Eliminar producto?")) {
    fetch(`${API}/${id}`, {
      method: "DELETE"
    }).then(() => cargarProductos());
  }
}


document.getElementById("formProducto")
  .addEventListener("submit", guardarProducto);

cargarProductos();