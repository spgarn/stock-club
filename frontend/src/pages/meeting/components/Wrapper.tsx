import { ReactNode } from 'react';
import { Typography } from '@mui/material';
import meetingStyles from "../meeting.module.scss";
const Wrapper = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className={meetingStyles.wrapper}>
            <Typography variant="h5">{title}</Typography>
            <div className="content-box">
                {children}
            </div>
        </div>
    );
};

export default Wrapper;