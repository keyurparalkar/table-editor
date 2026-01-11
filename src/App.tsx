import TableEditor from "./ui/Grid/table-editor";

function App() {
	return (
		<>
			<h1>Table Editor </h1>
			<TableEditor defaultColumns={2} defaultRows={3} />
		</>
	);
}

export default App;
