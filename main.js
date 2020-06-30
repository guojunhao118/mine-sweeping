const log = console.log.bind(console)

const sel = (selector) => document.querySelector(selector)

const selAll = (selector) => document.querySelectorAll(selector)

const templateCell = function (line, x) {
    let container = ''
    for (let i = 0; i < line.length; i++) {
        let n = line[i]
        let html = `
            <div class="cell" data-number="${ n }" data-x="${ x }" data-y="${ i }">${ n }</div>
        `
        container += html
    }
    return `
        <div class="row clearfix">
            ${ container }
        </div>
    `
}

const templateRow = function (square) {
    let container = ''
    for (let i = 0; i < square.length; i++) {
        let n = square[i]
        let row = templateCell(n, i)
        container += row
    }
    return container
}

const renderSquare = function (square) {
    let row = templateRow(square)
    let html = `
        <div id="id-div-mine">${ row }</div>
    `
    let container = document.querySelector('.main')
    container.insertAdjacentHTML('beforeend', html)
}

const bindEventDelegate = function (square) {
    let cell = sel('#id-div-mine')
    // 绑定右击事件
    cell.addEventListener('contextmenu', e => {
        log('右击了元素')
        e.preventDefault()
        if (e.target.classList.contains('sign')) {
            log('删除class')
            e.target.classList.remove('sign')
        } else {
            e.target.classList.add('sign')
        }
    })
    cell.addEventListener('click', (e) => {
        let target = e.target
        log('点击的元素', target.className)
        if (target.className.includes('cell') && !target.className.includes('sign')) {
            log('点击块')
            vjkl(target, square)
        }
    })
}


const vjkl = function (cell, square) {
    let { number, x, y } = cell.dataset
    if (cell.className.includes('opend')) {
        return
    }
    if (Number(number) === 9) {
        // 标出所有地雷
        cell.classList.add('opend')
        cell.classList.add('is-mine')
        findAllMine()

        setTimeout(() => {
            alert('game over!!!')
        }, 0)
        log('game over')
    } else if (Number(number) === 0) {
        cell.classList.add('opend')
        vjklAround(square, Number(x), Number(y))
    } else {
        cell.classList.add('opend')
    }
}

/**
 * 找到所有地雷并显示
 */
const findAllMine = function () {
    let all = selAll('.cell')
    for (let i = 0; i < all.length; i++) {
        let { number, x, y } = all[i].dataset
        if (Number(number) === 9) {
            all[i].classList.add('opend')
            all[i].classList.add('is-mine')
        }
    }
}


const vjklAround = function (square, x, y) {
    log('查询周边元素')
    // 左边
    vjkl1(square, x - 1, y - 1)
    vjkl1(square, x - 1, y + 1)
    vjkl1(square, x - 1, y)

    // 上下
    vjkl1(square, x, y - 1)
    vjkl1(square, x, y + 1)

    // 右边
    vjkl1(square, x + 1, y - 1)
    vjkl1(square, x + 1, y)
    vjkl1(square, x + 1, y + 1)

}


const vjkl1 = function (square, x1, y1) {
    // 超出雷区范围，直接返回
    if (x1 < 0 || y1 < 0 || x1 > square[0].length || y1 > square.length) {
        return
    }
    let allCell = selAll('.cell')
    for (let i = 0; i < allCell.length; i++) {

        let item = allCell[i]
        let { number, x, y } = item.dataset

        if (Number(x) === x1 && Number(y) === y1) {
            if (Number(number) === 0) {
                log('触发周边的雷', number)
                item.classList.add('opend')
                vjklAround(square, x, y)
            } else if (Number(number) === 9) {

            } else {
                item.classList.add('opend')
            }
        }
    }
}



const __main = () => {
    let s = ' [[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
    let rowData = JSON.parse(s)
    renderSquare(rowData)
    bindEventDelegate(rowData)
}

__main()