import React from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import { useArticles } from "./ArticleContext";

function NewsPage({ articles }) {
	// const articles = useArticles();
	const { slug } = useParams();
	console.log(articles);
	const article = articles.find((article) => article.slug === slug);
	if (!article) {
		return <div>Article not found</div>; // You can render a more sophisticated error component here
	}
	return (
		<Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
			<Paper elevation={1}>
				<Box p={2} px={4}>
					<Typography variant="body1">
						{new Date(article.date).toLocaleString("ru-RU", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</Typography>
					<Typography variant="h2" gutterBottom>
						{article.title}
					</Typography>
					<Box
						display={"flex"}
						alignItems={"center"}
						justifyContent={"space-between"}
					>
						<Box display={"flex"} alignItems={"center"}>
							<VisibilityOutlinedIcon
								fontSize="1rem"
								sx={{ mr: "0.5rem" }}
							/>
							<Typography variant="body2">
								{article.views}
							</Typography>
						</Box>
					</Box>
					<Box display={"flex"} justifyContent={"center"} my={2}>
						<Box
							component={"img"}
							sx={{ width: "100%" }}
							src={article.image}
							alt={article.slug}
						/>
					</Box>
					<Typography variant="h6">{article.description}</Typography>
					<Divider />
					<Typography variant="body1">{article.body}</Typography>
				</Box>
			</Paper>
		</Container>
	);
}

export default NewsPage;
