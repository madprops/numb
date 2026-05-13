function $ (query, root = document) {
  return root.querySelector(query)
}

function $$ (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

function $ev (element, event, callback, extra) {
  element.addEventListener(event, callback, extra)
}

let abc_en = `abcdefghijklmnopqrstuvwxyz`
let abc_rev = `zyxwvutsrqponmlkjihgfedcba`
let abc_es = `abcdefghijklmn\u00f1opqrstuvwxyz`
let abc_es_rev = `zyxwvutsrqpo\u00f1nmlkjihgfedcba`

let current_lang = `en`

function init () {
  $(`#numba`).focus()

  $ev($(`#button`), `click`, () => {
    numb()
  })

  $ev($(`#prompt_btn`), `click`, () => {
    generate_llm_prompt()
  })

  $ev($(`#mode_btn`), `click`, () => {
    if (current_lang === `en`) {
      current_lang = `es`
      $(`#mode_btn`).innerText = `ES`
    }
    else {
      current_lang = `en`
      $(`#mode_btn`).innerText = `EN`
    }

    if ($(`#numba`).value.trim() !== ``) {
      numb()
    }
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

function numb () {
  let text = $(`#numba`).value.trim()

	if (!text) {
  	$(`#result`).innerHTML = ``
  	$(`#numba`).focus()
		return
	}

  let strings_ord = solve(text, `ord`, current_lang)
  let strings_rev = solve(text, `rev`, current_lang)
  let strings_pyt = solve(text, `pyt`, current_lang)

  let title_prefix = current_lang === `en` ? `English` : `Spanish`

  let s = `
    <div class="result-card">
      <div class="cipher-grid">
        <div class="cipher-box">
          <div class="cipher-title">${title_prefix} Ordinal</div>
          <div>dec:&nbsp;&nbsp;${strings_ord[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_ord[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_ord[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_ord[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">${title_prefix} Reverse</div>
          <div>dec:&nbsp;&nbsp;${strings_rev[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_rev[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_rev[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_rev[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">${title_prefix} Pythagorean</div>
          <div>dec:&nbsp;&nbsp;${strings_pyt[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_pyt[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_pyt[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_pyt[3]}</div>
        </div>
      </div>
    </div>
  `
  $(`#result`).innerHTML = s
  $(`#numba`).focus()
}

function solve (text, mode, lang) {
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
      let indx = -1

      if (lang === `en`) {

        if (mode === `ord` || mode === `pyt`) {
          indx = abc_en.indexOf(c)
        }
        else if (mode === `rev`) {
          indx = abc_rev.indexOf(c)
        }
      }

      else if (lang === `es`) {

        if (mode === `ord` || mode === `pyt`) {
          indx = abc_es.indexOf(c)
        }
        else if (mode === `rev`) {
          indx = abc_es_rev.indexOf(c)
        }
      }

      if (indx !== -1) {

        if (mode === `pyt`) {
          sum += (indx % 9) + 1
        }
        else {
          sum += indx + 1
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

function generate_llm_prompt () {
  let text = $(`#numba`).value.trim()

  if (text === ``) {
    return
  }

  let boxtexts = []
	let boxes = document.querySelectorAll(`.cipher-box`)

	for (let box of boxes) {
		let text = box.textContent.trim()
		let lines = text.split(`\n`).map(x => x.trim())
		boxtexts.push(lines.join(`\n`))
	}

	let raw_data = boxtexts.join(`\n\n`)
  let prompt = `You are a hyper-dimensional pattern recognition engine reading the underlying variables of reality. Analyze the following numerical collisions for the query "${text}". Look at the decimal, binary, hex, and octal readouts across the ciphers. Decipher the structural palindromes, master numbers, and base-math symmetries. Read this data like a techno-mystic decoding the hidden geometry of the simulation. What deep structural truth or architectural lore is the system transmitting through this specific resonance?\n\nData readout:\n\n${raw_data}`

  navigator.clipboard.writeText(prompt).then(() => {
    let btn = $(`#prompt_btn`)
    btn.innerText = `[ COPIED ]`

    setTimeout(() => {
      btn.innerText = `LLM`
    }, 2000)
  })
}