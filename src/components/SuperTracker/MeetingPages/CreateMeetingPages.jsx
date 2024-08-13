import { Box, Modal, Typography, Button, TextField } from '@mui/material'
import axios from 'axios';
import FormContainer from '../../AdminPanel/FormContainer';
import FieldContainer from '../../AdminPanel/FieldContainer';
import Select from 'react-select'
import jwtDecode from "jwt-decode";
import { useState } from 'react';

const achievedStatus = [
    { value: 1, label: "Achieved" },
    { value: 2, label: "UnAchieved" }
];

const CreateMeetingPages = ({ open, onClose, onCreate, creatorDetail }) => {
    const [discussion, setDiscussion] = useState('');
    const [outCome, setOutCome] = useState('');
    const [nextFollowUp, setNextFollowUp] = useState(null);
    const [status, setStatus] = useState(null); 
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const loginUserId = decodedToken.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://insights.ist:8080/api/v1/community/page_meeting', {
                poc: loginUserId,
                discussion: discussion,
                outcome: outCome,
                meeting_via: "66b22471db4bf41557e21ba8",
                next_follow_up: nextFollowUp,
                achieved: status?.value, // Use the selected status value
                page_name: creatorDetail?.creatorName
            });
            onCreate();
            onClose();
        } catch (error) {
            console.error('Error creating meeting page:', error);
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="create-meeting-page-modal"
                aria-describedby="create-meeting-page-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    <Box>
                        <FormContainer
                            mainTitle="Create Meeting Page "
                            handleSubmit={handleSubmit}
                            title={'Create Data'}
                        >
                            <FieldContainer
                                label="Discussion"
                                type="text"
                                fieldGrid={4}
                                value={discussion}
                                required={false}
                                onChange={(e) => setDiscussion(e.target.value)}
                            />
                            <FieldContainer
                                label="Out Come"
                                type="text"
                                fieldGrid={4}
                                value={outCome}
                                required={false}
                                onChange={(e) => setOutCome(e.target.value)}
                            />
                            <FieldContainer
                                label="Next Follow-Up"
                                type="date"
                                fieldGrid={4}
                                value={nextFollowUp}
                                required={false}
                                onChange={(e) => setNextFollowUp(e.target.value)}
                            />
                            <div className="form-group col-3">
                                <label className="form-label">
                                    Meeting Via
                                </label>
                                <Select
                                    className=""
                                    // Add options and onChange logic if needed
                                    required={false}
                                />
                            </div>
                            <div className="form-group col-3">
                                <label className="form-label">
                                    Status<sup className="form-error">*</sup>
                                </label>
                                <Select
                                    className=""
                                    options={achievedStatus.map((option) => ({
                                        value: option.value,
                                        label: option.label,
                                    }))}
                                    onChange={(selectedOption) => setStatus(selectedOption)} // Update status on selection
                                    required={false}
                                />
                            </div>
                        </FormContainer>
                        <Button variant="outlined" color='error' onClick={onClose}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default CreateMeetingPages;
