const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paginacion = document.querySelector('#paginacion')

let totalPaginas
let iterar
let actPage = 1
const registrosPorPagina = 30

window.onload = () => {
  formulario.addEventListener('submit', validarForm)
}

const validarForm = e => {
  e.preventDefault()

  const terminoBusqueda = document.querySelector('#termino').value 

  if (terminoBusqueda === '') {
    mostrarAlerta('Agrega un termino de busqueda!')    
     return
  } 
  buscarImagenes(terminoBusqueda)
}
const mostrarAlerta = (mensaje) => {
  const existeAlerta = document.querySelector('.bg-red-600')
  if (!existeAlerta) {
    const alerta = document.createElement('p')
    alerta.classList.add('bg-red-600', 'border-red-400','px-4','py-2', 'mx-auto','mt-6', 'rounded', 'max-w-lg', 'text-center', 'text-white')
    alerta.textContent = mensaje
    formulario.appendChild(alerta)
  
    setTimeout(() => {
      alerta.remove()
    }, 3000)
  }
  
}
const buscarImagenes = () => {
  const termino = document.querySelector('#termino').value 

  const key = '27581318-98cb86999a0910dcf88e38f8f'
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${actPage}`
  
  Spinner()

  fetch(url)
    .then(res => res.json())
    .then(res => {
      totalPaginas = calcPag(res.totalHits)
      console.log(totalPaginas)
      mostrarImagenes(res.hits)
    })

}
const calcPag = total => {
  return parseInt( Math.ceil(total / registrosPorPagina))
}
const mostrarImagenes = imagenes => {
  // console.log(imagenes)
  limpiarHtml()
  if(imagenes.length === 0 ) {
    mostrarAlerta('No se encontraron imagenes con ese termino :(')
    return
  } 
  //iterar sobre el arreglo de imagenes y construir el html
  imagenes.forEach(imagen => {
    const { likes, views, largeImageURL } = imagen
    resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
          <div class="bg-white rounded overflow-hidden">
            <img class="w-full" src="${largeImageURL}" alt="image pixabax" loading="lazy">

            <div class="p-4"> 
              <p class="font-bold"><span class="text-blue-800">${likes} </span>Likes</p>
              <p class="font-bold"><span class="text-blue-800">${views} </span>Views</p>

              <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" 
              class="block w-full bg-blue-700 text-white mt-3 hover:bg-blue-500 py-2 rounded-md  font-bold text-center">View image</a>
            </div>
          </div>
        </div>
    `
  })
  while(paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild)
  }
  imprimirPaginas()  
}

function limpiarHtml() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild)
  }
}

const Spinner = () => {
  limpiarHtml()
  const spinnerDiv = document.createElement('div')
  spinnerDiv.classList.add('sk-cube-grid')

  spinnerDiv.innerHTML = `
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div>
  `
  resultado.appendChild(spinnerDiv)

}

function *crearPaginador (total) {
  console.log(total)
  for(let i = 1; i <= total; i++){
    yield i
  }
}

function imprimirPaginas () {
  iterar = crearPaginador(totalPaginas)

  while(true) {
    const {value, done} = iterar.next()
    if (done) return

    const button = document.createElement('a')
    button.href = '#'
    button.dataset.pagina = value
    button.textContent = value
    button.classList.add('siguiente','bg-yellow-500','px-4', 'mr-2', 'font-bold', 'mb-10', 'rounded')
    
    button.onclick = () => {
      actPage = value
      buscarImagenes()
    }

    paginacion.appendChild(button)
  }

}