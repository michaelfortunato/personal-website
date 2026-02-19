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
  // inline
  #show math.equation.where(block: false): it => context {
    if target() == "html" {
      let rendered = html.span(
        class: "inline-block",
        html.frame(it),
      )
      if it.has("label") {
        let lbl = it.label
        [#html.a(id: str(lbl))[] #rendered]
      } else { rendered }
    } else { it }
  }

  // block
  #show math.equation.where(block: true): it => context {
    if target() == "html" {
      // let rendered = html.div(
      //   class: ("math-display", "flex", "justify-center"),
      //   html.frame(it),
      // )

      let rendered = html.figure(
        class: ("math-display", "flex", "justify-center"),
        role: "math",
        html.frame(it),
      )
      if it.has("label") {
        let lbl = it.label
        [#html.a(id: str(lbl))[] #rendered]
      } else { rendered }
    } else { it }
  }


  // HACK: This is nice because it attaches an empty <a></a>
  // tag to all labeled (ie `== foo <bar>`) headings
  // allowing me to reference them etc.
  // I've actually had no issue so far but see here out of abundance of
  // caution?
  // See: https://github.com/typst/typst/issues/6955?utm_source=chatgpt.com
  #show heading: it => context {
    if target() == "html" and it.has("label") {
      let lbl = it.label
      // [#html.a(id: str(lbl))[] #link(lbl, it)]
      [#html.a(id: str(lbl))[] #it]
    } else {
      it
    }
  }
  #doc
]

#let page(title: str, keywords: (), created_timestamp: none, doc) = [
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
  // #show quote: set align(left)
  // #show quote: set pad(x: 4em)
  // #show quote: set block(spacing: 1em) // Original 11pt.

  // // Configure spacing code snippets as in the original LaTeX.
  // #show raw.where(block: true): set block(spacing: 14pt) // TODO: May be 15pt?

  #metadata(title) <TITLE>
  #metadata(keywords) <KEYWORDS>
  #if type(created_timestamp) == datetime [
    #let unixBegin = datetime(day: 1, month: 1, year: 1970)
    // NOTE(Feb 2026): tinymist does not infer that duration is no longer none sadly
    #let duration_ms = int((created_timestamp - unixBegin).seconds() * 1000)
    #metadata(duration_ms) <CREATED_TIMESTAMP>
  ]
  #doc

  // HACK: This kind of works its not great though
  #context {
    if query(cite).len() > 0 {
      [= References]
    }
  }
  #bibliography("/posts/Zotero.bib", style: "apa", title: none)
]
