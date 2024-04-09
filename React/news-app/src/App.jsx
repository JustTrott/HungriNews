import React, { useState, useEffect, useCallback } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import api from "./api";
import Header from "./components/Header";
import Home from "./components/Home";
import NewsPage from "./components/NewsPage";
import { Routes, Route } from "react-router-dom";

const App = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const updateArticle = useCallback((updatedArticle) => {
		setArticles((currentArticles) =>
			currentArticles.map((article) =>
				article.id === updatedArticle.id ? updatedArticle : article
			)
		);
	}, []);

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
		return;
	}
	return (
		<ThemeProvider theme={createTheme()}>
			<CssBaseline />
			<Header />
			<Routes>
				<Route
					path="/:slug"
					element={
						<NewsPage
							articles={articles}
							updateArticle={updateArticle}
						/>
					}
				/>
				<Route path="/" element={<Home articles={articles} />} />
			</Routes>
		</ThemeProvider>
	);
};

export default App;
