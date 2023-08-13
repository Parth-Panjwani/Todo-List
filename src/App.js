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

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [itemJsonArray, setItemJsonArray] = useState([]);
    const [taskStatus, setTaskStatus] = useState('all'); // Renamed filter to taskStatus

    useEffect(() => {
        document.title = 'To-Do List';
        update();
    }, []);

    function getAnUpdate() {
        const tit = document.getElementById('title').value;
        const desc = document.getElementById('description').value;

        const newItem = [tit, desc, false];

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

    function update() {
        if (localStorage.getItem('itemJson') === null) {
            setItemJsonArray([]);
        } else {
            const itemJsonArrayStr = localStorage.getItem('itemJson');
            const existingArray = JSON.parse(itemJsonArrayStr);
            setItemJsonArray(existingArray);
        }
    }

    function deleted(itemIndex) {
        const itemJsonArrayStr = localStorage.getItem('itemJson');
        let itemArray = JSON.parse(itemJsonArrayStr);
        itemArray.splice(itemIndex, 1);
        localStorage.setItem('itemJson', JSON.stringify(itemArray));
        update();
    }

    function clearStr() {
        if (window.confirm('Do you really want to clear?')) {
            localStorage.clear();
            update();
        }
    }

    function toggleCompleted(index) {
        const updatedArray = itemJsonArray.map((item, i) => {
            if (i === index) {
                return [item[0], item[1], !item[2]];
            }
            return item;
        });
        localStorage.setItem('itemJson', JSON.stringify(updatedArray));
        setItemJsonArray(updatedArray);
        if (taskStatus === 'all') {
            update();
        }
    }

    function renderTasks() {
        return itemJsonArray
            .filter(item => {
                if (taskStatus === 'active') { // Renamed filter to taskStatus
                    return !item[2];
                } else if (taskStatus === 'completed') { // Renamed filter to taskStatus
                    return item[2];
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
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            To-Do List
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md" style={{ marginTop: '2rem' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        To-Do List
                    </Typography>
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
                        <Typography variant="h5">Your Items</Typography>
                        <ButtonGroup
                            variant="text"
                            aria-label="text primary button group"
                            style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
                        >
                            <ToggleButtonGroup
                                value={taskStatus} // Renamed filter to taskStatus
                                exclusive
                                onChange={(event, newStatus) => setTaskStatus(newStatus)} // Renamed filter to taskStatus
                            >
                                <ToggleButton value="all">All</ToggleButton>
                                <ToggleButton value="active">Active</ToggleButton>
                                <ToggleButton value="completed">Completed</ToggleButton>
                            </ToggleButtonGroup>
                        </ButtonGroup>
                        {itemJsonArray.length === 0 ? (
                            <Alert severity="info" style={{ marginTop: '1rem' }}>
                                No items added yet.
                            </Alert>
                        ) : (
                            <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sr. No</TableCell>
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
