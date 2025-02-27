// Función para ocultar la animación de bienvenida
function hideWelcomeLoader() {
    var welcomeLoader = document.getElementById('welcome-loader');
    welcomeLoader.style.display = 'none'; // Ocultar la animación de bienvenida
}

  // Ejecutamos la función cuando la página haya cargado completamente
window.addEventListener('load', function() {
    // Esperamos 4 segundos para que la animación de bienvenida se complete
    setTimeout(hideWelcomeLoader, 700); // El tiempo puede ser ajustado (0.7s = 0.7 segundos)
});


















// EVITAR CLICK DERECHO EN TODA LA PÁGINA
document.addEventListener('contextmenu', (e) => e.preventDefault());

// RESTRINGIR TODOS LOS TIPOS DE ZOOM EN MÓVILES
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {

    // Evitar el gesto de pinza para hacer zoom
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault(); // Bloquea zoom de pinza
        }
    }, { passive: false });

    // Evitar zoom en doble toque
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault(); // Bloquea zoom en doble toque
        }
        lastTouchEnd = now;
    }, false);
}

// EVITAR ZOOM AUTOMÁTICO EN CAMPOS DE TEXTO EN MÓVILES
document.querySelectorAll('input, textarea, select').forEach((element) => {
    element.addEventListener('focus', () => {
        document.body.style.zoom = '100%'; // Previene el zoom en campos de entrada
    });
    element.addEventListener('blur', () => {
        document.body.style.zoom = ''; // Restaura el estilo de zoom después
    });
});

// RESTRINGIR ZOOM GLOBAL A TRAVÉS DE META TAGS
const metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
document.head.appendChild(metaTag);

// RESTRINGIR ZOOM EN NAVEGADORES DE ESCRITORIO
// Evitar zoom con teclado (Ctrl/Cmd + "+" o "-" o "0")
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '0')) {
        event.preventDefault(); // Bloquea zoom con teclado
    }
});

// Evitar zoom con rueda del ratón (Ctrl/Cmd + Scroll)
document.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) {
        event.preventDefault(); // Bloquea zoom con scroll
    }
}, { passive: false });











// FUNCIÓN PARA FORMATEAR LOS NÚMEROS CON PUNTOS
function formatNumber(number) {
    return number.toLocaleString('es-CO');
}







// FUNCIÓN PARA CARGAR LOS PRODUCTOS DEL CARRITO
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    // LIMPIAR LA LISTA DE PRODUCTOS EN EL CARRITO
    cartItemsList.innerHTML = '';

    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
        const imageUrl = 'img/iconos/carrito.png';
        cartItemsList.innerHTML = `
        <img src="${imageUrl}" alt="Imagen sin productos" id=carritoimagen>
        <p>No hay productos en tu carrito.</p>`;
    } else {
        // MOSTRAR PRODUCTOS DEL CARRITO
        cartItems.forEach((product, index) => {
            const price = isNaN(parseFloat(product.price)) ? 0 : parseFloat(product.price);
            const quantity = isNaN(parseInt(product.quantity)) ? 0 : parseInt(product.quantity);
            const subtotal = price * quantity; // Calcular el subtotal del producto
            const imageUrl = product.image || 'img/Productos/default.jpg'; // Imagen alternativa

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div id="contenedordeimagencarrito">
                    <img src="${imageUrl}" alt="${product.name}" class="cart-product-image"> <!-- Imagen del producto -->
                </div>
                <div id="nombre_precio_intrucciones">
                    <!-- Información del producto -->
                    <p><strong>${product.name} - $${formatNumber(price)}</strong></p>
                    <p><strong>Cantidad: </strong>${quantity}</p>
                    <p><strong>Indicaciones: <strong>${product.instructions || ''}</p>
                </div>
                
                <!-- Contenedor de acciones -->
                <div class="action-container">
                    <img id="basura" src="img/iconos/basura.png" alt="Eliminar" onclick="removeItem(${index})">
                    <div class="subtotal-popup">
                        <p>$${formatNumber(subtotal)}</p>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(itemElement);

            // Sumar el subtotal al total general
            total += subtotal;
        });
    }

    // MOSTRAR EL TOTAL CON FORMATO DE PUNTOS DE MIL
    cartTotal.innerText = `Total: $${formatNumber(total)}`;

    // Guardar el total en localStorage
    localStorage.setItem('totalCarrito', total);
}


// FUNCIÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO
function removeItem(index) {
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
// Eliminar el producto en la posición indicada
cartItems.splice(index, 1);

// Guardar de nuevo el carrito en el localStorage
localStorage.setItem('cart', JSON.stringify(cartItems));
    
// Recargar el carrito
loadCart();}

// FUNCIÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO CON (ANIMACIÓN)
function removeItem(index) {
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Obtener el elemento del producto específico
const cartItemsList = document.getElementById('cart-items-list');
const itemElement = cartItemsList.children[index];

// Añadir la clase de animación
itemElement.classList.add('fade-out');

// Esperar a que termine la animación (0.5s) y luego eliminar el elemento
setTimeout(() => {
// Eliminar el producto en la posición indicada
cartItems.splice(index, 1);

// Guardar de nuevo el carrito en el localStorage
localStorage.setItem('cart', JSON.stringify(cartItems));

// Recargar el carrito
loadCart();
}, 500); // Tiempo que dura la animación
}














// FUNCIÓN PARA VERIFICAR SI EL CARRITO ESTÁ LLENO Y TAMBIÉN INSERTAR EL MÉTODO DE PAGO (ABRE EL MODAL)
function openModal() {
const metodoPago = document.getElementById('opcionesPago').value; // Obtener el valor del select de pago
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Verificar si el carrito está vacío
if (cartItems.length === 0) {
alert("Tu carrito está vacío. Agrega productos antes de proceder.");
return; // Evita abrir el modal si el carrito está vacío
}

// Verificar si no se ha seleccionado un método de pago
if (!metodoPago) {
alert("Por favor, selecciona un método de pago antes de continuar.");
return; // Evita abrir el modal si no se seleccionó un método de pago
} 

// Si todo está bien, abrir el modal
document.getElementById('payment-modal').style.display = 'flex'; // Mostrar el modal
}

// FUNCIÓN PARA GUARDAR EL MÉTODO DE PAGO EN LOCALSTORAGE
document.getElementById('opcionesPago').addEventListener('change', function() {
const metodoPago = this.value;
localStorage.setItem('metodoPago', metodoPago);  // Guardar el método de pago
});

// FUNCIÓN PARA CERRAR EL MODAL CON EL BOTÓN CANCELAR
function closeModal() {
document.getElementById('payment-modal').style.display = 'none'; // Ocultar el modal
}







// Función para abrir el modal de datos personales cuando se hace clic en "Recoger en Tienda"
function abrirModaldatospersonales() {
    // Recuperar los datos del localStorage
    const nombreGuardado = localStorage.getItem('nombre');
    const telefonoGuardado = localStorage.getItem('telefono');

    // Mostrar los datos guardados en los campos del formulario si existen
    if (nombreGuardado) {
        document.getElementById('nombre').value = nombreGuardado;
    }
    if (telefonoGuardado) {
        document.getElementById('telefono').value = telefonoGuardado;
    }

    document.getElementById('datospersonales').classList.add('active');
}

// Función para cerrar el modal de datos personales
function cerrarModaldatospersonales() {
    document.getElementById('datospersonales').classList.remove('active');
}

// Validación que solo sea nombre y no números
const inputNombre = document.getElementById('nombre');
inputNombre.addEventListener('input', () => {
    // Validar si solo hay letras y espacios
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    // Si el texto contiene caracteres no permitidos, los eliminamos
    inputNombre.value = inputNombre.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});

// Validación de teléfono (máximo 10 dígitos)
function validarTelefono() {
    const telefono = document.getElementById("telefono");
    telefono.value = telefono.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    if (telefono.value.length > 10) {
        telefono.value = telefono.value.substring(0, 10); // Limitar a 10 caracteres
    }
}

// Función para manejar la validación y enviar mensaje de WhatsApp si los datos son válidos
function aceptarModaldatos() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Validar que ambos campos estén llenos y que el teléfono tenga 10 dígitos
    if (nombre && telefono.length === 10) {
        // Guardar datos en localStorage
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('telefono', telefono);

        // Guardar los datos aceptados para compararlos más tarde
        nombreAceptado = nombre;
        telefonoAceptado = telefono;

        // Cambiar el botón de "Aceptar" por "Finalizar Compra"
        const btnAceptar = document.getElementById('aceptarmodal');
        const btnFinalizar = document.getElementById('btnFinalizar');

        btnAceptar.style.display = 'none'; // Ocultar el botón de "Aceptar"
        btnFinalizar.style.display = 'inline-block'; // Mostrar el botón de "Finalizar Compra"
        
        // Habilitar el botón de "Finalizar compra" solo si los campos están completos
        habilitarBotonFinalizar();
    } else {
        // Mostrar alerta si los campos no están completos o el teléfono no tiene 10 dígitos
        alert("Por favor, ingresa tu nombre y un teléfono válido de 10 dígitos.");
    }
}

// Habilitar el botón de "Finalizar Compra"
function habilitarBotonFinalizar() {
    const btnFinalizar = document.getElementById('btnFinalizar');
    btnFinalizar.style.display = 'inline-block'; // Mostrar botón de finalizar
    
    // Asignar evento para mostrar el modal cuando se haga clic
    btnFinalizar.addEventListener('click', mostrarModalCarrito);

    // Agregar eventos para monitorear los cambios en el nombre y teléfono
    monitorearCambios();
}

// Monitorear cambios en los campos de nombre y teléfono
function monitorearCambios() {
    const nombreField = document.getElementById("nombre");
    const telefonoField = document.getElementById("telefono");
    const finalizarButton = document.getElementById("btnFinalizar");
    const aceptarButton = document.getElementById("aceptarmodal");

    // Detectar cambios en el campo de nombre
    nombreField.addEventListener("input", () => {
        if (nombreField.value.trim() !== nombreAceptado || telefonoField.value.trim() !== telefonoAceptado) {
            finalizarButton.style.display = "none"; // Ocultar el botón de finalizar si los datos cambian
            aceptarButton.style.display = "inline-block"; // Mostrar el botón de aceptar si los datos cambian
        }
    });

    // Detectar cambios en el campo de teléfono
    telefonoField.addEventListener("input", () => {
        if (nombreField.value.trim() !== nombreAceptado || telefonoField.value.trim() !== telefonoAceptado) {
            finalizarButton.style.display = "none"; // Ocultar el botón de finalizar si los datos cambian
            aceptarButton.style.display = "inline-block"; // Mostrar el botón de aceptar si los datos cambian
        }
    });
}











///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Función para generar el número único de factura
function generarNumeroFactura() {
    const nombre = localStorage.getItem('nombre') || "Usuario";
    const telefono = localStorage.getItem('telefono') || "0000000000";
    
    // Tomamos las primeras 3 letras del nombre (si tiene menos de 3, tomamos lo que haya)
    const letrasNombre = nombre.slice(0, 3).toUpperCase();
    
    // Tomamos los últimos 3 dígitos del teléfono
    const ultimos3Digitos = telefono.slice(-3);
    
    // Obtenemos la fecha actual en formato compactado (Año-Mes-Día)
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear().toString().slice(-2);  // Solo los últimos 2 dígitos del año
    
    const fecha = `${anio}${mes}${dia}`;  // Combinamos la fecha como un string corto
    
    // Obtener la hora exacta (hora, minutos, segundos)
    const hora = String(fechaActual.getHours()).padStart(2, '0');
    const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
    const segundos = String(fechaActual.getSeconds()).padStart(2, '0'); // Añadimos los segundos
    
    // Combinamos todo para formar un número único de factura
    const numeroFactura = `${letrasNombre}${ultimos3Digitos}${fecha}${hora}${minutos}${segundos}`;

    // Guardamos la fecha y hora exacta de la compra en localStorage para usarla más tarde en la impresión
    localStorage.setItem('horaCompra', `${hora}:${minutos}:${segundos}`);

    return numeroFactura;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Función para finalizar la compra
function finalizarCompra() {
    const nombre = localStorage.getItem('nombre') || "Nombre no proporcionado";
    let telefono = localStorage.getItem('telefono') || "Teléfono no proporcionado";
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const metodoPago = localStorage.getItem('metodoPago') || 'No seleccionado';  // Por defecto 'No seleccionado' si no hay valor
    const totalProductos = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    
    // Formatear el número telefónico con el patrón 000 000 0000
    telefono = telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

    // Generar el número de factura único
    const numeroFactura = generarNumeroFactura();
    
    // Guardar el número de factura en localStorage
    localStorage.setItem('numeroFactura', numeroFactura);

    // Obtener la fecha y hora actuales
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
    const anio = fechaActual.getFullYear();
    const fecha = `${dia}/${mes}/${anio}`;

    const hora = fechaActual.toLocaleTimeString('es-ES', { hour12: false }); // Formato 24 horas

    // Crear el bloque de texto con los productos seleccionados
    let messageProducts = cartItems.map(item => 
        `*${item.name} - $${formatNumber(parseFloat(item.price) || 0)} x ${item.quantity} = $${formatNumber(parseFloat(item.price) * item.quantity)}*` +  // Total de cada producto
        `\n   _${item.instructions || ''}_`  // Instrucciones del producto
    ).join('\n');

    // Generar el mensaje de WhatsApp para "Recoger en Tienda"
    let mensaje = "*RECOGER EN TIENDA*\n\n";
    mensaje += `*FACTURA Nº: #${numeroFactura}*\n`;
    mensaje += `*FECHA:* ${fecha}\n`;
    mensaje += `*HORA:* ${hora}\n\n`;
    mensaje += "*DATOS DEL USUARIO:*\n";
    mensaje += `*NOMBRE:* ${nombre}\n`;
    mensaje += `*TELÉFONO:* ${telefono}\n\n`;
    mensaje += "*PRODUCTOS SELECCIONADOS:*\n\n";
    mensaje += `${messageProducts}\n\n`;
    mensaje += `*TOTAL A PAGAR: $${formatNumber(totalProductos)}*\n`;
    mensaje += `MÉTODO DE PAGO: *${metodoPago}*\n\n`; 
    mensaje += "*Ubicación de la tienda:*\n";
    mensaje += "https://bit.ly/4f2GU5I\n";

    // Codificar el mensaje y abrir WhatsApp
    const encodedMessage = encodeURIComponent(mensaje);
    window.open(`https://wa.me/3022666530?text=${encodedMessage}`, '_blank');

    // Mostrar el modal tras finalizar la compra
    mostrarModalCarrito();

    // Mostrar el botón de imprimir en el modal
    const imprimirBtn = document.getElementById('imprimirFacturaBtn');
    imprimirBtn.style.display = 'inline-block';  // Mostrar el botón de imprimir factura
}



// Mostrar el modal de finalización de compra
function mostrarModalCarrito() {
    const modalCarrito = document.getElementById('compraFinalizadaModal');
    modalCarrito.style.display = 'flex'; // Mostrar el modal
}

// Cerrar el modal de finalización de compra
function cerrarModalCarrito() {
    const modalCarrito = document.getElementById('compraFinalizadaModal');
    modalCarrito.style.display = 'none'; // Ocultar el modal
}

// Función para volver al inicio y limpiar el estado
function volverAlInicio() {
    // Guardar temporalmente el nombre y el número de teléfono
    const nombre = localStorage.getItem('nombre');
    const telefono = localStorage.getItem('telefono');
    
    // Limpiar todo el localStorage
    localStorage.clear();
    
    // Restaurar el nombre y el número de teléfono
    if (nombre) localStorage.setItem('nombre', nombre);
    if (telefono) localStorage.setItem('telefono', telefono);

    // Redirigir al inicio
    window.location.href = 'index.html';
}

// Selecciona el modal y el botón de cierre ("x")
const modalCarrito = document.getElementById('compraFinalizadaModal');
const closeModalButton = document.getElementById('closeModal');

// Agregar el evento de clic para cerrar el modal cuando se haga clic en la "x"
closeModalButton.addEventListener('click', () => {
    modalCarrito.style.display = 'none'; // Ocultar el modal
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none'; // Cerrar el modal si se hace clic fuera de él
    }
});

// Cargar los productos del carrito cuando se carga la página
window.onload = loadCart;



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Función para imprimir la factura
function imprimirFactura() {
    const nombre = localStorage.getItem('nombre') || "Nombre no proporcionado";
    let telefono = localStorage.getItem('telefono') || "Teléfono no proporcionado";
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const metodoPago = localStorage.getItem('metodoPago') || 'No seleccionado';  // Por defecto 'No seleccionado' si no hay valor
    const totalProductos = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    
    // Recuperar el número de factura desde localStorage
    const numeroFactura = localStorage.getItem('numeroFactura') || "No disponible";  // Si no hay número, usar un valor predeterminado
    const horaCompra = localStorage.getItem('horaCompra') || "Hora no disponible"; // Hora exacta de la compra

    // Formatear el número telefónico con el patrón 000 000 0000
    telefono = telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

    // Obtener la fecha y hora actuales
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
    const anio = fechaActual.getFullYear();
    const fecha = `${dia}/${mes}/${anio}`;


    // Crear el bloque de texto con los productos seleccionados
    let messageProducts = cartItems.map(item => 
        `*${item.name} - $${formatNumber(parseFloat(item.price) || 0)} x ${item.quantity} = $${formatNumber(parseFloat(item.price) * item.quantity)}*` +  // Total de cada producto
        `\n _${item.instructions || ''}_`  // Instrucciones del producto
    ).join('\n');

    // Generar el mensaje de la factura con el número de factura
    let facturaTexto = `
------------------------------------------------------
MR. GEORGE - SINCE 2022
------------------------------------------------------

RECOGER EN TIENDA

FACTURA Nº: #${numeroFactura}
FECHA: ${fecha}
HORA: ${horaCompra}

DATOS DEL USUARIO:
Nombre: ${nombre}
Teléfono: ${telefono}

PRODUCTOS SELECCIONADOS:

${messageProducts}

TOTAL A PAGAR: $${formatNumber(totalProductos)}
MÉTODO DE PAGO: ${metodoPago}
    
------------------------------------------------------
¡Gracias por tu compra!
------------------------------------------------------
`;

    // Abrir una ventana nueva para mostrar la factura
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write(`<html><head><title>FACTURA Nº: #${numeroFactura}</title></head><body>`);
    ventanaImpresion.document.write('<pre>' + facturaTexto + '</pre>');
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








