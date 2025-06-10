import ReactMarkdown from "react-markdown";

export function MarkdownView(content: string) {
	return (<div className="markdown">
		<ReactMarkdown>{
			content
		}</ReactMarkdown>
	</div>
	)
}