import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export type Post = {
	id: string;
	[key: string]: any; // TODO: Type correctly
};

export type PostData = {
	id: string;
	[key: string]: any; // TODO: Type correctly
};

export async function getPostData(id: string): Promise<PostData> {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf-8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	return {
		id,
		...matterResult.data
	};
}

export async function getAllPostIds() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   }
	// ]
	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, "")
			}
		};
	});
}

export async function getAllPosts(): Promise<Post[]> {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData: { id: string; [key: string]: any }[] = fileNames.map(
		fileName => {
			// Remove ".md" from file name to get id
			const id = fileName.replace(/\.md$/, "");

			// Read markdown file as string
			const fullPath = path.join(postsDirectory, fileName);
			const fileContents = fs.readFileSync(fullPath, "utf8");

			// Use gray-matter to parse the post metadata section
			const matterResult = matter(fileContents);

			// Combine the data with the id
			return {
				id,
				...matterResult.data
			};
		}
	);
	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}
