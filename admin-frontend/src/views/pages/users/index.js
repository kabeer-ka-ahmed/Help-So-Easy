import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableSortLabel,
    TableRow,
    Stack,
    Button,
    Grid,
    Avatar,
    Typography,
    CardMedia
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets

import { Edit, Delete } from '@mui/icons-material';

import UserModel from './UserModel';

import axios from 'utils/myAxios';

function createData(id, question, description, category) {
    return {
        id,
        question,
        description,
        category
    };
}

const rows = [
    createData(1, 'Plumber', 'This is a description about William', 'This is category'),
    createData(2, 'Mechanic', 'This is a description about William', 'This is category'),
    createData(3, 'Plumber', 'This is a description about William', 'This is category'),
    createData(4, 'Cook', 'This is a description about William', 'This is category'),
    createData(5, 'Electrician', 'This is a description about William', 'This is category'),
    createData(6, 'Laundry', 'This is a description about William', 'This is category'),
    createData(7, 'Plumber', 'This is a description about William', 'This is category'),
    createData(8, 'Driver', 'This is a description about William', 'This is category'),
    createData(9, 'Plumber', 'This is a description about William', 'This is category'),
    createData(10, 'Cleaner', 'This is a description about William', 'This is category'),
    createData(11, 'Gardener', 'This is a description about William', 'This is category'),
    createData(12, 'Travel Guide', 'This is a description about William', 'This is category'),
    createData(13, 'Teacher', 'This is a description about William', 'This is category'),
    createData(14, 'Cook', 'This is a description about William', 'This is category'),
    createData(15, 'Cleaner', 'This is a description about William', 'This is category'),
    createData(16, 'Gardener', 'This is a description about William', 'This is category')
];

// table filter
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header
const headCells = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'No'
    },
    {
        id: 'User',
        numeric: false,
        disablePadding: false,
        label: 'User '
    },
    {
        id: 'User email',
        numeric: false,
        disablePadding: false,
        label: 'User Email'
    },
    {
        id: 'User ID',
        numeric: false,
        disablePadding: false,
        label: 'User ID'
    },
    {
        id: 'Age',
        numeric: false,
        disablePadding: false,
        label: 'Age'
    },
    {
        id: 'Gender',
        numeric: false,
        disablePadding: false,
        label: 'Gender'
    },
    {
        id: 'Country',
        numeric: false,
        disablePadding: false,
        label: 'Country'
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action'
    }
];

// ==============================|| TABLE - HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        // align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default function Users() {
    const [open, setOpen] = React.useState(false);

    const [faqs, setFaqs] = React.useState([]);
    const [editId, setEditId] = React.useState();
    const [userId, setUserId] = React.useState();

    const [user, setUsers] = React.useState([]);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedValue, setSelectedValue] = React.useState([]);

    const getAllCategories = async () => {
        const response = await axios.get('/admin/all_users').catch((error) => {
            if (error.response) {
                console.error('Error Response:', error.response);
            } else {
                console.error('Error:', error.message);
            }
        });

        if (response && response.status === 200) {
            console.log(response.data.data);
            const fetchedData = response.data.data.users;
            setUsers([...fetchedData]);
        }
    };

    const handleClose = () => {
        setEditId();
        setUserId();
        setOpen(false);
        getAllCategories();
    };

    const handleOpen = (id, usersId) => {
        setEditId(id);
        setUserId(usersId);
        setOpen(true);
    };

    // const handleDeleteFaq = async(id) => {
    //     const faqId = id;
    //     const response = await axios.post('/admin/delete_faq', {faqId}).catch((error) => {
    //         if (error.response) {
    //             console.error('Error Response:', error.response);
    //         } else {
    //             console.error('Error:', error.message);
    //         }
    //     });

    //     if(response && response.status === 200) {
    //         getAllCategories()
    //     }
    // }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const navigate = useNavigate();

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.id);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        const selectedRowData = rows.filter((row) => newSelected.includes(row.id.toString()));
        setSelectedValue(selectedRowData);
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    React.useEffect(() => {
        getAllCategories();
    }, []);

    const currentYear = new Date().getFullYear();
    const [avatarOpen, setAvatarOpen] = React.useState(false);
    const [userAvatar, setUserAvatar] = React.useState(null);

    const handleAvatarOpen = (avatar) => {
        setAvatarOpen(true);
        setUserAvatar(avatar)
    };

    const handleAvatarClose = () => {
        setAvatarOpen(false);
        setUserAvatar(null)
    };

    return (
        <MainCard
            content={false}
            title="All Users"
            secondary={
                <Grid container sx={{ display: 'flex' }}>
                    {/* <Grid sx={{pr:3}}>
                <Button onClick={handleOpen}  sx={{background:"#06c404",color:"#FFFF",":hover":{
                  background:"#06c404",color:"#FFFF",
                 }}}> Users</Button>
                  
                </Grid> */}
                </Grid>
            }
        >
            <Dialog open={avatarOpen} onClose={handleAvatarClose} PaperProps={{ style: { margin: 0, padding: 0 } }}>
                <img src={userAvatar} alt='' style={{ width: '444px', height: 'auto' }} />
            </Dialog>
            {open ? <UserModel open={open} handleClose={handleClose} userId={userId} editId={editId || ''} /> : ''}
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}

                {/* table */}
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(user, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user, index) => {
                                    /** Make sure no display bugs if row isn't an OrderData object */
                                    if (typeof user === 'number') return null;
                                    const isItemSelected = isSelected(user.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, user.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            AvatarModal
                                            selected={isItemSelected}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" sx={{ color: '#212121' }}>
                                                {user.id}
                                            </TableCell>
                                            <TableCell sx={{ color: '#212121' }}>
                                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                                    <Grid item>
                                                        <Avatar
                                                            onClick={()=> {if(user.avatar){handleAvatarOpen(user.avatar)}}}
                                                            alt="User 1"
                                                            src={user.avatar}
                                                        />
                                                    </Grid>
                                                    <Grid item xs zeroMinWidth>
                                                        <Typography component="div" align="left" variant="subtitle1">
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell sx={{ color: '#616161' }}>{user.email}</TableCell>
                                            <TableCell sx={{ color: '#616161' }}>{user.user_id ? user.user_id : 'N/A'}</TableCell>
                                            <TableCell sx={{ color: '#616161' }}>
                                                {user.birth_year ? currentYear - user.birth_year : 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ color: '#616161' }}>{user.gender ? user.gender : 'N/A'}</TableCell>
                                            <TableCell sx={{ color: '#616161' }}>
                                                {user.fk_country_id ? user.RefCountry.name : 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{}}>
                                                <Stack sx={{ display: 'inline', cursor: 'pointer' }}>
                                                    <Edit
                                                        onClick={() => handleOpen(user.id, user.user_id)}
                                                        sx={{ color: '#02B100', m: 0.8 }}
                                                    />
                                                    {/* <Delete onClick={()=> handleDeleteFaq(faq.id)} sx={{ color: 'red', m: 0.8 }} /> */}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* table data */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
}
