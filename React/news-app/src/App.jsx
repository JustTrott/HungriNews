import React, { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import api from "./api";
import Header from "./components/Header";
import Home from "./components/Home";
import NewsPage from "./components/NewsPage";
import { Routes, Route } from "react-router-dom";
// import { ArticleProvider } from "./components/ArticleContext";

const App = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchArticles = async () => {
		try {
			const response = await api.get("/articles");
			setArticles(response.data);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch articles", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	if (loading) {
		return <div>Loading...</div>; // Or some loading spinner
	}
	return (
		<ThemeProvider theme={createTheme()}>
			<CssBaseline />
			<Header />
			<Routes>
				<Route
					path="/:slug"
					element={<NewsPage articles={articles} />}
				/>
				<Route path="/" element={<Home articles={articles} />} />
			</Routes>
		</ThemeProvider>
	);
};

export default App;
