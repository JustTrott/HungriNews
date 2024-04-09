import React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { styled } from "@mui/system";

const SortBottomNavigationAction = styled(BottomNavigationAction)(`
  &.Mui-selected {
    color: green;
  }
`);

export default function SortNavigation({ setPage, sortType, setSortType }) {
	return (
		<Box sx={{ width: 500, display: "flex", justifyContent: "flex-start" }}>
			<BottomNavigation
				showLabels
				value={sortType}
				onChange={(event, newSortType) => {
					setSortType(newSortType);
					setPage(1);
				}}
				sx={{
					flexGrow: 1,
					display: "flex",
					justifyContent: "flex-start",
				}}
			>
				<SortBottomNavigationAction value="date" label="Последние" />
				<SortBottomNavigationAction value="views" label="Популярные" />
			</BottomNavigation>
		</Box>
	);
}
