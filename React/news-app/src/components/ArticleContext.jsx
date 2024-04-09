import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api";
const ArticleContext = createContext();

export const useArticles = () => {
	return useContext(ArticleContext);
};

export const ArticleProvider = ({ children }) => {
	const [articles, setArticles] = useState([]);
	const fetchArticles = async () => {
		const response = await api.get("/articles");
		setArticles(response.data);
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	return (
		<ArticleContext.Provider value={articles}>
			{children}
		</ArticleContext.Provider>
	);
};
