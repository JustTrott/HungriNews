import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function NewsPage({ articles, updateArticle }) {
	const { slug } = useParams();
	const [currentArticle, setCurrentArticle] = useState(null);
	const [hasUpdatedViews, setHasUpdatedViews] = useState(false);
	useEffect(() => {
		const article = articles.find((article) => article.slug === slug);
		if (article && !hasUpdatedViews) {
			api.post(`/add-view/${article.id}`).then((response) => {
				const updatedArticle = {
					...article,
					views: response.data,
				};
				setCurrentArticle(updatedArticle);
				updateArticle(updatedArticle);
				setHasUpdatedViews(true);
			});
		}
	}, [slug, articles, updateArticle, hasUpdatedViews]);

	if (!currentArticle) {
		const tempArticle = articles.find((article) => article.slug === slug);
		if (tempArticle) {
			setCurrentArticle({ ...tempArticle, views: tempArticle.views + 1 });
		}
		return;
	}

	return (
		<Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
			<Paper elevation={1}>
				<Box p={2} px={4}>
					<Typography variant="body1">
						{new Date(currentArticle.date).toLocaleString("ru-RU", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})}
					</Typography>
					<Typography variant="h2" gutterBottom>
						{currentArticle.title}
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
								{currentArticle.views}
							</Typography>
						</Box>
					</Box>
					<Box display={"flex"} justifyContent={"center"} my={2}>
						<Box
							component={"img"}
							sx={{ width: "100%" }}
							src={currentArticle.image}
							alt={currentArticle.slug}
						/>
					</Box>
					<Typography variant="h6">
						{currentArticle.description}
					</Typography>
					<Divider />
					<Typography variant="body1">
						{currentArticle.body.split("\n").map((text, index) => (
							<React.Fragment key={index}>
								{text}
								<br />
							</React.Fragment>
						))}
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
}

export default NewsPage;
