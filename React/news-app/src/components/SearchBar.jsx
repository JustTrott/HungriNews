import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	return (
		<TextField
			label="Поиск"
			variant="outlined"
			value={searchQuery}
			onChange={handleSearchChange}
			sx={{ mb: 2, width: "100%", maxWidth: "500px" }}
		/>
	);
};

export default SearchBar;
