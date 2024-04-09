import React, { useState, useEffect } from "react";
import { Pagination, Grid, Container, Divider, Box } from "@mui/material";
import NewsCard from "./NewsCard";
import SearchBar from "./SearchBar";
import SortNavigation from "./SortNavigation";
import { styled } from "@mui/system";

const OutContainer = styled(Container)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(8, 0, 6),
}));

const Home = ({ articles }) => {
	const [page, setPage] = React.useState(1);
	const [sortType, setSortType] = useState("views");
	const [searchQuery, setSearchQuery] = useState("");
	const articlesPerPage = 6;

	const handleChange = (event, value) => {
		setPage(value);
	};

	const sortedArticles = [...articles].sort((a, b) => {
		if (sortType === "views") {
			return b.views - a.views;
		} else if (sortType === "date") {
			return new Date(b.date) - new Date(a.date);
		} else {
			return 0;
		}
	});

	const filteredArticles = sortedArticles.filter((article) =>
		article.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		setPage(1);
	}, [filteredArticles.length]);

	const paginatedArticles = filteredArticles.slice(
		(page - 1) * articlesPerPage,
		page * articlesPerPage
	);

	return (
		<OutContainer maxWidth="lg">
			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<SortNavigation
					sortType={sortType}
					setPage={setPage}
					setSortType={setSortType}
				/>
				<SearchBar
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			</Box>
			<Divider sx={{ mb: 2 }} />
			<Grid container spacing={4}>
				{paginatedArticles.map((article, index) => (
					<Grid item xs={4} key={index}>
						<NewsCard article={article} />
					</Grid>
				))}
			</Grid>
			<Pagination
				sx={{ display: "flex", justifyContent: "center", mt: 4 }}
				count={Math.ceil(filteredArticles.length / articlesPerPage)}
				page={page}
				onChange={handleChange}
			/>
		</OutContainer>
	);
};

export default Home;
