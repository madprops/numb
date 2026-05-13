let jewish_std = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, k: 10, l: 20, m: 30, n: 40, o: 50, p: 60, q: 70, r: 80, s: 90, t: 100, u: 200, x: 300, y: 400, z: 500, j: 600, v: 700, w: 900, "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 20, "ך": 20, "ל": 30, "מ": 40, "ם": 40, "נ": 50, "ן": 50, "ס": 60, "ע": 70, "פ": 80, "ף": 80, "צ": 90, "ץ": 90, "ק": 100, "ר": 200, "ש": 300, "ת": 400}
let he_ord_dict = {"א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9, "י": 10, "כ": 11, "ך": 11, "ל": 12, "מ": 13, "ם": 13, "נ": 14, "ן": 14, "ס": 15, "ע": 16, "פ": 17, "ף": 17, "צ": 18, "ץ": 18, "ק": 19, "ר": 20, "ש": 21, "ת": 22}
let he_atbash_dict = {"א": 400, "ב": 300, "ג": 200, "ד": 100, "ה": 90, "ו": 80, "ז": 70, "ח": 60, "ט": 50, "י": 40, "כ": 30, "ך": 30, "ל": 20, "מ": 10, "ם": 10, "נ": 9, "ן": 9, "ס": 8, "ע": 7, "פ": 6, "ף": 6, "צ": 5, "ץ": 5, "ק": 4, "ר": 3, "ש": 2, "ת": 1}

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

let current_lang = localStorage.getItem(`current_lang`) || `sim`

function init () {
  $(`#numba`).focus()
  $(`#mode_select`).value = current_lang

  $ev($(`#button`), `click`, () => {
    numb()
  })

  $ev($(`#prompt_btn`), `click`, () => {
    generate_llm_prompt()
  })

  $ev($(`#mode_select`), `change`, (e) => {
    current_lang = e.target.value
    localStorage.setItem(`current_lang`, current_lang)

    if ($(`#numba`).value.trim() !== ``) {
      numb()
    }
  })

  keydec()
  numb()
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
  let strings_atb = solve(text, `atb`, current_lang)
  let title_1 = ``
  let title_2 = ``
  let title_3 = ``
  let title_4 = ``

  if (current_lang === `sim`) {
    title_1 = `Simple Gematria`
    title_2 = `Simple Reverse`
    title_3 = `Simple Pythagorean`
  }

  else if (current_lang === `eng`) {
    title_1 = `English Gematria`
    title_2 = `English Reverse`
    title_3 = `English Pythagorean`
  }

  else if (current_lang === `es`) {
    title_1 = `Spanish Ordinal`
    title_2 = `Spanish Reverse`
    title_3 = `Spanish Pythagorean`
  }

  else if (current_lang === `he`) {
    title_1 = `Jewish Standard`
    title_2 = `Jewish Ordinal`
    title_3 = `Jewish Reduced`
    title_4 = `Jewish Atbash`
  }

  let atbash_html = ``

  if (current_lang === `he`) {
    atbash_html = `
        <div class="cipher-box">
          <div class="cipher-title">${title_4}</div>
          <div>dec:&nbsp;&nbsp;${strings_atb[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_atb[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_atb[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_atb[3]}</div>
        </div>
    `
  }

  let s = `
    <div class="result-card">
      <div class="cipher-grid">
        <div class="cipher-box">
          <div class="cipher-title">${title_1}</div>
          <div>dec:&nbsp;&nbsp;${strings_ord[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_ord[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_ord[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_ord[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">${title_2}</div>
          <div>dec:&nbsp;&nbsp;${strings_rev[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_rev[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_rev[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_rev[3]}</div>
        </div>

        <div class="cipher-box">
          <div class="cipher-title">${title_3}</div>
          <div>dec:&nbsp;&nbsp;${strings_pyt[0]}</div>
          <div>bin:&nbsp;&nbsp;${strings_pyt[1]}</div>
          <div>hex:&nbsp;&nbsp;${strings_pyt[2]}</div>
          <div>oct:&nbsp;&nbsp;${strings_pyt[3]}</div>
        </div>

        ${atbash_html}
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
      if (lang === `he`) {
        if (mode === `ord`) {
          let val = jewish_std[c]

          if (val !== undefined) {
            sum += val
          }
        }

        else if (mode === `rev`) {
          let val = he_ord_dict[c]

          if (val !== undefined) {
            sum += val
          }

          else {
            let indx = abc_en.indexOf(c)

            if (indx !== -1) {
              sum += indx + 1
            }
          }
        }

        else if (mode === `pyt`) {
          let val = jewish_std[c]

          if (val !== undefined) {
            let reduced = (val - 1) % 9 + 1
            sum += reduced
          }
        }

        else if (mode === `atb`) {
          let val = he_atbash_dict[c]

          if (val !== undefined) {
            sum += val
          }
        }
      }

      else {
        let indx = -1

        if (lang === `sim` || lang === `eng`) {
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
            let val = indx + 1

            if (lang === `eng`) {
              val *= 6
            }

            sum += val
          }
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

  if (!text) {
    return
  }

  let mode_desc = ``
  let title_1 = ``
  let title_2 = ``
  let title_3 = ``
  let title_4 = ``

  if (current_lang === `sim`) {
    mode_desc = `Simple English Gematria (A=1 to Z=26)`
    title_1 = `Simple Gematria`
    title_2 = `Simple Reverse`
    title_3 = `Simple Pythagorean`
  }

  else if (current_lang === `eng`) {
    mode_desc = `English Gematria (Sumerian x6 multiplier)`
    title_1 = `English Gematria`
    title_2 = `English Reverse`
    title_3 = `English Pythagorean`
  }

  else if (current_lang === `es`) {
    mode_desc = `Spanish Gematria`
    title_1 = `Spanish Ordinal`
    title_2 = `Spanish Reverse`
    title_3 = `Spanish Pythagorean`
  }

  else if (current_lang === `he`) {
    mode_desc = `Hebrew/Jewish Gematria`
    title_1 = `Jewish Standard`
    title_2 = `Jewish Ordinal`
    title_3 = `Jewish Reduced`
    title_4 = `Jewish Atbash`
  }

  let strings_ord = solve(text, `ord`, current_lang)
  let strings_rev = solve(text, `rev`, current_lang)
  let strings_pyt = solve(text, `pyt`, current_lang)
  let strings_atb = solve(text, `atb`, current_lang)

  let box_texts = []

  let append_data = function (title, data) {
    if (data[0] !== `0`) {
      box_texts.push(`${title}\ndec:  ${data[0]}\nbin:  ${data[1]}\nhex:  ${data[2]}\noct:  ${data[3]}`)
    }
  }

  append_data(title_1, strings_ord)
  append_data(title_2, strings_rev)
  append_data(title_3, strings_pyt)

  if (current_lang === `he`) {
    append_data(title_4, strings_atb)
  }

  if (!box_texts.length) {
    return
  }

  let raw_data = box_texts.join(`\n\n`)
  let prompt = `Analyze the following gematria and numerological data calculated using ${mode_desc} for the query "${text}". Focus on uncovering symbolic patterns, cultural references, and numerological interpretations across the different ciphers and base conversions. Explore the thematic or esoteric weight of the numbers, highlighting any synchronicities or deeper conceptual associations. Do not focus on the strict mathematics or provide standard debunks; instead, offer a rich, interpretive reading of the symbols and alignments present in the data.\n\nData readout:\n\n${raw_data}`

  navigator.clipboard.writeText(prompt).then(() => {
    let btn = $(`#prompt_btn`)
    btn.innerText = `[ COPIED ]`

    setTimeout(() => {
      btn.innerText = `LLM`
    }, 2000)
  })
}