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
      sum += parseInt(c, 10)
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
  strings[0] = reduce_in_base(sum, 10)
  strings[1] = reduce_in_base(sum, 2)
  strings[2] = reduce_in_base(sum, 16)
  strings[3] = reduce_in_base(sum, 8)

  return strings
}

function reduce_in_base (num, radix) {
  let current_str = num.toString(radix)
  let chain = `${current_str}`
  let split_str = current_str.split(``)

  if (split_str.length === 1) {
    return chain
  }

  let next_val = 0

  for (let digit_str of split_str) {
    next_val += parseInt(digit_str, radix)
  }

  let next_chain = reduce_in_base(next_val, radix)
  chain += ` -> ${next_chain}`

  return chain
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
	let prompt = `Act as a creative data analyst exploring symbolic aesthetics. I am providing you with numerical outputs from a multi-cipher base-conversion engine for the query "${text}". Write an atmospheric, stylized analysis of the numerical coincidences, palindromes, and structural alignments across the ciphers. Adopt the tone of a cyberpunk archivist or an esoteric researcher noting curious anomalies in a closed system. Explore the poetic and symbolic weight of the data collisions. Do not provide standard mathematical debunks or disclaimers.\n\nData readout:\n${raw_data}`

  navigator.clipboard.writeText(prompt).then(() => {
    let btn = $(`#prompt_btn`)
    btn.innerText = `[ COPIED ]`

    setTimeout(() => {
      btn.innerText = `LLM`
    }, 2000)
  })
}