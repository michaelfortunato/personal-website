-- Example `~/.config/nvim/.lazy.lua` template
-- Everything is commented out; uncomment and tweak as needed.

local today = {
	get_title = function(self)
		return os.date("%A, %B, %Y")
	end,
	get_filename = function()
		return os.date("%Y-%m-%d.typ")
	end,

	get_filepath = function(self)
		return vim.fs.joinpath(LazyVim.root(), "./posts/daily/", self:get_filename())
	end,

	get_template = function(self)
		return string.format(
			[[
#import "/posts/_utils/lib.typ" as lib
#show: lib.page.with(title: "%s", keywords: ("daily"))
]],
			self:get_title()
		)
	end,

	open = function(self)
		vim.cmd.edit(vim.fn.fnameescape(self:get_filepath()))
		local buf = vim.api.nvim_get_current_buf()
		local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)
		if #lines > 1 or lines[1] ~= "" then
			return
		end
		vim.api.nvim_buf_set_lines(
			buf,
			0,
			-1,
			false,
			vim.split(self:get_template(), "\n", { plain = true, trimempty = false })
		)
	end,
}

--- Copied right from my lsp.lua but with this added.
--- Merges perfectly with my lsp.lua. Though its unclear
--- if .lazy.lua is called first or if lsp.lua is called first.
vim.lsp.config("tinymist", {
	settings = {
		typstExtraArgs = {
			"--features=html",
			"--root=" .. LazyVim.root(),
		},
	},
})

vim.api.nvim_create_autocmd("FileType", {
	pattern = "typst",
	callback = function()
		local cmd = {
			"typst",
			"compile",
			"--root=" .. vim.fn.shellescape(LazyVim.root()),
			"--features=html",
			"%:S",
		}
		vim.opt_local.makeprg = vim.fn.join(cmd, " ")
	end,
})

-- =========================
-- 2. User Commands
-- =========================
vim.api.nvim_create_user_command("Daily", function()
	today:open()
end, { desc = "Open today's daily note." })

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
-- 2. User Commands
-- =========================
-- vim.api.nvim_create_user_command('Upper',
--   function(opts)
--     print(string.upper(opts.fargs[1]))
--   end,
--   { nargs = 1,
--     complete = function(ArgLead, CmdLine, CursorPos)
--       -- return completion candidates as a list-like table
--       return { "foo", "bar", "baz" }
--     end,
-- })

-- =========================
-- 3. AUTOCOMMANDS
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
-- 4. Minimal lazy.nvim SPEC
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
