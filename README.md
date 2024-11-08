# DataBodh

Master Your Data: Seamlessly Convert, Explore, and Transform File Formats with Ease!

## Features

1. File Upload

	•	Users can upload JSON, NDJSON, and CSV files to the app.

	•	Uploaded files are parsed, and the data is displayed in a structured, searchable table format.

2. Data Exploration

	•	Once the data is loaded, users can explore it within a list view.

	•	The app supports searching across all columns and filtering data based on user input.

3. Search and Pagination

	•	Users can search for specific entries across all columns, enabling fast data exploration.

	•	Pagination is applied to manage large datasets and improve performance, allowing users to navigate through their data.

4. Customizable Table View

	•	Users can choose which columns to show or hide based on their preferences.

	•	This feature enables users to focus on relevant data without clutter.

## Future Features (Planned Extensions)

The app has been designed with future expansion in mind. Here are some additional features that will be implemented in future updates:

1.	File Conversion:

    - Allow users to convert data between different file formats (e.g., JSON to CSV, CSV to NDJSON).

2.	AI-Powered Data Insights:

    -	Incorporate AI-based features for enhanced data exploration, providing insights and recommendations based on data patterns.

3.	Support for More Data Types:

    -	Add support for additional data formats (e.g., XML, Excel) to broaden compatibility.

4.	URL-Based Data Loading:

    -	Allow users to load data directly from a URL, expanding the app’s flexibility for remote datasets.

## Getting Started

### Prerequisites

- 	Node.js and npm installed on your local machine.


### Installation


1.	Clone the repository:

```sh
git clone https://github.com/przbadu/databodh.git
cd databodh
```

2.	Install dependencies:

```sh
npm install
```

3.	Run the app in development mode:

```sh
npm run dev
```

4.	Open http://localhost:3000 in your browser to view the app.

Building for Production

To create an optimized production build, run:

```sh
npm run build
```

### Project Structure

-	src/app/page.tsx: The main component that handles data upload, parsing, and rendering.
-	components/ui: Contains UI components like table, dropdown menu, card, input, button, etc., used to build the interactive interface.

### Usage

1.	Upload a File: Drag and drop a file or use the file upload button.
2.	Explore Data: View the uploaded data in a table format.
3.	Search and Filter: Use the search input to filter data entries based on keyword matches.
4.	Show/Hide Columns: Use the column visibility options to customize the table view.
5.	Navigate Through Pages: Use pagination controls to view additional data pages.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with any improvements or bug fixes.
