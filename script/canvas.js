// переменные 
window.onload = function() { // Запуск скрипта при полной загрузки страницы
  const start = () => {
    const // Переменные
      canvas = document.getElementById('canvas'), // canvas
      ctx = canvas.getContext('2d'), // ctx
      slovList = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь',
      'э','ю','я','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
      screenWidth = document.documentElement.clientWidth - 150, // Получение ширина экрана
      screenHeight = document.documentElement.clientHeight - 150, // Получение высоты экрана
      colorList = [ // Список цветов
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

    // Перезапуск программы 
    document.querySelector('.restart').addEventListener('click', start)
    // Перезапуск программы 

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
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].list.length; j++) {
          let res = array.findIndex(e => e.vertex === array[i].list[j]) // Поиск по имени
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
      let
        mas = [], // массив с элементами
        listRandom = shuffle(slovList), // перемешивание словаря 
        vertexList  = [] // возвращаемый массив с объектами
      for (let i = 0; i < n; i++) {
        mas.push(listRandom[i]) // рандомное заполнение массива
      }
      for (let i =0; i < mas.length; i++) {
        vertexList.push({vertex: mas[i], list: [], pos: [], color: null}) // заполнение возвращаемого массива ключами
      }
      for (let i = 0; i < mas.length; i++) {
        let 
          randPosX = Math.floor(Math.random() * (screenWidth / 2) * 1.8), // Получение рандомного местоположения по ширине 
          randPosY = Math.floor(Math.random() * (screenHeight / 2) * 1.8) // Получение рандомного местоположения по высоте
        vertexList[i].pos.push(randPosX, randPosY) // Добавление в массив местоположение где (0 - x, 1 - y)
        for (let j = 0; j < vertexList.length; j++) {
          let randItem = Math.floor(Math.random() * n) // рандом для получения элемента массива
          // Запрет на добавление одинаковых элементов
          if (vertexList[randItem].vertex !== mas[i] && !vertexList[randItem].list.includes(mas[i])) { 
            vertexList[randItem].list.push(mas[i]) // Добавление в связи 
            let clrRand = Math.floor(Math.random() * colorList.length) // Получение рандомного цвета
            // ctx.strokeStyle = colorList[clrRand] // Цвет ребра
            vertexList[randItem].color = colorList[clrRand]
          }
        }
      } 
      return callback(vertexList) // Запуск колбэк функции
      // return vertexList
    }
    // Создание графа

    let arrayList = grafListCreate(5, graphUndirected) // Запуск функции создания графа
    console.log(arrayList) // Вывод в консоль графа

    let sizeLineWidth = 2.5
    const render = () => {
      // Функция рендерит данные при изменении
      ctx.fillStyle = '#44475a'
      ctx.fillRect(0, 0, canvas.width, canvas.height) // Сброс canvas
      arrayList.forEach((e) => {
        ctx.strokeStyle = e.color
        e.list.forEach((ls) => { 
          // let clrRand = Math.floor(Math.random() * colorList.length) // Получение рандомного цвета
          // ctx.strokeStyle = colorList[clrRand] // Цвет ребра
          ctx.stroke() 
          // ctx.fillStyle = "#ff0000" // Цвет текста
          // ctx.fillStyle = "#000"
          let pos = arrayList.findIndex((el) => ls == el.vertex)
          ctx.fillRect(e.pos[0], e.pos[1], 50, 50) // Создание квадрата 
          ctx.moveTo(e.pos[0], e.pos[1])
          ctx.lineTo(arrayList[pos].pos[0], arrayList[pos].pos[1])
          ctx.stroke()
          ctx.lineWidth = sizeLineWidth
          ctx.lineCap = "round";
          ctx.beginPath()
          ctx.font = "22px serif" // Размер текста
          ctx.fillStyle = "#F8F8F2";
          ctx.fillText(e.vertex, e.pos[0] + 20, e.pos[1] + 25) // Цвет текста
          ctx.fillStyle = "#6272a4"; //<======= and here
          ctx.closePath()
          // ctx.fillStyle = "orange";
        })
      })
    }

    // Переменные
    let 
      currentShapeIndex = null, // Индекс на элемента на который нажали
      isDragging = false, // Флаг (true - активна, false - не активна) нажатие на блок
      startX, // Изменение блока по x 
      startY, // Изменение блока по y
      offSetX, // Граница canvas по x 
      offSetY // Граница canvas по y
    // Переменные

    const getOfSet = () => {
      let canvasOfSet = canvas.getBoundingClientRect()
      offSetX = canvasOfSet.left
      offSetY = canvasOfSet.top
    }; getOfSet()

    window.onscroll = () => {getOfSet()} 
    window.onresize = () => {getOfSet()}
    canvas.onresize = () => {getOfSet()}

    const isMouseInShape = (x, y, shape, width, height) => {
      // console.log(arrayList)
      let
        shapeLeft = shape[0],
        shapeRight = shape[0] + width,
        shapeTop = shape[1],
        shapeBottom = shape[1] + height
      // console.log(shapeLeft, shapeRight, shapeTop, shapeBottom)
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
        // console.log('da124', item)
          // console.log('yes')
          currentShapeIndex = index
          isDragging = true
          return 
        } else {
          return
          // console.log('no')
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
      // Функция запускается каждый раз, когда мышка двигается внутри canvas
      if (!isDragging) { // Проверка если мы не на графе выходим
        return 
      } else {
        event.preventDefault()
        let mouseX = parseInt(event.clientX - offSetX)  // Преобразование строки в integer 
        let mouseY = parseInt(event.clientY - offSetY) // Преобразование строки в integer 
        let dx = mouseX - startX
        let dy = mouseY - startY 
        let currentShape = arrayList[currentShapeIndex]
        currentShape.pos[0] += dx
        currentShape.pos[1] += dy
        render()
        startX = mouseX
        startY = mouseY
      }
    }

    canvas.onmousedown = mouseDown
    canvas.onmouseup = mouseUp
    canvas.onmouseout = mouseOut
    canvas.onmousemove = mouseMove

    const graphText = (array) => {
      // Функция создает граф в текстовом варианте
      // Входные параметры: array - граф
      // Возвращает: ничего
      let list = document.querySelector('.da')
      if (!list) {
        return
      }
      let table = document.querySelector('.table')
      if (table) {
        list.removeChild(table)
      }
      table = document.createElement('table')
      table.classList.add('table')
      array.forEach((e) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `Вершина: ${e.vertex}`
        e.list.forEach((n) => {
          let td = document.createElement('td')
          td.innerHTML = n
          tr.appendChild(td);
        })
        let td = document.createElement('td')
        td.innerHTML = `Связей: ${e.list.length}`
        tr.appendChild(td);
        table.appendChild(tr);
      })
      list.appendChild(table)
    }; graphText(arrayList)

    render();
  }; start()
}