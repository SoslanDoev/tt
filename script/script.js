// переменные 
window.onload = function() { // Запуск скрипта при полной загрузки страницы
  const // Переменные
    canvas = document.getElementById('canvas'), // canvas
    ctx = canvas.getContext('2d'), // ctx
    slovList = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь',
    'э','ю','я','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    screenWidth = window.innerWidth - 150, // Получение ширина экрана
    screenHeight = window.innerHeight - 150, // Получение высоты экрана
    colorList = [ // Список цветов
      '#2e3440',
      '#3b4252',
      '#434c5e',
      '#4c566a',
      '#d8dee9',
      '#e5e9f0',
      '#eceff4',
      '#8fbcbb',
      '#88c0d0',
      '#81a1c1',
      '#5e81ac',
      '#bf616a',
      '#d08770',
      '#ebcb8b',
      '#a3be8c',
      '#b48ead',
    ]
  canvas.width = screenWidth; // Установление canvas ширины 
  canvas.height = screenHeight; // Установление canvas высоты 

  // Перемешивание словаря
  const shuffle = (array) => {
    // Функция сортирует массив случайным образом
    // Входные параметры: array - одномерный массив
    // Возвращает: перемешанный массив
    return array.sort(() => Math.random() - 0.5);
  }
  // Перемешивание словаря

  // Создание неориентированного графа
  const graphUndirected = (array) => {
    // Функция проверят на неориентированный граф
    // Входные параметры: array - массив объектов
    // Возвращает: неориентированный граф в виде массива
    console.log(array)
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].list.length; j++) {
        // Поиск по имени 
        let res = array.findIndex(e => e.vertex === array[i].list[j])
        if (!array[res].list.includes(array[i].vertex)) {
          array[res].list.push(array[i].vertex)
        }
      }
    }
    return array
  }
  // Создание неориентированного графа

  // Создание графа
  const grafListCreate = (n, callback) => {
    // Функция создает граф с вершинами
    // Входные параметры: 
        // n -кол-во вершин, 
        // callback - колбэк функция с неориентированным графом 
    // Возвращает: массив объектов
    let mas = [] // массив с элементами
    let listRandom = shuffle(slovList) // перемешивание словаря 
    let vertexList  = [] // возвращаемый массив с объектами
    for (let i = 0; i < n; i++) {
      mas.push(listRandom[i]) // рандомное заполнение массива
    }
    for (let i =0; i < mas.length; i++) {
      vertexList.push({vertex: mas[i], list: [], pos: []}) // заполнение возвращаемого массива ключами
    }
    for (let i = 0; i < mas.length; i++) {
      let rand = Math.floor(Math.random() * n) // рандом для получения кол-ва заполнения 
      let 
        randPosX = Math.floor(Math.random() * screenWidth),
        randPosY = Math.floor(Math.random() * screenHeight)
      vertexList[i].pos.push(randPosX, randPosY)
      for (let j = 0; j < vertexList.length; j++) {
        let randItem = Math.floor(Math.random() * n) // рандом для получения элемента массива
        // Запрет на добавление одинаковых элементов
        if (vertexList[randItem].vertex !== mas[i] && !vertexList[randItem].list.includes(mas[i])) { 
          vertexList[randItem].list.push(mas[i]) 
        }
      }
    } 
    return callback(vertexList)
    // return vertexList
  }
  // Создание графа

  let arrayList = grafListCreate(3, graphUndirected) // Запуск функции создания графа
  console.log(arrayList) // Вывод в консоль графа

  const render = () => {
    // Функция рендерит данные при изменении
    ctx.fillRect(0, 0, canvas.width, canvas.height) // Сброс canvas
    arrayList.forEach((e) => {
      e.list.forEach((ls) => { 
        let clrRand = Math.floor(Math.random() * colorList.length) // Получение рандомного цвета
        ctx.beginPath()
        ctx.rect(e.pos[0], e.pos[1], 50, 50) // Создание квадрата 
        ctx.fillStyle = "#ff0000" // Цвет текста
        ctx.font = "22px serif" // Размер текста
        ctx.fillText(e.vertex, e.pos[0] + 25, e.pos[1] + 25) // Цвет текста
        ctx.closePath()
        ctx.strokeStyle = colorList[clrRand] // Цвет ребра
        ctx.stroke() 
        ctx.fillStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(e.pos[0], e.pos[1]);
        let pos = arrayList.findIndex((el) => ls == el.vertex)
        ctx.lineTo(arrayList[pos].pos[0], arrayList[pos].pos[1]);
        ctx.stroke();
      })
    })
  }

  let currentShapeIndex = null
  let isDragging = false
  let startX
  let startY

  let canvasWidth = canvas.width
  let canvasHeight = canvas.height
  let offSetX
  let offSetY

  const getOfSet = () => {
    let canvasOfSet = canvas.getBoundingClientRect()
    offSetX = canvasOfSet.left
    offSetY = canvasOfSet.top
  }; getOfSet()

  window.onscroll = () => {getOfSet}
  window.onresize = () => {getOfSet}
  canvas.onresize = () => {getOfSet}

  const isMouseInShape = (x, y, shape, width, height) => {
    console.log(arrayList)
    let
      shapeLeft = shape[0],
      shapeRight = shape[0] + width,
      shapeTop = shape[1],
      shapeBottom = shape[1] + height
    console.log(shapeLeft, shapeRight, shapeTop, shapeBottom)
    if (x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom) { 
      return true
    }
    return false
  } 

  const mouseDown = (event) => {
    event.preventDefault()

    startX = parseInt(event.clientX - offSetX),
    startY = parseInt(event.clientY - offSetY)
    // let index = 0 // Передавать индекс
    let index = 0 // Передавать индекс
    // for (let item of arrayList) {
    arrayList.forEach((item, index) => {
      if (isMouseInShape(startX, startY, item.pos, 50, 50)) {
      console.log('da124', item)
        console.log('yes')
        currentShapeIndex = index
        isDragging = true
        return 
      } else {
        console.log('no')
      }
    })
    index++
  }

  const mouseUp = (event) => {
    if (!isDragging) {
      return 
    }
    event.preventDefault()
    isDragging = false
  }

  const mouseOut = (event) => {
    if (!isDragging) {
      return 
    }
    event.preventDefault()
    isDragging = false
  }

  const mouseMove = (event) => {
    if (!isDragging) {
      return 
    } else {
      event.preventDefault()
      let mouseX = parseInt(event.clientX - offSetX) 
      let mouseY = parseInt(event.clientY - offSetY)
      let dx = mouseX - startX
      let dy = mouseY - startY
      let currentShape = arrayList[currentShapeIndex]
      currentShape.pos[0] += dx
      currentShape.pos[1] += dy
      // currentShape.x += dx
      // currentShape.y += dy
      console.log(currentShape)
      render()
      startX = mouseX
      startY = mouseY
    }
  }

  canvas.onmousedown = mouseDown
  canvas.onmouseup = mouseUp
  canvas.onmouseout = mouseOut
  canvas.onmousemove = mouseMove

  render();
}