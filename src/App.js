import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Toolbar,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ButtonGroup,
    ToggleButton,
    ToggleButtonGroup,
    Checkbox,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@mui/material';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [itemJsonArray, setItemJsonArray] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        update();
    }, []);

    // Function to add a new task
    function getAnUpdate() {
        console.log('Updating list...');
        const tit = document.getElementById('title').value;
        const desc = document.getElementById('description').value;

        const newItem = [tit, desc, false]; // [title, description, completed]

        if (localStorage.getItem('itemJson') === null) {
            const newArray = [newItem];
            localStorage.setItem('itemJson', JSON.stringify(newArray));
            setItemJsonArray(newArray);
        } else {
            const itemJsonArrayStr = localStorage.getItem('itemJson');
            const existingArray = JSON.parse(itemJsonArrayStr);
            const updatedArray = [...existingArray, newItem];
            localStorage.setItem('itemJson', JSON.stringify(updatedArray));
            setItemJsonArray(updatedArray);
        }
    }

    // Function to initialize or update the task list
    function update() {
        console.log('Updating list...');

        if (localStorage.getItem('itemJson') === null) {
            setItemJsonArray([]);
        } else {
            const itemJsonArrayStr = localStorage.getItem('itemJson');
            const existingArray = JSON.parse(itemJsonArrayStr);
            setItemJsonArray(existingArray);
        }
    }

    // Function to delete a task
    function deleted(itemIndex) {
        console.log('Delete', itemIndex);
        const itemJsonArrayStr = localStorage.getItem('itemJson');
        let itemArray = JSON.parse(itemJsonArrayStr);
        itemArray.splice(itemIndex, 1);
        localStorage.setItem('itemJson', JSON.stringify(itemArray));
        update();
    }

    // Function to clear the task list
    function clearStr() {
        if (window.confirm('Do you really want to clear?')) {
            console.log('Clearing the contents...');
            localStorage.clear();
            update();
        }
    }

    // Function to toggle the completed status of a task
    function toggleCompleted(index) {
        const updatedArray = itemJsonArray.map((item, i) => {
            if (i === index) {
                return [item[0], item[1], !item[2]]; // Toggle the completed status
            }
            return item;
        });
        localStorage.setItem('itemJson', JSON.stringify(updatedArray));
        setItemJsonArray(updatedArray);
        if (filter === 'all') {
            update();
        }
    }

    // Function to render the task list based on the selected filter
    function renderTasks() {
        return itemJsonArray
            .filter(item => {
                if (filter === 'active') {
                    return !item[2]; // Active items have completed status false
                } else if (filter === 'completed') {
                    return item[2]; // Completed items have completed status true
                }
                return true; // 'all' filter
            })
            .map((element, index) => (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{element[0]}</TableCell>
                    <TableCell>{element[1]}</TableCell>
                    <TableCell>
                        <Checkbox
                            checked={element[2]}
                            onChange={() => toggleCompleted(index)}
                            color="primary"
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton
                            onClick={() => deleted(index)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ));
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box>
                {/* AppBar */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            TODO's List
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    {/* App Title */}
                    <Typography variant="h4" align="center" gutterBottom>
                        TODO's List
                    </Typography>
                    {/* Task Input */}
                    <Paper elevation={3} style={{ padding: '1rem' }}>
                        <TextField
                            id="title"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            style={{ marginBottom: '1rem' }}
                        />
                        {/* Add and Clear Buttons */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={getAnUpdate}
                            style={{ marginRight: '1rem' }}
                        >
                            Add to List
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={clearStr}
                        >
                            Clear List
                        </Button>
                    </Paper>
                    <Box marginTop="2rem">
                        {/* Filter Buttons */}
                        <Typography variant="h5">Your Items</Typography>
                        <ButtonGroup
                            variant="text"
                            aria-label="text primary button group"
                            style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
                        >
                            <ToggleButtonGroup
                                value={filter}
                                exclusive
                                onChange={(event, newFilter) => setFilter(newFilter)}
                            >
                                <ToggleButton value="all">All</ToggleButton>
                                <ToggleButton value="active">Active</ToggleButton>
                                <ToggleButton value="completed">Completed</ToggleButton>
                            </ToggleButtonGroup>
                        </ButtonGroup>
                        {/* Task List */}
                        {itemJsonArray.length === 0 ? (
                            <Alert severity="info" style={{ marginTop: '1rem' }}>
                                No items added yet.
                            </Alert>
                        ) : (
                            <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>SNo</TableCell>
                                            <TableCell>Item Title</TableCell>
                                            <TableCell>Item Description</TableCell>
                                            <TableCell>Completed</TableCell>
                                            <TableCell>Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderTasks()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
