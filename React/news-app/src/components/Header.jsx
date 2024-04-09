import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Newspaper } from "@mui/icons-material";
import { ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<AppBar position="relative">
			<Toolbar>
				<ButtonBase component={Link} to="/">
					<Newspaper />
					<Typography variant="h6">Hungri NEWS</Typography>
				</ButtonBase>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
