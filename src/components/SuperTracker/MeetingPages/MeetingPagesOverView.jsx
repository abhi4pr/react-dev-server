import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { IconButton } from '@mui/material';
import CreateMeetingPages from "./CreateMeetingPages";

const MeetingPagesOverView = () => {
    const location = useLocation();
    const { creatorDetail } = location.state || {}
    const navigate = useNavigate();
    console.log(creatorDetail);
    const [meetingPage, setMeetingpage] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const getMeetingPages = async () => {
        const res = await axios.get('https://insights.ist:8080/api/v1/community/page_meeting');
        setMeetingpage(res.data.data);
    };

    useEffect(() => {
        getMeetingPages();
    }, []);

    const handleEdit = (row) => {
        console.log('edit', row);
    };

    const handleDelete = (row) => {
        console.log('delete', row);
    };

    const handleCreate = () => {
        getMeetingPages(); 
    };

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = meetingPage.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "poc",
            headerName: "Achieved",
            width: 160,
        },
        {
            field: "discussion",
            headerName: "Discussion",
            width: 160,
        },
        {
            field: "meeting_via",
            headerName: "Meeting Via",
            width: 160,
        },
        {
            field: "next_follow_up",
            headerName: "Next Follow Up",
            width: 180,
        },
        {
            field: "outcome",
            headerName: "Outcome",
            width: 150,
        },
        {
            field: "page_name",
            headerName: "Page Name",
            width: 150,
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 100,
        },
        {
            field: "action",
            headerName: "Action",
            width: 180,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleEdit(params.row)} color="primary">
                        <i className="bi bi-pencil-square"></i>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row)} color="error">
                        <i className="bi bi-trash3"></i>
                    </IconButton>
                </div>
            ),
        }
    ];

    return (
        <div>
            <Box sx={{ ml: 1, mb: 2 }}>
                <Typography variant="h5">Meeting Pages</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setModalOpen(true)}
                >
                    + Create
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/admin/instaapi/community/manager/pasandidddaaurat")}
                >
                    Go Pages
                </Button>
            </Box>
            <DataGrid
                rows={meetingPage}
                columns={columns}
                getRowId={(row) => row._id}
            />
            <CreateMeetingPages
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreate}
                creatorDetail={creatorDetail}
            />
        </div>
    );
};

export default MeetingPagesOverView;
