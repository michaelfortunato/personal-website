import { createTheme } from "@mui/material/styles";
const indexTheme = createTheme({
	palette: {
		primary: {
			main: "#e6af4b"
		},
		secondary: {
			main: "#264653"
		}
	}
});
const aboutTheme = createTheme({
	palette: {
		primary: {
			main: "#14213D"
		},
		secondary: {
			main: "#fafafa"
		},
		text: {
			primary: "#fff"
		}
	}
});
const blogTheme = createTheme({
	palette: {
		primary: {
			main: "#14213D"
		},
		secondary: {
			main: "#fafafa"
		}
	}
});
const projectsTheme = createTheme({
	palette: {
		primary: {
			main: "#D5E5E5"
		}
	}
});

export { indexTheme, aboutTheme, blogTheme, projectsTheme };
