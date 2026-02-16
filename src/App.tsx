import TableEditor from "./ui/Grid/table-editor";

function App() {
	return (
		<div>
			<h1 className="text-4xl font-bold text-gray-900">Table Editor</h1>
			<br />
			<TableEditor defaultColumns={3} defaultRows={3} />
		</div>
	);
}

export default App;
