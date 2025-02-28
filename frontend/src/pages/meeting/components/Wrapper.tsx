import { ReactNode, forwardRef } from 'react';
import { Typography } from '@mui/material';
import meetingStyles from "../meeting.module.scss";

interface WrapperProps {
    title: string;
    children: ReactNode;
    onClick?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const Wrapper = forwardRef<HTMLDivElement, WrapperProps>(
    ({ title, children, onClick, ...rest }, ref) => {
        return (
            <div ref={ref} onClick={onClick} className={meetingStyles.wrapper} {...rest}>
                <Typography variant="h5">{title}</Typography>
                <div className="content-box">
                    {children}
                </div>
            </div>
        );
    }
);

export default Wrapper;