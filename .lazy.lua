-- Example `~/.config/nvim/.lazy.lua` template
-- Everything is commented out; uncomment and tweak as needed.

return {
	"foo",
	virtual = true,
	dependencies = { "L3MON4D3/LuaSnip" },
	config = function()
		local s = require("luasnip").extend_decorator.apply(require("luasnip").snippet, { hidden = true })
		local fmta = require("luasnip.extras.fmt").fmta
		local i = require("luasnip").insert_node
		local line_begin = require("luasnip.extras.expand_conditions").line_begin
		require("luasnip").add_snippets("typst", {
			s(
				{ trig = "DOC", snippetType = "autosnippet" },
				fmta(
					[[
#import "/posts/_utils/lib.typ" as lib
#show: lib.page.with(title: "<>", keywords: ("<>"))
<>]],
					{
						i(1, "Untitled"),
						i(2, "daily"),
						i(0),
					}
				),
				{ condition = line_begin } --TODO: Condition should be begining of file!
			),
		})
	end,
}

-- =========================
-- 1. Key MAPPINGS
-- =========================

-- vim.keymap.set("n", "<leader>h", ":split<CR>", { noremap = true, silent = true,
--  expr = true, -- treat the Lua return as a key‑sequence
-- })
-- vim.keymap.set("n", "<leader>v", ":vsplit<CR>", { noremap = true, silent = true })
-- vim.keymap.set("n", "<leader>rn", function()
--   vim.opt.relativenumber = not vim.opt.relativenumber:get()
-- end, { noremap = true, silent = true })
-- vim.keymap.del("n", "<leader>h")
-- vim.keymap.set("n", "<leader>f", "<cmd>Telescope find_files<CR>", { noremap = true, silent = true })

-- =========================
-- 2. AUTOCOMMANDS
-- =========================

-- vim.api.nvim_create_autocmd("BufWritePre", {
--   pattern = "*.lua",
--   callback = function()
--     vim.lsp.buf.format({ async = false })
--   end,
-- })

-- local pygrp = vim.api.nvim_create_augroup("PythonSettings", { clear = true })
-- vim.api.nvim_create_autocmd("FileType", {
--   group = pygrp,
--   pattern = "python",
--   callback = function()
--     vim.opt_local.shiftwidth = 4
--     vim.opt_local.tabstop   = 4
--   end,
-- })

-- =========================
-- 3. Minimal lazy.nvim SPEC
-- =========================

-- return {
--   {
--     "nvim-treesitter/nvim-treesitter",
--     build = ":TSUpdate",
--     lazy  = false,
--   },
--   {
--     "nvim-lualine/lualine.nvim",
--     event = "VimEnter",
--     opts  = {
--       options = {
--         theme               = "gruvbox",
--         section_separators  = "",
--         component_separators = "|",
--       },
--     },
--   },
--   {
--     "nvim-telescope/telescope.nvim",
--     cmd          = "Telescope",
--     dependencies = { "nvim-lua/plenary.nvim" },
--     opts         = {
--       defaults = { layout_strategy = "horizontal" },
--     },
--   },
-- }
