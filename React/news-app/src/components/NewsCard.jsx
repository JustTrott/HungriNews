import React from "react";
import {
	ButtonBase,
	Typography,
	Card,
	CardActions,
	CardContent,
	Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
	position: "relative",
	height: 200,
	[theme.breakpoints.down("sm")]: {
		width: "100% !important",
		height: 100,
	},
}));

const ImageSrc = styled("span")({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: "cover",
	backgroundPosition: "center 40%",
});

function NewsCard({ article }) {
	return (
		<Card>
			<ImageButton
				component={Link}
				to={article.slug}
				focusRipple
				key={article.title}
				style={{
					width: "100%",
				}}
			>
				<ImageSrc
					style={{ backgroundImage: `url(${article.image})` }}
				/>
			</ImageButton>
			<CardContent sx={{ pb: 0 }}>
				<Typography variant="h5" gutterBottom>
					{article.title}
				</Typography>
			</CardContent>
			<CardActions sx={{ mb: 1, ml: 1 }}>
				<Typography variant="caption">
					{new Date(article.date).toLocaleString("ru-RU", {
						year: "numeric",
						month: "long",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</Typography>
				<Box display={"flex"} alignItems={"center"}>
					<VisibilityOutlinedIcon
						fontSize="100"
						sx={{ ml: "0.5rem", mr: "0.5rem" }}
					/>
					<Typography variant="caption" sx={{ marginLeft: "auto" }}>
						{article.views}
					</Typography>
				</Box>
			</CardActions>
		</Card>
	);
}

export default NewsCard;
