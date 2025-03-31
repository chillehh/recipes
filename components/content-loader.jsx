"use client"; // Ensure this runs only on the client side

import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";

const RecipeContentLoader = ({
	heading = { width: 200, height: 24 },
	row = 2,
	column = 5, // Default columns
	padding = 12,
	borderRadius = 4,
	...props
}) => {
	const [columns, setColumns] = useState(null);
	const [width, setWidth] = useState(null);

	useEffect(() => {
		const updateDimensions = () => {
			const screenWidth = window.innerWidth;

			// Calculate maximum possible column width that fits within screen
			const maxColumnWidth = 200; // The max width per column
			const availableWidth = screenWidth - padding * 2; // Subtract padding from both sides
			const newColumns = Math.floor(availableWidth / maxColumnWidth); // Calculate number of columns that fit

			// Make sure at least 1 column is rendered, and prevent more than 5 columns
			const finalColumns = Math.max(1, Math.min(newColumns, 5));

			// Calculate new width, which is based on the number of columns and padding
			const newWidth = finalColumns * maxColumnWidth + padding * (finalColumns + 1);

			setColumns(finalColumns); // Set the dynamic columns
			setWidth(newWidth); // Update the width based on columns and padding
		};

		updateDimensions(); // Set initial values on mount
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	if (columns === null || width === null) return null;

	const list = [];
	let height;

	for (let i = 1; i <= row; i++) {
		for (let j = 0; j < columns; j++) {
			const itemWidth = (width - padding * (columns + 1)) / columns;
			const x = padding + j * (itemWidth + padding);
			const height1 = itemWidth;
			const height2 = 20;
			const height3 = 20;
			const space = padding + height1 + (padding / 2 + height2) + height3 + padding * 4;
			const y1 = padding + heading.height + padding * 2 + space * (i - 1);
			const y2 = y1 + padding + height1;
			const y3 = y2 + padding / 2 + height2;
			const key = i + "-" + j;

			list.push(
				<React.Fragment key={key}>
					<rect x={x} y={y1} rx={borderRadius} ry={borderRadius} width={itemWidth} height={height1} />
					<rect x={x} y={y2} rx={0} ry={0} width={itemWidth} height={height2} />
					<rect x={x} y={y3} rx={0} ry={0} width={itemWidth * 0.6} height={height3} />
				</React.Fragment>
			);

			if (i === row) {
				height = y3 + height3;
			}
		}
	}

	return (
		<ContentLoader viewBox={`0 0 ${width} ${height}`} width={width} height={height}
			backgroundColor="#f5f6f7" foregroundColor="#b5b5b5" {...props}>
			{heading && <rect x={padding} y={padding} rx={0} ry={0} width={heading.width} height={heading.height} />}
			{list}
		</ContentLoader>
	);
};

export default RecipeContentLoader;