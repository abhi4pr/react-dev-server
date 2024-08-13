import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiContextData } from '../../AdminPanel/APIContext/APIContext';

const CommunityUser = () => {
    const { userContextData } = useContext(ApiContextData);
    const navigate = useNavigate();
    const [managerData, setManagerData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Function to count pages per user and group pages
    const countPagesPerUser = (data) => {
        return data.reduce((acc, item) => {
            if (item.user_id) {
                if (!acc[item.user_id]) {
                    acc[item.user_id] = { count: 0, pages: [] };
                }
                acc[item.user_id].count += 1;
                acc[item.user_id].pages.push(item); // Store full page details
            }
            return acc;
        }, {});
    };

    const getManagerData = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/v1/community/community_user');
            const data = res.data.data;
            const counts = countPagesPerUser(data);

            // Create a map to store unique user data
            const userMap = new Map();
            data.forEach(item => {
                if (item.user_id) {
                    if (!userMap.has(item.user_id)) {
                        userMap.set(item.user_id, {
                            ...item,
                            page_count: counts[item.user_id].count,
                            pages: counts[item.user_id].pages
                        });
                    }
                }
            });

            // Convert map to array
            const uniqueUserData = Array.from(userMap.values());

            setManagerData(uniqueUserData);
        } catch (error) {
            console.error("Error fetching manager data", error);
        }
    };

    useEffect(() => {
        getManagerData();
    }, []);

    // Define columns for DataGrid
    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            valueGetter: (params) =>  managerData.indexOf(params.row),
            
            renderCell: (params) => {
                const rowIndex = managerData.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "User name",
            headerName: "User Name",
            width: 200,
            valueGetter: (params) =>  userContextData?.find(
                (user) => user.user_id === params.row.user_id
            )?.user_name || "N/A",
            renderCell: (params) =>
                userContextData?.find(
                    (user) => user.user_id === params.row.user_id
                )?.user_name || "N/A",
        },
        {
            field: "page_count",
            headerName: "Page Count",
            width: 150,
            renderCell: (params) => (
                <Button
                    color='error'
                    variant='outlined'
                    onClick={() => handleOpenModal(params.row)}
                >
                    {params.row.page_count}
                </Button>
            ),
        }
    ];

    // Function to open modal
    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => navigate('/admin/instaapi/community')}> Pages </Button>
                <Button onClick={() => navigate('/admin/instaapi/community/user')}> Users </Button>
            </ButtonGroup>

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={managerData}
                    columns={columns}
                    getRowId={(row) => row.user_id}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                />
            </Box>

            <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Page Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>

<div className='d-flex m-2 gap-2' >
    <h6>User : {userContextData?.find(user => user.user_id === selectedUser.user_id)?.user_name || "N/A"}</h6>
    <h6>Page Count : {selectedUser.page_count}</h6>
</div>
                            
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Page Name</th>
                                        <th scope="col">Manager</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {selectedUser.pages.map((page, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{page.page_name}</td>
                                            <td>{userContextData?.find(user => user.user_id === page.report_to)?.user_name }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="error" variant='outlined'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CommunityUser;
