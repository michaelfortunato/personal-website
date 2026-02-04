# Typst Posts (Rheo)

This folder is for blog posts written in Typst and compiled to HTML using
[`rheo`](https://rheo.ohrg.org).

## Structure

Each post is a folder:

```
content/typst/<post-id>/
  index.typ
  meta.json
```

Compiled output is committed under:

```
public/typst/<post-id>/html/index.html
public/typst/<post-id>/html/style.css
```

The website detects Typst posts by checking for:

- `content/typst/<post-id>/meta.json`
- `content/typst/<post-id>/index.typ`
- `public/typst/<post-id>/html/index.html`

## Install Rheo

Rheo is a standalone CLI tool. Install via:

```bash
cargo install --locked rheo
```

## Build

Build all Typst posts:

```bash
npm run rheo:build
```

Build one post:

```bash
npm run rheo:build -- <post-id>
```
