function $ (query, root = document) {
  return root.querySelector(query)
}

function $$ (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

function $ev (element, event, callback, extra) {
  element.addEventListener(event, callback, extra)
}

function init () {
  $(`#numba`).focus()

  $ev($(`#button`), `click`, () => {
    numb()
  })

  keydec()
}

function keydec () {
  $ev(document, `keydown`, (e) => {
    if (e.key === `Enter`) {
      numb()
    }

    if (e.key === `Escape`) {
      $(`#numba`).value = ``
      $(`#result`).innerHTML = ``
    }

    if ($(`#numba`) !== document.activeElement) {
      $(`#numba`).focus()
    }
  })
}

let abc_en = `abcdefghijklmnopqrstuvwxyz`
let abc_rev = `zyxwvutsrqponmlkjihgfedcba`
let abc_es = `abcdefghijklmn\u00f1opqrstuvwxyz`

function numb () {
  let text = $(`#numba`).value.trim()
  let strings_en = solve(text, `en`)
  let strings_es = solve(text, `es`)
  let strings_rev = solve(text, `rev`)
  let strings_pyt = solve(text, `pyt`)

  let s = `
    <div class="result-card">
      <div class="cipher-grid">
        <div class="cipher-box">
          <div class="cipher-title">English</div>
          <div>dec:&nbsp;&nbsp;${strings_en[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_en[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_en[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_en[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">Reverse</div>
          <div>dec:&nbsp;&nbsp;${strings_rev[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_rev[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_rev[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_rev[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">Pythagorean</div>
          <div>dec:&nbsp;&nbsp;${strings_pyt[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_pyt[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_pyt[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_pyt[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">Spanish</div>
          <div>dec:&nbsp;&nbsp;${strings_es[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_es[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_es[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_es[3]}</div>
        </div>
      </div>
    </div>
  `
  $(`#result`).innerHTML = s
  $(`#numba`).focus()
}

function solve (text, mode) {
  let sum = 0
  let split_text = text.split(``)

  for (let i = 0; i < split_text.length; i++) {
    let c = split_text[i].toLowerCase()

    if (c.trim() == ``) {
      continue
    }

    if (!isNaN(c)) {
      sum += parseInt(c)
    }
    else {
      let indx

      if (mode === `en`) {
        indx = abc_en.indexOf(c)
      }
      else if (mode === `es`) {
        indx = abc_es.indexOf(c)
      }
      else if (mode === `rev`) {
        indx = abc_rev.indexOf(c)
      }
      else if (mode === `pyt`) {
        indx = abc_en.indexOf(c)
      }

      if (indx !== -1) {
        if (mode === `pyt`) {
          sum += ((indx % 9) + 1)
        }
        else {
          sum += (indx + 1)
        }
      }
    }
  }

  let strings = []

  if (sum > 9) {
    strings[0] = deconstruct(sum)
  }
  else {
    strings[0] = sum.toString()
  }

  strings[1] = replace_bin(strings[0])
  strings[2] = replace_hex(strings[0])
  strings[3] = replace_oct(strings[0])
  return strings
}

function deconstruct (sum, s = `${sum}`) {
  let num = 0
  let split_sum = sum.toString().split(``)

  for (let n of split_sum) {
    num += parseInt(n)
  }

  s += ` -> ${num}`

  if (num > 9) {
    return deconstruct(num, s)
  }

  return s
}

function replace_bin (s) {
  return s.replace(/\d+/g, (match) => {
    return parseInt(match).toString(2)
  })
}

function replace_oct (s) {
  return s.replace(/\d+/g, (match) => {
    return parseInt(match).toString(8)
  })
}

function replace_hex (s) {
  return s.replace(/\d+/g, (match) => {
    return parseInt(match).toString(16)
  })
}