// Default font sizes from original LaTeX style file.
// TODO: See if we want to use this
#let FONT_DEFAULTS = (
  tiny: 7pt,
  scriptsize: 7pt,
  footnotesize: 9pt,
  small: 9pt,
  normalsize: 10pt,
  large: 14pt,
  Large: 16pt,
  LARGE: 20pt,
  huge: 23pt,
  Huge: 28pt,
)

#let output_html(doc) = context [
  // Inline equations: wrap in a box on HTML so they don't break line layout.
  #show math.equation.where(block: false): it => context {
    if target() == "html" { box(html.frame(it)) } else { it }
  }

  // Block equations: frame only on HTML.
  #show math.equation.where(block: true): it => context {
    if target() == "html" { html.frame(it) } else { it }
  }
  // <link rel="preconnect" href="https://fonts.googleapis.com">
  // <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  // <link href="https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">

  #if target() == "html" {
    html.link(rel: "preconnect", href: "https://fonts.googleapis.com")
    html.link(
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
    )
    html.link(
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap",
    )
  }

  #doc
]

//
// #let output_html2(doc) = context [
//   #if target() == "html" {
//     [
//       #show math.equation.where(block: false): it => context {
//         if target() == "html" { box(html.frame(it)) } else { it }
//       }
//
//       // Block equations: frame only on HTML.
//       #show math.equation.where(block: true): it => context {
//         if target() == "html" { html.frame(it) } else { it }
//       }
//     ]
//   }
//
//   #doc
// ]

#let page(id: str, title: str, keywords: (), doc) = [
  #set document(
    author: "Michael Newman Fortunato",
    title: title,
    keywords: keywords,
  )
  // HTML export ignores #set text directive
  #set text(font: "STIX Two Text")
  // Our HTML export respects  the math.equation set text since we sub a frame
  #show math.equation: set text(font: "New Computer Modern Math")
  #show: output_html



  // #set page(
  //   paper: "us-letter",
  //   margin: (left: 1.5in, right: 1.5in, top: 1.0in, bottom: 1in),
  //   footer-descent: 25pt - 10pt,
  // )
  // #set par(justify: true, leading: 0.55em)

  // Configure quotation (similar to LaTeX's `quoting` package).
  #show quote: set align(left)
  #show quote: set pad(x: 4em)
  #show quote: set block(spacing: 1em) // Original 11pt.

  // // Configure spacing code snippets as in the original LaTeX.
  // #show raw.where(block: true): set block(spacing: 14pt) // TODO: May be 15pt?

  #metadata(id) <ID>
  #metadata(title) <TITLE>
  #metadata(keywords) <KEYWORDS>
  #doc

]

