import { useQuery } from "@tanstack/react-query";
import { getEmails } from "../../api";
import Loading from "../../components/Loading";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function Decision() {
    const { id } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { data: emails } = useQuery({
        queryKey: ["club-emails"],
        queryFn: () => getEmails(),
    });

    if (!emails) {
        return <Loading />;
    }

    // Find the matching email
    const email = emails.find((email) => `email-${email.dateReceived}` === id);


    if (!email) {
        return (
            <Box sx={{ textAlign: "center", mt: 4, px: 2 }}>
                <Typography variant="h5" color="error">Email Not Found</Typography>
                <Typography variant="body1">The requested email does not exist.</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: isMobile ? "100%" : 800,
                width: "100%",
                margin: "auto",
                mt: isMobile ? 2 : 4,
                px: isMobile ? 2 : 0,
            }}
        >
            {/* Email Header in Paper */}
            <Paper
                elevation={3}
                sx={{
                    padding: isMobile ? 2 : 3,
                    mb: isMobile ? 2 : 3,
                    textAlign: isMobile ? "center" : "left",
                }}
            >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                    {email.subject}
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: isMobile ? "0.9rem" : "1rem", mt: 1 }}
                >
                    <strong>From:</strong> {email.from} | <strong>Received:</strong>{" "}
                    {dayjs(email.dateReceived).format("DD/MM/YYYY HH:mm")}
                </Typography>
            </Paper>

            {/* Email Content in Paper with NO Borders */}
            <Paper
                elevation={3}
                sx={{
                    padding: isMobile ? 2 : 3,
                    overflowX: "auto",
                    wordBreak: "break-word",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        fontWeight: "bold",
                        fontSize: isMobile ? "1.1rem" : "1.2rem",
                    }}
                >
                    Email Content:
                </Typography>

                {/* Styled Container for Email Body - No Borders */}
                <Box
                    sx={{
                        "& img": {
                            maxWidth: "100%",
                            height: "auto",
                            margin: "auto",
                        },
                        "& table": {
                            width: "100% !important",
                            maxWidth: "100%",
                            overflowX: "auto",
                            display: "block",
                            border: "none !important",
                        },
                        "& td, & th": {
                            border: "none !important", // Remove table cell borders
                        },
                        "& *": {
                            backgroundColor: "transparent !important", // Ensure background is clean
                            border: "none !important", // Force remove all borders
                            outline: "none !important",
                            fontFamily: "Arial, sans-serif !important",
                            lineHeight: "1.5 !important",
                        },
                        "& p": {
                            fontSize: "15px !important",
                            paddingY: "6px !important",
                        },
                        "& b, span": {
                            fontSize: "11px !important",
                        },
                        "& h1, & h2, & h3": {
                            fontSize: "22px !important",
                            fontWeight: "bold !important",
                        },
                        "& iframe": {
                            maxWidth: "100%",
                            width: "100%",
                        },
                    }}
                >
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanSignallistanContent(email.body)) }} />
                </Box>
            </Paper>
        </Box>
    );
}

// Function to clean and format Signallistan emails
const cleanSignallistanContent = (html: string) => {
    if (!html.includes("Signallistan")) return html; // Skip non-Signallistan emails

    // Remove everything after "Kalender" (modify this if needed)
    const splitPoint = html.indexOf("Kalender");
    if (splitPoint !== -1) {
        html = html.substring(0, splitPoint);
    }   



    // Inject styles at the very beginning of the email content
    return html;
};