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
let abc_es = `abcdefghijklmn\u00f1opqrstuvwxyz`

function numb () {
	let text = $(`#numba`).value.trim()
	let strings_en = solve(text, "en")
	let strings_es = solve(text, "es")
	let s = `
		<div>${text}</div>

		<div>
			<div>en_dec:&nbsp;&nbsp;${strings_en[0]}</div>
			<div>en_bin:&nbsp;&nbsp;${strings_en[1]}</div>
			<div>en_hex:&nbsp;&nbsp;${strings_en[2]}</div>
			<div>en_oct:&nbsp;&nbsp;${strings_en[3]}</div>
		</div>

		<div>
			<div>es_dec:&nbsp;&nbsp;${strings_es[0]}</div>
			<div>es_bin:&nbsp;&nbsp;${strings_es[1]}</div>
			<div>es_hex:&nbsp;&nbsp;${strings_es[2]}</div>
			<div>es_oct:&nbsp;&nbsp;${strings_es[3]}</div>
		</div>
		`

	$(`#result`).innerHTML = s
	$(`#numba`).focus()
}

function solve (text, mode) {
	let sum = 0
	let split = text.split(``)

	for (let i=0; i<split.length; i++) {
		let c = split[i].toLowerCase()

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

			if (indx != -1) {
				sum += indx + 1
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
	let split = sum.toString().split(``)

	for (n of split) {
		num += parseInt(n)
	}

	s += ` -> ${num}`

	if (num > 9) {
		return deconstruct(num, s)
	}

	return s
}

function replace_bin (s) {
	return s.replace(/\d+/g, function (match) {
		return parseInt(match).toString(2)
	})
}

function replace_oct (s) {
	return s.replace(/\d+/g, function (match) {
		return parseInt(match).toString(8)
	})
}

function replace_hex (s) {
	return s.replace(/\d+/g, function (match) {
		return parseInt(match).toString(16)
	})
}